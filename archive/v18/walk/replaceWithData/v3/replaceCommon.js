const startFunc = ({ inData, inDataKey }) => {
    const dataKey = inDataKey;
    // console.log("dataKey : ", dataKey, inData);

    if (dataKey === "") return inData;

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

export default startFunc;
