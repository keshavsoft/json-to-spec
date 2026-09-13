import { compile } from "../../src/index.js";
import * as bundledDomEngine from "./json-to-dom.v27.min.js";

let domEngine = bundledDomEngine;
let actionBinding = null;
let currentVariation = "hybrid";
const state = {
    hybrid: { structure: null, data: null, compiled: null },
    table: { structure: null, data: null, compiled: null },
    form: { structure: null, data: null, compiled: null },
    controls: { structure: null, data: null, compiled: null },
    repeaters: { structure: null, data: null, compiled: null }
};

const normalizeRowPayload = ({ values = {}, target = null }) => {
    const dataset = target?.dataset || {};

    return {
        ...values,
        voucherNo: values.voucherNo ?? dataset.voucherNo ?? null,
        voucherDate: values.voucherDate ?? dataset.voucherDate ?? null,
        partyName: values.partyName ?? dataset.partyName ?? null,
        amount: values.amount ?? dataset.amount ?? null,
        status: values.status ?? dataset.status ?? null,
        type: values.type ?? dataset.type ?? null
    };
};

const startFunc = async () => {
    try {
        updateCdnBadge("Connected to local json-to-dom bundle", "bg-success");
        console.log("[json-to-spec v27 Test] Using bundled json-to-dom v27:", domEngine.meta);

        // 1. Fetch structure and data for all 5 variations
        state.hybrid.structure = await fetch("./hybrid/structure.json").then(r => r.json());
        state.hybrid.data = await fetch("./hybrid/data.json").then(r => r.json());

        state.table.structure = await fetch("./table/structure.json").then(r => r.json());
        state.table.data = await fetch("./table/data.json").then(r => r.json());

        state.form.structure = await fetch("./form/structure.json").then(r => r.json());
        state.form.data = await fetch("./form/data.json").then(r => r.json());

        state.controls.structure = await fetch("./controls/structure.json").then(r => r.json());
        state.controls.data = await fetch("./controls/data.json").then(r => r.json());

        state.repeaters.structure = await fetch("./repeaters/structure.json").then(r => r.json());
        state.repeaters.data = await fetch("./repeaters/data.json").then(r => r.json());

        // 2. Setup tabs and run initial compile & render
        setupVariationSwitcher();
        renderVariation("hybrid");

    } catch (err) {
        console.error("Initialization failed:", err);
        const container = document.getElementById("dom-render-container");
        if (container) {
            container.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
        }
    }
};

