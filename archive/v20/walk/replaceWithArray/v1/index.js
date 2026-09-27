import replaceTextContent from "./replaceTextContent.js";
import replaceAttributes from "./replaceAttributes.js";

const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    replaceTextContent({ inNode: localNode, inData: localData });
    replaceAttributes({ inNode: localNode, inData: localData });
};

export default startFunc;
