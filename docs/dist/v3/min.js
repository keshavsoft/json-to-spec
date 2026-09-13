const x = ({ inData: i, inPath: u }) => {
  const f = i, e = u;
  if (f == null) return;
  if (e == null || e === "" || e === ".")
    return f;
  const a = Array.isArray(e) ? e : String(e).split(".");
  let o = f;
  for (const l of a) {
    if (o == null)
      return;
    o = o[l];
  }
  return o;
}, D = ({ inPath: i, inItemContext: u, inRootData: f }) => {
  const e = i, a = u, o = f;
  let l = x({ inData: a, inPath: e });
  return l === void 0 && a && typeof a == "object" && (a.item && typeof a.item == "object" && (l = x({ inData: a.item, inPath: e })), l === void 0 && a.row && typeof a.row == "object" && (l = x({ inData: a.row, inPath: e }))), l === void 0 && o && (l = x({ inData: o, inPath: e })), l;
}, h = ({ inValue: i, inItemContext: u, inRootData: f }) => {
  const e = i, a = u, o = f;
  if (typeof e != "string" || !e.includes("${"))
    return e;
  const l = e.match(/^\$\{([^}]+)\}$/);
  if (l) {
    const t = D({
      inPath: l[1].trim(),
      inItemContext: a,
      inRootData: o
    });
    return t ?? "";
  }
  return e.replace(/\$\{([^}]+)\}/g, (t, d) => {
    const y = D({
      inPath: d.trim(),
      inItemContext: a,
      inRootData: o
    });
    return y != null ? String(y) : "";
  });
}, v = ({ inText: i, inItemContext: u, inRootData: f }) => {
  const e = h({
    inValue: i,
    inItemContext: u,
    inRootData: f
  });
  return e != null ? String(e) : "";
}, C = ({ inNode: i, inContext: u = {}, inRootData: f = {} } = {}) => {
  var y;
  const e = i, a = u || {}, o = f || {};
  if (e == null) return null;
  if (Array.isArray(e)) {
    const s = [];
    for (const r of e) {
      const c = C({
        inNode: r,
        inContext: a,
        inRootData: o
      });
      Array.isArray(c) ? s.push(...c) : c != null && s.push(c);
    }
    return s;
  }
  if (typeof e != "object")
    return v({
      inText: e,
      inItemContext: a,
      inRootData: o
    });
  const l = e.jsonToSpec || (e.operation ? e : null);
  if (l && (l.operation === "iterate" || l.source || l.$iterate)) {
    const s = l.source || l.iterateOn || l.$iterate, r = x({ inData: o, inPath: s }) || o && o[s] || x({ inData: a, inPath: s }) || a && a[s];
    if (!Array.isArray(r)) {
      if (e.tagName) {
        const n = { ...e };
        return delete n.jsonToSpec, n.children = [], n;
      }
      return [];
    }
    const c = l.template || l.item || {}, N = l.filter, V = r.filter((n) => {
      if (!n || typeof n != "object") return !0;
      if (N && typeof N == "object") {
        for (const [m, p] of Object.entries(N))
          if (n[m] !== p) return !1;
      }
      return n.isVisible !== !1;
    }), g = [];
    if (V.forEach((n, m) => {
      const p = {
        ...a,
        item: n,
        ...typeof n == "object" && n !== null ? n : {},
        $index: m,
        $number: m + 1
      };
      if ((s === "rows" || s.endsWith(".rows") || s === "items" || s.endsWith("Rows")) && (p.row = n), a.row && (n.field || n.columnName || n.name)) {
        const T = n.field || n.columnName || n.name, j = a.row[T];
        j !== void 0 && (p.cellValue = j, p.value = j, typeof n == "object" && n !== null && n.value === void 0 && (n.value = j));
      }
      const b = C({
        inNode: c,
        inContext: p,
        inRootData: o
      });
      Array.isArray(b) ? g.push(...b) : b != null && g.push(b);
    }), e.tagName) {
      const n = { ...e };
      if (delete n.jsonToSpec, n.children = g, n.textContent && (n.textContent = v({
        inText: n.textContent,
        inItemContext: a,
        inRootData: o
      })), n.attributes) {
        n.attributes = { ...n.attributes };
        for (const [m, p] of Object.entries(n.attributes))
          typeof p == "string" && (n.attributes[m] = h({
            inValue: p,
            inItemContext: a,
            inRootData: o
          }));
      }
      if (n.properties) {
        n.properties = { ...n.properties };
        for (const [m, p] of Object.entries(n.properties))
          typeof p == "string" && (n.properties[m] = h({
            inValue: p,
            inItemContext: a,
            inRootData: o
          }));
      }
      return n;
    }
    return g;
  }
  const t = { ...e };
  "jsonToSpec" in t && delete t.jsonToSpec;
  const d = {
    ...typeof a.item == "object" ? a.item : {},
    ...a
  };
  if (d.type === "textarea" && t.tagName === "input" && (t.tagName = "textarea", t.attributes && (t.attributes = { ...t.attributes }, delete t.attributes.type)), t.textContent && (t.textContent = v({
    inText: t.textContent,
    inItemContext: d,
    inRootData: o
  })), t.attributes) {
    t.attributes = { ...t.attributes };
    for (const [r, c] of Object.entries(t.attributes))
      typeof c == "string" && (t.attributes[r] = h({
        inValue: c,
        inItemContext: d,
        inRootData: o
      }));
    if (["input", "textarea", "select", "option"].includes((y = t.tagName) == null ? void 0 : y.toLowerCase())) {
      const r = d.field || d.columnName || d.name;
      d.value !== void 0 && d.value !== null ? (t.attributes.value = String(d.value), t.tagName === "textarea" && !t.textContent && (t.textContent = String(d.value))) : r && o[r] !== void 0 && o[r] !== null ? (t.attributes.value = String(o[r]), t.tagName === "textarea" && !t.textContent && (t.textContent = String(o[r]))) : r && o.values && o.values[r] !== void 0 && o.values[r] !== null && (t.attributes.value = String(o.values[r]), t.tagName === "textarea" && !t.textContent && (t.textContent = String(o.values[r])));
    }
  }
  if (t.properties) {
    t.properties = { ...t.properties };
    for (const [s, r] of Object.entries(t.properties))
      typeof r == "string" && (t.properties[s] = h({
        inValue: r,
        inItemContext: d,
        inRootData: o
      }));
  }
  if (Array.isArray(t.children)) {
    const s = [];
    for (const r of t.children) {
      const c = C({
        inNode: r,
        inContext: a,
        inRootData: o
      });
      Array.isArray(c) ? s.push(...c) : c != null && s.push(c);
    }
    t.children = s;
  }
  return t;
}, R = {
  version: "3.0.0",
  name: "json-to-spec/v3",
  description: "Pure JSON Specification Compiler with jsonToSpec namespace: (structure, data) -> Spec JSON ready for json-to-dom"
}, A = (i, u = {}) => {
  let f = i, e = u || {};
  return i && typeof i == "object" && !Array.isArray(i) && ("structure" in i && ("data" in i || u === void 0 || Object.keys(u).length === 0) ? (f = i.structure, e = i.data || e) : "context" in i && ("data" in i || u === void 0 || Object.keys(u).length === 0) ? (f = i.context, e = i.data || e) : ("inStructure" in i || "inContext" in i || "inTree" in i) && (f = i.inStructure || i.inContext || i.inTree, e = i.inData || e)), C({
    inNode: f,
    inContext: e,
    inRootData: e
  });
};
typeof globalThis < "u" && (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-spec"] = {
  meta: R,
  compile: A,
  compileNode: C,
  resolvePath: x
}, globalThis.ks["json-to-spec-v3"] = globalThis.ks["json-to-spec"]);
export {
  A as compile,
  C as compileNode,
  A as default,
  R as meta,
  x as resolvePath
};
