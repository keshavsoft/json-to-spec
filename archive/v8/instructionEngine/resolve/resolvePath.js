export const resolvePath = ({ inData, inPath }) => {
    if (inData === null || inData === undefined) return undefined;
    if (inPath === undefined || inPath === null || inPath === "" || inPath === ".") {
        return inData;
    }

    const segments = Array.isArray(inPath) ? inPath : String(inPath).split(".");
    let current = inData;

    for (const segment of segments) {
        if (current === null || current === undefined) return undefined;
        current = current[segment];
    }

    return current;
};

export default resolvePath;
