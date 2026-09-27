const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if (!localNode?.textContent) return "no-textContent";

    if (typeof localNode.textContent !== "string") return "not-a-string";

    if (!localNode.textContent.includes("${")) return "no-template-token";

    if (localNode.textContent === "${}") localNode.textContent = inData;
};

export default startFunc;
