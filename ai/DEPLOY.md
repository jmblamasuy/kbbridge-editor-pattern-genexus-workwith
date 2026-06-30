# Build, package & test

## Prerequisites

- Node.js 18+ and npm.
- **KB Editor** (`kbbridge.genexus-visual-editor`) installed in the VS Code / VSCodium where
  you will test.

## One-time

```bash
npm install        # installs typescript, @types/vscode, @vscode/vsce and links vendor/genexus-sdk
```

## Build

```bash
npm run compile    # tsc → out/extension.js
npm run bundle     # copies vendor/genexus-sdk → node_modules + out/node_modules
```

`npm run bundle` matters: the SDK must be present under **`out/node_modules/@kbbridge/genexus-sdk`**
so the packaged extension runs standalone.

## Package the VSIX

```bash
npm run package    # @vscode/vsce → <name>-<version>.vsix
```

`.vscodeignore` keeps `src/`, `vendor/`, `reference/`, `ai/`, and dev `node_modules` out of
the package, while shipping `out/` (including `out/node_modules`).

## Install & test

1. In VS Code / VSCodium: **Extensions ▸ … ▸ Install from VSIX…** and pick the `.vsix`
   (or `code --install-extension <file>.vsix`).
2. **Reload Window** (`Developer: Reload Window`).
3. Open a `.gxPattern` instance of your pattern type in KB Editor.
4. Verify each mechanism you implemented:
   - **Custom type** → the property shows a populated dropdown (not plain text).
   - **Caption** → your custom node label appears in the tree.
   - **Custom action** → right-click the target node; your command appears and runs.
5. Watch your extension's **OutputChannel** for logs.

## Updating the vendored SDK

When a new SDK version is released, copy its compiled `out/` contents into
`vendor/genexus-sdk/`, then `npm run bundle && npm run compile && npm run package` again.

## Troubleshooting

- *"Cannot find module '@kbbridge/genexus-sdk'" at runtime* → you didn't run `npm run bundle`
  (no `out/node_modules`).
- *Providers never called* → check the **pattern type string** you registered matches the
  instance's type, and that KB Editor is installed/active.
- *Changes not reflected* → repackage, reinstall the VSIX, and Reload Window.
