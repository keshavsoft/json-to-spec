import { compile } from "../../src/index.js";
import * as bundledDomEngine from "./json-to-dom.v27.min.js";

const variations = {
    input: { folder: "input", label: "Inputs" },
    textarea: { folder: "textarea", label: "Textarea" },
    select: { folder: "select", label: "Select" },
    multiselect: { folder: "multiselect", label: "Multi Select" },
    radio: { folder: "radio", label: "Radio" },
    checkbox: { folder: "checkbox", label: "Checkbox" },
    checkboxGroup: { folder: "checkbox-group", label: "Checkbox Group" }
};

const domEngine = bundledDomEngine;
let actionBinding = null;
let currentVariation = "input";

const state = Object.fromEntries(
    Object.keys(variations).map((key) => [key, { structure: null, data: null, compiled: null }])
);

const loadVariation = async (key) => {
    const folder = variations[key].folder;
    const [structure, data] = await Promise.all([
        fetch(`./${folder}/structure.json`).then((response) => response.json()),
        fetch(`./${folder}/data.json`).then((response) => response.json())
    ]);

    state[key].structure = structure;
    state[key].data = data;
};

const startFunc = async () => {
    try {
        console.log("[json-to-spec v28 Test] Using bundled json-to-dom:", domEngine.meta);
        await Promise.all(Object.keys(variations).map((key) => loadVariation(key)));
        setupVariationSwitcher();
        renderVariation(currentVariation);
    } catch (error) {
        console.error("Initialization failed:", error);
        updateEventBadge("Initialization Failed", "bg-danger");
        const container = document.getElementById("dom-render-container");
        if (container) {
            container.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        }
    }
};

const renderVariation = (variationKey) => {
    currentVariation = variationKey;
    const current = state[variationKey];
    if (!current) return;

    const t0 = performance.now();
    current.compiled = compile(current.structure, current.data);
    const compileTime = (performance.now() - t0).toFixed(2);

    const compileTimeBadge = document.getElementById("compile-time-badge");
    if (compileTimeBadge) {
        compileTimeBadge.textContent = `Compiled in ${compileTime}ms`;
    }

    const folderBadge = document.getElementById("folder-badge");
    if (folderBadge) {
        folderBadge.textContent = `Folder: ./${variations[variationKey].folder}/`;
    }

    const structureBox = document.getElementById("structure-box");
    const dataBox = document.getElementById("data-box");
    const specBox = document.getElementById("spec-box");

    if (structureBox) structureBox.textContent = JSON.stringify(current.structure, null, 2);
    if (dataBox) dataBox.textContent = JSON.stringify(current.data, null, 2);
    if (specBox) specBox.textContent = JSON.stringify(current.compiled, null, 2);

    const container = document.getElementById("dom-render-container");
    if (container) container.innerHTML = "";

    domEngine.specToDom({
        spec: current.compiled,
        domIdToPushTo: "dom-render-container"
    });

    actionBinding?.remove?.();
    actionBinding = domEngine.listeners.bindActions({
        containerId: "dom-render-container",
        actions: {
            save: ({ values }) => {
                updateEventBadge(`${variations[currentVariation].label} saved`, "bg-success");
                updateEventBox({
                    variation: currentVariation,
                    folder: variations[currentVariation].folder,
                    action: "save",
                    timestamp: new Date().toLocaleTimeString(),
                    totalFields: Object.keys(values).length,
                    formData: values
                });
            },
            cancel: ({ reset }) => {
                reset();
                updateEventBadge(`${variations[currentVariation].label} reset`, "bg-warning text-dark");
                updateEventBox({
                    variation: currentVariation,
                    folder: variations[currentVariation].folder,
                    action: "cancel",
                    timestamp: new Date().toLocaleTimeString(),
                    status: "Form reset to blank"
                });
            }
        }
    });
};

const setupVariationSwitcher = () => {
    const buttons = document.querySelectorAll("[data-variation-tab]");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((btn) => {
                btn.classList.remove("active", "btn-primary");
                btn.classList.add("btn-outline-secondary");
            });

            button.classList.add("active", "btn-primary");
            button.classList.remove("btn-outline-secondary");

            renderVariation(button.dataset.variationTab);
        });
    });
};

const updateEventBadge = (text, badgeClass) => {
    const badge = document.getElementById("action-event-badge");
    if (badge) {
        badge.className = `badge ${badgeClass}`;
        badge.textContent = text;
    }
};

const updateEventBox = (data) => {
    const box = document.getElementById("action-event-box");
    if (box) {
        box.textContent = JSON.stringify(data, null, 2);
    }
};

startFunc();
