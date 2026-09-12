# json-to-spec

> **Pure JSON Specification Compiler for Declarative UI**  
> Takes `structure.json` (UI Blueprint & Operations) + `data.json` (Data Collections & Values) &rarr; Emits valid Spec JSON ready for `json-to-dom`.

---

## 🌟 The 2-File Contract

`json-to-spec` eliminates the need for awkward multi-file synchronization or complex instruction files. The compiler requires strictly **two inputs**:

1. **`structure.json`** (`inStructure`): **HOW** to display.
   - Declarative HTML hierarchy (`tagName`, `attributes`, `children`).
   - Declarative node-level iteration points (`"operation": "iterate"`, `"source": "<key>"`).
2. **`data.json`** (`inData`): **WHAT** to display.
   - The single source of truth for all collections (`columns`, `rows`, `options`) and business values.

---

## 📦 Installation & Usage

```javascript
import { compile } from "json-to-spec";

const spec = compile({
    inStructure: structure,
    inData: data
});
```

### Downstream DOM Rendering
Hand the resulting `spec` directly to `json-to-dom`:

```javascript
import { buildSpecElement } from "json-to-dom";

const domElement = buildSpecElement({ inSpec: spec });
document.getElementById("app").appendChild(domElement);
```

---

## 🚀 Capabilities

- **Universal Recursive Compilation**: Traverses any tree node at any depth.
- **Node-Level Operations**: Supports `operation: "iterate"` anywhere in the structure.
- **Multi-Level Iterations (Tables)**:
  - `thead`: Iterates over `columns` to generate header cells `<th>`.
  - `tbody`: Iterates over `rows`, and inside each row iterates over `columns` to generate data cells `<td>`.
  - `tfoot`: Renders summary computations and footer rows.
- **Dynamic Filtering**: Skips hidden items automatically (e.g. `isVisible: false` for `pk`).
- **Token Interpolation**: Resolves `${title}`, `${field}`, `${value}`, `${row.field}`, `${$index}`, `${$number}`.

---

## 📂 Project Structure

```
json-to-spec/
├── src/
│   ├── index.js                     # Main compile() entry point
│   └── instructionEngine/
│       ├── compileTree.js           # Universal tree compiler with node operations
│       ├── resolvePath.js           # Token & path resolver
│       └── index.js
├── samples/
│   ├── form/
│   │   ├── structure.json           # Form UI shell & row template
│   │   └── data.json                # Columns metadata + form values
│   └── table/
│       ├── structure.json           # Table UI shell & thead/tbody templates
│       └── data.json                # Columns metadata + 4 row records + summary
├── test/
│   ├── form/index.html              # Form workbench demo
│   └── table/index.html             # Table workbench demo
├── vendor/
│   └── jsonToDom/                   # Embedded DOM engine for local testing
├── index.html                       # Repository home & demo launcher
├── package.json
└── README.md
```

---

## 📄 License
MIT © KeshavSoft
