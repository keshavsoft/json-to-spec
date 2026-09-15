/**
 * json-to-spec
 * Story: The Minimalist 2-File JSON Spec Compiler
 * Inputs: structure.json (UI blueprint & operations) + data.json (collections & values).
 * 
 * Root entry point re-exporting the latest version (v11) with backwards compatibility.
 */

import compile, {
    meta,
    replace,
    iterate,
    operation,
    pipeline,
    pipe,
    jsonToSpec
} from "./v16/index.js";

export {
    compile,
    meta,
    replace,
    iterate,
    operation,
    pipeline,
    pipe,
    jsonToSpec
};

export default compile;
