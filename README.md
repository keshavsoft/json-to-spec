# json-to-spec

Pure JSON specification compiler for declarative UI generation.

This project takes a structured specification and data payload, resolves dynamic values, expands iteration, and returns a final JSON spec tree that can be rendered by downstream tools such as `json-to-dom`.

🌐 **Documentation & Directory Hub**: [https://keshavsoft.github.io/json-to-spec/](https://keshavsoft.github.io/json-to-spec/)  
🏷️ **New Documentation & Directory Hub**: [https://keshavsoft.github.io/json-to-spec/newDocumentation/](https://keshavsoft.github.io/json-to-spec/newDocumentation/)      


## What this repo does

`json-to-spec` is not a renderer. It is a compiler.

It takes two inputs:

- `specJson`: the blueprint describing the output structure
- `dataJson`: the runtime data used to fill and expand the structure

Then it transforms that into a final, concrete JSON specification ready to render.

Core behaviors include:

- resolving values from nested data
- replacing `${...}` expressions within strings and attributes
- iterating arrays and objects with template-based expansion
- producing a serializable object tree for downstream rendering

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

This starts the Vite dev server for the project demo and sample pages.

## Build

```bash
npm run build
```

## API

The package entry exports a default function named `buildSpecElement`.

```js
import buildSpecElement from "json-to-spec";

const structure = {
  tagName: "div",
  attributes: { class: "card" },
  children: [
    { tagName: "h2", textContent: "${title}" },
    {
      jsonToSpec: {
        operation: "loopArray",
        source: "items",
        template: {
          tagName: "li",
          textContent: "${name}"
        }
      }
    }
  ]
};

const data = {
  title: "Products",
  items: [
    { name: "Laptop" },
    { name: "Phone" },
    { name: "Tablet" }
  ]
};

const spec = buildSpecElement({
  specJson: structure,
  dataJson: data
});

console.log(spec);
```

### Notes

- The function is implemented in `src/v25/index.js`
- Supported loop operations are currently `loopArray` and `loopObject`
- The output is a JSON spec structure, not a DOM element by itself

## Browser usage

The project includes browser samples that render the output using `json-to-tag`.

```html
<script src="https://keshavsoft.github.io/json-to-tag/dist/v4/min.js"></script>
<script type="module">
  import buildSpecElement from "./src/index.js";

  const spec = {
    tagName: "div",
    children: [{ tagName: "span", textContent: "Hello" }]
  };

  const element = buildSpecElement({ specJson: spec, dataJson: {} });
  document.body.appendChild(window.ks.jsonToTag.buildSpecElement(element));
</script>
```

## Repository structure

```text
.
├── src/                  # Compiler source and published entry
├── samples/              # Example apps and sample data
├── docs/                 # Static documentation pages
├── test/                 # Local/legacy test pages
├── index.html            # Demo entry page
├── index.js              # Top-level module export
├── package.json          # Package metadata and scripts
├── vite.config.js        # Vite config
├── README.md             # Project documentation
└── LICENSE               # If present in the repo
```

## Current implementation notes

The package entry points to the latest compiler version:

```js
export { default } from "./src/v25/index.js";
export * from "./src/v25/index.js";
```

This means the current public API is effectively built around the logic in `src/v25`.

## Documentation

The repo includes documentation pages under `docs/`, including:

- `docs/index.html`
- `docs/pages/what.html`
- `docs/pages/why.html`
- `docs/pages/how-it-works.html`
- `docs/pages/architecture.html`

## Contributing

1. Clone the repo
2. Install dependencies with `npm install`
3. Run the demo with `npm run dev`
4. Update source files in `src/` and sample files in `samples/`
5. Validate with `npm run build`

## License

MIT

This project is maintained by KeshavSoft and published under the MIT license.
