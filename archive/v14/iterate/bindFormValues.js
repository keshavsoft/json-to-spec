/**
 * Recursively binds form field values into
 * input, textarea, select and option nodes.
 */
const bindFormValues = ({ inNode, inItem, inData }) => {
    const localNode = inNode;
    const localItem = inItem;
    const localData = inData;

    if (!localNode || typeof localNode !== "object") {
        return localNode;
    }

    if (localNode.attributes) {
        const isFormField = [
            "input",
            "textarea",
            "select",
            "option"
        ].includes(localNode.tagName?.toLowerCase());

        if (isFormField) {
            const fieldName =
                localItem.field ||
                localItem.columnName ||
                localItem.name;

            if (
                localItem.value !== undefined &&
                localItem.value !== null
            ) {
                localNode.attributes.value = String(localItem.value);

                if (
                    localNode.tagName === "textarea" &&
                    !localNode.textContent
                ) {
                    localNode.textContent = String(localItem.value);
                }
            } else if (
                fieldName &&
                localData[fieldName] !== undefined &&
                localData[fieldName] !== null
            ) {
                localNode.attributes.value = String(
                    localData[fieldName]
                );

                if (
                    localNode.tagName === "textarea" &&
                    !localNode.textContent
                ) {
                    localNode.textContent = String(
                        localData[fieldName]
                    );
                }
            }
        }
    }

    if (Array.isArray(localNode.children)) {
        localNode.children.forEach(child => {
            bindFormValues({
                inNode: child,
                inItem: localItem,
                inData: localData
            });
        });
    }

    return localNode;
};

export default bindFormValues;