import walk from "../../walk.js";

const startFunc = ({
    inTemplate,
    inSourceValues, inShowLog
} = {}) => {
    const sourceValues = inSourceValues;

    if (sourceValues === undefined) return;

    if (inShowLog) console.log("loopObject:createChildren:1 ", inTemplate, inSourceValues);

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

export default startFunc;
