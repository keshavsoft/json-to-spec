import { handleObjectData } from "./handleObjectData.js";
import handleCellData from "./handleCellData.js";

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

const startFunc = ({ inSpecJson, inData, inRowIndex, inShowLog = false } = {}) => {
    const localSpecJson = inSpecJson;
    const localData = inData;
    const localShowLog = inShowLog;
    // console.log("buildSingleElement start : ", localSpecJson, localData);
    const localSpec = structuredClone(localSpecJson);

    if (localShowLog) {
        console.log("buildSingleElement start : ", localSpecJson, localData);
    };

    // console.log("inRowIndex  : ", inRowIndex, localSpecJson, localSpec, localData);

    // Case 1: String value
    if (typeof localData === "string") {
        return handleStringData({ inSpec: localSpec, inData: localData });
    };

    // Case 2: Cell with { key, value }
    if (typeof localData === "object" && localData !== null && "key" in localData && "value" in localData && !("children" in localSpec && Array.isArray(localSpec.children) && localSpec.children.length > 0)) {

        return handleCellData({ inSpec: localSpec, inData: localData });
    };

    // Case 3: Row or general object
    return handleObjectData({
        inSpec: localSpec,
        inData: localData,
        inShowLog: localShowLog
    });
};

export default startFunc;