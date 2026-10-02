import textContent from "../forTextContent/index.js";

const startFunc = (inAttributes, dataJson) => {
    let newAttributes = {};

    for (const [key, value] of Object.entries(inAttributes)) {
        const startFuncResult = textContent(value, dataJson);

        newAttributes[key] = startFuncResult;
    };

    return newAttributes;
};

export default startFunc;