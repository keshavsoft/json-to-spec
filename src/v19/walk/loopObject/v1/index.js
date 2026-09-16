import createChildren from "./createChildren.js";

const startFunc = ({
    inNode,
    inData, inShowLog
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
        inSourceValues: sourceValues, inShowLog
    });

    localNode.children = newChildren;
};

export default startFunc;
