import resolvePath from "../resolve/resolvePath.js";

const resolveCollection = ({ inNode, inContext, inRootData }) => {
    const instruction = inNode && inNode.jsonToSpec;
    if (!instruction) return undefined;

    const sourceKey = instruction.source || instruction.iterateOn || instruction.$iterate;
    if (!sourceKey) return undefined;

    return resolvePath({ inData: inRootData, inPath: sourceKey })
        || (inRootData && inRootData[sourceKey])
        || resolvePath({ inData: inContext, inPath: sourceKey })
        || (inContext && inContext[sourceKey]);
};

export const expandIterationNode = ({ inNode, inContext = {}, inRootData = {} }) => {
    const instruction = inNode && inNode.jsonToSpec;
    if (!instruction) return undefined;

    const operation = instruction.operation;
    if (operation !== "iterate" && !instruction.source && !instruction.$iterate) {
        return undefined;
    }

    const sourceKey = instruction.source || instruction.iterateOn || instruction.$iterate;
    const collection = resolveCollection({ inNode, inContext, inRootData }) || [];

    if (!Array.isArray(collection)) {
        if (inNode && inNode.tagName) {
            const cloned = { ...inNode };
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
            ...inContext,
            item,
            ...(typeof item === "object" && item !== null ? item : {}),
            $index: index,
            $number: index + 1
        };

        if (sourceKey === "rows" || sourceKey.endsWith(".rows") || sourceKey === "items" || sourceKey.endsWith("Rows")) {
            itemContext.row = item;
        }

        if (inContext.row && (item.field || item.columnName || item.name)) {
            const fieldKey = item.field || item.columnName || item.name;
            const cellValue = inContext.row[fieldKey];
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

        expandedChildren.push(templateNode);
    });

    if (inNode && inNode.tagName) {
        const cloned = { ...inNode };
        delete cloned.jsonToSpec;
        cloned.children = expandedChildren;
        return cloned;
    }

    return expandedChildren;
};

export default expandIterationNode;
