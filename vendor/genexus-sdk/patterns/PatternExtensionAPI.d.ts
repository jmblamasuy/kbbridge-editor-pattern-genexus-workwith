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
import { PatternInstanceElement } from './PatternInstanceElement';
/**
 * API exportada por genexus-visual-editor para extensiones de terceros.
 * Las extensiones (ej: pxtools-vscode) usan esta API para registrar
 * sus providers de CustomType y EditorHelper.
 */
export interface PatternExtensionAPI {
    /**
     * Registra un IPatternCustomTypeSupport para un tipo de pattern.
     * Equivalente a: PatternImplementation.GetCustomTypeSupport()
     *
     * @param patternType - Tipo de pattern (ej: "PXWorkWith", "PXParameterRequest")
     * @param support - Implementación del CustomTypeSupport
     */
    registerCustomTypeSupport(patternType: string, support: IPatternCustomTypeSupport): void;
    /**
     * Registra un IPatternEditorHelper para un tipo de pattern.
     * Equivalente a: PatternImplementation.GetInstanceEditorHelper()
     *
     * @param patternType - Tipo de pattern
     * @param helper - Implementación del EditorHelper
     */
    registerEditorHelper(patternType: string, helper: IPatternEditorHelper): void;
    /**
     * Registra un IPatternVariableProvider para un tipo de pattern.
     * Provee variables para autocompletado en código embebido.
     *
     * @param patternType - Tipo de pattern
     * @param provider - Implementación del VariableProvider
     */
    registerVariableProvider(patternType: string, provider: IPatternVariableProvider): void;
    /**
     * Elimina el registro de CustomTypeSupport para un pattern.
     * Útil cuando una extensión se desactiva.
     */
    unregisterCustomTypeSupport(patternType: string): void;
    /**
     * Elimina el registro de EditorHelper para un pattern.
     */
    unregisterEditorHelper(patternType: string): void;
    /**
     * Elimina el registro de VariableProvider para un pattern.
     */
    unregisterVariableProvider(patternType: string): void;
    /**
     * Obtiene el CacheManager para acceder al índice de objetos de la KB.
     * Permite búsquedas O(1) por nombre cualificado o nombre simple.
     *
     * @returns CacheManager o undefined si no está disponible
     */
    getCacheManager?(): KBObjectCache | undefined;
}
/**
 * Interfaz simplificada para acceso a objetos de la KB.
 * Subset del CacheManager de genexus-language-core-lib.
 */
export interface KBObjectCache {
    /**
     * Busca un objeto por su nombre cualificado (O(1)).
     * Ejemplo: "PXTools.Menus.PXWorkWithTMnuWeb"
     */
    getKBObjectByQualifiedName(qualifiedName: string): KBObjectInfo | undefined;
    /**
     * Busca objetos por nombre simple (O(1)).
     * Puede retornar múltiples objetos si hay colisiones de nombre.
     * Ejemplo: "PXWorkWithTMnuWeb"
     */
    getKBObjectsByName(name: string): KBObjectInfo[];
}
/**
 * Información de un objeto de la KB.
 */
export interface KBObjectInfo {
    /** Nombre simple del objeto */
    name: string;
    /** Nombre cualificado (incluye módulo) */
    qualifiedName: string;
    /** Tipo del objeto (Procedure, Transaction, WorkWithPlus, etc.) */
    type: string;
    /** Path al archivo del objeto */
    filePath: string;
    /** Módulo (opcional) */
    module?: string;
}
/**
 * Equivalente a IPatternCustomTypeSupport de GeneXus.
 * Provee editores para tipos custom definidos en el XML como 'custom(TypeName)'.
 *
 * Los CustomType SIEMPRE requieren código dinámico porque sus valores
 * dependen del contexto (ej: atributos de una transacción específica).
 */
export interface IPatternCustomTypeSupport {
    /**
     * Retorna el editor para un tipo custom específico.
     * Equivalente a: GetTypeEditor(string typeId)
     *
     * @param typeId - ID del tipo custom (ej: "Theme", "TransactionAttributes")
     * @returns Editor para el tipo, o null si no está soportado
     */
    getTypeEditor(typeId: string): IPatternCustomTypeEditor | null;
}
/**
 * Equivalente a IPatternCustomTypeEditor de GeneXus.
 * Define cómo obtener los valores para un dropdown/combobox.
 */
