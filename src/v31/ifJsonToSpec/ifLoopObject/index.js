import { traverse } from "../../traverse.js";

const startFunc = (inJsonToSpec, dataJson) => {
    let toReturnArray = [];

    for (const [key, value] of Object.entries(dataJson)) {
        const template = inJsonToSpec?.template;

        if (template) {
            const resolvedTemplate = traverse(template, {
                key, value
            });

            toReturnArray.push(resolvedTemplate);
        };

    };

    return toReturnArray;
};

export default startFunc;