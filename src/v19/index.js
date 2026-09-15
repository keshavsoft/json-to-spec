import registerGlobal from "./registerGlobal.js";
import meta from "./meta.js";
/**
 * json-to-spec v11
 *
 * Minimalist 2-Layer Specification Compiler:
 * 1. replace: Pure ${...} token replacement across JSON structures.
 * 2. iterate: Evaluates jsonToSpec operations, expanding collections into clean children.
 */

import { replace } from "./replace.js";

/**
 * Main compiler entry point:
 * 1. Replace values: replace(structure, data)
 * 2. Iterate/Operate: iterate(replacedStructure, data)
 */
export const compile = (inStructureOrOptions, inData = {}, inShowLog = false) => {
    let localStructure = inStructureOrOptions;
    let localData = inData;

    if (inShowLog) console.log(meta.name, localStructure, localData);

    try {
        const iteratedData = replace({
            inStructureAsJson: localStructure,
            inDataAsJson: localData,
            inOperation: "iterateDo",
            inShowLog
        });

        const replacedData = replace({
            inStructureAsJson: iteratedData,
            inDataAsJson: localData,
            inOperation: "replace",
            inShowLog
        });

        if (inShowLog) console.log("iteratedData : ", iteratedData, replacedData);

        // const spec = iterate({
        //     inStructure: replaced,
        //     inData: localData
        // });

        return replacedData;
    } catch (err) {
        console.error("[json-to-spec/v19] compile error:", err);
        throw err;
    }
};

registerGlobal(compile);

export default compile;