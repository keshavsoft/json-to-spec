// import resolveTemplate from "./buildSingleElement/v5/resolveTemplate.js";
import buildSingleElement from "../../buildSingleElement/v5/index.js";
import forArray from "./forArray/v1/index.js";
import forObject from "./forObject/v1/index.js";

const startFunc = ({
    inSpecJson,
    inShowLog = false,
    inDataJson, inRowIndex,
    inDirectiveKeys = {},
    inDirectiveKey = "jsonToSpec"
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

    if (!["loopArray", "loopObject"].includes(inSpecJson[inDirectiveKey].operation)) {
        console.log(`inSpecJson[${inDirectiveKey}].operation : can be loopArray or loopObject : ${inSpecJson[inDirectiveKey].operation}`);

        return;
    };

    if (inSpecJson[inDirectiveKey].operation === "loopArray") {

        const fromArray = forArray({
            inTemplate: inSpecJson[inDirectiveKey].template,
            inDataAsArray:
                inDataJson[inSpecJson[inDirectiveKey].source]
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
            inData: inDataJson,
            inDirectiveKeys
        });
    };

    if (inSpecJson[inDirectiveKey].operation === "loopObject") {
        const fromObject = forObject({
            inTemplate: inSpecJson[inDirectiveKey].template,
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
            inData: inDataJson,
            inDirectiveKeys
        });
    };
};

export default startFunc;