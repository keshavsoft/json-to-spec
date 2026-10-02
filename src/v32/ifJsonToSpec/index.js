import ifLoopArray from "./ifLoopArray/index.js";
import ifLoopObject from "./ifLoopObject/index.js";
import ifLoopCollection from "./ifLoopCollection/index.js";

const startFunc = (inJsonToSpec, dataJson) => {
    if ("operation" in inJsonToSpec) {
        if (inJsonToSpec.operation === "loopArray") {
            return ifLoopArray(inJsonToSpec, dataJson)
        };

        if (inJsonToSpec.operation === "loopObject") {
            return ifLoopObject(inJsonToSpec, dataJson)
        };

        if (inJsonToSpec.operation === "loopCollection") {
            return ifLoopCollection(inJsonToSpec, dataJson)
        };

    };
};

export default startFunc;