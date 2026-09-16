import { interpolateValue, interpolateString } from "../value/interpolate.js";

const replaceArrayNode = ({ inNode, inContext, inRootData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    const flattened = [];

    for (const child of localNode) {
        const childContext = child && child.__loopItemContext
            ? { ...localContext, ...child.__loopItemContext }
            : localContext;

        const replaced = replaceNode({
            inNode: child,
            inContext: childContext,
            inRootData: localRootData
        });

        if (Array.isArray(replaced)) {
            flattened.push(...replaced);
        } else if (replaced !== null && replaced !== undefined) {
            flattened.push(replaced);
        }
    }

    return flattened;
};

const replacePrimitiveNode = ({ inNode, inContext, inRootData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    if (typeof localNode === "string") {
        return interpolateString({
            inText: localNode,
            inItemContext: localContext,
            inRootData: localRootData
        });
    }

    return localNode;
};

const replaceStandardNode = ({ inNode, inContext, inRootData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    const currentItem = {
        ...(typeof localContext.item === "object" ? localContext.item : {}),
        ...localContext,
        ...(localNode.__loopItemContext || {})
    };

    const clone = { ...localNode };

    if (clone.textContent && typeof clone.textContent === "string") {
        clone.textContent = interpolateString({
            inText: clone.textContent,
            inItemContext: currentItem,
            inRootData: localRootData
        });
    }

    if (clone.attributes) {
        clone.attributes = { ...clone.attributes };
        for (const [name, value] of Object.entries(clone.attributes)) {
            if (typeof value === "string") {
                clone.attributes[name] = interpolateValue({
                    inValue: value,
                    inItemContext: currentItem,
                    inRootData: localRootData
                });
            }
        }
    }

    if (clone.properties) {
        clone.properties = { ...clone.properties };
        for (const [name, value] of Object.entries(clone.properties)) {
            if (typeof value === "string") {
                clone.properties[name] = interpolateValue({
                    inValue: value,
                    inItemContext: currentItem,
                    inRootData: localRootData
                });
            }
        }
    }

    if (Array.isArray(clone.children)) {
        const replacedChildren = [];
        for (const child of clone.children) {
            const childContext = child && child.__loopItemContext
                ? { ...currentItem, ...child.__loopItemContext }
                : currentItem;

            const replacedChild = replaceNode({
                inNode: child,
                inContext: childContext,
                inRootData: localRootData
            });

            if (Array.isArray(replacedChild)) {
                replacedChildren.push(...replacedChild);
            } else if (replacedChild !== null && replacedChild !== undefined) {
                replacedChildren.push(replacedChild);
            }
        }
        clone.children = replacedChildren;
    }

    return clone;
};

export const replaceNode = ({ inNode, inContext = {}, inRootData = {} } = {}) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    if (localNode === null || localNode === undefined) return null;

    if (Array.isArray(localNode)) {
        return replaceArrayNode({
            inNode: localNode,
            inContext: localContext,
            inRootData: localRootData
        });
    }

    if (typeof localNode !== "object") {
        return replacePrimitiveNode({
            inNode: localNode,
            inContext: localContext,
            inRootData: localRootData
        });
    }

    return replaceStandardNode({
        inNode: localNode,
        inContext: localContext,
        inRootData: localRootData
    });
};

export const replace = (inStructureOrOptions, inData = {}) => {
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

    return replaceNode({
        inNode: localStructure,
        inContext: localContext,
        inRootData: localData
    });
};

export default replace;
