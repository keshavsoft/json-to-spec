import registerGlobal from "./registerGlobal.js";
import meta from "./meta.js";

import { replace } from "./replace.js";

export const compile = (inStructureOrOptions, inData = {}, inShowLog = false) => {
    let localStructure = inStructureOrOptions;
    let localData = inData;

    if (inShowLog) console.log(meta.name, localStructure, localData);

    try {
        // const iteratedData = replace({
        //     inStructureAsJson: localStructure,
        //     inDataAsJson: localData,
        //     inOperation: "iterateDo",
        //     inShowLog
        // });
        // if (inShowLog) console.log("iteratedData : ", iteratedData);

        const loopedData = replace({
            inStructureAsJson: localStructure,
            inDataAsJson: localData,
            inOperation: "loopArray",
            inShowLog
        });
        // if (inShowLog) console.log("loopedData : ", loopedData);
        // const replacedData = replace({
        //     inStructureAsJson: loopedData,
        //     inDataAsJson: localData,
        //     inOperation: "replace",
        //     inShowLog
        // });

        // if (inShowLog) console.log("replacedData : ", replacedData);

        return loopedData;
    } catch (err) {
        console.error("[json-to-spec/v19] compile error:", err);
        throw err;
    }
};

registerGlobal(compile);

export default compile;