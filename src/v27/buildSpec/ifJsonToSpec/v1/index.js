// import resolveTemplate from "./buildSingleElement/v5/resolveTemplate.js";
import buildSingleElement from "./buildSingleElement/v5/index.js";
import forArray from "./forArray/v1/index.js";
import forObject from "./forObject/v1/index.js";

const startFunc = ({
    inSpecJson,
    inShowLog = false,
    inDataJson, inRowIndex
} = {}) => {
    if (Number.isFinite(inRowIndex)) {
        if ("attributes" in inSpecJson) {
            inSpecJson.attributes.rowIndex = inRowIndex;
        } else {
            inSpecJson.attributes = {
                rowIndex: inRowIndex
            };
        };
    };

    if (!["loopArray", "loopObject"].includes(inSpecJson.jsonToSpec.operation)) {
        console.log(`inSpecJson.jsonToSpec.operation : can be loopArray or loopObject : ${inSpecJson.jsonToSpec.operation}`);

        return;
    };

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

export default startFunc;