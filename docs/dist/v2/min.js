const p = ({ inData: t, inPath: f }) => {
  const c = t, e = f;
  if (c == null) return;
  if (e == null || e === "" || e === ".")
    return c;
  const u = Array.isArray(e) ? e : String(e).split(".");
  let n = c;
  for (const g of u) {
    if (n == null)
      return;
    n = n[g];
  }
  return n;
}, S = ({ inText: t, inItemContext: f, inRootData: c }) => {
  const e = t, u = f, n = c;
  return typeof e != "string" || !e.includes("${") ? e : e.replace(/\$\{([^}]+)\}/g, (g, a) => {
    const s = a.trim();
    let d = p({ inData: u, inPath: s });
    return d === void 0 && n && (d = p({ inData: n, inPath: s })), d != null ? String(d) : "";
  });
}, b = ({ inNode: t, inContext: f = {}, inRootData: c = {} } = {}) => {
  var d;
  const e = t, u = f || {}, n = c || {};
  if (e == null) return null;
  if (Array.isArray(e)) {
    const l = [];
    for (const r of e) {
      const i = b({
        inNode: r,
        inContext: u,
        inRootData: n
      });
      Array.isArray(i) ? l.push(...i) : i != null && l.push(i);
    }
    return l;
  }
  if (typeof e != "object")
    return S({
      inText: e,
      inItemContext: u.item,
      inRootData: n
    });
  if (e.operation === "iterate" || !!e.$iterate) {
    const l = e.source || e.iterateOn || e.$iterate, r = n && n[l] || p({ inData: n, inPath: l }) || u && u[l] || p({ inData: u, inPath: l });
    if (!Array.isArray(r)) return [];
    const i = e.template || e.item || {}, A = e.filter, D = r.filter((o) => {
      if (!o || typeof o != "object") return !0;
      if (A && typeof A == "object") {
        for (const [h, y] of Object.entries(A))
          if (o[h] !== y) return !1;
      }
      return o.isVisible !== !1;
    }), N = [];
    return D.forEach((o, h) => {
      const y = {
        ...u,
        item: o,
        ...typeof o == "object" && o !== null ? o : {},
        $index: h,
        $number: h + 1
      };
      if ((l === "rows" || l.endsWith(".rows") || l === "items") && (y.row = o), u.row && (o.field || o.columnName || o.name)) {
        const j = o.field || o.columnName || o.name, v = u.row[j];
        v !== void 0 && (y.cellValue = v, y.value = v);
      }
      const m = b({
        inNode: i,
        inContext: y,
        inRootData: n
      });
      Array.isArray(m) ? N.push(...m) : m != null && N.push(m);
    }), N;
  }
  const a = { ...e }, s = u.item || u;
  if (s.type === "textarea" && a.tagName === "input" && (a.tagName = "textarea", a.attributes && (a.attributes = { ...a.attributes }, delete a.attributes.type)), a.textContent && (a.textContent = S({
    inText: a.textContent,
    inItemContext: s,
    inRootData: n
  })), a.attributes) {
    a.attributes = { ...a.attributes };
    for (const [r, i] of Object.entries(a.attributes))
      typeof i == "string" && (a.attributes[r] = S({
        inText: i,
        inItemContext: s,
        inRootData: n
      }));
    if (["input", "textarea", "select", "option"].includes((d = a.tagName) == null ? void 0 : d.toLowerCase())) {
      const r = s.field || s.columnName || s.name;
      s.value !== void 0 && s.value !== null ? a.attributes.value = String(s.value) : r && n[r] !== void 0 && n[r] !== null ? a.attributes.value = String(n[r]) : r && n.values && n.values[r] !== void 0 && n.values[r] !== null && (a.attributes.value = String(n.values[r]));
    }
  }
  if (Array.isArray(a.children)) {
    const l = [];
    for (const r of a.children) {
      const i = b({
        inNode: r,
        inContext: u,
        inRootData: n
      });
      Array.isArray(i) ? l.push(...i) : i != null && l.push(i);
    }
    a.children = l;
  }
  return a;
}, R = {
  version: "2.0.0",
  name: "json-to-spec/v2",
  description: "Pure JSON Specification Compiler: (contextJson, dataJson) -> Spec JSON ready for json-to-dom"
}, x = (t, f = {}) => {
  let c = t, e = f || {};
  return t && typeof t == "object" && !Array.isArray(t) && ("context" in t && ("data" in t || f === void 0 || Object.keys(f).length === 0) ? (c = t.context, e = t.data || e) : "structure" in t && ("data" in t || f === void 0 || Object.keys(f).length === 0) ? (c = t.structure, e = t.data || e) : ("inStructure" in t || "inContext" in t || "inTree" in t) && (c = t.inStructure || t.inContext || t.inTree, e = t.inData || e)), b({
    inNode: c,
    inContext: e,
    inRootData: e
  });
};
export {
  x as compile,
  b as compileNode,
  x as default,
  R as meta,
  p as resolvePath
};
