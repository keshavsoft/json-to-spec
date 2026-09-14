import { resolveTokenValue } from "../resolve/resolveTokenValue.js";

export const interpolateValue = ({ inValue, inItemContext, inRootData }) => {
    if (typeof inValue !== "string" || !inValue.includes("${")) {
        return inValue;
    }

    const exactMatch = inValue.match(/^\$\{([^}]+)\}$/);
    if (exactMatch) {
        const token = resolveTokenValue({
            inPath: exactMatch[1].trim(),
            inItemContext,
            inRootData
        });
        return token !== undefined && token !== null ? token : "";
    }

    return inValue.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        const token = resolveTokenValue({
            inPath: expr.trim(),
            inItemContext,
            inRootData
        });
        return token !== undefined && token !== null ? String(token) : "";
    });
};

export const interpolateString = ({ inText, inItemContext, inRootData }) => {
    const value = interpolateValue({
        inValue: inText,
        inItemContext,
        inRootData
    });

    return value !== undefined && value !== null ? String(value) : "";
};

export default { interpolateValue, interpolateString };
