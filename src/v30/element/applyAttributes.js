const applyAttributes = ({ inElement, inAttributes }) => {
    if (
        !inElement ||
        !inAttributes ||
        typeof inAttributes !== "object"
    ) {
        return inElement;
    }

    Object.entries(inAttributes).forEach(([attrName, value]) => {
        if (attrName === "class") {
            inElement.className = value;
            return;
        }

        if (typeof value === "boolean") {
            if (value) {
                inElement.setAttribute(attrName, "");
            } else {
                inElement.removeAttribute(attrName);
            }
            return;
        }

        if (value !== undefined && value !== null) {
            inElement.setAttribute(attrName, String(value));
        }
    });

    return inElement;
};

export { applyAttributes };
export default applyAttributes;
