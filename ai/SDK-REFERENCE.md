# SDK reference — `@kbbridge/genexus-sdk`

Exact public surface you code against. The authoritative copy is `vendor/genexus-sdk/index.d.ts`;
the signatures below are reproduced for convenience. The SDK **simulates the GeneXus .NET
pattern SDK** (`Artech.Packages.Patterns.*`), so .NET names map almost 1:1 (see
[CSHARP-TO-TYPESCRIPT-WORKFLOW.md](CSHARP-TO-TYPESCRIPT-WORKFLOW.md)).

```ts
import {
  PatternExtensionAPI,
  IPatternCustomTypeSupport, IPatternCustomTypeEditor, CustomTypeContext, CustomTypeValue,
  IPatternEditorHelper, CustomShowElementResult, EditorHelperContext,
  PatternEditorCommand, PatternEditorCommandBase, IPatternEditorCommand,
  CommandState, CommandStatus, CommandExecutionContext,
  IPatternVariableProvider, VariableProviderContext, VariableInfo,
  PatternInstanceElement, PatternInstance, formatCaption,
  KBObjectCache, KBObjectInfo,
} from '@kbbridge/genexus-sdk';
```

## Entry point: `PatternExtensionAPI`

```ts
interface PatternExtensionAPI {
  registerCustomTypeSupport(patternType: string, support: IPatternCustomTypeSupport): void;
  registerEditorHelper(patternType: string, helper: IPatternEditorHelper): void;
  registerVariableProvider(patternType: string, provider: IPatternVariableProvider): void;

  unregisterCustomTypeSupport(patternType: string): void;
  unregisterEditorHelper(patternType: string): void;
  unregisterVariableProvider(patternType: string): void;

  /** Optional: KB object index for cross-instance / KB lookups. */
  getCacheManager?(): KBObjectCache | undefined;
}
```

## Mechanism 1 — Custom Types

```ts
interface IPatternCustomTypeSupport {
  /** Return the editor for a custom type id, or null if unsupported. */
  getTypeEditor(typeId: string): IPatternCustomTypeEditor | null;
}

interface IPatternCustomTypeEditor {
  editorKind: 'ComboBox' | 'TextBox' | 'Custom';
  /** The values to offer for this property, computed from the element context. */
  getValues(context: CustomTypeContext): Promise<CustomTypeValue[]>;
  /** Optional inline validation. Return true, or an error message string. */
  validate?(value: string, context: CustomTypeContext): Promise<boolean | string>;
  /** Optional: property names this type depends on; changing them re-evaluates getValues(). */
  getDependencies?(): string[];
}

interface CustomTypeContext {
  patternType: string;
  element: PatternInstanceElement;   // the node owning the property
  propertyName: string;
  currentValue: string;
  filePath: string;                  // the .gxPattern path
  instanceName: string;
  cacheManager?: unknown;            // cast to KBObjectCache when present
}

interface CustomTypeValue {
  value: string;          // value written to the XML
  displayName?: string;   // label shown (defaults to value)
  description?: string;
  icon?: string;          // codicon name
  disabled?: boolean;
  group?: string;         // groups values in the dropdown
}

interface ResolvedCustomType {  // host-side result of resolving a custom type
  available: boolean;
  values?: CustomTypeValue[];
  currentValue: string;
  message?: string;
  customTypeId: string;
}
```

## Mechanism 2 & 3 — Editor Helper (captions + commands)

```ts
interface IPatternEditorHelper {
  /** Mechanism 2 — custom caption/icon for a node. */
  customShowElement?(
    element: PatternInstanceElement,
    context: EditorHelperContext,
  ): CustomShowElementResult;

  /** Mechanism 3 — context commands for a node. */
  getCommands?(element: PatternInstanceElement): PatternEditorCommand[];

  /** Optional helpers. */
  initializeElement?(element: PatternInstanceElement, sourceObject?: any): void;
  canDeleteElement?(element: PatternInstanceElement): boolean | string;
  canAddChild?(parent: PatternInstanceElement, childType: string): boolean | string;
  /** The registry calls this after registration so you can reach getCacheManager(). */
  setPatternAPI?(api: PatternExtensionAPI): void;
}

interface CustomShowElementResult {
  handled: boolean;       // false → host uses the default caption
  caption?: string;
  icon?: string;          // codicon name or relative path
  tooltip?: string;
}

interface EditorHelperContext {
  patternType: string;
  instanceName: string;
  filePath: string;
  settingsPath?: string;  // pattern settings folder, to resolve <default> values
}

/** Serialized command sent to the host (the function stays in your process). */
interface PatternEditorCommand {
  id: string;
  label: string;
  description?: string;
  icon?: string;          // codicon
  group?: string;
  order?: number;
  execute: () => void | Promise<void>;
}
```

