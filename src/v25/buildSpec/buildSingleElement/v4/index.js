import buildSpec from "../../index.js";
import { isSpecArray } from "../../guards.js";

const resolveTemplate = ({ inTemplate, inData }) => {
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

// Case 1: Raw string substitution into ${}
const handleStringData = ({ inSpec, inData }) => {
    const localSpec = inSpec;
    const localData = inData;

    if ("textContent" in localSpec) {
        if (localSpec.textContent === "${}") {
            localSpec.textContent = localData;
        } else if (typeof localSpec.textContent === "string") {
            localSpec.textContent = localSpec.textContent.replaceAll("${}", () => localData);
        }
    }

    if ("attributes" in localSpec && typeof localSpec.attributes === "object" && localSpec.attributes) {
        localSpec.attributes = Object.fromEntries(
            Object.entries(localSpec.attributes).map(([key, val]) => [
                key,
                val === "${}"
                    ? localData
                    : (typeof val === "string" ? val.replaceAll("${}", () => localData) : val)
            ])
        );
    }

    return localSpec;
};

// Case 2: Cell ({ key, value }) resolution
const handleCellData = ({ inSpec, inData }) => {
    const localSpec = inSpec;
    const localData = inData;
    const localValue = localData.value;

    if (isSpecArray({ inSpecJson: localValue })) {
        localSpec.children = [{ tagName: "button", textContent: localValue.length }];
        delete localSpec.textContent;
        return localSpec;
    }

    if (typeof localValue === "object" && localValue !== null && localValue.tagName) {
        localSpec.children = [localValue];
        delete localSpec.textContent;
        return localSpec;
    }

    if ("textContent" in localSpec) {
        localSpec.textContent = resolveTemplate({ inTemplate: localSpec.textContent, inData: localData });
    }

    return localSpec;
};

// Case 3: Object or row resolution
const handleObjectData = ({ inSpec, inData, inShowLog }) => {
    const localSpec = inSpec;
    const localData = inData;
    const localShowLog = inShowLog;

    if ("textContent" in localSpec) {
        localSpec.textContent = resolveTemplate({ inTemplate: localSpec.textContent, inData: localData });
    }

    if ("attributes" in localSpec && typeof localSpec.attributes === "object" && localSpec.attributes) {
        localSpec.attributes = Object.fromEntries(
            Object.entries(localSpec.attributes).map(([key, val]) => [
                key,
                resolveTemplate({ inTemplate: val, inData: localData })
            ])
        );
    };

    if (Array.isArray(localSpec.children)) {
        localSpec.children = localSpec.children.map(child =>
            buildSpec({
                inSpecJson: child,
                inShowLog: localShowLog,
                inDataJson: localData
            })
        );
    };

    return localSpec;
};

const startFunc = ({ inSpecJson, inData, inShowLog = false } = {}) => {
    const localSpecJson = inSpecJson;
    const localData = inData;
    const localShowLog = inShowLog;
    // console.log("buildSingleElement start : ", localSpecJson, localData);
    const localSpec = structuredClone(localSpecJson);

    if (localShowLog) {
        console.log("buildSingleElement start : ", localSpecJson, localData);
    };

    // Case 1: String value
    if (typeof localData === "string") {
        return handleStringData({ inSpec: localSpec, inData: localData });
    }

    // Case 2: Cell with { key, value }
    if (typeof localData === "object" && localData !== null && "key" in localData && "value" in localData) {
        return handleCellData({ inSpec: localSpec, inData: localData });
    }

    // Case 3: Row or general object
    return handleObjectData({
        inSpec: localSpec,
        inData: localData,
        inShowLog: localShowLog
    });
};

export default startFunc;