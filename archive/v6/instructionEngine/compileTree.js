import { interpolateValue, interpolateString } from "./interpolate.js";
import { injectStory } from "./storyInjector.js";
import resolvePath from "./resolvePath.js";

/**
 * v6 story flow:
 * 1) null/primitive values are resolved
 * 2) arrays are flattened
 * 3) iterate instructions are expanded from source data
 * 4) standard DOM nodes are compiled and interpolated
 * 5) story nodes are injected as a final narrative layer
 */
const compileArrayNode = ({ inNode, inContext, inRootData }) => {
    const flattened = [];

    for (const child of inNode) {
        const compiledChild = compileNode({
            inNode: child,
            inContext,
            inRootData
        });

        if (Array.isArray(compiledChild)) {
            flattened.push(...compiledChild);
        } else if (compiledChild !== null && compiledChild !== undefined) {
            flattened.push(compiledChild);
        }
    }

    return flattened;
};

const compilePrimitiveNode = ({ inNode, inContext, inRootData }) => {
    return interpolateString({
        inText: inNode,
        inItemContext: inContext,
        inRootData
    });
};

const resolveIterationSource = ({ inNode, inContext, inRootData }) => {
    const instruction = inNode.jsonToSpec || (inNode.operation ? inNode : null);
    if (!instruction || !(instruction.operation === "iterate" || instruction.source || instruction.$iterate)) {
        return null;
    }

    const sourceKey = instruction.source || instruction.iterateOn || instruction.$iterate;
    const rawCollection = resolvePath({ inData: inRootData, inPath: sourceKey })
        || (inRootData && inRootData[sourceKey])
        || resolvePath({ inData: inContext, inPath: sourceKey })
        || (inContext && inContext[sourceKey]);

    return {
        instruction,
        sourceKey,
        rawCollection,
        template: instruction.template || instruction.item || {}
    };
};

const applyFieldInterpolations = ({ inNode, inItemContext, inRootData }) => {
    const cloned = { ...inNode };

    if (cloned.textContent) {
        cloned.textContent = interpolateString({
            inText: cloned.textContent,
            inItemContext,
            inRootData
        });
    }

    if (cloned.attributes) {
        cloned.attributes = { ...cloned.attributes };
        for (const [attributeName, attributeValue] of Object.entries(cloned.attributes)) {
            if (typeof attributeValue === "string") {
                cloned.attributes[attributeName] = interpolateValue({
                    inValue: attributeValue,
                    inItemContext,
                    inRootData
                });
            }
        }
    }

    if (cloned.properties) {
        cloned.properties = { ...cloned.properties };
        for (const [propertyName, propertyValue] of Object.entries(cloned.properties)) {
            if (typeof propertyValue === "string") {
                cloned.properties[propertyName] = interpolateValue({
                    inValue: propertyValue,
                    inItemContext,
                    inRootData
                });
            }
        }
    }

    return cloned;
};

const compileIterationNode = ({ inNode, inContext, inRootData }) => {
    const resolvedIteration = resolveIterationSource({ inNode, inContext, inRootData });
    if (!resolvedIteration) return undefined;

    const { instruction, sourceKey, rawCollection, template } = resolvedIteration;
    if (!Array.isArray(rawCollection)) {
        if (inNode.tagName) {
            const cloned = { ...inNode };
            delete cloned.jsonToSpec;
            cloned.children = [];
            return cloned;
        }
        return [];
    }

    const filter = instruction.filter;
    const filteredCollection = rawCollection.filter(item => {
        if (!item || typeof item !== "object") return true;
        if (filter && typeof filter === "object") {
            for (const [filterKey, filterValue] of Object.entries(filter)) {
                if (item[filterKey] !== filterValue) return false;
            }
        }
        if (item.isVisible === false) return false;
        return true;
    });

    const results = [];
    filteredCollection.forEach((item, index) => {
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

        const compiledItem = compileNode({
            inNode: template,
            inContext: itemContext,
            inRootData
        });

        if (Array.isArray(compiledItem)) {
            results.push(...compiledItem);
        } else if (compiledItem !== null && compiledItem !== undefined) {
            results.push(compiledItem);
        }
    });

    if (inNode.tagName) {
        const cloned = applyFieldInterpolations({
            inNode: { ...inNode },
            inItemContext: inContext,
            inRootData
        });

        delete cloned.jsonToSpec;
        cloned.children = results;
        return cloned;
    }

    return results;
};

