/**
 * Mechanisms 2, 3 & icons — Captions, Custom Actions and node icons.
 *
 * Equivalent to WorkWith/Source/Editor/WorkWithEditorHelper.cs (plus icon delivery).
 */

import * as fs from 'fs';
import * as path from 'path';
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
  /** name → data URI (or null when there is no bundled icon for that name). */
  private readonly iconCache = new Map<string, string | null>();

  /**
   * @param iconsDir Absolute path to this extension's bundled `icons/` folder, whose files
   *   are named exactly like the schema's `Icon` values (e.g. `ObjectAttribute.ico`).
   */
  constructor(private readonly iconsDir: string) {}

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

  /**
   * Node icons — delivered to KB Editor as `data:` URIs.
   *
   * The GeneXus Work With schema references node icons as .NET assembly resources
   * (e.g. `Icon="ObjectAttribute" IconResource="...,Artech.Patterns.WorkWith"`), which do
   * NOT exist as files in the client's KB. This extension bundles those images under
   * `icons/` (named exactly like the schema `Icon` values) and returns them here, so they
   * render on any client without needing the GeneXus SDK or the .NET assemblies at runtime.
   */
  getNodeIcon(_element: PatternInstanceElement, iconName?: string): string | undefined {
    if (!iconName) {
      return undefined;
    }
    // Only simple resource names (guards against path traversal and real file paths).
    if (!/^[A-Za-z0-9_]+$/.test(iconName)) {
      return undefined;
    }
    const cached = this.iconCache.get(iconName);
    if (cached !== undefined) {
      return cached ?? undefined;
    }

    let uri: string | null = null;
    try {
      const file = path.join(this.iconsDir, `${iconName}.ico`);
      if (fs.existsSync(file)) {
        uri = `data:image/x-icon;base64,${fs.readFileSync(file).toString('base64')}`;
      }
    } catch {
      uri = null;
    }

    this.iconCache.set(iconName, uri);
    return uri ?? undefined;
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
