"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GXObjectCategory = exports.GXObjectType = void 0;
exports.getObjectCategory = getObjectCategory;
/**
 * Tipos de objetos de GeneXus Knowledge Base
 * Equivalente a KBObjectDescriptor en el SDK de GeneXus (C#)
 */
var GXObjectType;
(function (GXObjectType) {
    // Objetos principales
    GXObjectType["Transaction"] = "Transaction";
    GXObjectType["Procedure"] = "Procedure";
    GXObjectType["WebPanel"] = "WebPanel";
    GXObjectType["DataProvider"] = "DataProvider";
    GXObjectType["BusinessComponent"] = "BusinessComponent";
    // Tipos de datos
    GXObjectType["StructuredDataType"] = "StructuredDataType";
    GXObjectType["Domain"] = "Domain";
    GXObjectType["Attribute"] = "Attribute";
    // UI
    GXObjectType["Theme"] = "Theme";
    GXObjectType["MasterPage"] = "MasterPage";
    GXObjectType["WebComponent"] = "WebComponent";
    // External Objects
    GXObjectType["ExternalObject"] = "ExternalObject";
    // Otros
    GXObjectType["Image"] = "Image";
    GXObjectType["File"] = "File";
    GXObjectType["Folder"] = "Folder";
    GXObjectType["Module"] = "Module";
    // Patterns
    GXObjectType["PatternInstance"] = "PatternInstance";
})(GXObjectType || (exports.GXObjectType = GXObjectType = {}));
/**
 * Categorías de objetos para filtrado
 */
var GXObjectCategory;
(function (GXObjectCategory) {
    /** Objetos principales (Transaction, Procedure, WebPanel, etc.) */
    GXObjectCategory["Main"] = "Main";
    /** Definiciones de tipos (SDT, Domain, Attribute) */
    GXObjectCategory["TypeDefinition"] = "TypeDefinition";
    /** Elementos de UI (Theme, MasterPage, WebComponent) */
    GXObjectCategory["UI"] = "UI";
    /** Objetos externos */
    GXObjectCategory["External"] = "External";
    /** Recursos (Image, File) */
    GXObjectCategory["Resource"] = "Resource";
    /** Organización (Folder, Module) */
    GXObjectCategory["Organization"] = "Organization";
})(GXObjectCategory || (exports.GXObjectCategory = GXObjectCategory = {}));
/**
 * Mapeo de tipo de objeto a categoría
 */
function getObjectCategory(type) {
    switch (type) {
        case GXObjectType.Transaction:
        case GXObjectType.Procedure:
        case GXObjectType.WebPanel:
        case GXObjectType.DataProvider:
        case GXObjectType.BusinessComponent:
            return GXObjectCategory.Main;
        case GXObjectType.StructuredDataType:
        case GXObjectType.Domain:
        case GXObjectType.Attribute:
            return GXObjectCategory.TypeDefinition;
        case GXObjectType.Theme:
        case GXObjectType.MasterPage:
        case GXObjectType.WebComponent:
            return GXObjectCategory.UI;
        case GXObjectType.ExternalObject:
            return GXObjectCategory.External;
        case GXObjectType.Image:
        case GXObjectType.File:
            return GXObjectCategory.Resource;
        case GXObjectType.Folder:
        case GXObjectType.Module:
            return GXObjectCategory.Organization;
        default:
            return GXObjectCategory.Main;
    }
}
//# sourceMappingURL=GXObjectType.js.map