function isPlainObject(value) {
    return value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
};

const ifObject = ({
    inNode,
    inData,
} = {}) => {
    const keys = Object.keys(inData);
    const wrappedArray = keys.map(item => `\${${item}}`);

    if (wrappedArray.includes(inNode.textContent)) {
        const columnKey = inNode.textContent.slice(2, -1);

        inNode.textContent = inData[columnKey];
    };
};

const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if (!localNode?.textContent) return "no-textContent";

    if (typeof localNode.textContent !== "string") return "not-a-string";

    if (!localNode.textContent.includes("${")) return "no-template-token";

    const isObject = isPlainObject(localData);

    if (isObject) {
        ifObject({ inNode, inData });
    } else {
        if (localNode.textContent === "${}") localNode.textContent = localData;
    };
};

export default startFunc;
