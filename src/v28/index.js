import registerGlobal from "./registerGlobal.js";
import buildSpec from "./buildSpec/index.js";

/**
 * @overload
 * @param {any} spec - The spec JSON
 * @param {any} data - The data JSON
 * @param {string[]} [directiveKeys] - Keys that trigger directive handling (default: ["jsonToSpec"])
 * @returns {any}
 */
/**
 * @overload
 * @param {{ specJson: any, dataJson: any, showLog?: boolean, directiveKeys?: string[] | Record<string,Function> }} options
 * @returns {any}
 */
const buildSpecElement = (inArg1, inArg2, inArg3) => {
    const localIsObject = inArg1 !== null && typeof inArg1 === "object" && !Array.isArray(inArg1);
    const localSpecJson = localIsObject ? inArg1.specJson : inArg1;
    const localDataJson = localIsObject ? inArg1.dataJson : inArg2;
    const localShowLog = localIsObject ? (inArg1.showLog ?? false) : false;
    const localDirectiveKeys = localIsObject ? inArg1.directiveKeys : inArg3;

    try {
        if (localShowLog) console.log("jsonToSpec 1 : ", localSpecJson);

        const element = buildSpec({
            inSpecJson: localSpecJson,
            inShowLog: localShowLog, inDataJson: localDataJson,
            inDirectiveKeys: localDirectiveKeys
        });

        return element;
    } catch (error) {
        console.log("error : ", error);
    };
};

registerGlobal(buildSpecElement);

export default buildSpecElement;
