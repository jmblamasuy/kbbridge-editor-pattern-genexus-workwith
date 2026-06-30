# Mechanism 3 — Custom Actions (context commands)

You can attach **commands** to nodes. They appear in the node's context menu; when invoked,
your command's `exec()` runs and may mutate the instance tree (add nodes, set attributes),
open KB objects, show dialogs, etc.

## Interfaces

```ts
interface IPatternEditorHelper {
  getCommands?(element: PatternInstanceElement): PatternEditorCommand[];
}

abstract class PatternEditorCommandBase {
  constructor(onElement: PatternInstanceElement);
  abstract get id(): string;
  abstract get text(): string;       // menu label
  get icon(): string | undefined;
  get baseElement(): PatternInstanceElement;
  query(): CommandStatus;            // visibility/enablement; default Enabled
  abstract exec(): void | Promise<void>;
  toSerializable(): PatternEditorCommand | null;  // null when invisible
}
```

## How KB Editor invokes it

- When building a node, KB Editor calls `getCommands(element)` and shows the returned
  commands in that node's context menu.
- The returned `PatternEditorCommand` is **serializable** (no functions cross the
  boundary); KB Editor keeps a handle and, when the user clicks, calls back into your
  process to run `exec()`.
- `query()` controls whether a command is `Invisible`, `Disabled`, or `Enabled`. Use it to
  show a command only on the right nodes / when preconditions hold.

## Reference example (GeneXus *Work With*)

Work With adds **"Add Filter Variable"** to the `FilterAttributes` node.

**.NET** — `WorkWith/Source/Editor/WorkWithEditorHelper.cs` + `CommandAddFilterVariable.cs`:

```csharp
public override IEnumerable<IPatternEditorCommand> GetCommands(PatternInstanceElement onElement) {
  if (onElement.Type == InstanceElements.FilterAttributes)
    yield return new CommandAddFilterVariable(onElement);
}

internal class CommandAddFilterVariable : PatternEditorCommand {
  public CommandAddFilterVariable(PatternInstanceElement onElement) : base(onElement) { }
  public override string Text => Messages.CmdAddFilterVariable;
  public override void Exec(CommandData cmdData) {
    var selected = GenexusUIServices.SelectAttributeVariable.SelectAttributeVariable(/* dialog */);
    foreach (Gx.Attribute att in selected) {
      var fa = BaseElement.Children.AddNewElement(InstanceChildren.FilterAttributes.FilterAttribute);
      fa.Attributes[InstanceAttributes.FilterAttribute.Name] = att.Name;
      fa.Attributes[InstanceAttributes.FilterAttribute.Description] = att.Title;
    }
  }
}
```

**TypeScript** equivalent:

```ts
// Equivalent to WorkWith/Source/Editor/WorkWithEditorHelper.cs (GetCommands)
class WorkWithEditorHelper implements IPatternEditorHelper {
  getCommands(element: PatternInstanceElement): PatternEditorCommand[] {
    const cmds: PatternEditorCommandBase[] = [];
    if (element.elementType === 'FilterAttributes')
      cmds.push(new AddFilterVariableCommand(element));
    return cmds.map(c => c.toSerializable()).filter(Boolean) as PatternEditorCommand[];
  }
}

// Equivalent to WorkWith/Source/Editor/CommandAddFilterVariable.cs
class AddFilterVariableCommand extends PatternEditorCommandBase {
  get id() { return 'workwith.addFilterVariable'; }
  get text() { return 'Add Filter Variable...'; }

  async exec(): Promise<void> {
    const picked = await pickAttributes();          // your VS Code QuickPick / dialog
    for (const att of picked) {
      // Create a new node and attach it; KB Editor persists the mutated tree.
      const backing = { tag: 'filterAttribute',
                        attributes: { name: att.name, description: att.title }, children: [] };
      const i = this.baseElement.children.length;
      const fa = new PatternInstanceElement(backing, this.baseElement, i,
                                            [...this.baseElement.path, i]);
      this.baseElement.addChild(fa);
    }
  }
}
```

> The .NET `SelectAttributeVariable` IDE dialog becomes a VS Code `QuickPick`/input. Tree
> mutation (`AddNewElement` / `Attributes[...] = ...`) becomes the element mutation API
> (`addChild`/`setAttribute`), which KB Editor persists back to the `.gxPattern`.

## `query()` for conditional commands

```ts
query(): CommandStatus {
  const enabled = !!this.baseElement.findAncestor('level');
  return { state: enabled ? CommandState.Enabled : CommandState.Invisible };
}
```

## Notes

- `getCommands` itself must be cheap (it runs while building nodes); do the real work in
  `exec()`.
- Side-effecting UI (dialogs, file opens) belongs in `exec()`, never in `getCommands`,
  `query`, `getValues`, or `customShowElement`.
- Give each command a stable, namespaced `id` (e.g. `"<pattern>.<action>"`).
- Mutations inside `exec()` go through the element API so KB Editor records and persists
  them.

Next (optional): [EXTENSIBILITY-VARIABLES.md](EXTENSIBILITY-VARIABLES.md), then
[CSHARP-TO-TYPESCRIPT-WORKFLOW.md](CSHARP-TO-TYPESCRIPT-WORKFLOW.md).
