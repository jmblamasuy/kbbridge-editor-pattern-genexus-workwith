import { GXObjectType } from '../types/GXObjectType';
import { KBObject } from '../model/KBObject';
import { Platform } from '../types/Platform';
/**
 * Representa una MasterPage de GeneXus
 */
export interface MasterPage extends KBObject {
    type: GXObjectType.MasterPage;
    /** Plataforma para la que aplica */
    platform?: Platform;
    /** Si es la master page por defecto */
    isDefault?: boolean;
    /** Tema asociado */
    theme?: string;
    /** Content placeholders definidos */
    contentPlaceholders?: string[];
}
/**
 * Crea una instancia de MasterPage desde datos básicos
 */
export declare function createMasterPage(name: string, options?: Partial<Omit<MasterPage, 'name' | 'type'>>): MasterPage;
/**
 * Verifica si un objeto es una MasterPage
 */
export declare function isMasterPage(obj: KBObject): obj is MasterPage;
//# sourceMappingURL=MasterPage.d.ts.map