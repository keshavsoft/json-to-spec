/**
 * Resolves a dot-delimited path or array of keys from a data object.
 *
 * @param {Object} inArgs
 * @param {Object} inArgs.inData - Target object to resolve from
 * @param {string|Array} inArgs.inPath - Key or dot-path (e.g. "meta.formTitle", "columns")
 * @returns {*} Resolved value or undefined
 */
export const resolvePath = ({ inData, inPath }) => {
    const localData = inData;
    const localPath = inPath;

    if (localData === null || localData === undefined) return undefined;
    if (localPath === undefined || localPath === null || localPath === "" || localPath === ".") {
        return localData;
    }

    const segments = Array.isArray(localPath) ? localPath : String(localPath).split(".");
    let current = localData;

    for (const segment of segments) {
        if (current === null || current === undefined) return undefined;
        current = current[segment];
    }

    return current;
};

export default resolvePath;
