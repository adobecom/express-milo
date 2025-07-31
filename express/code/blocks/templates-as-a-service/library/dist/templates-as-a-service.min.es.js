var ai = { exports: {} }, Se = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sd;
function Fv() {
  if (sd) return Se;
  sd = 1;
  var d = Symbol.for("react.transitional.element"), b = Symbol.for("react.fragment");
  function v(s, U, x) {
    var Q = null;
    if (x !== void 0 && (Q = "" + x), U.key !== void 0 && (Q = "" + U.key), "key" in U) {
      x = {};
      for (var F in U)
        F !== "key" && (x[F] = U[F]);
    } else x = U;
    return U = x.ref, {
      $$typeof: d,
      type: s,
      key: Q,
      ref: U !== void 0 ? U : null,
      props: x
    };
  }
  return Se.Fragment = b, Se.jsx = v, Se.jsxs = v, Se;
}
var od;
function Iv() {
  return od || (od = 1, ai.exports = Fv()), ai.exports;
}
var R = Iv(), ei = { exports: {} }, V = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rd;
function Pv() {
  if (rd) return V;
  rd = 1;
  var d = Symbol.for("react.transitional.element"), b = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), U = Symbol.for("react.profiler"), x = Symbol.for("react.consumer"), Q = Symbol.for("react.context"), F = Symbol.for("react.forward_ref"), M = Symbol.for("react.suspense"), O = Symbol.for("react.memo"), C = Symbol.for("react.lazy"), tl = Symbol.iterator;
  function $(o) {
    return o === null || typeof o != "object" ? null : (o = tl && o[tl] || o["@@iterator"], typeof o == "function" ? o : null);
  }
  var Ml = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, _l = Object.assign, Gl = {};
  function ql(o, z, N) {
    this.props = o, this.context = z, this.refs = Gl, this.updater = N || Ml;
  }
  ql.prototype.isReactComponent = {}, ql.prototype.setState = function(o, z) {
    if (typeof o != "object" && typeof o != "function" && o != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, o, z, "setState");
  }, ql.prototype.forceUpdate = function(o) {
    this.updater.enqueueForceUpdate(this, o, "forceUpdate");
  };
  function Xl() {
  }
  Xl.prototype = ql.prototype;
  function bt(o, z, N) {
    this.props = o, this.context = z, this.refs = Gl, this.updater = N || Ml;
  }
  var Al = bt.prototype = new Xl();
  Al.constructor = bt, _l(Al, ql.prototype), Al.isPureReactComponent = !0;
  var Ql = Array.isArray, k = { H: null, A: null, T: null, S: null, V: null }, wl = Object.prototype.hasOwnProperty;
  function $l(o, z, N, _, j, I) {
    return N = I.ref, {
      $$typeof: d,
      type: o,
      key: z,
      ref: N !== void 0 ? N : null,
      props: I
    };
  }
  function kl(o, z) {
    return $l(
      o.type,
      z,
      void 0,
      void 0,
      void 0,
      o.props
    );
  }
  function Tt(o) {
    return typeof o == "object" && o !== null && o.$$typeof === d;
  }
  function Cu(o) {
    var z = { "=": "=0", ":": "=2" };
    return "$" + o.replace(/[=:]/g, function(N) {
      return z[N];
    });
  }
  var Mt = /\/+/g;
  function xl(o, z) {
    return typeof o == "object" && o !== null && o.key != null ? Cu("" + o.key) : z.toString(36);
  }
  function hu() {
  }
  function yu(o) {
    switch (o.status) {
      case "fulfilled":
        return o.value;
      case "rejected":
        throw o.reason;
      default:
        switch (typeof o.status == "string" ? o.then(hu, hu) : (o.status = "pending", o.then(
          function(z) {
            o.status === "pending" && (o.status = "fulfilled", o.value = z);
          },
          function(z) {
            o.status === "pending" && (o.status = "rejected", o.reason = z);
          }
        )), o.status) {
          case "fulfilled":
            return o.value;
          case "rejected":
            throw o.reason;
        }
    }
    throw o;
  }
  function Hl(o, z, N, _, j) {
    var I = typeof o;
    (I === "undefined" || I === "boolean") && (o = null);
    var Z = !1;
    if (o === null) Z = !0;
    else
      switch (I) {
        case "bigint":
        case "string":
        case "number":
          Z = !0;
          break;
        case "object":
          switch (o.$$typeof) {
            case d:
            case b:
              Z = !0;
              break;
            case C:
              return Z = o._init, Hl(
                Z(o._payload),
                z,
                N,
                _,
                j
              );
          }
      }
    if (Z)
      return j = j(o), Z = _ === "" ? "." + xl(o, 0) : _, Ql(j) ? (N = "", Z != null && (N = Z.replace(Mt, "$&/") + "/"), Hl(j, z, N, "", function(Vt) {
        return Vt;
      })) : j != null && (Tt(j) && (j = kl(
        j,
        N + (j.key == null || o && o.key === j.key ? "" : ("" + j.key).replace(
          Mt,
          "$&/"
        ) + "/") + Z
      )), z.push(j)), 1;
    Z = 0;
    var Wl = _ === "" ? "." : _ + ":";
    if (Ql(o))
      for (var ol = 0; ol < o.length; ol++)
        _ = o[ol], I = Wl + xl(_, ol), Z += Hl(
          _,
          z,
          N,
          I,
          j
        );
    else if (ol = $(o), typeof ol == "function")
      for (o = ol.call(o), ol = 0; !(_ = o.next()).done; )
        _ = _.value, I = Wl + xl(_, ol++), Z += Hl(
          _,
          z,
          N,
          I,
          j
        );
    else if (I === "object") {
      if (typeof o.then == "function")
        return Hl(
          yu(o),
          z,
          N,
          _,
          j
        );
      throw z = String(o), Error(
        "Objects are not valid as a React child (found: " + (z === "[object Object]" ? "object with keys {" + Object.keys(o).join(", ") + "}" : z) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return Z;
  }
  function E(o, z, N) {
    if (o == null) return o;
    var _ = [], j = 0;
    return Hl(o, _, "", "", function(I) {
      return z.call(N, I, j++);
    }), _;
  }
  function D(o) {
    if (o._status === -1) {
      var z = o._result;
      z = z(), z.then(
        function(N) {
          (o._status === 0 || o._status === -1) && (o._status = 1, o._result = N);
        },
        function(N) {
          (o._status === 0 || o._status === -1) && (o._status = 2, o._result = N);
        }
      ), o._status === -1 && (o._status = 0, o._result = z);
    }
    if (o._status === 1) return o._result.default;
    throw o._result;
  }
  var G = typeof reportError == "function" ? reportError : function(o) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var z = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof o == "object" && o !== null && typeof o.message == "string" ? String(o.message) : String(o),
        error: o
      });
      if (!window.dispatchEvent(z)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", o);
      return;
    }
    console.error(o);
  };
  function fl() {
  }
  return V.Children = {
    map: E,
    forEach: function(o, z, N) {
      E(
        o,
        function() {
          z.apply(this, arguments);
        },
        N
      );
    },
    count: function(o) {
      var z = 0;
      return E(o, function() {
        z++;
      }), z;
    },
    toArray: function(o) {
      return E(o, function(z) {
        return z;
      }) || [];
    },
    only: function(o) {
      if (!Tt(o))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return o;
    }
  }, V.Component = ql, V.Fragment = v, V.Profiler = U, V.PureComponent = bt, V.StrictMode = s, V.Suspense = M, V.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = k, V.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(o) {
      return k.H.useMemoCache(o);
    }
  }, V.cache = function(o) {
    return function() {
      return o.apply(null, arguments);
    };
  }, V.cloneElement = function(o, z, N) {
    if (o == null)
      throw Error(
        "The argument must be a React element, but you passed " + o + "."
      );
    var _ = _l({}, o.props), j = o.key, I = void 0;
    if (z != null)
      for (Z in z.ref !== void 0 && (I = void 0), z.key !== void 0 && (j = "" + z.key), z)
        !wl.call(z, Z) || Z === "key" || Z === "__self" || Z === "__source" || Z === "ref" && z.ref === void 0 || (_[Z] = z[Z]);
    var Z = arguments.length - 2;
    if (Z === 1) _.children = N;
    else if (1 < Z) {
      for (var Wl = Array(Z), ol = 0; ol < Z; ol++)
        Wl[ol] = arguments[ol + 2];
      _.children = Wl;
    }
    return $l(o.type, j, void 0, void 0, I, _);
  }, V.createContext = function(o) {
    return o = {
      $$typeof: Q,
      _currentValue: o,
      _currentValue2: o,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, o.Provider = o, o.Consumer = {
      $$typeof: x,
      _context: o
    }, o;
  }, V.createElement = function(o, z, N) {
    var _, j = {}, I = null;
    if (z != null)
      for (_ in z.key !== void 0 && (I = "" + z.key), z)
        wl.call(z, _) && _ !== "key" && _ !== "__self" && _ !== "__source" && (j[_] = z[_]);
    var Z = arguments.length - 2;
    if (Z === 1) j.children = N;
    else if (1 < Z) {
      for (var Wl = Array(Z), ol = 0; ol < Z; ol++)
        Wl[ol] = arguments[ol + 2];
      j.children = Wl;
    }
    if (o && o.defaultProps)
      for (_ in Z = o.defaultProps, Z)
        j[_] === void 0 && (j[_] = Z[_]);
    return $l(o, I, void 0, void 0, null, j);
  }, V.createRef = function() {
    return { current: null };
  }, V.forwardRef = function(o) {
    return { $$typeof: F, render: o };
  }, V.isValidElement = Tt, V.lazy = function(o) {
    return {
      $$typeof: C,
      _payload: { _status: -1, _result: o },
      _init: D
    };
  }, V.memo = function(o, z) {
    return {
      $$typeof: O,
      type: o,
      compare: z === void 0 ? null : z
    };
  }, V.startTransition = function(o) {
    var z = k.T, N = {};
    k.T = N;
    try {
      var _ = o(), j = k.S;
      j !== null && j(N, _), typeof _ == "object" && _ !== null && typeof _.then == "function" && _.then(fl, G);
    } catch (I) {
      G(I);
    } finally {
      k.T = z;
    }
  }, V.unstable_useCacheRefresh = function() {
    return k.H.useCacheRefresh();
  }, V.use = function(o) {
    return k.H.use(o);
  }, V.useActionState = function(o, z, N) {
    return k.H.useActionState(o, z, N);
  }, V.useCallback = function(o, z) {
    return k.H.useCallback(o, z);
  }, V.useContext = function(o) {
    return k.H.useContext(o);
  }, V.useDebugValue = function() {
  }, V.useDeferredValue = function(o, z) {
    return k.H.useDeferredValue(o, z);
  }, V.useEffect = function(o, z, N) {
    var _ = k.H;
    if (typeof N == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return _.useEffect(o, z);
  }, V.useId = function() {
    return k.H.useId();
  }, V.useImperativeHandle = function(o, z, N) {
    return k.H.useImperativeHandle(o, z, N);
  }, V.useInsertionEffect = function(o, z) {
    return k.H.useInsertionEffect(o, z);
  }, V.useLayoutEffect = function(o, z) {
    return k.H.useLayoutEffect(o, z);
  }, V.useMemo = function(o, z) {
    return k.H.useMemo(o, z);
  }, V.useOptimistic = function(o, z) {
    return k.H.useOptimistic(o, z);
  }, V.useReducer = function(o, z, N) {
    return k.H.useReducer(o, z, N);
  }, V.useRef = function(o) {
    return k.H.useRef(o);
  }, V.useState = function(o) {
    return k.H.useState(o);
  }, V.useSyncExternalStore = function(o, z, N) {
    return k.H.useSyncExternalStore(
      o,
      z,
      N
    );
  }, V.useTransition = function() {
    return k.H.useTransition();
  }, V.version = "19.1.0", V;
}
var dd;
function ri() {
  return dd || (dd = 1, ei.exports = Pv()), ei.exports;
}
var El = ri(), ni = { exports: {} }, be = {}, ci = { exports: {} }, fi = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vd;
function lh() {
  return vd || (vd = 1, function(d) {
    function b(E, D) {
      var G = E.length;
      E.push(D);
      l: for (; 0 < G; ) {
        var fl = G - 1 >>> 1, o = E[fl];
        if (0 < U(o, D))
          E[fl] = D, E[G] = o, G = fl;
        else break l;
      }
    }
    function v(E) {
      return E.length === 0 ? null : E[0];
    }
    function s(E) {
      if (E.length === 0) return null;
      var D = E[0], G = E.pop();
      if (G !== D) {
        E[0] = G;
        l: for (var fl = 0, o = E.length, z = o >>> 1; fl < z; ) {
          var N = 2 * (fl + 1) - 1, _ = E[N], j = N + 1, I = E[j];
          if (0 > U(_, G))
            j < o && 0 > U(I, _) ? (E[fl] = I, E[j] = G, fl = j) : (E[fl] = _, E[N] = G, fl = N);
          else if (j < o && 0 > U(I, G))
            E[fl] = I, E[j] = G, fl = j;
          else break l;
        }
      }
      return D;
    }
    function U(E, D) {
      var G = E.sortIndex - D.sortIndex;
      return G !== 0 ? G : E.id - D.id;
    }
    if (d.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var x = performance;
      d.unstable_now = function() {
        return x.now();
      };
    } else {
      var Q = Date, F = Q.now();
      d.unstable_now = function() {
        return Q.now() - F;
      };
    }
    var M = [], O = [], C = 1, tl = null, $ = 3, Ml = !1, _l = !1, Gl = !1, ql = !1, Xl = typeof setTimeout == "function" ? setTimeout : null, bt = typeof clearTimeout == "function" ? clearTimeout : null, Al = typeof setImmediate < "u" ? setImmediate : null;
    function Ql(E) {
      for (var D = v(O); D !== null; ) {
        if (D.callback === null) s(O);
        else if (D.startTime <= E)
          s(O), D.sortIndex = D.expirationTime, b(M, D);
        else break;
        D = v(O);
      }
    }
    function k(E) {
      if (Gl = !1, Ql(E), !_l)
        if (v(M) !== null)
          _l = !0, wl || (wl = !0, xl());
        else {
          var D = v(O);
          D !== null && Hl(k, D.startTime - E);
        }
    }
    var wl = !1, $l = -1, kl = 5, Tt = -1;
    function Cu() {
      return ql ? !0 : !(d.unstable_now() - Tt < kl);
    }
    function Mt() {
      if (ql = !1, wl) {
        var E = d.unstable_now();
        Tt = E;
        var D = !0;
        try {
          l: {
            _l = !1, Gl && (Gl = !1, bt($l), $l = -1), Ml = !0;
            var G = $;
            try {
              t: {
                for (Ql(E), tl = v(M); tl !== null && !(tl.expirationTime > E && Cu()); ) {
                  var fl = tl.callback;
                  if (typeof fl == "function") {
                    tl.callback = null, $ = tl.priorityLevel;
                    var o = fl(
                      tl.expirationTime <= E
                    );
                    if (E = d.unstable_now(), typeof o == "function") {
                      tl.callback = o, Ql(E), D = !0;
                      break t;
                    }
                    tl === v(M) && s(M), Ql(E);
                  } else s(M);
                  tl = v(M);
                }
                if (tl !== null) D = !0;
                else {
                  var z = v(O);
                  z !== null && Hl(
                    k,
                    z.startTime - E
                  ), D = !1;
                }
              }
              break l;
            } finally {
              tl = null, $ = G, Ml = !1;
            }
            D = void 0;
          }
        } finally {
          D ? xl() : wl = !1;
        }
      }
    }
    var xl;
    if (typeof Al == "function")
      xl = function() {
        Al(Mt);
      };
    else if (typeof MessageChannel < "u") {
      var hu = new MessageChannel(), yu = hu.port2;
      hu.port1.onmessage = Mt, xl = function() {
        yu.postMessage(null);
      };
    } else
      xl = function() {
        Xl(Mt, 0);
      };
    function Hl(E, D) {
      $l = Xl(function() {
        E(d.unstable_now());
      }, D);
    }
    d.unstable_IdlePriority = 5, d.unstable_ImmediatePriority = 1, d.unstable_LowPriority = 4, d.unstable_NormalPriority = 3, d.unstable_Profiling = null, d.unstable_UserBlockingPriority = 2, d.unstable_cancelCallback = function(E) {
      E.callback = null;
    }, d.unstable_forceFrameRate = function(E) {
      0 > E || 125 < E ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : kl = 0 < E ? Math.floor(1e3 / E) : 5;
    }, d.unstable_getCurrentPriorityLevel = function() {
      return $;
    }, d.unstable_next = function(E) {
      switch ($) {
        case 1:
        case 2:
        case 3:
          var D = 3;
          break;
        default:
          D = $;
      }
      var G = $;
      $ = D;
      try {
        return E();
      } finally {
        $ = G;
      }
    }, d.unstable_requestPaint = function() {
      ql = !0;
    }, d.unstable_runWithPriority = function(E, D) {
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
        return D();
      } finally {
        $ = G;
      }
    }, d.unstable_scheduleCallback = function(E, D, G) {
      var fl = d.unstable_now();
      switch (typeof G == "object" && G !== null ? (G = G.delay, G = typeof G == "number" && 0 < G ? fl + G : fl) : G = fl, E) {
        case 1:
          var o = -1;
          break;
        case 2:
          o = 250;
          break;
        case 5:
          o = 1073741823;
          break;
        case 4:
          o = 1e4;
          break;
        default:
          o = 5e3;
      }
      return o = G + o, E = {
        id: C++,
        callback: D,
        priorityLevel: E,
        startTime: G,
        expirationTime: o,
        sortIndex: -1
      }, G > fl ? (E.sortIndex = G, b(O, E), v(M) === null && E === v(O) && (Gl ? (bt($l), $l = -1) : Gl = !0, Hl(k, G - fl))) : (E.sortIndex = o, b(M, E), _l || Ml || (_l = !0, wl || (wl = !0, xl()))), E;
    }, d.unstable_shouldYield = Cu, d.unstable_wrapCallback = function(E) {
      var D = $;
      return function() {
        var G = $;
        $ = D;
        try {
          return E.apply(this, arguments);
        } finally {
          $ = G;
        }
      };
    };
  }(fi)), fi;
}
var hd;
function th() {
  return hd || (hd = 1, ci.exports = lh()), ci.exports;
}
var ii = { exports: {} }, jl = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yd;
function uh() {
  if (yd) return jl;
  yd = 1;
  var d = ri();
  function b(M) {
    var O = "https://react.dev/errors/" + M;
    if (1 < arguments.length) {
      O += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var C = 2; C < arguments.length; C++)
        O += "&args[]=" + encodeURIComponent(arguments[C]);
    }
    return "Minified React error #" + M + "; visit " + O + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function v() {
  }
  var s = {
    d: {
      f: v,
      r: function() {
        throw Error(b(522));
      },
      D: v,
      C: v,
      L: v,
      m: v,
      X: v,
      S: v,
      M: v
    },
    p: 0,
    findDOMNode: null
  }, U = Symbol.for("react.portal");
  function x(M, O, C) {
    var tl = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: U,
      key: tl == null ? null : "" + tl,
      children: M,
      containerInfo: O,
      implementation: C
    };
  }
  var Q = d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function F(M, O) {
    if (M === "font") return "";
    if (typeof O == "string")
      return O === "use-credentials" ? O : "";
  }
  return jl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = s, jl.createPortal = function(M, O) {
    var C = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!O || O.nodeType !== 1 && O.nodeType !== 9 && O.nodeType !== 11)
      throw Error(b(299));
    return x(M, O, null, C);
  }, jl.flushSync = function(M) {
    var O = Q.T, C = s.p;
    try {
      if (Q.T = null, s.p = 2, M) return M();
    } finally {
      Q.T = O, s.p = C, s.d.f();
    }
  }, jl.preconnect = function(M, O) {
    typeof M == "string" && (O ? (O = O.crossOrigin, O = typeof O == "string" ? O === "use-credentials" ? O : "" : void 0) : O = null, s.d.C(M, O));
  }, jl.prefetchDNS = function(M) {
    typeof M == "string" && s.d.D(M);
  }, jl.preinit = function(M, O) {
    if (typeof M == "string" && O && typeof O.as == "string") {
      var C = O.as, tl = F(C, O.crossOrigin), $ = typeof O.integrity == "string" ? O.integrity : void 0, Ml = typeof O.fetchPriority == "string" ? O.fetchPriority : void 0;
      C === "style" ? s.d.S(
        M,
        typeof O.precedence == "string" ? O.precedence : void 0,
        {
          crossOrigin: tl,
          integrity: $,
          fetchPriority: Ml
        }
      ) : C === "script" && s.d.X(M, {
        crossOrigin: tl,
        integrity: $,
        fetchPriority: Ml,
        nonce: typeof O.nonce == "string" ? O.nonce : void 0
      });
    }
  }, jl.preinitModule = function(M, O) {
    if (typeof M == "string")
      if (typeof O == "object" && O !== null) {
        if (O.as == null || O.as === "script") {
          var C = F(
            O.as,
            O.crossOrigin
          );
          s.d.M(M, {
            crossOrigin: C,
            integrity: typeof O.integrity == "string" ? O.integrity : void 0,
            nonce: typeof O.nonce == "string" ? O.nonce : void 0
          });
        }
      } else O == null && s.d.M(M);
  }, jl.preload = function(M, O) {
    if (typeof M == "string" && typeof O == "object" && O !== null && typeof O.as == "string") {
      var C = O.as, tl = F(C, O.crossOrigin);
      s.d.L(M, C, {
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
  }, jl.preloadModule = function(M, O) {
    if (typeof M == "string")
      if (O) {
        var C = F(O.as, O.crossOrigin);
        s.d.m(M, {
          as: typeof O.as == "string" && O.as !== "script" ? O.as : void 0,
          crossOrigin: C,
          integrity: typeof O.integrity == "string" ? O.integrity : void 0
        });
      } else s.d.m(M);
  }, jl.requestFormReset = function(M) {
    s.d.r(M);
  }, jl.unstable_batchedUpdates = function(M, O) {
    return M(O);
  }, jl.useFormState = function(M, O, C) {
    return Q.H.useFormState(M, O, C);
  }, jl.useFormStatus = function() {
    return Q.H.useHostTransitionStatus();
  }, jl.version = "19.1.0", jl;
}
var md;
function ah() {
  if (md) return ii.exports;
  md = 1;
  function d() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(d);
      } catch (b) {
        console.error(b);
      }
  }
  return d(), ii.exports = uh(), ii.exports;
}
var gd;
function eh() {
  if (gd) return be;
  gd = 1;
  /**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var d = th(), b = ri(), v = ah();
  function s(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var u = 2; u < arguments.length; u++)
        t += "&args[]=" + encodeURIComponent(arguments[u]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function U(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function x(l) {
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
  function Q(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function F(l) {
    if (x(l) !== l)
      throw Error(s(188));
  }
  function M(l) {
    var t = l.alternate;
    if (!t) {
      if (t = x(l), t === null) throw Error(s(188));
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
          if (n === u) return F(e), l;
          if (n === a) return F(e), t;
          n = n.sibling;
        }
        throw Error(s(188));
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
          if (!c) throw Error(s(189));
        }
      }
      if (u.alternate !== a) throw Error(s(190));
    }
    if (u.tag !== 3) throw Error(s(188));
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
  var C = Object.assign, tl = Symbol.for("react.element"), $ = Symbol.for("react.transitional.element"), Ml = Symbol.for("react.portal"), _l = Symbol.for("react.fragment"), Gl = Symbol.for("react.strict_mode"), ql = Symbol.for("react.profiler"), Xl = Symbol.for("react.provider"), bt = Symbol.for("react.consumer"), Al = Symbol.for("react.context"), Ql = Symbol.for("react.forward_ref"), k = Symbol.for("react.suspense"), wl = Symbol.for("react.suspense_list"), $l = Symbol.for("react.memo"), kl = Symbol.for("react.lazy"), Tt = Symbol.for("react.activity"), Cu = Symbol.for("react.memo_cache_sentinel"), Mt = Symbol.iterator;
  function xl(l) {
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
      case ql:
        return "Profiler";
      case Gl:
        return "StrictMode";
      case k:
        return "Suspense";
      case wl:
        return "SuspenseList";
      case Tt:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case Ml:
          return "Portal";
        case Al:
          return (l.displayName || "Context") + ".Provider";
        case bt:
          return (l._context.displayName || "Context") + ".Consumer";
        case Ql:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case $l:
          return t = l.displayName || null, t !== null ? t : yu(l.type) || "Memo";
        case kl:
          t = l._payload, l = l._init;
          try {
            return yu(l(t));
          } catch {
          }
      }
    return null;
  }
  var Hl = Array.isArray, E = b.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, D = v.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, G = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, fl = [], o = -1;
  function z(l) {
    return { current: l };
  }
  function N(l) {
    0 > o || (l.current = fl[o], fl[o] = null, o--);
  }
  function _(l, t) {
    o++, fl[o] = l.current, l.current = t;
  }
  var j = z(null), I = z(null), Z = z(null), Wl = z(null);
  function ol(l, t) {
    switch (_(Z, t), _(I, l), _(j, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? qr(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = qr(t), l = Yr(t, l);
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
    N(j), _(j, l);
  }
  function Vt() {
    N(j), N(I), N(Z);
  }
  function Qn(l) {
    l.memoizedState !== null && _(Wl, l);
    var t = j.current, u = Yr(t, l.type);
    t !== u && (_(I, l), _(j, u));
  }
  function Ae(l) {
    I.current === l && (N(j), N(I)), Wl.current === l && (N(Wl), ve._currentValue = G);
  }
  var Zn = Object.prototype.hasOwnProperty, Vn = d.unstable_scheduleCallback, Ln = d.unstable_cancelCallback, Dd = d.unstable_shouldYield, Ud = d.unstable_requestPaint, Et = d.unstable_now, Nd = d.unstable_getCurrentPriorityLevel, mi = d.unstable_ImmediatePriority, gi = d.unstable_UserBlockingPriority, pe = d.unstable_NormalPriority, xd = d.unstable_LowPriority, Si = d.unstable_IdlePriority, Hd = d.log, Cd = d.unstable_setDisableYieldValue, Ea = null, Fl = null;
  function Lt(l) {
    if (typeof Hd == "function" && Cd(l), Fl && typeof Fl.setStrictMode == "function")
      try {
        Fl.setStrictMode(Ea, l);
      } catch {
      }
  }
  var Il = Math.clz32 ? Math.clz32 : qd, Bd = Math.log, jd = Math.LN2;
  function qd(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (Bd(l) / jd | 0) | 0;
  }
  var Oe = 256, Re = 4194304;
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
  function Yd(l, t) {
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
  function bi() {
    var l = Oe;
    return Oe <<= 1, (Oe & 4194048) === 0 && (Oe = 256), l;
  }
  function Ti() {
    var l = Re;
    return Re <<= 1, (Re & 62914560) === 0 && (Re = 4194304), l;
  }
  function Kn(l) {
    for (var t = [], u = 0; 31 > u; u++) t.push(l);
    return t;
  }
  function pa(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function Gd(l, t, u, a, e, n) {
    var c = l.pendingLanes;
    l.pendingLanes = u, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= u, l.entangledLanes &= u, l.errorRecoveryDisabledLanes &= u, l.shellSuspendCounter = 0;
    var f = l.entanglements, i = l.expirationTimes, m = l.hiddenUpdates;
    for (u = c & ~u; 0 < u; ) {
      var T = 31 - Il(u), p = 1 << T;
      f[T] = 0, i[T] = -1;
      var g = m[T];
      if (g !== null)
        for (m[T] = null, T = 0; T < g.length; T++) {
          var S = g[T];
          S !== null && (S.lane &= -536870913);
        }
      u &= ~p;
    }
    a !== 0 && Ei(l, a, 0), n !== 0 && e === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(c & ~t));
  }
  function Ei(l, t, u) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var a = 31 - Il(t);
    l.entangledLanes |= t, l.entanglements[a] = l.entanglements[a] | 1073741824 | u & 4194090;
  }
  function Ai(l, t) {
    var u = l.entangledLanes |= t;
    for (l = l.entanglements; u; ) {
      var a = 31 - Il(u), e = 1 << a;
      e & t | l[a] & t && (l[a] |= t), u &= ~e;
    }
  }
  function Jn(l) {
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
  function wn(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function pi() {
    var l = D.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : ad(l.type));
  }
  function Xd(l, t) {
    var u = D.p;
    try {
      return D.p = l, t();
    } finally {
      D.p = u;
    }
  }
  var Kt = Math.random().toString(36).slice(2), Cl = "__reactFiber$" + Kt, Zl = "__reactProps$" + Kt, Bu = "__reactContainer$" + Kt, $n = "__reactEvents$" + Kt, Qd = "__reactListeners$" + Kt, Zd = "__reactHandles$" + Kt, Oi = "__reactResources$" + Kt, Oa = "__reactMarker$" + Kt;
  function kn(l) {
    delete l[Cl], delete l[Zl], delete l[$n], delete l[Qd], delete l[Zd];
  }
  function ju(l) {
    var t = l[Cl];
    if (t) return t;
    for (var u = l.parentNode; u; ) {
      if (t = u[Bu] || u[Cl]) {
        if (u = t.alternate, t.child !== null || u !== null && u.child !== null)
          for (l = Zr(l); l !== null; ) {
            if (u = l[Cl]) return u;
            l = Zr(l);
          }
        return t;
      }
      l = u, u = l.parentNode;
    }
    return null;
  }
  function qu(l) {
    if (l = l[Cl] || l[Bu]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function Ra(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(s(33));
  }
  function Yu(l) {
    var t = l[Oi];
    return t || (t = l[Oi] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function pl(l) {
    l[Oa] = !0;
  }
  var Ri = /* @__PURE__ */ new Set(), zi = {};
  function gu(l, t) {
    Gu(l, t), Gu(l + "Capture", t);
  }
  function Gu(l, t) {
    for (zi[l] = t, l = 0; l < t.length; l++)
      Ri.add(t[l]);
  }
  var Vd = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Mi = {}, _i = {};
  function Ld(l) {
    return Zn.call(_i, l) ? !0 : Zn.call(Mi, l) ? !1 : Vd.test(l) ? _i[l] = !0 : (Mi[l] = !0, !1);
  }
  function Me(l, t, u) {
    if (Ld(t))
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
  function _e(l, t, u) {
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
  function _t(l, t, u, a) {
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
  var Wn, Di;
  function Xu(l) {
    if (Wn === void 0)
      try {
        throw Error();
      } catch (u) {
        var t = u.stack.trim().match(/\n( *(at )?)/);
        Wn = t && t[1] || "", Di = -1 < u.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < u.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Wn + l + Di;
  }
  var Fn = !1;
  function In(l, t) {
    if (!l || Fn) return "";
    Fn = !0;
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
                  var g = S;
                }
                Reflect.construct(l, [], p);
              } else {
                try {
                  p.call();
                } catch (S) {
                  g = S;
                }
                l.call(p.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (S) {
                g = S;
              }
              (p = l()) && typeof p.catch == "function" && p.catch(function() {
              });
            }
          } catch (S) {
            if (S && g && typeof S.stack == "string")
              return [S.stack, g.stack];
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
`), m = f.split(`
`);
        for (e = a = 0; a < i.length && !i[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; e < m.length && !m[e].includes(
          "DetermineComponentFrameRoot"
        ); )
          e++;
        if (a === i.length || e === m.length)
          for (a = i.length - 1, e = m.length - 1; 1 <= a && 0 <= e && i[a] !== m[e]; )
            e--;
        for (; 1 <= a && 0 <= e; a--, e--)
          if (i[a] !== m[e]) {
            if (a !== 1 || e !== 1)
              do
                if (a--, e--, 0 > e || i[a] !== m[e]) {
                  var T = `
` + i[a].replace(" at new ", " at ");
                  return l.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", l.displayName)), T;
                }
              while (1 <= a && 0 <= e);
            break;
          }
      }
    } finally {
      Fn = !1, Error.prepareStackTrace = u;
    }
    return (u = l ? l.displayName || l.name : "") ? Xu(u) : "";
  }
  function Kd(l) {
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
        return In(l.type, !1);
      case 11:
        return In(l.type.render, !1);
      case 1:
        return In(l.type, !0);
      case 31:
        return Xu("Activity");
      default:
        return "";
    }
  }
  function Ui(l) {
    try {
      var t = "";
      do
        t += Kd(l), l = l.return;
      while (l);
      return t;
    } catch (u) {
      return `
Error generating stack: ` + u.message + `
` + u.stack;
    }
  }
  function ct(l) {
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
  function Ni(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Jd(l) {
    var t = Ni(l) ? "checked" : "value", u = Object.getOwnPropertyDescriptor(
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
  function De(l) {
    l._valueTracker || (l._valueTracker = Jd(l));
  }
  function xi(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var u = t.getValue(), a = "";
    return l && (a = Ni(l) ? l.checked ? "true" : "false" : l.value), l = a, l !== u ? (t.setValue(l), !0) : !1;
  }
  function Ue(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var wd = /[\n"\\]/g;
  function ft(l) {
    return l.replace(
      wd,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Pn(l, t, u, a, e, n, c, f) {
    l.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? l.type = c : l.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + ct(t)) : l.value !== "" + ct(t) && (l.value = "" + ct(t)) : c !== "submit" && c !== "reset" || l.removeAttribute("value"), t != null ? lc(l, c, ct(t)) : u != null ? lc(l, c, ct(u)) : a != null && l.removeAttribute("value"), e == null && n != null && (l.defaultChecked = !!n), e != null && (l.checked = e && typeof e != "function" && typeof e != "symbol"), f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? l.name = "" + ct(f) : l.removeAttribute("name");
  }
  function Hi(l, t, u, a, e, n, c, f) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || u != null) {
      if (!(n !== "submit" && n !== "reset" || t != null))
        return;
      u = u != null ? "" + ct(u) : "", t = t != null ? "" + ct(t) : u, f || t === l.value || (l.value = t), l.defaultValue = t;
    }
    a = a ?? e, a = typeof a != "function" && typeof a != "symbol" && !!a, l.checked = f ? l.checked : !!a, l.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (l.name = c);
  }
  function lc(l, t, u) {
    t === "number" && Ue(l.ownerDocument) === l || l.defaultValue === "" + u || (l.defaultValue = "" + u);
  }
  function Qu(l, t, u, a) {
    if (l = l.options, t) {
      t = {};
      for (var e = 0; e < u.length; e++)
        t["$" + u[e]] = !0;
      for (u = 0; u < l.length; u++)
        e = t.hasOwnProperty("$" + l[u].value), l[u].selected !== e && (l[u].selected = e), e && a && (l[u].defaultSelected = !0);
    } else {
      for (u = "" + ct(u), t = null, e = 0; e < l.length; e++) {
        if (l[e].value === u) {
          l[e].selected = !0, a && (l[e].defaultSelected = !0);
          return;
        }
        t !== null || l[e].disabled || (t = l[e]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Ci(l, t, u) {
    if (t != null && (t = "" + ct(t), t !== l.value && (l.value = t), u == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = u != null ? "" + ct(u) : "";
  }
  function Bi(l, t, u, a) {
    if (t == null) {
      if (a != null) {
        if (u != null) throw Error(s(92));
        if (Hl(a)) {
          if (1 < a.length) throw Error(s(93));
          a = a[0];
        }
        u = a;
      }
      u == null && (u = ""), t = u;
    }
    u = ct(t), l.defaultValue = u, a = l.textContent, a === u && a !== "" && a !== null && (l.value = a);
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
  var $d = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function ji(l, t, u) {
    var a = t.indexOf("--") === 0;
    u == null || typeof u == "boolean" || u === "" ? a ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : a ? l.setProperty(t, u) : typeof u != "number" || u === 0 || $d.has(t) ? t === "float" ? l.cssFloat = u : l[t] = ("" + u).trim() : l[t] = u + "px";
  }
  function qi(l, t, u) {
    if (t != null && typeof t != "object")
      throw Error(s(62));
    if (l = l.style, u != null) {
      for (var a in u)
        !u.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? l.setProperty(a, "") : a === "float" ? l.cssFloat = "" : l[a] = "");
      for (var e in t)
        a = t[e], t.hasOwnProperty(e) && u[e] !== a && ji(l, e, a);
    } else
      for (var n in t)
        t.hasOwnProperty(n) && ji(l, n, t[n]);
  }
  function tc(l) {
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
  var kd = /* @__PURE__ */ new Map([
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
  ]), Wd = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ne(l) {
    return Wd.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  var uc = null;
  function ac(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var Vu = null, Lu = null;
  function Yi(l) {
    var t = qu(l);
    if (t && (l = t.stateNode)) {
      var u = l[Zl] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if (Pn(
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
              'input[name="' + ft(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < u.length; t++) {
              var a = u[t];
              if (a !== l && a.form === l.form) {
                var e = a[Zl] || null;
                if (!e) throw Error(s(90));
                Pn(
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
              a = u[t], a.form === l.form && xi(a);
          }
          break l;
        case "textarea":
          Ci(l, u.value, u.defaultValue);
          break l;
        case "select":
          t = u.value, t != null && Qu(l, !!u.multiple, t, !1);
      }
    }
  }
  var ec = !1;
  function Gi(l, t, u) {
    if (ec) return l(t, u);
    ec = !0;
    try {
      var a = l(t);
      return a;
    } finally {
      if (ec = !1, (Vu !== null || Lu !== null) && (gn(), Vu && (t = Vu, l = Lu, Lu = Vu = null, Yi(t), l)))
        for (t = 0; t < l.length; t++) Yi(l[t]);
    }
  }
  function za(l, t) {
    var u = l.stateNode;
    if (u === null) return null;
    var a = u[Zl] || null;
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
        s(231, t, typeof u)
      );
    return u;
  }
  var Dt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), nc = !1;
  if (Dt)
    try {
      var Ma = {};
      Object.defineProperty(Ma, "passive", {
        get: function() {
          nc = !0;
        }
      }), window.addEventListener("test", Ma, Ma), window.removeEventListener("test", Ma, Ma);
    } catch {
      nc = !1;
    }
  var Jt = null, cc = null, xe = null;
  function Xi() {
    if (xe) return xe;
    var l, t = cc, u = t.length, a, e = "value" in Jt ? Jt.value : Jt.textContent, n = e.length;
    for (l = 0; l < u && t[l] === e[l]; l++) ;
    var c = u - l;
    for (a = 1; a <= c && t[u - a] === e[n - a]; a++) ;
    return xe = e.slice(l, 1 < a ? 1 - a : void 0);
  }
  function He(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function Ce() {
    return !0;
  }
  function Qi() {
    return !1;
  }
  function Vl(l) {
    function t(u, a, e, n, c) {
      this._reactName = u, this._targetInst = e, this.type = a, this.nativeEvent = n, this.target = c, this.currentTarget = null;
      for (var f in l)
        l.hasOwnProperty(f) && (u = l[f], this[f] = u ? u(n) : n[f]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Ce : Qi, this.isPropagationStopped = Qi, this;
    }
    return C(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var u = this.nativeEvent;
        u && (u.preventDefault ? u.preventDefault() : typeof u.returnValue != "unknown" && (u.returnValue = !1), this.isDefaultPrevented = Ce);
      },
      stopPropagation: function() {
        var u = this.nativeEvent;
        u && (u.stopPropagation ? u.stopPropagation() : typeof u.cancelBubble != "unknown" && (u.cancelBubble = !0), this.isPropagationStopped = Ce);
      },
      persist: function() {
      },
      isPersistent: Ce
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
  }, Be = Vl(Su), _a = C({}, Su, { view: 0, detail: 0 }), Fd = Vl(_a), fc, ic, Da, je = C({}, _a, {
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
    getModifierState: oc,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== Da && (Da && l.type === "mousemove" ? (fc = l.screenX - Da.screenX, ic = l.screenY - Da.screenY) : ic = fc = 0, Da = l), fc);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : ic;
    }
  }), Zi = Vl(je), Id = C({}, je, { dataTransfer: 0 }), Pd = Vl(Id), l0 = C({}, _a, { relatedTarget: 0 }), sc = Vl(l0), t0 = C({}, Su, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), u0 = Vl(t0), a0 = C({}, Su, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), e0 = Vl(a0), n0 = C({}, Su, { data: 0 }), Vi = Vl(n0), c0 = {
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
  }, f0 = {
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
  }, i0 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function s0(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = i0[l]) ? !!t[l] : !1;
  }
  function oc() {
    return s0;
  }
  var o0 = C({}, _a, {
    key: function(l) {
      if (l.key) {
        var t = c0[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = He(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? f0[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: oc,
    charCode: function(l) {
      return l.type === "keypress" ? He(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? He(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), r0 = Vl(o0), d0 = C({}, je, {
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
  }), Li = Vl(d0), v0 = C({}, _a, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: oc
  }), h0 = Vl(v0), y0 = C({}, Su, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), m0 = Vl(y0), g0 = C({}, je, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), S0 = Vl(g0), b0 = C({}, Su, {
    newState: 0,
    oldState: 0
  }), T0 = Vl(b0), E0 = [9, 13, 27, 32], rc = Dt && "CompositionEvent" in window, Ua = null;
  Dt && "documentMode" in document && (Ua = document.documentMode);
  var A0 = Dt && "TextEvent" in window && !Ua, Ki = Dt && (!rc || Ua && 8 < Ua && 11 >= Ua), Ji = " ", wi = !1;
  function $i(l, t) {
    switch (l) {
      case "keyup":
        return E0.indexOf(t.keyCode) !== -1;
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
  function ki(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var Ku = !1;
  function p0(l, t) {
    switch (l) {
      case "compositionend":
        return ki(t);
      case "keypress":
        return t.which !== 32 ? null : (wi = !0, Ji);
      case "textInput":
        return l = t.data, l === Ji && wi ? null : l;
      default:
        return null;
    }
  }
  function O0(l, t) {
    if (Ku)
      return l === "compositionend" || !rc && $i(l, t) ? (l = Xi(), xe = cc = Jt = null, Ku = !1, l) : null;
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
        return Ki && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var R0 = {
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
  function Wi(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!R0[l.type] : t === "textarea";
  }
  function Fi(l, t, u, a) {
    Vu ? Lu ? Lu.push(a) : Lu = [a] : Vu = a, t = pn(t, "onChange"), 0 < t.length && (u = new Be(
      "onChange",
      "change",
      null,
      u,
      a
    ), l.push({ event: u, listeners: t }));
  }
  var Na = null, xa = null;
  function z0(l) {
    xr(l, 0);
  }
  function qe(l) {
    var t = Ra(l);
    if (xi(t)) return l;
  }
  function Ii(l, t) {
    if (l === "change") return t;
  }
  var Pi = !1;
  if (Dt) {
    var dc;
    if (Dt) {
      var vc = "oninput" in document;
      if (!vc) {
        var ls = document.createElement("div");
        ls.setAttribute("oninput", "return;"), vc = typeof ls.oninput == "function";
      }
      dc = vc;
    } else dc = !1;
    Pi = dc && (!document.documentMode || 9 < document.documentMode);
  }
  function ts() {
    Na && (Na.detachEvent("onpropertychange", us), xa = Na = null);
  }
  function us(l) {
    if (l.propertyName === "value" && qe(xa)) {
      var t = [];
      Fi(
        t,
        xa,
        l,
        ac(l)
      ), Gi(z0, t);
    }
  }
  function M0(l, t, u) {
    l === "focusin" ? (ts(), Na = t, xa = u, Na.attachEvent("onpropertychange", us)) : l === "focusout" && ts();
  }
  function _0(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return qe(xa);
  }
  function D0(l, t) {
    if (l === "click") return qe(t);
  }
  function U0(l, t) {
    if (l === "input" || l === "change")
      return qe(t);
  }
  function N0(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var Pl = typeof Object.is == "function" ? Object.is : N0;
  function Ha(l, t) {
    if (Pl(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var u = Object.keys(l), a = Object.keys(t);
    if (u.length !== a.length) return !1;
    for (a = 0; a < u.length; a++) {
      var e = u[a];
      if (!Zn.call(t, e) || !Pl(l[e], t[e]))
        return !1;
    }
    return !0;
  }
  function as(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function es(l, t) {
    var u = as(l);
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
      u = as(u);
    }
  }
  function ns(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ns(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function cs(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = Ue(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var u = typeof t.contentWindow.location.href == "string";
      } catch {
        u = !1;
      }
      if (u) l = t.contentWindow;
      else break;
      t = Ue(l.document);
    }
    return t;
  }
  function hc(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var x0 = Dt && "documentMode" in document && 11 >= document.documentMode, Ju = null, yc = null, Ca = null, mc = !1;
  function fs(l, t, u) {
    var a = u.window === u ? u.document : u.nodeType === 9 ? u : u.ownerDocument;
    mc || Ju == null || Ju !== Ue(a) || (a = Ju, "selectionStart" in a && hc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Ca && Ha(Ca, a) || (Ca = a, a = pn(yc, "onSelect"), 0 < a.length && (t = new Be(
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
  }, gc = {}, is = {};
  Dt && (is = document.createElement("div").style, "AnimationEvent" in window || (delete wu.animationend.animation, delete wu.animationiteration.animation, delete wu.animationstart.animation), "TransitionEvent" in window || delete wu.transitionend.transition);
  function Tu(l) {
    if (gc[l]) return gc[l];
    if (!wu[l]) return l;
    var t = wu[l], u;
    for (u in t)
      if (t.hasOwnProperty(u) && u in is)
        return gc[l] = t[u];
    return l;
  }
  var ss = Tu("animationend"), os = Tu("animationiteration"), rs = Tu("animationstart"), H0 = Tu("transitionrun"), C0 = Tu("transitionstart"), B0 = Tu("transitioncancel"), ds = Tu("transitionend"), vs = /* @__PURE__ */ new Map(), Sc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Sc.push("scrollEnd");
  function mt(l, t) {
    vs.set(l, t), gu(t, [l]);
  }
  var hs = /* @__PURE__ */ new WeakMap();
  function it(l, t) {
    if (typeof l == "object" && l !== null) {
      var u = hs.get(l);
      return u !== void 0 ? u : (t = {
        value: l,
        source: t,
        stack: Ui(t)
      }, hs.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: Ui(t)
    };
  }
  var st = [], $u = 0, bc = 0;
  function Ye() {
    for (var l = $u, t = bc = $u = 0; t < l; ) {
      var u = st[t];
      st[t++] = null;
      var a = st[t];
      st[t++] = null;
      var e = st[t];
      st[t++] = null;
      var n = st[t];
      if (st[t++] = null, a !== null && e !== null) {
        var c = a.pending;
        c === null ? e.next = e : (e.next = c.next, c.next = e), a.pending = e;
      }
      n !== 0 && ys(u, e, n);
    }
  }
  function Ge(l, t, u, a) {
    st[$u++] = l, st[$u++] = t, st[$u++] = u, st[$u++] = a, bc |= a, l.lanes |= a, l = l.alternate, l !== null && (l.lanes |= a);
  }
  function Tc(l, t, u, a) {
    return Ge(l, t, u, a), Xe(l);
  }
  function ku(l, t) {
    return Ge(l, null, null, t), Xe(l);
  }
  function ys(l, t, u) {
    l.lanes |= u;
    var a = l.alternate;
    a !== null && (a.lanes |= u);
    for (var e = !1, n = l.return; n !== null; )
      n.childLanes |= u, a = n.alternate, a !== null && (a.childLanes |= u), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (e = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, e && t !== null && (e = 31 - Il(u), l = n.hiddenUpdates, a = l[e], a === null ? l[e] = [t] : a.push(t), t.lane = u | 536870912), n) : null;
  }
  function Xe(l) {
    if (50 < ne)
      throw ne = 0, Mf = null, Error(s(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Wu = {};
  function j0(l, t, u, a) {
    this.tag = l, this.key = u, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function lt(l, t, u, a) {
    return new j0(l, t, u, a);
  }
  function Ec(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function Ut(l, t) {
    var u = l.alternate;
    return u === null ? (u = lt(
      l.tag,
      t,
      l.key,
      l.mode
    ), u.elementType = l.elementType, u.type = l.type, u.stateNode = l.stateNode, u.alternate = l, l.alternate = u) : (u.pendingProps = t, u.type = l.type, u.flags = 0, u.subtreeFlags = 0, u.deletions = null), u.flags = l.flags & 65011712, u.childLanes = l.childLanes, u.lanes = l.lanes, u.child = l.child, u.memoizedProps = l.memoizedProps, u.memoizedState = l.memoizedState, u.updateQueue = l.updateQueue, t = l.dependencies, u.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, u.sibling = l.sibling, u.index = l.index, u.ref = l.ref, u.refCleanup = l.refCleanup, u;
  }
  function ms(l, t) {
    l.flags &= 65011714;
    var u = l.alternate;
    return u === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = u.childLanes, l.lanes = u.lanes, l.child = u.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = u.memoizedProps, l.memoizedState = u.memoizedState, l.updateQueue = u.updateQueue, l.type = u.type, t = u.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function Qe(l, t, u, a, e, n) {
    var c = 0;
    if (a = l, typeof l == "function") Ec(l) && (c = 1);
    else if (typeof l == "string")
      c = Yv(
        l,
        u,
        j.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (l) {
        case Tt:
          return l = lt(31, u, t, e), l.elementType = Tt, l.lanes = n, l;
        case _l:
          return Eu(u.children, e, n, t);
        case Gl:
          c = 8, e |= 24;
          break;
        case ql:
          return l = lt(12, u, t, e | 2), l.elementType = ql, l.lanes = n, l;
        case k:
          return l = lt(13, u, t, e), l.elementType = k, l.lanes = n, l;
        case wl:
          return l = lt(19, u, t, e), l.elementType = wl, l.lanes = n, l;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case Xl:
              case Al:
                c = 10;
                break l;
              case bt:
                c = 9;
                break l;
              case Ql:
                c = 11;
                break l;
              case $l:
                c = 14;
                break l;
              case kl:
                c = 16, a = null;
                break l;
            }
          c = 29, u = Error(
            s(130, l === null ? "null" : typeof l, "")
          ), a = null;
      }
    return t = lt(c, u, t, e), t.elementType = l, t.type = a, t.lanes = n, t;
  }
  function Eu(l, t, u, a) {
    return l = lt(7, l, a, t), l.lanes = u, l;
  }
  function Ac(l, t, u) {
    return l = lt(6, l, null, t), l.lanes = u, l;
  }
  function pc(l, t, u) {
    return t = lt(
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
  var Fu = [], Iu = 0, Ze = null, Ve = 0, ot = [], rt = 0, Au = null, Nt = 1, xt = "";
  function pu(l, t) {
    Fu[Iu++] = Ve, Fu[Iu++] = Ze, Ze = l, Ve = t;
  }
  function gs(l, t, u) {
    ot[rt++] = Nt, ot[rt++] = xt, ot[rt++] = Au, Au = l;
    var a = Nt;
    l = xt;
    var e = 32 - Il(a) - 1;
    a &= ~(1 << e), u += 1;
    var n = 32 - Il(t) + e;
    if (30 < n) {
      var c = e - e % 5;
      n = (a & (1 << c) - 1).toString(32), a >>= c, e -= c, Nt = 1 << 32 - Il(t) + e | u << e | a, xt = n + l;
    } else
      Nt = 1 << n | u << e | a, xt = l;
  }
  function Oc(l) {
    l.return !== null && (pu(l, 1), gs(l, 1, 0));
  }
  function Rc(l) {
    for (; l === Ze; )
      Ze = Fu[--Iu], Fu[Iu] = null, Ve = Fu[--Iu], Fu[Iu] = null;
    for (; l === Au; )
      Au = ot[--rt], ot[rt] = null, xt = ot[--rt], ot[rt] = null, Nt = ot[--rt], ot[rt] = null;
  }
  var Yl = null, vl = null, ll = !1, Ou = null, At = !1, zc = Error(s(519));
  function Ru(l) {
    var t = Error(s(418, ""));
    throw qa(it(t, l)), zc;
  }
  function Ss(l) {
    var t = l.stateNode, u = l.type, a = l.memoizedProps;
    switch (t[Cl] = l, t[Zl] = a, u) {
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
        w("invalid", t), Hi(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        ), De(t);
        break;
      case "select":
        w("invalid", t);
        break;
      case "textarea":
        w("invalid", t), Bi(t, a.value, a.defaultValue, a.children), De(t);
    }
    u = a.children, typeof u != "string" && typeof u != "number" && typeof u != "bigint" || t.textContent === "" + u || a.suppressHydrationWarning === !0 || jr(t.textContent, u) ? (a.popover != null && (w("beforetoggle", t), w("toggle", t)), a.onScroll != null && w("scroll", t), a.onScrollEnd != null && w("scrollend", t), a.onClick != null && (t.onclick = On), t = !0) : t = !1, t || Ru(l);
  }
  function bs(l) {
    for (Yl = l.return; Yl; )
      switch (Yl.tag) {
        case 5:
        case 13:
          At = !1;
          return;
        case 27:
        case 3:
          At = !0;
          return;
        default:
          Yl = Yl.return;
      }
  }
  function Ba(l) {
    if (l !== Yl) return !1;
    if (!ll) return bs(l), ll = !0, !1;
    var t = l.tag, u;
    if ((u = t !== 3 && t !== 27) && ((u = t === 5) && (u = l.type, u = !(u !== "form" && u !== "button") || Vf(l.type, l.memoizedProps)), u = !u), u && vl && Ru(l), bs(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(s(317));
      l: {
        for (l = l.nextSibling, t = 0; l; ) {
          if (l.nodeType === 8)
            if (u = l.data, u === "/$") {
              if (t === 0) {
                vl = St(l.nextSibling);
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
      t === 27 ? (t = vl, iu(l.type) ? (l = wf, wf = null, vl = l) : vl = t) : vl = Yl ? St(l.stateNode.nextSibling) : null;
    return !0;
  }
  function ja() {
    vl = Yl = null, ll = !1;
  }
  function Ts() {
    var l = Ou;
    return l !== null && (Jl === null ? Jl = l : Jl.push.apply(
      Jl,
      l
    ), Ou = null), l;
  }
  function qa(l) {
    Ou === null ? Ou = [l] : Ou.push(l);
  }
  var Mc = z(null), zu = null, Ht = null;
  function wt(l, t, u) {
    _(Mc, t._currentValue), t._currentValue = u;
  }
  function Ct(l) {
    l._currentValue = Mc.current, N(Mc);
  }
  function _c(l, t, u) {
    for (; l !== null; ) {
      var a = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), l === u) break;
      l = l.return;
    }
  }
  function Dc(l, t, u, a) {
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
              n.lanes |= u, f = n.alternate, f !== null && (f.lanes |= u), _c(
                n.return,
                u,
                l
              ), a || (c = null);
              break l;
            }
          n = f.next;
        }
      } else if (e.tag === 18) {
        if (c = e.return, c === null) throw Error(s(341));
        c.lanes |= u, n = c.alternate, n !== null && (n.lanes |= u), _c(c, u, l), c = null;
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
        if (c === null) throw Error(s(387));
        if (c = c.memoizedProps, c !== null) {
          var f = e.type;
          Pl(e.pendingProps.value, c.value) || (l !== null ? l.push(f) : l = [f]);
        }
      } else if (e === Wl.current) {
        if (c = e.alternate, c === null) throw Error(s(387));
        c.memoizedState.memoizedState !== e.memoizedState.memoizedState && (l !== null ? l.push(ve) : l = [ve]);
      }
      e = e.return;
    }
    l !== null && Dc(
      t,
      l,
      u,
      a
    ), t.flags |= 262144;
  }
  function Le(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!Pl(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function Mu(l) {
    zu = l, Ht = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function Bl(l) {
    return Es(zu, l);
  }
  function Ke(l, t) {
    return zu === null && Mu(l), Es(l, t);
  }
  function Es(l, t) {
    var u = t._currentValue;
    if (t = { context: t, memoizedValue: u, next: null }, Ht === null) {
      if (l === null) throw Error(s(308));
      Ht = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else Ht = Ht.next = t;
    return u;
  }
  var q0 = typeof AbortController < "u" ? AbortController : function() {
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
  }, Y0 = d.unstable_scheduleCallback, G0 = d.unstable_NormalPriority, bl = {
    $$typeof: Al,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Uc() {
    return {
      controller: new q0(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ga(l) {
    l.refCount--, l.refCount === 0 && Y0(G0, function() {
      l.controller.abort();
    });
  }
  var Xa = null, Nc = 0, Pu = 0, la = null;
  function X0(l, t) {
    if (Xa === null) {
      var u = Xa = [];
      Nc = 0, Pu = Cf(), la = {
        status: "pending",
        value: void 0,
        then: function(a) {
          u.push(a);
        }
      };
    }
    return Nc++, t.then(As, As), t;
  }
  function As() {
    if (--Nc === 0 && Xa !== null) {
      la !== null && (la.status = "fulfilled");
      var l = Xa;
      Xa = null, Pu = 0, la = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function Q0(l, t) {
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
  var ps = E.S;
  E.S = function(l, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && X0(l, t), ps !== null && ps(l, t);
  };
  var _u = z(null);
  function xc() {
    var l = _u.current;
    return l !== null ? l : sl.pooledCache;
  }
  function Je(l, t) {
    t === null ? _(_u, _u.current) : _(_u, t.pool);
  }
  function Os() {
    var l = xc();
    return l === null ? null : { parent: bl._currentValue, pool: l };
  }
  var Qa = Error(s(460)), Rs = Error(s(474)), we = Error(s(542)), Hc = { then: function() {
  } };
  function zs(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function $e() {
  }
  function Ms(l, t, u) {
    switch (u = l[u], u === void 0 ? l.push(t) : u !== t && (t.then($e, $e), t = u), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Ds(l), l;
      default:
        if (typeof t.status == "string") t.then($e, $e);
        else {
          if (l = sl, l !== null && 100 < l.shellSuspendCounter)
            throw Error(s(482));
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
            throw l = t.reason, Ds(l), l;
        }
        throw Za = t, Qa;
    }
  }
  var Za = null;
  function _s() {
    if (Za === null) throw Error(s(459));
    var l = Za;
    return Za = null, l;
  }
  function Ds(l) {
    if (l === Qa || l === we)
      throw Error(s(483));
  }
  var $t = !1;
  function Cc(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Bc(l, t) {
    l = l.updateQueue, t.updateQueue === l && (t.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function kt(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function Wt(l, t, u) {
    var a = l.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (ul & 2) !== 0) {
      var e = a.pending;
      return e === null ? t.next = t : (t.next = e.next, e.next = t), a.pending = t, t = Xe(l), ys(l, null, u), t;
    }
    return Ge(l, a, t, u), Xe(l);
  }
  function Va(l, t, u) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (u & 4194048) !== 0)) {
      var a = t.lanes;
      a &= l.pendingLanes, u |= a, t.lanes = u, Ai(l, u);
    }
  }
  function jc(l, t) {
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
    $t = !1;
    var n = e.firstBaseUpdate, c = e.lastBaseUpdate, f = e.shared.pending;
    if (f !== null) {
      e.shared.pending = null;
      var i = f, m = i.next;
      i.next = null, c === null ? n = m : c.next = m, c = i;
      var T = l.alternate;
      T !== null && (T = T.updateQueue, f = T.lastBaseUpdate, f !== c && (f === null ? T.firstBaseUpdate = m : f.next = m, T.lastBaseUpdate = i));
    }
    if (n !== null) {
      var p = e.baseState;
      c = 0, T = m = i = null, f = n;
      do {
        var g = f.lane & -536870913, S = g !== f.lane;
        if (S ? (W & g) === g : (a & g) === g) {
          g !== 0 && g === Pu && (qc = !0), T !== null && (T = T.next = {
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: null,
            next: null
          });
          l: {
            var X = l, q = f;
            g = t;
            var cl = u;
            switch (q.tag) {
              case 1:
                if (X = q.payload, typeof X == "function") {
                  p = X.call(cl, p, g);
                  break l;
                }
                p = X;
                break l;
              case 3:
                X.flags = X.flags & -65537 | 128;
              case 0:
                if (X = q.payload, g = typeof X == "function" ? X.call(cl, p, g) : X, g == null) break l;
                p = C({}, p, g);
                break l;
              case 2:
                $t = !0;
            }
          }
          g = f.callback, g !== null && (l.flags |= 64, S && (l.flags |= 8192), S = e.callbacks, S === null ? e.callbacks = [g] : S.push(g));
        } else
          S = {
            lane: g,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          }, T === null ? (m = T = S, i = p) : T = T.next = S, c |= g;
        if (f = f.next, f === null) {
          if (f = e.shared.pending, f === null)
            break;
          S = f, f = S.next, S.next = null, e.lastBaseUpdate = S, e.shared.pending = null;
        }
      } while (!0);
      T === null && (i = p), e.baseState = i, e.firstBaseUpdate = m, e.lastBaseUpdate = T, n === null && (e.shared.lanes = 0), eu |= c, l.lanes = c, l.memoizedState = p;
    }
  }
  function Us(l, t) {
    if (typeof l != "function")
      throw Error(s(191, l));
    l.call(t);
  }
  function Ns(l, t) {
    var u = l.callbacks;
    if (u !== null)
      for (l.callbacks = null, l = 0; l < u.length; l++)
        Us(u[l], t);
  }
  var ta = z(null), ke = z(0);
  function xs(l, t) {
    l = Qt, _(ke, l), _(ta, t), Qt = l | t.baseLanes;
  }
  function Yc() {
    _(ke, Qt), _(ta, ta.current);
  }
  function Gc() {
    Qt = ke.current, N(ta), N(ke);
  }
  var Ft = 0, L = null, el = null, gl = null, We = !1, ua = !1, Du = !1, Fe = 0, Ja = 0, aa = null, Z0 = 0;
  function yl() {
    throw Error(s(321));
  }
  function Xc(l, t) {
    if (t === null) return !1;
    for (var u = 0; u < t.length && u < l.length; u++)
      if (!Pl(l[u], t[u])) return !1;
    return !0;
  }
  function Qc(l, t, u, a, e, n) {
    return Ft = n, L = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, E.H = l === null || l.memoizedState === null ? mo : go, Du = !1, n = u(a, e), Du = !1, ua && (n = Cs(
      t,
      u,
      a,
      e
    )), Hs(l), n;
  }
  function Hs(l) {
    E.H = an;
    var t = el !== null && el.next !== null;
    if (Ft = 0, gl = el = L = null, We = !1, Ja = 0, aa = null, t) throw Error(s(300));
    l === null || Ol || (l = l.dependencies, l !== null && Le(l) && (Ol = !0));
  }
  function Cs(l, t, u, a) {
    L = l;
    var e = 0;
    do {
      if (ua && (aa = null), Ja = 0, ua = !1, 25 <= e) throw Error(s(301));
      if (e += 1, gl = el = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      E.H = k0, n = t(u, a);
    } while (ua);
    return n;
  }
  function V0() {
    var l = E.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? wa(t) : t, l = l.useState()[0], (el !== null ? el.memoizedState : null) !== l && (L.flags |= 1024), t;
  }
  function Zc() {
    var l = Fe !== 0;
    return Fe = 0, l;
  }
  function Vc(l, t, u) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~u;
  }
  function Lc(l) {
    if (We) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      We = !1;
    }
    Ft = 0, gl = el = L = null, ua = !1, Ja = Fe = 0, aa = null;
  }
  function Ll() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return gl === null ? L.memoizedState = gl = l : gl = gl.next = l, gl;
  }
  function Sl() {
    if (el === null) {
      var l = L.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = el.next;
    var t = gl === null ? L.memoizedState : gl.next;
    if (t !== null)
      gl = t, el = l;
    else {
      if (l === null)
        throw L.alternate === null ? Error(s(467)) : Error(s(310));
      el = l, l = {
        memoizedState: el.memoizedState,
        baseState: el.baseState,
        baseQueue: el.baseQueue,
        queue: el.queue,
        next: null
      }, gl === null ? L.memoizedState = gl = l : gl = gl.next = l;
    }
    return gl;
  }
  function Kc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function wa(l) {
    var t = Ja;
    return Ja += 1, aa === null && (aa = []), l = Ms(aa, l, t), t = L, (gl === null ? t.memoizedState : gl.next) === null && (t = t.alternate, E.H = t === null || t.memoizedState === null ? mo : go), l;
  }
  function Ie(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return wa(l);
      if (l.$$typeof === Al) return Bl(l);
    }
    throw Error(s(438, String(l)));
  }
  function Jc(l) {
    var t = null, u = L.updateQueue;
    if (u !== null && (t = u.memoCache), t == null) {
      var a = L.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(e) {
          return e.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), u === null && (u = Kc(), L.updateQueue = u), u.memoCache = t, u = t.data[t.index], u === void 0)
      for (u = t.data[t.index] = Array(l), a = 0; a < l; a++)
        u[a] = Cu;
    return t.index++, u;
  }
  function Bt(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function Pe(l) {
    var t = Sl();
    return wc(t, el, l);
  }
  function wc(l, t, u) {
    var a = l.queue;
    if (a === null) throw Error(s(311));
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
      var f = c = null, i = null, m = t, T = !1;
      do {
        var p = m.lane & -536870913;
        if (p !== m.lane ? (W & p) === p : (Ft & p) === p) {
          var g = m.revertLane;
          if (g === 0)
            i !== null && (i = i.next = {
              lane: 0,
              revertLane: 0,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null
            }), p === Pu && (T = !0);
          else if ((Ft & g) === g) {
            m = m.next, g === Pu && (T = !0);
            continue;
          } else
            p = {
              lane: 0,
              revertLane: m.revertLane,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null
            }, i === null ? (f = i = p, c = n) : i = i.next = p, L.lanes |= g, eu |= g;
          p = m.action, Du && u(n, p), n = m.hasEagerState ? m.eagerState : u(n, p);
        } else
          g = {
            lane: p,
            revertLane: m.revertLane,
            action: m.action,
            hasEagerState: m.hasEagerState,
            eagerState: m.eagerState,
            next: null
          }, i === null ? (f = i = g, c = n) : i = i.next = g, L.lanes |= p, eu |= p;
        m = m.next;
      } while (m !== null && m !== t);
      if (i === null ? c = n : i.next = f, !Pl(n, l.memoizedState) && (Ol = !0, T && (u = la, u !== null)))
        throw u;
      l.memoizedState = n, l.baseState = c, l.baseQueue = i, a.lastRenderedState = n;
    }
    return e === null && (a.lanes = 0), [l.memoizedState, a.dispatch];
  }
  function $c(l) {
    var t = Sl(), u = t.queue;
    if (u === null) throw Error(s(311));
    u.lastRenderedReducer = l;
    var a = u.dispatch, e = u.pending, n = t.memoizedState;
    if (e !== null) {
      u.pending = null;
      var c = e = e.next;
      do
        n = l(n, c.action), c = c.next;
      while (c !== e);
      Pl(n, t.memoizedState) || (Ol = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), u.lastRenderedState = n;
    }
    return [n, a];
  }
  function Bs(l, t, u) {
    var a = L, e = Sl(), n = ll;
    if (n) {
      if (u === void 0) throw Error(s(407));
      u = u();
    } else u = t();
    var c = !Pl(
      (el || e).memoizedState,
      u
    );
    c && (e.memoizedState = u, Ol = !0), e = e.queue;
    var f = Ys.bind(null, a, e, l);
    if ($a(2048, 8, f, [l]), e.getSnapshot !== t || c || gl !== null && gl.memoizedState.tag & 1) {
      if (a.flags |= 2048, ea(
        9,
        ln(),
        qs.bind(
          null,
          a,
          e,
          u,
          t
        ),
        null
      ), sl === null) throw Error(s(349));
      n || (Ft & 124) !== 0 || js(a, t, u);
    }
    return u;
  }
  function js(l, t, u) {
    l.flags |= 16384, l = { getSnapshot: t, value: u }, t = L.updateQueue, t === null ? (t = Kc(), L.updateQueue = t, t.stores = [l]) : (u = t.stores, u === null ? t.stores = [l] : u.push(l));
  }
  function qs(l, t, u, a) {
    t.value = u, t.getSnapshot = a, Gs(t) && Xs(l);
  }
  function Ys(l, t, u) {
    return u(function() {
      Gs(t) && Xs(l);
    });
  }
  function Gs(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var u = t();
      return !Pl(l, u);
    } catch {
      return !0;
    }
  }
  function Xs(l) {
    var t = ku(l, 2);
    t !== null && nt(t, l, 2);
  }
  function kc(l) {
    var t = Ll();
    if (typeof l == "function") {
      var u = l;
      if (l = u(), Du) {
        Lt(!0);
        try {
          u();
        } finally {
          Lt(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = l, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Bt,
      lastRenderedState: l
    }, t;
  }
  function Qs(l, t, u, a) {
    return l.baseState = u, wc(
      l,
      el,
      typeof a == "function" ? a : Bt
    );
  }
  function L0(l, t, u, a, e) {
    if (un(l)) throw Error(s(485));
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
      E.T !== null ? u(!0) : n.isTransition = !1, a(n), u = t.pending, u === null ? (n.next = t.pending = n, Zs(t, n)) : (n.next = u.next, t.pending = u.next = n);
    }
  }
  function Zs(l, t) {
    var u = t.action, a = t.payload, e = l.state;
    if (t.isTransition) {
      var n = E.T, c = {};
      E.T = c;
      try {
        var f = u(e, a), i = E.S;
        i !== null && i(c, f), Vs(l, t, f);
      } catch (m) {
        Wc(l, t, m);
      } finally {
        E.T = n;
      }
    } else
      try {
        n = u(e, a), Vs(l, t, n);
      } catch (m) {
        Wc(l, t, m);
      }
  }
  function Vs(l, t, u) {
    u !== null && typeof u == "object" && typeof u.then == "function" ? u.then(
      function(a) {
        Ls(l, t, a);
      },
      function(a) {
        return Wc(l, t, a);
      }
    ) : Ls(l, t, u);
  }
  function Ls(l, t, u) {
    t.status = "fulfilled", t.value = u, Ks(t), l.state = u, t = l.pending, t !== null && (u = t.next, u === t ? l.pending = null : (u = u.next, t.next = u, Zs(l, u)));
  }
  function Wc(l, t, u) {
    var a = l.pending;
    if (l.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = u, Ks(t), t = t.next;
      while (t !== a);
    }
    l.action = null;
  }
  function Ks(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function Js(l, t) {
    return t;
  }
  function ws(l, t) {
    if (ll) {
      var u = sl.formState;
      if (u !== null) {
        l: {
          var a = L;
          if (ll) {
            if (vl) {
              t: {
                for (var e = vl, n = At; e.nodeType !== 8; ) {
                  if (!n) {
                    e = null;
                    break t;
                  }
                  if (e = St(
                    e.nextSibling
                  ), e === null) {
                    e = null;
                    break t;
                  }
                }
                n = e.data, e = n === "F!" || n === "F" ? e : null;
              }
              if (e) {
                vl = St(
                  e.nextSibling
                ), a = e.data === "F!";
                break l;
              }
            }
            Ru(a);
          }
          a = !1;
        }
        a && (t = u[0]);
      }
    }
    return u = Ll(), u.memoizedState = u.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Js,
      lastRenderedState: t
    }, u.queue = a, u = vo.bind(
      null,
      L,
      a
    ), a.dispatch = u, a = kc(!1), n = tf.bind(
      null,
      L,
      !1,
      a.queue
    ), a = Ll(), e = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, a.queue = e, u = L0.bind(
      null,
      L,
      e,
      n,
      u
    ), e.dispatch = u, a.memoizedState = l, [t, u, !1];
  }
  function $s(l) {
    var t = Sl();
    return ks(t, el, l);
  }
  function ks(l, t, u) {
    if (t = wc(
      l,
      t,
      Js
    )[0], l = Pe(Bt)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = wa(t);
      } catch (c) {
        throw c === Qa ? we : c;
      }
    else a = t;
    t = Sl();
    var e = t.queue, n = e.dispatch;
    return u !== t.memoizedState && (L.flags |= 2048, ea(
      9,
      ln(),
      K0.bind(null, e, u),
      null
    )), [a, n, l];
  }
  function K0(l, t) {
    l.action = t;
  }
  function Ws(l) {
    var t = Sl(), u = el;
    if (u !== null)
      return ks(t, u, l);
    Sl(), t = t.memoizedState, u = Sl();
    var a = u.queue.dispatch;
    return u.memoizedState = l, [t, a, !1];
  }
  function ea(l, t, u, a) {
    return l = { tag: l, create: u, deps: a, inst: t, next: null }, t = L.updateQueue, t === null && (t = Kc(), L.updateQueue = t), u = t.lastEffect, u === null ? t.lastEffect = l.next = l : (a = u.next, u.next = l, l.next = a, t.lastEffect = l), l;
  }
  function ln() {
    return { destroy: void 0, resource: void 0 };
  }
  function Fs() {
    return Sl().memoizedState;
  }
  function tn(l, t, u, a) {
    var e = Ll();
    a = a === void 0 ? null : a, L.flags |= l, e.memoizedState = ea(
      1 | t,
      ln(),
      u,
      a
    );
  }
  function $a(l, t, u, a) {
    var e = Sl();
    a = a === void 0 ? null : a;
    var n = e.memoizedState.inst;
    el !== null && a !== null && Xc(a, el.memoizedState.deps) ? e.memoizedState = ea(t, n, u, a) : (L.flags |= l, e.memoizedState = ea(
      1 | t,
      n,
      u,
      a
    ));
  }
  function Is(l, t) {
    tn(8390656, 8, l, t);
  }
  function Ps(l, t) {
    $a(2048, 8, l, t);
  }
  function lo(l, t) {
    return $a(4, 2, l, t);
  }
  function to(l, t) {
    return $a(4, 4, l, t);
  }
  function uo(l, t) {
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
  function ao(l, t, u) {
    u = u != null ? u.concat([l]) : null, $a(4, 4, uo.bind(null, t, l), u);
  }
  function Fc() {
  }
  function eo(l, t) {
    var u = Sl();
    t = t === void 0 ? null : t;
    var a = u.memoizedState;
    return t !== null && Xc(t, a[1]) ? a[0] : (u.memoizedState = [l, t], l);
  }
  function no(l, t) {
    var u = Sl();
    t = t === void 0 ? null : t;
    var a = u.memoizedState;
    if (t !== null && Xc(t, a[1]))
      return a[0];
    if (a = l(), Du) {
      Lt(!0);
      try {
        l();
      } finally {
        Lt(!1);
      }
    }
    return u.memoizedState = [a, t], a;
  }
  function Ic(l, t, u) {
    return u === void 0 || (Ft & 1073741824) !== 0 ? l.memoizedState = t : (l.memoizedState = u, l = sr(), L.lanes |= l, eu |= l, u);
  }
  function co(l, t, u, a) {
    return Pl(u, t) ? u : ta.current !== null ? (l = Ic(l, u, a), Pl(l, t) || (Ol = !0), l) : (Ft & 42) === 0 ? (Ol = !0, l.memoizedState = u) : (l = sr(), L.lanes |= l, eu |= l, t);
  }
  function fo(l, t, u, a, e) {
    var n = D.p;
    D.p = n !== 0 && 8 > n ? n : 8;
    var c = E.T, f = {};
    E.T = f, tf(l, !1, t, u);
    try {
      var i = e(), m = E.S;
      if (m !== null && m(f, i), i !== null && typeof i == "object" && typeof i.then == "function") {
        var T = Q0(
          i,
          a
        );
        ka(
          l,
          t,
          T,
          et(l)
        );
      } else
        ka(
          l,
          t,
          a,
          et(l)
        );
    } catch (p) {
      ka(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: p },
        et()
      );
    } finally {
      D.p = n, E.T = c;
    }
  }
  function J0() {
  }
  function Pc(l, t, u, a) {
    if (l.tag !== 5) throw Error(s(476));
    var e = io(l).queue;
    fo(
      l,
      e,
      t,
      G,
      u === null ? J0 : function() {
        return so(l), u(a);
      }
    );
  }
  function io(l) {
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
        lastRenderedReducer: Bt,
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
        lastRenderedReducer: Bt,
        lastRenderedState: u
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function so(l) {
    var t = io(l).next.queue;
    ka(l, t, {}, et());
  }
  function lf() {
    return Bl(ve);
  }
  function oo() {
    return Sl().memoizedState;
  }
  function ro() {
    return Sl().memoizedState;
  }
  function w0(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var u = et();
          l = kt(u);
          var a = Wt(t, l, u);
          a !== null && (nt(a, t, u), Va(a, t, u)), t = { cache: Uc() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function $0(l, t, u) {
    var a = et();
    u = {
      lane: a,
      revertLane: 0,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, un(l) ? ho(t, u) : (u = Tc(l, t, u, a), u !== null && (nt(u, l, a), yo(u, t, a)));
  }
  function vo(l, t, u) {
    var a = et();
    ka(l, t, u, a);
  }
  function ka(l, t, u, a) {
    var e = {
      lane: a,
      revertLane: 0,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (un(l)) ho(t, e);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var c = t.lastRenderedState, f = n(c, u);
          if (e.hasEagerState = !0, e.eagerState = f, Pl(f, c))
            return Ge(l, t, e, 0), sl === null && Ye(), !1;
        } catch {
        } finally {
        }
      if (u = Tc(l, t, e, a), u !== null)
        return nt(u, l, a), yo(u, t, a), !0;
    }
    return !1;
  }
  function tf(l, t, u, a) {
    if (a = {
      lane: 2,
      revertLane: Cf(),
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, un(l)) {
      if (t) throw Error(s(479));
    } else
      t = Tc(
        l,
        u,
        a,
        2
      ), t !== null && nt(t, l, 2);
  }
  function un(l) {
    var t = l.alternate;
    return l === L || t !== null && t === L;
  }
  function ho(l, t) {
    ua = We = !0;
    var u = l.pending;
    u === null ? t.next = t : (t.next = u.next, u.next = t), l.pending = t;
  }
  function yo(l, t, u) {
    if ((u & 4194048) !== 0) {
      var a = t.lanes;
      a &= l.pendingLanes, u |= a, t.lanes = u, Ai(l, u);
    }
  }
  var an = {
    readContext: Bl,
    use: Ie,
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
  }, mo = {
    readContext: Bl,
    use: Ie,
    useCallback: function(l, t) {
      return Ll().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: Bl,
    useEffect: Is,
    useImperativeHandle: function(l, t, u) {
      u = u != null ? u.concat([l]) : null, tn(
        4194308,
        4,
        uo.bind(null, t, l),
        u
      );
    },
    useLayoutEffect: function(l, t) {
      return tn(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      tn(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var u = Ll();
      t = t === void 0 ? null : t;
      var a = l();
      if (Du) {
        Lt(!0);
        try {
          l();
        } finally {
          Lt(!1);
        }
      }
      return u.memoizedState = [a, t], a;
    },
    useReducer: function(l, t, u) {
      var a = Ll();
      if (u !== void 0) {
        var e = u(t);
        if (Du) {
          Lt(!0);
          try {
            u(t);
          } finally {
            Lt(!1);
          }
        }
      } else e = t;
      return a.memoizedState = a.baseState = e, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: e
      }, a.queue = l, l = l.dispatch = $0.bind(
        null,
        L,
        l
      ), [a.memoizedState, l];
    },
    useRef: function(l) {
      var t = Ll();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = kc(l);
      var t = l.queue, u = vo.bind(null, L, t);
      return t.dispatch = u, [l.memoizedState, u];
    },
    useDebugValue: Fc,
    useDeferredValue: function(l, t) {
      var u = Ll();
      return Ic(u, l, t);
    },
    useTransition: function() {
      var l = kc(!1);
      return l = fo.bind(
        null,
        L,
        l.queue,
        !0,
        !1
      ), Ll().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, u) {
      var a = L, e = Ll();
      if (ll) {
        if (u === void 0)
          throw Error(s(407));
        u = u();
      } else {
        if (u = t(), sl === null)
          throw Error(s(349));
        (W & 124) !== 0 || js(a, t, u);
      }
      e.memoizedState = u;
      var n = { value: u, getSnapshot: t };
      return e.queue = n, Is(Ys.bind(null, a, n, l), [
        l
      ]), a.flags |= 2048, ea(
        9,
        ln(),
        qs.bind(
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
      var l = Ll(), t = sl.identifierPrefix;
      if (ll) {
        var u = xt, a = Nt;
        u = (a & ~(1 << 32 - Il(a) - 1)).toString(32) + u, t = "«" + t + "R" + u, u = Fe++, 0 < u && (t += "H" + u.toString(32)), t += "»";
      } else
        u = Z0++, t = "«" + t + "r" + u.toString(32) + "»";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: lf,
    useFormState: ws,
    useActionState: ws,
    useOptimistic: function(l) {
      var t = Ll();
      t.memoizedState = t.baseState = l;
      var u = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = u, t = tf.bind(
        null,
        L,
        !0,
        u
      ), u.dispatch = t, [l, t];
    },
    useMemoCache: Jc,
    useCacheRefresh: function() {
      return Ll().memoizedState = w0.bind(
        null,
        L
      );
    }
  }, go = {
    readContext: Bl,
    use: Ie,
    useCallback: eo,
    useContext: Bl,
    useEffect: Ps,
    useImperativeHandle: ao,
    useInsertionEffect: lo,
    useLayoutEffect: to,
    useMemo: no,
    useReducer: Pe,
    useRef: Fs,
    useState: function() {
      return Pe(Bt);
    },
    useDebugValue: Fc,
    useDeferredValue: function(l, t) {
      var u = Sl();
      return co(
        u,
        el.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = Pe(Bt)[0], t = Sl().memoizedState;
      return [
        typeof l == "boolean" ? l : wa(l),
        t
      ];
    },
    useSyncExternalStore: Bs,
    useId: oo,
    useHostTransitionStatus: lf,
    useFormState: $s,
    useActionState: $s,
    useOptimistic: function(l, t) {
      var u = Sl();
      return Qs(u, el, l, t);
    },
    useMemoCache: Jc,
    useCacheRefresh: ro
  }, k0 = {
    readContext: Bl,
    use: Ie,
    useCallback: eo,
    useContext: Bl,
    useEffect: Ps,
    useImperativeHandle: ao,
    useInsertionEffect: lo,
    useLayoutEffect: to,
    useMemo: no,
    useReducer: $c,
    useRef: Fs,
    useState: function() {
      return $c(Bt);
    },
    useDebugValue: Fc,
    useDeferredValue: function(l, t) {
      var u = Sl();
      return el === null ? Ic(u, l, t) : co(
        u,
        el.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = $c(Bt)[0], t = Sl().memoizedState;
      return [
        typeof l == "boolean" ? l : wa(l),
        t
      ];
    },
    useSyncExternalStore: Bs,
    useId: oo,
    useHostTransitionStatus: lf,
    useFormState: Ws,
    useActionState: Ws,
    useOptimistic: function(l, t) {
      var u = Sl();
      return el !== null ? Qs(u, el, l, t) : (u.baseState = l, [l, u.queue.dispatch]);
    },
    useMemoCache: Jc,
    useCacheRefresh: ro
  }, na = null, Wa = 0;
  function en(l) {
    var t = Wa;
    return Wa += 1, na === null && (na = []), Ms(na, l, t);
  }
  function Fa(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function nn(l, t) {
    throw t.$$typeof === tl ? Error(s(525)) : (l = Object.prototype.toString.call(t), Error(
      s(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function So(l) {
    var t = l._init;
    return t(l._payload);
  }
  function bo(l) {
    function t(h, r) {
      if (l) {
        var y = h.deletions;
        y === null ? (h.deletions = [r], h.flags |= 16) : y.push(r);
      }
    }
    function u(h, r) {
      if (!l) return null;
      for (; r !== null; )
        t(h, r), r = r.sibling;
      return null;
    }
    function a(h) {
      for (var r = /* @__PURE__ */ new Map(); h !== null; )
        h.key !== null ? r.set(h.key, h) : r.set(h.index, h), h = h.sibling;
      return r;
    }
    function e(h, r) {
      return h = Ut(h, r), h.index = 0, h.sibling = null, h;
    }
    function n(h, r, y) {
      return h.index = y, l ? (y = h.alternate, y !== null ? (y = y.index, y < r ? (h.flags |= 67108866, r) : y) : (h.flags |= 67108866, r)) : (h.flags |= 1048576, r);
    }
    function c(h) {
      return l && h.alternate === null && (h.flags |= 67108866), h;
    }
    function f(h, r, y, A) {
      return r === null || r.tag !== 6 ? (r = Ac(y, h.mode, A), r.return = h, r) : (r = e(r, y), r.return = h, r);
    }
    function i(h, r, y, A) {
      var H = y.type;
      return H === _l ? T(
        h,
        r,
        y.props.children,
        A,
        y.key
      ) : r !== null && (r.elementType === H || typeof H == "object" && H !== null && H.$$typeof === kl && So(H) === r.type) ? (r = e(r, y.props), Fa(r, y), r.return = h, r) : (r = Qe(
        y.type,
        y.key,
        y.props,
        null,
        h.mode,
        A
      ), Fa(r, y), r.return = h, r);
    }
    function m(h, r, y, A) {
      return r === null || r.tag !== 4 || r.stateNode.containerInfo !== y.containerInfo || r.stateNode.implementation !== y.implementation ? (r = pc(y, h.mode, A), r.return = h, r) : (r = e(r, y.children || []), r.return = h, r);
    }
    function T(h, r, y, A, H) {
      return r === null || r.tag !== 7 ? (r = Eu(
        y,
        h.mode,
        A,
        H
      ), r.return = h, r) : (r = e(r, y), r.return = h, r);
    }
    function p(h, r, y) {
      if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint")
        return r = Ac(
          "" + r,
          h.mode,
          y
        ), r.return = h, r;
      if (typeof r == "object" && r !== null) {
        switch (r.$$typeof) {
          case $:
            return y = Qe(
              r.type,
              r.key,
              r.props,
              null,
              h.mode,
              y
            ), Fa(y, r), y.return = h, y;
          case Ml:
            return r = pc(
              r,
              h.mode,
              y
            ), r.return = h, r;
          case kl:
            var A = r._init;
            return r = A(r._payload), p(h, r, y);
        }
        if (Hl(r) || xl(r))
          return r = Eu(
            r,
            h.mode,
            y,
            null
          ), r.return = h, r;
        if (typeof r.then == "function")
          return p(h, en(r), y);
        if (r.$$typeof === Al)
          return p(
            h,
            Ke(h, r),
            y
          );
        nn(h, r);
      }
      return null;
    }
    function g(h, r, y, A) {
      var H = r !== null ? r.key : null;
      if (typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint")
        return H !== null ? null : f(h, r, "" + y, A);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case $:
            return y.key === H ? i(h, r, y, A) : null;
          case Ml:
            return y.key === H ? m(h, r, y, A) : null;
          case kl:
            return H = y._init, y = H(y._payload), g(h, r, y, A);
        }
        if (Hl(y) || xl(y))
          return H !== null ? null : T(h, r, y, A, null);
        if (typeof y.then == "function")
          return g(
            h,
            r,
            en(y),
            A
          );
        if (y.$$typeof === Al)
          return g(
            h,
            r,
            Ke(h, y),
            A
          );
        nn(h, y);
      }
      return null;
    }
    function S(h, r, y, A, H) {
      if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint")
        return h = h.get(y) || null, f(r, h, "" + A, H);
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case $:
            return h = h.get(
              A.key === null ? y : A.key
            ) || null, i(r, h, A, H);
          case Ml:
            return h = h.get(
              A.key === null ? y : A.key
            ) || null, m(r, h, A, H);
          case kl:
            var K = A._init;
            return A = K(A._payload), S(
              h,
              r,
              y,
              A,
              H
            );
        }
        if (Hl(A) || xl(A))
          return h = h.get(y) || null, T(r, h, A, H, null);
        if (typeof A.then == "function")
          return S(
            h,
            r,
            y,
            en(A),
            H
          );
        if (A.$$typeof === Al)
          return S(
            h,
            r,
            y,
            Ke(r, A),
            H
          );
        nn(r, A);
      }
      return null;
    }
    function X(h, r, y, A) {
      for (var H = null, K = null, B = r, Y = r = 0, zl = null; B !== null && Y < y.length; Y++) {
        B.index > Y ? (zl = B, B = null) : zl = B.sibling;
        var P = g(
          h,
          B,
          y[Y],
          A
        );
        if (P === null) {
          B === null && (B = zl);
          break;
        }
        l && B && P.alternate === null && t(h, B), r = n(P, r, Y), K === null ? H = P : K.sibling = P, K = P, B = zl;
      }
      if (Y === y.length)
        return u(h, B), ll && pu(h, Y), H;
      if (B === null) {
        for (; Y < y.length; Y++)
          B = p(h, y[Y], A), B !== null && (r = n(
            B,
            r,
            Y
          ), K === null ? H = B : K.sibling = B, K = B);
        return ll && pu(h, Y), H;
      }
      for (B = a(B); Y < y.length; Y++)
        zl = S(
          B,
          h,
          Y,
          y[Y],
          A
        ), zl !== null && (l && zl.alternate !== null && B.delete(
          zl.key === null ? Y : zl.key
        ), r = n(
          zl,
          r,
          Y
        ), K === null ? H = zl : K.sibling = zl, K = zl);
      return l && B.forEach(function(vu) {
        return t(h, vu);
      }), ll && pu(h, Y), H;
    }
    function q(h, r, y, A) {
      if (y == null) throw Error(s(151));
      for (var H = null, K = null, B = r, Y = r = 0, zl = null, P = y.next(); B !== null && !P.done; Y++, P = y.next()) {
        B.index > Y ? (zl = B, B = null) : zl = B.sibling;
        var vu = g(h, B, P.value, A);
        if (vu === null) {
          B === null && (B = zl);
          break;
        }
        l && B && vu.alternate === null && t(h, B), r = n(vu, r, Y), K === null ? H = vu : K.sibling = vu, K = vu, B = zl;
      }
      if (P.done)
        return u(h, B), ll && pu(h, Y), H;
      if (B === null) {
        for (; !P.done; Y++, P = y.next())
          P = p(h, P.value, A), P !== null && (r = n(P, r, Y), K === null ? H = P : K.sibling = P, K = P);
        return ll && pu(h, Y), H;
      }
      for (B = a(B); !P.done; Y++, P = y.next())
        P = S(B, h, Y, P.value, A), P !== null && (l && P.alternate !== null && B.delete(P.key === null ? Y : P.key), r = n(P, r, Y), K === null ? H = P : K.sibling = P, K = P);
      return l && B.forEach(function(Wv) {
        return t(h, Wv);
      }), ll && pu(h, Y), H;
    }
    function cl(h, r, y, A) {
      if (typeof y == "object" && y !== null && y.type === _l && y.key === null && (y = y.props.children), typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case $:
            l: {
              for (var H = y.key; r !== null; ) {
                if (r.key === H) {
                  if (H = y.type, H === _l) {
                    if (r.tag === 7) {
                      u(
                        h,
                        r.sibling
                      ), A = e(
                        r,
                        y.props.children
                      ), A.return = h, h = A;
                      break l;
                    }
                  } else if (r.elementType === H || typeof H == "object" && H !== null && H.$$typeof === kl && So(H) === r.type) {
                    u(
                      h,
                      r.sibling
                    ), A = e(r, y.props), Fa(A, y), A.return = h, h = A;
                    break l;
                  }
                  u(h, r);
                  break;
                } else t(h, r);
                r = r.sibling;
              }
              y.type === _l ? (A = Eu(
                y.props.children,
                h.mode,
                A,
                y.key
              ), A.return = h, h = A) : (A = Qe(
                y.type,
                y.key,
                y.props,
                null,
                h.mode,
                A
              ), Fa(A, y), A.return = h, h = A);
            }
            return c(h);
          case Ml:
            l: {
              for (H = y.key; r !== null; ) {
                if (r.key === H)
                  if (r.tag === 4 && r.stateNode.containerInfo === y.containerInfo && r.stateNode.implementation === y.implementation) {
                    u(
                      h,
                      r.sibling
                    ), A = e(r, y.children || []), A.return = h, h = A;
                    break l;
                  } else {
                    u(h, r);
                    break;
                  }
                else t(h, r);
                r = r.sibling;
              }
              A = pc(y, h.mode, A), A.return = h, h = A;
            }
            return c(h);
          case kl:
            return H = y._init, y = H(y._payload), cl(
              h,
              r,
              y,
              A
            );
        }
        if (Hl(y))
          return X(
            h,
            r,
            y,
            A
          );
        if (xl(y)) {
          if (H = xl(y), typeof H != "function") throw Error(s(150));
          return y = H.call(y), q(
            h,
            r,
            y,
            A
          );
        }
        if (typeof y.then == "function")
          return cl(
            h,
            r,
            en(y),
            A
          );
        if (y.$$typeof === Al)
          return cl(
            h,
            r,
            Ke(h, y),
            A
          );
        nn(h, y);
      }
      return typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint" ? (y = "" + y, r !== null && r.tag === 6 ? (u(h, r.sibling), A = e(r, y), A.return = h, h = A) : (u(h, r), A = Ac(y, h.mode, A), A.return = h, h = A), c(h)) : u(h, r);
    }
    return function(h, r, y, A) {
      try {
        Wa = 0;
        var H = cl(
          h,
          r,
          y,
          A
        );
        return na = null, H;
      } catch (B) {
        if (B === Qa || B === we) throw B;
        var K = lt(29, B, null, h.mode);
        return K.lanes = A, K.return = h, K;
      } finally {
      }
    };
  }
  var ca = bo(!0), To = bo(!1), dt = z(null), pt = null;
  function It(l) {
    var t = l.alternate;
    _(Tl, Tl.current & 1), _(dt, l), pt === null && (t === null || ta.current !== null || t.memoizedState !== null) && (pt = l);
  }
  function Eo(l) {
    if (l.tag === 22) {
      if (_(Tl, Tl.current), _(dt, l), pt === null) {
        var t = l.alternate;
        t !== null && t.memoizedState !== null && (pt = l);
      }
    } else Pt();
  }
  function Pt() {
    _(Tl, Tl.current), _(dt, dt.current);
  }
  function jt(l) {
    N(dt), pt === l && (pt = null), N(Tl);
  }
  var Tl = z(0);
  function cn(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var u = t.memoizedState;
        if (u !== null && (u = u.dehydrated, u === null || u.data === "$?" || Jf(u)))
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
  function uf(l, t, u, a) {
    t = l.memoizedState, u = u(a, t), u = u == null ? t : C({}, t, u), l.memoizedState = u, l.lanes === 0 && (l.updateQueue.baseState = u);
  }
  var af = {
    enqueueSetState: function(l, t, u) {
      l = l._reactInternals;
      var a = et(), e = kt(a);
      e.payload = t, u != null && (e.callback = u), t = Wt(l, e, a), t !== null && (nt(t, l, a), Va(t, l, a));
    },
    enqueueReplaceState: function(l, t, u) {
      l = l._reactInternals;
      var a = et(), e = kt(a);
      e.tag = 1, e.payload = t, u != null && (e.callback = u), t = Wt(l, e, a), t !== null && (nt(t, l, a), Va(t, l, a));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var u = et(), a = kt(u);
      a.tag = 2, t != null && (a.callback = t), t = Wt(l, a, u), t !== null && (nt(t, l, u), Va(t, l, u));
    }
  };
  function Ao(l, t, u, a, e, n, c) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(a, n, c) : t.prototype && t.prototype.isPureReactComponent ? !Ha(u, a) || !Ha(e, n) : !0;
  }
  function po(l, t, u, a) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(u, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(u, a), t.state !== l && af.enqueueReplaceState(t, t.state, null);
  }
  function Uu(l, t) {
    var u = t;
    if ("ref" in t) {
      u = {};
      for (var a in t)
        a !== "ref" && (u[a] = t[a]);
    }
    if (l = l.defaultProps) {
      u === t && (u = C({}, u));
      for (var e in l)
        u[e] === void 0 && (u[e] = l[e]);
    }
    return u;
  }
  var fn = typeof reportError == "function" ? reportError : function(l) {
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
  function Oo(l) {
    fn(l);
  }
  function Ro(l) {
    console.error(l);
  }
  function zo(l) {
    fn(l);
  }
  function sn(l, t) {
    try {
      var u = l.onUncaughtError;
      u(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Mo(l, t, u) {
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
  function ef(l, t, u) {
    return u = kt(u), u.tag = 3, u.payload = { element: null }, u.callback = function() {
      sn(l, t);
    }, u;
  }
  function _o(l) {
    return l = kt(l), l.tag = 3, l;
  }
  function Do(l, t, u, a) {
    var e = u.type.getDerivedStateFromError;
    if (typeof e == "function") {
      var n = a.value;
      l.payload = function() {
        return e(n);
      }, l.callback = function() {
        Mo(t, u, a);
      };
    }
    var c = u.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (l.callback = function() {
      Mo(t, u, a), typeof e != "function" && (nu === null ? nu = /* @__PURE__ */ new Set([this]) : nu.add(this));
      var f = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: f !== null ? f : ""
      });
    });
  }
  function W0(l, t, u, a, e) {
    if (u.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = u.alternate, t !== null && Ya(
        t,
        u,
        e,
        !0
      ), u = dt.current, u !== null) {
        switch (u.tag) {
          case 13:
            return pt === null ? Df() : u.alternate === null && hl === 0 && (hl = 3), u.flags &= -257, u.flags |= 65536, u.lanes = e, a === Hc ? u.flags |= 16384 : (t = u.updateQueue, t === null ? u.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Nf(l, a, e)), !1;
          case 22:
            return u.flags |= 65536, a === Hc ? u.flags |= 16384 : (t = u.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, u.updateQueue = t) : (u = t.retryQueue, u === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : u.add(a)), Nf(l, a, e)), !1;
        }
        throw Error(s(435, u.tag));
      }
      return Nf(l, a, e), Df(), !1;
    }
    if (ll)
      return t = dt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = e, a !== zc && (l = Error(s(422), { cause: a }), qa(it(l, u)))) : (a !== zc && (t = Error(s(423), {
        cause: a
      }), qa(
        it(t, u)
      )), l = l.current.alternate, l.flags |= 65536, e &= -e, l.lanes |= e, a = it(a, u), e = ef(
        l.stateNode,
        a,
        e
      ), jc(l, e), hl !== 4 && (hl = 2)), !1;
    var n = Error(s(520), { cause: a });
    if (n = it(n, u), ee === null ? ee = [n] : ee.push(n), hl !== 4 && (hl = 2), t === null) return !0;
    a = it(a, u), u = t;
    do {
      switch (u.tag) {
        case 3:
          return u.flags |= 65536, l = e & -e, u.lanes |= l, l = ef(u.stateNode, a, l), jc(u, l), !1;
        case 1:
          if (t = u.type, n = u.stateNode, (u.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (nu === null || !nu.has(n))))
            return u.flags |= 65536, e &= -e, u.lanes |= e, e = _o(e), Do(
              e,
              l,
              u,
              a
            ), jc(u, e), !1;
      }
      u = u.return;
    } while (u !== null);
    return !1;
  }
  var Uo = Error(s(461)), Ol = !1;
  function Dl(l, t, u, a) {
    t.child = l === null ? To(t, null, u, a) : ca(
      t,
      l.child,
      u,
      a
    );
  }
  function No(l, t, u, a, e) {
    u = u.render;
    var n = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var f in a)
        f !== "ref" && (c[f] = a[f]);
    } else c = a;
    return Mu(t), a = Qc(
      l,
      t,
      u,
      c,
      n,
      e
    ), f = Zc(), l !== null && !Ol ? (Vc(l, t, e), qt(l, t, e)) : (ll && f && Oc(t), t.flags |= 1, Dl(l, t, a, e), t.child);
  }
  function xo(l, t, u, a, e) {
    if (l === null) {
      var n = u.type;
      return typeof n == "function" && !Ec(n) && n.defaultProps === void 0 && u.compare === null ? (t.tag = 15, t.type = n, Ho(
        l,
        t,
        n,
        a,
        e
      )) : (l = Qe(
        u.type,
        null,
        a,
        t,
        t.mode,
        e
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !vf(l, e)) {
      var c = n.memoizedProps;
      if (u = u.compare, u = u !== null ? u : Ha, u(c, a) && l.ref === t.ref)
        return qt(l, t, e);
    }
    return t.flags |= 1, l = Ut(n, a), l.ref = t.ref, l.return = t, t.child = l;
  }
  function Ho(l, t, u, a, e) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (Ha(n, a) && l.ref === t.ref)
        if (Ol = !1, t.pendingProps = a = n, vf(l, e))
          (l.flags & 131072) !== 0 && (Ol = !0);
        else
          return t.lanes = l.lanes, qt(l, t, e);
    }
    return nf(
      l,
      t,
      u,
      a,
      e
    );
  }
  function Co(l, t, u) {
    var a = t.pendingProps, e = a.children, n = l !== null ? l.memoizedState : null;
    if (a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (a = n !== null ? n.baseLanes | u : u, l !== null) {
          for (e = t.child = l.child, n = 0; e !== null; )
            n = n | e.lanes | e.childLanes, e = e.sibling;
          t.childLanes = n & ~a;
        } else t.childLanes = 0, t.child = null;
        return Bo(
          l,
          t,
          a,
          u
        );
      }
      if ((u & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && Je(
          t,
          n !== null ? n.cachePool : null
        ), n !== null ? xs(t, n) : Yc(), Eo(t);
      else
        return t.lanes = t.childLanes = 536870912, Bo(
          l,
          t,
          n !== null ? n.baseLanes | u : u,
          u
        );
    } else
      n !== null ? (Je(t, n.cachePool), xs(t, n), Pt(), t.memoizedState = null) : (l !== null && Je(t, null), Yc(), Pt());
    return Dl(l, t, e, u), t.child;
  }
  function Bo(l, t, u, a) {
    var e = xc();
    return e = e === null ? null : { parent: bl._currentValue, pool: e }, t.memoizedState = {
      baseLanes: u,
      cachePool: e
    }, l !== null && Je(t, null), Yc(), Eo(t), l !== null && Ya(l, t, a, !0), null;
  }
  function on(l, t) {
    var u = t.ref;
    if (u === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof u != "function" && typeof u != "object")
        throw Error(s(284));
      (l === null || l.ref !== u) && (t.flags |= 4194816);
    }
  }
  function nf(l, t, u, a, e) {
    return Mu(t), u = Qc(
      l,
      t,
      u,
      a,
      void 0,
      e
    ), a = Zc(), l !== null && !Ol ? (Vc(l, t, e), qt(l, t, e)) : (ll && a && Oc(t), t.flags |= 1, Dl(l, t, u, e), t.child);
  }
  function jo(l, t, u, a, e, n) {
    return Mu(t), t.updateQueue = null, u = Cs(
      t,
      a,
      u,
      e
    ), Hs(l), a = Zc(), l !== null && !Ol ? (Vc(l, t, n), qt(l, t, n)) : (ll && a && Oc(t), t.flags |= 1, Dl(l, t, u, n), t.child);
  }
  function qo(l, t, u, a, e) {
    if (Mu(t), t.stateNode === null) {
      var n = Wu, c = u.contextType;
      typeof c == "object" && c !== null && (n = Bl(c)), n = new u(a, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = af, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = a, n.state = t.memoizedState, n.refs = {}, Cc(t), c = u.contextType, n.context = typeof c == "object" && c !== null ? Bl(c) : Wu, n.state = t.memoizedState, c = u.getDerivedStateFromProps, typeof c == "function" && (uf(
        t,
        u,
        c,
        a
      ), n.state = t.memoizedState), typeof u.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (c = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), c !== n.state && af.enqueueReplaceState(n, n.state, null), Ka(t, a, n, e), La(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (l === null) {
      n = t.stateNode;
      var f = t.memoizedProps, i = Uu(u, f);
      n.props = i;
      var m = n.context, T = u.contextType;
      c = Wu, typeof T == "object" && T !== null && (c = Bl(T));
      var p = u.getDerivedStateFromProps;
      T = typeof p == "function" || typeof n.getSnapshotBeforeUpdate == "function", f = t.pendingProps !== f, T || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (f || m !== c) && po(
        t,
        n,
        a,
        c
      ), $t = !1;
      var g = t.memoizedState;
      n.state = g, Ka(t, a, n, e), La(), m = t.memoizedState, f || g !== m || $t ? (typeof p == "function" && (uf(
        t,
        u,
        p,
        a
      ), m = t.memoizedState), (i = $t || Ao(
        t,
        u,
        i,
        a,
        g,
        m,
        c
      )) ? (T || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = m), n.props = a, n.state = m, n.context = c, a = i) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      n = t.stateNode, Bc(l, t), c = t.memoizedProps, T = Uu(u, c), n.props = T, p = t.pendingProps, g = n.context, m = u.contextType, i = Wu, typeof m == "object" && m !== null && (i = Bl(m)), f = u.getDerivedStateFromProps, (m = typeof f == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c !== p || g !== i) && po(
        t,
        n,
        a,
        i
      ), $t = !1, g = t.memoizedState, n.state = g, Ka(t, a, n, e), La();
      var S = t.memoizedState;
      c !== p || g !== S || $t || l !== null && l.dependencies !== null && Le(l.dependencies) ? (typeof f == "function" && (uf(
        t,
        u,
        f,
        a
      ), S = t.memoizedState), (T = $t || Ao(
        t,
        u,
        T,
        a,
        g,
        S,
        i
      ) || l !== null && l.dependencies !== null && Le(l.dependencies)) ? (m || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(a, S, i), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        a,
        S,
        i
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || c === l.memoizedProps && g === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && g === l.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = S), n.props = a, n.state = S, n.context = i, a = T) : (typeof n.componentDidUpdate != "function" || c === l.memoizedProps && g === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && g === l.memoizedState || (t.flags |= 1024), a = !1);
    }
    return n = a, on(l, t), a = (t.flags & 128) !== 0, n || a ? (n = t.stateNode, u = a && typeof u.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && a ? (t.child = ca(
      t,
      l.child,
      null,
      e
    ), t.child = ca(
      t,
      null,
      u,
      e
    )) : Dl(l, t, u, e), t.memoizedState = n.state, l = t.child) : l = qt(
      l,
      t,
      e
    ), l;
  }
  function Yo(l, t, u, a) {
    return ja(), t.flags |= 256, Dl(l, t, u, a), t.child;
  }
  var cf = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function ff(l) {
    return { baseLanes: l, cachePool: Os() };
  }
  function sf(l, t, u) {
    return l = l !== null ? l.childLanes & ~u : 0, t && (l |= vt), l;
  }
  function Go(l, t, u) {
    var a = t.pendingProps, e = !1, n = (t.flags & 128) !== 0, c;
    if ((c = n) || (c = l !== null && l.memoizedState === null ? !1 : (Tl.current & 2) !== 0), c && (e = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (ll) {
        if (e ? It(t) : Pt(), ll) {
          var f = vl, i;
          if (i = f) {
            l: {
              for (i = f, f = At; i.nodeType !== 8; ) {
                if (!f) {
                  f = null;
                  break l;
                }
                if (i = St(
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
              treeContext: Au !== null ? { id: Nt, overflow: xt } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, i = lt(
              18,
              null,
              null,
              0
            ), i.stateNode = f, i.return = t, t.child = i, Yl = t, vl = null, i = !0) : i = !1;
          }
          i || Ru(t);
        }
        if (f = t.memoizedState, f !== null && (f = f.dehydrated, f !== null))
          return Jf(f) ? t.lanes = 32 : t.lanes = 536870912, null;
        jt(t);
      }
      return f = a.children, a = a.fallback, e ? (Pt(), e = t.mode, f = rn(
        { mode: "hidden", children: f },
        e
      ), a = Eu(
        a,
        e,
        u,
        null
      ), f.return = t, a.return = t, f.sibling = a, t.child = f, e = t.child, e.memoizedState = ff(u), e.childLanes = sf(
        l,
        c,
        u
      ), t.memoizedState = cf, a) : (It(t), of(t, f));
    }
    if (i = l.memoizedState, i !== null && (f = i.dehydrated, f !== null)) {
      if (n)
        t.flags & 256 ? (It(t), t.flags &= -257, t = rf(
          l,
          t,
          u
        )) : t.memoizedState !== null ? (Pt(), t.child = l.child, t.flags |= 128, t = null) : (Pt(), e = a.fallback, f = t.mode, a = rn(
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
        ), a = t.child, a.memoizedState = ff(u), a.childLanes = sf(
          l,
          c,
          u
        ), t.memoizedState = cf, t = e);
      else if (It(t), Jf(f)) {
        if (c = f.nextSibling && f.nextSibling.dataset, c) var m = c.dgst;
        c = m, a = Error(s(419)), a.stack = "", a.digest = c, qa({ value: a, source: null, stack: null }), t = rf(
          l,
          t,
          u
        );
      } else if (Ol || Ya(l, t, u, !1), c = (u & l.childLanes) !== 0, Ol || c) {
        if (c = sl, c !== null && (a = u & -u, a = (a & 42) !== 0 ? 1 : Jn(a), a = (a & (c.suspendedLanes | u)) !== 0 ? 0 : a, a !== 0 && a !== i.retryLane))
          throw i.retryLane = a, ku(l, a), nt(c, l, a), Uo;
        f.data === "$?" || Df(), t = rf(
          l,
          t,
          u
        );
      } else
        f.data === "$?" ? (t.flags |= 192, t.child = l.child, t = null) : (l = i.treeContext, vl = St(
          f.nextSibling
        ), Yl = t, ll = !0, Ou = null, At = !1, l !== null && (ot[rt++] = Nt, ot[rt++] = xt, ot[rt++] = Au, Nt = l.id, xt = l.overflow, Au = t), t = of(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return e ? (Pt(), e = a.fallback, f = t.mode, i = l.child, m = i.sibling, a = Ut(i, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = i.subtreeFlags & 65011712, m !== null ? e = Ut(m, e) : (e = Eu(
      e,
      f,
      u,
      null
    ), e.flags |= 2), e.return = t, a.return = t, a.sibling = e, t.child = a, a = e, e = t.child, f = l.child.memoizedState, f === null ? f = ff(u) : (i = f.cachePool, i !== null ? (m = bl._currentValue, i = i.parent !== m ? { parent: m, pool: m } : i) : i = Os(), f = {
      baseLanes: f.baseLanes | u,
      cachePool: i
    }), e.memoizedState = f, e.childLanes = sf(
      l,
      c,
      u
    ), t.memoizedState = cf, a) : (It(t), u = l.child, l = u.sibling, u = Ut(u, {
      mode: "visible",
      children: a.children
    }), u.return = t, u.sibling = null, l !== null && (c = t.deletions, c === null ? (t.deletions = [l], t.flags |= 16) : c.push(l)), t.child = u, t.memoizedState = null, u);
  }
  function of(l, t) {
    return t = rn(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function rn(l, t) {
    return l = lt(22, l, null, t), l.lanes = 0, l.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, l;
  }
  function rf(l, t, u) {
    return ca(t, l.child, null, u), l = of(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function Xo(l, t, u) {
    l.lanes |= t;
    var a = l.alternate;
    a !== null && (a.lanes |= t), _c(l.return, t, u);
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
  function Qo(l, t, u) {
    var a = t.pendingProps, e = a.revealOrder, n = a.tail;
    if (Dl(l, t, a.children, u), a = Tl.current, (a & 2) !== 0)
      a = a & 1 | 2, t.flags |= 128;
    else {
      if (l !== null && (l.flags & 128) !== 0)
        l: for (l = t.child; l !== null; ) {
          if (l.tag === 13)
            l.memoizedState !== null && Xo(l, u, t);
          else if (l.tag === 19)
            Xo(l, u, t);
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
          l = u.alternate, l !== null && cn(l) === null && (e = u), u = u.sibling;
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
          if (l = e.alternate, l !== null && cn(l) === null) {
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
    if (l !== null && (t.dependencies = l.dependencies), eu |= t.lanes, (u & t.childLanes) === 0)
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
      throw Error(s(153));
    if (t.child !== null) {
      for (l = t.child, u = Ut(l, l.pendingProps), t.child = u, u.return = t; l.sibling !== null; )
        l = l.sibling, u = u.sibling = Ut(l, l.pendingProps), u.return = t;
      u.sibling = null;
    }
    return t.child;
  }
  function vf(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && Le(l)));
  }
  function F0(l, t, u) {
    switch (t.tag) {
      case 3:
        ol(t, t.stateNode.containerInfo), wt(t, bl, l.memoizedState.cache), ja();
        break;
      case 27:
      case 5:
        Qn(t);
        break;
      case 4:
        ol(t, t.stateNode.containerInfo);
        break;
      case 10:
        wt(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (It(t), t.flags |= 128, null) : (u & t.child.childLanes) !== 0 ? Go(l, t, u) : (It(t), l = qt(
            l,
            t,
            u
          ), l !== null ? l.sibling : null);
        It(t);
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
            return Qo(
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
        return t.lanes = 0, Co(l, t, u);
      case 24:
        wt(t, bl, l.memoizedState.cache);
    }
    return qt(l, t, u);
  }
  function Zo(l, t, u) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        Ol = !0;
      else {
        if (!vf(l, u) && (t.flags & 128) === 0)
          return Ol = !1, F0(
            l,
            t,
            u
          );
        Ol = (l.flags & 131072) !== 0;
      }
    else
      Ol = !1, ll && (t.flags & 1048576) !== 0 && gs(t, Ve, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          l = t.pendingProps;
          var a = t.elementType, e = a._init;
          if (a = e(a._payload), t.type = a, typeof a == "function")
            Ec(a) ? (l = Uu(a, l), t.tag = 1, t = qo(
              null,
              t,
              a,
              l,
              u
            )) : (t.tag = 0, t = nf(
              null,
              t,
              a,
              l,
              u
            ));
          else {
            if (a != null) {
              if (e = a.$$typeof, e === Ql) {
                t.tag = 11, t = No(
                  null,
                  t,
                  a,
                  l,
                  u
                );
                break l;
              } else if (e === $l) {
                t.tag = 14, t = xo(
                  null,
                  t,
                  a,
                  l,
                  u
                );
                break l;
              }
            }
            throw t = yu(a) || a, Error(s(306, t, ""));
          }
        }
        return t;
      case 0:
        return nf(
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
        ), qo(
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
          ), l === null) throw Error(s(387));
          a = t.pendingProps;
          var n = t.memoizedState;
          e = n.element, Bc(l, t), Ka(t, a, null, u);
          var c = t.memoizedState;
          if (a = c.cache, wt(t, bl, a), a !== n.cache && Dc(
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
              t = Yo(
                l,
                t,
                a,
                u
              );
              break l;
            } else if (a !== e) {
              e = it(
                Error(s(424)),
                t
              ), qa(e), t = Yo(
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
              for (vl = St(l.firstChild), Yl = t, ll = !0, Ou = null, At = !0, u = To(
                t,
                null,
                a,
                u
              ), t.child = u; u; )
                u.flags = u.flags & -3 | 4096, u = u.sibling;
            }
          else {
            if (ja(), a === e) {
              t = qt(
                l,
                t,
                u
              );
              break l;
            }
            Dl(
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
        return on(l, t), l === null ? (u = Jr(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = u : ll || (u = t.type, l = t.pendingProps, a = Rn(
          Z.current
        ).createElement(u), a[Cl] = t, a[Zl] = l, Nl(a, u, l), pl(a), t.stateNode = a) : t.memoizedState = Jr(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return Qn(t), l === null && ll && (a = t.stateNode = Vr(
          t.type,
          t.pendingProps,
          Z.current
        ), Yl = t, At = !0, e = vl, iu(t.type) ? (wf = e, vl = St(
          a.firstChild
        )) : vl = e), Dl(
          l,
          t,
          t.pendingProps.children,
          u
        ), on(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && ll && ((e = a = vl) && (a = Rv(
          a,
          t.type,
          t.pendingProps,
          At
        ), a !== null ? (t.stateNode = a, Yl = t, vl = St(
          a.firstChild
        ), At = !1, e = !0) : e = !1), e || Ru(t)), Qn(t), e = t.type, n = t.pendingProps, c = l !== null ? l.memoizedProps : null, a = n.children, Vf(e, n) ? a = null : c !== null && Vf(e, c) && (t.flags |= 32), t.memoizedState !== null && (e = Qc(
          l,
          t,
          V0,
          null,
          null,
          u
        ), ve._currentValue = e), on(l, t), Dl(l, t, a, u), t.child;
      case 6:
        return l === null && ll && ((l = u = vl) && (u = zv(
          u,
          t.pendingProps,
          At
        ), u !== null ? (t.stateNode = u, Yl = t, vl = null, l = !0) : l = !1), l || Ru(t)), null;
      case 13:
        return Go(l, t, u);
      case 4:
        return ol(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, l === null ? t.child = ca(
          t,
          null,
          a,
          u
        ) : Dl(
          l,
          t,
          a,
          u
        ), t.child;
      case 11:
        return No(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 7:
        return Dl(
          l,
          t,
          t.pendingProps,
          u
        ), t.child;
      case 8:
        return Dl(
          l,
          t,
          t.pendingProps.children,
          u
        ), t.child;
      case 12:
        return Dl(
          l,
          t,
          t.pendingProps.children,
          u
        ), t.child;
      case 10:
        return a = t.pendingProps, wt(t, t.type, a.value), Dl(
          l,
          t,
          a.children,
          u
        ), t.child;
      case 9:
        return e = t.type._context, a = t.pendingProps.children, Mu(t), e = Bl(e), a = a(e), t.flags |= 1, Dl(l, t, a, u), t.child;
      case 14:
        return xo(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 15:
        return Ho(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 19:
        return Qo(l, t, u);
      case 31:
        return a = t.pendingProps, u = t.mode, a = {
          mode: a.mode,
          children: a.children
        }, l === null ? (u = rn(
          a,
          u
        ), u.ref = t.ref, t.child = u, u.return = t, t = u) : (u = Ut(l.child, a), u.ref = t.ref, t.child = u, u.return = t, t = u), t;
      case 22:
        return Co(l, t, u);
      case 24:
        return Mu(t), a = Bl(bl), l === null ? (e = xc(), e === null && (e = sl, n = Uc(), e.pooledCache = n, n.refCount++, n !== null && (e.pooledCacheLanes |= u), e = n), t.memoizedState = {
          parent: a,
          cache: e
        }, Cc(t), wt(t, bl, e)) : ((l.lanes & u) !== 0 && (Bc(l, t), Ka(t, null, null, u), La()), e = l.memoizedState, n = t.memoizedState, e.parent !== a ? (e = { parent: a, cache: a }, t.memoizedState = e, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = e), wt(t, bl, a)) : (a = n.cache, wt(t, bl, a), a !== e.cache && Dc(
          t,
          [bl],
          u,
          !0
        ))), Dl(
          l,
          t,
          t.pendingProps.children,
          u
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(s(156, t.tag));
  }
  function Yt(l) {
    l.flags |= 4;
  }
  function Vo(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !Fr(t)) {
      if (t = dt.current, t !== null && ((W & 4194048) === W ? pt !== null : (W & 62914560) !== W && (W & 536870912) === 0 || t !== pt))
        throw Za = Hc, Rs;
      l.flags |= 8192;
    }
  }
  function dn(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? Ti() : 536870912, l.lanes |= t, oa |= t);
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
  function dl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, u = 0, a = 0;
    if (t)
      for (var e = l.child; e !== null; )
        u |= e.lanes | e.childLanes, a |= e.subtreeFlags & 65011712, a |= e.flags & 65011712, e.return = l, e = e.sibling;
    else
      for (e = l.child; e !== null; )
        u |= e.lanes | e.childLanes, a |= e.subtreeFlags, a |= e.flags, e.return = l, e = e.sibling;
    return l.subtreeFlags |= a, l.childLanes = u, t;
  }
  function I0(l, t, u) {
    var a = t.pendingProps;
    switch (Rc(t), t.tag) {
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
        return dl(t), null;
      case 1:
        return dl(t), null;
      case 3:
        return u = t.stateNode, a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Ct(bl), Vt(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (l === null || l.child === null) && (Ba(t) ? Yt(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ts())), dl(t), null;
      case 26:
        return u = t.memoizedState, l === null ? (Yt(t), u !== null ? (dl(t), Vo(t, u)) : (dl(t), t.flags &= -16777217)) : u ? u !== l.memoizedState ? (Yt(t), dl(t), Vo(t, u)) : (dl(t), t.flags &= -16777217) : (l.memoizedProps !== a && Yt(t), dl(t), t.flags &= -16777217), null;
      case 27:
        Ae(t), u = Z.current;
        var e = t.type;
        if (l !== null && t.stateNode != null)
          l.memoizedProps !== a && Yt(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(s(166));
            return dl(t), null;
          }
          l = j.current, Ba(t) ? Ss(t) : (l = Vr(e, a, u), t.stateNode = l, Yt(t));
        }
        return dl(t), null;
      case 5:
        if (Ae(t), u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && Yt(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(s(166));
            return dl(t), null;
          }
          if (l = j.current, Ba(t))
            Ss(t);
          else {
            switch (e = Rn(
              Z.current
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
            l[Cl] = t, l[Zl] = a;
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
            l && Yt(t);
          }
        }
        return dl(t), t.flags &= -16777217, null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== a && Yt(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(s(166));
          if (l = Z.current, Ba(t)) {
            if (l = t.stateNode, u = t.memoizedProps, a = null, e = Yl, e !== null)
              switch (e.tag) {
                case 27:
                case 5:
                  a = e.memoizedProps;
              }
            l[Cl] = t, l = !!(l.nodeValue === u || a !== null && a.suppressHydrationWarning === !0 || jr(l.nodeValue, u)), l || Ru(t);
          } else
            l = Rn(l).createTextNode(
              a
            ), l[Cl] = t, t.stateNode = l;
        }
        return dl(t), null;
      case 13:
        if (a = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (e = Ba(t), a !== null && a.dehydrated !== null) {
            if (l === null) {
              if (!e) throw Error(s(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
              e[Cl] = t;
            } else
              ja(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            dl(t), e = !1;
          } else
            e = Ts(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e), e = !0;
          if (!e)
            return t.flags & 256 ? (jt(t), t) : (jt(t), null);
        }
        if (jt(t), (t.flags & 128) !== 0)
          return t.lanes = u, t;
        if (u = a !== null, l = l !== null && l.memoizedState !== null, u) {
          a = t.child, e = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (e = a.alternate.memoizedState.cachePool.pool);
          var n = null;
          a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool), n !== e && (a.flags |= 2048);
        }
        return u !== l && u && (t.child.flags |= 8192), dn(t, t.updateQueue), dl(t), null;
      case 4:
        return Vt(), l === null && Yf(t.stateNode.containerInfo), dl(t), null;
      case 10:
        return Ct(t.type), dl(t), null;
      case 19:
        if (N(Tl), e = t.memoizedState, e === null) return dl(t), null;
        if (a = (t.flags & 128) !== 0, n = e.rendering, n === null)
          if (a) Ia(e, !1);
          else {
            if (hl !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = cn(l), n !== null) {
                  for (t.flags |= 128, Ia(e, !1), l = n.updateQueue, t.updateQueue = l, dn(t, l), t.subtreeFlags = 0, l = u, u = t.child; u !== null; )
                    ms(u, l), u = u.sibling;
                  return _(
                    Tl,
                    Tl.current & 1 | 2
                  ), t.child;
                }
                l = l.sibling;
              }
            e.tail !== null && Et() > yn && (t.flags |= 128, a = !0, Ia(e, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (l = cn(n), l !== null) {
              if (t.flags |= 128, a = !0, l = l.updateQueue, t.updateQueue = l, dn(t, l), Ia(e, !0), e.tail === null && e.tailMode === "hidden" && !n.alternate && !ll)
                return dl(t), null;
            } else
              2 * Et() - e.renderingStartTime > yn && u !== 536870912 && (t.flags |= 128, a = !0, Ia(e, !1), t.lanes = 4194304);
          e.isBackwards ? (n.sibling = t.child, t.child = n) : (l = e.last, l !== null ? l.sibling = n : t.child = n, e.last = n);
        }
        return e.tail !== null ? (t = e.tail, e.rendering = t, e.tail = t.sibling, e.renderingStartTime = Et(), t.sibling = null, l = Tl.current, _(Tl, a ? l & 1 | 2 : l & 1), t) : (dl(t), null);
      case 22:
      case 23:
        return jt(t), Gc(), a = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (u & 536870912) !== 0 && (t.flags & 128) === 0 && (dl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : dl(t), u = t.updateQueue, u !== null && dn(t, u.retryQueue), u = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== u && (t.flags |= 2048), l !== null && N(_u), null;
      case 24:
        return u = null, l !== null && (u = l.memoizedState.cache), t.memoizedState.cache !== u && (t.flags |= 2048), Ct(bl), dl(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function P0(l, t) {
    switch (Rc(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return Ct(bl), Vt(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Ae(t), null;
      case 13:
        if (jt(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(s(340));
          ja();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return N(Tl), null;
      case 4:
        return Vt(), null;
      case 10:
        return Ct(t.type), null;
      case 22:
      case 23:
        return jt(t), Gc(), l !== null && N(_u), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return Ct(bl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Lo(l, t) {
    switch (Rc(t), t.tag) {
      case 3:
        Ct(bl), Vt();
        break;
      case 26:
      case 27:
      case 5:
        Ae(t);
        break;
      case 4:
        Vt();
        break;
      case 13:
        jt(t);
        break;
      case 19:
        N(Tl);
        break;
      case 10:
        Ct(t.type);
        break;
      case 22:
      case 23:
        jt(t), Gc(), l !== null && N(_u);
        break;
      case 24:
        Ct(bl);
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
  function lu(l, t, u) {
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
              var i = u, m = f;
              try {
                m();
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
  function Ko(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var u = l.stateNode;
      try {
        Ns(t, u);
      } catch (a) {
        il(l, l.return, a);
      }
    }
  }
  function Jo(l, t, u) {
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
  function Ot(l, t) {
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
  function wo(l) {
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
  function hf(l, t, u) {
    try {
      var a = l.stateNode;
      Tv(a, l.type, u, t), a[Zl] = t;
    } catch (e) {
      il(l, l.return, e);
    }
  }
  function $o(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && iu(l.type) || l.tag === 4;
  }
  function yf(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || $o(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && iu(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function mf(l, t, u) {
    var a = l.tag;
    if (a === 5 || a === 6)
      l = l.stateNode, t ? (u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u).insertBefore(l, t) : (t = u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u, t.appendChild(l), u = u._reactRootContainer, u != null || t.onclick !== null || (t.onclick = On));
    else if (a !== 4 && (a === 27 && iu(l.type) && (u = l.stateNode, t = null), l = l.child, l !== null))
      for (mf(l, t, u), l = l.sibling; l !== null; )
        mf(l, t, u), l = l.sibling;
  }
  function vn(l, t, u) {
    var a = l.tag;
    if (a === 5 || a === 6)
      l = l.stateNode, t ? u.insertBefore(l, t) : u.appendChild(l);
    else if (a !== 4 && (a === 27 && iu(l.type) && (u = l.stateNode), l = l.child, l !== null))
      for (vn(l, t, u), l = l.sibling; l !== null; )
        vn(l, t, u), l = l.sibling;
  }
  function ko(l) {
    var t = l.stateNode, u = l.memoizedProps;
    try {
      for (var a = l.type, e = t.attributes; e.length; )
        t.removeAttributeNode(e[0]);
      Nl(t, a, u), t[Cl] = l, t[Zl] = u;
    } catch (n) {
      il(l, l.return, n);
    }
  }
  var Gt = !1, ml = !1, gf = !1, Wo = typeof WeakSet == "function" ? WeakSet : Set, Rl = null;
  function lv(l, t) {
    if (l = l.containerInfo, Qf = Nn, l = cs(l), hc(l)) {
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
            var c = 0, f = -1, i = -1, m = 0, T = 0, p = l, g = null;
            t: for (; ; ) {
              for (var S; p !== u || e !== 0 && p.nodeType !== 3 || (f = c + e), p !== n || a !== 0 && p.nodeType !== 3 || (i = c + a), p.nodeType === 3 && (c += p.nodeValue.length), (S = p.firstChild) !== null; )
                g = p, p = S;
              for (; ; ) {
                if (p === l) break t;
                if (g === u && ++m === e && (f = c), g === n && ++T === a && (i = c), (S = p.nextSibling) !== null) break;
                p = g, g = p.parentNode;
              }
              p = S;
            }
            u = f === -1 || i === -1 ? null : { start: f, end: i };
          } else u = null;
        }
      u = u || { start: 0, end: 0 };
    } else u = null;
    for (Zf = { focusedElem: l, selectionRange: u }, Nn = !1, Rl = t; Rl !== null; )
      if (t = Rl, l = t.child, (t.subtreeFlags & 1024) !== 0 && l !== null)
        l.return = t, Rl = l;
      else
        for (; Rl !== null; ) {
          switch (t = Rl, n = t.alternate, l = t.flags, t.tag) {
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
                  Kf(l);
                else if (u === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Kf(l);
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
              if ((l & 1024) !== 0) throw Error(s(163));
          }
          if (l = t.sibling, l !== null) {
            l.return = t.return, Rl = l;
            break;
          }
          Rl = t.return;
        }
  }
  function Fo(l, t, u) {
    var a = u.flags;
    switch (u.tag) {
      case 0:
      case 11:
      case 15:
        tu(l, u), a & 4 && Pa(5, u);
        break;
      case 1:
        if (tu(l, u), a & 4)
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
        a & 64 && Ko(u), a & 512 && le(u, u.return);
        break;
      case 3:
        if (tu(l, u), a & 64 && (l = u.updateQueue, l !== null)) {
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
            Ns(l, t);
          } catch (c) {
            il(u, u.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && ko(u);
      case 26:
      case 5:
        tu(l, u), t === null && a & 4 && wo(u), a & 512 && le(u, u.return);
        break;
      case 12:
        tu(l, u);
        break;
      case 13:
        tu(l, u), a & 4 && lr(l, u), a & 64 && (l = u.memoizedState, l !== null && (l = l.dehydrated, l !== null && (u = sv.bind(
          null,
          u
        ), Mv(l, u))));
        break;
      case 22:
        if (a = u.memoizedState !== null || Gt, !a) {
          t = t !== null && t.memoizedState !== null || ml, e = Gt;
          var n = ml;
          Gt = a, (ml = t) && !n ? uu(
            l,
            u,
            (u.subtreeFlags & 8772) !== 0
          ) : tu(l, u), Gt = e, ml = n;
        }
        break;
      case 30:
        break;
      default:
        tu(l, u);
    }
  }
  function Io(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, Io(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && kn(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var rl = null, Kl = !1;
  function Xt(l, t, u) {
    for (u = u.child; u !== null; )
      Po(l, t, u), u = u.sibling;
  }
  function Po(l, t, u) {
    if (Fl && typeof Fl.onCommitFiberUnmount == "function")
      try {
        Fl.onCommitFiberUnmount(Ea, u);
      } catch {
      }
    switch (u.tag) {
      case 26:
        ml || Ot(u, t), Xt(
          l,
          t,
          u
        ), u.memoizedState ? u.memoizedState.count-- : u.stateNode && (u = u.stateNode, u.parentNode.removeChild(u));
        break;
      case 27:
        ml || Ot(u, t);
        var a = rl, e = Kl;
        iu(u.type) && (rl = u.stateNode, Kl = !1), Xt(
          l,
          t,
          u
        ), se(u.stateNode), rl = a, Kl = e;
        break;
      case 5:
        ml || Ot(u, t);
      case 6:
        if (a = rl, e = Kl, rl = null, Xt(
          l,
          t,
          u
        ), rl = a, Kl = e, rl !== null)
          if (Kl)
            try {
              (rl.nodeType === 9 ? rl.body : rl.nodeName === "HTML" ? rl.ownerDocument.body : rl).removeChild(u.stateNode);
            } catch (n) {
              il(
                u,
                t,
                n
              );
            }
          else
            try {
              rl.removeChild(u.stateNode);
            } catch (n) {
              il(
                u,
                t,
                n
              );
            }
        break;
      case 18:
        rl !== null && (Kl ? (l = rl, Qr(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          u.stateNode
        ), ge(l)) : Qr(rl, u.stateNode));
        break;
      case 4:
        a = rl, e = Kl, rl = u.stateNode.containerInfo, Kl = !0, Xt(
          l,
          t,
          u
        ), rl = a, Kl = e;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ml || lu(2, u, t), ml || lu(4, u, t), Xt(
          l,
          t,
          u
        );
        break;
      case 1:
        ml || (Ot(u, t), a = u.stateNode, typeof a.componentWillUnmount == "function" && Jo(
          u,
          t,
          a
        )), Xt(
          l,
          t,
          u
        );
        break;
      case 21:
        Xt(
          l,
          t,
          u
        );
        break;
      case 22:
        ml = (a = ml) || u.memoizedState !== null, Xt(
          l,
          t,
          u
        ), ml = a;
        break;
      default:
        Xt(
          l,
          t,
          u
        );
    }
  }
  function lr(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        ge(l);
      } catch (u) {
        il(t, t.return, u);
      }
  }
  function tv(l) {
    switch (l.tag) {
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new Wo()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new Wo()), t;
      default:
        throw Error(s(435, l.tag));
    }
  }
  function Sf(l, t) {
    var u = tv(l);
    t.forEach(function(a) {
      var e = ov.bind(null, l, a);
      u.has(a) || (u.add(a), a.then(e, e));
    });
  }
  function tt(l, t) {
    var u = t.deletions;
    if (u !== null)
      for (var a = 0; a < u.length; a++) {
        var e = u[a], n = l, c = t, f = c;
        l: for (; f !== null; ) {
          switch (f.tag) {
            case 27:
              if (iu(f.type)) {
                rl = f.stateNode, Kl = !1;
                break l;
              }
              break;
            case 5:
              rl = f.stateNode, Kl = !1;
              break l;
            case 3:
            case 4:
              rl = f.stateNode.containerInfo, Kl = !0;
              break l;
          }
          f = f.return;
        }
        if (rl === null) throw Error(s(160));
        Po(n, c, e), rl = null, Kl = !1, n = e.alternate, n !== null && (n.return = null), e.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        tr(t, l), t = t.sibling;
  }
  var gt = null;
  function tr(l, t) {
    var u = l.alternate, a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        tt(t, l), ut(l), a & 4 && (lu(3, l, l.return), Pa(3, l), lu(5, l, l.return));
        break;
      case 1:
        tt(t, l), ut(l), a & 512 && (ml || u === null || Ot(u, u.return)), a & 64 && Gt && (l = l.updateQueue, l !== null && (a = l.callbacks, a !== null && (u = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = u === null ? a : u.concat(a))));
        break;
      case 26:
        var e = gt;
        if (tt(t, l), ut(l), a & 512 && (ml || u === null || Ot(u, u.return)), a & 4) {
          var n = u !== null ? u.memoizedState : null;
          if (a = l.memoizedState, u === null)
            if (a === null)
              if (l.stateNode === null) {
                l: {
                  a = l.type, u = l.memoizedProps, e = e.ownerDocument || e;
                  t: switch (a) {
                    case "title":
                      n = e.getElementsByTagName("title")[0], (!n || n[Oa] || n[Cl] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = e.createElement(a), e.head.insertBefore(
                        n,
                        e.querySelector("head > title")
                      )), Nl(n, a, u), n[Cl] = l, pl(n), a = n;
                      break l;
                    case "link":
                      var c = kr(
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
                      if (c = kr(
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
                      throw Error(s(468, a));
                  }
                  n[Cl] = l, pl(n), a = n;
                }
                l.stateNode = a;
              } else
                Wr(
                  e,
                  l.type,
                  l.stateNode
                );
            else
              l.stateNode = $r(
                e,
                a,
                l.memoizedProps
              );
          else
            n !== a ? (n === null ? u.stateNode !== null && (u = u.stateNode, u.parentNode.removeChild(u)) : n.count--, a === null ? Wr(
              e,
              l.type,
              l.stateNode
            ) : $r(
              e,
              a,
              l.memoizedProps
            )) : a === null && l.stateNode !== null && hf(
              l,
              l.memoizedProps,
              u.memoizedProps
            );
        }
        break;
      case 27:
        tt(t, l), ut(l), a & 512 && (ml || u === null || Ot(u, u.return)), u !== null && a & 4 && hf(
          l,
          l.memoizedProps,
          u.memoizedProps
        );
        break;
      case 5:
        if (tt(t, l), ut(l), a & 512 && (ml || u === null || Ot(u, u.return)), l.flags & 32) {
          e = l.stateNode;
          try {
            Zu(e, "");
          } catch (S) {
            il(l, l.return, S);
          }
        }
        a & 4 && l.stateNode != null && (e = l.memoizedProps, hf(
          l,
          e,
          u !== null ? u.memoizedProps : e
        )), a & 1024 && (gf = !0);
        break;
      case 6:
        if (tt(t, l), ut(l), a & 4) {
          if (l.stateNode === null)
            throw Error(s(162));
          a = l.memoizedProps, u = l.stateNode;
          try {
            u.nodeValue = a;
          } catch (S) {
            il(l, l.return, S);
          }
        }
        break;
      case 3:
        if (_n = null, e = gt, gt = zn(t.containerInfo), tt(t, l), gt = e, ut(l), a & 4 && u !== null && u.memoizedState.isDehydrated)
          try {
            ge(t.containerInfo);
          } catch (S) {
            il(l, l.return, S);
          }
        gf && (gf = !1, ur(l));
        break;
      case 4:
        a = gt, gt = zn(
          l.stateNode.containerInfo
        ), tt(t, l), ut(l), gt = a;
        break;
      case 12:
        tt(t, l), ut(l);
        break;
      case 13:
        tt(t, l), ut(l), l.child.flags & 8192 && l.memoizedState !== null != (u !== null && u.memoizedState !== null) && (Of = Et()), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, Sf(l, a)));
        break;
      case 22:
        e = l.memoizedState !== null;
        var i = u !== null && u.memoizedState !== null, m = Gt, T = ml;
        if (Gt = m || e, ml = T || i, tt(t, l), ml = T, Gt = m, ut(l), a & 8192)
          l: for (t = l.stateNode, t._visibility = e ? t._visibility & -2 : t._visibility | 1, e && (u === null || i || Gt || ml || Nu(l)), u = null, t = l; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (u === null) {
                i = u = t;
                try {
                  if (n = i.stateNode, e)
                    c = n.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    f = i.stateNode;
                    var p = i.memoizedProps.style, g = p != null && p.hasOwnProperty("display") ? p.display : null;
                    f.style.display = g == null || typeof g == "boolean" ? "" : ("" + g).trim();
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
        a & 4 && (a = l.updateQueue, a !== null && (u = a.retryQueue, u !== null && (a.retryQueue = null, Sf(l, u))));
        break;
      case 19:
        tt(t, l), ut(l), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, Sf(l, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        tt(t, l), ut(l);
    }
  }
  function ut(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var u, a = l.return; a !== null; ) {
          if ($o(a)) {
            u = a;
            break;
          }
          a = a.return;
        }
        if (u == null) throw Error(s(160));
        switch (u.tag) {
          case 27:
            var e = u.stateNode, n = yf(l);
            vn(l, n, e);
            break;
          case 5:
            var c = u.stateNode;
            u.flags & 32 && (Zu(c, ""), u.flags &= -33);
            var f = yf(l);
            vn(l, f, c);
            break;
          case 3:
          case 4:
            var i = u.stateNode.containerInfo, m = yf(l);
            mf(
              l,
              m,
              i
            );
            break;
          default:
            throw Error(s(161));
        }
      } catch (T) {
        il(l, l.return, T);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function ur(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        ur(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), l = l.sibling;
      }
  }
  function tu(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Fo(l, t.alternate, t), t = t.sibling;
  }
  function Nu(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          lu(4, t, t.return), Nu(t);
          break;
        case 1:
          Ot(t, t.return);
          var u = t.stateNode;
          typeof u.componentWillUnmount == "function" && Jo(
            t,
            t.return,
            u
          ), Nu(t);
          break;
        case 27:
          se(t.stateNode);
        case 26:
        case 5:
          Ot(t, t.return), Nu(t);
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
  function uu(l, t, u) {
    for (u = u && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, e = l, n = t, c = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          uu(
            e,
            n,
            u
          ), Pa(4, n);
          break;
        case 1:
          if (uu(
            e,
            n,
            u
          ), a = n, e = a.stateNode, typeof e.componentDidMount == "function")
            try {
              e.componentDidMount();
            } catch (m) {
              il(a, a.return, m);
            }
          if (a = n, e = a.updateQueue, e !== null) {
            var f = a.stateNode;
            try {
              var i = e.shared.hiddenCallbacks;
              if (i !== null)
                for (e.shared.hiddenCallbacks = null, e = 0; e < i.length; e++)
                  Us(i[e], f);
            } catch (m) {
              il(a, a.return, m);
            }
          }
          u && c & 64 && Ko(n), le(n, n.return);
          break;
        case 27:
          ko(n);
        case 26:
        case 5:
          uu(
            e,
            n,
            u
          ), u && a === null && c & 4 && wo(n), le(n, n.return);
          break;
        case 12:
          uu(
            e,
            n,
            u
          );
          break;
        case 13:
          uu(
            e,
            n,
            u
          ), u && c & 4 && lr(e, n);
          break;
        case 22:
          n.memoizedState === null && uu(
            e,
            n,
            u
          ), le(n, n.return);
          break;
        case 30:
          break;
        default:
          uu(
            e,
            n,
            u
          );
      }
      t = t.sibling;
    }
  }
  function bf(l, t) {
    var u = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== u && (l != null && l.refCount++, u != null && Ga(u));
  }
  function Tf(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Ga(l));
  }
  function Rt(l, t, u, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        ar(
          l,
          t,
          u,
          a
        ), t = t.sibling;
  }
  function ar(l, t, u, a) {
    var e = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Rt(
          l,
          t,
          u,
          a
        ), e & 2048 && Pa(9, t);
        break;
      case 1:
        Rt(
          l,
          t,
          u,
          a
        );
        break;
      case 3:
        Rt(
          l,
          t,
          u,
          a
        ), e & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Ga(l)));
        break;
      case 12:
        if (e & 2048) {
          Rt(
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
          Rt(
            l,
            t,
            u,
            a
          );
        break;
      case 13:
        Rt(
          l,
          t,
          u,
          a
        );
        break;
      case 23:
        break;
      case 22:
        n = t.stateNode, c = t.alternate, t.memoizedState !== null ? n._visibility & 2 ? Rt(
          l,
          t,
          u,
          a
        ) : te(l, t) : n._visibility & 2 ? Rt(
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
        )), e & 2048 && bf(c, t);
        break;
      case 24:
        Rt(
          l,
          t,
          u,
          a
        ), e & 2048 && Tf(t.alternate, t);
        break;
      default:
        Rt(
          l,
          t,
          u,
          a
        );
    }
  }
  function fa(l, t, u, a, e) {
    for (e = e && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var n = l, c = t, f = u, i = a, m = c.flags;
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
          )), e && m & 2048 && bf(
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
          ), e && m & 2048 && Tf(c.alternate, c);
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
            te(u, a), e & 2048 && bf(
              a.alternate,
              a
            );
            break;
          case 24:
            te(u, a), e & 2048 && Tf(a.alternate, a);
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
        er(l), l = l.sibling;
  }
  function er(l) {
    switch (l.tag) {
      case 26:
        ia(l), l.flags & ue && l.memoizedState !== null && Xv(
          gt,
          l.memoizedState,
          l.memoizedProps
        );
        break;
      case 5:
        ia(l);
        break;
      case 3:
      case 4:
        var t = gt;
        gt = zn(l.stateNode.containerInfo), ia(l), gt = t;
        break;
      case 22:
        l.memoizedState === null && (t = l.alternate, t !== null && t.memoizedState !== null ? (t = ue, ue = 16777216, ia(l), ue = t) : ia(l));
        break;
      default:
        ia(l);
    }
  }
  function nr(l) {
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
          Rl = a, fr(
            a,
            l
          );
        }
      nr(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        cr(l), l = l.sibling;
  }
  function cr(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        ae(l), l.flags & 2048 && lu(9, l, l.return);
        break;
      case 3:
        ae(l);
        break;
      case 12:
        ae(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, hn(l)) : ae(l);
        break;
      default:
        ae(l);
    }
  }
  function hn(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var u = 0; u < t.length; u++) {
          var a = t[u];
          Rl = a, fr(
            a,
            l
          );
        }
      nr(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          lu(8, t, t.return), hn(t);
          break;
        case 22:
          u = t.stateNode, u._visibility & 2 && (u._visibility &= -3, hn(t));
          break;
        default:
          hn(t);
      }
      l = l.sibling;
    }
  }
  function fr(l, t) {
    for (; Rl !== null; ) {
      var u = Rl;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          lu(8, u, t);
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
      if (a = u.child, a !== null) a.return = u, Rl = a;
      else
        l: for (u = l; Rl !== null; ) {
          a = Rl;
          var e = a.sibling, n = a.return;
          if (Io(a), a === u) {
            Rl = null;
            break l;
          }
          if (e !== null) {
            e.return = n, Rl = e;
            break l;
          }
          Rl = n;
        }
    }
  }
  var uv = {
    getCacheForType: function(l) {
      var t = Bl(bl), u = t.data.get(l);
      return u === void 0 && (u = l(), t.data.set(l, u)), u;
    }
  }, av = typeof WeakMap == "function" ? WeakMap : Map, ul = 0, sl = null, J = null, W = 0, al = 0, at = null, au = !1, sa = !1, Ef = !1, Qt = 0, hl = 0, eu = 0, xu = 0, Af = 0, vt = 0, oa = 0, ee = null, Jl = null, pf = !1, Of = 0, yn = 1 / 0, mn = null, nu = null, Ul = 0, cu = null, ra = null, da = 0, Rf = 0, zf = null, ir = null, ne = 0, Mf = null;
  function et() {
    if ((ul & 2) !== 0 && W !== 0)
      return W & -W;
    if (E.T !== null) {
      var l = Pu;
      return l !== 0 ? l : Cf();
    }
    return pi();
  }
  function sr() {
    vt === 0 && (vt = (W & 536870912) === 0 || ll ? bi() : 536870912);
    var l = dt.current;
    return l !== null && (l.flags |= 32), vt;
  }
  function nt(l, t, u) {
    (l === sl && (al === 2 || al === 9) || l.cancelPendingCommit !== null) && (va(l, 0), fu(
      l,
      W,
      vt,
      !1
    )), pa(l, u), ((ul & 2) === 0 || l !== sl) && (l === sl && ((ul & 2) === 0 && (xu |= u), hl === 4 && fu(
      l,
      W,
      vt,
      !1
    )), zt(l));
  }
  function or(l, t, u) {
    if ((ul & 6) !== 0) throw Error(s(327));
    var a = !u && (t & 124) === 0 && (t & l.expiredLanes) === 0 || Aa(l, t), e = a ? cv(l, t) : Uf(l, t, !0), n = a;
    do {
      if (e === 0) {
        sa && !a && fu(l, t, 0, !1);
        break;
      } else {
        if (u = l.current.alternate, n && !ev(u)) {
          e = Uf(l, t, !1), n = !1;
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
              if (i && (va(f, c).flags |= 256), c = Uf(
                f,
                c,
                !1
              ), c !== 2) {
                if (Ef && !i) {
                  f.errorRecoveryDisabledLanes |= n, xu |= n, e = 4;
                  break l;
                }
                n = Jl, Jl = e, n !== null && (Jl === null ? Jl = n : Jl.push.apply(
                  Jl,
                  n
                ));
              }
              e = c;
            }
            if (n = !1, e !== 2) continue;
          }
        }
        if (e === 1) {
          va(l, 0), fu(l, t, 0, !0);
          break;
        }
        l: {
          switch (a = l, n = e, n) {
            case 0:
            case 1:
              throw Error(s(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              fu(
                a,
                t,
                vt,
                !au
              );
              break l;
            case 2:
              Jl = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(s(329));
          }
          if ((t & 62914560) === t && (e = Of + 300 - Et(), 10 < e)) {
            if (fu(
              a,
              t,
              vt,
              !au
            ), ze(a, 0, !0) !== 0) break l;
            a.timeoutHandle = Gr(
              rr.bind(
                null,
                a,
                u,
                Jl,
                mn,
                pf,
                t,
                vt,
                xu,
                oa,
                au,
                n,
                2,
                -0,
                0
              ),
              e
            );
            break l;
          }
          rr(
            a,
            u,
            Jl,
            mn,
            pf,
            t,
            vt,
            xu,
            oa,
            au,
            n,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    zt(l);
  }
  function rr(l, t, u, a, e, n, c, f, i, m, T, p, g, S) {
    if (l.timeoutHandle = -1, p = t.subtreeFlags, (p & 8192 || (p & 16785408) === 16785408) && (de = { stylesheets: null, count: 0, unsuspend: Gv }, er(t), p = Qv(), p !== null)) {
      l.cancelPendingCommit = p(
        Sr.bind(
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
          g,
          S
        )
      ), fu(l, n, c, !m);
      return;
    }
    Sr(
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
  function ev(l) {
    for (var t = l; ; ) {
      var u = t.tag;
      if ((u === 0 || u === 11 || u === 15) && t.flags & 16384 && (u = t.updateQueue, u !== null && (u = u.stores, u !== null)))
        for (var a = 0; a < u.length; a++) {
          var e = u[a], n = e.getSnapshot;
          e = e.value;
          try {
            if (!Pl(n(), e)) return !1;
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
  function fu(l, t, u, a) {
    t &= ~Af, t &= ~xu, l.suspendedLanes |= t, l.pingedLanes &= ~t, a && (l.warmLanes |= t), a = l.expirationTimes;
    for (var e = t; 0 < e; ) {
      var n = 31 - Il(e), c = 1 << n;
      a[n] = -1, e &= ~c;
    }
    u !== 0 && Ei(l, u, t);
  }
  function gn() {
    return (ul & 6) === 0 ? (ce(0), !1) : !0;
  }
  function _f() {
    if (J !== null) {
      if (al === 0)
        var l = J.return;
      else
        l = J, Ht = zu = null, Lc(l), na = null, Wa = 0, l = J;
      for (; l !== null; )
        Lo(l.alternate, l), l = l.return;
      J = null;
    }
  }
  function va(l, t) {
    var u = l.timeoutHandle;
    u !== -1 && (l.timeoutHandle = -1, Av(u)), u = l.cancelPendingCommit, u !== null && (l.cancelPendingCommit = null, u()), _f(), sl = l, J = u = Ut(l.current, null), W = t, al = 0, at = null, au = !1, sa = Aa(l, t), Ef = !1, oa = vt = Af = xu = eu = hl = 0, Jl = ee = null, pf = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = l.entangledLanes;
    if (a !== 0)
      for (l = l.entanglements, a &= t; 0 < a; ) {
        var e = 31 - Il(a), n = 1 << e;
        t |= l[e], a &= ~n;
      }
    return Qt = t, Ye(), u;
  }
  function dr(l, t) {
    L = null, E.H = an, t === Qa || t === we ? (t = _s(), al = 3) : t === Rs ? (t = _s(), al = 4) : al = t === Uo ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, at = t, J === null && (hl = 1, sn(
      l,
      it(t, l.current)
    ));
  }
  function vr() {
    var l = E.H;
    return E.H = an, l === null ? an : l;
  }
  function hr() {
    var l = E.A;
    return E.A = uv, l;
  }
  function Df() {
    hl = 4, au || (W & 4194048) !== W && dt.current !== null || (sa = !0), (eu & 134217727) === 0 && (xu & 134217727) === 0 || sl === null || fu(
      sl,
      W,
      vt,
      !1
    );
  }
  function Uf(l, t, u) {
    var a = ul;
    ul |= 2;
    var e = vr(), n = hr();
    (sl !== l || W !== t) && (mn = null, va(l, t)), t = !1;
    var c = hl;
    l: do
      try {
        if (al !== 0 && J !== null) {
          var f = J, i = at;
          switch (al) {
            case 8:
              _f(), c = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              dt.current === null && (t = !0);
              var m = al;
              if (al = 0, at = null, ha(l, f, i, m), u && sa) {
                c = 0;
                break l;
              }
              break;
            default:
              m = al, al = 0, at = null, ha(l, f, i, m);
          }
        }
        nv(), c = hl;
        break;
      } catch (T) {
        dr(l, T);
      }
    while (!0);
    return t && l.shellSuspendCounter++, Ht = zu = null, ul = a, E.H = e, E.A = n, J === null && (sl = null, W = 0, Ye()), c;
  }
  function nv() {
    for (; J !== null; ) yr(J);
  }
  function cv(l, t) {
    var u = ul;
    ul |= 2;
    var a = vr(), e = hr();
    sl !== l || W !== t ? (mn = null, yn = Et() + 500, va(l, t)) : sa = Aa(
      l,
      t
    );
    l: do
      try {
        if (al !== 0 && J !== null) {
          t = J;
          var n = at;
          t: switch (al) {
            case 1:
              al = 0, at = null, ha(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (zs(n)) {
                al = 0, at = null, mr(t);
                break;
              }
              t = function() {
                al !== 2 && al !== 9 || sl !== l || (al = 7), zt(l);
              }, n.then(t, t);
              break l;
            case 3:
              al = 7;
              break l;
            case 4:
              al = 5;
              break l;
            case 7:
              zs(n) ? (al = 0, at = null, mr(t)) : (al = 0, at = null, ha(l, t, n, 7));
              break;
            case 5:
              var c = null;
              switch (J.tag) {
                case 26:
                  c = J.memoizedState;
                case 5:
                case 27:
                  var f = J;
                  if (!c || Fr(c)) {
                    al = 0, at = null;
                    var i = f.sibling;
                    if (i !== null) J = i;
                    else {
                      var m = f.return;
                      m !== null ? (J = m, Sn(m)) : J = null;
                    }
                    break t;
                  }
              }
              al = 0, at = null, ha(l, t, n, 5);
              break;
            case 6:
              al = 0, at = null, ha(l, t, n, 6);
              break;
            case 8:
              _f(), hl = 6;
              break l;
            default:
              throw Error(s(462));
          }
        }
        fv();
        break;
      } catch (T) {
        dr(l, T);
      }
    while (!0);
    return Ht = zu = null, E.H = a, E.A = e, ul = u, J !== null ? 0 : (sl = null, W = 0, Ye(), hl);
  }
  function fv() {
    for (; J !== null && !Dd(); )
      yr(J);
  }
  function yr(l) {
    var t = Zo(l.alternate, l, Qt);
    l.memoizedProps = l.pendingProps, t === null ? Sn(l) : J = t;
  }
  function mr(l) {
    var t = l, u = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = jo(
          u,
          t,
          t.pendingProps,
          t.type,
          void 0,
          W
        );
        break;
      case 11:
        t = jo(
          u,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          W
        );
        break;
      case 5:
        Lc(t);
      default:
        Lo(u, t), t = J = ms(t, Qt), t = Zo(u, t, Qt);
    }
    l.memoizedProps = l.pendingProps, t === null ? Sn(l) : J = t;
  }
  function ha(l, t, u, a) {
    Ht = zu = null, Lc(t), na = null, Wa = 0;
    var e = t.return;
    try {
      if (W0(
        l,
        e,
        t,
        u,
        W
      )) {
        hl = 1, sn(
          l,
          it(u, l.current)
        ), J = null;
        return;
      }
    } catch (n) {
      if (e !== null) throw J = e, n;
      hl = 1, sn(
        l,
        it(u, l.current)
      ), J = null;
      return;
    }
    t.flags & 32768 ? (ll || a === 1 ? l = !0 : sa || (W & 536870912) !== 0 ? l = !1 : (au = l = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = dt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), gr(t, l)) : Sn(t);
  }
  function Sn(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        gr(
          t,
          au
        );
        return;
      }
      l = t.return;
      var u = I0(
        t.alternate,
        t,
        Qt
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
  function gr(l, t) {
    do {
      var u = P0(l.alternate, l);
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
  function Sr(l, t, u, a, e, n, c, f, i) {
    l.cancelPendingCommit = null;
    do
      bn();
    while (Ul !== 0);
    if ((ul & 6) !== 0) throw Error(s(327));
    if (t !== null) {
      if (t === l.current) throw Error(s(177));
      if (n = t.lanes | t.childLanes, n |= bc, Gd(
        l,
        u,
        n,
        c,
        f,
        i
      ), l === sl && (J = sl = null, W = 0), ra = t, cu = l, da = u, Rf = n, zf = e, ir = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, rv(pe, function() {
        return pr(), null;
      })) : (l.callbackNode = null, l.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = E.T, E.T = null, e = D.p, D.p = 2, c = ul, ul |= 4;
        try {
          lv(l, t, u);
        } finally {
          ul = c, D.p = e, E.T = a;
        }
      }
      Ul = 1, br(), Tr(), Er();
    }
  }
  function br() {
    if (Ul === 1) {
      Ul = 0;
      var l = cu, t = ra, u = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || u) {
        u = E.T, E.T = null;
        var a = D.p;
        D.p = 2;
        var e = ul;
        ul |= 4;
        try {
          tr(t, l);
          var n = Zf, c = cs(l.containerInfo), f = n.focusedElem, i = n.selectionRange;
          if (c !== f && f && f.ownerDocument && ns(
            f.ownerDocument.documentElement,
            f
          )) {
            if (i !== null && hc(f)) {
              var m = i.start, T = i.end;
              if (T === void 0 && (T = m), "selectionStart" in f)
                f.selectionStart = m, f.selectionEnd = Math.min(
                  T,
                  f.value.length
                );
              else {
                var p = f.ownerDocument || document, g = p && p.defaultView || window;
                if (g.getSelection) {
                  var S = g.getSelection(), X = f.textContent.length, q = Math.min(i.start, X), cl = i.end === void 0 ? q : Math.min(i.end, X);
                  !S.extend && q > cl && (c = cl, cl = q, q = c);
                  var h = es(
                    f,
                    q
                  ), r = es(
                    f,
                    cl
                  );
                  if (h && r && (S.rangeCount !== 1 || S.anchorNode !== h.node || S.anchorOffset !== h.offset || S.focusNode !== r.node || S.focusOffset !== r.offset)) {
                    var y = p.createRange();
                    y.setStart(h.node, h.offset), S.removeAllRanges(), q > cl ? (S.addRange(y), S.extend(r.node, r.offset)) : (y.setEnd(r.node, r.offset), S.addRange(y));
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
          Nn = !!Qf, Zf = Qf = null;
        } finally {
          ul = e, D.p = a, E.T = u;
        }
      }
      l.current = t, Ul = 2;
    }
  }
  function Tr() {
    if (Ul === 2) {
      Ul = 0;
      var l = cu, t = ra, u = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || u) {
        u = E.T, E.T = null;
        var a = D.p;
        D.p = 2;
        var e = ul;
        ul |= 4;
        try {
          Fo(l, t.alternate, t);
        } finally {
          ul = e, D.p = a, E.T = u;
        }
      }
      Ul = 3;
    }
  }
  function Er() {
    if (Ul === 4 || Ul === 3) {
      Ul = 0, Ud();
      var l = cu, t = ra, u = da, a = ir;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Ul = 5 : (Ul = 0, ra = cu = null, Ar(l, l.pendingLanes));
      var e = l.pendingLanes;
      if (e === 0 && (nu = null), wn(u), t = t.stateNode, Fl && typeof Fl.onCommitFiberRoot == "function")
        try {
          Fl.onCommitFiberRoot(
            Ea,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = E.T, e = D.p, D.p = 2, E.T = null;
        try {
          for (var n = l.onRecoverableError, c = 0; c < a.length; c++) {
            var f = a[c];
            n(f.value, {
              componentStack: f.stack
            });
          }
        } finally {
          E.T = t, D.p = e;
        }
      }
      (da & 3) !== 0 && bn(), zt(l), e = l.pendingLanes, (u & 4194090) !== 0 && (e & 42) !== 0 ? l === Mf ? ne++ : (ne = 0, Mf = l) : ne = 0, ce(0);
    }
  }
  function Ar(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, Ga(t)));
  }
  function bn(l) {
    return br(), Tr(), Er(), pr();
  }
  function pr() {
    if (Ul !== 5) return !1;
    var l = cu, t = Rf;
    Rf = 0;
    var u = wn(da), a = E.T, e = D.p;
    try {
      D.p = 32 > u ? 32 : u, E.T = null, u = zf, zf = null;
      var n = cu, c = da;
      if (Ul = 0, ra = cu = null, da = 0, (ul & 6) !== 0) throw Error(s(331));
      var f = ul;
      if (ul |= 4, cr(n.current), ar(
        n,
        n.current,
        c,
        u
      ), ul = f, ce(0, !1), Fl && typeof Fl.onPostCommitFiberRoot == "function")
        try {
          Fl.onPostCommitFiberRoot(Ea, n);
        } catch {
        }
      return !0;
    } finally {
      D.p = e, E.T = a, Ar(l, t);
    }
  }
  function Or(l, t, u) {
    t = it(u, t), t = ef(l.stateNode, t, 2), l = Wt(l, t, 2), l !== null && (pa(l, 2), zt(l));
  }
  function il(l, t, u) {
    if (l.tag === 3)
      Or(l, l, u);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Or(
            t,
            l,
            u
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (nu === null || !nu.has(a))) {
            l = it(u, l), u = _o(2), a = Wt(t, u, 2), a !== null && (Do(
              u,
              a,
              t,
              l
            ), pa(a, 2), zt(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Nf(l, t, u) {
    var a = l.pingCache;
    if (a === null) {
      a = l.pingCache = new av();
      var e = /* @__PURE__ */ new Set();
      a.set(t, e);
    } else
      e = a.get(t), e === void 0 && (e = /* @__PURE__ */ new Set(), a.set(t, e));
    e.has(u) || (Ef = !0, e.add(u), l = iv.bind(null, l, t, u), t.then(l, l));
  }
  function iv(l, t, u) {
    var a = l.pingCache;
    a !== null && a.delete(t), l.pingedLanes |= l.suspendedLanes & u, l.warmLanes &= ~u, sl === l && (W & u) === u && (hl === 4 || hl === 3 && (W & 62914560) === W && 300 > Et() - Of ? (ul & 2) === 0 && va(l, 0) : Af |= u, oa === W && (oa = 0)), zt(l);
  }
  function Rr(l, t) {
    t === 0 && (t = Ti()), l = ku(l, t), l !== null && (pa(l, t), zt(l));
  }
  function sv(l) {
    var t = l.memoizedState, u = 0;
    t !== null && (u = t.retryLane), Rr(l, u);
  }
  function ov(l, t) {
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
        throw Error(s(314));
    }
    a !== null && a.delete(t), Rr(l, u);
  }
  function rv(l, t) {
    return Vn(l, t);
  }
  var Tn = null, ya = null, xf = !1, En = !1, Hf = !1, Hu = 0;
  function zt(l) {
    l !== ya && l.next === null && (ya === null ? Tn = ya = l : ya = ya.next = l), En = !0, xf || (xf = !0, vv());
  }
  function ce(l, t) {
    if (!Hf && En) {
      Hf = !0;
      do
        for (var u = !1, a = Tn; a !== null; ) {
          if (l !== 0) {
            var e = a.pendingLanes;
            if (e === 0) var n = 0;
            else {
              var c = a.suspendedLanes, f = a.pingedLanes;
              n = (1 << 31 - Il(42 | l) + 1) - 1, n &= e & ~(c & ~f), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (u = !0, Dr(a, n));
          } else
            n = W, n = ze(
              a,
              a === sl ? n : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (n & 3) === 0 || Aa(a, n) || (u = !0, Dr(a, n));
          a = a.next;
        }
      while (u);
      Hf = !1;
    }
  }
  function dv() {
    zr();
  }
  function zr() {
    En = xf = !1;
    var l = 0;
    Hu !== 0 && (Ev() && (l = Hu), Hu = 0);
    for (var t = Et(), u = null, a = Tn; a !== null; ) {
      var e = a.next, n = Mr(a, t);
      n === 0 ? (a.next = null, u === null ? Tn = e : u.next = e, e === null && (ya = u)) : (u = a, (l !== 0 || (n & 3) !== 0) && (En = !0)), a = e;
    }
    ce(l);
  }
  function Mr(l, t) {
    for (var u = l.suspendedLanes, a = l.pingedLanes, e = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var c = 31 - Il(n), f = 1 << c, i = e[c];
      i === -1 ? ((f & u) === 0 || (f & a) !== 0) && (e[c] = Yd(f, t)) : i <= t && (l.expiredLanes |= f), n &= ~f;
    }
    if (t = sl, u = W, u = ze(
      l,
      l === t ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a = l.callbackNode, u === 0 || l === t && (al === 2 || al === 9) || l.cancelPendingCommit !== null)
      return a !== null && a !== null && Ln(a), l.callbackNode = null, l.callbackPriority = 0;
    if ((u & 3) === 0 || Aa(l, u)) {
      if (t = u & -u, t === l.callbackPriority) return t;
      switch (a !== null && Ln(a), wn(u)) {
        case 2:
        case 8:
          u = gi;
          break;
        case 32:
          u = pe;
          break;
        case 268435456:
          u = Si;
          break;
        default:
          u = pe;
      }
      return a = _r.bind(null, l), u = Vn(u, a), l.callbackPriority = t, l.callbackNode = u, t;
    }
    return a !== null && a !== null && Ln(a), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function _r(l, t) {
    if (Ul !== 0 && Ul !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var u = l.callbackNode;
    if (bn() && l.callbackNode !== u)
      return null;
    var a = W;
    return a = ze(
      l,
      l === sl ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a === 0 ? null : (or(l, a, t), Mr(l, Et()), l.callbackNode != null && l.callbackNode === u ? _r.bind(null, l) : null);
  }
  function Dr(l, t) {
    if (bn()) return null;
    or(l, t, !0);
  }
  function vv() {
    pv(function() {
      (ul & 6) !== 0 ? Vn(
        mi,
        dv
      ) : zr();
    });
  }
  function Cf() {
    return Hu === 0 && (Hu = bi()), Hu;
  }
  function Ur(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : Ne("" + l);
  }
  function Nr(l, t) {
    var u = t.ownerDocument.createElement("input");
    return u.name = t.name, u.value = t.value, l.id && u.setAttribute("form", l.id), t.parentNode.insertBefore(u, t), l = new FormData(l), u.parentNode.removeChild(u), l;
  }
  function hv(l, t, u, a, e) {
    if (t === "submit" && u && u.stateNode === e) {
      var n = Ur(
        (e[Zl] || null).action
      ), c = a.submitter;
      c && (t = (t = c[Zl] || null) ? Ur(t.formAction) : c.getAttribute("formAction"), t !== null && (n = t, c = null));
      var f = new Be(
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
                  var i = c ? Nr(e, c) : new FormData(e);
                  Pc(
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
                typeof n == "function" && (f.preventDefault(), i = c ? Nr(e, c) : new FormData(e), Pc(
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
  for (var Bf = 0; Bf < Sc.length; Bf++) {
    var jf = Sc[Bf], yv = jf.toLowerCase(), mv = jf[0].toUpperCase() + jf.slice(1);
    mt(
      yv,
      "on" + mv
    );
  }
  mt(ss, "onAnimationEnd"), mt(os, "onAnimationIteration"), mt(rs, "onAnimationStart"), mt("dblclick", "onDoubleClick"), mt("focusin", "onFocus"), mt("focusout", "onBlur"), mt(H0, "onTransitionRun"), mt(C0, "onTransitionStart"), mt(B0, "onTransitionCancel"), mt(ds, "onTransitionEnd"), Gu("onMouseEnter", ["mouseout", "mouseover"]), Gu("onMouseLeave", ["mouseout", "mouseover"]), Gu("onPointerEnter", ["pointerout", "pointerover"]), Gu("onPointerLeave", ["pointerout", "pointerover"]), gu(
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
  ), gv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(fe)
  );
  function xr(l, t) {
    t = (t & 4) !== 0;
    for (var u = 0; u < l.length; u++) {
      var a = l[u], e = a.event;
      a = a.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var c = a.length - 1; 0 <= c; c--) {
            var f = a[c], i = f.instance, m = f.currentTarget;
            if (f = f.listener, i !== n && e.isPropagationStopped())
              break l;
            n = f, e.currentTarget = m;
            try {
              n(e);
            } catch (T) {
              fn(T);
            }
            e.currentTarget = null, n = i;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (f = a[c], i = f.instance, m = f.currentTarget, f = f.listener, i !== n && e.isPropagationStopped())
              break l;
            n = f, e.currentTarget = m;
            try {
              n(e);
            } catch (T) {
              fn(T);
            }
            e.currentTarget = null, n = i;
          }
      }
    }
  }
  function w(l, t) {
    var u = t[$n];
    u === void 0 && (u = t[$n] = /* @__PURE__ */ new Set());
    var a = l + "__bubble";
    u.has(a) || (Hr(t, l, 2, !1), u.add(a));
  }
  function qf(l, t, u) {
    var a = 0;
    t && (a |= 4), Hr(
      u,
      l,
      a,
      t
    );
  }
  var An = "_reactListening" + Math.random().toString(36).slice(2);
  function Yf(l) {
    if (!l[An]) {
      l[An] = !0, Ri.forEach(function(u) {
        u !== "selectionchange" && (gv.has(u) || qf(u, !1, l), qf(u, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[An] || (t[An] = !0, qf("selectionchange", !1, t));
    }
  }
  function Hr(l, t, u, a) {
    switch (ad(t)) {
      case 2:
        var e = Lv;
        break;
      case 8:
        e = Kv;
        break;
      default:
        e = If;
    }
    u = e.bind(
      null,
      t,
      u,
      l
    ), e = void 0, !nc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (e = !0), a ? e !== void 0 ? l.addEventListener(t, u, {
      capture: !0,
      passive: e
    }) : l.addEventListener(t, u, !0) : e !== void 0 ? l.addEventListener(t, u, {
      passive: e
    }) : l.addEventListener(t, u, !1);
  }
  function Gf(l, t, u, a, e) {
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
            if (c = ju(f), c === null) return;
            if (i = c.tag, i === 5 || i === 6 || i === 26 || i === 27) {
              a = n = c;
              continue l;
            }
            f = f.parentNode;
          }
        }
        a = a.return;
      }
    Gi(function() {
      var m = n, T = ac(u), p = [];
      l: {
        var g = vs.get(l);
        if (g !== void 0) {
          var S = Be, X = l;
          switch (l) {
            case "keypress":
              if (He(u) === 0) break l;
            case "keydown":
            case "keyup":
              S = r0;
              break;
            case "focusin":
              X = "focus", S = sc;
              break;
            case "focusout":
              X = "blur", S = sc;
              break;
            case "beforeblur":
            case "afterblur":
              S = sc;
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
              S = Zi;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              S = Pd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              S = h0;
              break;
            case ss:
            case os:
            case rs:
              S = u0;
              break;
            case ds:
              S = m0;
              break;
            case "scroll":
            case "scrollend":
              S = Fd;
              break;
            case "wheel":
              S = S0;
              break;
            case "copy":
            case "cut":
            case "paste":
              S = e0;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              S = Li;
              break;
            case "toggle":
            case "beforetoggle":
              S = T0;
          }
          var q = (t & 4) !== 0, cl = !q && (l === "scroll" || l === "scrollend"), h = q ? g !== null ? g + "Capture" : null : g;
          q = [];
          for (var r = m, y; r !== null; ) {
            var A = r;
            if (y = A.stateNode, A = A.tag, A !== 5 && A !== 26 && A !== 27 || y === null || h === null || (A = za(r, h), A != null && q.push(
              ie(r, A, y)
            )), cl) break;
            r = r.return;
          }
          0 < q.length && (g = new S(
            g,
            X,
            null,
            u,
            T
          ), p.push({ event: g, listeners: q }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (g = l === "mouseover" || l === "pointerover", S = l === "mouseout" || l === "pointerout", g && u !== uc && (X = u.relatedTarget || u.fromElement) && (ju(X) || X[Bu]))
            break l;
          if ((S || g) && (g = T.window === T ? T : (g = T.ownerDocument) ? g.defaultView || g.parentWindow : window, S ? (X = u.relatedTarget || u.toElement, S = m, X = X ? ju(X) : null, X !== null && (cl = x(X), q = X.tag, X !== cl || q !== 5 && q !== 27 && q !== 6) && (X = null)) : (S = null, X = m), S !== X)) {
            if (q = Zi, A = "onMouseLeave", h = "onMouseEnter", r = "mouse", (l === "pointerout" || l === "pointerover") && (q = Li, A = "onPointerLeave", h = "onPointerEnter", r = "pointer"), cl = S == null ? g : Ra(S), y = X == null ? g : Ra(X), g = new q(
              A,
              r + "leave",
              S,
              u,
              T
            ), g.target = cl, g.relatedTarget = y, A = null, ju(T) === m && (q = new q(
              h,
              r + "enter",
              X,
              u,
              T
            ), q.target = y, q.relatedTarget = cl, A = q), cl = A, S && X)
              t: {
                for (q = S, h = X, r = 0, y = q; y; y = ma(y))
                  r++;
                for (y = 0, A = h; A; A = ma(A))
                  y++;
                for (; 0 < r - y; )
                  q = ma(q), r--;
                for (; 0 < y - r; )
                  h = ma(h), y--;
                for (; r--; ) {
                  if (q === h || h !== null && q === h.alternate)
                    break t;
                  q = ma(q), h = ma(h);
                }
                q = null;
              }
            else q = null;
            S !== null && Cr(
              p,
              g,
              S,
              q,
              !1
            ), X !== null && cl !== null && Cr(
              p,
              cl,
              X,
              q,
              !0
            );
          }
        }
        l: {
          if (g = m ? Ra(m) : window, S = g.nodeName && g.nodeName.toLowerCase(), S === "select" || S === "input" && g.type === "file")
            var H = Ii;
          else if (Wi(g))
            if (Pi)
              H = U0;
            else {
              H = _0;
              var K = M0;
            }
          else
            S = g.nodeName, !S || S.toLowerCase() !== "input" || g.type !== "checkbox" && g.type !== "radio" ? m && tc(m.elementType) && (H = Ii) : H = D0;
          if (H && (H = H(l, m))) {
            Fi(
              p,
              H,
              u,
              T
            );
            break l;
          }
          K && K(l, g, m), l === "focusout" && m && g.type === "number" && m.memoizedProps.value != null && lc(g, "number", g.value);
        }
        switch (K = m ? Ra(m) : window, l) {
          case "focusin":
            (Wi(K) || K.contentEditable === "true") && (Ju = K, yc = m, Ca = null);
            break;
          case "focusout":
            Ca = yc = Ju = null;
            break;
          case "mousedown":
            mc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            mc = !1, fs(p, u, T);
            break;
          case "selectionchange":
            if (x0) break;
          case "keydown":
          case "keyup":
            fs(p, u, T);
        }
        var B;
        if (rc)
          l: {
            switch (l) {
              case "compositionstart":
                var Y = "onCompositionStart";
                break l;
              case "compositionend":
                Y = "onCompositionEnd";
                break l;
              case "compositionupdate":
                Y = "onCompositionUpdate";
                break l;
            }
            Y = void 0;
          }
        else
          Ku ? $i(l, u) && (Y = "onCompositionEnd") : l === "keydown" && u.keyCode === 229 && (Y = "onCompositionStart");
        Y && (Ki && u.locale !== "ko" && (Ku || Y !== "onCompositionStart" ? Y === "onCompositionEnd" && Ku && (B = Xi()) : (Jt = T, cc = "value" in Jt ? Jt.value : Jt.textContent, Ku = !0)), K = pn(m, Y), 0 < K.length && (Y = new Vi(
          Y,
          l,
          null,
          u,
          T
        ), p.push({ event: Y, listeners: K }), B ? Y.data = B : (B = ki(u), B !== null && (Y.data = B)))), (B = A0 ? p0(l, u) : O0(l, u)) && (Y = pn(m, "onBeforeInput"), 0 < Y.length && (K = new Vi(
          "onBeforeInput",
          "beforeinput",
          null,
          u,
          T
        ), p.push({
          event: K,
          listeners: Y
        }), K.data = B)), hv(
          p,
          l,
          m,
          u,
          T
        );
      }
      xr(p, t);
    });
  }
  function ie(l, t, u) {
    return {
      instance: l,
      listener: t,
      currentTarget: u
    };
  }
  function pn(l, t) {
    for (var u = t + "Capture", a = []; l !== null; ) {
      var e = l, n = e.stateNode;
      if (e = e.tag, e !== 5 && e !== 26 && e !== 27 || n === null || (e = za(l, u), e != null && a.unshift(
        ie(l, e, n)
      ), e = za(l, t), e != null && a.push(
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
  function Cr(l, t, u, a, e) {
    for (var n = t._reactName, c = []; u !== null && u !== a; ) {
      var f = u, i = f.alternate, m = f.stateNode;
      if (f = f.tag, i !== null && i === a) break;
      f !== 5 && f !== 26 && f !== 27 || m === null || (i = m, e ? (m = za(u, n), m != null && c.unshift(
        ie(u, m, i)
      )) : e || (m = za(u, n), m != null && c.push(
        ie(u, m, i)
      ))), u = u.return;
    }
    c.length !== 0 && l.push({ event: t, listeners: c });
  }
  var Sv = /\r\n?/g, bv = /\u0000|\uFFFD/g;
  function Br(l) {
    return (typeof l == "string" ? l : "" + l).replace(Sv, `
`).replace(bv, "");
  }
  function jr(l, t) {
    return t = Br(t), Br(l) === t;
  }
  function On() {
  }
  function nl(l, t, u, a, e, n) {
    switch (u) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || Zu(l, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Zu(l, "" + a);
        break;
      case "className":
        _e(l, "class", a);
        break;
      case "tabIndex":
        _e(l, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        _e(l, u, a);
        break;
      case "style":
        qi(l, a, n);
        break;
      case "data":
        if (t !== "object") {
          _e(l, "data", a);
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
        a = Ne("" + a), l.setAttribute(u, a);
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
        a = Ne("" + a), l.setAttribute(u, a);
        break;
      case "onClick":
        a != null && (l.onclick = On);
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
            throw Error(s(61));
          if (u = a.__html, u != null) {
            if (e.children != null) throw Error(s(60));
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
        u = Ne("" + a), l.setAttributeNS(
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
        _t(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        _t(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        _t(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        _t(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        _t(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        _t(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        _t(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        _t(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        _t(
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
        (!(2 < u.length) || u[0] !== "o" && u[0] !== "O" || u[1] !== "n" && u[1] !== "N") && (u = kd.get(u) || u, Me(l, u, a));
    }
  }
  function Xf(l, t, u, a, e, n) {
    switch (u) {
      case "style":
        qi(l, a, n);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(s(61));
          if (u = a.__html, u != null) {
            if (e.children != null) throw Error(s(60));
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
        a != null && (l.onclick = On);
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
        if (!zi.hasOwnProperty(u))
          l: {
            if (u[0] === "o" && u[1] === "n" && (e = u.endsWith("Capture"), t = u.slice(2, e ? u.length - 7 : void 0), n = l[Zl] || null, n = n != null ? n[u] : null, typeof n == "function" && l.removeEventListener(t, n, e), typeof a == "function")) {
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
                  throw Error(s(137, t));
                default:
                  nl(l, t, n, c, u, null);
              }
          }
        e && nl(l, t, "srcSet", u.srcSet, u, null), a && nl(l, t, "src", u.src, u, null);
        return;
      case "input":
        w("invalid", l);
        var f = n = c = e = null, i = null, m = null;
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
                  m = T;
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
                    throw Error(s(137, t));
                  break;
                default:
                  nl(l, t, a, T, u, null);
              }
          }
        Hi(
          l,
          n,
          f,
          i,
          m,
          c,
          e,
          !1
        ), De(l);
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
                if (f != null) throw Error(s(91));
                break;
              default:
                nl(l, t, c, f, u, null);
            }
        Bi(l, a, e, n), De(l);
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
        for (m in u)
          if (u.hasOwnProperty(m) && (a = u[m], a != null))
            switch (m) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(s(137, t));
              default:
                nl(l, t, m, a, u, null);
            }
        return;
      default:
        if (tc(t)) {
          for (T in u)
            u.hasOwnProperty(T) && (a = u[T], a !== void 0 && Xf(
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
  function Tv(l, t, u, a) {
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
        var e = null, n = null, c = null, f = null, i = null, m = null, T = null;
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
        for (var g in a) {
          var S = a[g];
          if (p = u[g], a.hasOwnProperty(g) && (S != null || p != null))
            switch (g) {
              case "type":
                n = S;
                break;
              case "name":
                e = S;
                break;
              case "checked":
                m = S;
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
                  throw Error(s(137, t));
                break;
              default:
                S !== p && nl(
                  l,
                  t,
                  g,
                  S,
                  a,
                  p
                );
            }
        }
        Pn(
          l,
          c,
          f,
          i,
          m,
          T,
          n,
          e
        );
        return;
      case "select":
        S = c = f = g = null;
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
                g = n;
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
        t = f, u = c, a = S, g != null ? Qu(l, !!u, g, !1) : !!a != !!u && (t != null ? Qu(l, !!u, t, !0) : Qu(l, !!u, u ? [] : "", !1));
        return;
      case "textarea":
        S = g = null;
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
                g = e;
                break;
              case "defaultValue":
                S = e;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (e != null) throw Error(s(91));
                break;
              default:
                e !== n && nl(l, t, c, e, a, n);
            }
        Ci(l, g, S);
        return;
      case "option":
        for (var X in u)
          if (g = u[X], u.hasOwnProperty(X) && g != null && !a.hasOwnProperty(X))
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
                  g
                );
            }
        for (i in a)
          if (g = a[i], S = u[i], a.hasOwnProperty(i) && g !== S && (g != null || S != null))
            switch (i) {
              case "selected":
                l.selected = g && typeof g != "function" && typeof g != "symbol";
                break;
              default:
                nl(
                  l,
                  t,
                  i,
                  g,
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
          g = u[q], u.hasOwnProperty(q) && g != null && !a.hasOwnProperty(q) && nl(l, t, q, null, a, g);
        for (m in a)
          if (g = a[m], S = u[m], a.hasOwnProperty(m) && g !== S && (g != null || S != null))
            switch (m) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (g != null)
                  throw Error(s(137, t));
                break;
              default:
                nl(
                  l,
                  t,
                  m,
                  g,
                  a,
                  S
                );
            }
        return;
      default:
        if (tc(t)) {
          for (var cl in u)
            g = u[cl], u.hasOwnProperty(cl) && g !== void 0 && !a.hasOwnProperty(cl) && Xf(
              l,
              t,
              cl,
              void 0,
              a,
              g
            );
          for (T in a)
            g = a[T], S = u[T], !a.hasOwnProperty(T) || g === S || g === void 0 && S === void 0 || Xf(
              l,
              t,
              T,
              g,
              a,
              S
            );
          return;
        }
    }
    for (var h in u)
      g = u[h], u.hasOwnProperty(h) && g != null && !a.hasOwnProperty(h) && nl(l, t, h, null, a, g);
    for (p in a)
      g = a[p], S = u[p], !a.hasOwnProperty(p) || g === S || g == null && S == null || nl(l, t, p, g, a, S);
  }
  var Qf = null, Zf = null;
  function Rn(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function qr(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Yr(l, t) {
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
  function Vf(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Lf = null;
  function Ev() {
    var l = window.event;
    return l && l.type === "popstate" ? l === Lf ? !1 : (Lf = l, !0) : (Lf = null, !1);
  }
  var Gr = typeof setTimeout == "function" ? setTimeout : void 0, Av = typeof clearTimeout == "function" ? clearTimeout : void 0, Xr = typeof Promise == "function" ? Promise : void 0, pv = typeof queueMicrotask == "function" ? queueMicrotask : typeof Xr < "u" ? function(l) {
    return Xr.resolve(null).then(l).catch(Ov);
  } : Gr;
  function Ov(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function iu(l) {
    return l === "head";
  }
  function Qr(l, t) {
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
  function Kf(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var u = t;
      switch (t = t.nextSibling, u.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Kf(u), kn(u);
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
  function Rv(l, t, u, a) {
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
      if (l = St(l.nextSibling), l === null) break;
    }
    return null;
  }
  function zv(l, t, u) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !u || (l = St(l.nextSibling), l === null)) return null;
    return l;
  }
  function Jf(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState === "complete";
  }
  function Mv(l, t) {
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
  function St(l) {
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
  var wf = null;
  function Zr(l) {
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
  function Vr(l, t, u) {
    switch (t = Rn(u), l) {
      case "html":
        if (l = t.documentElement, !l) throw Error(s(452));
        return l;
      case "head":
        if (l = t.head, !l) throw Error(s(453));
        return l;
      case "body":
        if (l = t.body, !l) throw Error(s(454));
        return l;
      default:
        throw Error(s(451));
    }
  }
  function se(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    kn(l);
  }
  var ht = /* @__PURE__ */ new Map(), Lr = /* @__PURE__ */ new Set();
  function zn(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  }
  var Zt = D.d;
  D.d = {
    f: _v,
    r: Dv,
    D: Uv,
    C: Nv,
    L: xv,
    m: Hv,
    X: Bv,
    S: Cv,
    M: jv
  };
  function _v() {
    var l = Zt.f(), t = gn();
    return l || t;
  }
  function Dv(l) {
    var t = qu(l);
    t !== null && t.tag === 5 && t.type === "form" ? so(t) : Zt.r(l);
  }
  var ga = typeof document > "u" ? null : document;
  function Kr(l, t, u) {
    var a = ga;
    if (a && typeof t == "string" && t) {
      var e = ft(t);
      e = 'link[rel="' + l + '"][href="' + e + '"]', typeof u == "string" && (e += '[crossorigin="' + u + '"]'), Lr.has(e) || (Lr.add(e), l = { rel: l, crossOrigin: u, href: t }, a.querySelector(e) === null && (t = a.createElement("link"), Nl(t, "link", l), pl(t), a.head.appendChild(t)));
    }
  }
  function Uv(l) {
    Zt.D(l), Kr("dns-prefetch", l, null);
  }
  function Nv(l, t) {
    Zt.C(l, t), Kr("preconnect", l, t);
  }
  function xv(l, t, u) {
    Zt.L(l, t, u);
    var a = ga;
    if (a && l && t) {
      var e = 'link[rel="preload"][as="' + ft(t) + '"]';
      t === "image" && u && u.imageSrcSet ? (e += '[imagesrcset="' + ft(
        u.imageSrcSet
      ) + '"]', typeof u.imageSizes == "string" && (e += '[imagesizes="' + ft(
        u.imageSizes
      ) + '"]')) : e += '[href="' + ft(l) + '"]';
      var n = e;
      switch (t) {
        case "style":
          n = Sa(l);
          break;
        case "script":
          n = ba(l);
      }
      ht.has(n) || (l = C(
        {
          rel: "preload",
          href: t === "image" && u && u.imageSrcSet ? void 0 : l,
          as: t
        },
        u
      ), ht.set(n, l), a.querySelector(e) !== null || t === "style" && a.querySelector(oe(n)) || t === "script" && a.querySelector(re(n)) || (t = a.createElement("link"), Nl(t, "link", l), pl(t), a.head.appendChild(t)));
    }
  }
  function Hv(l, t) {
    Zt.m(l, t);
    var u = ga;
    if (u && l) {
      var a = t && typeof t.as == "string" ? t.as : "script", e = 'link[rel="modulepreload"][as="' + ft(a) + '"][href="' + ft(l) + '"]', n = e;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = ba(l);
      }
      if (!ht.has(n) && (l = C({ rel: "modulepreload", href: l }, t), ht.set(n, l), u.querySelector(e) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (u.querySelector(re(n)))
              return;
        }
        a = u.createElement("link"), Nl(a, "link", l), pl(a), u.head.appendChild(a);
      }
    }
  }
  function Cv(l, t, u) {
    Zt.S(l, t, u);
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
          l = C(
            { rel: "stylesheet", href: l, "data-precedence": t },
            u
          ), (u = ht.get(n)) && $f(l, u);
          var i = c = a.createElement("link");
          pl(i), Nl(i, "link", l), i._p = new Promise(function(m, T) {
            i.onload = m, i.onerror = T;
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
  function Bv(l, t) {
    Zt.X(l, t);
    var u = ga;
    if (u && l) {
      var a = Yu(u).hoistableScripts, e = ba(l), n = a.get(e);
      n || (n = u.querySelector(re(e)), n || (l = C({ src: l, async: !0 }, t), (t = ht.get(e)) && kf(l, t), n = u.createElement("script"), pl(n), Nl(n, "link", l), u.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(e, n));
    }
  }
  function jv(l, t) {
    Zt.M(l, t);
    var u = ga;
    if (u && l) {
      var a = Yu(u).hoistableScripts, e = ba(l), n = a.get(e);
      n || (n = u.querySelector(re(e)), n || (l = C({ src: l, async: !0, type: "module" }, t), (t = ht.get(e)) && kf(l, t), n = u.createElement("script"), pl(n), Nl(n, "link", l), u.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(e, n));
    }
  }
  function Jr(l, t, u, a) {
    var e = (e = Z.current) ? zn(e) : null;
    if (!e) throw Error(s(446));
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
          )) && !n._p && (c.instance = n, c.state.loading = 5), ht.has(l) || (u = {
            rel: "preload",
            as: "style",
            href: u.href,
            crossOrigin: u.crossOrigin,
            integrity: u.integrity,
            media: u.media,
            hrefLang: u.hrefLang,
            referrerPolicy: u.referrerPolicy
          }, ht.set(l, u), n || qv(
            e,
            l,
            u,
            c.state
          ))), t && a === null)
            throw Error(s(528, ""));
          return c;
        }
        if (t && a !== null)
          throw Error(s(529, ""));
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
        throw Error(s(444, l));
    }
  }
  function Sa(l) {
    return 'href="' + ft(l) + '"';
  }
  function oe(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function wr(l) {
    return C({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function qv(l, t, u, a) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = l.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), Nl(t, "link", u), pl(t), l.head.appendChild(t));
  }
  function ba(l) {
    return '[src="' + ft(l) + '"]';
  }
  function re(l) {
    return "script[async]" + l;
  }
  function $r(l, t, u) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = l.querySelector(
            'style[data-href~="' + ft(u.href) + '"]'
          );
          if (a)
            return t.instance = a, pl(a), a;
          var e = C({}, u, {
            "data-href": u.href,
            "data-precedence": u.precedence,
            href: null,
            precedence: null
          });
          return a = (l.ownerDocument || l).createElement(
            "style"
          ), pl(a), Nl(a, "style", e), Mn(a, u.precedence, l), t.instance = a;
        case "stylesheet":
          e = Sa(u.href);
          var n = l.querySelector(
            oe(e)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, pl(n), n;
          a = wr(u), (e = ht.get(e)) && $f(a, e), n = (l.ownerDocument || l).createElement("link"), pl(n);
          var c = n;
          return c._p = new Promise(function(f, i) {
            c.onload = f, c.onerror = i;
          }), Nl(n, "link", a), t.state.loading |= 4, Mn(n, u.precedence, l), t.instance = n;
        case "script":
          return n = ba(u.src), (e = l.querySelector(
            re(n)
          )) ? (t.instance = e, pl(e), e) : (a = u, (e = ht.get(n)) && (a = C({}, u), kf(a, e)), l = l.ownerDocument || l, e = l.createElement("script"), pl(e), Nl(e, "link", a), l.head.appendChild(e), t.instance = e);
        case "void":
          return null;
        default:
          throw Error(s(443, t.type));
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
  function $f(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function kf(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var _n = null;
  function kr(l, t, u) {
    if (_n === null) {
      var a = /* @__PURE__ */ new Map(), e = _n = /* @__PURE__ */ new Map();
      e.set(u, a);
    } else
      e = _n, a = e.get(u), a || (a = /* @__PURE__ */ new Map(), e.set(u, a));
    if (a.has(l)) return a;
    for (a.set(l, null), u = u.getElementsByTagName(l), e = 0; e < u.length; e++) {
      var n = u[e];
      if (!(n[Oa] || n[Cl] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = n.getAttribute(t) || "";
        c = l + c;
        var f = a.get(c);
        f ? f.push(n) : a.set(c, [n]);
      }
    }
    return a;
  }
  function Wr(l, t, u) {
    l = l.ownerDocument || l, l.head.insertBefore(
      u,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function Yv(l, t, u) {
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
  function Fr(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  var de = null;
  function Gv() {
  }
  function Xv(l, t, u) {
    if (de === null) throw Error(s(475));
    var a = de;
    if (t.type === "stylesheet" && (typeof u.media != "string" || matchMedia(u.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var e = Sa(u.href), n = l.querySelector(
          oe(e)
        );
        if (n) {
          l = n._p, l !== null && typeof l == "object" && typeof l.then == "function" && (a.count++, a = Dn.bind(a), l.then(a, a)), t.state.loading |= 4, t.instance = n, pl(n);
          return;
        }
        n = l.ownerDocument || l, u = wr(u), (e = ht.get(e)) && $f(u, e), n = n.createElement("link"), pl(n);
        var c = n;
        c._p = new Promise(function(f, i) {
          c.onload = f, c.onerror = i;
        }), Nl(n, "link", u), t.instance = n;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, l), (l = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = Dn.bind(a), l.addEventListener("load", t), l.addEventListener("error", t));
    }
  }
  function Qv() {
    if (de === null) throw Error(s(475));
    var l = de;
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
  function Dn() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) Wf(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        this.unsuspend = null, l();
      }
    }
  }
  var Un = null;
  function Wf(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Un = /* @__PURE__ */ new Map(), t.forEach(Zv, l), Un = null, Dn.call(l));
  }
  function Zv(l, t) {
    if (!(t.state.loading & 4)) {
      var u = Un.get(l);
      if (u) var a = u.get(null);
      else {
        u = /* @__PURE__ */ new Map(), Un.set(l, u);
        for (var e = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), n = 0; n < e.length; n++) {
          var c = e[n];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (u.set(c.dataset.precedence, c), a = c);
        }
        a && u.set(null, a);
      }
      e = t.instance, c = e.getAttribute("data-precedence"), n = u.get(c) || a, n === a && u.set(null, e), u.set(c, e), this.count++, a = Dn.bind(this), e.addEventListener("load", a), e.addEventListener("error", a), n ? n.parentNode.insertBefore(e, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(e, l.firstChild)), t.state.loading |= 4;
    }
  }
  var ve = {
    $$typeof: Al,
    Provider: null,
    Consumer: null,
    _currentValue: G,
    _currentValue2: G,
    _threadCount: 0
  };
  function Vv(l, t, u, a, e, n, c, f) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Kn(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Kn(0), this.hiddenUpdates = Kn(null), this.identifierPrefix = a, this.onUncaughtError = e, this.onCaughtError = n, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = f, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Ir(l, t, u, a, e, n, c, f, i, m, T, p) {
    return l = new Vv(
      l,
      t,
      u,
      c,
      f,
      i,
      m,
      p
    ), t = 1, n === !0 && (t |= 24), n = lt(3, null, null, t), l.current = n, n.stateNode = l, t = Uc(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: a,
      isDehydrated: u,
      cache: t
    }, Cc(n), l;
  }
  function Pr(l) {
    return l ? (l = Wu, l) : Wu;
  }
  function ld(l, t, u, a, e, n) {
    e = Pr(e), a.context === null ? a.context = e : a.pendingContext = e, a = kt(t), a.payload = { element: u }, n = n === void 0 ? null : n, n !== null && (a.callback = n), u = Wt(l, a, t), u !== null && (nt(u, l, t), Va(u, l, t));
  }
  function td(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var u = l.retryLane;
      l.retryLane = u !== 0 && u < t ? u : t;
    }
  }
  function Ff(l, t) {
    td(l, t), (l = l.alternate) && td(l, t);
  }
  function ud(l) {
    if (l.tag === 13) {
      var t = ku(l, 67108864);
      t !== null && nt(t, l, 67108864), Ff(l, 67108864);
    }
  }
  var Nn = !0;
  function Lv(l, t, u, a) {
    var e = E.T;
    E.T = null;
    var n = D.p;
    try {
      D.p = 2, If(l, t, u, a);
    } finally {
      D.p = n, E.T = e;
    }
  }
  function Kv(l, t, u, a) {
    var e = E.T;
    E.T = null;
    var n = D.p;
    try {
      D.p = 8, If(l, t, u, a);
    } finally {
      D.p = n, E.T = e;
    }
  }
  function If(l, t, u, a) {
    if (Nn) {
      var e = Pf(a);
      if (e === null)
        Gf(
          l,
          t,
          a,
          xn,
          u
        ), ed(l, a);
      else if (wv(
        e,
        l,
        t,
        u,
        a
      ))
        a.stopPropagation();
      else if (ed(l, a), t & 4 && -1 < Jv.indexOf(l)) {
        for (; e !== null; ) {
          var n = qu(e);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var c = mu(n.pendingLanes);
                  if (c !== 0) {
                    var f = n;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; c; ) {
                      var i = 1 << 31 - Il(c);
                      f.entanglements[1] |= i, c &= ~i;
                    }
                    zt(n), (ul & 6) === 0 && (yn = Et() + 500, ce(0));
                  }
                }
                break;
              case 13:
                f = ku(n, 2), f !== null && nt(f, n, 2), gn(), Ff(n, 2);
            }
          if (n = Pf(a), n === null && Gf(
            l,
            t,
            a,
            xn,
            u
          ), n === e) break;
          e = n;
        }
        e !== null && a.stopPropagation();
      } else
        Gf(
          l,
          t,
          a,
          null,
          u
        );
    }
  }
  function Pf(l) {
    return l = ac(l), li(l);
  }
  var xn = null;
  function li(l) {
    if (xn = null, l = ju(l), l !== null) {
      var t = x(l);
      if (t === null) l = null;
      else {
        var u = t.tag;
        if (u === 13) {
          if (l = Q(t), l !== null) return l;
          l = null;
        } else if (u === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return xn = l, null;
  }
  function ad(l) {
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
        switch (Nd()) {
          case mi:
            return 2;
          case gi:
            return 8;
          case pe:
          case xd:
            return 32;
          case Si:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ti = !1, su = null, ou = null, ru = null, he = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), du = [], Jv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function ed(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        su = null;
        break;
      case "dragenter":
      case "dragleave":
        ou = null;
        break;
      case "mouseover":
      case "mouseout":
        ru = null;
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
    }, t !== null && (t = qu(t), t !== null && ud(t)), l) : (l.eventSystemFlags |= a, t = l.targetContainers, e !== null && t.indexOf(e) === -1 && t.push(e), l);
  }
  function wv(l, t, u, a, e) {
    switch (t) {
      case "focusin":
        return su = me(
          su,
          l,
          t,
          u,
          a,
          e
        ), !0;
      case "dragenter":
        return ou = me(
          ou,
          l,
          t,
          u,
          a,
          e
        ), !0;
      case "mouseover":
        return ru = me(
          ru,
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
  function nd(l) {
    var t = ju(l.target);
    if (t !== null) {
      var u = x(t);
      if (u !== null) {
        if (t = u.tag, t === 13) {
          if (t = Q(u), t !== null) {
            l.blockedOn = t, Xd(l.priority, function() {
              if (u.tag === 13) {
                var a = et();
                a = Jn(a);
                var e = ku(u, a);
                e !== null && nt(e, u, a), Ff(u, a);
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
  function Hn(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var u = Pf(l.nativeEvent);
      if (u === null) {
        u = l.nativeEvent;
        var a = new u.constructor(
          u.type,
          u
        );
        uc = a, u.target.dispatchEvent(a), uc = null;
      } else
        return t = qu(u), t !== null && ud(t), l.blockedOn = u, !1;
      t.shift();
    }
    return !0;
  }
  function cd(l, t, u) {
    Hn(l) && u.delete(t);
  }
  function $v() {
    ti = !1, su !== null && Hn(su) && (su = null), ou !== null && Hn(ou) && (ou = null), ru !== null && Hn(ru) && (ru = null), he.forEach(cd), ye.forEach(cd);
  }
  function Cn(l, t) {
    l.blockedOn === t && (l.blockedOn = null, ti || (ti = !0, d.unstable_scheduleCallback(
      d.unstable_NormalPriority,
      $v
    )));
  }
  var Bn = null;
  function fd(l) {
    Bn !== l && (Bn = l, d.unstable_scheduleCallback(
      d.unstable_NormalPriority,
      function() {
        Bn === l && (Bn = null);
        for (var t = 0; t < l.length; t += 3) {
          var u = l[t], a = l[t + 1], e = l[t + 2];
          if (typeof a != "function") {
            if (li(a || u) === null)
              continue;
            break;
          }
          var n = qu(u);
          n !== null && (l.splice(t, 3), t -= 3, Pc(
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
      return Cn(i, l);
    }
    su !== null && Cn(su, l), ou !== null && Cn(ou, l), ru !== null && Cn(ru, l), he.forEach(t), ye.forEach(t);
    for (var u = 0; u < du.length; u++) {
      var a = du[u];
      a.blockedOn === l && (a.blockedOn = null);
    }
    for (; 0 < du.length && (u = du[0], u.blockedOn === null); )
      nd(u), u.blockedOn === null && du.shift();
    if (u = (l.ownerDocument || l).$$reactFormReplay, u != null)
      for (a = 0; a < u.length; a += 3) {
        var e = u[a], n = u[a + 1], c = e[Zl] || null;
        if (typeof n == "function")
          c || fd(u);
        else if (c) {
          var f = null;
          if (n && n.hasAttribute("formAction")) {
            if (e = n, c = n[Zl] || null)
              f = c.formAction;
            else if (li(e) !== null) continue;
          } else f = c.action;
          typeof f == "function" ? u[a + 1] = f : (u.splice(a, 3), a -= 3), fd(u);
        }
      }
  }
  function ui(l) {
    this._internalRoot = l;
  }
  jn.prototype.render = ui.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    var u = t.current, a = et();
    ld(u, a, l, t, null, null);
  }, jn.prototype.unmount = ui.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      ld(l.current, 2, null, l, null, null), gn(), t[Bu] = null;
    }
  };
  function jn(l) {
    this._internalRoot = l;
  }
  jn.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = pi();
      l = { blockedOn: null, target: l, priority: t };
      for (var u = 0; u < du.length && t !== 0 && t < du[u].priority; u++) ;
      du.splice(u, 0, l), u === 0 && nd(l);
    }
  };
  var id = b.version;
  if (id !== "19.1.0")
    throw Error(
      s(
        527,
        id,
        "19.1.0"
      )
    );
  D.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(s(188)) : (l = Object.keys(l).join(","), Error(s(268, l)));
    return l = M(t), l = l !== null ? O(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var kv = {
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
          kv
        ), Fl = qn;
      } catch {
      }
  }
  return be.createRoot = function(l, t) {
    if (!U(l)) throw Error(s(299));
    var u = !1, a = "", e = Oo, n = Ro, c = zo, f = null;
    return t != null && (t.unstable_strictMode === !0 && (u = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (e = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (f = t.unstable_transitionCallbacks)), t = Ir(
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
    ), l[Bu] = t.current, Yf(l), new ui(t);
  }, be.hydrateRoot = function(l, t, u) {
    if (!U(l)) throw Error(s(299));
    var a = !1, e = "", n = Oo, c = Ro, f = zo, i = null, m = null;
    return u != null && (u.unstable_strictMode === !0 && (a = !0), u.identifierPrefix !== void 0 && (e = u.identifierPrefix), u.onUncaughtError !== void 0 && (n = u.onUncaughtError), u.onCaughtError !== void 0 && (c = u.onCaughtError), u.onRecoverableError !== void 0 && (f = u.onRecoverableError), u.unstable_transitionCallbacks !== void 0 && (i = u.unstable_transitionCallbacks), u.formState !== void 0 && (m = u.formState)), t = Ir(
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
      m
    ), t.context = Pr(null), u = t.current, a = et(), a = Jn(a), e = kt(a), e.callback = null, Wt(u, e, a), u = a, t.current.lanes = u, pa(t, u), zt(t), l[Bu] = t.current, Yf(l), new jn(t);
  }, be.version = "19.1.0", be;
}
var Sd;
function nh() {
  if (Sd) return ni.exports;
  Sd = 1;
  function d() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(d);
      } catch (b) {
        console.error(b);
      }
  }
  return d(), ni.exports = eh(), ni.exports;
}
var ch = nh();
class fh extends El.Component {
  constructor(b) {
    super(b), this.state = { hasError: !1 };
  }
  static getDerivedStateFromError(b) {
    return { hasError: !0, error: b };
  }
  render() {
    return this.state.hasError ? /* @__PURE__ */ R.jsx("div", { children: "Something went wrong. Please refresh the page or contact express dev team." }) : this.props.children;
  }
}
const bd = "https://www.adobe.com/express-search-api-v3", oi = "urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418", Ed = "urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852", di = " AND ", Ad = ",";
function pd(d, b) {
  const v = /\[(.+)\]/.exec(b)[1].split(";"), s = new URLSearchParams(d);
  return v.forEach((U) => {
    const x = /^-(.+)/.exec(U);
    if (x) {
      s.delete(x[1]);
      return;
    }
    const Q = /^(.+)=(.+)/.exec(U);
    Q && s.set(Q[1], Q[2]);
  }), s.toString();
}
function vi(d) {
  let b = null;
  const v = new URLSearchParams(d);
  if (v.has("backup")) {
    const x = v.get("backup");
    v.delete("backup"), b = {
      target: v.get("limit"),
      ...vi(pd(v, x))
    };
  }
  v.has("collection") && (v.get("collection") === "default" ? v.set("collectionId", `${oi}`) : v.get("collection") === "popular" && v.set("collectionId", `${Ed}`), v.delete("collection")), v.get("collectionId") || v.set("collectionId", `${oi}`), v.get("license") && (v.append("filters", `licensingCategory==${v.get("license")}`), v.delete("license")), v.get("behaviors") && (v.append("filters", `behaviors==${v.get("behaviors")}`), v.delete("behaviors")), v.get("tasks") && (v.append("filters", `pages.task.name==${v.get("tasks")}`), v.delete("tasks")), v.get("topics") && (v.get("topics").split(di).forEach((x) => {
    v.append("filters", `topics==${x}`);
  }), v.delete("topics")), v.get("language") && (v.append("filters", `language==${v.get("language")}`), v.delete("language"));
  const s = {};
  v.get("prefLang") && (s["x-express-pref-lang"] = v.get("prefLang"), v.delete("prefLang")), v.get("prefRegion") && (s["x-express-pref-region-code"] = v.get("prefRegion"), v.delete("prefRegion")), v.set("queryType", "search");
  const U = new URL(bd).host === window.location.host ? "" : "&ax-env=stage";
  return {
    url: `${bd}?${decodeURIComponent(v.toString())}${U}`,
    headers: s,
    backupQuery: b
  };
}
async function si(d, b) {
  return await (await fetch(d, { headers: b })).json();
}
function ih(d) {
  const [b, v] = [/* @__PURE__ */ new Set(), []];
  return d.forEach((s) => {
    b.has(s.id) || (b.add(s.id), v.push(s));
  }), v;
}
async function sh(d) {
  var O;
  const { url: b, headers: v, backupQuery: s } = vi(d);
  if (!s || !s.target)
    return si(b, v);
  const [U, x] = [
    si(b, v),
    si(s.url, s.headers)
  ], Q = await U;
  if (((O = Q.items) == null ? void 0 : O.length) >= s.target)
    return Q;
  const F = await x, M = ih([...Q.items, ...F.items]).slice(0, s.target);
  return {
    metadata: {
      totalHits: M.length,
      start: "0",
      limit: s.target
    },
    items: M
  };
}
function oh(d) {
  var b, v, s;
  return (b = d["dc:title"]) != null && b["i-default"] ? d["dc:title"]["i-default"] : (v = d.moods) != null && v.length && ((s = d.task) != null && s.name) ? `${d.moods.join(", ")} ${d.task.name}` : "";
}
function rh(d) {
  var b, v;
  return (v = (b = d._links) == null ? void 0 : b["http://ns.adobe.com/adobecloud/rel/rendition"]) == null ? void 0 : v.href;
}
function dh(d) {
  var b, v;
  return (v = (b = d._links) == null ? void 0 : b["http://ns.adobe.com/adobecloud/rel/component"]) == null ? void 0 : v.href;
}
const hi = {
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
  prefRegion: "",
  // backup recipe
  backupRecipe: ""
};
function Od(d, b) {
  return !d && !b || d === b ? !0 : Array.isArray(d) && Array.isArray(b) ? d.length !== b.length ? !1 : d.every((v, s) => Od(v, b[s])) : !1;
}
function vh(d, b) {
  return Object.keys(hi).filter((v) => !["start", "backupRecipe", "limit"].includes(v)).reduce((v, s) => {
    const U = d[s], x = b[s];
    return Od(U, x) ? v : U && !x ? [...v, { type: "-", key: s }] : [...v, { type: "+", key: s, value: x }];
  }, []);
}
function Rd(d) {
  const b = new URLSearchParams(d), v = structuredClone(hi);
  if (b.has("collectionId") ? b.get("collectionId") === oi ? (v.collection = "default", v.collectionId = "") : b.get("collectionId") === Ed ? (v.collection = "popular", v.collectionId = "") : v.collection = "custom" : b.has("collection") && ["default", "popular"].includes(b.get("collection")) ? (v.collection = b.get("collection"), v.collectionId = "") : (v.collection = "default", v.collectionId = ""), b.get("limit") && (v.limit = Number(b.get("limit"))), b.get("start") && (v.start = Number(b.get("start"))), b.get("orderBy") && (v.orderBy = b.get("orderBy")), b.get("q") && (v.q = b.get("q")), b.get("language") && (v.language = b.get("language")), b.get("tasks") && (v.tasks = b.get("tasks")), b.get("topics") && (v.topics = b.get("topics").split(di).map((s) => s.split(Ad))), b.get("license") && (v.license = b.get("license")), b.get("behaviors") && (v.behaviors = b.get("behaviors")), b.get("prefLang") && (v.prefLang = b.get("prefLang")), b.get("prefRegion") && (v.prefRegion = b.get("prefRegion").toUpperCase()), b.get("backup")) {
    const s = b.get("backup");
    b.delete("backup"), v.backupRecipe = pd(b, s);
  }
  return v;
}
function yi(d) {
  const b = d.collection === "custom" ? "" : `collection=${d.collection}`, v = d.collection === "custom" ? `collectionId=${d.collectionId}` : "", s = d.limit ? `limit=${d.limit}` : "", U = d.start ? `start=${d.start}` : "", x = d.q ? `q=${d.q}` : "", Q = d.language ? `language=${d.language}` : "", F = d.tasks ? `tasks=${d.tasks}` : "", M = d.topics.filter((Xl) => Xl.some(Boolean)).map((Xl) => Xl.filter(Boolean).join(Ad)).join(di), O = M ? `topics=${M}` : "", C = d.license ? `license=${d.license}` : "", tl = d.behaviors ? `behaviors=${d.behaviors}` : "", $ = d.orderBy ? `orderBy=${d.orderBy}` : "", Ml = d.prefLang ? `prefLang=${d.prefLang}` : "", _l = d.prefRegion ? `prefRegion=${d.prefRegion}` : "";
  let Gl = "";
  if (d.backupRecipe) {
    const Xl = vh(d, Rd(d.backupRecipe));
    Xl.length && (Gl = `backup=[${Xl.map(({ type: Al, key: Ql, value: k }) => Al === "-" ? `-${Ql}` : `${Ql}=${k}`).join(";")}]`);
  }
  return [
    x,
    O,
    F,
    Q,
    C,
    tl,
    $,
    s,
    b,
    v,
    Ml,
    _l,
    U,
    Gl
  ].filter(Boolean).join("&");
}
const zd = El.createContext(null), Md = El.createContext(null), _d = El.createContext(null);
function Te() {
  return El.useContext(zd);
}
function Gn() {
  return El.useContext(Md);
}
function hh() {
  return El.useContext(_d);
}
const yt = {
  UPDATE_RECIPE: "UPDATE_RECIPE",
  UPDATE_FORM: "UPDATE_FORM",
  TOPICS_ADD: "TOPICS_ADD",
  TOPICS_UPDATE: "TOPICS_UPDATE",
  TOPICS_REMOVE: "TOPICS_REMOVE",
  TOPICS_EXPAND: "TOPICS_EXPAND"
};
function yh(d, b) {
  const { type: v, payload: s } = b, { field: U, value: x, topicsRow: Q, topicsCol: F } = s || {};
  switch (v) {
    case yt.UPDATE_RECIPE:
      return Rd(x);
    case yt.UPDATE_FORM:
      return { ...d, [U]: x };
    case yt.TOPICS_ADD: {
      const M = structuredClone(d.topics);
      return M[Q].push(""), { ...d, topics: M };
    }
    case yt.TOPICS_REMOVE: {
      const M = structuredClone(d.topics);
      return M[Q].pop(), M[Q].length || M.splice(Q, 1), {
        ...d,
        topics: M
      };
    }
    case yt.TOPICS_UPDATE: {
      const M = structuredClone(d.topics);
      return M[Q][F] = x, {
        ...d,
        topics: M
      };
    }
    case yt.TOPICS_EXPAND:
      return {
        ...d,
        topics: [...d.topics, [""]]
      };
    default:
      throw new Error(`Unhandled action type: ${v}`);
  }
}
function mh() {
  const [d, b] = El.useState(null), v = El.useRef(null), s = El.useCallback((U) => {
    v.current && clearTimeout(v.current), b(U), v.current = setTimeout(() => b(null), 5e3);
  }, []);
  return El.useEffect(() => () => {
    v.current && clearTimeout(v.current);
  }, []), [d, s];
}
function gh({ children: d }) {
  const [b, v] = mh();
  return /* @__PURE__ */ R.jsx(_d, { value: { activeInfo: b, showInfo: v }, children: d });
}
function Sh({ children: d }) {
  const [b, v] = El.useReducer(yh, hi);
  return /* @__PURE__ */ R.jsx(zd, { value: b, children: /* @__PURE__ */ R.jsx(gh, { children: /* @__PURE__ */ R.jsx(Md, { value: v, children: d }) }) });
}
function bh() {
  const [d, b] = El.useState(!1), v = Te(), s = yi(v), U = Gn(), x = () => {
    navigator.clipboard.writeText(s), b(!0), setTimeout(() => b(!1), 2e3);
  };
  return /* @__PURE__ */ R.jsxs("div", { className: "border-grey rounded p-1", children: [
    /* @__PURE__ */ R.jsx("h2", { children: "Recipe to Form:" }),
    /* @__PURE__ */ R.jsx(
      "textarea",
      {
        autoCorrect: "off",
        autoCapitalize: "off",
        spellCheck: "false",
        value: s,
        onChange: (Q) => U({
          type: yt.UPDATE_RECIPE,
          payload: { value: Q.target.value }
        })
      }
    ),
    /* @__PURE__ */ R.jsxs("div", { className: "copy-button-container flex items-center justify-between", children: [
      /* @__PURE__ */ R.jsx("button", { onClick: x, children: "Copy" }),
      d && /* @__PURE__ */ R.jsx("p", { className: "copied", children: "Copied to clipboard!" })
    ] })
  ] });
}
function Ee({ children: d }) {
  return /* @__PURE__ */ R.jsx("label", { className: "flex gap-2 items-center flex-wrap", children: d });
}
function Th({ topicsGroup: d, rowIndex: b, expandButton: v }) {
  const s = Gn();
  return /* @__PURE__ */ R.jsxs(Ee, { children: [
    b === 0 ? "Topics:" : "AND Topics:",
    d.map((U, x) => /* @__PURE__ */ R.jsx(
      "input",
      {
        className: "topics-input",
        type: "text",
        value: U,
        onChange: (Q) => s({
          type: yt.TOPICS_UPDATE,
          payload: {
            topicsRow: b,
            topicsCol: x,
            value: Q.target.value
          }
        })
      },
      x
    )),
    /* @__PURE__ */ R.jsxs("div", { className: "flex gap-1", children: [
      b === 0 && d.length === 1 || /* @__PURE__ */ R.jsx(
        "button",
        {
          onClick: (U) => {
            U.preventDefault(), s({
              type: yt.TOPICS_REMOVE,
              payload: {
                topicsRow: b
              }
            });
          },
          children: "-"
        }
      ),
      d.every(Boolean) && /* @__PURE__ */ R.jsx(
        "button",
        {
          onClick: (U) => {
            U.preventDefault(), s({
              type: yt.TOPICS_ADD,
              payload: { topicsRow: b }
            });
          },
          children: "+"
        }
      ),
      v
    ] })
  ] });
}
function Eh() {
  const d = Te(), b = Gn(), v = d.topics, s = /* @__PURE__ */ R.jsx(
    "button",
    {
      onClick: (U) => {
        U.preventDefault(), b({
          type: yt.TOPICS_EXPAND
        });
      },
      children: "AND"
    }
  );
  return /* @__PURE__ */ R.jsx("div", { className: "flex flex-col items-start", children: v.map((U, x) => /* @__PURE__ */ R.jsx(
    Th,
    {
      rowIndex: x,
      topicsGroup: v[x],
      expandButton: x === v.length - 1 ? s : null
    },
    x
  )) });
}
function Ah({ fieldName: d, content: b }) {
  const { activeInfo: v, showInfo: s } = hh();
  return /* @__PURE__ */ R.jsxs(R.Fragment, { children: [
    /* @__PURE__ */ R.jsx(
      "button",
      {
        type: "button",
        className: "info-button",
        "aria-label": `Show information for ${d}`,
        onClick: () => s(d),
        children: "？"
      }
    ),
    v === d && /* @__PURE__ */ R.jsx("div", { className: "info-content", tabIndex: "0", children: /* @__PURE__ */ R.jsx("small", { children: b }) })
  ] });
}
const Xn = El.memo(Ah);
function Ta({
  label: d,
  name: b,
  title: v,
  value: s,
  onChange: U,
  info: x,
  required: Q,
  disabled: F,
  ...M
}) {
  return /* @__PURE__ */ R.jsxs(Ee, { children: [
    d,
    /* @__PURE__ */ R.jsx(
      "input",
      {
        name: b,
        type: "text",
        title: v,
        required: Q,
        disabled: F,
        value: s,
        onChange: U,
        ...M
      }
    ),
    x && /* @__PURE__ */ R.jsx(
      Xn,
      {
        fieldName: b,
        content: x
      }
    )
  ] });
}
function Yn({
  label: d,
  name: b,
  value: v,
  onChange: s,
  options: U,
  info: x,
  ...Q
}) {
  return /* @__PURE__ */ R.jsxs(Ee, { children: [
    d,
    /* @__PURE__ */ R.jsx(
      "select",
      {
        name: b,
        value: v,
        onChange: s,
        ...Q,
        children: U.map((F) => /* @__PURE__ */ R.jsx("option", { value: F.value, children: F.label }, F.value))
      }
    ),
    x && /* @__PURE__ */ R.jsx(
      Xn,
      {
        fieldName: b,
        content: x
      }
    )
  ] });
}
function Td({
  label: d,
  name: b,
  value: v,
  onChange: s,
  info: U,
  ...x
}) {
  return /* @__PURE__ */ R.jsxs(Ee, { children: [
    d,
    /* @__PURE__ */ R.jsx(
      "input",
      {
        name: b,
        type: "number",
        value: v,
        onChange: s,
        ...x
      }
    ),
    U && /* @__PURE__ */ R.jsx(
      Xn,
      {
        fieldName: b,
        content: U
      }
    )
  ] });
}
function ph({
  label: d,
  name: b,
  value: v,
  onChange: s,
  info: U
}) {
  return /* @__PURE__ */ R.jsxs(Ee, { children: [
    /* @__PURE__ */ R.jsx("small", { children: d }),
    /* @__PURE__ */ R.jsx(
      "textarea",
      {
        autoCorrect: "off",
        autoCapitalize: "off",
        spellCheck: "false",
        name: b,
        value: v,
        onChange: s
      }
    ),
    U && /* @__PURE__ */ R.jsx(
      Xn,
      {
        fieldName: b,
        content: U
      }
    )
  ] });
}
function Oh() {
  const d = Te(), b = Gn(), v = El.useCallback(
    (s, U = !1) => ({ target: { value: x } }) => {
      b({
        type: yt.UPDATE_FORM,
        payload: { field: s, value: U ? Number(x) : x }
      });
    },
    [b]
  );
  return /* @__PURE__ */ R.jsxs("form", { className: "border-grey rounded p-1 gap-1", children: [
    /* @__PURE__ */ R.jsx("h2", { children: "Form to Recipe:" }),
    /* @__PURE__ */ R.jsx("h4", { children: "Search Parameters" }),
    /* @__PURE__ */ R.jsx(
      Ta,
      {
        label: "Q:",
        name: "q",
        value: d.q,
        onChange: v("q"),
        info: "Search query. This is more flexible and ambiguous than using filters but also less precise."
      }
    ),
    /* @__PURE__ */ R.jsx(
      Yn,
      {
        label: "Collection:",
        name: "collection",
        value: d.collection,
        onChange: v("collection"),
        options: [
          { value: "default", label: "Default" },
          { value: "popular", label: "Popular" },
          { value: "custom", label: "Use Custom collection ID" }
        ],
        info: "Predefined collections. Select Customized to use specific Collection ID. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). You can also use the Popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852)."
      }
    ),
    /* @__PURE__ */ R.jsx(
      Ta,
      {
        label: "Collection ID:",
        name: "collectionId",
        value: d.collectionId,
        onChange: v("collectionId"),
        title: "Optional. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). Another common is the popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852).",
        disabled: d.collection !== "custom",
        required: d.collection === "custom"
      }
    ),
    d.collection === "custom" && !d.collectionId && /* @__PURE__ */ R.jsx("div", { className: "error-message", children: "Collection ID is required when using a custom collection" }),
    /* @__PURE__ */ R.jsx(
      Td,
      {
        label: "Limit:",
        name: "limit",
        value: d.limit,
        onChange: v("limit", !0),
        info: "Number of results to return"
      }
    ),
    /* @__PURE__ */ R.jsx(
      Td,
      {
        label: "Start:",
        name: "start",
        value: d.start,
        onChange: v("start", !0),
        info: "Starting index for the results"
      }
    ),
    /* @__PURE__ */ R.jsx(
      Yn,
      {
        label: "Order by:",
        name: "orderBy",
        value: d.orderBy,
        onChange: v("orderBy"),
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
    /* @__PURE__ */ R.jsx("h4", { children: "Filters (comma separated):" }),
    /* @__PURE__ */ R.jsx(
      Ta,
      {
        label: "Language:",
        name: "language",
        value: d.language,
        onChange: v("language"),
        info: "Available values : ar-SA, bn-IN, cs-CZ, da-DK, de-DE, el-GR, en-US, es-ES, fil-P,fi-FI, fr-FR,hi-IN, id-ID, it-IT, ja-JP, ko-KR, ms-MY, nb-NO, nl-NL, pl-PL, pt-BR, ro-RO, ru-RU, sv-SE, ta-IN, th-TH, tr-TR, uk-UA, vi-VN, zh-Hans-CN, zh-Hant-TW"
      }
    ),
    /* @__PURE__ */ R.jsx(
      Ta,
      {
        label: "Tasks:",
        name: "tasks",
        value: d.tasks,
        onChange: v("tasks")
      }
    ),
    /* @__PURE__ */ R.jsx(Eh, {}),
    /* @__PURE__ */ R.jsx(
      Yn,
      {
        label: "Behaviors:",
        name: "behaviors",
        value: d.behaviors,
        onChange: v("behaviors"),
        options: [
          { value: "", label: "All (Default)" },
          { value: "still", label: "Still" },
          { value: "animated", label: "Animated" },
          { value: "video", label: "Video" },
          { value: "animated,video", label: "Animated + Video" }
        ]
      }
    ),
    /* @__PURE__ */ R.jsx(
      Yn,
      {
        label: "Licensing Category:",
        name: "license",
        value: d.license,
        onChange: v("license"),
        options: [
          { value: "", label: "All (Default)" },
          { value: "free", label: "Free" },
          { value: "premium", label: "Premium" }
        ]
      }
    ),
    /* @__PURE__ */ R.jsx("h4", { children: "Boosting:" }),
    /* @__PURE__ */ R.jsx(
      Ta,
      {
        label: "Preferred Language Boosting:",
        name: "prefLang",
        value: d.prefLang,
        onChange: v("prefLang"),
        info: "Boost templates that are in this language. Useful when your results have a mix of languages. Same list as the one for language filter."
      }
    ),
    /* @__PURE__ */ R.jsx(
      Ta,
      {
        label: "Preferred Region Boosting:",
        name: "prefRegion",
        value: d.prefRegion,
        onChange: v("prefRegion"),
        info: "Available values :  AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KR, KV, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, ST, SV, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, YE, YT, ZA, ZM, ZW, ZZ"
      }
    ),
    /* @__PURE__ */ R.jsx("h4", { children: "Backup Recipe:" }),
    /* @__PURE__ */ R.jsx(
      ph,
      {
        name: "backupRecipe",
        value: d.backupRecipe,
        onChange: v("backupRecipe"),
        label: "When not enough templates exist for the recipe's limit, templates from this backup recipe will be used to backfill. Note: start will stop functioning, and this setup should only be used for 1-page query (no toolbar and pagination)."
      }
    )
  ] });
}
function Rh(d) {
  var F;
  const b = (F = d.pages[0].rendition.image) == null ? void 0 : F.thumbnail, v = dh(d), s = rh(d), { mediaType: U, componentId: x, hzRevision: Q } = b;
  return U === "image/webp" ? v.replace(
    "{&revision,component_id}",
    `&revision=${Q || 0}&component_id=${x}`
  ) : s.replace(
    "{&page,size,type,fragment}",
    `&type=${U}&fragment=id=${x}`
  );
}
function zh({ data: d }) {
  const b = /* @__PURE__ */ R.jsx("img", { src: Rh(d), alt: oh(d) });
  return /* @__PURE__ */ R.jsx("div", { className: "flex flex-col template", children: b });
}
function Mh({ generateResults: d, loading: b, results: v }) {
  return /* @__PURE__ */ R.jsx("button", { onClick: d, disabled: b, children: b ? "Generating..." : v ? "Regenerate" : "Generate" });
}
function _h() {
  var O, C, tl;
  const d = Te(), b = yi(d), [v, s] = El.useState(null), [U, x] = El.useState(!1), [Q, F] = El.useState(null), M = async () => {
    s(null), x(!0), F(null);
    try {
      const $ = await sh(b);
      s($);
    } catch ($) {
      F($);
    } finally {
      x(!1);
    }
  };
  return /* @__PURE__ */ R.jsxs("div", { className: "border-grey rounded p-1 gap-1", children: [
    /* @__PURE__ */ R.jsx("h2", { children: "Results" }),
    /* @__PURE__ */ R.jsx(
      Mh,
      {
        generateResults: M,
        loading: U,
        results: v
      }
    ),
    U && /* @__PURE__ */ R.jsx("p", { children: "Loading..." }),
    Q && /* @__PURE__ */ R.jsxs("p", { children: [
      "Error: ",
      Q.message
    ] }),
    ((O = v == null ? void 0 : v.metadata) == null ? void 0 : O.totalHits) > 0 && /* @__PURE__ */ R.jsxs("p", { children: [
      "Total hits: ",
      v.metadata.totalHits
    ] }),
    ((C = v == null ? void 0 : v.metadata) == null ? void 0 : C.totalHits) === 0 && /* @__PURE__ */ R.jsx("p", { children: "No results found. Try different recipe." }),
    ((tl = v == null ? void 0 : v.items) == null ? void 0 : tl.length) > 0 && /* @__PURE__ */ R.jsx("div", { className: "flex flex-wrap gap-2 templates", children: v.items.map(($) => /* @__PURE__ */ R.jsx(zh, { data: $ }, $.id)) })
  ] });
}
function Dh() {
  const d = Te(), { url: b, headers: v, backupQuery: s } = vi(yi(d)), U = s ? /* @__PURE__ */ R.jsxs("div", { className: "pt-1", children: [
    /* @__PURE__ */ R.jsx("div", { children: /* @__PURE__ */ R.jsxs("code", { children: [
      "Backup URL: ",
      s.url
    ] }) }),
    /* @__PURE__ */ R.jsx("div", { children: /* @__PURE__ */ R.jsxs("code", { children: [
      "Backup Headers: ",
      JSON.stringify(s.headers, null, 2)
    ] }) })
  ] }) : null;
  return /* @__PURE__ */ R.jsxs("div", { className: "border-grey rounded p-1", children: [
    /* @__PURE__ */ R.jsx("h2", { children: "Support" }),
    /* @__PURE__ */ R.jsxs("p", { children: [
      "Authoring questions, copy the ",
      /* @__PURE__ */ R.jsx("strong", { children: "recipe (left)" }),
      " and ask in",
      " ",
      /* @__PURE__ */ R.jsx("a", { href: "https://adobe.enterprise.slack.com/archives/C04UH0M1CRG", children: "#express-dev-core" }),
      "."
    ] }),
    /* @__PURE__ */ R.jsxs("p", { children: [
      "API/Content Tagging questions, copy the url and headers below and ask in",
      " ",
      /* @__PURE__ */ R.jsx("a", { href: "https://adobe.enterprise.slack.com/archives/C01KV8N5EPR", children: "#express-content-clients" }),
      "."
    ] }),
    /* @__PURE__ */ R.jsxs("div", { className: "support--code", children: [
      /* @__PURE__ */ R.jsxs("div", { children: [
        /* @__PURE__ */ R.jsx("div", { children: /* @__PURE__ */ R.jsxs("code", { children: [
          "URL: ",
          b
        ] }) }),
        /* @__PURE__ */ R.jsx("div", { children: /* @__PURE__ */ R.jsxs("code", { children: [
          "headers: ",
          JSON.stringify(v, null, 2)
        ] }) })
      ] }),
      U
    ] })
  ] });
}
function Uh() {
  return /* @__PURE__ */ R.jsx(fh, { children: /* @__PURE__ */ R.jsx(Sh, { children: /* @__PURE__ */ R.jsxs("div", { className: "app-container m-auto", children: [
    /* @__PURE__ */ R.jsx("h1", { children: "Templates as a Service (TaaS)" }),
    /* @__PURE__ */ R.jsxs("div", { className: "flex flex-wrap gap-1", children: [
      /* @__PURE__ */ R.jsxs("div", { className: "left-container flex flex-col gap-1", children: [
        /* @__PURE__ */ R.jsx(bh, {}),
        /* @__PURE__ */ R.jsx(Oh, {})
      ] }),
      /* @__PURE__ */ R.jsxs("div", { className: "right-container flex flex-col gap-1", children: [
        /* @__PURE__ */ R.jsx(Dh, {}),
        /* @__PURE__ */ R.jsx(_h, {})
      ] })
    ] })
  ] }) }) });
}
function Nh(d = "root") {
  const b = document.getElementById(d);
  if (!b) {
    console.error(`Container with id "${d}" not found`);
    return;
  }
  const v = ch.createRoot(b);
  return v.render(
    /* @__PURE__ */ R.jsx(El.StrictMode, { children: /* @__PURE__ */ R.jsx(Uh, {}) })
  ), v;
}
typeof window < "u" && document.getElementById("root") && Nh("root");
export {
  Nh as initTemplatesAsAService
};
//# sourceMappingURL=templates-as-a-service.min.es.js.map
