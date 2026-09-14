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
import * as v5 from "./v6/index.js";

// Keep v3 exports for backward compatibility, and also re-export v5
export * from "./v3/index.js";
export * from "./v6/index.js";
export { v1, v2, v3, v5 };
// Default to the latest stable implementation (v5)
export default v5.compile;
