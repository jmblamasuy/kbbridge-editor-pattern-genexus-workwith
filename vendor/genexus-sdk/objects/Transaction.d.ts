import { GXObjectType } from '../types/GXObjectType';
import { KBObject, KBAttribute, KBObjectWithAttributes } from '../model/KBObject';
/**
 * Representa una Transacción de GeneXus
 */
export interface Transaction extends KBObjectWithAttributes {
    type: GXObjectType.Transaction;
    /** Niveles de la transacción */
    levels: TransactionLevel[];
    /** Si tiene Business Component generado */
    hasBusinessComponent?: boolean;
    /** Si es externa */
    isExternal?: boolean;
}
/**
 * Nivel dentro de una transacción
 */
export interface TransactionLevel {
    /** Nombre del nivel */
    name: string;
    /** Descripción */
    description?: string;
    /** Atributos del nivel */
    attributes: KBAttribute[];
    /** Subniveles */
    sublevels?: TransactionLevel[];
    /** Si es el nivel principal */
    isMainLevel: boolean;
}
/**
 * Crea una instancia de Transaction desde datos básicos
 */
export declare function createTransaction(name: string, attributes?: KBAttribute[], options?: Partial<Omit<Transaction, 'name' | 'type' | 'attributes'>>): Transaction;
/**
 * Verifica si un objeto es una Transaction
 */
export declare function isTransaction(obj: KBObject): obj is Transaction;
//# sourceMappingURL=Transaction.d.ts.map