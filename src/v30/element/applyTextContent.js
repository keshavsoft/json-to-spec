const applyTextContent = ({ inElement, inTextContent }) => {
    if (!inElement || inTextContent === undefined || inTextContent === null) {
        return inElement;
    }

    inElement.textContent = inTextContent;
    return inElement;
};

export { applyTextContent };
export default applyTextContent;
