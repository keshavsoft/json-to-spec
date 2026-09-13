/**
 * json-to-spec
 * Story: The Minimalist 2-File JSON Spec Compiler
 * Inputs: structure.json (UI blueprint & operations) + data.json (collections & values).
 * 
 * Root entry point re-exporting the latest version (v3) with backwards compatibility for v1 and v2.
 */

import * as v1 from "./v1/index.js";
import * as v2 from "./v2/index.js";
import * as v3 from "./v3/index.js";

export * from "./v3/index.js";
export { v1, v2, v3 };
export default v3.compile;
