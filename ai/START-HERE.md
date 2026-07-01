# START HERE — Building a KB Editor pattern extension

> This `ai/` folder is written to be read by an **AI coding assistant** (or a developer)
> that is going to build a pattern extension for **KB Editor**. Read this file first, then
> follow the links in order.

## What you are building

KB Editor is the GeneXus visual editor that runs inside VS Code / VSCodium (extension id
`kbbridge.genexus-visual-editor`). It opens GeneXus **pattern instances** (`.gxPattern`
files) and shows them as an editable tree + properties panel.

KB Editor exposes a **`PatternExtensionAPI`**. Your extension is a tiny VS Code extension
that, on activation, asks KB Editor for that API and **registers providers** for one
pattern type. Those providers add three things to the editing experience:

1. **Custom Types** — dynamic dropdown values for properties declared as `custom(<Id>)`.
2. **Captions** — custom label/icon for nodes in the tree.
3. **Custom Actions** — context commands attached to nodes.

If your extension is absent, KB Editor still works (graceful degradation): dropdowns become
plain text, captions fall back to the XML/tag name, and there are no extra commands.

## Reading order

1. **[ARCHITECTURE.md](ARCHITECTURE.md)** — the layers, the activation/registration
   lifecycle, and graceful degradation.
2. **[PATTERN-STRUCTURE.md](PATTERN-STRUCTURE.md)** — how a GeneXus pattern is defined
   (`.Pattern`, `*Instance.xml`, `*Settings.xml`) and how properties map to editor types,
   including where `custom(...)` types come from.
3. **[SDK-REFERENCE.md](SDK-REFERENCE.md)** — the exact [`@kbbridge/genexus-sdk`](https://github.com/jmblamasuy/kbbridge-editor-genexus-sdk) surface you
   code against (copy the signatures from here).
4. The three mechanisms, in depth:
   - **[EXTENSIBILITY-CUSTOM-TYPES.md](EXTENSIBILITY-CUSTOM-TYPES.md)**
   - **[EXTENSIBILITY-CAPTIONS.md](EXTENSIBILITY-CAPTIONS.md)**
   - **[EXTENSIBILITY-CUSTOM-ACTIONS.md](EXTENSIBILITY-CUSTOM-ACTIONS.md)**
   - **[EXTENSIBILITY-VARIABLES.md](EXTENSIBILITY-VARIABLES.md)** (optional)
5. **[CSHARP-TO-TYPESCRIPT-WORKFLOW.md](CSHARP-TO-TYPESCRIPT-WORKFLOW.md)** — if you are
   porting an existing GeneXus .NET pattern, this is the method (and the .NET→TS mapping).
6. **[DEPLOY.md](DEPLOY.md)** — build, bundle, package the `.vsix`, install, and test.
7. **[EXAMPLES.md](EXAMPLES.md)** — a walkthrough of **this** project's code (the Work With
   port), mechanism by mechanism.

## Project layout (this starter)

```
src/extension.ts        activate() → obtain PatternExtensionAPI → registerProviders()
vendor/genexus-sdk/      vendored compiled copy of @kbbridge/genexus-sdk (the API)
scripts/bundle-dependencies.js   wires the vendored SDK into node_modules + out/node_modules
reference/               (git-ignored) the .NET pattern sources you transcribe from
ai/                      this documentation set
```

## The golden rules

- **The document is the source of truth.** Providers READ the in-memory
  `PatternInstanceElement` tree and RETURN data (values, captions, commands). KB Editor owns
  mutation and persistence. The one exception is command `exec()`, which may mutate the tree
  through the element API.
- **Never block.** `getValues`, `customShowElement` and `getCommands` are called frequently
  while the user edits; keep them fast and side-effect free (commands do their work in
  `exec`).
- **Fail soft.** If you cannot compute something, return an empty list / `{handled:false}`.
  Never throw from a provider callback.
- **Match the pattern type string.** You register against the instance's pattern type
  (e.g. `"WorkWith"`). The `elementType`/`tag` strings you branch on must match the pattern
  definition (`*Instance.xml`).
- **Logs go to an OutputChannel**, never `console.log` from the extension host.

## Next step

Open [ARCHITECTURE.md](ARCHITECTURE.md).
