"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternInstanceElement = void 0;
exports.formatCaption = formatCaption;
/**
 * Representa un elemento (nodo) dentro de una instancia de pattern.
 * Equivalente a PatternInstanceElement en el SDK de GeneXus (C#).
 *
 * Mantiene una referencia interna al nodo XML subyacente (backing node),
 * de forma que los métodos de mutación (reorderChildren, removeChild, addChild, etc.)
 * se reflejan automáticamente en el árbol XML.
 *
 * Esto permite que los Contextual Commands (como SortVariables) muten directamente
 * el PatternInstanceElement y el visual-editor solo necesite serializar el XML resultante.
 */
class PatternInstanceElement {
    /**
     * Constructor
     * @param backingNode Nodo XML subyacente (XmlNode del visual-editor)
     * @param parent Elemento padre
     * @param index Índice dentro del padre
     * @param path Path desde la raíz como array de índices
     */
    constructor(backingNode, parent, index, path) {
        this._backingNode = backingNode;
        this.tag = backingNode.tag;
        this.attributes = { ...backingNode.attributes };
        this.text = backingNode.text;
        this.parent = parent;
        this.index = index;
        this.path = path;
        this.children = [];
    }
    // ===== Acceso al backing node =====
    /** Indica si tiene un nodo XML subyacente */
    get hasBackingNode() {
        return this._backingNode !== undefined;
    }
    /** Obtiene el backing node (para uso interno del visual-editor) */
    getBackingNode() {
        return this._backingNode;
    }
    // ===== Métodos de mutación (sincronizan PIE + XmlNode) =====
    /**
     * Reordena los hijos según un array de nuevos índices.
     * Muta AMBOS árboles (PIE y XmlNode) si hay backing node.
     *
     * @param newOrder Array donde newOrder[i] = índice original del hijo que va en posición i
     */
    reorderChildren(newOrder) {
        const origPIE = [...this.children];
        this.children = newOrder.map(i => origPIE[i]);
        if (this._backingNode) {
            const origXml = [...this._backingNode.children];
            this._backingNode.children = newOrder.map(i => origXml[i]);
        }
        this._updateChildIndices();
    }
    /**
     * Elimina un hijo por referencia.
     * Muta AMBOS árboles si hay backing node.
     */
    removeChild(child) {
        const idx = this.children.indexOf(child);
        if (idx === -1)
            return false;
        this.children.splice(idx, 1);
        if (this._backingNode && child._backingNode) {
            const xmlIdx = this._backingNode.children.indexOf(child._backingNode);
            if (xmlIdx !== -1) {
                this._backingNode.children.splice(xmlIdx, 1);
            }
        }
        child.parent = undefined;
        this._updateChildIndices();
        return true;
    }
    /**
     * Agrega un hijo en la posición indicada (o al final).
     * Muta AMBOS árboles si hay backing node.
     */
    addChild(child, insertIndex) {
        const idx = insertIndex !== undefined ? insertIndex : this.children.length;
        this.children.splice(idx, 0, child);
        child.parent = this;
        if (this._backingNode && child._backingNode) {
            this._backingNode.children.splice(idx, 0, child._backingNode);
        }
        this._updateChildIndices();
    }
    /**
     * Establece un atributo, sincronizando con el backing node.
     */
    setAttribute(name, value) {
        this.attributes[name] = value;
        if (this._backingNode) {
            this._backingNode.attributes[name] = value;
        }
    }
    // ===== Métodos de navegación (absorbidos de PatternInstanceNavigator) =====
    /**
     * Obtiene el valor de un atributo del elemento
     */
    getAttribute(name) {
        return this.attributes[name];
    }
    /**
     * Obtiene todos los hijos con el tag especificado
     */
    getChildrenByTag(childTag) {
        return this.children.filter(child => child.tag === childTag);
    }
    /**
     * Obtiene el primer hijo con el tag especificado
     */
    getFirstChildByTag(childTag) {
        return this.children.find(child => child.tag === childTag) || null;
    }
    /**
     * Obtiene todos los descendientes con el tag especificado (búsqueda recursiva)
     */
    findDescendants(tag) {
        const results = [];
        function search(el) {
            if (el.tag === tag) {
                results.push(el);
            }
            for (const child of el.children) {
                search(child);
            }
        }
        for (const child of this.children) {
            search(child);
        }
        return results;
    }
    /**
     * Verifica si el elemento tiene un ancestro con el tag especificado
     */
    hasAncestor(ancestorTag) {
        let current = this.parent;
        while (current) {
            if (current.tag === ancestorTag) {
                return true;
            }
            current = current.parent;
        }
        return false;
    }
    /**
     * Obtiene el primer ancestro con el tag especificado
     */
    findAncestor(ancestorTag) {
        let current = this.parent;
        while (current) {
            if (current.tag === ancestorTag) {
                return current;
            }
            current = current.parent;
        }
        return null;
    }
    /**
     * Encuentra un elemento descendiente por path (array de índices de hijos)
     */
    findByPath(path) {
        let current = this;
        for (const idx of path) {
            if (!current.children || idx >= current.children.length) {
                return null;
            }
            current = current.children[idx];
        }
        return current;
    }
    /**
     * Obtiene el "nivel" actual (para patterns como PXWorkWith).
     * Busca el ancestro "level" más cercano.
     */
    getCurrentLevel() {
        if (this.tag === 'level') {
            return this;
        }
        return this.findAncestor('level');
    }
    /**
     * Obtiene la transacción asociada al nivel actual
     */
    getCurrentTransaction() {
        const level = this.getCurrentLevel();
        return level ? level.getAttribute('transaction') || level.getAttribute('Transaction') || null : null;
    }
    /**
     * Verifica una expresión tipo XPath simplificada.
     * Soporta: self::*, ancestor::*, parent::*
     * Ejemplo: "self::*[@type='Work With']" o "ancestor::level[@transaction='Customer']"
     */
    evaluateCondition(condition) {
        const selfMatch = condition.match(/^self::\*\[@(\w+)=['"](.+)['"]\]$/);
        if (selfMatch) {
            const [, attrName, attrValue] = selfMatch;
            return this.attributes[attrName] === attrValue;
        }
        const ancestorMatch = condition.match(/^ancestor::(\w+)\[@(\w+)=['"](.+)['"]\]$/);
        if (ancestorMatch) {
            const [, ancestorTag, attrName, attrValue] = ancestorMatch;
            const ancestor = this.findAncestor(ancestorTag);
            return ancestor ? ancestor.attributes[attrName] === attrValue : false;
        }
        const parentMatch = condition.match(/^parent::(\w+)\[@(\w+)=['"](.+)['"]\]$/);
        if (parentMatch) {
            const [, parentTag, attrName, attrValue] = parentMatch;
            const p = this.parent;
            return p && p.tag === parentTag ? p.attributes[attrName] === attrValue : false;
        }
        // Si no coincide con ningún patrón conocido, retornar true (mostrar por defecto)
        console.warn(`[PatternInstanceElement] Condición no reconocida: ${condition}`);
        return true;
    }
    // ===== Métodos internos =====
    /** Actualiza los índices y paths de los hijos después de una mutación */
    _updateChildIndices() {
        this.children.forEach((child, i) => {
            child.index = i;
            child.path = [...this.path, i];
        });
    }
}
exports.PatternInstanceElement = PatternInstanceElement;
/**
 * Formatea un caption reemplazando placeholders {0}, {1}, etc. con valores de atributos.
 *
 * Ejemplo: formatCaption("Level ({0})", "description", { description: "Cliente" })
 *          -> "Level (Cliente)"
 *
 * @param captionTemplate Template con placeholders {0}, {1}, etc.
 * @param captionParameters Nombres de atributos separados por ";" que reemplazan los placeholders
 * @param attributes Mapa de atributos del elemento
 */
function formatCaption(captionTemplate, captionParameters, attributes) {
    if (!captionParameters) {
        return captionTemplate;
    }
    const params = captionParameters.split(';').map(p => p.trim());
    let result = captionTemplate;
    params.forEach((param, index) => {
        const value = attributes[param] || '';
        result = result.replace(`{${index}}`, value);
    });
    return result;
}
//# sourceMappingURL=PatternInstanceElement.js.map