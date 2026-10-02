const applyProperties = ({ inElement, inProperties }) => {
    if (
        inElement &&
        inProperties &&
        typeof inProperties === "object"
    ) {
        Object.assign(inElement, inProperties);
    }

    return inElement;
};

export { applyProperties };
export default applyProperties;
