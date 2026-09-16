const replaceWithData = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if ("textContent" in inNode) {
        if (inNode.textContent.includes("${")) {
            const dataKey = inNode.textContent
                .replace(/^\$\{/, "")
                .replace(/\}$/, "");

            if (dataKey.includes(".")) {
                const keysOfArray = dataKey.split(".");

                const value = keysOfArray.reduce(
                    (current, key) => current?.[key],
                    inData
                );

                inNode.textContent = value;
            };
        };
    };
};

const forArray = ({ inNode, inData }) => {
    const localNode = inNode;
    const localData = inData;

    if (Array.isArray(localNode)) {
        const results = [];

        for (const child of localNode) {
            const result = walk({
                inNode: child,
                inData
            });

            if (Array.isArray(result)) {
                results.push(...result);
            } else if (result !== null && result !== undefined) {
                results.push(result);
            };
        };

        return results;
    };
};

/**
 * Recursively walks a JSON structure.
 *
 * The walker knows only how to traverse.
 * The supplied operation decides what to do with each node.
 */
const walk = ({
    inNode,
    inData = {},
    inOperation
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if (localNode === null || localNode === undefined) {
        return localNode;
    }

    if (Array.isArray(localNode)) {
        return forArray({ inNode: localNode, inData });
    };

    if ("children" in localNode) {
        if (Array.isArray(localNode?.children)) {
            localNode.children = forArray({
                inNode: localNode?.children,
                inData
            });
        };
    };

    if (typeof localNode !== "object") {
        return localNode;
    };

    if (typeof localNode === "object") {
        replaceWithData({ inNode, inData });
    };

    return localNode;
};

export {
    walk
};

export default walk;
