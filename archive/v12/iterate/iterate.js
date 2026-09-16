import iterateNode from "./iterateNode.js";

/**
 * Main iterate operation.
 *
 * Input:
 *   structure + data
 *
 * Output:
 *   expanded structure
 */
export const iterate = (inStructureOrOptions, inData = {}) => {
    let localStructure = inStructureOrOptions;
    let localData = inData;
    let localContext = {};

    if (
        inStructureOrOptions &&
        typeof inStructureOrOptions === "object" &&
        !Array.isArray(inStructureOrOptions)
    ) {
        if (
            "inStructure" in inStructureOrOptions ||
            "inTree" in inStructureOrOptions ||
            "inNode" in inStructureOrOptions
        ) {
            localStructure =
                inStructureOrOptions.inStructure ||
                inStructureOrOptions.inTree ||
                inStructureOrOptions.inNode;

            localData =
                inStructureOrOptions.inData || localData;

            localContext =
                inStructureOrOptions.inContext || localContext;

        } else if ("structure" in inStructureOrOptions) {
            localStructure = inStructureOrOptions.structure;
            localData =
                inStructureOrOptions.data || localData;
            localContext =
                inStructureOrOptions.context || localContext;
        }
    }

    return iterateNode({
        inNode: localStructure,
        inContext: localContext,
        inData: localData
    });
};

export const operation = iterate;

export default iterate;