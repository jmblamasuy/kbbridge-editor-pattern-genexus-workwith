/**
 * Tipos de objetos de GeneXus Knowledge Base
 * Equivalente a KBObjectDescriptor en el SDK de GeneXus (C#)
 */
export declare enum GXObjectType {
    Transaction = "Transaction",
    Procedure = "Procedure",
    WebPanel = "WebPanel",
    DataProvider = "DataProvider",
    BusinessComponent = "BusinessComponent",
    StructuredDataType = "StructuredDataType",
    Domain = "Domain",
    Attribute = "Attribute",
    Theme = "Theme",
    MasterPage = "MasterPage",
    WebComponent = "WebComponent",
    ExternalObject = "ExternalObject",
    Image = "Image",
    File = "File",
    Folder = "Folder",
    Module = "Module",
    PatternInstance = "PatternInstance"
}
/**
 * Categorías de objetos para filtrado
 */
export declare enum GXObjectCategory {
    /** Objetos principales (Transaction, Procedure, WebPanel, etc.) */
    Main = "Main",
    /** Definiciones de tipos (SDT, Domain, Attribute) */
    TypeDefinition = "TypeDefinition",
    /** Elementos de UI (Theme, MasterPage, WebComponent) */
    UI = "UI",
    /** Objetos externos */
    External = "External",
    /** Recursos (Image, File) */
    Resource = "Resource",
    /** Organización (Folder, Module) */
    Organization = "Organization"
}
/**
 * Mapeo de tipo de objeto a categoría
 */
export declare function getObjectCategory(type: GXObjectType): GXObjectCategory;
//# sourceMappingURL=GXObjectType.d.ts.map