export interface IPatternCustomTypeEditor {
    /**
     * Tipo de editor UI.
     * Por ahora solo soportamos ComboBox, pero se pueden agregar más.
     */
    editorKind: 'ComboBox' | 'TextBox' | 'Custom';
    /**
     * Obtiene los valores disponibles para el dropdown.
     * Equivalente a: IComboBoxTypeEditor.Values
     *
     * @param context - Contexto con información del elemento y valor actual
     * @returns Lista de valores disponibles
     */
    getValues(context: CustomTypeContext): Promise<CustomTypeValue[]>;
    /**
     * Valida un valor ingresado (opcional).
     * @param value - Valor a validar
     * @param context - Contexto del elemento
     * @returns true si es válido, string con mensaje de error si no
     */
    validate?(value: string, context: CustomTypeContext): Promise<boolean | string>;
    /**
     * Obtiene las propiedades de las que depende este CustomType (opcional).
     * Cuando alguna de estas propiedades cambia, se debe re-evaluar getValues().
     * Equivalente a: GetDependencies() en C#
     *
     * @returns Array de nombres de propiedades de las que depende
     */
    getDependencies?(): string[];
}
/**
 * Contexto pasado a los métodos de CustomTypeEditor.
 */
export interface CustomTypeContext {
    /** Tipo de pattern (ej: "PXWorkWith") */
    patternType: string;
    /** Elemento actual donde está la propiedad */
    element: PatternInstanceElement;
    /** Nombre de la propiedad siendo editada */
    propertyName: string;
    /** Valor actual de la propiedad */
    currentValue: string;
    /** Path del archivo .gxPattern */
    filePath: string;
    /** Nombre de la instancia del pattern */
    instanceName: string;
    /** CacheManager para búsqueda de instancias y cross-references (opcional) */
    cacheManager?: unknown;
}
/**
 * Valor disponible en un dropdown de CustomType.
 */
export interface CustomTypeValue {
    /** Valor a guardar en el XML */
    value: string;
    /** Nombre a mostrar en el dropdown (si es diferente del value) */
    displayName?: string;
    /** Descripción/tooltip */
    description?: string;
    /** Ícono opcional (nombre de codicon) */
    icon?: string;
    /** Indica si este valor está deshabilitado */
    disabled?: boolean;
    /** Grupo para agrupar valores en el dropdown */
    group?: string;
}
/**
 * Equivalente a IPatternEditorHelper de GeneXus.
 * Personaliza captions, comandos e inicialización de elementos.
 */
export interface IPatternEditorHelper {
    /**
     * Personaliza el caption e ícono de un elemento en el árbol.
     * Equivalente a: CustomShowElement(element, ref caption, ref icon)
     *
     * @param element - Elemento a mostrar
     * @param context - Contexto del editor
     * @returns Objeto con handled=true si personalizó, false para usar default
     */
    customShowElement?(element: PatternInstanceElement, context: EditorHelperContext): CustomShowElementResult;
    /**
     * Obtiene comandos contextuales para un elemento.
     * Equivalente a: GetCommands(onElement)
     *
     * @param element - Elemento seleccionado
     * @returns Lista de comandos disponibles (formato serializado para el webview)
     */
    getCommands?(element: PatternInstanceElement): PatternEditorCommand[];
    /**
     * Inicializa valores de un elemento recién creado.
     * Equivalente a: InitializeElement(element, sourceObject)
     *
     * @param element - Elemento a inicializar
     * @param sourceObject - Objeto fuente (opcional, ej: Transaction seleccionada)
     */
    initializeElement?(element: PatternInstanceElement, sourceObject?: any): void;
    /**
     * Valida si un elemento puede ser eliminado.
     * @param element - Elemento a eliminar
     * @returns true si puede eliminarse, string con mensaje si no
     */
    canDeleteElement?(element: PatternInstanceElement): boolean | string;
    /**
     * Recibe referencia al PatternExtensionAPI después del registro.
     * Permite al helper acceder a servicios como getCacheManager().
     * El registry llama este método automáticamente al registrar el helper.
     *
     * @param api - La API de extensión de patterns
     */
    setPatternAPI?(api: PatternExtensionAPI): void;
    /**
     * Valida si un tipo de nodo puede agregarse como hijo.
     * @param parent - Elemento padre
     * @param childType - Tipo de elemento hijo a agregar
     * @returns true si puede agregarse, string con mensaje si no
     */
    canAddChild?(parent: PatternInstanceElement, childType: string): boolean | string;
}
/**
 * Resultado de customShowElement.
 */
export interface CustomShowElementResult {
    /** true si el helper personalizó el caption, false para usar default del XML */
    handled: boolean;
    /** Caption personalizado (solo si handled=true) */
    caption?: string;
    /** Nombre de ícono o path relativo (solo si handled=true) */
    icon?: string;
    /** Tooltip adicional */
    tooltip?: string;
}
/**
 * Contexto pasado al EditorHelper.
 */
