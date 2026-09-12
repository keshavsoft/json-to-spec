# What is json-to-spec?

`json-to-spec` is a **pure, deterministic JSON specification compiler** designed for declarative user interfaces.

It transforms two simple, decoupled JSON inputs into one standard specification JSON:

```
[structure.json] (HOW: Blueprint & Operations)
       +
  [data.json]    (WHAT: Collections & Values)
       │
       ▼
   json-to-spec
       │
       ▼
   [spec.json]   (Standard Spec ready for json-to-dom)
```

---

## The 2-File Contract

`json-to-spec` operates strictly on a **2-File Input Contract**:

1. **`structure.json`** (`inStructure`): **HOW** to display.
   - Declarative HTML hierarchy (`tagName`, `attributes`, `children`).
   - Declarative node-level iteration points (`"operation": "iterate"`, `"source": "<key>"`).
   - Presentation layout, styling classes, and structural shells.

2. **`data.json`** (`inData`): **WHAT** to display.
   - Single source of truth for collections (`columns`, `rows`, `options`).
   - Field metadata (titles, column types, visibility flags).
   - Concrete business values and calculated summary totals.

---

## Core Characteristics

- **Zero External Dependencies**: Pure native JavaScript. No runtime libraries, no polyfills.
- **Environment Agnostic**: Runs in modern browsers, Node.js, Web Workers, Cloudflare Workers, and serverless edge functions.
- **Pure Function**: Given the same `structure.json` and `data.json`, `compile()` will always output the exact same `spec.json`.
- **Zero DOM Dependency**: Does not call browser APIs or `document.createElement`. Output is pure serializable JSON.
- **Blazing Performance**: Compiles typical form and table specs in **0.1ms to 0.4ms**.
