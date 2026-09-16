const f = {
  version: "19.0.0",
  name: "json-to-spec/v19",
  description: "Minimalist 2-layer compiler: pure value replace + jsonToSpec iterate"
}, b = (n) => {
  typeof globalThis > "u" || !n || (globalThis.ks ?? (globalThis.ks = {}), globalThis.ks["json-to-spec"] = {
    meta: f,
    compile: n
  });
}, d = ({ inData: n, inDataKey: r }) => {
  const t = r;
  if (t === "") return n;
  let e = n[t];
  return t.includes(".") && (e = t.split(".").reduce(
    (c, a) => c == null ? void 0 : c[a],
    n
  )), e;
}, O = ({
  inNode: n,
  inData: r
} = {}) => {
  const t = n, e = r;
  if (!(t != null && t.textContent)) return "no-textContent";
  if (typeof t.textContent != "string") return "not-a-string";
  if (!t.textContent.includes("${")) return "no-template-token";
  const o = t.textContent.replace(/^\$\{/, "").replace(/\}$/, "");
  t.textContent = d({
    inData: e,
    inDataKey: o
  });
}, C = ({
  inNode: n,
  inData: r
} = {}) => {
  const t = n, e = r;
  if ("attributes" in t) {
    const o = Object.fromEntries(
      Object.entries(t.attributes || {}).map(([s, c]) => [
        s,
        typeof c == "string" && c.includes("${") ? d({
          inData: e,
          inDataKey: c.replace(/^\$\{/, "").replace(/\}$/, "")
        }) : c
      ])
    );
    t.attributes = { ...o };
  }
}, $ = ({
  inNode: n,
  inData: r
} = {}) => {
  const t = n, e = r;
  O({ inNode: t, inData: e }), C({ inNode: t, inData: e });
}, T = ({
  inTemplate: n,
  inSourceValues: r
} = {}) => {
  const t = r;
  return t === void 0 ? void 0 : t.map((o) => {
    const s = structuredClone(n);
    return l({
      inNode: s,
      inData: o,
      inOperation: "replace"
    });
  });
}, k = ({
  inNode: n,
  inData: r,
  inShowLog: t
} = {}) => {
  const e = n, o = r;
  if (!("jsonToSpec" in e) || !("operation" in e.jsonToSpec) || e.jsonToSpec.operation !== "iterate" || !("source" in e.jsonToSpec)) return;
  const s = o[e.jsonToSpec.source], c = T({
    inTemplate: e.jsonToSpec.template,
    inSourceValues: s
  });
  e.children = c;
}, x = ({
  inNode: n,
  inData: r
} = {}) => {
  const t = n;
  if (!(t != null && t.textContent)) return "no-textContent";
  if (typeof t.textContent != "string") return "not-a-string";
  if (!t.textContent.includes("${")) return "no-template-token";
  t.textContent === "${key}" && (t.textContent = r.key), t.textContent === "${value}" && (t.textContent = r.value);
}, A = ({
  inNode: n,
  inData: r
} = {}) => {
  const t = n;
  if ("attributes" in t) {
    const e = Object.fromEntries(
      Object.entries(t.attributes).map(([o, s]) => {
        let c = s;
        return s === "${key}" ? c = r.key : s === "${value}" && (c = r.value), [o, c];
      })
    );
    t.attributes = { ...e };
  }
}, j = ({
  inNode: n,
  inData: r
} = {}) => {
  const t = n, e = r;
  x({ inNode: t, inData: e }), A({ inNode: t, inData: e });
};
function m(n) {
  return n !== null && typeof n == "object" && Object.getPrototypeOf(n) === Object.prototype;
}
const h = ({
  inTemplate: n,
  inSourceValues: r,
  inShowLog: t
} = {}) => {
  const e = r;
  if (e === void 0 || !m(e)) return;
  t && console.log("loopObject:createChildren:1 ", n, r);
  let o = [];
  for (const [s, c] of Object.entries(e)) {
    const a = structuredClone(n);
    j({ inNode: a, inData: { key: s, value: c } }), o.push(a);
  }
  return o;
}, D = ({
  inNode: n,
  inData: r,
  inShowLog: t
} = {}) => {
  const e = n, o = r;
  if (t && console.log("loopObject:1 ", n, r), !("jsonToSpec" in e) || !("operation" in e.jsonToSpec) || e.jsonToSpec.operation !== "loopObject" || !("source" in e.jsonToSpec)) return;
  t && console.log("loopObject:2 ", n, r);
  const s = o[e.jsonToSpec.source], c = h({
    inTemplate: e.jsonToSpec.template,
    inSourceValues: s,
    inShowLog: t
  });
  e.children = c;
};
function S(n) {
  return n !== null && typeof n == "object" && Object.getPrototypeOf(n) === Object.prototype;
}
const N = ({
  inNode: n,
  inData: r
} = {}) => {
  if (Object.keys(r).map((o) => `\${${o}}`).includes(n.textContent)) {
    const o = n.textContent.slice(2, -1);
    n.textContent = r[o];
  }
}, F = ({
  inNode: n,
  inData: r
} = {}) => {
  const t = n, e = r;
  if (!(t != null && t.textContent)) return "no-textContent";
  if (typeof t.textContent != "string") return "not-a-string";
  if (!t.textContent.includes("${")) return "no-template-token";
  S(e) ? N({ inNode: n, inData: r }) : t.textContent === "${}" && (t.textContent = e);
}, g = ({
  inNode: n,
  inData: r
} = {}) => {
  const t = n;
  if ("attributes" in t) {
    const e = Object.fromEntries(
      Object.entries(t.attributes).map(([o, s]) => {
        let c = s;
        return s === "${}" && (c = r.key), [o, c];
      })
    );
    t.attributes = { ...e };
  }
}, V = ({
  inNode: n,
  inData: r
} = {}) => {
  const t = n, e = r;
  F({ inNode: t, inData: e }), g({ inNode: t, inData: e });
}, w = ({
  inTemplate: n,
  inSourceValuesAsArray: r,
  inShowLog: t
} = {}) => {
  const e = r;
  if (e === void 0 || !Array.isArray(e)) return;
  t && console.log("loopObject:createChildren:1 ", n, inSourceValues);
  let o = [];
  return e.forEach((s) => {
    var a, i;
    const c = structuredClone(n);
    if ("jsonToSpec" in c) {
      const y = (a = c == null ? void 0 : c.jsonToSpec) == null ? void 0 : a.source;
      let u = {};
      u[y] = s, l({
        inNode: c,
        inData: u,
        inOperation: (i = c == null ? void 0 : c.jsonToSpec) == null ? void 0 : i.operation,
        inShowLog: t
      });
    }
    l({
      inNode: c,
      inData: s,
      inOperation: "replace",
      inShowLog: t
    }), V({ inNode: c, inData: s }), o.push(c);
  }), o;
}, K = ({
  inNode: n,
  inData: r,
  inShowLog: t
} = {}) => {
  const e = n, o = r;
  if (t && console.log("loopObject:1 ", n, r), !("jsonToSpec" in e) || !("operation" in e.jsonToSpec) || e.jsonToSpec.operation !== "loopArray" || !("source" in e.jsonToSpec)) return;
  const s = o[e.jsonToSpec.source];
  if (!Array.isArray(s)) return;
  t && console.log("loopObject:2 ", n, r);
  const c = w({
    inTemplate: e.jsonToSpec.template,
    inSourceValuesAsArray: s,
    inShowLog: t
  });
  e.children = c;
}, p = ({ inNode: n, inData: r, inOperation: t }) => {
  const e = n, o = r, s = t;
  if (Array.isArray(e)) {
    const c = [];
    for (const a of e) {
      const i = l({
        inNode: a,
        inData: o,
        inOperation: s
      });
      Array.isArray(i) ? c.push(...i) : i != null && c.push(i);
    }
    return c;
  }
}, l = ({
  inNode: n,
  inData: r = {},
  inOperation: t,
  inShowLog: e = !1
} = {}) => {
  const o = n, s = r, c = t;
  if (e && console.log("walk ", n, r, t), o == null)
    return o;
  if (Array.isArray(o))
    return p({
      inNode: o,
      inData: r,
      inOperation: c
    });
  if ("children" in o && Array.isArray(o == null ? void 0 : o.children) && (o.children = p({
    inNode: o == null ? void 0 : o.children,
    inData: r,
    inOperation: c
  })), typeof o != "object")
    return o;
  switch (e && console.log("localOperation ", c), c) {
    case "replace":
      typeof o == "object" && $({
        inNode: o,
        inData: r
      });
      break;
    case "replaceObject":
      typeof o == "object" && j({
        inNode: o,
        inData: r
      });
      break;
    case "iterateDo":
      k({
        inNode: o,
        inData: s,
        inShowLog: e
      });
      break;
    case "loopObject":
      D({
        inNode: o,
        inData: s,
        inShowLog: e
      });
      break;
    case "loopArray":
      K({
        inNode: o,
        inData: s,
        inShowLog: e
      });
      break;
  }
  return o;
}, E = ({ inStructureAsJson: n, inDataAsJson: r, inOperation: t, inShowLog: e }) => {
  try {
    return l({
      inNode: n,
      inData: r,
      inOperation: t,
      inShowLog: e
    });
  } catch (o) {
    throw console.error("[json-to-spec/v17] replace error:", o), o;
  }
}, P = (n, r = {}, t = !1) => {
  let e = n, o = r;
  t && console.log(f.name, e, o);
  try {
    return E({
      inStructureAsJson: e,
      inDataAsJson: o,
      inOperation: "loopArray",
      inShowLog: t
    });
  } catch (s) {
    throw console.error("[json-to-spec/v19] compile error:", s), s;
  }
};
b(P);
export {
  P as compile,
  P as default
};
