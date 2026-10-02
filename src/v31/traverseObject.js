import { resolveValue } from "./value.js";
import createElement from "./element/createElement.js";
import applyTextContent from "./element/applyTextContent.js";
import applyProperties from "./element/applyProperties.js";
import applyAttributes from "./element/applyAttributes.js";
import applyClassList from "./element/applyClassList.js";
import { traverseArray } from "./traverseArray/index.js";

/**
 * Traverse one JSON element specification and construct its DOM element.
 *
 * This is the DOM equivalent of node-json-transformer's traverseObject:
 * it owns the current output object/element and delegates child traversal.
 */
const traverseObject = (specJson, dataJson) => {
    if (!specJson || typeof specJson !== "object" || Array.isArray(specJson)) return null;

    const element = structuredClone(specJson);
    if (!element) return null;

    if (Array.isArray(element?.children)) {
        const childNodes = traverseArray(element?.children, dataJson);

        element.children = childNodes;
    };

    return element;
};

export { traverseObject };
export default traverseObject;
