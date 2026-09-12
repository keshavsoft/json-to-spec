# Directives & Operations Guide

`json-to-spec` uses declarative JSON operations to define dynamic behavior without embedding imperative code or string templates.

---

## 1. `operation: "iterate"`

Declares a repeating branch in the JSON tree. The compiler stamps out `template` for every item in `source`.

```json
{
  "operation": "iterate",
  "source": "columns",
  "filter": {
    "isVisible": true
  },
  "template": {
    "tagName": "div",
    "attributes": { "class": "form-group mb-3" },
    "children": [
      { "tagName": "label", "textContent": "${title}" },
      { "tagName": "input", "attributes": { "name": "${field}", "value": "${value}" } }
    ]
  }
}
```

### Properties

- **`source`** (`string`, required): Name of the array collection in `data.json` (e.g. `"columns"`, `"rows"`), or dot-path (`"nested.items"`).
- **`template`** (`Object`, required): The JSON blueprint to repeat for every item.
- **`filter`** (`Object`, optional): Key-value pairs that each item must match.

---

## 2. Token Interpolation

Tokens inside `textContent` and any `attributes` property are automatically resolved:

| Token | Scope | Description | Example |
| :--- | :--- | :--- | :--- |
| `${field}` | Item Context | Field or property name | `"ItemName"` |
| `${title}` | Item Context | Column label or display title | `"Item Name"` |
| `${value}` | Cell Context | Cell value bound from current row | `150` |
| `${$index}` | Loop Context | 0-based iteration index | `0, 1, 2...` |
| `${$number}` | Loop Context | 1-based iteration counter | `1, 2, 3...` |
| `${row.field}` | Nested Context | Access parent row property | `row.Category` |
| `${summary.total}` | Root Context | Deep dot-delimited path from root | `summary.avgRate` |

---

## 3. Dynamic Filtering

- **Explicit Filter**: Restricts items matching the filter object:
  ```json
  "filter": { "isVisible": true }
  ```
- **Automatic Default**: Any collection item containing `"isVisible": false` is automatically excluded by default (e.g. hidden primary key `pk`).

---

## 4. Automatic Input Control Adaptation

If a column metadata item specifies `type: "textarea"` and the template defines an `<input>`, the compiler transforms the tag:

```json
// Input metadata: { "field": "description", "type": "textarea" }
// Template: { "tagName": "input", "attributes": { "type": "text", "name": "${field}" } }
// Emitted Spec:
{
  "tagName": "textarea",
  "attributes": { "name": "description" }
}
```
The `type` attribute is safely removed, and `tagName` is adjusted to `<textarea>`.
