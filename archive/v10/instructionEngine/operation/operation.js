import resolvePath from "../resolve/resolvePath.js";

const resolveCollection = ({ inNode, inContext, inRootData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    const instruction = localNode && (localNode.jsonToSpec || (localNode.operation ? localNode : null));
    if (!instruction) return undefined;

    const sourceKey = instruction.source || instruction.iterateOn || instruction.$iterate;
    if (!sourceKey) return undefined;

    return resolvePath({ inData: localRootData, inPath: sourceKey })
        || (localRootData && localRootData[sourceKey])
        || resolvePath({ inData: localContext, inPath: sourceKey })
        || (localContext && localContext[sourceKey]);
};

const expandSingleIteration = ({ inNode, inContext, inRootData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

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
        inRootData: localRootData
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

        const templateNode = typeof template === "object" && template !== null
            ? { ...template, __loopItemContext: itemContext }
            : { tagName: "span", textContent: template, __loopItemContext: itemContext };

        const expandedItem = operationNode({
            inNode: templateNode,
            inContext: itemContext,
            inRootData: localRootData
        });

        if (Array.isArray(expandedItem)) {
            expandedChildren.push(...expandedItem);
        } else if (expandedItem !== null && expandedItem !== undefined) {
            expandedChildren.push(expandedItem);
        }
    });

    if (localNode && localNode.tagName) {
        const cloned = { ...localNode };
        delete cloned.jsonToSpec;
        cloned.children = expandedChildren;
        return cloned;
    }

    return expandedChildren;
};

const operationArrayNode = ({ inNode, inContext, inRootData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    const flattened = [];

    for (const child of localNode) {
        const childContext = child && child.__loopItemContext
            ? { ...localContext, ...child.__loopItemContext }
            : localContext;

        const processed = operationNode({
            inNode: child,
            inContext: childContext,
            inRootData: localRootData
        });

        if (Array.isArray(processed)) {
            flattened.push(...processed);
        } else if (processed !== null && processed !== undefined) {
            flattened.push(processed);
        }
    }

    return flattened;
};

const operationStandardNode = ({ inNode, inContext, inRootData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    const cloned = { ...localNode };

    if (Array.isArray(cloned.children)) {
        const processedChildren = [];
        for (const child of cloned.children) {
            const childContext = child && child.__loopItemContext
                ? { ...localContext, ...child.__loopItemContext }
                : localContext;

            const processedChild = operationNode({
                inNode: child,
                inContext: childContext,
                inRootData: localRootData
            });

            if (Array.isArray(processedChild)) {
                processedChildren.push(...processedChild);
            } else if (processedChild !== null && processedChild !== undefined) {
                processedChildren.push(processedChild);
            }
        }
        cloned.children = processedChildren;
    }

    return cloned;
};

export const operationNode = ({ inNode, inContext = {}, inRootData = {} } = {}) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    if (localNode === null || localNode === undefined) return null;

    if (Array.isArray(localNode)) {
        return operationArrayNode({
            inNode: localNode,
            inContext: localContext,
            inRootData: localRootData
        });
    }

    if (typeof localNode !== "object") {
        return localNode;
    }

    const iterationResult = expandSingleIteration({
        inNode: localNode,
        inContext: localContext,
        inRootData: localRootData
    });

    if (iterationResult !== undefined) {
        return iterationResult;
    }

    return operationStandardNode({
        inNode: localNode,
        inContext: localContext,
        inRootData: localRootData
    });
};

export const operation = (inStructureOrOptions, inData = {}) => {
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

    return operationNode({
        inNode: localStructure,
        inContext: localContext,
        inRootData: localData
    });
};

export default operation;
