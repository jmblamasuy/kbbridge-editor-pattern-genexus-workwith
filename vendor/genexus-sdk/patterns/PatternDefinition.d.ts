/**
 * Pattern Definition Interfaces
 *
 * Estas interfaces representan la estructura de los archivos de definición de patterns
 * de GeneXus (ej: PXWorkWithInstance.xml).
 */
/**
 * Definición de un tipo de elemento en el pattern.
 * Parseado del archivo XML de definición (ej: PXWorkWithInstance.xml).
 */
export interface ElementTypeDefinition {
    /** Nombre del ElementType (ej: "Level", "Grid") */
    name: string;
    /** Caption template (ej: "Level ({0})") */
    caption?: string;
    /** Parámetros para el caption (nombres de atributos separados por ;) */
    captionParameters?: string;
    /** Ícono por defecto */
    icon?: string;
    /**
     * Tipo de ordenamiento de hijos:
     * - "Sequence": Los hijos deben respetar el orden de declaración en el schema.
     *               Si Multiple=false, el elemento no puede moverse.
     *               Si Multiple=true, solo puede moverse entre elementos del mismo tipo.
     * - "Mixed": Los hijos pueden estar en cualquier orden (comportamiento por defecto).
     */
    childrenType?: 'Sequence' | 'Mixed';
    /** Atributos/propiedades del elemento */
    attributes: AttributeDefinition[];
    /** Elementos hijos permitidos */
    childElements: ChildElementDefinition[];
}
/**
 * Definición de un atributo/propiedad de un ElementType.
 */
export interface AttributeDefinition {
    /** Nombre del atributo */
    name: string;
    /** Nombre alternativo para mostrar en UI (PrettyName del XML) */
    prettyName?: string;
    /** Tipo de dato (ej: "string", "bool", "enum{A;B;C}", "custom(Theme)") */
    type: string;
    /** Categoría para agrupar en Properties Panel */
    category?: string;
    /** Descripción */
    description?: string;
    /** Valor por defecto */
    defaultValue?: string;
    /** Expresión XPath para calcular el valor por defecto dinámicamente (tiene prioridad sobre defaultValue) */
    defaultValueFrom?: string;
    /** Si es visible en el editor */
    visible?: boolean;
    /** Condición de visibilidad (ej: "type=WorkWith") */
    visibleIf?: string;
    /** Si es requerido (NotNull) */
    required?: boolean;
    /** Orden de display */
    order?: number;
    /**
     * Cómo se serializa el valor en el XML del .gxPattern. Determinado por
     * el atributo `Serialization` del schema XML del pattern (ej.
     * `PXWorkWithInstance.xml`).
     *
     * - `'Attribute'` (default): `<elementType propName="value" />`
     * - `'CDATA'`: `<elementType ...><![CDATA[value]]></elementType>`
     *   — máximo uno por ElementType (un nodo XML tiene un solo body).
     * - `'Element'`: `<elementType ...><propName>value</propName>...</elementType>`
     *   — la property es un sub-nodo con plain text. Pueden coexistir varias.
     */
    serialization?: 'Attribute' | 'CDATA' | 'Element';
}
/**
 * Definición de un elemento hijo permitido.
 */
export interface ChildElementDefinition {
    /** Nombre del elemento (tag) */
    name: string;
    /** Tipo de elemento (referencia a ElementType) */
    elementType: string;
    /** Si puede haber múltiples instancias */
    multiple?: boolean;
    /** Si es opcional */
    optional?: boolean;
    /** Orden de display */
    order?: number;
}
/**
 * Definición completa de un pattern.
 * Resultado de parsear el archivo .Pattern y su InstanceSpecification.
 */
export interface PatternDefinition {
    /** Nombre del pattern (ej: "PXWorkWith") */
    name: string;
    /** Elemento raíz (ej: "instance") */
    rootElement: string;
    /** Tipo del elemento raíz (referencia a ElementType) */
    rootType: string;
    /** Definiciones de todos los ElementTypes */
    elementTypes: Map<string, ElementTypeDefinition>;
    /** Path al archivo de definición */
    definitionPath: string;
    /** Versión del pattern (si está disponible) */
    version?: string;
    /** Ícono del pattern (para el nodo raíz) */
    icon?: string;
}
//# sourceMappingURL=PatternDefinition.d.ts.map