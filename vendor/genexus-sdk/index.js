"use strict";
/**
 * GeneXus SDK
 *
 * SDK para desarrolladores de patterns GeneXus.
 * Provee acceso al modelo de la Knowledge Base y utilidades para navegación de instancias de pattern.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternEditorCommandBase = exports.CommandState = exports.formatCaption = exports.PatternInstanceElement = exports.isMasterPage = exports.createMasterPage = exports.isDomainEnum = exports.isDomain = exports.createDomain = exports.getThemeClasses = exports.isTheme = exports.createTheme = exports.flattenSDTFields = exports.isSDT = exports.createSDT = exports.isTransaction = exports.createTransaction = exports.createKBObject = exports.eDBType = exports.getSpecificPlatforms = exports.isMobilePlatform = exports.isWebPlatform = exports.PLATFORM_INFO = exports.Platform = exports.getObjectCategory = exports.GXObjectCategory = exports.GXObjectType = void 0;
// ============================================================================
// Types
// ============================================================================
var GXObjectType_1 = require("./types/GXObjectType");
Object.defineProperty(exports, "GXObjectType", { enumerable: true, get: function () { return GXObjectType_1.GXObjectType; } });
Object.defineProperty(exports, "GXObjectCategory", { enumerable: true, get: function () { return GXObjectType_1.GXObjectCategory; } });
Object.defineProperty(exports, "getObjectCategory", { enumerable: true, get: function () { return GXObjectType_1.getObjectCategory; } });
var Platform_1 = require("./types/Platform");
Object.defineProperty(exports, "Platform", { enumerable: true, get: function () { return Platform_1.Platform; } });
Object.defineProperty(exports, "PLATFORM_INFO", { enumerable: true, get: function () { return Platform_1.PLATFORM_INFO; } });
Object.defineProperty(exports, "isWebPlatform", { enumerable: true, get: function () { return Platform_1.isWebPlatform; } });
Object.defineProperty(exports, "isMobilePlatform", { enumerable: true, get: function () { return Platform_1.isMobilePlatform; } });
Object.defineProperty(exports, "getSpecificPlatforms", { enumerable: true, get: function () { return Platform_1.getSpecificPlatforms; } });
var DataTypes_1 = require("./types/DataTypes");
Object.defineProperty(exports, "eDBType", { enumerable: true, get: function () { return DataTypes_1.eDBType; } });
// ============================================================================
// Model
// ============================================================================
var KBObject_1 = require("./model/KBObject");
Object.defineProperty(exports, "createKBObject", { enumerable: true, get: function () { return KBObject_1.createKBObject; } });
// ============================================================================
// Objects
// ============================================================================
var Transaction_1 = require("./objects/Transaction");
Object.defineProperty(exports, "createTransaction", { enumerable: true, get: function () { return Transaction_1.createTransaction; } });
Object.defineProperty(exports, "isTransaction", { enumerable: true, get: function () { return Transaction_1.isTransaction; } });
var SDT_1 = require("./objects/SDT");
Object.defineProperty(exports, "createSDT", { enumerable: true, get: function () { return SDT_1.createSDT; } });
Object.defineProperty(exports, "isSDT", { enumerable: true, get: function () { return SDT_1.isSDT; } });
Object.defineProperty(exports, "flattenSDTFields", { enumerable: true, get: function () { return SDT_1.flattenSDTFields; } });
var Theme_1 = require("./objects/Theme");
Object.defineProperty(exports, "createTheme", { enumerable: true, get: function () { return Theme_1.createTheme; } });
Object.defineProperty(exports, "isTheme", { enumerable: true, get: function () { return Theme_1.isTheme; } });
Object.defineProperty(exports, "getThemeClasses", { enumerable: true, get: function () { return Theme_1.getThemeClasses; } });
var Domain_1 = require("./objects/Domain");
Object.defineProperty(exports, "createDomain", { enumerable: true, get: function () { return Domain_1.createDomain; } });
Object.defineProperty(exports, "isDomain", { enumerable: true, get: function () { return Domain_1.isDomain; } });
Object.defineProperty(exports, "isDomainEnum", { enumerable: true, get: function () { return Domain_1.isDomainEnum; } });
var MasterPage_1 = require("./objects/MasterPage");
Object.defineProperty(exports, "createMasterPage", { enumerable: true, get: function () { return MasterPage_1.createMasterPage; } });
Object.defineProperty(exports, "isMasterPage", { enumerable: true, get: function () { return MasterPage_1.isMasterPage; } });
// ============================================================================
// Patterns
// ============================================================================
var PatternInstanceElement_1 = require("./patterns/PatternInstanceElement");
Object.defineProperty(exports, "PatternInstanceElement", { enumerable: true, get: function () { return PatternInstanceElement_1.PatternInstanceElement; } });
Object.defineProperty(exports, "formatCaption", { enumerable: true, get: function () { return PatternInstanceElement_1.formatCaption; } });
var PatternExtensionAPI_1 = require("./patterns/PatternExtensionAPI");
// Comandos de editor - Extensibilidad (Sprint 10)
Object.defineProperty(exports, "CommandState", { enumerable: true, get: function () { return PatternExtensionAPI_1.CommandState; } });
Object.defineProperty(exports, "PatternEditorCommandBase", { enumerable: true, get: function () { return PatternExtensionAPI_1.PatternEditorCommandBase; } });
//# sourceMappingURL=index.js.map