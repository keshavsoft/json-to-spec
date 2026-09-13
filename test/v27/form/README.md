# `v27/form/structure.json` — Architecture & Structure Specification

This document provides complete clarity on the anatomy, directives, and design decisions of [`structure.json`](./structure.json).

---

## 1. High-Level Anatomy (The 3-Tier Card Architecture)

The form structure follows a standard, accessible 3-tier card model:

```
Root Array: [ { tagName: "div", attributes: { class: "ksform card ..." }, children: [ ... ] } ]
│
├── 1. Header (lines 8–27)
│   └── Title ("Voucher Entry Form") + Metadata Badge
│
├── 2. Body (lines 28–70)
│   └── Bootstrap Grid Wrapper (.row.g-3)
│       └── Dynamic Iteration Directive: operation: "iterate" over data.columns
│           ├── <label>${title}</label>
│           └── <input name="${field}" type="${inputType}"> (or <textarea>)
│
└── 3. Footer (lines 71–99)
    └── Action Button Bar (.d-flex.justify-content-end.gap-2)
        ├── Button: "Reset Form" (data-action="cancel")
        └── Button: "Save Voucher" (data-action="save")
```

---

## 2. Line-by-Line Section Breakdown

### 2.1 The Root Container (Lines 1–7)
```json
[
  {
    "tagName": "div",
    "attributes": {
      "class": "ksform border rounded-3 shadow-sm bg-white overflow-hidden"
    },
    "children": [ ... ]
  }
]
```
- **`ksform`**: Semantic class identifier recognized by `json-to-dom` form listeners and extractors.
- **`overflow-hidden` + `rounded-3`**: Ensures header and footer backgrounds respect the rounded borders cleanly.

---

### 2.2 The Header (Lines 8–27)
```json
{
  "tagName": "div",
  "attributes": {
    "class": "bg-body-secondary p-3 border-bottom d-flex justify-content-between align-items-center"
  },
  "children": [
    {
      "tagName": "span",
      "textContent": "Voucher Entry Form",
      "attributes": { "class": "fw-bold fs-6 text-dark" }
    },
    {
      "tagName": "span",
      "textContent": "v2 columns iteration",
      "attributes": { "class": "badge bg-success-subtle text-success border border-success-subtle font-monospace small" }
    }
  ]
}
```
- Purely declarative visual header.
- Decoupled from data; can include `${title}` tokens if dynamic title is passed from `data.json`.

---

### 2.3 The Body & Column Iteration Directive (Lines 28–70)
```json
{
  "tagName": "div",
  "attributes": { "class": "p-4" },
  "children": [
    {
      "tagName": "div",
      "attributes": { "class": "row g-3" },
      "children": [
        {
          "operation": "iterate",
          "source": "columns",
          "filter": {
            "isVisible": true
          },
          "template": {
            "tagName": "div",
            "attributes": { "class": "col-md-6" },
            "children": [
              {
                "tagName": "label",
                "textContent": "${title}",
                "attributes": {
                  "class": "form-label fw-semibold text-secondary small"
                }
              },
              {
                "tagName": "input",
                "attributes": {
                  "name": "${field}",
                  "type": "${inputType}",
                  "placeholder": "Enter ${title}...",
                  "class": "form-control"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

#### Why this is powerful:
1. **Zero Hardcoded Fields**: Instead of writing 10 separate input blocks, **1 single block** handles all fields.
2. **`source: "columns"`**: Binds to the `columns` array in `data.json`.
3. **`filter: { "isVisible": true }`**: Automatically ignores hidden fields (e.g. `pk`, tenant ID, internal flags).
4. **Token Resolution**:
   - `${title}`: Resolves to human-friendly label (e.g. `"Voucher Number"`, `"Party Name"`).
   - `${field}`: Resolves to field key for HTML form serialization (e.g. `name="voucherNumber"`).
   - `${inputType}`: Resolves to HTML5 input type (e.g. `text`, `date`, `number`).
5. **Automatic `<textarea>` Transformation**:
   When `data.json` specifies `"type": "textarea"` for a column (like `narration`), the `compileTree` engine automatically:
   - Replaces `tagName: "input"` with `tagName: "textarea"`.
   - Strips `attributes.type`.
6. **Automatic Value Binding**:
   The engine reads `column.value` or `rootData[field]` and injects `value="..."` into `attributes`.

---

### 2.4 The Footer & Action Buttons (Lines 71–99)
```json
{
  "tagName": "div",
  "attributes": {
    "class": "bg-light p-3 border-top d-flex justify-content-end gap-2"
  },
  "children": [
    {
      "tagName": "button",
      "textContent": "Reset Form",
      "attributes": {
        "type": "button",
        "class": "btn btn-outline-secondary px-3 py-1.5",
        "data-action": "cancel",
        "data-action-type": "click"
      }
    },
    {
      "tagName": "button",
      "textContent": "Save Voucher",
      "attributes": {
        "type": "button",
        "class": "btn btn-success px-4 py-1.5 fw-semibold",
        "data-action": "save",
        "data-action-type": "click"
      }
    }
  ]
}
```

#### Why this is structured this way:
1. **Sibling of Body**: Placed as the 3rd child of the card, pinning action buttons to the bottom footer rather than scattering them inside rows.
2. **`data-action="cancel"`**:
   - Instructs `json-to-dom`'s `listeners.bindActions` that clicking this button triggers the `cancel` action handler.
   - The handler receives `{ reset }`, allowing 1-line form reset: `reset()`.
3. **`data-action="save"`**:
   - Triggers the `save` action handler.
   - `json-to-dom` automatically traverses the `.ksform` parent, extracts all named inputs/textareas, and delivers the clean `{ values }` payload to your app.

---

## 3. Data Contract Mapping (`structure.json` <--> `data.json`)

| In `structure.json` | Expected in `data.json` | Purpose |
| :--- | :--- | :--- |
| `source: "columns"` | `"columns": [ { ... } ]` | Target array collection |
| `filter: { isVisible: true }` | `"isVisible": true` | Include/exclude predicate |
| `${title}` | `"title": "Voucher Number"` | Label and placeholder text |
| `${field}` | `"field": "voucherNumber"` | Name attribute on `<input>` |
| `${inputType}` | `"inputType": "date"` | HTML5 input type |
| *(implicit)* | `"type": "textarea"` | Converts `<input>` to `<textarea>` |
| *(implicit)* | `"value": "VCH-2026-001"` | Binds initial input value |
| `data-action="save"` | *N/A (Action Listener)* | Hooks into `listeners.bindActions.save` |
| `data-action="cancel"` | *N/A (Action Listener)* | Hooks into `listeners.bindActions.cancel` |
