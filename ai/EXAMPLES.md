# Worked example — the Work With port, file by file

This project is a faithful TypeScript port of the **editor behavior** of the GeneXus *Work
With* pattern. The whole editor surface of that pattern is exactly **three** things, so this
is also a complete reference for the three mechanisms.

> The GeneXus *Work With* .NET project is large (~22k lines), but almost all of it is code
> generation, build/delete processes, validators and the instance object model — none of
> which is editor extensibility. The editor behavior lives in just three small classes,
> ported here 1:1.

## extension.ts — registration

Obtains `patternAPI` from KB Editor and registers the providers for pattern type
`"WorkWith"`:

```ts
patternAPI.registerCustomTypeSupport('WorkWith', new WorkWithCustomTypeSupport());
patternAPI.registerEditorHelper('WorkWith', new WorkWithEditorHelper());
```

## Mechanism 1 — `workwith/WorkWithCustomTypeSupport.ts`

Ported from `Source/Custom/WorkWithCustomTypeSupport.cs`. Work With declares one custom
type, **`GridCustomRender`** (the settings property `CustomRender`). `getTypeEditor` returns
a `ComboBox` editor whose `getValues` lists the available grids.

- .NET reads `GenexusBLServices.UserControlsManager` grid controls. KB Editor has no
  user-control listing in the cache contract, so we offer `(none)` plus grids found in the
  current instance tree (`findAncestor('level')?.findDescendants('grid')`). A future host
  API could list KB grid user controls for full parity.

## Mechanism 2 — `workwith/WorkWithEditorHelper.ts` → `customShowElement`

Ported from `Source/Editor/WorkWithEditorHelper.cs` (`CustomShowElement`). For the `Modes`
node it returns a caption listing the enabled modes, e.g. `modes (Insert, Update, Display)`.

- The mode attributes (`Insert`/`Update`/`Delete`/`Display`/`Export`) are
  `enum{true;false;default}` with default `default` (see `WorkWithInstance.xml`).
- A mode is enabled when `true`, or `default`/absent. (.NET additionally consults
  `WorkWithSettings.StandardActions...DefaultMode` for the `default` case; that requires
  parsing the pattern settings and is noted as a follow-up.)

## Mechanism 3 — `getCommands` + `workwith/commands/AddFilterVariableCommand.ts`

Ported from `WorkWithEditorHelper.cs` (`GetCommands`) and `CommandAddFilterVariable.cs`. On
the `FilterAttributes` node it offers **"Add Filter Variable"**. `exec()`:

1. asks for one or more attribute/variable names (the .NET IDE attribute picker becomes a
   VS Code input box);
2. adds a `filterAttribute` child per name — by constructing a backing node and a
   `PatternInstanceElement`, then `baseElement.addChild(...)` (the SDK's node-creation +
   mutation path; KB Editor persists the resulting XML);
3. optionally adds a matching `condition` under the filter's `conditions`.

## Try it

See [`../sample-kb/README.md`](../sample-kb/README.md) for how to open a Work With instance
and exercise each mechanism, and [`DEPLOY.md`](DEPLOY.md) to build and install the `.vsix`.
