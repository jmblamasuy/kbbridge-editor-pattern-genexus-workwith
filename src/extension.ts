/**
 * GeneXus Work With — KB Editor extension.
 *
 * Registers the three pattern-extensibility providers for the GeneXus "WorkWith" pattern
 * against KB Editor (`kbbridge.genexus-visual-editor`):
 *   - WorkWithCustomTypeSupport  (Mechanism 1 — custom types)
 *   - WorkWithEditorHelper        (Mechanisms 2 & 3 — captions + commands)
 */

import * as vscode from 'vscode';
import { PatternExtensionAPI } from '@kbbridge/genexus-sdk';
import { WorkWithCustomTypeSupport } from './workwith/WorkWithCustomTypeSupport';
import { WorkWithEditorHelper } from './workwith/WorkWithEditorHelper';

/** Shape of the object KB Editor exports from its own activate(). */
interface VisualEditorAPI {
  patternAPI: PatternExtensionAPI;
}

const KB_EDITOR_EXTENSION_ID = 'kbbridge.genexus-visual-editor';
const PATTERN_TYPE = 'WorkWith';

let output: vscode.OutputChannel;

function log(message: string): void {
  const ts = new Date().toISOString().substring(11, 19);
  output.appendLine(`[${ts}] ${message}`);
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  output = vscode.window.createOutputChannel('GeneXus Work With (KB Editor)');
  context.subscriptions.push(output);
  log('Activating...');

  const kbEditor = vscode.extensions.getExtension<VisualEditorAPI>(KB_EDITOR_EXTENSION_ID);
  if (!kbEditor) {
    const msg = `KB Editor (${KB_EDITOR_EXTENSION_ID}) is not installed. Install/enable it and reload.`;
    log(msg);
    void vscode.window.showWarningMessage(`GeneXus Work With: ${msg}`);
    return;
  }

  const kbVersion = kbEditor.packageJSON?.version ?? 'unknown';
  log(`Found KB Editor v${kbVersion} (active=${kbEditor.isActive}).`);

  // activate() returns the cached exports when the extension is already active — more robust
  // than reading `.exports`, which can be undefined mid-activation.
  let api: VisualEditorAPI | undefined;
  try {
    api = await kbEditor.activate();
  } catch (error) {
    log(`Error while activating KB Editor: ${error}`);
  }

  log(`KB Editor API keys: [${api ? Object.keys(api).join(', ') : '(none)'}]`);

  if (!api || !api.patternAPI) {
    const msg =
      `Your KB Editor (v${kbVersion}) does not expose the pattern extensibility API. ` +
      `Please update KB Editor to a version that supports pattern extensions.`;
    log(`Could not obtain patternAPI from KB Editor. ${msg}`);
    void vscode.window.showWarningMessage(`GeneXus Work With: ${msg}`);
    return;
  }

  const patternAPI = api.patternAPI;
  patternAPI.registerCustomTypeSupport(PATTERN_TYPE, new WorkWithCustomTypeSupport());
  patternAPI.registerEditorHelper(PATTERN_TYPE, new WorkWithEditorHelper());

  context.subscriptions.push({
    dispose: () => {
      patternAPI.unregisterCustomTypeSupport(PATTERN_TYPE);
      patternAPI.unregisterEditorHelper(PATTERN_TYPE);
    },
  });

  log(`Registered providers for pattern type "${PATTERN_TYPE}".`);
}

export function deactivate(): void {
  // Disposables in context.subscriptions are cleaned up automatically.
}
