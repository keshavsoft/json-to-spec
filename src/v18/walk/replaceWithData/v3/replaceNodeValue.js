import replaceCommonFunc from "./replaceCommon.js";

const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if (localNode?.textContent) {
        if (localNode.textContent.includes("${")) {
            const dataKey = localNode.textContent
                .replace(/^\$\{/, "")
                .replace(/\}$/, "");

            localNode.textContent = replaceCommonFunc({
                inData: localData,
                inDataKey: dataKey
            });
        };
    };

};

export default startFunc;
