import { traverse } from "../traverse.js";

/**
 * Resolve one JSON-to-DOM child instruction.
 *
 * A child can be an existing DOM node, a primitive value, an element
 * specification, or an array of child instructions.
 */
const resolveChild = (child) => {
    if (child === null || child === undefined) return null;

    if (typeof child === "string" || typeof child === "number") {
        return document.createTextNode(String(child));
    };

    return traverse(child);
};

export { resolveChild };
export default resolveChild;
