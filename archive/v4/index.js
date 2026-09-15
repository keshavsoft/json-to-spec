/**
 * json-to-spec v4
 * 
 * Strict 2-Layer Namespaced Architecture:
 * - json-to-dom keys (tagName, attributes, children, textContent) remain 100% pure.
 * - json-to-spec compiler directives live exclusively under the single `jsonToSpec` key.
  * When compiled, `jsonToSpec` instructions execute and completely evaporate,
 * leaving a pure JSON specification ready for json-to-dom.
 *  
 * Outside API:
 * compile(structureJson, dataJson)
 */

import compileNode from "./instructionEngine/compileTree.js";
// import resolvePath from "./instructionEngine/resolvePath.js";

export const meta = {
    version: "4.0.0",
    name: "json-to-spec/v4",
    description: "Pure JSON Specification Compiler with jsonToSpec namespace: (structure, data) -> Spec JSON ready for json-to-dom"
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
    }

    return compileNode({
        inNode: localStructure,
        inContext: localData,
        inRootData: localData
    });
};

if (typeof globalThis !== "undefined") {
    globalThis.ks ??= {};

    globalThis.ks["json-to-spec"] = {
        meta,
        compile
    };

};

export default compile;