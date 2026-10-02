import forTextContent from "./forTextContent/index.js";
import forAttributes from "./forAttributes/index.js";

const startFunc = (specJson, dataJson) => {
    if ("tagName" in specJson) {
        if ("textContent" in specJson) {
            const returnedTextContent = forTextContent(specJson.textContent, dataJson);

            specJson.textContent = returnedTextContent;
        };

        if ("attributes" in specJson) {
            const returnedAttributes = forAttributes(specJson.attributes, dataJson);

            specJson.attributes = returnedAttributes;
        };
    };
};

export default startFunc;