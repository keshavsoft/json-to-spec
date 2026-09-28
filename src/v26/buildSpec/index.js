import {
    isNullOrUndefined,
    isDomNode,
    isSpecArray
} from "./guards.js";

import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./buildSingleElement/v5/index.js";
import jsonToSpecFunc from "./jsonToSpecFunc.js";

const dispatchSpec = ({
    inSpecJson,
    inShowLog = true,
    inDataJson,
    inRowIndex
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
            inDataJson
        });

        return fromArray;
    };

    if ("jsonToSpec" in inSpecJson) {
        const fromJsonToSpecFunc = jsonToSpecFunc({
            inSpecJson,
            inShowLog, inRowIndex,
            inDataJson, inRowIndex
        });

        return fromJsonToSpecFunc;
    };

    const toReturnObject = buildSingleElement({
        inSpecJson,
        inShowLog, inRowIndex,
        inData: inDataJson
    });
    // console.log("toReturnObject : ", inSpecJson, toReturnObject);

    return toReturnObject;
};

export default dispatchSpec;