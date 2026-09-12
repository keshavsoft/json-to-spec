const h = ({ inData: c, inPath: f }) => {
  const s = c, t = f;
  if (s == null) return;
  if (t == null || t === "" || t === ".")
    return s;
  const i = Array.isArray(t) ? t : String(t).split(".");
  let n = s;
  for (const b of i) {
    if (n == null)
      return;
    n = n[b];
  }
  return n;
}, D = ({ inText: c, inItemContext: f, inRootData: s }) => {
  const t = c, i = f, n = s;
  return typeof t != "string" || !t.includes("${") ? t : t.replace(/\$\{([^}]+)\}/g, (b, o) => {
    const l = o.trim();
    let e = h({ inData: i, inPath: l });
    return e === void 0 && n && (e = h({ inData: n, inPath: l })), e != null ? String(e) : "";
  });
}, y = ({ inNode: c, inContext: f = {}, inRootData: s = {} } = {}) => {
  const t = c, i = f || {}, n = s || {};
  if (t == null) return null;
  if (Array.isArray(t)) {
    const e = [];
    for (const u of t) {
      const r = y({
        inNode: u,
        inContext: i,
        inRootData: n
      });
      Array.isArray(r) ? e.push(...r) : r != null && e.push(r);
    }
    return e;
  }
  if (typeof t != "object")
    return D({
      inText: t,
      inItemContext: i.item,
      inRootData: n
    });
  if (t.operation === "iterate" || !!t.$iterate) {
    const e = t.source || t.iterateOn || t.$iterate, u = n && n[e] || h({ inData: n, inPath: e }) || i && i[e] || h({ inData: i, inPath: e });
    if (!Array.isArray(u)) return [];
    const r = t.template || t.item || {}, x = t.filter, A = u.filter((a) => {
      if (!a || typeof a != "object") return !0;
      if (x && typeof x == "object") {
        for (const [m, d] of Object.entries(x))
          if (a[m] !== d) return !1;
      }
      return a.isVisible !== !1;
    }), C = [];
    return A.forEach((a, m) => {
      const d = {
        ...i,
        item: a,
        ...typeof a == "object" && a !== null ? a : {},
        $index: m,
        $number: m + 1
      };
      if ((e === "rows" || e.endsWith(".rows") || e === "items") && (d.row = a), i.row && (a.field || a.columnName || a.name)) {
        const N = a.field || a.columnName || a.name, v = i.row[N];
        v !== void 0 && (d.cellValue = v, d.value = v);
      }
      const p = y({
        inNode: r,
        inContext: d,
        inRootData: n
      });
      Array.isArray(p) ? C.push(...p) : p != null && C.push(p);
    }), C;
  }
  const o = { ...t }, l = i.item || i;
  if (l.type === "textarea" && o.tagName === "input" && (o.tagName = "textarea", o.attributes && (o.attributes = { ...o.attributes }, delete o.attributes.type)), o.textContent && (o.textContent = D({
    inText: o.textContent,
    inItemContext: l,
    inRootData: n
  })), o.attributes) {
    o.attributes = { ...o.attributes };
    for (const [u, r] of Object.entries(o.attributes))
      typeof r == "string" && (o.attributes[u] = D({
        inText: r,
        inItemContext: l,
        inRootData: n
      }));
    const e = l.field || l.columnName || l.name;
    l.value !== void 0 && l.value !== null ? o.attributes.value = String(l.value) : e && n[e] !== void 0 && n[e] !== null ? o.attributes.value = String(n[e]) : e && n.values && n.values[e] !== void 0 && n.values[e] !== null && (o.attributes.value = String(n.values[e]));
  }
  if (Array.isArray(o.children)) {
    const e = [];
    for (const u of o.children) {
      const r = y({
        inNode: u,
        inContext: i,
        inRootData: n
      });
      Array.isArray(r) ? e.push(...r) : r != null && e.push(r);
    }
    o.children = e;
  }
  return o;
}, g = {
  version: "1.0.0",
  name: "json-to-spec/v1",
  description: "Compiles structure.json with data.json into valid JSON specs ready for json-to-dom"
}, j = ({
  inStructure: c,
  inTree: f,
  inData: s = {}
} = {}) => {
  const t = c || f, i = s || {};
  return y({
    inNode: t,
    inContext: i,
    inRootData: i
  });
};
export {
  j as compile,
  y as compileNode,
  j as default,
  g as meta,
  h as resolvePath
};
