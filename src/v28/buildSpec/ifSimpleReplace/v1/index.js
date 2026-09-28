import buildSingleElement from "../../buildSingleElement/v5/index.js";

// Simple replace: strip the directive key, let buildSingleElement resolve ${ } templates
const startFunc = ({ inSpecJson, inShowLog = false, inRowIndex, inDataJson, inDirectiveKeys, inDirectiveKey }) => {
    const localShowLog = inShowLog;
    const localDirectiveKey = inDirectiveKey;
    const { [localDirectiveKey]: _, ...localSpec } = inSpecJson;

    return buildSingleElement({
        inSpecJson: localSpec,
        inShowLog: localShowLog,
        inRowIndex,
        inData: inDataJson,
        inDirectiveKeys
    });
};

export default startFunc;
