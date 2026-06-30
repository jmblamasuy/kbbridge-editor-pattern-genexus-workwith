import { GXObjectType } from '../types/GXObjectType';
/**
 * Interfaz base para objetos de la Knowledge Base
 * Equivalente a KBObject en el SDK de GeneXus (C#)
 */
export interface KBObject {
    /** Nombre del objeto */
    name: string;
    /** Tipo del objeto */
    type: GXObjectType;
    /** GUID único del objeto (si está disponible) */
    guid?: string;
    /** Descripción del objeto */
    description?: string;
    /** Módulo al que pertenece */
    module?: string;
    /** Ruta al archivo fuente (si existe) */
    sourcePath?: string;
}
/**
 * Interfaz para objetos con propiedades
 */
export interface KBObjectWithProperties extends KBObject {
    /** Propiedades del objeto */
    properties: Record<string, any>;
}
/**
 * Interfaz para objetos que contienen atributos (Transaction)
 */
export interface KBObjectWithAttributes extends KBObject {
    /** Atributos del objeto */
    attributes: KBAttribute[];
}
/**
 * Interfaz para atributos de GeneXus
 */
export interface KBAttribute {
    /** Nombre del atributo */
    name: string;
    /** Descripción */
    description?: string;
    /** Tipo de dato */
    dataType: string;
    /** Longitud (para tipos que aplica) */
    length?: number;
    /** Decimales (para numéricos) */
    decimals?: number;
    /** Si es firmado (para numéricos) */
    signed?: boolean;
    /** Si es clave primaria */
    isKey?: boolean;
    /** Si permite nulos */
    nullable?: boolean;
    /** Dominio base (si aplica) */
    basedOn?: string;
    /** Fórmula (si es calculado) */
    formula?: string;
}
/**
 * Interfaz para variables de GeneXus
 */
export interface KBVariable {
    /** Nombre de la variable (sin &) */
    name: string;
    /** Tipo de dato */
    dataType: string;
    /** Longitud (para tipos que aplica) */
    length?: number;
    /** Decimales (para numéricos) */
    decimals?: number;
    /** Si es firmado (para numéricos) */
    signed?: boolean;
    /** Si es colección */
    isCollection?: boolean;
    /** Basado en (Attribute o Domain) */
    basedOn?: string;
    /** Descripción */
    description?: string;
}
/**
 * Crea un objeto KBObject básico
 */
export declare function createKBObject(name: string, type: GXObjectType, options?: Partial<Omit<KBObject, 'name' | 'type'>>): KBObject;
//# sourceMappingURL=KBObject.d.ts.map