const renderVariation = (variationKey) => {
    currentVariation = variationKey;
    const current = state[variationKey];
    if (!current) return;

    // 1. COMPILE via json-to-spec: (structure + data) -> spec
    const t0 = performance.now();
    current.compiled = compile(current.structure, current.data);
    const compileTime = (performance.now() - t0).toFixed(2);

    const compileTimeBadge = document.getElementById("compile-time-badge");
    if (compileTimeBadge) {
        compileTimeBadge.textContent = `Compiled in ${compileTime}ms`;
    }

    // 2. Update 3-panel display (Structure, Data, Compiled Spec)
    const structBox = document.getElementById("structure-box");
    const dataBox = document.getElementById("data-box");
    const specBox = document.getElementById("spec-box");

    if (structBox) structBox.textContent = JSON.stringify(current.structure, null, 2);
    if (dataBox) dataBox.textContent = JSON.stringify(current.data, null, 2);
    if (specBox) specBox.textContent = JSON.stringify(current.compiled, null, 2);

    // 3. RENDER via json-to-dom v27
    const container = document.getElementById("dom-render-container");
    if (container) container.innerHTML = "";

    domEngine.specToDom({
        spec: current.compiled,
        domIdToPushTo: "dom-render-container"
    });

    // 4. HOOK LISTENERS via json-to-dom v27
    actionBinding?.remove?.();
    actionBinding = domEngine.listeners.bindActions({
        containerId: "dom-render-container",
        actions: {
            applyFilter: ({ values }) => {
                updateEventBadge("applyFilter Fired!", "bg-info text-dark");
                updateEventBox({
                    source: "toolbar",
                    action: "applyFilter",
                    timestamp: new Date().toLocaleTimeString(),
                    criteria: values
                });
            },
            selectRow: ({ values, target }) => {
                const selectedRecord = normalizeRowPayload({ values, target });

                updateEventBadge(`selectRow Fired (${selectedRecord.voucherNo || "Unknown"})!`, "bg-primary");
                updateEventBox({
                    source: "table",
                    action: "selectRow",
                    timestamp: new Date().toLocaleTimeString(),
                    selectedRecord
                });

                // In hybrid mode, auto-fill the form
                const voucherInput = document.querySelector('#dom-render-container input[name="voucherNumber"]');
                const partyInput = document.querySelector('#dom-render-container input[name="partyName"]');
                const dateInput = document.querySelector('#dom-render-container input[name="voucherDate"]');
                const amountInput = document.querySelector('#dom-render-container input[name="amount"]');
                if (voucherInput && selectedRecord.voucherNo) voucherInput.value = selectedRecord.voucherNo;
                if (partyInput && selectedRecord.partyName) partyInput.value = selectedRecord.partyName;
                if (dateInput && selectedRecord.voucherDate) dateInput.value = selectedRecord.voucherDate;
                if (amountInput && selectedRecord.amount) amountInput.value = selectedRecord.amount;
            },
            inspectSummaryCard: ({ target }) => {
                const dataset = target?.dataset || {};
                updateEventBadge(`summary card: ${dataset.cardTitle || "Unknown"}`, "bg-info text-dark");
                updateEventBox({
                    source: "repeaters.summaryCards",
                    action: "inspectSummaryCard",
                    timestamp: new Date().toLocaleTimeString(),
                    card: {
                        title: dataset.cardTitle || null,
                        value: dataset.cardValue || null,
                        trend: dataset.cardTrend || null,
                        tone: dataset.cardTone || null
                    }
                });
            },
            inspectChecklistItem: ({ target }) => {
                const dataset = target?.dataset || {};
                updateEventBadge(`checklist item: ${dataset.taskStatus || "Unknown"}`, "bg-secondary");
                updateEventBox({
                    source: "repeaters.taskGroups",
                    action: "inspectChecklistItem",
                    timestamp: new Date().toLocaleTimeString(),
                    task: {
                        groupTitle: dataset.groupTitle || null,
                        label: dataset.taskLabel || null,
                        status: dataset.taskStatus || null
                    }
                });
            },
            inspectAccordionEntry: ({ target }) => {
                const dataset = target?.dataset || {};
                updateEventBadge(`accordion entry: ${dataset.entryTitle || "Unknown"}`, "bg-primary");
                updateEventBox({
                    source: "repeaters.accordionSections",
                    action: "inspectAccordionEntry",
                    timestamp: new Date().toLocaleTimeString(),
                    entry: {
                        sectionTitle: dataset.sectionTitle || null,
                        title: dataset.entryTitle || null,
                        status: dataset.entryStatus || null,
                        amount: dataset.entryAmount || null
                    }
                });
            },
            save: ({ values }) => {
                updateEventBadge("save Fired! Form Extracted", "bg-success");
                updateEventBox({
                    source: "form",
                    action: "save",
                    timestamp: new Date().toLocaleTimeString(),
                    totalFields: Object.keys(values).length,
                    formData: values
                });
            },
            cancel: ({ reset }) => {
                reset();
                updateEventBadge("cancel Fired! Form Reset", "bg-warning text-dark");
                updateEventBox({
                    source: "form",
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
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active", "btn-primary"));
            buttons.forEach(b => b.classList.add("btn-outline-secondary"));

            btn.classList.add("active", "btn-primary");
            btn.classList.remove("btn-outline-secondary");

            const key = btn.dataset.variationTab;
            renderVariation(key);
        });
    });
};

const updateCdnBadge = (text, badgeClass) => {
    const badge = document.getElementById("cdn-status-badge");
    if (badge) {
        badge.className = `badge ${badgeClass} py-2 px-3 small`;
        badge.textContent = text;
    }
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
