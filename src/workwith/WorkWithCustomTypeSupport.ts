/**
 * Mechanism 1 — Custom Types.
 *
 * Equivalent to WorkWith/Source/Custom/WorkWithCustomTypeSupport.cs
 *
 * The Work With pattern defines a single custom type, `GridCustomRender` (used by the
 * settings property `CustomRender`), whose values are the grid user controls available.
 */

import {
  IPatternCustomTypeSupport,
  IPatternCustomTypeEditor,
  CustomTypeContext,
  CustomTypeValue,
} from '@kbbridge/genexus-sdk';

export class WorkWithCustomTypeSupport implements IPatternCustomTypeSupport {
  private readonly editors = new Map<string, IPatternCustomTypeEditor>([
    ['GridCustomRender', new GridCustomRenderTypeEditor()],
  ]);

  // Equivalent to GetTypeEditor (WorkWithCustomTypeSupport.cs lines 14-20)
  getTypeEditor(typeId: string): IPatternCustomTypeEditor | null {
    return this.editors.get(typeId) ?? null;
  }
}

/**
 * Equivalent to GridCustomRenderTypeEditor (WorkWithCustomTypeSupport.cs lines 25-43).
 *
 * .NET enumerates `GenexusBLServices.UserControlsManager` grid controls. KB Editor does not
 * expose a "list all user controls" query through the cache contract, so we offer the empty
 * option plus any grids declared in the current instance tree as a best-effort fallback.
 * (A future host API could list KB grid user controls for full parity.)
 */
class GridCustomRenderTypeEditor implements IPatternCustomTypeEditor {
  readonly editorKind = 'ComboBox' as const;

  async getValues(context: CustomTypeContext): Promise<CustomTypeValue[]> {
    const values: CustomTypeValue[] = [{ value: '', displayName: '(none)' }];

    const level = context.element.findAncestor('level');
    for (const grid of level?.findDescendants('grid') ?? []) {
      const name = grid.attributes['name'];
      if (name) values.push({ value: name });
    }

    values.sort((a, b) => a.value.localeCompare(b.value));
    return values;
  }
}
