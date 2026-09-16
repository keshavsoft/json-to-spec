const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if (!localNode?.textContent) return "no-textContent";

    if (typeof localNode.textContent !== "string") return "not-a-string";

    if (!localNode.textContent.includes("${")) return "no-template-token";

    if (localNode.textContent === "${key}") localNode.textContent = inData.key;
    if (localNode.textContent === "${value}") localNode.textContent = inData.value;
};

export default startFunc;
