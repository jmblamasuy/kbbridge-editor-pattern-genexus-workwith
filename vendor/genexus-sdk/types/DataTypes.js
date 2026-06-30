"use strict";
/**
 * Tipos de datos GeneXus
 * Equivalente a eDBType en C# (GeneXus.Types)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.eDBType = void 0;
/**
 * Enum de tipos de datos GeneXus
 */
var eDBType;
(function (eDBType) {
    eDBType["NUMERIC"] = "Numeric";
    eDBType["CHARACTER"] = "Character";
    eDBType["VARCHAR"] = "VarChar";
    eDBType["LONGVARCHAR"] = "LongVarChar";
    eDBType["DATE"] = "Date";
    eDBType["DATETIME"] = "DateTime";
    eDBType["BOOLEAN"] = "Boolean";
    eDBType["BITMAP"] = "Bitmap";
    eDBType["BLOB"] = "Blob";
    eDBType["GUID"] = "GUID";
    eDBType["OTHER"] = "Other";
})(eDBType || (exports.eDBType = eDBType = {}));
//# sourceMappingURL=DataTypes.js.map