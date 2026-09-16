import replaceWithArray from "../../replaceWithArray/v1/index.js";

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

        replaceWithArray({ inNode: clone, inData: element });

        newChildren.push(clone);
    });

    return newChildren;
};

export default startFunc;
