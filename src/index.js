/**
 * json-to-spec
 * Story: The Minimalist 2-File JSON Spec Compiler
 * Inputs: structure.json (UI blueprint & operations) + data.json (collections & values).
 * 
 * Root entry point re-exporting the latest version (v9) with backwards compatibility.
 */

import * as v1 from "./v1/index.js";
import * as v2 from "./v2/index.js";
import * as v3 from "./v3/index.js";
import * as v5 from "./v6/index.js";
import * as v6 from "./v6/index.js";
import * as v7 from "./v7/index.js";
import * as v8 from "./v8/index.js";
import * as v9 from "./v9/index.js";

export * from "./v9/index.js";
export { default } from "./v9/index.js";
