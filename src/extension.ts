/**
 * GeneXus Work With — KB Editor extension.
 *
 * Registers the three pattern-extensibility providers for the GeneXus "WorkWith" pattern
 * against KB Editor (`kbbridge.genexus-visual-editor`):
 *   - WorkWithCustomTypeSupport  (Mechanism 1 — custom types)
 *   - WorkWithEditorHelper        (Mechanisms 2 & 3 — captions + commands)
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { PatternExtensionAPI } from '@kbbridge/genexus-sdk';
import { WorkWithCustomTypeSupport } from './workwith/WorkWithCustomTypeSupport';
import { WorkWithEditorHelper } from './workwith/WorkWithEditorHelper';

/** Shape of the object KB Editor exports from its own activate(). */
interface VisualEditorAPI {
  patternAPI: PatternExtensionAPI;
}

const KB_EDITOR_EXTENSION_ID = 'kbbridge.genexus-visual-editor';
const PATTERN_TYPE = 'WorkWith';

// KB Editor and this extension both activate on startup. VS Code should activate KB Editor
// first (it is declared in `extensionDependencies`), but on some setups that ordering is not
// honored and this extension runs first — or KB Editor reports `isActive` before its
// `activate()` has populated the exported API. So we retry acquiring the API for a short
// window instead of giving up (and warning the user) on the first attempt.
const ACQUIRE_TIMEOUT_MS = 15000;
const ACQUIRE_POLL_MS = 300;

let output: vscode.OutputChannel;

function log(message: string): void {
  const ts = new Date().toISOString().substring(11, 19);
  output.appendLine(`[${ts}] ${message}`);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Obtain KB Editor's `patternAPI`, tolerating activation-ordering races.
 *
 * `kbEditor.activate()` resolves with the extension's exports and also triggers KB Editor's
 * activation if it has not started yet; but when KB Editor is flagged active while its
 * activation is still in flight, the exports can momentarily be undefined. We therefore call
 * `activate()` and read `exports`, retrying every ACQUIRE_POLL_MS until the API surfaces or
 * the timeout elapses — so a slow or late KB Editor activation is waited out instead of
 * reported as "no pattern API".
 */
async function acquirePatternAPI(
  kbEditor: vscode.Extension<VisualEditorAPI>,
): Promise<PatternExtensionAPI | undefined> {
  const deadline = Date.now() + ACQUIRE_TIMEOUT_MS;
  let attempt = 0;
  let waited = false;
  for (;;) {
    attempt++;
    let api: VisualEditorAPI | undefined;
    try {
      api = await kbEditor.activate();
    } catch (error) {
      log(`Error while activating KB Editor (attempt ${attempt}): ${error}`);
    }
    const resolved: VisualEditorAPI | undefined =
      api ?? (kbEditor.exports as VisualEditorAPI | undefined);
    if (attempt === 1) {
      log(`KB Editor API keys: [${resolved ? Object.keys(resolved).join(', ') : '(none)'}]`);
    }
    if (resolved?.patternAPI) {
      if (waited) {
        log(`patternAPI acquired on attempt ${attempt}.`);
      }
      return resolved.patternAPI;
    }
    if (Date.now() >= deadline) {
      return undefined;
    }
    if (!waited) {
      log('patternAPI not ready yet (KB Editor still activating); waiting...');
      waited = true;
    }
    await delay(ACQUIRE_POLL_MS);
  }
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

  const patternAPI = await acquirePatternAPI(kbEditor);
  if (!patternAPI) {
    const msg =
      `Could not obtain the pattern extensibility API from KB Editor (v${kbVersion}) after ` +
      `${ACQUIRE_TIMEOUT_MS / 1000}s. If KB Editor is installed and up to date, reload the ` +
      `window; otherwise update KB Editor to a version that supports pattern extensions.`;
    log(msg);
    void vscode.window.showWarningMessage(`GeneXus Work With: ${msg}`);
    return;
  }

  const iconsDir = path.join(context.extensionUri.fsPath, 'icons');
  patternAPI.registerCustomTypeSupport(PATTERN_TYPE, new WorkWithCustomTypeSupport());
  patternAPI.registerEditorHelper(PATTERN_TYPE, new WorkWithEditorHelper(iconsDir));

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
