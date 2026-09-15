const p = {
  version: "19.0.0",
  name: "json-to-spec/v19",
  description: "Minimalist 2-layer compiler: pure value replace + jsonToSpec iterate"
}, d = (r) => {
  typeof globalThis > "u" || !r || (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-spec"] = {
    meta: p,
    compile: r
  });
}, f = ({ inData: r, inDataKey: o }) => {
  const t = o;
  if (t === "") return r;
  let n = r[t];
  return t.includes(".") && (n = t.split(".").reduce(
    (s, c) => s == null ? void 0 : s[c],
    r
  )), n;
}, y = ({
  inNode: r,
  inData: o
} = {}) => {
  const t = r, n = o;
  if (!(t != null && t.textContent)) return "no-textContent";
  if (typeof t.textContent != "string") return "not-a-string";
  if (!t.textContent.includes("${")) return "no-template-token";
  const e = t.textContent.replace(/^\$\{/, "").replace(/\}$/, "");
  t.textContent = f({
    inData: n,
    inDataKey: e
  });
}, h = ({
  inNode: r,
  inData: o
} = {}) => {
  const t = r, n = o;
  if ("attributes" in t) {
    const e = Object.fromEntries(
      Object.entries(t.attributes || {}).map(([a, s]) => [
        a,
        typeof s == "string" && s.includes("${") ? f({
          inData: n,
          inDataKey: s.replace(/^\$\{/, "").replace(/\}$/, "")
        }) : s
      ])
    );
    t.attributes = { ...e };
  }
}, j = ({
  inNode: r,
  inData: o
} = {}) => {
  const t = r, n = o;
  y({ inNode: t, inData: n }), h({ inNode: t, inData: n });
}, A = ({
  inTemplate: r,
  inSourceValues: o
} = {}) => {
  const t = o;
  return t === void 0 ? void 0 : t.map((e) => {
    const a = structuredClone(r);
    return i({
      inNode: a,
      inData: e,
      inOperation: "replace"
    });
  });
}, D = ({
  inNode: r,
  inData: o,
  inShowLog: t
} = {}) => {
  const n = r, e = o;
  if (!("jsonToSpec" in n) || !("operation" in n.jsonToSpec) || n.jsonToSpec.operation !== "iterate" || !("source" in n.jsonToSpec)) return;
  const a = e[n.jsonToSpec.source], s = A({
    inTemplate: n.jsonToSpec.template,
    inSourceValues: a
  });
  n.children = s;
}, l = ({ inNode: r, inData: o, inOperation: t }) => {
  const n = r, e = t;
  if (Array.isArray(n)) {
    const a = [];
    for (const s of n) {
      const c = i({
        inNode: s,
        inData: o,
        inOperation: e
      });
      Array.isArray(c) ? a.push(...c) : c != null && a.push(c);
    }
    return a;
  }
}, i = ({
  inNode: r,
  inData: o = {},
  inOperation: t,
  inShowLog: n = !1
} = {}) => {
  const e = r, a = o, s = t;
  if (n && console.log("walk ", r, o, t), e == null)
    return e;
  if (Array.isArray(e))
    return l({
      inNode: e,
      inData: o,
      inOperation: s
    });
  if ("children" in e && Array.isArray(e == null ? void 0 : e.children) && (e.children = l({
    inNode: e == null ? void 0 : e.children,
    inData: o,
    inOperation: s
  })), typeof e != "object")
    return e;
  switch (s) {
    case "replace":
      typeof e == "object" && j({
        inNode: e,
        inData: o
      });
      break;
    case "iterateDo":
      D({
        inNode: e,
        inData: a,
        inShowLog: n
      });
  }
  return e;
}, u = ({ inStructureAsJson: r, inDataAsJson: o, inOperation: t, inShowLog: n }) => {
  try {
    return i({
      inNode: r,
      inData: o,
      inOperation: t,
      inShowLog: n
    });
  } catch (e) {
    throw console.error("[json-to-spec/v17] replace error:", e), e;
  }
}, m = (r, o = {}, t = !1) => {
  let n = r, e = o;
  t && console.log(p.name, n, e);
  try {
    const a = u({
      inStructureAsJson: n,
      inDataAsJson: e,
      inOperation: "iterateDo",
      inShowLog: t
    }), s = u({
      inStructureAsJson: a,
      inDataAsJson: e,
      inOperation: "replace",
      inShowLog: t
    });
    return t && console.log("iteratedData : ", a, s), s;
  } catch (a) {
    throw console.error("[json-to-spec/v19] compile error:", a), a;
  }
};
d(m);
export {
  m as compile,
  m as default
};
