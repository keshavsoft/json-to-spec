import createChildren from "./createChildren.js";

const startFunc = ({
    inNode,
    inData, inShowLog
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    console.log("loopArray:1 ", inNode, inData);

    if (inShowLog) console.log("loopObject:1 ", inNode, inData);

    if (!("jsonToSpec" in localNode)) return;
    if (!("operation" in localNode.jsonToSpec)) return;
    if (localNode.jsonToSpec.operation !== "loopArray") return;
    if (!("source" in localNode.jsonToSpec)) return;

    const sourceValues = localData[localNode.jsonToSpec.source];

    if (!(Array.isArray(sourceValues))) return;

    if (inShowLog) console.log("loopObject:2 ", inNode, inData);

    const newChildren = createChildren({
        inTemplate: localNode.jsonToSpec.template,
        inSourceValuesAsArray: sourceValues, inShowLog
    });

    localNode.children = newChildren;
};

export default startFunc;
