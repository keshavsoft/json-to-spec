# json-to-spec

A pure, zero-dependency JSON specification compiler for declarative UI. Transforms `structure.json` (HOW) + `data.json` (WHAT) into valid Spec JSON ready for `json-to-dom`.

[![version](https://img.shields.io/badge/version-1.0.0-6366f1.svg?style=flat-square)](package.json)
[![license](https://img.shields.io/badge/license-MIT-emerald.svg?style=flat-square)](LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![build](https://img.shields.io/badge/build-vite-blue.svg?style=flat-square)](vite.config.js)
[![CDN](https://img.shields.io/badge/CDN-GitHub%20Pages-orange.svg?style=flat-square)](https://keshavsoft.github.io/json-to-spec/dist/min.js)

---

## 📖 Start Here

- **What is json-to-spec?**: [docs/markdown/what.md](docs/markdown/what.md) &bull; [HTML](https://keshavsoft.github.io/json-to-spec/docs/pages/what.html)
- **Why this repo exists**: [docs/markdown/why.md](docs/markdown/why.md) &bull; [HTML](https://keshavsoft.github.io/json-to-spec/docs/pages/why.html)
- **What json-to-spec is NOT**: [docs/markdown/what-not.md](docs/markdown/what-not.md) &bull; [HTML](https://keshavsoft.github.io/json-to-spec/docs/pages/what-not.html)
- **Runtime Architecture**: [docs/markdown/architecture.md](docs/markdown/architecture.md) &bull; [HTML](https://keshavsoft.github.io/json-to-spec/docs/pages/architecture.html)
- **How It Works (Tutorial)**: [docs/markdown/how-it-works.md](docs/markdown/how-it-works.md) &bull; [HTML](https://keshavsoft.github.io/json-to-spec/docs/pages/how-it-works.html)
- **Directives & Operations**: [docs/markdown/directives.md](docs/markdown/directives.md)
- **API Reference**: [docs/markdown/api.md](docs/markdown/api.md)

---

## ⚡ Quick Start

```bash
# Install via npm
npm install json-to-spec

# Or clone and run locally
npm install
npm run dev    # Start Vite dev server
npm run build  # Build docs/dist/ bundles
```

### Live Demos & Online CDN

- **Documentation Hub**: https://keshavsoft.github.io/json-to-spec/docs/
- **Live Playground**: https://keshavsoft.github.io/json-to-spec/docs/demo.html
- **Form CDN Sample**: https://keshavsoft.github.io/json-to-spec/docs/samples/form.html
- **Table CDN Sample**: https://keshavsoft.github.io/json-to-spec/docs/samples/table.html
- **Online CDN Test Suite**: https://keshavsoft.github.io/json-to-spec/test/cdn/

---

## 💻 Minimal Usage

```javascript
import { compile } from "json-to-spec";
// Or via CDN:
// import { compile } from "https://keshavsoft.github.io/json-to-spec/dist/v1/min.js";
import { buildSpecElement } from "https://keshavsoft.github.io/json-to-dom/dist/v16/min.js";

// 1. structure.json (HOW: UI Blueprint)
const structure = {
  tagName: "div",
  attributes: { class: "card p-4 shadow-sm" },
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

// 2. data.json (WHAT: Data Collections & Values)
const data = {
  title: "Engineering Team",
  users: [
    { name: "Karthik", role: "Architect" },
    { name: "Praveen", role: "Engineer" }
  ]
};

// 3. Compile (structure + data) -> spec
const spec = compile({ inStructure: structure, inData: data });

// 4. Render directly via json-to-dom
const domNode = buildSpecElement({ inSpec: spec });
document.getElementById("app").appendChild(domNode);
```

---

## 🎯 Scope

`json-to-spec` is intentionally narrow. It transforms decoupled JSON inputs into standard declarative DOM specifications in sub-millisecond execution. It is **not** a DOM renderer, Virtual DOM diffing engine, CSS framework, or arbitrary JS evaluator.

For in-depth explanations, see [What json-to-spec is NOT](docs/markdown/what-not.md) and [Runtime Architecture](docs/markdown/architecture.md).

---

## 📄 License

MIT &copy; [KeshavSoft](https://github.com/keshavsoft)
