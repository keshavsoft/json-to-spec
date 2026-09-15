
/**
 * Applies the supplied operation to the current node.
 */
const applyOperation = ({
    inNode,
    inContext = {},
    inData = {},
    inOperation
} = {}) => {
    if (typeof inOperation !== "function") {
        return inNode;
    }

    const operatedNode = inOperation({
        inNode,
        inContext,
        inData
    });

    return operatedNode === undefined
        ? inNode
        : operatedNode;
};

/**
 * Recursively walks a JSON structure.
 *
 * The walker knows only how to traverse.
 * The supplied operation decides what to do with each node.
 */
const walk = ({
    inNode,
    inContext = {},
    inData = {},
    inOperation
} = {}) => {
    const localNode = inNode;
    const localContext = inContext;
    const localData = inData;

    if (localNode === null || localNode === undefined) {
        return localNode;
    }

    if (Array.isArray(localNode)) {
        const results = [];

        for (const child of localNode) {
            const result = walk({
                inNode: child,
                inContext: localContext,
                inData: localData,
                inOperation
            });

            if (Array.isArray(result)) {
                results.push(...result);
            } else if (result !== null && result !== undefined) {
                results.push(result);
            }
        }

        return results;
    }

    if (typeof localNode !== "object") {
        return localNode;
    }

    const localOperatedNode = applyOperation({
        inNode: localNode,
        inContext: localContext,
        inData: localData,
        inOperation
    });

    if (localOperatedNode === null) {
        return null;
    }

    if (Array.isArray(localOperatedNode)) {
        return walk({
            inNode: localOperatedNode,
            inContext: localContext,
            inData: localData,
            inOperation
        });
    }

    if (typeof localOperatedNode !== "object") {
        return localOperatedNode;
    }

    const clone = { ...localOperatedNode };

    if (Array.isArray(clone.children)) {
        clone.children = walk({
            inNode: clone.children,
            inContext: localContext,
            inData: localData,
            inOperation
        });
    }

    return clone;
};

export {
    walk,
    applyOperation
};

export default walk;
