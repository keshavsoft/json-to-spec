import registerGlobal from "./registerGlobal.js";
import { traverse } from "./traverse.js";
import meta from "./meta.js";

const buildSpecElement = (specJson, dataJson) => {
    return traverse(specJson, dataJson);
};

const specToDom = buildSpecElement;
const buildSpec = traverse;

export {
    buildSpecElement,
    specToDom,
    buildSpec,
    traverse,
    meta
};

registerGlobal({
    inFuncDefinition: buildSpecElement,
});

export default buildSpecElement;
