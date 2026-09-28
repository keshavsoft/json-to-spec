import buildSpec from "../../index.js";
import resolveTemplate from "./resolveTemplate.js";

// Case 3: Object or row resolution
const handleObjectData = ({ inSpec, inData, inShowLog }) => {
    const localSpec = inSpec;
    const localData = inData;
    const localShowLog = inShowLog;
    // console.log("----------- localSpec : ", localSpec);

    if ("textContent" in localSpec) {
        localSpec.textContent = resolveTemplate({ inTemplate: localSpec.textContent, inData: localData });
    }

    if ("attributes" in localSpec && typeof localSpec.attributes === "object" && localSpec.attributes) {
        localSpec.attributes = Object.fromEntries(
            Object.entries(localSpec.attributes).map(([key, val]) => [
                key,
                resolveTemplate({ inTemplate: val, inData: localData })
            ])
        );
    };

    if (Array.isArray(localSpec.children)) {
        localSpec.children = localSpec.children.map(child =>
            buildSpec({
                inSpecJson: child,
                inShowLog: localShowLog,
                inDataJson: localData
            })
        );
    };
    // console.log("eeeeeeee localSpec : ", localSpec);

    return localSpec;
};

export { handleObjectData };