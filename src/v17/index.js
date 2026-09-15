/**
 * json-to-spec v11
 *
 * Minimalist 2-Layer Specification Compiler:
 * 1. replace: Pure ${...} token replacement across JSON structures.
 * 2. iterate: Evaluates jsonToSpec operations, expanding collections into clean children.
 */

import { replace, replaceNode } from "./replace.js";

// import { iterate, iterateNode, operation } from "./iterate.js";

import {
    iterate,
    operation
} from "./iterate/index.js";

export const meta = {
    version: "17.0.0",
    name: "json-to-spec/v17",
    description: "Minimalist 2-layer compiler: pure value replace + jsonToSpec iterate"
};

/**
 * Executes a custom pipeline of transformations over the structure.
 */
export const pipeline = ({ inStructure, inData = {}, inSteps = [replace, iterate] } = {}) => {
    const localData = inData;
    const localSteps = inSteps;

    let current = inStructure;
    for (const step of localSteps) {
        if (typeof step === "function") {
            current = step({ inStructure: current, inData: localData });
        };
    }
    return current;
};

export const pipe = (...inSteps) => {
    const localSteps = inSteps.length > 0 ? inSteps : [replace, iterate];
    return (inStructure, inData = {}) => {
        return pipeline({ inStructure, inData, inSteps: localSteps });
    };
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

    const iteratedData = replace({
        inStructureAsJson: localStructure,
        inDataAsJson: localData,
        inOperation: "iterateDo"
    });

    // const replaced = replace({
    //     inStructureAsJson: spec,
    //     inDataAsJson: localData,
    //     inOperation: "replace"
    // });

    console.log("iteratedData : ", iteratedData);

    // const spec = iterate({
    //     inStructure: replaced,
    //     inData: localData
    // });

    return iteratedData;
};

export const jsonToSpec = {
    replace,
    iterate,
    operation,
    pipeline,
    pipe,
    compile
};

export {
    replace,
    replaceNode,
    iterate,
    operation
};

if (typeof globalThis !== "undefined") {
    globalThis.ks ??= {};
    globalThis.ks["json-to-spec"] = {
        meta,
        compile,
        replace,
        iterate,
        operation,
        pipeline,
        jsonToSpec
    };
}

export default compile;
