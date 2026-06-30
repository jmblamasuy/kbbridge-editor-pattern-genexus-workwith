# Mechanism 4 (optional) — Variables for embedded code

Some pattern properties hold **embedded GeneXus code** (`Type="code(Events)"`, conditions,
rules…). If your pattern exposes context variables in that code, you can feed them to KB
Editor's autocomplete by registering an `IPatternVariableProvider`.

This is optional; skip it if your pattern has no embedded code, or build it after the three
core mechanisms.

## Interface

```ts
interface IPatternVariableProvider {
  getVariables(
    element: PatternInstanceElement,
    context: VariableProviderContext,
  ): Promise<VariableInfo[]>;
  getSupportedPatternTypes(): string[];
}
```

`VariableProviderContext` tells you the `codeType` (`Events` | `Conditions` | `Expressions`
| `Rules`), the `filePath`, the `instanceName`, and the `propertyName`. Return the variables
visible at that `element` (see `VariableInfo` in [SDK-REFERENCE.md](SDK-REFERENCE.md) for the
exact type shape — note the type fields like `dataType`, `domain`, `attribute`, `sdt`,
`externalObject`, `businessComponent` are mutually exclusive).

## Example

```ts
class WorkWithVariableProvider implements IPatternVariableProvider {
  getSupportedPatternTypes() { return ['WorkWith']; }

  async getVariables(element: PatternInstanceElement): Promise<VariableInfo[]> {
    const level = element.findAncestor('level');
    return (level?.findDescendants('variable') ?? []).map(v => ({
      name: v.attributes['name'],
      dataType: v.attributes['dataType'],
      category: 'Local',
    }));
  }
}
```

Register with `api.registerVariableProvider('WorkWith', new WorkWithVariableProvider())`.

## Notes

- Return names **without** the leading `&`.
- Keep it fast; it runs on autocomplete.
- Provide a `category` (e.g. `Local`, `Parameter`, `Level`) to group suggestions.
