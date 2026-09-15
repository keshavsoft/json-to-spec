import { interpolateValue, interpolateString } from "../value/interpolate.js";
import { injectStory } from "../story/storyInjector.js";
import { expandIterationNode } from "../iteration/expandIteration.js";

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

const applyValueBindings = ({ inNode, inItemContext, inRootData }) => {
    const clone = { ...inNode };

    if (clone.textContent) {
        clone.textContent = interpolateString({
            inText: clone.textContent,
            inItemContext,
            inRootData
        });
    }

    if (clone.attributes) {
        clone.attributes = { ...clone.attributes };
        for (const [name, value] of Object.entries(clone.attributes)) {
            if (typeof value === "string") {
                clone.attributes[name] = interpolateValue({
                    inValue: value,
                    inItemContext,
                    inRootData
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
                    inItemContext,
                    inRootData
                });
            }
        }
    }

    return clone;
};

const compileStandardNode = ({ inNode, inContext, inRootData }) => {
    const currentItem = {
        ...(typeof inContext.item === "object" ? inContext.item : {}),
        ...inContext
    };

    const withBindings = applyValueBindings({
        inNode: { ...inNode },
        inItemContext: currentItem,
        inRootData
    });

    if ("jsonToSpec" in withBindings) {
        delete withBindings.jsonToSpec;
    }

    if (withBindings.attributes) {
        const isFormField = ["input", "textarea", "select", "option"].includes(withBindings.tagName?.toLowerCase());
        if (isFormField) {
            const fieldName = currentItem.field || currentItem.columnName || currentItem.name;
            if (currentItem.value !== undefined && currentItem.value !== null) {
                withBindings.attributes.value = String(currentItem.value);
                if (withBindings.tagName === "textarea" && !withBindings.textContent) {
                    withBindings.textContent = String(currentItem.value);
                }
            } else if (fieldName && inRootData[fieldName] !== undefined && inRootData[fieldName] !== null) {
                withBindings.attributes.value = String(inRootData[fieldName]);
                if (withBindings.tagName === "textarea" && !withBindings.textContent) {
                    withBindings.textContent = String(inRootData[fieldName]);
                }
            } else if (fieldName && inRootData.values && inRootData.values[fieldName] !== undefined && inRootData.values[fieldName] !== null) {
                withBindings.attributes.value = String(inRootData.values[fieldName]);
                if (withBindings.tagName === "textarea" && !withBindings.textContent) {
                    withBindings.textContent = String(inRootData.values[fieldName]);
                }
            }
        }
    }

    const storyNode = injectStory(withBindings, inNode, currentItem, inRootData);

    if (Array.isArray(storyNode.children)) {
        const compiledChildren = [];
        for (const child of storyNode.children) {
            const childContext = child && child.__loopItemContext
                ? { ...inContext, ...child.__loopItemContext }
                : inContext;

            const compiledChild = compileNode({
                inNode: child,
                inContext: childContext,
                inRootData
            });

            if (Array.isArray(compiledChild)) {
                compiledChildren.push(...compiledChild);
            } else if (compiledChild !== null && compiledChild !== undefined) {
                compiledChildren.push(compiledChild);
            }
        }
        storyNode.children = compiledChildren;
    }

    delete storyNode.__loopItemContext;
    return storyNode;
};

export const compileNode = ({ inNode, inContext = {}, inRootData = {} } = {}) => {
    if (inNode === null || inNode === undefined) return null;

    if (Array.isArray(inNode)) {
        return compileArrayNode({
            inNode,
            inContext,
            inRootData
        });
    }

    if (typeof inNode !== "object") {
        return compilePrimitiveNode({
            inNode,
            inContext,
            inRootData
        });
    }

    const iterationResult = expandIterationNode({
        inNode,
        inContext,
        inRootData
    });

    if (iterationResult !== undefined) {
        return compileStandardNode({
            inNode: iterationResult,
            inContext,
            inRootData
        });
    }

    return compileStandardNode({
        inNode,
        inContext,
        inRootData
    });
};

export default compileNode;
