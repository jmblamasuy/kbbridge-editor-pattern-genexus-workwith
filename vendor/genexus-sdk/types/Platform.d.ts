/**
 * Plataformas de generación de GeneXus
 * Equivalente a GxPlatform en PXToolsHelper (C#)
 */
export declare enum Platform {
    /** Todas las plataformas */
    All = "All",
    /** Web Desktop (navegador tradicional) */
    WebDesktop = "WebDesktop",
    /** Web Responsive (diseño adaptativo) */
    WebResponsive = "WebResponsive",
    /** Smart Devices (Android, iOS) */
    SmartDevices = "SmartDevices"
}
/**
 * Información de una plataforma
 */
export interface PlatformInfo {
    /** Identificador de la plataforma */
    id: Platform;
    /** Nombre para mostrar */
    displayName: string;
    /** Descripción */
    description: string;
    /** Si genera para web */
    isWeb: boolean;
    /** Si genera para móvil */
    isMobile: boolean;
}
/**
 * Información de todas las plataformas
 */
export declare const PLATFORM_INFO: Record<Platform, PlatformInfo>;
/**
 * Verifica si una plataforma genera para web
 */
export declare function isWebPlatform(platform: Platform): boolean;
/**
 * Verifica si una plataforma genera para móvil
 */
export declare function isMobilePlatform(platform: Platform): boolean;
/**
 * Obtiene las plataformas específicas (excluyendo All)
 */
export declare function getSpecificPlatforms(): Platform[];
//# sourceMappingURL=Platform.d.ts.map