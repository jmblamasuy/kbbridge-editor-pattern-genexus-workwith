/**
 * Interfaz mínima que describe un nodo XML de backing.
 * XmlNode del visual-editor satisface esta interfaz estructuralmente (duck typing).
 */
export interface PatternXmlNode {
    tag: string;
    attributes: Record<string, string>;
    children: PatternXmlNode[];
    text?: string;
}
/**
 * Representa un elemento (nodo) dentro de una instancia de pattern.
 * Equivalente a PatternInstanceElement en el SDK de GeneXus (C#).
 *
 * Mantiene una referencia interna al nodo XML subyacente (backing node),
 * de forma que los métodos de mutación (reorderChildren, removeChild, addChild, etc.)
 * se reflejan automáticamente en el árbol XML.
 *
 * Esto permite que los Contextual Commands (como SortVariables) muten directamente
 * el PatternInstanceElement y el visual-editor solo necesite serializar el XML resultante.
 */
export declare class PatternInstanceElement {
    /** Tag/nombre del elemento XML */
    tag: string;
    /**
     * ElementType del XML de definición del pattern.
     * Es diferente del tag: el tag es el nombre del nodo en el XML de instancia,
     * mientras que elementType es el tipo definido en PXWorkWithInstance.xml.
     */
    elementType?: string;
    /**
     * Atributos del elemento (propiedades).
     * Se inicializa como COPIA del backing node para no contaminar el XML
     * con DefaultValues del schema. Para sincronizar cambios con el backing node
     * usar setAttribute().
     */
    attributes: Record<string, string>;
    /** Elementos hijos */
    children: PatternInstanceElement[];
    /** Elemento padre (undefined si es raíz) */
    parent?: PatternInstanceElement;
    /** Path desde la raíz como array de índices */
    path: number[];
    /** Índice dentro del padre */
    index: number;
    /** Contenido de texto del elemento (si tiene) */
    text?: string;
    /** Referencia al nodo XML subyacente */
    private _backingNode?;
    /**
     * Constructor
     * @param backingNode Nodo XML subyacente (XmlNode del visual-editor)
     * @param parent Elemento padre
     * @param index Índice dentro del padre
     * @param path Path desde la raíz como array de índices
     */
    constructor(backingNode: PatternXmlNode, parent: PatternInstanceElement | undefined, index: number, path: number[]);
    /** Indica si tiene un nodo XML subyacente */
    get hasBackingNode(): boolean;
    /** Obtiene el backing node (para uso interno del visual-editor) */
    getBackingNode(): PatternXmlNode | undefined;
    /**
     * Reordena los hijos según un array de nuevos índices.
     * Muta AMBOS árboles (PIE y XmlNode) si hay backing node.
     *
     * @param newOrder Array donde newOrder[i] = índice original del hijo que va en posición i
     */
    reorderChildren(newOrder: number[]): void;
    /**
     * Elimina un hijo por referencia.
     * Muta AMBOS árboles si hay backing node.
     */
    removeChild(child: PatternInstanceElement): boolean;
    /**
     * Agrega un hijo en la posición indicada (o al final).
     * Muta AMBOS árboles si hay backing node.
     */
    addChild(child: PatternInstanceElement, insertIndex?: number): void;
    /**
     * Establece un atributo, sincronizando con el backing node.
     */
    setAttribute(name: string, value: string): void;
    /**
     * Obtiene el valor de un atributo del elemento
     */
    getAttribute(name: string): string | undefined;
    /**
     * Obtiene todos los hijos con el tag especificado
     */
    getChildrenByTag(childTag: string): PatternInstanceElement[];
    /**
     * Obtiene el primer hijo con el tag especificado
     */
    getFirstChildByTag(childTag: string): PatternInstanceElement | null;
    /**
     * Obtiene todos los descendientes con el tag especificado (búsqueda recursiva)
     */
    findDescendants(tag: string): PatternInstanceElement[];
    /**
     * Verifica si el elemento tiene un ancestro con el tag especificado
     */
    hasAncestor(ancestorTag: string): boolean;
    /**
     * Obtiene el primer ancestro con el tag especificado
     */
    findAncestor(ancestorTag: string): PatternInstanceElement | null;
    /**
     * Encuentra un elemento descendiente por path (array de índices de hijos)
     */
    findByPath(path: number[]): PatternInstanceElement | null;
    /**
     * Obtiene el "nivel" actual (para patterns como PXWorkWith).
     * Busca el ancestro "level" más cercano.
     */
    getCurrentLevel(): PatternInstanceElement | null;
    /**
     * Obtiene la transacción asociada al nivel actual
     */
    getCurrentTransaction(): string | null;
    /**
     * Verifica una expresión tipo XPath simplificada.
     * Soporta: self::*, ancestor::*, parent::*
     * Ejemplo: "self::*[@type='Work With']" o "ancestor::level[@transaction='Customer']"
     */
    evaluateCondition(condition: string): boolean;
    /** Actualiza los índices y paths de los hijos después de una mutación */
    private _updateChildIndices;
}
/**
 * Información de una instancia de pattern completa
 */
export interface PatternInstance {
    /** Nombre de la instancia */
    name: string;
    /** Tipo de pattern (PXWorkWith, PXParameterRequest, etc.) */
    instanceType: string;
    /** Propiedades de la instancia (del header) */
    properties: Record<string, string>;
    /** Elemento raíz del árbol XML */
    rootElement: PatternInstanceElement;
    /** Path al archivo .gxPattern */
    filePath: string;
}
/**
 * Formatea un caption reemplazando placeholders {0}, {1}, etc. con valores de atributos.
 *
 * Ejemplo: formatCaption("Level ({0})", "description", { description: "Cliente" })
 *          -> "Level (Cliente)"
 *
 * @param captionTemplate Template con placeholders {0}, {1}, etc.
 * @param captionParameters Nombres de atributos separados por ";" que reemplazan los placeholders
 * @param attributes Mapa de atributos del elemento
 */
export declare function formatCaption(captionTemplate: string, captionParameters: string | undefined, attributes: Record<string, string>): string;
//# sourceMappingURL=PatternInstanceElement.d.ts.map