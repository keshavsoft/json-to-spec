import resolvePath from "./resolvePath.js";

/**
 * Resolves a token path against local item context first, then root data.
 */
const resolveTokenValue = ({ inPath, inItemContext, inRootData }) => {
    const localPath = inPath;
    const localItemContext = inItemContext;
    const localRootData = inRootData;

    let val = resolvePath({ inData: localItemContext, inPath: localPath });
    if (val === undefined && localItemContext && typeof localItemContext === "object") {
        if (localItemContext.item && typeof localItemContext.item === "object") {
            val = resolvePath({ inData: localItemContext.item, inPath: localPath });
        }
        if (val === undefined && localItemContext.row && typeof localItemContext.row === "object") {
            val = resolvePath({ inData: localItemContext.row, inPath: localPath });
        }
    }
    if (val === undefined && localRootData) {
        val = resolvePath({ inData: localRootData, inPath: localPath });
    }

    return val;
};

/**
 * Interpolates tokenized values, preserving native types for exact-token matches.
 */
const interpolateValue = ({ inValue, inItemContext, inRootData }) => {
    const localValue = inValue;
    const localItemContext = inItemContext;
    const localRootData = inRootData;

    if (typeof localValue !== "string" || !localValue.includes("${")) {
        return localValue;
    }

    const exactTokenMatch = localValue.match(/^\$\{([^}]+)\}$/);
    if (exactTokenMatch) {
        const tokenValue = resolveTokenValue({
            inPath: exactTokenMatch[1].trim(),
            inItemContext: localItemContext,
            inRootData: localRootData
        });

        return tokenValue !== undefined && tokenValue !== null ? tokenValue : "";
    }

    return localValue.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        const tokenValue = resolveTokenValue({
            inPath: expr.trim(),
            inItemContext: localItemContext,
            inRootData: localRootData
        });

        return tokenValue !== undefined && tokenValue !== null ? String(tokenValue) : "";
    });
};

/**
 * Interpolates ${path} variables against local item context and root data payload.
 */
const interpolateString = ({ inText, inItemContext, inRootData }) => {
    const interpolatedValue = interpolateValue({
        inValue: inText,
        inItemContext,
        inRootData
    });

    return interpolatedValue !== undefined && interpolatedValue !== null
        ? String(interpolatedValue)
        : "";
};

/**
 * json-to-spec v3 Recursive Tree Compiler Engine:
 * Traverses JSON trees, resolving namespaced `jsonToSpec` operations and dynamic data bindings.
 * 
 * @param {Object} inArgs
 * @param {Object|Array} inArgs.inNode - The tree node to compile
 * @param {Object} [inArgs.inContext] - Internal loop/item context
 * @param {Object} [inArgs.inRootData] - Root data payload
 * @returns {Object|Array} - Compiled 100% pure JSON specification ready for json-to-dom
 */
