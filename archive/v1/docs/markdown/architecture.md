# Runtime Architecture & Compiler Pipeline

`json-to-spec` implements a recursive tree compilation pipeline designed to handle arbitrary nesting depths, node operations, token interpolation, and collection filtering in a single deterministic pass.

---

## High-Level Compiler Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Normalization & Context Initialization                    │
│    - Standardizes inStructure & inData inputs               │
│    - Prepares root data dictionary & path resolution table  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Universal Recursive Traversal (compileNode)              │
│    - Arrays: Flatten and compile child nodes recursively    │
│    - Primitives: Interpolate text tokens against context    │
│    - Objects: Check for node-level operations               │
└──────────────────────────────┬──────────────────────────────┘
                               │
        ┌──────────────────────┴──────────────────────┐
        ▼                                             ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│ [Operation: "iterate"]       │        │ [Standard Element Node]      │
│ - Resolve source collection  │        │ - Clone node structure       │
│ - Apply filter rules         │        │ - Apply control conversions  │
│   (skip isVisible: false)    │        │ - Interpolate textContent    │
│ - Stamp template per item    │        │ - Interpolate attributes     │
│ - Bind $index, $number, row  │        │ - Bind data values (inputs)  │
│ - Return stamped array       │        │ - Compile child subtrees     │
└──────────────┬───────────────┘        └──────────────┬───────────────┘
               │                                       │
               └───────────────────┬───────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Spec JSON Emission                                       │
│    - Valid declarative tree ready for json-to-dom           │
└─────────────────────────────────────────────────────────────┘
```

---

## Compiler Stages Explained

### Stage 1: Entry Point Normalization
The top-level function `compile({ inStructure, inData })` enforces the `in`-`local` parameter convention:
```javascript
const localStructure = inStructure || inTree;
const localData = inData || {};
```
It initializes the root execution context and passes both the tree and root data to `compileNode`.

### Stage 2: Operation Detection & Collection Resolution
At any node in the tree, the compiler checks:
```javascript
const isIteration = localNode.operation === "iterate" || Boolean(localNode.$iterate);
```
If present:
1. It resolves `source` (e.g. `"columns"`, `"rows"`, `"summary.items"`) using `resolvePath`.
2. Evaluates filters:
   - Matches any explicit filter keys (`filter: { isVisible: true }`).
   - Automatically drops records where `isVisible === false` (e.g. hidden primary key `pk`).
3. For each surviving element in the collection:
   - Constructs a scoped item context with `$index`, `$number`, and current item data.
   - If in a nested context (e.g. table data cells), binds cell value from parent `row[column.field]`.
   - Recursively compiles the `template` using the scoped context.

### Stage 3: Control Type Transformation
If the current metadata item declares `type: "textarea"` and the template specifies an `<input>`, the compiler transforms the tag:
```javascript
if (currentItem.type === "textarea" && cloned.tagName === "input") {
    cloned.tagName = "textarea";
    delete cloned.attributes.type;
}
```

### Stage 4: Safe Token Interpolation
Any string value containing `${...}` is interpolated against:
1. Local item context (e.g. `${field}`, `${title}`, `${value}`).
2. Parent row context (e.g. `${row.Category}`).
3. Global root data context (e.g. `${summary.totalItems}`).
Expressions without a match are safely resolved to empty string `""` without crashing.

### Stage 5: Specification Output
The resulting tree is standard JSON specification ready to be rendered directly by `json-to-dom` (`buildSpecElement({ inSpec: compiledSpec })`).
