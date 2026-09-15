import resolveCollection from "./resolveCollection.js";
import bindFormValues from "./bindFormValues.js";
import { replaceNode } from "../replace.js";

/**
 * Expands a single iteration directive into an array of
 * specification nodes.
 */
const expandIteration = ({
    inNode,
    inContext,
    inData,
    walk
}) => {
    const localNode = inNode;
    const localContext = inContext;
    const localData = inData;

    const instruction = localNode && (
        localNode.jsonToSpec ||
        (localNode.operation ? localNode : null)
    );

    if (!instruction) return undefined;

    const operationType = instruction.operation;

    if (
        operationType !== "iterate" &&
        !instruction.source &&
        !instruction.$iterate
    ) {
        return undefined;
    }

    const sourceKey =
        instruction.source ||
        instruction.iterateOn ||
        instruction.$iterate;

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

    const template =
        instruction.template ||
        instruction.item ||
        {};

    const filter = instruction.filter;

    const filtered = collection.filter(item => {
        if (!item || typeof item !== "object") {
            return true;
        }

        if (filter && typeof filter === "object") {
            for (const [key, value] of Object.entries(filter)) {
                if (item[key] !== value) {
                    return false;
                }
            }
        }

        if (item.isVisible === false) {
            return false;
        }

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

        if (
            sourceKey === "rows" ||
            sourceKey.endsWith(".rows") ||
            sourceKey === "items" ||
            sourceKey.endsWith("Rows")
        ) {
            itemContext.row = item;
        }

        if (
            localContext.row &&
            (item.field || item.columnName || item.name)
        ) {
            const fieldKey =
                item.field ||
                item.columnName ||
                item.name;

            const cellValue = localContext.row[fieldKey];

            if (cellValue !== undefined) {
                itemContext.cellValue = cellValue;
                itemContext.value = cellValue;

                if (
                    typeof item === "object" &&
                    item !== null &&
                    item.value === undefined
                ) {
                    item.value = cellValue;
                }
            }
        }

        const rawTemplate =
            typeof template === "object" &&
                template !== null
                ? JSON.parse(JSON.stringify(template))
                : {
                    tagName: "span",
                    textContent: template
                };

        const iteratedTemplate = walk({
            inNode: rawTemplate,
            inContext: itemContext,
            inData: localData,
            inOperation: ({ inNode, inContext, inData }) => {
                return expandIteration({
                    inNode,
                    inContext,
                    inData,
                    walk
                });
            }
        });

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
        } else if (
            replacedTemplate !== null &&
            replacedTemplate !== undefined
        ) {
            expandedChildren.push(replacedTemplate);
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

export default expandIteration;