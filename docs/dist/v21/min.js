const u = {
  version: "v21.0",
  description: "Pure spec engine no document at all"
}, i = (e) => {
  typeof globalThis > "u" || !e || (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-spec"] = {
    meta: u,
    buildSpecElement: e
  });
}, f = ({ inSpec: e }) => {
  const t = e;
  return t == null;
}, d = ({ inSpec: e }) => typeof Node < "u" && e instanceof Node, p = ({ inSpecJson: e }) => Array.isArray(e), y = ({ inArray: e = [], inShowLog: t = !1, inDataJson: o }) => {
  const r = e, l = t, n = o;
  return Array.isArray(r) ? r.map((c) => a({
    inSpecJson: c,
    inShowLog: l,
    inDataJson: n
  })).flat().filter(Boolean) : [];
}, s = (e, t) => typeof e != "string" ? e : e.replace(/\$\{([^}]+)\}/g, (o, r) => {
  const l = r.trim().split(".");
  let n = t;
  for (const c of l) {
    if (n == null)
      return "";
    n = n[c];
  }
  return n === null || typeof n == "string" || typeof n == "number" || typeof n == "boolean" ? String(n ?? "") : n;
}), m = ({ inSpecJson: e, inData: t, inShowLog: o }) => ("key" in t && "value" in t ? "textContent" in e && (e.textContent = s(
  e.textContent,
  t
)) : ("textContent" in e && (e.textContent = s(
  e.textContent,
  t
)), "attributes" in e && (e.attributes = Object.fromEntries(
  Object.entries(e.attributes).map(
    ([r, l]) => [
      r,
      s(l, t)
    ]
  )
)), "children" in e && (e.children = e.children.map((r) => a({
  inSpecJson: r,
  inShowLog: o,
  inDataJson: t
})))), e), b = ({ inTemplate: e, inDataAsArray: t }) => {
  const o = t, r = e;
  return o.map((n) => {
    const c = structuredClone(r);
    return a({
      inSpecJson: c,
      inDataJson: n
    });
  });
}, h = ({ inTemplate: e, inDataAsObject: t }) => {
  let o = [];
  console.log("11111111--------loopObject : ", t);
  for (const [r, l] of Object.entries(t)) {
    const n = structuredClone(e), c = a({
      inSpecJson: n,
      inDataJson: { key: r, value: l }
    });
    o.push(c);
  }
  return o;
}, a = ({ inSpecJson: e, inShowLog: t = !1, inDataJson: o } = {}) => {
  if (f({ inSpec: e })) return null;
  if (d({ inSpec: e })) return e;
  if (p({ inSpecJson: e }))
    return y({
      inArray: e,
      inShowLog: t,
      inDataJson: o
    });
  if ("jsonToSpec" in e) {
    if ("isSpecBuilt" in e)
      return e;
    if (e.jsonToSpec.operation === "loopArray") {
      const r = b({
        inTemplate: e.jsonToSpec.template,
        inDataAsArray: o[e.jsonToSpec.source]
      });
      e.children = r;
    }
    if (e.jsonToSpec.operation === "loopObject") {
      const r = h({
        inTemplate: e.jsonToSpec.template,
        inDataAsObject: o
      });
      e.children = r;
    }
    e.isSpecBuilt = !0;
  }
  return m({
    inSpecJson: e,
    inShowLog: t,
    inData: o
  });
}, A = ({
  specJson: e,
  showLog: t,
  dataJson: o
}) => {
  try {
    return a({
      inSpecJson: e,
      inShowLog: t,
      inDataJson: o
    });
  } catch (r) {
    console.log("error : ", r);
  }
};
i(A);
export {
  A as default
};
