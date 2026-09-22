import {
    isNullOrUndefined,
    isDomNode,
    isSpecArray
} from "./guards.js";

import buildSpecArray from "./buildSpecArray.js";
import buildSingleElement from "./forSpec/v3/index.js";
import forArray from "./forArray/v1/index.js";
import forObject from "./forObject/v1/index.js";
import forArrayStrings from "./forArrayStrings/v1/index.js";

const dispatchSpec = ({
    inSpecJson,
    inShowLog = false,
    inDataJson
} = {}) => {

    if (isNullOrUndefined({ inSpec: inSpecJson })) {
        return null;
    };

    if (isDomNode({ inSpec: inSpecJson })) {
        return inSpecJson;
    };

    if (isSpecArray({ inSpecJson })) {
        return buildSpecArray({
            inArray: inSpecJson,
            inShowLog,
            inDataJson
        });
    };

    if ("jsonToSpec" in inSpecJson) {

        if (inSpecJson.jsonToSpec.operation === "loopArray") {

            const fromArray = forArray({
                inTemplate: inSpecJson.jsonToSpec.template,
                inDataAsArray:
                    inDataJson[inSpecJson.jsonToSpec.source]
            });

            const {
                jsonToSpec,
                ...specWithoutJsonToSpec
            } = inSpecJson;

            const newSpec = {
                ...specWithoutJsonToSpec,
                children: fromArray
            };

            return buildSingleElement({
                inSpecJson: newSpec,
                inShowLog,
                inData: inDataJson
            });
        };
        // may be this can be deleted
        // if (inSpecJson.jsonToSpec.operation === "loopArrayStrings") {
        //     debugger
        //     const fromArray = forArrayStrings({
        //         inTemplate: inSpecJson.jsonToSpec.template,
        //         inDataAsArray:
        //             inDataJson[inSpecJson.jsonToSpec.source]
        //     });

        //     const {
        //         jsonToSpec,
        //         ...specWithoutJsonToSpec
        //     } = inSpecJson;

        //     const newSpec = {
        //         ...specWithoutJsonToSpec,
        //         children: fromArray
        //     };

        //     return buildSingleElement({
        //         inSpecJson: newSpec,
        //         inShowLog,
        //         inData: inDataJson
        //     });
        // };

        if (inSpecJson.jsonToSpec.operation === "loopObject") {

            const fromObject = forObject({
                inTemplate: inSpecJson.jsonToSpec.template,
                inDataAsObject: inDataJson
            });

            const {
                jsonToSpec,
                ...specWithoutJsonToSpec
            } = inSpecJson;

            const newSpec = {
                ...specWithoutJsonToSpec,
                children: fromObject
            };

            return buildSingleElement({
                inSpecJson: newSpec,
                inShowLog,
                inData: inDataJson
            });
        };
    };

    const toReturnObject = buildSingleElement({
        inSpecJson,
        inShowLog,
        inData: inDataJson
    });
    // console.log("toReturnObject : ", inSpecJson, toReturnObject);

    return toReturnObject;
};

export default dispatchSpec;