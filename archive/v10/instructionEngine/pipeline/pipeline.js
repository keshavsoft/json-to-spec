import operation from "../operation/operation.js";
import replace from "../replace/replace.js";
import other from "../other/other.js";

export const defaultPipeline = [operation, replace, other];
export const defaultPipeline2 = [replace];

export const pipeline = (inStructureOrOptions, inData = {}, inCustomSteps) => {
    let localStructure = inStructureOrOptions;
    let localData = inData;
    let localSteps = inCustomSteps || defaultPipeline;
    console.log("inCustomSteps : ", inCustomSteps, localSteps);

    if (inStructureOrOptions && typeof inStructureOrOptions === "object" && !Array.isArray(inStructureOrOptions)) {
        if ("inStructure" in inStructureOrOptions || "inTree" in inStructureOrOptions || "inNode" in inStructureOrOptions) {
            localStructure = inStructureOrOptions.inStructure || inStructureOrOptions.inTree || inStructureOrOptions.inNode;
            localData = inStructureOrOptions.inData || localData;
            localSteps = inStructureOrOptions.inSteps || localSteps;
        } else if ("structure" in inStructureOrOptions) {
            localStructure = inStructureOrOptions.structure;
            localData = inStructureOrOptions.data || localData;
            localSteps = inStructureOrOptions.steps || localSteps;
        }
    }

    let current = localStructure;
    for (const step of localSteps) {
        if (typeof step === "function") {
            current = step({
                inStructure: current,
                inData: localData
            });
        }
    }

    return current;
};

export const pipe = (...inSteps) => {
    const localSteps = inSteps.length > 0 ? inSteps : defaultPipeline;

    return (inStructureOrOptions, inData = {}) => {
        return pipeline(inStructureOrOptions, inData, localSteps);
    };
};

export default pipeline;
