import { resolveChild } from "./resolve.js";

/**
 * Traverse an array of child specifications and return DOM nodes.
 */
const traverseArray = (items, dataJson) => {
    if (!Array.isArray(items)) return [];

    return items
        .map((item) => resolveChild(item, dataJson))
        .flat(Infinity)
        .filter(Boolean);
};

export { traverseArray };
export default traverseArray;
