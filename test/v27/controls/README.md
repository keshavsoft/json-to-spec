# v27 Controls Showcase

This fixture extends `test/v27` with a dedicated control-heavy variation.

## Included control families

- text, date, email, and number inputs
- single select
- multi-select
- radio group
- checkbox group
- single checkbox / switch
- textarea

## Data contract

- `columns[].control` chooses which template block renders the field.
- `columns[].options[]` powers select, multi-select, radio, and checkbox-group controls.
- `checked` and `selected` remain in `data.json`, so default control state stays data-driven instead of being hardcoded in `structure.json`.