export const compileNode = ({ inNode, inContext = {}, inRootData = {} } = {}) => {
    const localNode = inNode;
    const localContext = inContext || {};
    const localRootData = inRootData || {};

    if (localNode === null || localNode === undefined) return null;

    // Handle array of nodes: compile each child and flatten
    if (Array.isArray(localNode)) {
        const flattened = [];
        for (const child of localNode) {
            const compiledChild = compileNode({
                inNode: child,
                inContext: localContext,
                inRootData: localRootData
            });
            if (Array.isArray(compiledChild)) {
                flattened.push(...compiledChild);
            } else if (compiledChild !== null && compiledChild !== undefined) {
                flattened.push(compiledChild);
            }
        }
        return flattened;
    }

    if (typeof localNode !== "object") {
        return interpolateString({
            inText: localNode,
            inItemContext: localContext,
            inRootData: localRootData
        });
    }

    // -------------------------------------------------------------------------
    // v3 Namespaced Instruction Check: node.jsonToSpec (or legacy node.operation)
    // -------------------------------------------------------------------------
    const specInstruction = localNode.jsonToSpec || (localNode.operation ? localNode : null);

    if (specInstruction && (specInstruction.operation === "iterate" || specInstruction.source || specInstruction.$iterate)) {
        const sourceKey = specInstruction.source || specInstruction.iterateOn || specInstruction.$iterate;
        const rawCollection = resolvePath({ inData: localRootData, inPath: sourceKey })
            || (localRootData && localRootData[sourceKey])
            || resolvePath({ inData: localContext, inPath: sourceKey })
            || (localContext && localContext[sourceKey]);

        if (!Array.isArray(rawCollection)) {
            if (localNode.tagName) {
                const cloned = { ...localNode };
                delete cloned.jsonToSpec;
                cloned.children = [];
                return cloned;
            }
            return [];
        }

        const template = specInstruction.template || specInstruction.item || {};
        const filter = specInstruction.filter;

        // Filter collection if filter rules are provided
        const filteredCollection = rawCollection.filter(item => {
            if (!item || typeof item !== "object") return true;
            if (filter && typeof filter === "object") {
                for (const [filterKey, filterVal] of Object.entries(filter)) {
                    if (item[filterKey] !== filterVal) return false;
                }
            }
            // Skip isVisible: false by default
            if (item.isVisible === false) return false;
            return true;
        });

        // Stamp out each item from the collection
        const results = [];
        filteredCollection.forEach((item, index) => {
            const itemContext = {
                ...localContext,
                item,
                ...(typeof item === "object" && item !== null ? item : {}),
                $index: index,
                $number: index + 1
            };

            // If iterating over rows/items collection, expose row context
            if (sourceKey === "rows" || sourceKey.endsWith(".rows") || sourceKey === "items" || sourceKey.endsWith("Rows")) {
                itemContext.row = item;
            }

            // If a parent row exists and current item is a column, bind cell value
            if (localContext.row && (item.field || item.columnName || item.name)) {
                const fieldKey = item.field || item.columnName || item.name;
                const cellVal = localContext.row[fieldKey];
                if (cellVal !== undefined) {
                    itemContext.cellValue = cellVal;
                    itemContext.value = cellVal;
                    if (typeof item === "object" && item !== null && item.value === undefined) {
                        item.value = cellVal;
                    }
                }
            }

            const compiledItem = compileNode({
                inNode: template,
                inContext: itemContext,
                inRootData: localRootData
            });

            if (Array.isArray(compiledItem)) {
                results.push(...compiledItem);
            } else if (compiledItem !== null && compiledItem !== undefined) {
                results.push(compiledItem);
            }
        });

        // If defined on a DOM container (e.g. <div class="row"> or <tbody> with jsonToSpec)
        if (localNode.tagName) {
            const cloned = { ...localNode };
            delete cloned.jsonToSpec;
            cloned.children = results;

            // Interpolate any textContent or attributes on container itself
            if (cloned.textContent) {
                cloned.textContent = interpolateString({
                    inText: cloned.textContent,
                    inItemContext: localContext,
                    inRootData: localRootData
                });
            }

            if (cloned.attributes) {
                cloned.attributes = { ...cloned.attributes };
                for (const [attrName, attrVal] of Object.entries(cloned.attributes)) {
                    if (typeof attrVal === "string") {
                        cloned.attributes[attrName] = interpolateValue({
                            inValue: attrVal,
                            inItemContext: localContext,
                            inRootData: localRootData
                        });
                    }
                }
            }

            if (cloned.properties) {
                cloned.properties = { ...cloned.properties };
                for (const [propertyName, propertyVal] of Object.entries(cloned.properties)) {
                    if (typeof propertyVal === "string") {
                        cloned.properties[propertyName] = interpolateValue({
                            inValue: propertyVal,
                            inItemContext: localContext,
                            inRootData: localRootData
                        });
                    }
                }
            }

            return cloned;
        }

        // Pure instruction block (e.g. inside children array): return flattened results
        return results;
    }

    // -------------------------------------------------------------------------
    // Standard DOM Node Compilation
    // -------------------------------------------------------------------------
    const cloned = { ...localNode };
    if ("jsonToSpec" in cloned) {
        delete cloned.jsonToSpec;
    }

    const currentItem = {
        ...(typeof localContext.item === "object" ? localContext.item : {}),
        ...localContext
    };

    // Handle control transformation (e.g. textarea)
    if (currentItem.type === "textarea" && cloned.tagName === "input") {
        cloned.tagName = "textarea";
        if (cloned.attributes) {
            cloned.attributes = { ...cloned.attributes };
            delete cloned.attributes.type;
        }
    }

    if (cloned.textContent) {
        cloned.textContent = interpolateString({
            inText: cloned.textContent,
            inItemContext: currentItem,
            inRootData: localRootData
        });
    }

    if (cloned.attributes) {
        cloned.attributes = { ...cloned.attributes };
        for (const [attrName, attrVal] of Object.entries(cloned.attributes)) {
            if (typeof attrVal === "string") {
                cloned.attributes[attrName] = interpolateValue({
                    inValue: attrVal,
                    inItemContext: currentItem,
                    inRootData: localRootData
                });
            }
        }

        // Bind data value to form controls if matching field name exists or item has value
        const isFormField = ["input", "textarea", "select", "option"].includes(cloned.tagName?.toLowerCase());
        if (isFormField) {
            const fieldName = currentItem.field || currentItem.columnName || currentItem.name;
            if (currentItem.value !== undefined && currentItem.value !== null) {
                cloned.attributes.value = String(currentItem.value);
                if (cloned.tagName === "textarea" && !cloned.textContent) {
                    cloned.textContent = String(currentItem.value);
                }
            } else if (fieldName && localRootData[fieldName] !== undefined && localRootData[fieldName] !== null) {
                cloned.attributes.value = String(localRootData[fieldName]);
                if (cloned.tagName === "textarea" && !cloned.textContent) {
                    cloned.textContent = String(localRootData[fieldName]);
                }
            } else if (fieldName && localRootData.values && localRootData.values[fieldName] !== undefined && localRootData.values[fieldName] !== null) {
                cloned.attributes.value = String(localRootData.values[fieldName]);
                if (cloned.tagName === "textarea" && !cloned.textContent) {
                    cloned.textContent = String(localRootData.values[fieldName]);
                }
            }
        }
    }

    if (cloned.properties) {
        cloned.properties = { ...cloned.properties };
        for (const [propertyName, propertyVal] of Object.entries(cloned.properties)) {
            if (typeof propertyVal === "string") {
                cloned.properties[propertyName] = interpolateValue({
                    inValue: propertyVal,
                    inItemContext: currentItem,
                    inRootData: localRootData
                });
            }
        }
    }

    // Recursively compile children
    if (Array.isArray(cloned.children)) {
        const compiledChildren = [];
        for (const child of cloned.children) {
            const compiledChild = compileNode({
                inNode: child,
                inContext: localContext,
                inRootData: localRootData
            });
            if (Array.isArray(compiledChild)) {
                compiledChildren.push(...compiledChild);
            } else if (compiledChild !== null && compiledChild !== undefined) {
                compiledChildren.push(compiledChild);
            }
        }
        cloned.children = compiledChildren;
    }

    return cloned;
};

export default compileNode;
