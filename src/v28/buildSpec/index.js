import {
    isNullOrUndefined,
    isDomNode,
    isSpecArray
} from "./guards.js";

import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./ifJsonToSpec/v1/buildSingleElement/v5/index.js";
import jsonToSpecFunc from "./ifJsonToSpec/v1/index.js";

const findDirectiveKey = (inSpecJson, inDirectiveKeys) =>
    inDirectiveKeys.find(key => key in inSpecJson) ?? null;

const dispatchSpec = ({
    inSpecJson,
    inShowLog = false,
    inDataJson,
    inRowIndex,
    inDirectiveKeys = ["jsonToSpec"]
} = {}) => {
    // debugger
    if (isNullOrUndefined({ inSpec: inSpecJson })) {
        return null;
    };

    if (isDomNode({ inSpec: inSpecJson })) {
        return inSpecJson;
    };

    if (inShowLog) console.log("dispatchSpec 3 : ", inSpecJson, inDataJson);

    if (isSpecArray({ inSpecJson })) {
        const fromArray = buildSpecArray({
            inArray: inSpecJson,
            inShowLog,
            inDataJson,
            inDirectiveKeys
        });

        return fromArray;
    };

    const localDirectiveKey = findDirectiveKey(inSpecJson, inDirectiveKeys);
    if (localDirectiveKey) {
        const fromJsonToSpecFunc = jsonToSpecFunc({
            inSpecJson,
            inShowLog, inRowIndex,
            inDataJson,
            inDirectiveKeys,
            inDirectiveKey: localDirectiveKey
        });

        return fromJsonToSpecFunc;
    };

    const toReturnObject = buildSingleElement({
        inSpecJson,
        inShowLog, inRowIndex,
        inData: inDataJson,
        inDirectiveKeys
    });
    // console.log("toReturnObject : ", inSpecJson, toReturnObject);

    return toReturnObject;
};

export default dispatchSpec;