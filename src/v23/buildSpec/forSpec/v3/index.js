import buildSpec from "../../index.js";

const resolveTemplate = (template, data) => {
    if (typeof template !== "string") {
        return template;
    };

    return template.replace(/\$\{([^}]+)\}/g, (_, path) => {

        const keys = path.trim().split(".");

        let value = data;

        for (const key of keys) {
            if (value === null || value === undefined) {
                return "";
            }

            value = value[key];
        }

        if (
            value === null ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            return String(value ?? "");
        }

        return value;
    });
};

const startFunc = ({ inSpecJson, inData, inShowLog }) => {
    // console.log("inData : ", inData);

    // Create a completely new tree.
    const newSpec = structuredClone(inSpecJson);

    if (typeof inData === 'string') {
        // console.log("It's a string!");
        // console.log("inData : ", inData, newSpec);
        if ("textContent" in newSpec) {
            if (newSpec.textContent === "${}") {
                newSpec.textContent = inData;
            } else if (typeof newSpec.textContent === "string") {
                newSpec.textContent = newSpec.textContent.replaceAll("${}", () => inData);
            };
        };

        if ("attributes" in newSpec) {
            newSpec.attributes = Object.fromEntries(
                Object.entries(newSpec.attributes).map(
                    ([attributeName, attributeValue]) => [
                        attributeName,
                        attributeValue === "${}"
                            ? inData
                            : (typeof attributeValue === "string"
                                ? attributeValue.replaceAll("${}", () => inData)
                                : attributeValue)
                    ]
                )
            );
        };

    } else {
        if ("key" in inData && "value" in inData) {

            if ("textContent" in newSpec) {
                newSpec.textContent = resolveTemplate(
                    newSpec.textContent,
                    inData
                );
            };

        } else {

            if ("textContent" in newSpec) {
                newSpec.textContent = resolveTemplate(
                    newSpec.textContent,
                    inData
                );
            };

            if ("attributes" in newSpec) {
                newSpec.attributes = Object.fromEntries(
                    Object.entries(newSpec.attributes).map(
                        ([attributeName, attributeValue]) => [
                            attributeName,
                            resolveTemplate(attributeValue, inData)
                        ]
                    )
                );
            };

            if ("children" in newSpec) {
                newSpec.children = newSpec.children.map((child) => {
                    return buildSpec({
                        inSpecJson: child,
                        inShowLog: inShowLog,
                        inDataJson: inData
                    });
                });
            };

        };

    };

    return newSpec;
};

export default startFunc;