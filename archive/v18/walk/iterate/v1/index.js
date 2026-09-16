import walk from "../../walk.js";

const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if ("jsonToSpec" in localNode) {

        if ("operation" in localNode?.jsonToSpec) {
            if (localNode?.jsonToSpec?.operation === "iterate") {

                if ("source" in localNode?.jsonToSpec) {
                    const sourceValues = inData[localNode?.jsonToSpec?.source];

                    const newChildren = sourceValues.map(loopColumn => {
                        const clone = structuredClone(localNode?.jsonToSpec?.template);

                        const k1 = walk({
                            inNode: clone,
                            inData: loopColumn,
                            inOperation: "replace"
                        });

                        return k1
                    });

                    localNode.children = newChildren;

                };

            };
        };
    };

    // console.log("localNode : ", localNode);

};

export default startFunc;
