import { traverse } from "../../traverse.js";

const startFunc = (inJsonToSpec, dataJson) => {
    if ("source" in inJsonToSpec) {
        if (inJsonToSpec?.source in dataJson) {
            const columns = dataJson[inJsonToSpec?.source];

            if (Array.isArray(columns)) {
                const resolvedTemplates = columns.map(element => {
                    const template = inJsonToSpec?.template;

                    if (template) {
                        const resolvedTemplate = traverse(template, element);

                        return resolvedTemplate;
                    };
                });

                return resolvedTemplates;
            };
        };
    };
};

export default startFunc;