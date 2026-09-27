import replaceWithArray from "../../replaceWithArray/v1/index.js";
import walk from "../../walk.js";

const startFunc = ({
    inTemplate,
    inSourceValuesAsArray, inShowLog
} = {}) => {
    const sourceValues = inSourceValuesAsArray;

    if (sourceValues === undefined) return;
    if (!(Array.isArray(sourceValues))) return;

    if (inShowLog) console.log("loopObject:createChildren:1 ", inTemplate, inSourceValues);

    let newChildren = [];

    sourceValues.forEach(element => {
        const clone = structuredClone(inTemplate);

        if ("jsonToSpec" in clone) {
            const source = clone?.jsonToSpec?.source;

            let data = {};

            data[source] = element;
            //this walk func will insert to inNode only to children is the spec right
            walk({
                inNode: clone,
                inData: data, inOperation: clone?.jsonToSpec?.operation,
                inShowLog
            });
        };

        walk({
            inNode: clone,
            inData: element, inOperation: "replace",
            inShowLog
        });

        replaceWithArray({ inNode: clone, inData: element });

        newChildren.push(clone);
    });

    return newChildren;
};

export default startFunc;
