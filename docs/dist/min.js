const p = ({ inData: o, inDataKey: n }) => {
  const t = n;
  if (t === "") return o;
  let e = o[t];
  return t.includes(".") && (e = t.split(".").reduce(
    (a, c) => a == null ? void 0 : a[c],
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
}, y = ({
  inNode: o,
  inData: n
} = {}) => {
  const t = o, e = n;
  if ("attributes" in t) {
    const r = Object.fromEntries(
      Object.entries(t.attributes || {}).map(([s, a]) => [
        s,
        typeof a == "string" && a.includes("${") ? p({
          inData: e,
          inDataKey: a.replace(/^\$\{/, "").replace(/\}$/, "")
        }) : a
      ])
    );
    t.attributes = { ...r };
  }
}, h = ({
  inNode: o,
  inData: n
} = {}) => {
  const t = o, e = n;
  d({ inNode: t, inData: e }), y({ inNode: t, inData: e });
}, j = ({
  inTemplate: o,
  inSourceValues: n
} = {}) => n.map((r) => {
  const s = structuredClone(o);
  return i({
    inNode: s,
    inData: r,
    inOperation: "replace"
  });
}), A = ({
  inNode: o,
  inData: n
} = {}) => {
  const t = o, e = n;
  if (!("jsonToSpec" in t) || !("operation" in t.jsonToSpec) || t.jsonToSpec.operation !== "iterate" || !("source" in t.jsonToSpec)) return;
  const r = e[t.jsonToSpec.source], s = j({
    inTemplate: t.jsonToSpec.template,
    inSourceValues: r
  });
  t.children = s;
}, l = ({ inNode: o, inData: n, inOperation: t }) => {
  const e = o, r = t;
  if (Array.isArray(e)) {
    const s = [];
    for (const a of e) {
      const c = i({
        inNode: a,
        inData: n,
        inOperation: r
      });
      Array.isArray(c) ? s.push(...c) : c != null && s.push(c);
    }
    return s;
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
      typeof e == "object" && h({
        inNode: e,
        inData: n
      });
      break;
    case "iterateDo":
      A({
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
}, f = {
  version: "18.0.0",
  name: "json-to-spec/v18",
  description: "Minimalist 2-layer compiler: pure value replace + jsonToSpec iterate"
}, D = (o, n = {}, t = !1) => {
  let e = o, r = n;
  t && console.log(f.name, e, r);
  try {
    const s = u({
      inStructureAsJson: e,
      inDataAsJson: r,
      inOperation: "iterateDo"
    }), a = u({
      inStructureAsJson: s,
      inDataAsJson: r,
      inOperation: "replace"
    });
    return console.log("iteratedData : ", s, a), a;
  } catch (s) {
    throw console.error("[json-to-spec/v17] compile error:", s), s;
  }
};
typeof globalThis < "u" && (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-spec"] = {
  meta: f,
  compile: D
});
export {
  D as compile,
  D as default,
  f as meta
};
