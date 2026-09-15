# json-to-spec

A story about taking two JSON inputs and turning them into a final, concrete UI spec.

At the center of this project is a simple idea:

- `structure` is the blueprint: the shape, layout, rules, and instructions
- `data` is the truth: fields, rows, values, arrays, and metadata
- `compile` is the story engine: it resolves the values, replaces placeholders, and expands iterations

The final output is a clean, serializable JSON spec, ready for rendering by `json-to-dom` or any similar consumer.

---

## The story in one line

`json-to-spec` is a compiler for declarative UI: it reads a blueprint and a data payload, resolves what belongs where, injects values, expands loops, and emits a final specification tree.

---

## The three core operations

This repo is best understood as a pipeline with three essential stages:

1. `resolve` — find the value from the active context or root data
2. `replace` — replace `${...}` tokens inside strings, attributes, and text content
3. `iterate` — expand collection-driven operations into concrete child nodes

That is the heart of the architecture. Everything else is supporting structure around this idea.

---

## Why this design matters

Most UI systems treat layout and data as separate problems, but they still get tangled in components, templates, and imperative logic.

`json-to-spec` keeps them decoupled:

- the structure describes how a screen should look
- the data tells what should appear
- the compiler merges them deterministically

This makes the flow predictable, testable, and easy to reason about.

---

## 📖 Start Here

- **What is json-to-spec?**: [docs/pages/what.html](docs/pages/what.html)
- **Why this project exists**: [docs/pages/why.html](docs/pages/why.html)
- **How the compiler works**: [docs/pages/how-it-works.html](docs/pages/how-it-works.html)
- **Runtime architecture**: [docs/pages/architecture.html](docs/pages/architecture.html)
- **Documentation hub**: [docs/index.html](docs/index.html)

---

## ⚡ Quick Start

```bash
npm install
npm run dev
```

---

## 💻 Minimal Example

```javascript
import { compile } from "json-to-spec";

const structure = {
  tagName: "div",
  attributes: { class: "card" },
  children: [
    { tagName: "h3", textContent: "${title}" },
    {
      operation: "iterate",
      source: "users",
      template: {
        tagName: "div",
        textContent: "${$number}. ${name} (${role})"
      }
    }
  ]
};

const data = {
  title: "Engineering Team",
  users: [
    { name: "Karthik", role: "Architect" },
    { name: "Praveen", role: "Engineer" }
  ]
};

const spec = compile({ inStructure: structure, inData: data });
console.log(spec);
```

The compile flow is:

- resolve the values inside `${...}`
- replace tokens in the structure
- iterate over `users` and expand the template
- return the final spec JSON

---

## 🎯 Scope

This project is intentionally focused. It is a compiler, not a renderer, framework, or business-logic engine.

It does one job well: it translates declarative structure + data into a final spec tree.

---

## 📄 License

MIT &copy; [KeshavSoft](https://github.com/keshavsoft)
