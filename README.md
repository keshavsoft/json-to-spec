# json-to-spec

<div align="center">

[![version](https://img.shields.io/badge/version-1.0.0-6366f1.svg?style=flat-square)](package.json)
[![license](https://img.shields.io/badge/license-MIT-emerald.svg?style=flat-square)](LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![build](https://img.shields.io/badge/build-vite-blue.svg?style=flat-square)](vite.config.js)
[![CDN](https://img.shields.io/badge/CDN-GitHub%20Pages-orange.svg?style=flat-square)](https://keshavsoft.github.io/json-to-spec/dist/min.js)

<br>

**Pure JSON Specification Compiler for Declarative UI**  
*Transforms `structure.json` (UI Blueprint & Operations) + `data.json` (Collections & Values) &rarr; Standard Spec JSON ready for `json-to-dom`.*

<br>

[📖 Documentation Hub](https://keshavsoft.github.io/json-to-spec/docs/) &nbsp;|&nbsp; 
[⚡ Live Playground](https://keshavsoft.github.io/json-to-spec/docs/demo.html) &nbsp;|&nbsp; 
[📝 Form CDN Sample](https://keshavsoft.github.io/json-to-spec/docs/samples/form.html) &nbsp;|&nbsp; 
[📊 Table CDN Sample](https://keshavsoft.github.io/json-to-spec/docs/samples/table.html) &nbsp;|&nbsp; 
[🌐 Online CDN Test Suite](https://keshavsoft.github.io/json-to-spec/test/cdn/)

</div>

---

## 🌟 The 2-File Philosophy

Traditional templating engines mix JavaScript bindings and markup inside components. `json-to-spec` enforces a strict, predictable **2-File Contract**:

```
[structure.json] (HOW: Blueprint & Loops)
       +
  [data.json]    (WHAT: Collections & Values)
       │
       ▼
   json-to-spec (compile)
       │
       ▼
   [spec.json]   (Standard Spec Output)
       │
       ▼
   json-to-dom   (buildSpecElement)
       │
       ▼
   ✨ Live Interactive Browser DOM
```

1. **`structure.json`** (`inStructure`): **HOW** to display.
   - Declarative HTML hierarchy (`tagName`, `attributes`, `children`).
   - Declarative node-level iteration points (`"operation": "iterate"`, `"source": "<key>"`).
2. **`data.json`** (`inData`): **WHAT** to display.
   - The single source of truth for collections (`columns`, `rows`, `options`), metadata, and business values.

---

## 📦 Installation & NPM Usage

### 1. Via NPM

```bash
npm install json-to-spec
```

Exposed via `main: index.js` and `module: ./src/v1/index.js`:

```javascript
import { compile } from "json-to-spec";

const spec = compile({
    inStructure: structure,
    inData: data
});
```

### 2. Zero-Install Online CDN (ES Modules)

Use directly in any modern browser without any bundlers or npm installations:

```javascript
// 1. Import compiler via GitHub Pages CDN
import { compile } from "https://keshavsoft.github.io/json-to-spec/dist/v1/min.js";
// (or latest version: https://keshavsoft.github.io/json-to-spec/dist/min.js)

// 2. Import DOM renderer via CDN
import { buildSpecElement } from "https://keshavsoft.github.io/json-to-dom/dist/v16/min.js";

// 3. Compile & render
const spec = compile({ inStructure: structure, inData: data });
const domNode = buildSpecElement({ inSpec: spec });
document.getElementById("app").appendChild(domNode);
```

---

## 🛠️ Build System (Vite)

Following the `json-to-dom` architecture, `json-to-spec` uses **Vite** to compile the library into minified ES distribution bundles served directly by GitHub Pages as a CDN:

```bash
# Start Vite development server
npm run dev

# Compile latest src/vN into docs/dist/vN/min.js & docs/dist/min.js
npm run build
```

The build output is structured as:
- `docs/dist/v1/min.js` — Versioned bundle for immutable references
- `docs/dist/min.js` — Automatically copied latest bundle

---

## 🧪 Online CDN Testing Suite

For testing online with CDN only (no local server or `file://` CORS issues), open any of the standalone test pages:

| Workbench | Description | CDN Link |
| :--- | :--- | :--- |
| **CDN Testing Hub** | Dashboard for all online CDN tests | [Launch Hub](https://keshavsoft.github.io/json-to-spec/test/cdn/index.html) |
| **Form CDN Test** | Column loop, value binding, hidden fields | [Run Form Test](https://keshavsoft.github.io/json-to-spec/test/cdn/form.html) |
| **Table CDN Test** | thead/tbody nested iterations & summary | [Run Table Test](https://keshavsoft.github.io/json-to-spec/test/cdn/table.html) |
| **Interactive Docs** | Live documentation portal & playground | [Open Docs](https://keshavsoft.github.io/json-to-spec/docs/) |
| **Live Playground** | Edit JSON live and see browser DOM | [Open Playground](https://keshavsoft.github.io/json-to-spec/docs/demo.html) |

---

## 🚀 Core Directives & Syntax

### `operation: "iterate"`
Repeats the inner `template` for every item in `source`:

```json
{
  "operation": "iterate",
  "source": "columns",
  "filter": {
    "isVisible": true
  },
  "template": {
    "tagName": "div",
    "attributes": { "class": "mb-3" },
    "children": [
      { "tagName": "label", "textContent": "${title}" },
      { "tagName": "input", "attributes": { "name": "${field}", "value": "${value}" } }
    ]
  }
}
```

### Token Replacement
Tokens in `textContent` and `attributes` are automatically resolved:
- `${field}`: Field name from current column/item
- `${title}`: Title or label
- `${value}`: Bound field value
- `${$number}`: 1-based index (1, 2, 3...)
- `${$index}`: 0-based index (0, 1, 2...)
- `${summary.total}`: Nested dot path from root data

### Automatic Filtering & Controls
- **Filtering**: Items with `isVisible: false` are excluded by default (e.g. primary key `pk`).
- **Textarea Conversion**: If column metadata specifies `type: "textarea"`, `<input>` elements in the template are automatically converted into `<textarea>` with type attribute cleanup.

---

## 📖 API Reference

All functions strictly follow the **`in`-`local` parameter convention**:

### `compile({ inStructure, inData })`
Primary compiler entry point.

- **`inStructure`** (`Object | Array`, required): The UI blueprint from `structure.json`.
- **`inData`** (`Object`, optional): The data collections and values from `data.json`.
- **Returns**: Valid Spec JSON for `json-to-dom`.

```javascript
import { compile } from "json-to-spec";

const spec = compile({
    inStructure: structureObject,
    inData: dataObject
});
```

---

## 📂 Repository Structure

```
json-to-spec/
├── docs/                             # GitHub Pages Documentation & CDN host
│   ├── dist/                         # Vite build output (CDN)
│   │   ├── min.js                    # Latest bundled ES module
│   │   └── v1/min.js                 # v1 bundled ES module
│   ├── demo.html                     # Live interactive browser playground
│   ├── index.html                    # Documentation homepage
│   └── samples/                      # Standalone CDN sample pages
│       ├── index.html                # Samples hub
│       ├── form.html                 # Form CDN sample
│       └── table.html                # Table CDN sample
├── samples/
│   ├── form/                         # Sample form structure & data JSON
│   └── table/                        # Sample table structure & data JSON
├── src/
│   ├── index.js                      # Root export
│   └── v1/                           # Version 1 engine
│       ├── index.js                  # Engine entry point
│       └── instructionEngine/
│           ├── compileTree.js        # Universal recursive compiler
│           └── resolvePath.js        # Safe token & path resolver
├── test/
│   ├── index.html                    # Local test dashboard
│   ├── cdn/                          # Standalone online CDN test pages
│   │   ├── index.html                # CDN test hub
│   │   ├── form.html                 # CDN Form test
│   │   └── table.html                # CDN Table test
│   ├── form/                         # Local Form workbench
│   └── table/                        # Local Table workbench
├── index.html                        # Repository home & demo launcher
├── index.js                          # Root module entry point for npm
├── package.json                      # npm package configuration
├── vite.config.js                    # Vite library build configuration
└── README.md
```

---

## 🤝 Downstream Integration: `json-to-dom`

`json-to-spec` outputs pure spec JSON. Render this spec directly with [`json-to-dom`](https://github.com/KeshavSoft/json-to-dom):

```javascript
import { compile } from "https://keshavsoft.github.io/json-to-spec/dist/v1/min.js";
import { buildSpecElement } from "https://keshavsoft.github.io/json-to-dom/dist/v16/min.js";

const spec = compile({ inStructure, inData });
const domNode = buildSpecElement({ inSpec: spec });
document.getElementById("app").appendChild(domNode);
```

---

## 📄 License

MIT &copy; [KeshavSoft](https://github.com/KeshavSoft)
