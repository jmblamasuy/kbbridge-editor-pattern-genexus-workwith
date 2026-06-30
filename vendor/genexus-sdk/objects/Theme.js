"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheme = createTheme;
exports.isTheme = isTheme;
exports.getThemeClasses = getThemeClasses;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const GXObjectType_1 = require("../types/GXObjectType");
/**
 * Crea una instancia de Theme desde datos básicos
 */
function createTheme(name, options) {
    return {
        name,
        type: GXObjectType_1.GXObjectType.Theme,
        ...options
    };
}
/**
 * Verifica si un objeto es un Theme
 */
function isTheme(obj) {
    return obj.type === GXObjectType_1.GXObjectType.Theme;
}
/**
 * Obtiene todas las clases de tema hijas de una baseClass.
 * Lee los archivos WebThemeClasses.xml o SDThemeClasses.xml de la carpeta Theme Classes.
 *
 * @param kbPath Path a la carpeta Knowledge Base
 * @param baseClass Nombre de la clase base (ej: "Button", "Attribute")
 * @param themeType "idWeb" para Web, "idSD" para Smart Device
 * @returns Array de nombres de clases ordenadas alfabéticamente (incluye la baseClass)
 */
async function getThemeClasses(kbPath, baseClass, themeType) {
    const result = [];
    // Incluir la propia baseClass
    result.push(baseClass);
    // Determinar archivo XML según themeType
    const xmlFileName = themeType === 'idWeb'
        ? 'WebThemeClasses.xml'
        : 'SDThemeClasses.xml';
    // Construir path: {kbPath}/../Theme Classes/{xmlFileName}
    const themeClassesPath = path.join(kbPath, '..', 'Theme Classes', xmlFileName);
    console.log(`[getThemeClasses] kbPath: ${kbPath}`);
    console.log(`[getThemeClasses] themeClassesPath: ${themeClassesPath}`);
    console.log(`[getThemeClasses] baseClass: ${baseClass}`);
    // Verificar si el archivo existe
    if (!fs.existsSync(themeClassesPath)) {
        console.warn(`[getThemeClasses] Archivo no encontrado: ${themeClassesPath}`);
        return result;
    }
    try {
        // Leer contenido del archivo
        const content = fs.readFileSync(themeClassesPath, 'utf-8');
        console.log(`[getThemeClasses] Archivo leído, tamaño: ${content.length} bytes`);
        // Buscar el GxBaseClass correspondiente
        // Patrón: <GxBaseClass Name="baseClass">...</GxBaseClass>
        const baseClassRegex = new RegExp(`<GxBaseClass[^>]*Name\\s*=\\s*"${escapeRegex(baseClass)}"[^>]*>([\\s\\S]*?)</GxBaseClass>`, 'i');
        const baseClassMatch = content.match(baseClassRegex);
        if (baseClassMatch) {
            const baseClassContent = baseClassMatch[1];
            console.log(`[getThemeClasses] GxBaseClass "${baseClass}" encontrado, contenido: ${baseClassContent.length} chars`);
            // Extraer todos los GxClass dentro de este GxBaseClass
            // Patrón: <GxClass Name="className" ... />
            const gxClassRegex = /<GxClass[^>]*Name\s*=\s*"([^"]+)"[^>]*\/?>/gi;
            let match;
            let count = 0;
            while ((match = gxClassRegex.exec(baseClassContent)) !== null) {
                const className = match[1];
                if (className && !result.includes(className)) {
                    result.push(className);
                    count++;
                }
            }
            console.log(`[getThemeClasses] GxClass encontrados: ${count}`);
        }
        else {
            console.warn(`[getThemeClasses] GxBaseClass "${baseClass}" NO encontrado en el archivo`);
        }
        // Ordenar alfabéticamente
        result.sort((a, b) => a.localeCompare(b));
    }
    catch (error) {
        console.error(`[getThemeClasses] Error leyendo archivo: ${error}`);
    }
    console.log(`[getThemeClasses] Total clases retornadas: ${result.length}`);
    return result;
}
/**
 * Escapa caracteres especiales de regex
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=Theme.js.map