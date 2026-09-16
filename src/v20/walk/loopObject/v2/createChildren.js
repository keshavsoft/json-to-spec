import walk from "../../walk.js";
import replaceWithObject from "../../replaceWithObject/v1/index.js";

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
};

const startFunc = ({
    inTemplate,
    inSourceValues, inShowLog
} = {}) => {
    const sourceValues = inSourceValues;

    if (sourceValues === undefined) return;
    if (!isPlainObject(sourceValues)) return;

    if (inShowLog) console.log("loopObject:createChildren:1 ", inTemplate, inSourceValues);

    let newChildren = [];

    for (const [key, value] of Object.entries(sourceValues)) {
        const clone = structuredClone(inTemplate);
        
        replaceWithObject({ inNode: clone, inData: { key, value } });

        newChildren.push(clone);
    };

    return newChildren;
};

export default startFunc;
