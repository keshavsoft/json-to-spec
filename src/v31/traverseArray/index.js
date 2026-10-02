import { resolveChild } from "./resolve.js";

/**
 * Traverse an array of child specifications and return DOM nodes.
 */
const traverseArray = (items) => {
    if (!Array.isArray(items)) return [];

    return items
        .map(resolveChild)
        .flat(Infinity)
        .filter(Boolean);
};

export { traverseArray };
export default traverseArray;
