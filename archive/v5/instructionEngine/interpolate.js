import { resolveTokenValue } from "./resolveTokenValue.js";

export const interpolateValue = ({ inValue, inItemContext, inRootData }) => {
    const localValue = inValue;
    const localItemContext = inItemContext;
    const localRootData = inRootData;

    if (typeof localValue !== "string" || !localValue.includes("${")) {
        return localValue;
    }

    const exactTokenMatch = localValue.match(/^\$\{([^}]+)\}$/);
    if (exactTokenMatch) {
        const tokenValue = resolveTokenValue({
            inPath: exactTokenMatch[1].trim(),
            inItemContext: localItemContext,
            inRootData: localRootData
        });

        return tokenValue !== undefined && tokenValue !== null ? tokenValue : "";
    }

    return localValue.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        const tokenValue = resolveTokenValue({
            inPath: expr.trim(),
            inItemContext: localItemContext,
            inRootData: localRootData
        });

        return tokenValue !== undefined && tokenValue !== null ? String(tokenValue) : "";
    });
};

export const interpolateString = ({ inText, inItemContext, inRootData }) => {
    const interpolatedValue = interpolateValue({
        inValue: inText,
        inItemContext,
        inRootData
    });

    return interpolatedValue !== undefined && interpolatedValue !== null
        ? String(interpolatedValue)
        : "";
};

export default { interpolateValue, interpolateString };
