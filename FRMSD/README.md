# FRMSD

FRMSD — a stateless student registration / capacity management tool.

## Project Constitution

Governance for this project lives in `.specify/memory/constitution.md`. The constitution
defines the non-negotiable principles the tool must follow:

- **I. Statelessness Mandate** — the tool is purely stateless; it does not write to any
  external database or persistent store.
- **II. Data Validation Standard** — all data structures are validated with Pydantic
  before processing.
- **III. Testing Standards** — edge cases (e.g. registered students exactly equalling max
  capacity) have dedicated unit tests.
- **IV. User Experience Consistency** — identical inputs produce identical outputs across
  all user-facing surfaces.
- **V. Performance Requirements** — performance is measured and regressions block merging.

See the full constitution for the amendment procedure, versioning policy, and compliance
review expectations.

## Getting Started

This repository uses the Spec Kit workflow (`.specify/`). Configuration for the AI
assistant integration lives in `.opencode/`, and Spec Kit templates, scripts, and memory
live in `.specify/`.

## License

UNLICENSED
