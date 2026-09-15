import walk from "../../walk.js";

const startFunc = ({
    inTemplate,
    inSourceValues,
} = {}) => {
    const sourceValues = inSourceValues;
    // console.log(" inTemplate----------- :", inTemplate, inSourceValues);

    if (sourceValues === undefined) return;

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
