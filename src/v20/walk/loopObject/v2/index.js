import createChildren from "./createChildren.js";

const startFunc = ({
    inNode,
    inData, inShowLog
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if (inShowLog) console.log("loopObject:1 ", inNode, inData);

    if (!("jsonToSpec" in localNode)) return;
    if (!("operation" in localNode.jsonToSpec)) return;
    if (localNode.jsonToSpec.operation !== "loopObject") return;
    if (!("source" in localNode.jsonToSpec)) return;

    if (inShowLog) console.log("loopObject:2 ", inNode, inData);

    const sourceValues = localData[localNode.jsonToSpec.source];

    const newChildren = createChildren({
        inTemplate: localNode.jsonToSpec.template,
        inSourceValues: sourceValues, inShowLog
    });

    localNode.children = newChildren;
};

export default startFunc;
