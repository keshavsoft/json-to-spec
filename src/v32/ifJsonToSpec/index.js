import ifLoopArray from "./ifLoopArray/index.js";
import ifLoopObject from "./ifLoopObject/index.js";

const startFunc = (inJsonToSpec, dataJson) => {
    if ("operation" in inJsonToSpec) {
        if (inJsonToSpec.operation === "loopArray") {
            return ifLoopArray(inJsonToSpec, dataJson)
        };

        if (inJsonToSpec.operation === "loopObject") {
            // debugger
            return ifLoopObject(inJsonToSpec, dataJson)
        };
    };
};

export default startFunc;