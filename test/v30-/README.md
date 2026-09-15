# v28 Separate Control Folders

This suite keeps each control family in its own folder.

## Folder layout

- `input/`
- `textarea/`
- `select/`
- `multiselect/`
- `radio/`
- `checkbox/`
- `checkbox-group/`

Each folder contains its own `structure.json` and `data.json`.

The shared shell lives in:

- `test/v28/index.html`
- `test/v28/index.js`

This keeps control examples isolated while still using one common visual workbench.
