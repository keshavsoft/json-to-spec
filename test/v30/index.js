import { default as compile } from "../../src/index.js";
import * as domEngine from "./json-to-dom.v27.min.js";

const folder = "input";
let actionBinding = null;
let state = { structure: null, data: null, compiled: null };

const loadInput = async () => {
  const [structure, data] = await Promise.all([
    fetch(`./${folder}/structure.json`).then((r) => r.json()),
    fetch(`./${folder}/data.json`).then((r) => r.json())
  ]);
  state.structure = structure;
  state.data = data;
};

const render = () => {
  const t0 = performance.now();

  console.log("lllllllllll : ", state);


  state.compiled = compile(state.structure, state.data);
  const compileTime = (performance.now() - t0).toFixed(2);
  const compileBadge = document.getElementById("compile-time-badge");
  if (compileBadge) compileBadge.textContent = `Compiled in ${compileTime}ms`;

  const container = document.getElementById("dom-render-container");
  if (container) container.innerHTML = "";

  domEngine.specToDom({ spec: state.compiled, domIdToPushTo: "dom-render-container" });

  actionBinding?.remove?.();
  actionBinding = domEngine.listeners.bindActions({
    containerId: "dom-render-container",
    actions: {
      save: ({ values }) => {
        const badge = document.getElementById("action-event-badge");
        if (badge) { badge.className = "badge bg-success"; badge.textContent = "Input saved"; }
        const box = document.getElementById("action-event-box");
        if (box) box.textContent = JSON.stringify({ action: "save", values }, null, 2);
      },
      cancel: ({ reset }) => {
        reset();
        const badge = document.getElementById("action-event-badge");
        if (badge) { badge.className = "badge bg-warning text-dark"; badge.textContent = "Input reset"; }
        const box = document.getElementById("action-event-box");
        if (box) box.textContent = JSON.stringify({ action: "cancel" }, null, 2);
      }
    }
  });
};

const start = async () => {
  try {
    await loadInput();
    render();
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
}
