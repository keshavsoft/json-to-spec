const f = {
  version: "v24.0",
  description: "Pure spec engine no document at all"
}, y = (e) => {
  typeof globalThis > "u" || !e || (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-spec"] = {
    meta: f,
    buildSpecElement: e
  }, globalThis.ks.jsonToSpec = {
    meta: f,
    buildSpecElement: e
  });
}, d = ({ inSpec: e }) => {
  const r = e;
  return r == null;
}, S = ({ inSpec: e }) => typeof Node < "u" && e instanceof Node, m = ({ inSpecJson: e }) => Array.isArray(e), j = ({ inArray: e = [], inShowLog: r = !1, inDataJson: t }) => {
  const o = e, a = r, l = t;
  return Array.isArray(o) ? o.map((c) => i({
    inSpecJson: c,
    inShowLog: a,
    inDataJson: l
  })).flat().filter(Boolean) : [];
}, u = ({ inTemplate: e, inData: r, inRowIndex: t }) => {
  if (Number.isFinite(t)) {
    debugger;
    console.log("vvvvvvvvvvvvvv : ", t);
    let o = g({ inTemplate: e, inRowIndex: t });
    return b({ inTemplate: o, inData: r });
  } else
    return b({ inTemplate: e, inData: r });
}, b = ({ inTemplate: e, inData: r }) => {
  const t = e, o = r;
  return typeof t != "string" ? t : t.replace(/\$\{([^}]+)\}/g, (a, l) => {
    const c = l.trim().split(".");
    let n = o;
    for (const s of c) {
      if (n == null) return "";
      n = n[s];
    }
    return n == null ? "" : typeof n == "string" || typeof n == "number" || typeof n == "boolean" ? String(n ?? "") : n;
  });
}, g = ({ inTemplate: e, inRowIndex: r }) => {
  const t = e, o = r;
  return t.replace(/\#\{([^}]+)\}/g, (a, l) => {
    const c = l.trim().split(".");
    let n = o;
    console.log("aaaaaaa : ", r, e, c);
    for (const s of c) {
      if (n == null) return "";
      n = n[s];
    }
    return n === null || typeof n == "string" || typeof n == "number" || typeof n == "boolean" ? String(n ?? "") : n;
  });
}, T = ({ inSpec: e, inData: r, inShowLog: t }) => {
  const o = e, a = r, l = t;
  return "textContent" in o && (o.textContent = u({ inTemplate: o.textContent, inData: a })), "attributes" in o && typeof o.attributes == "object" && o.attributes && (o.attributes = Object.fromEntries(
    Object.entries(o.attributes).map(([c, n]) => [
      c,
      u({ inTemplate: n, inData: a })
    ])
  )), Array.isArray(o.children) && (o.children = o.children.map(
    (c) => i({
      inSpecJson: c,
      inShowLog: l,
      inDataJson: a
    })
  )), o;
}, h = ({ inSpec: e, inData: r }) => {
  const t = e, o = r, a = o.value;
  return m({ inSpecJson: a }) ? (t.children = [{
    tagName: "button",
    attributes: {
      class: "btn btn-primary btn-sm"
    },
    textContent: a.length
  }], delete t.textContent, t) : typeof a == "object" && a !== null && a.tagName ? (t.children = [a], delete t.textContent, t) : ("textContent" in t && (t.textContent = u({ inTemplate: t.textContent, inData: o })), "attributes" in t && typeof t.attributes == "object" && t.attributes && (t.attributes = Object.fromEntries(
    Object.entries(t.attributes).map(([l, c]) => [
      l,
      u({ inTemplate: c, inData: o })
    ])
  )), t);
}, A = ({ inSpec: e, inData: r }) => {
  const t = e, o = r;
  return "textContent" in t && (t.textContent === "${}" ? t.textContent = o : typeof t.textContent == "string" && (t.textContent = t.textContent.replaceAll("${}", () => o))), "attributes" in t && typeof t.attributes == "object" && t.attributes && (t.attributes = Object.fromEntries(
    Object.entries(t.attributes).map(([a, l]) => [
      a,
      l === "${}" ? o : typeof l == "string" ? l.replaceAll("${}", () => o) : l
    ])
  )), t;
}, p = ({ inSpecJson: e, inData: r, inRowIndex: t, inShowLog: o = !1 } = {}) => {
  const a = e, l = r, c = o, n = structuredClone(a);
  return c && console.log("buildSingleElement start : ", a, l), typeof l == "string" ? A({ inSpec: n, inData: l }) : typeof l == "object" && l !== null && "key" in l && "value" in l && !("children" in n && Array.isArray(n.children) && n.children.length > 0) ? h({ inSpec: n, inData: l }) : T({
    inSpec: n,
    inData: l,
    inShowLog: c
  });
}, D = ({ inTemplate: e, inDataAsArray: r }) => {
  const t = r, o = e;
  return Array.isArray(t) ? t.map((l, c) => {
    const n = structuredClone(o);
    return i({
      inSpecJson: n,
      inDataJson: l,
      inRowIndex: c
    });
  }) : [];
}, v = ({ inTemplate: e, inDataAsObject: r }) => {
  const t = r, o = e;
  if (t === null || typeof t != "object")
    return [];
  const a = [];
  for (const [l, c] of Object.entries(t)) {
    const n = structuredClone(o), s = i({
      inSpecJson: n,
      inDataJson: {
        key: l,
        value: c
      }
    });
    a.push(s);
  }
  return a;
}, C = ({
  inSpecJson: e,
  inShowLog: r = !1,
  inDataJson: t,
  inRowIndex: o
} = {}) => {
  if (Number.isFinite(o) && ("attributes" in e ? e.attributes.rowIndex = o : e.attributes = {
    rowIndex: o
  }), !["loopArray", "loopObject"].includes(e.jsonToSpec.operation)) {
    console.log(`inSpecJson.jsonToSpec.operation : can be loopArray or loopObject : ${e.jsonToSpec.operation}`);
    return;
  }
  if (e.jsonToSpec.operation === "loopArray") {
    const a = D({
      inTemplate: e.jsonToSpec.template,
      inDataAsArray: t[e.jsonToSpec.source]
    }), {
      jsonToSpec: l,
      ...c
    } = e, n = {
      ...c,
      children: a
    };
    return p({
      inSpecJson: n,
      inShowLog: r,
      inData: t
    });
  }
  if (e.jsonToSpec.operation === "loopObject") {
    const a = v({
      inTemplate: e.jsonToSpec.template,
      inDataAsObject: t
    }), {
      jsonToSpec: l,
      ...c
    } = e, n = {
      ...c,
      children: a
    };
    return p({
      inSpecJson: n,
      inShowLog: r,
      inData: t
    });
  }
}, i = ({
  inSpecJson: e,
  inShowLog: r = !0,
  inDataJson: t,
  inRowIndex: o
} = {}) => d({ inSpec: e }) ? null : S({ inSpec: e }) ? e : (r && console.log("dispatchSpec 3 : ", e, t), m({ inSpecJson: e }) ? j({
  inArray: e,
  inShowLog: r,
  inDataJson: t
}) : "jsonToSpec" in e ? C({
  inSpecJson: e,
  inShowLog: r,
  inDataJson: t,
  inRowIndex: o
}) : p({
  inSpecJson: e,
  inShowLog: r,
  inRowIndex: o,
  inData: t
})), O = ({
  specJson: e,
  showLog: r = !1,
  dataJson: t
}) => {
  try {
    return r && console.log("jsonToSpec 1 : ", e), i({
      inSpecJson: e,
      inShowLog: r,
      inDataJson: t
    });
  } catch (o) {
    console.log("error : ", o);
  }
};
y(O);
export {
  O as default
};
