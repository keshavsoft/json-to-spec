import fs from "fs";
import { compile, operation, replace, other, pipeline, pipe, jsonToSpec } from "../src/v9/index.js";

const s = JSON.parse(fs.readFileSync("test/v30/input/structure.json", "utf8"));
const d = JSON.parse(fs.readFileSync("test/v30/input/data.json", "utf8"));

// 1. Full compile
const fullCompiled = compile(s, d);
console.log("1. compile() succeeded:", Array.isArray(fullCompiled));

// 2. Step-by-step
const step1 = operation({ inStructure: s, inData: d });
const step2 = replace({ inStructure: step1, inData: d });
const step3 = other({ inStructure: step2, inData: d });
const stepByStepMatch = JSON.stringify(fullCompiled) === JSON.stringify(step3);
console.log("2. Step-by-step matches compile():", stepByStepMatch);

// 3. pipeline()
const piped = pipeline({ inStructure: s, inData: d, inSteps: [operation, replace, other] });
console.log("3. pipeline() matches compile():", JSON.stringify(fullCompiled) === JSON.stringify(piped));

// 4. pipe()
const customCompiler = pipe(operation, replace, other);
const pipeRes = customCompiler(s, d);
console.log("4. pipe() matches compile():", JSON.stringify(fullCompiled) === JSON.stringify(pipeRes));

// 5. jsonToSpec namespace
const jts1 = jsonToSpec.operation({ inStructure: s, inData: d });
const jts2 = jsonToSpec.replace({ inStructure: jts1, inData: d });
const jts3 = jsonToSpec.other({ inStructure: jts2, inData: d });
console.log("5. jsonToSpec matches compile():", JSON.stringify(fullCompiled) === JSON.stringify(jts3));

// 6. Standalone replace
const templateOnly = { tagName: "h1", textContent: "Hello ${meta.formTitle}" };
const replacedOnly = replace({ inStructure: templateOnly, inData: d });
console.log("6. Standalone replace:", replacedOnly.textContent === "Hello Input Controls");

// 7. Standalone operation
console.log("7. Standalone operation expanded items:", step1[0].children[1].children[2].children.length === 5);

// 8. Select with nested options
const selectS = JSON.parse(fs.readFileSync("test/v28/select/structure.json", "utf8"));
const selectD = JSON.parse(fs.readFileSync("test/v28/select/data.json", "utf8"));
const selectCompiled = compile(selectS, selectD);
const selectStep1 = operation({ inStructure: selectS, inData: selectD });
const selectStep2 = replace({ inStructure: selectStep1, inData: selectD });
const selectStep3 = other({ inStructure: selectStep2, inData: selectD });
console.log("8. Nested select matches step-by-step:", JSON.stringify(selectCompiled) === JSON.stringify(selectStep3));

// 9. Table with nested thead/tbody
const tableS = JSON.parse(fs.readFileSync("test/v27/table/structure.json", "utf8"));
const tableD = JSON.parse(fs.readFileSync("test/v27/table/data.json", "utf8"));
const tableCompiled = compile(tableS, tableD);
const tableStep1 = operation({ inStructure: tableS, inData: tableD });
const tableStep2 = replace({ inStructure: tableStep1, inData: tableD });
const tableStep3 = other({ inStructure: tableStep2, inData: tableD });
console.log("9. Nested table matches step-by-step:", JSON.stringify(tableCompiled) === JSON.stringify(tableStep3));

// 10. Root exports check
import * as rootExport from "../src/index.js";
console.log("10. Root re-exports compile:", typeof rootExport.compile === "function");
console.log("11. Root re-exports operation:", typeof rootExport.operation === "function");
console.log("12. Root re-exports replace:", typeof rootExport.replace === "function");
console.log("13. Root re-exports other:", typeof rootExport.other === "function");
console.log("14. Root re-exports pipeline:", typeof rootExport.pipeline === "function");
console.log("15. Root re-exports jsonToSpec:", typeof rootExport.jsonToSpec === "object");
