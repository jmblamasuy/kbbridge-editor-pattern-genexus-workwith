import { GXObjectType } from '../types/GXObjectType';
import { KBObject } from '../model/KBObject';
/**
 * Campo dentro de un SDT
 */
export interface SDTField {
    /** Nombre del campo */
    name: string;
    /** Tipo de dato */
    dataType: string;
    /** Longitud (para tipos que aplica) */
    length?: number;
    /** Decimales (para numéricos) */
    decimals?: number;
    /** Si es colección */
    isCollection?: boolean;
    /** Descripción */
    description?: string;
    /** Si es un subnivel (estructura anidada) */
    isLevel?: boolean;
    /** Campos hijos (si es nivel) */
    items?: SDTField[];
}
/**
 * Representa un Structured Data Type (SDT) de GeneXus
 */
export interface SDT extends KBObject {
    type: GXObjectType.StructuredDataType;
    /** Campos del SDT */
    fields: SDTField[];
    /** Si es colección a nivel raíz */
    isCollection?: boolean;
    /** Nombre del item de colección */
    collectionItemName?: string;
}
/**
 * Crea una instancia de SDT desde datos básicos
 */
export declare function createSDT(name: string, fields?: SDTField[], options?: Partial<Omit<SDT, 'name' | 'type' | 'fields'>>): SDT;
/**
 * Verifica si un objeto es un SDT
 */
export declare function isSDT(obj: KBObject): obj is SDT;
/**
 * Obtiene todos los campos de un SDT de forma plana (incluyendo anidados)
 */
export declare function flattenSDTFields(sdt: SDT, prefix?: string): Array<{
    path: string;
    field: SDTField;
}>;
//# sourceMappingURL=SDT.d.ts.map