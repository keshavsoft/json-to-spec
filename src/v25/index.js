import registerGlobal from "./registerGlobal.js";
import buildSpec from "./buildSpec/index.js";

const buildSpecElement = ({ specJson,
    showLog = false, dataJson }) => {
    try {
        if (showLog) console.log("jsonToSpec 1 : ", specJson);

        const element = buildSpec({
            inSpecJson: specJson,
            inShowLog: showLog, inDataJson: dataJson
        });

        return element;
    } catch (error) {
        console.log("error : ", error);
    };
};

registerGlobal(buildSpecElement);

export default buildSpecElement;
