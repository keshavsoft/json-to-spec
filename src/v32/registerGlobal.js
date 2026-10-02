import meta from "./meta.js";

export const registerGlobal = ({ inFuncDefinition } = {}) => {
    if (typeof globalThis === "undefined" || !inFuncDefinition) return;

    globalThis.ks ??= {};

    const api = {
        meta,
        buildSpecElement: inFuncDefinition
    };

    globalThis.ks["json-to-tag"] = api;
    globalThis.ks.jsonToTag = api;
};

export default registerGlobal;
