const d = {
  version: "18.0.0",
  name: "json-to-spec/v18",
  description: "Minimalist 2-layer compiler: pure value replace + jsonToSpec iterate"
}, f = (n) => {
  typeof globalThis > "u" || !n || (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-dom"] = {
    meta: d,
    compile: n
  });
}, p = ({ inData: n, inDataKey: o }) => {
  const t = o;
  if (t === "") return n;
  let e = n[t];
  return t.includes(".") && (e = t.split(".").reduce(
    (a, c) => a == null ? void 0 : a[c],
    n
  )), e;
}, y = ({
  inNode: n,
  inData: o
} = {}) => {
  const t = n, e = o;
  if (!(t != null && t.textContent)) return "no-textContent";
  if (typeof t.textContent != "string") return "not-a-string";
  if (!t.textContent.includes("${")) return "no-template-token";
  const r = t.textContent.replace(/^\$\{/, "").replace(/\}$/, "");
  t.textContent = p({
    inData: e,
    inDataKey: r
  });
}, m = ({
  inNode: n,
  inData: o
} = {}) => {
  const t = n, e = o;
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
  inNode: n,
  inData: o
} = {}) => {
  const t = n, e = o;
  y({ inNode: t, inData: e }), m({ inNode: t, inData: e });
}, j = ({
  inTemplate: n,
  inSourceValues: o
} = {}) => o.map((r) => {
  const s = structuredClone(n);
  return i({
    inNode: s,
    inData: r,
    inOperation: "replace"
  });
}), A = ({
  inNode: n,
  inData: o
} = {}) => {
  const t = n, e = o;
  if (!("jsonToSpec" in t) || !("operation" in t.jsonToSpec) || t.jsonToSpec.operation !== "iterate" || !("source" in t.jsonToSpec)) return;
  const r = e[t.jsonToSpec.source], s = j({
    inTemplate: t.jsonToSpec.template,
    inSourceValues: r
  });
  t.children = s;
}, l = ({ inNode: n, inData: o, inOperation: t }) => {
  const e = n, r = t;
  if (Array.isArray(e)) {
    const s = [];
    for (const a of e) {
      const c = i({
        inNode: a,
        inData: o,
        inOperation: r
      });
      Array.isArray(c) ? s.push(...c) : c != null && s.push(c);
    }
    return s;
  }
}, i = ({
  inNode: n,
  inData: o = {},
  inOperation: t
} = {}) => {
  const e = n, r = t;
  if (e == null)
    return e;
  if (Array.isArray(e))
    return l({
      inNode: e,
      inData: o,
      inOperation: r
    });
  if ("children" in e && Array.isArray(e == null ? void 0 : e.children) && (e.children = l({
    inNode: e == null ? void 0 : e.children,
    inData: o,
    inOperation: r
  })), typeof e != "object")
    return e;
  switch (r) {
    case "replace":
      typeof e == "object" && h({
        inNode: e,
        inData: o
      });
      break;
    case "iterateDo":
      A({
        inNode: e,
        inData: o
      });
  }
  return e;
}, u = ({ inStructureAsJson: n, inDataAsJson: o, inOperation: t }) => {
  try {
    return i({
      inNode: n,
      inData: o,
      inOperation: t
    });
  } catch (e) {
    throw console.error("[json-to-spec/v17] replace error:", e), e;
  }
}, D = {
  version: "18.0.0",
  name: "json-to-spec/v18",
  description: "Minimalist 2-layer compiler: pure value replace + jsonToSpec iterate"
}, b = (n, o = {}, t = !1) => {
  let e = n, r = o;
  t && console.log(D.name, e, r);
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
f(b);
export {
  b as compile,
  b as default,
  D as meta
};
