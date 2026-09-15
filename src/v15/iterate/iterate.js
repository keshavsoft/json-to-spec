import walk from "./walk/walk.js";
import expandIteration from "./expandIteration.js";

/**
 * Iterates a structure by walking the tree
 * and applying the iteration operation to each node.
 */
const iterate = ({
    inStructure,
    inData = {},
    inContext = {}
} = {}) => {
    return walk({
        inNode: inStructure,
        inData,
        inContext,
        inOperation: ({ inNode, inContext, inData }) => {
            return expandIteration({
                inNode,
                inContext,
                inData,
                walk
            });
        }
    });
};

export {
    iterate
};

export default iterate;