const compileStandardNode = ({ inNode, inContext, inRootData }) => {
    const cloned = applyFieldInterpolations({
        inNode: { ...inNode },
        inItemContext: { ...(typeof inContext.item === "object" ? inContext.item : {}), ...inContext },
        inRootData
    });

    if ("jsonToSpec" in cloned) {
        delete cloned.jsonToSpec;
    }

    const currentItem = {
        ...(typeof inContext.item === "object" ? inContext.item : {}),
        ...inContext
    };

    if (currentItem.type === "textarea" && cloned.tagName === "input") {
        cloned.tagName = "textarea";
        if (cloned.attributes) {
            cloned.attributes = { ...cloned.attributes };
            delete cloned.attributes.type;
        }
    }

    if (cloned.attributes) {
        const isFormField = ["input", "textarea", "select", "option"].includes(cloned.tagName?.toLowerCase());
        if (isFormField) {
            const fieldName = currentItem.field || currentItem.columnName || currentItem.name;
            if (currentItem.value !== undefined && currentItem.value !== null) {
                cloned.attributes.value = String(currentItem.value);
                if (cloned.tagName === "textarea" && !cloned.textContent) {
                    cloned.textContent = String(currentItem.value);
                }
            } else if (fieldName && inRootData[fieldName] !== undefined && inRootData[fieldName] !== null) {
                cloned.attributes.value = String(inRootData[fieldName]);
                if (cloned.tagName === "textarea" && !cloned.textContent) {
                    cloned.textContent = String(inRootData[fieldName]);
                }
            } else if (fieldName && inRootData.values && inRootData.values[fieldName] !== undefined && inRootData.values[fieldName] !== null) {
                cloned.attributes.value = String(inRootData.values[fieldName]);
                if (cloned.tagName === "textarea" && !cloned.textContent) {
                    cloned.textContent = String(inRootData.values[fieldName]);
                }
            }
        }
    }

    const nodeWithStory = injectStory(cloned, inNode, currentItem, inRootData);

    if (Array.isArray(nodeWithStory.children)) {
        const compiledChildren = [];
        for (const child of nodeWithStory.children) {
            const compiledChild = compileNode({
                inNode: child,
                inContext,
                inRootData
            });

            if (Array.isArray(compiledChild)) {
                compiledChildren.push(...compiledChild);
            } else if (compiledChild !== null && compiledChild !== undefined) {
                compiledChildren.push(compiledChild);
            }
        }
        nodeWithStory.children = compiledChildren;
    }

    return nodeWithStory;
};

/**
 * json-to-spec v6 recursive tree compiler.
 * The story here is simple: compile -> resolve -> expand -> render.
 */
export const compileNode = ({ inNode, inContext = {}, inRootData = {} } = {}) => {
    const localNode = inNode;
    const localContext = inContext || {};
    const localRootData = inRootData || {};

    if (localNode === null || localNode === undefined) return null;

    if (Array.isArray(localNode)) return compileArrayNode({
        inNode: localNode,
        inContext: localContext,
        inRootData: localRootData
    });

    if (typeof localNode !== "object") return compilePrimitiveNode({
        inNode: localNode,
        inContext: localContext,
        inRootData: localRootData
    });

    const iterationResult = compileIterationNode({
        inNode: localNode,
        inContext: localContext,
        inRootData: localRootData
    });

    if (iterationResult !== undefined) {
        return iterationResult;
    };

    return compileStandardNode({
        inNode: localNode,
        inContext: localContext,
        inRootData: localRootData
    });
};

export default compileNode;
