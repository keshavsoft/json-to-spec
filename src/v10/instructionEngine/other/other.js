import { injectStory } from "../story/storyInjector.js";

const otherArrayNode = ({ inNode, inContext, inRootData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    const flattened = [];

    for (const child of localNode) {
        const childContext = child && child.__loopItemContext
            ? { ...localContext, ...child.__loopItemContext }
            : localContext;

        const processed = otherNode({
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

const otherStandardNode = ({ inNode, inContext, inRootData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    const currentItem = {
        ...(typeof localContext.item === "object" ? localContext.item : {}),
        ...localContext,
        ...(localNode.__loopItemContext || {})
    };

    const clone = { ...localNode };

    if (clone.attributes) {
        clone.attributes = { ...clone.attributes };
        const isFormField = ["input", "textarea", "select", "option"].includes(clone.tagName?.toLowerCase());
        if (isFormField) {
            const fieldName = currentItem.field || currentItem.columnName || currentItem.name;
            if (currentItem.value !== undefined && currentItem.value !== null) {
                clone.attributes.value = String(currentItem.value);
                if (clone.tagName === "textarea" && !clone.textContent) {
                    clone.textContent = String(currentItem.value);
                }
            } else if (fieldName && localRootData[fieldName] !== undefined && localRootData[fieldName] !== null) {
                clone.attributes.value = String(localRootData[fieldName]);
                if (clone.tagName === "textarea" && !clone.textContent) {
                    clone.textContent = String(localRootData[fieldName]);
                }
            } else if (fieldName && localRootData.values && localRootData.values[fieldName] !== undefined && localRootData.values[fieldName] !== null) {
                clone.attributes.value = String(localRootData.values[fieldName]);
                if (clone.tagName === "textarea" && !clone.textContent) {
                    clone.textContent = String(localRootData.values[fieldName]);
                }
            }
        }
    }

    const storyNode = injectStory(clone, localNode, currentItem, localRootData);

    if ("jsonToSpec" in storyNode) {
        delete storyNode.jsonToSpec;
    }

    if (Array.isArray(storyNode.children)) {
        const processedChildren = [];
        for (const child of storyNode.children) {
            const childContext = child && child.__loopItemContext
                ? { ...currentItem, ...child.__loopItemContext }
                : currentItem;

            const processedChild = otherNode({
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
        storyNode.children = processedChildren;
    }

    delete storyNode.__loopItemContext;
    return storyNode;
};

export const otherNode = ({ inNode, inContext = {}, inRootData = {} } = {}) => {
    const localNode = inNode;
    const localContext = inContext;
    const localRootData = inRootData;

    if (localNode === null || localNode === undefined) return null;

    if (Array.isArray(localNode)) {
        return otherArrayNode({
            inNode: localNode,
            inContext: localContext,
            inRootData: localRootData
        });
    }

    if (typeof localNode !== "object") {
        return localNode;
    }

    return otherStandardNode({
        inNode: localNode,
        inContext: localContext,
        inRootData: localRootData
    });
};

export const other = (inStructureOrOptions, inData = {}) => {
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

    return otherNode({
        inNode: localStructure,
        inContext: localContext,
        inRootData: localData
    });
};

export default other;
