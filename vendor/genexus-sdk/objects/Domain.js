"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDomain = createDomain;
exports.isDomain = isDomain;
exports.isDomainEnum = isDomainEnum;
const GXObjectType_1 = require("../types/GXObjectType");
/**
 * Crea una instancia de Domain desde datos básicos
 */
function createDomain(name, dataType, options) {
    return {
        name,
        type: GXObjectType_1.GXObjectType.Domain,
        dataType,
        ...options
    };
}
/**
 * Verifica si un objeto es un Domain
 */
function isDomain(obj) {
    return obj.type === GXObjectType_1.GXObjectType.Domain;
}
/**
 * Verifica si el dominio es una enumeración
 */
function isDomainEnum(domain) {
    return domain.isEnum === true && Array.isArray(domain.enumValues) && domain.enumValues.length > 0;
}
//# sourceMappingURL=Domain.js.map