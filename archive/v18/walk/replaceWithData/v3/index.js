import replaceNodeValue from "./replaceNodeValue.js";
import replaceAttributes from "./replaceAttributes.js";

const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    replaceNodeValue({ inNode: localNode, inData: localData });
    replaceAttributes({ inNode: localNode, inData: localData });
};

export default startFunc;
