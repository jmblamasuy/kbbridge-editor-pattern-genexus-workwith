# sample-kb — testing the Work With extension

KB Editor reads the **Work With schema** (`WorkWithInstance.xml`) from your GeneXus
installation / KB — every GeneXus KB ships the Work With pattern. This extension only adds
behavior on top, so to test it you open a real Work With instance in a KB that has the
pattern.

> The GeneXus pattern definition files are **not** included here (they belong to GeneXus and
> stay in your install). Point KB Editor at a KB that has the Work With pattern; for
> reference, the schema lives at
> `…/GeneXus18U12PlatformSDK/Patterns/WorkWith/Definitions/WorkWithInstance.xml`.

## Steps

1. Build and install this extension (see [`../ai/DEPLOY.md`](../ai/DEPLOY.md)) next to KB
   Editor; reload the window.
2. Open a **Work With** `.gxPattern` instance (create one on a transaction in your KB, or
   open an existing one).
3. Verify each mechanism:
   - **Custom Type** — open the pattern **Settings** and edit `CustomRender`: it shows a
     dropdown (`GridCustomRender`) instead of a plain text box.
   - **Caption** — the **Modes** node under a Selection shows `modes (Insert, Update, …)`
     listing only the enabled modes (toggle a mode and watch it update).
   - **Custom Action** — right-click the **Filter ▸ Attributes** (`FilterAttributes`) node;
     choose **"Add Filter Variable…"**, enter a name, and confirm a `filterAttribute`
     (and optional condition) is added.

## Illustrative instance shape (for reference)

A Work With instance is a tree of the element types defined in `WorkWithInstance.xml`. The
nodes exercised above look roughly like:

```xml
<!-- inside a <selection> ... -->
<modes Insert="true" Update="true" Delete="false" Display="default" Export="false" />
<filter>
  <attributes>            <!-- elementType: FilterAttributes -->
    <filterAttribute name="CustomerName" description="Customer Name" />
  </attributes>
  <conditions />
</filter>
```

(Exact serialization is produced by KB Editor / GeneXus; use a real instance for testing.)
