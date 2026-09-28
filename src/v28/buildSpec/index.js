import {
    isNullOrUndefined,
    isDomNode,
    isSpecArray
} from "./guards.js";

import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./buildSingleElement/v5/index.js";
import jsonToSpecFunc from "./ifJsonToSpec/v1/index.js";
import simpleReplaceFunc from "./ifSimpleReplace/v1/index.js";

const normalizeDirectiveKeys = (inKeys) => {
    const localBase = { "jsonToSpec": jsonToSpecFunc };
    if (!inKeys) return localBase;
    if (Array.isArray(inKeys)) {
        const localFromArray = inKeys.reduce((acc, key) => ({ ...acc, [key]: simpleReplaceFunc }), {});
        return { ...localBase, ...localFromArray };
    };
    return inKeys;
};

const dispatchSpec = ({
    inSpecJson,
    inShowLog = false,
    inDataJson,
    inRowIndex,
    inDirectiveKeys
} = {}) => {
    const localDirectiveKeys = normalizeDirectiveKeys(inDirectiveKeys);
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
            inDirectiveKeys: localDirectiveKeys
        });

        return fromArray;
    };

    const localDirectiveKey = Object.keys(localDirectiveKeys).find(key => key in inSpecJson) ?? null;
    if (localDirectiveKey) {
        const localHandler = localDirectiveKeys[localDirectiveKey];
        return localHandler({
            inSpecJson,
            inShowLog, inRowIndex,
            inDataJson,
            inDirectiveKeys: localDirectiveKeys,
            inDirectiveKey: localDirectiveKey
        });
    };

    const toReturnObject = buildSingleElement({
        inSpecJson,
        inShowLog, inRowIndex,
        inData: inDataJson,
        inDirectiveKeys: localDirectiveKeys
    });
    // console.log("toReturnObject : ", inSpecJson, toReturnObject);

    return toReturnObject;
};

export default dispatchSpec;