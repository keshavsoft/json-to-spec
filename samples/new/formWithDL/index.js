import buildSpecElement from "../../../src/index.js";

import "https://keshavsoft.github.io/json-to-tag/dist/v8/min.js";

import structure from "./input/structure.json" with {type: 'json'};
import data from "./input/data.json" with {type: 'json'};

const htmlId = "table";

const VARIANT = "inline"; // "stacked" | "inline" | "list"

const start = () => {
  try {
    let specAsJsonToDom = buildSpecElement(structure[VARIANT], data);
    console.log("specAsJsonToDom : ", specAsJsonToDom);

    if (!("tagName" in specAsJsonToDom)) {
      specAsJsonToDom = specAsJsonToDom.children;
    };

    const container = document.getElementById(htmlId);

    if (container) container.innerHTML = "";

    const content = window.ks.jsonToTag.buildSpecElement(specAsJsonToDom);
    container.append(content);

    console.log("content : ", content);

  } catch (err) {
    const container = document.getElementById("dom-render-container");
    if (container) container.innerHTML = `<div style="color:#b91c1c">Error: ${err.message}</div>`;
  }
};

start();