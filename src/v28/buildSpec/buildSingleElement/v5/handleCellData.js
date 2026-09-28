import resolveTemplate from "./resolveTemplate.js";
import { isSpecArray } from "../../guards.js";

// Case 2: Cell ({ key, value }) resolution
const startFunc = ({ inSpec, inData }) => {
    const localSpec = inSpec;
    const localData = inData;
    const localValue = localData.value;
    // console.log('inSpec------- : ', localValue, inSpec);
    // debugger
    if (isSpecArray({ inSpecJson: localValue })) {
        localSpec.children = [{
            tagName: "button",
            attributes: {
                class: "btn btn-primary btn-sm"
            },
            textContent: localValue.length
        }];
        delete localSpec.textContent;
        return localSpec;
    };

    if (typeof localValue === "object" && localValue !== null && localValue.tagName) {
        localSpec.children = [localValue];
        delete localSpec.textContent;
        return localSpec;
    };

    if ("textContent" in localSpec) {
        localSpec.textContent = resolveTemplate({ inTemplate: localSpec.textContent, inData: localData });
    };

    if ("attributes" in localSpec && typeof localSpec.attributes === "object" && localSpec.attributes) {
        localSpec.attributes = Object.fromEntries(
            Object.entries(localSpec.attributes).map(([key, val]) => [
                key,
                resolveTemplate({ inTemplate: val, inData: localData })
            ])
        );
    };

    return localSpec;
};

export default startFunc;