import { traverseArray } from "../traverseArray/index.js";
import jsonToSpecFunc from "../ifJsonToSpec/index.js";
import ifTagNameFound from "../ifTagNameFound/index.js";

const traverseObject = (specJson, dataJson) => {
    if (!specJson || typeof specJson !== "object" || Array.isArray(specJson)) return null;

    const element = structuredClone(specJson);
    if (!element) return null;

    if ("tagName" in element) {
        ifTagNameFound(element, dataJson);
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
