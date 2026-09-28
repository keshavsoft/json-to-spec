import dispatchSpec from "./index.js";

export const buildSpecArray = ({ inArray = [], inShowLog = false, inDataJson, inDirectiveKeys = ["jsonToSpec"] }) => {
    const localArray = inArray;
    const localShowLog = inShowLog;
    const localDataJson = inDataJson;
    const localDirectiveKeys = inDirectiveKeys;

    if (!Array.isArray(localArray)) return [];

    return localArray.map(item => dispatchSpec({
        inSpecJson: item,
        inShowLog: localShowLog, inDataJson: localDataJson,
        inDirectiveKeys: localDirectiveKeys
    })).flat().filter(Boolean);
};

export default buildSpecArray;
