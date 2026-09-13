import { compile } from "../../src/index.js";

// CDN or local server URL for json-to-dom v27
const DOM_V27_CDN = "http://localhost:3000/docs/dist/v27/min.js";

let domEngine = null;
let currentVariation = "hybrid";
const state = {
    hybrid: { structure: null, data: null, compiled: null },
    table: { structure: null, data: null, compiled: null },
    form: { structure: null, data: null, compiled: null }
};

const startFunc = async () => {
    try {
        // 1. Load json-to-dom v27 bundle dynamically
        try {
            domEngine = await import(DOM_V27_CDN);
            console.log("[json-to-spec v27 Test] Loaded json-to-dom v27 bundle from CDN/local server:", domEngine.meta);
            updateCdnBadge("Connected to json-to-dom v27 CDN", "bg-success");
        } catch (err) {
            console.warn("[json-to-spec v27 Test] Could not load from localhost:3000 CDN, using window.ks fallback if present:", err);
            if (window.ks?.['json-to-dom']) {
                domEngine = window.ks['json-to-dom'];
                updateCdnBadge("Connected via window.ks fallback", "bg-info text-dark");
            } else {
                updateCdnBadge("CDN Connection Failed", "bg-danger");
                throw new Error("json-to-dom v27 bundle could not be loaded. Please ensure server is running on http://localhost:3000");
            }
        }

        // 2. Fetch structure and data for all 3 variations
        state.hybrid.structure = await fetch("./hybrid/structure.json").then(r => r.json());
        state.hybrid.data = await fetch("./hybrid/data.json").then(r => r.json());

        state.table.structure = await fetch("./table/structure.json").then(r => r.json());
        state.table.data = await fetch("./table/data.json").then(r => r.json());

        state.form.structure = await fetch("./form/structure.json").then(r => r.json());
        state.form.data = await fetch("./form/data.json").then(r => r.json());

        // 3. Setup tabs and run initial compile & render
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
    domEngine.listeners.bindActions({
        containerId: "dom-render-container",
        actions: {
            applyFilter: ({ values }) => {
                updateEventBadge('applyFilter Fired!', 'bg-info text-dark');
                updateEventBox({
                    source: "toolbar",
                    action: "applyFilter",
                    timestamp: new Date().toLocaleTimeString(),
                    criteria: values
                });
            },
            selectRow: ({ values }) => {
                updateEventBadge(`selectRow Fired (${values.voucherNo})!`, 'bg-primary');
                updateEventBox({
                    source: "table",
                    action: "selectRow",
                    timestamp: new Date().toLocaleTimeString(),
                    selectedRecord: values
                });

                // In hybrid mode, auto-fill the form
                const voucherInput = document.querySelector('#dom-render-container input[name="voucherNumber"]');
                const partyInput = document.querySelector('#dom-render-container input[name="partyName"]');
                const dateInput = document.querySelector('#dom-render-container input[name="voucherDate"]');
                const amountInput = document.querySelector('#dom-render-container input[name="amount"]');
                if (voucherInput && values.voucherNo) voucherInput.value = values.voucherNo;
                if (partyInput && values.partyName) partyInput.value = values.partyName;
                if (dateInput && values.voucherDate) dateInput.value = values.voucherDate;
                if (amountInput && values.amount) amountInput.value = values.amount;
            },
            save: ({ values }) => {
                updateEventBadge('save Fired! Form Extracted', 'bg-success');
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
                updateEventBadge('cancel Fired! Form Reset', 'bg-warning text-dark');
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
