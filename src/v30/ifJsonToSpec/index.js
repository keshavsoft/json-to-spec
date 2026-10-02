import { traverse } from "../traverse.js";

const startFunc = (inJsonToSpec, dataJson) => {
    if ("operation" in inJsonToSpec) {
        if (inJsonToSpec.operation === "loopArray") {
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
    };
};

const startFunc1 = (inJsonToSpec, dataJson) => {
    if ("operation" in inJsonToSpec) {
        if (inJsonToSpec.operation === "loopArray") {
            if ("source" in inJsonToSpec) {
                if (inJsonToSpec?.source in dataJson) {
                    const columns = dataJson[inJsonToSpec?.source];

                    if (Array.isArray(columns)) {
                        for (const column of columns) {
                            const template = inJsonToSpec?.template;

                            if (template) {
                                const resolvedTemplate = traverse(template, column);

                                return resolvedTemplate;
                            };

                        };
                    };
                };
            };
        };
    };
};

export default startFunc;