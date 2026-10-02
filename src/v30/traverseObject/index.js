import { traverseArray } from "../traverseArray/index.js";
import jsonToSpecFunc from "../ifJsonToSpec/index.js";

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

    if ("tagName" in element) {
        if ("textContent" in element) {
            if ("textContent" in element) {
                const match = element.textContent.match(/^\$\{(.+?)\}$/);

                if (match) {
                    const key = match[1];
                    element.textContent = dataJson?.[key] ?? "";
                };
            };
        };
    };

    if ("jsonToSpec" in element) {
        const jsonToSpec = element?.jsonToSpec;

        const fromJsonToSpec = jsonToSpecFunc(jsonToSpec, dataJson);

        if (Array.isArray(fromJsonToSpec)) {
            element.children = fromJsonToSpec;
        } else {
            element.children = [fromJsonToSpec];
        };
    };

    if (Array.isArray(element?.children)) {
        const childNodes = traverseArray(element?.children, dataJson);

        element.children = childNodes;
    };

    return element;
};

export default traverseObject;
