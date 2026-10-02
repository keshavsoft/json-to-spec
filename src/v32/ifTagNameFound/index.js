import forTextContent from "./forTextContent.js";

const startFunc = (specJson, dataJson) => {
    if ("tagName" in specJson) {
        if ("textContent" in specJson) {
            const returnedTextContent = forTextContent(specJson.textContent, dataJson);
            console.log("returnedTextContent : ", returnedTextContent);
            specJson.textContent = returnedTextContent;
        };
    };
};

export default startFunc;