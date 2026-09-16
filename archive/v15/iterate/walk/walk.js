const replaceCommonFunc = ({ inData, inDataKey }) => {
    const dataKey = inDataKey;

    let valueToReturn = inData[dataKey];

    if (dataKey.includes(".")) {
        const keysOfArray = dataKey.split(".");

        const value = keysOfArray.reduce(
            (current, key) => current?.[key],
            inData
        );

        valueToReturn = value;
    };

    return valueToReturn;
};

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

            inNode.textContent = replaceCommonFunc({ inData, inDataKey: dataKey });

            const attributes = Object.fromEntries(
                Object.entries(inNode.attributes || {}).map(([key, value]) => [
                    key,
                    typeof value === "string" && value.includes("${")
                        ? replaceCommonFunc({
                            inData,
                            inDataKey: value
                                .replace(/^\$\{/, "")
                                .replace(/\}$/, "")
                        })
                        : value
                ])
            );
            inNode.attributes = { ...attributes };

            // inNode.textContent = inData[dataKey];
            // console.log("attributes : ", inNode);

            // if (dataKey.includes(".")) {
            //     const keysOfArray = dataKey.split(".");

            //     const value = keysOfArray.reduce(
            //         (current, key) => current?.[key],
            //         inData
            //     );

            //     inNode.textContent = value;
            // };
        };
    };
};

const iterateDo = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if ("jsonToSpec" in localNode) {

        if ("operation" in localNode?.jsonToSpec) {
            if (localNode?.jsonToSpec?.operation === "iterate") {

                if ("source" in localNode?.jsonToSpec) {
                    if (localNode?.jsonToSpec?.source === "columns") {
                        // console.log("ggggggggg :", localNode.jsonToSpec, localData);

                        const columns = inData[localNode?.jsonToSpec?.source];

                        // console.log("jjjjjjjj : ", columns);

                        const newChildren = columns.map(loopColumn => {
                            const clone = structuredClone(localNode?.jsonToSpec?.template);

                            const k1 = walk({
                                inNode: clone,
                                inData: loopColumn,
                                inOperation: "replace"
                            });

                            return k1
                        });

                        localNode.children = newChildren;

                            // console.log("newChildren : ", newChildren);
                    };
                };

            };
        };
    };
};

const forArray = ({ inNode, inData, inOperation }) => {
    const localNode = inNode;
    const localData = inData;
    const localOperation = inOperation;

    if (Array.isArray(localNode)) {
        const results = [];

        for (const child of localNode) {
            const result = walk({
                inNode: child,
                inData, inOperation: localOperation
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
    const localOperation = inOperation;
    // debugger
    if (localNode === null || localNode === undefined) {
        return localNode;
    }

    if (Array.isArray(localNode)) {
        return forArray({
            inNode: localNode, inData,
            inOperation: localOperation
        });
    };

    if ("children" in localNode) {
        if (Array.isArray(localNode?.children)) {
            localNode.children = forArray({
                inNode: localNode?.children,
                inData, inOperation: localOperation
            });
        };
    };

    if (typeof localNode !== "object") {
        return localNode;
    };

    // console.log("localOperation :", localOperation);

    switch (localOperation) {
        case "replace":
            if (typeof localNode === "object") {
                replaceWithData({ inNode, inData });
            };
            break;
        case "iterateDo":
            iterateDo({ inNode, inData });
        default:
            break;
    };

    return localNode;
};

export {
    walk
};

export default walk;
