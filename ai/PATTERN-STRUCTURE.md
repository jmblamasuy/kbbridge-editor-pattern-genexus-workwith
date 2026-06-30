# Pattern structure (how GeneXus defines a pattern)

A GeneXus pattern is defined by a small set of XML files shipped with the pattern (in the
GeneXus install or the KB's `Patterns/<PatternType>/` folder). KB Editor reads these to know
the tree shape and the property editors; your extension supplies behavior for the dynamic
bits.

```
Patterns/<PatternType>/
├── Definitions/
│   ├── <PatternType>.Pattern          main definition (version, generated objects, templates)
│   ├── <PatternType>Instance.xml      instance schema: ElementTypes, attributes, children
│   ├── <PatternType>CustomTypes.xml   custom type ids and their base data types
│   └── <PatternType>Settings.xml      settings schema
└── Source/ …                          the pattern's .NET implementation (your reference)
```

## The instance schema (`*Instance.xml`)

Defines each **ElementType** (a node kind), its **attributes** (properties), and its allowed
**child elements**. A pattern instance (`.gxPattern`) is a tree of these element types.

```xml
<ElementType Name="Action" Caption="Action ({0})" CaptionParameters="name">
  <Attributes>
    <Attribute Name="name"     Type="string" NotNull="true" />
    <Attribute Name="callType" Type="enum{Call;Link;Prompt}" DefaultValue="Link" />
    <Attribute Name="gridRender" Type="custom(GridCustomRender)" Category="Appearance" />
    <Attribute Name="events"   Type="code(Events)" />
  </Attributes>
  <ChildElements>
    <ChildElement Name="conditions" Type="Conditions" />
  </ChildElements>
</ElementType>
```

### Attribute types

| `Type=` | Editor in KB Editor |
|---|---|
| `string`, `bool`, `int` | text / checkbox / number |
| `enum{A;B;C}` | static dropdown |
| `reference(KBObjectType)` | KB object picker |
| `code(Events)` | embedded code editor |
| **`custom(<Id>)`** | **dynamic dropdown — supplied by your `IPatternCustomTypeSupport`** |

Other useful attributes: `Category` (group in the properties panel), `Description`,
`DefaultValue`, `VisibleIf`, `PrettyName`, `NotNull`.

## How it maps to your code

- `ElementType Name` → `PatternInstanceElement.elementType` (branch on this in
  `customShowElement` / `getCommands`).
- An instance node's tag → `PatternInstanceElement.tag`.
- `Type="custom(<Id>)"` → KB Editor calls `getTypeEditor("<Id>")` on your support; the
  `<Id>` strings are listed in `*CustomTypes.xml`.
- `Caption` + `CaptionParameters` → the default node label; reproduce/extend it with
  `formatCaption(...)` if you customize captions.

## Runtime note

You generally **do not ship** the `*Instance.xml`/`.Pattern` schema in your extension — it
comes from the user's GeneXus install/KB. Your extension supplies the providers keyed by the
pattern type. (For local testing, the example project includes copies under `sample-kb/`.)

See [SDK-REFERENCE.md](SDK-REFERENCE.md) `PatternDefinition` for the parsed shape of these
files, if you ever need to read them.
