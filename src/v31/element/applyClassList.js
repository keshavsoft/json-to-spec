const applyClassList = ({ inElement, inClassList }) => {
    if (!inElement || !inClassList) return inElement;

    const classes = typeof inClassList === "string"
        ? inClassList.split(/\s+/).filter(Boolean)
        : Array.isArray(inClassList)
            ? inClassList.filter((item) => typeof item === "string" && item.trim())
            : [];

    if (classes.length) inElement.classList.add(...classes);

    return inElement;
};

export { applyClassList };
export default applyClassList;
