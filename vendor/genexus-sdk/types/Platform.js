"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_INFO = exports.Platform = void 0;
exports.isWebPlatform = isWebPlatform;
exports.isMobilePlatform = isMobilePlatform;
exports.getSpecificPlatforms = getSpecificPlatforms;
/**
 * Plataformas de generación de GeneXus
 * Equivalente a GxPlatform en PXToolsHelper (C#)
 */
var Platform;
(function (Platform) {
    /** Todas las plataformas */
    Platform["All"] = "All";
    /** Web Desktop (navegador tradicional) */
    Platform["WebDesktop"] = "WebDesktop";
    /** Web Responsive (diseño adaptativo) */
    Platform["WebResponsive"] = "WebResponsive";
    /** Smart Devices (Android, iOS) */
    Platform["SmartDevices"] = "SmartDevices";
})(Platform || (exports.Platform = Platform = {}));
/**
 * Información de todas las plataformas
 */
exports.PLATFORM_INFO = {
    [Platform.All]: {
        id: Platform.All,
        displayName: 'All Platforms',
        description: 'Configuration shared by all platforms',
        isWeb: true,
        isMobile: true
    },
    [Platform.WebDesktop]: {
        id: Platform.WebDesktop,
        displayName: 'Web Desktop',
        description: 'Traditional web browser applications',
        isWeb: true,
        isMobile: false
    },
    [Platform.WebResponsive]: {
        id: Platform.WebResponsive,
        displayName: 'Web Responsive',
        description: 'Responsive web applications',
        isWeb: true,
        isMobile: false
    },
    [Platform.SmartDevices]: {
        id: Platform.SmartDevices,
        displayName: 'Smart Devices',
        description: 'Native mobile applications (Android, iOS)',
        isWeb: false,
        isMobile: true
    }
};
/**
 * Verifica si una plataforma genera para web
 */
function isWebPlatform(platform) {
    return platform === Platform.All ||
        platform === Platform.WebDesktop ||
        platform === Platform.WebResponsive;
}
/**
 * Verifica si una plataforma genera para móvil
 */
function isMobilePlatform(platform) {
    return platform === Platform.All ||
        platform === Platform.SmartDevices;
}
/**
 * Obtiene las plataformas específicas (excluyendo All)
 */
function getSpecificPlatforms() {
    return [Platform.WebDesktop, Platform.WebResponsive, Platform.SmartDevices];
}
//# sourceMappingURL=Platform.js.map