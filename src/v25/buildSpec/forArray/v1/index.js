import dispatchSpec from "../../index.js";

const startFunc = ({ inTemplate, inDataAsArray }) => {

    const localDataAsArray = inDataAsArray;
    const localTemplate = inTemplate;

    if (!Array.isArray(localDataAsArray)) {
        return [];
    };
    // console.log("localDataAsArray : ", localDataAsArray);

    const childrenArray = localDataAsArray.map((element, loopIndex) => {
        const newTemplate = structuredClone(localTemplate);

        return dispatchSpec({
            inSpecJson: newTemplate,
            inDataJson: element, inRowIndex: loopIndex
        });
    });

    return childrenArray;
};

export default startFunc;