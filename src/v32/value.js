/**
 * Resolve a specification value without introducing a generic transformation
 * language. This keeps value handling in one place while leaving traversal to
 * traverse.js.
 */
const resolveValue = (value) => {
    if (value === null || value === undefined) return value;
    return value;
};

export { resolveValue };
export default resolveValue;
