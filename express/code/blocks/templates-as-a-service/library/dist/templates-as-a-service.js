var ui = { exports: {} }, Se = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cr;
function wv() {
  if (cr) return Se;
  cr = 1;
  var v = Symbol.for("react.transitional.element"), g = Symbol.for("react.fragment");
  function b(r, C, Y) {
    var L = null;
    if (Y !== void 0 && (L = "" + Y), C.key !== void 0 && (L = "" + C.key), "key" in C) {
      Y = {};
      for (var P in C)
        P !== "key" && (Y[P] = C[P]);
    } else Y = C;
    return C = Y.ref, {
      $$typeof: v,
      type: r,
      key: L,
      ref: C !== void 0 ? C : null,
      props: Y
    };
  }
  return Se.Fragment = g, Se.jsx = b, Se.jsxs = b, Se;
}
var fr;
function $v() {
  return fr || (fr = 1, ui.exports = wv()), ui.exports;
}
var M = $v(), ai = { exports: {} }, Z = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ir;
function Wv() {
  if (ir) return Z;
  ir = 1;
  var v = Symbol.for("react.transitional.element"), g = Symbol.for("react.portal"), b = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), C = Symbol.for("react.profiler"), Y = Symbol.for("react.consumer"), L = Symbol.for("react.context"), P = Symbol.for("react.forward_ref"), D = Symbol.for("react.suspense"), O = Symbol.for("react.memo"), x = Symbol.for("react.lazy"), tl = Symbol.iterator;
  function $(s) {
    return s === null || typeof s != "object" ? null : (s = tl && s[tl] || s["@@iterator"], typeof s == "function" ? s : null);
  }
  var Dl = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, _l = Object.assign, at = {};
  function El(s, z, U) {
    this.props = s, this.context = z, this.refs = at, this.updater = U || Dl;
  }
  El.prototype.isReactComponent = {}, El.prototype.setState = function(s, z) {
    if (typeof s != "object" && typeof s != "function" && s != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, s, z, "setState");
  }, El.prototype.forceUpdate = function(s) {
    this.updater.enqueueForceUpdate(this, s, "forceUpdate");
  };
  function vu() {
  }
  vu.prototype = El.prototype;
  function zt(s, z, U) {
    this.props = s, this.context = z, this.refs = at, this.updater = U || Dl;
  }
  var xl = zt.prototype = new vu();
  xl.constructor = zt, _l(xl, El.prototype), xl.isPureReactComponent = !0;
  var ht = Array.isArray, k = { H: null, A: null, T: null, S: null, V: null }, Ll = Object.prototype.hasOwnProperty;
  function Kl(s, z, U, _, B, F) {
    return U = F.ref, {
      $$typeof: v,
      type: s,
      key: z,
      ref: U !== void 0 ? U : null,
      props: F
    };
  }
  function Jl(s, z) {
    return Kl(
      s.type,
      z,
      void 0,
      void 0,
      void 0,
      s.props
    );
  }
  function St(s) {
    return typeof s == "object" && s !== null && s.$$typeof === v;
  }
  function Cu(s) {
    var z = { "=": "=0", ":": "=2" };
    return "$" + s.replace(/[=:]/g, function(U) {
      return z[U];
    });
  }
  var Mt = /\/+/g;
  function Hl(s, z) {
    return typeof s == "object" && s !== null && s.key != null ? Cu("" + s.key) : z.toString(36);
  }
  function hu() {
  }
  function yu(s) {
    switch (s.status) {
      case "fulfilled":
        return s.value;
      case "rejected":
        throw s.reason;
      default:
        switch (typeof s.status == "string" ? s.then(hu, hu) : (s.status = "pending", s.then(
          function(z) {
            s.status === "pending" && (s.status = "fulfilled", s.value = z);
          },
          function(z) {
            s.status === "pending" && (s.status = "rejected", s.reason = z);
          }
        )), s.status) {
          case "fulfilled":
            return s.value;
          case "rejected":
            throw s.reason;
        }
    }
    throw s;
  }
  function Cl(s, z, U, _, B) {
    var F = typeof s;
    (F === "undefined" || F === "boolean") && (s = null);
    var Q = !1;
    if (s === null) Q = !0;
    else
      switch (F) {
        case "bigint":
        case "string":
        case "number":
          Q = !0;
          break;
        case "object":
          switch (s.$$typeof) {
            case v:
            case g:
              Q = !0;
              break;
            case x:
              return Q = s._init, Cl(
                Q(s._payload),
                z,
                U,
                _,
                B
              );
          }
      }
    if (Q)
      return B = B(s), Q = _ === "" ? "." + Hl(s, 0) : _, ht(B) ? (U = "", Q != null && (U = Q.replace(Mt, "$&/") + "/"), Cl(B, z, U, "", function(Zt) {
        return Zt;
      })) : B != null && (St(B) && (B = Jl(
        B,
        U + (B.key == null || s && s.key === B.key ? "" : ("" + B.key).replace(
          Mt,
          "$&/"
        ) + "/") + Q
      )), z.push(B)), 1;
    Q = 0;
    var wl = _ === "" ? "." : _ + ":";
    if (ht(s))
      for (var ol = 0; ol < s.length; ol++)
        _ = s[ol], F = wl + Hl(_, ol), Q += Cl(
          _,
          z,
          U,
          F,
          B
        );
    else if (ol = $(s), typeof ol == "function")
      for (s = ol.call(s), ol = 0; !(_ = s.next()).done; )
        _ = _.value, F = wl + Hl(_, ol++), Q += Cl(
          _,
          z,
          U,
          F,
          B
        );
    else if (F === "object") {
      if (typeof s.then == "function")
        return Cl(
          yu(s),
          z,
          U,
          _,
          B
        );
      throw z = String(s), Error(
        "Objects are not valid as a React child (found: " + (z === "[object Object]" ? "object with keys {" + Object.keys(s).join(", ") + "}" : z) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return Q;
  }
  function E(s, z, U) {
    if (s == null) return s;
    var _ = [], B = 0;
    return Cl(s, _, "", "", function(F) {
      return z.call(U, F, B++);
    }), _;
  }
  function R(s) {
    if (s._status === -1) {
      var z = s._result;
      z = z(), z.then(
        function(U) {
          (s._status === 0 || s._status === -1) && (s._status = 1, s._result = U);
        },
        function(U) {
          (s._status === 0 || s._status === -1) && (s._status = 2, s._result = U);
        }
      ), s._status === -1 && (s._status = 0, s._result = z);
    }
    if (s._status === 1) return s._result.default;
    throw s._result;
  }
  var G = typeof reportError == "function" ? reportError : function(s) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var z = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof s == "object" && s !== null && typeof s.message == "string" ? String(s.message) : String(s),
        error: s
      });
      if (!window.dispatchEvent(z)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", s);
      return;
    }
    console.error(s);
  };
  function fl() {
  }
  return Z.Children = {
    map: E,
    forEach: function(s, z, U) {
      E(
        s,
        function() {
          z.apply(this, arguments);
        },
        U
      );
    },
    count: function(s) {
      var z = 0;
      return E(s, function() {
        z++;
      }), z;
    },
    toArray: function(s) {
      return E(s, function(z) {
        return z;
      }) || [];
    },
    only: function(s) {
      if (!St(s))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return s;
    }
  }, Z.Component = El, Z.Fragment = b, Z.Profiler = C, Z.PureComponent = zt, Z.StrictMode = r, Z.Suspense = D, Z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = k, Z.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(s) {
      return k.H.useMemoCache(s);
    }
  }, Z.cache = function(s) {
    return function() {
      return s.apply(null, arguments);
    };
  }, Z.cloneElement = function(s, z, U) {
    if (s == null)
      throw Error(
        "The argument must be a React element, but you passed " + s + "."
      );
    var _ = _l({}, s.props), B = s.key, F = void 0;
    if (z != null)
      for (Q in z.ref !== void 0 && (F = void 0), z.key !== void 0 && (B = "" + z.key), z)
        !Ll.call(z, Q) || Q === "key" || Q === "__self" || Q === "__source" || Q === "ref" && z.ref === void 0 || (_[Q] = z[Q]);
    var Q = arguments.length - 2;
    if (Q === 1) _.children = U;
    else if (1 < Q) {
      for (var wl = Array(Q), ol = 0; ol < Q; ol++)
        wl[ol] = arguments[ol + 2];
      _.children = wl;
    }
    return Kl(s.type, B, void 0, void 0, F, _);
  }, Z.createContext = function(s) {
    return s = {
      $$typeof: L,
      _currentValue: s,
      _currentValue2: s,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, s.Provider = s, s.Consumer = {
      $$typeof: Y,
      _context: s
    }, s;
  }, Z.createElement = function(s, z, U) {
    var _, B = {}, F = null;
    if (z != null)
      for (_ in z.key !== void 0 && (F = "" + z.key), z)
        Ll.call(z, _) && _ !== "key" && _ !== "__self" && _ !== "__source" && (B[_] = z[_]);
    var Q = arguments.length - 2;
    if (Q === 1) B.children = U;
    else if (1 < Q) {
      for (var wl = Array(Q), ol = 0; ol < Q; ol++)
        wl[ol] = arguments[ol + 2];
      B.children = wl;
    }
    if (s && s.defaultProps)
      for (_ in Q = s.defaultProps, Q)
        B[_] === void 0 && (B[_] = Q[_]);
    return Kl(s, F, void 0, void 0, null, B);
  }, Z.createRef = function() {
    return { current: null };
  }, Z.forwardRef = function(s) {
    return { $$typeof: P, render: s };
  }, Z.isValidElement = St, Z.lazy = function(s) {
    return {
      $$typeof: x,
      _payload: { _status: -1, _result: s },
      _init: R
    };
  }, Z.memo = function(s, z) {
    return {
      $$typeof: O,
      type: s,
      compare: z === void 0 ? null : z
    };
  }, Z.startTransition = function(s) {
    var z = k.T, U = {};
    k.T = U;
    try {
      var _ = s(), B = k.S;
      B !== null && B(U, _), typeof _ == "object" && _ !== null && typeof _.then == "function" && _.then(fl, G);
    } catch (F) {
      G(F);
    } finally {
      k.T = z;
    }
  }, Z.unstable_useCacheRefresh = function() {
    return k.H.useCacheRefresh();
  }, Z.use = function(s) {
    return k.H.use(s);
  }, Z.useActionState = function(s, z, U) {
    return k.H.useActionState(s, z, U);
  }, Z.useCallback = function(s, z) {
    return k.H.useCallback(s, z);
  }, Z.useContext = function(s) {
    return k.H.useContext(s);
  }, Z.useDebugValue = function() {
  }, Z.useDeferredValue = function(s, z) {
    return k.H.useDeferredValue(s, z);
  }, Z.useEffect = function(s, z, U) {
    var _ = k.H;
    if (typeof U == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return _.useEffect(s, z);
  }, Z.useId = function() {
    return k.H.useId();
  }, Z.useImperativeHandle = function(s, z, U) {
    return k.H.useImperativeHandle(s, z, U);
  }, Z.useInsertionEffect = function(s, z) {
    return k.H.useInsertionEffect(s, z);
  }, Z.useLayoutEffect = function(s, z) {
    return k.H.useLayoutEffect(s, z);
  }, Z.useMemo = function(s, z) {
    return k.H.useMemo(s, z);
  }, Z.useOptimistic = function(s, z) {
    return k.H.useOptimistic(s, z);
  }, Z.useReducer = function(s, z, U) {
    return k.H.useReducer(s, z, U);
  }, Z.useRef = function(s) {
    return k.H.useRef(s);
  }, Z.useState = function(s) {
    return k.H.useState(s);
  }, Z.useSyncExternalStore = function(s, z, U) {
    return k.H.useSyncExternalStore(
      s,
      z,
      U
    );
  }, Z.useTransition = function() {
    return k.H.useTransition();
  }, Z.version = "19.1.0", Z;
}
var sr;
function si() {
  return sr || (sr = 1, ai.exports = Wv()), ai.exports;
}
var Ml = si(), ei = { exports: {} }, be = {}, ni = { exports: {} }, ci = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var or;
function kv() {
  return or || (or = 1, function(v) {
    function g(E, R) {
      var G = E.length;
      E.push(R);
      l: for (; 0 < G; ) {
        var fl = G - 1 >>> 1, s = E[fl];
        if (0 < C(s, R))
          E[fl] = R, E[G] = s, G = fl;
        else break l;
      }
    }
    function b(E) {
      return E.length === 0 ? null : E[0];
    }
    function r(E) {
      if (E.length === 0) return null;
      var R = E[0], G = E.pop();
      if (G !== R) {
        E[0] = G;
        l: for (var fl = 0, s = E.length, z = s >>> 1; fl < z; ) {
          var U = 2 * (fl + 1) - 1, _ = E[U], B = U + 1, F = E[B];
          if (0 > C(_, G))
            B < s && 0 > C(F, _) ? (E[fl] = F, E[B] = G, fl = B) : (E[fl] = _, E[U] = G, fl = U);
          else if (B < s && 0 > C(F, G))
            E[fl] = F, E[B] = G, fl = B;
          else break l;
        }
      }
      return R;
    }
    function C(E, R) {
      var G = E.sortIndex - R.sortIndex;
      return G !== 0 ? G : E.id - R.id;
    }
    if (v.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var Y = performance;
      v.unstable_now = function() {
        return Y.now();
      };
    } else {
      var L = Date, P = L.now();
      v.unstable_now = function() {
        return L.now() - P;
      };
    }
    var D = [], O = [], x = 1, tl = null, $ = 3, Dl = !1, _l = !1, at = !1, El = !1, vu = typeof setTimeout == "function" ? setTimeout : null, zt = typeof clearTimeout == "function" ? clearTimeout : null, xl = typeof setImmediate < "u" ? setImmediate : null;
    function ht(E) {
      for (var R = b(O); R !== null; ) {
        if (R.callback === null) r(O);
        else if (R.startTime <= E)
          r(O), R.sortIndex = R.expirationTime, g(D, R);
        else break;
        R = b(O);
      }
    }
    function k(E) {
      if (at = !1, ht(E), !_l)
        if (b(D) !== null)
          _l = !0, Ll || (Ll = !0, Hl());
        else {
          var R = b(O);
          R !== null && Cl(k, R.startTime - E);
        }
    }
    var Ll = !1, Kl = -1, Jl = 5, St = -1;
    function Cu() {
      return El ? !0 : !(v.unstable_now() - St < Jl);
    }
    function Mt() {
      if (El = !1, Ll) {
        var E = v.unstable_now();
        St = E;
        var R = !0;
        try {
          l: {
            _l = !1, at && (at = !1, zt(Kl), Kl = -1), Dl = !0;
            var G = $;
            try {
              t: {
                for (ht(E), tl = b(D); tl !== null && !(tl.expirationTime > E && Cu()); ) {
                  var fl = tl.callback;
                  if (typeof fl == "function") {
                    tl.callback = null, $ = tl.priorityLevel;
                    var s = fl(
                      tl.expirationTime <= E
                    );
                    if (E = v.unstable_now(), typeof s == "function") {
                      tl.callback = s, ht(E), R = !0;
                      break t;
                    }
                    tl === b(D) && r(D), ht(E);
                  } else r(D);
                  tl = b(D);
                }
                if (tl !== null) R = !0;
                else {
                  var z = b(O);
                  z !== null && Cl(
                    k,
                    z.startTime - E
                  ), R = !1;
                }
              }
              break l;
            } finally {
              tl = null, $ = G, Dl = !1;
            }
            R = void 0;
          }
        } finally {
          R ? Hl() : Ll = !1;
        }
      }
    }
    var Hl;
    if (typeof xl == "function")
      Hl = function() {
        xl(Mt);
      };
    else if (typeof MessageChannel < "u") {
      var hu = new MessageChannel(), yu = hu.port2;
      hu.port1.onmessage = Mt, Hl = function() {
        yu.postMessage(null);
      };
    } else
      Hl = function() {
        vu(Mt, 0);
      };
    function Cl(E, R) {
      Kl = vu(function() {
        E(v.unstable_now());
      }, R);
    }
    v.unstable_IdlePriority = 5, v.unstable_ImmediatePriority = 1, v.unstable_LowPriority = 4, v.unstable_NormalPriority = 3, v.unstable_Profiling = null, v.unstable_UserBlockingPriority = 2, v.unstable_cancelCallback = function(E) {
      E.callback = null;
    }, v.unstable_forceFrameRate = function(E) {
      0 > E || 125 < E ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Jl = 0 < E ? Math.floor(1e3 / E) : 5;
    }, v.unstable_getCurrentPriorityLevel = function() {
      return $;
    }, v.unstable_next = function(E) {
      switch ($) {
        case 1:
        case 2:
        case 3:
          var R = 3;
          break;
        default:
          R = $;
      }
      var G = $;
      $ = R;
      try {
        return E();
      } finally {
        $ = G;
      }
    }, v.unstable_requestPaint = function() {
      El = !0;
    }, v.unstable_runWithPriority = function(E, R) {
      switch (E) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          E = 3;
      }
      var G = $;
      $ = E;
      try {
        return R();
      } finally {
        $ = G;
      }
    }, v.unstable_scheduleCallback = function(E, R, G) {
      var fl = v.unstable_now();
      switch (typeof G == "object" && G !== null ? (G = G.delay, G = typeof G == "number" && 0 < G ? fl + G : fl) : G = fl, E) {
        case 1:
          var s = -1;
          break;
        case 2:
          s = 250;
          break;
        case 5:
          s = 1073741823;
          break;
        case 4:
          s = 1e4;
          break;
        default:
          s = 5e3;
      }
      return s = G + s, E = {
        id: x++,
        callback: R,
        priorityLevel: E,
        startTime: G,
        expirationTime: s,
        sortIndex: -1
      }, G > fl ? (E.sortIndex = G, g(O, E), b(D) === null && E === b(O) && (at ? (zt(Kl), Kl = -1) : at = !0, Cl(k, G - fl))) : (E.sortIndex = s, g(D, E), _l || Dl || (_l = !0, Ll || (Ll = !0, Hl()))), E;
    }, v.unstable_shouldYield = Cu, v.unstable_wrapCallback = function(E) {
      var R = $;
      return function() {
        var G = $;
        $ = R;
        try {
          return E.apply(this, arguments);
        } finally {
          $ = G;
        }
      };
    };
  }(ci)), ci;
}
var dr;
function Fv() {
  return dr || (dr = 1, ni.exports = kv()), ni.exports;
}
var fi = { exports: {} }, jl = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rr;
function Iv() {
  if (rr) return jl;
  rr = 1;
  var v = si();
  function g(D) {
    var O = "https://react.dev/errors/" + D;
    if (1 < arguments.length) {
      O += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var x = 2; x < arguments.length; x++)
        O += "&args[]=" + encodeURIComponent(arguments[x]);
    }
    return "Minified React error #" + D + "; visit " + O + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function b() {
  }
  var r = {
    d: {
      f: b,
      r: function() {
        throw Error(g(522));
      },
      D: b,
      C: b,
      L: b,
      m: b,
      X: b,
      S: b,
      M: b
    },
    p: 0,
    findDOMNode: null
  }, C = Symbol.for("react.portal");
  function Y(D, O, x) {
    var tl = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: C,
      key: tl == null ? null : "" + tl,
      children: D,
      containerInfo: O,
      implementation: x
    };
  }
  var L = v.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function P(D, O) {
    if (D === "font") return "";
    if (typeof O == "string")
      return O === "use-credentials" ? O : "";
  }
  return jl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, jl.createPortal = function(D, O) {
    var x = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!O || O.nodeType !== 1 && O.nodeType !== 9 && O.nodeType !== 11)
      throw Error(g(299));
    return Y(D, O, null, x);
  }, jl.flushSync = function(D) {
    var O = L.T, x = r.p;
    try {
      if (L.T = null, r.p = 2, D) return D();
    } finally {
      L.T = O, r.p = x, r.d.f();
    }
  }, jl.preconnect = function(D, O) {
    typeof D == "string" && (O ? (O = O.crossOrigin, O = typeof O == "string" ? O === "use-credentials" ? O : "" : void 0) : O = null, r.d.C(D, O));
  }, jl.prefetchDNS = function(D) {
    typeof D == "string" && r.d.D(D);
  }, jl.preinit = function(D, O) {
    if (typeof D == "string" && O && typeof O.as == "string") {
      var x = O.as, tl = P(x, O.crossOrigin), $ = typeof O.integrity == "string" ? O.integrity : void 0, Dl = typeof O.fetchPriority == "string" ? O.fetchPriority : void 0;
      x === "style" ? r.d.S(
        D,
        typeof O.precedence == "string" ? O.precedence : void 0,
        {
          crossOrigin: tl,
          integrity: $,
          fetchPriority: Dl
        }
      ) : x === "script" && r.d.X(D, {
        crossOrigin: tl,
        integrity: $,
        fetchPriority: Dl,
        nonce: typeof O.nonce == "string" ? O.nonce : void 0
      });
    }
  }, jl.preinitModule = function(D, O) {
    if (typeof D == "string")
      if (typeof O == "object" && O !== null) {
        if (O.as == null || O.as === "script") {
          var x = P(
            O.as,
            O.crossOrigin
          );
          r.d.M(D, {
            crossOrigin: x,
            integrity: typeof O.integrity == "string" ? O.integrity : void 0,
            nonce: typeof O.nonce == "string" ? O.nonce : void 0
          });
        }
      } else O == null && r.d.M(D);
  }, jl.preload = function(D, O) {
    if (typeof D == "string" && typeof O == "object" && O !== null && typeof O.as == "string") {
      var x = O.as, tl = P(x, O.crossOrigin);
      r.d.L(D, x, {
        crossOrigin: tl,
        integrity: typeof O.integrity == "string" ? O.integrity : void 0,
        nonce: typeof O.nonce == "string" ? O.nonce : void 0,
        type: typeof O.type == "string" ? O.type : void 0,
        fetchPriority: typeof O.fetchPriority == "string" ? O.fetchPriority : void 0,
        referrerPolicy: typeof O.referrerPolicy == "string" ? O.referrerPolicy : void 0,
        imageSrcSet: typeof O.imageSrcSet == "string" ? O.imageSrcSet : void 0,
        imageSizes: typeof O.imageSizes == "string" ? O.imageSizes : void 0,
        media: typeof O.media == "string" ? O.media : void 0
      });
    }
  }, jl.preloadModule = function(D, O) {
    if (typeof D == "string")
      if (O) {
        var x = P(O.as, O.crossOrigin);
        r.d.m(D, {
          as: typeof O.as == "string" && O.as !== "script" ? O.as : void 0,
          crossOrigin: x,
          integrity: typeof O.integrity == "string" ? O.integrity : void 0
        });
      } else r.d.m(D);
  }, jl.requestFormReset = function(D) {
    r.d.r(D);
  }, jl.unstable_batchedUpdates = function(D, O) {
    return D(O);
  }, jl.useFormState = function(D, O, x) {
    return L.H.useFormState(D, O, x);
  }, jl.useFormStatus = function() {
    return L.H.useHostTransitionStatus();
  }, jl.version = "19.1.0", jl;
}
var vr;
function Pv() {
  if (vr) return fi.exports;
  vr = 1;
  function v() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(v);
      } catch (g) {
        console.error(g);
      }
  }
  return v(), fi.exports = Iv(), fi.exports;
}
var hr;
function lh() {
  if (hr) return be;
  hr = 1;
  /**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var v = Fv(), g = si(), b = Pv();
  function r(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var u = 2; u < arguments.length; u++)
        t += "&args[]=" + encodeURIComponent(arguments[u]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function C(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function Y(l) {
    var t = l, u = l;
    if (l.alternate) for (; t.return; ) t = t.return;
    else {
      l = t;
      do
        t = l, (t.flags & 4098) !== 0 && (u = t.return), l = t.return;
      while (l);
    }
    return t.tag === 3 ? u : null;
  }
  function L(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function P(l) {
    if (Y(l) !== l)
      throw Error(r(188));
  }
  function D(l) {
    var t = l.alternate;
    if (!t) {
      if (t = Y(l), t === null) throw Error(r(188));
      return t !== l ? null : l;
    }
    for (var u = l, a = t; ; ) {
      var e = u.return;
      if (e === null) break;
      var n = e.alternate;
      if (n === null) {
        if (a = e.return, a !== null) {
          u = a;
          continue;
        }
        break;
      }
      if (e.child === n.child) {
        for (n = e.child; n; ) {
          if (n === u) return P(e), l;
          if (n === a) return P(e), t;
          n = n.sibling;
        }
        throw Error(r(188));
      }
      if (u.return !== a.return) u = e, a = n;
      else {
        for (var c = !1, f = e.child; f; ) {
          if (f === u) {
            c = !0, u = e, a = n;
            break;
          }
          if (f === a) {
            c = !0, a = e, u = n;
            break;
          }
          f = f.sibling;
        }
        if (!c) {
          for (f = n.child; f; ) {
            if (f === u) {
              c = !0, u = n, a = e;
              break;
            }
            if (f === a) {
              c = !0, a = n, u = e;
              break;
            }
            f = f.sibling;
          }
          if (!c) throw Error(r(189));
        }
      }
      if (u.alternate !== a) throw Error(r(190));
    }
    if (u.tag !== 3) throw Error(r(188));
    return u.stateNode.current === u ? l : t;
  }
  function O(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = O(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  var x = Object.assign, tl = Symbol.for("react.element"), $ = Symbol.for("react.transitional.element"), Dl = Symbol.for("react.portal"), _l = Symbol.for("react.fragment"), at = Symbol.for("react.strict_mode"), El = Symbol.for("react.profiler"), vu = Symbol.for("react.provider"), zt = Symbol.for("react.consumer"), xl = Symbol.for("react.context"), ht = Symbol.for("react.forward_ref"), k = Symbol.for("react.suspense"), Ll = Symbol.for("react.suspense_list"), Kl = Symbol.for("react.memo"), Jl = Symbol.for("react.lazy"), St = Symbol.for("react.activity"), Cu = Symbol.for("react.memo_cache_sentinel"), Mt = Symbol.iterator;
  function Hl(l) {
    return l === null || typeof l != "object" ? null : (l = Mt && l[Mt] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var hu = Symbol.for("react.client.reference");
  function yu(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === hu ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case _l:
        return "Fragment";
      case El:
        return "Profiler";
      case at:
        return "StrictMode";
      case k:
        return "Suspense";
      case Ll:
        return "SuspenseList";
      case St:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case Dl:
          return "Portal";
        case xl:
          return (l.displayName || "Context") + ".Provider";
        case zt:
          return (l._context.displayName || "Context") + ".Consumer";
        case ht:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case Kl:
          return t = l.displayName || null, t !== null ? t : yu(l.type) || "Memo";
        case Jl:
          t = l._payload, l = l._init;
          try {
            return yu(l(t));
          } catch {
          }
      }
    return null;
  }
  var Cl = Array.isArray, E = g.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, R = b.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, G = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, fl = [], s = -1;
  function z(l) {
    return { current: l };
  }
  function U(l) {
    0 > s || (l.current = fl[s], fl[s] = null, s--);
  }
  function _(l, t) {
    s++, fl[s] = l.current, l.current = t;
  }
  var B = z(null), F = z(null), Q = z(null), wl = z(null);
  function ol(l, t) {
    switch (_(Q, t), _(F, l), _(B, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? Cd(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = Cd(t), l = Bd(t, l);
        else
          switch (l) {
            case "svg":
              l = 1;
              break;
            case "math":
              l = 2;
              break;
            default:
              l = 0;
          }
    }
    U(B), _(B, l);
  }
  function Zt() {
    U(B), U(F), U(Q);
  }
  function Xn(l) {
    l.memoizedState !== null && _(wl, l);
    var t = B.current, u = Bd(t, l.type);
    t !== u && (_(F, l), _(B, u));
  }
  function Ee(l) {
    F.current === l && (U(B), U(F)), wl.current === l && (U(wl), ve._currentValue = G);
  }
  var Qn = Object.prototype.hasOwnProperty, Zn = v.unstable_scheduleCallback, Vn = v.unstable_cancelCallback, zr = v.unstable_shouldYield, Mr = v.unstable_requestPaint, bt = v.unstable_now, Dr = v.unstable_getCurrentPriorityLevel, vi = v.unstable_ImmediatePriority, hi = v.unstable_UserBlockingPriority, Ae = v.unstable_NormalPriority, _r = v.unstable_LowPriority, yi = v.unstable_IdlePriority, Rr = v.log, Ur = v.unstable_setDisableYieldValue, Ea = null, $l = null;
  function Vt(l) {
    if (typeof Rr == "function" && Ur(l), $l && typeof $l.setStrictMode == "function")
      try {
        $l.setStrictMode(Ea, l);
      } catch {
      }
  }
  var Wl = Math.clz32 ? Math.clz32 : Hr, Nr = Math.log, xr = Math.LN2;
  function Hr(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (Nr(l) / xr | 0) | 0;
  }
  var pe = 256, Oe = 4194304;
  function mu(l) {
    var t = l & 42;
    if (t !== 0) return t;
    switch (l & -l) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l & 4194048;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return l & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return l;
    }
  }
  function ze(l, t, u) {
    var a = l.pendingLanes;
    if (a === 0) return 0;
    var e = 0, n = l.suspendedLanes, c = l.pingedLanes;
    l = l.warmLanes;
    var f = a & 134217727;
    return f !== 0 ? (a = f & ~n, a !== 0 ? e = mu(a) : (c &= f, c !== 0 ? e = mu(c) : u || (u = f & ~l, u !== 0 && (e = mu(u))))) : (f = a & ~n, f !== 0 ? e = mu(f) : c !== 0 ? e = mu(c) : u || (u = a & ~l, u !== 0 && (e = mu(u)))), e === 0 ? 0 : t !== 0 && t !== e && (t & n) === 0 && (n = e & -e, u = t & -t, n >= u || n === 32 && (u & 4194048) !== 0) ? t : e;
  }
  function Aa(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Cr(l, t) {
    switch (l) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function mi() {
    var l = pe;
    return pe <<= 1, (pe & 4194048) === 0 && (pe = 256), l;
  }
  function gi() {
    var l = Oe;
    return Oe <<= 1, (Oe & 62914560) === 0 && (Oe = 4194304), l;
  }
  function Ln(l) {
    for (var t = [], u = 0; 31 > u; u++) t.push(l);
    return t;
  }
  function pa(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function Br(l, t, u, a, e, n) {
    var c = l.pendingLanes;
    l.pendingLanes = u, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= u, l.entangledLanes &= u, l.errorRecoveryDisabledLanes &= u, l.shellSuspendCounter = 0;
    var f = l.entanglements, i = l.expirationTimes, y = l.hiddenUpdates;
    for (u = c & ~u; 0 < u; ) {
      var T = 31 - Wl(u), p = 1 << T;
      f[T] = 0, i[T] = -1;
      var m = y[T];
      if (m !== null)
        for (y[T] = null, T = 0; T < m.length; T++) {
          var S = m[T];
          S !== null && (S.lane &= -536870913);
        }
      u &= ~p;
    }
    a !== 0 && Si(l, a, 0), n !== 0 && e === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(c & ~t));
  }
  function Si(l, t, u) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var a = 31 - Wl(t);
    l.entangledLanes |= t, l.entanglements[a] = l.entanglements[a] | 1073741824 | u & 4194090;
  }
  function bi(l, t) {
    var u = l.entangledLanes |= t;
    for (l = l.entanglements; u; ) {
      var a = 31 - Wl(u), e = 1 << a;
      e & t | l[a] & t && (l[a] |= t), u &= ~e;
    }
  }
  function Kn(l) {
    switch (l) {
      case 2:
        l = 1;
        break;
      case 8:
        l = 4;
        break;
      case 32:
        l = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        l = 128;
        break;
      case 268435456:
        l = 134217728;
        break;
      default:
        l = 0;
    }
    return l;
  }
  function Jn(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Ti() {
    var l = R.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : lr(l.type));
  }
  function qr(l, t) {
    var u = R.p;
    try {
      return R.p = l, t();
    } finally {
      R.p = u;
    }
  }
  var Lt = Math.random().toString(36).slice(2), Bl = "__reactFiber$" + Lt, Gl = "__reactProps$" + Lt, Bu = "__reactContainer$" + Lt, wn = "__reactEvents$" + Lt, jr = "__reactListeners$" + Lt, Yr = "__reactHandles$" + Lt, Ei = "__reactResources$" + Lt, Oa = "__reactMarker$" + Lt;
  function $n(l) {
    delete l[Bl], delete l[Gl], delete l[wn], delete l[jr], delete l[Yr];
  }
  function qu(l) {
    var t = l[Bl];
    if (t) return t;
    for (var u = l.parentNode; u; ) {
      if (t = u[Bu] || u[Bl]) {
        if (u = t.alternate, t.child !== null || u !== null && u.child !== null)
          for (l = Gd(l); l !== null; ) {
            if (u = l[Bl]) return u;
            l = Gd(l);
          }
        return t;
      }
      l = u, u = l.parentNode;
    }
    return null;
  }
  function ju(l) {
    if (l = l[Bl] || l[Bu]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function za(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(r(33));
  }
  function Yu(l) {
    var t = l[Ei];
    return t || (t = l[Ei] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Al(l) {
    l[Oa] = !0;
  }
  var Ai = /* @__PURE__ */ new Set(), pi = {};
  function gu(l, t) {
    Gu(l, t), Gu(l + "Capture", t);
  }
  function Gu(l, t) {
    for (pi[l] = t, l = 0; l < t.length; l++)
      Ai.add(t[l]);
  }
  var Gr = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Oi = {}, zi = {};
  function Xr(l) {
    return Qn.call(zi, l) ? !0 : Qn.call(Oi, l) ? !1 : Gr.test(l) ? zi[l] = !0 : (Oi[l] = !0, !1);
  }
  function Me(l, t, u) {
    if (Xr(t))
      if (u === null) l.removeAttribute(t);
      else {
        switch (typeof u) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, "" + u);
      }
  }
  function De(l, t, u) {
    if (u === null) l.removeAttribute(t);
    else {
      switch (typeof u) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, "" + u);
    }
  }
  function Dt(l, t, u, a) {
    if (a === null) l.removeAttribute(u);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(u);
          return;
      }
      l.setAttributeNS(t, u, "" + a);
    }
  }
  var Wn, Mi;
  function Xu(l) {
    if (Wn === void 0)
      try {
        throw Error();
      } catch (u) {
        var t = u.stack.trim().match(/\n( *(at )?)/);
        Wn = t && t[1] || "", Mi = -1 < u.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < u.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Wn + l + Mi;
  }
  var kn = !1;
  function Fn(l, t) {
    if (!l || kn) return "";
    kn = !0;
    var u = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var p = function() {
                throw Error();
              };
              if (Object.defineProperty(p.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(p, []);
                } catch (S) {
                  var m = S;
                }
                Reflect.construct(l, [], p);
              } else {
                try {
                  p.call();
                } catch (S) {
                  m = S;
                }
                l.call(p.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (S) {
                m = S;
              }
              (p = l()) && typeof p.catch == "function" && p.catch(function() {
              });
            }
          } catch (S) {
            if (S && m && typeof S.stack == "string")
              return [S.stack, m.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var e = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      e && e.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var n = a.DetermineComponentFrameRoot(), c = n[0], f = n[1];
      if (c && f) {
        var i = c.split(`
`), y = f.split(`
`);
        for (e = a = 0; a < i.length && !i[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; e < y.length && !y[e].includes(
          "DetermineComponentFrameRoot"
        ); )
          e++;
        if (a === i.length || e === y.length)
          for (a = i.length - 1, e = y.length - 1; 1 <= a && 0 <= e && i[a] !== y[e]; )
            e--;
        for (; 1 <= a && 0 <= e; a--, e--)
          if (i[a] !== y[e]) {
            if (a !== 1 || e !== 1)
              do
                if (a--, e--, 0 > e || i[a] !== y[e]) {
                  var T = `
` + i[a].replace(" at new ", " at ");
                  return l.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", l.displayName)), T;
                }
              while (1 <= a && 0 <= e);
            break;
          }
      }
    } finally {
      kn = !1, Error.prepareStackTrace = u;
    }
    return (u = l ? l.displayName || l.name : "") ? Xu(u) : "";
  }
  function Qr(l) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return Xu(l.type);
      case 16:
        return Xu("Lazy");
      case 13:
        return Xu("Suspense");
      case 19:
        return Xu("SuspenseList");
      case 0:
      case 15:
        return Fn(l.type, !1);
      case 11:
        return Fn(l.type.render, !1);
      case 1:
        return Fn(l.type, !0);
      case 31:
        return Xu("Activity");
      default:
        return "";
    }
  }
  function Di(l) {
    try {
      var t = "";
      do
        t += Qr(l), l = l.return;
      while (l);
      return t;
    } catch (u) {
      return `
Error generating stack: ` + u.message + `
` + u.stack;
    }
  }
  function et(l) {
    switch (typeof l) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return l;
      case "object":
        return l;
      default:
        return "";
    }
  }
  function _i(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Zr(l) {
    var t = _i(l) ? "checked" : "value", u = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      t
    ), a = "" + l[t];
    if (!l.hasOwnProperty(t) && typeof u < "u" && typeof u.get == "function" && typeof u.set == "function") {
      var e = u.get, n = u.set;
      return Object.defineProperty(l, t, {
        configurable: !0,
        get: function() {
          return e.call(this);
        },
        set: function(c) {
          a = "" + c, n.call(this, c);
        }
      }), Object.defineProperty(l, t, {
        enumerable: u.enumerable
      }), {
        getValue: function() {
          return a;
        },
        setValue: function(c) {
          a = "" + c;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[t];
        }
      };
    }
  }
  function _e(l) {
    l._valueTracker || (l._valueTracker = Zr(l));
  }
  function Ri(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var u = t.getValue(), a = "";
    return l && (a = _i(l) ? l.checked ? "true" : "false" : l.value), l = a, l !== u ? (t.setValue(l), !0) : !1;
  }
  function Re(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var Vr = /[\n"\\]/g;
  function nt(l) {
    return l.replace(
      Vr,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function In(l, t, u, a, e, n, c, f) {
    l.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? l.type = c : l.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + et(t)) : l.value !== "" + et(t) && (l.value = "" + et(t)) : c !== "submit" && c !== "reset" || l.removeAttribute("value"), t != null ? Pn(l, c, et(t)) : u != null ? Pn(l, c, et(u)) : a != null && l.removeAttribute("value"), e == null && n != null && (l.defaultChecked = !!n), e != null && (l.checked = e && typeof e != "function" && typeof e != "symbol"), f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? l.name = "" + et(f) : l.removeAttribute("name");
  }
  function Ui(l, t, u, a, e, n, c, f) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || u != null) {
      if (!(n !== "submit" && n !== "reset" || t != null))
        return;
      u = u != null ? "" + et(u) : "", t = t != null ? "" + et(t) : u, f || t === l.value || (l.value = t), l.defaultValue = t;
    }
    a = a ?? e, a = typeof a != "function" && typeof a != "symbol" && !!a, l.checked = f ? l.checked : !!a, l.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (l.name = c);
  }
  function Pn(l, t, u) {
    t === "number" && Re(l.ownerDocument) === l || l.defaultValue === "" + u || (l.defaultValue = "" + u);
  }
  function Qu(l, t, u, a) {
    if (l = l.options, t) {
      t = {};
      for (var e = 0; e < u.length; e++)
        t["$" + u[e]] = !0;
      for (u = 0; u < l.length; u++)
        e = t.hasOwnProperty("$" + l[u].value), l[u].selected !== e && (l[u].selected = e), e && a && (l[u].defaultSelected = !0);
    } else {
      for (u = "" + et(u), t = null, e = 0; e < l.length; e++) {
        if (l[e].value === u) {
          l[e].selected = !0, a && (l[e].defaultSelected = !0);
          return;
        }
        t !== null || l[e].disabled || (t = l[e]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Ni(l, t, u) {
    if (t != null && (t = "" + et(t), t !== l.value && (l.value = t), u == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = u != null ? "" + et(u) : "";
  }
  function xi(l, t, u, a) {
    if (t == null) {
      if (a != null) {
        if (u != null) throw Error(r(92));
        if (Cl(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        u = a;
      }
      u == null && (u = ""), t = u;
    }
    u = et(t), l.defaultValue = u, a = l.textContent, a === u && a !== "" && a !== null && (l.value = a);
  }
  function Zu(l, t) {
    if (t) {
      var u = l.firstChild;
      if (u && u === l.lastChild && u.nodeType === 3) {
        u.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var Lr = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Hi(l, t, u) {
    var a = t.indexOf("--") === 0;
    u == null || typeof u == "boolean" || u === "" ? a ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : a ? l.setProperty(t, u) : typeof u != "number" || u === 0 || Lr.has(t) ? t === "float" ? l.cssFloat = u : l[t] = ("" + u).trim() : l[t] = u + "px";
  }
  function Ci(l, t, u) {
    if (t != null && typeof t != "object")
      throw Error(r(62));
    if (l = l.style, u != null) {
      for (var a in u)
        !u.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? l.setProperty(a, "") : a === "float" ? l.cssFloat = "" : l[a] = "");
      for (var e in t)
        a = t[e], t.hasOwnProperty(e) && u[e] !== a && Hi(l, e, a);
    } else
      for (var n in t)
        t.hasOwnProperty(n) && Hi(l, n, t[n]);
  }
  function lc(l) {
    if (l.indexOf("-") === -1) return !1;
    switch (l) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Kr = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Jr = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ue(l) {
    return Jr.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  var tc = null;
  function uc(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var Vu = null, Lu = null;
  function Bi(l) {
    var t = ju(l);
    if (t && (l = t.stateNode)) {
      var u = l[Gl] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if (In(
            l,
            u.value,
            u.defaultValue,
            u.defaultValue,
            u.checked,
            u.defaultChecked,
            u.type,
            u.name
          ), t = u.name, u.type === "radio" && t != null) {
            for (u = l; u.parentNode; ) u = u.parentNode;
            for (u = u.querySelectorAll(
              'input[name="' + nt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < u.length; t++) {
              var a = u[t];
              if (a !== l && a.form === l.form) {
                var e = a[Gl] || null;
                if (!e) throw Error(r(90));
                In(
                  a,
                  e.value,
                  e.defaultValue,
                  e.defaultValue,
                  e.checked,
                  e.defaultChecked,
                  e.type,
                  e.name
                );
              }
            }
            for (t = 0; t < u.length; t++)
              a = u[t], a.form === l.form && Ri(a);
          }
          break l;
        case "textarea":
          Ni(l, u.value, u.defaultValue);
          break l;
        case "select":
          t = u.value, t != null && Qu(l, !!u.multiple, t, !1);
      }
    }
  }
  var ac = !1;
  function qi(l, t, u) {
    if (ac) return l(t, u);
    ac = !0;
    try {
      var a = l(t);
      return a;
    } finally {
      if (ac = !1, (Vu !== null || Lu !== null) && (mn(), Vu && (t = Vu, l = Lu, Lu = Vu = null, Bi(t), l)))
        for (t = 0; t < l.length; t++) Bi(l[t]);
    }
  }
  function Ma(l, t) {
    var u = l.stateNode;
    if (u === null) return null;
    var a = u[Gl] || null;
    if (a === null) return null;
    u = a[t];
    l: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (l = l.type, a = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !a;
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (u && typeof u != "function")
      throw Error(
        r(231, t, typeof u)
      );
    return u;
  }
  var _t = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ec = !1;
  if (_t)
    try {
      var Da = {};
      Object.defineProperty(Da, "passive", {
        get: function() {
          ec = !0;
        }
      }), window.addEventListener("test", Da, Da), window.removeEventListener("test", Da, Da);
    } catch {
      ec = !1;
    }
  var Kt = null, nc = null, Ne = null;
  function ji() {
    if (Ne) return Ne;
    var l, t = nc, u = t.length, a, e = "value" in Kt ? Kt.value : Kt.textContent, n = e.length;
    for (l = 0; l < u && t[l] === e[l]; l++) ;
    var c = u - l;
    for (a = 1; a <= c && t[u - a] === e[n - a]; a++) ;
    return Ne = e.slice(l, 1 < a ? 1 - a : void 0);
  }
  function xe(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function He() {
    return !0;
  }
  function Yi() {
    return !1;
  }
  function Xl(l) {
    function t(u, a, e, n, c) {
      this._reactName = u, this._targetInst = e, this.type = a, this.nativeEvent = n, this.target = c, this.currentTarget = null;
      for (var f in l)
        l.hasOwnProperty(f) && (u = l[f], this[f] = u ? u(n) : n[f]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? He : Yi, this.isPropagationStopped = Yi, this;
    }
    return x(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var u = this.nativeEvent;
        u && (u.preventDefault ? u.preventDefault() : typeof u.returnValue != "unknown" && (u.returnValue = !1), this.isDefaultPrevented = He);
      },
      stopPropagation: function() {
        var u = this.nativeEvent;
        u && (u.stopPropagation ? u.stopPropagation() : typeof u.cancelBubble != "unknown" && (u.cancelBubble = !0), this.isPropagationStopped = He);
      },
      persist: function() {
      },
      isPersistent: He
    }), t;
  }
  var Su = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ce = Xl(Su), _a = x({}, Su, { view: 0, detail: 0 }), wr = Xl(_a), cc, fc, Ra, Be = x({}, _a, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: sc,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== Ra && (Ra && l.type === "mousemove" ? (cc = l.screenX - Ra.screenX, fc = l.screenY - Ra.screenY) : fc = cc = 0, Ra = l), cc);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : fc;
    }
  }), Gi = Xl(Be), $r = x({}, Be, { dataTransfer: 0 }), Wr = Xl($r), kr = x({}, _a, { relatedTarget: 0 }), ic = Xl(kr), Fr = x({}, Su, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Ir = Xl(Fr), Pr = x({}, Su, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), l0 = Xl(Pr), t0 = x({}, Su, { data: 0 }), Xi = Xl(t0), u0 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, a0 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, e0 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function n0(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = e0[l]) ? !!t[l] : !1;
  }
  function sc() {
    return n0;
  }
  var c0 = x({}, _a, {
    key: function(l) {
      if (l.key) {
        var t = u0[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = xe(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? a0[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: sc,
    charCode: function(l) {
      return l.type === "keypress" ? xe(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? xe(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), f0 = Xl(c0), i0 = x({}, Be, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), Qi = Xl(i0), s0 = x({}, _a, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: sc
  }), o0 = Xl(s0), d0 = x({}, Su, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), r0 = Xl(d0), v0 = x({}, Be, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), h0 = Xl(v0), y0 = x({}, Su, {
    newState: 0,
    oldState: 0
  }), m0 = Xl(y0), g0 = [9, 13, 27, 32], oc = _t && "CompositionEvent" in window, Ua = null;
  _t && "documentMode" in document && (Ua = document.documentMode);
  var S0 = _t && "TextEvent" in window && !Ua, Zi = _t && (!oc || Ua && 8 < Ua && 11 >= Ua), Vi = " ", Li = !1;
  function Ki(l, t) {
    switch (l) {
      case "keyup":
        return g0.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Ji(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var Ku = !1;
  function b0(l, t) {
    switch (l) {
      case "compositionend":
        return Ji(t);
      case "keypress":
        return t.which !== 32 ? null : (Li = !0, Vi);
      case "textInput":
        return l = t.data, l === Vi && Li ? null : l;
      default:
        return null;
    }
  }
  function T0(l, t) {
    if (Ku)
      return l === "compositionend" || !oc && Ki(l, t) ? (l = ji(), Ne = nc = Kt = null, Ku = !1, l) : null;
    switch (l) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Zi && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var E0 = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function wi(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!E0[l.type] : t === "textarea";
  }
  function $i(l, t, u, a) {
    Vu ? Lu ? Lu.push(a) : Lu = [a] : Vu = a, t = An(t, "onChange"), 0 < t.length && (u = new Ce(
      "onChange",
      "change",
      null,
      u,
      a
    ), l.push({ event: u, listeners: t }));
  }
  var Na = null, xa = null;
  function A0(l) {
    Rd(l, 0);
  }
  function qe(l) {
    var t = za(l);
    if (Ri(t)) return l;
  }
  function Wi(l, t) {
    if (l === "change") return t;
  }
  var ki = !1;
  if (_t) {
    var dc;
    if (_t) {
      var rc = "oninput" in document;
      if (!rc) {
        var Fi = document.createElement("div");
        Fi.setAttribute("oninput", "return;"), rc = typeof Fi.oninput == "function";
      }
      dc = rc;
    } else dc = !1;
    ki = dc && (!document.documentMode || 9 < document.documentMode);
  }
  function Ii() {
    Na && (Na.detachEvent("onpropertychange", Pi), xa = Na = null);
  }
  function Pi(l) {
    if (l.propertyName === "value" && qe(xa)) {
      var t = [];
      $i(
        t,
        xa,
        l,
        uc(l)
      ), qi(A0, t);
    }
  }
  function p0(l, t, u) {
    l === "focusin" ? (Ii(), Na = t, xa = u, Na.attachEvent("onpropertychange", Pi)) : l === "focusout" && Ii();
  }
  function O0(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return qe(xa);
  }
  function z0(l, t) {
    if (l === "click") return qe(t);
  }
  function M0(l, t) {
    if (l === "input" || l === "change")
      return qe(t);
  }
  function D0(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var kl = typeof Object.is == "function" ? Object.is : D0;
  function Ha(l, t) {
    if (kl(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var u = Object.keys(l), a = Object.keys(t);
    if (u.length !== a.length) return !1;
    for (a = 0; a < u.length; a++) {
      var e = u[a];
      if (!Qn.call(t, e) || !kl(l[e], t[e]))
        return !1;
    }
    return !0;
  }
  function ls(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function ts(l, t) {
    var u = ls(l);
    l = 0;
    for (var a; u; ) {
      if (u.nodeType === 3) {
        if (a = l + u.textContent.length, l <= t && a >= t)
          return { node: u, offset: t - l };
        l = a;
      }
      l: {
        for (; u; ) {
          if (u.nextSibling) {
            u = u.nextSibling;
            break l;
          }
          u = u.parentNode;
        }
        u = void 0;
      }
      u = ls(u);
    }
  }
  function us(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? us(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function as(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = Re(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var u = typeof t.contentWindow.location.href == "string";
      } catch {
        u = !1;
      }
      if (u) l = t.contentWindow;
      else break;
      t = Re(l.document);
    }
    return t;
  }
  function vc(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var _0 = _t && "documentMode" in document && 11 >= document.documentMode, Ju = null, hc = null, Ca = null, yc = !1;
  function es(l, t, u) {
    var a = u.window === u ? u.document : u.nodeType === 9 ? u : u.ownerDocument;
    yc || Ju == null || Ju !== Re(a) || (a = Ju, "selectionStart" in a && vc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Ca && Ha(Ca, a) || (Ca = a, a = An(hc, "onSelect"), 0 < a.length && (t = new Ce(
      "onSelect",
      "select",
      null,
      t,
      u
    ), l.push({ event: t, listeners: a }), t.target = Ju)));
  }
  function bu(l, t) {
    var u = {};
    return u[l.toLowerCase()] = t.toLowerCase(), u["Webkit" + l] = "webkit" + t, u["Moz" + l] = "moz" + t, u;
  }
  var wu = {
    animationend: bu("Animation", "AnimationEnd"),
    animationiteration: bu("Animation", "AnimationIteration"),
    animationstart: bu("Animation", "AnimationStart"),
    transitionrun: bu("Transition", "TransitionRun"),
    transitionstart: bu("Transition", "TransitionStart"),
    transitioncancel: bu("Transition", "TransitionCancel"),
    transitionend: bu("Transition", "TransitionEnd")
  }, mc = {}, ns = {};
  _t && (ns = document.createElement("div").style, "AnimationEvent" in window || (delete wu.animationend.animation, delete wu.animationiteration.animation, delete wu.animationstart.animation), "TransitionEvent" in window || delete wu.transitionend.transition);
  function Tu(l) {
    if (mc[l]) return mc[l];
    if (!wu[l]) return l;
    var t = wu[l], u;
    for (u in t)
      if (t.hasOwnProperty(u) && u in ns)
        return mc[l] = t[u];
    return l;
  }
  var cs = Tu("animationend"), fs = Tu("animationiteration"), is = Tu("animationstart"), R0 = Tu("transitionrun"), U0 = Tu("transitionstart"), N0 = Tu("transitioncancel"), ss = Tu("transitionend"), os = /* @__PURE__ */ new Map(), gc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  gc.push("scrollEnd");
  function yt(l, t) {
    os.set(l, t), gu(t, [l]);
  }
  var ds = /* @__PURE__ */ new WeakMap();
  function ct(l, t) {
    if (typeof l == "object" && l !== null) {
      var u = ds.get(l);
      return u !== void 0 ? u : (t = {
        value: l,
        source: t,
        stack: Di(t)
      }, ds.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: Di(t)
    };
  }
  var ft = [], $u = 0, Sc = 0;
  function je() {
    for (var l = $u, t = Sc = $u = 0; t < l; ) {
      var u = ft[t];
      ft[t++] = null;
      var a = ft[t];
      ft[t++] = null;
      var e = ft[t];
      ft[t++] = null;
      var n = ft[t];
      if (ft[t++] = null, a !== null && e !== null) {
        var c = a.pending;
        c === null ? e.next = e : (e.next = c.next, c.next = e), a.pending = e;
      }
      n !== 0 && rs(u, e, n);
    }
  }
  function Ye(l, t, u, a) {
    ft[$u++] = l, ft[$u++] = t, ft[$u++] = u, ft[$u++] = a, Sc |= a, l.lanes |= a, l = l.alternate, l !== null && (l.lanes |= a);
  }
  function bc(l, t, u, a) {
    return Ye(l, t, u, a), Ge(l);
  }
  function Wu(l, t) {
    return Ye(l, null, null, t), Ge(l);
  }
  function rs(l, t, u) {
    l.lanes |= u;
    var a = l.alternate;
    a !== null && (a.lanes |= u);
    for (var e = !1, n = l.return; n !== null; )
      n.childLanes |= u, a = n.alternate, a !== null && (a.childLanes |= u), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (e = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, e && t !== null && (e = 31 - Wl(u), l = n.hiddenUpdates, a = l[e], a === null ? l[e] = [t] : a.push(t), t.lane = u | 536870912), n) : null;
  }
  function Ge(l) {
    if (50 < ne)
      throw ne = 0, Mf = null, Error(r(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ku = {};
  function x0(l, t, u, a) {
    this.tag = l, this.key = u, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Fl(l, t, u, a) {
    return new x0(l, t, u, a);
  }
  function Tc(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function Rt(l, t) {
    var u = l.alternate;
    return u === null ? (u = Fl(
      l.tag,
      t,
      l.key,
      l.mode
    ), u.elementType = l.elementType, u.type = l.type, u.stateNode = l.stateNode, u.alternate = l, l.alternate = u) : (u.pendingProps = t, u.type = l.type, u.flags = 0, u.subtreeFlags = 0, u.deletions = null), u.flags = l.flags & 65011712, u.childLanes = l.childLanes, u.lanes = l.lanes, u.child = l.child, u.memoizedProps = l.memoizedProps, u.memoizedState = l.memoizedState, u.updateQueue = l.updateQueue, t = l.dependencies, u.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, u.sibling = l.sibling, u.index = l.index, u.ref = l.ref, u.refCleanup = l.refCleanup, u;
  }
  function vs(l, t) {
    l.flags &= 65011714;
    var u = l.alternate;
    return u === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = u.childLanes, l.lanes = u.lanes, l.child = u.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = u.memoizedProps, l.memoizedState = u.memoizedState, l.updateQueue = u.updateQueue, l.type = u.type, t = u.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function Xe(l, t, u, a, e, n) {
    var c = 0;
    if (a = l, typeof l == "function") Tc(l) && (c = 1);
    else if (typeof l == "string")
      c = Cv(
        l,
        u,
        B.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (l) {
        case St:
          return l = Fl(31, u, t, e), l.elementType = St, l.lanes = n, l;
        case _l:
          return Eu(u.children, e, n, t);
        case at:
          c = 8, e |= 24;
          break;
        case El:
          return l = Fl(12, u, t, e | 2), l.elementType = El, l.lanes = n, l;
        case k:
          return l = Fl(13, u, t, e), l.elementType = k, l.lanes = n, l;
        case Ll:
          return l = Fl(19, u, t, e), l.elementType = Ll, l.lanes = n, l;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case vu:
              case xl:
                c = 10;
                break l;
              case zt:
                c = 9;
                break l;
              case ht:
                c = 11;
                break l;
              case Kl:
                c = 14;
                break l;
              case Jl:
                c = 16, a = null;
                break l;
            }
          c = 29, u = Error(
            r(130, l === null ? "null" : typeof l, "")
          ), a = null;
      }
    return t = Fl(c, u, t, e), t.elementType = l, t.type = a, t.lanes = n, t;
  }
  function Eu(l, t, u, a) {
    return l = Fl(7, l, a, t), l.lanes = u, l;
  }
  function Ec(l, t, u) {
    return l = Fl(6, l, null, t), l.lanes = u, l;
  }
  function Ac(l, t, u) {
    return t = Fl(
      4,
      l.children !== null ? l.children : [],
      l.key,
      t
    ), t.lanes = u, t.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }, t;
  }
  var Fu = [], Iu = 0, Qe = null, Ze = 0, it = [], st = 0, Au = null, Ut = 1, Nt = "";
  function pu(l, t) {
    Fu[Iu++] = Ze, Fu[Iu++] = Qe, Qe = l, Ze = t;
  }
  function hs(l, t, u) {
    it[st++] = Ut, it[st++] = Nt, it[st++] = Au, Au = l;
    var a = Ut;
    l = Nt;
    var e = 32 - Wl(a) - 1;
    a &= ~(1 << e), u += 1;
    var n = 32 - Wl(t) + e;
    if (30 < n) {
      var c = e - e % 5;
      n = (a & (1 << c) - 1).toString(32), a >>= c, e -= c, Ut = 1 << 32 - Wl(t) + e | u << e | a, Nt = n + l;
    } else
      Ut = 1 << n | u << e | a, Nt = l;
  }
  function pc(l) {
    l.return !== null && (pu(l, 1), hs(l, 1, 0));
  }
  function Oc(l) {
    for (; l === Qe; )
      Qe = Fu[--Iu], Fu[Iu] = null, Ze = Fu[--Iu], Fu[Iu] = null;
    for (; l === Au; )
      Au = it[--st], it[st] = null, Nt = it[--st], it[st] = null, Ut = it[--st], it[st] = null;
  }
  var Yl = null, vl = null, ll = !1, Ou = null, Tt = !1, zc = Error(r(519));
  function zu(l) {
    var t = Error(r(418, ""));
    throw ja(ct(t, l)), zc;
  }
  function ys(l) {
    var t = l.stateNode, u = l.type, a = l.memoizedProps;
    switch (t[Bl] = l, t[Gl] = a, u) {
      case "dialog":
        w("cancel", t), w("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        w("load", t);
        break;
      case "video":
      case "audio":
        for (u = 0; u < fe.length; u++)
          w(fe[u], t);
        break;
      case "source":
        w("error", t);
        break;
      case "img":
      case "image":
      case "link":
        w("error", t), w("load", t);
        break;
      case "details":
        w("toggle", t);
        break;
      case "input":
        w("invalid", t), Ui(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        ), _e(t);
        break;
      case "select":
        w("invalid", t);
        break;
      case "textarea":
        w("invalid", t), xi(t, a.value, a.defaultValue, a.children), _e(t);
    }
    u = a.children, typeof u != "string" && typeof u != "number" && typeof u != "bigint" || t.textContent === "" + u || a.suppressHydrationWarning === !0 || Hd(t.textContent, u) ? (a.popover != null && (w("beforetoggle", t), w("toggle", t)), a.onScroll != null && w("scroll", t), a.onScrollEnd != null && w("scrollend", t), a.onClick != null && (t.onclick = pn), t = !0) : t = !1, t || zu(l);
  }
  function ms(l) {
    for (Yl = l.return; Yl; )
      switch (Yl.tag) {
        case 5:
        case 13:
          Tt = !1;
          return;
        case 27:
        case 3:
          Tt = !0;
          return;
        default:
          Yl = Yl.return;
      }
  }
  function Ba(l) {
    if (l !== Yl) return !1;
    if (!ll) return ms(l), ll = !0, !1;
    var t = l.tag, u;
    if ((u = t !== 3 && t !== 27) && ((u = t === 5) && (u = l.type, u = !(u !== "form" && u !== "button") || Zf(l.type, l.memoizedProps)), u = !u), u && vl && zu(l), ms(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(r(317));
      l: {
        for (l = l.nextSibling, t = 0; l; ) {
          if (l.nodeType === 8)
            if (u = l.data, u === "/$") {
              if (t === 0) {
                vl = gt(l.nextSibling);
                break l;
              }
              t--;
            } else
              u !== "$" && u !== "$!" && u !== "$?" || t++;
          l = l.nextSibling;
        }
        vl = null;
      }
    } else
      t === 27 ? (t = vl, fu(l.type) ? (l = Jf, Jf = null, vl = l) : vl = t) : vl = Yl ? gt(l.stateNode.nextSibling) : null;
    return !0;
  }
  function qa() {
    vl = Yl = null, ll = !1;
  }
  function gs() {
    var l = Ou;
    return l !== null && (Vl === null ? Vl = l : Vl.push.apply(
      Vl,
      l
    ), Ou = null), l;
  }
  function ja(l) {
    Ou === null ? Ou = [l] : Ou.push(l);
  }
  var Mc = z(null), Mu = null, xt = null;
  function Jt(l, t, u) {
    _(Mc, t._currentValue), t._currentValue = u;
  }
  function Ht(l) {
    l._currentValue = Mc.current, U(Mc);
  }
  function Dc(l, t, u) {
    for (; l !== null; ) {
      var a = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), l === u) break;
      l = l.return;
    }
  }
  function _c(l, t, u, a) {
    var e = l.child;
    for (e !== null && (e.return = l); e !== null; ) {
      var n = e.dependencies;
      if (n !== null) {
        var c = e.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var f = n;
          n = e;
          for (var i = 0; i < t.length; i++)
            if (f.context === t[i]) {
              n.lanes |= u, f = n.alternate, f !== null && (f.lanes |= u), Dc(
                n.return,
                u,
                l
              ), a || (c = null);
              break l;
            }
          n = f.next;
        }
      } else if (e.tag === 18) {
        if (c = e.return, c === null) throw Error(r(341));
        c.lanes |= u, n = c.alternate, n !== null && (n.lanes |= u), Dc(c, u, l), c = null;
      } else c = e.child;
      if (c !== null) c.return = e;
      else
        for (c = e; c !== null; ) {
          if (c === l) {
            c = null;
            break;
          }
          if (e = c.sibling, e !== null) {
            e.return = c.return, c = e;
            break;
          }
          c = c.return;
        }
      e = c;
    }
  }
  function Ya(l, t, u, a) {
    l = null;
    for (var e = t, n = !1; e !== null; ) {
      if (!n) {
        if ((e.flags & 524288) !== 0) n = !0;
        else if ((e.flags & 262144) !== 0) break;
      }
      if (e.tag === 10) {
        var c = e.alternate;
        if (c === null) throw Error(r(387));
        if (c = c.memoizedProps, c !== null) {
          var f = e.type;
          kl(e.pendingProps.value, c.value) || (l !== null ? l.push(f) : l = [f]);
        }
      } else if (e === wl.current) {
        if (c = e.alternate, c === null) throw Error(r(387));
        c.memoizedState.memoizedState !== e.memoizedState.memoizedState && (l !== null ? l.push(ve) : l = [ve]);
      }
      e = e.return;
    }
    l !== null && _c(
      t,
      l,
      u,
      a
    ), t.flags |= 262144;
  }
  function Ve(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!kl(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function Du(l) {
    Mu = l, xt = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function ql(l) {
    return Ss(Mu, l);
  }
  function Le(l, t) {
    return Mu === null && Du(l), Ss(l, t);
  }
  function Ss(l, t) {
    var u = t._currentValue;
    if (t = { context: t, memoizedValue: u, next: null }, xt === null) {
      if (l === null) throw Error(r(308));
      xt = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else xt = xt.next = t;
    return u;
  }
  var H0 = typeof AbortController < "u" ? AbortController : function() {
    var l = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(u, a) {
        l.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, l.forEach(function(u) {
        return u();
      });
    };
  }, C0 = v.unstable_scheduleCallback, B0 = v.unstable_NormalPriority, bl = {
    $$typeof: xl,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Rc() {
    return {
      controller: new H0(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ga(l) {
    l.refCount--, l.refCount === 0 && C0(B0, function() {
      l.controller.abort();
    });
  }
  var Xa = null, Uc = 0, Pu = 0, la = null;
  function q0(l, t) {
    if (Xa === null) {
      var u = Xa = [];
      Uc = 0, Pu = Hf(), la = {
        status: "pending",
        value: void 0,
        then: function(a) {
          u.push(a);
        }
      };
    }
    return Uc++, t.then(bs, bs), t;
  }
  function bs() {
    if (--Uc === 0 && Xa !== null) {
      la !== null && (la.status = "fulfilled");
      var l = Xa;
      Xa = null, Pu = 0, la = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function j0(l, t) {
    var u = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(e) {
        u.push(e);
      }
    };
    return l.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var e = 0; e < u.length; e++) (0, u[e])(t);
      },
      function(e) {
        for (a.status = "rejected", a.reason = e, e = 0; e < u.length; e++)
          (0, u[e])(void 0);
      }
    ), a;
  }
  var Ts = E.S;
  E.S = function(l, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && q0(l, t), Ts !== null && Ts(l, t);
  };
  var _u = z(null);
  function Nc() {
    var l = _u.current;
    return l !== null ? l : sl.pooledCache;
  }
  function Ke(l, t) {
    t === null ? _(_u, _u.current) : _(_u, t.pool);
  }
  function Es() {
    var l = Nc();
    return l === null ? null : { parent: bl._currentValue, pool: l };
  }
  var Qa = Error(r(460)), As = Error(r(474)), Je = Error(r(542)), xc = { then: function() {
  } };
  function ps(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function we() {
  }
  function Os(l, t, u) {
    switch (u = l[u], u === void 0 ? l.push(t) : u !== t && (t.then(we, we), t = u), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Ms(l), l;
      default:
        if (typeof t.status == "string") t.then(we, we);
        else {
          if (l = sl, l !== null && 100 < l.shellSuspendCounter)
            throw Error(r(482));
          l = t, l.status = "pending", l.then(
            function(a) {
              if (t.status === "pending") {
                var e = t;
                e.status = "fulfilled", e.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var e = t;
                e.status = "rejected", e.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw l = t.reason, Ms(l), l;
        }
        throw Za = t, Qa;
    }
  }
  var Za = null;
  function zs() {
    if (Za === null) throw Error(r(459));
    var l = Za;
    return Za = null, l;
  }
  function Ms(l) {
    if (l === Qa || l === Je)
      throw Error(r(483));
  }
  var wt = !1;
  function Hc(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Cc(l, t) {
    l = l.updateQueue, t.updateQueue === l && (t.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function $t(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function Wt(l, t, u) {
    var a = l.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (ul & 2) !== 0) {
      var e = a.pending;
      return e === null ? t.next = t : (t.next = e.next, e.next = t), a.pending = t, t = Ge(l), rs(l, null, u), t;
    }
    return Ye(l, a, t, u), Ge(l);
  }
  function Va(l, t, u) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (u & 4194048) !== 0)) {
      var a = t.lanes;
      a &= l.pendingLanes, u |= a, t.lanes = u, bi(l, u);
    }
  }
  function Bc(l, t) {
    var u = l.updateQueue, a = l.alternate;
    if (a !== null && (a = a.updateQueue, u === a)) {
      var e = null, n = null;
      if (u = u.firstBaseUpdate, u !== null) {
        do {
          var c = {
            lane: u.lane,
            tag: u.tag,
            payload: u.payload,
            callback: null,
            next: null
          };
          n === null ? e = n = c : n = n.next = c, u = u.next;
        } while (u !== null);
        n === null ? e = n = t : n = n.next = t;
      } else e = n = t;
      u = {
        baseState: a.baseState,
        firstBaseUpdate: e,
        lastBaseUpdate: n,
        shared: a.shared,
        callbacks: a.callbacks
      }, l.updateQueue = u;
      return;
    }
    l = u.lastBaseUpdate, l === null ? u.firstBaseUpdate = t : l.next = t, u.lastBaseUpdate = t;
  }
  var qc = !1;
  function La() {
    if (qc) {
      var l = la;
      if (l !== null) throw l;
    }
  }
  function Ka(l, t, u, a) {
    qc = !1;
    var e = l.updateQueue;
    wt = !1;
    var n = e.firstBaseUpdate, c = e.lastBaseUpdate, f = e.shared.pending;
    if (f !== null) {
      e.shared.pending = null;
      var i = f, y = i.next;
      i.next = null, c === null ? n = y : c.next = y, c = i;
      var T = l.alternate;
      T !== null && (T = T.updateQueue, f = T.lastBaseUpdate, f !== c && (f === null ? T.firstBaseUpdate = y : f.next = y, T.lastBaseUpdate = i));
    }
    if (n !== null) {
      var p = e.baseState;
      c = 0, T = y = i = null, f = n;
      do {
        var m = f.lane & -536870913, S = m !== f.lane;
        if (S ? (W & m) === m : (a & m) === m) {
          m !== 0 && m === Pu && (qc = !0), T !== null && (T = T.next = {
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: null,
            next: null
          });
          l: {
            var X = l, q = f;
            m = t;
            var cl = u;
            switch (q.tag) {
              case 1:
                if (X = q.payload, typeof X == "function") {
                  p = X.call(cl, p, m);
                  break l;
                }
                p = X;
                break l;
              case 3:
                X.flags = X.flags & -65537 | 128;
              case 0:
                if (X = q.payload, m = typeof X == "function" ? X.call(cl, p, m) : X, m == null) break l;
                p = x({}, p, m);
                break l;
              case 2:
                wt = !0;
            }
          }
          m = f.callback, m !== null && (l.flags |= 64, S && (l.flags |= 8192), S = e.callbacks, S === null ? e.callbacks = [m] : S.push(m));
        } else
          S = {
            lane: m,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          }, T === null ? (y = T = S, i = p) : T = T.next = S, c |= m;
        if (f = f.next, f === null) {
          if (f = e.shared.pending, f === null)
            break;
          S = f, f = S.next, S.next = null, e.lastBaseUpdate = S, e.shared.pending = null;
        }
      } while (!0);
      T === null && (i = p), e.baseState = i, e.firstBaseUpdate = y, e.lastBaseUpdate = T, n === null && (e.shared.lanes = 0), au |= c, l.lanes = c, l.memoizedState = p;
    }
  }
  function Ds(l, t) {
    if (typeof l != "function")
      throw Error(r(191, l));
    l.call(t);
  }
  function _s(l, t) {
    var u = l.callbacks;
    if (u !== null)
      for (l.callbacks = null, l = 0; l < u.length; l++)
        Ds(u[l], t);
  }
  var ta = z(null), $e = z(0);
  function Rs(l, t) {
    l = Xt, _($e, l), _(ta, t), Xt = l | t.baseLanes;
  }
  function jc() {
    _($e, Xt), _(ta, ta.current);
  }
  function Yc() {
    Xt = $e.current, U(ta), U($e);
  }
  var kt = 0, V = null, el = null, gl = null, We = !1, ua = !1, Ru = !1, ke = 0, Ja = 0, aa = null, Y0 = 0;
  function yl() {
    throw Error(r(321));
  }
  function Gc(l, t) {
    if (t === null) return !1;
    for (var u = 0; u < t.length && u < l.length; u++)
      if (!kl(l[u], t[u])) return !1;
    return !0;
  }
  function Xc(l, t, u, a, e, n) {
    return kt = n, V = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, E.H = l === null || l.memoizedState === null ? vo : ho, Ru = !1, n = u(a, e), Ru = !1, ua && (n = Ns(
      t,
      u,
      a,
      e
    )), Us(l), n;
  }
  function Us(l) {
    E.H = un;
    var t = el !== null && el.next !== null;
    if (kt = 0, gl = el = V = null, We = !1, Ja = 0, aa = null, t) throw Error(r(300));
    l === null || pl || (l = l.dependencies, l !== null && Ve(l) && (pl = !0));
  }
  function Ns(l, t, u, a) {
    V = l;
    var e = 0;
    do {
      if (ua && (aa = null), Ja = 0, ua = !1, 25 <= e) throw Error(r(301));
      if (e += 1, gl = el = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      E.H = K0, n = t(u, a);
    } while (ua);
    return n;
  }
  function G0() {
    var l = E.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? wa(t) : t, l = l.useState()[0], (el !== null ? el.memoizedState : null) !== l && (V.flags |= 1024), t;
  }
  function Qc() {
    var l = ke !== 0;
    return ke = 0, l;
  }
  function Zc(l, t, u) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~u;
  }
  function Vc(l) {
    if (We) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      We = !1;
    }
    kt = 0, gl = el = V = null, ua = !1, Ja = ke = 0, aa = null;
  }
  function Ql() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return gl === null ? V.memoizedState = gl = l : gl = gl.next = l, gl;
  }
  function Sl() {
    if (el === null) {
      var l = V.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = el.next;
    var t = gl === null ? V.memoizedState : gl.next;
    if (t !== null)
      gl = t, el = l;
    else {
      if (l === null)
        throw V.alternate === null ? Error(r(467)) : Error(r(310));
      el = l, l = {
        memoizedState: el.memoizedState,
        baseState: el.baseState,
        baseQueue: el.baseQueue,
        queue: el.queue,
        next: null
      }, gl === null ? V.memoizedState = gl = l : gl = gl.next = l;
    }
    return gl;
  }
  function Lc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function wa(l) {
    var t = Ja;
    return Ja += 1, aa === null && (aa = []), l = Os(aa, l, t), t = V, (gl === null ? t.memoizedState : gl.next) === null && (t = t.alternate, E.H = t === null || t.memoizedState === null ? vo : ho), l;
  }
  function Fe(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return wa(l);
      if (l.$$typeof === xl) return ql(l);
    }
    throw Error(r(438, String(l)));
  }
  function Kc(l) {
    var t = null, u = V.updateQueue;
    if (u !== null && (t = u.memoCache), t == null) {
      var a = V.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(e) {
          return e.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), u === null && (u = Lc(), V.updateQueue = u), u.memoCache = t, u = t.data[t.index], u === void 0)
      for (u = t.data[t.index] = Array(l), a = 0; a < l; a++)
        u[a] = Cu;
    return t.index++, u;
  }
  function Ct(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function Ie(l) {
    var t = Sl();
    return Jc(t, el, l);
  }
  function Jc(l, t, u) {
    var a = l.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = u;
    var e = l.baseQueue, n = a.pending;
    if (n !== null) {
      if (e !== null) {
        var c = e.next;
        e.next = n.next, n.next = c;
      }
      t.baseQueue = e = n, a.pending = null;
    }
    if (n = l.baseState, e === null) l.memoizedState = n;
    else {
      t = e.next;
      var f = c = null, i = null, y = t, T = !1;
      do {
        var p = y.lane & -536870913;
        if (p !== y.lane ? (W & p) === p : (kt & p) === p) {
          var m = y.revertLane;
          if (m === 0)
            i !== null && (i = i.next = {
              lane: 0,
              revertLane: 0,
              action: y.action,
              hasEagerState: y.hasEagerState,
              eagerState: y.eagerState,
              next: null
            }), p === Pu && (T = !0);
          else if ((kt & m) === m) {
            y = y.next, m === Pu && (T = !0);
            continue;
          } else
            p = {
              lane: 0,
              revertLane: y.revertLane,
              action: y.action,
              hasEagerState: y.hasEagerState,
              eagerState: y.eagerState,
              next: null
            }, i === null ? (f = i = p, c = n) : i = i.next = p, V.lanes |= m, au |= m;
          p = y.action, Ru && u(n, p), n = y.hasEagerState ? y.eagerState : u(n, p);
        } else
          m = {
            lane: p,
            revertLane: y.revertLane,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          }, i === null ? (f = i = m, c = n) : i = i.next = m, V.lanes |= p, au |= p;
        y = y.next;
      } while (y !== null && y !== t);
      if (i === null ? c = n : i.next = f, !kl(n, l.memoizedState) && (pl = !0, T && (u = la, u !== null)))
        throw u;
      l.memoizedState = n, l.baseState = c, l.baseQueue = i, a.lastRenderedState = n;
    }
    return e === null && (a.lanes = 0), [l.memoizedState, a.dispatch];
  }
  function wc(l) {
    var t = Sl(), u = t.queue;
    if (u === null) throw Error(r(311));
    u.lastRenderedReducer = l;
    var a = u.dispatch, e = u.pending, n = t.memoizedState;
    if (e !== null) {
      u.pending = null;
      var c = e = e.next;
      do
        n = l(n, c.action), c = c.next;
      while (c !== e);
      kl(n, t.memoizedState) || (pl = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), u.lastRenderedState = n;
    }
    return [n, a];
  }
  function xs(l, t, u) {
    var a = V, e = Sl(), n = ll;
    if (n) {
      if (u === void 0) throw Error(r(407));
      u = u();
    } else u = t();
    var c = !kl(
      (el || e).memoizedState,
      u
    );
    c && (e.memoizedState = u, pl = !0), e = e.queue;
    var f = Bs.bind(null, a, e, l);
    if ($a(2048, 8, f, [l]), e.getSnapshot !== t || c || gl !== null && gl.memoizedState.tag & 1) {
      if (a.flags |= 2048, ea(
        9,
        Pe(),
        Cs.bind(
          null,
          a,
          e,
          u,
          t
        ),
        null
      ), sl === null) throw Error(r(349));
      n || (kt & 124) !== 0 || Hs(a, t, u);
    }
    return u;
  }
  function Hs(l, t, u) {
    l.flags |= 16384, l = { getSnapshot: t, value: u }, t = V.updateQueue, t === null ? (t = Lc(), V.updateQueue = t, t.stores = [l]) : (u = t.stores, u === null ? t.stores = [l] : u.push(l));
  }
  function Cs(l, t, u, a) {
    t.value = u, t.getSnapshot = a, qs(t) && js(l);
  }
  function Bs(l, t, u) {
    return u(function() {
      qs(t) && js(l);
    });
  }
  function qs(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var u = t();
      return !kl(l, u);
    } catch {
      return !0;
    }
  }
  function js(l) {
    var t = Wu(l, 2);
    t !== null && ut(t, l, 2);
  }
  function $c(l) {
    var t = Ql();
    if (typeof l == "function") {
      var u = l;
      if (l = u(), Ru) {
        Vt(!0);
        try {
          u();
        } finally {
          Vt(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = l, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ct,
      lastRenderedState: l
    }, t;
  }
  function Ys(l, t, u, a) {
    return l.baseState = u, Jc(
      l,
      el,
      typeof a == "function" ? a : Ct
    );
  }
  function X0(l, t, u, a, e) {
    if (tn(l)) throw Error(r(485));
    if (l = t.action, l !== null) {
      var n = {
        payload: e,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(c) {
          n.listeners.push(c);
        }
      };
      E.T !== null ? u(!0) : n.isTransition = !1, a(n), u = t.pending, u === null ? (n.next = t.pending = n, Gs(t, n)) : (n.next = u.next, t.pending = u.next = n);
    }
  }
  function Gs(l, t) {
    var u = t.action, a = t.payload, e = l.state;
    if (t.isTransition) {
      var n = E.T, c = {};
      E.T = c;
      try {
        var f = u(e, a), i = E.S;
        i !== null && i(c, f), Xs(l, t, f);
      } catch (y) {
        Wc(l, t, y);
      } finally {
        E.T = n;
      }
    } else
      try {
        n = u(e, a), Xs(l, t, n);
      } catch (y) {
        Wc(l, t, y);
      }
  }
  function Xs(l, t, u) {
    u !== null && typeof u == "object" && typeof u.then == "function" ? u.then(
      function(a) {
        Qs(l, t, a);
      },
      function(a) {
        return Wc(l, t, a);
      }
    ) : Qs(l, t, u);
  }
  function Qs(l, t, u) {
    t.status = "fulfilled", t.value = u, Zs(t), l.state = u, t = l.pending, t !== null && (u = t.next, u === t ? l.pending = null : (u = u.next, t.next = u, Gs(l, u)));
  }
  function Wc(l, t, u) {
    var a = l.pending;
    if (l.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = u, Zs(t), t = t.next;
      while (t !== a);
    }
    l.action = null;
  }
  function Zs(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function Vs(l, t) {
    return t;
  }
  function Ls(l, t) {
    if (ll) {
      var u = sl.formState;
      if (u !== null) {
        l: {
          var a = V;
          if (ll) {
            if (vl) {
              t: {
                for (var e = vl, n = Tt; e.nodeType !== 8; ) {
                  if (!n) {
                    e = null;
                    break t;
                  }
                  if (e = gt(
                    e.nextSibling
                  ), e === null) {
                    e = null;
                    break t;
                  }
                }
                n = e.data, e = n === "F!" || n === "F" ? e : null;
              }
              if (e) {
                vl = gt(
                  e.nextSibling
                ), a = e.data === "F!";
                break l;
              }
            }
            zu(a);
          }
          a = !1;
        }
        a && (t = u[0]);
      }
    }
    return u = Ql(), u.memoizedState = u.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Vs,
      lastRenderedState: t
    }, u.queue = a, u = so.bind(
      null,
      V,
      a
    ), a.dispatch = u, a = $c(!1), n = lf.bind(
      null,
      V,
      !1,
      a.queue
    ), a = Ql(), e = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, a.queue = e, u = X0.bind(
      null,
      V,
      e,
      n,
      u
    ), e.dispatch = u, a.memoizedState = l, [t, u, !1];
  }
  function Ks(l) {
    var t = Sl();
    return Js(t, el, l);
  }
  function Js(l, t, u) {
    if (t = Jc(
      l,
      t,
      Vs
    )[0], l = Ie(Ct)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = wa(t);
      } catch (c) {
        throw c === Qa ? Je : c;
      }
    else a = t;
    t = Sl();
    var e = t.queue, n = e.dispatch;
    return u !== t.memoizedState && (V.flags |= 2048, ea(
      9,
      Pe(),
      Q0.bind(null, e, u),
      null
    )), [a, n, l];
  }
  function Q0(l, t) {
    l.action = t;
  }
  function ws(l) {
    var t = Sl(), u = el;
    if (u !== null)
      return Js(t, u, l);
    Sl(), t = t.memoizedState, u = Sl();
    var a = u.queue.dispatch;
    return u.memoizedState = l, [t, a, !1];
  }
  function ea(l, t, u, a) {
    return l = { tag: l, create: u, deps: a, inst: t, next: null }, t = V.updateQueue, t === null && (t = Lc(), V.updateQueue = t), u = t.lastEffect, u === null ? t.lastEffect = l.next = l : (a = u.next, u.next = l, l.next = a, t.lastEffect = l), l;
  }
  function Pe() {
    return { destroy: void 0, resource: void 0 };
  }
  function $s() {
    return Sl().memoizedState;
  }
  function ln(l, t, u, a) {
    var e = Ql();
    a = a === void 0 ? null : a, V.flags |= l, e.memoizedState = ea(
      1 | t,
      Pe(),
      u,
      a
    );
  }
  function $a(l, t, u, a) {
    var e = Sl();
    a = a === void 0 ? null : a;
    var n = e.memoizedState.inst;
    el !== null && a !== null && Gc(a, el.memoizedState.deps) ? e.memoizedState = ea(t, n, u, a) : (V.flags |= l, e.memoizedState = ea(
      1 | t,
      n,
      u,
      a
    ));
  }
  function Ws(l, t) {
    ln(8390656, 8, l, t);
  }
  function ks(l, t) {
    $a(2048, 8, l, t);
  }
  function Fs(l, t) {
    return $a(4, 2, l, t);
  }
  function Is(l, t) {
    return $a(4, 4, l, t);
  }
  function Ps(l, t) {
    if (typeof t == "function") {
      l = l();
      var u = t(l);
      return function() {
        typeof u == "function" ? u() : t(null);
      };
    }
    if (t != null)
      return l = l(), t.current = l, function() {
        t.current = null;
      };
  }
  function lo(l, t, u) {
    u = u != null ? u.concat([l]) : null, $a(4, 4, Ps.bind(null, t, l), u);
  }
  function kc() {
  }
  function to(l, t) {
    var u = Sl();
    t = t === void 0 ? null : t;
    var a = u.memoizedState;
    return t !== null && Gc(t, a[1]) ? a[0] : (u.memoizedState = [l, t], l);
  }
  function uo(l, t) {
    var u = Sl();
    t = t === void 0 ? null : t;
    var a = u.memoizedState;
    if (t !== null && Gc(t, a[1]))
      return a[0];
    if (a = l(), Ru) {
      Vt(!0);
      try {
        l();
      } finally {
        Vt(!1);
      }
    }
    return u.memoizedState = [a, t], a;
  }
  function Fc(l, t, u) {
    return u === void 0 || (kt & 1073741824) !== 0 ? l.memoizedState = t : (l.memoizedState = u, l = cd(), V.lanes |= l, au |= l, u);
  }
  function ao(l, t, u, a) {
    return kl(u, t) ? u : ta.current !== null ? (l = Fc(l, u, a), kl(l, t) || (pl = !0), l) : (kt & 42) === 0 ? (pl = !0, l.memoizedState = u) : (l = cd(), V.lanes |= l, au |= l, t);
  }
  function eo(l, t, u, a, e) {
    var n = R.p;
    R.p = n !== 0 && 8 > n ? n : 8;
    var c = E.T, f = {};
    E.T = f, lf(l, !1, t, u);
    try {
      var i = e(), y = E.S;
      if (y !== null && y(f, i), i !== null && typeof i == "object" && typeof i.then == "function") {
        var T = j0(
          i,
          a
        );
        Wa(
          l,
          t,
          T,
          tt(l)
        );
      } else
        Wa(
          l,
          t,
          a,
          tt(l)
        );
    } catch (p) {
      Wa(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: p },
        tt()
      );
    } finally {
      R.p = n, E.T = c;
    }
  }
  function Z0() {
  }
  function Ic(l, t, u, a) {
    if (l.tag !== 5) throw Error(r(476));
    var e = no(l).queue;
    eo(
      l,
      e,
      t,
      G,
      u === null ? Z0 : function() {
        return co(l), u(a);
      }
    );
  }
  function no(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: G,
      baseState: G,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ct,
        lastRenderedState: G
      },
      next: null
    };
    var u = {};
    return t.next = {
      memoizedState: u,
      baseState: u,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ct,
        lastRenderedState: u
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function co(l) {
    var t = no(l).next.queue;
    Wa(l, t, {}, tt());
  }
  function Pc() {
    return ql(ve);
  }
  function fo() {
    return Sl().memoizedState;
  }
  function io() {
    return Sl().memoizedState;
  }
  function V0(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var u = tt();
          l = $t(u);
          var a = Wt(t, l, u);
          a !== null && (ut(a, t, u), Va(a, t, u)), t = { cache: Rc() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function L0(l, t, u) {
    var a = tt();
    u = {
      lane: a,
      revertLane: 0,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, tn(l) ? oo(t, u) : (u = bc(l, t, u, a), u !== null && (ut(u, l, a), ro(u, t, a)));
  }
  function so(l, t, u) {
    var a = tt();
    Wa(l, t, u, a);
  }
  function Wa(l, t, u, a) {
    var e = {
      lane: a,
      revertLane: 0,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (tn(l)) oo(t, e);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var c = t.lastRenderedState, f = n(c, u);
          if (e.hasEagerState = !0, e.eagerState = f, kl(f, c))
            return Ye(l, t, e, 0), sl === null && je(), !1;
        } catch {
        } finally {
        }
      if (u = bc(l, t, e, a), u !== null)
        return ut(u, l, a), ro(u, t, a), !0;
    }
    return !1;
  }
  function lf(l, t, u, a) {
    if (a = {
      lane: 2,
      revertLane: Hf(),
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, tn(l)) {
      if (t) throw Error(r(479));
    } else
      t = bc(
        l,
        u,
        a,
        2
      ), t !== null && ut(t, l, 2);
  }
  function tn(l) {
    var t = l.alternate;
    return l === V || t !== null && t === V;
  }
  function oo(l, t) {
    ua = We = !0;
    var u = l.pending;
    u === null ? t.next = t : (t.next = u.next, u.next = t), l.pending = t;
  }
  function ro(l, t, u) {
    if ((u & 4194048) !== 0) {
      var a = t.lanes;
      a &= l.pendingLanes, u |= a, t.lanes = u, bi(l, u);
    }
  }
  var un = {
    readContext: ql,
    use: Fe,
    useCallback: yl,
    useContext: yl,
    useEffect: yl,
    useImperativeHandle: yl,
    useLayoutEffect: yl,
    useInsertionEffect: yl,
    useMemo: yl,
    useReducer: yl,
    useRef: yl,
    useState: yl,
    useDebugValue: yl,
    useDeferredValue: yl,
    useTransition: yl,
    useSyncExternalStore: yl,
    useId: yl,
    useHostTransitionStatus: yl,
    useFormState: yl,
    useActionState: yl,
    useOptimistic: yl,
    useMemoCache: yl,
    useCacheRefresh: yl
  }, vo = {
    readContext: ql,
    use: Fe,
    useCallback: function(l, t) {
      return Ql().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: ql,
    useEffect: Ws,
    useImperativeHandle: function(l, t, u) {
      u = u != null ? u.concat([l]) : null, ln(
        4194308,
        4,
        Ps.bind(null, t, l),
        u
      );
    },
    useLayoutEffect: function(l, t) {
      return ln(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      ln(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var u = Ql();
      t = t === void 0 ? null : t;
      var a = l();
      if (Ru) {
        Vt(!0);
        try {
          l();
        } finally {
          Vt(!1);
        }
      }
      return u.memoizedState = [a, t], a;
    },
    useReducer: function(l, t, u) {
      var a = Ql();
      if (u !== void 0) {
        var e = u(t);
        if (Ru) {
          Vt(!0);
          try {
            u(t);
          } finally {
            Vt(!1);
          }
        }
      } else e = t;
      return a.memoizedState = a.baseState = e, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: e
      }, a.queue = l, l = l.dispatch = L0.bind(
        null,
        V,
        l
      ), [a.memoizedState, l];
    },
    useRef: function(l) {
      var t = Ql();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = $c(l);
      var t = l.queue, u = so.bind(null, V, t);
      return t.dispatch = u, [l.memoizedState, u];
    },
    useDebugValue: kc,
    useDeferredValue: function(l, t) {
      var u = Ql();
      return Fc(u, l, t);
    },
    useTransition: function() {
      var l = $c(!1);
      return l = eo.bind(
        null,
        V,
        l.queue,
        !0,
        !1
      ), Ql().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, u) {
      var a = V, e = Ql();
      if (ll) {
        if (u === void 0)
          throw Error(r(407));
        u = u();
      } else {
        if (u = t(), sl === null)
          throw Error(r(349));
        (W & 124) !== 0 || Hs(a, t, u);
      }
      e.memoizedState = u;
      var n = { value: u, getSnapshot: t };
      return e.queue = n, Ws(Bs.bind(null, a, n, l), [
        l
      ]), a.flags |= 2048, ea(
        9,
        Pe(),
        Cs.bind(
          null,
          a,
          n,
          u,
          t
        ),
        null
      ), u;
    },
    useId: function() {
      var l = Ql(), t = sl.identifierPrefix;
      if (ll) {
        var u = Nt, a = Ut;
        u = (a & ~(1 << 32 - Wl(a) - 1)).toString(32) + u, t = "«" + t + "R" + u, u = ke++, 0 < u && (t += "H" + u.toString(32)), t += "»";
      } else
        u = Y0++, t = "«" + t + "r" + u.toString(32) + "»";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: Pc,
    useFormState: Ls,
    useActionState: Ls,
    useOptimistic: function(l) {
      var t = Ql();
      t.memoizedState = t.baseState = l;
      var u = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = u, t = lf.bind(
        null,
        V,
        !0,
        u
      ), u.dispatch = t, [l, t];
    },
    useMemoCache: Kc,
    useCacheRefresh: function() {
      return Ql().memoizedState = V0.bind(
        null,
        V
      );
    }
  }, ho = {
    readContext: ql,
    use: Fe,
    useCallback: to,
    useContext: ql,
    useEffect: ks,
    useImperativeHandle: lo,
    useInsertionEffect: Fs,
    useLayoutEffect: Is,
    useMemo: uo,
    useReducer: Ie,
    useRef: $s,
    useState: function() {
      return Ie(Ct);
    },
    useDebugValue: kc,
    useDeferredValue: function(l, t) {
      var u = Sl();
      return ao(
        u,
        el.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = Ie(Ct)[0], t = Sl().memoizedState;
      return [
        typeof l == "boolean" ? l : wa(l),
        t
      ];
    },
    useSyncExternalStore: xs,
    useId: fo,
    useHostTransitionStatus: Pc,
    useFormState: Ks,
    useActionState: Ks,
    useOptimistic: function(l, t) {
      var u = Sl();
      return Ys(u, el, l, t);
    },
    useMemoCache: Kc,
    useCacheRefresh: io
  }, K0 = {
    readContext: ql,
    use: Fe,
    useCallback: to,
    useContext: ql,
    useEffect: ks,
    useImperativeHandle: lo,
    useInsertionEffect: Fs,
    useLayoutEffect: Is,
    useMemo: uo,
    useReducer: wc,
    useRef: $s,
    useState: function() {
      return wc(Ct);
    },
    useDebugValue: kc,
    useDeferredValue: function(l, t) {
      var u = Sl();
      return el === null ? Fc(u, l, t) : ao(
        u,
        el.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = wc(Ct)[0], t = Sl().memoizedState;
      return [
        typeof l == "boolean" ? l : wa(l),
        t
      ];
    },
    useSyncExternalStore: xs,
    useId: fo,
    useHostTransitionStatus: Pc,
    useFormState: ws,
    useActionState: ws,
    useOptimistic: function(l, t) {
      var u = Sl();
      return el !== null ? Ys(u, el, l, t) : (u.baseState = l, [l, u.queue.dispatch]);
    },
    useMemoCache: Kc,
    useCacheRefresh: io
  }, na = null, ka = 0;
  function an(l) {
    var t = ka;
    return ka += 1, na === null && (na = []), Os(na, l, t);
  }
  function Fa(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function en(l, t) {
    throw t.$$typeof === tl ? Error(r(525)) : (l = Object.prototype.toString.call(t), Error(
      r(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function yo(l) {
    var t = l._init;
    return t(l._payload);
  }
  function mo(l) {
    function t(d, o) {
      if (l) {
        var h = d.deletions;
        h === null ? (d.deletions = [o], d.flags |= 16) : h.push(o);
      }
    }
    function u(d, o) {
      if (!l) return null;
      for (; o !== null; )
        t(d, o), o = o.sibling;
      return null;
    }
    function a(d) {
      for (var o = /* @__PURE__ */ new Map(); d !== null; )
        d.key !== null ? o.set(d.key, d) : o.set(d.index, d), d = d.sibling;
      return o;
    }
    function e(d, o) {
      return d = Rt(d, o), d.index = 0, d.sibling = null, d;
    }
    function n(d, o, h) {
      return d.index = h, l ? (h = d.alternate, h !== null ? (h = h.index, h < o ? (d.flags |= 67108866, o) : h) : (d.flags |= 67108866, o)) : (d.flags |= 1048576, o);
    }
    function c(d) {
      return l && d.alternate === null && (d.flags |= 67108866), d;
    }
    function f(d, o, h, A) {
      return o === null || o.tag !== 6 ? (o = Ec(h, d.mode, A), o.return = d, o) : (o = e(o, h), o.return = d, o);
    }
    function i(d, o, h, A) {
      var N = h.type;
      return N === _l ? T(
        d,
        o,
        h.props.children,
        A,
        h.key
      ) : o !== null && (o.elementType === N || typeof N == "object" && N !== null && N.$$typeof === Jl && yo(N) === o.type) ? (o = e(o, h.props), Fa(o, h), o.return = d, o) : (o = Xe(
        h.type,
        h.key,
        h.props,
        null,
        d.mode,
        A
      ), Fa(o, h), o.return = d, o);
    }
    function y(d, o, h, A) {
      return o === null || o.tag !== 4 || o.stateNode.containerInfo !== h.containerInfo || o.stateNode.implementation !== h.implementation ? (o = Ac(h, d.mode, A), o.return = d, o) : (o = e(o, h.children || []), o.return = d, o);
    }
    function T(d, o, h, A, N) {
      return o === null || o.tag !== 7 ? (o = Eu(
        h,
        d.mode,
        A,
        N
      ), o.return = d, o) : (o = e(o, h), o.return = d, o);
    }
    function p(d, o, h) {
      if (typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint")
        return o = Ec(
          "" + o,
          d.mode,
          h
        ), o.return = d, o;
      if (typeof o == "object" && o !== null) {
        switch (o.$$typeof) {
          case $:
            return h = Xe(
              o.type,
              o.key,
              o.props,
              null,
              d.mode,
              h
            ), Fa(h, o), h.return = d, h;
          case Dl:
            return o = Ac(
              o,
              d.mode,
              h
            ), o.return = d, o;
          case Jl:
            var A = o._init;
            return o = A(o._payload), p(d, o, h);
        }
        if (Cl(o) || Hl(o))
          return o = Eu(
            o,
            d.mode,
            h,
            null
          ), o.return = d, o;
        if (typeof o.then == "function")
          return p(d, an(o), h);
        if (o.$$typeof === xl)
          return p(
            d,
            Le(d, o),
            h
          );
        en(d, o);
      }
      return null;
    }
    function m(d, o, h, A) {
      var N = o !== null ? o.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint")
        return N !== null ? null : f(d, o, "" + h, A);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case $:
            return h.key === N ? i(d, o, h, A) : null;
          case Dl:
            return h.key === N ? y(d, o, h, A) : null;
          case Jl:
            return N = h._init, h = N(h._payload), m(d, o, h, A);
        }
        if (Cl(h) || Hl(h))
          return N !== null ? null : T(d, o, h, A, null);
        if (typeof h.then == "function")
          return m(
            d,
            o,
            an(h),
            A
          );
        if (h.$$typeof === xl)
          return m(
            d,
            o,
            Le(d, h),
            A
          );
        en(d, h);
      }
      return null;
    }
    function S(d, o, h, A, N) {
      if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint")
        return d = d.get(h) || null, f(o, d, "" + A, N);
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case $:
            return d = d.get(
              A.key === null ? h : A.key
            ) || null, i(o, d, A, N);
          case Dl:
            return d = d.get(
              A.key === null ? h : A.key
            ) || null, y(o, d, A, N);
          case Jl:
            var K = A._init;
            return A = K(A._payload), S(
              d,
              o,
              h,
              A,
              N
            );
        }
        if (Cl(A) || Hl(A))
          return d = d.get(h) || null, T(o, d, A, N, null);
        if (typeof A.then == "function")
          return S(
            d,
            o,
            h,
            an(A),
            N
          );
        if (A.$$typeof === xl)
          return S(
            d,
            o,
            h,
            Le(o, A),
            N
          );
        en(o, A);
      }
      return null;
    }
    function X(d, o, h, A) {
      for (var N = null, K = null, H = o, j = o = 0, zl = null; H !== null && j < h.length; j++) {
        H.index > j ? (zl = H, H = null) : zl = H.sibling;
        var I = m(
          d,
          H,
          h[j],
          A
        );
        if (I === null) {
          H === null && (H = zl);
          break;
        }
        l && H && I.alternate === null && t(d, H), o = n(I, o, j), K === null ? N = I : K.sibling = I, K = I, H = zl;
      }
      if (j === h.length)
        return u(d, H), ll && pu(d, j), N;
      if (H === null) {
        for (; j < h.length; j++)
          H = p(d, h[j], A), H !== null && (o = n(
            H,
            o,
            j
          ), K === null ? N = H : K.sibling = H, K = H);
        return ll && pu(d, j), N;
      }
      for (H = a(H); j < h.length; j++)
        zl = S(
          H,
          d,
          j,
          h[j],
          A
        ), zl !== null && (l && zl.alternate !== null && H.delete(
          zl.key === null ? j : zl.key
        ), o = n(
          zl,
          o,
          j
        ), K === null ? N = zl : K.sibling = zl, K = zl);
      return l && H.forEach(function(ru) {
        return t(d, ru);
      }), ll && pu(d, j), N;
    }
    function q(d, o, h, A) {
      if (h == null) throw Error(r(151));
      for (var N = null, K = null, H = o, j = o = 0, zl = null, I = h.next(); H !== null && !I.done; j++, I = h.next()) {
        H.index > j ? (zl = H, H = null) : zl = H.sibling;
        var ru = m(d, H, I.value, A);
        if (ru === null) {
          H === null && (H = zl);
          break;
        }
        l && H && ru.alternate === null && t(d, H), o = n(ru, o, j), K === null ? N = ru : K.sibling = ru, K = ru, H = zl;
      }
      if (I.done)
        return u(d, H), ll && pu(d, j), N;
      if (H === null) {
        for (; !I.done; j++, I = h.next())
          I = p(d, I.value, A), I !== null && (o = n(I, o, j), K === null ? N = I : K.sibling = I, K = I);
        return ll && pu(d, j), N;
      }
      for (H = a(H); !I.done; j++, I = h.next())
        I = S(H, d, j, I.value, A), I !== null && (l && I.alternate !== null && H.delete(I.key === null ? j : I.key), o = n(I, o, j), K === null ? N = I : K.sibling = I, K = I);
      return l && H.forEach(function(Jv) {
        return t(d, Jv);
      }), ll && pu(d, j), N;
    }
    function cl(d, o, h, A) {
      if (typeof h == "object" && h !== null && h.type === _l && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case $:
            l: {
              for (var N = h.key; o !== null; ) {
                if (o.key === N) {
                  if (N = h.type, N === _l) {
                    if (o.tag === 7) {
                      u(
                        d,
                        o.sibling
                      ), A = e(
                        o,
                        h.props.children
                      ), A.return = d, d = A;
                      break l;
                    }
                  } else if (o.elementType === N || typeof N == "object" && N !== null && N.$$typeof === Jl && yo(N) === o.type) {
                    u(
                      d,
                      o.sibling
                    ), A = e(o, h.props), Fa(A, h), A.return = d, d = A;
                    break l;
                  }
                  u(d, o);
                  break;
                } else t(d, o);
                o = o.sibling;
              }
              h.type === _l ? (A = Eu(
                h.props.children,
                d.mode,
                A,
                h.key
              ), A.return = d, d = A) : (A = Xe(
                h.type,
                h.key,
                h.props,
                null,
                d.mode,
                A
              ), Fa(A, h), A.return = d, d = A);
            }
            return c(d);
          case Dl:
            l: {
              for (N = h.key; o !== null; ) {
                if (o.key === N)
                  if (o.tag === 4 && o.stateNode.containerInfo === h.containerInfo && o.stateNode.implementation === h.implementation) {
                    u(
                      d,
                      o.sibling
                    ), A = e(o, h.children || []), A.return = d, d = A;
                    break l;
                  } else {
                    u(d, o);
                    break;
                  }
                else t(d, o);
                o = o.sibling;
              }
              A = Ac(h, d.mode, A), A.return = d, d = A;
            }
            return c(d);
          case Jl:
            return N = h._init, h = N(h._payload), cl(
              d,
              o,
              h,
              A
            );
        }
        if (Cl(h))
          return X(
            d,
            o,
            h,
            A
          );
        if (Hl(h)) {
          if (N = Hl(h), typeof N != "function") throw Error(r(150));
          return h = N.call(h), q(
            d,
            o,
            h,
            A
          );
        }
        if (typeof h.then == "function")
          return cl(
            d,
            o,
            an(h),
            A
          );
        if (h.$$typeof === xl)
          return cl(
            d,
            o,
            Le(d, h),
            A
          );
        en(d, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint" ? (h = "" + h, o !== null && o.tag === 6 ? (u(d, o.sibling), A = e(o, h), A.return = d, d = A) : (u(d, o), A = Ec(h, d.mode, A), A.return = d, d = A), c(d)) : u(d, o);
    }
    return function(d, o, h, A) {
      try {
        ka = 0;
        var N = cl(
          d,
          o,
          h,
          A
        );
        return na = null, N;
      } catch (H) {
        if (H === Qa || H === Je) throw H;
        var K = Fl(29, H, null, d.mode);
        return K.lanes = A, K.return = d, K;
      } finally {
      }
    };
  }
  var ca = mo(!0), go = mo(!1), ot = z(null), Et = null;
  function Ft(l) {
    var t = l.alternate;
    _(Tl, Tl.current & 1), _(ot, l), Et === null && (t === null || ta.current !== null || t.memoizedState !== null) && (Et = l);
  }
  function So(l) {
    if (l.tag === 22) {
      if (_(Tl, Tl.current), _(ot, l), Et === null) {
        var t = l.alternate;
        t !== null && t.memoizedState !== null && (Et = l);
      }
    } else It();
  }
  function It() {
    _(Tl, Tl.current), _(ot, ot.current);
  }
  function Bt(l) {
    U(ot), Et === l && (Et = null), U(Tl);
  }
  var Tl = z(0);
  function nn(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var u = t.memoizedState;
        if (u !== null && (u = u.dehydrated, u === null || u.data === "$?" || Kf(u)))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === l) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === l) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  function tf(l, t, u, a) {
    t = l.memoizedState, u = u(a, t), u = u == null ? t : x({}, t, u), l.memoizedState = u, l.lanes === 0 && (l.updateQueue.baseState = u);
  }
  var uf = {
    enqueueSetState: function(l, t, u) {
      l = l._reactInternals;
      var a = tt(), e = $t(a);
      e.payload = t, u != null && (e.callback = u), t = Wt(l, e, a), t !== null && (ut(t, l, a), Va(t, l, a));
    },
    enqueueReplaceState: function(l, t, u) {
      l = l._reactInternals;
      var a = tt(), e = $t(a);
      e.tag = 1, e.payload = t, u != null && (e.callback = u), t = Wt(l, e, a), t !== null && (ut(t, l, a), Va(t, l, a));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var u = tt(), a = $t(u);
      a.tag = 2, t != null && (a.callback = t), t = Wt(l, a, u), t !== null && (ut(t, l, u), Va(t, l, u));
    }
  };
  function bo(l, t, u, a, e, n, c) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(a, n, c) : t.prototype && t.prototype.isPureReactComponent ? !Ha(u, a) || !Ha(e, n) : !0;
  }
  function To(l, t, u, a) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(u, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(u, a), t.state !== l && uf.enqueueReplaceState(t, t.state, null);
  }
  function Uu(l, t) {
    var u = t;
    if ("ref" in t) {
      u = {};
      for (var a in t)
        a !== "ref" && (u[a] = t[a]);
    }
    if (l = l.defaultProps) {
      u === t && (u = x({}, u));
      for (var e in l)
        u[e] === void 0 && (u[e] = l[e]);
    }
    return u;
  }
  var cn = typeof reportError == "function" ? reportError : function(l) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof l == "object" && l !== null && typeof l.message == "string" ? String(l.message) : String(l),
        error: l
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", l);
      return;
    }
    console.error(l);
  };
  function Eo(l) {
    cn(l);
  }
  function Ao(l) {
    console.error(l);
  }
  function po(l) {
    cn(l);
  }
  function fn(l, t) {
    try {
      var u = l.onUncaughtError;
      u(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Oo(l, t, u) {
    try {
      var a = l.onCaughtError;
      a(u.value, {
        componentStack: u.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (e) {
      setTimeout(function() {
        throw e;
      });
    }
  }
  function af(l, t, u) {
    return u = $t(u), u.tag = 3, u.payload = { element: null }, u.callback = function() {
      fn(l, t);
    }, u;
  }
  function zo(l) {
    return l = $t(l), l.tag = 3, l;
  }
  function Mo(l, t, u, a) {
    var e = u.type.getDerivedStateFromError;
    if (typeof e == "function") {
      var n = a.value;
      l.payload = function() {
        return e(n);
      }, l.callback = function() {
        Oo(t, u, a);
      };
    }
    var c = u.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (l.callback = function() {
      Oo(t, u, a), typeof e != "function" && (eu === null ? eu = /* @__PURE__ */ new Set([this]) : eu.add(this));
      var f = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: f !== null ? f : ""
      });
    });
  }
  function J0(l, t, u, a, e) {
    if (u.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = u.alternate, t !== null && Ya(
        t,
        u,
        e,
        !0
      ), u = ot.current, u !== null) {
        switch (u.tag) {
          case 13:
            return Et === null ? _f() : u.alternate === null && hl === 0 && (hl = 3), u.flags &= -257, u.flags |= 65536, u.lanes = e, a === xc ? u.flags |= 16384 : (t = u.updateQueue, t === null ? u.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Uf(l, a, e)), !1;
          case 22:
            return u.flags |= 65536, a === xc ? u.flags |= 16384 : (t = u.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, u.updateQueue = t) : (u = t.retryQueue, u === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : u.add(a)), Uf(l, a, e)), !1;
        }
        throw Error(r(435, u.tag));
      }
      return Uf(l, a, e), _f(), !1;
    }
    if (ll)
      return t = ot.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = e, a !== zc && (l = Error(r(422), { cause: a }), ja(ct(l, u)))) : (a !== zc && (t = Error(r(423), {
        cause: a
      }), ja(
        ct(t, u)
      )), l = l.current.alternate, l.flags |= 65536, e &= -e, l.lanes |= e, a = ct(a, u), e = af(
        l.stateNode,
        a,
        e
      ), Bc(l, e), hl !== 4 && (hl = 2)), !1;
    var n = Error(r(520), { cause: a });
    if (n = ct(n, u), ee === null ? ee = [n] : ee.push(n), hl !== 4 && (hl = 2), t === null) return !0;
    a = ct(a, u), u = t;
    do {
      switch (u.tag) {
        case 3:
          return u.flags |= 65536, l = e & -e, u.lanes |= l, l = af(u.stateNode, a, l), Bc(u, l), !1;
        case 1:
          if (t = u.type, n = u.stateNode, (u.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (eu === null || !eu.has(n))))
            return u.flags |= 65536, e &= -e, u.lanes |= e, e = zo(e), Mo(
              e,
              l,
              u,
              a
            ), Bc(u, e), !1;
      }
      u = u.return;
    } while (u !== null);
    return !1;
  }
  var Do = Error(r(461)), pl = !1;
  function Rl(l, t, u, a) {
    t.child = l === null ? go(t, null, u, a) : ca(
      t,
      l.child,
      u,
      a
    );
  }
  function _o(l, t, u, a, e) {
    u = u.render;
    var n = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var f in a)
        f !== "ref" && (c[f] = a[f]);
    } else c = a;
    return Du(t), a = Xc(
      l,
      t,
      u,
      c,
      n,
      e
    ), f = Qc(), l !== null && !pl ? (Zc(l, t, e), qt(l, t, e)) : (ll && f && pc(t), t.flags |= 1, Rl(l, t, a, e), t.child);
  }
  function Ro(l, t, u, a, e) {
    if (l === null) {
      var n = u.type;
      return typeof n == "function" && !Tc(n) && n.defaultProps === void 0 && u.compare === null ? (t.tag = 15, t.type = n, Uo(
        l,
        t,
        n,
        a,
        e
      )) : (l = Xe(
        u.type,
        null,
        a,
        t,
        t.mode,
        e
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !rf(l, e)) {
      var c = n.memoizedProps;
      if (u = u.compare, u = u !== null ? u : Ha, u(c, a) && l.ref === t.ref)
        return qt(l, t, e);
    }
    return t.flags |= 1, l = Rt(n, a), l.ref = t.ref, l.return = t, t.child = l;
  }
  function Uo(l, t, u, a, e) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (Ha(n, a) && l.ref === t.ref)
        if (pl = !1, t.pendingProps = a = n, rf(l, e))
          (l.flags & 131072) !== 0 && (pl = !0);
        else
          return t.lanes = l.lanes, qt(l, t, e);
    }
    return ef(
      l,
      t,
      u,
      a,
      e
    );
  }
  function No(l, t, u) {
    var a = t.pendingProps, e = a.children, n = l !== null ? l.memoizedState : null;
    if (a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (a = n !== null ? n.baseLanes | u : u, l !== null) {
          for (e = t.child = l.child, n = 0; e !== null; )
            n = n | e.lanes | e.childLanes, e = e.sibling;
          t.childLanes = n & ~a;
        } else t.childLanes = 0, t.child = null;
        return xo(
          l,
          t,
          a,
          u
        );
      }
      if ((u & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && Ke(
          t,
          n !== null ? n.cachePool : null
        ), n !== null ? Rs(t, n) : jc(), So(t);
      else
        return t.lanes = t.childLanes = 536870912, xo(
          l,
          t,
          n !== null ? n.baseLanes | u : u,
          u
        );
    } else
      n !== null ? (Ke(t, n.cachePool), Rs(t, n), It(), t.memoizedState = null) : (l !== null && Ke(t, null), jc(), It());
    return Rl(l, t, e, u), t.child;
  }
  function xo(l, t, u, a) {
    var e = Nc();
    return e = e === null ? null : { parent: bl._currentValue, pool: e }, t.memoizedState = {
      baseLanes: u,
      cachePool: e
    }, l !== null && Ke(t, null), jc(), So(t), l !== null && Ya(l, t, a, !0), null;
  }
  function sn(l, t) {
    var u = t.ref;
    if (u === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof u != "function" && typeof u != "object")
        throw Error(r(284));
      (l === null || l.ref !== u) && (t.flags |= 4194816);
    }
  }
  function ef(l, t, u, a, e) {
    return Du(t), u = Xc(
      l,
      t,
      u,
      a,
      void 0,
      e
    ), a = Qc(), l !== null && !pl ? (Zc(l, t, e), qt(l, t, e)) : (ll && a && pc(t), t.flags |= 1, Rl(l, t, u, e), t.child);
  }
  function Ho(l, t, u, a, e, n) {
    return Du(t), t.updateQueue = null, u = Ns(
      t,
      a,
      u,
      e
    ), Us(l), a = Qc(), l !== null && !pl ? (Zc(l, t, n), qt(l, t, n)) : (ll && a && pc(t), t.flags |= 1, Rl(l, t, u, n), t.child);
  }
  function Co(l, t, u, a, e) {
    if (Du(t), t.stateNode === null) {
      var n = ku, c = u.contextType;
      typeof c == "object" && c !== null && (n = ql(c)), n = new u(a, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = uf, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = a, n.state = t.memoizedState, n.refs = {}, Hc(t), c = u.contextType, n.context = typeof c == "object" && c !== null ? ql(c) : ku, n.state = t.memoizedState, c = u.getDerivedStateFromProps, typeof c == "function" && (tf(
        t,
        u,
        c,
        a
      ), n.state = t.memoizedState), typeof u.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (c = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), c !== n.state && uf.enqueueReplaceState(n, n.state, null), Ka(t, a, n, e), La(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (l === null) {
      n = t.stateNode;
      var f = t.memoizedProps, i = Uu(u, f);
      n.props = i;
      var y = n.context, T = u.contextType;
      c = ku, typeof T == "object" && T !== null && (c = ql(T));
      var p = u.getDerivedStateFromProps;
      T = typeof p == "function" || typeof n.getSnapshotBeforeUpdate == "function", f = t.pendingProps !== f, T || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (f || y !== c) && To(
        t,
        n,
        a,
        c
      ), wt = !1;
      var m = t.memoizedState;
      n.state = m, Ka(t, a, n, e), La(), y = t.memoizedState, f || m !== y || wt ? (typeof p == "function" && (tf(
        t,
        u,
        p,
        a
      ), y = t.memoizedState), (i = wt || bo(
        t,
        u,
        i,
        a,
        m,
        y,
        c
      )) ? (T || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = y), n.props = a, n.state = y, n.context = c, a = i) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      n = t.stateNode, Cc(l, t), c = t.memoizedProps, T = Uu(u, c), n.props = T, p = t.pendingProps, m = n.context, y = u.contextType, i = ku, typeof y == "object" && y !== null && (i = ql(y)), f = u.getDerivedStateFromProps, (y = typeof f == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c !== p || m !== i) && To(
        t,
        n,
        a,
        i
      ), wt = !1, m = t.memoizedState, n.state = m, Ka(t, a, n, e), La();
      var S = t.memoizedState;
      c !== p || m !== S || wt || l !== null && l.dependencies !== null && Ve(l.dependencies) ? (typeof f == "function" && (tf(
        t,
        u,
        f,
        a
      ), S = t.memoizedState), (T = wt || bo(
        t,
        u,
        T,
        a,
        m,
        S,
        i
      ) || l !== null && l.dependencies !== null && Ve(l.dependencies)) ? (y || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(a, S, i), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        a,
        S,
        i
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || c === l.memoizedProps && m === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && m === l.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = S), n.props = a, n.state = S, n.context = i, a = T) : (typeof n.componentDidUpdate != "function" || c === l.memoizedProps && m === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && m === l.memoizedState || (t.flags |= 1024), a = !1);
    }
    return n = a, sn(l, t), a = (t.flags & 128) !== 0, n || a ? (n = t.stateNode, u = a && typeof u.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && a ? (t.child = ca(
      t,
      l.child,
      null,
      e
    ), t.child = ca(
      t,
      null,
      u,
      e
    )) : Rl(l, t, u, e), t.memoizedState = n.state, l = t.child) : l = qt(
      l,
      t,
      e
    ), l;
  }
  function Bo(l, t, u, a) {
    return qa(), t.flags |= 256, Rl(l, t, u, a), t.child;
  }
  var nf = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function cf(l) {
    return { baseLanes: l, cachePool: Es() };
  }
  function ff(l, t, u) {
    return l = l !== null ? l.childLanes & ~u : 0, t && (l |= dt), l;
  }
  function qo(l, t, u) {
    var a = t.pendingProps, e = !1, n = (t.flags & 128) !== 0, c;
    if ((c = n) || (c = l !== null && l.memoizedState === null ? !1 : (Tl.current & 2) !== 0), c && (e = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (ll) {
        if (e ? Ft(t) : It(), ll) {
          var f = vl, i;
          if (i = f) {
            l: {
              for (i = f, f = Tt; i.nodeType !== 8; ) {
                if (!f) {
                  f = null;
                  break l;
                }
                if (i = gt(
                  i.nextSibling
                ), i === null) {
                  f = null;
                  break l;
                }
              }
              f = i;
            }
            f !== null ? (t.memoizedState = {
              dehydrated: f,
              treeContext: Au !== null ? { id: Ut, overflow: Nt } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, i = Fl(
              18,
              null,
              null,
              0
            ), i.stateNode = f, i.return = t, t.child = i, Yl = t, vl = null, i = !0) : i = !1;
          }
          i || zu(t);
        }
        if (f = t.memoizedState, f !== null && (f = f.dehydrated, f !== null))
          return Kf(f) ? t.lanes = 32 : t.lanes = 536870912, null;
        Bt(t);
      }
      return f = a.children, a = a.fallback, e ? (It(), e = t.mode, f = on(
        { mode: "hidden", children: f },
        e
      ), a = Eu(
        a,
        e,
        u,
        null
      ), f.return = t, a.return = t, f.sibling = a, t.child = f, e = t.child, e.memoizedState = cf(u), e.childLanes = ff(
        l,
        c,
        u
      ), t.memoizedState = nf, a) : (Ft(t), sf(t, f));
    }
    if (i = l.memoizedState, i !== null && (f = i.dehydrated, f !== null)) {
      if (n)
        t.flags & 256 ? (Ft(t), t.flags &= -257, t = of(
          l,
          t,
          u
        )) : t.memoizedState !== null ? (It(), t.child = l.child, t.flags |= 128, t = null) : (It(), e = a.fallback, f = t.mode, a = on(
          { mode: "visible", children: a.children },
          f
        ), e = Eu(
          e,
          f,
          u,
          null
        ), e.flags |= 2, a.return = t, e.return = t, a.sibling = e, t.child = a, ca(
          t,
          l.child,
          null,
          u
        ), a = t.child, a.memoizedState = cf(u), a.childLanes = ff(
          l,
          c,
          u
        ), t.memoizedState = nf, t = e);
      else if (Ft(t), Kf(f)) {
        if (c = f.nextSibling && f.nextSibling.dataset, c) var y = c.dgst;
        c = y, a = Error(r(419)), a.stack = "", a.digest = c, ja({ value: a, source: null, stack: null }), t = of(
          l,
          t,
          u
        );
      } else if (pl || Ya(l, t, u, !1), c = (u & l.childLanes) !== 0, pl || c) {
        if (c = sl, c !== null && (a = u & -u, a = (a & 42) !== 0 ? 1 : Kn(a), a = (a & (c.suspendedLanes | u)) !== 0 ? 0 : a, a !== 0 && a !== i.retryLane))
          throw i.retryLane = a, Wu(l, a), ut(c, l, a), Do;
        f.data === "$?" || _f(), t = of(
          l,
          t,
          u
        );
      } else
        f.data === "$?" ? (t.flags |= 192, t.child = l.child, t = null) : (l = i.treeContext, vl = gt(
          f.nextSibling
        ), Yl = t, ll = !0, Ou = null, Tt = !1, l !== null && (it[st++] = Ut, it[st++] = Nt, it[st++] = Au, Ut = l.id, Nt = l.overflow, Au = t), t = sf(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return e ? (It(), e = a.fallback, f = t.mode, i = l.child, y = i.sibling, a = Rt(i, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = i.subtreeFlags & 65011712, y !== null ? e = Rt(y, e) : (e = Eu(
      e,
      f,
      u,
      null
    ), e.flags |= 2), e.return = t, a.return = t, a.sibling = e, t.child = a, a = e, e = t.child, f = l.child.memoizedState, f === null ? f = cf(u) : (i = f.cachePool, i !== null ? (y = bl._currentValue, i = i.parent !== y ? { parent: y, pool: y } : i) : i = Es(), f = {
      baseLanes: f.baseLanes | u,
      cachePool: i
    }), e.memoizedState = f, e.childLanes = ff(
      l,
      c,
      u
    ), t.memoizedState = nf, a) : (Ft(t), u = l.child, l = u.sibling, u = Rt(u, {
      mode: "visible",
      children: a.children
    }), u.return = t, u.sibling = null, l !== null && (c = t.deletions, c === null ? (t.deletions = [l], t.flags |= 16) : c.push(l)), t.child = u, t.memoizedState = null, u);
  }
  function sf(l, t) {
    return t = on(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function on(l, t) {
    return l = Fl(22, l, null, t), l.lanes = 0, l.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, l;
  }
  function of(l, t, u) {
    return ca(t, l.child, null, u), l = sf(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function jo(l, t, u) {
    l.lanes |= t;
    var a = l.alternate;
    a !== null && (a.lanes |= t), Dc(l.return, t, u);
  }
  function df(l, t, u, a, e) {
    var n = l.memoizedState;
    n === null ? l.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: u,
      tailMode: e
    } : (n.isBackwards = t, n.rendering = null, n.renderingStartTime = 0, n.last = a, n.tail = u, n.tailMode = e);
  }
  function Yo(l, t, u) {
    var a = t.pendingProps, e = a.revealOrder, n = a.tail;
    if (Rl(l, t, a.children, u), a = Tl.current, (a & 2) !== 0)
      a = a & 1 | 2, t.flags |= 128;
    else {
      if (l !== null && (l.flags & 128) !== 0)
        l: for (l = t.child; l !== null; ) {
          if (l.tag === 13)
            l.memoizedState !== null && jo(l, u, t);
          else if (l.tag === 19)
            jo(l, u, t);
          else if (l.child !== null) {
            l.child.return = l, l = l.child;
            continue;
          }
          if (l === t) break l;
          for (; l.sibling === null; ) {
            if (l.return === null || l.return === t)
              break l;
            l = l.return;
          }
          l.sibling.return = l.return, l = l.sibling;
        }
      a &= 1;
    }
    switch (_(Tl, a), e) {
      case "forwards":
        for (u = t.child, e = null; u !== null; )
          l = u.alternate, l !== null && nn(l) === null && (e = u), u = u.sibling;
        u = e, u === null ? (e = t.child, t.child = null) : (e = u.sibling, u.sibling = null), df(
          t,
          !1,
          e,
          u,
          n
        );
        break;
      case "backwards":
        for (u = null, e = t.child, t.child = null; e !== null; ) {
          if (l = e.alternate, l !== null && nn(l) === null) {
            t.child = e;
            break;
          }
          l = e.sibling, e.sibling = u, u = e, e = l;
        }
        df(
          t,
          !0,
          u,
          null,
          n
        );
        break;
      case "together":
        df(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function qt(l, t, u) {
    if (l !== null && (t.dependencies = l.dependencies), au |= t.lanes, (u & t.childLanes) === 0)
      if (l !== null) {
        if (Ya(
          l,
          t,
          u,
          !1
        ), (u & t.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && t.child !== l.child)
      throw Error(r(153));
    if (t.child !== null) {
      for (l = t.child, u = Rt(l, l.pendingProps), t.child = u, u.return = t; l.sibling !== null; )
        l = l.sibling, u = u.sibling = Rt(l, l.pendingProps), u.return = t;
      u.sibling = null;
    }
    return t.child;
  }
  function rf(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && Ve(l)));
  }
  function w0(l, t, u) {
    switch (t.tag) {
      case 3:
        ol(t, t.stateNode.containerInfo), Jt(t, bl, l.memoizedState.cache), qa();
        break;
      case 27:
      case 5:
        Xn(t);
        break;
      case 4:
        ol(t, t.stateNode.containerInfo);
        break;
      case 10:
        Jt(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (Ft(t), t.flags |= 128, null) : (u & t.child.childLanes) !== 0 ? qo(l, t, u) : (Ft(t), l = qt(
            l,
            t,
            u
          ), l !== null ? l.sibling : null);
        Ft(t);
        break;
      case 19:
        var e = (l.flags & 128) !== 0;
        if (a = (u & t.childLanes) !== 0, a || (Ya(
          l,
          t,
          u,
          !1
        ), a = (u & t.childLanes) !== 0), e) {
          if (a)
            return Yo(
              l,
              t,
              u
            );
          t.flags |= 128;
        }
        if (e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null, e.lastEffect = null), _(Tl, Tl.current), a) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, No(l, t, u);
      case 24:
        Jt(t, bl, l.memoizedState.cache);
    }
    return qt(l, t, u);
  }
  function Go(l, t, u) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        pl = !0;
      else {
        if (!rf(l, u) && (t.flags & 128) === 0)
          return pl = !1, w0(
            l,
            t,
            u
          );
        pl = (l.flags & 131072) !== 0;
      }
    else
      pl = !1, ll && (t.flags & 1048576) !== 0 && hs(t, Ze, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          l = t.pendingProps;
          var a = t.elementType, e = a._init;
          if (a = e(a._payload), t.type = a, typeof a == "function")
            Tc(a) ? (l = Uu(a, l), t.tag = 1, t = Co(
              null,
              t,
              a,
              l,
              u
            )) : (t.tag = 0, t = ef(
              null,
              t,
              a,
              l,
              u
            ));
          else {
            if (a != null) {
              if (e = a.$$typeof, e === ht) {
                t.tag = 11, t = _o(
                  null,
                  t,
                  a,
                  l,
                  u
                );
                break l;
              } else if (e === Kl) {
                t.tag = 14, t = Ro(
                  null,
                  t,
                  a,
                  l,
                  u
                );
                break l;
              }
            }
            throw t = yu(a) || a, Error(r(306, t, ""));
          }
        }
        return t;
      case 0:
        return ef(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 1:
        return a = t.type, e = Uu(
          a,
          t.pendingProps
        ), Co(
          l,
          t,
          a,
          e,
          u
        );
      case 3:
        l: {
          if (ol(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(r(387));
          a = t.pendingProps;
          var n = t.memoizedState;
          e = n.element, Cc(l, t), Ka(t, a, null, u);
          var c = t.memoizedState;
          if (a = c.cache, Jt(t, bl, a), a !== n.cache && _c(
            t,
            [bl],
            u,
            !0
          ), La(), a = c.element, n.isDehydrated)
            if (n = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, t.updateQueue.baseState = n, t.memoizedState = n, t.flags & 256) {
              t = Bo(
                l,
                t,
                a,
                u
              );
              break l;
            } else if (a !== e) {
              e = ct(
                Error(r(424)),
                t
              ), ja(e), t = Bo(
                l,
                t,
                a,
                u
              );
              break l;
            } else {
              switch (l = t.stateNode.containerInfo, l.nodeType) {
                case 9:
                  l = l.body;
                  break;
                default:
                  l = l.nodeName === "HTML" ? l.ownerDocument.body : l;
              }
              for (vl = gt(l.firstChild), Yl = t, ll = !0, Ou = null, Tt = !0, u = go(
                t,
                null,
                a,
                u
              ), t.child = u; u; )
                u.flags = u.flags & -3 | 4096, u = u.sibling;
            }
          else {
            if (qa(), a === e) {
              t = qt(
                l,
                t,
                u
              );
              break l;
            }
            Rl(
              l,
              t,
              a,
              u
            );
          }
          t = t.child;
        }
        return t;
      case 26:
        return sn(l, t), l === null ? (u = Vd(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = u : ll || (u = t.type, l = t.pendingProps, a = On(
          Q.current
        ).createElement(u), a[Bl] = t, a[Gl] = l, Nl(a, u, l), Al(a), t.stateNode = a) : t.memoizedState = Vd(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return Xn(t), l === null && ll && (a = t.stateNode = Xd(
          t.type,
          t.pendingProps,
          Q.current
        ), Yl = t, Tt = !0, e = vl, fu(t.type) ? (Jf = e, vl = gt(
          a.firstChild
        )) : vl = e), Rl(
          l,
          t,
          t.pendingProps.children,
          u
        ), sn(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && ll && ((e = a = vl) && (a = Ev(
          a,
          t.type,
          t.pendingProps,
          Tt
        ), a !== null ? (t.stateNode = a, Yl = t, vl = gt(
          a.firstChild
        ), Tt = !1, e = !0) : e = !1), e || zu(t)), Xn(t), e = t.type, n = t.pendingProps, c = l !== null ? l.memoizedProps : null, a = n.children, Zf(e, n) ? a = null : c !== null && Zf(e, c) && (t.flags |= 32), t.memoizedState !== null && (e = Xc(
          l,
          t,
          G0,
          null,
          null,
          u
        ), ve._currentValue = e), sn(l, t), Rl(l, t, a, u), t.child;
      case 6:
        return l === null && ll && ((l = u = vl) && (u = Av(
          u,
          t.pendingProps,
          Tt
        ), u !== null ? (t.stateNode = u, Yl = t, vl = null, l = !0) : l = !1), l || zu(t)), null;
      case 13:
        return qo(l, t, u);
      case 4:
        return ol(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, l === null ? t.child = ca(
          t,
          null,
          a,
          u
        ) : Rl(
          l,
          t,
          a,
          u
        ), t.child;
      case 11:
        return _o(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 7:
        return Rl(
          l,
          t,
          t.pendingProps,
          u
        ), t.child;
      case 8:
        return Rl(
          l,
          t,
          t.pendingProps.children,
          u
        ), t.child;
      case 12:
        return Rl(
          l,
          t,
          t.pendingProps.children,
          u
        ), t.child;
      case 10:
        return a = t.pendingProps, Jt(t, t.type, a.value), Rl(
          l,
          t,
          a.children,
          u
        ), t.child;
      case 9:
        return e = t.type._context, a = t.pendingProps.children, Du(t), e = ql(e), a = a(e), t.flags |= 1, Rl(l, t, a, u), t.child;
      case 14:
        return Ro(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 15:
        return Uo(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 19:
        return Yo(l, t, u);
      case 31:
        return a = t.pendingProps, u = t.mode, a = {
          mode: a.mode,
          children: a.children
        }, l === null ? (u = on(
          a,
          u
        ), u.ref = t.ref, t.child = u, u.return = t, t = u) : (u = Rt(l.child, a), u.ref = t.ref, t.child = u, u.return = t, t = u), t;
      case 22:
        return No(l, t, u);
      case 24:
        return Du(t), a = ql(bl), l === null ? (e = Nc(), e === null && (e = sl, n = Rc(), e.pooledCache = n, n.refCount++, n !== null && (e.pooledCacheLanes |= u), e = n), t.memoizedState = {
          parent: a,
          cache: e
        }, Hc(t), Jt(t, bl, e)) : ((l.lanes & u) !== 0 && (Cc(l, t), Ka(t, null, null, u), La()), e = l.memoizedState, n = t.memoizedState, e.parent !== a ? (e = { parent: a, cache: a }, t.memoizedState = e, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = e), Jt(t, bl, a)) : (a = n.cache, Jt(t, bl, a), a !== e.cache && _c(
          t,
          [bl],
          u,
          !0
        ))), Rl(
          l,
          t,
          t.pendingProps.children,
          u
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(r(156, t.tag));
  }
  function jt(l) {
    l.flags |= 4;
  }
  function Xo(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !$d(t)) {
      if (t = ot.current, t !== null && ((W & 4194048) === W ? Et !== null : (W & 62914560) !== W && (W & 536870912) === 0 || t !== Et))
        throw Za = xc, As;
      l.flags |= 8192;
    }
  }
  function dn(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? gi() : 536870912, l.lanes |= t, oa |= t);
  }
  function Ia(l, t) {
    if (!ll)
      switch (l.tailMode) {
        case "hidden":
          t = l.tail;
          for (var u = null; t !== null; )
            t.alternate !== null && (u = t), t = t.sibling;
          u === null ? l.tail = null : u.sibling = null;
          break;
        case "collapsed":
          u = l.tail;
          for (var a = null; u !== null; )
            u.alternate !== null && (a = u), u = u.sibling;
          a === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : a.sibling = null;
      }
  }
  function rl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, u = 0, a = 0;
    if (t)
      for (var e = l.child; e !== null; )
        u |= e.lanes | e.childLanes, a |= e.subtreeFlags & 65011712, a |= e.flags & 65011712, e.return = l, e = e.sibling;
    else
      for (e = l.child; e !== null; )
        u |= e.lanes | e.childLanes, a |= e.subtreeFlags, a |= e.flags, e.return = l, e = e.sibling;
    return l.subtreeFlags |= a, l.childLanes = u, t;
  }
  function $0(l, t, u) {
    var a = t.pendingProps;
    switch (Oc(t), t.tag) {
      case 31:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return rl(t), null;
      case 1:
        return rl(t), null;
      case 3:
        return u = t.stateNode, a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Ht(bl), Zt(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (l === null || l.child === null) && (Ba(t) ? jt(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, gs())), rl(t), null;
      case 26:
        return u = t.memoizedState, l === null ? (jt(t), u !== null ? (rl(t), Xo(t, u)) : (rl(t), t.flags &= -16777217)) : u ? u !== l.memoizedState ? (jt(t), rl(t), Xo(t, u)) : (rl(t), t.flags &= -16777217) : (l.memoizedProps !== a && jt(t), rl(t), t.flags &= -16777217), null;
      case 27:
        Ee(t), u = Q.current;
        var e = t.type;
        if (l !== null && t.stateNode != null)
          l.memoizedProps !== a && jt(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return rl(t), null;
          }
          l = B.current, Ba(t) ? ys(t) : (l = Xd(e, a, u), t.stateNode = l, jt(t));
        }
        return rl(t), null;
      case 5:
        if (Ee(t), u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && jt(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return rl(t), null;
          }
          if (l = B.current, Ba(t))
            ys(t);
          else {
            switch (e = On(
              Q.current
            ), l) {
              case 1:
                l = e.createElementNS(
                  "http://www.w3.org/2000/svg",
                  u
                );
                break;
              case 2:
                l = e.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  u
                );
                break;
              default:
                switch (u) {
                  case "svg":
                    l = e.createElementNS(
                      "http://www.w3.org/2000/svg",
                      u
                    );
                    break;
                  case "math":
                    l = e.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      u
                    );
                    break;
                  case "script":
                    l = e.createElement("div"), l.innerHTML = "<script><\/script>", l = l.removeChild(l.firstChild);
                    break;
                  case "select":
                    l = typeof a.is == "string" ? e.createElement("select", { is: a.is }) : e.createElement("select"), a.multiple ? l.multiple = !0 : a.size && (l.size = a.size);
                    break;
                  default:
                    l = typeof a.is == "string" ? e.createElement(u, { is: a.is }) : e.createElement(u);
                }
            }
            l[Bl] = t, l[Gl] = a;
            l: for (e = t.child; e !== null; ) {
              if (e.tag === 5 || e.tag === 6)
                l.appendChild(e.stateNode);
              else if (e.tag !== 4 && e.tag !== 27 && e.child !== null) {
                e.child.return = e, e = e.child;
                continue;
              }
              if (e === t) break l;
              for (; e.sibling === null; ) {
                if (e.return === null || e.return === t)
                  break l;
                e = e.return;
              }
              e.sibling.return = e.return, e = e.sibling;
            }
            t.stateNode = l;
            l: switch (Nl(l, u, a), u) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!a.autoFocus;
                break l;
              case "img":
                l = !0;
                break l;
              default:
                l = !1;
            }
            l && jt(t);
          }
        }
        return rl(t), t.flags &= -16777217, null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== a && jt(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(r(166));
          if (l = Q.current, Ba(t)) {
            if (l = t.stateNode, u = t.memoizedProps, a = null, e = Yl, e !== null)
              switch (e.tag) {
                case 27:
                case 5:
                  a = e.memoizedProps;
              }
            l[Bl] = t, l = !!(l.nodeValue === u || a !== null && a.suppressHydrationWarning === !0 || Hd(l.nodeValue, u)), l || zu(t);
          } else
            l = On(l).createTextNode(
              a
            ), l[Bl] = t, t.stateNode = l;
        }
        return rl(t), null;
      case 13:
        if (a = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (e = Ba(t), a !== null && a.dehydrated !== null) {
            if (l === null) {
              if (!e) throw Error(r(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
              e[Bl] = t;
            } else
              qa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            rl(t), e = !1;
          } else
            e = gs(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e), e = !0;
          if (!e)
            return t.flags & 256 ? (Bt(t), t) : (Bt(t), null);
        }
        if (Bt(t), (t.flags & 128) !== 0)
          return t.lanes = u, t;
        if (u = a !== null, l = l !== null && l.memoizedState !== null, u) {
          a = t.child, e = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (e = a.alternate.memoizedState.cachePool.pool);
          var n = null;
          a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool), n !== e && (a.flags |= 2048);
        }
        return u !== l && u && (t.child.flags |= 8192), dn(t, t.updateQueue), rl(t), null;
      case 4:
        return Zt(), l === null && jf(t.stateNode.containerInfo), rl(t), null;
      case 10:
        return Ht(t.type), rl(t), null;
      case 19:
        if (U(Tl), e = t.memoizedState, e === null) return rl(t), null;
        if (a = (t.flags & 128) !== 0, n = e.rendering, n === null)
          if (a) Ia(e, !1);
          else {
            if (hl !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = nn(l), n !== null) {
                  for (t.flags |= 128, Ia(e, !1), l = n.updateQueue, t.updateQueue = l, dn(t, l), t.subtreeFlags = 0, l = u, u = t.child; u !== null; )
                    vs(u, l), u = u.sibling;
                  return _(
                    Tl,
                    Tl.current & 1 | 2
                  ), t.child;
                }
                l = l.sibling;
              }
            e.tail !== null && bt() > hn && (t.flags |= 128, a = !0, Ia(e, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (l = nn(n), l !== null) {
              if (t.flags |= 128, a = !0, l = l.updateQueue, t.updateQueue = l, dn(t, l), Ia(e, !0), e.tail === null && e.tailMode === "hidden" && !n.alternate && !ll)
                return rl(t), null;
            } else
              2 * bt() - e.renderingStartTime > hn && u !== 536870912 && (t.flags |= 128, a = !0, Ia(e, !1), t.lanes = 4194304);
          e.isBackwards ? (n.sibling = t.child, t.child = n) : (l = e.last, l !== null ? l.sibling = n : t.child = n, e.last = n);
        }
        return e.tail !== null ? (t = e.tail, e.rendering = t, e.tail = t.sibling, e.renderingStartTime = bt(), t.sibling = null, l = Tl.current, _(Tl, a ? l & 1 | 2 : l & 1), t) : (rl(t), null);
      case 22:
      case 23:
        return Bt(t), Yc(), a = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (u & 536870912) !== 0 && (t.flags & 128) === 0 && (rl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : rl(t), u = t.updateQueue, u !== null && dn(t, u.retryQueue), u = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== u && (t.flags |= 2048), l !== null && U(_u), null;
      case 24:
        return u = null, l !== null && (u = l.memoizedState.cache), t.memoizedState.cache !== u && (t.flags |= 2048), Ht(bl), rl(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(r(156, t.tag));
  }
  function W0(l, t) {
    switch (Oc(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return Ht(bl), Zt(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Ee(t), null;
      case 13:
        if (Bt(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(r(340));
          qa();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return U(Tl), null;
      case 4:
        return Zt(), null;
      case 10:
        return Ht(t.type), null;
      case 22:
      case 23:
        return Bt(t), Yc(), l !== null && U(_u), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return Ht(bl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Qo(l, t) {
    switch (Oc(t), t.tag) {
      case 3:
        Ht(bl), Zt();
        break;
      case 26:
      case 27:
      case 5:
        Ee(t);
        break;
      case 4:
        Zt();
        break;
      case 13:
        Bt(t);
        break;
      case 19:
        U(Tl);
        break;
      case 10:
        Ht(t.type);
        break;
      case 22:
      case 23:
        Bt(t), Yc(), l !== null && U(_u);
        break;
      case 24:
        Ht(bl);
    }
  }
  function Pa(l, t) {
    try {
      var u = t.updateQueue, a = u !== null ? u.lastEffect : null;
      if (a !== null) {
        var e = a.next;
        u = e;
        do {
          if ((u.tag & l) === l) {
            a = void 0;
            var n = u.create, c = u.inst;
            a = n(), c.destroy = a;
          }
          u = u.next;
        } while (u !== e);
      }
    } catch (f) {
      il(t, t.return, f);
    }
  }
  function Pt(l, t, u) {
    try {
      var a = t.updateQueue, e = a !== null ? a.lastEffect : null;
      if (e !== null) {
        var n = e.next;
        a = n;
        do {
          if ((a.tag & l) === l) {
            var c = a.inst, f = c.destroy;
            if (f !== void 0) {
              c.destroy = void 0, e = t;
              var i = u, y = f;
              try {
                y();
              } catch (T) {
                il(
                  e,
                  i,
                  T
                );
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (T) {
      il(t, t.return, T);
    }
  }
  function Zo(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var u = l.stateNode;
      try {
        _s(t, u);
      } catch (a) {
        il(l, l.return, a);
      }
    }
  }
  function Vo(l, t, u) {
    u.props = Uu(
      l.type,
      l.memoizedProps
    ), u.state = l.memoizedState;
    try {
      u.componentWillUnmount();
    } catch (a) {
      il(l, t, a);
    }
  }
  function le(l, t) {
    try {
      var u = l.ref;
      if (u !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var a = l.stateNode;
            break;
          case 30:
            a = l.stateNode;
            break;
          default:
            a = l.stateNode;
        }
        typeof u == "function" ? l.refCleanup = u(a) : u.current = a;
      }
    } catch (e) {
      il(l, t, e);
    }
  }
  function At(l, t) {
    var u = l.ref, a = l.refCleanup;
    if (u !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (e) {
          il(l, t, e);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof u == "function")
        try {
          u(null);
        } catch (e) {
          il(l, t, e);
        }
      else u.current = null;
  }
  function Lo(l) {
    var t = l.type, u = l.memoizedProps, a = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          u.autoFocus && a.focus();
          break l;
        case "img":
          u.src ? a.src = u.src : u.srcSet && (a.srcset = u.srcSet);
      }
    } catch (e) {
      il(l, l.return, e);
    }
  }
  function vf(l, t, u) {
    try {
      var a = l.stateNode;
      mv(a, l.type, u, t), a[Gl] = t;
    } catch (e) {
      il(l, l.return, e);
    }
  }
  function Ko(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && fu(l.type) || l.tag === 4;
  }
  function hf(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || Ko(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && fu(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function yf(l, t, u) {
    var a = l.tag;
    if (a === 5 || a === 6)
      l = l.stateNode, t ? (u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u).insertBefore(l, t) : (t = u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u, t.appendChild(l), u = u._reactRootContainer, u != null || t.onclick !== null || (t.onclick = pn));
    else if (a !== 4 && (a === 27 && fu(l.type) && (u = l.stateNode, t = null), l = l.child, l !== null))
      for (yf(l, t, u), l = l.sibling; l !== null; )
        yf(l, t, u), l = l.sibling;
  }
  function rn(l, t, u) {
    var a = l.tag;
    if (a === 5 || a === 6)
      l = l.stateNode, t ? u.insertBefore(l, t) : u.appendChild(l);
    else if (a !== 4 && (a === 27 && fu(l.type) && (u = l.stateNode), l = l.child, l !== null))
      for (rn(l, t, u), l = l.sibling; l !== null; )
        rn(l, t, u), l = l.sibling;
  }
  function Jo(l) {
    var t = l.stateNode, u = l.memoizedProps;
    try {
      for (var a = l.type, e = t.attributes; e.length; )
        t.removeAttributeNode(e[0]);
      Nl(t, a, u), t[Bl] = l, t[Gl] = u;
    } catch (n) {
      il(l, l.return, n);
    }
  }
  var Yt = !1, ml = !1, mf = !1, wo = typeof WeakSet == "function" ? WeakSet : Set, Ol = null;
  function k0(l, t) {
    if (l = l.containerInfo, Xf = Un, l = as(l), vc(l)) {
      if ("selectionStart" in l)
        var u = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        l: {
          u = (u = l.ownerDocument) && u.defaultView || window;
          var a = u.getSelection && u.getSelection();
          if (a && a.rangeCount !== 0) {
            u = a.anchorNode;
            var e = a.anchorOffset, n = a.focusNode;
            a = a.focusOffset;
            try {
              u.nodeType, n.nodeType;
            } catch {
              u = null;
              break l;
            }
            var c = 0, f = -1, i = -1, y = 0, T = 0, p = l, m = null;
            t: for (; ; ) {
              for (var S; p !== u || e !== 0 && p.nodeType !== 3 || (f = c + e), p !== n || a !== 0 && p.nodeType !== 3 || (i = c + a), p.nodeType === 3 && (c += p.nodeValue.length), (S = p.firstChild) !== null; )
                m = p, p = S;
              for (; ; ) {
                if (p === l) break t;
                if (m === u && ++y === e && (f = c), m === n && ++T === a && (i = c), (S = p.nextSibling) !== null) break;
                p = m, m = p.parentNode;
              }
              p = S;
            }
            u = f === -1 || i === -1 ? null : { start: f, end: i };
          } else u = null;
        }
      u = u || { start: 0, end: 0 };
    } else u = null;
    for (Qf = { focusedElem: l, selectionRange: u }, Un = !1, Ol = t; Ol !== null; )
      if (t = Ol, l = t.child, (t.subtreeFlags & 1024) !== 0 && l !== null)
        l.return = t, Ol = l;
      else
        for (; Ol !== null; ) {
          switch (t = Ol, n = t.alternate, l = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((l & 1024) !== 0 && n !== null) {
                l = void 0, u = t, e = n.memoizedProps, n = n.memoizedState, a = u.stateNode;
                try {
                  var X = Uu(
                    u.type,
                    e,
                    u.elementType === u.type
                  );
                  l = a.getSnapshotBeforeUpdate(
                    X,
                    n
                  ), a.__reactInternalSnapshotBeforeUpdate = l;
                } catch (q) {
                  il(
                    u,
                    u.return,
                    q
                  );
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (l = t.stateNode.containerInfo, u = l.nodeType, u === 9)
                  Lf(l);
                else if (u === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Lf(l);
                      break;
                    default:
                      l.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((l & 1024) !== 0) throw Error(r(163));
          }
          if (l = t.sibling, l !== null) {
            l.return = t.return, Ol = l;
            break;
          }
          Ol = t.return;
        }
  }
  function $o(l, t, u) {
    var a = u.flags;
    switch (u.tag) {
      case 0:
      case 11:
      case 15:
        lu(l, u), a & 4 && Pa(5, u);
        break;
      case 1:
        if (lu(l, u), a & 4)
          if (l = u.stateNode, t === null)
            try {
              l.componentDidMount();
            } catch (c) {
              il(u, u.return, c);
            }
          else {
            var e = Uu(
              u.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              l.componentDidUpdate(
                e,
                t,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (c) {
              il(
                u,
                u.return,
                c
              );
            }
          }
        a & 64 && Zo(u), a & 512 && le(u, u.return);
        break;
      case 3:
        if (lu(l, u), a & 64 && (l = u.updateQueue, l !== null)) {
          if (t = null, u.child !== null)
            switch (u.child.tag) {
              case 27:
              case 5:
                t = u.child.stateNode;
                break;
              case 1:
                t = u.child.stateNode;
            }
          try {
            _s(l, t);
          } catch (c) {
            il(u, u.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Jo(u);
      case 26:
      case 5:
        lu(l, u), t === null && a & 4 && Lo(u), a & 512 && le(u, u.return);
        break;
      case 12:
        lu(l, u);
        break;
      case 13:
        lu(l, u), a & 4 && Fo(l, u), a & 64 && (l = u.memoizedState, l !== null && (l = l.dehydrated, l !== null && (u = nv.bind(
          null,
          u
        ), pv(l, u))));
        break;
      case 22:
        if (a = u.memoizedState !== null || Yt, !a) {
          t = t !== null && t.memoizedState !== null || ml, e = Yt;
          var n = ml;
          Yt = a, (ml = t) && !n ? tu(
            l,
            u,
            (u.subtreeFlags & 8772) !== 0
          ) : lu(l, u), Yt = e, ml = n;
        }
        break;
      case 30:
        break;
      default:
        lu(l, u);
    }
  }
  function Wo(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, Wo(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && $n(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var dl = null, Zl = !1;
  function Gt(l, t, u) {
    for (u = u.child; u !== null; )
      ko(l, t, u), u = u.sibling;
  }
  function ko(l, t, u) {
    if ($l && typeof $l.onCommitFiberUnmount == "function")
      try {
        $l.onCommitFiberUnmount(Ea, u);
      } catch {
      }
    switch (u.tag) {
      case 26:
        ml || At(u, t), Gt(
          l,
          t,
          u
        ), u.memoizedState ? u.memoizedState.count-- : u.stateNode && (u = u.stateNode, u.parentNode.removeChild(u));
        break;
      case 27:
        ml || At(u, t);
        var a = dl, e = Zl;
        fu(u.type) && (dl = u.stateNode, Zl = !1), Gt(
          l,
          t,
          u
        ), se(u.stateNode), dl = a, Zl = e;
        break;
      case 5:
        ml || At(u, t);
      case 6:
        if (a = dl, e = Zl, dl = null, Gt(
          l,
          t,
          u
        ), dl = a, Zl = e, dl !== null)
          if (Zl)
            try {
              (dl.nodeType === 9 ? dl.body : dl.nodeName === "HTML" ? dl.ownerDocument.body : dl).removeChild(u.stateNode);
            } catch (n) {
              il(
                u,
                t,
                n
              );
            }
          else
            try {
              dl.removeChild(u.stateNode);
            } catch (n) {
              il(
                u,
                t,
                n
              );
            }
        break;
      case 18:
        dl !== null && (Zl ? (l = dl, Yd(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          u.stateNode
        ), ge(l)) : Yd(dl, u.stateNode));
        break;
      case 4:
        a = dl, e = Zl, dl = u.stateNode.containerInfo, Zl = !0, Gt(
          l,
          t,
          u
        ), dl = a, Zl = e;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ml || Pt(2, u, t), ml || Pt(4, u, t), Gt(
          l,
          t,
          u
        );
        break;
      case 1:
        ml || (At(u, t), a = u.stateNode, typeof a.componentWillUnmount == "function" && Vo(
          u,
          t,
          a
        )), Gt(
          l,
          t,
          u
        );
        break;
      case 21:
        Gt(
          l,
          t,
          u
        );
        break;
      case 22:
        ml = (a = ml) || u.memoizedState !== null, Gt(
          l,
          t,
          u
        ), ml = a;
        break;
      default:
        Gt(
          l,
          t,
          u
        );
    }
  }
  function Fo(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        ge(l);
      } catch (u) {
        il(t, t.return, u);
      }
  }
  function F0(l) {
    switch (l.tag) {
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new wo()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new wo()), t;
      default:
        throw Error(r(435, l.tag));
    }
  }
  function gf(l, t) {
    var u = F0(l);
    t.forEach(function(a) {
      var e = cv.bind(null, l, a);
      u.has(a) || (u.add(a), a.then(e, e));
    });
  }
  function Il(l, t) {
    var u = t.deletions;
    if (u !== null)
      for (var a = 0; a < u.length; a++) {
        var e = u[a], n = l, c = t, f = c;
        l: for (; f !== null; ) {
          switch (f.tag) {
            case 27:
              if (fu(f.type)) {
                dl = f.stateNode, Zl = !1;
                break l;
              }
              break;
            case 5:
              dl = f.stateNode, Zl = !1;
              break l;
            case 3:
            case 4:
              dl = f.stateNode.containerInfo, Zl = !0;
              break l;
          }
          f = f.return;
        }
        if (dl === null) throw Error(r(160));
        ko(n, c, e), dl = null, Zl = !1, n = e.alternate, n !== null && (n.return = null), e.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        Io(t, l), t = t.sibling;
  }
  var mt = null;
  function Io(l, t) {
    var u = l.alternate, a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Il(t, l), Pl(l), a & 4 && (Pt(3, l, l.return), Pa(3, l), Pt(5, l, l.return));
        break;
      case 1:
        Il(t, l), Pl(l), a & 512 && (ml || u === null || At(u, u.return)), a & 64 && Yt && (l = l.updateQueue, l !== null && (a = l.callbacks, a !== null && (u = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = u === null ? a : u.concat(a))));
        break;
      case 26:
        var e = mt;
        if (Il(t, l), Pl(l), a & 512 && (ml || u === null || At(u, u.return)), a & 4) {
          var n = u !== null ? u.memoizedState : null;
          if (a = l.memoizedState, u === null)
            if (a === null)
              if (l.stateNode === null) {
                l: {
                  a = l.type, u = l.memoizedProps, e = e.ownerDocument || e;
                  t: switch (a) {
                    case "title":
                      n = e.getElementsByTagName("title")[0], (!n || n[Oa] || n[Bl] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = e.createElement(a), e.head.insertBefore(
                        n,
                        e.querySelector("head > title")
                      )), Nl(n, a, u), n[Bl] = l, Al(n), a = n;
                      break l;
                    case "link":
                      var c = Jd(
                        "link",
                        "href",
                        e
                      ).get(a + (u.href || ""));
                      if (c) {
                        for (var f = 0; f < c.length; f++)
                          if (n = c[f], n.getAttribute("href") === (u.href == null || u.href === "" ? null : u.href) && n.getAttribute("rel") === (u.rel == null ? null : u.rel) && n.getAttribute("title") === (u.title == null ? null : u.title) && n.getAttribute("crossorigin") === (u.crossOrigin == null ? null : u.crossOrigin)) {
                            c.splice(f, 1);
                            break t;
                          }
                      }
                      n = e.createElement(a), Nl(n, a, u), e.head.appendChild(n);
                      break;
                    case "meta":
                      if (c = Jd(
                        "meta",
                        "content",
                        e
                      ).get(a + (u.content || ""))) {
                        for (f = 0; f < c.length; f++)
                          if (n = c[f], n.getAttribute("content") === (u.content == null ? null : "" + u.content) && n.getAttribute("name") === (u.name == null ? null : u.name) && n.getAttribute("property") === (u.property == null ? null : u.property) && n.getAttribute("http-equiv") === (u.httpEquiv == null ? null : u.httpEquiv) && n.getAttribute("charset") === (u.charSet == null ? null : u.charSet)) {
                            c.splice(f, 1);
                            break t;
                          }
                      }
                      n = e.createElement(a), Nl(n, a, u), e.head.appendChild(n);
                      break;
                    default:
                      throw Error(r(468, a));
                  }
                  n[Bl] = l, Al(n), a = n;
                }
                l.stateNode = a;
              } else
                wd(
                  e,
                  l.type,
                  l.stateNode
                );
            else
              l.stateNode = Kd(
                e,
                a,
                l.memoizedProps
              );
          else
            n !== a ? (n === null ? u.stateNode !== null && (u = u.stateNode, u.parentNode.removeChild(u)) : n.count--, a === null ? wd(
              e,
              l.type,
              l.stateNode
            ) : Kd(
              e,
              a,
              l.memoizedProps
            )) : a === null && l.stateNode !== null && vf(
              l,
              l.memoizedProps,
              u.memoizedProps
            );
        }
        break;
      case 27:
        Il(t, l), Pl(l), a & 512 && (ml || u === null || At(u, u.return)), u !== null && a & 4 && vf(
          l,
          l.memoizedProps,
          u.memoizedProps
        );
        break;
      case 5:
        if (Il(t, l), Pl(l), a & 512 && (ml || u === null || At(u, u.return)), l.flags & 32) {
          e = l.stateNode;
          try {
            Zu(e, "");
          } catch (S) {
            il(l, l.return, S);
          }
        }
        a & 4 && l.stateNode != null && (e = l.memoizedProps, vf(
          l,
          e,
          u !== null ? u.memoizedProps : e
        )), a & 1024 && (mf = !0);
        break;
      case 6:
        if (Il(t, l), Pl(l), a & 4) {
          if (l.stateNode === null)
            throw Error(r(162));
          a = l.memoizedProps, u = l.stateNode;
          try {
            u.nodeValue = a;
          } catch (S) {
            il(l, l.return, S);
          }
        }
        break;
      case 3:
        if (Dn = null, e = mt, mt = zn(t.containerInfo), Il(t, l), mt = e, Pl(l), a & 4 && u !== null && u.memoizedState.isDehydrated)
          try {
            ge(t.containerInfo);
          } catch (S) {
            il(l, l.return, S);
          }
        mf && (mf = !1, Po(l));
        break;
      case 4:
        a = mt, mt = zn(
          l.stateNode.containerInfo
        ), Il(t, l), Pl(l), mt = a;
        break;
      case 12:
        Il(t, l), Pl(l);
        break;
      case 13:
        Il(t, l), Pl(l), l.child.flags & 8192 && l.memoizedState !== null != (u !== null && u.memoizedState !== null) && (pf = bt()), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, gf(l, a)));
        break;
      case 22:
        e = l.memoizedState !== null;
        var i = u !== null && u.memoizedState !== null, y = Yt, T = ml;
        if (Yt = y || e, ml = T || i, Il(t, l), ml = T, Yt = y, Pl(l), a & 8192)
          l: for (t = l.stateNode, t._visibility = e ? t._visibility & -2 : t._visibility | 1, e && (u === null || i || Yt || ml || Nu(l)), u = null, t = l; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (u === null) {
                i = u = t;
                try {
                  if (n = i.stateNode, e)
                    c = n.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    f = i.stateNode;
                    var p = i.memoizedProps.style, m = p != null && p.hasOwnProperty("display") ? p.display : null;
                    f.style.display = m == null || typeof m == "boolean" ? "" : ("" + m).trim();
                  }
                } catch (S) {
                  il(i, i.return, S);
                }
              }
            } else if (t.tag === 6) {
              if (u === null) {
                i = t;
                try {
                  i.stateNode.nodeValue = e ? "" : i.memoizedProps;
                } catch (S) {
                  il(i, i.return, S);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === l) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === l) break l;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === l) break l;
              u === t && (u = null), t = t.return;
            }
            u === t && (u = null), t.sibling.return = t.return, t = t.sibling;
          }
        a & 4 && (a = l.updateQueue, a !== null && (u = a.retryQueue, u !== null && (a.retryQueue = null, gf(l, u))));
        break;
      case 19:
        Il(t, l), Pl(l), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, gf(l, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Il(t, l), Pl(l);
    }
  }
  function Pl(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var u, a = l.return; a !== null; ) {
          if (Ko(a)) {
            u = a;
            break;
          }
          a = a.return;
        }
        if (u == null) throw Error(r(160));
        switch (u.tag) {
          case 27:
            var e = u.stateNode, n = hf(l);
            rn(l, n, e);
            break;
          case 5:
            var c = u.stateNode;
            u.flags & 32 && (Zu(c, ""), u.flags &= -33);
            var f = hf(l);
            rn(l, f, c);
            break;
          case 3:
          case 4:
            var i = u.stateNode.containerInfo, y = hf(l);
            yf(
              l,
              y,
              i
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (T) {
        il(l, l.return, T);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function Po(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        Po(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), l = l.sibling;
      }
  }
  function lu(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        $o(l, t.alternate, t), t = t.sibling;
  }
  function Nu(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Pt(4, t, t.return), Nu(t);
          break;
        case 1:
          At(t, t.return);
          var u = t.stateNode;
          typeof u.componentWillUnmount == "function" && Vo(
            t,
            t.return,
            u
          ), Nu(t);
          break;
        case 27:
          se(t.stateNode);
        case 26:
        case 5:
          At(t, t.return), Nu(t);
          break;
        case 22:
          t.memoizedState === null && Nu(t);
          break;
        case 30:
          Nu(t);
          break;
        default:
          Nu(t);
      }
      l = l.sibling;
    }
  }
  function tu(l, t, u) {
    for (u = u && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, e = l, n = t, c = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          tu(
            e,
            n,
            u
          ), Pa(4, n);
          break;
        case 1:
          if (tu(
            e,
            n,
            u
          ), a = n, e = a.stateNode, typeof e.componentDidMount == "function")
            try {
              e.componentDidMount();
            } catch (y) {
              il(a, a.return, y);
            }
          if (a = n, e = a.updateQueue, e !== null) {
            var f = a.stateNode;
            try {
              var i = e.shared.hiddenCallbacks;
              if (i !== null)
                for (e.shared.hiddenCallbacks = null, e = 0; e < i.length; e++)
                  Ds(i[e], f);
            } catch (y) {
              il(a, a.return, y);
            }
          }
          u && c & 64 && Zo(n), le(n, n.return);
          break;
        case 27:
          Jo(n);
        case 26:
        case 5:
          tu(
            e,
            n,
            u
          ), u && a === null && c & 4 && Lo(n), le(n, n.return);
          break;
        case 12:
          tu(
            e,
            n,
            u
          );
          break;
        case 13:
          tu(
            e,
            n,
            u
          ), u && c & 4 && Fo(e, n);
          break;
        case 22:
          n.memoizedState === null && tu(
            e,
            n,
            u
          ), le(n, n.return);
          break;
        case 30:
          break;
        default:
          tu(
            e,
            n,
            u
          );
      }
      t = t.sibling;
    }
  }
  function Sf(l, t) {
    var u = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== u && (l != null && l.refCount++, u != null && Ga(u));
  }
  function bf(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Ga(l));
  }
  function pt(l, t, u, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        ld(
          l,
          t,
          u,
          a
        ), t = t.sibling;
  }
  function ld(l, t, u, a) {
    var e = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        pt(
          l,
          t,
          u,
          a
        ), e & 2048 && Pa(9, t);
        break;
      case 1:
        pt(
          l,
          t,
          u,
          a
        );
        break;
      case 3:
        pt(
          l,
          t,
          u,
          a
        ), e & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Ga(l)));
        break;
      case 12:
        if (e & 2048) {
          pt(
            l,
            t,
            u,
            a
          ), l = t.stateNode;
          try {
            var n = t.memoizedProps, c = n.id, f = n.onPostCommit;
            typeof f == "function" && f(
              c,
              t.alternate === null ? "mount" : "update",
              l.passiveEffectDuration,
              -0
            );
          } catch (i) {
            il(t, t.return, i);
          }
        } else
          pt(
            l,
            t,
            u,
            a
          );
        break;
      case 13:
        pt(
          l,
          t,
          u,
          a
        );
        break;
      case 23:
        break;
      case 22:
        n = t.stateNode, c = t.alternate, t.memoizedState !== null ? n._visibility & 2 ? pt(
          l,
          t,
          u,
          a
        ) : te(l, t) : n._visibility & 2 ? pt(
          l,
          t,
          u,
          a
        ) : (n._visibility |= 2, fa(
          l,
          t,
          u,
          a,
          (t.subtreeFlags & 10256) !== 0
        )), e & 2048 && Sf(c, t);
        break;
      case 24:
        pt(
          l,
          t,
          u,
          a
        ), e & 2048 && bf(t.alternate, t);
        break;
      default:
        pt(
          l,
          t,
          u,
          a
        );
    }
  }
  function fa(l, t, u, a, e) {
    for (e = e && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var n = l, c = t, f = u, i = a, y = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          fa(
            n,
            c,
            f,
            i,
            e
          ), Pa(8, c);
          break;
        case 23:
          break;
        case 22:
          var T = c.stateNode;
          c.memoizedState !== null ? T._visibility & 2 ? fa(
            n,
            c,
            f,
            i,
            e
          ) : te(
            n,
            c
          ) : (T._visibility |= 2, fa(
            n,
            c,
            f,
            i,
            e
          )), e && y & 2048 && Sf(
            c.alternate,
            c
          );
          break;
        case 24:
          fa(
            n,
            c,
            f,
            i,
            e
          ), e && y & 2048 && bf(c.alternate, c);
          break;
        default:
          fa(
            n,
            c,
            f,
            i,
            e
          );
      }
      t = t.sibling;
    }
  }
  function te(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var u = l, a = t, e = a.flags;
        switch (a.tag) {
          case 22:
            te(u, a), e & 2048 && Sf(
              a.alternate,
              a
            );
            break;
          case 24:
            te(u, a), e & 2048 && bf(a.alternate, a);
            break;
          default:
            te(u, a);
        }
        t = t.sibling;
      }
  }
  var ue = 8192;
  function ia(l) {
    if (l.subtreeFlags & ue)
      for (l = l.child; l !== null; )
        td(l), l = l.sibling;
  }
  function td(l) {
    switch (l.tag) {
      case 26:
        ia(l), l.flags & ue && l.memoizedState !== null && qv(
          mt,
          l.memoizedState,
          l.memoizedProps
        );
        break;
      case 5:
        ia(l);
        break;
      case 3:
      case 4:
        var t = mt;
        mt = zn(l.stateNode.containerInfo), ia(l), mt = t;
        break;
      case 22:
        l.memoizedState === null && (t = l.alternate, t !== null && t.memoizedState !== null ? (t = ue, ue = 16777216, ia(l), ue = t) : ia(l));
        break;
      default:
        ia(l);
    }
  }
  function ud(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child, l !== null)) {
      t.child = null;
      do
        t = l.sibling, l.sibling = null, l = t;
      while (l !== null);
    }
  }
  function ae(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var u = 0; u < t.length; u++) {
          var a = t[u];
          Ol = a, ed(
            a,
            l
          );
        }
      ud(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        ad(l), l = l.sibling;
  }
  function ad(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        ae(l), l.flags & 2048 && Pt(9, l, l.return);
        break;
      case 3:
        ae(l);
        break;
      case 12:
        ae(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, vn(l)) : ae(l);
        break;
      default:
        ae(l);
    }
  }
  function vn(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var u = 0; u < t.length; u++) {
          var a = t[u];
          Ol = a, ed(
            a,
            l
          );
        }
      ud(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          Pt(8, t, t.return), vn(t);
          break;
        case 22:
          u = t.stateNode, u._visibility & 2 && (u._visibility &= -3, vn(t));
          break;
        default:
          vn(t);
      }
      l = l.sibling;
    }
  }
  function ed(l, t) {
    for (; Ol !== null; ) {
      var u = Ol;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Pt(8, u, t);
          break;
        case 23:
        case 22:
          if (u.memoizedState !== null && u.memoizedState.cachePool !== null) {
            var a = u.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Ga(u.memoizedState.cache);
      }
      if (a = u.child, a !== null) a.return = u, Ol = a;
      else
        l: for (u = l; Ol !== null; ) {
          a = Ol;
          var e = a.sibling, n = a.return;
          if (Wo(a), a === u) {
            Ol = null;
            break l;
          }
          if (e !== null) {
            e.return = n, Ol = e;
            break l;
          }
          Ol = n;
        }
    }
  }
  var I0 = {
    getCacheForType: function(l) {
      var t = ql(bl), u = t.data.get(l);
      return u === void 0 && (u = l(), t.data.set(l, u)), u;
    }
  }, P0 = typeof WeakMap == "function" ? WeakMap : Map, ul = 0, sl = null, J = null, W = 0, al = 0, lt = null, uu = !1, sa = !1, Tf = !1, Xt = 0, hl = 0, au = 0, xu = 0, Ef = 0, dt = 0, oa = 0, ee = null, Vl = null, Af = !1, pf = 0, hn = 1 / 0, yn = null, eu = null, Ul = 0, nu = null, da = null, ra = 0, Of = 0, zf = null, nd = null, ne = 0, Mf = null;
  function tt() {
    if ((ul & 2) !== 0 && W !== 0)
      return W & -W;
    if (E.T !== null) {
      var l = Pu;
      return l !== 0 ? l : Hf();
    }
    return Ti();
  }
  function cd() {
    dt === 0 && (dt = (W & 536870912) === 0 || ll ? mi() : 536870912);
    var l = ot.current;
    return l !== null && (l.flags |= 32), dt;
  }
  function ut(l, t, u) {
    (l === sl && (al === 2 || al === 9) || l.cancelPendingCommit !== null) && (va(l, 0), cu(
      l,
      W,
      dt,
      !1
    )), pa(l, u), ((ul & 2) === 0 || l !== sl) && (l === sl && ((ul & 2) === 0 && (xu |= u), hl === 4 && cu(
      l,
      W,
      dt,
      !1
    )), Ot(l));
  }
  function fd(l, t, u) {
    if ((ul & 6) !== 0) throw Error(r(327));
    var a = !u && (t & 124) === 0 && (t & l.expiredLanes) === 0 || Aa(l, t), e = a ? uv(l, t) : Rf(l, t, !0), n = a;
    do {
      if (e === 0) {
        sa && !a && cu(l, t, 0, !1);
        break;
      } else {
        if (u = l.current.alternate, n && !lv(u)) {
          e = Rf(l, t, !1), n = !1;
          continue;
        }
        if (e === 2) {
          if (n = t, l.errorRecoveryDisabledLanes & n)
            var c = 0;
          else
            c = l.pendingLanes & -536870913, c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
          if (c !== 0) {
            t = c;
            l: {
              var f = l;
              e = ee;
              var i = f.current.memoizedState.isDehydrated;
              if (i && (va(f, c).flags |= 256), c = Rf(
                f,
                c,
                !1
              ), c !== 2) {
                if (Tf && !i) {
                  f.errorRecoveryDisabledLanes |= n, xu |= n, e = 4;
                  break l;
                }
                n = Vl, Vl = e, n !== null && (Vl === null ? Vl = n : Vl.push.apply(
                  Vl,
                  n
                ));
              }
              e = c;
            }
            if (n = !1, e !== 2) continue;
          }
        }
        if (e === 1) {
          va(l, 0), cu(l, t, 0, !0);
          break;
        }
        l: {
          switch (a = l, n = e, n) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              cu(
                a,
                t,
                dt,
                !uu
              );
              break l;
            case 2:
              Vl = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((t & 62914560) === t && (e = pf + 300 - bt(), 10 < e)) {
            if (cu(
              a,
              t,
              dt,
              !uu
            ), ze(a, 0, !0) !== 0) break l;
            a.timeoutHandle = qd(
              id.bind(
                null,
                a,
                u,
                Vl,
                yn,
                Af,
                t,
                dt,
                xu,
                oa,
                uu,
                n,
                2,
                -0,
                0
              ),
              e
            );
            break l;
          }
          id(
            a,
            u,
            Vl,
            yn,
            Af,
            t,
            dt,
            xu,
            oa,
            uu,
            n,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Ot(l);
  }
  function id(l, t, u, a, e, n, c, f, i, y, T, p, m, S) {
    if (l.timeoutHandle = -1, p = t.subtreeFlags, (p & 8192 || (p & 16785408) === 16785408) && (re = { stylesheets: null, count: 0, unsuspend: Bv }, td(t), p = jv(), p !== null)) {
      l.cancelPendingCommit = p(
        yd.bind(
          null,
          l,
          t,
          n,
          u,
          a,
          e,
          c,
          f,
          i,
          T,
          1,
          m,
          S
        )
      ), cu(l, n, c, !y);
      return;
    }
    yd(
      l,
      t,
      n,
      u,
      a,
      e,
      c,
      f,
      i
    );
  }
  function lv(l) {
    for (var t = l; ; ) {
      var u = t.tag;
      if ((u === 0 || u === 11 || u === 15) && t.flags & 16384 && (u = t.updateQueue, u !== null && (u = u.stores, u !== null)))
        for (var a = 0; a < u.length; a++) {
          var e = u[a], n = e.getSnapshot;
          e = e.value;
          try {
            if (!kl(n(), e)) return !1;
          } catch {
            return !1;
          }
        }
      if (u = t.child, t.subtreeFlags & 16384 && u !== null)
        u.return = t, t = u;
      else {
        if (t === l) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === l) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function cu(l, t, u, a) {
    t &= ~Ef, t &= ~xu, l.suspendedLanes |= t, l.pingedLanes &= ~t, a && (l.warmLanes |= t), a = l.expirationTimes;
    for (var e = t; 0 < e; ) {
      var n = 31 - Wl(e), c = 1 << n;
      a[n] = -1, e &= ~c;
    }
    u !== 0 && Si(l, u, t);
  }
  function mn() {
    return (ul & 6) === 0 ? (ce(0), !1) : !0;
  }
  function Df() {
    if (J !== null) {
      if (al === 0)
        var l = J.return;
      else
        l = J, xt = Mu = null, Vc(l), na = null, ka = 0, l = J;
      for (; l !== null; )
        Qo(l.alternate, l), l = l.return;
      J = null;
    }
  }
  function va(l, t) {
    var u = l.timeoutHandle;
    u !== -1 && (l.timeoutHandle = -1, Sv(u)), u = l.cancelPendingCommit, u !== null && (l.cancelPendingCommit = null, u()), Df(), sl = l, J = u = Rt(l.current, null), W = t, al = 0, lt = null, uu = !1, sa = Aa(l, t), Tf = !1, oa = dt = Ef = xu = au = hl = 0, Vl = ee = null, Af = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = l.entangledLanes;
    if (a !== 0)
      for (l = l.entanglements, a &= t; 0 < a; ) {
        var e = 31 - Wl(a), n = 1 << e;
        t |= l[e], a &= ~n;
      }
    return Xt = t, je(), u;
  }
  function sd(l, t) {
    V = null, E.H = un, t === Qa || t === Je ? (t = zs(), al = 3) : t === As ? (t = zs(), al = 4) : al = t === Do ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, lt = t, J === null && (hl = 1, fn(
      l,
      ct(t, l.current)
    ));
  }
  function od() {
    var l = E.H;
    return E.H = un, l === null ? un : l;
  }
  function dd() {
    var l = E.A;
    return E.A = I0, l;
  }
  function _f() {
    hl = 4, uu || (W & 4194048) !== W && ot.current !== null || (sa = !0), (au & 134217727) === 0 && (xu & 134217727) === 0 || sl === null || cu(
      sl,
      W,
      dt,
      !1
    );
  }
  function Rf(l, t, u) {
    var a = ul;
    ul |= 2;
    var e = od(), n = dd();
    (sl !== l || W !== t) && (yn = null, va(l, t)), t = !1;
    var c = hl;
    l: do
      try {
        if (al !== 0 && J !== null) {
          var f = J, i = lt;
          switch (al) {
            case 8:
              Df(), c = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              ot.current === null && (t = !0);
              var y = al;
              if (al = 0, lt = null, ha(l, f, i, y), u && sa) {
                c = 0;
                break l;
              }
              break;
            default:
              y = al, al = 0, lt = null, ha(l, f, i, y);
          }
        }
        tv(), c = hl;
        break;
      } catch (T) {
        sd(l, T);
      }
    while (!0);
    return t && l.shellSuspendCounter++, xt = Mu = null, ul = a, E.H = e, E.A = n, J === null && (sl = null, W = 0, je()), c;
  }
  function tv() {
    for (; J !== null; ) rd(J);
  }
  function uv(l, t) {
    var u = ul;
    ul |= 2;
    var a = od(), e = dd();
    sl !== l || W !== t ? (yn = null, hn = bt() + 500, va(l, t)) : sa = Aa(
      l,
      t
    );
    l: do
      try {
        if (al !== 0 && J !== null) {
          t = J;
          var n = lt;
          t: switch (al) {
            case 1:
              al = 0, lt = null, ha(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (ps(n)) {
                al = 0, lt = null, vd(t);
                break;
              }
              t = function() {
                al !== 2 && al !== 9 || sl !== l || (al = 7), Ot(l);
              }, n.then(t, t);
              break l;
            case 3:
              al = 7;
              break l;
            case 4:
              al = 5;
              break l;
            case 7:
              ps(n) ? (al = 0, lt = null, vd(t)) : (al = 0, lt = null, ha(l, t, n, 7));
              break;
            case 5:
              var c = null;
              switch (J.tag) {
                case 26:
                  c = J.memoizedState;
                case 5:
                case 27:
                  var f = J;
                  if (!c || $d(c)) {
                    al = 0, lt = null;
                    var i = f.sibling;
                    if (i !== null) J = i;
                    else {
                      var y = f.return;
                      y !== null ? (J = y, gn(y)) : J = null;
                    }
                    break t;
                  }
              }
              al = 0, lt = null, ha(l, t, n, 5);
              break;
            case 6:
              al = 0, lt = null, ha(l, t, n, 6);
              break;
            case 8:
              Df(), hl = 6;
              break l;
            default:
              throw Error(r(462));
          }
        }
        av();
        break;
      } catch (T) {
        sd(l, T);
      }
    while (!0);
    return xt = Mu = null, E.H = a, E.A = e, ul = u, J !== null ? 0 : (sl = null, W = 0, je(), hl);
  }
  function av() {
    for (; J !== null && !zr(); )
      rd(J);
  }
  function rd(l) {
    var t = Go(l.alternate, l, Xt);
    l.memoizedProps = l.pendingProps, t === null ? gn(l) : J = t;
  }
  function vd(l) {
    var t = l, u = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Ho(
          u,
          t,
          t.pendingProps,
          t.type,
          void 0,
          W
        );
        break;
      case 11:
        t = Ho(
          u,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          W
        );
        break;
      case 5:
        Vc(t);
      default:
        Qo(u, t), t = J = vs(t, Xt), t = Go(u, t, Xt);
    }
    l.memoizedProps = l.pendingProps, t === null ? gn(l) : J = t;
  }
  function ha(l, t, u, a) {
    xt = Mu = null, Vc(t), na = null, ka = 0;
    var e = t.return;
    try {
      if (J0(
        l,
        e,
        t,
        u,
        W
      )) {
        hl = 1, fn(
          l,
          ct(u, l.current)
        ), J = null;
        return;
      }
    } catch (n) {
      if (e !== null) throw J = e, n;
      hl = 1, fn(
        l,
        ct(u, l.current)
      ), J = null;
      return;
    }
    t.flags & 32768 ? (ll || a === 1 ? l = !0 : sa || (W & 536870912) !== 0 ? l = !1 : (uu = l = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = ot.current, a !== null && a.tag === 13 && (a.flags |= 16384))), hd(t, l)) : gn(t);
  }
  function gn(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        hd(
          t,
          uu
        );
        return;
      }
      l = t.return;
      var u = $0(
        t.alternate,
        t,
        Xt
      );
      if (u !== null) {
        J = u;
        return;
      }
      if (t = t.sibling, t !== null) {
        J = t;
        return;
      }
      J = t = l;
    } while (t !== null);
    hl === 0 && (hl = 5);
  }
  function hd(l, t) {
    do {
      var u = W0(l.alternate, l);
      if (u !== null) {
        u.flags &= 32767, J = u;
        return;
      }
      if (u = l.return, u !== null && (u.flags |= 32768, u.subtreeFlags = 0, u.deletions = null), !t && (l = l.sibling, l !== null)) {
        J = l;
        return;
      }
      J = l = u;
    } while (l !== null);
    hl = 6, J = null;
  }
  function yd(l, t, u, a, e, n, c, f, i) {
    l.cancelPendingCommit = null;
    do
      Sn();
    while (Ul !== 0);
    if ((ul & 6) !== 0) throw Error(r(327));
    if (t !== null) {
      if (t === l.current) throw Error(r(177));
      if (n = t.lanes | t.childLanes, n |= Sc, Br(
        l,
        u,
        n,
        c,
        f,
        i
      ), l === sl && (J = sl = null, W = 0), da = t, nu = l, ra = u, Of = n, zf = e, nd = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, fv(Ae, function() {
        return Td(), null;
      })) : (l.callbackNode = null, l.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = E.T, E.T = null, e = R.p, R.p = 2, c = ul, ul |= 4;
        try {
          k0(l, t, u);
        } finally {
          ul = c, R.p = e, E.T = a;
        }
      }
      Ul = 1, md(), gd(), Sd();
    }
  }
  function md() {
    if (Ul === 1) {
      Ul = 0;
      var l = nu, t = da, u = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || u) {
        u = E.T, E.T = null;
        var a = R.p;
        R.p = 2;
        var e = ul;
        ul |= 4;
        try {
          Io(t, l);
          var n = Qf, c = as(l.containerInfo), f = n.focusedElem, i = n.selectionRange;
          if (c !== f && f && f.ownerDocument && us(
            f.ownerDocument.documentElement,
            f
          )) {
            if (i !== null && vc(f)) {
              var y = i.start, T = i.end;
              if (T === void 0 && (T = y), "selectionStart" in f)
                f.selectionStart = y, f.selectionEnd = Math.min(
                  T,
                  f.value.length
                );
              else {
                var p = f.ownerDocument || document, m = p && p.defaultView || window;
                if (m.getSelection) {
                  var S = m.getSelection(), X = f.textContent.length, q = Math.min(i.start, X), cl = i.end === void 0 ? q : Math.min(i.end, X);
                  !S.extend && q > cl && (c = cl, cl = q, q = c);
                  var d = ts(
                    f,
                    q
                  ), o = ts(
                    f,
                    cl
                  );
                  if (d && o && (S.rangeCount !== 1 || S.anchorNode !== d.node || S.anchorOffset !== d.offset || S.focusNode !== o.node || S.focusOffset !== o.offset)) {
                    var h = p.createRange();
                    h.setStart(d.node, d.offset), S.removeAllRanges(), q > cl ? (S.addRange(h), S.extend(o.node, o.offset)) : (h.setEnd(o.node, o.offset), S.addRange(h));
                  }
                }
              }
            }
            for (p = [], S = f; S = S.parentNode; )
              S.nodeType === 1 && p.push({
                element: S,
                left: S.scrollLeft,
                top: S.scrollTop
              });
            for (typeof f.focus == "function" && f.focus(), f = 0; f < p.length; f++) {
              var A = p[f];
              A.element.scrollLeft = A.left, A.element.scrollTop = A.top;
            }
          }
          Un = !!Xf, Qf = Xf = null;
        } finally {
          ul = e, R.p = a, E.T = u;
        }
      }
      l.current = t, Ul = 2;
    }
  }
  function gd() {
    if (Ul === 2) {
      Ul = 0;
      var l = nu, t = da, u = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || u) {
        u = E.T, E.T = null;
        var a = R.p;
        R.p = 2;
        var e = ul;
        ul |= 4;
        try {
          $o(l, t.alternate, t);
        } finally {
          ul = e, R.p = a, E.T = u;
        }
      }
      Ul = 3;
    }
  }
  function Sd() {
    if (Ul === 4 || Ul === 3) {
      Ul = 0, Mr();
      var l = nu, t = da, u = ra, a = nd;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Ul = 5 : (Ul = 0, da = nu = null, bd(l, l.pendingLanes));
      var e = l.pendingLanes;
      if (e === 0 && (eu = null), Jn(u), t = t.stateNode, $l && typeof $l.onCommitFiberRoot == "function")
        try {
          $l.onCommitFiberRoot(
            Ea,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = E.T, e = R.p, R.p = 2, E.T = null;
        try {
          for (var n = l.onRecoverableError, c = 0; c < a.length; c++) {
            var f = a[c];
            n(f.value, {
              componentStack: f.stack
            });
          }
        } finally {
          E.T = t, R.p = e;
        }
      }
      (ra & 3) !== 0 && Sn(), Ot(l), e = l.pendingLanes, (u & 4194090) !== 0 && (e & 42) !== 0 ? l === Mf ? ne++ : (ne = 0, Mf = l) : ne = 0, ce(0);
    }
  }
  function bd(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, Ga(t)));
  }
  function Sn(l) {
    return md(), gd(), Sd(), Td();
  }
  function Td() {
    if (Ul !== 5) return !1;
    var l = nu, t = Of;
    Of = 0;
    var u = Jn(ra), a = E.T, e = R.p;
    try {
      R.p = 32 > u ? 32 : u, E.T = null, u = zf, zf = null;
      var n = nu, c = ra;
      if (Ul = 0, da = nu = null, ra = 0, (ul & 6) !== 0) throw Error(r(331));
      var f = ul;
      if (ul |= 4, ad(n.current), ld(
        n,
        n.current,
        c,
        u
      ), ul = f, ce(0, !1), $l && typeof $l.onPostCommitFiberRoot == "function")
        try {
          $l.onPostCommitFiberRoot(Ea, n);
        } catch {
        }
      return !0;
    } finally {
      R.p = e, E.T = a, bd(l, t);
    }
  }
  function Ed(l, t, u) {
    t = ct(u, t), t = af(l.stateNode, t, 2), l = Wt(l, t, 2), l !== null && (pa(l, 2), Ot(l));
  }
  function il(l, t, u) {
    if (l.tag === 3)
      Ed(l, l, u);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Ed(
            t,
            l,
            u
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (eu === null || !eu.has(a))) {
            l = ct(u, l), u = zo(2), a = Wt(t, u, 2), a !== null && (Mo(
              u,
              a,
              t,
              l
            ), pa(a, 2), Ot(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Uf(l, t, u) {
    var a = l.pingCache;
    if (a === null) {
      a = l.pingCache = new P0();
      var e = /* @__PURE__ */ new Set();
      a.set(t, e);
    } else
      e = a.get(t), e === void 0 && (e = /* @__PURE__ */ new Set(), a.set(t, e));
    e.has(u) || (Tf = !0, e.add(u), l = ev.bind(null, l, t, u), t.then(l, l));
  }
  function ev(l, t, u) {
    var a = l.pingCache;
    a !== null && a.delete(t), l.pingedLanes |= l.suspendedLanes & u, l.warmLanes &= ~u, sl === l && (W & u) === u && (hl === 4 || hl === 3 && (W & 62914560) === W && 300 > bt() - pf ? (ul & 2) === 0 && va(l, 0) : Ef |= u, oa === W && (oa = 0)), Ot(l);
  }
  function Ad(l, t) {
    t === 0 && (t = gi()), l = Wu(l, t), l !== null && (pa(l, t), Ot(l));
  }
  function nv(l) {
    var t = l.memoizedState, u = 0;
    t !== null && (u = t.retryLane), Ad(l, u);
  }
  function cv(l, t) {
    var u = 0;
    switch (l.tag) {
      case 13:
        var a = l.stateNode, e = l.memoizedState;
        e !== null && (u = e.retryLane);
        break;
      case 19:
        a = l.stateNode;
        break;
      case 22:
        a = l.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    a !== null && a.delete(t), Ad(l, u);
  }
  function fv(l, t) {
    return Zn(l, t);
  }
  var bn = null, ya = null, Nf = !1, Tn = !1, xf = !1, Hu = 0;
  function Ot(l) {
    l !== ya && l.next === null && (ya === null ? bn = ya = l : ya = ya.next = l), Tn = !0, Nf || (Nf = !0, sv());
  }
  function ce(l, t) {
    if (!xf && Tn) {
      xf = !0;
      do
        for (var u = !1, a = bn; a !== null; ) {
          if (l !== 0) {
            var e = a.pendingLanes;
            if (e === 0) var n = 0;
            else {
              var c = a.suspendedLanes, f = a.pingedLanes;
              n = (1 << 31 - Wl(42 | l) + 1) - 1, n &= e & ~(c & ~f), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (u = !0, Md(a, n));
          } else
            n = W, n = ze(
              a,
              a === sl ? n : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (n & 3) === 0 || Aa(a, n) || (u = !0, Md(a, n));
          a = a.next;
        }
      while (u);
      xf = !1;
    }
  }
  function iv() {
    pd();
  }
  function pd() {
    Tn = Nf = !1;
    var l = 0;
    Hu !== 0 && (gv() && (l = Hu), Hu = 0);
    for (var t = bt(), u = null, a = bn; a !== null; ) {
      var e = a.next, n = Od(a, t);
      n === 0 ? (a.next = null, u === null ? bn = e : u.next = e, e === null && (ya = u)) : (u = a, (l !== 0 || (n & 3) !== 0) && (Tn = !0)), a = e;
    }
    ce(l);
  }
  function Od(l, t) {
    for (var u = l.suspendedLanes, a = l.pingedLanes, e = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var c = 31 - Wl(n), f = 1 << c, i = e[c];
      i === -1 ? ((f & u) === 0 || (f & a) !== 0) && (e[c] = Cr(f, t)) : i <= t && (l.expiredLanes |= f), n &= ~f;
    }
    if (t = sl, u = W, u = ze(
      l,
      l === t ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a = l.callbackNode, u === 0 || l === t && (al === 2 || al === 9) || l.cancelPendingCommit !== null)
      return a !== null && a !== null && Vn(a), l.callbackNode = null, l.callbackPriority = 0;
    if ((u & 3) === 0 || Aa(l, u)) {
      if (t = u & -u, t === l.callbackPriority) return t;
      switch (a !== null && Vn(a), Jn(u)) {
        case 2:
        case 8:
          u = hi;
          break;
        case 32:
          u = Ae;
          break;
        case 268435456:
          u = yi;
          break;
        default:
          u = Ae;
      }
      return a = zd.bind(null, l), u = Zn(u, a), l.callbackPriority = t, l.callbackNode = u, t;
    }
    return a !== null && a !== null && Vn(a), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function zd(l, t) {
    if (Ul !== 0 && Ul !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var u = l.callbackNode;
    if (Sn() && l.callbackNode !== u)
      return null;
    var a = W;
    return a = ze(
      l,
      l === sl ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a === 0 ? null : (fd(l, a, t), Od(l, bt()), l.callbackNode != null && l.callbackNode === u ? zd.bind(null, l) : null);
  }
  function Md(l, t) {
    if (Sn()) return null;
    fd(l, t, !0);
  }
  function sv() {
    bv(function() {
      (ul & 6) !== 0 ? Zn(
        vi,
        iv
      ) : pd();
    });
  }
  function Hf() {
    return Hu === 0 && (Hu = mi()), Hu;
  }
  function Dd(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : Ue("" + l);
  }
  function _d(l, t) {
    var u = t.ownerDocument.createElement("input");
    return u.name = t.name, u.value = t.value, l.id && u.setAttribute("form", l.id), t.parentNode.insertBefore(u, t), l = new FormData(l), u.parentNode.removeChild(u), l;
  }
  function ov(l, t, u, a, e) {
    if (t === "submit" && u && u.stateNode === e) {
      var n = Dd(
        (e[Gl] || null).action
      ), c = a.submitter;
      c && (t = (t = c[Gl] || null) ? Dd(t.formAction) : c.getAttribute("formAction"), t !== null && (n = t, c = null));
      var f = new Ce(
        "action",
        "action",
        null,
        a,
        e
      );
      l.push({
        event: f,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Hu !== 0) {
                  var i = c ? _d(e, c) : new FormData(e);
                  Ic(
                    u,
                    {
                      pending: !0,
                      data: i,
                      method: e.method,
                      action: n
                    },
                    null,
                    i
                  );
                }
              } else
                typeof n == "function" && (f.preventDefault(), i = c ? _d(e, c) : new FormData(e), Ic(
                  u,
                  {
                    pending: !0,
                    data: i,
                    method: e.method,
                    action: n
                  },
                  n,
                  i
                ));
            },
            currentTarget: e
          }
        ]
      });
    }
  }
  for (var Cf = 0; Cf < gc.length; Cf++) {
    var Bf = gc[Cf], dv = Bf.toLowerCase(), rv = Bf[0].toUpperCase() + Bf.slice(1);
    yt(
      dv,
      "on" + rv
    );
  }
  yt(cs, "onAnimationEnd"), yt(fs, "onAnimationIteration"), yt(is, "onAnimationStart"), yt("dblclick", "onDoubleClick"), yt("focusin", "onFocus"), yt("focusout", "onBlur"), yt(R0, "onTransitionRun"), yt(U0, "onTransitionStart"), yt(N0, "onTransitionCancel"), yt(ss, "onTransitionEnd"), Gu("onMouseEnter", ["mouseout", "mouseover"]), Gu("onMouseLeave", ["mouseout", "mouseover"]), Gu("onPointerEnter", ["pointerout", "pointerover"]), Gu("onPointerLeave", ["pointerout", "pointerover"]), gu(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), gu(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), gu("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), gu(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), gu(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), gu(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var fe = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), vv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(fe)
  );
  function Rd(l, t) {
    t = (t & 4) !== 0;
    for (var u = 0; u < l.length; u++) {
      var a = l[u], e = a.event;
      a = a.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var c = a.length - 1; 0 <= c; c--) {
            var f = a[c], i = f.instance, y = f.currentTarget;
            if (f = f.listener, i !== n && e.isPropagationStopped())
              break l;
            n = f, e.currentTarget = y;
            try {
              n(e);
            } catch (T) {
              cn(T);
            }
            e.currentTarget = null, n = i;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (f = a[c], i = f.instance, y = f.currentTarget, f = f.listener, i !== n && e.isPropagationStopped())
              break l;
            n = f, e.currentTarget = y;
            try {
              n(e);
            } catch (T) {
              cn(T);
            }
            e.currentTarget = null, n = i;
          }
      }
    }
  }
  function w(l, t) {
    var u = t[wn];
    u === void 0 && (u = t[wn] = /* @__PURE__ */ new Set());
    var a = l + "__bubble";
    u.has(a) || (Ud(t, l, 2, !1), u.add(a));
  }
  function qf(l, t, u) {
    var a = 0;
    t && (a |= 4), Ud(
      u,
      l,
      a,
      t
    );
  }
  var En = "_reactListening" + Math.random().toString(36).slice(2);
  function jf(l) {
    if (!l[En]) {
      l[En] = !0, Ai.forEach(function(u) {
        u !== "selectionchange" && (vv.has(u) || qf(u, !1, l), qf(u, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[En] || (t[En] = !0, qf("selectionchange", !1, t));
    }
  }
  function Ud(l, t, u, a) {
    switch (lr(t)) {
      case 2:
        var e = Xv;
        break;
      case 8:
        e = Qv;
        break;
      default:
        e = Ff;
    }
    u = e.bind(
      null,
      t,
      u,
      l
    ), e = void 0, !ec || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (e = !0), a ? e !== void 0 ? l.addEventListener(t, u, {
      capture: !0,
      passive: e
    }) : l.addEventListener(t, u, !0) : e !== void 0 ? l.addEventListener(t, u, {
      passive: e
    }) : l.addEventListener(t, u, !1);
  }
  function Yf(l, t, u, a, e) {
    var n = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      l: for (; ; ) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var f = a.stateNode.containerInfo;
          if (f === e) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var i = c.tag;
              if ((i === 3 || i === 4) && c.stateNode.containerInfo === e)
                return;
              c = c.return;
            }
          for (; f !== null; ) {
            if (c = qu(f), c === null) return;
            if (i = c.tag, i === 5 || i === 6 || i === 26 || i === 27) {
              a = n = c;
              continue l;
            }
            f = f.parentNode;
          }
        }
        a = a.return;
      }
    qi(function() {
      var y = n, T = uc(u), p = [];
      l: {
        var m = os.get(l);
        if (m !== void 0) {
          var S = Ce, X = l;
          switch (l) {
            case "keypress":
              if (xe(u) === 0) break l;
            case "keydown":
            case "keyup":
              S = f0;
              break;
            case "focusin":
              X = "focus", S = ic;
              break;
            case "focusout":
              X = "blur", S = ic;
              break;
            case "beforeblur":
            case "afterblur":
              S = ic;
              break;
            case "click":
              if (u.button === 2) break l;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              S = Gi;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              S = Wr;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              S = o0;
              break;
            case cs:
            case fs:
            case is:
              S = Ir;
              break;
            case ss:
              S = r0;
              break;
            case "scroll":
            case "scrollend":
              S = wr;
              break;
            case "wheel":
              S = h0;
              break;
            case "copy":
            case "cut":
            case "paste":
              S = l0;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              S = Qi;
              break;
            case "toggle":
            case "beforetoggle":
              S = m0;
          }
          var q = (t & 4) !== 0, cl = !q && (l === "scroll" || l === "scrollend"), d = q ? m !== null ? m + "Capture" : null : m;
          q = [];
          for (var o = y, h; o !== null; ) {
            var A = o;
            if (h = A.stateNode, A = A.tag, A !== 5 && A !== 26 && A !== 27 || h === null || d === null || (A = Ma(o, d), A != null && q.push(
              ie(o, A, h)
            )), cl) break;
            o = o.return;
          }
          0 < q.length && (m = new S(
            m,
            X,
            null,
            u,
            T
          ), p.push({ event: m, listeners: q }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (m = l === "mouseover" || l === "pointerover", S = l === "mouseout" || l === "pointerout", m && u !== tc && (X = u.relatedTarget || u.fromElement) && (qu(X) || X[Bu]))
            break l;
          if ((S || m) && (m = T.window === T ? T : (m = T.ownerDocument) ? m.defaultView || m.parentWindow : window, S ? (X = u.relatedTarget || u.toElement, S = y, X = X ? qu(X) : null, X !== null && (cl = Y(X), q = X.tag, X !== cl || q !== 5 && q !== 27 && q !== 6) && (X = null)) : (S = null, X = y), S !== X)) {
            if (q = Gi, A = "onMouseLeave", d = "onMouseEnter", o = "mouse", (l === "pointerout" || l === "pointerover") && (q = Qi, A = "onPointerLeave", d = "onPointerEnter", o = "pointer"), cl = S == null ? m : za(S), h = X == null ? m : za(X), m = new q(
              A,
              o + "leave",
              S,
              u,
              T
            ), m.target = cl, m.relatedTarget = h, A = null, qu(T) === y && (q = new q(
              d,
              o + "enter",
              X,
              u,
              T
            ), q.target = h, q.relatedTarget = cl, A = q), cl = A, S && X)
              t: {
                for (q = S, d = X, o = 0, h = q; h; h = ma(h))
                  o++;
                for (h = 0, A = d; A; A = ma(A))
                  h++;
                for (; 0 < o - h; )
                  q = ma(q), o--;
                for (; 0 < h - o; )
                  d = ma(d), h--;
                for (; o--; ) {
                  if (q === d || d !== null && q === d.alternate)
                    break t;
                  q = ma(q), d = ma(d);
                }
                q = null;
              }
            else q = null;
            S !== null && Nd(
              p,
              m,
              S,
              q,
              !1
            ), X !== null && cl !== null && Nd(
              p,
              cl,
              X,
              q,
              !0
            );
          }
        }
        l: {
          if (m = y ? za(y) : window, S = m.nodeName && m.nodeName.toLowerCase(), S === "select" || S === "input" && m.type === "file")
            var N = Wi;
          else if (wi(m))
            if (ki)
              N = M0;
            else {
              N = O0;
              var K = p0;
            }
          else
            S = m.nodeName, !S || S.toLowerCase() !== "input" || m.type !== "checkbox" && m.type !== "radio" ? y && lc(y.elementType) && (N = Wi) : N = z0;
          if (N && (N = N(l, y))) {
            $i(
              p,
              N,
              u,
              T
            );
            break l;
          }
          K && K(l, m, y), l === "focusout" && y && m.type === "number" && y.memoizedProps.value != null && Pn(m, "number", m.value);
        }
        switch (K = y ? za(y) : window, l) {
          case "focusin":
            (wi(K) || K.contentEditable === "true") && (Ju = K, hc = y, Ca = null);
            break;
          case "focusout":
            Ca = hc = Ju = null;
            break;
          case "mousedown":
            yc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            yc = !1, es(p, u, T);
            break;
          case "selectionchange":
            if (_0) break;
          case "keydown":
          case "keyup":
            es(p, u, T);
        }
        var H;
        if (oc)
          l: {
            switch (l) {
              case "compositionstart":
                var j = "onCompositionStart";
                break l;
              case "compositionend":
                j = "onCompositionEnd";
                break l;
              case "compositionupdate":
                j = "onCompositionUpdate";
                break l;
            }
            j = void 0;
          }
        else
          Ku ? Ki(l, u) && (j = "onCompositionEnd") : l === "keydown" && u.keyCode === 229 && (j = "onCompositionStart");
        j && (Zi && u.locale !== "ko" && (Ku || j !== "onCompositionStart" ? j === "onCompositionEnd" && Ku && (H = ji()) : (Kt = T, nc = "value" in Kt ? Kt.value : Kt.textContent, Ku = !0)), K = An(y, j), 0 < K.length && (j = new Xi(
          j,
          l,
          null,
          u,
          T
        ), p.push({ event: j, listeners: K }), H ? j.data = H : (H = Ji(u), H !== null && (j.data = H)))), (H = S0 ? b0(l, u) : T0(l, u)) && (j = An(y, "onBeforeInput"), 0 < j.length && (K = new Xi(
          "onBeforeInput",
          "beforeinput",
          null,
          u,
          T
        ), p.push({
          event: K,
          listeners: j
        }), K.data = H)), ov(
          p,
          l,
          y,
          u,
          T
        );
      }
      Rd(p, t);
    });
  }
  function ie(l, t, u) {
    return {
      instance: l,
      listener: t,
      currentTarget: u
    };
  }
  function An(l, t) {
    for (var u = t + "Capture", a = []; l !== null; ) {
      var e = l, n = e.stateNode;
      if (e = e.tag, e !== 5 && e !== 26 && e !== 27 || n === null || (e = Ma(l, u), e != null && a.unshift(
        ie(l, e, n)
      ), e = Ma(l, t), e != null && a.push(
        ie(l, e, n)
      )), l.tag === 3) return a;
      l = l.return;
    }
    return [];
  }
  function ma(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function Nd(l, t, u, a, e) {
    for (var n = t._reactName, c = []; u !== null && u !== a; ) {
      var f = u, i = f.alternate, y = f.stateNode;
      if (f = f.tag, i !== null && i === a) break;
      f !== 5 && f !== 26 && f !== 27 || y === null || (i = y, e ? (y = Ma(u, n), y != null && c.unshift(
        ie(u, y, i)
      )) : e || (y = Ma(u, n), y != null && c.push(
        ie(u, y, i)
      ))), u = u.return;
    }
    c.length !== 0 && l.push({ event: t, listeners: c });
  }
  var hv = /\r\n?/g, yv = /\u0000|\uFFFD/g;
  function xd(l) {
    return (typeof l == "string" ? l : "" + l).replace(hv, `
`).replace(yv, "");
  }
  function Hd(l, t) {
    return t = xd(t), xd(l) === t;
  }
  function pn() {
  }
  function nl(l, t, u, a, e, n) {
    switch (u) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || Zu(l, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Zu(l, "" + a);
        break;
      case "className":
        De(l, "class", a);
        break;
      case "tabIndex":
        De(l, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        De(l, u, a);
        break;
      case "style":
        Ci(l, a, n);
        break;
      case "data":
        if (t !== "object") {
          De(l, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || u !== "href")) {
          l.removeAttribute(u);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(u);
          break;
        }
        a = Ue("" + a), l.setAttribute(u, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          l.setAttribute(
            u,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == "function" && (u === "formAction" ? (t !== "input" && nl(l, t, "name", e.name, e, null), nl(
            l,
            t,
            "formEncType",
            e.formEncType,
            e,
            null
          ), nl(
            l,
            t,
            "formMethod",
            e.formMethod,
            e,
            null
          ), nl(
            l,
            t,
            "formTarget",
            e.formTarget,
            e,
            null
          )) : (nl(l, t, "encType", e.encType, e, null), nl(l, t, "method", e.method, e, null), nl(l, t, "target", e.target, e, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(u);
          break;
        }
        a = Ue("" + a), l.setAttribute(u, a);
        break;
      case "onClick":
        a != null && (l.onclick = pn);
        break;
      case "onScroll":
        a != null && w("scroll", l);
        break;
      case "onScrollEnd":
        a != null && w("scrollend", l);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (u = a.__html, u != null) {
            if (e.children != null) throw Error(r(60));
            l.innerHTML = u;
          }
        }
        break;
      case "multiple":
        l.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        l.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          l.removeAttribute("xlink:href");
          break;
        }
        u = Ue("" + a), l.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          u
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(u, "" + a) : l.removeAttribute(u);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(u, "") : l.removeAttribute(u);
        break;
      case "capture":
      case "download":
        a === !0 ? l.setAttribute(u, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(u, a) : l.removeAttribute(u);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? l.setAttribute(u, a) : l.removeAttribute(u);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? l.removeAttribute(u) : l.setAttribute(u, a);
        break;
      case "popover":
        w("beforetoggle", l), w("toggle", l), Me(l, "popover", a);
        break;
      case "xlinkActuate":
        Dt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        Dt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        Dt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        Dt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        Dt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        Dt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        Dt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        Dt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        Dt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Me(l, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < u.length) || u[0] !== "o" && u[0] !== "O" || u[1] !== "n" && u[1] !== "N") && (u = Kr.get(u) || u, Me(l, u, a));
    }
  }
  function Gf(l, t, u, a, e, n) {
    switch (u) {
      case "style":
        Ci(l, a, n);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (u = a.__html, u != null) {
            if (e.children != null) throw Error(r(60));
            l.innerHTML = u;
          }
        }
        break;
      case "children":
        typeof a == "string" ? Zu(l, a) : (typeof a == "number" || typeof a == "bigint") && Zu(l, "" + a);
        break;
      case "onScroll":
        a != null && w("scroll", l);
        break;
      case "onScrollEnd":
        a != null && w("scrollend", l);
        break;
      case "onClick":
        a != null && (l.onclick = pn);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!pi.hasOwnProperty(u))
          l: {
            if (u[0] === "o" && u[1] === "n" && (e = u.endsWith("Capture"), t = u.slice(2, e ? u.length - 7 : void 0), n = l[Gl] || null, n = n != null ? n[u] : null, typeof n == "function" && l.removeEventListener(t, n, e), typeof a == "function")) {
              typeof n != "function" && n !== null && (u in l ? l[u] = null : l.hasAttribute(u) && l.removeAttribute(u)), l.addEventListener(t, a, e);
              break l;
            }
            u in l ? l[u] = a : a === !0 ? l.setAttribute(u, "") : Me(l, u, a);
          }
    }
  }
  function Nl(l, t, u) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        w("error", l), w("load", l);
        var a = !1, e = !1, n;
        for (n in u)
          if (u.hasOwnProperty(n)) {
            var c = u[n];
            if (c != null)
              switch (n) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  e = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, t));
                default:
                  nl(l, t, n, c, u, null);
              }
          }
        e && nl(l, t, "srcSet", u.srcSet, u, null), a && nl(l, t, "src", u.src, u, null);
        return;
      case "input":
        w("invalid", l);
        var f = n = c = e = null, i = null, y = null;
        for (a in u)
          if (u.hasOwnProperty(a)) {
            var T = u[a];
            if (T != null)
              switch (a) {
                case "name":
                  e = T;
                  break;
                case "type":
                  c = T;
                  break;
                case "checked":
                  i = T;
                  break;
                case "defaultChecked":
                  y = T;
                  break;
                case "value":
                  n = T;
                  break;
                case "defaultValue":
                  f = T;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (T != null)
                    throw Error(r(137, t));
                  break;
                default:
                  nl(l, t, a, T, u, null);
              }
          }
        Ui(
          l,
          n,
          f,
          i,
          y,
          c,
          e,
          !1
        ), _e(l);
        return;
      case "select":
        w("invalid", l), a = c = n = null;
        for (e in u)
          if (u.hasOwnProperty(e) && (f = u[e], f != null))
            switch (e) {
              case "value":
                n = f;
                break;
              case "defaultValue":
                c = f;
                break;
              case "multiple":
                a = f;
              default:
                nl(l, t, e, f, u, null);
            }
        t = n, u = c, l.multiple = !!a, t != null ? Qu(l, !!a, t, !1) : u != null && Qu(l, !!a, u, !0);
        return;
      case "textarea":
        w("invalid", l), n = e = a = null;
        for (c in u)
          if (u.hasOwnProperty(c) && (f = u[c], f != null))
            switch (c) {
              case "value":
                a = f;
                break;
              case "defaultValue":
                e = f;
                break;
              case "children":
                n = f;
                break;
              case "dangerouslySetInnerHTML":
                if (f != null) throw Error(r(91));
                break;
              default:
                nl(l, t, c, f, u, null);
            }
        xi(l, a, e, n), _e(l);
        return;
      case "option":
        for (i in u)
          if (u.hasOwnProperty(i) && (a = u[i], a != null))
            switch (i) {
              case "selected":
                l.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                nl(l, t, i, a, u, null);
            }
        return;
      case "dialog":
        w("beforetoggle", l), w("toggle", l), w("cancel", l), w("close", l);
        break;
      case "iframe":
      case "object":
        w("load", l);
        break;
      case "video":
      case "audio":
        for (a = 0; a < fe.length; a++)
          w(fe[a], l);
        break;
      case "image":
        w("error", l), w("load", l);
        break;
      case "details":
        w("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        w("error", l), w("load", l);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (y in u)
          if (u.hasOwnProperty(y) && (a = u[y], a != null))
            switch (y) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, t));
              default:
                nl(l, t, y, a, u, null);
            }
        return;
      default:
        if (lc(t)) {
          for (T in u)
            u.hasOwnProperty(T) && (a = u[T], a !== void 0 && Gf(
              l,
              t,
              T,
              a,
              u,
              void 0
            ));
          return;
        }
    }
    for (f in u)
      u.hasOwnProperty(f) && (a = u[f], a != null && nl(l, t, f, a, u, null));
  }
  function mv(l, t, u, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var e = null, n = null, c = null, f = null, i = null, y = null, T = null;
        for (S in u) {
          var p = u[S];
          if (u.hasOwnProperty(S) && p != null)
            switch (S) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                i = p;
              default:
                a.hasOwnProperty(S) || nl(l, t, S, null, a, p);
            }
        }
        for (var m in a) {
          var S = a[m];
          if (p = u[m], a.hasOwnProperty(m) && (S != null || p != null))
            switch (m) {
              case "type":
                n = S;
                break;
              case "name":
                e = S;
                break;
              case "checked":
                y = S;
                break;
              case "defaultChecked":
                T = S;
                break;
              case "value":
                c = S;
                break;
              case "defaultValue":
                f = S;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (S != null)
                  throw Error(r(137, t));
                break;
              default:
                S !== p && nl(
                  l,
                  t,
                  m,
                  S,
                  a,
                  p
                );
            }
        }
        In(
          l,
          c,
          f,
          i,
          y,
          T,
          n,
          e
        );
        return;
      case "select":
        S = c = f = m = null;
        for (n in u)
          if (i = u[n], u.hasOwnProperty(n) && i != null)
            switch (n) {
              case "value":
                break;
              case "multiple":
                S = i;
              default:
                a.hasOwnProperty(n) || nl(
                  l,
                  t,
                  n,
                  null,
                  a,
                  i
                );
            }
        for (e in a)
          if (n = a[e], i = u[e], a.hasOwnProperty(e) && (n != null || i != null))
            switch (e) {
              case "value":
                m = n;
                break;
              case "defaultValue":
                f = n;
                break;
              case "multiple":
                c = n;
              default:
                n !== i && nl(
                  l,
                  t,
                  e,
                  n,
                  a,
                  i
                );
            }
        t = f, u = c, a = S, m != null ? Qu(l, !!u, m, !1) : !!a != !!u && (t != null ? Qu(l, !!u, t, !0) : Qu(l, !!u, u ? [] : "", !1));
        return;
      case "textarea":
        S = m = null;
        for (f in u)
          if (e = u[f], u.hasOwnProperty(f) && e != null && !a.hasOwnProperty(f))
            switch (f) {
              case "value":
                break;
              case "children":
                break;
              default:
                nl(l, t, f, null, a, e);
            }
        for (c in a)
          if (e = a[c], n = u[c], a.hasOwnProperty(c) && (e != null || n != null))
            switch (c) {
              case "value":
                m = e;
                break;
              case "defaultValue":
                S = e;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (e != null) throw Error(r(91));
                break;
              default:
                e !== n && nl(l, t, c, e, a, n);
            }
        Ni(l, m, S);
        return;
      case "option":
        for (var X in u)
          if (m = u[X], u.hasOwnProperty(X) && m != null && !a.hasOwnProperty(X))
            switch (X) {
              case "selected":
                l.selected = !1;
                break;
              default:
                nl(
                  l,
                  t,
                  X,
                  null,
                  a,
                  m
                );
            }
        for (i in a)
          if (m = a[i], S = u[i], a.hasOwnProperty(i) && m !== S && (m != null || S != null))
            switch (i) {
              case "selected":
                l.selected = m && typeof m != "function" && typeof m != "symbol";
                break;
              default:
                nl(
                  l,
                  t,
                  i,
                  m,
                  a,
                  S
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var q in u)
          m = u[q], u.hasOwnProperty(q) && m != null && !a.hasOwnProperty(q) && nl(l, t, q, null, a, m);
        for (y in a)
          if (m = a[y], S = u[y], a.hasOwnProperty(y) && m !== S && (m != null || S != null))
            switch (y) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (m != null)
                  throw Error(r(137, t));
                break;
              default:
                nl(
                  l,
                  t,
                  y,
                  m,
                  a,
                  S
                );
            }
        return;
      default:
        if (lc(t)) {
          for (var cl in u)
            m = u[cl], u.hasOwnProperty(cl) && m !== void 0 && !a.hasOwnProperty(cl) && Gf(
              l,
              t,
              cl,
              void 0,
              a,
              m
            );
          for (T in a)
            m = a[T], S = u[T], !a.hasOwnProperty(T) || m === S || m === void 0 && S === void 0 || Gf(
              l,
              t,
              T,
              m,
              a,
              S
            );
          return;
        }
    }
    for (var d in u)
      m = u[d], u.hasOwnProperty(d) && m != null && !a.hasOwnProperty(d) && nl(l, t, d, null, a, m);
    for (p in a)
      m = a[p], S = u[p], !a.hasOwnProperty(p) || m === S || m == null && S == null || nl(l, t, p, m, a, S);
  }
  var Xf = null, Qf = null;
  function On(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function Cd(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Bd(l, t) {
    if (l === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return l === 1 && t === "foreignObject" ? 0 : l;
  }
  function Zf(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Vf = null;
  function gv() {
    var l = window.event;
    return l && l.type === "popstate" ? l === Vf ? !1 : (Vf = l, !0) : (Vf = null, !1);
  }
  var qd = typeof setTimeout == "function" ? setTimeout : void 0, Sv = typeof clearTimeout == "function" ? clearTimeout : void 0, jd = typeof Promise == "function" ? Promise : void 0, bv = typeof queueMicrotask == "function" ? queueMicrotask : typeof jd < "u" ? function(l) {
    return jd.resolve(null).then(l).catch(Tv);
  } : qd;
  function Tv(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function fu(l) {
    return l === "head";
  }
  function Yd(l, t) {
    var u = t, a = 0, e = 0;
    do {
      var n = u.nextSibling;
      if (l.removeChild(u), n && n.nodeType === 8)
        if (u = n.data, u === "/$") {
          if (0 < a && 8 > a) {
            u = a;
            var c = l.ownerDocument;
            if (u & 1 && se(c.documentElement), u & 2 && se(c.body), u & 4)
              for (u = c.head, se(u), c = u.firstChild; c; ) {
                var f = c.nextSibling, i = c.nodeName;
                c[Oa] || i === "SCRIPT" || i === "STYLE" || i === "LINK" && c.rel.toLowerCase() === "stylesheet" || u.removeChild(c), c = f;
              }
          }
          if (e === 0) {
            l.removeChild(n), ge(t);
            return;
          }
          e--;
        } else
          u === "$" || u === "$?" || u === "$!" ? e++ : a = u.charCodeAt(0) - 48;
      else a = 0;
      u = n;
    } while (u);
    ge(t);
  }
  function Lf(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var u = t;
      switch (t = t.nextSibling, u.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Lf(u), $n(u);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (u.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(u);
    }
  }
  function Ev(l, t, u, a) {
    for (; l.nodeType === 1; ) {
      var e = u;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (a) {
        if (!l[Oa])
          switch (t) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (n = l.getAttribute("rel"), n === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (n !== e.rel || l.getAttribute("href") !== (e.href == null || e.href === "" ? null : e.href) || l.getAttribute("crossorigin") !== (e.crossOrigin == null ? null : e.crossOrigin) || l.getAttribute("title") !== (e.title == null ? null : e.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (n = l.getAttribute("src"), (n !== (e.src == null ? null : e.src) || l.getAttribute("type") !== (e.type == null ? null : e.type) || l.getAttribute("crossorigin") !== (e.crossOrigin == null ? null : e.crossOrigin)) && n && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (t === "input" && l.type === "hidden") {
        var n = e.name == null ? null : "" + e.name;
        if (e.type === "hidden" && l.getAttribute("name") === n)
          return l;
      } else return l;
      if (l = gt(l.nextSibling), l === null) break;
    }
    return null;
  }
  function Av(l, t, u) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !u || (l = gt(l.nextSibling), l === null)) return null;
    return l;
  }
  function Kf(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState === "complete";
  }
  function pv(l, t) {
    var u = l.ownerDocument;
    if (l.data !== "$?" || u.readyState === "complete")
      t();
    else {
      var a = function() {
        t(), u.removeEventListener("DOMContentLoaded", a);
      };
      u.addEventListener("DOMContentLoaded", a), l._reactRetry = a;
    }
  }
  function gt(l) {
    for (; l != null; l = l.nextSibling) {
      var t = l.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = l.data, t === "$" || t === "$!" || t === "$?" || t === "F!" || t === "F")
          break;
        if (t === "/$") return null;
      }
    }
    return l;
  }
  var Jf = null;
  function Gd(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var u = l.data;
        if (u === "$" || u === "$!" || u === "$?") {
          if (t === 0) return l;
          t--;
        } else u === "/$" && t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function Xd(l, t, u) {
    switch (t = On(u), l) {
      case "html":
        if (l = t.documentElement, !l) throw Error(r(452));
        return l;
      case "head":
        if (l = t.head, !l) throw Error(r(453));
        return l;
      case "body":
        if (l = t.body, !l) throw Error(r(454));
        return l;
      default:
        throw Error(r(451));
    }
  }
  function se(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    $n(l);
  }
  var rt = /* @__PURE__ */ new Map(), Qd = /* @__PURE__ */ new Set();
  function zn(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  }
  var Qt = R.d;
  R.d = {
    f: Ov,
    r: zv,
    D: Mv,
    C: Dv,
    L: _v,
    m: Rv,
    X: Nv,
    S: Uv,
    M: xv
  };
  function Ov() {
    var l = Qt.f(), t = mn();
    return l || t;
  }
  function zv(l) {
    var t = ju(l);
    t !== null && t.tag === 5 && t.type === "form" ? co(t) : Qt.r(l);
  }
  var ga = typeof document > "u" ? null : document;
  function Zd(l, t, u) {
    var a = ga;
    if (a && typeof t == "string" && t) {
      var e = nt(t);
      e = 'link[rel="' + l + '"][href="' + e + '"]', typeof u == "string" && (e += '[crossorigin="' + u + '"]'), Qd.has(e) || (Qd.add(e), l = { rel: l, crossOrigin: u, href: t }, a.querySelector(e) === null && (t = a.createElement("link"), Nl(t, "link", l), Al(t), a.head.appendChild(t)));
    }
  }
  function Mv(l) {
    Qt.D(l), Zd("dns-prefetch", l, null);
  }
  function Dv(l, t) {
    Qt.C(l, t), Zd("preconnect", l, t);
  }
  function _v(l, t, u) {
    Qt.L(l, t, u);
    var a = ga;
    if (a && l && t) {
      var e = 'link[rel="preload"][as="' + nt(t) + '"]';
      t === "image" && u && u.imageSrcSet ? (e += '[imagesrcset="' + nt(
        u.imageSrcSet
      ) + '"]', typeof u.imageSizes == "string" && (e += '[imagesizes="' + nt(
        u.imageSizes
      ) + '"]')) : e += '[href="' + nt(l) + '"]';
      var n = e;
      switch (t) {
        case "style":
          n = Sa(l);
          break;
        case "script":
          n = ba(l);
      }
      rt.has(n) || (l = x(
        {
          rel: "preload",
          href: t === "image" && u && u.imageSrcSet ? void 0 : l,
          as: t
        },
        u
      ), rt.set(n, l), a.querySelector(e) !== null || t === "style" && a.querySelector(oe(n)) || t === "script" && a.querySelector(de(n)) || (t = a.createElement("link"), Nl(t, "link", l), Al(t), a.head.appendChild(t)));
    }
  }
  function Rv(l, t) {
    Qt.m(l, t);
    var u = ga;
    if (u && l) {
      var a = t && typeof t.as == "string" ? t.as : "script", e = 'link[rel="modulepreload"][as="' + nt(a) + '"][href="' + nt(l) + '"]', n = e;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = ba(l);
      }
      if (!rt.has(n) && (l = x({ rel: "modulepreload", href: l }, t), rt.set(n, l), u.querySelector(e) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (u.querySelector(de(n)))
              return;
        }
        a = u.createElement("link"), Nl(a, "link", l), Al(a), u.head.appendChild(a);
      }
    }
  }
  function Uv(l, t, u) {
    Qt.S(l, t, u);
    var a = ga;
    if (a && l) {
      var e = Yu(a).hoistableStyles, n = Sa(l);
      t = t || "default";
      var c = e.get(n);
      if (!c) {
        var f = { loading: 0, preload: null };
        if (c = a.querySelector(
          oe(n)
        ))
          f.loading = 5;
        else {
          l = x(
            { rel: "stylesheet", href: l, "data-precedence": t },
            u
          ), (u = rt.get(n)) && wf(l, u);
          var i = c = a.createElement("link");
          Al(i), Nl(i, "link", l), i._p = new Promise(function(y, T) {
            i.onload = y, i.onerror = T;
          }), i.addEventListener("load", function() {
            f.loading |= 1;
          }), i.addEventListener("error", function() {
            f.loading |= 2;
          }), f.loading |= 4, Mn(c, t, a);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: f
        }, e.set(n, c);
      }
    }
  }
  function Nv(l, t) {
    Qt.X(l, t);
    var u = ga;
    if (u && l) {
      var a = Yu(u).hoistableScripts, e = ba(l), n = a.get(e);
      n || (n = u.querySelector(de(e)), n || (l = x({ src: l, async: !0 }, t), (t = rt.get(e)) && $f(l, t), n = u.createElement("script"), Al(n), Nl(n, "link", l), u.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(e, n));
    }
  }
  function xv(l, t) {
    Qt.M(l, t);
    var u = ga;
    if (u && l) {
      var a = Yu(u).hoistableScripts, e = ba(l), n = a.get(e);
      n || (n = u.querySelector(de(e)), n || (l = x({ src: l, async: !0, type: "module" }, t), (t = rt.get(e)) && $f(l, t), n = u.createElement("script"), Al(n), Nl(n, "link", l), u.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(e, n));
    }
  }
  function Vd(l, t, u, a) {
    var e = (e = Q.current) ? zn(e) : null;
    if (!e) throw Error(r(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof u.precedence == "string" && typeof u.href == "string" ? (t = Sa(u.href), u = Yu(
          e
        ).hoistableStyles, a = u.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, u.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (u.rel === "stylesheet" && typeof u.href == "string" && typeof u.precedence == "string") {
          l = Sa(u.href);
          var n = Yu(
            e
          ).hoistableStyles, c = n.get(l);
          if (c || (e = e.ownerDocument || e, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, n.set(l, c), (n = e.querySelector(
            oe(l)
          )) && !n._p && (c.instance = n, c.state.loading = 5), rt.has(l) || (u = {
            rel: "preload",
            as: "style",
            href: u.href,
            crossOrigin: u.crossOrigin,
            integrity: u.integrity,
            media: u.media,
            hrefLang: u.hrefLang,
            referrerPolicy: u.referrerPolicy
          }, rt.set(l, u), n || Hv(
            e,
            l,
            u,
            c.state
          ))), t && a === null)
            throw Error(r(528, ""));
          return c;
        }
        if (t && a !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return t = u.async, u = u.src, typeof u == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = ba(u), u = Yu(
          e
        ).hoistableScripts, a = u.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, u.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, l));
    }
  }
  function Sa(l) {
    return 'href="' + nt(l) + '"';
  }
  function oe(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function Ld(l) {
    return x({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function Hv(l, t, u, a) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = l.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), Nl(t, "link", u), Al(t), l.head.appendChild(t));
  }
  function ba(l) {
    return '[src="' + nt(l) + '"]';
  }
  function de(l) {
    return "script[async]" + l;
  }
  function Kd(l, t, u) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = l.querySelector(
            'style[data-href~="' + nt(u.href) + '"]'
          );
          if (a)
            return t.instance = a, Al(a), a;
          var e = x({}, u, {
            "data-href": u.href,
            "data-precedence": u.precedence,
            href: null,
            precedence: null
          });
          return a = (l.ownerDocument || l).createElement(
            "style"
          ), Al(a), Nl(a, "style", e), Mn(a, u.precedence, l), t.instance = a;
        case "stylesheet":
          e = Sa(u.href);
          var n = l.querySelector(
            oe(e)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, Al(n), n;
          a = Ld(u), (e = rt.get(e)) && wf(a, e), n = (l.ownerDocument || l).createElement("link"), Al(n);
          var c = n;
          return c._p = new Promise(function(f, i) {
            c.onload = f, c.onerror = i;
          }), Nl(n, "link", a), t.state.loading |= 4, Mn(n, u.precedence, l), t.instance = n;
        case "script":
          return n = ba(u.src), (e = l.querySelector(
            de(n)
          )) ? (t.instance = e, Al(e), e) : (a = u, (e = rt.get(n)) && (a = x({}, u), $f(a, e)), l = l.ownerDocument || l, e = l.createElement("script"), Al(e), Nl(e, "link", a), l.head.appendChild(e), t.instance = e);
        case "void":
          return null;
        default:
          throw Error(r(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Mn(a, u.precedence, l));
    return t.instance;
  }
  function Mn(l, t, u) {
    for (var a = u.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), e = a.length ? a[a.length - 1] : null, n = e, c = 0; c < a.length; c++) {
      var f = a[c];
      if (f.dataset.precedence === t) n = f;
      else if (n !== e) break;
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = u.nodeType === 9 ? u.head : u, t.insertBefore(l, t.firstChild));
  }
  function wf(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function $f(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var Dn = null;
  function Jd(l, t, u) {
    if (Dn === null) {
      var a = /* @__PURE__ */ new Map(), e = Dn = /* @__PURE__ */ new Map();
      e.set(u, a);
    } else
      e = Dn, a = e.get(u), a || (a = /* @__PURE__ */ new Map(), e.set(u, a));
    if (a.has(l)) return a;
    for (a.set(l, null), u = u.getElementsByTagName(l), e = 0; e < u.length; e++) {
      var n = u[e];
      if (!(n[Oa] || n[Bl] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = n.getAttribute(t) || "";
        c = l + c;
        var f = a.get(c);
        f ? f.push(n) : a.set(c, [n]);
      }
    }
    return a;
  }
  function wd(l, t, u) {
    l = l.ownerDocument || l, l.head.insertBefore(
      u,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function Cv(l, t, u) {
    if (u === 1 || t.itemProp != null) return !1;
    switch (l) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return l = t.disabled, typeof t.precedence == "string" && l == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function $d(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  var re = null;
  function Bv() {
  }
  function qv(l, t, u) {
    if (re === null) throw Error(r(475));
    var a = re;
    if (t.type === "stylesheet" && (typeof u.media != "string" || matchMedia(u.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var e = Sa(u.href), n = l.querySelector(
          oe(e)
        );
        if (n) {
          l = n._p, l !== null && typeof l == "object" && typeof l.then == "function" && (a.count++, a = _n.bind(a), l.then(a, a)), t.state.loading |= 4, t.instance = n, Al(n);
          return;
        }
        n = l.ownerDocument || l, u = Ld(u), (e = rt.get(e)) && wf(u, e), n = n.createElement("link"), Al(n);
        var c = n;
        c._p = new Promise(function(f, i) {
          c.onload = f, c.onerror = i;
        }), Nl(n, "link", u), t.instance = n;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, l), (l = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = _n.bind(a), l.addEventListener("load", t), l.addEventListener("error", t));
    }
  }
  function jv() {
    if (re === null) throw Error(r(475));
    var l = re;
    return l.stylesheets && l.count === 0 && Wf(l, l.stylesheets), 0 < l.count ? function(t) {
      var u = setTimeout(function() {
        if (l.stylesheets && Wf(l, l.stylesheets), l.unsuspend) {
          var a = l.unsuspend;
          l.unsuspend = null, a();
        }
      }, 6e4);
      return l.unsuspend = t, function() {
        l.unsuspend = null, clearTimeout(u);
      };
    } : null;
  }
  function _n() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) Wf(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        this.unsuspend = null, l();
      }
    }
  }
  var Rn = null;
  function Wf(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Rn = /* @__PURE__ */ new Map(), t.forEach(Yv, l), Rn = null, _n.call(l));
  }
  function Yv(l, t) {
    if (!(t.state.loading & 4)) {
      var u = Rn.get(l);
      if (u) var a = u.get(null);
      else {
        u = /* @__PURE__ */ new Map(), Rn.set(l, u);
        for (var e = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), n = 0; n < e.length; n++) {
          var c = e[n];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (u.set(c.dataset.precedence, c), a = c);
        }
        a && u.set(null, a);
      }
      e = t.instance, c = e.getAttribute("data-precedence"), n = u.get(c) || a, n === a && u.set(null, e), u.set(c, e), this.count++, a = _n.bind(this), e.addEventListener("load", a), e.addEventListener("error", a), n ? n.parentNode.insertBefore(e, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(e, l.firstChild)), t.state.loading |= 4;
    }
  }
  var ve = {
    $$typeof: xl,
    Provider: null,
    Consumer: null,
    _currentValue: G,
    _currentValue2: G,
    _threadCount: 0
  };
  function Gv(l, t, u, a, e, n, c, f) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Ln(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ln(0), this.hiddenUpdates = Ln(null), this.identifierPrefix = a, this.onUncaughtError = e, this.onCaughtError = n, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = f, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Wd(l, t, u, a, e, n, c, f, i, y, T, p) {
    return l = new Gv(
      l,
      t,
      u,
      c,
      f,
      i,
      y,
      p
    ), t = 1, n === !0 && (t |= 24), n = Fl(3, null, null, t), l.current = n, n.stateNode = l, t = Rc(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: a,
      isDehydrated: u,
      cache: t
    }, Hc(n), l;
  }
  function kd(l) {
    return l ? (l = ku, l) : ku;
  }
  function Fd(l, t, u, a, e, n) {
    e = kd(e), a.context === null ? a.context = e : a.pendingContext = e, a = $t(t), a.payload = { element: u }, n = n === void 0 ? null : n, n !== null && (a.callback = n), u = Wt(l, a, t), u !== null && (ut(u, l, t), Va(u, l, t));
  }
  function Id(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var u = l.retryLane;
      l.retryLane = u !== 0 && u < t ? u : t;
    }
  }
  function kf(l, t) {
    Id(l, t), (l = l.alternate) && Id(l, t);
  }
  function Pd(l) {
    if (l.tag === 13) {
      var t = Wu(l, 67108864);
      t !== null && ut(t, l, 67108864), kf(l, 67108864);
    }
  }
  var Un = !0;
  function Xv(l, t, u, a) {
    var e = E.T;
    E.T = null;
    var n = R.p;
    try {
      R.p = 2, Ff(l, t, u, a);
    } finally {
      R.p = n, E.T = e;
    }
  }
  function Qv(l, t, u, a) {
    var e = E.T;
    E.T = null;
    var n = R.p;
    try {
      R.p = 8, Ff(l, t, u, a);
    } finally {
      R.p = n, E.T = e;
    }
  }
  function Ff(l, t, u, a) {
    if (Un) {
      var e = If(a);
      if (e === null)
        Yf(
          l,
          t,
          a,
          Nn,
          u
        ), tr(l, a);
      else if (Vv(
        e,
        l,
        t,
        u,
        a
      ))
        a.stopPropagation();
      else if (tr(l, a), t & 4 && -1 < Zv.indexOf(l)) {
        for (; e !== null; ) {
          var n = ju(e);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var c = mu(n.pendingLanes);
                  if (c !== 0) {
                    var f = n;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; c; ) {
                      var i = 1 << 31 - Wl(c);
                      f.entanglements[1] |= i, c &= ~i;
                    }
                    Ot(n), (ul & 6) === 0 && (hn = bt() + 500, ce(0));
                  }
                }
                break;
              case 13:
                f = Wu(n, 2), f !== null && ut(f, n, 2), mn(), kf(n, 2);
            }
          if (n = If(a), n === null && Yf(
            l,
            t,
            a,
            Nn,
            u
          ), n === e) break;
          e = n;
        }
        e !== null && a.stopPropagation();
      } else
        Yf(
          l,
          t,
          a,
          null,
          u
        );
    }
  }
  function If(l) {
    return l = uc(l), Pf(l);
  }
  var Nn = null;
  function Pf(l) {
    if (Nn = null, l = qu(l), l !== null) {
      var t = Y(l);
      if (t === null) l = null;
      else {
        var u = t.tag;
        if (u === 13) {
          if (l = L(t), l !== null) return l;
          l = null;
        } else if (u === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return Nn = l, null;
  }
  function lr(l) {
    switch (l) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Dr()) {
          case vi:
            return 2;
          case hi:
            return 8;
          case Ae:
          case _r:
            return 32;
          case yi:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var li = !1, iu = null, su = null, ou = null, he = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), du = [], Zv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function tr(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        iu = null;
        break;
      case "dragenter":
      case "dragleave":
        su = null;
        break;
      case "mouseover":
      case "mouseout":
        ou = null;
        break;
      case "pointerover":
      case "pointerout":
        he.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ye.delete(t.pointerId);
    }
  }
  function me(l, t, u, a, e, n) {
    return l === null || l.nativeEvent !== n ? (l = {
      blockedOn: t,
      domEventName: u,
      eventSystemFlags: a,
      nativeEvent: n,
      targetContainers: [e]
    }, t !== null && (t = ju(t), t !== null && Pd(t)), l) : (l.eventSystemFlags |= a, t = l.targetContainers, e !== null && t.indexOf(e) === -1 && t.push(e), l);
  }
  function Vv(l, t, u, a, e) {
    switch (t) {
      case "focusin":
        return iu = me(
          iu,
          l,
          t,
          u,
          a,
          e
        ), !0;
      case "dragenter":
        return su = me(
          su,
          l,
          t,
          u,
          a,
          e
        ), !0;
      case "mouseover":
        return ou = me(
          ou,
          l,
          t,
          u,
          a,
          e
        ), !0;
      case "pointerover":
        var n = e.pointerId;
        return he.set(
          n,
          me(
            he.get(n) || null,
            l,
            t,
            u,
            a,
            e
          )
        ), !0;
      case "gotpointercapture":
        return n = e.pointerId, ye.set(
          n,
          me(
            ye.get(n) || null,
            l,
            t,
            u,
            a,
            e
          )
        ), !0;
    }
    return !1;
  }
  function ur(l) {
    var t = qu(l.target);
    if (t !== null) {
      var u = Y(t);
      if (u !== null) {
        if (t = u.tag, t === 13) {
          if (t = L(u), t !== null) {
            l.blockedOn = t, qr(l.priority, function() {
              if (u.tag === 13) {
                var a = tt();
                a = Kn(a);
                var e = Wu(u, a);
                e !== null && ut(e, u, a), kf(u, a);
              }
            });
            return;
          }
        } else if (t === 3 && u.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = u.tag === 3 ? u.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function xn(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var u = If(l.nativeEvent);
      if (u === null) {
        u = l.nativeEvent;
        var a = new u.constructor(
          u.type,
          u
        );
        tc = a, u.target.dispatchEvent(a), tc = null;
      } else
        return t = ju(u), t !== null && Pd(t), l.blockedOn = u, !1;
      t.shift();
    }
    return !0;
  }
  function ar(l, t, u) {
    xn(l) && u.delete(t);
  }
  function Lv() {
    li = !1, iu !== null && xn(iu) && (iu = null), su !== null && xn(su) && (su = null), ou !== null && xn(ou) && (ou = null), he.forEach(ar), ye.forEach(ar);
  }
  function Hn(l, t) {
    l.blockedOn === t && (l.blockedOn = null, li || (li = !0, v.unstable_scheduleCallback(
      v.unstable_NormalPriority,
      Lv
    )));
  }
  var Cn = null;
  function er(l) {
    Cn !== l && (Cn = l, v.unstable_scheduleCallback(
      v.unstable_NormalPriority,
      function() {
        Cn === l && (Cn = null);
        for (var t = 0; t < l.length; t += 3) {
          var u = l[t], a = l[t + 1], e = l[t + 2];
          if (typeof a != "function") {
            if (Pf(a || u) === null)
              continue;
            break;
          }
          var n = ju(u);
          n !== null && (l.splice(t, 3), t -= 3, Ic(
            n,
            {
              pending: !0,
              data: e,
              method: u.method,
              action: a
            },
            a,
            e
          ));
        }
      }
    ));
  }
  function ge(l) {
    function t(i) {
      return Hn(i, l);
    }
    iu !== null && Hn(iu, l), su !== null && Hn(su, l), ou !== null && Hn(ou, l), he.forEach(t), ye.forEach(t);
    for (var u = 0; u < du.length; u++) {
      var a = du[u];
      a.blockedOn === l && (a.blockedOn = null);
    }
    for (; 0 < du.length && (u = du[0], u.blockedOn === null); )
      ur(u), u.blockedOn === null && du.shift();
    if (u = (l.ownerDocument || l).$$reactFormReplay, u != null)
      for (a = 0; a < u.length; a += 3) {
        var e = u[a], n = u[a + 1], c = e[Gl] || null;
        if (typeof n == "function")
          c || er(u);
        else if (c) {
          var f = null;
          if (n && n.hasAttribute("formAction")) {
            if (e = n, c = n[Gl] || null)
              f = c.formAction;
            else if (Pf(e) !== null) continue;
          } else f = c.action;
          typeof f == "function" ? u[a + 1] = f : (u.splice(a, 3), a -= 3), er(u);
        }
      }
  }
  function ti(l) {
    this._internalRoot = l;
  }
  Bn.prototype.render = ti.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(r(409));
    var u = t.current, a = tt();
    Fd(u, a, l, t, null, null);
  }, Bn.prototype.unmount = ti.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      Fd(l.current, 2, null, l, null, null), mn(), t[Bu] = null;
    }
  };
  function Bn(l) {
    this._internalRoot = l;
  }
  Bn.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = Ti();
      l = { blockedOn: null, target: l, priority: t };
      for (var u = 0; u < du.length && t !== 0 && t < du[u].priority; u++) ;
      du.splice(u, 0, l), u === 0 && ur(l);
    }
  };
  var nr = g.version;
  if (nr !== "19.1.0")
    throw Error(
      r(
        527,
        nr,
        "19.1.0"
      )
    );
  R.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(r(188)) : (l = Object.keys(l).join(","), Error(r(268, l)));
    return l = D(t), l = l !== null ? O(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var Kv = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: E,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var qn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!qn.isDisabled && qn.supportsFiber)
      try {
        Ea = qn.inject(
          Kv
        ), $l = qn;
      } catch {
      }
  }
  return be.createRoot = function(l, t) {
    if (!C(l)) throw Error(r(299));
    var u = !1, a = "", e = Eo, n = Ao, c = po, f = null;
    return t != null && (t.unstable_strictMode === !0 && (u = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (e = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (f = t.unstable_transitionCallbacks)), t = Wd(
      l,
      1,
      !1,
      null,
      null,
      u,
      a,
      e,
      n,
      c,
      f,
      null
    ), l[Bu] = t.current, jf(l), new ti(t);
  }, be.hydrateRoot = function(l, t, u) {
    if (!C(l)) throw Error(r(299));
    var a = !1, e = "", n = Eo, c = Ao, f = po, i = null, y = null;
    return u != null && (u.unstable_strictMode === !0 && (a = !0), u.identifierPrefix !== void 0 && (e = u.identifierPrefix), u.onUncaughtError !== void 0 && (n = u.onUncaughtError), u.onCaughtError !== void 0 && (c = u.onCaughtError), u.onRecoverableError !== void 0 && (f = u.onRecoverableError), u.unstable_transitionCallbacks !== void 0 && (i = u.unstable_transitionCallbacks), u.formState !== void 0 && (y = u.formState)), t = Wd(
      l,
      1,
      !0,
      t,
      u ?? null,
      a,
      e,
      n,
      c,
      f,
      i,
      y
    ), t.context = kd(null), u = t.current, a = tt(), a = Kn(a), e = $t(a), e.callback = null, Wt(u, e, a), u = a, t.current.lanes = u, pa(t, u), Ot(t), l[Bu] = t.current, jf(l), new Bn(t);
  }, be.version = "19.1.0", be;
}
var yr;
function th() {
  if (yr) return ei.exports;
  yr = 1;
  function v() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(v);
      } catch (g) {
        console.error(g);
      }
  }
  return v(), ei.exports = lh(), ei.exports;
}
var uh = th();
class ah extends Ml.Component {
  constructor(g) {
    super(g), this.state = { hasError: !1 };
  }
  static getDerivedStateFromError(g) {
    return { hasError: !0, error: g };
  }
  render() {
    return this.state.hasError ? /* @__PURE__ */ M.jsx("div", { children: "Something went wrong. Please refresh the page or contact express dev team." }) : this.props.children;
  }
}
const mr = "https://www.adobe.com/express-search-api-v3", ii = "urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418", Sr = "urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852", oi = " AND ", br = ",";
function Tr(v) {
  const g = new URLSearchParams(v);
  g.has("collection") && (g.get("collection") === "default" ? g.set("collectionId", `${ii}`) : g.get("collection") === "popular" && g.set("collectionId", `${Sr}`), g.delete("collection")), g.get("collectionId") || g.set("collectionId", `${ii}`), g.get("license") && (g.append("filters", `licensingCategory==${g.get("license")}`), g.delete("license")), g.get("behaviors") && (g.append("filters", `behaviors==${g.get("behaviors")}`), g.delete("behaviors")), g.get("tasks") && (g.append("filters", `pages.task.name==${g.get("tasks")}`), g.delete("tasks")), g.get("topics") && (g.get("topics").split(oi).forEach((C) => {
    g.append("filters", `topics==${C}`);
  }), g.delete("topics")), g.get("language") && (g.append("filters", `language==${g.get("language")}`), g.delete("language"));
  const b = {};
  g.get("prefLang") && (b["x-express-pref-lang"] = g.get("prefLang"), g.delete("prefLang")), g.get("prefRegion") && (b["x-express-pref-region-code"] = g.get("prefRegion"), g.delete("prefRegion")), g.set("queryType", "search");
  const r = new URL(mr).host === window.location.host ? "" : "&ax-env=stage";
  return { url: `${mr}?${decodeURIComponent(g.toString())}${r}`, headers: b };
}
async function eh(v) {
  const { url: g, headers: b } = Tr(v);
  return console.log(v, g, b), await (await fetch(g, { headers: b })).json();
}
function nh(v) {
  var g, b, r;
  return (g = v["dc:title"]) != null && g["i-default"] ? v["dc:title"]["i-default"] : (b = v.moods) != null && b.length && ((r = v.task) != null && r.name) ? `${v.moods.join(", ")} ${v.task.name}` : "";
}
function ch(v) {
  var g, b;
  return (b = (g = v._links) == null ? void 0 : g["http://ns.adobe.com/adobecloud/rel/rendition"]) == null ? void 0 : b.href;
}
function fh(v) {
  var g, b;
  return (b = (g = v._links) == null ? void 0 : g["http://ns.adobe.com/adobecloud/rel/component"]) == null ? void 0 : b.href;
}
const Er = {
  collection: "default",
  collectionId: "",
  q: "",
  limit: 10,
  start: 0,
  orderBy: "",
  // filters
  language: "",
  tasks: "",
  topics: [[""]],
  license: "",
  behaviors: "",
  // boosting
  prefLang: "",
  prefRegion: ""
};
function ih(v) {
  const g = new URLSearchParams(v), b = structuredClone(Er);
  return g.has("collectionId") ? g.get("collectionId") === ii ? (b.collection = "default", b.collectionId = "") : g.get("collectionId") === Sr ? (b.collection = "popular", b.collectionId = "") : b.collection = "custom" : g.has("collection") && ["default", "popular"].includes(g.get("collection")) ? (b.collection = g.get("collection"), b.collectionId = "") : (b.collection = "default", b.collectionId = ""), g.get("limit") && (b.limit = g.get("limit")), g.get("start") && (b.start = g.get("start")), g.get("orderBy") && (b.orderBy = g.get("orderBy")), g.get("q") && (b.q = g.get("q")), g.get("language") && (b.language = g.get("language")), g.get("tasks") && (b.tasks = g.get("tasks")), g.get("topics") && (b.topics = g.get("topics").split(oi).map((r) => r.split(br))), g.get("license") && (b.license = g.get("license")), g.get("behaviors") && (b.behaviors = g.get("behaviors")), g.get("prefLang") && (b.prefLang = g.get("prefLang")), g.get("prefRegion") && (b.prefRegion = g.get("prefRegion").toUpperCase()), b;
}
function di(v) {
  const g = v.collection === "custom" ? "" : `collection=${v.collection}`, b = v.collection === "custom" ? `collectionId=${v.collectionId}` : "", r = v.limit ? `limit=${v.limit}` : "", C = v.start ? `start=${v.start}` : "", Y = v.q ? `q=${v.q}` : "", L = v.language ? `language=${v.language}` : "", P = v.tasks ? `tasks=${v.tasks}` : "", D = v.topics.filter((El) => El.some(Boolean)).map((El) => El.filter(Boolean).join(br)).join(oi), O = D ? `topics=${D}` : "", x = v.license ? `license=${v.license}` : "", tl = v.behaviors ? `behaviors=${v.behaviors}` : "", $ = v.orderBy ? `orderBy=${v.orderBy}` : "", Dl = v.prefLang ? `prefLang=${v.prefLang}` : "", _l = v.prefRegion ? `prefRegion=${v.prefRegion}` : "";
  return [
    Y,
    O,
    P,
    L,
    x,
    tl,
    $,
    r,
    g,
    b,
    Dl,
    _l,
    C
  ].filter(Boolean).join("&");
}
const Ar = Ml.createContext(null), pr = Ml.createContext(null), Or = Ml.createContext(null);
function Te() {
  return Ml.useContext(Ar);
}
function Yn() {
  return Ml.useContext(pr);
}
function sh() {
  return Ml.useContext(Or);
}
const vt = {
  UPDATE_RECIPE: "UPDATE_RECIPE",
  UPDATE_FORM: "UPDATE_FORM",
  TOPICS_ADD: "TOPICS_ADD",
  TOPICS_UPDATE: "TOPICS_UPDATE",
  TOPICS_REMOVE: "TOPICS_REMOVE",
  TOPICS_EXPAND: "TOPICS_EXPAND"
};
function oh(v, g) {
  const { type: b, payload: r } = g, { field: C, value: Y, topicsRow: L, topicsCol: P } = r || {};
  if (b === vt.UPDATE_RECIPE)
    return ih(Y);
  if (b === vt.UPDATE_FORM)
    return { ...v, [C]: Y };
  if (b === vt.TOPICS_ADD) {
    const D = structuredClone(v.topics);
    return D[L].push(""), { ...v, topics: D };
  } else if (b === vt.TOPICS_REMOVE) {
    const D = structuredClone(v.topics);
    return D[L].pop(), D[L].length || D.splice(L, 1), {
      ...v,
      topics: D
    };
  } else if (b === vt.TOPICS_UPDATE) {
    const D = structuredClone(v.topics);
    return D[L][P] = Y, {
      ...v,
      topics: D
    };
  } else if (b === vt.TOPICS_EXPAND)
    return {
      ...v,
      topics: [...v.topics, [""]]
    };
  throw new Error(`Unhandled action type: ${b}`);
}
function dh({ children: v }) {
  const [g, b] = Ml.useReducer(oh, Er);
  return /* @__PURE__ */ M.jsx(Ar, { value: g, children: /* @__PURE__ */ M.jsx(pr, { value: b, children: v }) });
}
function rh() {
  const [v, g] = Ml.useState(null), b = Ml.useRef(null), r = Ml.useCallback((C) => {
    b.current && clearTimeout(b.current), g(C), b.current = setTimeout(() => g(null), 5e3);
  }, []);
  return Ml.useEffect(() => () => {
    b.current && clearTimeout(b.current);
  }, []), [v, r];
}
function vh({ children: v }) {
  const [g, b] = rh();
  return /* @__PURE__ */ M.jsx(Or, { value: { activeInfo: g, showInfo: b }, children: v });
}
function hh() {
  const [v, g] = Ml.useState(!1), b = Te(), r = di(b), C = Yn(), Y = () => {
    navigator.clipboard.writeText(r), g(!0), setTimeout(() => g(!1), 2e3);
  };
  return /* @__PURE__ */ M.jsxs("div", { className: "border-grey rounded p-1", children: [
    /* @__PURE__ */ M.jsx("h2", { children: "Recipe to Form:" }),
    /* @__PURE__ */ M.jsx(
      "textarea",
      {
        autoCorrect: "off",
        autoCapitalize: "off",
        spellCheck: "false",
        value: r,
        onChange: (L) => C({ type: vt.UPDATE_RECIPE, payload: { value: L.target.value } })
      }
    ),
    /* @__PURE__ */ M.jsxs("div", { className: "copy-button-container", children: [
      /* @__PURE__ */ M.jsx("button", { onClick: Y, children: "Copy" }),
      v && /* @__PURE__ */ M.jsx("p", { className: "copied", children: "Copied to clipboard!" })
    ] })
  ] });
}
function Gn({ children: v }) {
  return /* @__PURE__ */ M.jsx("label", { className: "flex gap-2 items-center flex-wrap", children: v });
}
function yh({ topicsGroup: v, rowIndex: g, expandButton: b }) {
  const r = Yn();
  return /* @__PURE__ */ M.jsxs(Gn, { children: [
    g === 0 ? "Topics:" : "AND Topics:",
    v.map((C, Y) => /* @__PURE__ */ M.jsx(
      "input",
      {
        className: "topics-input",
        type: "text",
        value: C,
        onChange: (L) => r({
          type: vt.TOPICS_UPDATE,
          payload: {
            topicsRow: g,
            topicsCol: Y,
            value: L.target.value
          }
        })
      },
      Y
    )),
    /* @__PURE__ */ M.jsxs("div", { className: "flex gap-1", children: [
      g === 0 && v.length === 1 || /* @__PURE__ */ M.jsx(
        "button",
        {
          onClick: (C) => {
            C.preventDefault(), r({
              type: vt.TOPICS_REMOVE,
              payload: {
                topicsRow: g
              }
            });
          },
          children: "-"
        }
      ),
      v.every(Boolean) && /* @__PURE__ */ M.jsx(
        "button",
        {
          onClick: (C) => {
            C.preventDefault(), r({
              type: vt.TOPICS_ADD,
              payload: { topicsRow: g }
            });
          },
          children: "+"
        }
      ),
      b
    ] })
  ] });
}
function mh() {
  const v = Te(), g = Yn(), b = v.topics, r = /* @__PURE__ */ M.jsx(
    "button",
    {
      onClick: (C) => {
        C.preventDefault(), g({
          type: vt.TOPICS_EXPAND
        });
      },
      children: "AND"
    }
  );
  return /* @__PURE__ */ M.jsx("div", { className: "flex flex-col items-start", children: b.map((C, Y) => /* @__PURE__ */ M.jsx(
    yh,
    {
      rowIndex: Y,
      topicsGroup: b[Y],
      expandButton: Y === b.length - 1 ? r : null
    },
    Y
  )) });
}
function gh({ fieldName: v, content: g }) {
  const { activeInfo: b, showInfo: r } = sh();
  return /* @__PURE__ */ M.jsxs(M.Fragment, { children: [
    /* @__PURE__ */ M.jsx(
      "button",
      {
        type: "button",
        className: "info-button",
        "aria-label": `Show information for ${v}`,
        onClick: () => r(v),
        children: "？"
      }
    ),
    b === v && /* @__PURE__ */ M.jsx("div", { className: "info-content", tabIndex: "0", children: /* @__PURE__ */ M.jsx("small", { children: g }) })
  ] });
}
const ri = Ml.memo(gh);
function Ta({
  label: v,
  name: g,
  title: b,
  value: r,
  onChange: C,
  info: Y,
  required: L,
  disabled: P,
  ...D
}) {
  return /* @__PURE__ */ M.jsxs(Gn, { children: [
    v,
    /* @__PURE__ */ M.jsx(
      "input",
      {
        name: g,
        type: "text",
        title: b,
        required: L,
        disabled: P,
        value: r,
        onChange: C,
        ...D
      }
    ),
    Y && /* @__PURE__ */ M.jsx(
      ri,
      {
        fieldName: g,
        content: Y
      }
    )
  ] });
}
function jn({
  label: v,
  name: g,
  value: b,
  onChange: r,
  options: C,
  info: Y,
  ...L
}) {
  return /* @__PURE__ */ M.jsxs(Gn, { children: [
    v,
    /* @__PURE__ */ M.jsx(
      "select",
      {
        name: g,
        value: b,
        onChange: r,
        ...L,
        children: C.map((P) => /* @__PURE__ */ M.jsx("option", { value: P.value, children: P.label }, P.value))
      }
    ),
    Y && /* @__PURE__ */ M.jsx(
      ri,
      {
        fieldName: g,
        content: Y
      }
    )
  ] });
}
function gr({
  label: v,
  name: g,
  value: b,
  onChange: r,
  info: C,
  ...Y
}) {
  return /* @__PURE__ */ M.jsxs(Gn, { children: [
    v,
    /* @__PURE__ */ M.jsx(
      "input",
      {
        name: g,
        type: "number",
        value: b,
        onChange: r,
        ...Y
      }
    ),
    C && /* @__PURE__ */ M.jsx(
      ri,
      {
        fieldName: g,
        content: C
      }
    )
  ] });
}
function Sh() {
  const v = Te(), g = Yn(), b = (r) => (C) => {
    g({
      type: vt.UPDATE_FORM,
      payload: { field: r, value: C.target.value }
    });
  };
  return /* @__PURE__ */ M.jsx("form", { className: "border-grey rounded p-1 gap-1", children: /* @__PURE__ */ M.jsxs(vh, { children: [
    /* @__PURE__ */ M.jsx("h2", { children: "Form to Recipe:" }),
    /* @__PURE__ */ M.jsx("h4", { children: "Search Parameters" }),
    /* @__PURE__ */ M.jsx(
      Ta,
      {
        label: "Q:",
        name: "q",
        value: v.q,
        onChange: b("q"),
        info: "Search query. This is more flexible and ambiguous than using filters but also less precise."
      }
    ),
    /* @__PURE__ */ M.jsx(
      jn,
      {
        label: "Collection:",
        name: "collection",
        value: v.collection,
        onChange: b("collection"),
        options: [
          { value: "default", label: "Default" },
          { value: "popular", label: "Popular" },
          { value: "custom", label: "Use Custom collection ID" }
        ],
        info: "Predefined collections. Select Customized to use specific Collection ID. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). You can also use the Popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852)."
      }
    ),
    /* @__PURE__ */ M.jsx(
      Ta,
      {
        label: "Collection ID:",
        name: "collectionId",
        value: v.collectionId,
        onChange: b("collectionId"),
        title: "Optional. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). Another common is the popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852).",
        disabled: v.collection !== "custom",
        required: v.collection === "custom"
      }
    ),
    v.collection === "custom" && !v.collectionId && /* @__PURE__ */ M.jsx("div", { className: "error-message", children: "Collection ID is required when using a custom collection" }),
    /* @__PURE__ */ M.jsx(
      gr,
      {
        label: "Limit:",
        name: "limit",
        value: v.limit,
        onChange: b("limit"),
        info: "Number of results to return"
      }
    ),
    /* @__PURE__ */ M.jsx(
      gr,
      {
        label: "Start:",
        name: "start",
        value: v.start,
        onChange: b("start"),
        info: "Starting index for the results"
      }
    ),
    /* @__PURE__ */ M.jsx(
      jn,
      {
        label: "Order by:",
        name: "orderBy",
        value: v.orderBy,
        onChange: b("orderBy"),
        options: [
          { value: "", label: "Relevancy (Default)" },
          { value: "-remixCount", label: "Descending Remix Count" },
          { value: "+remixCount", label: "Ascending Remix Count" },
          {
            value: "-createDate",
            label: "Descending Create Date (New first)"
          },
          {
            value: "+createDate",
            label: "Ascending Create Date (Old first)"
          }
        ],
        info: "Select by which method results would be ordered"
      }
    ),
    /* @__PURE__ */ M.jsx("h4", { children: "Filters (comma separated):" }),
    /* @__PURE__ */ M.jsx(
      Ta,
      {
        label: "Language:",
        name: "language",
        value: v.language,
        onChange: b("language"),
        info: "Available values : ar-SA, bn-IN, cs-CZ, da-DK, de-DE, el-GR, en-US, es-ES, fil-P,fi-FI, fr-FR,hi-IN, id-ID, it-IT, ja-JP, ko-KR, ms-MY, nb-NO, nl-NL, pl-PL, pt-BR, ro-RO, ru-RU, sv-SE, ta-IN, th-TH, tr-TR, uk-UA, vi-VN, zh-Hans-CN, zh-Hant-TW"
      }
    ),
    /* @__PURE__ */ M.jsx(
      Ta,
      {
        label: "Tasks:",
        name: "tasks",
        value: v.tasks,
        onChange: b("tasks")
      }
    ),
    /* @__PURE__ */ M.jsx(mh, {}),
    /* @__PURE__ */ M.jsx(
      jn,
      {
        label: "Behaviors:",
        name: "behaviors",
        value: v.behaviors,
        onChange: b("behaviors"),
        options: [
          { value: "", label: "All (Default)" },
          { value: "still", label: "Still" },
          { value: "animated", label: "Animated" },
          { value: "video", label: "Video" },
          { value: "animated,video", label: "Animated + Video" }
        ]
      }
    ),
    /* @__PURE__ */ M.jsx(
      jn,
      {
        label: "Licensing Category:",
        name: "license",
        value: v.license,
        onChange: b("license"),
        options: [
          { value: "", label: "All (Default)" },
          { value: "free", label: "Free" },
          { value: "premium", label: "Premium" }
        ]
      }
    ),
    /* @__PURE__ */ M.jsx("h4", { children: "Boosting:" }),
    /* @__PURE__ */ M.jsx(
      Ta,
      {
        label: "Preferred Language Boosting:",
        name: "prefLang",
        value: v.prefLang,
        onChange: b("prefLang"),
        info: "Boost templates that are in this language. Useful when your results have a mix of languages. Same list as the one for language filter."
      }
    ),
    /* @__PURE__ */ M.jsx(
      Ta,
      {
        label: "Preferred Region Boosting:",
        name: "prefRegion",
        value: v.prefRegion,
        onChange: b("prefRegion"),
        info: "Available values :  AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KR, KV, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, ST, SV, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, YE, YT, ZA, ZM, ZW, ZZ"
      }
    )
  ] }) });
}
function bh(v) {
  var P;
  const g = (P = v.pages[0].rendition.image) == null ? void 0 : P.thumbnail, b = fh(v), r = ch(v), { mediaType: C, componentId: Y, hzRevision: L } = g;
  return C === "image/webp" ? b.replace(
    "{&revision,component_id}",
    `&revision=${L || 0}&component_id=${Y}`
  ) : r.replace(
    "{&page,size,type,fragment}",
    `&type=${C}&fragment=id=${Y}`
  );
}
function Th({ data: v }) {
  const g = /* @__PURE__ */ M.jsx("img", { src: bh(v), alt: nh(v) });
  return /* @__PURE__ */ M.jsx("div", { className: "flex flex-col template", children: g });
}
function Eh({ generateResults: v, loading: g, results: b }) {
  return /* @__PURE__ */ M.jsx("button", { onClick: v, disabled: g, children: g ? "Generating..." : b ? "Regenerate" : "Generate" });
}
function Ah() {
  var O, x, tl;
  const v = Te(), g = di(v), [b, r] = Ml.useState(null), [C, Y] = Ml.useState(!1), [L, P] = Ml.useState(null), D = async () => {
    r(null), Y(!0), P(null);
    try {
      const $ = await eh(g);
      r($);
    } catch ($) {
      P($);
    } finally {
      Y(!1);
    }
  };
  return /* @__PURE__ */ M.jsxs("div", { className: "border-grey rounded p-1 gap-1", children: [
    /* @__PURE__ */ M.jsx("h2", { children: "Results" }),
    /* @__PURE__ */ M.jsx(
      Eh,
      {
        generateResults: D,
        loading: C,
        results: b
      }
    ),
    C && /* @__PURE__ */ M.jsx("p", { children: "Loading..." }),
    L && /* @__PURE__ */ M.jsxs("p", { children: [
      "Error: ",
      L.message
    ] }),
    ((O = b == null ? void 0 : b.metadata) == null ? void 0 : O.totalHits) > 0 && /* @__PURE__ */ M.jsxs("p", { children: [
      "Total hits: ",
      b.metadata.totalHits
    ] }),
    ((x = b == null ? void 0 : b.metadata) == null ? void 0 : x.totalHits) === 0 && /* @__PURE__ */ M.jsx("p", { children: "No results found. Try different recipe." }),
    ((tl = b == null ? void 0 : b.items) == null ? void 0 : tl.length) > 0 && /* @__PURE__ */ M.jsx("div", { className: "flex flex-wrap gap-2 templates", children: b.items.map(($) => /* @__PURE__ */ M.jsx(Th, { data: $ }, $.id)) })
  ] });
}
function ph() {
  const v = Te(), { url: g, headers: b } = Tr(di(v));
  return /* @__PURE__ */ M.jsxs("div", { className: "border-grey rounded p-1", children: [
    /* @__PURE__ */ M.jsx("h2", { children: "Support" }),
    /* @__PURE__ */ M.jsxs("p", { children: [
      "Authoring questions, copy the ",
      /* @__PURE__ */ M.jsx("strong", { children: "recipe (left)" }),
      " and ask in",
      " ",
      /* @__PURE__ */ M.jsx("a", { href: "https://adobe.enterprise.slack.com/archives/C04UH0M1CRG", children: "#express-dev-core" }),
      "."
    ] }),
    /* @__PURE__ */ M.jsxs("p", { children: [
      "API/Content Tagging questions, copy the url and headers below and ask in",
      " ",
      /* @__PURE__ */ M.jsx("a", { href: "https://adobe.enterprise.slack.com/archives/C01KV8N5EPR", children: "#express-content-clients" }),
      "."
    ] }),
    /* @__PURE__ */ M.jsxs("div", { className: "support--code", children: [
      /* @__PURE__ */ M.jsx("div", { children: /* @__PURE__ */ M.jsxs("code", { children: [
        "url: ",
        g
      ] }) }),
      /* @__PURE__ */ M.jsx("div", { children: /* @__PURE__ */ M.jsxs("code", { children: [
        "headers: ",
        JSON.stringify(b, null, 2)
      ] }) })
    ] })
  ] });
}
function Oh() {
  return /* @__PURE__ */ M.jsx(ah, { children: /* @__PURE__ */ M.jsx(dh, { children: /* @__PURE__ */ M.jsxs("div", { className: "app-container m-auto", children: [
    /* @__PURE__ */ M.jsx("h1", { children: "Templates as a Service (TaaS)" }),
    /* @__PURE__ */ M.jsxs("div", { className: "flex flex-wrap gap-1", children: [
      /* @__PURE__ */ M.jsxs("div", { className: "left-container flex flex-col gap-1", children: [
        /* @__PURE__ */ M.jsx(hh, {}),
        /* @__PURE__ */ M.jsx(Sh, {})
      ] }),
      /* @__PURE__ */ M.jsxs("div", { className: "right-container flex flex-col gap-1", children: [
        /* @__PURE__ */ M.jsx(ph, {}),
        /* @__PURE__ */ M.jsx(Ah, {})
      ] })
    ] })
  ] }) }) });
}
function zh(v = "root") {
  const g = document.getElementById(v);
  if (!g) {
    console.error(`Container with id "${v}" not found`);
    return;
  }
  const b = uh.createRoot(g);
  return b.render(
    /* @__PURE__ */ M.jsx(Ml.StrictMode, { children: /* @__PURE__ */ M.jsx(Oh, {}) })
  ), b;
}
typeof window < "u" && document.getElementById("root") && zh("root");
export {
  zh as initTemplatesAsAService
};
