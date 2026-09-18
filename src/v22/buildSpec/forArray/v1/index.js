import dispatchSpec from "../../index.js";

const startFunc = ({ inTemplate, inDataAsArray }) => {

    const localDataAsArray = inDataAsArray;
    const localTemplate = inTemplate;

    if (!Array.isArray(localDataAsArray)) {
        return [];
    };

    const childrenArray = localDataAsArray.map(element => {

        // console.log("OUTER forArray element:", element);

        const newTemplate = structuredClone(localTemplate);

        return dispatchSpec({
            inSpecJson: newTemplate,
            inDataJson: element
        });
    });

    return childrenArray;
};

export default startFunc;