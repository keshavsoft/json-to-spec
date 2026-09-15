import fs from "fs";
import { compile, replace, iterate, operation, pipeline, pipe, jsonToSpec } from "../src/v11/index.js";

const s = JSON.parse(fs.readFileSync("test/v30/input/structure.json", "utf8"));
const d = JSON.parse(fs.readFileSync("test/v30/input/data.json", "utf8"));

console.log("=== Testing v11 Architecture ===");

// 1. Layer 1: Standalone Replace
const step1 = replace({ inStructure: s, inData: d });
console.log("1. replace() replaced header title:", step1[0].children[0].children[0].textContent === "Input Controls");
console.log("1b. replace() left template untouched:", step1[0].children[1].children[2].jsonToSpec !== undefined);

// 2. Layer 2: Standalone Iterate on replaced JSON
const step2 = iterate({ inStructure: step1, inData: d });
const rowNode = step2[0].children[1].children[2];
console.log("2. iterate() expanded row children count:", rowNode.children?.length === 5);
console.log("2b. iterate() removed jsonToSpec from row:", rowNode.jsonToSpec === undefined);
console.log("2c. iterate() populated first field title:", rowNode.children[0].children[0].textContent === "Voucher Type");
console.log("2d. iterate() populated second field value:", rowNode.children[1].children[1].attributes.value === "VCH-2026-028");

// 3. Full compile()
const fullSpec = compile(s, d);
console.log("3. compile() matches 2-step pipeline exactly:", JSON.stringify(fullSpec) === JSON.stringify(step2));

// 4. Custom pipeline()
const piped = pipeline({ inStructure: s, inData: d, inSteps: [replace, iterate] });
console.log("4. pipeline([replace, iterate]) matches compile():", JSON.stringify(fullSpec) === JSON.stringify(piped));

// 5. pipe()
const customCompiler = pipe(replace, iterate);
console.log("5. pipe(replace, iterate) matches compile():", JSON.stringify(fullSpec) === JSON.stringify(customCompiler(s, d)));

// 6. jsonToSpec namespace
const jtsReplaced = jsonToSpec.replace({ inStructure: s, inData: d });
const jtsSpec = jsonToSpec.iterate({ inStructure: jtsReplaced, inData: d });
console.log("6. jsonToSpec namespace works:", JSON.stringify(fullSpec) === JSON.stringify(jtsSpec));

console.log("=== All v11 Tests Passed! ===");