### Command base class

Prefer extending `PatternEditorCommandBase` (mirrors the .NET `PatternEditorCommand`):

```ts
enum CommandState { Invisible = 'Invisible', Disabled = 'Disabled', Enabled = 'Enabled' }
interface CommandStatus { state: CommandState; }

abstract class PatternEditorCommandBase implements IPatternEditorCommand {
  constructor(onElement: PatternInstanceElement);
  abstract get id(): string;
  abstract get text(): string;
  get icon(): string | undefined;            // override if needed
  get baseElement(): PatternInstanceElement;  // the node the command acts on
  query(): CommandStatus;                      // default: Enabled
  abstract exec(): void | Promise<void>;
  isVisible(): boolean;
  isEnabled(): boolean;
  toSerializable(): PatternEditorCommand | null;  // null if invisible
}
```

`getCommands` returns `PatternEditorCommand[]`. The usual pattern is to build command
objects and return `cmds.map(c => c.toSerializable()).filter(Boolean)`.

## Mechanism 4 (optional) — Variables

```ts
interface IPatternVariableProvider {
  getVariables(
    element: PatternInstanceElement,
    context: VariableProviderContext,
  ): Promise<VariableInfo[]>;
  getSupportedPatternTypes(): string[];
}

interface VariableProviderContext {
  patternType: string; filePath: string; instanceName: string;
  propertyName?: string; codeType?: string;  // Events | Conditions | Expressions | Rules
}

interface VariableInfo {
  name: string;                 // without the leading &
  description?: string;
  // exactly one type form:
  dataType?: string; domain?: string; attribute?: string; sdt?: string;
  externalObject?: string; businessComponent?: string;
  length?: string; decimals?: string; signed?: boolean; isCollection?: boolean;
  category?: string; icon?: string;
}
```

## The tree — `PatternInstanceElement`

```ts
class PatternInstanceElement {
  tag: string;                          // node name in the instance XML
  elementType?: string;                 // ElementType from the pattern definition
  attributes: Record<string, string>;   // the node's properties
  children: PatternInstanceElement[];
  parent?: PatternInstanceElement;
  path: number[];
  index: number;
  text?: string;

  getAttribute(name: string): string | undefined;
  setAttribute(name: string, value: string): void;   // mutates backing XML (use in exec())
  getChildrenByTag(tag: string): PatternInstanceElement[];
  getFirstChildByTag(tag: string): PatternInstanceElement | null;
  findDescendants(tag: string): PatternInstanceElement[];
  findAncestor(tag: string): PatternInstanceElement | null;
  hasAncestor(tag: string): boolean;
  getCurrentLevel(): PatternInstanceElement | null;
  getCurrentTransaction(): string | null;
  // mutation (use only inside command exec()): addChild, removeChild, reorderChildren
}

/** Fill {0},{1}... in a caption template from attribute values. */
function formatCaption(
  template: string, captionParameters: string | undefined,
  attributes: Record<string, string>,
): string;
```

## KB lookups — `KBObjectCache`

```ts
interface KBObjectCache {
  getKBObjectByQualifiedName(qualifiedName: string): KBObjectInfo | undefined;
  getKBObjectsByName(name: string): KBObjectInfo[];
}
interface KBObjectInfo {
  name: string; qualifiedName: string; type: string; filePath: string; module?: string;
}
```

Obtain it via `api.getCacheManager?.()`, or from `CustomTypeContext.cacheManager`
(`as KBObjectCache`). Always guard for `undefined`.
