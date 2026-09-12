# API Reference

All functions strictly follow the **`in`-`local` parameter convention**.

---

## `compile({ inStructure, inData })`

Primary compiler entry point. Compiles a structure tree with operations driven by data.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `inStructure` | `Object \| Array` | **Yes** | — | The JSON UI structure / blueprint (from `structure.json`). Alias: `inTree`. |
| `inData` | `Object` | No | `{}` | Business data payload containing collections and values (from `data.json`). |

### Returns

- `Object | Array`: Compiled, valid JSON specification ready for `json-to-dom`.

### Example

```javascript
import { compile } from "json-to-spec";

const spec = compile({
    inStructure: structureBlueprint,
    inData: dataPayload
});
```

---

## `compileNode({ inNode, inContext, inRootData })`

Universal recursive node traverser and transformer. Traverses any subtree depth, resolves `operation: "iterate"`, interpolates `${tokens}`, and binds cell values.

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `inNode` | `Object \| Array` | — | Current subtree node to compile. |
| `inContext` | `Object` | `{}` | Context dictionary for scoped items, `$index`, `$number`, and parent `row`. |
| `inRootData` | `Object` | `{}` | Global root data payload for absolute path resolution. |

### Returns

- `Object | Array | null`: Compiled subtree.

---

## `resolvePath({ inData, inPath })`

Safe dot-delimited path resolver for navigating nested objects and arrays without throwing undefined reference errors.

### Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `inData` | `any` | Source data object or array. |
| `inPath` | `string \| Array<string>` | Dot-delimited path (e.g. `"summary.counts.total"`, `"items.0.title"`). |

### Returns

- `any`: The resolved value, or `undefined` if not found.

### Example

```javascript
import { resolvePath } from "json-to-spec";

const total = resolvePath({
    inData: { summary: { total: 42 } },
    inPath: "summary.total"
}); // 42
```
