import { GXObjectType } from '../types/GXObjectType';
import { KBObject } from '../model/KBObject';
/**
 * Valor de enumeración para dominios enum
 */
export interface DomainEnumValue {
    /** Nombre del valor */
    name: string;
    /** Valor interno */
    value: string | number;
    /** Descripción */
    description?: string;
}
/**
 * Representa un Domain de GeneXus
 */
export interface Domain extends KBObject {
    type: GXObjectType.Domain;
    /** Tipo de dato base */
    dataType: string;
    /** Longitud (para tipos que aplica) */
    length?: number;
    /** Decimales (para numéricos) */
    decimals?: number;
    /** Si es firmado (para numéricos) */
    signed?: boolean;
    /** Si es enumeración */
    isEnum?: boolean;
    /** Valores de enumeración (si isEnum=true) */
    enumValues?: DomainEnumValue[];
    /** Valor por defecto */
    defaultValue?: string;
    /** Reglas de validación */
    validationRules?: string[];
}
/**
 * Crea una instancia de Domain desde datos básicos
 */
export declare function createDomain(name: string, dataType: string, options?: Partial<Omit<Domain, 'name' | 'type' | 'dataType'>>): Domain;
/**
 * Verifica si un objeto es un Domain
 */
export declare function isDomain(obj: KBObject): obj is Domain;
/**
 * Verifica si el dominio es una enumeración
 */
export declare function isDomainEnum(domain: Domain): boolean;
//# sourceMappingURL=Domain.d.ts.map