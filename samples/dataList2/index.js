import compile from "../../src/index.js";
// import * as domEngine from "./json-to-dom.v27.min.js";

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
  const specAsJsonToDom = compile({
    specJson: structure,
    dataJson: data
  });

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
