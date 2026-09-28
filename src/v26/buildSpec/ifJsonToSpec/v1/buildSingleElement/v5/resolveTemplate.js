const startFunc = ({ inTemplate, inData, inRowIndex }) => {
    if (Number.isFinite(inRowIndex)) {
        debugger
        console.log("vvvvvvvvvvvvvv : ", inRowIndex);

        let fromHash = forHashResolve({ inTemplate, inRowIndex });

        let fromDollar = forDollarResolve({ inTemplate: fromHash, inData });
        return fromDollar;
    } else {
        let fromDollar = forDollarResolve({ inTemplate, inData });

        return fromDollar;
    };
};

const forDollarResolve = ({ inTemplate, inData }) => {
    const localTemplate = inTemplate;
    const localData = inData;

    if (typeof localTemplate !== "string") return localTemplate;

    return localTemplate.replace(/\$\{([^}]+)\}/g, (_, inPath) => {
        const localKeys = inPath.trim().split(".");
        let localValue = localData;

        for (const key of localKeys) {
            if (localValue === null || localValue === undefined) return "";
            localValue = localValue[key];
        }

        if (localValue === undefined || localValue === null) {
            return "";
        }

        if (
            typeof localValue === "string" ||
            typeof localValue === "number" ||
            typeof localValue === "boolean"
        ) {
            return String(localValue ?? "");
        }

        return localValue;
    });
};

const forHashResolve = ({ inTemplate, inRowIndex }) => {
    const localTemplate = inTemplate;
    const localData = inRowIndex;

    return localTemplate.replace(/\#\{([^}]+)\}/g, (_, inPath) => {
        const localKeys = inPath.trim().split(".");
        let localValue = localData;

        console.log("aaaaaaa : ", inRowIndex, inTemplate, localKeys);

        for (const key of localKeys) {
            if (localValue === null || localValue === undefined) return "";
            localValue = localValue[key];
        }

        if (
            localValue === null ||
            typeof localValue === "string" ||
            typeof localValue === "number" ||
            typeof localValue === "boolean"
        ) {
            return String(localValue ?? "");
        }

        return localValue;
    });
};

export default startFunc;