import replaceCommonFunc from "./replaceCommon.js";

const startFunc = ({
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

export default startFunc;
