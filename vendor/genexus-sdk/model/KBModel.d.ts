import { GXObjectType } from '../types/GXObjectType';
import { KBObject, KBAttribute, KBVariable } from './KBObject';
/**
 * Opciones de búsqueda de objetos
 */
export interface SearchOptions {
    /** Filtrar por tipo de objeto */
    type?: GXObjectType;
    /** Filtrar por módulo */
    module?: string;
    /** Límite de resultados */
    limit?: number;
    /** Si incluir descripción en la búsqueda */
    includeDescription?: boolean;
}
/**
 * Resultado de búsqueda con metadatos
 */
export interface SearchResult<T extends KBObject> {
    /** Objetos encontrados */
    items: T[];
    /** Total de resultados (puede ser mayor que items.length si hay límite) */
    total: number;
    /** Si hay más resultados disponibles */
    hasMore: boolean;
}
/**
 * Interfaz principal para acceder al modelo de la Knowledge Base
 *
 * Esta interfaz abstrae el acceso a los objetos de GeneXus.
 * En el contexto de VSCode, se implementa usando CacheManager de genexus-language-core-lib.
 *
 * Equivalente a KBModel/IKBModel en el SDK de GeneXus (C#)
 */
export interface KBModel {
    /**
     * Busca objetos por nombre (parcial o completo)
     * @param query Texto a buscar
     * @param options Opciones de búsqueda
     */
    searchObjects(query: string, options?: SearchOptions): Promise<SearchResult<KBObject>>;
    /**
     * Obtiene un objeto por nombre exacto
     * @param name Nombre del objeto
     * @param type Tipo de objeto (opcional, mejora performance)
     */
    getObject(name: string, type?: GXObjectType): Promise<KBObject | null>;
    /**
     * Obtiene un objeto por GUID
     * @param guid GUID del objeto
     */
    getObjectByGuid(guid: string): Promise<KBObject | null>;
    /**
     * Obtiene todos los objetos de un tipo
     * @param type Tipo de objeto
     */
    getObjectsByType(type: GXObjectType): Promise<KBObject[]>;
    /**
     * Obtiene los atributos de una transacción
     * @param transactionName Nombre de la transacción
     */
    getTransactionAttributes(transactionName: string): Promise<KBAttribute[]>;
    /**
     * Obtiene las variables de un objeto
     * @param objectName Nombre del objeto
     * @param objectType Tipo del objeto
     */
    getObjectVariables(objectName: string, objectType?: GXObjectType): Promise<KBVariable[]>;
    /**
     * Obtiene todos los temas disponibles
     */
    getThemes(): Promise<KBObject[]>;
    /**
     * Obtiene todos los SDTs disponibles
     */
    getSDTs(): Promise<KBObject[]>;
    /**
     * Obtiene todos los dominios disponibles
     */
    getDomains(): Promise<KBObject[]>;
    /**
     * Obtiene todas las transacciones disponibles
     */
    getTransactions(): Promise<KBObject[]>;
    /**
     * Obtiene todas las MasterPages disponibles
     */
    getMasterPages(): Promise<KBObject[]>;
    /**
     * Verifica si el modelo está disponible/conectado
     */
    isAvailable(): boolean;
    /**
     * Refresca el cache del modelo (si aplica)
     */
    refresh(): Promise<void>;
}
/**
 * Interfaz para proveer acceso al KBModel
 * Usado por extensiones para registrar su implementación
 */
export interface KBModelProvider {
    /**
     * Obtiene la instancia del KBModel
     * @param workspacePath Path del workspace (opcional)
     */
    getModel(workspacePath?: string): KBModel | null;
}
//# sourceMappingURL=KBModel.d.ts.map