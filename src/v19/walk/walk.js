import replaceWithData from "./replaceWithData/v3/index.js";
import iterateDo from "./iterate/v4/index.js";

const forArray = ({ inNode, inData, inOperation }) => {
    const localNode = inNode;
    const localData = inData;
    const localOperation = inOperation;

    // console.log("forArray : ", inNode, inOperation);

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
    inOperation,
    inShowLog = false
} = {}) => {
    const localNode = inNode;
    const localData = inData;
    const localOperation = inOperation;

    if (inShowLog) console.log("walk ", inNode, inData, inOperation);
    // debugger
    if (localNode === null || localNode === undefined) {
        return localNode;
    };

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
                // console.log("yyyyyyyyyy :", typeof localNode === "object");
                replaceWithData({
                    inNode: localNode,
                    inData
                });
            };
            break;
        case "iterateDo":
            iterateDo({
                inNode: localNode,
                inData: localData, inShowLog
            });
        default:
            break;
    };

    return localNode;
};

export default walk;
