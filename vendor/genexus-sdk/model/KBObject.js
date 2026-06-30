"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKBObject = createKBObject;
/**
 * Crea un objeto KBObject básico
 */
function createKBObject(name, type, options) {
    return {
        name,
        type,
        ...options
    };
}
//# sourceMappingURL=KBObject.js.map