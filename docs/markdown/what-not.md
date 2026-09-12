# What json-to-spec is NOT

To maintain extreme focus, zero dependencies, and high performance, `json-to-spec` has clear non-goals and deliberate boundaries:

---

### 1. NOT a DOM Renderer
`json-to-spec` does **not** create or manipulate browser DOM elements. It does not call `document.createElement`, `classList.add`, or `addEventListener`.
- **Why**: Keeping the compiler purely in JSON space allows it to run on servers, edge workers, and inside web workers without a DOM polyfill (like JSDOM).
- **Downstream Solution**: Hand the resulting spec directly to [`json-to-dom`](https://github.com/keshavsoft/json-to-dom) (`buildSpecElement({ inSpec })`).

---

### 2. NOT a Virtual DOM Framework
`json-to-spec` is **not** a reactive framework like React, Vue, or Preact.
- There is no Virtual DOM tree reconciliation.
- There are no component lifecycles (`componentDidMount`, `useEffect`).
- There are no reactive signals or proxy stores.
- **Why**: Business applications that render data grids or vouchers don't need continuous tree diffing. When data changes, re-running `compile()` takes **< 0.5ms**.

---

### 3. NOT a CSS Framework or Design System
`json-to-spec` is style-agnostic:
- It does not inject CSS styles, opinionated themes, or reset sheets.
- You can freely use **Tailwind CSS**, **Bootstrap 5**, **Bulma**, custom BEM classes, or inline styles in your `structure.json`.

---

### 4. NOT an Arbitrary JavaScript Evaluator
`json-to-spec` does **not** evaluate arbitrary JavaScript or use `eval()` / `new Function()`.
- Operations are strictly declarative (`operation: "iterate"`).
- Variables are evaluated through safe path resolution (`${field}`, `${summary.total}`).
- This guarantees safety against code injection and enables execution in strict Content Security Policy (CSP) environments.
