import walk from "../../walk.js";

const createChildren = ({
    inTemplate,
    inSourceValues,
} = {}) => {
    const sourceValues = inSourceValues;

    const newChildren = sourceValues.map(loopColumn => {
        const clone = structuredClone(inTemplate);

        const walkResult = walk({
            inNode: clone,
            inData: loopColumn,
            inOperation: "replace"
        });

        return walkResult;
    });

    return newChildren;
};

const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if (!("jsonToSpec" in localNode)) return;
    if (!("operation" in localNode.jsonToSpec)) return;
    if (localNode.jsonToSpec.operation !== "iterate") return;
    if (!("source" in localNode.jsonToSpec)) return;

    const sourceValues = localData[localNode.jsonToSpec.source];

    const newChildren = createChildren({
        inTemplate: localNode.jsonToSpec.template,
        inSourceValues: sourceValues,
    });

    localNode.children = newChildren;
};

export default startFunc;
