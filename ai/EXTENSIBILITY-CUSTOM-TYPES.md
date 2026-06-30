# Mechanism 1 — Custom Types (dynamic dropdowns)

A pattern's `*Instance.xml` can declare a property whose type is `custom(<Id>)`. The set of
valid values for such a property is **not** known statically — it depends on the instance
(the transaction, the available grids, the variables already declared, …). KB Editor asks
**your** code for those values.

## Interfaces

You implement `IPatternCustomTypeSupport`; it returns an `IPatternCustomTypeEditor` per
custom type id. See [SDK-REFERENCE.md](SDK-REFERENCE.md) for the exact signatures.

```ts
interface IPatternCustomTypeSupport {
  getTypeEditor(typeId: string): IPatternCustomTypeEditor | null;
}
interface IPatternCustomTypeEditor {
  editorKind: 'ComboBox' | 'TextBox' | 'Custom';
  getValues(context: CustomTypeContext): Promise<CustomTypeValue[]>;
  getDependencies?(): string[];
}
```

## How KB Editor invokes it

1. The properties panel finds a property declared `custom(<Id>)` in the pattern schema.
2. It looks up your `IPatternCustomTypeSupport` for the instance's pattern type and calls
   `getTypeEditor(Id)`.
3. If you return an editor, it calls `editor.getValues(context)` and renders a dropdown.
4. If you return `null`, the property degrades to a plain text box.

`context` (`CustomTypeContext`) gives you `element` (the node owning the property),
`propertyName`, `currentValue`, `patternType`, `instanceName`, `filePath`, and optionally
`cacheManager`.

## Reference example (GeneXus *Work With*)

The Work With pattern defines a single custom type, `GridCustomRender`, whose values are the
grid user controls available in the KB.

**.NET** — `WorkWith/Source/Custom/WorkWithCustomTypeSupport.cs`:

```csharp
internal class WorkWithCustomTypeSupport : PatternCustomTypeSupport {
  public override IPatternCustomTypeEditor GetTypeEditor(string typeId) {
    if (typeId == WorkWithCustomType.GridCustomRender)
      return new GridCustomRenderTypeEditor();
    throw new PatternDefinitionException(Messages.FormatUnknownCustomType(typeId));
  }
}

internal class GridCustomRenderTypeEditor : PatternCustomTypeEditor {
  public override CustomTypeEditorKind EditorKind => CustomTypeEditorKind.ComboBox;
  public override void GetComboValues(PatternInstanceElement element,
                                      SpecificationAttribute attribute, List<object> values) {
    values.Add(String.Empty);
    foreach (ControlDefinition control in
             GenexusBLServices.UserControlsManager.GetControlDefinitionCollection(element.InstancePart.Model))
      if (control.ControlType == ControlDefinition.CONTROL_TYPE_GRID)
        values.Add(control.Name);
    values.Sort();
  }
}
```

**TypeScript** equivalent (what ships in `kbbridge-editor-pattern-genexus-workwith`):

```ts
// Equivalent to WorkWith/Source/Custom/WorkWithCustomTypeSupport.cs
class WorkWithCustomTypeSupport implements IPatternCustomTypeSupport {
  private editors = new Map<string, IPatternCustomTypeEditor>([
    ['GridCustomRender', new GridCustomRenderEditor()],
  ]);
  getTypeEditor(typeId: string): IPatternCustomTypeEditor | null {
    return this.editors.get(typeId) ?? null;
  }
}

class GridCustomRenderEditor implements IPatternCustomTypeEditor {
  editorKind = 'ComboBox' as const;
  async getValues(context: CustomTypeContext): Promise<CustomTypeValue[]> {
    const cache = context.cacheManager as KBObjectCache | undefined;
    const values: CustomTypeValue[] = [{ value: '', displayName: '(none)' }];
    // List grid user controls from the KB (host-provided lookup), or fall back to grids
    // declared in the current instance tree:
    for (const grid of context.element.findAncestor('level')?.findDescendants('grid') ?? [])
      if (grid.attributes['name']) values.push({ value: grid.attributes['name'] });
    values.sort((a, b) => a.value.localeCompare(b.value));
    return values;
  }
}
```

> The .NET version reads the KB's user-control collection. In KB Editor you get KB data via
> `context.cacheManager` (`KBObjectCache`) when available; otherwise derive values from the
> in-memory tree (`findAncestor`/`findDescendants`). Always guard for missing data and
> return at least the empty/`(none)` option.

## `getDependencies()` and re-evaluation

If a custom type's values depend on **another property** of the same node, declare it:

```ts
getDependencies(): string[] { return ['name']; }  // re-run getValues when "name" changes
```

When the user edits a dependency, KB Editor re-invokes `getValues`. Without this, the
dropdown is computed once and may show stale options.

## Checklist

- [ ] `getTypeEditor` returns an editor for **every** `custom(<Id>)` your `*Instance.xml`
      uses; return `null` (not throw) for unknown ids.
- [ ] `getValues` is pure and fast; it only reads context; it never mutates the tree.
- [ ] Include the current value among the options when appropriate, plus an empty/`(none)`
      entry if the property is optional.
- [ ] Declare `getDependencies()` when values depend on sibling properties.

Next: [EXTENSIBILITY-CAPTIONS.md](EXTENSIBILITY-CAPTIONS.md).
