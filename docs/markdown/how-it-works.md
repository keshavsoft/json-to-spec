# How It Works: Step-by-Step Guide

This guide walks through creating dynamic UI layouts with `json-to-spec` and rendering them into the browser DOM.

---

## 1. Create the UI Blueprint (`structure.json`)

Define the visual layout as a declarative JSON tree. When you need a dynamic collection, place an `"operation": "iterate"`:

```json
{
  "tagName": "div",
  "attributes": { "class": "card p-4 shadow-sm" },
  "children": [
    {
      "tagName": "h3",
      "textContent": "${title}",
      "attributes": { "class": "h5 mb-3" }
    },
    {
      "operation": "iterate",
      "source": "users",
      "template": {
        "tagName": "div",
        "attributes": { "class": "d-flex justify-content-between py-2 border-bottom" },
        "children": [
          { "tagName": "span", "textContent": "${$number}. ${name}" },
          { "tagName": "span", "textContent": "${role}", "attributes": { "class": "badge bg-secondary" } }
        ]
      }
    }
  ]
}
```

---

## 2. Supply the Data Payload (`data.json`)

Provide the collection and values:

```json
{
  "title": "Engineering Team Directory",
  "users": [
    { "name": "Karthik", "role": "Lead Architect" },
    { "name": "Praveen", "role": "Frontend Engineer" },
    { "name": "Suresh", "role": "DevOps Engineer" }
  ]
}
```

---

## 3. Compile Specification with `compile()`

```javascript
import { compile } from "https://keshavsoft.github.io/json-to-spec/dist/v1/min.js";

const spec = compile({
    inStructure: structureObject,
    inData: dataObject
});
```

The resulting `spec` expands the loop into 3 static DOM nodes with resolved tokens:
- `1. Karthik (Lead Architect)`
- `2. Praveen (Frontend Engineer)`
- `3. Suresh (DevOps Engineer)`

---

## 4. Render to DOM via `json-to-dom`

```javascript
import { buildSpecElement } from "https://keshavsoft.github.io/json-to-dom/dist/v16/min.js";

const domNode = buildSpecElement({ inSpec: spec });
document.getElementById("app").appendChild(domNode);
```

Done! You have rendered a complete dynamic list with zero framework overhead.
