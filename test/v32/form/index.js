import compile from "../../../src/index.js";

import { specToDom } from "https://keshavsoft.github.io/json-to-dom/dist/v31/min.js";

const folder = "input";

const loadInput = async () => {
    const [structure, data] = await Promise.all([
        fetch(`./${folder}/structure.json`).then((r) => r.json()),
        fetch(`./${folder}/data.json`).then((r) => r.json())
    ]);

    return {
        structure,
        data
    };
};

const render = (structure, data) => {
    const t0 = performance.now();

    const specAsJsonToDom = compile({
        specJson: structure.stacked, dataJson: data
    });
    console.log("specAsJsonToDom : ", specAsJsonToDom, compile);

    const compileTime = (performance.now() - t0).toFixed(2);
    const compileBadge = document.getElementById("compile-time-badge");
    if (compileBadge) compileBadge.textContent = `Compiled in ${compileTime}ms`;

    const container = document.getElementById("dom-render-container");
    if (container) container.innerHTML = "";

    specToDom({ spec: specAsJsonToDom, targetHtmlId: "dom-render-container" });
};

const start = async () => {
    try {
        const {
            structure,
            data
        } = await loadInput();

        render(structure, data);
    } catch (err) {
        const container = document.getElementById("dom-render-container");
        if (container) container.innerHTML = `<div style="color:#b91c1c">Error: ${err.message}</div>`;
    }
};

start();

const head1 = document.getElementById("head1");
const version = window?.ks?.["json-to-spec"]?.meta?.version;
if (version && head1) {
    head1.innerHTML += ` - ${version}`;
};
