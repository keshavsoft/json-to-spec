const p = ({ inData: o, inDataKey: n }) => {
  const t = n;
  if (t === "") return o;
  let e = o[t];
  return t.includes(".") && (e = t.split(".").reduce(
    (s, a) => s == null ? void 0 : s[a],
    o
  )), e;
}, d = ({
  inNode: o,
  inData: n
} = {}) => {
  const t = o, e = n;
  if (!(t != null && t.textContent)) return "no-textContent";
  if (typeof t.textContent != "string") return "not-a-string";
  if (!t.textContent.includes("${")) return "no-template-token";
  const r = t.textContent.replace(/^\$\{/, "").replace(/\}$/, "");
  t.textContent = p({
    inData: e,
    inDataKey: r
  });
}, f = ({
  inNode: o,
  inData: n
} = {}) => {
  const t = o, e = n;
  if ("attributes" in t) {
    const r = Object.fromEntries(
      Object.entries(t.attributes || {}).map(([c, s]) => [
        c,
        typeof s == "string" && s.includes("${") ? p({
          inData: e,
          inDataKey: s.replace(/^\$\{/, "").replace(/\}$/, "")
        }) : s
      ])
    );
    t.attributes = { ...r };
  }
}, y = ({
  inNode: o,
  inData: n
} = {}) => {
  const t = o, e = n;
  d({ inNode: t, inData: e }), f({ inNode: t, inData: e });
}, h = ({
  inTemplate: o,
  inSourceValues: n
} = {}) => n.map((r) => {
  const c = structuredClone(o);
  return i({
    inNode: c,
    inData: r,
    inOperation: "replace"
  });
}), j = ({
  inNode: o,
  inData: n
} = {}) => {
  const t = o, e = n;
  if (!("jsonToSpec" in t) || !("operation" in t.jsonToSpec) || t.jsonToSpec.operation !== "iterate" || !("source" in t.jsonToSpec)) return;
  const r = e[t.jsonToSpec.source], c = h({
    inTemplate: t.jsonToSpec.template,
    inSourceValues: r
  });
  t.children = c;
}, l = ({ inNode: o, inData: n, inOperation: t }) => {
  const e = o, r = t;
  if (Array.isArray(e)) {
    const c = [];
    for (const s of e) {
      const a = i({
        inNode: s,
        inData: n,
        inOperation: r
      });
      Array.isArray(a) ? c.push(...a) : a != null && c.push(a);
    }
    return c;
  }
}, i = ({
  inNode: o,
  inData: n = {},
  inOperation: t
} = {}) => {
  const e = o, r = t;
  if (e == null)
    return e;
  if (Array.isArray(e))
    return l({
      inNode: e,
      inData: n,
      inOperation: r
    });
  if ("children" in e && Array.isArray(e == null ? void 0 : e.children) && (e.children = l({
    inNode: e == null ? void 0 : e.children,
    inData: n,
    inOperation: r
  })), typeof e != "object")
    return e;
  switch (r) {
    case "replace":
      typeof e == "object" && y({
        inNode: e,
        inData: n
      });
      break;
    case "iterateDo":
      j({
        inNode: e,
        inData: n
      });
  }
  return e;
}, u = ({ inStructureAsJson: o, inDataAsJson: n, inOperation: t }) => {
  try {
    return i({
      inNode: o,
      inData: n,
      inOperation: t
    });
  } catch (e) {
    throw console.error("[json-to-spec/v17] replace error:", e), e;
  }
}, A = {
  version: "18.0.0",
  name: "json-to-spec/v17",
  description: "Minimalist 2-layer compiler: pure value replace + jsonToSpec iterate"
}, D = (o, n = {}) => {
  let t = o, e = n;
  console.log("ccccccccccccc-------- : ", e);
  try {
    const r = u({
      inStructureAsJson: t,
      inDataAsJson: e,
      inOperation: "iterateDo"
    }), c = u({
      inStructureAsJson: r,
      inDataAsJson: e,
      inOperation: "replace"
    });
    return console.log("iteratedData : ", r, c), c;
  } catch (r) {
    throw console.error("[json-to-spec/v17] compile error:", r), r;
  }
};
typeof globalThis < "u" && (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-spec"] = {
  meta: A,
  compile: D
});
export {
  D as compile,
  D as default,
  A as meta
};
