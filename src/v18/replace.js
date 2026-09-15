import walk from "./iterate/walk/walk.js";

/**
 * Main replace function: (structure, data) -> replaced JSON structure
 */
export const replace = ({ inStructureAsJson, inDataAsJson, inOperation }) => {
    try {
        return walk({
            inNode: inStructureAsJson,
            inData: inDataAsJson, inOperation
        });
    } catch (err) {
        console.error("[json-to-spec/v17] replace error:", err);
        throw err;
    }
};

export default replace;
