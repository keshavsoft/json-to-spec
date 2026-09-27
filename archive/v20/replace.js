import walk from "./walk/walk.js";

/**
 * Main replace function: (structure, data) -> replaced JSON structure
 */
export const replace = ({ inStructureAsJson, inDataAsJson, inOperation, inShowLog }) => {
    try {
        return walk({
            inNode: inStructureAsJson,
            inData: inDataAsJson, inOperation, inShowLog
        });
    } catch (err) {
        console.error("[json-to-spec/v17] replace error:", err);
        throw err;
    };
};

export default replace;