const startFunc = (textContent, dataJson) => {
    if (typeof dataJson === "string") return dataJson;

    if (typeof textContent !== "string") return textContent;

    if (textContent === "${value}") {
        return dataJson.value;
    };

    const match = textContent.match(/^\$\{(.+?)\}$/);

    if (match) {
        const key = match[1];

        return dataJson?.[key] ?? "";
    };

    return textContent;
};

export default startFunc;