export interface EditorHelperContext {
    /** Tipo de pattern */
    patternType: string;
    /** Nombre de la instancia */
    instanceName: string;
    /** Path del archivo */
    filePath: string;
    /** Path a la carpeta PatternSettings (para resolver valores <default>) */
    settingsPath?: string;
}
/**
 * Comando contextual para el menú del editor de patterns.
 * Este es el formato que usa el webview para mostrar comandos en el menú contextual.
 */
export interface PatternEditorCommand {
    /** ID único del comando */
    id: string;
    /** Label mostrado en menú */
    label: string;
    /** Descripción/tooltip */
    description?: string;
    /** Ícono codicon */
    icon?: string;
    /** Grupo para separadores en menú */
    group?: string;
    /** Orden dentro del grupo */
    order?: number;
    /** Función a ejecutar */
    execute: () => void | Promise<void>;
}
/**
 * Estado del comando (equivalente a CommandState en C#)
 */
export declare enum CommandState {
    /** Comando invisible */
    Invisible = "Invisible",
    /** Comando visible pero deshabilitado */
    Disabled = "Disabled",
    /** Comando visible y habilitado */
    Enabled = "Enabled"
}
/**
 * Información del estado del comando
 */
export interface CommandStatus {
    state: CommandState;
}
/**
 * Interfaz que define un comando de editor para patterns.
 * Transcripción de: Artech.Packages.Patterns.Custom.PatternEditorCommand
 *
 * Los desarrolladores de patterns deben extender PatternEditorCommandBase
 * para implementar comandos personalizados.
 */
export interface IPatternEditorCommand {
    /** ID único del comando */
    readonly id: string;
    /** Texto a mostrar en el menú contextual */
    readonly text: string;
    /** Icono del comando (nombre de codicon) */
    readonly icon?: string;
    /** Elemento base sobre el que actúa el comando */
    readonly baseElement: PatternInstanceElement;
    /**
     * Determina el estado del comando (visible/habilitado/deshabilitado)
     * Transcripción de: PatternEditorCommand.Query()
     */
    query(): CommandStatus;
    /**
     * Ejecuta la acción del comando
     * Transcripción de: PatternEditorCommand.Exec()
     */
    exec(): void | Promise<void>;
}
/**
 * Contexto de ejecución para comandos de pattern.
 * Permite desacoplar los comandos de la implementación específica del IDE.
 */
export interface CommandExecutionContext {
    /**
     * Busca y abre un archivo que coincida con el patrón
     * @param searchPattern Patrón de búsqueda (ej: "**\/NombreObjeto.*gxSource")
     * @returns true si se encontró y abrió el archivo
     */
    openFile(searchPattern: string): Promise<boolean>;
    /**
     * Busca y abre un objeto de la KB por su nombre (usa CacheManager).
     * Soporta nombres cualificados y nombres simples.
     *
     * @param objectName Nombre del objeto (cualificado o simple)
     *                   Ejemplo: "PXTools.Menus.PXWorkWithTMnuWeb" o "PXWorkWithTMnuWeb"
     * @param objectType Tipo de objeto opcional para filtrar (ej: "WorkWithPlus")
     * @returns true si se encontró y abrió el objeto
     */
    openKBObject?(objectName: string, objectType?: string): Promise<boolean>;
    /**
     * Muestra un mensaje informativo
     */
    showInfo(message: string): void;
    /**
     * Muestra una advertencia
     */
    showWarning(message: string): void;
    /**
     * Logger opcional
     */
    log?(message: string): void;
}
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
export declare abstract class PatternEditorCommandBase implements IPatternEditorCommand {
    protected _baseElement: PatternInstanceElement;
    /**
     * Constructor
     * @param onElement Elemento sobre el que actúa el comando
     */
    constructor(onElement: PatternInstanceElement);
    /**
     * ID único del comando (debe ser sobrescrito)
     */
    abstract get id(): string;
    /**
     * Texto a mostrar en el menú
     * Transcripción de: PatternEditorCommand.Text
     */
    abstract get text(): string;
    /**
     * Icono del comando (opcional)
     */
    get icon(): string | undefined;
    /**
     * Elemento base sobre el que actúa el comando
     */
    get baseElement(): PatternInstanceElement;
    /**
     * Determina el estado del comando
     * Por defecto retorna Enabled. Las subclases pueden sobrescribir.
     */
    query(): CommandStatus;
    /**
     * Ejecuta la acción del comando
     */
    abstract exec(): void | Promise<void>;
    /**
     * Indica si el comando está visible (state !== Invisible)
     */
    isVisible(): boolean;
    /**
     * Indica si el comando está habilitado (state === Enabled)
     */
    isEnabled(): boolean;
    /**
     * Convierte a formato serializable para enviar al webview
     */
    toSerializable(): PatternEditorCommand | null;
}
/**
 * Provider de variables para autocompletado en código embebido.
 * Permite que extensiones de terceros provean variables según el contexto
 * del elemento donde se está editando código.
 *
 * Ejemplo de uso: Cuando el usuario edita código en una propiedad `code(Events)`,
 * el VariableProvider devuelve las variables disponibles en ese nivel del pattern.
 */
