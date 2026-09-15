import resolvePath from "../resolvePath.js";

/**
 * Resolves the collection array targeted by an iteration instruction.
 */
const resolveCollection = ({ inNode, inContext, inData }) => {
    const localNode = inNode;
    const localContext = inContext;
    const localData = inData;

    const instruction = localNode && (
        localNode.jsonToSpec ||
        (localNode.operation ? localNode : null)
    );

    if (!instruction) return undefined;

    const sourceKey =
        instruction.source ||
        instruction.iterateOn ||
        instruction.$iterate;

    if (!sourceKey) return undefined;

    return resolvePath({
        inData: localData,
        inPath: sourceKey
    })
        || (localData && localData[sourceKey])
        || resolvePath({
            inData: localContext,
            inPath: sourceKey
        })
        || (localContext && localContext[sourceKey]);
};

export default resolveCollection;