/**
 * json-to-spec v9
 *
 * Modular 3-Stage Specification Compiler:
 * 1. operation: detects and expands iterations and structural directives
 * 2. replace: resolves dynamic token interpolation in strings, text, attributes & properties
 * 3. other: applies form control value bindings, story injection, and cleans up metadata
 *
 * All three applications can be invoked independently, chained in custom pipelines,
 * or executed via compile().
 */

import operation from "./instructionEngine/operation/operation.js";
import replace from "./instructionEngine/replace/replace.js";
import other from "./instructionEngine/other/other.js";
import { pipeline, pipe, defaultPipeline } from "./instructionEngine/pipeline/pipeline.js";

export const meta = {
    version: "10.0.0",
    name: "json-to-spec/v10",
    description: "Pure JSON Specification Compiler with decoupled operation, replace, and other pipeline stages"
};

/**
 * Compiles a JSON UI structure tree containing `jsonToSpec` operations with a data payload.
 *
 * Outside API:
 * - compile(structureJson, dataJson)
 * - compile({ inStructure, inData, inSteps })
 * - compile({ structure, data, steps })
 *
 * @param {Object|Array} inStructureOrOptions - The UI structure JSON tree or options object
 * @param {Object} [inData] - Data payload containing collections and values
 * @returns {Object|Array} - Compiled 100% pure JSON specification ready for json-to-dom
 */
export const compile = (inStructureOrOptions, inData = {}) => {
    let localStructure = inStructureOrOptions;
    let localData = inData || {};
    let localSteps = defaultPipeline;

    if (inStructureOrOptions && typeof inStructureOrOptions === "object" && !Array.isArray(inStructureOrOptions)) {
        if ("inStructure" in inStructureOrOptions || "inTree" in inStructureOrOptions || "inNode" in inStructureOrOptions) {
            localStructure = inStructureOrOptions.inStructure || inStructureOrOptions.inTree || inStructureOrOptions.inNode;
            localData = inStructureOrOptions.inData || localData;
            localSteps = inStructureOrOptions.inSteps || localSteps;
        } else if ("structure" in inStructureOrOptions) {
            localStructure = inStructureOrOptions.structure;
            localData = inStructureOrOptions.data || localData;
            localSteps = inStructureOrOptions.steps || localSteps;
        } else if ("context" in inStructureOrOptions) {
            localStructure = inStructureOrOptions.context;
            localData = inStructureOrOptions.data || localData;
            localSteps = inStructureOrOptions.steps || localSteps;
        }
    }

    return pipeline({
        inStructure: localStructure,
        inData: localData,
        inSteps: localSteps
    });
};

export const jsonToSpec = {
    operation,
    replace,
    other,
    pipeline,
    pipe,
    compile
};

export {
    operation,
    replace,
    other,
    pipeline,
    pipe,
    defaultPipeline
};

if (typeof globalThis !== "undefined") {
    globalThis.ks ??= {};
    globalThis.ks["json-to-spec"] = {
        meta,
        compile,
        pipeline,
        pipe,
        operation,
        replace,
        other,
        jsonToSpec
    };
}

export default compile;