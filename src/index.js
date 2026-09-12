/**
 * json-to-spec
 * Story: The Minimalist 2-File JSON Spec Compiler
 * Inputs: structure.json (UI blueprint & operations) + data.json (collections & values).
 * 
 * Root entry point re-exporting the current stable version (v1).
 */

import * as v1 from "./v1/index.js";

export * from "./v1/index.js";
export { v1 };
export default v1.compile;
