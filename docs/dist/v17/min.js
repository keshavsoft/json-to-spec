const m = ({ inData: i, inPath: s }) => {
  const n = i, t = s;
  if (n == null) return;
  if (t == null || t === "" || t === ".")
    return n;
  const e = Array.isArray(t) ? t : String(t).split(".");
  let r = n;
  for (const o of e) {
    if (r == null) return;
    r = r[o];
  }
  return r;
}, v = ({ inData: i, inDataKey: s }) => {
  const n = s;
  let t = i[n];
  return n.includes(".") && (t = n.split(".").reduce(
    (o, a) => o == null ? void 0 : o[a],
    i
  )), t;
}, E = ({
  inNode: i,
  inData: s
} = {}) => {
  if ("textContent" in i && i.textContent.includes("${")) {
    const n = i.textContent.replace(/^\$\{/, "").replace(/\}$/, "");
    i.textContent = v({ inData: s, inDataKey: n });
  }
  if ("attributes" in i) {
    const n = Object.fromEntries(
      Object.entries(i.attributes || {}).map(([t, e]) => [
        t,
        typeof e == "string" && e.includes("${") ? v({
          inData: s,
          inDataKey: e.replace(/^\$\{/, "").replace(/\}$/, "")
        }) : e
      ])
    );
    i.attributes = { ...n };
  }
}, M = ({
  inNode: i,
  inData: s
} = {}) => {
  var t, e, r;
  const n = i;
  if ("jsonToSpec" in n && "operation" in (n == null ? void 0 : n.jsonToSpec) && ((t = n == null ? void 0 : n.jsonToSpec) == null ? void 0 : t.operation) === "iterate" && "source" in (n == null ? void 0 : n.jsonToSpec) && ((e = n == null ? void 0 : n.jsonToSpec) == null ? void 0 : e.source) === "columns") {
    const a = s[(r = n == null ? void 0 : n.jsonToSpec) == null ? void 0 : r.source].map((l) => {
      var p;
      const u = structuredClone((p = n == null ? void 0 : n.jsonToSpec) == null ? void 0 : p.template);
      return C({
        inNode: u,
        inData: l,
        inOperation: "replace"
      });
    });
    n.children = a;
  }
}, $ = ({ inNode: i, inData: s, inOperation: n }) => {
  const t = i, e = n;
  if (Array.isArray(t)) {
    const r = [];
    for (const o of t) {
      const a = C({
        inNode: o,
        inData: s,
        inOperation: e
      });
      Array.isArray(a) ? r.push(...a) : a != null && r.push(a);
    }
    return r;
  }
}, C = ({
  inNode: i,
  inData: s = {},
  inOperation: n
} = {}) => {
  const t = i, e = n;
  if (t == null)
    return t;
  if (Array.isArray(t))
    return $({
      inNode: t,
      inData: s,
      inOperation: e
    });
  if ("children" in t && Array.isArray(t == null ? void 0 : t.children) && (t.children = $({
    inNode: t == null ? void 0 : t.children,
    inData: s,
    inOperation: e
  })), typeof t != "object")
    return t;
  switch (e) {
    case "replace":
      typeof t == "object" && E({
        inNode: t,
        inData: s
      });
      break;
    case "iterateDo":
      M({
        inNode: t,
        inData: s
      });
  }
  return t;
}, w = ({ inPath: i, inContext: s, inData: n }) => {
  const t = i, e = s, r = n;
  let o = m({ inData: e, inPath: t });
  return o === void 0 && e && typeof e == "object" && (e.item && typeof e.item == "object" && (o = m({ inData: e.item, inPath: t })), o === void 0 && e.row && typeof e.row == "object" && (o = m({ inData: e.row, inPath: t }))), o === void 0 && r && (o = m({ inData: r, inPath: t })), o;
}, g = ({ inValue: i, inContext: s, inData: n }) => {
  const t = i, e = s, r = n;
  if (typeof t != "string" || !t.includes("${"))
    return t;
  const o = !!(e && (e.item || Object.keys(e).length > 0)), a = t.match(/^\$\{([^}]+)\}$/);
  if (a) {
    const l = w({
      inPath: a[1].trim(),
      inContext: e,
      inData: r
    });
    return l ?? (o ? "" : t);
  }
  return t.replace(/\$\{([^}]+)\}/g, (l, u) => {
    const f = w({
      inPath: u.trim(),
      inContext: e,
      inData: r
    });
    return f != null ? String(f) : o ? "" : l;
  });
}, T = ({ inNode: i, inContext: s = {}, inData: n = {} } = {}) => {
  const t = i, e = s, r = n;
  if (t == null) return t;
  if (Array.isArray(t))
    return t.map((a) => T({
      inNode: a,
      inContext: e,
      inData: r
    }));
  if (typeof t == "string")
    return g({
      inValue: t,
      inContext: e,
      inData: r
    });
  if (typeof t != "object")
    return t;
  const o = { ...t };
  if (o.textContent && typeof o.textContent == "string" && (o.textContent = g({
    inValue: o.textContent,
    inContext: e,
    inData: r
  })), o.attributes) {
    o.attributes = { ...o.attributes };
    for (const [a, l] of Object.entries(o.attributes))
      typeof l == "string" && (o.attributes[a] = g({
        inValue: l,
        inContext: e,
        inData: r
      }));
  }
  if (o.properties) {
    o.properties = { ...o.properties };
    for (const [a, l] of Object.entries(o.properties))
      typeof l == "string" && (o.properties[a] = g({
        inValue: l,
        inContext: e,
        inData: r
      }));
  }
  return Array.isArray(o.children) && (o.children = o.children.map((a) => T({
    inNode: a,
    inContext: e,
    inData: r
  }))), o;
}, x = ({ inStructureAsJson: i, inDataAsJson: s, inOperation: n }) => C({
  inNode: i,
  inData: s,
  inOperation: n
}), R = ({ inNode: i, inContext: s, inData: n }) => {
  const t = i, e = s, r = n, o = t && (t.jsonToSpec || (t.operation ? t : null));
  if (!o) return;
  const a = o.source || o.iterateOn || o.$iterate;
  if (a)
    return m({
      inData: r,
      inPath: a
    }) || r && r[a] || m({
      inData: e,
      inPath: a
    }) || e && e[a];
}, N = ({ inNode: i, inItem: s, inData: n }) => {
  var o;
  const t = i, e = s, r = n;
  if (!t || typeof t != "object")
    return t;
  if (t.attributes && [
    "input",
    "textarea",
    "select",
    "option"
  ].includes((o = t.tagName) == null ? void 0 : o.toLowerCase())) {
    const l = e.field || e.columnName || e.name;
    e.value !== void 0 && e.value !== null ? (t.attributes.value = String(e.value), t.tagName === "textarea" && !t.textContent && (t.textContent = String(e.value))) : l && r[l] !== void 0 && r[l] !== null && (t.attributes.value = String(
      r[l]
    ), t.tagName === "textarea" && !t.textContent && (t.textContent = String(
      r[l]
    )));
  }
  return Array.isArray(t.children) && t.children.forEach((a) => {
    N({
      inNode: a,
      inItem: e,
      inData: r
    });
  }), t;
}, k = ({
  inNode: i,
  inContext: s,
  inData: n,
  walk: t
}) => {
  const e = i, r = s, o = n, a = e && (e.jsonToSpec || (e.operation ? e : null));
  if (!a || a.operation !== "iterate" && !a.source && !a.$iterate)
    return;
  const u = a.source || a.iterateOn || a.$iterate, f = R({
    inNode: e,
    inContext: r,
    inData: o
  }) || [];
  if (!Array.isArray(f)) {
    if (e && e.tagName) {
      const c = { ...e };
      return delete c.jsonToSpec, c.children = [], c;
    }
    return [];
  }
  const p = a.template || a.item || {}, A = a.filter, F = f.filter((c) => {
    if (!c || typeof c != "object")
      return !0;
    if (A && typeof A == "object") {
      for (const [D, d] of Object.entries(A))
        if (c[D] !== d)
          return !1;
    }
    return c.isVisible !== !1;
  }), j = [];
  if (F.forEach((c, D) => {
    const d = {
      ...r,
      item: c,
      ...typeof c == "object" && c !== null ? c : {},
      $index: D,
      $number: D + 1
    };
    if ((u === "rows" || u.endsWith(".rows") || u === "items" || u.endsWith("Rows")) && (d.row = c), r.row && (c.field || c.columnName || c.name)) {
      const S = c.field || c.columnName || c.name, h = r.row[S];
      h !== void 0 && (d.cellValue = h, d.value = h, typeof c == "object" && c !== null && c.value === void 0 && (c.value = h));
    }
    const K = typeof p == "object" && p !== null ? JSON.parse(JSON.stringify(p)) : {
      tagName: "span",
      textContent: p
    }, J = t({
      inNode: K,
      inContext: d,
      inData: o,
      inOperation: ({ inNode: S, inContext: h, inData: I }) => k({
        inNode: S,
        inContext: h,
        inData: I,
        walk: t
      })
    }), y = T({
      inNode: J,
      inContext: d,
      inData: o
    });
    N({
      inNode: y,
      inItem: c,
      inData: o
    }), Array.isArray(y) ? j.push(...y) : y != null && j.push(y);
  }), e && e.tagName) {
    const c = { ...e };
    return delete c.jsonToSpec, c.children = j, c;
  }
  return j;
}, b = ({
  inStructure: i,
  inData: s = {},
  inContext: n = {}
} = {}) => C({
  inNode: i,
  inData: s,
  inOperation: ({ inNode: t, inContext: e, inData: r }) => k({
    inNode: t,
    inContext: e,
    inData: r,
    walk: C
  })
}), P = b, W = {
  version: "17.0.0",
  name: "json-to-spec/v17",
  description: "Minimalist 2-layer compiler: pure value replace + jsonToSpec iterate"
}, O = ({ inStructure: i, inData: s = {}, inSteps: n = [x, b] } = {}) => {
  const t = s, e = n;
  let r = i;
  for (const o of e)
    typeof o == "function" && (r = o({ inStructure: r, inData: t }));
  return r;
}, B = (...i) => {
  const s = i.length > 0 ? i : [x, b];
  return (n, t = {}) => O({ inStructure: n, inData: t, inSteps: s });
}, V = (i, s = {}) => {
  let n = i, t = s;
  console.log("ccccccccccccc-------- : ", t);
  const e = x({
    inStructureAsJson: n,
    inDataAsJson: t,
    inOperation: "iterateDo"
  }), r = x({
    inStructureAsJson: e,
    inDataAsJson: t,
    inOperation: "replace"
  });
  return console.log("replaced : ", r), r;
}, L = {
  replace: x,
  iterate: b,
  operation: P,
  pipeline: O,
  pipe: B,
  compile: V
};
typeof globalThis < "u" && (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-spec"] = {
  meta: W,
  compile: V,
  replace: x,
  iterate: b,
  operation: P,
  pipeline: O,
  jsonToSpec: L
});
export {
  V as compile,
  V as default,
  b as iterate,
  L as jsonToSpec,
  W as meta,
  P as operation,
  B as pipe,
  O as pipeline,
  x as replace,
  T as replaceNode
};
