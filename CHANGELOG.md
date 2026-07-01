# Changelog

All notable changes to **GeneXus Work With for KB Editor** are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.1] - 2026-07-01

### Changed
- More robust activation: always `await` KB Editor's `activate()` instead of reading `.exports`
  (which can be undefined mid-activation).

### Added
- Diagnostics: logs the detected **KB Editor version** and the keys it exposes.
- When KB Editor does not expose the pattern extensibility API (typically an **outdated KB
  Editor**), shows a clear warning asking the user to update KB Editor, instead of a cryptic
  "Could not obtain patternAPI" log only.

## [0.1.0] - 2026-06-30

### Added
- Initial release. Registers providers for the GeneXus `WorkWith` pattern type in KB Editor:
  - **Custom Types** — `GridCustomRender` combo editor.
  - **Captions** — dynamic caption for the `Modes` node (`modes (Insert, Update, ...)`).
  - **Custom Actions** — "Add Filter Variable" command on the `FilterAttributes` node.
- Built against `@kbbridge/genexus-sdk` (vendored).
