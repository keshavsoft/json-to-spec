const startFunc = ({
    inNode,
    inData,
} = {}) => {
    const localNode = inNode;
    const localData = inData;

    if ("attributes" in localNode) {
        const attributes = Object.fromEntries(
            Object.entries(localNode.attributes).map(([key, value]) => {
                let newValue = value;

                // Complex conditional block
                if (value === "${}") {
                    newValue = inData.key;
                };

                return [key, newValue];
            })
        );

        localNode.attributes = { ...attributes };
    };
};

export default startFunc;
