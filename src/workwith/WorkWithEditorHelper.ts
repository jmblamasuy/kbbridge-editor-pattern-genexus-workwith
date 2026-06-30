/**
 * Mechanisms 2 & 3 — Captions and Custom Actions.
 *
 * Equivalent to WorkWith/Source/Editor/WorkWithEditorHelper.cs
 */

import {
  IPatternEditorHelper,
  CustomShowElementResult,
  PatternEditorCommand,
  PatternEditorCommandBase,
  PatternInstanceElement,
} from '@kbbridge/genexus-sdk';
import { AddFilterVariableCommand } from './commands/AddFilterVariableCommand';

// Equivalent to WorkWithEditorHelper.ALL_MODES (line 10)
const ALL_MODES = ['Insert', 'Update', 'Delete', 'Display', 'Export'] as const;

export class WorkWithEditorHelper implements IPatternEditorHelper {
  /**
   * Mechanism 2 — custom caption for the `Modes` node.
   * Equivalent to CustomShowElement (lines 12-32): renders "modes (Insert, Update, ...)"
   * listing only the enabled modes.
   */
  customShowElement(element: PatternInstanceElement): CustomShowElementResult {
    if (element.elementType === 'Modes') {
      const enabled = ALL_MODES.filter((mode) => isModeEnabled(element, mode));
      return { handled: true, caption: `modes (${enabled.join(', ')})` };
    }
    return { handled: false };
  }

  /**
   * Mechanism 3 — context commands.
   * Equivalent to GetCommands (lines 34-38): "Add Filter Variable" on FilterAttributes.
   */
  getCommands(element: PatternInstanceElement): PatternEditorCommand[] {
    const commands: PatternEditorCommandBase[] = [];
    if (element.elementType === 'FilterAttributes') {
      commands.push(new AddFilterVariableCommand(element));
    }
    return commands
      .map((c) => c.toSerializable())
      .filter((c): c is PatternEditorCommand => c !== null);
  }
}

/**
 * A mode is enabled when its value is "true", or "default"/absent (the schema default is
 * "default"). NOTE: the .NET version also consults
 * `WorkWithSettings.StandardActions.FindAction(mode).DefaultMode` for the "default" case;
 * without settings parsing we treat "default" as enabled. The mode attribute enum is
 * `{true;false;default}` (see WorkWithInstance.xml, Modes element).
 */
function isModeEnabled(element: PatternInstanceElement, mode: string): boolean {
  const value = element.attributes[mode];
  return value === undefined || value === 'true' || value === 'default';
}
