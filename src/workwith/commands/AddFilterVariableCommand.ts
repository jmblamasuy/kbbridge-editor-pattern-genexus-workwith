/**
 * Mechanism 3 — the "Add Filter Variable" command.
 *
 * Equivalent to WorkWith/Source/Editor/CommandAddFilterVariable.cs
 *
 * Adds one or more `filterAttribute` nodes under the `FilterAttributes` node and, optionally,
 * a matching `condition` under the filter's `conditions`.
 */

import * as vscode from 'vscode';
import {
  PatternEditorCommandBase,
  PatternInstanceElement,
  PatternXmlNode,
} from '@kbbridge/genexus-sdk';

export class AddFilterVariableCommand extends PatternEditorCommandBase {
  get id(): string {
    return 'workwith.addFilterVariable';
  }

  // Equivalent to Text (lines 22-25) → Messages.CmdAddFilterVariable
  get text(): string {
    return 'Add Filter Variable...';
  }

  // Equivalent to Exec (lines 29-58)
  async exec(): Promise<void> {
    // .NET opens GenexusUIServices.SelectAttributeVariable (a KB attribute/variable picker).
    // In KB Editor we ask for the name(s) directly.
    const input = await vscode.window.showInputBox({
      title: 'Add Filter Variable',
      prompt: 'Attribute or variable name(s), comma-separated',
      placeHolder: 'e.g. CustomerName, CustomerStatus',
    });
    if (!input) {
      return;
    }
    const names = input
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (names.length === 0) {
      return;
    }

    for (const name of names) {
      this.addFilterAttribute(name);
    }

    // Equivalent to the "add conditions?" confirmation (lines 47-56)
    const answer = await vscode.window.showQuickPick(['Yes', 'No'], {
      title: 'Add Filter Variable',
      placeHolder: 'Also add a filter condition for each attribute?',
    });
    if (answer === 'Yes') {
      const conditions = this.findConditionsElement();
      if (conditions) {
        for (const name of names) {
          this.addCondition(conditions, `${name} = &${name}`);
        }
      }
    }
  }

  /** Equivalent to BaseElement.Children.AddNewElement(FilterAttribute) + set name/description. */
  private addFilterAttribute(name: string): void {
    const backing: PatternXmlNode = {
      tag: 'filterAttribute',
      attributes: { name, description: name },
      children: [],
    };
    const index = this.baseElement.children.length;
    const child = new PatternInstanceElement(backing, this.baseElement, index, [
      ...this.baseElement.path,
      index,
    ]);
    this.baseElement.addChild(child);
  }

  /**
   * Equivalent to BaseElement.Parent.Children[Filter.Conditions]. The command runs on the
   * `FilterAttributes` node; its parent is the `Filter`, whose `conditions` child holds the
   * filter conditions.
   */
  private findConditionsElement(): PatternInstanceElement | null {
    const filter = this.baseElement.parent;
    return filter?.getFirstChildByTag('conditions') ?? null;
  }

  /** Equivalent to Conditions.AddNewElement(Condition) + set value. */
  private addCondition(conditions: PatternInstanceElement, value: string): void {
    const backing: PatternXmlNode = {
      tag: 'condition',
      attributes: { value },
      children: [],
    };
    const index = conditions.children.length;
    const child = new PatternInstanceElement(backing, conditions, index, [
      ...conditions.path,
      index,
    ]);
    conditions.addChild(child);
  }
}
