/**
 * json-to-spec v11
 *
 * Minimalist 2-Layer Specification Compiler:
 * 1. replace: Pure ${...} token replacement across JSON structures.
 * 2. iterate: Evaluates jsonToSpec operations, expanding collections into clean children.
 */

import { replace } from "./replace.js";

export const meta = {
    version: "18.0.0",
    name: "json-to-spec/v17",
    description: "Minimalist 2-layer compiler: pure value replace + jsonToSpec iterate"
};

/**
 * Main compiler entry point:
 * 1. Replace values: replace(structure, data)
 * 2. Iterate/Operate: iterate(replacedStructure, data)
 */
export const compile = (inStructureOrOptions, inData = {}) => {
    let localStructure = inStructureOrOptions;
    let localData = inData;

    console.log("ccccccccccccc-------- : ", localData);

    try {
        const iteratedData = replace({
            inStructureAsJson: localStructure,
            inDataAsJson: localData,
            inOperation: "iterateDo"
        });

        const replacedData = replace({
            inStructureAsJson: iteratedData,
            inDataAsJson: localData,
            inOperation: "replace"
        });

        console.log("iteratedData : ", iteratedData, replacedData);

        // const spec = iterate({
        //     inStructure: replaced,
        //     inData: localData
        // });

        return replacedData;
    } catch (err) {
        console.error("[json-to-spec/v17] compile error:", err);
        throw err;
    }
};

if (typeof globalThis !== "undefined") {
    globalThis.ks ??= {};
    globalThis.ks["json-to-spec"] = {
        meta,
        compile
    };
};

export default compile;
