# GeneXus Work With — for KB Editor

A KB Editor extension that enriches the editing of **GeneXus Work With** pattern instances
with dynamic dropdowns, custom node captions, and context commands.

It is **two things at once**:

1. A **real, installable extension** — install the `.vsix` next to KB Editor and your
   `WorkWith` pattern instances get a better editing experience.
2. The **worked reference example** for the *Pattern Extensibility for KB Editor*
   documentation — a faithful TypeScript port of the GeneXus *Work With* pattern's editor
   behavior, showing all three extensibility mechanisms against `@kbbridge/genexus-sdk`.

> **Learning to build your own pattern extension? Read
> [`ai/START-HERE.md`](ai/START-HERE.md)** and
> [`ai/EXAMPLES.md`](ai/EXAMPLES.md) (a walkthrough of this code).

## The three mechanisms (where they live)

| Mechanism | File | Ported from (.NET) |
|---|---|---|
| Custom Types | [`src/workwith/WorkWithCustomTypeSupport.ts`](src/workwith/WorkWithCustomTypeSupport.ts) | `Source/Custom/WorkWithCustomTypeSupport.cs` |
| Captions | [`src/workwith/WorkWithEditorHelper.ts`](src/workwith/WorkWithEditorHelper.ts) (`customShowElement`) | `Source/Editor/WorkWithEditorHelper.cs` |
| Custom Actions | [`src/workwith/WorkWithEditorHelper.ts`](src/workwith/WorkWithEditorHelper.ts) (`getCommands`) + [`commands/AddFilterVariableCommand.ts`](src/workwith/commands/AddFilterVariableCommand.ts) | `Source/Editor/CommandAddFilterVariable.cs` |

`src/extension.ts` registers them for pattern type `"WorkWith"`.

## Build & install

```bash
npm install
npm run compile
npm run bundle
npm run package     # → genexus-workwith-kb-editor-0.1.0.vsix
```

Install the `.vsix` in the VS Code / VSCodium where KB Editor is installed, reload, and open
a Work With `.gxPattern` instance. See [`ai/DEPLOY.md`](ai/DEPLOY.md) and
[`sample-kb/`](sample-kb) for local testing fixtures.

## Attribution / license

The TypeScript in this repository is original work, distributed under the **MIT** license
(see `LICENSE`). It **implements the editor behavior of the GeneXus *Work With* pattern**,
transcribed from the pattern sources that GeneXus distributes in its Platform SDK. Those C#
sources are **not** included here (they live only in a local, git-ignored `reference/`
folder). See **`NOTICE.md`**. *Work With* and *GeneXus* are trademarks of their respective
owners. If you redistribute this extension publicly, confirm the applicable terms with
GeneXus.
