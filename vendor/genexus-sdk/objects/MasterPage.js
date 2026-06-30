"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMasterPage = createMasterPage;
exports.isMasterPage = isMasterPage;
const GXObjectType_1 = require("../types/GXObjectType");
/**
 * Crea una instancia de MasterPage desde datos básicos
 */
function createMasterPage(name, options) {
    return {
        name,
        type: GXObjectType_1.GXObjectType.MasterPage,
        ...options
    };
}
/**
 * Verifica si un objeto es una MasterPage
 */
function isMasterPage(obj) {
    return obj.type === GXObjectType_1.GXObjectType.MasterPage;
}
//# sourceMappingURL=MasterPage.js.map