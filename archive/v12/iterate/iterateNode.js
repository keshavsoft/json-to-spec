import expandIteration from "./expandIteration.js";

/**
 * Recursively walks a JSON structure and resolves
 * jsonToSpec iteration directives.
 */
const iterateNode = ({
    inNode,
    inContext = {},
    inData = {}
} = {}) => {
    const localNode = inNode;
    const localContext = inContext;
    const localData = inData;

    if (localNode === null || localNode === undefined) {
        return localNode;
    }

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
            } else if (
                processed !== null &&
                processed !== undefined
            ) {
                flattened.push(processed);
            }
        }

        return flattened;
    }

    if (typeof localNode !== "object") {
        return localNode;
    }

    const iterationResult = expandIteration({
        inNode: localNode,
        inContext: localContext,
        inData: localData,
        iterateNode
    });

    if (iterationResult !== undefined) {
        return iterationResult;
    }

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
            } else if (
                processed !== null &&
                processed !== undefined
            ) {
                processedChildren.push(processed);
            }
        }

        clone.children = processedChildren;
    }

    return clone;
};

export default iterateNode;