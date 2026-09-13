# v27 Repeaters Showcase

This variation demonstrates repetition-driven UI patterns beyond standard forms and tables.

## Included sections

- repeated summary cards
- repeated `ul` / `li` checklist groups
- repeated accordion sections with nested repeated entries

## Purpose

The same `jsonToSpec` architecture powers all three:

- `operation: "iterate"`
- `source`
- optional nested `iterate`
- pure DOM-shaped `template`

This keeps `structure.json` focused on UI shape while `data.json` carries the repeated business collections.
