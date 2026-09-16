import replaceCommonFunc from "./replaceCommon.js";

const replaceNodeValue = ({
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

const replaceAttributes = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if ("attributes" in localNode) {
        const attributes = Object.fromEntries(
            Object.entries(localNode.attributes || {}).map(([key, value]) => [
                key,
                typeof value === "string" && value.includes("${")
                    ? replaceCommonFunc({
                        inData: localData,
                        inDataKey: value
                            .replace(/^\$\{/, "")
                            .replace(/\}$/, "")
                    })
                    : value
            ])
        );

        localNode.attributes = { ...attributes };
    };
};

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
