const replaceCommonFunc = ({ inData, inDataKey }) => {
    const dataKey = inDataKey;
    // console.log("dataKey : ", dataKey, inData);

    let valueToReturn = inData[dataKey];

    if (dataKey.includes(".")) {
        const keysOfArray = dataKey.split(".");

        const value = keysOfArray.reduce(
            (current, key) => current?.[key],
            inData
        );

        valueToReturn = value;
    };

    return valueToReturn;
};

const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if ("textContent" in inNode) {
        if (inNode.textContent.includes("${")) {
            const dataKey = inNode.textContent
                .replace(/^\$\{/, "")
                .replace(/\}$/, "");

            inNode.textContent = replaceCommonFunc({ inData, inDataKey: dataKey });

        };
    };

    if ("attributes" in inNode) {
        const attributes = Object.fromEntries(
            Object.entries(inNode.attributes || {}).map(([key, value]) => [
                key,
                typeof value === "string" && value.includes("${")
                    ? replaceCommonFunc({
                        inData,
                        inDataKey: value
                            .replace(/^\$\{/, "")
                            .replace(/\}$/, "")
                    })
                    : value
            ])
        );

        // console.log("attributes----- : ", inNode, attributes);

        inNode.attributes = { ...attributes };
    };
};

export default startFunc;
