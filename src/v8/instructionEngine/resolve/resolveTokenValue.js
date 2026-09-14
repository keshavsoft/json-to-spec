import resolvePath from "./resolvePath.js";

export const resolveTokenValue = ({ inPath, inItemContext, inRootData }) => {
    let value = resolvePath({ inData: inItemContext, inPath });

    if (value === undefined && inItemContext && typeof inItemContext === "object") {
        if (inItemContext.item && typeof inItemContext.item === "object") {
            value = resolvePath({ inData: inItemContext.item, inPath });
        }
        if (value === undefined && inItemContext.row && typeof inItemContext.row === "object") {
            value = resolvePath({ inData: inItemContext.row, inPath });
        }
    }

    if (value === undefined && inRootData) {
        value = resolvePath({ inData: inRootData, inPath });
    }

    return value;
};

export default resolveTokenValue;
