const f = {
  version: "v23.0",
  description: "Pure spec engine no document at all"
}, d = (e) => {
  typeof globalThis > "u" || !e || (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-spec"] = {
    meta: f,
    buildSpecElement: e
  });
}, y = ({ inSpec: e }) => {
  const n = e;
  return n == null;
}, m = ({ inSpec: e }) => typeof Node < "u" && e instanceof Node, b = ({ inSpecJson: e }) => Array.isArray(e), A = ({ inArray: e = [], inShowLog: n = !1, inDataJson: o }) => {
  const t = e, c = n, r = o;
  return Array.isArray(t) ? t.map((s) => i({
    inSpecJson: s,
    inShowLog: c,
    inDataJson: r
  })).flat().filter(Boolean) : [];
}, a = (e, n) => typeof e != "string" ? e : e.replace(/\$\{([^}]+)\}/g, (o, t) => {
  const c = t.trim().split(".");
  let r = n;
  for (const s of c) {
    if (r == null)
      return "";
    r = r[s];
  }
  return r === null || typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r ?? "") : r;
}), u = ({ inSpecJson: e, inData: n, inShowLog: o }) => {
  const t = structuredClone(e);
  return typeof n == "string" ? ("textContent" in t && (t.textContent === "${}" ? t.textContent = n : typeof t.textContent == "string" && (t.textContent = t.textContent.replaceAll("${}", () => n))), "attributes" in t && (t.attributes = Object.fromEntries(
    Object.entries(t.attributes).map(
      ([c, r]) => [
        c,
        r === "${}" ? n : typeof r == "string" ? r.replaceAll("${}", () => n) : r
      ]
    )
  ))) : "key" in n && "value" in n ? "textContent" in t && (t.textContent = a(
    t.textContent,
    n
  )) : ("textContent" in t && (t.textContent = a(
    t.textContent,
    n
  )), "attributes" in t && (t.attributes = Object.fromEntries(
    Object.entries(t.attributes).map(
      ([c, r]) => [
        c,
        a(r, n)
      ]
    )
  )), "children" in t && (t.children = t.children.map((c) => i({
    inSpecJson: c,
    inShowLog: o,
    inDataJson: n
  })))), t;
}, j = ({ inTemplate: e, inDataAsArray: n }) => {
  const o = n, t = e;
  return Array.isArray(o) ? o.map((r) => {
    const s = structuredClone(t);
    return i({
      inSpecJson: s,
      inDataJson: r
    });
  }) : [];
}, S = ({ inTemplate: e, inDataAsObject: n }) => {
  const o = n, t = e;
  if (o === null || typeof o != "object")
    return [];
  const c = [];
  for (const [r, s] of Object.entries(o)) {
    const l = structuredClone(t), p = i({
      inSpecJson: l,
      inDataJson: {
        key: r,
        value: s
      }
    });
    c.push(p);
  }
  return c;
}, i = ({
  inSpecJson: e,
  inShowLog: n = !1,
  inDataJson: o
} = {}) => {
  if (y({ inSpec: e }))
    return null;
  if (m({ inSpec: e }))
    return e;
  if (b({ inSpecJson: e }))
    return A({
      inArray: e,
      inShowLog: n,
      inDataJson: o
    });
  if ("jsonToSpec" in e) {
    if (e.jsonToSpec.operation === "loopArray") {
      const c = j({
        inTemplate: e.jsonToSpec.template,
        inDataAsArray: o[e.jsonToSpec.source]
      }), {
        jsonToSpec: r,
        ...s
      } = e, l = {
        ...s,
        children: c
      };
      return u({
        inSpecJson: l,
        inShowLog: n,
        inData: o
      });
    }
    if (e.jsonToSpec.operation === "loopObject") {
      const c = S({
        inTemplate: e.jsonToSpec.template,
        inDataAsObject: o
      }), {
        jsonToSpec: r,
        ...s
      } = e, l = {
        ...s,
        children: c
      };
      return u({
        inSpecJson: l,
        inShowLog: n,
        inData: o
      });
    }
  }
  return u({
    inSpecJson: e,
    inShowLog: n,
    inData: o
  });
}, T = ({
  specJson: e,
  showLog: n,
  dataJson: o
}) => {
  try {
    return i({
      inSpecJson: e,
      inShowLog: n,
      inDataJson: o
    });
  } catch (t) {
    console.log("error : ", t);
  }
};
d(T);
export {
  T as default
};
