import resolvePath from "./resolvePath.js";
import { replaceNode } from "./replace.js";

/**
 * Resolves the collection array targeted by an iteration instruction.
 */
const resolveCollection = ({ inNode, inContext, inData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localData = inData;

    const instruction = localNode && (localNode.jsonToSpec || (localNode.operation ? localNode : null));
    if (!instruction) return undefined;

    const sourceKey = instruction.source || instruction.iterateOn || instruction.$iterate;
    if (!sourceKey) return undefined;

    return resolvePath({ inData: localData, inPath: sourceKey })
        || (localData && localData[sourceKey])
        || resolvePath({ inData: localContext, inPath: sourceKey })
        || (localContext && localContext[sourceKey]);
};

/**
 * Recursively binds form field values into input, textarea, select, option nodes.
 */
const bindFormValues = ({ inNode, inItem, inData }) => {
    const localNode = inNode;
    const localItem = inItem;
    const localData = inData;

    if (!localNode || typeof localNode !== "object") return localNode;

    if (localNode.attributes) {
        const isFormField = ["input", "textarea", "select", "option"].includes(localNode.tagName?.toLowerCase());
        if (isFormField) {
            const fieldName = localItem.field || localItem.columnName || localItem.name;
            if (localItem.value !== undefined && localItem.value !== null) {
                localNode.attributes.value = String(localItem.value);
                if (localNode.tagName === "textarea" && !localNode.textContent) {
                    localNode.textContent = String(localItem.value);
                }
            } else if (fieldName && localData[fieldName] !== undefined && localData[fieldName] !== null) {
                localNode.attributes.value = String(localData[fieldName]);
                if (localNode.tagName === "textarea" && !localNode.textContent) {
                    localNode.textContent = String(localData[fieldName]);
                }
            }
        }
    }

    if (Array.isArray(localNode.children)) {
        localNode.children.forEach(child => bindFormValues({ inNode: child, inItem: localItem, inData: localData }));
    }

    return localNode;
};

/**
 * Expands a single iteration directive into an array of DOM element nodes.
 */
const expandIteration = ({ inNode, inContext, inData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localData = inData;

    const instruction = localNode && (localNode.jsonToSpec || (localNode.operation ? localNode : null));
    if (!instruction) return undefined;

    const operationType = instruction.operation;
    if (operationType !== "iterate" && !instruction.source && !instruction.$iterate) {
        return undefined;
    }

    const sourceKey = instruction.source || instruction.iterateOn || instruction.$iterate;
    const collection = resolveCollection({
        inNode: localNode,
        inContext: localContext,
        inData: localData
    }) || [];

    if (!Array.isArray(collection)) {
        if (localNode && localNode.tagName) {
            const cloned = { ...localNode };
            delete cloned.jsonToSpec;
            cloned.children = [];
            return cloned;
        }
        return [];
    }

    const template = instruction.template || instruction.item || {};
    const filter = instruction.filter;

    const filtered = collection.filter(item => {
        if (!item || typeof item !== "object") return true;
        if (filter && typeof filter === "object") {
            for (const [key, value] of Object.entries(filter)) {
                if (item[key] !== value) return false;
            }
        }
        if (item.isVisible === false) return false;
        return true;
    });

    const expandedChildren = [];
    filtered.forEach((item, index) => {
        const itemContext = {
            ...localContext,
            item,
            ...(typeof item === "object" && item !== null ? item : {}),
            $index: index,
            $number: index + 1
        };

        if (sourceKey === "rows" || sourceKey.endsWith(".rows") || sourceKey === "items" || sourceKey.endsWith("Rows")) {
            itemContext.row = item;
        }

        if (localContext.row && (item.field || item.columnName || item.name)) {
            const fieldKey = item.field || item.columnName || item.name;
            const cellValue = localContext.row[fieldKey];
            if (cellValue !== undefined) {
                itemContext.cellValue = cellValue;
                itemContext.value = cellValue;
                if (typeof item === "object" && item !== null && item.value === undefined) {
                    item.value = cellValue;
                }
            }
        }

        // 1. Clone the template
        const rawTemplate = typeof template === "object" && template !== null
            ? JSON.parse(JSON.stringify(template))
            : { tagName: "span", textContent: template };

        // 2. Expand any nested iterations within the template
        const iteratedTemplate = iterateNode({
            inNode: rawTemplate,
            inContext: itemContext,
            inData: localData
        });

        // 3. Replace item-level tokens in the template
        const replacedTemplate = replaceNode({
            inNode: iteratedTemplate,
            inContext: itemContext,
            inData: localData
        });

        bindFormValues({
            inNode: replacedTemplate,
            inItem: item,
            inData: localData
        });

        if (Array.isArray(replacedTemplate)) {
            expandedChildren.push(...replacedTemplate);
        } else if (replacedTemplate !== null && replacedTemplate !== undefined) {
            expandedChildren.push(replacedTemplate);
        }
    });

    // If jsonToSpec was a sibling on a container node (e.g. <div class="row" jsonToSpec="...">)
    if (localNode && localNode.tagName) {
        const cloned = { ...localNode };
        delete cloned.jsonToSpec;
        cloned.children = expandedChildren;
        return cloned;
    }

    return expandedChildren;
};

/**
 * Recursively walks a JSON tree and resolves all jsonToSpec iteration directives.
 */
export const iterateNode = ({ inNode, inContext = {}, inData = {} } = {}) => {
    const localNode = inNode;
    const localContext = inContext;
    const localData = inData;

    if (localNode === null || localNode === undefined) return localNode;

    if (Array.isArray(localNode)) {
        const flattened = [];
        for (const child of localNode) {
            const processed = iterateNode({
                inNode: child,
                inContext: localContext,
                inData: localData
            });

            if (Array.isArray(processed)) {
                flattened.push(...processed);
            } else if (processed !== null && processed !== undefined) {
                flattened.push(processed);
            }
        }
        return flattened;
    }

    if (typeof localNode !== "object") {
        return localNode;
    }

    // Check if current node is or has an iteration directive
    const iterationResult = expandIteration({
        inNode: localNode,
        inContext: localContext,
        inData: localData
    });

    if (iterationResult !== undefined) {
        return iterationResult;
    }

    // Standard node: recursively process children
    const clone = { ...localNode };

    if (Array.isArray(clone.children)) {
        const processedChildren = [];
        for (const child of clone.children) {
            const processed = iterateNode({
                inNode: child,
                inContext: localContext,
                inData: localData
            });

            if (Array.isArray(processed)) {
                processedChildren.push(...processed);
            } else if (processed !== null && processed !== undefined) {
                processedChildren.push(processed);
            }
        }
        clone.children = processedChildren;
    }

    return clone;
};

/**
 * Main iterate/operation function: (structure, data) -> expanded JSON specification
 */
export const iterate = (inStructureOrOptions, inData = {}) => {
    let localStructure = inStructureOrOptions;
    let localData = inData;
    let localContext = {};

    if (inStructureOrOptions && typeof inStructureOrOptions === "object" && !Array.isArray(inStructureOrOptions)) {
        if ("inStructure" in inStructureOrOptions || "inTree" in inStructureOrOptions || "inNode" in inStructureOrOptions) {
            localStructure = inStructureOrOptions.inStructure || inStructureOrOptions.inTree || inStructureOrOptions.inNode;
            localData = inStructureOrOptions.inData || localData;
            localContext = inStructureOrOptions.inContext || localContext;
        } else if ("structure" in inStructureOrOptions) {
            localStructure = inStructureOrOptions.structure;
            localData = inStructureOrOptions.data || localData;
            localContext = inStructureOrOptions.context || localContext;
        }
    }

    return iterateNode({
        inNode: localStructure,
        inContext: localContext,
        inData: localData
    });
};

export const operation = iterate;
export default iterate;
