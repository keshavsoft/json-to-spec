import replaceCommonFunc from "./replaceCommon.js";

const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if (!localNode?.textContent) return "no-textContent";

    if (typeof localNode.textContent !== "string") return "not-a-string";

    if (!localNode.textContent.includes("${")) return "no-template-token";

    const dataKey = localNode.textContent
        .replace(/^\$\{/, "")
        .replace(/\}$/, "");

    localNode.textContent = replaceCommonFunc({
        inData: localData,
        inDataKey: dataKey
    });

};

export default startFunc;
