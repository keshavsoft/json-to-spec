/**
 * Recursively walks a JSON structure for the replace phase.
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

    const operatedNode = typeof inOperation === "function"
        ? inOperation({
            inNode: localNode,
            inContext: localContext,
            inData: localData
        })
        : localNode;

    const localOperatedNode =
        operatedNode === undefined
            ? localNode
            : operatedNode;

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

export default walk;
