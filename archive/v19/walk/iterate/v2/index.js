import walk from "../../walk.js";

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

    const newChildren = sourceValues.map(loopColumn => {
        const clone = structuredClone(localNode.jsonToSpec.template);

        const k1 = walk({
            inNode: clone,
            inData: loopColumn,
            inOperation: "replace"
        });

        return k1;
    });

    localNode.children = newChildren;
};

export default startFunc;
