import { GXObjectType } from '../types/GXObjectType';
import { KBObject } from '../model/KBObject';
/**
 * Clase de tema (ThemeClass)
 */
export interface ThemeClass {
    /** Nombre de la clase */
    name: string;
    /** Descripción */
    description?: string;
    /** Clase padre (si hereda) */
    parentClass?: string;
    /** Propiedades CSS/estilos */
    properties?: Record<string, string>;
}
/**
 * Representa un Theme de GeneXus
 */
export interface Theme extends KBObject {
    type: GXObjectType.Theme;
    /** Clases del tema */
    classes?: ThemeClass[];
    /** Si es tema base */
    isBaseTheme?: boolean;
    /** Tema padre (si hereda) */
    parentTheme?: string;
}
/**
 * Crea una instancia de Theme desde datos básicos
 */
export declare function createTheme(name: string, options?: Partial<Omit<Theme, 'name' | 'type'>>): Theme;
/**
 * Verifica si un objeto es un Theme
 */
export declare function isTheme(obj: KBObject): obj is Theme;
/**
 * Obtiene todas las clases de tema hijas de una baseClass.
 * Lee los archivos WebThemeClasses.xml o SDThemeClasses.xml de la carpeta Theme Classes.
 *
 * @param kbPath Path a la carpeta Knowledge Base
 * @param baseClass Nombre de la clase base (ej: "Button", "Attribute")
 * @param themeType "idWeb" para Web, "idSD" para Smart Device
 * @returns Array de nombres de clases ordenadas alfabéticamente (incluye la baseClass)
 */
export declare function getThemeClasses(kbPath: string, baseClass: string, themeType: 'idWeb' | 'idSD'): Promise<string[]>;
//# sourceMappingURL=Theme.d.ts.map