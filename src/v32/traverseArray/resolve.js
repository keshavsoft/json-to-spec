import { traverse } from "../traverse.js";

const resolveChild = (child, dataJson) => {
    return traverse(child, dataJson);
};

export { resolveChild };
export default resolveChild;
