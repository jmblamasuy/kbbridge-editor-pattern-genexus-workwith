# Architecture

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Your extension (this project)                               │
│  - activate(): obtain PatternExtensionAPI                   │
│  - register CustomTypeSupport / EditorHelper / VariableProvider │
└───────────────┬─────────────────────────────────────────────┘
                │ codes against
                ▼
┌─────────────────────────────────────────────────────────────┐
│ @kbbridge/genexus-sdk  (vendored, MIT, no runtime deps)     │
│  - PatternExtensionAPI, IPattern* interfaces                │
│  - PatternInstanceElement (tree), KB model types            │
└───────────────┬─────────────────────────────────────────────┘
                │ implemented by
                ▼
┌─────────────────────────────────────────────────────────────┐
│ KB Editor  (kbbridge.genexus-visual-editor)                 │
│  - parses .gxPattern + the pattern's *Instance.xml schema   │
│  - renders the tree + properties panel                      │
│  - calls your providers; owns mutation & persistence        │
└─────────────────────────────────────────────────────────────┘
```

Your extension never depends on KB Editor's internals — only on the SDK contract. KB Editor
hands you the API object at runtime.

## Activation & registration lifecycle

1. VS Code activates your extension (`onStartupFinished`). Your `package.json` declares
   `"extensionDependencies": ["kbbridge.genexus-visual-editor"]`, which *should* make KB Editor
   activate first — but on some setups that ordering is not honored, so don't rely on it
   (see step 2).
2. You obtain the host API, tolerating activation ordering. `kbEditor.activate()` resolves with
   KB Editor's exports, but if KB Editor reports active while its activation is still in flight
   the exports can momentarily be undefined — so retry until `patternAPI` surfaces instead of
   giving up (and warning the user) on the first attempt:
   ```ts
   async function acquirePatternAPI(kbEditor) {
     const deadline = Date.now() + 15000;
     for (;;) {
       const api = await kbEditor.activate().catch(() => undefined);
       const resolved = api ?? kbEditor.exports;
       if (resolved?.patternAPI) return resolved.patternAPI;
       if (Date.now() >= deadline) return undefined;
       await new Promise((r) => setTimeout(r, 300));
     }
   }
   const kbEditor = vscode.extensions.getExtension('kbbridge.genexus-visual-editor');
   const patternAPI = await acquirePatternAPI(kbEditor);   // PatternExtensionAPI | undefined
   ```
3. You register providers for your pattern type:
   ```ts
   patternAPI.registerCustomTypeSupport('WorkWith', customTypeSupport);
   patternAPI.registerEditorHelper('WorkWith', editorHelper);
   patternAPI.registerVariableProvider('WorkWith', variableProvider); // optional
   ```
4. You push an entry to `context.subscriptions` that calls the matching `unregister*` on
   dispose.

A single extension can register **several** pattern types (call the register methods once
per type). The host keeps a registry keyed by pattern type.

## How KB Editor calls you

- When it needs the values for a `custom(<Id>)` property, it looks up your
  `IPatternCustomTypeSupport`, calls `getTypeEditor(Id)`, then `getValues(context)`.
- When it builds a node in the tree, it calls your `IPatternEditorHelper.customShowElement`
  to get a caption/icon, and `getCommands` to get context commands.
- When the user runs a context command, it invokes the command's `exec()` (the SDK keeps a
  serializable handle; the actual function stays in your process).

`CustomTypeContext` / `EditorHelperContext` carry everything you need: the current
`PatternInstanceElement`, the property name and current value, the pattern type, the
instance name, the file path, and (optionally) a cache manager for cross-instance lookups.

## Graceful degradation

| Missing provider | KB Editor behavior |
|---|---|
| No `CustomTypeSupport` (or `getTypeEditor` returns `null`) | property shown as plain editable text |
| No `EditorHelper.customShowElement` (or `handled:false`) | caption falls back to the XML caption / formatted tag |
| No `getCommands` | no extra context commands |
| No `VariableProvider` | no pattern-provided variables in code autocomplete |

This is why your callbacks must **fail soft** (return empty / `{handled:false}`) instead of
throwing.

## Optional: one package or two?

For a single pattern, **one package is enough** (this starter). If your company ships
**many** patterns and wants to share code (common custom-type editors, caption helpers),
you can split into a shared **helper library** + a **patterns extension** that depends on it
— the same architecture KB Editor's own ecosystem uses. This is an optimization, not a
requirement; start with one package and split later if it pays off.

Next: [PATTERN-STRUCTURE.md](PATTERN-STRUCTURE.md).
