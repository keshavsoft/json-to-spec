import buildSpecElement from "../../src/index.js";

import "https://keshavsoft.github.io/json-to-tag/dist/v4/min.js";

const folder = "input";
const htmlId = "table";

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
  let specAsJsonToDom = buildSpecElement({ specJson: structure, dataJson: data });

  if (!("tagName" in specAsJsonToDom)) {
    specAsJsonToDom = specAsJsonToDom.children;
  };

  const container = document.getElementById(htmlId);

  if (container) container.innerHTML = "";

  const content = window.ks.jsonToTag.buildSpecElement(specAsJsonToDom);
  container.append(content);

  console.log("content : ", content);

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
