"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSDT = createSDT;
exports.isSDT = isSDT;
exports.flattenSDTFields = flattenSDTFields;
const GXObjectType_1 = require("../types/GXObjectType");
/**
 * Crea una instancia de SDT desde datos básicos
 */
function createSDT(name, fields = [], options) {
    return {
        name,
        type: GXObjectType_1.GXObjectType.StructuredDataType,
        fields,
        ...options
    };
}
/**
 * Verifica si un objeto es un SDT
 */
function isSDT(obj) {
    return obj.type === GXObjectType_1.GXObjectType.StructuredDataType;
}
/**
 * Obtiene todos los campos de un SDT de forma plana (incluyendo anidados)
 */
function flattenSDTFields(sdt, prefix = '') {
    const result = [];
    function processFields(fields, currentPrefix) {
        for (const field of fields) {
            const path = currentPrefix ? `${currentPrefix}.${field.name}` : field.name;
            result.push({ path, field });
            if (field.isLevel && field.items) {
                processFields(field.items, path);
            }
        }
    }
    processFields(sdt.fields, prefix);
    return result;
}
//# sourceMappingURL=SDT.js.map