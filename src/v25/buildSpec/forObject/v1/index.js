import dispatchSpec from "../../index.js";

const startFunc = ({ inTemplate, inDataAsObject }) => {

    const localDataAsObject = inDataAsObject;
    const localTemplate = inTemplate;
    // console.log("localDataAsObject : ", inTemplate, localDataAsObject);

    if (
        localDataAsObject === null ||
        typeof localDataAsObject !== "object"
    ) {
        return [];
    };

    const childrenArray = [];

    for (const [key, value] of Object.entries(localDataAsObject)) {

        const newTemplate = structuredClone(localTemplate);

        const createdElement = dispatchSpec({
            inSpecJson: newTemplate,
            inDataJson: {
                key,
                value
            }
        });

        childrenArray.push(createdElement);
    };

    return childrenArray;
};

export default startFunc;