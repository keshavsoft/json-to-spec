/**
 * json-to-spec v7
 *
 * Clear separation of responsibilities:
 * - value replacement is handled by interpolation helpers
 * - iteration is handled by the dedicated expandIteration layer
 * - story injection remains a separate final step
 */

import compileNode from "./instructionEngine/compileTree.js";

export const meta = {
    version: "8.0.0",
    name: "json-to-spec/v7",
    description: "Pure JSON Specification Compiler with separate interpolation and iteration phases"
};

/**
 * Compiles a JSON UI structure tree containing `jsonToSpec` operations with a data payload.
 * 
 * Outside API:
 * - compile(structureJson, dataJson)
 * - compile({ structure, data }) or compile({ context, data })
 * 
 * @param {Object|Array} inStructureOrOptions - The UI structure JSON tree or options object
 * @param {Object} [inData] - Data payload containing collections and values
 * @returns {Object|Array} - Compiled 100% pure JSON specification ready for json-to-dom
 */
const compile = (inStructureOrOptions, inData = {}) => {
    let localStructure = inStructureOrOptions;
    let localData = inData || {};

    console.log("aaaaaaaaaa : ", localStructure, localData);


    if (inStructureOrOptions && typeof inStructureOrOptions === "object" && !Array.isArray(inStructureOrOptions)) {
        // Support options object formats
        if ("structure" in inStructureOrOptions && ("data" in inStructureOrOptions || inData === undefined || Object.keys(inData).length === 0)) {
            localStructure = inStructureOrOptions.structure;
            localData = inStructureOrOptions.data || localData;
        } else if ("context" in inStructureOrOptions && ("data" in inStructureOrOptions || inData === undefined || Object.keys(inData).length === 0)) {
            localStructure = inStructureOrOptions.context;
            localData = inStructureOrOptions.data || localData;
        } else if ("inStructure" in inStructureOrOptions || "inContext" in inStructureOrOptions || "inTree" in inStructureOrOptions) {
            localStructure = inStructureOrOptions.inStructure || inStructureOrOptions.inContext || inStructureOrOptions.inTree;
            localData = inStructureOrOptions.inData || localData;
        }
    };
    console.log("aaaaaaaaaa : ", localStructure, localData);

    return compileNode({
        inNode: localStructure,
        inContext: localData,
        inRootData: localData
    });
};

if (typeof globalThis !== "undefined") {
    globalThis.ks ??= {};
    console.log("aaaaaaaaaa : ", meta);

    globalThis.ks["json-to-spec"] = {
        meta,
        compile
    };

};

export default compile;