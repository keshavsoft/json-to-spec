/**
 * json-to-spec v2
 * 
 * Simple 2-Input Outside API (No 'in' convention required for callers):
 * compile(contextJson, dataJson)
 * 
 * - contextJson: The UI blueprint / structure tree with operations (e.g. operation: "iterate").
 * - dataJson: The data payload containing collections and values (defaults to {}).
 */

import compileNode from "./instructionEngine/compileTree.js";
import resolvePath from "./instructionEngine/resolvePath.js";

export const meta = {
    version: "2.0.0",
    name: "json-to-spec/v2",
    description: "Pure JSON Specification Compiler: (contextJson, dataJson) -> Spec JSON ready for json-to-dom"
};

/**
 * Compiles a JSON UI structure/context tree with dynamic operations driven by data.
 * 
 * Outside API:
 * - compile(contextJson, dataJson)
 * - compile({ context, data }) or compile({ structure, data })
 * - compile({ inStructure, inData }) [backwards compatible]
 * 
 * @param {Object|Array} inContextOrOptions - The UI structure/context JSON tree or options object
 * @param {Object} [inData] - Data payload containing collections and values
 * @returns {Object|Array} - Compiled JSON specification ready for json-to-dom
 */
export const compile = (inContextOrOptions, inData = {}) => {
    let localStructure = inContextOrOptions;
    let localData = inData || {};

    if (inContextOrOptions && typeof inContextOrOptions === "object" && !Array.isArray(inContextOrOptions)) {
        // Support options object formats
        if ("context" in inContextOrOptions && ("data" in inContextOrOptions || inData === undefined || Object.keys(inData).length === 0)) {
            localStructure = inContextOrOptions.context;
            localData = inContextOrOptions.data || localData;
        } else if ("structure" in inContextOrOptions && ("data" in inContextOrOptions || inData === undefined || Object.keys(inData).length === 0)) {
            localStructure = inContextOrOptions.structure;
            localData = inContextOrOptions.data || localData;
        } else if ("inStructure" in inContextOrOptions || "inContext" in inContextOrOptions || "inTree" in inContextOrOptions) {
            localStructure = inContextOrOptions.inStructure || inContextOrOptions.inContext || inContextOrOptions.inTree;
            localData = inContextOrOptions.inData || localData;
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
}

export default compile;
