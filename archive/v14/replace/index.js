/**
 * replace/index.js
 *
 * Responsibility:
 * - Provide the public replace API for the v14 replace phase.
 * - For now this is a thin wrapper that re-exports the existing
 *   implementation in `../replace.js` so no public imports break.
 * - Later the implementation can be moved into this folder and
 *   the wrapper updated accordingly.
 */

import replaceDefault, { replace, replaceNode } from "../replace.js";

export { replace, replaceNode };

export default replaceDefault;
