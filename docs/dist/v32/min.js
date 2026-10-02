const m = {
  version: "v32",
  description: "JSON-to-DOM engine with centralized traversal and responsibility-focused construction"
}, b = ({ inFuncDefinition: r } = {}) => {
  if (typeof globalThis > "u" || !r) return;
  globalThis.ks ?? (globalThis.ks = {});
  const t = {
    meta: m,
    buildSpecElement: r
  };
  globalThis.ks["json-to-tag"] = t, globalThis.ks.jsonToTag = t;
}, n = (r, t) => f(r, t), y = (r, t) => Array.isArray(r) ? r.map((e) => n(e, t)).flat(1 / 0).filter(Boolean) : [], s = (r, t) => {
  if ("source" in r && (r == null ? void 0 : r.source) in t) {
    const e = t[r == null ? void 0 : r.source];
    if (Array.isArray(e))
      return e.map((l) => {
        const i = r == null ? void 0 : r.template;
        if (i)
          return f(i, l);
      });
  }
}, v = (r, t) => {
  let e = [];
  for (const [u, l] of Object.entries(t)) {
    const i = r == null ? void 0 : r.template;
    if (i) {
      const a = f(i, {
        key: u,
        value: l
      });
      e.push(a);
    }
  }
  return e;
}, A = (r, t) => {
  if ("source" in r && (r == null ? void 0 : r.source) in t) {
    const e = t[r == null ? void 0 : r.source];
    if (Array.isArray(e))
      return e.map((l) => {
        const i = r == null ? void 0 : r.template;
        if (i)
          return f(i, l);
      });
  }
}, g = (r, t) => {
  if ("operation" in r) {
    if (r.operation === "loopArray")
      return s(r, t);
    if (r.operation === "loopObject")
      return v(r, t);
    if (r.operation === "loopCollection")
      return A(r, t);
  }
}, c = (r, t) => {
  if (typeof t == "string") return t;
  if (typeof r != "string") return r;
  if (r === "${value}")
    return t.value;
  const e = r.match(/^\$\{(.+?)\}$/);
  if (e) {
    const u = e[1];
    return (t == null ? void 0 : t[u]) ?? "";
  }
  return r;
}, h = (r, t) => {
  let e = {};
  for (const [u, l] of Object.entries(r)) {
    const i = c(l, t);
    e[u] = i;
  }
  return e;
}, j = (r, t) => {
  if ("tagName" in r) {
    if ("textContent" in r) {
      const e = c(r.textContent, t);
      r.textContent = e;
    }
    if ("attributes" in r) {
      const e = h(r.attributes, t);
      r.attributes = e;
    }
  }
}, o = (r, t) => {
  if (!r || typeof r != "object" || Array.isArray(r)) return null;
  const e = structuredClone(r);
  if (!e) return null;
  if ("tagName" in e && j(e, t), "jsonToSpec" in e) {
    const u = e == null ? void 0 : e.jsonToSpec, l = g(u, t);
    Array.isArray(l) ? e.children = l : e.children = [l], delete e.jsonToSpec;
  }
  if (Array.isArray(e == null ? void 0 : e.children)) {
    const u = y(e == null ? void 0 : e.children, t);
    e.children = u;
  }
  return e;
}, f = (r, t) => {
  if (r == null) return null;
  debugger;
  return typeof Node < "u" && r instanceof Node ? r : Array.isArray(r) ? y(r, t) : typeof r == "object" ? o(r, t) : typeof r == "string" || typeof r == "number" ? document.createTextNode(String(r)) : r;
}, d = (r, t) => f(r, t), $ = d, F = f;
b({
  inFuncDefinition: d
});
export {
  F as buildSpec,
  d as buildSpecElement,
  d as default,
  m as meta,
  $ as specToDom,
  f as traverse
};
