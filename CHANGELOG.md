# Changelog

All notable changes to **GeneXus Work With for KB Editor** are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.1] - 2026-07-01

### Fixed
- Removed the `extensionDependencies` on `kbbridge.genexus-visual-editor`. Because KB Editor
  is not published on a marketplace, that hard dependency made the `.vsix` fail to activate
  ("depends on an unknown extension") when installed. KB Editor is now resolved **at runtime**
  (`vscode.extensions.getExtension(...)`), degrading gracefully if it is absent.

## [0.1.0] - 2026-06-30

### Added
- Initial release. Registers providers for the GeneXus `WorkWith` pattern type in KB Editor:
  - **Custom Types** — `GridCustomRender` combo editor.
  - **Captions** — dynamic caption for the `Modes` node (`modes (Insert, Update, ...)`).
  - **Custom Actions** — "Add Filter Variable" command on the `FilterAttributes` node.
- Built against `@kbbridge/genexus-sdk` (vendored).
