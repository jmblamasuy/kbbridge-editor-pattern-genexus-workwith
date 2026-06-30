# C# → TypeScript transcription workflow

If your pattern already has a GeneXus **.NET** implementation, the fastest, most faithful
way to build the KB Editor extension is to **transcribe** the relevant .NET classes to
TypeScript against `@kbbridge/genexus-sdk`, which deliberately mirrors the GeneXus .NET
pattern SDK.

## Setup

1. Put the pattern's .NET sources in **`reference/`** (git-ignored — never published). For
   GeneXus-shipped patterns these live under
   `…/GeneXus<version>PlatformSDK/Patterns/<Pattern>/Source` and `…/Definitions`.
2. Identify the three files that matter most:
   - the **CustomTypeSupport** (custom types),
   - the **EditorHelper** (`CustomShowElement` + `GetCommands`),
   - each **PatternEditorCommand** subclass.
   These are usually small (a few hundred lines total) even when the whole pattern is large.
3. Transcribe class-by-class. Annotate every TS class with a traceability comment:
   `// Equivalent to <C# file> lines N-M`.

## The .NET → SDK mapping

| GeneXus .NET (`Artech.Packages.Patterns.*`) | `@kbbridge/genexus-sdk` (TypeScript) |
|---|---|
| `PatternCustomTypeSupport.GetTypeEditor` | `IPatternCustomTypeSupport.getTypeEditor` |
| `PatternCustomTypeEditor.EditorKind` | `IPatternCustomTypeEditor.editorKind` |
| `PatternCustomTypeEditor.GetComboValues(element, attr, List<object>)` | `IPatternCustomTypeEditor.getValues(context): CustomTypeValue[]` |
| `PatternEditorHelper.CustomShowElement(el, ref caption, ref icon): bool` | `IPatternEditorHelper.customShowElement(el, ctx): {handled, caption, icon}` |
| `PatternEditorHelper.GetCommands(el): IEnumerable<IPatternEditorCommand>` | `IPatternEditorHelper.getCommands(el): PatternEditorCommand[]` |
| `PatternEditorCommand` (`Text`, `Query()`, `Exec()`) | `PatternEditorCommandBase` (`text`, `query()`, `exec()`) |
| `PatternInstanceElement.Type` | `PatternInstanceElement.elementType` |
| `element.Attributes.GetPropertyValue<T>("x")` | `element.attributes['x']` (string) / `getAttribute('x')` |
| `element.Children`, `.Parent` | `element.children`, `element.parent` |
| `element.SelectElements("...")`, ancestors | `findDescendants(tag)`, `findAncestor(tag)`, `getChildrenByTag(tag)` |
| `Children.AddNewElement(...)`, `Attributes[...] = v` | element mutation API (`addChild`, `setAttribute`) — only inside `exec()` |

## Translation rules

- **Enums / constants** → TS `enum` or `as const` unions with the same names/values.
- **`ref` out-params** (`CustomShowElement`) → return an object (`{handled, caption, icon}`).
- **`List<object>` accumulation** (`GetComboValues`) → build and return a
  `CustomTypeValue[]`.
- **Nullable** (`HasValue`, `?`) → `undefined`/`null` checks; never assume a property exists.
- **IDE services** (`GenexusUIServices.*`, dialogs) → VS Code APIs (`QuickPick`, `showInputBox`,
  `window.showTextDocument`). KB lookups → `KBObjectCache` from `context.cacheManager` /
  `api.getCacheManager()`.
- **Business-logic / code generation** in the .NET pattern is **out of scope** — KB Editor
  only needs the *editing* behavior (custom types, captions, commands). Skip generators,
  build processes, validators unless they inform an editor value.

## What NOT to do

- Do **not** ship the .NET sources (or anything decompiled). Only your original TypeScript
  ships; the C# stays in `reference/` (git-ignored).
- Do **not** copy code from other vendors' extensions. Transcribe from **your** pattern's
  sources (or the GeneXus-distributed pattern you have rights to).
- If transcribing a GeneXus-distributed pattern, add a `NOTICE` attributing GeneXus and
  confirm distribution terms before publishing.

See the `kbbridge-editor-pattern-genexus-workwith` project for a complete worked transcription.