export interface IPatternVariableProvider {
    /**
     * Obtiene las variables disponibles en el contexto del elemento dado.
     * @param element - Elemento actual donde se está editando código
     * @param context - Contexto adicional (path de archivo, tipo de pattern, etc.)
     * @returns Lista de variables con su metadata
     */
    getVariables(element: PatternInstanceElement, context: VariableProviderContext): Promise<VariableInfo[]>;
    /**
     * Indica los tipos de pattern que este provider soporta.
     * @returns Array de tipos de pattern (ej: ["PXWorkWith", "PXParameterRequest"])
     */
    getSupportedPatternTypes(): string[];
}
/**
 * Contexto pasado al VariableProvider.
 */
export interface VariableProviderContext {
    /** Tipo de pattern (ej: "PXWorkWith") */
    patternType: string;
    /** Path del archivo .gxPattern */
    filePath: string;
    /** Nombre de la instancia del pattern */
    instanceName: string;
    /** Nombre de la propiedad siendo editada (ej: "events", "conditions") */
    propertyName?: string;
    /** Tipo de código (Events, Conditions, Expressions, Rules) */
    codeType?: string;
}
/**
 * Información de una variable para autocompletado.
 *
 * Las propiedades de tipo (dataType, domain, attribute, sdt, externalObject, businessComponent)
 * son mutuamente excluyentes - una variable tiene solo una forma de definir su tipo.
 *
 * Las referencias a objetos de KB usan el formato ReferenceName:
 * `NombreObjeto.Sublevel, Modulo.SubModulo`
 *
 * Ejemplos:
 * - domain = "ObjectName, GeneXus"
 * - sdt = "MenusOrdered.Item, PXTools.Menus"
 * - attribute = "CustomerId" (sin módulo si es raíz)
 */
export interface VariableInfo {
    /** Nombre de la variable (sin el prefijo &) */
    name: string;
    /** Descripción/tooltip */
    description?: string;
    /**
     * Tipo de dato básico (Numeric, Character, Date, DateTime, Boolean, etc.)
     * Se usa cuando la variable NO está basada en otro objeto de la KB.
     */
    dataType?: string;
    /**
     * Referencia a un dominio en formato ReferenceName.
     * Ejemplo: "ObjectName, GeneXus"
     */
    domain?: string;
    /**
     * Referencia a un atributo.
     * Ejemplo: "CustomerId" o "CustomerId, Module"
     */
    attribute?: string;
    /**
     * Referencia a un SDT en formato ReferenceName.
     * Puede incluir sublevel para colecciones: "MenusOrdered.Item, PXTools.Menus"
     */
    sdt?: string;
    /**
     * Referencia a un External Object.
     * Ejemplo: "HttpClient" o "HttpClient, GeneXus.Net"
     */
    externalObject?: string;
    /**
     * Referencia a un Business Component.
     * Ejemplo: "Customer" o "Customer, Module"
     */
    businessComponent?: string;
    /** Longitud (para Character, Numeric) */
    length?: string;
    /** Decimales (para Numeric) */
    decimals?: string;
    /** Signed (true/false para Numeric) */
    signed?: boolean;
    /** Si es una colección */
    isCollection?: boolean;
    /** Path al elemento <variable> en el XML (array de índices) */
    elementPath?: number[];
    /** Categoría para agrupar en autocompletado (ej: "Local", "Parameter", "Level") */
    category?: string;
    /** Ícono opcional (nombre de codicon) */
    icon?: string;
}
/**
 * Resultado de intentar resolver un CustomType.
 * Usado para degradación elegante cuando no hay provider.
 */
export interface ResolvedCustomType {
    /** true si hay un provider disponible */
    available: boolean;
    /** Valores del dropdown (solo si available=true) */
    values?: CustomTypeValue[];
    /** Valor actual (siempre presente) */
    currentValue: string;
    /** Mensaje de error/info (solo si available=false) */
    message?: string;
    /** ID del tipo custom */
    customTypeId: string;
}
//# sourceMappingURL=PatternExtensionAPI.d.ts.map