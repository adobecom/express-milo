var rt = /* @__PURE__ */ ((t) => (t.IDLE = "idle", t.UPLOADING = "uploading", t.COMPLETED = "completed", t.FAILED = "failed", t))(rt || {}), K;
(function(t) {
  t.ACCESS_DENIED = "http://ns.adobe.com/adobecloud/problem/accessdenied", t.ASSET_LOCKED = "http://ns.adobe.com/adobecloud/problem/assetlocked", t.ASSET_MOVED = "http://ns.adobe.com/adobecloud/problem/assetmoved", t.ASSET_NAME_CONFLICT = "http://ns.adobe.com/adobecloud/problem/assetnameconflict", t.ASSET_NAME_INVALID = "http://ns.adobe.com/adobecloud/problem/assetnamenotvalid", t.ASSET_NOT_FOUND = "http://ns.adobe.com/adobecloud/problem/assetnotfound", t.ASSET_STATE_NOT_ALLOWED = "http://ns.adobe.com/adobecloud/problem/assetstatenotallowed", t.BAD_REQUEST = "http://ns.adobe.com/adobecloud/problem/badrequest", t.BULK_REQUEST_NOT_ATTEMPTED = "http://ns.adobe.com/adobecloud/problem/bulkrequestnotattempted", t.COMPOSITE_INTEGRITY = "http://ns.adobe.com/adobecloud/problem/compositeintegrity", t.DCX_VALIDATION = "http://ns.adobe.com/adobecloud/problem/dcxvalidation", t.DIRECTORY_NOT_EMPTY = "http://ns.adobe.com/adobecloud/problem/directorynotempty", t.EMBED_INVALID = "http://ns.adobe.com/adobecloud/problem/embedinvalid", t.EMBED_TOO_LARGE = "http://ns.adobe.com/adobecloud/problem/embedtoolarge", t.ENCRYPTION_KEY_INACCESSIBLE = "http://ns.adobe.com/adobecloud/problem/encryptionkeyinaccessible", t.INVALID_FRAGMENT = "http://ns.adobe.com/adobecloud/problem/invalidfragment", t.LIMIT_CHILDREN_COUNT = "http://ns.adobe.com/adobecloud/problem/limit/childrencount", t.LIMIT_COMPONENT_COUNT = "http://ns.adobe.com/adobecloud/problem/limit/componentcount", t.LIMIT_EMBED_SELECTOR_COUNT = "http://ns.adobe.com/adobecloud/problem/limit/embedspecifierselectorcount", t.LIMIT_MILESTONE_COUNT = "http://ns.adobe.com/adobecloud/problem/limit/milestonecount", t.LIMIT_MILESTONE_LABEL_LENGTH = "http://ns.adobe.com/adobecloud/problem/limit/milestonelabellength", t.LIMIT_NAME_LENGTH = "http://ns.adobe.com/adobecloud/problem/limit/namelength", t.LIMIT_OPERATION_COUNT = "http://ns.adobe.com/adobecloud/problem/limit/operationcount", t.LIMIT_PATH_SEGMENT_COUNT = "http://ns.adobe.com/adobecloud/problem/limit/pathsegmentcount", t.LIMIT_RESOURCE_COUNT = "http://ns.adobe.com/adobecloud/problem/limit/resourcecount", t.LIMIT_RESOURCE_SIZE = "http://ns.adobe.com/adobecloud/problem/limit/resourcesize", t.NOT_ENTITLED = "http://ns.adobe.com/adobecloud/problem/notentitled", t.OPERATION_FAILED = "http://ns.adobe.com/adobecloud/problem/operationfailed", t.OPERATION_TARGET_CONFLICT = "http://ns.adobe.com/adobecloud/problem/operation/targetconflict", t.QUOTA_EXCEEDED = "http://ns.adobe.com/adobecloud/problem/quotaexceeded", t.REPOSITORY_NOT_FOUND = "http://ns.adobe.com/adobecloud/problem/repositorynotfound", t.RESOURCE_BLOCKED = "http://ns.adobe.com/adobecloud/problem/resourceblocked", t.RESOURCE_NOT_ALLOWED = "http://ns.adobe.com/adobecloud/problem/resourcenotallowed", t.RESOURCE_NOT_FOUND = "http://ns.adobe.com/adobecloud/problem/resourcenotfound", t.RESOURCE_NOT_READY = "http://ns.adobe.com/adobecloud/problem/resourcenotready", t.RESPONSE_TOO_LARGE = "http://ns.adobe.com/adobecloud/problem/responsetoolarge", t.USER_BLOCKED = "http://ns.adobe.com/adobecloud/problem/userblocked", t.VERSION_NOT_FOUND = "http://ns.adobe.com/adobecloud/problem/versionnotfound", t.PARTIAL_ASSET = "http://ns.adobe.com/adobecloud/problem/partialasset";
})(K || (K = {}));
const T = { ASSET_MOVED: "ASSET_MOVED", INVALID_JSON: "INVALID_JSON", READ_ONLY: "READ_ONLY", INVALID_PARAMS: "", INVALID_LINKS: "INVALID_LINKS", PRECONDITION_FAILED: "PRECONDITION_FAILED", INVALID_DATA: "INVALID_DATA", DUPLICATE_VALUE: "DUPLICATE_VALUE", NO_BASE_BRANCH_DATA: "NO_BASE_BRANCH_DATA", INVALID_STATE: "INVALID_STATE", DELETED_COMPOSITE: "DELETED_COMPOSITE", INCOMPLETE_COMPOSITE: "INCOMPLETE_COMPOSITE", UNEXPECTED_RESPONSE: "UNEXPECTED_RESPONSE", NETWORK_ERROR: "NETWORK_ERROR", COMPONENT_DOWNLOAD_ERROR: "COMPONENT_DOWNLOAD_ERROR", COMPONENT_UPLOAD_ERROR: "COMPONENT_UPLOAD_ERROR", COMPONENT_MODIFIED_ERROR: "COMPONENT_MODIFIED_ERROR", UPDATE_CONFLICT: "UPDATE_CONFLICT", NO_COMPOSITE: "NO_COMPOSITE", ALREADY_EXISTS: "ALREADY_EXISTS", SERVICE_IS_INACTIVE: "SERVICE_IS_INACTIVE", EXCEEDS_QUOTA: "EXCEEDS_QUOTA", NOT_IMPLEMENTED: "NOT_IMPLEMENTED", RETRYABLE_SERVER_ERROR: "RETRYABLE_SERVER_ERROR", TIMED_OUT: "TIMED_OUT", UNEXPECTED: "UNEXPECTED", TERMINATED_INPUTSTREAM: "TERMINATED_INPUTSTREAM", WRONG_ENDPOINT: "WRONG_ENDPOINT", OUT_OF_SPACE: "ENOSPC", FILE_EXISTS_IN_CLOUD: "FILE_EXISTS_IN_CLOUD", ASSET_NOT_FOUND: "ASSET_NOT_FOUND", COMPOSITE_NOT_FOUND: "COMPOSITE_NOT_FOUND", NOT_FOUND: "NOT_FOUND", UNAUTHORIZED: "UNAUTHORIZED", FORBIDDEN: "FORBIDDEN", METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED", NOT_ACCEPTABLE: "NOT_ACCEPTABLE", BANDWIDTH_LIMIT_EXCEEDED: "BANDWIDTH_LIMIT_EXCEEDED", ABORTED: "ABORTED", TOO_MANY_REDIRECTS: "TOO_MANY_REDIRECTS", INSECURE_REDIRECT: "INSECURE_REDIRECT", RESOURCE_NOT_READY: "RESOURCE_NOT_READY", ASSET_LOCKED: "ASSET_LOCKED" }, io = { [T.SERVICE_IS_INACTIVE]: !0, [T.ABORTED]: !0, [T.INSECURE_REDIRECT]: !0, [T.TOO_MANY_REDIRECTS]: !0, [T.NOT_IMPLEMENTED]: !0, [T.EXCEEDS_QUOTA]: !0, [T.RETRYABLE_SERVER_ERROR]: !0, [T.TIMED_OUT]: !0, [T.TERMINATED_INPUTSTREAM]: !0, [T.WRONG_ENDPOINT]: !0, [T.OUT_OF_SPACE]: !0, [T.INVALID_PARAMS]: !0, [T.INVALID_STATE]: !0 };
let c = class We extends Error {
  constructor(e, s, r, n, o) {
    var i;
    if (super(), this.code = e, this.name = "AdobeDCXError", this._additionalData = {}, ((i = n?.headers) === null || i === void 0 ? void 0 : i["content-type"]) === "application/problem+json" && n.response && typeof n.response == "object" && typeof n.response.slice == "function") try {
      const a = JSON.parse(new TextDecoder("utf-8").decode(n.response));
      n.response = a;
    } catch (a) {
      const l = n.response;
      n.response = { originalBody: l, message: "Failed to parse JSON problem type response body.", parseError: a };
    }
    if (r instanceof Error && (this._underlyingError = r), this._response = n || (ot(r) ? r.response : void 0), this._additionalData = o, this._message = s, this.message = (typeof e == "string" && e !== "" ? "[" + e + "] " : "") + (this._message || ""), Object.setPrototypeOf(this, We.prototype), Error.captureStackTrace) Error.captureStackTrace(this, We);
    else try {
      const a = new Error();
      if (a.name = this.name, a.stack) {
        const l = a.stack.split(`
`);
        l.length > 0 && l.splice(1, 1), this.stack = l.join(`
`);
      }
    } catch {
    }
  }
  get response() {
    return this._response;
  }
  get problemType() {
    var e;
    if (((e = this._response) === null || e === void 0 ? void 0 : e.headers["content-type"]) === "application/problem+json") return this._response.response.type;
  }
  get underlyingError() {
    return this._underlyingError;
  }
  get additionalData() {
    return this._additionalData;
  }
  set additionalData(e) {
    this._additionalData = e;
  }
  get failedComponents() {
    return this._additionalData.failedComponents;
  }
  static wrapError(e, s, r, n) {
    var o, i, a, l;
    if (r && io[r.code]) return r;
    if (n && typeof n == "object") {
      const d = n.statusCode, u = d === 403 && (((a = (i = (o = n.response) === null || o === void 0 ? void 0 : o.message) === null || i === void 0 ? void 0 : i.match(/code=(\d+.\d+)/)) === null || a === void 0 ? void 0 : a[1]) === "403.1" || ((l = n.response) === null || l === void 0 ? void 0 : l.type) === K.QUOTA_EXCEEDED);
      if (d >= 500 && d < 600 || u) d === 501 ? (e = T.NOT_IMPLEMENTED, s = "Unimplemented request") : d === 507 || u ? (e = T.EXCEEDS_QUOTA, s = "Quota exceeded") : (e = T.RETRYABLE_SERVER_ERROR, s = "Server error");
      else if (r instanceof We && e === r.code && r.code === this.UNEXPECTED_RESPONSE) return r;
    }
    return new We(e, s, r, n);
  }
  toString() {
    return `${this.name}: ${this.message}`;
  }
  static networkError(e, s, r) {
    return We.wrapError(T.NETWORK_ERROR, e, s, r);
  }
  static unexpectedResponse(e, s, r) {
    return We.wrapError(T.UNEXPECTED_RESPONSE, e, s, r);
  }
};
function xs(t, e, s) {
  return c.unexpectedResponse(t, e, s);
}
function ot(t) {
  return !(!t || typeof t != "object") && t.name === "AdobeDCXError";
}
function ao(t) {
  const e = Array.isArray(t.response) ? t.response.reduce((n, o) => n || o.error, void 0) : t.response.error;
  if (!e) return t;
  const s = Gt(t.statusCode, t);
  if (s instanceof c) throw s;
  const r = co(e, t);
  throw r || new c(e.type || c.UNEXPECTED_RESPONSE, e.title || "Unexpected Error", e, t);
}
c.ABORTED = T.ABORTED, c.INSECURE_REDIRECT = T.INSECURE_REDIRECT, c.TOO_MANY_REDIRECTS = T.TOO_MANY_REDIRECTS, c.INVALID_JSON = T.INVALID_JSON, c.READ_ONLY = T.READ_ONLY, c.INVALID_PARAMS = T.INVALID_PARAMS, c.INVALID_DATA = T.INVALID_DATA, c.DUPLICATE_VALUE = T.DUPLICATE_VALUE, c.NO_BASE_BRANCH_DATA = T.NO_BASE_BRANCH_DATA, c.INVALID_STATE = T.INVALID_STATE, c.DELETED_COMPOSITE = T.DELETED_COMPOSITE, c.INCOMPLETE_COMPOSITE = T.INCOMPLETE_COMPOSITE, c.UNEXPECTED_RESPONSE = T.UNEXPECTED_RESPONSE, c.NETWORK_ERROR = T.NETWORK_ERROR, c.COMPONENT_DOWNLOAD_ERROR = T.COMPONENT_DOWNLOAD_ERROR, c.COMPONENT_UPLOAD_ERROR = T.COMPONENT_UPLOAD_ERROR, c.COMPONENT_MODIFIED_ERROR = T.COMPONENT_MODIFIED_ERROR, c.UPDATE_CONFLICT = T.UPDATE_CONFLICT, c.NO_COMPOSITE = T.NO_COMPOSITE, c.ALREADY_EXISTS = T.ALREADY_EXISTS, c.SERVICE_IS_INACTIVE = T.SERVICE_IS_INACTIVE, c.EXCEEDS_QUOTA = T.EXCEEDS_QUOTA, c.NOT_IMPLEMENTED = T.NOT_IMPLEMENTED, c.RETRYABLE_SERVER_ERROR = T.RETRYABLE_SERVER_ERROR, c.TIMED_OUT = T.TIMED_OUT, c.UNEXPECTED = T.UNEXPECTED, c.TERMINATED_INPUTSTREAM = T.TERMINATED_INPUTSTREAM, c.WRONG_ENDPOINT = T.WRONG_ENDPOINT, c.OUT_OF_SPACE = T.OUT_OF_SPACE, c.FILE_EXISTS_IN_CLOUD = T.FILE_EXISTS_IN_CLOUD, c.ASSET_NOT_FOUND = T.ASSET_NOT_FOUND, c.COMPOSITE_NOT_FOUND = T.COMPOSITE_NOT_FOUND, c.NOT_FOUND = T.NOT_FOUND, c.UNAUTHORIZED = T.UNAUTHORIZED, c.FORBIDDEN = T.FORBIDDEN, c.PRECONDITION_FAILED = T.PRECONDITION_FAILED, c.RESOURCE_NOT_READY = T.RESOURCE_NOT_READY, c.ASSET_LOCKED = T.ASSET_LOCKED;
const $t = /* @__PURE__ */ new Map([[400, { code: T.UNEXPECTED_RESPONSE, message: "Bad request" }], [401, { code: T.UNAUTHORIZED, message: "Unauthorized" }], [403, { code: T.FORBIDDEN, message: "Forbidden" }], [404, { code: T.NOT_FOUND, message: "Not found" }], [405, { code: T.METHOD_NOT_ALLOWED, message: "The user is authorized to act on this resource, but cannot use the specified method." }], [406, { code: T.NOT_ACCEPTABLE, message: "Unable to obtain resource in a content type matching the Accept header or rendition type parameter." }], [409, { code: T.ALREADY_EXISTS, message: "Already exists" }], [412, { code: T.PRECONDITION_FAILED, message: "Precondition failed" }], [501, { code: T.NOT_IMPLEMENTED, message: "Not implemented" }], [507, { code: T.EXCEEDS_QUOTA, message: "Exceeds quota" }], [509, { code: T.BANDWIDTH_LIMIT_EXCEEDED, message: "Bandwidth limit exceeded" }]]), sn = new Map(Object.entries({ [K.ASSET_MOVED]: { code: T.ASSET_MOVED, message: "Asset moved to a different region while operation was in progress" }, [K.COMPOSITE_INTEGRITY]: { code: T.INCOMPLETE_COMPOSITE, message: "Incomplete composite. invoke missingComponentsFromError with this error for more information." }, [K.PARTIAL_ASSET]: { code: T.NO_COMPOSITE, message: "Asset is partially created. No Manifest found" }, [K.LIMIT_RESOURCE_COUNT]: { code: T.UNEXPECTED_RESPONSE, message: "Resource count limit exceed" }, [K.QUOTA_EXCEEDED]: { code: T.EXCEEDS_QUOTA, message: "Quota exceeded" }, [K.ASSET_LOCKED]: { code: T.ASSET_LOCKED, message: "Asset is locked and cannot be modified" } })), co = (t, e) => {
  var s;
  const r = sn.get((s = t.type) !== null && s !== void 0 ? s : "") || (typeof t.status == "number" ? $t.get(t.status) : void 0);
  return r ? new c(r.code, r.message, t, e) : void 0;
}, Tt = (t) => {
  var e, s;
  const r = sn.get((s = (e = t.response) === null || e === void 0 ? void 0 : e.type) !== null && s !== void 0 ? s : "") || $t.get(t.statusCode);
  return r ? new c(r.code, r.message, void 0, t, t.response) : void 0;
}, Gt = (t, e) => t && e ? t < 300 && t > 199 || Tt(e) || !1 : new c(T.NETWORK_ERROR, "Invalid or missing status code or response", void 0, e);
let wt;
const lo = new Uint8Array(16);
function uo() {
  if (!wt && (wt = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !wt)) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return wt(lo);
}
var ho = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
const se = [];
for (let t = 0; t < 256; ++t) se.push((t + 256).toString(16).slice(1));
var br = { randomUUID: typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto) };
function po(t, e, s) {
  if (br.randomUUID && !e && !t) return br.randomUUID();
  const r = (t = t || {}).random || (t.rng || uo)();
  return r[6] = 15 & r[6] | 64, r[8] = 63 & r[8] | 128, function(n, o = 0) {
    return se[n[o + 0]] + se[n[o + 1]] + se[n[o + 2]] + se[n[o + 3]] + "-" + se[n[o + 4]] + se[n[o + 5]] + "-" + se[n[o + 6]] + se[n[o + 7]] + "-" + se[n[o + 8]] + se[n[o + 9]] + "-" + se[n[o + 10]] + se[n[o + 11]] + se[n[o + 12]] + se[n[o + 13]] + se[n[o + 14]] + se[n[o + 15]];
  }(r);
}
const _o = (t) => S(t) && (Y(t.pipe) || Y(t.pipeTo)), S = (t) => t != null && typeof t == "object", Y = (t) => typeof t == "function", pe = (t) => Array.isArray(t), fo = (t) => S(t) && Y(t.constructor) && t.constructor.name === "ArrayBuffer" && Y(t.slice), yr = (t) => {
  if (typeof t != "string") return !1;
  const e = t.toLowerCase().split("application/");
  if (e.length < 2) return !1;
  const s = e[1].split(";")[0].trim();
  return s === "json" || s.endsWith("+json");
}, Yt = () => {
  try {
    return Object.prototype.toString.call(globalThis.process) === "[object process]";
  } catch {
    return !1;
  }
}, Eo = () => typeof self == "object" && self.self === self, qt = () => po(), zt = (t) => {
  return typeof (e = t) == "string" && ho.test(e);
  var e;
}, ye = (...t) => !t || !Array.isArray(t) || t.length < 1 ? {} : t.reduce((e, s) => {
  const r = S(e) ? e : {};
  if (S(s)) for (const n in s) Object.prototype.hasOwnProperty.call(s, n) && (r[n] = s[n]);
  return r;
}), Me = (t, ...e) => {
  if (!e.length) return t;
  const s = e.shift();
  if (S(t) && S(s)) for (const r in s) S(s[r]) && !pe(s[r]) ? (t[r] || Object.assign(t, { [r]: {} }), Me(t[r], s[r])) : pe(t[r]) && pe(s[r]) ? Object.assign(t, { [r]: s[r] }) : Object.assign(t, { [r]: s[r] });
  return Me(t, ...e);
}, rn = (...t) => {
  if (!t || !Array.isArray(t)) return "";
  const e = [], s = t.length;
  for (let r = 0; r < s; r++) {
    let n = t[r];
    typeof n == "string" && n !== "" && (r === 0 && n.length !== 1 || n.charAt(0) === "/" && (n = n.slice(1)), r !== s - 1 && n.charAt(n.length - 1) === "/" && (n = n.slice(0, n.length - 1)), e.push(n));
  }
  return e.join("/");
}, go = new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"), To = (t) => {
  const e = t.match(go) || [];
  return { scheme: e[2], authority: e[4], path: e[5], query: e[7], fragment: e[9] };
}, vs = (t) => {
  const e = To(t), s = e.scheme, r = e.authority, n = s === "https" ? 443 : s === "http" ? 80 : -1;
  let o;
  return s && r && (o = (s + "://" + r).toLowerCase(), n >= 0 && r.indexOf(":") < 0 && (o = o + ":" + n)), o;
}, Io = (t) => {
  if (!t || typeof t != "string") return t;
  const e = (t = (t = (t = (t = t.indexOf("//") > -1 ? t.split("/")[2] : t.split("/")[0]).split("?")[0]).split("/")[0]).split(":")[0]).split(".");
  return t = e.slice(Math.max(e.length - 2, 0)).join(".");
}, yt = 48, Ao = 49, Wt = 57, Os = 97, Rs = 65, nn = 102, on = 70, vr = (t) => {
  const e = t.charCodeAt(0);
  return e >= yt && e <= Wt || e >= Os && e <= nn || e >= Rs && e <= on;
}, jt = (t) => t.length >= 3 && t.charAt(0) === "%" && vr(t.charAt(1)) && vr(t.charAt(2)), Lt = (t) => {
  const e = t.charCodeAt(0);
  return e >= yt && e <= Wt ? e - yt : e >= Os && e <= nn ? 10 + e - Os : e >= Rs && e <= on ? 10 + e - Rs : 0;
}, Us = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.~", Or = "0123456789ABCDEF", Bs = (t) => {
  const e = [];
  for (let s = 0; s < 128; ++s) e.push(t.indexOf(String.fromCharCode(s)) !== -1);
  return e;
}, an = Bs(Us + ":/?#[]@!$&'()*+,;="), mo = Bs(Us);
Bs(Us + "/");
const bo = (t, e) => {
  if (t < 128 && e[t]) return String.fromCharCode(t);
  let s = "%";
  return s += Or.charAt(t >> 4 & 15), s += Or.charAt(15 & t), s;
}, yo = (t) => {
  const e = [];
  for (let s = 0; s < t.length; s++) {
    let r = t.charCodeAt(s);
    r < 128 ? e.push(r) : r < 2048 ? e.push(192 | r >> 6, 128 | 63 & r) : r < 55296 || r >= 57344 ? e.push(224 | r >> 12, 128 | r >> 6 & 63, 128 | 63 & r) : ++s < t.length && (r = 65536 + ((1023 & r) << 10 | 1023 & t.charCodeAt(s)), e.push(240 | r >> 18, 128 | r >> 12 & 63, 128 | r >> 6 & 63, 128 | 63 & r));
  }
  return e;
}, js = (t, e) => {
  const s = yo(t);
  let r = "";
  for (let n = 0; n < s.length; n++) r += bo(s[n], e);
  return r;
}, ht = (t) => (t = t.normalize("NFC"), js(t, mo)), us = (t) => {
  t = t.normalize("NFC");
  let e = 0, s = "";
  for (; e < t.length; ) jt(t.substr(e)) ? (s += t.substr(e, 3), e += 3) : s += js(t.charAt(e++), an);
  return s;
}, je = (t, e) => {
  let s = 0, r = "", n = !1, o = !1, i = !1, a = !0, l = !0, d = !1, u = "", p = "", _ = ",", f = -1;
  const b = (y) => {
    if (r += a ? p : d || l ? _ : ",", o && u && (a || d || l) && (r += ht(u), (!i || y.length > 0) && (r += "=")), y) {
      let P;
      P = n ? us(y) : ht(y), f > 0 && (P = ((m, D) => {
        let k = 0;
        for (; k < m.length && D > 0; ) {
          if (jt(m.substr(k))) {
            let j = (Lt(m.substr(k + 1)) << 4) + Lt(m.substr(k + 2));
            if (k += 3, !(192 & ~j)) for (; k < m.length && jt(m.substr(k)) && (j = (Lt(m.substr(k + 1)) << 4) + Lt(m.substr(k + 2)), k += 3, (192 & j) == 128); ) ;
          } else ++k;
          --D;
        }
        return m.substr(0, k);
      })(P, f)), r += P;
    }
    a = !1, l = !1;
  };
  for (; s < t.length; ) if (t.charAt(s) === "{") {
    if (++s < t.length) {
      switch (n = !1, o = !1, p = "", _ = ",", i = !1, t.charAt(s++)) {
        case "+":
          n = !0;
          break;
        case "#":
          p = "#", n = !0;
          break;
        case ".":
          p = ".", _ = ".";
          break;
        case "/":
          p = "/", _ = "/";
          break;
        case ";":
          p = ";", _ = ";", o = i = !0;
          break;
        case "?":
          p = "?", _ = "&", o = !0;
          break;
        case "&":
          p = "&", _ = "&", o = !0;
          break;
        default:
          --s;
      }
      for (u = "", a = !0, l = !0; s < t.length; ) if (t.charAt(s) === "}" || t.charAt(s) === "," || t.charAt(s) === "*" || t.charAt(s) === ":") {
        if (d = !1, f = -1, t.charAt(s) === "*") {
          if (d = !0, ++s >= t.length) break;
        } else if (t.charAt(s) === ":") {
          if (++s >= t.length) break;
          for (t.charCodeAt(s) >= Ao && t.charCodeAt(s) <= Wt && (f = 0); s < t.length && t.charCodeAt(s) >= yt && t.charCodeAt(s) <= Wt && f < 1e4; ) f = 10 * f + (t.charCodeAt(s++) - yt);
          if (s >= t.length) break;
        }
        for (; s < t.length && t.charAt(s) !== "}" && t.charAt(s) !== ","; ) ++s;
        if (u.length > 0 && u.charAt(u.length - 1) === "*" && (d = !0, u = u.substr(0, u.length - 1)), u.length > 0) {
          const y = e ? e[u] : void 0;
          if (y || y === "") if (Array.isArray(y)) {
            f = -1;
            for (let P = 0; P < y.length; P++) b(String(y[P]));
          } else if (typeof y == "object" && y !== null) for (const P in y) Object.prototype.hasOwnProperty.call(y, P) && (A = P, v = String(y[P]), r += a ? p : d || l ? _ : ",", o && u && a && !d && (r += ht(u), (!i || v.length > 0) && (r += "=")), A && (r += n ? us(A) : ht(A), r += d ? "=" : ",", v && (r += n ? us(v) : ht(v))), a = !1, l = !1);
          else b(String(y));
        }
        if (t.charAt(s++) === "}") break;
        u = "", l = !0;
      } else u += t.charAt(s++);
    }
  } else jt(t.substr(s)) ? (r += t.substr(s, 3), s += 3) : r += js(t.charAt(s++), an);
  var A, v;
  return r;
}, Rr = (t, e) => {
  if (!t || typeof t != "string" || !e) return "";
  let s;
  return s = typeof e == "string" ? t.match(e) : e.exec(t), s ? s[1] : "";
};
function Ps(t, e, s, r) {
  return new (s || (s = Promise))(function(n, o) {
    function i(d) {
      try {
        l(r.next(d));
      } catch (u) {
        o(u);
      }
    }
    function a(d) {
      try {
        l(r.throw(d));
      } catch (u) {
        o(u);
      }
    }
    function l(d) {
      var u;
      d.done ? n(d.value) : (u = d.value, u instanceof s ? u : new s(function(p) {
        p(u);
      })).then(i, a);
    }
    l((r = r.apply(t, [])).next());
  });
}
function Ae(t, e) {
  return t ? new TextDecoder().decode(t) : "";
}
function Ee(t) {
  return new TextEncoder().encode(t);
}
function we(t, e) {
  const s = new Uint8Array(t.length + e.length);
  return s.set(t, 0), s.set(e, t.length), s;
}
function vo(t) {
  const e = {};
  for (const [s, r] of t) e[s] = r;
  return e;
}
function Oo(t, e) {
  return t.reduce((s, r, n) => (n % e == 0 ? s.unshift([r]) : s[0].push(r), s), []).reverse();
}
let Vs = class {
  constructor(e) {
    this._handlers = {}, e.forEach((s) => {
      this._handlers[s] = [];
    });
  }
  on(e, s) {
    return this._handlers[e].push(s) - 1;
  }
  emit(e, s) {
    this._handlers[e].forEach((r) => {
      Y(r) && r(...s);
    });
  }
  removeHandler(e, s) {
    delete this._handlers[e][s];
  }
  removeAllHandlers(e) {
    e ? this._handlers[e] = [] : this._handlers = {};
  }
};
const cn = [/^(?!^501$|^507$)^(5\d{2})$|429|423$/], Pr = (t, e) => {
  return typeof (s = t) == "object" && typeof s.test == "function" ? t.test(e.toString()) : e === t;
  var s;
};
function Et(t, e = cn) {
  return !!t && (Array.isArray(e) ? e.some((s) => Pr(s, t)) : Pr(e, t));
}
const Ro = /^([^:]+):(.*)$/, Sr = /^\s+|\s+$/g, Fs = (t) => {
  const e = {}, s = t.split(/\r?\n/);
  let r, n;
  for (let o = 0; o < s.length; ++o) {
    const i = s[o];
    if (i.length > 0) {
      const a = i.charCodeAt(0);
      if (!r || a !== 9 && a !== 32) {
        const l = Ro.exec(i);
        l && l.length > 1 && (r = l[1].toLowerCase(), n = l[2] || "", n = n.replace(Sr, ""), e[r] ? e[r] = e[r] + "," + n : e[r] = n);
      } else e[r] = e[r] + " " + i.replace(Sr, "");
    }
  }
  return e;
}, vt = (t) => {
  if (t === null || typeof t != "object") return {};
  const e = {};
  for (const [s, r] of Object.entries(t)) e[s.toLowerCase()] = pe(r) ? r.join(";") : r;
  return e;
}, Oe = (t, e, s) => pe(e) ? new c(c.INVALID_PARAMS, `Param '${t}' type must be one of: [${e.join(",")}].${s && s.length > 0 ? " Possible values: " + s.join(", ") + "." : ""}`) : new c(c.INVALID_PARAMS, `Param '${t}' must be of type '${e}'.${s && s.length > 0 ? " Possible values: " + s.join(", ") + "." : ""}`), $e = (t, e, s, r = !1, n = []) => {
  if (r && e == null) return !0;
  if (pe(s)) {
    for (const i in s) {
      const a = s[i];
      try {
        return $e(t, e, a, r, n), !0;
      } catch {
      }
    }
    throw Oe(t, s, n);
  }
  if (s === "null" && e !== null || s === "undefined" && e !== void 0 || s === "nullish" && e != null) throw Oe(t, s, n);
  if (s === "null" || s === "undefined" || s === "nullish") return !0;
  if (!r && e == null) throw Oe(t, s, n);
  if (s.endsWith("[]")) {
    if (!pe(e)) throw Oe(t, s, n);
    return e.forEach((i, a) => {
      $e(`${t}[${a}]`, i, s.substr(0, s.length - 2));
    }), !0;
  }
  let o = s.toLowerCase();
  switch (s) {
    case "integer":
    case "+number":
    case "-number":
      o = "number";
  }
  if (o === "array") {
    if (!pe(e)) throw Oe(t, s, n);
  } else if (o !== "enum" && (typeof e !== o || s === "integer" && (typeof e != "number" || !Number.isInteger(e)) || s === "+number" && (typeof e != "number" || e < 0) || s === "-number" && (typeof e != "number" || e > 0)))
    throw Oe(t, s, n);
  if (n.length > 0) {
    const i = n.length;
    let a = !1;
    for (let l = 0; l < i; l++) if (n[l] === e) {
      a = !0;
      break;
    }
    if (!a) throw Oe(t, s, n);
  }
  return !0;
};
function g(...t) {
  return t.map((e) => $e(...e));
}
function ln(t, e, ...s) {
  if (e = e ? " " + e + " " : " ", !t || typeof t != "object") throw new c(c.INVALID_PARAMS, `Object${e}is invalid.`);
  try {
    s.forEach((r) => {
      $e(r[0], t[r[0]], r[1], r[2] || !1, r[3] || []);
    });
  } catch (r) {
    throw new c(c.INVALID_PARAMS, `Object${e}is invalid. ${r.message.replace("Param", "Property")}`, r);
  }
}
const dn = (t, e) => {
  if (t() === !1) throw new c(c.INVALID_PARAMS, e);
};
function Po(t, e = {}, s) {
  const r = typeof e.selector == "function" ? e.selector : So, n = Array.isArray(t) ? r(t, s) : t;
  if (!n) throw new c(c.INVALID_PARAMS, "Could not select appropriate link for usage");
  return n.templated ? typeof e.expander == "function" ? e.expander(n.href, s) : je(n.href, s) : n.href;
}
function So(t, e = { mode: "id" }) {
  let s = t[0], r = 0;
  for (const n of t) {
    let o = 0;
    for (const i in n) i in e && n[i] === e[i] && o++;
    o > r && (r = o, s = n);
  }
  return s;
}
function M(t) {
  if (!S(t)) throw new Error("Expecting object");
  const e = {};
  for (const s in t) t[s] != null && (e[s] = t[s]);
  return e;
}
const No = /^utf-?8|ascii|utf-?16-?le|ucs-?2|base-?64|latin-?1$/i, Co = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, Do = /\s|\uFEFF|\xA0/, ko = /\r?\n[\x20\x09]+/g, wo = /[;,"]/, Lo = /[;,"]|\s/, Mt = 1, Nr = 2, hs = 4;
function Cr(t) {
  return t.replace(Co, "");
}
function Vt(t) {
  return Do.test(t);
}
function Mo(t, e) {
  for (; Vt(t[e]); ) e++;
  return e;
}
function Dr(t) {
  return Lo.test(t);
}
class xo {
  constructor(e) {
    this.refs = [], e && this.parse(e);
  }
  rel(e) {
    const s = [];
    for (let r = 0; r < this.refs.length; r++) this.refs[r].rel === e && s.push(this.refs[r]);
    return s;
  }
  get(e, s) {
    e = e.toLowerCase();
    const r = [];
    for (let n = 0; n < this.refs.length; n++) this.refs[n][e] === s && r.push(this.refs[n]);
    return r;
  }
  set(e) {
    return this.refs.push(e), this;
  }
  has(e, s) {
    e = e.toLowerCase();
    for (let r = 0; r < this.refs.length; r++) if (this.refs[r][e] === s) return !0;
    return !1;
  }
  parse(e, s = 0) {
    let r = s ? e.slice(s) : e;
    r = Cr(r).replace(ko, "");
    let n = Mt;
    const o = r.length;
    let i = 0, a = null;
    for (; i < o; ) if (n === Mt) {
      if (Vt(r[i])) {
        i++;
        continue;
      }
      if (r[i] !== "<") throw new Error('Unexpected character "' + r[i] + '" at offset ' + i);
      {
        const l = r.indexOf(">", i);
        if (l === -1) throw new Error("Expected end of URI delimiter at offset " + i);
        a = { uri: r.slice(i + 1, l) }, this.refs.push(a), i = l, n = Nr;
      }
      i++;
    } else if (n === Nr) {
      if (Vt(r[i])) {
        i++;
        continue;
      }
      if (r[i] === ";") n = hs, i++;
      else {
        if (r[i] !== ",") throw new Error('Unexpected character "' + r[i] + '" at offset ' + i);
        n = Mt, i++;
      }
    } else {
      if (n !== hs) throw new Error('Unknown parser state "' + n + '"');
      {
        if (r[i] === ";" || Vt(r[i])) {
          i++;
          continue;
        }
        const l = r.indexOf("=", i);
        if (l === -1) throw new Error("Expected attribute delimiter at offset " + i);
        const d = Cr(r.slice(i, l)).toLowerCase();
        let u = "";
        if (i = l + 1, i = Mo(r, i), r[i] === '"') for (i++; i < o; ) {
          if (r[i] === '"') {
            i++;
            break;
          }
          r[i] === "\\" && i++, u += r[i], i++;
        }
        else {
          let p = i + 1;
          for (; !wo.test(r[p]) && p < o; ) p++;
          u = r.slice(i, p), i = p;
        }
        if (!(a && a[d] && Uo(d))) if (a && d[d.length - 1] === "*") a[d] = Bo(u);
        else if (u = d === "rel" || d === "type" ? u.toLowerCase() : u, a && a[d] != null) {
          const p = a[d];
          pe(p) ? p.push(u) : a[d] = [a[d], u];
        } else {
          if (!a) throw new Error("Unexpected null ref");
          a[d] = u;
        }
        switch (r[i]) {
          case ",":
            n = Mt;
            break;
          case ";":
            n = hs;
        }
        i++;
      }
    }
    return a = null, this;
  }
  toString() {
    const e = [];
    let s, r = "";
    for (let n = 0; n < this.refs.length; n++) s = this.refs[n], r = Object.keys(this.refs[n]).reduce(function(o, i) {
      return i === "uri" ? o : o + "; " + un(i, s[i]);
    }, "<" + s.uri + ">"), e.push(r);
    return e.join(", ");
  }
}
const Ss = (t) => No.test(t), Uo = (t) => t === "rel" || t === "type" || t === "media" || t === "title" || t === "title*", kr = (t) => t.replace(/"/g, '\\"'), Bo = (t) => {
  const e = /([^']+)?(?:'([^']+)')?(.+)/.exec(t) || [];
  return { language: e[2].toLowerCase(), encoding: Ss(e[1]) ? null : e[1].toLowerCase(), value: Ss(e[1]) ? decodeURIComponent(e[3]) : e[3] };
}, un = (t, e) => Array.isArray(e) ? e.map((s) => un(t, s)).join("; ") : t[t.length - 1] === "*" || typeof e != "string" ? ((s, r) => {
  const n = (r.encoding || "utf-8").toUpperCase(), o = r.language || "en";
  let i = "";
  return i = Buffer.isBuffer(r.value) && Ss(n) ? r.value.toString(n) : Buffer.isBuffer(r.value) ? r.value.toString("hex").replace(/[0-9a-f]{2}/gi, "%$1") : encodeURIComponent(r.value), s + "=" + n + "'" + o + "'" + i;
})(t, e) : (/* @__PURE__ */ ((s) => s === "rel" || s === "type" || s === "anchor")(t) ? e = Dr(e) ? '"' + kr(e) + '"' : kr(e) : Dr(e) && (e = '"' + (e = (e = encodeURIComponent(e)).replace(/%20/g, " ").replace(/%2C/g, ",").replace(/%3B/g, ";")) + '"'), t + "=" + e);
function Hs(t, e, s, r = "id") {
  const n = $s(t)[e];
  if (n) {
    if (Array.isArray(n)) {
      const o = n.filter((i) => i.mode === r);
      return o.length > 0 ? o[0][s] : n.length > 0 ? n[0][s] : void 0;
    }
    return n[s];
  }
}
function F(t, e, s = "id") {
  const r = $s(t), n = r[e];
  let o;
  if (S(n) && typeof n.href == "string" ? o = n.href : Array.isArray(n) && (o = Hs(r, e, "href", s)), typeof o != "string") throw new c(c.INVALID_PARAMS, "Missing or invalid link href.");
  return o;
}
function ee(t, e, s, r = "id") {
  const n = F($s(t), e, r);
  return je(n, M(s));
}
const jo = (t, e = 0) => new xo().parse(t, e);
function $s(t) {
  return S(t) ? "_links" in t ? t._links : "links" in t ? t.links : t : {};
}
let xt;
const Vo = () => {
  if (xt) return xt;
  const t = Yt();
  return xt = t && S(globalThis.performance) && Y(globalThis.performance.now) ? globalThis.performance : t && S(globalThis.perf_hooks) && S(globalThis.perf_hooks.performance) && Y(globalThis.perf_hooks.performance.now) ? globalThis.perf_hooks.performance : Eo() && S(self.performance) && Y(self.performance.now) ? self.performance : Date, xt;
}, re = () => Vo().now(), Fo = (t) => Ps(void 0, void 0, void 0, function* () {
  return new Promise((e) => setTimeout(e, t));
});
function hn(t, e, s, r, n) {
  return Ps(this, void 0, void 0, function* () {
    return t().catch((o) => Ps(this, void 0, void 0, function* () {
      var i, a, l;
      if (re() - s.startTime >= s.timeoutAfter) throw new c(c.TIMED_OUT, "request aborted due to timeout");
      r || (r = (i = o.response) === null || i === void 0 ? void 0 : i.response.type);
      const d = 1e3 * parseInt((a = o.response) === null || a === void 0 ? void 0 : a.headers["retry-after"], 10) || 2e3;
      if (((l = o.response) === null || l === void 0 ? void 0 : l.statusCode) === e && o.response.response.type === r) return yield Fo(d), hn(t, e, s, r);
      throw o;
    }));
  });
}
var wr, Lr, Mr, Pe, q;
(function(t) {
  t[t.Success = 0] = "Success", t[t.Error = 1] = "Error";
})(wr || (wr = {})), function(t) {
  t[t.CompositeXfer = 0] = "CompositeXfer";
}(Lr || (Lr = {})), function(t) {
  t[t.Push = 0] = "Push", t[t.MinPull = 1] = "MinPull", t[t.VersionPull = 2] = "VersionPull", t[t.Upload = 3] = "Upload", t[t.Download = 4] = "Download", t[t.Create = 5] = "Create", t[t.Unknown = 6] = "Unknown";
}(Mr || (Mr = {})), function(t) {
  t.PushComposite = "analyticsPush", t.CreateComposite = "analyticsCreate", t.PullComposite = "analyticsPull", t.PullCompositeVersion = "analyticsPullVersion", t.UploadComponent = "analyticsUpload", t.DownloadComponent = "analyticsDownload", t.All = "*";
}(Pe || (Pe = {})), function(t) {
  t[t.Deprecated = 0] = "Deprecated", t[t.Error = 1] = "Error", t[t.Warn = 2] = "Warn", t[t.Log = 3] = "Log", t[t.Debug = 4] = "Debug";
}(q || (q = {}));
const Ho = { [q.Deprecated]: "error", [q.Error]: "error", [q.Log]: "log", [q.Warn]: "warn", [q.Debug]: "debug" };
class ce extends Vs {
  constructor(e) {
    super([Pe.CreateComposite, Pe.UploadComponent, Pe.PushComposite, Pe.PullComposite, Pe.PullCompositeVersion, Pe.DownloadComponent]), this._logLevel = q.Warn, this._prevDebugTime = re(), this._debugFormatter = (s, r, n, o) => `[${s} (+${(1e3 * (r - n)).toFixed(0)})] ${o.map((i) => typeof i == "string" ? i : JSON.stringify(i)).join(" ")}`, this._debugNamespaces = [], this._debugSkips = [], this.suppressDeprecationWarnings = !1, e && (this._logCallback = e), this._initNamespaces();
  }
  get debugNamespaces() {
    return this._debugNamespaces;
  }
  get debugSkips() {
    return this._debugSkips;
  }
  set logLevel(e) {
    if (!Object.values(q).includes(e)) throw new Error(`Invalid LogLevel, must be one of: ${Object.values(q).join(", ")}.`);
    this._logLevel = e;
  }
  get logLevel() {
    return this._logLevel;
  }
  on(e, s) {
    if (e !== Pe.All) return super.on(e, s);
    const r = Object.values(Pe);
    let n;
    for (let o = 0, i = r.length; o < i; o++) {
      const a = r[o];
      n = super.on(a, s);
    }
    return n;
  }
  static getInstance() {
    return ce._instance == null && (ce._instance = new ce()), ce._instance;
  }
  static newLogger(e) {
    return new ce(e);
  }
  set logCallback(e) {
    this._logCallback = e;
  }
  get logCallback() {
    return this._logCallback;
  }
  _initNamespaces() {
    Yt() ? this.setDebugNamespaces(process.env.DCX_DEBUG || "") : S(globalThis) && S(globalThis.dcxjs) && this.setDebugNamespaces(globalThis.dcxjs.debug || ""), this._debugNamespaces.length > 0 && (this._logLevel = q.Debug);
  }
  _log(e, s, r) {
    try {
      if (e === ce.LEVEL_DEPRECATED) !this.suppressDeprecationWarnings && this._logLevel >= e && console.warn(...r);
      else if (typeof this._logCallback == "function" && this._logLevel >= e) this._logCallback.call(void 0, ...r);
      else if (this._logLevel >= e) if (e === q.Debug) {
        if (this._debugEnabled(s)) {
          const n = this._prevDebugTime;
          this._prevDebugTime = re(), (console.debug || console.log)(this._debugFormatter(s, this._prevDebugTime, n, r));
        }
      } else console[Ho[e]](...r.slice(0, -2));
    } catch {
    }
  }
  log(...e) {
    this._log(q.Log, void 0, e);
  }
  warn(...e) {
    this._log(q.Warn, void 0, e);
  }
  error(...e) {
    this._log(q.Error, void 0, e);
  }
  deprecated(...e) {
    this._log(q.Deprecated, void 0, e);
  }
  _debugEnabled(e) {
    if (e[e.length - 1] === "*") return !0;
    let s, r;
    for (s = 0, r = this._debugSkips.length; s < r; s++) if (this._debugSkips[s].test(e)) return !1;
    for (s = 0, r = this._debugNamespaces.length; s < r; s++) if (this._debugNamespaces[s].test(e)) return !0;
    return !1;
  }
  setDebugFormatter(e) {
    this._debugFormatter = e;
  }
  setDebugNamespaces(e) {
    let s;
    this._debugNamespaces = [], this._debugSkips = [];
    const r = (typeof e == "string" ? e : "").split(/[\s,]+/), n = r.length;
    for (s = 0; s < n; s++) r[s] && ((e = r[s].replace(/\*/g, ".*?"))[0] === "-" ? this._debugSkips.push(new RegExp("^" + e.substr(1) + "$")) : this._debugNamespaces.push(new RegExp("^" + e + "$")));
  }
  Debug(e) {
    return (...s) => {
      this._log(q.Debug, e, s);
    };
  }
}
ce.LEVEL_DEBUG = q.Debug, ce.LEVEL_LOG = q.Log, ce.LEVEL_WARN = q.Warn, ce.LEVEL_ERROR = q.Error, ce.LEVEL_DEPRECATED = q.Deprecated;
const Gs = () => {
  const t = pn();
  return t._logCallback !== void 0 ? t : ce.getInstance();
}, pn = () => {
  if (typeof globalThis == "object" && typeof globalThis.dcxjs == "object" && globalThis.dcxjs.logger && globalThis.dcxjs.logger.getInstance) return globalThis.dcxjs.logger.getInstance();
  const t = () => {
  };
  return { log: t, warn: t, error: t, deprecated: t, debug: t, newLogger: pn };
}, xr = (...t) => {
  const e = Gs();
  t.forEach(e.log.bind(e));
}, x = (t) => Gs().Debug(t);
Gs();
const Ur = (t) => toString.call(t) === "[object Function]";
let $o = class {
  constructor(e, s) {
    return this._promise = null, this._props = {}, this._registeredProps = [], this._handlers = { cancel: [] }, this._done = !1, this._canceled = !1, this._internalKeys = [], this.name = "AdobePromise", this._internalKeys = [...Object.keys(this), ...Object.keys(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this))), "_cancelReason"], s && typeof s == "object" && this._setProps(s), this._promise = new Promise((r, n) => e.call(this, (o) => {
      this._done || (this._done = !0, r(o));
    }, (o) => {
      this._done || (this._done = !0, n(o));
    }, this._registerCancelHandler.bind(this))), new Proxy(this, { set: function(r, n, o) {
      if (r._internalKeys.includes(n)) {
        if (!["_promise", "_canceled", "_cancelReason", "_props", "_registeredProps"].includes(n)) throw new Error("Cannot overwrite internal AdobePromise property.");
        r[n] = o;
      } else r._registeredProps.includes(n) || r._registeredProps.push(n), r.props[n] = o;
      return !0;
    }, get: function(r, n) {
      return typeof n == "symbol" || r._internalKeys.includes(n) ? r[n] : r.props[n];
    } });
  }
  get [Symbol.toStringTag]() {
    return this.name;
  }
  static reject(e, s) {
    return new N((r, n) => Promise.reject(e).catch((o) => {
      n && n(o);
    }), s);
  }
  static resolve(e, s) {
    return new N((r) => {
      S(e) && Ur(e.then) ? e.then((n) => {
        r(n);
      }) : r(e);
    }, s);
  }
  static allSettled(e, s) {
    return e.length === 0 ? N.resolve([], s) : new N((r) => {
      const n = [];
      e.map((o, i) => {
        o.then((a) => {
          n[i] = { status: "fulfilled", value: a };
        }).catch((a) => {
          n[i] = { status: "rejected", reason: a };
        }).then(() => {
          n.filter((a) => !!a).length === e.length && r(n);
        });
      });
    }, s);
  }
  get canceled() {
    return this._canceled;
  }
  getPromise() {
    return this._promise;
  }
  _resolveOrReject(e, s) {
    return this._promise.then((r) => this._canceled ? s && s(this._cancelReason) : e(r)).catch((r) => s && s(this._cancelReason || r));
  }
  then(e, s) {
    if (e == null && s == null) return this;
    const r = new N((n, o, i) => (i && i((a) => {
      this.cancel.call(this, a), o && o(a);
    }), this._resolveOrReject.call(this, n, o)), this._props);
    return r._promise = r.getPromise().then((n) => {
      const o = e && e(n);
      if (o instanceof N) {
        const i = o;
        this.onCancel((a) => i.cancel(a));
        for (const a in this.props) i.props[a] == null && (i.props[a] = this.props[a]);
        i._setProps(i.props), this._setProps(i.props), r._setProps(i.props);
      }
      return o;
    }).catch(s), r;
  }
  parallel(e, s) {
    return this._promise.then(e, s);
  }
  catch(e) {
    return this._promise = this._promise.catch(e), this;
  }
  finally(e) {
    return this._promise = this._promise.finally(e), this;
  }
  cancel(e) {
    this._canceled || (this._canceled = !0, this._cancelReason = e, this._callHandlers("cancel", e || new Error("Aborted")));
  }
  abort(e) {
    this.cancel(e);
  }
  onCancel(e) {
    Ur(e) && this._registerCancelHandler(e);
  }
  get props() {
    return this._props;
  }
  _setProps(e) {
    if (this._props === e) return;
    this._props = e;
    const s = [], r = Object.getOwnPropertyDescriptors(N), n = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(e));
    if (n.constructor.value !== Object) for (const o in n) {
      if (o in r || o in this && !this._registeredProps.includes(o)) continue;
      s.push(o);
      const i = n[o], a = Object.assign({}, i);
      delete a.get, delete a.set, (i.get || i.set) && (delete a.value, delete a.writable, i.get && (a.get = i.get.bind(e)), i.set && (a.set = i.set.bind(e))), Object.defineProperty(this, o, a);
    }
    for (const o of Object.keys(e)) s.push(o), o in r || o in this && !this._registeredProps.includes(o) || Object.defineProperty(this, o, { get: () => this._props[o], set: (i) => {
      this._props[o] = i;
    }, configurable: !0 });
    return this._registeredProps = s, this;
  }
  _registerCancelHandler(e) {
    this._handlers.cancel.push(e);
  }
  _callHandlers(e, s) {
    this._handlers[e].map((r) => r && r(s));
  }
  _destroy() {
    this._handlers.cancel = [];
  }
};
const N = $o;
var Go = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof globalThis == "object" ? globalThis : {}, Ke = "1.9.0", Br = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function Yo(t) {
  var e = /* @__PURE__ */ new Set([t]), s = /* @__PURE__ */ new Set(), r = t.match(Br);
  if (!r)
    return function() {
      return !1;
    };
  var n = {
    major: +r[1],
    minor: +r[2],
    patch: +r[3],
    prerelease: r[4]
  };
  if (n.prerelease != null)
    return function(l) {
      return l === t;
    };
  function o(a) {
    return s.add(a), !1;
  }
  function i(a) {
    return e.add(a), !0;
  }
  return function(l) {
    if (e.has(l))
      return !0;
    if (s.has(l))
      return !1;
    var d = l.match(Br);
    if (!d)
      return o(l);
    var u = {
      major: +d[1],
      minor: +d[2],
      patch: +d[3],
      prerelease: d[4]
    };
    return u.prerelease != null || n.major !== u.major ? o(l) : n.major === 0 ? n.minor === u.minor && n.patch <= u.patch ? i(l) : o(l) : n.minor <= u.minor ? i(l) : o(l);
  };
}
var qo = Yo(Ke), zo = Ke.split(".")[0], Ot = Symbol.for("opentelemetry.js.api." + zo), Rt = Go;
function Pt(t, e, s, r) {
  var n;
  r === void 0 && (r = !1);
  var o = Rt[Ot] = (n = Rt[Ot]) !== null && n !== void 0 ? n : {
    version: Ke
  };
  if (!r && o[t]) {
    var i = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + t);
    return s.error(i.stack || i.message), !1;
  }
  if (o.version !== Ke) {
    var i = new Error("@opentelemetry/api: Registration of version v" + o.version + " for " + t + " does not match previously registered API v" + Ke);
    return s.error(i.stack || i.message), !1;
  }
  return o[t] = e, s.debug("@opentelemetry/api: Registered a global for " + t + " v" + Ke + "."), !0;
}
function Ze(t) {
  var e, s, r = (e = Rt[Ot]) === null || e === void 0 ? void 0 : e.version;
  if (!(!r || !qo(r)))
    return (s = Rt[Ot]) === null || s === void 0 ? void 0 : s[t];
}
function St(t, e) {
  e.debug("@opentelemetry/api: Unregistering a global for " + t + " v" + Ke + ".");
  var s = Rt[Ot];
  s && delete s[t];
}
var Wo = function(t, e) {
  var s = typeof Symbol == "function" && t[Symbol.iterator];
  if (!s) return t;
  var r = s.call(t), n, o = [], i;
  try {
    for (; (e === void 0 || e-- > 0) && !(n = r.next()).done; ) o.push(n.value);
  } catch (a) {
    i = { error: a };
  } finally {
    try {
      n && !n.done && (s = r.return) && s.call(r);
    } finally {
      if (i) throw i.error;
    }
  }
  return o;
}, Ko = function(t, e, s) {
  if (arguments.length === 2) for (var r = 0, n = e.length, o; r < n; r++)
    (o || !(r in e)) && (o || (o = Array.prototype.slice.call(e, 0, r)), o[r] = e[r]);
  return t.concat(o || Array.prototype.slice.call(e));
}, Xo = (
  /** @class */
  function() {
    function t(e) {
      this._namespace = e.namespace || "DiagComponentLogger";
    }
    return t.prototype.debug = function() {
      for (var e = [], s = 0; s < arguments.length; s++)
        e[s] = arguments[s];
      return pt("debug", this._namespace, e);
    }, t.prototype.error = function() {
      for (var e = [], s = 0; s < arguments.length; s++)
        e[s] = arguments[s];
      return pt("error", this._namespace, e);
    }, t.prototype.info = function() {
      for (var e = [], s = 0; s < arguments.length; s++)
        e[s] = arguments[s];
      return pt("info", this._namespace, e);
    }, t.prototype.warn = function() {
      for (var e = [], s = 0; s < arguments.length; s++)
        e[s] = arguments[s];
      return pt("warn", this._namespace, e);
    }, t.prototype.verbose = function() {
      for (var e = [], s = 0; s < arguments.length; s++)
        e[s] = arguments[s];
      return pt("verbose", this._namespace, e);
    }, t;
  }()
);
function pt(t, e, s) {
  var r = Ze("diag");
  if (r)
    return s.unshift(e), r[t].apply(r, Ko([], Wo(s), !1));
}
var fe;
(function(t) {
  t[t.NONE = 0] = "NONE", t[t.ERROR = 30] = "ERROR", t[t.WARN = 50] = "WARN", t[t.INFO = 60] = "INFO", t[t.DEBUG = 70] = "DEBUG", t[t.VERBOSE = 80] = "VERBOSE", t[t.ALL = 9999] = "ALL";
})(fe || (fe = {}));
function Zo(t, e) {
  t < fe.NONE ? t = fe.NONE : t > fe.ALL && (t = fe.ALL), e = e || {};
  function s(r, n) {
    var o = e[r];
    return typeof o == "function" && t >= n ? o.bind(e) : function() {
    };
  }
  return {
    error: s("error", fe.ERROR),
    warn: s("warn", fe.WARN),
    info: s("info", fe.INFO),
    debug: s("debug", fe.DEBUG),
    verbose: s("verbose", fe.VERBOSE)
  };
}
var Jo = function(t, e) {
  var s = typeof Symbol == "function" && t[Symbol.iterator];
  if (!s) return t;
  var r = s.call(t), n, o = [], i;
  try {
    for (; (e === void 0 || e-- > 0) && !(n = r.next()).done; ) o.push(n.value);
  } catch (a) {
    i = { error: a };
  } finally {
    try {
      n && !n.done && (s = r.return) && s.call(r);
    } finally {
      if (i) throw i.error;
    }
  }
  return o;
}, Qo = function(t, e, s) {
  if (arguments.length === 2) for (var r = 0, n = e.length, o; r < n; r++)
    (o || !(r in e)) && (o || (o = Array.prototype.slice.call(e, 0, r)), o[r] = e[r]);
  return t.concat(o || Array.prototype.slice.call(e));
}, ei = "diag", Se = (
  /** @class */
  function() {
    function t() {
      function e(n) {
        return function() {
          for (var o = [], i = 0; i < arguments.length; i++)
            o[i] = arguments[i];
          var a = Ze("diag");
          if (a)
            return a[n].apply(a, Qo([], Jo(o), !1));
        };
      }
      var s = this, r = function(n, o) {
        var i, a, l;
        if (o === void 0 && (o = { logLevel: fe.INFO }), n === s) {
          var d = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          return s.error((i = d.stack) !== null && i !== void 0 ? i : d.message), !1;
        }
        typeof o == "number" && (o = {
          logLevel: o
        });
        var u = Ze("diag"), p = Zo((a = o.logLevel) !== null && a !== void 0 ? a : fe.INFO, n);
        if (u && !o.suppressOverrideMessage) {
          var _ = (l = new Error().stack) !== null && l !== void 0 ? l : "<failed to generate stacktrace>";
          u.warn("Current logger will be overwritten from " + _), p.warn("Current logger will overwrite one already registered from " + _);
        }
        return Pt("diag", p, s, !0);
      };
      s.setLogger = r, s.disable = function() {
        St(ei, s);
      }, s.createComponentLogger = function(n) {
        return new Xo(n);
      }, s.verbose = e("verbose"), s.debug = e("debug"), s.info = e("info"), s.warn = e("warn"), s.error = e("error");
    }
    return t.instance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t;
  }()
), ti = function(t, e) {
  var s = typeof Symbol == "function" && t[Symbol.iterator];
  if (!s) return t;
  var r = s.call(t), n, o = [], i;
  try {
    for (; (e === void 0 || e-- > 0) && !(n = r.next()).done; ) o.push(n.value);
  } catch (a) {
    i = { error: a };
  } finally {
    try {
      n && !n.done && (s = r.return) && s.call(r);
    } finally {
      if (i) throw i.error;
    }
  }
  return o;
}, si = function(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, s = e && t[e], r = 0;
  if (s) return s.call(t);
  if (t && typeof t.length == "number") return {
    next: function() {
      return t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ri = (
  /** @class */
  function() {
    function t(e) {
      this._entries = e ? new Map(e) : /* @__PURE__ */ new Map();
    }
    return t.prototype.getEntry = function(e) {
      var s = this._entries.get(e);
      if (s)
        return Object.assign({}, s);
    }, t.prototype.getAllEntries = function() {
      return Array.from(this._entries.entries()).map(function(e) {
        var s = ti(e, 2), r = s[0], n = s[1];
        return [r, n];
      });
    }, t.prototype.setEntry = function(e, s) {
      var r = new t(this._entries);
      return r._entries.set(e, s), r;
    }, t.prototype.removeEntry = function(e) {
      var s = new t(this._entries);
      return s._entries.delete(e), s;
    }, t.prototype.removeEntries = function() {
      for (var e, s, r = [], n = 0; n < arguments.length; n++)
        r[n] = arguments[n];
      var o = new t(this._entries);
      try {
        for (var i = si(r), a = i.next(); !a.done; a = i.next()) {
          var l = a.value;
          o._entries.delete(l);
        }
      } catch (d) {
        e = { error: d };
      } finally {
        try {
          a && !a.done && (s = i.return) && s.call(i);
        } finally {
          if (e) throw e.error;
        }
      }
      return o;
    }, t.prototype.clear = function() {
      return new t();
    }, t;
  }()
);
Se.instance();
function ni(t) {
  return t === void 0 && (t = {}), new ri(new Map(Object.entries(t)));
}
function _n(t) {
  return Symbol.for(t);
}
var oi = (
  /** @class */
  /* @__PURE__ */ function() {
    function t(e) {
      var s = this;
      s._currentContext = e ? new Map(e) : /* @__PURE__ */ new Map(), s.getValue = function(r) {
        return s._currentContext.get(r);
      }, s.setValue = function(r, n) {
        var o = new t(s._currentContext);
        return o._currentContext.set(r, n), o;
      }, s.deleteValue = function(r) {
        var n = new t(s._currentContext);
        return n._currentContext.delete(r), n;
      };
    }
    return t;
  }()
), ii = new oi(), Qe = /* @__PURE__ */ function() {
  var t = function(e, s) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
      r.__proto__ = n;
    } || function(r, n) {
      for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (r[o] = n[o]);
    }, t(e, s);
  };
  return function(e, s) {
    if (typeof s != "function" && s !== null)
      throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
    t(e, s);
    function r() {
      this.constructor = e;
    }
    e.prototype = s === null ? Object.create(s) : (r.prototype = s.prototype, new r());
  };
}(), ai = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.createGauge = function(e, s) {
      return gi;
    }, t.prototype.createHistogram = function(e, s) {
      return Ti;
    }, t.prototype.createCounter = function(e, s) {
      return Ei;
    }, t.prototype.createUpDownCounter = function(e, s) {
      return Ii;
    }, t.prototype.createObservableGauge = function(e, s) {
      return mi;
    }, t.prototype.createObservableCounter = function(e, s) {
      return Ai;
    }, t.prototype.createObservableUpDownCounter = function(e, s) {
      return bi;
    }, t.prototype.addBatchObservableCallback = function(e, s) {
    }, t.prototype.removeBatchObservableCallback = function(e) {
    }, t;
  }()
), Jt = (
  /** @class */
  /* @__PURE__ */ function() {
    function t() {
    }
    return t;
  }()
), ci = (
  /** @class */
  function(t) {
    Qe(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e.prototype.add = function(s, r) {
    }, e;
  }(Jt)
), li = (
  /** @class */
  function(t) {
    Qe(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e.prototype.add = function(s, r) {
    }, e;
  }(Jt)
), di = (
  /** @class */
  function(t) {
    Qe(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e.prototype.record = function(s, r) {
    }, e;
  }(Jt)
), ui = (
  /** @class */
  function(t) {
    Qe(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e.prototype.record = function(s, r) {
    }, e;
  }(Jt)
), Ys = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.addCallback = function(e) {
    }, t.prototype.removeCallback = function(e) {
    }, t;
  }()
), hi = (
  /** @class */
  function(t) {
    Qe(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e;
  }(Ys)
), pi = (
  /** @class */
  function(t) {
    Qe(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e;
  }(Ys)
), _i = (
  /** @class */
  function(t) {
    Qe(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e;
  }(Ys)
), fi = new ai(), Ei = new ci(), gi = new di(), Ti = new ui(), Ii = new li(), Ai = new hi(), mi = new pi(), bi = new _i(), yi = {
  get: function(t, e) {
    if (t != null)
      return t[e];
  },
  keys: function(t) {
    return t == null ? [] : Object.keys(t);
  }
}, vi = {
  set: function(t, e, s) {
    t != null && (t[e] = s);
  }
}, Oi = function(t, e) {
  var s = typeof Symbol == "function" && t[Symbol.iterator];
  if (!s) return t;
  var r = s.call(t), n, o = [], i;
  try {
    for (; (e === void 0 || e-- > 0) && !(n = r.next()).done; ) o.push(n.value);
  } catch (a) {
    i = { error: a };
  } finally {
    try {
      n && !n.done && (s = r.return) && s.call(r);
    } finally {
      if (i) throw i.error;
    }
  }
  return o;
}, Ri = function(t, e, s) {
  if (s || arguments.length === 2) for (var r = 0, n = e.length, o; r < n; r++)
    (o || !(r in e)) && (o || (o = Array.prototype.slice.call(e, 0, r)), o[r] = e[r]);
  return t.concat(o || Array.prototype.slice.call(e));
}, Pi = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.active = function() {
      return ii;
    }, t.prototype.with = function(e, s, r) {
      for (var n = [], o = 3; o < arguments.length; o++)
        n[o - 3] = arguments[o];
      return s.call.apply(s, Ri([r], Oi(n), !1));
    }, t.prototype.bind = function(e, s) {
      return s;
    }, t.prototype.enable = function() {
      return this;
    }, t.prototype.disable = function() {
      return this;
    }, t;
  }()
), Si = function(t, e) {
  var s = typeof Symbol == "function" && t[Symbol.iterator];
  if (!s) return t;
  var r = s.call(t), n, o = [], i;
  try {
    for (; (e === void 0 || e-- > 0) && !(n = r.next()).done; ) o.push(n.value);
  } catch (a) {
    i = { error: a };
  } finally {
    try {
      n && !n.done && (s = r.return) && s.call(r);
    } finally {
      if (i) throw i.error;
    }
  }
  return o;
}, Ni = function(t, e, s) {
  if (arguments.length === 2) for (var r = 0, n = e.length, o; r < n; r++)
    (o || !(r in e)) && (o || (o = Array.prototype.slice.call(e, 0, r)), o[r] = e[r]);
  return t.concat(o || Array.prototype.slice.call(e));
}, ps = "context", Ci = new Pi(), Qt = (
  /** @class */
  function() {
    function t() {
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalContextManager = function(e) {
      return Pt(ps, e, Se.instance());
    }, t.prototype.active = function() {
      return this._getContextManager().active();
    }, t.prototype.with = function(e, s, r) {
      for (var n, o = [], i = 3; i < arguments.length; i++)
        o[i - 3] = arguments[i];
      return (n = this._getContextManager()).with.apply(n, Ni([e, s, r], Si(o), !1));
    }, t.prototype.bind = function(e, s) {
      return this._getContextManager().bind(e, s);
    }, t.prototype._getContextManager = function() {
      return Ze(ps) || Ci;
    }, t.prototype.disable = function() {
      this._getContextManager().disable(), St(ps, Se.instance());
    }, t;
  }()
), Ns;
(function(t) {
  t[t.NONE = 0] = "NONE", t[t.SAMPLED = 1] = "SAMPLED";
})(Ns || (Ns = {}));
var fn = "0000000000000000", En = "00000000000000000000000000000000", Di = {
  traceId: En,
  spanId: fn,
  traceFlags: Ns.NONE
}, It = (
  /** @class */
  function() {
    function t(e) {
      e === void 0 && (e = Di), this._spanContext = e;
    }
    return t.prototype.spanContext = function() {
      return this._spanContext;
    }, t.prototype.setAttribute = function(e, s) {
      return this;
    }, t.prototype.setAttributes = function(e) {
      return this;
    }, t.prototype.addEvent = function(e, s) {
      return this;
    }, t.prototype.addLink = function(e) {
      return this;
    }, t.prototype.addLinks = function(e) {
      return this;
    }, t.prototype.setStatus = function(e) {
      return this;
    }, t.prototype.updateName = function(e) {
      return this;
    }, t.prototype.end = function(e) {
    }, t.prototype.isRecording = function() {
      return !1;
    }, t.prototype.recordException = function(e, s) {
    }, t;
  }()
), qs = _n("OpenTelemetry Context Key SPAN");
function zs(t) {
  return t.getValue(qs) || void 0;
}
function ki() {
  return zs(Qt.getInstance().active());
}
function Ws(t, e) {
  return t.setValue(qs, e);
}
function wi(t) {
  return t.deleteValue(qs);
}
function Li(t, e) {
  return Ws(t, new It(e));
}
function gn(t) {
  var e;
  return (e = zs(t)) === null || e === void 0 ? void 0 : e.spanContext();
}
var Mi = /^([0-9a-f]{32})$/i, xi = /^[0-9a-f]{16}$/i;
function Ui(t) {
  return Mi.test(t) && t !== En;
}
function Bi(t) {
  return xi.test(t) && t !== fn;
}
function Tn(t) {
  return Ui(t.traceId) && Bi(t.spanId);
}
function ji(t) {
  return new It(t);
}
var _s = Qt.getInstance(), In = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.startSpan = function(e, s, r) {
      r === void 0 && (r = _s.active());
      var n = !!s?.root;
      if (n)
        return new It();
      var o = r && gn(r);
      return Vi(o) && Tn(o) ? new It(o) : new It();
    }, t.prototype.startActiveSpan = function(e, s, r, n) {
      var o, i, a;
      if (!(arguments.length < 2)) {
        arguments.length === 2 ? a = s : arguments.length === 3 ? (o = s, a = r) : (o = s, i = r, a = n);
        var l = i ?? _s.active(), d = this.startSpan(e, o, l), u = Ws(l, d);
        return _s.with(u, a, void 0, d);
      }
    }, t;
  }()
);
function Vi(t) {
  return typeof t == "object" && typeof t.spanId == "string" && typeof t.traceId == "string" && typeof t.traceFlags == "number";
}
var Fi = new In(), Hi = (
  /** @class */
  function() {
    function t(e, s, r, n) {
      this._provider = e, this.name = s, this.version = r, this.options = n;
    }
    return t.prototype.startSpan = function(e, s, r) {
      return this._getTracer().startSpan(e, s, r);
    }, t.prototype.startActiveSpan = function(e, s, r, n) {
      var o = this._getTracer();
      return Reflect.apply(o.startActiveSpan, o, arguments);
    }, t.prototype._getTracer = function() {
      if (this._delegate)
        return this._delegate;
      var e = this._provider.getDelegateTracer(this.name, this.version, this.options);
      return e ? (this._delegate = e, this._delegate) : Fi;
    }, t;
  }()
), $i = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.getTracer = function(e, s, r) {
      return new In();
    }, t;
  }()
), Gi = new $i(), jr = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.getTracer = function(e, s, r) {
      var n;
      return (n = this.getDelegateTracer(e, s, r)) !== null && n !== void 0 ? n : new Hi(this, e, s, r);
    }, t.prototype.getDelegate = function() {
      var e;
      return (e = this._delegate) !== null && e !== void 0 ? e : Gi;
    }, t.prototype.setDelegate = function(e) {
      this._delegate = e;
    }, t.prototype.getDelegateTracer = function(e, s, r) {
      var n;
      return (n = this._delegate) === null || n === void 0 ? void 0 : n.getTracer(e, s, r);
    }, t;
  }()
), At;
(function(t) {
  t[t.UNSET = 0] = "UNSET", t[t.OK = 1] = "OK", t[t.ERROR = 2] = "ERROR";
})(At || (At = {}));
var Yi = Qt.getInstance(), qi = Se.instance(), zi = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.getMeter = function(e, s, r) {
      return fi;
    }, t;
  }()
), Wi = new zi(), fs = "metrics", Ki = (
  /** @class */
  function() {
    function t() {
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalMeterProvider = function(e) {
      return Pt(fs, e, Se.instance());
    }, t.prototype.getMeterProvider = function() {
      return Ze(fs) || Wi;
    }, t.prototype.getMeter = function(e, s, r) {
      return this.getMeterProvider().getMeter(e, s, r);
    }, t.prototype.disable = function() {
      St(fs, Se.instance());
    }, t;
  }()
), Xi = Ki.getInstance(), Zi = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.inject = function(e, s) {
    }, t.prototype.extract = function(e, s) {
      return e;
    }, t.prototype.fields = function() {
      return [];
    }, t;
  }()
), Ks = _n("OpenTelemetry Baggage Key");
function An(t) {
  return t.getValue(Ks) || void 0;
}
function Ji() {
  return An(Qt.getInstance().active());
}
function Qi(t, e) {
  return t.setValue(Ks, e);
}
function ea(t) {
  return t.deleteValue(Ks);
}
var Es = "propagation", ta = new Zi(), sa = (
  /** @class */
  function() {
    function t() {
      this.createBaggage = ni, this.getBaggage = An, this.getActiveBaggage = Ji, this.setBaggage = Qi, this.deleteBaggage = ea;
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalPropagator = function(e) {
      return Pt(Es, e, Se.instance());
    }, t.prototype.inject = function(e, s, r) {
      return r === void 0 && (r = vi), this._getGlobalPropagator().inject(e, s, r);
    }, t.prototype.extract = function(e, s, r) {
      return r === void 0 && (r = yi), this._getGlobalPropagator().extract(e, s, r);
    }, t.prototype.fields = function() {
      return this._getGlobalPropagator().fields();
    }, t.prototype.disable = function() {
      St(Es, Se.instance());
    }, t.prototype._getGlobalPropagator = function() {
      return Ze(Es) || ta;
    }, t;
  }()
), ra = sa.getInstance(), gs = "trace", na = (
  /** @class */
  function() {
    function t() {
      this._proxyTracerProvider = new jr(), this.wrapSpanContext = ji, this.isSpanContextValid = Tn, this.deleteSpan = wi, this.getSpan = zs, this.getActiveSpan = ki, this.getSpanContext = gn, this.setSpan = Ws, this.setSpanContext = Li;
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalTracerProvider = function(e) {
      var s = Pt(gs, this._proxyTracerProvider, Se.instance());
      return s && this._proxyTracerProvider.setDelegate(e), s;
    }, t.prototype.getTracerProvider = function() {
      return Ze(gs) || this._proxyTracerProvider;
    }, t.prototype.getTracer = function(e, s) {
      return this.getTracerProvider().getTracer(e, s);
    }, t.prototype.disable = function() {
      St(gs, Se.instance()), this._proxyTracerProvider = new jr();
    }, t;
  }()
), oa = na.getInstance();
const gt = {
  context: Yi,
  diag: qi,
  metrics: Xi,
  propagation: ra,
  trace: oa
}, ia = "9.10.0";
function aa(t) {
  return function(e) {
    e.traceableAs = () => t;
  };
}
function es(t, e, s) {
  const r = function(...n) {
    const o = gt.trace.getTracer("dcx-js", ia).startSpan(t), i = gt.trace.setSpan(gt.context.active(), o);
    try {
      const a = gt.context.with(i, () => e.apply(this, n));
      return o.setStatus({ code: At.OK }), a && a instanceof Promise ? a.catch((l) => {
        throw l instanceof Error && (o.recordException(l), o.setStatus({ code: At.ERROR, message: l.message })), l;
      }).finally(() => {
        o.end();
      }) : (o.end(), a);
    } catch (a) {
      throw a instanceof Error && (o.recordException(a), o.setStatus({ code: At.ERROR, message: a.message })), o.end(), a;
    }
  };
  return Object.defineProperties(r, { name: { value: e.name }, length: { value: e.length } }), r;
}
function _t(t, e, s) {
  var r;
  let n;
  Y(t) && (!((r = t.prototype) === null || r === void 0) && r.constructor) ? n = t.prototype.constructor : typeof t == "object" && t.constructor && (n = t.constructor);
  const o = s.value;
  return s.value = function(...i) {
    let a = e;
    if (n) {
      let l;
      l = Y(n.traceableAs) ? n.traceableAs() : n.name, a = l + "." + a;
    }
    return es(a, o).apply(this, i);
  }, s;
}
function ue(t, e) {
  var s;
  (s = gt.trace.getActiveSpan()) === null || s === void 0 || s.setAttribute(t, e || "");
}
const h = { ACCESS_CHECK: "http://ns.adobe.com/adobecloud/rel/ac/check", ACL_POLICY: "http://ns.adobe.com/adobecloud/rel/ac/policy", ANNOTATIONS: "http://ns.adobe.com/adobecloud/rel/annotations", APP_METADATA: "http://ns.adobe.com/adobecloud/rel/metadata/application", BASE_DIRECTORY: "http://ns.adobe.com/adobecloud/rel/directory/base", BLOCK_DOWNLOAD: "http://ns.adobe.com/adobecloud/rel/download", BLOCK_EXTEND: "http://ns.adobe.com/adobecloud/rel/block/extend", BLOCK_FINALIZE: "http://ns.adobe.com/adobecloud/rel/block/finalize", BLOCK_TRANSFER: "http://ns.adobe.com/adobecloud/rel/block/transfer", BLOCK_UPLOAD_INIT: "http://ns.adobe.com/adobecloud/rel/block/init", BULK_REQUEST: "http://ns.adobe.com/adobecloud/rel/bulk", COMPONENT: "http://ns.adobe.com/adobecloud/rel/component", CREATE: "http://ns.adobe.com/adobecloud/rel/create", DESCRIBED_BY: "describedBy", DIRECTORY: "http://ns.adobe.com/adobecloud/rel/directory", DISCARD: "http://ns.adobe.com/adobecloud/rel/discard", EFFECTIVE_PRIVILAGES: "http://ns.adobe.com/adobecloud/rel/ac/effective", EMBEDDED_METADATA: "http://ns.adobe.com/adobecloud/rel/metadata/embedded", ID: "http://ns.adobe.com/adobecloud/rel/id", MANIFEST: "http://ns.adobe.com/adobecloud/rel/manifest", PAGE: "http://ns.adobe.com/adobecloud/rel/page", PATH: "http://ns.adobe.com/adobecloud/rel/path", PRIMARY: "http://ns.adobe.com/adobecloud/rel/primary", RENDITION: "http://ns.adobe.com/adobecloud/rel/rendition", REPO_METADATA: "http://ns.adobe.com/adobecloud/rel/metadata/repository", REPO_OPS: "http://ns.adobe.com/adobecloud/rel/ops", REPOSITORY: "http://ns.adobe.com/adobecloud/rel/repository", RESOLVE_BY_ID: "http://ns.adobe.com/adobecloud/rel/resolve/id", RESOLVE_BY_PATH: "http://ns.adobe.com/adobecloud/rel/resolve/path", RESTORE: "http://ns.adobe.com/adobecloud/rel/restore", VERSION_HISTORY: "version-history" };
var I, Le, Vr, Fr, Hr, Kt, B, mt;
function ca(t) {
  return S(t) && ["headers", "responseType", "statusCode", "xhr"].every((e) => e in t);
}
function la(t) {
  return S(t) && ca(t.response);
}
function mn(t) {
  return S(t) && la(t) && "result" in t;
}
function bn(t) {
  return S(t) && Y(t.slice);
}
function Cs(t) {
  return S(t) && "resolvePullWithBranch" in t;
}
function $r(t) {
  return S(t) && (["compositeId", "compositeAssetId", "compositeRepositoryId"].some((e) => e in t) || S(t._core));
}
function Xt(t) {
  return S(t) && (S(t.links) || typeof t.repositoryId == "string" && (typeof t.path == "string" || typeof t.assetId == "string"));
}
function da(t) {
  return typeof Blob < "u" && t instanceof Blob;
}
function Xs(t) {
  return S(t) && (typeof t.repositoryId == "string" && typeof t.path == "string" || typeof t.assetId == "string");
}
function ua(t) {
  return S(t) && (t.name === "AdobeHTTPService" || Y(t.invoke));
}
function Zs(t) {
  return S(t) && ua(t.service);
}
function ha(t) {
  if (!S(t)) return !1;
  const e = t[I.LINKS];
  return S(e) ? !!(e[h.BLOCK_TRANSFER] && e[h.BLOCK_EXTEND] && e[h.BLOCK_FINALIZE]) : !1;
}
function yn(t) {
  return (e) => {
    const s = {};
    for (const r in e) s[r.toLowerCase()] = e[r];
    for (const r of t) s.hasOwnProperty(r.toLowerCase()) && delete s[r.toLowerCase()];
    return s;
  };
}
(function(t) {
  t.DC_FORMAT = "dc:format", t.DC_TITLE = "dc:title", t.LINKS = "_links", t.PAGE = "_page", t.CHILDREN = "children", t.EMBEDDED = "_embedded", t.REPO_REPRESENTATIONS = "repo:representations", t.REPO_ASSET_ID = "repo:assetId", t.REPO_REPOSITORY_ID = "repo:repositoryId", t.REPO_REPOSITORY_TYPE = "repo:repositoryType", t.REPO_BASE_ASSET_ID = "repo:baseAssetId", t.REPO_SIZE = "repo:size", t.REPO_NAME = "repo:name", t.REPO_PATH = "repo:path", t.REPO_ASSET_CLASS = "repo:assetClass", t.REPO_CREATE_DATE = "repo:createDate", t.REPO_MODIFY_DATE = "repo:modifyDate", t.REPO_DISCARD_DATE = "repo:discardDate", t.REPO_ETAG = "repo:etag", t.REPO_CREATED_BY = "repo:createdBy", t.REPO_MODIFIED_BY = "repo:modifiedBy", t.REPO_DISCARDED_BY = "repo:discardedBy", t.REPO_DEVICE_CREATE_DATE = "storage:deviceCreateDate", t.REPO_DEVICE_MODIFY_DATE = "storage:deviceModifyDate", t.REPO_DEFAULT_SCHEDULED_DELETION_DURATION = "repo:defaultScheduledDeletionDuration", t.REPO_ASSET_TYPE = "repo:assetType", t.REPO_ASSET_SUB_TYPE = "repo:assetSubType", t.STORAGE_LES = "storage:les", t.REPO_SCHEDULED_DELETION_DATE = "repo:scheduledDeletionDate", t.REPO_VERSION = "repo:version", t.REPO_STATE = "repo:state", t.REPO_AVAILABLE_REGIONS = "repo:availableRegions", t.REPO_REGIONS = "repo:regions", t.REPO_OWNER = "repo:owner", t.REPO_OWNER_ID = "id", t.REPO_OWNER_TYPE = "type", t.REPO_CONTRIBUTORS = "repo:contributors", t.REPO_MODIFIED_BY_CLIENT_ID = "repo:modifiedByClientId", t.REPO_MODIFIED_BY_CLIENT_AGENT = "repo:modifiedByClientAgent", t.REPO_MODIFIED_BY_IP_ADDRESS = "repo:modifiedByIpAddress", t.STORAGE_ASSIGNEE = "storage:assignee", t.STORAGE_ASSIGNEE_ID = "id", t.STORAGE_ASSIGNEE_TYPE = "type", t.IMAGE_LENGTH = "tiff:imageLength", t.IMAGE_WIDTH = "tiff:imageWidth", t.NUM_OF_PAGES = "xmpTPg:NPages", t.PAGE_START = "start", t.PAGE_ORDER_BY = "orderBy", t.PAGE_NEXT = "next", t.PAGE_COUNT = "count", t.PAGE_LIMIT = "limit";
})(I || (I = {})), function(t) {
  t.REPO_ID = "repo:id", t.CREATED = "created", t.CREATED_BY = "created_by", t.MILESTONE = "milestone", t.VERSION = "version", t.TOTAL_CHILDREN = "total_children";
}(Le || (Le = {})), function(t) {
  t.REPO_ACL = "repo:acl", t.REPO_PRINCIPLE = "repo:principal", t.REPO_MODIFIER = "repo:modifier", t.REPO_PRIVILEGES = "repo:privileges", t.REPO_RELATIONS = "repo:relations", t.REPO_INHERITANCE = "repo:inheritance";
}(Vr || (Vr = {})), function(t) {
  t.XDM_PROVIDER = "xdm:provider", t.ID = "@id", t.TYPE = "@type";
}(Fr || (Fr = {})), function(t) {
  t.ID = "@id";
}(Hr || (Hr = {})), function(t) {
  t.XML = "application/rdf+xml", t.JSON = "application/ld+json";
}(Kt || (Kt = {})), function(t) {
  t.REPO_SIZE = "repo:size", t.REPO_BLOCK_SIZE = "repo:blocksize", t.REPO_REL_TYPE = "repo:reltype", t.COMPONENT_ID = "component_id", t.DC_FORMAT = "dc:format", t.REPO_MD5 = "repo:md5", t.REPO_EXPIRES = "repo:expires", t.REPO_IF_MATCH = "repo:if-match", t.MAX_SINGLE_TRANSFER_SIZE = "repo:maxSingleTransferSize", t.REPO_MIN_BLOCK_TRANSFER_SIZE = "repo:minBlockTransferSize";
}(B || (B = {})), function(t) {
  t.DEVICE_MODIFY_DATE = "deviceModifyDate", t.REPO_META_PATCH = "repoMetaPatch", t.RESPOND_WITH = "respondWith";
}(mt || (mt = {}));
const Gr = x("dcx:assets:service"), U = (t) => Zs(t) ? t.service : t, oe = (t) => Zs(t) ? t.cache : void 0;
function Ge(t, e) {
  Gr("constructServiceEndpoint()", t);
  const s = e._repoAPIBaseUrl;
  return s && (t = `${s.endsWith("/") ? s.substr(0, s.length - 1) : s}${t}`), Gr("cSE()", t), t;
}
const tt = { Directory: "directory" };
var O, R;
(function(t) {
  t.CONTENT_ID = "content-id", t.CONTENT_LENGTH = "content-length", t.CONTENT_RANGE = "content-range", t.CONTENT_TYPE = "content-type", t.IF_MATCH = "if-match", t.IF_NONE_MATCH = "if-none-match", t.AUTHORIZATION = "authorization", t.X_API_KEY = "x-api-key", t.X_CONTRIBUTORS = "x-contributors", t.LES_SEQUENCE_NUMBER = "les-sequence-number", t.PREFER = "prefer", t.DIRECTIVE = "directive";
})(O || (O = {})), function(t) {
  t.GET = "GET", t.PUT = "PUT", t.PATCH = "PATCH", t.HEAD = "HEAD", t.POST = "POST", t.DELETE = "DELETE";
}(R || (R = {}));
const pa = "application/vnd.adobecloud.directory+json", _a = "application/vnd.adobe.dcx-manifest+json", fa = "application/json", Ds = "application/problem+json", at = "application/json-patch+json", vn = "application/vnd.adobecloud.bulk-transfer+json", Ea = "application/vnd.adobe.asset-operation+json", Js = ["buffer", "arraybuffer", "string", "text", "blob", "json", "stream", "defaultbuffer"];
function On(t, e) {
  var s = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (s[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") {
    var n = 0;
    for (r = Object.getOwnPropertySymbols(t); n < r.length; n++) e.indexOf(r[n]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[n]) && (s[r[n]] = t[r[n]]);
  }
  return s;
}
function te(t, e, s, r) {
  return new (s || (s = Promise))(function(n, o) {
    function i(d) {
      try {
        l(r.next(d));
      } catch (u) {
        o(u);
      }
    }
    function a(d) {
      try {
        l(r.throw(d));
      } catch (u) {
        o(u);
      }
    }
    function l(d) {
      var u;
      d.done ? n(d.value) : (u = d.value, u instanceof s ? u : new s(function(p) {
        p(u);
      })).then(i, a);
    }
    l((r = r.apply(t, [])).next());
  });
}
function nt(t) {
  return this instanceof nt ? (this.v = t, this) : new nt(t);
}
function ga(t, e, s) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var r, n = s.apply(t, e || []), o = [];
  return r = {}, i("next"), i("throw"), i("return"), r[Symbol.asyncIterator] = function() {
    return this;
  }, r;
  function i(p) {
    n[p] && (r[p] = function(_) {
      return new Promise(function(f, b) {
        o.push([p, _, f, b]) > 1 || a(p, _);
      });
    });
  }
  function a(p, _) {
    try {
      (f = n[p](_)).value instanceof nt ? Promise.resolve(f.value.v).then(l, d) : u(o[0][2], f);
    } catch (b) {
      u(o[0][3], b);
    }
    var f;
  }
  function l(p) {
    a("next", p);
  }
  function d(p) {
    a("throw", p);
  }
  function u(p, _) {
    p(_), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
const C = (t, e, s) => {
  if (t == null) return Gt;
  const r = {}, n = {}, o = t || [];
  return (i, a) => {
    var l, d;
    if (!i || !a) return new c(T.NETWORK_ERROR, "Invalid or missing status code", void 0, a);
    if (o.includes(i)) return !0;
    const u = n[i] || ((l = $t.get(i)) === null || l === void 0 ? void 0 : l.message) || "Unexpected response", p = r[i] || ((d = $t.get(i)) === null || d === void 0 ? void 0 : d.code), _ = Gt(i, a);
    return _ === !0 && p == null || (ot(_) ? _ : !!p && new c(p, u, void 0, a));
  };
}, V = (t, e = [], s, r) => {
  if (!S(t)) throw new c(s || c.INVALID_PARAMS, r || "Missing or invalid links on Asset");
  e.map((n) => {
    if (!(n in t) || !S(t[n])) throw new c(s || c.INVALID_PARAMS, r || `Missing required link: ${n}`);
  });
}, Rn = (t = {}, e = []) => {
  if (e.length !== 0) {
    for (let s = 0; s < e.length; s++) {
      const r = e[s];
      if (r in t && S(t[r])) return r;
    }
    throw new c(c.INVALID_PARAMS, `Missing links, one required: ${e.join(", ")}`);
  }
}, Pn = (t, e, s, r) => {
  const n = Hs(t, e, s);
  if (!n) throw new c(c.INVALID_DATA, `Missing ${s} param on Link`);
  if (n !== r) throw new c(c.INVALID_DATA, `Invalid ${s} param on Link, expected ${r}`);
}, it = (t, e = []) => {
  try {
    V(t, e);
  } catch {
    return !1;
  }
  return !0;
}, Ta = (t, e = []) => !!S(t) && it(t.links || t._links, e);
function Sn(t) {
  if (!Xs(t)) throw new c(c.INVALID_PARAMS, "Asset must contain links or repositoryId + path or assetId to be resolved.");
}
function Nn(t, e, s) {
  if (!S(t)) throw new c(c.INVALID_PARAMS, `Invalid parameter. Expected object, encountered "${t === null ? "null" : typeof t}".`);
  if (!(e in t)) throw new c(c.INVALID_PARAMS, `Invalid parameter object. Expected object containing key "${String(e)}".`);
  if (s) try {
    $e(e, t[e], s);
  } catch {
    throw new c(c.INVALID_PARAMS, `Invalid parameter object. Expected object containing key "${String(e)}" with type "${s}", encountered type "${typeof t[e]}".`);
  }
}
function Ne(t, e, s) {
  if (!(e.length < 1)) {
    for (const r of e) try {
      return void Nn(t, r, s);
    } catch {
    }
    throw new c(c.INVALID_PARAMS, `Invalid parameter object. Expected object containing one of [${e.join(", ")}]` + (s ? ` with type ${s}, encountered types [${e.map((r) => typeof t[r]).join(", ")}].` : "."));
  }
}
const Ia = x("dcx:assets:util:http");
function Qs(t, e, s) {
  return Ia("headHTTPResource()"), U(t).invoke(R.HEAD, e, s, void 0, { isStatusValid: C() });
}
function Aa(t, e, s, r) {
  return U(t).invoke(R.GET, e, s, void 0, { isStatusValid: C(), responseType: r });
}
const Cn = x("dcx:assets:util:serialization");
function ne(t, e) {
  Cn("deserializeAsset()");
  const s = {};
  s.repositoryId = t.repositoryId || t[I.REPO_REPOSITORY_ID], s.assetId = t.assetId || t[I.REPO_ASSET_ID], s.name = t.name || t[I.REPO_NAME], s.size = t.size != null ? t.size : t[I.REPO_SIZE], s.path = t.path || t[I.REPO_PATH], s.assetClass = t.etag || t[I.REPO_ASSET_CLASS], s.etag = t.etag || t[I.REPO_ETAG], s.version = t.version || t[I.REPO_VERSION], s.format = t.format || t[I.DC_FORMAT], s.md5 = t.md5, s.createDate = t.createDate || t[I.REPO_CREATE_DATE], s.modifyDate = t.modifyDate || t.modifiedDate || t[I.REPO_MODIFY_DATE], s.discardDate = t.discardDate || t[I.REPO_DISCARD_DATE], s.createdBy = t.createdBy || t[I.REPO_CREATED_BY], s.modifiedBy = t.modifiedBy || t[I.REPO_MODIFIED_BY], s.discardedBy = t.discardedBy || t[I.REPO_DISCARDED_BY], s.deviceCreateDate = t.deviceCreateDate || t[I.REPO_DEVICE_CREATE_DATE], s.deviceModifyDate = t.deviceModifyDate || t[I.REPO_DEVICE_MODIFY_DATE], s.defaultScheduledDeletionDuration = t.defaultScheduledDeletionDuration || t[I.REPO_DEFAULT_SCHEDULED_DELETION_DURATION], s.scheduledDeletionDate = t.scheduledDeletionDate || t[I.REPO_SCHEDULED_DELETION_DATE], s.assetType = t.assetType || t[I.REPO_ASSET_TYPE], s.assetSubType = t.assetSubType || t[I.REPO_ASSET_SUB_TYPE], s.les = t.les || t[I.STORAGE_LES], s.baseAssetId = t.baseAssetId || t[I.REPO_BASE_ASSET_ID], s.state = t.state || t[I.REPO_STATE], s.links = t.links || t[I.LINKS], s.representations = t.representations || t[I.REPO_REPRESENTATIONS], s.contributors = t.contributors || t[I.REPO_CONTRIBUTORS], s.width = t.width || t[I.IMAGE_WIDTH], s.length = t.length || t[I.IMAGE_LENGTH];
  const r = [e, t._embedded].flat();
  return s.embedded = Object.entries({ EffectivePrivileges: h.EFFECTIVE_PRIVILAGES, RepositoryResource: h.REPOSITORY, AppMetadata: h.APP_METADATA }).reduce((n, [o, i]) => (r.filter((a) => a && i in a).forEach((a) => ye(n, { [o]: i === h.REPOSITORY ? er(a) : a })), n), {}), M(s);
}
function er(t = {}) {
  Cn("deserializeRepository()");
  const e = t[h.REPOSITORY] ? t[h.REPOSITORY] : t;
  return { repositoryId: e[I.REPO_REPOSITORY_ID], repositoryType: e[I.REPO_REPOSITORY_TYPE], owner: e[I.REPO_OWNER], createDate: e[I.REPO_CREATE_DATE], title: e[I.DC_TITLE], availableRegions: e[I.REPO_AVAILABLE_REGIONS] };
}
function ma(t) {
  const e = [];
  return t.assetType && e.push({ op: "add", path: `/${[I.REPO_ASSET_TYPE]}`, value: t.assetType }), t.assetSubType && e.push({ op: "add", path: `/${[I.REPO_ASSET_SUB_TYPE]}`, value: t.assetSubType }), e;
}
const Dn = x("dcx:assets:util:link");
function kn(t, e) {
  Dn("getIndexLinks()");
  const s = U(t), r = oe(t);
  if (r) {
    const n = r.getIndexLinks();
    if (n) return N.resolve(n);
    r.setPending("INDEX");
  }
  return Qs(s, Ge("/", s), e).then((n) => _e(n)).then((n) => (r && r.setIndexLinks(n), n)).catch((n) => {
    throw r && r.delete("INDEX"), n;
  });
}
function wn(t, e) {
  Dn("getIndexDocument()");
  const s = U(t), r = oe(t);
  if (r) {
    const o = r.getIndexRepository();
    if (o) return N.resolve(o);
  }
  const n = Ge("/", s);
  return s.invoke(R.GET, n, e, void 0, { responseType: "json", isStatusValid: C() }).then((o) => {
    const i = _e(o), a = o.response, l = {};
    for (const d in a.children) {
      const u = a.children[d], p = u[I.LINKS];
      switch (u[I.REPO_PATH]) {
        case "/Index.json":
          l.indexLinks = p;
          break;
        case "/Assets.json":
          l.assetLinks = p;
          break;
        case "/Repositories.json":
          l.repositoryLinks = p;
      }
    }
    return r && (r.setIndexLinks(i), r.setIndexRepository(l)), l;
  });
}
function _e(t) {
  if (!t.headers || !t.headers.link) throw new c(c.INVALID_DATA, "Failed to parse, missing link header");
  return tr(t.headers.link);
}
function tr(t) {
  try {
    const e = jo(t), s = {};
    for (const r in e.refs) {
      const n = e.refs[r], { rel: o, uri: i, templated: a, type: l, width: d, height: u } = n, p = On(n, ["rel", "uri", "templated", "type", "width", "height"]), _ = M({ href: i, templated: a ? a === "true" : void 0, type: l, width: d, height: u, [B.MAX_SINGLE_TRANSFER_SIZE]: p[B.MAX_SINGLE_TRANSFER_SIZE.toLowerCase()], [B.REPO_MIN_BLOCK_TRANSFER_SIZE]: p[B.REPO_MIN_BLOCK_TRANSFER_SIZE.toLowerCase()] });
      ["width", "height"].filter((b) => b in _).forEach((b) => {
        const A = parseInt(_[b], 10);
        isNaN(A) || (_[b] = A);
      });
      const f = s[o];
      Array.isArray(f) ? f.push(_) : s[o] = f ? [f, _] : _;
    }
    return Object.assign({}, s);
  } catch (e) {
    throw new c(c.INVALID_DATA, "Failed to parse, invalid link header", e);
  }
}
function Ce(t, e) {
  if (S(this)) {
    if (typeof this.opsHref == "string") return N.resolve(this.opsHref);
    if (Y(this.opsHref)) return N.resolve(this.opsHref());
  }
  return kn(t, e).then((s) => {
    try {
      return F(s, h.REPO_OPS);
    } catch (r) {
      throw new c(c.UNEXPECTED, "Could not get ops href.", r);
    }
  });
}
const ve = x("dcx:assets:operations"), ze = x("dcx:assets:operations:builder"), Yr = 500;
function ba(t, e, s, r, n, o, i) {
  ve("copyAsset()"), g(["svc", t, "object"], ["srcAsset", e, "object"], ["destAsset", s, "object"], ["createIntermediates", r, "boolean"], ["overwriteExisting", n, "boolean", !0], ["manifestPatch", i, ["object", "string"], !0]), Ne(e, ["repo:path", "path", "assetId", "repo:assetId"], "string"), Ne(s, ["repo:path", "path", "assetId", "repo:assetId"], "string");
  const a = ge("copy", s, e, { overwriteExisting: n, createIntermediates: r }, { "repo:manifestPatch": JSON.stringify(i) }), l = U(t);
  return Ce.call(this, t).then((d) => Be(l, d, a, o)).then(ts.bind(void 0, s)).then(sr);
}
function ya(t, e, s, r, n, o) {
  ve("moveAsset()"), g(["svc", t, "object"], ["srcAsset", e, "object"], ["destAsset", s, "object"], ["createIntermediates", r, "boolean"], ["overwriteExisting", n, "boolean", !0]), Ne(e, ["repo:path", "path", "assetId", "repo:assetId"], "string"), Ne(s, ["repo:path", "path", "assetId", "repo:assetId"], "string");
  const i = ge("move", s, e, { createIntermediates: r, overwriteExisting: n }), a = U(t);
  return Ce.call(this, t).then((l) => Be(a, l, i, o)).then(ts.bind(void 0, s)).then(sr);
}
function va(t, e, s, r, n) {
  ve("discardAsset()"), g(["svc", t, "object"], ["asset", e, "object"], ["etag", s, "string", !0], ["recursive", r, "boolean", !0]);
  const o = U(t);
  Ne(e, ["repo:path", "path", "assetId", "repo:assetId"], "string");
  const i = ge("discard", Object.assign(Object.assign({}, e), { etag: s }), void 0, { recursive: r });
  return Ce.call(this, t).then((a) => Be(o, a, i, n)).then(Zt);
}
const Oa = es("AdobeDCX.deleteAsset", function(t, e, s = "*", r, n) {
  ve("deleteAsset()"), ue("mediaType", e.format), ue("assetId", e.assetId), g(["svc", t, "object"], ["asset", e, "object"], ["etag", s, "string", !0], ["recursive", r, "boolean", !0]);
  const o = U(t);
  if (e.format === pa && r == null) throw new c(c.INVALID_PARAMS, "Recursive flag is required for directory assets.");
  if (!r && Ta(e, [h.REPO_METADATA])) {
    const l = ee(e, h.REPO_METADATA, {});
    return o.invoke("DELETE", l, { [O.IF_MATCH]: s }, void 0, { isStatusValid: C() }).then(Zt);
  }
  Ne(e, ["repo:path", "path", "assetId", "repo:assetId"], "string");
  const i = Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e));
  i.etag = s;
  const a = ge("delete", i, void 0, { recursive: r });
  return Ce.call(this, t).then((l) => Be(o, l, a, n)).then(Zt);
});
function Ra(t, e, s) {
  ve("restoreAsset()"), g(["svc", t, "object"], ["asset", e, "object"]);
  const r = U(t);
  Ne(e, ["assetId", "repo:assetId"], "string");
  const n = ge("restore", e);
  return Ce.call(this, t).then((o) => Be(r, o, n, s)).then(ts.bind(void 0, e)).then(sr);
}
function Pa(t, e, s, r, n, o) {
  var i, a;
  ve("packageAssets()"), g(["svc", t, "object"], ["destination", s, "object"]), $e("sources", e, ["object", "object[]"]), e = pe(e) ? e : [e], i = ["repo:path", "path", "assetId", "repo:assetId"], a = "string", e.map((u) => Ne(u, i, a)), Ne(s, ["repo:path", "path", "assetId", "repo:assetId"], "string");
  const l = ge("package", s, e, { createIntermediates: r, overwriteExisting: n }), d = U(t);
  return Ce.call(this, t).then((u) => Be(d, u, l, o)).then(ts.bind(void 0, s)).then(Zt);
}
function Sa(t, e, s, r) {
  return Ln(t, e, s, r).then(Na);
}
function Na(t) {
  return { result: (pe(t.response) ? t.response : [t.response]).map(Ca), response: t };
}
function Ca(t) {
  if (!t.error) return t;
  const e = Object.assign({}, t), s = C()(t.error.status);
  return e.error = ot(s) ? s : new c(c.UNEXPECTED, "Unexpected response"), e._additionalData = t.error, e.error._message = t.error.title, e;
}
function Be(t, e, s, r) {
  return ve("doOperation()"), g(["svc", t, "object"], ["opsEndpoint", e, "string"], ["operationDocument", s, ["string", "object"]], ["additionalHeaders", r, "object", !0]), Ln(t, e, s, r).then(ao);
}
class Da {
  constructor() {
    this.opBatchLimit = 100, this._docs = [];
  }
  getDocumentEntry(e) {
    return this._docs[e];
  }
  getDocument() {
    return this._docs;
  }
  get entryCount() {
    return this._docs.length;
  }
  copyResources(e, s, r, n, o, i) {
    ze("copyResource()"), this._assertUnderLimit(), this._checkSourceType(e), this._checkTargetType(s);
    const a = this._docs.find(/* @__PURE__ */ function(d, u) {
      return function(p) {
        return p.op === "copy_resources" && zr(p.source, d) && zr(p.target, u);
      };
    }(e, s));
    if (a) return a.resources = a.resources.concat(r), o && (a["repo:manifestPatch"] = JSON.stringify(o)), n !== void 0 && (a.intermediates = n), this;
    const l = ge("copy_resources", s, e, { createIntermediates: n }, { resources: r, "repo:manifestPatch": JSON.stringify(o), additionalHeaders: i });
    return this._docs.push(l), this;
  }
  copy(e, s, r, n, o) {
    ze("copy()"), this._assertUnderLimit(), this._checkSourceType(e), this._checkTargetType(s);
    const i = ge("copy", s, e, { createIntermediates: r, overwriteExisting: n }, o);
    return this._docs.push(i), this;
  }
  move(e, s, r, n, o) {
    ze("move()"), this._assertUnderLimit(), this._checkSourceType(e), this._checkTargetType(s);
    const i = ge("move", s, e, { createIntermediates: r, overwriteExisting: n }, o);
    return this._docs.push(i), this;
  }
  package(e, s, r, n, o) {
    ze("package()"), this._assertUnderLimit(), (e = pe(e) ? e : [e]).map((a) => {
      this._checkSourceType(a);
    }), this._checkTargetType(s);
    const i = ge("package", s, e, { createIntermediates: r, overwriteExisting: n }, o);
    return this._docs.push(i), this;
  }
  discard(e, s, r) {
    ze("discard()"), this._assertUnderLimit(), this._checkTargetType(e);
    const n = ge("discard", e, void 0, { recursive: s }, r);
    return this._docs.push(n), this;
  }
  restore(e, s) {
    ze("restore()"), this._assertUnderLimit(), Ne(e, ["assetId", "repo:assetId"], "string"), this._checkTargetType(e);
    const r = ge("restore", e, void 0, void 0, s);
    return this._docs.push(r), this;
  }
  delete(e, s, r) {
    ze("delete()"), this._assertUnderLimit(), this._checkTargetType(e);
    const n = ge("delete", e, void 0, { recursive: s }, r);
    return this._docs.push(n), this;
  }
  _assertUnderLimit() {
    if (this._docs.length >= this.opBatchLimit) throw new c(c.INVALID_STATE, `Exceeds limit of ${this.opBatchLimit} operations in a single batch.`);
  }
  _checkTargetType(e) {
    this._checkSourceOrTargetType(e, "Target");
  }
  _checkSourceType(e) {
    this._checkSourceOrTargetType(e, "Source");
  }
  _checkSourceOrTargetType(e, s) {
    if ([!!e.assetId || !!e["repo:assetId"], !!e.path || !!e["repo:path"]].filter((o) => o).length === 0) throw new c(c.INVALID_PARAMS, `${s} identifier is underspecified. Exactly one of [href, repo:path, repo:assetId] required.`);
    const r = this._getSourceType(e), n = s === "Source" ? this._batchSourceType : this._batchTargetType;
    if (n) {
      if (r !== n) throw new c(c.INVALID_PARAMS, `Operation ${s.toLowerCase()} types must all be the same type. Expected ${n}, encountered ${r}.`);
    } else s === "Source" ? this._batchSourceType = r : this._batchTargetType = r;
  }
  _getSourceType(e) {
    return e.assetId || e["repo:assetId"] ? "id" : e.path || e["repo:path"] ? e.baseAssetId || e["repo:baseAssetId"] ? "pathAndBaseAssetId" : "path" : void 0;
  }
}
function qr() {
  return new Da();
}
function zr(t, e) {
  var s, r;
  return t[I.REPO_ASSET_ID] === ((s = e[I.REPO_ASSET_ID]) !== null && s !== void 0 ? s : e.assetId) && t[I.REPO_REPOSITORY_ID] === ((r = e[I.REPO_REPOSITORY_ID]) !== null && r !== void 0 ? r : e.repositoryId);
}
function Ln(t, e, s, r = {}) {
  return t.invoke(R.POST, e, Object.assign({ [O.CONTENT_TYPE]: Ea }, r), typeof s == "string" ? s : JSON.stringify(s), { isStatusValid: C(), responseType: "json", retryOptions: { pollCodes: [202], pollHeader: "location", pollMethod: "get", modifyHeadersCallback: yn([O.PREFER]) } });
}
function ts(t, e) {
  return e.response.asset = Object.assign(Object.assign({}, e.response.asset || {}), { repositoryId: t.repositoryId || t["repo:repositoryId"] }), e;
}
function sr(t) {
  return { response: t, result: ne(t.response.asset) };
}
function Zt(t) {
  return { response: t, result: { success: t.statusCode > 199 && t.statusCode < 400 } };
}
function Ts(t, e, s) {
  if (ve("_convertToACPSource()"), typeof e != "object") return;
  const r = { "repo:repositoryId": e.repositoryId || e["repo:repositoryId"], "repo:path": e.path || e["repo:path"], "repo:assetId": e.assetId || e["repo:assetId"], "repo:baseAssetId": e.baseAssetId || e["repo:baseAssetId"] };
  return typeof r.href == "string" ? (delete r["repo:path"], delete r["repo:assetId"], delete r["repo:baseAssetId"]) : typeof r["repo:assetId"] == "string" && (delete r["repo:path"], delete r["repo:baseAssetId"]), t === "target" ? s === !0 ? r[O.IF_MATCH] = e.format !== tt.Directory && e["dc:format"] !== tt.Directory && e.etag || "*" : s === !1 ? r[O.IF_NONE_MATCH] = "*" : e.format !== tt.Directory && e["dc:format"] !== tt.Directory && (r[O.IF_MATCH] = e.etag) : e.format !== tt.Directory && e["dc:format"] !== tt.Directory && (r[O.IF_MATCH] = e.etag || "*"), e.version && (r["repo:version"] = e.version), r["repo:path"] && Nn(r, "repo:repositoryId", "string"), ve("_cTACPS() out", r), M(r);
}
function ge(t, e, s, r = {}, n = {}) {
  ve("_buildOperationDoc()");
  const o = M({ op: t, target: e, source: pe(s) ? [] : s ? {} : void 0 }), { overwriteExisting: i, createIntermediates: a, recursive: l } = r;
  if (o.source && (o.source = pe(s) ? s.map((d) => Ts("source", d, i)).filter((d) => d != null) : Ts("source", s, i)), typeof e == "object") {
    const d = Ts("target", e, i);
    d && (o.target = d);
  }
  return o.target["repo:assetId"] == null && a != null && (o.intermediates = a), l != null && (o.recursive = l), Object.assign(o, n), ve("_OD() doc", o), o;
}
function ka(t, e, s, r, n, o, i) {
  if (g(["resources", r, "array", !1]), r.length <= Yr) {
    const a = qr().copyResources(e, s, r, n, o).getDocument();
    return Ce(t).then((l) => Be(U(t), l, a, i)).then((l) => {
      const { asset: d, source: u, target: p, resources: _ } = l.response[0];
      return { result: { source: ne(u), target: ne(p), resources: _, asset: d ? ne(d) : void 0 }, response: l };
    });
  }
  return function(a, l, d, u, p, _, f, b) {
    g(["resources", u, "array", !1]);
    const A = [];
    for (let m = 0; m < u.length; m += p) A.push(u.slice(m, m + p));
    let v;
    function y(m, D) {
      const k = qr().copyResources(l, d, D, _, f).getDocument();
      return Ce(a).then((j) => Be(U(a), j, k, b)).then((j) => {
        v ? v.response[0].resources.push(...j.response[0].resources) : v = j;
        const { asset: X, source: H, target: me, resources: De } = j.response[0], Z = { source: ne(H), target: ne(me), resources: De, asset: X ? ne(X) : void 0 };
        return Object.assign(Object.assign({}, Z), { resources: [...m?.resources, ...Z.resources], asset: Z.asset || m.asset });
      });
    }
    let P = N.resolve({ resources: [], source: {}, target: {} });
    for (const m of A) P = P.then((D) => y(D, m));
    return P.then((m) => {
      if (!v) throw new c(c.UNEXPECTED_RESPONSE, "No response received from copy resources operation");
      return { result: m, response: v };
    });
  }(t, e, s, r, Yr, n, o, i);
}
var E;
(function(t) {
  t.NOT_INITIALIZED = "NOT_INITIALIZED", t.INITIALIZING = "INITIALIZING", t.INITIALIZED = "INITIALIZED", t.WAITING = "WAITING", t.STARTED = "STARTED", t.PAUSING = "PAUSING", t.PAUSED = "PAUSED", t.CANCELED = "CANCELED", t.ERROR = "ERROR", t.FINALIZING = "FINALIZING", t.COMPLETE = "COMPLETE";
})(E || (E = {}));
const ae = new class {
  constructor() {
    this._uploads = [], this._downloads = [], this._pendingUploadRequests = [], this._pendingDownloadRequests = [], this._downloadChunkSize = 10485760;
  }
  get downloads() {
    return this._downloads;
  }
  get uploads() {
    return this._uploads;
  }
  set downloadChunkSize(t) {
    g(["downloadChunkSize", t, "+number"]), this._downloadChunkSize = t;
  }
  get downloadChunkSize() {
    return this._downloadChunkSize;
  }
  get pendingUploadRequests() {
    return this._pendingUploadRequests;
  }
  get pendingDownloadRequests() {
    return this._pendingDownloadRequests;
  }
  resetUploads() {
    this._uploads = [], this._pendingUploadRequests = [];
  }
  addAndStartUpload(t) {
    return this._addAndStart("upload", t);
  }
  addAndStartDownload(t) {
    return t.state !== E.INITIALIZED ? Promise.resolve(t) : this._addAndStart("download", t);
  }
  startNextWaiting(t) {
    const e = t === "upload" ? this._uploads : this._downloads, s = [];
    let r = !1;
    for (const o of e) !r && o && o.state === E.WAITING ? (o.start(), r = !0) : o.state !== E.CANCELED && o.state !== E.ERROR && o.state !== E.FINALIZING && o.state !== E.COMPLETE || s.push(o);
    const n = e.filter((o) => !s.includes(o));
    t === "download" ? this._downloads = n : this._uploads = n;
  }
  _addAndStart(t, e) {
    const s = t === "upload" ? this._uploads : this._downloads;
    return s.filter((r) => r && (r.state === E.NOT_INITIALIZED || r.state === E.INITIALIZED || r.state === E.INITIALIZING || r.state === E.STARTED)).length === 0 ? e.start() : e._setWaiting(), s.push(e), e.promise;
  }
}(), $ = x("dcx:assets:blockdownload"), wa = x("dcx:assets:blockdownload:leaf"), La = function* () {
  let t = 0;
  for (; ; ) yield t++;
}();
class Ma extends Vs {
  constructor(e, s, r = {}) {
    super(["stateChanged"]), this._state = E.NOT_INITIALIZED, this._cachedBlocks = /* @__PURE__ */ new Map(), this._blockRequestIndex = 0, this._blockHandledIndex = 0, this._currentByteRange = [void 0, void 0], this._pending = [], $("constructor");
    const { startByte: n, blockSize: o, endByte: i, url: a, totalSize: l, maxConcurrentRequests: d } = Object.assign({ blockSize: ae.downloadChunkSize, maxConcurrentRequests: 4 }, M(r));
    g(["svc", e, "object"], ["responseType", s, "enum", !1, ["buffer"]], ["blockSize", o, "+number"], ["url", a, "string", !0], ["startByte", n, "number", !0], ["endByte", i, "number", !0], ["totalSize", l, "number", !0], ["maxConcurrentRequests", d, "+number"]), this._dbgId = La.next().value, this._maxConcurrentRequests = d, this._blockSize = Math.round(o), this._service = e, this._url = a, this._startByte = n, this._endByte = i, this._totalSize = l, this._bytes = new Uint8Array(), this._promise = new N((u, p) => {
      this._resolve = () => {
        $(this._dbgId, "resolving"), this.removeAllHandlers(), u(this);
      }, this._reject = (_) => {
        $(this._dbgId, "rejecting: ", _), this.removeAllHandlers(), p(_);
      };
    });
  }
  get contentType() {
    var e;
    return (e = this._contentType) !== null && e !== void 0 ? e : "";
  }
  get totalSize() {
    return this._totalSize;
  }
  get buffer() {
    return this._bytes;
  }
  get state() {
    return this._state;
  }
  get promise() {
    return this._promise;
  }
  _requestBlock(e, s, r, n) {
    $(this._dbgId, "_requestBlock(): ", e, s, r, n);
    const o = Mn(e, s);
    return this._service.invoke(R.GET, this._url, o, void 0, { responseType: "defaultbuffer", isStatusValid: C(), isExternalRequest: !0 }).then((i) => ({ response: i, index: r, lane: n })).catch(this._handleErrorAndThrow.bind(this));
  }
  init(e = this._url, s = this._totalSize) {
    if ($(this._dbgId, "init(): ", e, s), this._state === E.INITIALIZED && e === this._url && s === this._totalSize) return N.resolve(this);
    if (this._assertStateIsValid("init"), this._shiftState(E.INITIALIZING), this._url = e, this._initByteRange(s), this._totalSize !== 1 / 0 || this._currentByteRange[0] == null) return this._shiftState(E.INITIALIZED), N.resolve(this);
    const { startByte: r, endByte: n, blockIndex: o } = this._nextBlockData();
    let i = E.INITIALIZED;
    return this._requestBlock(r, n, o, 0).then((a) => (this._updateTotalSize(a), (!n || n > this._endByte) && (i = E.FINALIZING), a)).then(this._handleBlock.bind(this)).then(() => this._shiftState(i)).catch(this._handleErrorAndThrow.bind(this));
  }
  start() {
    if ($(this._dbgId, "start()"), this._assertStateIsValid("start"), this._shiftState(E.STARTED), this._currentByteRange[0] != null) return this._start(), this._promise;
    const [e, s] = this._currentByteRange, r = this._blockRequestIndex;
    return this._blockRequestIndex += 1, this._currentByteRange = [s + 1, s], this._requestBlock(e, s, r, 0).then(this._handleBlock.bind(this)).catch(this._handleError.bind(this)), this._promise;
  }
  pause() {
    return $(this._dbgId, "pause()"), this._assertStateIsValid("pause"), this._shiftState(E.PAUSING), N.allSettled(this._pending).then(() => (this._shiftState(E.PAUSED), ae.startNextWaiting("download"), this));
  }
  resume() {
    return $(this._dbgId, "resume()"), this.state === E.PAUSED && (this._shiftState(E.STARTED), this._start()), this;
  }
  cancel() {
    return $(this._dbgId, "cancel()"), this._assertStateIsValid("cancel"), this._shiftState(E.CANCELED), this._reject(new c(c.ABORTED, "BlockDownload aborted.")), ae.startNextWaiting("download"), this._promise;
  }
  _setWaiting() {
    this._shiftState(E.WAITING);
  }
  _start() {
    $(this._dbgId, "_start()");
    for (let e = 0; e < this._maxConcurrentRequests; e++) this._loop(e).catch(this._handleError.bind(this));
  }
  get _loopShouldContinue() {
    const e = this._state === E.STARTED && this._currentByteRange[0] <= this._endByte;
    return $(this._dbgId, "_loopShouldContinue() ", e, this._currentByteRange, this._endByte), e;
  }
  _loop(e) {
    return te(this, void 0, void 0, function* () {
      $(this._dbgId, "_loop(): ", e);
      let s = !1;
      for (; this._loopShouldContinue && !s; ) {
        const { startByte: r, endByte: n, blockIndex: o, done: i } = this._nextBlockData();
        s = i;
        const a = this._requestBlock(r, n, o, e).then(this._handleBlock.bind(this)).catch(this._handleError.bind(this));
        this._pending[e] = a, yield a;
      }
      $(this._dbgId, `_loop(${e}) done, ${s}`), s && ($(this._dbgId, `_loop(${e}) finalize`), this._shiftState(E.FINALIZING));
    });
  }
  _nextBlockData() {
    $(this._dbgId, "_nextBlockData()");
    const e = this._blockRequestIndex;
    this._blockRequestIndex += 1;
    const [s, r] = this._currentByteRange;
    return this._currentByteRange[0] += this._blockSize, this._currentByteRange[1] = Math.min(this._currentByteRange[1] + this._blockSize, this._endByte), { startByte: s, endByte: r, blockIndex: e, done: r >= this._endByte };
  }
  _initByteRange(e = this._totalSize) {
    if ($(this._dbgId, "_initByteRange(): ", e), this._totalSize = e, this._totalSize != null && this._totalSize < 0) throw new c(c.INVALID_PARAMS, "Total size must be positive.");
    if (this._totalSize || (this._totalSize = 1 / 0), this._endByte || (this._endByte = this._totalSize), !this._startByte && this._endByte === this._totalSize) return this._startByte = 0, void (this._currentByteRange = [0, this._blockSize - 1]);
    if (!this._startByte && this._endByte < 0 && this._totalSize !== 1 / 0 ? (this._startByte = Math.max(0, this._totalSize + this._endByte), this._endByte = this._totalSize) : !this._startByte && this._endByte > 0 && (this._startByte = 0), this._startByte != null && (this._currentByteRange[0] = Math.max(this._startByte, 0)), (this._endByte == null || this._endByte > 0) && (this._currentByteRange[1] = Math.min(this._endByte, (this._startByte || 0) + this._blockSize - 1)), this._startByte != null || this._endByte === 1 / 0) return;
    if (this._totalSize === 1 / 0) {
      if (-this._endByte > this._blockSize) throw new c(c.INVALID_PARAMS, "Cannot download last N bytes without a total size.");
      return void (this._currentByteRange = [void 0, this._endByte]);
    }
    this._startByte = Math.max(0, this._totalSize + this._endByte), this._endByte = this._totalSize;
    const s = Math.min(this._startByte + this._blockSize - 1, this._endByte);
    this._currentByteRange = [this._startByte, s];
  }
  _finalize() {
    return $(this._dbgId, "_finalize() start"), ae.startNextWaiting("download"), N.allSettled(this._pending).then(() => {
      this._checkCachedBlocks(), this._shiftState(E.COMPLETE);
    });
  }
  _updateTotalSize(e) {
    if ($(this._dbgId, "_updateTotalSize()"), this._totalSize == null || this._totalSize === 1 / 0) try {
      const s = e.response.headers["content-range"], r = parseInt(s.split("/")[1]);
      dn(() => !isNaN(r), "Invalid number."), this._totalSize = r, this._endByte === 1 / 0 && (this._endByte = this._totalSize);
    } catch (s) {
      throw new c(c.INVALID_DATA, "Could not determine total size.", s, e.response);
    }
    return $(this._dbgId, "_uTS(): ", this._totalSize, this._endByte), e;
  }
  _handleError(e) {
    $(this._dbgId, "_handleError(): ", e), this._shiftState(E.ERROR), this._error = e, ot(e) || (this._error = new c(c.UNEXPECTED, "An unexpected error occurred.", e)), this._reject(this._error);
  }
  _handleErrorAndThrow(e) {
    throw this._handleError(e), this._error;
  }
  _handleBlock(e) {
    this._endByte === 1 / 0 && this._updateTotalSize(e);
    const { index: s, response: r } = e;
    if ($(this._dbgId, `_handleBlock(${s})`), s !== this._blockHandledIndex) return $(this._dbgId, `_handleBlock(${s}) cached`), void this._cachedBlocks.set(s, e);
    $(this._dbgId, `_handleBlock(${s}) handled`), this._pushBlockData(r), this._markCurrentBlockHandled();
  }
  _markCurrentBlockHandled() {
    this._cachedBlocks.delete(this._blockHandledIndex), this._blockHandledIndex += 1, this._checkCachedBlocks();
  }
  _checkCachedBlocks() {
    const e = this._cachedBlocks.get(this._blockHandledIndex);
    e && this._handleBlock(e);
  }
  _pushBlockData(e) {
    if (this._state === E.ERROR) return;
    this._contentType = this._contentType || e.headers[O.CONTENT_TYPE];
    const s = typeof Buffer < "u" && e.response instanceof Buffer ? e.response : new Uint8Array(e.response);
    this._bytes = we(this._bytes, s);
  }
  _shiftState(e) {
    return $(this._dbgId, "_shiftState(): ", e), this._state === E.COMPLETE || this._state === E.ERROR || this._state === E.CANCELED || (this._state = e, this.emit("stateChanged", [this._state, this]), e === E.FINALIZING && this._finalize(), e === E.COMPLETE && Promise.all(this._pending).then(this._resolve.bind(this))), this;
  }
  _assertStateIsValid(e, s = this._state) {
    $(this._dbgId, "_assertStateIsValid() ", e, s);
    let r = !1;
    const n = "Invalid state transition.";
    switch (e) {
      case "init":
        s === E.NOT_INITIALIZED && (r = !0);
        break;
      case "start":
        s !== E.INITIALIZED && s !== E.WAITING && s !== E.STARTED || (r = !0);
        break;
      case "pause":
        s !== E.INITIALIZING && s !== E.STARTED || (r = !0);
        break;
      case "cancel":
        r = !0;
    }
    if (!r) throw $(this._dbgId, "_aSIV() throw ", n), new c(c.INVALID_STATE, n, void 0, void 0, { method: e, currentState: s });
  }
}
function xa(t, e, s) {
  return new Ma(t, e, s);
}
function Je(t, e, s, r, n = "defaultbuffer", o, i, a) {
  wa("_doBlockDownload()");
  const l = n === "stream" ? void 0 : xa(t, "buffer", { startByte: s, endByte: r });
  (this != null ? this : {}).blockDownload = l;
  let d = N.resolve(e, this !== void 0 ? this : {});
  return o || (d = d.then(() => t.invoke(R.GET, e, Object.assign({ priority: "u=1" }, a), void 0, { responseType: "text", isStatusValid: C(), retryOptions: { pollCodes: [202], pollHeader: "location", pollMethod: "GET" } })).then((u) => {
    const p = u.response.indexOf("href") > 0 ? Rr(u.response, '"href":\\s*"([^;"]*)"') : "";
    if (typeof p != "string" || p === "") throw new c(c.UNEXPECTED_RESPONSE, "No block download href found in response.", void 0, u);
    return i = i || parseInt(Rr(u.response, '"size":\\s*(\\d+)')), p;
  })), d.then((u) => te(this, void 0, void 0, function* () {
    return l ? Promise.race([l.init(u, i).then(() => ae.addAndStartDownload(l)), l.promise]).then(() => ({ statusCode: 200, headers: M({ [O.CONTENT_TYPE]: l.contentType, [O.CONTENT_LENGTH]: l.totalSize }), responseType: n, response: Ua(l.buffer, n, l.contentType), message: "OK" })) : t.invoke(R.GET, u, Mn(s, r), void 0, { responseType: "stream", isExternalRequest: !0 });
  }));
}
function Ua(t, e, s) {
  if (e === "defaultbuffer" || e === "buffer" || e === "arraybuffer") return t.buffer;
  if (e === "blob") return new Blob([t], { type: s });
  const r = Ae(t);
  if (e === "text") return r;
  try {
    return JSON.parse(r);
  } catch {
    return r;
  }
}
function Mn(t, e) {
  return t == null && e == null ? {} : { range: `bytes=${t ?? (e != null && e > 0 ? "0" : "")}-${e != null ? Math.abs(e) : ""}` };
}
const Ft = x("dcx:assets:private");
function rr(t, e, s, r, n = "defaultbuffer", o, i, a = {}, l = !1) {
  let d;
  Ft("_getUrlFallbackDirect()");
  const u = this !== void 0 ? this : {};
  return N.resolve(void 0, u).then(() => t.invoke(R.GET, s, Object.assign({ priority: "u=1" }, a), void 0, { responseType: n, isStatusValid: C([400]) })).then((p) => (Ft("_gUFD() status code", p.statusCode), d = p, p.statusCode === 400 && p.xhr ? p.xhr.getResponseDataAsJSON() : p)).then((p) => {
    const _ = S(p) && (d.statusCode === 400 || p.status === 400) && p.type === K.RESPONSE_TOO_LARGE;
    if (Ft("_gUFD() do direct", _), !_ && d.statusCode === 400) throw new c(c.UNEXPECTED_RESPONSE, "Unexpected response", void 0, d);
    return _;
  }).then((p) => {
    if (!p) return d;
    if (!("location" in d.headers) || typeof d.headers.location != "string") {
      if (!it(e.links, [h.BLOCK_DOWNLOAD])) throw new c(c.INVALID_DATA, "Resource too large and missing download link.");
      const _ = M({ reltype: r, component_id: o, revision: i }), f = ee(e.links, h.BLOCK_DOWNLOAD, { resource: r ? JSON.stringify(_) : void 0 });
      return l ? { statusCode: 200, headers: M({ [O.CONTENT_TYPE]: d.headers["content-type"], [O.CONTENT_LENGTH]: d.headers["content-length"] }), responseType: n, response: { href: f }, message: "OK" } : Je.call(u, t, f, void 0, void 0, n, !1, void 0, a);
    }
    return l ? { statusCode: 200, headers: M({ [O.CONTENT_TYPE]: d.headers["content-type"], [O.CONTENT_LENGTH]: d.headers["content-length"] }), responseType: n, response: { href: d.headers.location }, message: "OK" } : Je.call(u, t, d.headers.location, void 0, void 0, n, !0, void 0, a);
  });
}
function Ht({ additionalHeaders: t = {}, asset: e, contentType: s, data: r, etag: n, headHref: o, href: i, maybeIsNew: a, relation: l, service: d }, u = !1) {
  if (Ft("_doUpload()"), g(["service", d, "object"], ["asset", e, "object"], ["href", i, "string"], ["headHref", o, "string"], ["contentType", s, "string", !0], ["maybeIsNew", a, "boolean", !0], ["etag", n, "string", !0], ["isRetry", u, "boolean", !0], ["additionalHeaders", t, "object", !0]), a == null) return d.invoke(R.HEAD, o, t, void 0, { isStatusValid: C([404]) }).then((_) => {
    const f = _.statusCode !== 200;
    return Ht({ additionalHeaders: t, asset: e, contentType: s, data: r, etag: n, headHref: o, href: i, maybeIsNew: f, relation: l, service: d }, u);
  });
  const p = a;
  return p ? delete t[O.IF_MATCH] : t[O.IF_MATCH] = n || "*", s && (t[O.CONTENT_TYPE] = s), d.invoke(R.PUT, i, t, r, { isStatusValid: C([404, 409, 412]), retryOptions: { pollHeader: "location", pollCodes: [202] } }).then((_) => {
    const f = _.statusCode;
    if (f > 400 && !u) {
      if (n != null) throw C()(f, _);
      if (!p && f === 404) return Ht({ additionalHeaders: t, asset: e, contentType: s, data: r, etag: n, headHref: o, href: i, maybeIsNew: !0, relation: l, service: d }, !0);
      if (f === 404) throw new c(c.NOT_FOUND, "Unexpected response", void 0, _);
      if (f === 409 || f === 412) return Ht({ additionalHeaders: t, asset: e, contentType: s, data: r, etag: n, headHref: o, href: i, maybeIsNew: void 0, relation: l, service: d }, !0);
    }
    return _;
  });
}
const Ba = x("dcx:assets:bulk");
function ja(t, e) {
  let r = Uint8Array.from([]);
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    r = we(r, Ee(n === 0 ? `--${e}\r
` : `\r
--${e}\r
`)), r = we(r, Ee(`${[O.CONTENT_TYPE]}: application/http\r
`)), r = we(r, Ee(`\r
${o.method} ${o.href}`));
    let i = !1;
    for (const a in o.headers) {
      const l = a.toLowerCase();
      l === "content-length" && (i = !0), r = we(r, Ee(`\r
${l}: ${o.headers[a]}`));
    }
    if (o.body) {
      const a = Va(o.body);
      i || (r = we(r, Ee(`\r
content-length: ${a.length}`))), r = we(r, Ee(`\r
\r
`)), r = we(r, a);
    }
  }
  return r = we(r, Ee(`\r
--${e}--\r
`)), r;
}
function Va(t) {
  if (typeof t == "string") return Ee(t);
  if (fo(t)) return new Uint8Array(t);
  if (bn(t)) return t;
  throw new c(c.INVALID_PARAMS, "Bulk subrequest body expecting string | ArrayBuffer | Buffer");
}
function nr(t, e) {
  const s = t.headers[O.CONTENT_TYPE];
  if (!s) throw new c(c.UNEXPECTED_RESPONSE, "Missing boundary header in multipart response");
  const r = s.split("=")[1], n = function(o, i) {
    const a = new Uint8Array(o), l = Ee(`--${i}`);
    return xn(a, ks(a, l), l.byteLength).map((u) => ss(u, !0));
  }(t.response, r);
  if (e && n.length !== e) throw new c(c.UNEXPECTED_RESPONSE, `Unexpected number of parts; Expected ${e}, Received ${n.length}`);
  return n;
}
function ks(t, e) {
  const s = new Array(256).fill(-1), r = [];
  for (let o = 0; o < e.length; o++) s[e[o]] = o;
  let n = 0;
  for (; n <= t.length - e.length; ) {
    let o = e.length - 1;
    for (; o >= 0 && e[o] === t[n + o]; ) o--;
    o < 0 ? (r.push(n), n += n + e.length < t.length ? e.length - s[t[n + e.length]] : 1) : n += Math.max(1, o - s[t[n + o]]);
  }
  return r;
}
function xn(t, e, s, r = !1) {
  let n = r ? 0 : void 0;
  const o = [];
  for (const i of e) n !== void 0 && o.push(t.subarray(n, i)), n = i + s;
  return r && o.push(t.subarray(n)), o;
}
function ss(t, e = !1) {
  const s = Ee(`\r
\r
`), r = ks(t, s).slice(0, 2), n = Ee(`

`), o = xn(t, ...r.length > 0 ? [r, s.byteLength] : [ks(t, n).slice(0, 2), n.byteLength], !0), i = o.slice(0, e || o.length > 1 ? 2 : 1).reduce((p, _) => Object.assign(p, Fs(Ae(_))), {}), a = o.length > 1 ? o[o.length - 1] : void 0, l = parseInt(Ae(o[e ? 1 : 0]).split(`\r
`, 1)[0].split(" ")[1]), d = parseInt(i["content-length"], 10);
  let u;
  return u = isNaN(d) ? a?.length === 0 ? new Uint8Array([]) : a : d === 0 ? new Uint8Array([]) : a?.subarray(0, d), { headers: i, response: i[O.CONTENT_TYPE] === Ds && u !== void 0 ? JSON.parse(Ae(u)) : u, statusCode: l };
}
function Fa(t) {
  if (t.length > 10) throw new c(c.INVALID_PARAMS, "A single bulk request can only contain a maximum of 10 sub-requests.");
  const { writeOperations: e, readOperations: s } = t.reduce((r, n) => {
    if (typeof n.href != "string") throw new c(c.INVALID_PARAMS, "A sub-request of the bulk operation is missing an href");
    if (typeof n.method != "string") throw new c(c.INVALID_PARAMS, "A sub-request of the bulk operation is missing the HTTP method");
    const o = n.method.toUpperCase();
    if (!Object.values(R).includes(o)) throw new c(c.INVALID_PARAMS, "A sub-request of the bulk operation includes an invalid HTTP method");
    return [R.GET, R.HEAD].includes(o) ? r.readOperations.push(n) : r.writeOperations.push(n), r;
  }, { readOperations: [], writeOperations: [] });
  if (e.length > 0 && s.length > 0) throw new c(c.INVALID_PARAMS, "Cannot mix READ and WRITE operations in bulk sub requests.");
}
function or(t, e, s, r = "id", n = {}, o = !1) {
  return Ba("performBulkRequest()"), g(["svc", t, "object"], ["asset", e, "object"], ["requests", s, "array"], ["linkMode", r, "string", !0, ["id", "path"]]), V(e.links, [h.BULK_REQUEST]), Fa(s), Un(t, e, s, r, n).then(({ response: i, subresponses: a }) => te(this, void 0, void 0, function* () {
    const l = Bn(a, s);
    return { result: o ? yield jn(t, e, l, r, n, a) : a, response: i };
  }));
}
function Un(t, e, s, r = "id", n = {}) {
  const o = `boundary-${Date.now()}`, i = ja(s, o), a = Object.assign(Object.assign({}, n), { [O.CONTENT_TYPE]: `multipart/mixed;boundary=${o}` }), l = F(e.links, h.BULK_REQUEST, r);
  return t.invoke(R.POST, l, a, i, { isStatusValid: C(), responseType: "defaultbuffer", retryOptions: { pollHeader: "location", pollCodes: [202], pollMethod: R.GET } }).then((d) => ({ response: d, subresponses: nr(d, s.length) }));
}
function Bn(t, e) {
  return t.filter(({ statusCode: s }) => Et(s)).map((s) => e.find(({ href: r }) => r === s.headers["content-id"])).filter((s) => s);
}
function jn(t, e, s, r = "id", n = {}, o, i = 5) {
  return te(this, void 0, void 0, function* () {
    if (s.length === 0 || i <= 0) return o;
    if (s.length === 1) {
      const [l] = s, d = yield U(t).invoke(l.method, l.href, l.headers, l.body, { isStatusValid: C(), responseType: "defaultbuffer", retryOptions: { pollHeader: "location", pollCodes: [202], pollMethod: R.GET } });
      return d.headers["content-id"] = l.href, o.map((u) => "content-id" in u.headers && u.headers["content-id"] === d.headers["content-id"] ? d : u);
    }
    const a = yield Un(t, e, s, r, n).then((l) => te(this, void 0, void 0, function* () {
      const d = Bn(l.subresponses, s);
      return d.length ? yield jn(t, e, d, r, n, l.subresponses, i - 1) : l.subresponses;
    }));
    return o.map((l) => a.find((d) => d.headers["content-id"] === l.headers["content-id"]) || l);
  });
}
const Nt = x("dcx:assets:asset"), G = x("dcx:assets:asset:leaf");
function Ha(t, e, s, r) {
  Nt("getPrimaryResource()"), g(["svc", t, "object"], ["asset", e, "object"], ["responseType", s, "enum", !0, Js]), V(e.links, [h.PRIMARY]);
  const n = F(e.links, h.PRIMARY);
  return rr.call({}, t, e, n, h.PRIMARY, s, void 0, void 0, r);
}
function $a(t, e, s) {
  Nt("headPrimaryResource()"), g(["svc", t, "object"], ["asset", e, "object"]), V(e.links, [h.PRIMARY]);
  const r = F(e.links, h.PRIMARY);
  return U(t).invoke(R.HEAD, r, s, void 0, { isStatusValid: C() }).then((n) => {
    const o = _e(n);
    e.links = ye(e.links || {}, o);
    const i = oe(t);
    return i && i.setValueWithAsset(e.links || {}, e), n;
  });
}
const Ga = "/content/directory/resolve{?repositoryId,id,resource,mode}", Ya = "/content/directory/resolve{?repositoryId,path,resource,mode}";
function qa(t, e, s = "id", r, n) {
  G("getResolveLinkForAsset()"), g(["svc", t, "object"], ["asset", e, "object"], ["mode", s, "enum", !1, ["id", "path"]], ["resource", r, ["string", "object"], !0]), Sn(e);
  const o = { repositoryId: e.repositoryId, id: e.assetId, path: e.path, mode: s, resource: S(r) ? JSON.stringify(r) : r }, i = U(t), a = Ge(e.assetId ? Ga : Ya, i);
  return N.resolve(je(a, M(o)));
}
const za = "/content/create/~/:create{?path,mode,intermediates,respondWith,repoMetaPatch*}", Wa = "/content/create/~/:block_upload";
function ir(t, e, s = "id", r, n, o) {
  G("resolveAsset()"), g(["svc", t, "object"], ["asset", e, "object"], ["mode", s, "enum", !0, ["id", "path"]], ["resource", r, ["string", "object"], !0]), Sn(e);
  const i = U(t), a = oe(t), l = a && e.assetId && e.repositoryId && s === "id";
  return l && (G("rA() set pending"), a.setPending(e.assetId, e.repositoryId)), qa(t, e, s, r).then((d) => r == null ? Qs(i, d, o) : Aa(i, d, o, n)).then((d) => ({ response: d, result: Hn(e, d, s === "id", a) })).catch((d) => {
    throw l && a.deleteWithAsset(e), d;
  });
}
function Ka(t, e, s) {
  return G("fetchLinksForAsset()"), Vn(t, e, s).then((r) => r.result.links);
}
function Vn(t, e, s) {
  if (G("fetchAsset()"), g(["svc", t, "object"], ["asset", e, "object"]), Xs(e)) return ir(t, e, "id", void 0, void 0, s).then((a) => a);
  let r;
  try {
    r = Rn(e.links, [h.ID, h.REPO_METADATA, h.PRIMARY, h.PATH]);
  } catch (a) {
    throw new c(c.INVALID_PARAMS, "Asset is not resolvable. Must contain repositoryId & path, assetId, or links.", a);
  }
  const n = F(e.links, r), o = U(t), i = oe(t);
  return o.invoke(R.HEAD, n, s, void 0, { isStatusValid: C() }).then((a) => ({ result: Hn(e, a, r === h.ID, i), response: a }));
}
function Xa(t, e, s) {
  G("getLinksForAsset()"), g(["svc", t, "object"], ["asset", e, "object"]);
  const r = e.links || e[I.LINKS];
  if (S(r) && Object.keys(r).length !== 0) return N.resolve(r);
  const n = oe(t);
  if (n) {
    const o = n.getValueWithAsset(e);
    if (o) return N.resolve(o);
  }
  return Ka(t, e, s);
}
function Za(t, e, s) {
  G("updateRepoMetadata()"), g(["svc", t, "object"], ["asset", e, "object"]), V(e.links, [h.REPO_METADATA]);
  const r = F(e.links, h.REPO_METADATA), n = Object.assign({ [O.CONTENT_TYPE]: at }, s), o = ma(e);
  return t.invoke(R.PATCH, r, n, JSON.stringify(o), { responseType: "json", isStatusValid: C() }).then((i) => ({ result: i.response, response: i }));
}
function Ja(t, e, s) {
  G("getRepositoryResource()"), g(["svc", t, "object"], ["asset", e, "object"]), V(e.links, [h.REPOSITORY]);
  const r = F(e.links, h.REPOSITORY);
  return t.invoke(R.GET, r, s, void 0, { responseType: "json", isStatusValid: C() }).then((n) => ({ result: n.response, response: n }));
}
function Qa(t, e, s) {
  Nt("headAppMetadata()"), g(["svc", t, "object"], ["asset", e, "object"]), V(e.links, [h.APP_METADATA]);
  const r = F(e.links, h.APP_METADATA);
  return U(t).invoke(R.HEAD, r, s, void 0, { isStatusValid: C() }).then((n) => {
    const o = _e(n);
    e.links = ye(e.links || {}, o);
    const i = oe(t);
    return i && i.setValueWithAsset(e.links, e), n;
  });
}
function ec(t, e, s, r = {}) {
  G("getAppMetadata()"), g(["svc", t, "object"], ["asset", e, "object"], ["etag", s, "string", !0]);
  const n = F(e.links, h.APP_METADATA), o = Object.assign({}, r);
  return s && (o[O.IF_NONE_MATCH] = s), t.invoke(R.GET, n, o, void 0, { responseType: "json", isStatusValid: C([304]) }).then((i) => {
    let a = i.response, l = i.headers.etag;
    return i.statusCode === 304 && (a = null, l = s), { result: a, response: i, etag: l };
  });
}
function tc(t, e, s, r, n = {}) {
  G("putAppMetadata()"), g(["svc", t, "object"], ["asset", e, "object"], ["metadata", s, ["object", "string"]], ["etag", r, "string", !0]), V(e.links, [h.APP_METADATA]);
  const o = F(e.links, h.APP_METADATA);
  return t.invoke(R.PUT, o, M(Object.assign(n, { [O.IF_MATCH]: r, [O.CONTENT_TYPE]: fa })), typeof s == "string" ? s : JSON.stringify(s), { isStatusValid: C() }).then((i) => ({ response: i, result: { etag: i.headers.etag } }));
}
function sc(t, e, s, r, n = {}) {
  G("patchAppMetadata()"), g(["svc", t, "object"], ["asset", e, "object"], ["metadata", s, ["object[]", "string"]], ["etag", r, "string"]), V(e.links, [h.APP_METADATA]);
  const o = F(e.links, h.APP_METADATA);
  return t.invoke(R.PATCH, o, M(Object.assign(n, { [O.IF_MATCH]: r, [O.CONTENT_TYPE]: at })), typeof s == "string" ? s : JSON.stringify(s), { isStatusValid: C() }).then((i) => ({ response: i, result: { etag: i.headers.etag } }));
}
function rc(t, e, s) {
  G("getEffectivePrivileges()"), g(["svc", t, "object"], ["asset", e, "object"]), V(e.links, [h.EFFECTIVE_PRIVILAGES]);
  const r = F(e.links, h.EFFECTIVE_PRIVILAGES);
  return t.invoke(R.GET, r, s, void 0, { responseType: "json", isStatusValid: C() }).then((n) => ({ result: n.response, response: n }));
}
function nc(t, e, s) {
  G("getACLPolicy()"), g(["svc", t, "object"], ["asset", e, "object"]), V(e.links, [h.ACL_POLICY]);
  const r = F(e.links, h.ACL_POLICY);
  return t.invoke(R.GET, r, s, void 0, { responseType: "json", isStatusValid: C() }).then((n) => ({ result: n.response, response: n }));
}
function oc(t, e, s, r, n = {}) {
  G("checkACLPrivilege()"), g(["svc", t, "object"], ["asset", e, "object"], ["privilege", s, "string", !1, ["ack", "read", "write", "delete"]]), V(e.links, [h.ACCESS_CHECK]);
  const o = ee(e.links, h.ACCESS_CHECK, { privilege: s.toString(), relation: r });
  return t.invoke(R.GET, o, Object.assign({ directive: "acl-check-no-body" }, n), void 0, { responseType: "json", isStatusValid: C([403]) }).then((i) => ({ result: i.statusCode !== 403, response: i }));
}
function ic(t, e, s, r, n = {}) {
  G("patchACLPolicy()"), g(["svc", t, "object"], ["asset", e, "object"], ["policy", s, ["string", "object"]], ["etag", r, "string", !0]), V(e.links, [h.ACL_POLICY]);
  const o = M(Object.assign(n, { [O.CONTENT_TYPE]: at, [O.IF_MATCH]: r })), i = F(e.links, h.ACL_POLICY);
  return U(t).invoke(R.PATCH, i, o, typeof s == "string" ? s : JSON.stringify(s), { responseType: "json", isStatusValid: C() }).then((a) => ({ result: a.response, response: a }));
}
function ac(t, e, s = {}) {
  G("deleteACLPolicy()"), g(["svc", t, "object"], ["asset", e, "object"]), V(e.links, [h.ACL_POLICY]);
  const r = F(e.links, h.ACL_POLICY);
  return U(t).invoke(R.DELETE, r, s, void 0, { responseType: "json", isStatusValid: C() }).then((n) => ({ result: n.response, response: n }));
}
function cc(t, e, s, r, n) {
  G("useLinkOrResolveResource()"), g(["svc", t, "object"], ["asset", e, "object"], ["resource", s, "string"]);
  const o = U(t);
  let i;
  try {
    i = F(e.links, s);
  } catch {
  }
  return N.resolve(i).then((a) => {
    if (typeof a == "string") return G("uLORR() asset has link"), a;
    const l = oe(t);
    return Fn(e, l, [s]);
  }).then((a) => {
    if (typeof a == "string") return a;
    try {
      return F(a, s);
    } catch {
      return;
    }
  }).then((a) => {
    if (typeof a == "string") return G("uLORR() cache or asset had link"), o.invoke(R.GET, a, n, void 0, { isStatusValid: C(), responseType: r });
    if (!Xs(e)) throw new c(c.INVALID_PARAMS, "Asset is not resolvable. Must contain repository ID + path/id or links.");
    return ir(t, e, "id", s, r, n);
  }).then((a) => mn(a) ? a : { result: e, response: a });
}
function ct(t, e, s = [], r = !1, n) {
  return hc(t, e, s, r, n).then(({ result: o }) => o);
}
const lc = /* @__PURE__ */ new Set([h.BASE_DIRECTORY, h.RESOLVE_BY_ID, h.RESOLVE_BY_PATH, h.REPO_OPS, h.REPOSITORY, h.DIRECTORY, h.DISCARD, h.RESTORE, h.PATH, h.ANNOTATIONS]), dc = "/links{?assetId,repositoryId,clientRegion}";
function uc(t, e, s) {
  const r = function(n, o) {
    G("getLinksAPIUrlForAsset()"), g(["svc", n, "object"], ["asset", o, "object"]);
    const i = U(n), a = Ge(dc, i), { assetId: l, repositoryId: d, contentRegion: u } = o, p = M({ assetId: l, repositoryId: d, contentRegion: u });
    return je(a, p);
  }(t, e);
  return U(t).invoke(R.GET, r, s, void 0, { responseType: "json" }).then((n) => {
    const o = oe(t);
    return e.links = Object.assign({}, e.links, n.response._links), o?.setValueWithAsset(e.links, e), { response: n, result: e };
  });
}
function hc(t, e, s = [], r = !1, n) {
  if (G("fetchLinksIfMissing()", s), g(["svc", t, "object"], ["asset", e, "object"], ["linksToPopulate", s, "string[]"], ["suppressMissingErrors", r, "boolean", !0]), it(e.links, s)) return G("fLIM() links exist"), N.resolve({ result: e.links });
  const o = oe(t);
  return Fn(e, o, s, !0).then((i) => i || (function(a, l) {
    return typeof a.assetId == "string" && a.assetId.length > 0 && l.every((d) => !lc.has(d));
  }(e, s) ? uc(t, e, n) : (G("fLIM() fetching links"), Vn(t, e, n)))).then((i) => {
    let a, l, d = i;
    if (mn(i) && (a = i.response, d = i.result.links, l = i.result), e.links !== d) {
      e.links = ye(e.links || {}, d);
      const u = oe(t);
      u && u.setValueWithAsset(e.links, e);
    }
    if (!r && !it(d, s)) throw new c(c.INVALID_PARAMS, "Required links could not be fetched for asset.", void 0, a, M({ required: s, asset: l }));
    return G("fLIM() fetchedOCached exists"), { result: d || e.links, response: a };
  });
}
function Fn(t, e, s, r) {
  if (G("getLinksFromCache()"), !e) return N.resolve(void 0);
  const n = e.getValueWithAsset(t);
  return n == null ? (r && e.setPending(t.assetId, t.repositoryId), N.resolve(void 0)) : N.resolve(n).then((o) => s ? it(o, s) ? o : void (r && e.setPending(t.assetId, t.repositoryId)) : o);
}
function pc(t, e, s, r, n, o, i) {
  return ka(t, e, s, r, n, o, i);
}
function Hn(t, e, s, r) {
  const n = _e(e), o = Object.assign(Object.assign(Object.assign({}, function(i) {
    return S(i.asset) ? i.asset : i;
  }(t)), M({ assetId: e.headers["asset-id"] || e.headers["x-resource-id"], format: e.headers[O.CONTENT_TYPE], md5: e.headers["content-md5"], etag: e.headers.etag, version: e.headers.version, repositoryId: e.headers["repository-id"] })), { links: n });
  return s && n && Object.keys(n).length > 0 && r && r.setValueWithAsset(n, o), o;
}
x("dcx:assets:block_transfer");
const rs = 10485760, _c = 52428800, fc = rs / 4;
let $n = _c;
function ar(t, e) {
  const s = function(n) {
    return Gn(n, B.REPO_MIN_BLOCK_TRANSFER_SIZE);
  }(t);
  if (s && e < s) return !1;
  const r = Ec(t);
  return !!(r && e > r) || e > rs;
}
function Gn(t, e) {
  if (!it(t.links, [h.BLOCK_UPLOAD_INIT])) return;
  const s = Hs(t.links, h.BLOCK_UPLOAD_INIT, e);
  return s ? parseInt(s) : void 0;
}
function Ec(t) {
  return Gn(t, B.MAX_SINGLE_TRANSFER_SIZE);
}
const xe = (t) => typeof t == "string" ? t.length >= fc ? Ee(t).byteLength : t.length : "size" in t ? t.size : t.byteLength, Xe = (t, e) => {
  if (!Y(t)) return t;
  if (t.length < 2) throw new c(c.INVALID_PARAMS, "GetSliceCallback is expected to accept 2 parameters");
  if (e === void 0 || isNaN(e) || e < 0) throw new c(c.INVALID_PARAMS, "Size parameter should indicate total number of bytes to be read from GetSliceCallback");
  return { getSlice: t, size: e };
}, Yn = () => $n, gc = (t) => {
  if (Number.isNaN(t) || typeof t != "number" || t <= 0) throw new c(c.INVALID_PARAMS, "Invalid block download threshold, must be positive integer");
  $n = t;
};
function Tc(t, e, s, r) {
  const n = Fs(r);
  return { id: e, length: s, type: t, links: tr(n.link), etag: n.etag, location: n.location, version: n.version, revision: n.revision, md5: n["content-md5"] };
}
const w = x("dcx:assets:blockupload"), Ic = x("dcx:assets:blockupload:leaf");
class Ac extends Vs {
  constructor(e, s, r, n, o, i, a, l, d, u, p, _, f, b) {
    super(["stateChanged"]), this._internalBlockUploadId = qt(), this._state = E.NOT_INITIALIZED, this._currentBlockIndex = 0, this._pendingBlockRequests = /* @__PURE__ */ new Map(), this._bytesUploaded = 0, this._indeterminateTransfer = !1, this._maxConcurrentRequests = 4, this._retryQueue = /* @__PURE__ */ new Set(), this._activeBlockIndex = 0, this._lastExtendTime = 0, this._uploadedBlocksURLs = [], this._service = e, this._getSliceCallback = s, ha(r) ? (g([B.REPO_SIZE, r[B.REPO_SIZE], "number"]), this._blockTransferDocument = r, this._transferBlockLinks = this._blockTransferDocument[I.LINKS][h.BLOCK_TRANSFER], this._dataSize = this._blockTransferDocument[B.REPO_SIZE], this._relationType = this._blockTransferDocument[B.REPO_REL_TYPE], this._shiftState(E.INITIALIZED), w(`BlockUpload Initialized: Transfer document found with ${this._transferBlockLinks.length} links. BlockUploadId: ${this._internalBlockUploadId}`)) : (g(["relationType", n, "string"], ["dataSize", o, "number"], ["contentType", i, "string"], ["componentId", a, "string", !0], ["etag", d, "string", !0]), this._asset = r, V(this._asset.links, [h.BLOCK_UPLOAD_INIT], c.UNEXPECTED, "/rel/block/init missing from BlockTransferDocument."), this._relationType = n, this._dataSize = o, this._contentType = i, this._componentId = a, this._md5 = l, this._ifMatch = d), this._relPath = u, this._createIntermediates = p, this._respondWith = _, this._repoMetaPatch = f, this._maxConcurrentRequests = b || 4, this._promise = new N((A, v) => {
      this._reject = v, this._resolve = A;
    }), ae.uploads.push(this);
  }
  init(e) {
    if (this._assertStateIsValid("init"), !this._blockTransferDocument || !this._blockTransferDocument[I.LINKS]) {
      this._shiftState(E.INITIALIZING);
      const s = M(Object.assign({ [B.REPO_REL_TYPE]: this._relationType, [B.REPO_IF_MATCH]: this._ifMatch, [B.REPO_SIZE]: this._dataSize, [B.DC_FORMAT]: this._contentType, [B.COMPONENT_ID]: this._componentId, [B.REPO_MD5]: this._md5 }, this._blockTransferDocument));
      return cr(this._service, this._asset, s, e).then((r) => (this._blockTransferDocument = r.result, this._transferBlockLinks = this._blockTransferDocument[I.LINKS][h.BLOCK_TRANSFER], this._shiftState(E.INITIALIZED), w(`BlockUpload Initialized: Transfer document found with ${this._transferBlockLinks.length} links. BlockUploadId: ${this._internalBlockUploadId}`), this));
    }
    return N.resolve(this);
  }
  get state() {
    return this._state;
  }
  get promise() {
    return this._promise;
  }
  start() {
    return this._assertStateIsValid("start"), ae.uploads[0] !== this || this._state !== E.INITIALIZED && this._state !== E.PAUSED || (w(`Starting the transfer of BlockUpload: ${this._internalBlockUploadId}`), this._shiftState(E.STARTED), this._uploadLoop()), this._promise;
  }
  pause() {
    return this._assertStateIsValid("pause"), this._shiftState(E.PAUSING), N.allSettled([...this._pendingBlockRequests.values()]).then(() => (this._shiftState(E.PAUSED), w(`BlockUploading has been paused.  BlockUploadId: ${this._internalBlockUploadId}`), this));
  }
  resume() {
    return this._assertStateIsValid("resume"), w(`BlockUploading has been resumed.  BlockUploadId: ${this._internalBlockUploadId}`), this.start(), this;
  }
  cancel() {
    this._assertStateIsValid("cancel"), this._shiftState(E.CANCELED), w(`A BlockUpload has been canceled... BlockUploadId: ${this._internalBlockUploadId}`), this._promise.cancel(), this._cancel();
  }
  _setWaiting() {
    this._shiftState(E.WAITING);
  }
  uploadNextBlock(e) {
    if (this._assertStateIsValid("uploadNextBlock"), this._isEmptyBlock(e)) throw new c(c.INVALID_PARAMS, "Trying to upload empty data block.");
    const s = this._activeBlockIndex, r = Date.now(), n = this._blockTransferDocument[I.LINKS][h.BLOCK_TRANSFER][s].href;
    let o;
    w(`Uploading a block... BlockUploadId: ${this._internalBlockUploadId}`);
    const i = xe(e), a = this._uploadBlock(e, n).then((l) => (this._uploadedBlocksURLs[s] = { href: n }, this._updateProgress(i), o(), w(`A block has completed... ${this._pendingBlocksCount} requests still active. BlockUploadId: ${this._internalBlockUploadId}`), l)).catch((l) => (o(), this._isTransferUrlExpiredError(l) ? (w(`A block with index as ${s} has FAILED due to Transfer Expiry!! ${this._pendingBlocksCount} requests still active. BlockUploadId: ${this._internalBlockUploadId}`), this._retryQueue.add(s), r <= this._lastExtendTime ? (w(`Skipping extend for block ${s} — request started after last extend.`), this._maybePauseForRetry().then(() => N.reject(E.PAUSED))) : this._maybeExtendWithPauseResume().catch((d) => (w(`Extend flow failed for block ${s}`, d), N.reject(d)))) : (w(`A block upload has failed. BlockUploadId: ${this._internalBlockUploadId}`), this._shiftState(E.ERROR), this._reject(new c(c.UNEXPECTED_RESPONSE, "A block has failed during upload", l, l.response)), this.cancel(), N.reject(l))));
    return o = this._pushPendingBlockRequest(s, a), a;
  }
  get _pendingBlocksCount() {
    return ae.pendingUploadRequests.filter((e) => !!e).length;
  }
  _nextBlockLock() {
    return this._pendingBlocksCount < this._maxConcurrentRequests ? Promise.resolve() : Promise.race(ae.pendingUploadRequests.filter((e) => !!e));
  }
  _handleAssetMoved(e) {
    throw w("_handleAssetMoved"), this._pendingBlockRequests.forEach((s) => {
      s.abort();
    }), this._pendingBlockRequests.clear(), this._uploadedBlocksURLs.length = 0, this._transferBlockLinks.length = 0, this._asset.links = Object.assign(Object.assign({}, this._asset.links), _e(e.response)), this._retryQueue.clear(), this._activeBlockIndex = 0, this._lastExtendTime = 0, this._currentBlockIndex = 0, this._bytesUploaded = 0, this._state = E.NOT_INITIALIZED, this._blockTransferDocument[I.LINKS] = void 0, this.init().then(() => this.start()), E.INITIALIZING;
  }
  _getNextUploadBlockData() {
    if (this._retryQueue.size > 0) {
      const [e] = this._retryQueue;
      this._retryQueue.delete(e), this._activeBlockIndex = e;
    } else this._activeBlockIndex = this._currentBlockIndex;
    return this._getBlockAtIndex(this._activeBlockIndex);
  }
  _uploadLoop() {
    this._nextBlockLock().then(() => {
      if (this._state === E.FINALIZING || this._state === E.COMPLETE) throw E.COMPLETE;
      if (this._state === E.PAUSING || this._state === E.PAUSED) throw E.PAUSED;
      if (this._state === E.CANCELED) throw E.CANCELED;
      if (this._state === E.ERROR) throw E.ERROR;
    }).then(() => this._getNextUploadBlockData()).then((e) => this._isEmptyBlock(e) ? (w(`No more blocks.  BlockUploadId: ${this._internalBlockUploadId}`), Promise.all([...this._pendingBlockRequests.values()]).then(this._finalize.bind(this))) : e && xe(e) > 0 && this._activeBlockIndex >= this._transferBlockLinks.length ? this._extend().then(() => e) : e).then((e) => {
      if (!e) throw E.COMPLETE;
      this.uploadNextBlock(e), this._activeBlockIndex === this._currentBlockIndex && this._currentBlockIndex++;
    }).then(() => {
      this._uploadLoop();
    }).catch((e) => {
      if (typeof e != "string" && (this._continueBlockUploads(), this._reject(e)), e !== E.INITIALIZING) if (e !== E.COMPLETE) {
        if (e !== E.PAUSED) return e === E.CANCELED ? (w(`BlockUpload loop is terminated due to the upload being canceled. BlockUploadId: ${this._internalBlockUploadId}`), void this._continueBlockUploads()) : e === E.ERROR ? (w(`BlockUpload loop is terminated due to error state. BlockUploadId: ${this._internalBlockUploadId}`), void this._continueBlockUploads()) : void 0;
        w(`BlockUpload loop is terminated due to paused state. BlockUploadId: ${this._internalBlockUploadId}`);
      } else w(`BlockUpload loop is complete. BlockUploadId: ${this._internalBlockUploadId}`);
      else w(`BlockUpload loop must be re-started due to assetmoved BlockUploadId: ${this._internalBlockUploadId}`);
    });
  }
  _getBlockAtIndex(e) {
    w(`_getBlockAtIndex(${e})`);
    const s = Math.min(this._dataSize, this._blockTransferDocument[B.REPO_BLOCK_SIZE]);
    if (this._state === E.STARTED) {
      const r = e * s;
      return w("calling _getSliceCallback", r, r + s), this._getSliceCallback(r, r + s).catch((n) => {
        throw new c(c.UNEXPECTED_RESPONSE, "The getSliceCallback threw an unexpected error.", n);
      });
    }
  }
  _uploadBlock(e, s) {
    return this._service.invoke(R.PUT, s, void 0, e, { isStatusValid: C(), isExternalRequest: !0 });
  }
  _isEmptyBlock(e) {
    return typeof e == "string" ? e.length === 0 : da(e) ? e.size === 0 : !e || e.byteLength === 0;
  }
  _extend(e = !0) {
    V(this._blockTransferDocument[I.LINKS], [h.BLOCK_EXTEND], c.UNEXPECTED, "The transfer document does not contain an extend href");
    const s = this._blockTransferDocument[B.REPO_SIZE], r = e ? Math.ceil(1.5 * s) : s, n = ee(this._blockTransferDocument[I.LINKS], h.BLOCK_EXTEND, { size: r });
    return this._service.invoke(R.POST, n, {}, void 0, { isStatusValid: C(), responseType: "json" }).then((o) => (this._indeterminateTransfer = !0, this._blockTransferDocument = o.response, this._transferBlockLinks = this._blockTransferDocument[I.LINKS][h.BLOCK_TRANSFER], w(`Transfer document extended (${e ? "size increased" : "URL refresh only"}): ${this._transferBlockLinks.length} transfer links. BlockUploadId: ${this._internalBlockUploadId}`), o)).catch((o) => {
      throw ot(o) && o.problemType === K.ASSET_MOVED && this._handleAssetMoved(o), new c(c.UNEXPECTED_RESPONSE, "An unexpected error occurred while extending the block transfer document.", o, o.response);
    });
  }
  _maybeExtendWithPauseResume() {
    if (this._extendPromise) return w("Reusing in-progress extend (with pause/resume)"), N.reject(E.PAUSED);
    w("[_maybeExtendWithPauseResume] Setting state to PAUSED and triggering extend"), this._shiftState(E.PAUSED);
    const e = N.resolve().then(() => (w("[_maybeExtendWithPauseResume] Pause done, calling _extend()"), this._extend(!1))).then((s) => (this._lastExtendTime = Date.now(), w("[_maybeExtendWithPauseResume] Extend done, calling resume()"), N.resolve(this.resume()).then(() => (w("[_maybeExtendWithPauseResume] Resume done"), s))));
    return this._extendPromise = e.finally(() => {
      this._extendPromise = void 0;
    }), N.reject(E.PAUSED);
  }
  _maybePauseForRetry() {
    return this._state === E.PAUSED || this._state === E.PAUSING ? (w("[_maybePauseForRetry] Already in PAUSED or PAUSING state — skipping."), N.resolve()) : (w("[_maybePauseForRetry] Shifting to PAUSED state to trigger retry mechanism."), this._shiftState(E.PAUSED), w("[_maybePauseForRetry] Calling resume() to restart upload loop for retries."), this.resume(), N.resolve());
  }
  _isTransferUrlExpiredError(e) {
    var s, r;
    const n = (s = e?.response) === null || s === void 0 ? void 0 : s.statusCode, o = e?.code, i = ((r = e?.response) === null || r === void 0 ? void 0 : r.response) || "";
    return w(`[TransferExpiryCheck] StatusCode: ${n}`), w(`[TransferExpiryCheck] Code: ${o}`), w(`[TransferExpiryCheck] RawResponse: ${i}`), !(n !== 403 && o !== "FORBIDDEN" || typeof i != "string" || !i.toLowerCase().includes("request has expired"));
  }
  _pushPendingBlockRequest(e, s) {
    this._pendingBlockRequests.set(e, s);
    const r = ae.pendingUploadRequests.push(s);
    return () => {
      this._pendingBlockRequests.delete(e), delete ae.pendingUploadRequests[r - 1];
    };
  }
  _updateProgress(e) {
    if (w("_updateProgress()", e), typeof e == "number" && (this._bytesUploaded += e), this.onProgress && Y(this.onProgress)) try {
      this.onProgress(this._bytesUploaded, Math.max(this._blockTransferDocument[B.REPO_SIZE], this._bytesUploaded), this._indeterminateTransfer);
    } catch (s) {
      console.error("Error in onProgress callback", s);
    }
  }
  _cancel() {
    this._pendingBlockRequests.forEach((e) => {
      e?.cancel();
    }), this._state !== E.ERROR && this._resolve(this);
  }
  _assertStateIsValid(e, s) {
    const r = s || this._state;
    switch (e) {
      case "init":
        if (r !== E.NOT_INITIALIZED && r !== E.INITIALIZED) throw new c(c.INVALID_STATE, "BlockUpload has already been initialized");
        break;
      case "start":
        if (r === E.NOT_INITIALIZED) throw new c(c.INVALID_STATE, "Please call init before starting the block upload");
        break;
      case "uploadNextBlock":
        if (r === E.PAUSED || r === E.CANCELED) throw new c(c.INVALID_STATE, "Cannot add block when Paused or Cancelled");
        break;
      case "getBlockAtIndex":
        if (r !== E.STARTED) throw new c(c.INVALID_STATE, `Cannot fetch block while in the ${r} state`);
        break;
      case "cancel":
        if (r !== E.STARTED && r !== E.FINALIZING && r !== E.PAUSING && r !== E.PAUSED && r !== E.ERROR) throw new c(c.INVALID_STATE, `Trying to cancel while in an invalid state ${r}`);
    }
  }
  _continueBlockUploads() {
    if (w("continueBlockUploads()"), ae.uploads[0] === this) if (ae.uploads.shift(), ae.uploads.length > 0) {
      const e = ae.uploads[0];
      w("Another block upload found in the queue, starting..."), e.start();
    } else this._pendingBlocksCount === 0 && (w("There are no more pending block transfers.. Clean up blockUploadManager.."), ae.resetUploads());
  }
  _finalize() {
    w(`Finalizing block transfer.  BlockUploadId: ${this._internalBlockUploadId}`), this._shiftState(E.FINALIZING);
    const e = ee(this._blockTransferDocument[I.LINKS], h.BLOCK_FINALIZE, M({ path: this._relPath, intermediates: this._createIntermediates, respondWith: S(this._respondWith) ? JSON.stringify(this._respondWith) : this._respondWith, repoMetaPatch: this._repoMetaPatch }));
    return this._blockTransferDocument[I.LINKS][h.BLOCK_TRANSFER] = this._uploadedBlocksURLs, this._service.invoke(R.POST, e, { [O.CONTENT_TYPE]: vn }, JSON.stringify(M(this._blockTransferDocument)), { isStatusValid: C(), retryOptions: { pollHeader: "location", pollCodes: [202], timeoutAfter: 12e4 }, responseType: "arraybuffer" }).then((s) => {
      if (s.statusCode === 200 || s.statusCode === 201) {
        w(`Finalize complete.  BlockUploadId: ${this._internalBlockUploadId}`);
        const r = ss(new Uint8Array(s.response));
        if (this._relationType === h.PRIMARY) {
          if (this.finalizeResponse = r, this.createdAsset = M({ assetId: r.headers["asset-id"], repositoryId: r.headers["repository-id"], links: tr(r.headers.link), etag: r.headers.etag, md5: r.headers["content-md5"] }), r.response && this._respondWith) try {
            const n = JSON.parse(Ae(r.response));
            r.response = n, this.createdAsset = Me(this.createdAsset, ne(n));
          } catch (n) {
            throw new c(c.UNEXPECTED, "Unexpected error parsing respondWith parameter", n);
          }
        } else {
          this.finalizeResponse = s;
          try {
            this.uploadRecord = Tc(this._blockTransferDocument[B.DC_FORMAT], this._blockTransferDocument[B.COMPONENT_ID], this._bytesUploaded, Ae(s.response));
          } catch (n) {
            throw new c(c.UNEXPECTED, "An error occurred while deserializing upload component record.", n, r);
          }
        }
        this._shiftState(E.COMPLETE), this._updateProgress(!0), this._resolve(this);
      }
      this._continueBlockUploads();
    }).catch((s) => {
      if (ot(s)) switch (s.problemType) {
        case K.ASSET_MOVED:
          return void this._handleAssetMoved(s);
        case K.ASSET_NAME_CONFLICT:
          return w("Error occurred finalizing the block transfer due to asset name conflict.. Rejecting with ALREADY_EXISTS"), this._reject(new c(c.ALREADY_EXISTS, "Asset name conflict occurred during block transfer finalization.", s, s.response)), void this._continueBlockUploads();
      }
      w("Error occurred finalizing the block transfer.. Rejecting"), this._reject(new c(c.UNEXPECTED_RESPONSE, "An error occurred while finalizing the block transfer.", s, s.response)), this._continueBlockUploads();
    });
  }
  _shiftState(e) {
    return w(`_shiftState(): ${e}`), this._state === E.COMPLETE || this._state === E.ERROR || this._state === E.CANCELED || (this._state = e, this.emit("stateChanged", [this._state])), this;
  }
}
function cr(t, e, s, r = {}) {
  if (g(["svc", t, "object"], ["assetOrLink", e, ["object", "string"]], ["transferDocument", s, "object"], ["additionalHeaders", r, "object", !0]), Xt(e) && V(e.links, [h.BLOCK_UPLOAD_INIT]), s["repo:resource"]) {
    if (!s["repo:resource"].reltype) throw new c(c.INVALID_DATA, "reltype param is required in the Resource Designator");
    s[B.REPO_REL_TYPE] = s["repo:resource"].reltype, s["repo:resource"].component_id && (s[B.COMPONENT_ID] = s["repo:resource"].component_id), s["repo:resource"].etag && (s[B.REPO_IF_MATCH] = s["repo:resource"].etag), delete s["repo:resource"];
  }
  if (s[B.REPO_REL_TYPE] === h.COMPONENT && !s[B.COMPONENT_ID]) throw new c(c.INVALID_DATA, "Component Id required to block upload to a component");
  const n = Xt(e) ? F(e.links, h.BLOCK_UPLOAD_INIT) : e;
  r[O.CONTENT_TYPE] = vn;
  const o = vt(r);
  return o.priority = o.priority || "u=1", t.invoke(R.POST, n, o, JSON.stringify(s), { responseType: "json", isStatusValid: C() }).then((i) => ({ response: i, result: i.response }));
}
function qn({ additionalHeaders: t, asset: e, componentId: s, contentType: r, dataOrSliceCallback: n, etag: o, maybeIsNew: i, md5: a, progressCb: l, relation: d, size: u, svc: p, blockSize: _, maxConcurrentRequests: f }) {
  Ic("_upload()"), g(["svc", p, "object"], ["asset", e, "object"], ["size", u, "number", !0], ["md5", a, "string", !0], ["etag", o, "string", !0]);
  const b = Xe(n, u), A = xe(b), v = U(p);
  if (ar(e, A)) return bt({ asset: e, additionalHeaders: t, componentId: s, contentType: r, dataOrSliceCallback: n, etag: o, md5: a, progressCb: l, relation: d, size: u, service: v, blockSize: _, maxConcurrentRequests: f });
  V(e.links, [d]);
  const y = ee(e.links, d, { component_id: s });
  return N.resolve(void 0, { blockUpload: void 0, progress: l }).then(() => Promise.resolve(Y(n) ? n(0, A) : n)).then((P) => Ht({ asset: e, additionalHeaders: t, contentType: r, data: P, etag: o, headHref: y, href: y, maybeIsNew: i, relation: d, service: v })).then((P) => {
    let m = {};
    try {
      m = _e(P), e.links = ye(e.links || {}, m);
      const D = oe(p);
      D && D.setValueWithAsset(e.links, e);
    } catch {
    }
    return { response: P, result: { revision: P.headers.revision || P.headers.version, location: P.headers.location, links: m, etag: P.headers.etag, version: P.headers.version || P.headers.revision, md5: P.headers.md5 || P.headers["content-md5"], length: A, type: r }, isBlockUpload: !1, asset: { assetId: e.assetId || P.headers["asset-id"], repositoryId: e.repositoryId || P.headers["repository-id"], links: e.links || m } };
  }).catch((P) => {
    throw P;
  });
}
function zn({ service: t, asset: e, additionalHeaders: s, dataOrSliceCallback: r, contentType: n, progressCb: o, relation: i, size: a, componentId: l, md5: d, etag: u, relPath: p, createIntermediates: _, respondWith: f, blockSize: b, repoMetaPatch: A, maxConcurrentRequests: v }) {
  const y = Y(r) ? r : function(m) {
    if (!Y(m.slice)) throw new c(c.INVALID_PARAMS, "Data cannot be sliced");
    return function(D, k) {
      return te(this, void 0, void 0, function* () {
        return m.slice(D, k);
      });
    };
  }(r);
  e && V(e.links, [h.BLOCK_UPLOAD_INIT]);
  const P = cr(t, e || function(m) {
    Nt("getBlockUploadLinkForGuest"), g(["svc", m, "object"]);
    const D = U(m), k = Ge(Wa, D);
    return je(k, {});
  }(t), M({ [B.REPO_REL_TYPE]: i, [B.REPO_IF_MATCH]: u, [B.REPO_SIZE]: a, [B.DC_FORMAT]: n, [B.COMPONENT_ID]: l, [B.REPO_MD5]: d, [B.REPO_BLOCK_SIZE]: b }), s);
  return P.then((m) => {
    const D = new Ac(t, y, m.result, i, a, n, l, d, u, p, _, f, A, v);
    return D.onProgress = o, Object.assign(P, { blockUpload: D }), D.init(s);
  }).then((m) => m.start()).then((m) => {
    const D = m.finalizeResponse || { headers: {} }, k = m.uploadRecord || m.createdAsset;
    return { response: D, result: k, blockUpload: m, isBlockUpload: !0, asset: { assetId: D.headers["asset-id"] || e.assetId, repositoryId: D.headers["repository-id"] || e.repositoryId, etag: D.headers.etag, links: e ? e.links : k.links } };
  });
}
function bt({ service: t, asset: e, additionalHeaders: s, dataOrSliceCallback: r, contentType: n, progressCb: o, relation: i, size: a, componentId: l, md5: d, etag: u, relPath: p, createIntermediates: _, respondWith: f, blockSize: b, repoMetaPatch: A, maxConcurrentRequests: v }) {
  return zn({ service: t, asset: e, additionalHeaders: s, dataOrSliceCallback: r, contentType: n, progressCb: o, relation: i, size: a, componentId: l, md5: d, etag: u, relPath: p, createIntermediates: _, respondWith: f, blockSize: b, repoMetaPatch: A, maxConcurrentRequests: v });
}
function Is({ service: t, additionalHeaders: e, dataOrSliceCallback: s, contentType: r, progressCb: n, relation: o, size: i, componentId: a, md5: l, etag: d, relPath: u, respondWith: p, blockSize: _, repoMetaPatch: f, maxConcurrentRequests: b }) {
  return zn({ service: t, asset: void 0, additionalHeaders: e, dataOrSliceCallback: s, contentType: r, progressCb: n, relation: o, size: i, componentId: a, md5: l, etag: d, relPath: u, createIntermediates: !0, respondWith: p, blockSize: _, repoMetaPatch: f, maxConcurrentRequests: b });
}
function mc(t) {
  return t || "defaultbuffer";
}
function bc(t) {
  return !!(t.deviceModifyDate || t.assetType || t.assetSubType);
}
function yc(t, e, s = "json", r = {}) {
  g(["svc", t, "object"], ["asset", e, "object"], ["format", s, "enum", !1, ["json", "xml"]]), V(e.links, [h.EMBEDDED_METADATA]);
  const n = F(e.links, h.EMBEDDED_METADATA);
  return t.invoke(R.GET, n, Object.assign(Object.assign({}, r), { accept: Kt[s.toUpperCase()] }), void 0, { isStatusValid: C(), responseType: s === "json" ? "json" : "text" }).then((o) => ({ result: o.response, response: o }));
}
function vc(t, e, s, r, n = "json", o = {}) {
  g(["svc", t, "object"], ["asset", e, "object"], ["data", s, ["string", "object", "object[]"]], ["etag", r, "string", !0], ["format", n, "enum", !1, ["json", "xml"]]), V(e.links, [h.EMBEDDED_METADATA]);
  const i = F(e.links, h.EMBEDDED_METADATA), a = Object.assign(Object.assign({}, o), { [O.CONTENT_TYPE]: Kt[n.toUpperCase()], [O.IF_MATCH]: r });
  return t.invoke(R.PUT, i, a, typeof s == "string" ? s : JSON.stringify(s), { isStatusValid: C() });
}
function Oc(t, e, s, r, n = {}) {
  g(["svc", t, "object"], ["asset", e, "object"], ["data", s, ["string", "object", "object[]"]], ["etag", r, "string", !0]), V(e.links, [h.EMBEDDED_METADATA]);
  const o = F(e.links, h.EMBEDDED_METADATA);
  return t.invoke(R.PATCH, o, Object.assign(n, { [O.CONTENT_TYPE]: at, [O.IF_MATCH]: r }), typeof s == "string" ? s : JSON.stringify(s), { isStatusValid: C(), retryOptions: { pollCodes: [202], pollHeader: "location", pollMethod: "GET" } });
}
x("dcx:assets:filebase");
const lr = x("dcx:assets:filebase:leaf"), Wn = "application/vnd.adobe.versions+json";
function Rc(t, e, s, r = "defaultbuffer", n, o) {
  lr("getRendition()"), g(["svc", t, "object"], ["asset", e, "object"], ["renditionOptions", s, "object", !0], ["linkProvider", n, "object", !0]), V(e.links, [h.RENDITION]);
  const i = n ? Po(e.links[h.RENDITION], n, s) : ee(e.links, h.RENDITION, Object.assign({}, s));
  return t.invoke(R.GET, i, o, void 0, { responseType: mc(r), isStatusValid: C() }).then((a) => ({ result: a.response, response: a }));
}
function Wr(t, e, s, r, n, o, i, a, l) {
  lr("doBlockDownload()"), g(["svc", t, "object"], ["assetOrPresignedUrl", e, ["object", "string"]], ["startByte", s, "number", !0], ["endByte", r, "number", !0], ["resource", n, "string", !0], ["componentId", o, "string", !0], ["version", i, "string", !0], ["responseType", a, "enum", !0, Js]), dn(() => s == null || r == null || s < r, "endByte must be greater than startByte");
  const d = this != null ? this : {};
  if (typeof e == "string") return Je.call(d, t, e, s, r, a, !0, void 0, l);
  const u = e;
  V(u.links, [h.BLOCK_DOWNLOAD]);
  const p = M({ reltype: n, component_id: o, revision: i }), _ = ee(u.links, h.BLOCK_DOWNLOAD, { resource: n !== void 0 ? JSON.stringify(p) : void 0 });
  return Je.call(d, t, _, s, r, a, !1, void 0, l);
}
function Pc(t, e, s, r, n, o, i, a) {
  return lr("updatePrimaryResource()"), g(["service", t, "object"], ["asset", e, "object"], ["dataOrSliceCallback", s, ["function", "object", "string"]], ["contentType", r, "string"], ["size", n, "number", !0], ["md5", i, "string", !0]), V(e.links, [h.PRIMARY]), qn({ svc: t, asset: e, dataOrSliceCallback: s, contentType: r, relation: h.PRIMARY, size: n, md5: i, maybeIsNew: !1, etag: o, additionalHeaders: a }).catch((l) => {
    var d;
    if (((d = l.response) === null || d === void 0 ? void 0 : d.statusCode) === 413) return bt({ service: U(t), asset: e, dataOrSliceCallback: s, contentType: r, relation: h.PRIMARY, size: n, md5: i, etag: o, additionalHeaders: a });
    throw l;
  });
}
const ft = x("dcx:assets:pagination");
class ns {
  constructor(e, s, r, n) {
    if (this._links = e, this._svc = s, this._transformer = r, this._items = {}, this.ListResource = n, !e || !e[h.PAGE]) throw new c(c.INVALID_PARAMS, "Asset must have links that contain a page relation.");
  }
  get items() {
    return Object.values(this._items);
  }
  get data() {
    return this._data;
  }
  getPage(e = {}, s) {
    ft("getPage()");
    const { embed: r } = e, n = On(e, ["embed"]);
    r && (n.embed = r.some((i) => typeof i == "object") ? JSON.stringify(r) : r.join(",")), this.ListResource && Object.assign(n, { resource: this.ListResource });
    const o = ee(this._links, h.PAGE, n);
    return this._svc.invoke(R.GET, o, s, void 0, { isStatusValid: C(), responseType: "json" }).then((i) => {
      const a = this.parseResponse(i);
      return this._data = a, { paged: this, result: this._data, response: i };
    });
  }
  getNextPage() {
    if (ft("getNextPage()"), this.hasNextPage() && this._nextPageLink) return this._svc.invoke(R.GET, this._nextPageLink.href, void 0, void 0, { isStatusValid: C(), responseType: "json" }).then((e) => {
      const s = this.parseResponse(e);
      return this._data = s, { paged: this, result: this._data, response: e };
    });
  }
  hasNextPage() {
    return ft("hasNextPage() ", this._nextPageLink !== void 0), this._nextPageLink !== void 0;
  }
  *[Symbol.iterator]() {
    for (const e in this._items) yield this._items[e];
  }
  [Symbol.asyncIterator]() {
    return ga(this, arguments, function* () {
      for (const e in this._items) yield yield nt(this._items[e]);
      for (; this.hasNextPage(); ) {
        const e = yield nt(this.next());
        for (const s of e.value.paged) yield yield nt(s);
      }
    });
  }
  next() {
    return te(this, void 0, void 0, function* () {
      if (ft("next()"), !this.hasNextPage()) return { done: !0, value: void 0 };
      const e = yield this.getNextPage();
      return e ? { done: !1, value: e } : { done: !0, value: void 0 };
    });
  }
  parseResponse(e) {
    ft("parseResponse()"), this._items = {};
    const s = e.response;
    for (const r in s[I.CHILDREN]) {
      const n = s[I.CHILDREN][r], [o, i] = this._transformer(n, this._svc);
      this._items[o] = i;
    }
    return this._nextPageLink = s[I.LINKS].next, this.currentPage = s[I.PAGE], s;
  }
}
x("dcx:assets:version");
const Kn = x("dcx:assets:version:leaf");
function Sc(t) {
  Kn("adobeVersionTransformer()");
  const e = dr(t);
  return e.links = ye({}, t.links, t._links), [e.version, e];
}
function dr(t) {
  return Kn("deserializeVersion()"), { version: t.version || t[Le.VERSION], createDate: t.created || t[Le.CREATED], createdBy: t.createdBy || t[Le.CREATED_BY], milestone: t.milestone || t[Le.MILESTONE], links: t._links };
}
x("dcx:assets:file");
const ur = x("dcx:assets:file:leaf");
function Nc(t, e, s, r, n) {
  ur("patchVersions()"), g(["svc", t, "object"], ["asset", e, "object"], ["patchDoc", s, ["string", "array"]], ["etag", r, "string", !0]), V(e.links, [h.VERSION_HISTORY]);
  const o = Object.assign(Object.assign({}, n), { [O.CONTENT_TYPE]: at });
  r && (o[O.IF_MATCH] = r);
  const i = F(e.links, h.VERSION_HISTORY);
  return t.invoke(R.PATCH, i, o, typeof s == "string" ? s : JSON.stringify(s), { isStatusValid: C() });
}
function Xn(t, e, s, r) {
  ur("getVersionResource()"), g(["svc", t, "object"], ["asset", e, "object"], ["version", s, "string"]), V(e.links, [h.PAGE]), Pn(e.links, h.PAGE, "type", Wn);
  const n = ee(e.links, h.PAGE, { version: s });
  return t.invoke(R.GET, n, r, void 0, { responseType: "json", isStatusValid: C() }).then((o) => ({ result: o.response[Le.TOTAL_CHILDREN] > 0 ? o.response[I.CHILDREN][0] : void 0, response: o }));
}
function Cc(t, e, s = {}, r) {
  return ur("getPagedVersions()"), g(["svc", t, "object"], ["asset", e, "object"], ["pageOpts", s, "object"]), V(e.links, [h.PAGE]), Pn(e.links, h.PAGE, "type", Wn), new ns(e.links, t, s.itemTransformer || Sc, h.VERSION_HISTORY).getPage(s, r);
}
x("dcx:assets:composite");
const he = x("dcx:assets:composite:leaf"), Dc = ce.getInstance();
function kc(t, e, s) {
  return he("headCompositeManifest()"), g(["svc", t, "object"], ["asset", e, "object"]), V(e.links, [h.MANIFEST]), os(t, e, void 0, s).then((r) => t.invoke(R.HEAD, r, s, void 0, { responseType: "json", isStatusValid: C() }));
}
function wc(t, e, s, r, n) {
  return he("getCompositeManifest()"), g(["svc", t, "object"], ["asset", e, "object"], ["version", s, "string", !0], ["etag", r, "string", !0]), V(e.links, [h.MANIFEST]), os(t, e, s, n).then((o) => t.invoke(R.GET, o, Object.assign(n ?? {}, r ? { [O.IF_NONE_MATCH]: r } : {}), void 0, { isStatusValid: C([304]), retryOptions: { pollCodes: [404, 202], pollHeader: "location", pollMethod: R.GET, problemWithCode: { problemType: K.RESOURCE_NOT_READY, code: 404 } } })).then((o) => {
    if ((o.statusCode === 200 || o.statusCode === 201) && o.headers[O.CONTENT_TYPE] === "application/http") {
      if (o.response) {
        const i = ss(Ee(o.response));
        return { manifestData: JSON.parse(Ae(i.response)) || null, manifestEtag: i.headers.etag, response: i };
      }
      return { manifestData: o.response || null, manifestEtag: o.headers.etag, response: o.response };
    }
    if (typeof o.response == "string") return { manifestData: o.response ? JSON.parse(o.response) : null, manifestEtag: o.headers.etag, response: o };
    if (o.response === null && ["application/problem+json", "application/json"].includes(o.headers["content-type"])) throw new c(c.UNEXPECTED, "Unexpected response type");
    return { manifestData: o.response || null, manifestEtag: o.headers.etag, response: o };
  });
}
function os(t, e, s, r) {
  return he("getCompositeManifestUrl()"), hr(t, e, h.MANIFEST, s, r).then((n) => je(n, {}));
}
function Lc(t, e, s, r) {
  return he("_getComponentPathUrl()"), hr(t, e, h.COMPONENT, e.version, r).then((n) => je(n, M({ component_path: s })));
}
function hr(t, e, s, r, n) {
  return he("_getUrl()"), g(["svc", t, "object"], ["asset", e, "object"], ["versionId", r, "string", !0]), N.resolve().then(() => {
    if (r) return Xn(t, e, r, n);
  }).then((o) => {
    if (r != null) {
      if (!o || !S(o) || typeof o.result != "object") throw new c(c.UNEXPECTED_RESPONSE, "Invalid version resource.", void 0, o ? o.response : void 0);
      return V(o.result[I.LINKS], [s]), F(o.result[I.LINKS], s);
    }
    return F(e.links, s);
  });
}
function Mc(t, e, s, r, n, o) {
  g(["svc", t, "object"], ["asset", e, "object"], ["components", s, "array"], ["version", r, "string", !0], ["etag", n, "string", !0]);
  const i = [h.MANIFEST, h.COMPONENT, h.BULK_REQUEST, h.BLOCK_DOWNLOAD];
  return r && i.push(h.PAGE), ct(t, e, i, void 0, o).then((a) => te(this, void 0, void 0, function* () {
    e.links = Object.assign({}, e.links, a);
    const l = U(t), d = s.map(({ component_path: _, responseType: f, subrequestHeaders: b }) => ({ method: R.GET, href: ee(e.links, h.COMPONENT, { component_path: _ }), headers: Object.assign(b || {}, o), component_path: _, responseType: f })), u = yield os(l, e, r, o);
    d.unshift({ method: R.GET, href: u, headers: Object.assign(n ? { [O.IF_NONE_MATCH]: n } : {}, o) });
    const p = { startTime: re(), timeoutAfter: 72e5 };
    return hn(xc.bind(void 0, t, e, s, d, o), 404, p, K.RESOURCE_NOT_READY);
  }));
}
function xc(t, e, s, r, n) {
  return te(this, void 0, void 0, function* () {
    const o = U(t), i = yield Promise.all(Oo(r, 10).map((a) => or(o, e, a, void 0, n, !0)));
    return N.resolve(yield i.reduce((a, l) => te(this, void 0, void 0, function* () {
      var d, u;
      const p = yield a;
      if (p.responses.push(l.response), l.response.statusCode !== 200) return p;
      const { componentResponses: _, manifestResponse: f } = function(A, v) {
        return A.reduce((y, P) => {
          const m = v.find((D) => D.href === P.headers[O.CONTENT_ID]);
          if (!m) throw new c(c.UNEXPECTED_RESPONSE, "Bulk sub-response content-id did not match any bulk request", void 0, P);
          return "component_path" in m ? y.componentResponses.push(P) : y.manifestResponse = P, y;
        }, { componentResponses: [] });
      }(l.result, r), b = {};
      if (s.forEach((A) => {
        A.hasOwnProperty("skipBlockDownload") && (b[A.component_path] = A.skipBlockDownload);
      }), Object.assign(p.components, yield function(A, v, y, P, m, D) {
        return te(this, void 0, void 0, function* () {
          return (yield Promise.all(v.map((k) => te(this, void 0, void 0, function* () {
            if (k.headers[O.CONTENT_TYPE] === Ds && k.response.type === K.RESPONSE_TOO_LARGE) {
              const j = Kr(k, A), X = k.headers.location ? k.headers.location : ee(P, h.BLOCK_DOWNLOAD, { resource: JSON.stringify({ component_path: j.component_path }) });
              if (D && D[j.component_path]) return { statusCode: 200, headers: M({ [O.CONTENT_TYPE]: k.headers["content-type"], [O.CONTENT_LENGTH]: k.headers["content-length"], [O.CONTENT_ID]: k.headers[O.CONTENT_ID] }), responseType: "application/json", response: { href: X }, message: "OK" };
              const H = yield Je(U(y), X, void 0, void 0, "defaultbuffer", !0, void 0, m);
              return Object.assign(H.headers, { [O.CONTENT_ID]: k.headers[O.CONTENT_ID] }), H;
            }
            return k;
          })))).reduce((k, j) => {
            const X = Kr(j, A);
            try {
              const H = Tt(j);
              k[X.component_path] = Object.assign({}, X, { response: j, [H ? "error" : "data"]: H || As(j.response, X.responseType || "defaultbuffer", j.headers["content-type"]) });
            } catch (H) {
              k[X.component_path] = Object.assign({}, X, { response: j, error: new c(c.UNEXPECTED, "Error parsing sub-response into requested responseType", H) });
            }
            return k;
          }, {});
        });
      }(r.slice(1), _, t, e.links, n, b)), !f) return p;
      if (f.statusCode === 200) {
        p.manifest.data = As(f.response, "json"), p.manifest.response = f, Cs(e) && typeof ((d = e.current) === null || d === void 0 ? void 0 : d.parse) == "function" && (e.current.parse(Ae(f.response)), e.current.versionId = f.headers.version), e.links = _e(f);
        const A = oe(t);
        return A && A.setValueWithAsset(e.links, e), p;
      }
      if (f.statusCode === 304) return p.manifest.response = f, p;
      if (f.statusCode === 404) {
        if (f.response = As(f.response, "json"), f.response && f.response.type === K.RESOURCE_NOT_READY) throw new c(c.NOT_FOUND, void 0, void 0, f);
        return p.manifest.error = Tt(f) || new c(c.NO_COMPOSITE, "Composite missing or deleted", void 0, f), p;
      }
      if (f.headers[O.CONTENT_TYPE] === Ds && f.response.type === K.RESPONSE_TOO_LARGE) {
        try {
          const A = f.headers.location ? f.headers.location : ee(e.links, h.BLOCK_DOWNLOAD, { resource: JSON.stringify({ reltype: h.MANIFEST }) }), v = yield Je(o, A, void 0, void 0, "json", !0, void 0, n);
          p.manifest.data = v.response, p.manifest.response = v, Cs(e) && typeof ((u = e.current) === null || u === void 0 ? void 0 : u.parse) == "function" && e.current.parse(JSON.stringify(v.response)), e.links = _e(v);
        } catch (A) {
          p.manifest.error = A instanceof c ? A : new c(c.UNEXPECTED, "Error fetching manifest via block download", A);
        }
        return p;
      }
      return p.manifest.error = Tt(f) || new c(c.UNEXPECTED_RESPONSE, f.response.title || "Failed to fetch manifest. Operation failed.", void 0, f), p;
    }), Promise.resolve({ manifest: {}, components: {}, responses: [] })));
  });
}
function Kr(t, e) {
  if (!t.headers[O.CONTENT_ID]) throw new c(c.UNEXPECTED_RESPONSE, "Sub-response is missing content-id header", void 0, t);
  const s = e.find(({ href: r }) => r === t.headers[O.CONTENT_ID]);
  if (!s) throw new c(c.UNEXPECTED_RESPONSE, "Bulk sub-response content-id did not match any bulk request", void 0, t);
  return s;
}
function As(t, e, s) {
  if (!bn(t)) return t;
  switch (e) {
    case "text":
      return Ae(t);
    case "json":
      return JSON.parse(Ae(t));
    case "blob":
      return new Blob([t], { type: s });
    case "buffer":
    case "defaultbuffer":
      return t;
    case "arraybuffer":
      return t.buffer;
  }
  throw new c(c.INVALID_PARAMS, "requested response type is not supported");
}
function Uc(t, e, s, r, n, o) {
  return te(this, void 0, void 0, function* () {
    const i = [{ method: R.PUT, href: s, headers: n, body: r }], a = [];
    if (e.deviceModifyDate && a.push({ op: "add", path: `/${[I.REPO_DEVICE_MODIFY_DATE]}`, value: e.deviceModifyDate }), a.length) {
      const _ = { [O.CONTENT_TYPE]: at };
      i.push({ method: R.PATCH, href: F(e.links, h.REPO_METADATA), headers: _, body: JSON.stringify(a) });
    }
    const { result: l, response: d } = yield or(t, e, i, void 0, o, !0), { manifestResponse: u, repoMetadataResponse: p } = function(_, f) {
      const b = { manifestResponse: {}, repoMetadataResponse: {} };
      return f.forEach((A) => {
        const v = _.find((y) => y.headers[O.CONTENT_ID] === A.href);
        if (!v) throw new c(c.UNEXPECTED_RESPONSE, "Bulk sub-response content-id did not match any bulk request", void 0, v);
        A.href.includes(":repometadata") ? b.repoMetadataResponse = v : b.manifestResponse = v;
      }), b;
    }(l, i);
    return { manifestResponse: u, repoMetadataResponse: p, response: d };
  });
}
function pr(t, e, s, r) {
  return he("getCompositeComponentUrl()"), g(["svc", t, "object"], ["asset", e, "object"], ["componentId", s, "string"], ["componentRevision", r, "string", !0]), V(e.links, [h.COMPONENT]), ee(e.links, h.COMPONENT, { component_id: s, revision: r });
}
function Zn(t, e, s, r) {
  return he("getPresignedUrl()"), g(["svc", t, "object"], ["asset", e, "object"]), ct(t, e, [h.BLOCK_DOWNLOAD], void 0, r).then((n) => {
    const o = s ? JSON.stringify(s) : void 0, i = ee(n, h.BLOCK_DOWNLOAD, { resource: o });
    return (Zs(t) ? t.service : t).invoke(R.GET, i, Object.assign({ priority: "u=1" }, r), void 0, { isStatusValid: C(), responseType: "json", retryOptions: { pollCodes: [202], pollHeader: "location", pollMethod: R.GET } });
  }).then((n) => {
    if (typeof n.response.href != "string") throw new c(c.INVALID_DATA, "Direct download URL not found.", void 0, n);
    return { response: n, result: n.response.href };
  });
}
const Jn = es("AdobeDCX.getCompositeComponentPresignedUrl", function(t, e, s, r, n) {
  return he("getCompositeComponentPresignedUrl()"), ue("componentId", s), ue("componentRevision", r), g(["svc", t, "object"], ["asset", e, "object"], ["componentId", s, "string"], ["componentRevision", r, "string"]), Zn(t, e, { reltype: h.COMPONENT, revision: r, component_id: s }, n);
});
function Bc(t, e, s, r = "defaultbuffer", n, o) {
  return g(["svc", t, "object"], ["asset", e, "object"], ["componentPath", s, "string"], ["responseType", r, "string", !0], ["additionalHeaders", n, "object", !0]), ct(t, e, [h.COMPONENT, h.PAGE], void 0, n).then((i) => {
    if (e.links = i, e.version) return Lc(U(t), e, s);
  }).then((i) => rr(U(t), e, i ?? ee(e.links, h.COMPONENT, { component_path: s }), h.COMPONENT, r, void 0, void 0, n, o));
}
function jc(t, e, s, r, n = "defaultbuffer", o, i) {
  he("getCompositeComponent()"), g(["svc", t, "object"], ["asset", e, "object"], ["componentId", s, "string"], ["componentRevision", r, "string"], ["responseType", n, "string", !0], ["additionalHeaders", o, "object", !0], ["componentSize", i, "number", !0]);
  const a = {};
  if (!i || i < Yn()) {
    const l = pr(t, e, s, r);
    return rr.call(a, t, e, l, h.COMPONENT, n, s, r, o);
  }
  return Jn(t, e, s, r, o).then(({ response: l, result: d }) => Je.call(a, t, d, void 0, void 0, n, !0, l.response.size, o));
}
function ws(t, e, s, r, n = 1, o, i = {}, a) {
  if (he("updateCompositeManifest() ", r, o), g(["svc", t, "object"], ["asset", e, "object"], ["manifest", s, ["object", "string"]], ["overwrite", r, "boolean"], ["validationLevel", n, "+number"], ["etag", o, "string", !0]), n < 1) throw new c(c.INVALID_PARAMS, "ValidationLevel must be >=1");
  return V(e.links, [h.BULK_REQUEST, h.REPO_METADATA]), hr(t, e, h.MANIFEST, void 0, i).then((l) => te(this, void 0, void 0, function* () {
    const d = Object.assign({}, i);
    r ? d[O.IF_MATCH] = "*" : o && (d[O.IF_MATCH] = o);
    const u = `${_a}; validation-level=${n}`;
    d[O.CONTENT_TYPE] = u;
    const p = typeof s == "string" ? s : JSON.stringify(s);
    let _, f, b;
    const A = l.includes(mt.REPO_META_PATCH) || l.includes(mt.RESPOND_WITH);
    if (A) {
      const y = {}, P = M({ [I.REPO_DEVICE_MODIFY_DATE]: e.deviceModifyDate });
      Object.keys(P).length && (y[mt.REPO_META_PATCH] = P), l = je(l, y), _ = yield function(m, D, k, j) {
        return te(this, void 0, void 0, function* () {
          return yield m.invoke(R.PUT, D, j, k, { isStatusValid: C([412, 409]), responseType: "arraybuffer", retryOptions: { pollCodes: [202], pollHeader: "location", pollMethod: R.GET, modifyHeadersCallback: yn([O.IF_MATCH]) } });
        });
      }(t, l, p, d);
    } else {
      const y = yield Uc(t, e, l, p, d, i);
      _ = y.manifestResponse, f = y.repoMetadataResponse, b = y.response;
    }
    if (he("uCM() status code for manifest response: ", _.statusCode), _.statusCode === 412 && r) return he("uCM() retry 412 without overwrite"), ws(t, e, s, !1, n, void 0, i);
    if (_.statusCode === 409 && r) return he("uCM() retry 409 without overwrite"), ws(t, e, s, !1, n, o, i);
    if (_.statusCode === 409) throw new c(c.UPDATE_CONFLICT, "Manifest has been changed", void 0, _);
    if (_.statusCode === 412) throw new c(c.PRECONDITION_FAILED, "Precondition failed", void 0, _);
    if (_.statusCode === 400) {
      const y = Tt(_);
      throw new c(y?.code, y?.message, void 0, _);
    }
    {
      const y = C()(_.statusCode, _);
      if (y !== !0) throw new c(y.code || c.UNEXPECTED_RESPONSE, y._message || y.message, y.underlyingError, _);
    }
    if (!A) {
      if (_.xhr = b.xhr, he("uCM() status code for metadata response: ", f.statusCode), bc(e) && f.statusCode !== 200 && f.statusCode !== 201 && f.statusCode !== 204) throw new c(c.UNEXPECTED_RESPONSE, "Unexpected HTTP Response", void 0, f);
      return _;
    }
    let v = _;
    if (_.statusCode === 200 && (v = ss(new Uint8Array(_.response))), v.response && a) try {
      const y = JSON.parse(Ae(v.response));
      v.response = ne(y);
    } catch (y) {
      throw new c(c.UNEXPECTED, "Unexpected error parsing respondWith parameter", y);
    }
    return v;
  }));
}
function Vc(t, e, s, r, n, o, i, a, l, d, u) {
  if (g(["service", t, "object"], ["asset", e, "object"], ["componentId", s, "string"], ["contentType", n, "string"], ["maybeIsNew", o, "boolean", !0], ["size", i, "number", !0], ["blockSize", u, "number", !0], ["md5", a, "string", !0]), o && !zt(s)) throw new c(c.INVALID_PARAMS, "Component id is not a uuid");
  return zt(s) || Dc.warn("Existing component id is not a uuid"), qn({ svc: t, asset: e, dataOrSliceCallback: r, contentType: n, relation: h.COMPONENT, size: i, componentId: s, md5: a, maybeIsNew: o, additionalHeaders: d, progressCb: l, blockSize: u }).then(({ response: p, result: _, isBlockUpload: f, asset: b }) => {
    const A = { response: p, result: Object.assign(Object.assign({}, _), { id: s, type: n }), isBlockUpload: f, asset: b };
    return Object.defineProperty(A, "compositeAsset", { get: () => b }), A;
  });
}
function Fc(t, e, s, r) {
  return ct(t, e, [h.COMPONENT, h.BLOCK_UPLOAD_INIT], void 0, r).then((n) => {
    var o;
    const i = U(t);
    (o = oe(t)) === null || o === void 0 || o.setValueWithAsset(n, e), e.links = Object.assign(Object.assign({}, e.links), n);
    const a = vt(M(Object.assign(Object.assign({}, r), { [O.AUTHORIZATION]: i.authProvider.authToken, [O.X_API_KEY]: i.authProvider.apiKey })));
    return Promise.all(s.map((l) => ar(e, l.size) ? function(d, u, p, _) {
      const f = M({ "repo:reltype": h.COMPONENT, "repo:size": p.size, "dc:format": p.contentType, component_id: p.componentId });
      return cr(d, u, f, _).then((b) => {
        if (b.response.statusCode !== 200) throw new c(c.UNEXPECTED_RESPONSE, "Unexpected response from block upload init", b.response);
        const A = b.result;
        return { blockSize: A[B.REPO_BLOCK_SIZE], uploadRequestParameters: A[I.LINKS][h.BLOCK_TRANSFER].map(({ href: v }) => ({ href: v, method: R.PUT })), finalizeRequestParameters: { href: ee(A[I.LINKS], h.BLOCK_FINALIZE, {}), method: R.POST, headers: _, body: `${JSON.stringify(A)}` } };
      }).catch((b) => {
        throw new c(c.UNEXPECTED_RESPONSE, "Unexpected response from block upload init", b);
      });
    }(i, e, l, a) : function(d, u, p, _) {
      return N.resolve({ blockSize: p.size, uploadRequestParameters: [{ href: pr(d, u, p.componentId), method: R.PUT, headers: _ }] });
    }(i, e, l, a)));
  });
}
x("dcx:assets:directory");
const Ct = x("dcx:assets:directory:leaf");
function Qn(t) {
  var e;
  Ct("directoryTransformer()");
  const s = ne(t, (e = t[I.PAGE]) === null || e === void 0 ? void 0 : e.embed);
  s.links = ye({}, t.links, t._links);
  const r = t.children || t[I.CHILDREN];
  return r && r.length > 0 ? s.children = r.map((n) => ne(n)) : s.children = [], [s.assetId, s];
}
function Hc(t, e) {
  return Ct("getDirectoryByURL()"), t.invoke(R.GET, e, void 0, void 0, { responseType: "json", isStatusValid: C() }).then((s) => ({ result: s.response, response: s }));
}
function $c(t, e, s = {}, r) {
  if (Ct("getPagedChildren()"), V(e.links, [h.PAGE]), s && s.embed && s.embed.includes(h.REPOSITORY)) throw new c(c.INVALID_PARAMS, "Repository Resource embeds on directory listings are not supported");
  try {
    return new ns(e.links, t, Qn, "api:primary").getPage(s, r);
  } catch (n) {
    return N.reject(n);
  }
}
const Gc = es("AdobeDCX.createAsset", function(t, e, s, r, n, o, i = {}, a, l, d, u) {
  Ct("createAsset()"), g(["service", t, "object"], ["parentDir", e, "object"], ["relPath", s, "string"], ["createIntermediates", r, "boolean"], ["contentType", n, "string"], ["respondWith", o, ["string", "object"], !0], ["additionalHeaders", i, "object", !0], ["repoMetaPatch", d, "object", !0]);
  const p = S(o) ? JSON.stringify(o) : o;
  return ct(t, e, [h.CREATE]).then((_) => {
    const f = ee(_, h.CREATE, { path: s, intermediates: r.toString(), respondWith: p, mode: "id", repoMetaPatch: d }), b = Object.assign({}, { [O.CONTENT_TYPE]: n }, i), A = U(t), v = a ? Xe(a, l) : void 0, y = v ? xe(v) : 0;
    return a && ar(e, y) ? bt({ service: A, contentType: n, relation: h.PRIMARY, asset: e, dataOrSliceCallback: a, size: y, relPath: s, createIntermediates: r, respondWith: o, repoMetaPatch: d, additionalHeaders: i, progressCb: u }).then(({ result: P, response: m }) => {
      const D = s.split("/").slice(-1);
      return { result: M(Me({ name: D }, P)), response: m };
    }) : N.resolve().then(() => te(this, void 0, void 0, function* () {
      const P = Y(a) ? yield a(0, y) : v;
      return A.invoke(R.POST, f, b, P, { responseType: "json", isStatusValid: C([413]), reuseRequestDesc: { id: "createAsset", method: R.POST, href: f, headers: b, progress: u } }).then((m) => {
        var D;
        if (m.statusCode === 413) return bt({ service: A, contentType: n, relation: h.PRIMARY, asset: e, dataOrSliceCallback: a, size: xe(Xe(a, l)), relPath: s, createIntermediates: r, respondWith: o, repoMetaPatch: d, additionalHeaders: i, progressCb: u }).catch((ie) => {
          var be;
          if (ie.problemType === K.ASSET_NAME_CONFLICT) {
            const de = { assetId: (be = ie.response.response) === null || be === void 0 ? void 0 : be["repo:assetId"], links: _e(ie.response) };
            return bt({ service: A, contentType: n, relation: h.PRIMARY, asset: de, dataOrSliceCallback: a, size: xe(Xe(a, l)), relPath: s, createIntermediates: r, respondWith: o, repoMetaPatch: d, additionalHeaders: i, progressCb: u });
          }
          throw ie;
        }).then(({ result: ie, response: be }) => {
          const de = s.split("/")[s.split("/").length - 1];
          return { result: M(Me({ name: de }, ie)), response: be };
        });
        const k = s.split("/")[s.split("/").length - 1];
        let j;
        e.path && (j = rn(e.path, s));
        const X = _e(m), H = m.headers;
        if (!((D = H[O.CONTENT_TYPE]) === null || D === void 0) && D.includes("multipart/mixed")) {
          const ie = nr(m)[1];
          throw ie.statusCode === 404 ? new c(c.ASSET_NOT_FOUND, "Asset was created successfully but repository metadata could not be found.", void 0, m) : ie.statusCode === 403 ? new c(c.FORBIDDEN, "Asset was created successfully but Permission denied for fetching repository metadata.", void 0, m) : xs("Unexpected Server Response", void 0, m);
        }
        const me = S(m.response) ? m.response : { etag: "", md5: "" }, De = H["asset-id"] || H["x-resource-id"], Z = e.repositoryId;
        ue("assetId", De);
        let le = me.etag, Te = me.md5;
        o == null && (le = H.etag, Te = H["content-md5"]);
        const Ye = S(m.response) && o && (o === h.REPO_METADATA || S(o) && o.reltype === h.REPO_METADATA) ? ne(m.response) : {};
        m.response && (Ye.representations = m.response.representations || m.response[I.REPO_REPRESENTATIONS]);
        const ke = oe(t);
        return ke && ke.setValueWithAsset(X, Ye), { result: M(Me({ name: k }, Ye, M({ links: X, assetId: De, etag: le, md5: Te, repositoryId: Z, format: n, path: j }))), response: m };
      });
    }));
  });
});
function Yc(t, e, s, r, n = {}, o, i, a, l) {
  Ct("createAssetForGuest()"), g(["service", t, "object"], ["relPath", e, "string"], ["contentType", s, "string"], ["respondWith", r, ["string", "object"], !0], ["additionalHeaders", n, "object", !0], ["repoMetaPatch", a, "object", !0]);
  const d = S(r) ? JSON.stringify(r) : r, u = U(t);
  return function(p, _, f, b) {
    Nt("getCreateLinkForGuestUser"), g(["svc", p, "object"], ["assetPath", _, "string"]);
    const A = { path: _, mode: "id", intermediates: "true", repoMetaPatch: b, respondWith: f }, v = U(p), y = Ge(za, v);
    return N.resolve(je(y, M(A)));
  }(u, e, d, a).then((p) => {
    const _ = Object.assign({}, { [O.CONTENT_TYPE]: s }, n), f = o ? Xe(o, i) : void 0, b = f ? xe(f) : 0;
    return o && b > rs ? Is({ service: u, contentType: s, relation: h.PRIMARY, dataOrSliceCallback: o, size: b, relPath: e, respondWith: r, repoMetaPatch: a, additionalHeaders: n, progressCb: l }).then(({ result: A, response: v }) => {
      const y = e.split("/").slice(-1);
      return { result: M(Me({ name: y }, A)), response: v };
    }) : N.resolve().then(() => te(this, void 0, void 0, function* () {
      const A = Y(o) ? yield o(0, b) : f;
      return u.invoke(R.POST, p, _, A, { responseType: "json", isStatusValid: C([413]), reuseRequestDesc: { id: "createAssetForGuest", method: R.POST, href: p, headers: _, progress: l } }).then((v) => {
        var y;
        if (v.statusCode === 413) return Is({ service: u, contentType: s, relation: h.PRIMARY, dataOrSliceCallback: o, size: xe(Xe(o, i)), relPath: e, respondWith: r, repoMetaPatch: a, additionalHeaders: n, progressCb: l }).catch((le) => {
          if (le.problemType === K.ASSET_NAME_CONFLICT) return Is({ service: u, contentType: s, relation: h.PRIMARY, dataOrSliceCallback: o, size: xe(Xe(o, i)), relPath: e, respondWith: r, repoMetaPatch: a, additionalHeaders: n, progressCb: l });
          throw le;
        }).then(({ result: le, response: Te }) => {
          const Ye = e.split("/")[e.split("/").length - 1];
          return { result: M(Me({ name: Ye }, le)), response: Te };
        });
        const P = e.split("/")[e.split("/").length - 1], m = _e(v), D = v.headers;
        if (!((y = D[O.CONTENT_TYPE]) === null || y === void 0) && y.includes("multipart/mixed")) {
          const le = nr(v)[1];
          throw le.statusCode === 404 ? new c(c.ASSET_NOT_FOUND, "Asset was created successfully but repository metadata could not be found.", void 0, v) : le.statusCode === 403 ? new c(c.FORBIDDEN, "Asset was created successfully but Permission denied for fetching repository metadata.", void 0, v) : xs("Unexpected Server Response", void 0, v);
        }
        const k = S(v.response) ? v.response : { etag: "", md5: "" }, j = D["asset-id"] || D["x-resource-id"], X = D["repository-id"];
        let H = k.etag, me = k.md5;
        r == null && (H = D.etag, me = D["content-md5"]);
        const De = S(v.response) && r && (r === h.REPO_METADATA || S(r) && r.reltype === h.REPO_METADATA) ? ne(v.response) : {}, Z = oe(t);
        return Z && Z.setValueWithAsset(m, De), { result: M(Me({ name: P }, De, M({ links: m, assetId: j, etag: H, md5: me, format: s, repositoryId: X, path: e }))), response: v };
      });
    }));
  });
}
const is = x("dcx:assets:discoverable");
function qc(t, e = {}, s) {
  is("getDiscoverableAssets()"), g(["svc", t, "object"], ["pageOpts", e, "object"]);
  const r = U(t);
  return wn(t, s).then((n) => new ns(n.assetLinks, r, zc, "api:primary").getPage(e, s)).then((n) => ({ result: n.response.response, paged: n.paged, response: n.response }));
}
function zc(t) {
  is("discoverableAssetTransformer()");
  const e = t[I.EMBEDDED][h.REPO_METADATA], s = ne(e, t[I.EMBEDDED]);
  return s.links = ye({}, t.links, e._links), [s.assetId, s];
}
function Wc(t) {
  is("discoverableReposTransformer()");
  const e = t[I.EMBEDDED][h.PRIMARY], s = er(e);
  return s.links = e._links, [s.repositoryId, s];
}
function Kc(t, e = {}, s) {
  is("getDiscoverableRepos()"), g(["svc", t, "object"], ["pageOpts", e, "object"]);
  const r = U(t), n = Ge("/repositories", r);
  return N.resolve(void 0).then(() => te(this, void 0, void 0, function* () {
    const o = oe(t);
    let i;
    return o && (i = yield o.getRepositoryLinks()), !i && (i = _e(yield r.invoke(R.HEAD, n, s, void 0, { isStatusValid: C() }))), o && o.setRepositoryLinks(i), new ns(i, r, Wc).getPage(e, s);
  })).then((o) => ({ result: o.response.response, paged: o.paged, response: o.response }));
}
x("dcx:assets:factory");
const eo = x("dcx:assets:indexdocument");
function Xc(t, e) {
  eo("getIndexDocument()"), g(["svc", t, "object"]);
  const s = U(t), r = Ge("/index", s);
  return s.invoke(R.GET, r, e, void 0, { responseType: "json", isStatusValid: C() }).then((n) => ({ result: Zc(n.response), response: n.response }));
}
function Zc(t) {
  eo("deserializeIndexDocument()");
  const e = t.children.map((s) => {
    const r = ne(s[I.EMBEDDED][h.REPO_METADATA]), n = er(s[I.EMBEDDED][h.REPOSITORY]);
    return r.embedded = { RepositoryResource: n }, r;
  });
  return { regions: t[I.REPO_REGIONS], assignedDirectories: e, links: t._links };
}
const Jc = 1e5;
class Qc {
  constructor(e = 1e5, s = "SESSION") {
    if (this.values = {}, this.maxEntries = Jc, this.promiseToResolveMap = /* @__PURE__ */ new Map(), e <= 0) throw new c(c.INVALID_PARAMS, "Cache Max enteries must be great than 0.");
    this.maxEntries = e, this.defaultSessionKey = s;
  }
  clear() {
    this.promiseToResolveMap.forEach((e) => {
      e.call(void 0);
    });
    for (const e in this.values) this.values[e].clear();
    this.values = {};
  }
  getKey(e) {
    if (e.assetId || typeof e != "object") return e.assetId;
  }
  getValueWithAsset(e) {
    if (!e.assetId && typeof e == "object") return;
    const s = this.getKey(e);
    return s ? this.get(s, e.repositoryId) : void 0;
  }
  setPending(e, s = this.defaultSessionKey) {
    let r;
    this.values[s] || (this.values[s] = /* @__PURE__ */ new Map());
    const n = this.values[s].get(e);
    if (n && n instanceof Promise) return this.promiseToResolveMap.get(n);
    const o = new Promise((i) => {
      r = i;
    });
    return this.values[s].set(e, o), this.promiseToResolveMap.set(o, r), o.then(() => this.promiseToResolveMap.delete(o)).catch(() => this.promiseToResolveMap.delete(o)), r;
  }
  get(e, s = this.defaultSessionKey) {
    if (this.values[s] && s in this.values) return this.values[s].get(e);
  }
  setValueWithAsset(e, s) {
    if (!e) return;
    const r = this.getKey(s);
    if (r) {
      const n = s.repositoryId || this.defaultSessionKey;
      this.set(e, r, n);
    }
  }
  set(e, s, r = this.defaultSessionKey) {
    if (this.values[r]) {
      if (this.values[r] && this.values[r].get(s) instanceof Promise) {
        const n = this.values[r].get(s), o = this.promiseToResolveMap.get(n);
        this.promiseToResolveMap.delete(n), o && o(e);
      }
    } else this.values[r] = /* @__PURE__ */ new Map();
    if (this.values[r].size >= this.maxEntries) {
      const n = this.values[r].keys().next().value;
      this.values[r].delete(n);
    }
    this.values[r].set(s, Promise.resolve(e));
  }
  delete(e, s = this.defaultSessionKey) {
    this.values[s] && this.values[s].delete(e);
  }
  deleteWithAsset(e) {
    const s = this.getKey(e);
    s && this.delete(s, e.repositoryId);
  }
}
class to extends Qc {
  constructor(e = 1e5, s = 2592e6) {
    super(e, "SESSION"), this.timestampsOnLinkCreation = 0, this.maxCachePeriodMS = 0, this.maxCachePeriodMS = s;
  }
  isLinkExpired() {
    return this.maxCachePeriodMS < Date.now() - this.timestampsOnLinkCreation;
  }
  setIndexLinks(e) {
    this.set(e, "INDEX", "SESSION"), this.timestampsOnLinkCreation = Date.now();
  }
  getIndexLinks() {
    if (!this.isLinkExpired()) return this.get("INDEX", "SESSION");
  }
  setIndexRepository(e) {
    this.indexRepository = e;
  }
  getIndexRepository() {
    return this.indexRepository;
  }
  setRepositoryLinks(e) {
    this.set(e, "/Repositories", "SESSION"), this.timestampsOnLinkCreation = Date.now();
  }
  getRepositoryLinks() {
    if (!this.isLinkExpired()) return this.get("/Repositories", "SESSION");
  }
}
var Xr, Zr;
(function(t) {
  t.IMAGE_JPG = "image/jpg", t.IMAGE_PNG = "image/png", t.IMAGE_GIF = "image/gif", t.VIDEO_MP4 = "video/mp4", t.VIDEO_METADATA = "application/vnd.adobe.ccv.videometadata";
})(Xr || (Xr = {})), function(t) {
  t.NONE = "none", t.EMBEDDED = "embedded";
}(Zr || (Zr = {}));
x("dcx:assets:versionset");
const el = x("dcx:assets:versionset:leaf");
function tl(t) {
  el("deserializeVersionSet()");
  const e = { versionCount: t[Le.TOTAL_CHILDREN], repositoryId: t[Le.REPO_ID], assetId: t[I.REPO_ASSET_ID], links: {}, versions: [] }, s = t.children || t[I.CHILDREN];
  return s && s.length > 0 && (e.versions = s.map((r) => dr(r))), e.links = t._links, e;
}
function st(t, e, s, r) {
  var n, o = arguments.length, i = o < 3 ? e : r === null ? r = Object.getOwnPropertyDescriptor(e, s) : r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, s, r);
  else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (i = (o < 3 ? n(i) : o > 3 ? n(e, s, i) : n(e, s)) || i);
  return o > 3 && i && Object.defineProperty(e, s, i), i;
}
const sl = "0", rl = "md5";
class nl {
  constructor(e, s, r, n, o, i) {
    this.id = e, this.etag = s, this.version = r, this.md5 = n, this.length = o, this.type = i;
  }
}
class ol {
  constructor(e, s, r) {
    this.compositeId = e, this.compositeAssetId = s, this.repositoryId = r, this.records = {};
  }
  addUploadRecord(e, s) {
    g(["componentId", e, "string"], ["record", s, "object"]), this.records[e] = s;
  }
  getComponentDescriptor(e) {
    const s = this._checkRAPIComponentParams(e);
    return JSON.stringify(function(r, n, o, i) {
      try {
        ln(i, "UploadRecord", ["id", "string"], ["version", "string"], ["length", "number"], ["etag", "string"], ["type", "string"]);
      } catch (l) {
        throw new c(c.INVALID_STATE, "Invalid record data", l);
      }
      const a = { versionId: sl, componentId: i.id, cloudAssetId: r, compositeId: n, repositoryId: o, componentRevisionId: i.version, type: i.type, cloudExpiration: void 0, size: i.length, etag: i.etag, hashType: rl, hashValue: i.md5 };
      return M(a);
    }(this.compositeAssetId, this.compositeId, this.repositoryId, s));
  }
  getComponentURL(e, s) {
    const r = this._checkRAPIComponentParams(s);
    return e.getCompositeComponentUrlForDownload({ repositoryId: this.repositoryId, assetId: this.compositeAssetId }, s, r.length, r.version);
  }
  getComponent(e, s, r) {
    const n = this._checkRAPIComponentParams(s);
    return e.getCompositeComponent({ repositoryId: this.repositoryId, assetId: this.compositeAssetId }, s, n.version, r);
  }
  _checkRAPIComponentParams(e) {
    if (!this.repositoryId) throw new c(c.INVALID_STATE, "Repository ID must be defined.", void 0, void 0, { componentId: e });
    const s = this.records[e];
    if (!s) throw new c(c.INVALID_PARAMS, "UploadRecord does not exist", void 0, void 0, { componentId: e });
    return s;
  }
}
function Jr(t, e, s) {
  return g(["compositeId", t, "string", !0], ["compositeAssetId", e, "string"], ["repositoryId", s, ["string", "undefined"]]), new ol(t, e, s);
}
function il(t, e, s, r, n, o) {
  return g(["componentId", t, "string"], ["etag", e, "string"], ["version", s, "string"], ["md5", r, "string"], ["length", n, "number"], ["type", o, "string"]), new nl(t, e, s, r, n, o);
}
function al(t, e, s) {
  g(["repoUploadResults", e, "object"], ["compositeId", s, "string", !0]), ln(e, "repoUploadResults", ["result", "object"]);
  const r = e.asset || e.compositeAsset, { result: n } = e;
  if (!(r.assetId && r.repositoryId || r.links || n.links)) throw new c(c.INVALID_PARAMS, "AdobeRepoUploadResult#asset object missing repositoryId or assetId, and links");
  const o = il(n.id, n.etag, n.revision, n.md5, n.length, n.type);
  let i;
  if (r.assetId && r.repositoryId) i = N.resolve(Jr(s, r.assetId, r.repositoryId));
  else {
    g(["session", t, "object"]);
    const a = r.links || n.links, l = Rn(a, [h.PRIMARY, h.ID, h.PATH, h.COMPONENT]), d = ee(a, l, { component_id: "manifest" });
    i = t.headHTTPResource(d).then((u) => {
      const p = u.headers["repository-id"], _ = u.headers["asset-id"];
      if (!p || !_) throw new c(c.INVALID_DATA, "Fetched data missing repositoryId or assetId");
      return Jr(s, _, p);
    });
  }
  return i.then((a) => (a.addUploadRecord(n.id, o), a));
}
const Qr = x("dcx:repoapisession"), cl = ce.getInstance(), en = "+dcx";
let He = class {
  constructor(t, e, s) {
    this._authenticationAllowList = ["adobe.com", "adobe.io", "adobelogin.com", "fotolia.net"], this._blockUploadThreshold = rs, g(["httpService", t, "object"], ["server", e, "string"]), this._service = t, this._service._repoAPIBaseUrl = e;
    const r = vs(e);
    if (!r) throw new c(c.INVALID_PARAMS, "Could not determine endpoint from: " + e);
    this._endPoint = r, S(s) && Y(s.getIndexLinks) ? this._linksCache = s : this._linksCache = new to();
  }
  get serviceConfig() {
    return { service: this._service, cache: this._linksCache };
  }
  get blockUploadThreshold() {
    return this._blockUploadThreshold;
  }
  set blockUploadThreshold(t) {
    $e("threshold", t, "+number"), this._blockUploadThreshold = t;
  }
  get blockDownloadThreshold() {
    return Yn();
  }
  set blockDownloadThreshold(t) {
    $e("threshold", t, "+number"), gc(t);
  }
  createAsset(t, e, s, r, n, o, i, a, l) {
    return Gc(this._service, t, e, s, r, n, o, i, a, l);
  }
  createAssetForGuest(t, e, s, r, n, o, i, a) {
    return Yc(this._service, t, e, s, r, n, o, i, a);
  }
  createComposite(t, e, s, r, n, o, i, a) {
    if (Qr("createComposite()"), g(["parentDir", t, "object"], ["relPath", e, "string"], ["contentType", s, "string"]), !s.endsWith(en)) throw new c(c.INVALID_PARAMS, `Composite contentType must end in "${en}"`);
    if (!Xt(t)) throw new c(c.INVALID_PARAMS, "parentDir must contain links or repositoryId & assetId or path");
    return this.createAsset(t, e, !0, o && s.endsWith("dcx") ? s + "ucf" : s, r, n, o, i, a).catch((l) => {
      if (!l.response || l.response.statusCode !== 409) throw xs("Error creating composite", l, l.response);
      if (l.response.headers.link) {
        const d = _e(l.response);
        this._linksCache.setValueWithAsset(d, { assetId: l.response.headers["asset-id"] || l.response.headers["x-resource-id"], repositoryId: t.repositoryId });
      }
      throw new c(c.ALREADY_EXISTS, "Composite already exists at " + e, void 0, l.response);
    });
  }
  copyResources(t, e, s, r, n, o) {
    return pc(this._service, t, e, s, r, n, o);
  }
  getIndexLinks(t) {
    return kn(this.serviceConfig, t);
  }
  getIndexRepository(t) {
    return wn(this.serviceConfig, t);
  }
  getIndexDocument(t) {
    return Xc(this.serviceConfig, t);
  }
  getDiscoverableAssets(t = {}, e) {
    return qc(this.serviceConfig, t, e);
  }
  getDiscoverableRepos(t = {}, e) {
    return Kc(this.serviceConfig, t, e);
  }
  headHTTPResource(t, e) {
    return Qs(this._service, t, e);
  }
  headCompositeManifest(t, e) {
    return this.fetchLinksIfMissing(t, [h.COMPONENT], e).then(() => kc(this._service, t, e));
  }
  resolveAsset(t, e = "id", s, r, n) {
    return ir(this.serviceConfig, t, e, s, r, n);
  }
  headPrimaryResource(t, e) {
    return this.fetchLinksIfMissing(t, [h.PRIMARY], e).then(() => $a(this.serviceConfig, t, e));
  }
  getRepoMetadata(t, e) {
    return t.assetId && ue("assetId", t.assetId), this.useLinkOrResolveResource(t, h.REPO_METADATA, "json", e).then((s) => ({ result: ne(s.response.response), response: s.response }));
  }
  updateRepoMetadata(t, e) {
    return this.fetchLinksIfMissing(t, [h.REPO_METADATA], e).then(() => Za(this.serviceConfig.service, t, e));
  }
  getEmbeddedMetadata(t, e = "json", s) {
    return g(["asset", t, "object"], ["format", e, "enum", !1, ["json", "xml"]]), this.fetchLinksIfMissing(t, [h.EMBEDDED_METADATA], s).then(() => yc(this._service, t, e));
  }
  putEmbeddedMetadata(t, e, s, r = "json", n) {
    return g(["asset", t, "object"], ["data", e, ["string", "object", "object[]"]], ["etag", s, "string", !0], ["format", r, "enum", !1, ["json", "xml"]]), this.fetchLinksIfMissing(t, [h.EMBEDDED_METADATA], n).then(() => vc(this._service, t, e, s, r, n));
  }
  patchEmbeddedMetadata(t, e, s, r) {
    return g(["asset", t, "object"], ["data", e, ["string", "object", "object[]"]], ["etag", s, "string", !0]), this.fetchLinksIfMissing(t, [h.EMBEDDED_METADATA], r).then(() => Oc(this._service, t, e, s, r));
  }
  getDirectory(t, e, s) {
    return this.fetchLinksIfMissing(t, [h.PAGE], s).then(() => $c(this._service, t, e, s).then((r) => ({ result: Qn(r.paged.data)[1], paged: r.paged, response: r.response })));
  }
  getDirectoryByURL(t) {
    return Hc(this._service, t).then((e) => ({ response: e.response, result: ne(e.result) }));
  }
  getLinksForAsset(t, e) {
    return Xa(this.serviceConfig, t, e);
  }
  getACLPolicy(t, e) {
    return this.fetchLinksIfMissing(t, [h.ACL_POLICY], e).then(() => nc(this._service, t, e));
  }
  getPrimaryResource(t, e, s) {
    const r = {};
    return this._withSourcePromise(r).then(() => this.fetchLinksIfMissing(t, [h.PRIMARY], s)).then(() => Ha.call(r, this._service, t, e, s));
  }
  updatePrimaryResource(t, e, s, r, n, o, i) {
    return this.fetchLinksIfMissing(t, [h.PRIMARY], i).then(() => Pc(this._service, t, e, s, r, n, o, i));
  }
  getRepositoryResource(t, e) {
    return this.fetchLinksIfMissing(t, [h.REPOSITORY], e).then(() => Ja(this._service, t, e));
  }
  getVersions(t, e, s) {
    return this.fetchLinksIfMissing(t, [h.PAGE], s).then(() => Cc(this._service, t, e, s).then((r) => ({ result: tl(r.result), response: r.response, paged: r.paged })));
  }
  getVersionResource(t, e, s) {
    return this.fetchLinksIfMissing(t, [h.PAGE], s).then(() => Xn(this._service, t, e, s).then((r) => ({ result: dr(r.result), response: r.response })));
  }
  blockDownloadAsset(t, e, s, r, n, o, i, a) {
    if (typeof t == "string") return Wr(this._service, t, e, s, r, n, o, i, a);
    const l = {};
    return this._withSourcePromise(l).then(() => this.fetchLinksIfMissing(t, [h.PRIMARY])).then(() => Wr.call(l, this._service, t, e, s, r, n, o, i, a));
  }
  fetchLinksIfMissing(t, e, s) {
    return ct(this.serviceConfig, t, e, void 0, s);
  }
  useLinkOrResolveResource(t, e, s, r) {
    return cc(this.serviceConfig, t, e, s, r).then((n) => (t.links !== n.result.links && (t.links = ye(t.links || {}, n.result.links), this._linksCache.setValueWithAsset(t.links, t)), n));
  }
  getLinkHrefForAsset(t, e, s = "id", r) {
    return this.fetchLinksIfMissing(t, [e], r).then((n) => F(n, e, s));
  }
  getEffectivePrivileges(t, e) {
    return this.fetchLinksIfMissing(t, [h.EFFECTIVE_PRIVILAGES], e).then(() => rc(this._service, t, e));
  }
  checkACLPrivilege(t, e, s, r) {
    return this.fetchLinksIfMissing(t, [h.ACCESS_CHECK], r).then(() => oc(this._service, t, e, s, r));
  }
  headAppMetadata(t, e) {
    return this.fetchLinksIfMissing(t, [h.APP_METADATA], e).then(() => Qa(this.serviceConfig, t, e));
  }
  getAppMetadata(t, e, s) {
    return this.fetchLinksIfMissing(t, [h.APP_METADATA], s).then(() => ec(this._service, t, e, s));
  }
  putAppMetadata(t, e, s, r) {
    return this.fetchLinksIfMissing(t, [h.APP_METADATA], r).then(() => tc(this._service, t, e, s, r));
  }
  patchAppMetadata(t, e, s, r) {
    return this.fetchLinksIfMissing(t, [h.APP_METADATA], r).then(() => sc(this._service, t, e, s));
  }
  getCompositeManifestUrl(t, e, s) {
    g(["asset", t, "object"], ["version", e, "string", !0]);
    const r = this._getAsAdobeAsset(t);
    return r.version = e || r.version, this.fetchLinksIfMissing(r, [h.MANIFEST], s).then(() => os(this._service, r, e, s));
  }
  getCompositeManifest(t, e, s, r) {
    g(["asset", t, "object"], ["version", e, "string", !0], ["etag", s, "string", !0]);
    const n = this._getAsAdobeAsset(t);
    return n.version = e || n.version, this.fetchLinksIfMissing(n, [h.MANIFEST], r).then(() => wc(this._service, n, e, s, r));
  }
  getManifestAndComponentsByPath(t, e, s, r, n) {
    return Mc(this.serviceConfig.service, t, e, s, r, n);
  }
  getRendition(t, e, s, r, n) {
    return this.fetchLinksIfMissing(t, [h.RENDITION]).then(() => Rc(this._service, t, e, s, r, n));
  }
  getCompositeComponentUrlForDownload(t, e, s, r, n) {
    var o;
    const i = this._getAsAdobeAsset(t), a = (o = this._isDCXComponentLike(t) ? t.length : s) !== null && o !== void 0 ? o : 0, { id: l, revision: d } = this._resolveComponentIdAndRevision(t, e, r);
    return a > this.blockDownloadThreshold ? Jn(this.serviceConfig, i, l, d, n).then(({ response: u, result: p }) => ({ response: u, isPresignedUrl: !0, url: p })) : this.getCompositeComponentUrl(i, l, d, n).then((u) => ({ response: void 0, url: u, isPresignedUrl: !1 }));
  }
  getCompositeComponentUrl(t, e, s, r) {
    const n = this._getAsAdobeAsset(t), { id: o, revision: i } = this._resolveComponentIdAndRevision(t, e, s, !1);
    return this.fetchLinksIfMissing(n, [h.COMPONENT], r).then(() => (g(["asset", n, "object"], ["componentId", o, "string"], ["componentRevision", i, "string", !0]), pr(this._service, n, o, i)));
  }
  getCompositeComponentByPath(t, e, s, r, n) {
    return Bc(this._service, this._getAsAdobeAsset(t), e, s, r, n);
  }
  getCompositeComponent(t, e, s, r, n, o) {
    const i = this._getAsAdobeAsset(t), { id: a, revision: l } = this._resolveComponentIdAndRevision(t, e, s);
    return i.assetId && ue("assetId", i.assetId), e && ue("componentId", e), o && ue("componentSize", String(o)), this.fetchLinksIfMissing(i, [h.COMPONENT], n).then(() => (g(["asset", t, "object"], ["componentId", a, "string"], ["componentRevision", l, "string"], ["responseType", r, "enum", !0, Js]), jc(this._service, i, a, l, r, n, this._isDCXComponentLike(t) ? t.length : o)));
  }
  putCompositeComponent(t, e, s, r, n, o, i, a, l, d) {
    if (g(["asset", t, "object"], ["componentId", e, "string"], ["contentType", r, "string"], ["maybeIsNew", n, "boolean", !0], ["size", o, "number", !0], ["md5", i, "string", !0]), n && !zt(e)) throw new c(c.INVALID_PARAMS, "Component id is not a uuid");
    zt(e) || cl.warn("Existing component id is not a uuid");
    const u = this._getAsAdobeAsset(t);
    return (u.assetId || u.id) && ue("assetId", u.assetId || u.id), ue("componentId", e), o && ue("componentSize", String(o)), this.fetchLinksIfMissing(u, [h.COMPONENT, h.BLOCK_UPLOAD_INIT], l).then(() => Vc(this.serviceConfig, t, e, s, r, n, o, i, a, l, d));
  }
  getCompositeComponentsUrlsForUpload(t, e, s) {
    return Fc(this._service, t, e, s);
  }
  performBulkRequest(t, e, s, r) {
    return this.fetchLinksIfMissing(t, [h.BULK_REQUEST], r).then(() => or(this._service, t, e, s, r));
  }
  updateCompositeManifest(t, e, s, r = 1, n, o) {
    Qr("updateCompositeManifest()"), g(["asset", t, "object"], ["manifest", e, ["object", "string"]], ["overwrite", s, "boolean"], ["validationLevel", r, "+number"], ["etag", n, "string", !0]);
    const i = this._getAsAdobeAsset(t);
    return this.fetchLinksIfMissing(i, [h.MANIFEST], o).then(() => ws(this._service, i, e, s, r, n, o));
  }
  patchVersions(t, e, s, r) {
    return g(["asset", t, "object"], ["patchDoc", e, ["string", "array"]], ["etag", s, "string", !0]), this.fetchLinksIfMissing(t, [h.VERSION_HISTORY], r).then(() => Nc(this._service, t, e, s, r));
  }
  patchACLPolicy(t, e, s, r) {
    return g(["asset", t, "object"], ["policy", e, ["string", "object"]], ["etag", s, "string", !0]), this.fetchLinksIfMissing(t, [h.VERSION_HISTORY], r).then(() => ic(this._service, t, e, s, r));
  }
  deleteACLPolicy(t, e) {
    return g(["asset", t, "object"]), this.fetchLinksIfMissing(t, [h.ACL_POLICY], e).then(() => ac(this._service, t, e));
  }
  copyAsset(t, e, s, r, n, o) {
    return ba(this.serviceConfig, t, e, s, r, n, o);
  }
  moveAsset(t, e, s, r, n) {
    return ue("sourceAsset.assetId", t.assetId), ue("targetAsset.assetId", e.assetId), ya(this.serviceConfig, t, e, s, r, n);
  }
  deleteAsset(t, e, s, r) {
    return Oa(this.serviceConfig, { repositoryId: t.repositoryId, path: t.path, assetId: t.assetId }, e, s, r).then((n) => (this._linksCache.deleteWithAsset(t), n));
  }
  discardAsset(t, e, s, r) {
    return va(this.serviceConfig, { repositoryId: t.repositoryId, path: t.path, assetId: t.assetId }, e, s, r);
  }
  restoreAsset(t, e) {
    return Ra(this.serviceConfig, t, e);
  }
  packageAssets(t, e, s, r, n) {
    return Pa(this.serviceConfig, t, e, s, r, n);
  }
  performOperation(t, e) {
    return Ce(this.serviceConfig, e).then((s) => Be(this._service, s, t, e));
  }
  performBatchOperation(t, e) {
    return Ce(this.serviceConfig).then((s) => Sa(this._service, s, t, e));
  }
  uploadResultsFromAdobeRepoUploadResult(t, e) {
    return al(this, t, e);
  }
  updateCachedAssetLinks(t) {
    if (!t.assetId) throw new c(c.INVALID_PARAMS, "Asset must contain an assetId");
    this._linksCache.setValueWithAsset(t.links || t._links, t);
  }
  updateCachedIndexLinks(t) {
    if (!t) throw new c(c.INVALID_PARAMS, "Index LinkSet must not be null");
    this._linksCache.setIndexLinks(t);
  }
  getLinksCache() {
    return this._linksCache;
  }
  setLinksCache(t) {
    this._linksCache = t;
  }
  clearLinksCache() {
    this._linksCache.clear();
  }
  _resolveComponentIdAndRevision(t, e, s, r = !0) {
    var n;
    if (this._isDCXComponentLike(t)) return { revision: t.version, id: t.id };
    if (!e) throw new c(c.INVALID_PARAMS, "Missing componentId.");
    if (r === !1 || s) return { revision: s, id: e };
    if (!Cs(t) || !e) throw new c(c.INVALID_PARAMS, "Could not determine component revision");
    const o = (n = t.current) === null || n === void 0 ? void 0 : n.getComponentWithId(e);
    if (o?.version === void 0) throw new c(c.INVALID_PARAMS, "Could not determine component revision");
    return { revision: o.version, id: e };
  }
  _isDCXComponentLike(t) {
    return !!S(t) && t.owner != null && $r(t.owner);
  }
  _withSourcePromise(t) {
    return N.resolve(void 0, t);
  }
  _getAsAdobeAsset(t) {
    if (typeof t != "object" || Array.isArray(t)) throw new c(c.INVALID_PARAMS, "Invalid asset-like object.");
    if (Xt(t)) return t;
    let e, s = {};
    if (("repositoryId" in t || "assetId" in t || "links" in t || "version" in t) && (s = { repositoryId: t.repositoryId, assetId: t.assetId, links: t.links, version: t.version }), $r(t) && (e = t._core), this._isDCXComponentLike(t) || e) {
      const o = t, i = e || (o && o.owner && o.owner._core ? o.owner._core : void 0);
      if (i) {
        const a = i._getSourceAssetInfoOfComponent(s);
        a && typeof a == "object" && (s.assetId = a.compositeAssetId || s.assetId, s.repositoryId = a.compositeRepositoryId || s.repositoryId, s.links = a.links || s.links, s.version = a.version || s.version);
      }
    }
    const r = t, n = t;
    return s.assetId = s.assetId ? s.assetId : r.owner ? r.owner.compositeAssetId : n.compositeAssetId, s.repositoryId = s.repositoryId ? s.repositoryId : r.owner ? r.owner.compositeRepositoryId : n.compositeRepositoryId, s;
  }
  get authenticationAllowList() {
    return this._authenticationAllowList;
  }
  set authenticationAllowList(t) {
    if (!Array.isArray(t)) throw new c(c.INVALID_PARAMS, "Expecting an array.");
    this._authenticationAllowList = t;
  }
  _resolveUrl(t) {
    return vs(t) ? t : rn(this._service._repoAPIBaseUrl || this._service.server, t);
  }
  registerLinks(t, e, s) {
    t = t._links || t;
    const r = { assetId: s || "urn:aaid:faux:" + qt(), repositoryId: e || "faux-repo-id" };
    return this._linksCache.setValueWithAsset(t, r), r;
  }
};
st([_t], He.prototype, "getRepoMetadata", null), st([_t], He.prototype, "getAppMetadata", null), st([_t], He.prototype, "getCompositeComponent", null), st([_t], He.prototype, "putCompositeComponent", null), st([_t], He.prototype, "moveAsset", null), He = st([aa("AdobeRepoAPISession")], He);
const ll = (t, e, s) => new He(t, e, s), dl = "https://platform-cs-stage.adobe.io", ul = "AdobeExpressWeb", hl = "assets", Ve = {
  UPLOAD_FAILED: {
    code: "UPLOAD_FAILED",
    message: "Failed to upload asset. Please try again."
  },
  URL_GENERATION_FAILED: {
    code: "URL_GENERATION_FAILED",
    message: "Failed to generate pre-signed URL"
  },
  REPOSITORY_ID_REQUIRED: {
    code: "REPOSITORY_ID_REQUIRED",
    message: "Repository ID is required for normal token uploads"
  },
  REPOSITORY_ID_REQUIRED_FOR_DIRECTORY: {
    code: "REPOSITORY_ID_REQUIRED_FOR_DIRECTORY",
    message: "Repository ID required for directory operations"
  }
}, pl = {
  UPLOAD_STATUS: "x-express-upload-status"
};
function Ue(t, e, s, r) {
  return new (s || (s = Promise))(function(n, o) {
    function i(d) {
      try {
        l(r.next(d));
      } catch (u) {
        o(u);
      }
    }
    function a(d) {
      try {
        l(r.throw(d));
      } catch (u) {
        o(u);
      }
    }
    function l(d) {
      var u;
      d.done ? n(d.value) : (u = d.value, u instanceof s ? u : new s(function(p) {
        p(u);
      })).then(i, a);
    }
    l((r = r.apply(t, [])).next());
  });
}
const Re = x("dcx:http:auth");
class Ut {
  constructor(e, s, r) {
    this._authToken = e, this._apiKey = s, this._pendingAuth = !1, this._hasBaseRefreshCb = !1, this._authListeners = [], this._persistentListeners = [], this._authenticationAllowList = ["adobe.com", "adobe.io", "adobelogin.com", "fotolia.net"], this._authTokenScheme = "Bearer", g(["authToken", e, "string", !0], ["apiKey", s, "string", !0], ["refreshCb", r, "function", !0]), r && (this._hasBaseRefreshCb = !0, this.onChange((n, o) => {
      n === "unauthenticated" && r.call(null, o);
    }, !0)), e && s || (Re("init unauthenticated"), this._pendingAuth = !0, setTimeout(() => {
      Re("after tick", this._pendingAuth), this._pendingAuth && this.refreshAuth();
    }));
  }
  get authenticationAllowList() {
    return this._authenticationAllowList;
  }
  set authenticationAllowList(e) {
    if (!Array.isArray(e)) throw new c(c.INVALID_PARAMS, "Expecting an array.");
    this._authenticationAllowList = e;
  }
  get isNoAuthMode() {
    return !this._hasBaseRefreshCb;
  }
  set isNoAuthMode(e) {
    this._hasBaseRefreshCb = !e;
  }
  get apiKey() {
    return this._apiKey;
  }
  get authToken() {
    return this._authToken;
  }
  get authTokenScheme() {
    return this._authTokenScheme;
  }
  set authTokenScheme(e) {
    this._authTokenScheme = e;
  }
  setAuthToken(e) {
    Re("setAuthToken"), this._authToken = e, this._pendingAuth = !1, this._authChanged("updated");
  }
  setApiKey(e) {
    this._apiKey = e;
  }
  resume() {
    Re("resume()"), this._pendingAuth = !1, this._authChanged("updated");
  }
  get pendingAuth() {
    return this._pendingAuth;
  }
  onChange(e, s = !1) {
    Re("onChange, persistent:", s);
    const r = this._authListeners.push(e) - 1;
    return s && this._persistentListeners.push(r), () => {
      try {
        s && (this._persistentListeners = this._persistentListeners.filter((n) => n !== r)), delete this._authListeners[r];
      } catch {
      }
    };
  }
  clearListeners(e = !1) {
    if (Re("clearListeners, persistent:", e), e === !0) return this._authListeners = [], void (this._persistentListeners = []);
    this._authListeners = this._authListeners.map((s, r) => {
      if (this._persistentListeners.includes(r)) return s;
    });
  }
  get refreshPromise() {
    return this._refreshPromise;
  }
  _authChanged(e) {
    return Ue(this, void 0, void 0, function* () {
      Re("authChanged", e), this._pendingAuth = e === "unauthenticated", queueMicrotask(() => Ue(this, void 0, void 0, function* () {
        const s = [];
        this._authListeners.map((r) => {
          if (typeof r == "function") {
            const n = r.call(null, e, this);
            n && typeof n == "object" && n.then && s.push(n);
          }
        }), yield Promise.all(s), e === "updated" && this._resolveRefresh();
      }));
    });
  }
  _resolveRefresh() {
    Re("_resolveRefresh"), this._refreshResolve && this._refreshResolve(this.getAuthData()), this._refreshResolve = void 0, this._refreshPromise = void 0;
  }
  refreshAuth() {
    return Re("refreshAuth"), this._refreshPromise || (this._refreshPromise = new Promise((e) => {
      this._refreshResolve = e;
    }), this._authChanged("unauthenticated")), this._refreshPromise;
  }
  getAuthData() {
    return { authToken: this._authToken, apiKey: this._apiKey };
  }
  getAuth() {
    return Ue(this, void 0, void 0, function* () {
      return Promise.resolve(this.getAuthData());
    });
  }
  isAuthorizedURL(e) {
    const s = Io(e);
    return this._authenticationAllowList.includes(s);
  }
  logout() {
    Re("logout"), this._apiKey = void 0, this._authToken = void 0, this._pendingAuth === !1 && (this._pendingAuth = !0, this._authChanged("unauthenticated"));
  }
  applyAuthHeaders(e, s) {
    const r = { "x-api-key": void 0, authorization: void 0 };
    return this.isAuthorizedURL(e) && (s["x-api-key"] !== null && this.apiKey && (r["x-api-key"] = this.apiKey), s.authorization !== null && this.authToken && (r.authorization = (this.authTokenScheme ? `${this.authTokenScheme} ` : "") + this.authToken)), s = M(Object.assign(Object.assign({}, s), r));
  }
}
const Ls = 12e4, ms = 36e5, Ie = x("dcx:http:xhr");
let Ms;
if (Ms = typeof window < "u" ? window.XMLHttpRequest : XMLHttpRequest, Ms == null) throw new c(c.INVALID_STATE, "XMLHttpRequest module not found.");
const Q = { NO_ERROR: "", ABORTED: T.ABORTED, NETWORK: T.NETWORK_ERROR, TIMEOUT: T.TIMED_OUT, TOO_MANY_REDIRECTS: T.TOO_MANY_REDIRECTS, INSECURE_REDIRECT: T.INSECURE_REDIRECT };
class _l {
  constructor(e = {}) {
    this._autoParseJson = !1, this._bytesReported = 0, this._errorCode = Q.NO_ERROR, this._isFetchRequest = !1, this._fetchAbort = () => {
    }, this._preferFetch = !1, this._sent = !1, this.headers = {}, this.responseType = "text", this._progressListeners = [];
    const { forceXhr: s, preCallback: r, postCallback: n, timeout: o, preferFetch: i } = e;
    this._preCallback = r, this._postCallback = n, this._timeout = o == null || o < 0 ? Ls : o, this._xhr = s ? new s() : new Ms(), this._xhr.timeout = ms, this._preferFetch = i === !0, this._fetch = e.fetch ? e.fetch : typeof window < "u" && "fetch" in window && typeof window.fetch == "function" ? window.fetch.bind(window) : typeof self < "u" && "fetch" in self && typeof self.fetch == "function" ? self.fetch.bind(self) : typeof globalThis < "u" && "fetch" in globalThis && typeof globalThis.fetch == "function" ? globalThis.fetch.bind(globalThis) : void 0, this._parseFetchResponse = this._parseFetchResponse.bind(this), this.onProgress = this.onProgress.bind(this), this._autoParseJson = e.autoParseJson == null || e.autoParseJson, e.additionalNodeOptions && this._xhr.setNodeOptions && this._xhr.setNodeOptions(e.additionalNodeOptions), this._promise = new Promise((a) => {
      this._resolve = a, this._xhr.addEventListener("abort", () => {
        Ie("aborted", this._errorCode, this._timeout), this._errorCode = this._errorCode || Q.ABORTED, this._finalize();
      }), this._xhr.addEventListener("error", (l) => {
        switch (Ie("err", this._errorCode, l, this._xhr.status, this._timeout), this._underlyingError = l, l ? l.code : void 0) {
          case "ERR_FR_TOO_MANY_REDIRECTS":
            this._errorCode = Q.TOO_MANY_REDIRECTS;
            break;
          case c.INSECURE_REDIRECT:
            this._errorCode = Q.INSECURE_REDIRECT;
            break;
          case Q.TIMEOUT:
            this._errorCode = Q.TIMEOUT;
            break;
          default:
            this._errorCode = Q.NETWORK;
        }
        this._finalize();
      }), this._xhr.addEventListener("load", () => {
        Ie("load"), this._estimatedTotalBytes && this._estimatedTotalBytes > this._bytesReported && this._notifyProgressListeners(this._estimatedTotalBytes, this._estimatedTotalBytes, !1), this._finalize();
      }), this._xhr.addEventListener("timeout", () => {
        Ie("timeout", ms), this._errorCode = Q.TIMEOUT, this._finalize();
      });
    });
  }
  get xhr() {
    return this._xhr;
  }
  _parseFetchResponse(e) {
    return Ue(this, void 0, void 0, function* () {
      if (e.status === 204) return e;
      if (e.headers.get("transfer-encoding") === "chunked" || parseInt(e.headers.get("content-length") || "0") > 0) switch (this.responseType) {
        case "json":
          yr(e.headers.get("content-type") || "") && (this._fetchBodyAsResponseType = yield e.json());
          break;
        case "arraybuffer":
          this._fetchBodyAsResponseType = yield e.arrayBuffer();
          break;
        case "blob":
          this._fetchBodyAsResponseType = yield e.blob();
          break;
        case "text":
          this._fetchBodyAsResponseType = yield e.text();
          break;
        case "void":
          break;
        case "buffer":
        case "defaultbuffer":
          this._fetchBodyAsResponseType = yield e.arrayBuffer().then((s) => new Uint8Array(s));
      }
      return this.responseType === "stream" && (this._fetchBodyAsResponseType = e.body), e;
    });
  }
  _shouldAutoParseResponse() {
    const e = this._errorCode === Q.NO_ERROR && this._sent && !this._isFetchRequest && this._xhr.responseType === "text" && this._autoParseJson && typeof this._xhr.response == "string" && this._xhr.response.length < 102400 && yr(this.getResponseHeader("content-type"));
    return Ie("_shouldAutoParseResponse()", e), e;
  }
  _fetchWithTimeout(e, s = {}) {
    if (typeof this._fetch != "function") throw new c(c.UNEXPECTED, "fetch method not found but was invoked");
    const { timeout: r } = s, n = function(a, l) {
      var d = {};
      for (var u in a) Object.prototype.hasOwnProperty.call(a, u) && l.indexOf(u) < 0 && (d[u] = a[u]);
      if (a != null && typeof Object.getOwnPropertySymbols == "function") {
        var p = 0;
        for (u = Object.getOwnPropertySymbols(a); p < u.length; p++) l.indexOf(u[p]) < 0 && Object.prototype.propertyIsEnumerable.call(a, u[p]) && (d[u[p]] = a[u[p]]);
      }
      return d;
    }(s, ["timeout"]);
    this._isFetchRequest = !0;
    const o = (a) => () => {
      this._errorCode = this._errorCode || Q.TIMEOUT, a(new c(c.TIMED_OUT, "request aborted due to timeout")), this._finalize();
    };
    if (typeof AbortController != "function") return new Promise((a, l) => Ue(this, void 0, void 0, function* () {
      this._timeoutTimeout = setTimeout(o(l), r);
      const d = yield this._fetch(e, n);
      return clearTimeout(this._timeoutTimeout), this._parseFetchResponse(d).then(a);
    })).finally(() => {
      clearTimeout(this._timeoutTimeout);
    });
    const i = new AbortController();
    return this._timeoutTimeout = setTimeout(o(i.abort.bind(i)), r), this._fetchAbort = () => {
      this._errorCode = this._errorCode || Q.ABORTED, i.abort(), this._finalize();
    }, new Promise((a, l) => {
      this._fetch(e, Object.assign({ signal: i.signal }, n)).then((d) => (clearTimeout(this._timeoutTimeout), this._parseFetchResponse(d))).then(a).catch((d) => {
        clearTimeout(this._timeoutTimeout), l(d);
      });
    });
  }
  _finalize() {
    if (Ie("_finalize", this._xhr.status, this._errorCode), this._shouldAutoParseResponse()) try {
      const e = JSON.parse(this._xhr.response);
      this._autoParsedResponse = e, this._xhr.responseType = "json";
    } catch {
    }
    this._postCallback && this._postCallback(this), this._timeoutTimeout && clearTimeout(this._timeoutTimeout), this._progressListeners = [], this._resolve(this);
  }
  _validateResponseType(e) {
    if (e === "buffer") {
      if (typeof Buffer != "function") throw new c(c.INVALID_PARAMS, "No Buffer class");
    } else if (e === "blob") {
      if (typeof Blob != "function") throw new c(c.INVALID_PARAMS, "No Blob class");
    } else if (e !== "text" && e !== "json" && e !== "arraybuffer" && e !== "stream") throw new c(c.INVALID_PARAMS, "Unsupported response type");
    return e.toLowerCase();
  }
  inactivityTimer() {
    this._timeoutTimeout && clearTimeout(this._timeoutTimeout), this._timeoutTimeout = setTimeout(() => {
      this.timedOut();
    }, this._timeout);
  }
  send(e, s, r, n = {}, o = "text", i = {}) {
    if (Ie("send"), this._sent) throw new Error("Xhr already sent");
    this.href = e, this.method = s.toUpperCase(), this.body = r, this.body ? this._estimatedTotalBytes = this.body.byteLength || this.body.length || this.body.size : this._estimatedTotalBytes = Number.MAX_SAFE_INTEGER;
    const a = (d) => {
      var u;
      Ie(`progress ${d.loaded}/${d.total}`), this._bytesReported = d.loaded, this.inactivityTimer(), d.lengthComputable ? (this._estimatedTotalBytes = d.total, this._notifyProgressListeners(this._bytesReported, (u = this._estimatedTotalBytes) !== null && u !== void 0 ? u : 1 / 0, !1)) : this._estimatedTotalBytes && this._estimatedTotalBytes > this._bytesReported && this._notifyProgressListeners(this._bytesReported, this._estimatedTotalBytes || d.total, !0);
    };
    ["POST", "PUT", "PATCH"].includes(this.method) && this._xhr.upload ? this._xhr.upload.onprogress = a : this._xhr.addEventListener("progress", a), this._timeout = i.timeout || this._timeout || Ls, Ie("setting timeout", this._timeout), this._xhr.timeout = ms, o && (o = this._validateResponseType(o), Ie("responseType: ", o), this.responseType = o === "buffer" ? "arraybuffer" : o === "stream" ? "stream" : o === "void" ? "text" : o);
    const l = vt(n);
    if (this.headers = l, this.href.startsWith("http:") && this.headers.authorization !== null) throw new c(c.INVALID_PARAMS, "Must not send auth token over unsecured connection");
    if (this._preCallback && this._preCallback(this), (this._preferFetch || o === "stream") && typeof this._fetch == "function") return this._xhr.responseType = this.responseType, this._promise = new Promise((d, u) => {
      this._resolve = d, this._fetchWithTimeout(this.href, { body: ["GET", "HEAD"].includes(this.method.toUpperCase()) ? void 0 : r, credentials: i.withCredentials ? "include" : void 0, headers: l, method: this.method, timeout: this._timeout }).then((p) => {
        this._fetchResponse = p, this._finalize();
      }).catch((p) => {
        u(p);
      }), this._sent = !0;
    }), this._promise;
    this._xhr.open(this.method, this.href, !0), this._xhr.responseType = this.responseType;
    for (const [d, u] of Object.entries(l)) this._xhr.setRequestHeader(d, u);
    return i.withCredentials != null && (this._xhr.withCredentials = i.withCredentials), this.inactivityTimer(), r != null ? this._xhr.send(r) : this._xhr.send(), this._sent = !0, this._promise;
  }
  abort() {
    if (Ie("abort()"), !this._sent) throw new Error("Cannot abort before sending.");
    this._isFetchRequest ? this._fetchAbort() : this._xhr.abort();
  }
  timedOut() {
    if (Ie("timedOut()"), !this._sent) throw new Error("Cannot timed out before sending.");
    this._isFetchRequest || (this._xhr.abort(), this._errorCode = Q.TIMEOUT, this._finalize());
  }
  getResponseHeader(e) {
    if (!this._sent) throw new Error("Cannot getResponseHeader before sending.");
    const s = e.toLowerCase(), r = this.getAllResponseHeaders();
    if (s in r) return r[s];
  }
  getAllResponseHeaders() {
    var e, s;
    if (!this._sent) throw new Error("Cannot getAllResponseHeaders before sending.");
    if (this._parsedResponseHeaders) return this._parsedResponseHeaders;
    const r = this._isFetchRequest ? vo((s = (e = this._fetchResponse) === null || e === void 0 ? void 0 : e.headers.entries()) !== null && s !== void 0 ? s : []) : this._xhr.getAllResponseHeaders();
    return this._parsedResponseHeaders = typeof r == "string" ? Fs(r) : vt(r), this._parsedResponseHeaders;
  }
  isError() {
    if (!this._sent) throw new Error("Cannot check isError before sending.");
    return this._errorCode !== Q.NO_ERROR;
  }
  isAborted() {
    if (!this._sent) throw new Error("Cannot check isAborted before sending.");
    return this._errorCode === Q.ABORTED;
  }
  isTimedOut() {
    if (!this._sent) throw new Error("Cannot check isTimedOut before sending.");
    return this._errorCode === Q.TIMEOUT;
  }
  isSent() {
    return this._sent;
  }
  getErrorCode() {
    return this._errorCode;
  }
  getStatus() {
    if (!this._sent) throw new Error("Cannot getStatus before sending.");
    return this._fetchResponse ? this._fetchResponse.status : this._xhr.status;
  }
  getResponse() {
    var e;
    if (!this._sent) throw new Error("Cannot getResponse before sending.");
    return this._response || (this._response = { statusCode: this.getStatus(), headers: this.getAllResponseHeaders(), responseType: this._autoParsedResponse ? "json" : this.responseType, response: this.getResponseData(), message: this._isFetchRequest ? ((e = this._fetchResponse) === null || e === void 0 ? void 0 : e.statusText) || "" : this._xhr.statusText, xhr: this }, this._autoParsedResponse && (this._response.originalResponseData = this._xhr.response)), this._response;
  }
  toJSON() {
    return { statusCode: this.getStatus(), headers: this.getAllResponseHeaders(), responseType: this._autoParsedResponse ? "json" : this.responseType, response: this.getResponseData(), message: this._xhr.statusText };
  }
  getResponseDataAsJSON() {
    return Ue(this, void 0, void 0, function* () {
      try {
        if (this._fetchResponse) return yield this._fetchResponse.json();
        if (this._autoParsedResponse) return this._autoParsedResponse;
        if (this._xhr.responseType === "json") {
          if (typeof this._xhr.response == "string") return JSON.parse(this._xhr.response);
          if (this.xhr.response === null && ["application/problem+json", "application/json"].includes(this.xhr.getResponseHeader("content-type"))) throw new c(c.UNEXPECTED, "Unexpected response type");
          return this.xhr.response;
        }
        let e = this._xhr.response;
        if (this._xhr.responseType === "text" && this._xhr.responseText !== null) e = this._xhr.responseText;
        else if (this._xhr.responseType === "arraybuffer") e = Ae(this._xhr.response);
        else {
          if (this._xhr.responseType === "blob" && (e instanceof Blob || Y(e.text))) return JSON.parse(yield e.text());
          this.responseType === "stream" ? yield new Promise((s, r) => {
            if (e = "", typeof this.xhr.response.on == "function") return this.xhr.response.on("data", (n) => {
              e += n;
            }), this.xhr.response.on("end", s), void this.xhr.response.on("error", r);
            if (typeof this.xhr.response == "string") return s(e = this.xhr.response);
            throw new c(c.UNEXPECTED, "Unexpected response type");
          }) : e = this._xhr.responseText ? this._xhr.responseText : e;
        }
        return typeof e == "string" ? JSON.parse(e) : e;
      } catch (e) {
        throw new c(c.INVALID_JSON, "Could not parse response as JSON", e, this.toJSON());
      }
    });
  }
  getResponseData() {
    if (!this._sent) throw new Error("Cannot getResponseData before sending.");
    return this._isFetchRequest && this._fetchBodyAsResponseType ? this._fetchBodyAsResponseType : this._autoParsedResponse || this._xhr.response;
  }
  onProgress(e) {
    const s = this._progressListeners.push(e) - 1;
    return () => {
      try {
        delete this._progressListeners[s];
      } catch {
      }
    };
  }
  _notifyProgressListeners(e, s, r) {
    this._progressListeners.map((n) => n && n.call && n.call(null, e, s, r));
  }
}
const Fe = x("dcx:http:backoff");
function fl(t, e, s, r = {}, n, o = {}, i = !1) {
  const { disableRetry: a = !1, retryNetworkError: l = !0, responseType: d = "text", authCallback: u = null, progressListeners: p = [], initialWait: _ = 2e3, maxWait: f = 32e3, preCallback: b, postCallback: A, preScheduleCallback: v, postScheduleCallback: y, preferRetryAfterHeader: P = !0, pollCodes: m = [], pollHeader: D, pollMethod: k = "get", problemWithCode: j = { problemType: "", code: null, url: "" }, modifyHeadersCallback: X = null } = o;
  let { retryCodes: H = [], timeoutAfter: me = 72e3 } = o;
  H = i ? [...m, ...H] : a || _o(s) ? [] : o.retryCodes || cn, Fe("retry codes", H);
  const De = o.increase || ((z, J, L) => z === 1 ? L : J * J > f ? f : J * J);
  let Z = 0, le = 0, Te = !1;
  const Ye = re();
  let ke, ie, be, de, lt = re(), qe = 0, Dt = !1, _r = !1;
  const fr = [];
  let Er;
  function kt() {
    Fe("getSnapshot()", Te, Z, re(), lt, qe);
    const z = Te || ke != null ? 0 : Z - (re() - lt);
    let J = qe;
    J += Te ? re() - lt : 0;
    const L = (ke || re()) - Ye;
    return { count: le, canceled: Dt, timedOut: _r, requests: fr, duration: L, totalWaited: J, requestPending: Te, waitingFor: z };
  }
  function gr() {
    const z = De(le, Z, _);
    return Math.min(z, f);
  }
  function Tr(z) {
    if (z) return (J) => z(J, kt());
  }
  function Ir(z) {
    const J = z.getResponseHeader("retry-after");
    if (P && J) {
      if (isNaN(J)) {
        const L = Date.parse(J) - Date.now();
        return Fe("nextWait from retry-after", L), L < 0 ? gr() : L;
      }
      return 1e3 * parseInt(z.getResponseHeader("retry-after"));
    }
  }
  function et(z = Z) {
    return Ue(this, void 0, void 0, function* () {
      if (qe >= me) return Fe("timed out", qe, me), _r = !0, ie(de);
      lt = re(), v && (yield v(kt())), Fe("retry in ", z), Er = setTimeout(() => {
        var J;
        try {
          Fe("retry start"), xr(`Request: ${e.toUpperCase()} ${t} ${(J = r?.["x-request-id"]) !== null && J !== void 0 ? J : ""}`), Te = !0, qe += z, de = new _l(Object.assign(Object.assign({}, o), { timeout: n, preCallback: Tr(b), postCallback: Tr(A) })), fr.push(de), le++;
          for (const L of p) de.onProgress(L);
          de.send(t, e, s, r, d).then((L) => Ue(this, void 0, void 0, function* () {
            var cs, ls, ds;
            if (xr(`Response: ${e.toUpperCase()} ${t} ${(cs = L.headers) === null || cs === void 0 ? void 0 : cs["x-request-id"]} ${L.getStatus()}`), Te = !1, !L.isError() && !Et(L.getStatus(), H) && (L.getStatus() !== 401 || u == null) && (typeof D != "string" || m == null || !Et(L.getStatus(), m)) || j?.code === L.getStatus() && L.getResponseData() && j?.problemType !== ((ls = yield L.getResponseDataAsJSON()) === null || ls === void 0 ? void 0 : ls.type)) return ke = re(), ie(L);
            if (L.isAborted() || Dt) return ke = re(), Dt = !0, ie(L);
            if (!i && typeof D == "string" && m != null && Et(L.getStatus(), m)) {
              const dt = L.getResponseHeader(D.toLowerCase()), ut = j.url, Ar = ut && j.code === L.getStatus() && j.problemType === ((ds = L.getResponseData()) === null || ds === void 0 ? void 0 : ds.type);
              if (dt || Ar) {
                i = !0, t = Ar ? ut : dt, e = k, s = void 0, X && (r = X(r)), H = [...H, ...m], qe = 0, me *= 3;
                const oo = L.getResponseHeader("retry-after");
                if (P && oo) {
                  const mr = Ir(L);
                  if (mr != null) return Z = mr, et(Z);
                }
                return et(0);
              }
            }
            if (L.getStatus() === 401) {
              if (u) {
                try {
                  r = yield u(t, r);
                } catch {
                  return be(new c(c.UNAUTHORIZED, "Authentication Failed", L));
                }
                return qe += re() - lt, et(0);
              }
              return ke = re(), be(new c(c.UNAUTHORIZED, "Authentication Failed", L));
            }
            if (Et(L.getStatus(), H) || l && L.getErrorCode() === T.NETWORK_ERROR) {
              const dt = L.getResponseHeader("retry-after");
              if (P && dt) {
                const ut = Ir(L);
                if (ut != null) return Z = ut, et(Z);
              }
              return Z = gr(), et(Z);
            }
            return ke = re(), ie(L);
          })).catch((L) => {
            be(L);
          });
        } catch (L) {
          be(L);
        }
      }, z), y && (yield y(kt()));
    });
  }
  const no = new Promise((z, J) => {
    ie = z, be = J, et(0);
  });
  return { getPromise: () => no, cancel: function() {
    Fe("cancel()"), Dt = !0, de?.abort(), Te || (Fe("abort"), clearTimeout(Er), ie({ getErrorCode: () => Q.ABORTED }));
  }, onProgress: function(z) {
    if (!p.includes(z)) return p.push(z), de != null ? de.onProgress && de.onProgress(z) : void 0;
  }, getSnapshot: kt };
}
class El {
  constructor(e, s, r, n, o = "text", i, a, l = {}) {
    const { descriptor: d } = l;
    delete l.descriptor;
    const { cancel: u, getPromise: p, onProgress: _, getSnapshot: f } = fl(e, s, r, n, l.timeout, Object.assign(Object.assign(Object.assign(Object.assign({}, l), { responseType: o, authCallback: a }), l.retryOptions), { descriptor: d, forceXhr: l.forceXhr, autoParseJson: l.autoParseJson }));
    this.onProgress = _, typeof i == "function" && _((b, A) => i("progress", { total: A, sentOrReceived: b })), this._cancel = u, this._promise = p(), this._getSnapshot = f;
  }
  getSnapshot() {
    return this._getSnapshot();
  }
  getPromise() {
    return this._promise;
  }
  cancel(e) {
    this._cancel(e);
  }
}
const bs = x("dcx:http:req");
class as {
  constructor(e) {
    var s;
    if (this._pausable = !1, this._listeners = { progress: [], cancel: [] }, this._isStatusValid = e.isStatusValid || Gt, this._isExternalRequest = e.isExternalRequest, this._authProvider = e.authProvider, this._id = e.id, this._descriptor = e.descriptor, e.descriptor && e.descriptor.progress) {
      const n = e.descriptor.progress;
      this.on("progress", ({ sentOrReceived: o, total: i }) => {
        n.call(void 0, o, i);
      });
    }
    const r = this._authProvider.applyAuthHeaders(e.url, vt(e.headers || {}));
    this._isExternalRequest && as._internalOnlyHeaders.forEach((n) => delete r[n]), this._networkRequest = new El(e.url, e.method, e.body, r, e.responseType, !((s = e.descriptor) === null || s === void 0) && s.progress ? this._emit.bind(this) : void 0, this._getAuthCb(), e), this._promise = this._networkRequest.getPromise().then((n) => {
      const o = n.getErrorCode(), i = o || this._isStatusValid(n.getStatus(), n.getResponse());
      if (o || i !== !0)
        throw o === Q.ABORTED ? new c(c.ABORTED, "Aborted") : o === Q.NETWORK ? new c(c.NETWORK_ERROR, "Network error", void 0, n.getResponse()) : o === Q.TIMEOUT ? new c(c.TIMED_OUT, "Timeout", void 0, n.getResponse()) : i instanceof c || i instanceof Error ? new c(i.code || c.UNEXPECTED_RESPONSE, i._message || i.message, i.underlyingError, n.getResponse()) : new c(c.UNEXPECTED_RESPONSE, "Unexpected response", void 0, n.getResponse());
      const a = this._networkRequest.getSnapshot().requests;
      return bs("resolve", e.id), Object.assign(Object.assign({}, n.getResponse()), { xhr: a[a.length - 1] });
    }).catch((n) => {
      throw bs("reject", e.id), n;
    });
  }
  get id() {
    return this._id;
  }
  get descriptor() {
    return this._descriptor;
  }
  _getAuthCb() {
    if (!this._authProvider.isNoAuthMode) return this._authCb.bind(this);
  }
  _authCb(e, s) {
    return bs("_authCb()"), this._authProvider.isAuthorizedURL(e) ? this._authProvider.refreshAuth().then(() => this._authProvider.applyAuthHeaders(e, s)) : Promise.reject(new c(c.UNAUTHORIZED, "URL is not part of authenticationAllowList.", void 0, void 0, { url: e }));
  }
  _emit(e, s) {
    this._listeners[e].map((r) => r.call(null, s));
  }
  getPromise() {
    return this._promise;
  }
  cancel(e) {
    return this._networkRequest.cancel(e);
  }
  on(e, s) {
    var r;
    e === "progress" && this._listeners[e].length === 0 && ((r = this._networkRequest) === null || r === void 0 || r.onProgress((n, o) => this._emit(e, { total: o, sentOrReceived: n }))), this._listeners[e].push(s);
  }
}
as._internalOnlyHeaders = ["x-request-id", "x-api-key", "authorization"];
const gl = (t) => new as(t), ys = x("dcx:http:map");
class Tl {
  constructor() {
    this._map = /* @__PURE__ */ new Map();
  }
  addRequest(e, s) {
    return ys("addRequest()", e), this._map.set(e, s), s.getPromise().then((r) => {
      ys("then", e), this._map.delete(e);
    }).catch((r) => {
      ys("catch", e, r), this._map.delete(e);
    }), e;
  }
  get(e) {
    return this._map.get(e);
  }
  get length() {
    return this._map.size;
  }
  has(e) {
    return this._map.has(e);
  }
  removeById(e) {
    const s = this._map.get(e);
    s && this.remove(s);
  }
  remove(e, s) {
    return e && e.cancel && e.cancel(s);
  }
  clear(e) {
    this._map.forEach((s) => {
      this.remove(s, e);
    }), this._map.clear();
  }
  removeAllWithToken(e) {
    this._map.forEach((s) => {
      s.descriptor.token === e && this.remove(s);
    });
  }
}
const Bt = x("dcx:http:q"), Il = (t) => t.method.toLowerCase() === "head";
class Al {
  constructor() {
    this._queue = [], this._later = {}, this._headEndPtr = 0, this._isPriority = Il, this._usePriority = !1;
  }
  push(e, s, r) {
    return Ue(this, void 0, void 0, function* () {
      let n;
      const o = new Promise((d) => {
        n = d;
      });
      if (typeof s != "number" || s <= 0) {
        const d = { descriptor: e, notifySent: (u) => n(u), notifyCanceled: this._notifyCanceled(n) };
        return this._push(d), o;
      }
      const { id: i } = e, a = setTimeout(() => {
        this._ready(i);
      }, s), l = (d) => n(d);
      return this._later[i] = { readyTimeout: a, wait: s, descriptor: e, notifySent: l, notifyCanceled: this._notifyCanceled(n), notifyReady: () => {
        r && r.call(null, { wait: s, descriptor: e, notifySent: l });
      } }, o;
    });
  }
  _notifyCanceled(e) {
    return (s) => {
      if (!s) return e({ canceled: !0 });
      e({ canceled: !0, error: s });
    };
  }
  _push(e) {
    this._usePriority && this._isPriority(e.descriptor) ? this._queue.splice(this._headEndPtr++, 0, e) : this._queue.push(e);
  }
  remove(e) {
    if (e.id in this._later) return Bt("remove from later", e.id), this._remove(e.id);
    const s = this._indexOf(e);
    return Bt("remove from q", s), s >= 0 ? this._remove(s) : void 0;
  }
  _remove(e, s) {
    if (Bt("_remove", e), typeof e == "string") {
      const r = this._later[e];
      return r.notifyCanceled.call(null, s), r.readyTimeout && clearTimeout(r.readyTimeout), void delete this._later[e];
    }
    this._queue[e].notifyCanceled.call(null, s), this._queue.splice(e, 1), e < this._headEndPtr && this._headEndPtr--;
  }
  _indexOf(e) {
    const s = !!e.method, r = s && this._usePriority && this._isPriority(e), n = r ? this._headEndPtr : this._queue.length, o = r || !s ? 0 : this._headEndPtr;
    for (let i = o; i < o + n; i++) if (e.id === this._queue[i].descriptor.id) return i;
    return -1;
  }
  exists(e) {
    return e.id in this._later || this._indexOf(e) >= 0;
  }
  _ready(e) {
    const s = this._later[e], r = s.notifyReady;
    delete this._later[e], delete s.notifyReady, delete s.readyTimeout, delete s.wait, this._push(s), typeof r == "function" && r.call(null);
  }
  pop() {
    const e = this._queue.shift();
    return this._headEndPtr > 0 && this._headEndPtr--, e;
  }
  get length() {
    return Bt("length: ", this._queue.length, Object.keys(this._later).length), this._queue.length + Object.keys(this._later).length;
  }
  clear(e) {
    for (let r = this._queue.length - 1; r >= 0; r--) this._remove(r, e);
    this._queue = [];
    const s = Object.keys(this._later);
    for (const r in s) {
      const n = s[r];
      this._remove(n, e);
    }
    this._later = {};
  }
  removeAllWithToken(e) {
    for (let r = this._queue.length - 1; r >= 0; r--) this._queue[r].descriptor.token === e && this._remove(r);
    const s = Object.keys(this._later);
    for (const r in s) {
      const n = s[r];
      this._later[n].descriptor.token === e && this._remove(n);
    }
  }
}
const W = x("dcx:http:service"), tn = 3e5;
class ml {
  constructor(e, s = {}) {
    this.name = "AdobeHTTPService", this._requestQueue = new Al(), this._requestsOutstanding = new Tl(), this._authProvider = void 0, this._isActive = !0, this._preferFetch = !1, this._handlesRedirects = !0, this._withCredentials = !1, this._additionalNodeOptions = {}, this._retryOptions = {}, this._serviceGuid = qt(), this._reqNum = 0, this.featureFlags = {}, e instanceof Ut || S(e) && Y(e.onChange) ? this._authProvider = e : Y(e) && (s.useAuthProvider ? (this._authProvider = new Ut(void 0, void 0, e), this._waitingForAuthentication = !0) : (this._authProvider = new Ut(void 0, void 0, () => e.call(null, this)), this._waitingForAuthentication = !0)), this._authProvider ? this._authProvider.onChange(this._onAuthChange.bind(this)) : (this._authProvider = new Ut(), this._authProvider.resume()), this._maxOutstanding = s.maxOutstanding || 5, this._withCredentials = s.crossOriginCredentials || !1, this._timeout = s.timeout == null ? Ls : s.timeout, this._preferFetch = s.preferFetch === !0, this._requestIdPrefix = s.requestIdPrefix, s.server && (this.server = s.server);
  }
  get isActive() {
    return this._isActive;
  }
  set isActive(e) {
    this._isActive !== e && (this._isActive = e, e || this._authProvider.logout(), this._checkQueue());
  }
  get crossOriginCredentials() {
    return this._withCredentials;
  }
  set crossOriginCredentials(e) {
    this._withCredentials = e;
  }
  get maxOutstanding() {
    return this._maxOutstanding;
  }
  set maxOutstanding(e) {
    this._maxOutstanding = e, this._checkQueue();
  }
  get handlesRedirects() {
    return this._handlesRedirects;
  }
  get server() {
    return this._server;
  }
  set server(e) {
    this._server = e && e.endsWith("/") ? e.substr(0, e.length - 1) : e;
  }
  _forceXhr(e, s = !1) {
    this._forcedXhr = e, this._handlesRedirects = !s;
  }
  _useFetchApi(e) {
    this._fetch = e;
  }
  setAdditionalHeaders(e) {
    this._additionalHeaders = e || {};
  }
  setValidateStatus(e) {
    this._isStatusValid = e;
  }
  setAdditionalNodeOptions(e) {
    this._additionalNodeOptions = e, Yt() && e && e.maxRedirects === 0 && (this._handlesRedirects = !1);
  }
  setRetryOptions(e) {
    this._retryOptions = e;
  }
  set authenticationAllowList(e) {
    this._authProvider.authenticationAllowList = e;
  }
  get authenticationAllowList() {
    return this._authProvider.authenticationAllowList;
  }
  get authProvider() {
    return this._authProvider;
  }
  setApiKey(e) {
    this._authProvider.setApiKey(e);
  }
  setTimeout(e) {
    this._timeout = e;
  }
  setAuthToken(e) {
    e ? this._authProvider.setAuthToken(e) : this._authProvider.logout();
  }
  _onAuthChange(e, s) {
    W("_oAC", e);
    const r = this._waitingForAuthentication;
    e === "unauthenticated" ? this._waitingForAuthentication = !0 : (this._waitingForAuthentication = !1, r !== !1 && this._checkQueue());
  }
  resume() {
    this._waitingForAuthentication = !1, this._authProvider.resume(), this._checkQueue();
  }
  setRequestHooks(e, s) {
    this._beforeHook = e, this._afterHook = s;
  }
  invoke(e = "GET", s, r = {}, n, o = {}, i) {
    var a;
    W("invoke", e, s, o);
    let l = (o = o || {}).autoParseJson || !1, d = o.responseType;
    if (d != null && d !== "void" || (l = o.autoParseJson == null || o.autoParseJson, d = o.responseType = "text"), d === "defaultbuffer" && (d = Yt() ? o.responseType = "buffer" : o.responseType = "arraybuffer"), d === "buffer") {
      if (typeof Buffer != "function") throw new c(c.INVALID_PARAMS, "No Buffer class");
    } else if (d === "blob") {
      if (typeof Blob != "function") throw new c(c.INVALID_PARAMS, "No Blob class");
    } else if (d && d !== "text" && d !== "json" && d !== "arraybuffer" && d !== "stream") throw new c(c.INVALID_PARAMS, "Unsupported response type: " + d);
    !vs(s) && this.server && (s = `${this.server}/${s.startsWith("/") ? s.substr(1, s.length) : s}`), W("invoke href", s);
    const u = ye({}, r, this._additionalHeaders);
    W("invoke headers", r), u["x-request-id"] = [this._requestIdPrefix, this._serviceGuid, u["x-request-id"], "" + this._reqNum++].filter((b) => b).join("."), o.additionalNodeOptions = Object.assign({}, this._additionalNodeOptions || {}, o.additionalNodeOptions || {}), o.isStatusValid = o.isStatusValid || this._isStatusValid, o.retryOptions = Object.assign({}, this._retryOptions || {}, o.retryOptions || {});
    let p = { method: e, href: s, headers: u, token: void 0, body: n, options: o, progress: (a = o.reuseRequestDesc) === null || a === void 0 ? void 0 : a.progress, autoParseJson: l }, _ = o.reuseRequestDesc;
    _ && _ instanceof N && "props" in _ && (_ = _.props), _ && ((this._requestQueue.exists(_) || _.id && this._requestsOutstanding.get(_.id) != null) && W("requestDesc still in use"), p = ye(_, p)), p.id = p.id || qt(), i && ("maxRedirects" in o.additionalNodeOptions && (o.additionalNodeOptions.maxRedirects = 0), o.retryOptions && Object.keys(o.retryOptions).length !== 0 || (o.retryOptions = { disableRetry: !0 }));
    const f = this._getRequestPromise(p);
    return f.getPromise().then(this._checkQueue.bind(this)).catch(this._checkQueue.bind(this)), Y(i) && (W("invoke - cb"), f.then((b) => {
      W("invoke - cb - resolve ", b.statusCode);
      try {
        i(void 0, b, b.response);
      } catch (A) {
        console.error("[dcx:http] error in success callback", A, A.stack);
      }
    }).catch((b) => {
      W("invoke - cb - reject: ", b);
      try {
        i(b, b.response);
      } catch (A) {
        console.error("[dcx:http] error in failure callback", A, A.stack);
      }
    })), this._checkQueue(), f;
  }
  _makeRequest(e) {
    W("_makeRequest(): ", e.id);
    const s = e.options || {}, r = gl(M(Object.assign(Object.assign({ url: e.href, autoParseJson: e.autoParseJson, descriptor: e }, e), { timeout: s.timeout || this._timeout, authProvider: this._authProvider, forceXhr: this._forcedXhr, fetch: this._fetch, responseType: s.responseType, preCallback: this._beforeHook, postCallback: this._afterHook, isStatusValid: s.isStatusValid, additionalNodeOptions: s.additionalNodeOptions, retryOptions: s.retryOptions, isExternalRequest: s.isExternalRequest, preferFetch: this._preferFetch })));
    return this._requestsOutstanding.addRequest(e.id, r), e.startTime = (/* @__PURE__ */ new Date()).valueOf(), r;
  }
  _checkQueue() {
    queueMicrotask(this._checkQueueLoop.bind(this));
  }
  _checkQueueLoop() {
    if (W("_checkQueueLoop()", this._waitingForAuthentication, this.isActive, this._requestsOutstanding.length, "<?", this.maxOutstanding), !this._isActive) {
      W("_cQL inactive");
      const s = new c(c.SERVICE_IS_INACTIVE, "Network request in inactive state");
      this._requestsOutstanding.clear(s), this._requestQueue.clear(s);
    }
    let e = !0;
    for (; e && !this._waitingForAuthentication && this._requestsOutstanding.length < this.maxOutstanding && (e = this._requestQueue.pop(), e != null); ) {
      const s = this._makeRequest(e.descriptor);
      e.notifySent(s);
    }
    W("_cQL done");
  }
  _getRequestPromise(e) {
    return W("_getRequestPromise()"), new N((s, r, n) => {
      if (!this._isActive) return W("_gRP inactive"), r(new c(c.SERVICE_IS_INACTIVE, "Network request in inactive state"));
      n(() => {
        W("_gRP cancel 1", e.id), this._requestQueue.remove(e);
      });
      let o = e.noSoonerThen || null;
      return o && (o -= re(), o = o < 0 ? 0 : o > tn ? tn : o), delete e.noSoonerThen, this._requestQueue.push(e, o, this._checkQueue.bind(this)).then((i) => (W("_gRP sent", e.id), i.canceled ? (W("_gRP reject 1: ", e.id), r(new c(c.ABORTED, "Request aborted", i.error))) : (n((a) => {
        W("_gRP cancel 2", e.id, a), i.cancel(new c(c.ABORTED, "Request aborted", a));
      }), i.getPromise().then((a) => (W("_gRP resolve 1", e.id, a), s(a))).catch((a) => (W("_gRP reject 2: ", e.id, a), r(a)))))).catch(r);
    }, e);
  }
  abort(e) {
    e && e.cancel ? e.cancel() : this._requestQueue.exists(e) ? this._requestQueue.remove(e) : this._requestsOutstanding.removeById(e.id);
  }
  abortAllWithToken(e) {
    W("abortAllWithToken()"), this._requestsOutstanding.removeAllWithToken(e), this._requestQueue.removeAllWithToken(e);
  }
}
const bl = (t, e) => new ml(t, {}), so = class ro extends CustomEvent {
  constructor(e) {
    super(ro.EVENT_NAME, { bubbles: !0, composed: !0, detail: e });
  }
};
so.EVENT_NAME = pl.UPLOAD_STATUS;
let yl = so;
class vl {
  /**
   * Create a new UploadService instance
   * @param config - Configuration for the upload service
   */
  constructor(e) {
    this._uploadStatus = rt.IDLE, this._uploadBytesCompleted = !1, this.config = e, this.httpService = bl(), this.authConfig = e.authConfig, this.session = this.prepareSession();
  }
  /**
   * Get the current upload status
   * @returns The current upload status
   */
  get uploadStatus() {
    return this._uploadStatus;
  }
  /**
   * Set the upload status
   * @param status - The status to set
   */
  set uploadStatus(e) {
    this._uploadStatus = e, this.dispatchStatusEvent(e);
  }
  /**
   * Upload an asset to storage
   * @param options - Upload options including file, path, and metadata
   * @returns Promise resolving to upload result
   */
  async uploadAsset(e) {
    this.uploadStatus = rt.IDLE;
    try {
      const {
        file: s,
        fileName: r,
        contentType: n,
        path: o = hl,
        createIntermediates: i,
        onProgress: a = this.getUploadProgress(),
        additionalHeaders: l = {},
        repoMetaPatch: d,
        resourceDesignator: u
      } = e, p = this.convertToSliceableData(s), _ = this.getFileSize(s), f = this.buildPath(o, this.generateFileName(r));
      let b, A;
      switch (this.authConfig.tokenType) {
        case "guest": {
          b = await this.session.createAssetForGuest(
            f,
            n,
            u,
            l,
            p,
            _,
            d,
            a
          ), A = await this.generatePreSignedUrl({ asset: b.result });
          break;
        }
        case "user":
        default: {
          if (!this.config.repositoryId)
            throw this.handleError(
              Ve.REPOSITORY_ID_REQUIRED.code,
              new Error(Ve.REPOSITORY_ID_REQUIRED.message)
            );
          const y = await this.getOrCreateParentDirectory(o);
          b = await this.session.createAsset(
            y,
            r,
            i || !0,
            n,
            u,
            l,
            p,
            _,
            d
          );
        }
      }
      return this._uploadBytesCompleted && (this.uploadStatus = rt.COMPLETED), {
        asset: b.result,
        readablePreSignedUrl: A,
        shareablePreSignedUrl: this.generateShareablePreSignedUrl(A)
      };
    } catch (s) {
      throw this.handleError(
        Ve.UPLOAD_FAILED.code,
        s
      );
    }
  }
  /**
   * Generate a pre-signed URL for downloading an asset
   * @param options - Options for URL generation
   * @returns Promise resolving to pre-signed URL result
   */
  async generatePreSignedUrl(e) {
    try {
      const {
        asset: s
      } = e, { result: r } = await Zn(this.httpService, s);
      return r;
    } catch (s) {
      throw this.handleError(
        Ve.URL_GENERATION_FAILED.code,
        s
      );
    }
  }
  /**
   * Generate a shareable pre-signed URL by base64 encoding the URL
   * This is useful for passing the URL via URL params
   * @param url - The pre-signed URL to share
   * @returns The shareable pre-signed URL
   */
  generateShareablePreSignedUrl(e) {
    return e ? btoa(e) : "";
  }
  /**
   * Generate a unique file name for the uploaded file
   * @param fileName - The original file name
   * @returns The unique file name
   */
  generateFileName(e) {
    const [s, r] = e.split("."), n = Date.now();
    return `${s}-${n}.${r}`;
  }
  /**
   * Dispatch a status event
   * @param status - The status to dispatch
   */
  dispatchStatusEvent(e) {
    window.dispatchEvent(new yl({ status: e }));
  }
  /**
   * Get upload progress for an ongoing upload
   * @returns Promise resolving to upload progress information
   */
  getUploadProgress() {
    return (e, s) => {
      e === s && (this._uploadBytesCompleted = !0), this.uploadStatus = rt.UPLOADING;
    };
  }
  /**
   * Prepare the RAPI session for the upload service.
   */
  prepareSession() {
    this.httpService.setAuthToken(this.authConfig.token), this.httpService.setApiKey(this.authConfig.apiKey);
    const e = ll(this.httpService, this.config.endpoint);
    return e.setLinksCache(new to()), e;
  }
  /**
   * Convert a file to a sliceable data object
   * @param file - The file to convert
   * @returns The sliceable data object
   */
  convertToSliceableData(e) {
    return e instanceof ArrayBuffer ? new Uint8Array(e) : e;
  }
  /**
   * Get the size of a file
   * @param file - The file to get the size of
   * @returns The size of the file
   */
  getFileSize(e) {
    return e instanceof ArrayBuffer ? e.byteLength : "size" in e ? e.size : 0;
  }
  /**
   * Build a path for an asset for uploading.
   * @param path - The path to the asset
   * @param fileName - The name of the asset
   * @returns The full path to the asset
   */
  buildPath(e, s) {
    const n = [this.config.basePath || "", e, s].filter(Boolean).join("/").replace(/\/+/g, "/");
    return n.startsWith("/") ? n.substring(1) : n;
  }
  /**
   * Get or create a parent directory for an asset
   * @param path - The path to the asset
   * @returns The parent directory asset
   */
  async getOrCreateParentDirectory(e) {
    if (!this.config.repositoryId)
      throw this.handleError(
        Ve.REPOSITORY_ID_REQUIRED_FOR_DIRECTORY.code,
        new Error(Ve.REPOSITORY_ID_REQUIRED_FOR_DIRECTORY.message)
      );
    return {
      repositoryId: this.config.repositoryId,
      path: e || "/",
      links: {}
    };
  }
  /**
   * Handle an error
   * @param code - The error code
   * @param originalError - The original error
   * @param message - The error message
   * @returns The error
   */
  handleError(e, s, r) {
    const n = Ve[e];
    n.code === Ve.UPLOAD_FAILED.code && (this.uploadStatus = rt.FAILED);
    const o = r || n.message, i = new class extends Error {
      constructor(a, l, d) {
        super(a), this.code = l, this.originalError = d, this.name = "UploadServiceError";
      }
    }(o, n.code, s);
    return console.error(`UploadService Error [${n.code}]:`, o, s), i;
  }
  /**
   * Update the service configuration
   * @param newConfig - New configuration to apply
   */
  updateConfig(e) {
    this.config = { ...this.config, ...e }, (e.authConfig || e.endpoint) && (this.session = this.prepareSession());
  }
  /**
   * Get the current configuration
   * @returns Current service configuration
   */
  getConfig() {
    return { ...this.config };
  }
}
const Pl = () => {
  const t = {
    tokenType: window?.adobeIMS?.isSignedInUser() ? "user" : "guest",
    token: window?.adobeIMS?.getAccessToken()?.token,
    apiKey: ul
  };
  return new vl({
    authConfig: t,
    endpoint: dl
  });
};
export {
  pl as UPLOAD_EVENTS,
  Pl as initUploadService
};
//# sourceMappingURL=acp-upload.min.es.js.map
