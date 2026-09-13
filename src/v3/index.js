/**
 * json-to-spec v3
 * 
 * Strict 2-Layer Namespaced Architecture:
 * - json-to-dom keys (tagName, attributes, children, textContent) remain 100% pure.
 * - json-to-spec compiler directives live exclusively under the single `jsonToSpec` key.
 * - When compiled, `jsonToSpec` executes, generates pure DOM nodes, and completely evaporates.
 * 
 * Outside API:
 * compile(structureJson, dataJson)
 */

import compileNode from "./instructionEngine/compileTree.js";
import resolvePath from "./instructionEngine/resolvePath.js";

export const meta = {
    version: "3.0.0",
    name: "json-to-spec/v3",
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
export const compile = (inStructureOrOptions, inData = {}) => {
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

export {
    compileNode,
    resolvePath
};

if (typeof globalThis !== "undefined") {
    globalThis.ks ??= {};
    globalThis.ks["json-to-spec"] = {
        meta,
        compile,
        compileNode,
        resolvePath
    };
    globalThis.ks["json-to-spec-v3"] = globalThis.ks["json-to-spec"];
}

export default compile;
