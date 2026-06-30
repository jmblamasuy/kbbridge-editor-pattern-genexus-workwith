# Mechanism 2 — Captions (custom node labels & icons)

By default KB Editor labels a tree node using the pattern definition's caption template (or
the formatted tag name). You can override that per node — to show a computed summary,
disambiguate similar nodes, or pick an icon.

## Interface

```ts
interface IPatternEditorHelper {
  customShowElement?(
    element: PatternInstanceElement,
    context: EditorHelperContext,
  ): CustomShowElementResult;
  // ... getCommands (mechanism 3), see EXTENSIBILITY-CUSTOM-ACTIONS.md
}

interface CustomShowElementResult {
  handled: boolean;   // false → use the default caption
  caption?: string;
  icon?: string;      // codicon name or relative path
  tooltip?: string;
}
```

## How KB Editor invokes it

While building each node of the tree/outline, KB Editor calls `customShowElement(element,
context)`. If you return `{ handled: true, caption, icon? }`, that caption/icon is used;
return `{ handled: false }` for every node you do **not** customize so the default applies.

Branch on `element.elementType` (the schema ElementType) — not on display text. Read values
from `element.attributes`. Use `formatCaption(template, params, attributes)` from the SDK if
you want the `{0}`/`{1}` placeholder behavior.

## Reference example (GeneXus *Work With*)

Work With customizes the `Modes` node to show which modes are enabled.

**.NET** — `WorkWith/Source/Editor/WorkWithEditorHelper.cs`:

```csharp
internal class WorkWithEditorHelper : PatternEditorHelper {
  private static readonly string[] ALL_MODES =
    { Modes.Insert, Modes.Update, Modes.Delete, Modes.Display, Modes.Export };

  public override bool CustomShowElement(PatternInstanceElement element,
                                         ref string caption, ref Icon icon) {
    if (element.Type == InstanceElements.Modes) {
      var modes = new List<string>();
      foreach (string mode in ALL_MODES)
        if (IsEnabled(element, mode)) modes.Add(mode);
      caption = String.Format("modes ({0})", String.Join(", ", modes));
      return true;
    }
    return base.CustomShowElement(element, ref caption, ref icon);
  }
}
```

**TypeScript** equivalent:

```ts
// Equivalent to WorkWith/Source/Editor/WorkWithEditorHelper.cs (CustomShowElement)
const ALL_MODES = ['Insert', 'Update', 'Delete', 'Display', 'Export'] as const;

class WorkWithEditorHelper implements IPatternEditorHelper {
  customShowElement(element: PatternInstanceElement): CustomShowElementResult {
    if (element.elementType === 'Modes') {
      const enabled = ALL_MODES.filter(m => this.isEnabled(element, m));
      return { handled: true, caption: `modes (${enabled.join(', ')})` };
    }
    return { handled: false };
  }

  private isEnabled(element: PatternInstanceElement, mode: string): boolean {
    const v = element.attributes[mode];
    return v === 'True' || v === 'true' || v === 'Default';
  }
}
```

> The .NET signature mutates `ref caption`/`ref icon` and returns a `bool`. The TS shape
> returns `{ handled, caption, icon }` instead — same semantics: `handled` ⇔ the `bool`,
> `caption`/`icon` ⇔ the `ref` outputs.

## Notes

- Keep `customShowElement` **synchronous and cheap** — it runs for every visible node.
- Return `{ handled: false }` (not `undefined`) for nodes you don't customize.
- `EditorHelperContext.settingsPath` lets you resolve `<default>` values from the pattern
  settings when the caption depends on them.
- Icons are codicon names (e.g. `'list-tree'`, `'symbol-field'`) or a path relative to your
  extension.

Next: [EXTENSIBILITY-CUSTOM-ACTIONS.md](EXTENSIBILITY-CUSTOM-ACTIONS.md).
