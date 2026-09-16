import resolvePath from "./resolvePath.js";
import walk from "./iterate/walk/walk.js";

/**
 * Resolves a token expression path against local context first, then root data.
 */
const resolveTokenValue = ({ inPath, inContext, inData }) => {
    const localPath = inPath;
    const localContext = inContext;
    const localData = inData;

    let value = resolvePath({ inData: localContext, inPath: localPath });

    if (value === undefined && localContext && typeof localContext === "object") {
        if (localContext.item && typeof localContext.item === "object") {
            value = resolvePath({ inData: localContext.item, inPath: localPath });
        }
        if (value === undefined && localContext.row && typeof localContext.row === "object") {
            value = resolvePath({ inData: localContext.row, inPath: localPath });
        }
    }

    if (value === undefined && localData) {
        value = resolvePath({ inData: localData, inPath: localPath });
    }

    return value;
};

/**
 * Replaces ${path} tokens in a string value.
 */
const replaceValue = ({ inValue, inContext, inData }) => {
    const localValue = inValue;
    const localContext = inContext;
    const localData = inData;

    if (typeof localValue !== "string" || !localValue.includes("${")) {
        return localValue;
    }

    const hasItemContext = Boolean(localContext && (localContext.item || Object.keys(localContext).length > 0));

    // Exact match: "${path}" -> preserve primitive types (boolean, number, object)
    const exactMatch = localValue.match(/^\$\{([^}]+)\}$/);
    if (exactMatch) {
        const token = resolveTokenValue({
            inPath: exactMatch[1].trim(),
            inContext: localContext,
            inData: localData
        });
        return token !== undefined && token !== null ? token : (hasItemContext ? "" : localValue);
    }

    // Substring interpolation: "Hello ${name}" -> string replacement
    return localValue.replace(/\$\{([^}]+)\}/g, (fullMatch, expr) => {
        const token = resolveTokenValue({
            inPath: expr.trim(),
            inContext: localContext,
            inData: localData
        });
        return token !== undefined && token !== null ? String(token) : (hasItemContext ? "" : fullMatch);
    });
};

/**
 * Recursively walks a JSON tree and replaces all ${...} tokens against data.
 */
export const replaceNode = ({ inNode, inContext = {}, inData = {} } = {}) => {
    const localNode = inNode;
    const localContext = inContext;
    const localData = inData;

    if (localNode === null || localNode === undefined) return localNode;

    if (Array.isArray(localNode)) {
        return localNode.map(child => replaceNode({
            inNode: child,
            inContext: localContext,
            inData: localData
        }));
    }

    if (typeof localNode === "string") {
        return replaceValue({
            inValue: localNode,
            inContext: localContext,
            inData: localData
        });
    }

    if (typeof localNode !== "object") {
        return localNode;
    }

    const clone = { ...localNode };

    if (clone.textContent && typeof clone.textContent === "string") {
        clone.textContent = replaceValue({
            inValue: clone.textContent,
            inContext: localContext,
            inData: localData
        });
    }

    if (clone.attributes) {
        clone.attributes = { ...clone.attributes };
        for (const [name, val] of Object.entries(clone.attributes)) {
            if (typeof val === "string") {
                clone.attributes[name] = replaceValue({
                    inValue: val,
                    inContext: localContext,
                    inData: localData
                });
            }
        }
    }

    if (clone.properties) {
        clone.properties = { ...clone.properties };
        for (const [name, val] of Object.entries(clone.properties)) {
            if (typeof val === "string") {
                clone.properties[name] = replaceValue({
                    inValue: val,
                    inContext: localContext,
                    inData: localData
                });
            }
        }
    }

    if (Array.isArray(clone.children)) {
        clone.children = clone.children.map(child => replaceNode({
            inNode: child,
            inContext: localContext,
            inData: localData
        }));
    }

    return clone;
};

/**
 * Main replace function: (structure, data) -> replaced JSON structure
 */
export const replace = ({ inStructureAsJson, inDataAsJson }) => {
    return walk({
        inNode: inStructureAsJson,
        inData: inDataAsJson
    });
};

export default replace;
