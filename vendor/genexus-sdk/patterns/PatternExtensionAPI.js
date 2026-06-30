"use strict";
/**
 * Pattern Extension API Interfaces
 *
 * Estas interfaces replican la arquitectura de extensibilidad de patterns de GeneXus IDE,
 * permitiendo que extensiones de terceros (como pxtools-vscode) registren providers
 * para CustomTypes y EditorHelpers.
 *
 * Referencia: En GeneXus IDE, los patterns implementan:
 * - PatternImplementation.GetCustomTypeSupport() -> IPatternCustomTypeSupport
 * - PatternImplementation.GetInstanceEditorHelper() -> IPatternEditorHelper
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternEditorCommandBase = exports.CommandState = void 0;
// ============================================
// PATTERN EDITOR COMMAND - Clase base para comandos
// Transcripción de: Artech.Packages.Patterns.Custom.PatternEditorCommand
// ============================================
/**
 * Estado del comando (equivalente a CommandState en C#)
 */
var CommandState;
(function (CommandState) {
    /** Comando invisible */
    CommandState["Invisible"] = "Invisible";
    /** Comando visible pero deshabilitado */
    CommandState["Disabled"] = "Disabled";
    /** Comando visible y habilitado */
    CommandState["Enabled"] = "Enabled";
})(CommandState || (exports.CommandState = CommandState = {}));
/**
 * Clase base abstracta para comandos de editor de patterns.
 *
 * Transcripción de: Artech.Packages.Patterns.Custom.PatternEditorCommand
 *
 * Esta clase provee:
 * - Estructura común para todos los comandos contextuales del editor
 * - Métodos utilitarios: isVisible(), isEnabled(), toSerializable()
 * - Integración con el sistema de menú contextual del Visual Editor
 *
 * Los desarrolladores de patterns deben extender esta clase para
 * implementar comandos personalizados.
 *
 * @example
 * ```typescript
 * class OpenMyObject extends PatternEditorCommandBase {
 *   get id() { return 'openMyObject'; }
 *   get text() { return 'Open My Object...'; }
 *
 *   query(): CommandStatus {
 *     if (this.hasValidObject()) {
 *       return { state: CommandState.Enabled };
 *     }
 *     return { state: CommandState.Invisible };
 *   }
 *
 *   async exec(): Promise<void> {
 *     // Abrir el objeto...
 *   }
 * }
 * ```
 */
class PatternEditorCommandBase {
    /**
     * Constructor
     * @param onElement Elemento sobre el que actúa el comando
     */
    constructor(onElement) {
        this._baseElement = onElement;
    }
    /**
     * Icono del comando (opcional)
     */
    get icon() {
        return undefined;
    }
    /**
     * Elemento base sobre el que actúa el comando
     */
    get baseElement() {
        return this._baseElement;
    }
    /**
     * Determina el estado del comando
     * Por defecto retorna Enabled. Las subclases pueden sobrescribir.
     */
    query() {
        return { state: CommandState.Enabled };
    }
    /**
     * Indica si el comando está visible (state !== Invisible)
     */
    isVisible() {
        return this.query().state !== CommandState.Invisible;
    }
    /**
     * Indica si el comando está habilitado (state === Enabled)
     */
    isEnabled() {
        return this.query().state === CommandState.Enabled;
    }
    /**
     * Convierte a formato serializable para enviar al webview
     */
    toSerializable() {
        if (!this.isVisible()) {
            return null;
        }
        const self = this;
        return {
            id: this.id,
            label: this.text,
            icon: this.icon,
            execute: () => self.exec()
        };
    }
}
exports.PatternEditorCommandBase = PatternEditorCommandBase;
//# sourceMappingURL=PatternExtensionAPI.js.map