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
import * as v6 from "./v6/index.js";

// Keep older exports for compatibility, and expose the latest v6 compiler as the default.
export * from "./v3/index.js";
export * from "./v6/index.js";
export { v1, v2, v3, v5, v6 };
export default v6.compile;
