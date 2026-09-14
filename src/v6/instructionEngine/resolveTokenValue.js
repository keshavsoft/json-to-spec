import resolvePath from "./resolvePath.js";

export const resolveTokenValue = ({ inPath, inItemContext, inRootData }) => {
    const localPath = inPath;
    const localItemContext = inItemContext;
    const localRootData = inRootData;

    let val = resolvePath({ inData: localItemContext, inPath: localPath });
    if (val === undefined && localItemContext && typeof localItemContext === "object") {
        if (localItemContext.item && typeof localItemContext.item === "object") {
            val = resolvePath({ inData: localItemContext.item, inPath: localPath });
        }
        if (val === undefined && localItemContext.row && typeof localItemContext.row === "object") {
            val = resolvePath({ inData: localItemContext.row, inPath: localPath });
        }
    }
    if (val === undefined && localRootData) {
        val = resolvePath({ inData: localRootData, inPath: localPath });
    }

    return val;
};

export default resolveTokenValue;
