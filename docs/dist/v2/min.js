const b = ({ inData: t, inPath: f }) => {
  const s = t, e = f;
  if (s == null) return;
  if (e == null || e === "" || e === ".")
    return s;
  const u = Array.isArray(e) ? e : String(e).split(".");
  let n = s;
  for (const g of u) {
    if (n == null)
      return;
    n = n[g];
  }
  return n;
}, S = ({ inText: t, inItemContext: f, inRootData: s }) => {
  const e = t, u = f, n = s;
  return typeof e != "string" || !e.includes("${") ? e : e.replace(/\$\{([^}]+)\}/g, (g, a) => {
    const c = a.trim();
    let d = b({ inData: u, inPath: c });
    return d === void 0 && n && (d = b({ inData: n, inPath: c })), d != null ? String(d) : "";
  });
}, h = ({ inNode: t, inContext: f = {}, inRootData: s = {} } = {}) => {
  var d;
  const e = t, u = f || {}, n = s || {};
  if (e == null) return null;
  if (Array.isArray(e)) {
    const i = [];
    for (const l of e) {
      const r = h({
        inNode: l,
        inContext: u,
        inRootData: n
      });
      Array.isArray(r) ? i.push(...r) : r != null && i.push(r);
    }
    return i;
  }
  if (typeof e != "object")
    return S({
      inText: e,
      inItemContext: u.item,
      inRootData: n
    });
  if (e.operation === "iterate" || !!e.$iterate) {
    const i = e.source || e.iterateOn || e.$iterate, l = n && n[i] || b({ inData: n, inPath: i }) || u && u[i] || b({ inData: u, inPath: i });
    if (!Array.isArray(l)) return [];
    const r = e.template || e.item || {}, A = e.filter, j = l.filter((o) => {
      if (!o || typeof o != "object") return !0;
      if (A && typeof A == "object") {
        for (const [p, y] of Object.entries(A))
          if (o[p] !== y) return !1;
      }
      return o.isVisible !== !1;
    }), N = [];
    return j.forEach((o, p) => {
      const y = {
        ...u,
        item: o,
        ...typeof o == "object" && o !== null ? o : {},
        $index: p,
        $number: p + 1
      };
      if ((i === "rows" || i.endsWith(".rows") || i === "items") && (y.row = o), u.row && (o.field || o.columnName || o.name)) {
        const D = o.field || o.columnName || o.name, v = u.row[D];
        v !== void 0 && (y.cellValue = v, y.value = v);
      }
      const m = h({
        inNode: r,
        inContext: y,
        inRootData: n
      });
      Array.isArray(m) ? N.push(...m) : m != null && N.push(m);
    }), N;
  }
  const a = { ...e }, c = u.item || u;
  if (c.type === "textarea" && a.tagName === "input" && (a.tagName = "textarea", a.attributes && (a.attributes = { ...a.attributes }, delete a.attributes.type)), a.textContent && (a.textContent = S({
    inText: a.textContent,
    inItemContext: c,
    inRootData: n
  })), a.attributes) {
    a.attributes = { ...a.attributes };
    for (const [l, r] of Object.entries(a.attributes))
      typeof r == "string" && (a.attributes[l] = S({
        inText: r,
        inItemContext: c,
        inRootData: n
      }));
    if (["input", "textarea", "select", "option"].includes((d = a.tagName) == null ? void 0 : d.toLowerCase())) {
      const l = c.field || c.columnName || c.name;
      c.value !== void 0 && c.value !== null ? a.attributes.value = String(c.value) : l && n[l] !== void 0 && n[l] !== null ? a.attributes.value = String(n[l]) : l && n.values && n.values[l] !== void 0 && n.values[l] !== null && (a.attributes.value = String(n.values[l]));
    }
  }
  if (Array.isArray(a.children)) {
    const i = [];
    for (const l of a.children) {
      const r = h({
        inNode: l,
        inContext: u,
        inRootData: n
      });
      Array.isArray(r) ? i.push(...r) : r != null && i.push(r);
    }
    a.children = i;
  }
  return a;
}, R = {
  version: "2.0.0",
  name: "json-to-spec/v2",
  description: "Pure JSON Specification Compiler: (contextJson, dataJson) -> Spec JSON ready for json-to-dom"
}, T = (t, f = {}) => {
  let s = t, e = f || {};
  return t && typeof t == "object" && !Array.isArray(t) && ("context" in t && ("data" in t || f === void 0 || Object.keys(f).length === 0) ? (s = t.context, e = t.data || e) : "structure" in t && ("data" in t || f === void 0 || Object.keys(f).length === 0) ? (s = t.structure, e = t.data || e) : ("inStructure" in t || "inContext" in t || "inTree" in t) && (s = t.inStructure || t.inContext || t.inTree, e = t.inData || e)), h({
    inNode: s,
    inContext: e,
    inRootData: e
  });
};
typeof globalThis < "u" && (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-spec"] = {
  meta: R,
  compile: T,
  compileNode: h,
  resolvePath: b
});
export {
  T as compile,
  h as compileNode,
  T as default,
  R as meta,
  b as resolvePath
};
