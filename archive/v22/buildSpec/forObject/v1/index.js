import dispatchSpec from "../../index.js";

const startFunc = ({ inTemplate, inDataAsObject }) => {

    const localDataAsObject = inDataAsObject;
    const localTemplate = inTemplate;

    if (
        localDataAsObject === null ||
        typeof localDataAsObject !== "object"
    ) {
        return [];
    };

    const childrenArray = [];

    for (const [key, value] of Object.entries(localDataAsObject)) {

        // console.log(
        //     "INNER:",
        //     key,
        //     value,
        //     typeof value
        // );

        const newTemplate = structuredClone(localTemplate);

        const createdElement = dispatchSpec({
            inSpecJson: newTemplate,
            inDataJson: {
                key,
                value
            }
        });

        // console.log(
        //     "INNER createdElement:",
        //     createdElement
        // );

        childrenArray.push(createdElement);
    };

    return childrenArray;
};

export default startFunc;