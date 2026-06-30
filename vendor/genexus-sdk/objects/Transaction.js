"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = createTransaction;
exports.isTransaction = isTransaction;
const GXObjectType_1 = require("../types/GXObjectType");
/**
 * Crea una instancia de Transaction desde datos básicos
 */
function createTransaction(name, attributes = [], options) {
    return {
        name,
        type: GXObjectType_1.GXObjectType.Transaction,
        attributes,
        levels: options?.levels || [{
                name: name,
                attributes,
                isMainLevel: true
            }],
        ...options
    };
}
/**
 * Verifica si un objeto es una Transaction
 */
function isTransaction(obj) {
    return obj.type === GXObjectType_1.GXObjectType.Transaction;
}
//# sourceMappingURL=Transaction.js.map