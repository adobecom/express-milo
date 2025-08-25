var ef = { exports: {} }, pa = {};
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
function lv() {
  if (sd) return pa;
  sd = 1;
  var f = Symbol.for("react.transitional.element"), g = Symbol.for("react.fragment");
  function h(o, z, N) {
    var C = null;
    if (N !== void 0 && (C = "" + N), z.key !== void 0 && (C = "" + z.key), "key" in z) {
      N = {};
      for (var Z in z)
        Z !== "key" && (N[Z] = z[Z]);
    } else N = z;
    return z = N.ref, {
      $$typeof: f,
      type: o,
      key: C,
      ref: z !== void 0 ? z : null,
      props: N
    };
  }
  return pa.Fragment = g, pa.jsx = h, pa.jsxs = h, pa;
}
var od;
function tv() {
  return od || (od = 1, ef.exports = lv()), ef.exports;
}
var R = tv(), uf = { exports: {} }, L = {};
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
function ev() {
  if (rd) return L;
  rd = 1;
  var f = Symbol.for("react.transitional.element"), g = Symbol.for("react.portal"), h = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), z = Symbol.for("react.profiler"), N = Symbol.for("react.consumer"), C = Symbol.for("react.context"), Z = Symbol.for("react.forward_ref"), _ = Symbol.for("react.suspense"), T = Symbol.for("react.memo"), B = Symbol.for("react.lazy"), W = Symbol.iterator;
  function k(r) {
    return r === null || typeof r != "object" ? null : (r = W && r[W] || r["@@iterator"], typeof r == "function" ? r : null);
  }
  var zl = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, Ml = Object.assign, kl = {};
  function Hl(r, O, x) {
    this.props = r, this.context = O, this.refs = kl, this.updater = x || zl;
  }
  Hl.prototype.isReactComponent = {}, Hl.prototype.setState = function(r, O) {
    if (typeof r != "object" && typeof r != "function" && r != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, r, O, "setState");
  }, Hl.prototype.forceUpdate = function(r) {
    this.updater.enqueueForceUpdate(this, r, "forceUpdate");
  };
  function Ot() {
  }
  Ot.prototype = Hl.prototype;
  function St(r, O, x) {
    this.props = r, this.context = O, this.refs = kl, this.updater = x || zl;
  }
  var Sl = St.prototype = new Ot();
  Sl.constructor = St, Ml(Sl, Hl.prototype), Sl.isPureReactComponent = !0;
  var Vl = Array.isArray, I = { H: null, A: null, T: null, S: null, V: null }, Xl = Object.prototype.hasOwnProperty;
  function Cl(r, O, x, M, q, P) {
    return x = P.ref, {
      $$typeof: f,
      type: r,
      key: O,
      ref: x !== void 0 ? x : null,
      props: P
    };
  }
  function Ql(r, O) {
    return Cl(
      r.type,
      O,
      void 0,
      void 0,
      void 0,
      r.props
    );
  }
  function bt(r) {
    return typeof r == "object" && r !== null && r.$$typeof === f;
  }
  function Ce(r) {
    var O = { "=": "=0", ":": "=2" };
    return "$" + r.replace(/[=:]/g, function(x) {
      return O[x];
    });
  }
  var _t = /\/+/g;
  function Bl(r, O) {
    return typeof r == "object" && r !== null && r.key != null ? Ce("" + r.key) : O.toString(36);
  }
  function ve() {
  }
  function ye(r) {
    switch (r.status) {
      case "fulfilled":
        return r.value;
      case "rejected":
        throw r.reason;
      default:
        switch (typeof r.status == "string" ? r.then(ve, ve) : (r.status = "pending", r.then(
          function(O) {
            r.status === "pending" && (r.status = "fulfilled", r.value = O);
          },
          function(O) {
            r.status === "pending" && (r.status = "rejected", r.reason = O);
          }
        )), r.status) {
          case "fulfilled":
            return r.value;
          case "rejected":
            throw r.reason;
        }
    }
    throw r;
  }
  function jl(r, O, x, M, q) {
    var P = typeof r;
    (P === "undefined" || P === "boolean") && (r = null);
    var V = !1;
    if (r === null) V = !0;
    else
      switch (P) {
        case "bigint":
        case "string":
        case "number":
          V = !0;
          break;
        case "object":
          switch (r.$$typeof) {
            case f:
            case g:
              V = !0;
              break;
            case B:
              return V = r._init, jl(
                V(r._payload),
                O,
                x,
                M,
                q
              );
          }
      }
    if (V)
      return q = q(r), V = M === "" ? "." + Bl(r, 0) : M, Vl(q) ? (x = "", V != null && (x = V.replace(_t, "$&/") + "/"), jl(q, O, x, "", function(Vt) {
        return Vt;
      })) : q != null && (bt(q) && (q = Ql(
        q,
        x + (q.key == null || r && r.key === q.key ? "" : ("" + q.key).replace(
          _t,
          "$&/"
        ) + "/") + V
      )), O.push(q)), 1;
    V = 0;
    var Wl = M === "" ? "." : M + ":";
    if (Vl(r))
      for (var rl = 0; rl < r.length; rl++)
        M = r[rl], P = Wl + Bl(M, rl), V += jl(
          M,
          O,
          x,
          P,
          q
        );
    else if (rl = k(r), typeof rl == "function")
      for (r = rl.call(r), rl = 0; !(M = r.next()).done; )
        M = M.value, P = Wl + Bl(M, rl++), V += jl(
          M,
          O,
          x,
          P,
          q
        );
    else if (P === "object") {
      if (typeof r.then == "function")
        return jl(
          ye(r),
          O,
          x,
          M,
          q
        );
      throw O = String(r), Error(
        "Objects are not valid as a React child (found: " + (O === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : O) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return V;
  }
  function E(r, O, x) {
    if (r == null) return r;
    var M = [], q = 0;
    return jl(r, M, "", "", function(P) {
      return O.call(x, P, q++);
    }), M;
  }
  function U(r) {
    if (r._status === -1) {
      var O = r._result;
      O = O(), O.then(
        function(x) {
          (r._status === 0 || r._status === -1) && (r._status = 1, r._result = x);
        },
        function(x) {
          (r._status === 0 || r._status === -1) && (r._status = 2, r._result = x);
        }
      ), r._status === -1 && (r._status = 0, r._result = O);
    }
    if (r._status === 1) return r._result.default;
    throw r._result;
  }
  var X = typeof reportError == "function" ? reportError : function(r) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var O = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof r == "object" && r !== null && typeof r.message == "string" ? String(r.message) : String(r),
        error: r
      });
      if (!window.dispatchEvent(O)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", r);
      return;
    }
    console.error(r);
  };
  function il() {
  }
  return L.Children = {
    map: E,
    forEach: function(r, O, x) {
      E(
        r,
        function() {
          O.apply(this, arguments);
        },
        x
      );
    },
    count: function(r) {
      var O = 0;
      return E(r, function() {
        O++;
      }), O;
    },
    toArray: function(r) {
      return E(r, function(O) {
        return O;
      }) || [];
    },
    only: function(r) {
      if (!bt(r))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return r;
    }
  }, L.Component = Hl, L.Fragment = h, L.Profiler = z, L.PureComponent = St, L.StrictMode = o, L.Suspense = _, L.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = I, L.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(r) {
      return I.H.useMemoCache(r);
    }
  }, L.cache = function(r) {
    return function() {
      return r.apply(null, arguments);
    };
  }, L.cloneElement = function(r, O, x) {
    if (r == null)
      throw Error(
        "The argument must be a React element, but you passed " + r + "."
      );
    var M = Ml({}, r.props), q = r.key, P = void 0;
    if (O != null)
      for (V in O.ref !== void 0 && (P = void 0), O.key !== void 0 && (q = "" + O.key), O)
        !Xl.call(O, V) || V === "key" || V === "__self" || V === "__source" || V === "ref" && O.ref === void 0 || (M[V] = O[V]);
    var V = arguments.length - 2;
    if (V === 1) M.children = x;
    else if (1 < V) {
      for (var Wl = Array(V), rl = 0; rl < V; rl++)
        Wl[rl] = arguments[rl + 2];
      M.children = Wl;
    }
    return Cl(r.type, q, void 0, void 0, P, M);
  }, L.createContext = function(r) {
    return r = {
      $$typeof: C,
      _currentValue: r,
      _currentValue2: r,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, r.Provider = r, r.Consumer = {
      $$typeof: N,
      _context: r
    }, r;
  }, L.createElement = function(r, O, x) {
    var M, q = {}, P = null;
    if (O != null)
      for (M in O.key !== void 0 && (P = "" + O.key), O)
        Xl.call(O, M) && M !== "key" && M !== "__self" && M !== "__source" && (q[M] = O[M]);
    var V = arguments.length - 2;
    if (V === 1) q.children = x;
    else if (1 < V) {
      for (var Wl = Array(V), rl = 0; rl < V; rl++)
        Wl[rl] = arguments[rl + 2];
      q.children = Wl;
    }
    if (r && r.defaultProps)
      for (M in V = r.defaultProps, V)
        q[M] === void 0 && (q[M] = V[M]);
    return Cl(r, P, void 0, void 0, null, q);
  }, L.createRef = function() {
    return { current: null };
  }, L.forwardRef = function(r) {
    return { $$typeof: Z, render: r };
  }, L.isValidElement = bt, L.lazy = function(r) {
    return {
      $$typeof: B,
      _payload: { _status: -1, _result: r },
      _init: U
    };
  }, L.memo = function(r, O) {
    return {
      $$typeof: T,
      type: r,
      compare: O === void 0 ? null : O
    };
  }, L.startTransition = function(r) {
    var O = I.T, x = {};
    I.T = x;
    try {
      var M = r(), q = I.S;
      q !== null && q(x, M), typeof M == "object" && M !== null && typeof M.then == "function" && M.then(il, X);
    } catch (P) {
      X(P);
    } finally {
      I.T = O;
    }
  }, L.unstable_useCacheRefresh = function() {
    return I.H.useCacheRefresh();
  }, L.use = function(r) {
    return I.H.use(r);
  }, L.useActionState = function(r, O, x) {
    return I.H.useActionState(r, O, x);
  }, L.useCallback = function(r, O) {
    return I.H.useCallback(r, O);
  }, L.useContext = function(r) {
    return I.H.useContext(r);
  }, L.useDebugValue = function() {
  }, L.useDeferredValue = function(r, O) {
    return I.H.useDeferredValue(r, O);
  }, L.useEffect = function(r, O, x) {
    var M = I.H;
    if (typeof x == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return M.useEffect(r, O);
  }, L.useId = function() {
    return I.H.useId();
  }, L.useImperativeHandle = function(r, O, x) {
    return I.H.useImperativeHandle(r, O, x);
  }, L.useInsertionEffect = function(r, O) {
    return I.H.useInsertionEffect(r, O);
  }, L.useLayoutEffect = function(r, O) {
    return I.H.useLayoutEffect(r, O);
  }, L.useMemo = function(r, O) {
    return I.H.useMemo(r, O);
  }, L.useOptimistic = function(r, O) {
    return I.H.useOptimistic(r, O);
  }, L.useReducer = function(r, O, x) {
    return I.H.useReducer(r, O, x);
  }, L.useRef = function(r) {
    return I.H.useRef(r);
  }, L.useState = function(r) {
    return I.H.useState(r);
  }, L.useSyncExternalStore = function(r, O, x) {
    return I.H.useSyncExternalStore(
      r,
      O,
      x
    );
  }, L.useTransition = function() {
    return I.H.useTransition();
  }, L.version = "19.1.0", L;
}
var dd;
function rf() {
  return dd || (dd = 1, uf.exports = ev()), uf.exports;
}
var ol = rf(), af = { exports: {} }, Ea = {}, nf = { exports: {} }, cf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hd;
function uv() {
  return hd || (hd = 1, function(f) {
    function g(E, U) {
      var X = E.length;
      E.push(U);
      l: for (; 0 < X; ) {
        var il = X - 1 >>> 1, r = E[il];
        if (0 < z(r, U))
          E[il] = U, E[X] = r, X = il;
        else break l;
      }
    }
    function h(E) {
      return E.length === 0 ? null : E[0];
    }
    function o(E) {
      if (E.length === 0) return null;
      var U = E[0], X = E.pop();
      if (X !== U) {
        E[0] = X;
        l: for (var il = 0, r = E.length, O = r >>> 1; il < O; ) {
          var x = 2 * (il + 1) - 1, M = E[x], q = x + 1, P = E[q];
          if (0 > z(M, X))
            q < r && 0 > z(P, M) ? (E[il] = P, E[q] = X, il = q) : (E[il] = M, E[x] = X, il = x);
          else if (q < r && 0 > z(P, X))
            E[il] = P, E[q] = X, il = q;
          else break l;
        }
      }
      return U;
    }
    function z(E, U) {
      var X = E.sortIndex - U.sortIndex;
      return X !== 0 ? X : E.id - U.id;
    }
    if (f.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var N = performance;
      f.unstable_now = function() {
        return N.now();
      };
    } else {
      var C = Date, Z = C.now();
      f.unstable_now = function() {
        return C.now() - Z;
      };
    }
    var _ = [], T = [], B = 1, W = null, k = 3, zl = !1, Ml = !1, kl = !1, Hl = !1, Ot = typeof setTimeout == "function" ? setTimeout : null, St = typeof clearTimeout == "function" ? clearTimeout : null, Sl = typeof setImmediate < "u" ? setImmediate : null;
    function Vl(E) {
      for (var U = h(T); U !== null; ) {
        if (U.callback === null) o(T);
        else if (U.startTime <= E)
          o(T), U.sortIndex = U.expirationTime, g(_, U);
        else break;
        U = h(T);
      }
    }
    function I(E) {
      if (kl = !1, Vl(E), !Ml)
        if (h(_) !== null)
          Ml = !0, Xl || (Xl = !0, Bl());
        else {
          var U = h(T);
          U !== null && jl(I, U.startTime - E);
        }
    }
    var Xl = !1, Cl = -1, Ql = 5, bt = -1;
    function Ce() {
      return Hl ? !0 : !(f.unstable_now() - bt < Ql);
    }
    function _t() {
      if (Hl = !1, Xl) {
        var E = f.unstable_now();
        bt = E;
        var U = !0;
        try {
          l: {
            Ml = !1, kl && (kl = !1, St(Cl), Cl = -1), zl = !0;
            var X = k;
            try {
              t: {
                for (Vl(E), W = h(_); W !== null && !(W.expirationTime > E && Ce()); ) {
                  var il = W.callback;
                  if (typeof il == "function") {
                    W.callback = null, k = W.priorityLevel;
                    var r = il(
                      W.expirationTime <= E
                    );
                    if (E = f.unstable_now(), typeof r == "function") {
                      W.callback = r, Vl(E), U = !0;
                      break t;
                    }
                    W === h(_) && o(_), Vl(E);
                  } else o(_);
                  W = h(_);
                }
                if (W !== null) U = !0;
                else {
                  var O = h(T);
                  O !== null && jl(
                    I,
                    O.startTime - E
                  ), U = !1;
                }
              }
              break l;
            } finally {
              W = null, k = X, zl = !1;
            }
            U = void 0;
          }
        } finally {
          U ? Bl() : Xl = !1;
        }
      }
    }
    var Bl;
    if (typeof Sl == "function")
      Bl = function() {
        Sl(_t);
      };
    else if (typeof MessageChannel < "u") {
      var ve = new MessageChannel(), ye = ve.port2;
      ve.port1.onmessage = _t, Bl = function() {
        ye.postMessage(null);
      };
    } else
      Bl = function() {
        Ot(_t, 0);
      };
    function jl(E, U) {
      Cl = Ot(function() {
        E(f.unstable_now());
      }, U);
    }
    f.unstable_IdlePriority = 5, f.unstable_ImmediatePriority = 1, f.unstable_LowPriority = 4, f.unstable_NormalPriority = 3, f.unstable_Profiling = null, f.unstable_UserBlockingPriority = 2, f.unstable_cancelCallback = function(E) {
      E.callback = null;
    }, f.unstable_forceFrameRate = function(E) {
      0 > E || 125 < E ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Ql = 0 < E ? Math.floor(1e3 / E) : 5;
    }, f.unstable_getCurrentPriorityLevel = function() {
      return k;
    }, f.unstable_next = function(E) {
      switch (k) {
        case 1:
        case 2:
        case 3:
          var U = 3;
          break;
        default:
          U = k;
      }
      var X = k;
      k = U;
      try {
        return E();
      } finally {
        k = X;
      }
    }, f.unstable_requestPaint = function() {
      Hl = !0;
    }, f.unstable_runWithPriority = function(E, U) {
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
      var X = k;
      k = E;
      try {
        return U();
      } finally {
        k = X;
      }
    }, f.unstable_scheduleCallback = function(E, U, X) {
      var il = f.unstable_now();
      switch (typeof X == "object" && X !== null ? (X = X.delay, X = typeof X == "number" && 0 < X ? il + X : il) : X = il, E) {
        case 1:
          var r = -1;
          break;
        case 2:
          r = 250;
          break;
        case 5:
          r = 1073741823;
          break;
        case 4:
          r = 1e4;
          break;
        default:
          r = 5e3;
      }
      return r = X + r, E = {
        id: B++,
        callback: U,
        priorityLevel: E,
        startTime: X,
        expirationTime: r,
        sortIndex: -1
      }, X > il ? (E.sortIndex = X, g(T, E), h(_) === null && E === h(T) && (kl ? (St(Cl), Cl = -1) : kl = !0, jl(I, X - il))) : (E.sortIndex = r, g(_, E), Ml || zl || (Ml = !0, Xl || (Xl = !0, Bl()))), E;
    }, f.unstable_shouldYield = Ce, f.unstable_wrapCallback = function(E) {
      var U = k;
      return function() {
        var X = k;
        k = U;
        try {
          return E.apply(this, arguments);
        } finally {
          k = X;
        }
      };
    };
  }(cf)), cf;
}
var vd;
function av() {
  return vd || (vd = 1, nf.exports = uv()), nf.exports;
}
var ff = { exports: {} }, Gl = {};
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
function nv() {
  if (yd) return Gl;
  yd = 1;
  var f = rf();
  function g(_) {
    var T = "https://react.dev/errors/" + _;
    if (1 < arguments.length) {
      T += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var B = 2; B < arguments.length; B++)
        T += "&args[]=" + encodeURIComponent(arguments[B]);
    }
    return "Minified React error #" + _ + "; visit " + T + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function h() {
  }
  var o = {
    d: {
      f: h,
      r: function() {
        throw Error(g(522));
      },
      D: h,
      C: h,
      L: h,
      m: h,
      X: h,
      S: h,
      M: h
    },
    p: 0,
    findDOMNode: null
  }, z = Symbol.for("react.portal");
  function N(_, T, B) {
    var W = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: z,
      key: W == null ? null : "" + W,
      children: _,
      containerInfo: T,
      implementation: B
    };
  }
  var C = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function Z(_, T) {
    if (_ === "font") return "";
    if (typeof T == "string")
      return T === "use-credentials" ? T : "";
  }
  return Gl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Gl.createPortal = function(_, T) {
    var B = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!T || T.nodeType !== 1 && T.nodeType !== 9 && T.nodeType !== 11)
      throw Error(g(299));
    return N(_, T, null, B);
  }, Gl.flushSync = function(_) {
    var T = C.T, B = o.p;
    try {
      if (C.T = null, o.p = 2, _) return _();
    } finally {
      C.T = T, o.p = B, o.d.f();
    }
  }, Gl.preconnect = function(_, T) {
    typeof _ == "string" && (T ? (T = T.crossOrigin, T = typeof T == "string" ? T === "use-credentials" ? T : "" : void 0) : T = null, o.d.C(_, T));
  }, Gl.prefetchDNS = function(_) {
    typeof _ == "string" && o.d.D(_);
  }, Gl.preinit = function(_, T) {
    if (typeof _ == "string" && T && typeof T.as == "string") {
      var B = T.as, W = Z(B, T.crossOrigin), k = typeof T.integrity == "string" ? T.integrity : void 0, zl = typeof T.fetchPriority == "string" ? T.fetchPriority : void 0;
      B === "style" ? o.d.S(
        _,
        typeof T.precedence == "string" ? T.precedence : void 0,
        {
          crossOrigin: W,
          integrity: k,
          fetchPriority: zl
        }
      ) : B === "script" && o.d.X(_, {
        crossOrigin: W,
        integrity: k,
        fetchPriority: zl,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0
      });
    }
  }, Gl.preinitModule = function(_, T) {
    if (typeof _ == "string")
      if (typeof T == "object" && T !== null) {
        if (T.as == null || T.as === "script") {
          var B = Z(
            T.as,
            T.crossOrigin
          );
          o.d.M(_, {
            crossOrigin: B,
            integrity: typeof T.integrity == "string" ? T.integrity : void 0,
            nonce: typeof T.nonce == "string" ? T.nonce : void 0
          });
        }
      } else T == null && o.d.M(_);
  }, Gl.preload = function(_, T) {
    if (typeof _ == "string" && typeof T == "object" && T !== null && typeof T.as == "string") {
      var B = T.as, W = Z(B, T.crossOrigin);
      o.d.L(_, B, {
        crossOrigin: W,
        integrity: typeof T.integrity == "string" ? T.integrity : void 0,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0,
        type: typeof T.type == "string" ? T.type : void 0,
        fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0,
        referrerPolicy: typeof T.referrerPolicy == "string" ? T.referrerPolicy : void 0,
        imageSrcSet: typeof T.imageSrcSet == "string" ? T.imageSrcSet : void 0,
        imageSizes: typeof T.imageSizes == "string" ? T.imageSizes : void 0,
        media: typeof T.media == "string" ? T.media : void 0
      });
    }
  }, Gl.preloadModule = function(_, T) {
    if (typeof _ == "string")
      if (T) {
        var B = Z(T.as, T.crossOrigin);
        o.d.m(_, {
          as: typeof T.as == "string" && T.as !== "script" ? T.as : void 0,
          crossOrigin: B,
          integrity: typeof T.integrity == "string" ? T.integrity : void 0
        });
      } else o.d.m(_);
  }, Gl.requestFormReset = function(_) {
    o.d.r(_);
  }, Gl.unstable_batchedUpdates = function(_, T) {
    return _(T);
  }, Gl.useFormState = function(_, T, B) {
    return C.H.useFormState(_, T, B);
  }, Gl.useFormStatus = function() {
    return C.H.useHostTransitionStatus();
  }, Gl.version = "19.1.0", Gl;
}
var md;
function cv() {
  if (md) return ff.exports;
  md = 1;
  function f() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (g) {
        console.error(g);
      }
  }
  return f(), ff.exports = nv(), ff.exports;
}
var gd;
function iv() {
  if (gd) return Ea;
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
  var f = av(), g = rf(), h = cv();
  function o(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        t += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function z(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function N(l) {
    var t = l, e = l;
    if (l.alternate) for (; t.return; ) t = t.return;
    else {
      l = t;
      do
        t = l, (t.flags & 4098) !== 0 && (e = t.return), l = t.return;
      while (l);
    }
    return t.tag === 3 ? e : null;
  }
  function C(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Z(l) {
    if (N(l) !== l)
      throw Error(o(188));
  }
  function _(l) {
    var t = l.alternate;
    if (!t) {
      if (t = N(l), t === null) throw Error(o(188));
      return t !== l ? null : l;
    }
    for (var e = l, u = t; ; ) {
      var a = e.return;
      if (a === null) break;
      var n = a.alternate;
      if (n === null) {
        if (u = a.return, u !== null) {
          e = u;
          continue;
        }
        break;
      }
      if (a.child === n.child) {
        for (n = a.child; n; ) {
          if (n === e) return Z(a), l;
          if (n === u) return Z(a), t;
          n = n.sibling;
        }
        throw Error(o(188));
      }
      if (e.return !== u.return) e = a, u = n;
      else {
        for (var c = !1, i = a.child; i; ) {
          if (i === e) {
            c = !0, e = a, u = n;
            break;
          }
          if (i === u) {
            c = !0, u = a, e = n;
            break;
          }
          i = i.sibling;
        }
        if (!c) {
          for (i = n.child; i; ) {
            if (i === e) {
              c = !0, e = n, u = a;
              break;
            }
            if (i === u) {
              c = !0, u = n, e = a;
              break;
            }
            i = i.sibling;
          }
          if (!c) throw Error(o(189));
        }
      }
      if (e.alternate !== u) throw Error(o(190));
    }
    if (e.tag !== 3) throw Error(o(188));
    return e.stateNode.current === e ? l : t;
  }
  function T(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = T(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  var B = Object.assign, W = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), zl = Symbol.for("react.portal"), Ml = Symbol.for("react.fragment"), kl = Symbol.for("react.strict_mode"), Hl = Symbol.for("react.profiler"), Ot = Symbol.for("react.provider"), St = Symbol.for("react.consumer"), Sl = Symbol.for("react.context"), Vl = Symbol.for("react.forward_ref"), I = Symbol.for("react.suspense"), Xl = Symbol.for("react.suspense_list"), Cl = Symbol.for("react.memo"), Ql = Symbol.for("react.lazy"), bt = Symbol.for("react.activity"), Ce = Symbol.for("react.memo_cache_sentinel"), _t = Symbol.iterator;
  function Bl(l) {
    return l === null || typeof l != "object" ? null : (l = _t && l[_t] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var ve = Symbol.for("react.client.reference");
  function ye(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === ve ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case Ml:
        return "Fragment";
      case Hl:
        return "Profiler";
      case kl:
        return "StrictMode";
      case I:
        return "Suspense";
      case Xl:
        return "SuspenseList";
      case bt:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case zl:
          return "Portal";
        case Sl:
          return (l.displayName || "Context") + ".Provider";
        case St:
          return (l._context.displayName || "Context") + ".Consumer";
        case Vl:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case Cl:
          return t = l.displayName || null, t !== null ? t : ye(l.type) || "Memo";
        case Ql:
          t = l._payload, l = l._init;
          try {
            return ye(l(t));
          } catch {
          }
      }
    return null;
  }
  var jl = Array.isArray, E = g.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, U = h.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, X = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, il = [], r = -1;
  function O(l) {
    return { current: l };
  }
  function x(l) {
    0 > r || (l.current = il[r], il[r] = null, r--);
  }
  function M(l, t) {
    r++, il[r] = l.current, l.current = t;
  }
  var q = O(null), P = O(null), V = O(null), Wl = O(null);
  function rl(l, t) {
    switch (M(V, t), M(P, l), M(q, null), t.nodeType) {
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
    x(q), M(q, l);
  }
  function Vt() {
    x(q), x(P), x(V);
  }
  function Qn(l) {
    l.memoizedState !== null && M(Wl, l);
    var t = q.current, e = Yr(t, l.type);
    t !== e && (M(P, l), M(q, e));
  }
  function Aa(l) {
    P.current === l && (x(q), x(P)), Wl.current === l && (x(Wl), ma._currentValue = X);
  }
  var Zn = Object.prototype.hasOwnProperty, Vn = f.unstable_scheduleCallback, Ln = f.unstable_cancelCallback, xd = f.unstable_shouldYield, Hd = f.unstable_requestPaint, Tt = f.unstable_now, Cd = f.unstable_getCurrentPriorityLevel, mf = f.unstable_ImmediatePriority, gf = f.unstable_UserBlockingPriority, Da = f.unstable_NormalPriority, Bd = f.unstable_LowPriority, Sf = f.unstable_IdlePriority, jd = f.log, qd = f.unstable_setDisableYieldValue, Du = null, Fl = null;
  function Lt(l) {
    if (typeof jd == "function" && qd(l), Fl && typeof Fl.setStrictMode == "function")
      try {
        Fl.setStrictMode(Du, l);
      } catch {
      }
  }
  var Il = Math.clz32 ? Math.clz32 : Xd, Yd = Math.log, Gd = Math.LN2;
  function Xd(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (Yd(l) / Gd | 0) | 0;
  }
  var Ra = 256, Oa = 4194304;
  function me(l) {
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
  function _a(l, t, e) {
    var u = l.pendingLanes;
    if (u === 0) return 0;
    var a = 0, n = l.suspendedLanes, c = l.pingedLanes;
    l = l.warmLanes;
    var i = u & 134217727;
    return i !== 0 ? (u = i & ~n, u !== 0 ? a = me(u) : (c &= i, c !== 0 ? a = me(c) : e || (e = i & ~l, e !== 0 && (a = me(e))))) : (i = u & ~n, i !== 0 ? a = me(i) : c !== 0 ? a = me(c) : e || (e = u & ~l, e !== 0 && (a = me(e)))), a === 0 ? 0 : t !== 0 && t !== a && (t & n) === 0 && (n = a & -a, e = t & -t, n >= e || n === 32 && (e & 4194048) !== 0) ? t : a;
  }
  function Ru(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Qd(l, t) {
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
  function bf() {
    var l = Ra;
    return Ra <<= 1, (Ra & 4194048) === 0 && (Ra = 256), l;
  }
  function Tf() {
    var l = Oa;
    return Oa <<= 1, (Oa & 62914560) === 0 && (Oa = 4194304), l;
  }
  function Kn(l) {
    for (var t = [], e = 0; 31 > e; e++) t.push(l);
    return t;
  }
  function Ou(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function Zd(l, t, e, u, a, n) {
    var c = l.pendingLanes;
    l.pendingLanes = e, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= e, l.entangledLanes &= e, l.errorRecoveryDisabledLanes &= e, l.shellSuspendCounter = 0;
    var i = l.entanglements, s = l.expirationTimes, m = l.hiddenUpdates;
    for (e = c & ~e; 0 < e; ) {
      var p = 31 - Il(e), D = 1 << p;
      i[p] = 0, s[p] = -1;
      var S = m[p];
      if (S !== null)
        for (m[p] = null, p = 0; p < S.length; p++) {
          var b = S[p];
          b !== null && (b.lane &= -536870913);
        }
      e &= ~D;
    }
    u !== 0 && pf(l, u, 0), n !== 0 && a === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(c & ~t));
  }
  function pf(l, t, e) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var u = 31 - Il(t);
    l.entangledLanes |= t, l.entanglements[u] = l.entanglements[u] | 1073741824 | e & 4194090;
  }
  function Ef(l, t) {
    var e = l.entangledLanes |= t;
    for (l = l.entanglements; e; ) {
      var u = 31 - Il(e), a = 1 << u;
      a & t | l[u] & t && (l[u] |= t), e &= ~a;
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
  function Af() {
    var l = U.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : ud(l.type));
  }
  function Vd(l, t) {
    var e = U.p;
    try {
      return U.p = l, t();
    } finally {
      U.p = e;
    }
  }
  var Kt = Math.random().toString(36).slice(2), ql = "__reactFiber$" + Kt, Ll = "__reactProps$" + Kt, Be = "__reactContainer$" + Kt, $n = "__reactEvents$" + Kt, Ld = "__reactListeners$" + Kt, Kd = "__reactHandles$" + Kt, Df = "__reactResources$" + Kt, _u = "__reactMarker$" + Kt;
  function kn(l) {
    delete l[ql], delete l[Ll], delete l[$n], delete l[Ld], delete l[Kd];
  }
  function je(l) {
    var t = l[ql];
    if (t) return t;
    for (var e = l.parentNode; e; ) {
      if (t = e[Be] || e[ql]) {
        if (e = t.alternate, t.child !== null || e !== null && e.child !== null)
          for (l = Zr(l); l !== null; ) {
            if (e = l[ql]) return e;
            l = Zr(l);
          }
        return t;
      }
      l = e, e = l.parentNode;
    }
    return null;
  }
  function qe(l) {
    if (l = l[ql] || l[Be]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function zu(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(o(33));
  }
  function Ye(l) {
    var t = l[Df];
    return t || (t = l[Df] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Al(l) {
    l[_u] = !0;
  }
  var Rf = /* @__PURE__ */ new Set(), Of = {};
  function ge(l, t) {
    Ge(l, t), Ge(l + "Capture", t);
  }
  function Ge(l, t) {
    for (Of[l] = t, l = 0; l < t.length; l++)
      Rf.add(t[l]);
  }
  var Jd = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), _f = {}, zf = {};
  function wd(l) {
    return Zn.call(zf, l) ? !0 : Zn.call(_f, l) ? !1 : Jd.test(l) ? zf[l] = !0 : (_f[l] = !0, !1);
  }
  function za(l, t, e) {
    if (wd(t))
      if (e === null) l.removeAttribute(t);
      else {
        switch (typeof e) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var u = t.toLowerCase().slice(0, 5);
            if (u !== "data-" && u !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, "" + e);
      }
  }
  function Ma(l, t, e) {
    if (e === null) l.removeAttribute(t);
    else {
      switch (typeof e) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, "" + e);
    }
  }
  function zt(l, t, e, u) {
    if (u === null) l.removeAttribute(e);
    else {
      switch (typeof u) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(e);
          return;
      }
      l.setAttributeNS(t, e, "" + u);
    }
  }
  var Wn, Mf;
  function Xe(l) {
    if (Wn === void 0)
      try {
        throw Error();
      } catch (e) {
        var t = e.stack.trim().match(/\n( *(at )?)/);
        Wn = t && t[1] || "", Mf = -1 < e.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Wn + l + Mf;
  }
  var Fn = !1;
  function In(l, t) {
    if (!l || Fn) return "";
    Fn = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var u = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var D = function() {
                throw Error();
              };
              if (Object.defineProperty(D.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(D, []);
                } catch (b) {
                  var S = b;
                }
                Reflect.construct(l, [], D);
              } else {
                try {
                  D.call();
                } catch (b) {
                  S = b;
                }
                l.call(D.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (b) {
                S = b;
              }
              (D = l()) && typeof D.catch == "function" && D.catch(function() {
              });
            }
          } catch (b) {
            if (b && S && typeof b.stack == "string")
              return [b.stack, S.stack];
          }
          return [null, null];
        }
      };
      u.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var a = Object.getOwnPropertyDescriptor(
        u.DetermineComponentFrameRoot,
        "name"
      );
      a && a.configurable && Object.defineProperty(
        u.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var n = u.DetermineComponentFrameRoot(), c = n[0], i = n[1];
      if (c && i) {
        var s = c.split(`
`), m = i.split(`
`);
        for (a = u = 0; u < s.length && !s[u].includes("DetermineComponentFrameRoot"); )
          u++;
        for (; a < m.length && !m[a].includes(
          "DetermineComponentFrameRoot"
        ); )
          a++;
        if (u === s.length || a === m.length)
          for (u = s.length - 1, a = m.length - 1; 1 <= u && 0 <= a && s[u] !== m[a]; )
            a--;
        for (; 1 <= u && 0 <= a; u--, a--)
          if (s[u] !== m[a]) {
            if (u !== 1 || a !== 1)
              do
                if (u--, a--, 0 > a || s[u] !== m[a]) {
                  var p = `
` + s[u].replace(" at new ", " at ");
                  return l.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", l.displayName)), p;
                }
              while (1 <= u && 0 <= a);
            break;
          }
      }
    } finally {
      Fn = !1, Error.prepareStackTrace = e;
    }
    return (e = l ? l.displayName || l.name : "") ? Xe(e) : "";
  }
  function $d(l) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return Xe(l.type);
      case 16:
        return Xe("Lazy");
      case 13:
        return Xe("Suspense");
      case 19:
        return Xe("SuspenseList");
      case 0:
      case 15:
        return In(l.type, !1);
      case 11:
        return In(l.type.render, !1);
      case 1:
        return In(l.type, !0);
      case 31:
        return Xe("Activity");
      default:
        return "";
    }
  }
  function Uf(l) {
    try {
      var t = "";
      do
        t += $d(l), l = l.return;
      while (l);
      return t;
    } catch (e) {
      return `
Error generating stack: ` + e.message + `
` + e.stack;
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
  function Nf(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function kd(l) {
    var t = Nf(l) ? "checked" : "value", e = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      t
    ), u = "" + l[t];
    if (!l.hasOwnProperty(t) && typeof e < "u" && typeof e.get == "function" && typeof e.set == "function") {
      var a = e.get, n = e.set;
      return Object.defineProperty(l, t, {
        configurable: !0,
        get: function() {
          return a.call(this);
        },
        set: function(c) {
          u = "" + c, n.call(this, c);
        }
      }), Object.defineProperty(l, t, {
        enumerable: e.enumerable
      }), {
        getValue: function() {
          return u;
        },
        setValue: function(c) {
          u = "" + c;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[t];
        }
      };
    }
  }
  function Ua(l) {
    l._valueTracker || (l._valueTracker = kd(l));
  }
  function xf(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var e = t.getValue(), u = "";
    return l && (u = Nf(l) ? l.checked ? "true" : "false" : l.value), l = u, l !== e ? (t.setValue(l), !0) : !1;
  }
  function Na(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var Wd = /[\n"\\]/g;
  function it(l) {
    return l.replace(
      Wd,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Pn(l, t, e, u, a, n, c, i) {
    l.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? l.type = c : l.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + ct(t)) : l.value !== "" + ct(t) && (l.value = "" + ct(t)) : c !== "submit" && c !== "reset" || l.removeAttribute("value"), t != null ? lc(l, c, ct(t)) : e != null ? lc(l, c, ct(e)) : u != null && l.removeAttribute("value"), a == null && n != null && (l.defaultChecked = !!n), a != null && (l.checked = a && typeof a != "function" && typeof a != "symbol"), i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? l.name = "" + ct(i) : l.removeAttribute("name");
  }
  function Hf(l, t, e, u, a, n, c, i) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || e != null) {
      if (!(n !== "submit" && n !== "reset" || t != null))
        return;
      e = e != null ? "" + ct(e) : "", t = t != null ? "" + ct(t) : e, i || t === l.value || (l.value = t), l.defaultValue = t;
    }
    u = u ?? a, u = typeof u != "function" && typeof u != "symbol" && !!u, l.checked = i ? l.checked : !!u, l.defaultChecked = !!u, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (l.name = c);
  }
  function lc(l, t, e) {
    t === "number" && Na(l.ownerDocument) === l || l.defaultValue === "" + e || (l.defaultValue = "" + e);
  }
  function Qe(l, t, e, u) {
    if (l = l.options, t) {
      t = {};
      for (var a = 0; a < e.length; a++)
        t["$" + e[a]] = !0;
      for (e = 0; e < l.length; e++)
        a = t.hasOwnProperty("$" + l[e].value), l[e].selected !== a && (l[e].selected = a), a && u && (l[e].defaultSelected = !0);
    } else {
      for (e = "" + ct(e), t = null, a = 0; a < l.length; a++) {
        if (l[a].value === e) {
          l[a].selected = !0, u && (l[a].defaultSelected = !0);
          return;
        }
        t !== null || l[a].disabled || (t = l[a]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Cf(l, t, e) {
    if (t != null && (t = "" + ct(t), t !== l.value && (l.value = t), e == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = e != null ? "" + ct(e) : "";
  }
  function Bf(l, t, e, u) {
    if (t == null) {
      if (u != null) {
        if (e != null) throw Error(o(92));
        if (jl(u)) {
          if (1 < u.length) throw Error(o(93));
          u = u[0];
        }
        e = u;
      }
      e == null && (e = ""), t = e;
    }
    e = ct(t), l.defaultValue = e, u = l.textContent, u === e && u !== "" && u !== null && (l.value = u);
  }
  function Ze(l, t) {
    if (t) {
      var e = l.firstChild;
      if (e && e === l.lastChild && e.nodeType === 3) {
        e.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var Fd = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function jf(l, t, e) {
    var u = t.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === "" ? u ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : u ? l.setProperty(t, e) : typeof e != "number" || e === 0 || Fd.has(t) ? t === "float" ? l.cssFloat = e : l[t] = ("" + e).trim() : l[t] = e + "px";
  }
  function qf(l, t, e) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (l = l.style, e != null) {
      for (var u in e)
        !e.hasOwnProperty(u) || t != null && t.hasOwnProperty(u) || (u.indexOf("--") === 0 ? l.setProperty(u, "") : u === "float" ? l.cssFloat = "" : l[u] = "");
      for (var a in t)
        u = t[a], t.hasOwnProperty(a) && e[a] !== u && jf(l, a, u);
    } else
      for (var n in t)
        t.hasOwnProperty(n) && jf(l, n, t[n]);
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
  var Id = /* @__PURE__ */ new Map([
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
  ]), Pd = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function xa(l) {
    return Pd.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  var ec = null;
  function uc(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var Ve = null, Le = null;
  function Yf(l) {
    var t = qe(l);
    if (t && (l = t.stateNode)) {
      var e = l[Ll] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if (Pn(
            l,
            e.value,
            e.defaultValue,
            e.defaultValue,
            e.checked,
            e.defaultChecked,
            e.type,
            e.name
          ), t = e.name, e.type === "radio" && t != null) {
            for (e = l; e.parentNode; ) e = e.parentNode;
            for (e = e.querySelectorAll(
              'input[name="' + it(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < e.length; t++) {
              var u = e[t];
              if (u !== l && u.form === l.form) {
                var a = u[Ll] || null;
                if (!a) throw Error(o(90));
                Pn(
                  u,
                  a.value,
                  a.defaultValue,
                  a.defaultValue,
                  a.checked,
                  a.defaultChecked,
                  a.type,
                  a.name
                );
              }
            }
            for (t = 0; t < e.length; t++)
              u = e[t], u.form === l.form && xf(u);
          }
          break l;
        case "textarea":
          Cf(l, e.value, e.defaultValue);
          break l;
        case "select":
          t = e.value, t != null && Qe(l, !!e.multiple, t, !1);
      }
    }
  }
  var ac = !1;
  function Gf(l, t, e) {
    if (ac) return l(t, e);
    ac = !0;
    try {
      var u = l(t);
      return u;
    } finally {
      if (ac = !1, (Ve !== null || Le !== null) && (Sn(), Ve && (t = Ve, l = Le, Le = Ve = null, Yf(t), l)))
        for (t = 0; t < l.length; t++) Yf(l[t]);
    }
  }
  function Mu(l, t) {
    var e = l.stateNode;
    if (e === null) return null;
    var u = e[Ll] || null;
    if (u === null) return null;
    e = u[t];
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
        (u = !u.disabled) || (l = l.type, u = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !u;
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (e && typeof e != "function")
      throw Error(
        o(231, t, typeof e)
      );
    return e;
  }
  var Mt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), nc = !1;
  if (Mt)
    try {
      var Uu = {};
      Object.defineProperty(Uu, "passive", {
        get: function() {
          nc = !0;
        }
      }), window.addEventListener("test", Uu, Uu), window.removeEventListener("test", Uu, Uu);
    } catch {
      nc = !1;
    }
  var Jt = null, cc = null, Ha = null;
  function Xf() {
    if (Ha) return Ha;
    var l, t = cc, e = t.length, u, a = "value" in Jt ? Jt.value : Jt.textContent, n = a.length;
    for (l = 0; l < e && t[l] === a[l]; l++) ;
    var c = e - l;
    for (u = 1; u <= c && t[e - u] === a[n - u]; u++) ;
    return Ha = a.slice(l, 1 < u ? 1 - u : void 0);
  }
  function Ca(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function Ba() {
    return !0;
  }
  function Qf() {
    return !1;
  }
  function Kl(l) {
    function t(e, u, a, n, c) {
      this._reactName = e, this._targetInst = a, this.type = u, this.nativeEvent = n, this.target = c, this.currentTarget = null;
      for (var i in l)
        l.hasOwnProperty(i) && (e = l[i], this[i] = e ? e(n) : n[i]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Ba : Qf, this.isPropagationStopped = Qf, this;
    }
    return B(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var e = this.nativeEvent;
        e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Ba);
      },
      stopPropagation: function() {
        var e = this.nativeEvent;
        e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Ba);
      },
      persist: function() {
      },
      isPersistent: Ba
    }), t;
  }
  var Se = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, ja = Kl(Se), Nu = B({}, Se, { view: 0, detail: 0 }), l0 = Kl(Nu), ic, fc, xu, qa = B({}, Nu, {
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
      return "movementX" in l ? l.movementX : (l !== xu && (xu && l.type === "mousemove" ? (ic = l.screenX - xu.screenX, fc = l.screenY - xu.screenY) : fc = ic = 0, xu = l), ic);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : fc;
    }
  }), Zf = Kl(qa), t0 = B({}, qa, { dataTransfer: 0 }), e0 = Kl(t0), u0 = B({}, Nu, { relatedTarget: 0 }), sc = Kl(u0), a0 = B({}, Se, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), n0 = Kl(a0), c0 = B({}, Se, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), i0 = Kl(c0), f0 = B({}, Se, { data: 0 }), Vf = Kl(f0), s0 = {
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
  }, o0 = {
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
  }, r0 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function d0(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = r0[l]) ? !!t[l] : !1;
  }
  function oc() {
    return d0;
  }
  var h0 = B({}, Nu, {
    key: function(l) {
      if (l.key) {
        var t = s0[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = Ca(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? o0[l.keyCode] || "Unidentified" : "";
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
      return l.type === "keypress" ? Ca(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? Ca(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), v0 = Kl(h0), y0 = B({}, qa, {
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
  }), Lf = Kl(y0), m0 = B({}, Nu, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: oc
  }), g0 = Kl(m0), S0 = B({}, Se, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), b0 = Kl(S0), T0 = B({}, qa, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), p0 = Kl(T0), E0 = B({}, Se, {
    newState: 0,
    oldState: 0
  }), A0 = Kl(E0), D0 = [9, 13, 27, 32], rc = Mt && "CompositionEvent" in window, Hu = null;
  Mt && "documentMode" in document && (Hu = document.documentMode);
  var R0 = Mt && "TextEvent" in window && !Hu, Kf = Mt && (!rc || Hu && 8 < Hu && 11 >= Hu), Jf = " ", wf = !1;
  function $f(l, t) {
    switch (l) {
      case "keyup":
        return D0.indexOf(t.keyCode) !== -1;
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
  function kf(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var Ke = !1;
  function O0(l, t) {
    switch (l) {
      case "compositionend":
        return kf(t);
      case "keypress":
        return t.which !== 32 ? null : (wf = !0, Jf);
      case "textInput":
        return l = t.data, l === Jf && wf ? null : l;
      default:
        return null;
    }
  }
  function _0(l, t) {
    if (Ke)
      return l === "compositionend" || !rc && $f(l, t) ? (l = Xf(), Ha = cc = Jt = null, Ke = !1, l) : null;
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
        return Kf && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var z0 = {
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
  function Wf(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!z0[l.type] : t === "textarea";
  }
  function Ff(l, t, e, u) {
    Ve ? Le ? Le.push(u) : Le = [u] : Ve = u, t = Dn(t, "onChange"), 0 < t.length && (e = new ja(
      "onChange",
      "change",
      null,
      e,
      u
    ), l.push({ event: e, listeners: t }));
  }
  var Cu = null, Bu = null;
  function M0(l) {
    xr(l, 0);
  }
  function Ya(l) {
    var t = zu(l);
    if (xf(t)) return l;
  }
  function If(l, t) {
    if (l === "change") return t;
  }
  var Pf = !1;
  if (Mt) {
    var dc;
    if (Mt) {
      var hc = "oninput" in document;
      if (!hc) {
        var ls = document.createElement("div");
        ls.setAttribute("oninput", "return;"), hc = typeof ls.oninput == "function";
      }
      dc = hc;
    } else dc = !1;
    Pf = dc && (!document.documentMode || 9 < document.documentMode);
  }
  function ts() {
    Cu && (Cu.detachEvent("onpropertychange", es), Bu = Cu = null);
  }
  function es(l) {
    if (l.propertyName === "value" && Ya(Bu)) {
      var t = [];
      Ff(
        t,
        Bu,
        l,
        uc(l)
      ), Gf(M0, t);
    }
  }
  function U0(l, t, e) {
    l === "focusin" ? (ts(), Cu = t, Bu = e, Cu.attachEvent("onpropertychange", es)) : l === "focusout" && ts();
  }
  function N0(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Ya(Bu);
  }
  function x0(l, t) {
    if (l === "click") return Ya(t);
  }
  function H0(l, t) {
    if (l === "input" || l === "change")
      return Ya(t);
  }
  function C0(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var Pl = typeof Object.is == "function" ? Object.is : C0;
  function ju(l, t) {
    if (Pl(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var e = Object.keys(l), u = Object.keys(t);
    if (e.length !== u.length) return !1;
    for (u = 0; u < e.length; u++) {
      var a = e[u];
      if (!Zn.call(t, a) || !Pl(l[a], t[a]))
        return !1;
    }
    return !0;
  }
  function us(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function as(l, t) {
    var e = us(l);
    l = 0;
    for (var u; e; ) {
      if (e.nodeType === 3) {
        if (u = l + e.textContent.length, l <= t && u >= t)
          return { node: e, offset: t - l };
        l = u;
      }
      l: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break l;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = us(e);
    }
  }
  function ns(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ns(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function cs(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = Na(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var e = typeof t.contentWindow.location.href == "string";
      } catch {
        e = !1;
      }
      if (e) l = t.contentWindow;
      else break;
      t = Na(l.document);
    }
    return t;
  }
  function vc(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var B0 = Mt && "documentMode" in document && 11 >= document.documentMode, Je = null, yc = null, qu = null, mc = !1;
  function is(l, t, e) {
    var u = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    mc || Je == null || Je !== Na(u) || (u = Je, "selectionStart" in u && vc(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = {
      anchorNode: u.anchorNode,
      anchorOffset: u.anchorOffset,
      focusNode: u.focusNode,
      focusOffset: u.focusOffset
    }), qu && ju(qu, u) || (qu = u, u = Dn(yc, "onSelect"), 0 < u.length && (t = new ja(
      "onSelect",
      "select",
      null,
      t,
      e
    ), l.push({ event: t, listeners: u }), t.target = Je)));
  }
  function be(l, t) {
    var e = {};
    return e[l.toLowerCase()] = t.toLowerCase(), e["Webkit" + l] = "webkit" + t, e["Moz" + l] = "moz" + t, e;
  }
  var we = {
    animationend: be("Animation", "AnimationEnd"),
    animationiteration: be("Animation", "AnimationIteration"),
    animationstart: be("Animation", "AnimationStart"),
    transitionrun: be("Transition", "TransitionRun"),
    transitionstart: be("Transition", "TransitionStart"),
    transitioncancel: be("Transition", "TransitionCancel"),
    transitionend: be("Transition", "TransitionEnd")
  }, gc = {}, fs = {};
  Mt && (fs = document.createElement("div").style, "AnimationEvent" in window || (delete we.animationend.animation, delete we.animationiteration.animation, delete we.animationstart.animation), "TransitionEvent" in window || delete we.transitionend.transition);
  function Te(l) {
    if (gc[l]) return gc[l];
    if (!we[l]) return l;
    var t = we[l], e;
    for (e in t)
      if (t.hasOwnProperty(e) && e in fs)
        return gc[l] = t[e];
    return l;
  }
  var ss = Te("animationend"), os = Te("animationiteration"), rs = Te("animationstart"), j0 = Te("transitionrun"), q0 = Te("transitionstart"), Y0 = Te("transitioncancel"), ds = Te("transitionend"), hs = /* @__PURE__ */ new Map(), Sc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Sc.push("scrollEnd");
  function yt(l, t) {
    hs.set(l, t), ge(t, [l]);
  }
  var vs = /* @__PURE__ */ new WeakMap();
  function ft(l, t) {
    if (typeof l == "object" && l !== null) {
      var e = vs.get(l);
      return e !== void 0 ? e : (t = {
        value: l,
        source: t,
        stack: Uf(t)
      }, vs.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: Uf(t)
    };
  }
  var st = [], $e = 0, bc = 0;
  function Ga() {
    for (var l = $e, t = bc = $e = 0; t < l; ) {
      var e = st[t];
      st[t++] = null;
      var u = st[t];
      st[t++] = null;
      var a = st[t];
      st[t++] = null;
      var n = st[t];
      if (st[t++] = null, u !== null && a !== null) {
        var c = u.pending;
        c === null ? a.next = a : (a.next = c.next, c.next = a), u.pending = a;
      }
      n !== 0 && ys(e, a, n);
    }
  }
  function Xa(l, t, e, u) {
    st[$e++] = l, st[$e++] = t, st[$e++] = e, st[$e++] = u, bc |= u, l.lanes |= u, l = l.alternate, l !== null && (l.lanes |= u);
  }
  function Tc(l, t, e, u) {
    return Xa(l, t, e, u), Qa(l);
  }
  function ke(l, t) {
    return Xa(l, null, null, t), Qa(l);
  }
  function ys(l, t, e) {
    l.lanes |= e;
    var u = l.alternate;
    u !== null && (u.lanes |= e);
    for (var a = !1, n = l.return; n !== null; )
      n.childLanes |= e, u = n.alternate, u !== null && (u.childLanes |= e), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (a = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, a && t !== null && (a = 31 - Il(e), l = n.hiddenUpdates, u = l[a], u === null ? l[a] = [t] : u.push(t), t.lane = e | 536870912), n) : null;
  }
  function Qa(l) {
    if (50 < fa)
      throw fa = 0, Oi = null, Error(o(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var We = {};
  function G0(l, t, e, u) {
    this.tag = l, this.key = e, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function lt(l, t, e, u) {
    return new G0(l, t, e, u);
  }
  function pc(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function Ut(l, t) {
    var e = l.alternate;
    return e === null ? (e = lt(
      l.tag,
      t,
      l.key,
      l.mode
    ), e.elementType = l.elementType, e.type = l.type, e.stateNode = l.stateNode, e.alternate = l, l.alternate = e) : (e.pendingProps = t, e.type = l.type, e.flags = 0, e.subtreeFlags = 0, e.deletions = null), e.flags = l.flags & 65011712, e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, t = l.dependencies, e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, e.sibling = l.sibling, e.index = l.index, e.ref = l.ref, e.refCleanup = l.refCleanup, e;
  }
  function ms(l, t) {
    l.flags &= 65011714;
    var e = l.alternate;
    return e === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, l.type = e.type, t = e.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function Za(l, t, e, u, a, n) {
    var c = 0;
    if (u = l, typeof l == "function") pc(l) && (c = 1);
    else if (typeof l == "string")
      c = Qh(
        l,
        e,
        q.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (l) {
        case bt:
          return l = lt(31, e, t, a), l.elementType = bt, l.lanes = n, l;
        case Ml:
          return pe(e.children, a, n, t);
        case kl:
          c = 8, a |= 24;
          break;
        case Hl:
          return l = lt(12, e, t, a | 2), l.elementType = Hl, l.lanes = n, l;
        case I:
          return l = lt(13, e, t, a), l.elementType = I, l.lanes = n, l;
        case Xl:
          return l = lt(19, e, t, a), l.elementType = Xl, l.lanes = n, l;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case Ot:
              case Sl:
                c = 10;
                break l;
              case St:
                c = 9;
                break l;
              case Vl:
                c = 11;
                break l;
              case Cl:
                c = 14;
                break l;
              case Ql:
                c = 16, u = null;
                break l;
            }
          c = 29, e = Error(
            o(130, l === null ? "null" : typeof l, "")
          ), u = null;
      }
    return t = lt(c, e, t, a), t.elementType = l, t.type = u, t.lanes = n, t;
  }
  function pe(l, t, e, u) {
    return l = lt(7, l, u, t), l.lanes = e, l;
  }
  function Ec(l, t, e) {
    return l = lt(6, l, null, t), l.lanes = e, l;
  }
  function Ac(l, t, e) {
    return t = lt(
      4,
      l.children !== null ? l.children : [],
      l.key,
      t
    ), t.lanes = e, t.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }, t;
  }
  var Fe = [], Ie = 0, Va = null, La = 0, ot = [], rt = 0, Ee = null, Nt = 1, xt = "";
  function Ae(l, t) {
    Fe[Ie++] = La, Fe[Ie++] = Va, Va = l, La = t;
  }
  function gs(l, t, e) {
    ot[rt++] = Nt, ot[rt++] = xt, ot[rt++] = Ee, Ee = l;
    var u = Nt;
    l = xt;
    var a = 32 - Il(u) - 1;
    u &= ~(1 << a), e += 1;
    var n = 32 - Il(t) + a;
    if (30 < n) {
      var c = a - a % 5;
      n = (u & (1 << c) - 1).toString(32), u >>= c, a -= c, Nt = 1 << 32 - Il(t) + a | e << a | u, xt = n + l;
    } else
      Nt = 1 << n | e << a | u, xt = l;
  }
  function Dc(l) {
    l.return !== null && (Ae(l, 1), gs(l, 1, 0));
  }
  function Rc(l) {
    for (; l === Va; )
      Va = Fe[--Ie], Fe[Ie] = null, La = Fe[--Ie], Fe[Ie] = null;
    for (; l === Ee; )
      Ee = ot[--rt], ot[rt] = null, xt = ot[--rt], ot[rt] = null, Nt = ot[--rt], ot[rt] = null;
  }
  var Zl = null, vl = null, tl = !1, De = null, pt = !1, Oc = Error(o(519));
  function Re(l) {
    var t = Error(o(418, ""));
    throw Xu(ft(t, l)), Oc;
  }
  function Ss(l) {
    var t = l.stateNode, e = l.type, u = l.memoizedProps;
    switch (t[ql] = l, t[Ll] = u, e) {
      case "dialog":
        $("cancel", t), $("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        $("load", t);
        break;
      case "video":
      case "audio":
        for (e = 0; e < oa.length; e++)
          $(oa[e], t);
        break;
      case "source":
        $("error", t);
        break;
      case "img":
      case "image":
      case "link":
        $("error", t), $("load", t);
        break;
      case "details":
        $("toggle", t);
        break;
      case "input":
        $("invalid", t), Hf(
          t,
          u.value,
          u.defaultValue,
          u.checked,
          u.defaultChecked,
          u.type,
          u.name,
          !0
        ), Ua(t);
        break;
      case "select":
        $("invalid", t);
        break;
      case "textarea":
        $("invalid", t), Bf(t, u.value, u.defaultValue, u.children), Ua(t);
    }
    e = u.children, typeof e != "string" && typeof e != "number" && typeof e != "bigint" || t.textContent === "" + e || u.suppressHydrationWarning === !0 || jr(t.textContent, e) ? (u.popover != null && ($("beforetoggle", t), $("toggle", t)), u.onScroll != null && $("scroll", t), u.onScrollEnd != null && $("scrollend", t), u.onClick != null && (t.onclick = Rn), t = !0) : t = !1, t || Re(l);
  }
  function bs(l) {
    for (Zl = l.return; Zl; )
      switch (Zl.tag) {
        case 5:
        case 13:
          pt = !1;
          return;
        case 27:
        case 3:
          pt = !0;
          return;
        default:
          Zl = Zl.return;
      }
  }
  function Yu(l) {
    if (l !== Zl) return !1;
    if (!tl) return bs(l), tl = !0, !1;
    var t = l.tag, e;
    if ((e = t !== 3 && t !== 27) && ((e = t === 5) && (e = l.type, e = !(e !== "form" && e !== "button") || Zi(l.type, l.memoizedProps)), e = !e), e && vl && Re(l), bs(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(317));
      l: {
        for (l = l.nextSibling, t = 0; l; ) {
          if (l.nodeType === 8)
            if (e = l.data, e === "/$") {
              if (t === 0) {
                vl = gt(l.nextSibling);
                break l;
              }
              t--;
            } else
              e !== "$" && e !== "$!" && e !== "$?" || t++;
          l = l.nextSibling;
        }
        vl = null;
      }
    } else
      t === 27 ? (t = vl, fe(l.type) ? (l = Ji, Ji = null, vl = l) : vl = t) : vl = Zl ? gt(l.stateNode.nextSibling) : null;
    return !0;
  }
  function Gu() {
    vl = Zl = null, tl = !1;
  }
  function Ts() {
    var l = De;
    return l !== null && ($l === null ? $l = l : $l.push.apply(
      $l,
      l
    ), De = null), l;
  }
  function Xu(l) {
    De === null ? De = [l] : De.push(l);
  }
  var _c = O(null), Oe = null, Ht = null;
  function wt(l, t, e) {
    M(_c, t._currentValue), t._currentValue = e;
  }
  function Ct(l) {
    l._currentValue = _c.current, x(_c);
  }
  function zc(l, t, e) {
    for (; l !== null; ) {
      var u = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, u !== null && (u.childLanes |= t)) : u !== null && (u.childLanes & t) !== t && (u.childLanes |= t), l === e) break;
      l = l.return;
    }
  }
  function Mc(l, t, e, u) {
    var a = l.child;
    for (a !== null && (a.return = l); a !== null; ) {
      var n = a.dependencies;
      if (n !== null) {
        var c = a.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var i = n;
          n = a;
          for (var s = 0; s < t.length; s++)
            if (i.context === t[s]) {
              n.lanes |= e, i = n.alternate, i !== null && (i.lanes |= e), zc(
                n.return,
                e,
                l
              ), u || (c = null);
              break l;
            }
          n = i.next;
        }
      } else if (a.tag === 18) {
        if (c = a.return, c === null) throw Error(o(341));
        c.lanes |= e, n = c.alternate, n !== null && (n.lanes |= e), zc(c, e, l), c = null;
      } else c = a.child;
      if (c !== null) c.return = a;
      else
        for (c = a; c !== null; ) {
          if (c === l) {
            c = null;
            break;
          }
          if (a = c.sibling, a !== null) {
            a.return = c.return, c = a;
            break;
          }
          c = c.return;
        }
      a = c;
    }
  }
  function Qu(l, t, e, u) {
    l = null;
    for (var a = t, n = !1; a !== null; ) {
      if (!n) {
        if ((a.flags & 524288) !== 0) n = !0;
        else if ((a.flags & 262144) !== 0) break;
      }
      if (a.tag === 10) {
        var c = a.alternate;
        if (c === null) throw Error(o(387));
        if (c = c.memoizedProps, c !== null) {
          var i = a.type;
          Pl(a.pendingProps.value, c.value) || (l !== null ? l.push(i) : l = [i]);
        }
      } else if (a === Wl.current) {
        if (c = a.alternate, c === null) throw Error(o(387));
        c.memoizedState.memoizedState !== a.memoizedState.memoizedState && (l !== null ? l.push(ma) : l = [ma]);
      }
      a = a.return;
    }
    l !== null && Mc(
      t,
      l,
      e,
      u
    ), t.flags |= 262144;
  }
  function Ka(l) {
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
  function _e(l) {
    Oe = l, Ht = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function Yl(l) {
    return ps(Oe, l);
  }
  function Ja(l, t) {
    return Oe === null && _e(l), ps(l, t);
  }
  function ps(l, t) {
    var e = t._currentValue;
    if (t = { context: t, memoizedValue: e, next: null }, Ht === null) {
      if (l === null) throw Error(o(308));
      Ht = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else Ht = Ht.next = t;
    return e;
  }
  var X0 = typeof AbortController < "u" ? AbortController : function() {
    var l = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(e, u) {
        l.push(u);
      }
    };
    this.abort = function() {
      t.aborted = !0, l.forEach(function(e) {
        return e();
      });
    };
  }, Q0 = f.unstable_scheduleCallback, Z0 = f.unstable_NormalPriority, pl = {
    $$typeof: Sl,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Uc() {
    return {
      controller: new X0(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Zu(l) {
    l.refCount--, l.refCount === 0 && Q0(Z0, function() {
      l.controller.abort();
    });
  }
  var Vu = null, Nc = 0, Pe = 0, lu = null;
  function V0(l, t) {
    if (Vu === null) {
      var e = Vu = [];
      Nc = 0, Pe = Hi(), lu = {
        status: "pending",
        value: void 0,
        then: function(u) {
          e.push(u);
        }
      };
    }
    return Nc++, t.then(Es, Es), t;
  }
  function Es() {
    if (--Nc === 0 && Vu !== null) {
      lu !== null && (lu.status = "fulfilled");
      var l = Vu;
      Vu = null, Pe = 0, lu = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function L0(l, t) {
    var e = [], u = {
      status: "pending",
      value: null,
      reason: null,
      then: function(a) {
        e.push(a);
      }
    };
    return l.then(
      function() {
        u.status = "fulfilled", u.value = t;
        for (var a = 0; a < e.length; a++) (0, e[a])(t);
      },
      function(a) {
        for (u.status = "rejected", u.reason = a, a = 0; a < e.length; a++)
          (0, e[a])(void 0);
      }
    ), u;
  }
  var As = E.S;
  E.S = function(l, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && V0(l, t), As !== null && As(l, t);
  };
  var ze = O(null);
  function xc() {
    var l = ze.current;
    return l !== null ? l : sl.pooledCache;
  }
  function wa(l, t) {
    t === null ? M(ze, ze.current) : M(ze, t.pool);
  }
  function Ds() {
    var l = xc();
    return l === null ? null : { parent: pl._currentValue, pool: l };
  }
  var Lu = Error(o(460)), Rs = Error(o(474)), $a = Error(o(542)), Hc = { then: function() {
  } };
  function Os(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function ka() {
  }
  function _s(l, t, e) {
    switch (e = l[e], e === void 0 ? l.push(t) : e !== t && (t.then(ka, ka), t = e), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Ms(l), l;
      default:
        if (typeof t.status == "string") t.then(ka, ka);
        else {
          if (l = sl, l !== null && 100 < l.shellSuspendCounter)
            throw Error(o(482));
          l = t, l.status = "pending", l.then(
            function(u) {
              if (t.status === "pending") {
                var a = t;
                a.status = "fulfilled", a.value = u;
              }
            },
            function(u) {
              if (t.status === "pending") {
                var a = t;
                a.status = "rejected", a.reason = u;
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
        throw Ku = t, Lu;
    }
  }
  var Ku = null;
  function zs() {
    if (Ku === null) throw Error(o(459));
    var l = Ku;
    return Ku = null, l;
  }
  function Ms(l) {
    if (l === Lu || l === $a)
      throw Error(o(483));
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
  function Wt(l, t, e) {
    var u = l.updateQueue;
    if (u === null) return null;
    if (u = u.shared, (el & 2) !== 0) {
      var a = u.pending;
      return a === null ? t.next = t : (t.next = a.next, a.next = t), u.pending = t, t = Qa(l), ys(l, null, e), t;
    }
    return Xa(l, u, t, e), Qa(l);
  }
  function Ju(l, t, e) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (e & 4194048) !== 0)) {
      var u = t.lanes;
      u &= l.pendingLanes, e |= u, t.lanes = e, Ef(l, e);
    }
  }
  function jc(l, t) {
    var e = l.updateQueue, u = l.alternate;
    if (u !== null && (u = u.updateQueue, e === u)) {
      var a = null, n = null;
      if (e = e.firstBaseUpdate, e !== null) {
        do {
          var c = {
            lane: e.lane,
            tag: e.tag,
            payload: e.payload,
            callback: null,
            next: null
          };
          n === null ? a = n = c : n = n.next = c, e = e.next;
        } while (e !== null);
        n === null ? a = n = t : n = n.next = t;
      } else a = n = t;
      e = {
        baseState: u.baseState,
        firstBaseUpdate: a,
        lastBaseUpdate: n,
        shared: u.shared,
        callbacks: u.callbacks
      }, l.updateQueue = e;
      return;
    }
    l = e.lastBaseUpdate, l === null ? e.firstBaseUpdate = t : l.next = t, e.lastBaseUpdate = t;
  }
  var qc = !1;
  function wu() {
    if (qc) {
      var l = lu;
      if (l !== null) throw l;
    }
  }
  function $u(l, t, e, u) {
    qc = !1;
    var a = l.updateQueue;
    $t = !1;
    var n = a.firstBaseUpdate, c = a.lastBaseUpdate, i = a.shared.pending;
    if (i !== null) {
      a.shared.pending = null;
      var s = i, m = s.next;
      s.next = null, c === null ? n = m : c.next = m, c = s;
      var p = l.alternate;
      p !== null && (p = p.updateQueue, i = p.lastBaseUpdate, i !== c && (i === null ? p.firstBaseUpdate = m : i.next = m, p.lastBaseUpdate = s));
    }
    if (n !== null) {
      var D = a.baseState;
      c = 0, p = m = s = null, i = n;
      do {
        var S = i.lane & -536870913, b = S !== i.lane;
        if (b ? (F & S) === S : (u & S) === S) {
          S !== 0 && S === Pe && (qc = !0), p !== null && (p = p.next = {
            lane: 0,
            tag: i.tag,
            payload: i.payload,
            callback: null,
            next: null
          });
          l: {
            var Q = l, Y = i;
            S = t;
            var cl = e;
            switch (Y.tag) {
              case 1:
                if (Q = Y.payload, typeof Q == "function") {
                  D = Q.call(cl, D, S);
                  break l;
                }
                D = Q;
                break l;
              case 3:
                Q.flags = Q.flags & -65537 | 128;
              case 0:
                if (Q = Y.payload, S = typeof Q == "function" ? Q.call(cl, D, S) : Q, S == null) break l;
                D = B({}, D, S);
                break l;
              case 2:
                $t = !0;
            }
          }
          S = i.callback, S !== null && (l.flags |= 64, b && (l.flags |= 8192), b = a.callbacks, b === null ? a.callbacks = [S] : b.push(S));
        } else
          b = {
            lane: S,
            tag: i.tag,
            payload: i.payload,
            callback: i.callback,
            next: null
          }, p === null ? (m = p = b, s = D) : p = p.next = b, c |= S;
        if (i = i.next, i === null) {
          if (i = a.shared.pending, i === null)
            break;
          b = i, i = b.next, b.next = null, a.lastBaseUpdate = b, a.shared.pending = null;
        }
      } while (!0);
      p === null && (s = D), a.baseState = s, a.firstBaseUpdate = m, a.lastBaseUpdate = p, n === null && (a.shared.lanes = 0), ae |= c, l.lanes = c, l.memoizedState = D;
    }
  }
  function Us(l, t) {
    if (typeof l != "function")
      throw Error(o(191, l));
    l.call(t);
  }
  function Ns(l, t) {
    var e = l.callbacks;
    if (e !== null)
      for (l.callbacks = null, l = 0; l < e.length; l++)
        Us(e[l], t);
  }
  var tu = O(null), Wa = O(0);
  function xs(l, t) {
    l = Qt, M(Wa, l), M(tu, t), Qt = l | t.baseLanes;
  }
  function Yc() {
    M(Wa, Qt), M(tu, tu.current);
  }
  function Gc() {
    Qt = Wa.current, x(tu), x(Wa);
  }
  var Ft = 0, K = null, al = null, bl = null, Fa = !1, eu = !1, Me = !1, Ia = 0, ku = 0, uu = null, K0 = 0;
  function ml() {
    throw Error(o(321));
  }
  function Xc(l, t) {
    if (t === null) return !1;
    for (var e = 0; e < t.length && e < l.length; e++)
      if (!Pl(l[e], t[e])) return !1;
    return !0;
  }
  function Qc(l, t, e, u, a, n) {
    return Ft = n, K = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, E.H = l === null || l.memoizedState === null ? mo : go, Me = !1, n = e(u, a), Me = !1, eu && (n = Cs(
      t,
      e,
      u,
      a
    )), Hs(l), n;
  }
  function Hs(l) {
    E.H = an;
    var t = al !== null && al.next !== null;
    if (Ft = 0, bl = al = K = null, Fa = !1, ku = 0, uu = null, t) throw Error(o(300));
    l === null || Dl || (l = l.dependencies, l !== null && Ka(l) && (Dl = !0));
  }
  function Cs(l, t, e, u) {
    K = l;
    var a = 0;
    do {
      if (eu && (uu = null), ku = 0, eu = !1, 25 <= a) throw Error(o(301));
      if (a += 1, bl = al = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      E.H = I0, n = t(e, u);
    } while (eu);
    return n;
  }
  function J0() {
    var l = E.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? Wu(t) : t, l = l.useState()[0], (al !== null ? al.memoizedState : null) !== l && (K.flags |= 1024), t;
  }
  function Zc() {
    var l = Ia !== 0;
    return Ia = 0, l;
  }
  function Vc(l, t, e) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~e;
  }
  function Lc(l) {
    if (Fa) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      Fa = !1;
    }
    Ft = 0, bl = al = K = null, eu = !1, ku = Ia = 0, uu = null;
  }
  function Jl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return bl === null ? K.memoizedState = bl = l : bl = bl.next = l, bl;
  }
  function Tl() {
    if (al === null) {
      var l = K.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = al.next;
    var t = bl === null ? K.memoizedState : bl.next;
    if (t !== null)
      bl = t, al = l;
    else {
      if (l === null)
        throw K.alternate === null ? Error(o(467)) : Error(o(310));
      al = l, l = {
        memoizedState: al.memoizedState,
        baseState: al.baseState,
        baseQueue: al.baseQueue,
        queue: al.queue,
        next: null
      }, bl === null ? K.memoizedState = bl = l : bl = bl.next = l;
    }
    return bl;
  }
  function Kc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Wu(l) {
    var t = ku;
    return ku += 1, uu === null && (uu = []), l = _s(uu, l, t), t = K, (bl === null ? t.memoizedState : bl.next) === null && (t = t.alternate, E.H = t === null || t.memoizedState === null ? mo : go), l;
  }
  function Pa(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return Wu(l);
      if (l.$$typeof === Sl) return Yl(l);
    }
    throw Error(o(438, String(l)));
  }
  function Jc(l) {
    var t = null, e = K.updateQueue;
    if (e !== null && (t = e.memoCache), t == null) {
      var u = K.alternate;
      u !== null && (u = u.updateQueue, u !== null && (u = u.memoCache, u != null && (t = {
        data: u.data.map(function(a) {
          return a.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), e === null && (e = Kc(), K.updateQueue = e), e.memoCache = t, e = t.data[t.index], e === void 0)
      for (e = t.data[t.index] = Array(l), u = 0; u < l; u++)
        e[u] = Ce;
    return t.index++, e;
  }
  function Bt(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function ln(l) {
    var t = Tl();
    return wc(t, al, l);
  }
  function wc(l, t, e) {
    var u = l.queue;
    if (u === null) throw Error(o(311));
    u.lastRenderedReducer = e;
    var a = l.baseQueue, n = u.pending;
    if (n !== null) {
      if (a !== null) {
        var c = a.next;
        a.next = n.next, n.next = c;
      }
      t.baseQueue = a = n, u.pending = null;
    }
    if (n = l.baseState, a === null) l.memoizedState = n;
    else {
      t = a.next;
      var i = c = null, s = null, m = t, p = !1;
      do {
        var D = m.lane & -536870913;
        if (D !== m.lane ? (F & D) === D : (Ft & D) === D) {
          var S = m.revertLane;
          if (S === 0)
            s !== null && (s = s.next = {
              lane: 0,
              revertLane: 0,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null
            }), D === Pe && (p = !0);
          else if ((Ft & S) === S) {
            m = m.next, S === Pe && (p = !0);
            continue;
          } else
            D = {
              lane: 0,
              revertLane: m.revertLane,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null
            }, s === null ? (i = s = D, c = n) : s = s.next = D, K.lanes |= S, ae |= S;
          D = m.action, Me && e(n, D), n = m.hasEagerState ? m.eagerState : e(n, D);
        } else
          S = {
            lane: D,
            revertLane: m.revertLane,
            action: m.action,
            hasEagerState: m.hasEagerState,
            eagerState: m.eagerState,
            next: null
          }, s === null ? (i = s = S, c = n) : s = s.next = S, K.lanes |= D, ae |= D;
        m = m.next;
      } while (m !== null && m !== t);
      if (s === null ? c = n : s.next = i, !Pl(n, l.memoizedState) && (Dl = !0, p && (e = lu, e !== null)))
        throw e;
      l.memoizedState = n, l.baseState = c, l.baseQueue = s, u.lastRenderedState = n;
    }
    return a === null && (u.lanes = 0), [l.memoizedState, u.dispatch];
  }
  function $c(l) {
    var t = Tl(), e = t.queue;
    if (e === null) throw Error(o(311));
    e.lastRenderedReducer = l;
    var u = e.dispatch, a = e.pending, n = t.memoizedState;
    if (a !== null) {
      e.pending = null;
      var c = a = a.next;
      do
        n = l(n, c.action), c = c.next;
      while (c !== a);
      Pl(n, t.memoizedState) || (Dl = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), e.lastRenderedState = n;
    }
    return [n, u];
  }
  function Bs(l, t, e) {
    var u = K, a = Tl(), n = tl;
    if (n) {
      if (e === void 0) throw Error(o(407));
      e = e();
    } else e = t();
    var c = !Pl(
      (al || a).memoizedState,
      e
    );
    c && (a.memoizedState = e, Dl = !0), a = a.queue;
    var i = Ys.bind(null, u, a, l);
    if (Fu(2048, 8, i, [l]), a.getSnapshot !== t || c || bl !== null && bl.memoizedState.tag & 1) {
      if (u.flags |= 2048, au(
        9,
        tn(),
        qs.bind(
          null,
          u,
          a,
          e,
          t
        ),
        null
      ), sl === null) throw Error(o(349));
      n || (Ft & 124) !== 0 || js(u, t, e);
    }
    return e;
  }
  function js(l, t, e) {
    l.flags |= 16384, l = { getSnapshot: t, value: e }, t = K.updateQueue, t === null ? (t = Kc(), K.updateQueue = t, t.stores = [l]) : (e = t.stores, e === null ? t.stores = [l] : e.push(l));
  }
  function qs(l, t, e, u) {
    t.value = e, t.getSnapshot = u, Gs(t) && Xs(l);
  }
  function Ys(l, t, e) {
    return e(function() {
      Gs(t) && Xs(l);
    });
  }
  function Gs(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var e = t();
      return !Pl(l, e);
    } catch {
      return !0;
    }
  }
  function Xs(l) {
    var t = ke(l, 2);
    t !== null && nt(t, l, 2);
  }
  function kc(l) {
    var t = Jl();
    if (typeof l == "function") {
      var e = l;
      if (l = e(), Me) {
        Lt(!0);
        try {
          e();
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
  function Qs(l, t, e, u) {
    return l.baseState = e, wc(
      l,
      al,
      typeof u == "function" ? u : Bt
    );
  }
  function w0(l, t, e, u, a) {
    if (un(l)) throw Error(o(485));
    if (l = t.action, l !== null) {
      var n = {
        payload: a,
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
      E.T !== null ? e(!0) : n.isTransition = !1, u(n), e = t.pending, e === null ? (n.next = t.pending = n, Zs(t, n)) : (n.next = e.next, t.pending = e.next = n);
    }
  }
  function Zs(l, t) {
    var e = t.action, u = t.payload, a = l.state;
    if (t.isTransition) {
      var n = E.T, c = {};
      E.T = c;
      try {
        var i = e(a, u), s = E.S;
        s !== null && s(c, i), Vs(l, t, i);
      } catch (m) {
        Wc(l, t, m);
      } finally {
        E.T = n;
      }
    } else
      try {
        n = e(a, u), Vs(l, t, n);
      } catch (m) {
        Wc(l, t, m);
      }
  }
  function Vs(l, t, e) {
    e !== null && typeof e == "object" && typeof e.then == "function" ? e.then(
      function(u) {
        Ls(l, t, u);
      },
      function(u) {
        return Wc(l, t, u);
      }
    ) : Ls(l, t, e);
  }
  function Ls(l, t, e) {
    t.status = "fulfilled", t.value = e, Ks(t), l.state = e, t = l.pending, t !== null && (e = t.next, e === t ? l.pending = null : (e = e.next, t.next = e, Zs(l, e)));
  }
  function Wc(l, t, e) {
    var u = l.pending;
    if (l.pending = null, u !== null) {
      u = u.next;
      do
        t.status = "rejected", t.reason = e, Ks(t), t = t.next;
      while (t !== u);
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
    if (tl) {
      var e = sl.formState;
      if (e !== null) {
        l: {
          var u = K;
          if (tl) {
            if (vl) {
              t: {
                for (var a = vl, n = pt; a.nodeType !== 8; ) {
                  if (!n) {
                    a = null;
                    break t;
                  }
                  if (a = gt(
                    a.nextSibling
                  ), a === null) {
                    a = null;
                    break t;
                  }
                }
                n = a.data, a = n === "F!" || n === "F" ? a : null;
              }
              if (a) {
                vl = gt(
                  a.nextSibling
                ), u = a.data === "F!";
                break l;
              }
            }
            Re(u);
          }
          u = !1;
        }
        u && (t = e[0]);
      }
    }
    return e = Jl(), e.memoizedState = e.baseState = t, u = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Js,
      lastRenderedState: t
    }, e.queue = u, e = ho.bind(
      null,
      K,
      u
    ), u.dispatch = e, u = kc(!1), n = ti.bind(
      null,
      K,
      !1,
      u.queue
    ), u = Jl(), a = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, u.queue = a, e = w0.bind(
      null,
      K,
      a,
      n,
      e
    ), a.dispatch = e, u.memoizedState = l, [t, e, !1];
  }
  function $s(l) {
    var t = Tl();
    return ks(t, al, l);
  }
  function ks(l, t, e) {
    if (t = wc(
      l,
      t,
      Js
    )[0], l = ln(Bt)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var u = Wu(t);
      } catch (c) {
        throw c === Lu ? $a : c;
      }
    else u = t;
    t = Tl();
    var a = t.queue, n = a.dispatch;
    return e !== t.memoizedState && (K.flags |= 2048, au(
      9,
      tn(),
      $0.bind(null, a, e),
      null
    )), [u, n, l];
  }
  function $0(l, t) {
    l.action = t;
  }
  function Ws(l) {
    var t = Tl(), e = al;
    if (e !== null)
      return ks(t, e, l);
    Tl(), t = t.memoizedState, e = Tl();
    var u = e.queue.dispatch;
    return e.memoizedState = l, [t, u, !1];
  }
  function au(l, t, e, u) {
    return l = { tag: l, create: e, deps: u, inst: t, next: null }, t = K.updateQueue, t === null && (t = Kc(), K.updateQueue = t), e = t.lastEffect, e === null ? t.lastEffect = l.next = l : (u = e.next, e.next = l, l.next = u, t.lastEffect = l), l;
  }
  function tn() {
    return { destroy: void 0, resource: void 0 };
  }
  function Fs() {
    return Tl().memoizedState;
  }
  function en(l, t, e, u) {
    var a = Jl();
    u = u === void 0 ? null : u, K.flags |= l, a.memoizedState = au(
      1 | t,
      tn(),
      e,
      u
    );
  }
  function Fu(l, t, e, u) {
    var a = Tl();
    u = u === void 0 ? null : u;
    var n = a.memoizedState.inst;
    al !== null && u !== null && Xc(u, al.memoizedState.deps) ? a.memoizedState = au(t, n, e, u) : (K.flags |= l, a.memoizedState = au(
      1 | t,
      n,
      e,
      u
    ));
  }
  function Is(l, t) {
    en(8390656, 8, l, t);
  }
  function Ps(l, t) {
    Fu(2048, 8, l, t);
  }
  function lo(l, t) {
    return Fu(4, 2, l, t);
  }
  function to(l, t) {
    return Fu(4, 4, l, t);
  }
  function eo(l, t) {
    if (typeof t == "function") {
      l = l();
      var e = t(l);
      return function() {
        typeof e == "function" ? e() : t(null);
      };
    }
    if (t != null)
      return l = l(), t.current = l, function() {
        t.current = null;
      };
  }
  function uo(l, t, e) {
    e = e != null ? e.concat([l]) : null, Fu(4, 4, eo.bind(null, t, l), e);
  }
  function Fc() {
  }
  function ao(l, t) {
    var e = Tl();
    t = t === void 0 ? null : t;
    var u = e.memoizedState;
    return t !== null && Xc(t, u[1]) ? u[0] : (e.memoizedState = [l, t], l);
  }
  function no(l, t) {
    var e = Tl();
    t = t === void 0 ? null : t;
    var u = e.memoizedState;
    if (t !== null && Xc(t, u[1]))
      return u[0];
    if (u = l(), Me) {
      Lt(!0);
      try {
        l();
      } finally {
        Lt(!1);
      }
    }
    return e.memoizedState = [u, t], u;
  }
  function Ic(l, t, e) {
    return e === void 0 || (Ft & 1073741824) !== 0 ? l.memoizedState = t : (l.memoizedState = e, l = sr(), K.lanes |= l, ae |= l, e);
  }
  function co(l, t, e, u) {
    return Pl(e, t) ? e : tu.current !== null ? (l = Ic(l, e, u), Pl(l, t) || (Dl = !0), l) : (Ft & 42) === 0 ? (Dl = !0, l.memoizedState = e) : (l = sr(), K.lanes |= l, ae |= l, t);
  }
  function io(l, t, e, u, a) {
    var n = U.p;
    U.p = n !== 0 && 8 > n ? n : 8;
    var c = E.T, i = {};
    E.T = i, ti(l, !1, t, e);
    try {
      var s = a(), m = E.S;
      if (m !== null && m(i, s), s !== null && typeof s == "object" && typeof s.then == "function") {
        var p = L0(
          s,
          u
        );
        Iu(
          l,
          t,
          p,
          at(l)
        );
      } else
        Iu(
          l,
          t,
          u,
          at(l)
        );
    } catch (D) {
      Iu(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: D },
        at()
      );
    } finally {
      U.p = n, E.T = c;
    }
  }
  function k0() {
  }
  function Pc(l, t, e, u) {
    if (l.tag !== 5) throw Error(o(476));
    var a = fo(l).queue;
    io(
      l,
      a,
      t,
      X,
      e === null ? k0 : function() {
        return so(l), e(u);
      }
    );
  }
  function fo(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: X,
      baseState: X,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Bt,
        lastRenderedState: X
      },
      next: null
    };
    var e = {};
    return t.next = {
      memoizedState: e,
      baseState: e,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Bt,
        lastRenderedState: e
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function so(l) {
    var t = fo(l).next.queue;
    Iu(l, t, {}, at());
  }
  function li() {
    return Yl(ma);
  }
  function oo() {
    return Tl().memoizedState;
  }
  function ro() {
    return Tl().memoizedState;
  }
  function W0(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var e = at();
          l = kt(e);
          var u = Wt(t, l, e);
          u !== null && (nt(u, t, e), Ju(u, t, e)), t = { cache: Uc() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function F0(l, t, e) {
    var u = at();
    e = {
      lane: u,
      revertLane: 0,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, un(l) ? vo(t, e) : (e = Tc(l, t, e, u), e !== null && (nt(e, l, u), yo(e, t, u)));
  }
  function ho(l, t, e) {
    var u = at();
    Iu(l, t, e, u);
  }
  function Iu(l, t, e, u) {
    var a = {
      lane: u,
      revertLane: 0,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (un(l)) vo(t, a);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var c = t.lastRenderedState, i = n(c, e);
          if (a.hasEagerState = !0, a.eagerState = i, Pl(i, c))
            return Xa(l, t, a, 0), sl === null && Ga(), !1;
        } catch {
        } finally {
        }
      if (e = Tc(l, t, a, u), e !== null)
        return nt(e, l, u), yo(e, t, u), !0;
    }
    return !1;
  }
  function ti(l, t, e, u) {
    if (u = {
      lane: 2,
      revertLane: Hi(),
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, un(l)) {
      if (t) throw Error(o(479));
    } else
      t = Tc(
        l,
        e,
        u,
        2
      ), t !== null && nt(t, l, 2);
  }
  function un(l) {
    var t = l.alternate;
    return l === K || t !== null && t === K;
  }
  function vo(l, t) {
    eu = Fa = !0;
    var e = l.pending;
    e === null ? t.next = t : (t.next = e.next, e.next = t), l.pending = t;
  }
  function yo(l, t, e) {
    if ((e & 4194048) !== 0) {
      var u = t.lanes;
      u &= l.pendingLanes, e |= u, t.lanes = e, Ef(l, e);
    }
  }
  var an = {
    readContext: Yl,
    use: Pa,
    useCallback: ml,
    useContext: ml,
    useEffect: ml,
    useImperativeHandle: ml,
    useLayoutEffect: ml,
    useInsertionEffect: ml,
    useMemo: ml,
    useReducer: ml,
    useRef: ml,
    useState: ml,
    useDebugValue: ml,
    useDeferredValue: ml,
    useTransition: ml,
    useSyncExternalStore: ml,
    useId: ml,
    useHostTransitionStatus: ml,
    useFormState: ml,
    useActionState: ml,
    useOptimistic: ml,
    useMemoCache: ml,
    useCacheRefresh: ml
  }, mo = {
    readContext: Yl,
    use: Pa,
    useCallback: function(l, t) {
      return Jl().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: Yl,
    useEffect: Is,
    useImperativeHandle: function(l, t, e) {
      e = e != null ? e.concat([l]) : null, en(
        4194308,
        4,
        eo.bind(null, t, l),
        e
      );
    },
    useLayoutEffect: function(l, t) {
      return en(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      en(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var e = Jl();
      t = t === void 0 ? null : t;
      var u = l();
      if (Me) {
        Lt(!0);
        try {
          l();
        } finally {
          Lt(!1);
        }
      }
      return e.memoizedState = [u, t], u;
    },
    useReducer: function(l, t, e) {
      var u = Jl();
      if (e !== void 0) {
        var a = e(t);
        if (Me) {
          Lt(!0);
          try {
            e(t);
          } finally {
            Lt(!1);
          }
        }
      } else a = t;
      return u.memoizedState = u.baseState = a, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: a
      }, u.queue = l, l = l.dispatch = F0.bind(
        null,
        K,
        l
      ), [u.memoizedState, l];
    },
    useRef: function(l) {
      var t = Jl();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = kc(l);
      var t = l.queue, e = ho.bind(null, K, t);
      return t.dispatch = e, [l.memoizedState, e];
    },
    useDebugValue: Fc,
    useDeferredValue: function(l, t) {
      var e = Jl();
      return Ic(e, l, t);
    },
    useTransition: function() {
      var l = kc(!1);
      return l = io.bind(
        null,
        K,
        l.queue,
        !0,
        !1
      ), Jl().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, e) {
      var u = K, a = Jl();
      if (tl) {
        if (e === void 0)
          throw Error(o(407));
        e = e();
      } else {
        if (e = t(), sl === null)
          throw Error(o(349));
        (F & 124) !== 0 || js(u, t, e);
      }
      a.memoizedState = e;
      var n = { value: e, getSnapshot: t };
      return a.queue = n, Is(Ys.bind(null, u, n, l), [
        l
      ]), u.flags |= 2048, au(
        9,
        tn(),
        qs.bind(
          null,
          u,
          n,
          e,
          t
        ),
        null
      ), e;
    },
    useId: function() {
      var l = Jl(), t = sl.identifierPrefix;
      if (tl) {
        var e = xt, u = Nt;
        e = (u & ~(1 << 32 - Il(u) - 1)).toString(32) + e, t = "«" + t + "R" + e, e = Ia++, 0 < e && (t += "H" + e.toString(32)), t += "»";
      } else
        e = K0++, t = "«" + t + "r" + e.toString(32) + "»";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: li,
    useFormState: ws,
    useActionState: ws,
    useOptimistic: function(l) {
      var t = Jl();
      t.memoizedState = t.baseState = l;
      var e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = e, t = ti.bind(
        null,
        K,
        !0,
        e
      ), e.dispatch = t, [l, t];
    },
    useMemoCache: Jc,
    useCacheRefresh: function() {
      return Jl().memoizedState = W0.bind(
        null,
        K
      );
    }
  }, go = {
    readContext: Yl,
    use: Pa,
    useCallback: ao,
    useContext: Yl,
    useEffect: Ps,
    useImperativeHandle: uo,
    useInsertionEffect: lo,
    useLayoutEffect: to,
    useMemo: no,
    useReducer: ln,
    useRef: Fs,
    useState: function() {
      return ln(Bt);
    },
    useDebugValue: Fc,
    useDeferredValue: function(l, t) {
      var e = Tl();
      return co(
        e,
        al.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = ln(Bt)[0], t = Tl().memoizedState;
      return [
        typeof l == "boolean" ? l : Wu(l),
        t
      ];
    },
    useSyncExternalStore: Bs,
    useId: oo,
    useHostTransitionStatus: li,
    useFormState: $s,
    useActionState: $s,
    useOptimistic: function(l, t) {
      var e = Tl();
      return Qs(e, al, l, t);
    },
    useMemoCache: Jc,
    useCacheRefresh: ro
  }, I0 = {
    readContext: Yl,
    use: Pa,
    useCallback: ao,
    useContext: Yl,
    useEffect: Ps,
    useImperativeHandle: uo,
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
      var e = Tl();
      return al === null ? Ic(e, l, t) : co(
        e,
        al.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = $c(Bt)[0], t = Tl().memoizedState;
      return [
        typeof l == "boolean" ? l : Wu(l),
        t
      ];
    },
    useSyncExternalStore: Bs,
    useId: oo,
    useHostTransitionStatus: li,
    useFormState: Ws,
    useActionState: Ws,
    useOptimistic: function(l, t) {
      var e = Tl();
      return al !== null ? Qs(e, al, l, t) : (e.baseState = l, [l, e.queue.dispatch]);
    },
    useMemoCache: Jc,
    useCacheRefresh: ro
  }, nu = null, Pu = 0;
  function nn(l) {
    var t = Pu;
    return Pu += 1, nu === null && (nu = []), _s(nu, l, t);
  }
  function la(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function cn(l, t) {
    throw t.$$typeof === W ? Error(o(525)) : (l = Object.prototype.toString.call(t), Error(
      o(
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
    function t(v, d) {
      if (l) {
        var y = v.deletions;
        y === null ? (v.deletions = [d], v.flags |= 16) : y.push(d);
      }
    }
    function e(v, d) {
      if (!l) return null;
      for (; d !== null; )
        t(v, d), d = d.sibling;
      return null;
    }
    function u(v) {
      for (var d = /* @__PURE__ */ new Map(); v !== null; )
        v.key !== null ? d.set(v.key, v) : d.set(v.index, v), v = v.sibling;
      return d;
    }
    function a(v, d) {
      return v = Ut(v, d), v.index = 0, v.sibling = null, v;
    }
    function n(v, d, y) {
      return v.index = y, l ? (y = v.alternate, y !== null ? (y = y.index, y < d ? (v.flags |= 67108866, d) : y) : (v.flags |= 67108866, d)) : (v.flags |= 1048576, d);
    }
    function c(v) {
      return l && v.alternate === null && (v.flags |= 67108866), v;
    }
    function i(v, d, y, A) {
      return d === null || d.tag !== 6 ? (d = Ec(y, v.mode, A), d.return = v, d) : (d = a(d, y), d.return = v, d);
    }
    function s(v, d, y, A) {
      var H = y.type;
      return H === Ml ? p(
        v,
        d,
        y.props.children,
        A,
        y.key
      ) : d !== null && (d.elementType === H || typeof H == "object" && H !== null && H.$$typeof === Ql && So(H) === d.type) ? (d = a(d, y.props), la(d, y), d.return = v, d) : (d = Za(
        y.type,
        y.key,
        y.props,
        null,
        v.mode,
        A
      ), la(d, y), d.return = v, d);
    }
    function m(v, d, y, A) {
      return d === null || d.tag !== 4 || d.stateNode.containerInfo !== y.containerInfo || d.stateNode.implementation !== y.implementation ? (d = Ac(y, v.mode, A), d.return = v, d) : (d = a(d, y.children || []), d.return = v, d);
    }
    function p(v, d, y, A, H) {
      return d === null || d.tag !== 7 ? (d = pe(
        y,
        v.mode,
        A,
        H
      ), d.return = v, d) : (d = a(d, y), d.return = v, d);
    }
    function D(v, d, y) {
      if (typeof d == "string" && d !== "" || typeof d == "number" || typeof d == "bigint")
        return d = Ec(
          "" + d,
          v.mode,
          y
        ), d.return = v, d;
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case k:
            return y = Za(
              d.type,
              d.key,
              d.props,
              null,
              v.mode,
              y
            ), la(y, d), y.return = v, y;
          case zl:
            return d = Ac(
              d,
              v.mode,
              y
            ), d.return = v, d;
          case Ql:
            var A = d._init;
            return d = A(d._payload), D(v, d, y);
        }
        if (jl(d) || Bl(d))
          return d = pe(
            d,
            v.mode,
            y,
            null
          ), d.return = v, d;
        if (typeof d.then == "function")
          return D(v, nn(d), y);
        if (d.$$typeof === Sl)
          return D(
            v,
            Ja(v, d),
            y
          );
        cn(v, d);
      }
      return null;
    }
    function S(v, d, y, A) {
      var H = d !== null ? d.key : null;
      if (typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint")
        return H !== null ? null : i(v, d, "" + y, A);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case k:
            return y.key === H ? s(v, d, y, A) : null;
          case zl:
            return y.key === H ? m(v, d, y, A) : null;
          case Ql:
            return H = y._init, y = H(y._payload), S(v, d, y, A);
        }
        if (jl(y) || Bl(y))
          return H !== null ? null : p(v, d, y, A, null);
        if (typeof y.then == "function")
          return S(
            v,
            d,
            nn(y),
            A
          );
        if (y.$$typeof === Sl)
          return S(
            v,
            d,
            Ja(v, y),
            A
          );
        cn(v, y);
      }
      return null;
    }
    function b(v, d, y, A, H) {
      if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint")
        return v = v.get(y) || null, i(d, v, "" + A, H);
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case k:
            return v = v.get(
              A.key === null ? y : A.key
            ) || null, s(d, v, A, H);
          case zl:
            return v = v.get(
              A.key === null ? y : A.key
            ) || null, m(d, v, A, H);
          case Ql:
            var J = A._init;
            return A = J(A._payload), b(
              v,
              d,
              y,
              A,
              H
            );
        }
        if (jl(A) || Bl(A))
          return v = v.get(y) || null, p(d, v, A, H, null);
        if (typeof A.then == "function")
          return b(
            v,
            d,
            y,
            nn(A),
            H
          );
        if (A.$$typeof === Sl)
          return b(
            v,
            d,
            y,
            Ja(d, A),
            H
          );
        cn(d, A);
      }
      return null;
    }
    function Q(v, d, y, A) {
      for (var H = null, J = null, j = d, G = d = 0, Ol = null; j !== null && G < y.length; G++) {
        j.index > G ? (Ol = j, j = null) : Ol = j.sibling;
        var ll = S(
          v,
          j,
          y[G],
          A
        );
        if (ll === null) {
          j === null && (j = Ol);
          break;
        }
        l && j && ll.alternate === null && t(v, j), d = n(ll, d, G), J === null ? H = ll : J.sibling = ll, J = ll, j = Ol;
      }
      if (G === y.length)
        return e(v, j), tl && Ae(v, G), H;
      if (j === null) {
        for (; G < y.length; G++)
          j = D(v, y[G], A), j !== null && (d = n(
            j,
            d,
            G
          ), J === null ? H = j : J.sibling = j, J = j);
        return tl && Ae(v, G), H;
      }
      for (j = u(j); G < y.length; G++)
        Ol = b(
          j,
          v,
          G,
          y[G],
          A
        ), Ol !== null && (l && Ol.alternate !== null && j.delete(
          Ol.key === null ? G : Ol.key
        ), d = n(
          Ol,
          d,
          G
        ), J === null ? H = Ol : J.sibling = Ol, J = Ol);
      return l && j.forEach(function(he) {
        return t(v, he);
      }), tl && Ae(v, G), H;
    }
    function Y(v, d, y, A) {
      if (y == null) throw Error(o(151));
      for (var H = null, J = null, j = d, G = d = 0, Ol = null, ll = y.next(); j !== null && !ll.done; G++, ll = y.next()) {
        j.index > G ? (Ol = j, j = null) : Ol = j.sibling;
        var he = S(v, j, ll.value, A);
        if (he === null) {
          j === null && (j = Ol);
          break;
        }
        l && j && he.alternate === null && t(v, j), d = n(he, d, G), J === null ? H = he : J.sibling = he, J = he, j = Ol;
      }
      if (ll.done)
        return e(v, j), tl && Ae(v, G), H;
      if (j === null) {
        for (; !ll.done; G++, ll = y.next())
          ll = D(v, ll.value, A), ll !== null && (d = n(ll, d, G), J === null ? H = ll : J.sibling = ll, J = ll);
        return tl && Ae(v, G), H;
      }
      for (j = u(j); !ll.done; G++, ll = y.next())
        ll = b(j, v, G, ll.value, A), ll !== null && (l && ll.alternate !== null && j.delete(ll.key === null ? G : ll.key), d = n(ll, d, G), J === null ? H = ll : J.sibling = ll, J = ll);
      return l && j.forEach(function(Ph) {
        return t(v, Ph);
      }), tl && Ae(v, G), H;
    }
    function cl(v, d, y, A) {
      if (typeof y == "object" && y !== null && y.type === Ml && y.key === null && (y = y.props.children), typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case k:
            l: {
              for (var H = y.key; d !== null; ) {
                if (d.key === H) {
                  if (H = y.type, H === Ml) {
                    if (d.tag === 7) {
                      e(
                        v,
                        d.sibling
                      ), A = a(
                        d,
                        y.props.children
                      ), A.return = v, v = A;
                      break l;
                    }
                  } else if (d.elementType === H || typeof H == "object" && H !== null && H.$$typeof === Ql && So(H) === d.type) {
                    e(
                      v,
                      d.sibling
                    ), A = a(d, y.props), la(A, y), A.return = v, v = A;
                    break l;
                  }
                  e(v, d);
                  break;
                } else t(v, d);
                d = d.sibling;
              }
              y.type === Ml ? (A = pe(
                y.props.children,
                v.mode,
                A,
                y.key
              ), A.return = v, v = A) : (A = Za(
                y.type,
                y.key,
                y.props,
                null,
                v.mode,
                A
              ), la(A, y), A.return = v, v = A);
            }
            return c(v);
          case zl:
            l: {
              for (H = y.key; d !== null; ) {
                if (d.key === H)
                  if (d.tag === 4 && d.stateNode.containerInfo === y.containerInfo && d.stateNode.implementation === y.implementation) {
                    e(
                      v,
                      d.sibling
                    ), A = a(d, y.children || []), A.return = v, v = A;
                    break l;
                  } else {
                    e(v, d);
                    break;
                  }
                else t(v, d);
                d = d.sibling;
              }
              A = Ac(y, v.mode, A), A.return = v, v = A;
            }
            return c(v);
          case Ql:
            return H = y._init, y = H(y._payload), cl(
              v,
              d,
              y,
              A
            );
        }
        if (jl(y))
          return Q(
            v,
            d,
            y,
            A
          );
        if (Bl(y)) {
          if (H = Bl(y), typeof H != "function") throw Error(o(150));
          return y = H.call(y), Y(
            v,
            d,
            y,
            A
          );
        }
        if (typeof y.then == "function")
          return cl(
            v,
            d,
            nn(y),
            A
          );
        if (y.$$typeof === Sl)
          return cl(
            v,
            d,
            Ja(v, y),
            A
          );
        cn(v, y);
      }
      return typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint" ? (y = "" + y, d !== null && d.tag === 6 ? (e(v, d.sibling), A = a(d, y), A.return = v, v = A) : (e(v, d), A = Ec(y, v.mode, A), A.return = v, v = A), c(v)) : e(v, d);
    }
    return function(v, d, y, A) {
      try {
        Pu = 0;
        var H = cl(
          v,
          d,
          y,
          A
        );
        return nu = null, H;
      } catch (j) {
        if (j === Lu || j === $a) throw j;
        var J = lt(29, j, null, v.mode);
        return J.lanes = A, J.return = v, J;
      } finally {
      }
    };
  }
  var cu = bo(!0), To = bo(!1), dt = O(null), Et = null;
  function It(l) {
    var t = l.alternate;
    M(El, El.current & 1), M(dt, l), Et === null && (t === null || tu.current !== null || t.memoizedState !== null) && (Et = l);
  }
  function po(l) {
    if (l.tag === 22) {
      if (M(El, El.current), M(dt, l), Et === null) {
        var t = l.alternate;
        t !== null && t.memoizedState !== null && (Et = l);
      }
    } else Pt();
  }
  function Pt() {
    M(El, El.current), M(dt, dt.current);
  }
  function jt(l) {
    x(dt), Et === l && (Et = null), x(El);
  }
  var El = O(0);
  function fn(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e !== null && (e = e.dehydrated, e === null || e.data === "$?" || Ki(e)))
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
  function ei(l, t, e, u) {
    t = l.memoizedState, e = e(u, t), e = e == null ? t : B({}, t, e), l.memoizedState = e, l.lanes === 0 && (l.updateQueue.baseState = e);
  }
  var ui = {
    enqueueSetState: function(l, t, e) {
      l = l._reactInternals;
      var u = at(), a = kt(u);
      a.payload = t, e != null && (a.callback = e), t = Wt(l, a, u), t !== null && (nt(t, l, u), Ju(t, l, u));
    },
    enqueueReplaceState: function(l, t, e) {
      l = l._reactInternals;
      var u = at(), a = kt(u);
      a.tag = 1, a.payload = t, e != null && (a.callback = e), t = Wt(l, a, u), t !== null && (nt(t, l, u), Ju(t, l, u));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var e = at(), u = kt(e);
      u.tag = 2, t != null && (u.callback = t), t = Wt(l, u, e), t !== null && (nt(t, l, e), Ju(t, l, e));
    }
  };
  function Eo(l, t, e, u, a, n, c) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(u, n, c) : t.prototype && t.prototype.isPureReactComponent ? !ju(e, u) || !ju(a, n) : !0;
  }
  function Ao(l, t, e, u) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(e, u), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(e, u), t.state !== l && ui.enqueueReplaceState(t, t.state, null);
  }
  function Ue(l, t) {
    var e = t;
    if ("ref" in t) {
      e = {};
      for (var u in t)
        u !== "ref" && (e[u] = t[u]);
    }
    if (l = l.defaultProps) {
      e === t && (e = B({}, e));
      for (var a in l)
        e[a] === void 0 && (e[a] = l[a]);
    }
    return e;
  }
  var sn = typeof reportError == "function" ? reportError : function(l) {
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
  function Do(l) {
    sn(l);
  }
  function Ro(l) {
    console.error(l);
  }
  function Oo(l) {
    sn(l);
  }
  function on(l, t) {
    try {
      var e = l.onUncaughtError;
      e(t.value, { componentStack: t.stack });
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  function _o(l, t, e) {
    try {
      var u = l.onCaughtError;
      u(e.value, {
        componentStack: e.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function ai(l, t, e) {
    return e = kt(e), e.tag = 3, e.payload = { element: null }, e.callback = function() {
      on(l, t);
    }, e;
  }
  function zo(l) {
    return l = kt(l), l.tag = 3, l;
  }
  function Mo(l, t, e, u) {
    var a = e.type.getDerivedStateFromError;
    if (typeof a == "function") {
      var n = u.value;
      l.payload = function() {
        return a(n);
      }, l.callback = function() {
        _o(t, e, u);
      };
    }
    var c = e.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (l.callback = function() {
      _o(t, e, u), typeof a != "function" && (ne === null ? ne = /* @__PURE__ */ new Set([this]) : ne.add(this));
      var i = u.stack;
      this.componentDidCatch(u.value, {
        componentStack: i !== null ? i : ""
      });
    });
  }
  function P0(l, t, e, u, a) {
    if (e.flags |= 32768, u !== null && typeof u == "object" && typeof u.then == "function") {
      if (t = e.alternate, t !== null && Qu(
        t,
        e,
        a,
        !0
      ), e = dt.current, e !== null) {
        switch (e.tag) {
          case 13:
            return Et === null ? zi() : e.alternate === null && yl === 0 && (yl = 3), e.flags &= -257, e.flags |= 65536, e.lanes = a, u === Hc ? e.flags |= 16384 : (t = e.updateQueue, t === null ? e.updateQueue = /* @__PURE__ */ new Set([u]) : t.add(u), Ui(l, u, a)), !1;
          case 22:
            return e.flags |= 65536, u === Hc ? e.flags |= 16384 : (t = e.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([u])
            }, e.updateQueue = t) : (e = t.retryQueue, e === null ? t.retryQueue = /* @__PURE__ */ new Set([u]) : e.add(u)), Ui(l, u, a)), !1;
        }
        throw Error(o(435, e.tag));
      }
      return Ui(l, u, a), zi(), !1;
    }
    if (tl)
      return t = dt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = a, u !== Oc && (l = Error(o(422), { cause: u }), Xu(ft(l, e)))) : (u !== Oc && (t = Error(o(423), {
        cause: u
      }), Xu(
        ft(t, e)
      )), l = l.current.alternate, l.flags |= 65536, a &= -a, l.lanes |= a, u = ft(u, e), a = ai(
        l.stateNode,
        u,
        a
      ), jc(l, a), yl !== 4 && (yl = 2)), !1;
    var n = Error(o(520), { cause: u });
    if (n = ft(n, e), ia === null ? ia = [n] : ia.push(n), yl !== 4 && (yl = 2), t === null) return !0;
    u = ft(u, e), e = t;
    do {
      switch (e.tag) {
        case 3:
          return e.flags |= 65536, l = a & -a, e.lanes |= l, l = ai(e.stateNode, u, l), jc(e, l), !1;
        case 1:
          if (t = e.type, n = e.stateNode, (e.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (ne === null || !ne.has(n))))
            return e.flags |= 65536, a &= -a, e.lanes |= a, a = zo(a), Mo(
              a,
              l,
              e,
              u
            ), jc(e, a), !1;
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var Uo = Error(o(461)), Dl = !1;
  function Ul(l, t, e, u) {
    t.child = l === null ? To(t, null, e, u) : cu(
      t,
      l.child,
      e,
      u
    );
  }
  function No(l, t, e, u, a) {
    e = e.render;
    var n = t.ref;
    if ("ref" in u) {
      var c = {};
      for (var i in u)
        i !== "ref" && (c[i] = u[i]);
    } else c = u;
    return _e(t), u = Qc(
      l,
      t,
      e,
      c,
      n,
      a
    ), i = Zc(), l !== null && !Dl ? (Vc(l, t, a), qt(l, t, a)) : (tl && i && Dc(t), t.flags |= 1, Ul(l, t, u, a), t.child);
  }
  function xo(l, t, e, u, a) {
    if (l === null) {
      var n = e.type;
      return typeof n == "function" && !pc(n) && n.defaultProps === void 0 && e.compare === null ? (t.tag = 15, t.type = n, Ho(
        l,
        t,
        n,
        u,
        a
      )) : (l = Za(
        e.type,
        null,
        u,
        t,
        t.mode,
        a
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !di(l, a)) {
      var c = n.memoizedProps;
      if (e = e.compare, e = e !== null ? e : ju, e(c, u) && l.ref === t.ref)
        return qt(l, t, a);
    }
    return t.flags |= 1, l = Ut(n, u), l.ref = t.ref, l.return = t, t.child = l;
  }
  function Ho(l, t, e, u, a) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (ju(n, u) && l.ref === t.ref)
        if (Dl = !1, t.pendingProps = u = n, di(l, a))
          (l.flags & 131072) !== 0 && (Dl = !0);
        else
          return t.lanes = l.lanes, qt(l, t, a);
    }
    return ni(
      l,
      t,
      e,
      u,
      a
    );
  }
  function Co(l, t, e) {
    var u = t.pendingProps, a = u.children, n = l !== null ? l.memoizedState : null;
    if (u.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = n !== null ? n.baseLanes | e : e, l !== null) {
          for (a = t.child = l.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          t.childLanes = n & ~u;
        } else t.childLanes = 0, t.child = null;
        return Bo(
          l,
          t,
          u,
          e
        );
      }
      if ((e & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && wa(
          t,
          n !== null ? n.cachePool : null
        ), n !== null ? xs(t, n) : Yc(), po(t);
      else
        return t.lanes = t.childLanes = 536870912, Bo(
          l,
          t,
          n !== null ? n.baseLanes | e : e,
          e
        );
    } else
      n !== null ? (wa(t, n.cachePool), xs(t, n), Pt(), t.memoizedState = null) : (l !== null && wa(t, null), Yc(), Pt());
    return Ul(l, t, a, e), t.child;
  }
  function Bo(l, t, e, u) {
    var a = xc();
    return a = a === null ? null : { parent: pl._currentValue, pool: a }, t.memoizedState = {
      baseLanes: e,
      cachePool: a
    }, l !== null && wa(t, null), Yc(), po(t), l !== null && Qu(l, t, u, !0), null;
  }
  function rn(l, t) {
    var e = t.ref;
    if (e === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof e != "function" && typeof e != "object")
        throw Error(o(284));
      (l === null || l.ref !== e) && (t.flags |= 4194816);
    }
  }
  function ni(l, t, e, u, a) {
    return _e(t), e = Qc(
      l,
      t,
      e,
      u,
      void 0,
      a
    ), u = Zc(), l !== null && !Dl ? (Vc(l, t, a), qt(l, t, a)) : (tl && u && Dc(t), t.flags |= 1, Ul(l, t, e, a), t.child);
  }
  function jo(l, t, e, u, a, n) {
    return _e(t), t.updateQueue = null, e = Cs(
      t,
      u,
      e,
      a
    ), Hs(l), u = Zc(), l !== null && !Dl ? (Vc(l, t, n), qt(l, t, n)) : (tl && u && Dc(t), t.flags |= 1, Ul(l, t, e, n), t.child);
  }
  function qo(l, t, e, u, a) {
    if (_e(t), t.stateNode === null) {
      var n = We, c = e.contextType;
      typeof c == "object" && c !== null && (n = Yl(c)), n = new e(u, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = ui, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = u, n.state = t.memoizedState, n.refs = {}, Cc(t), c = e.contextType, n.context = typeof c == "object" && c !== null ? Yl(c) : We, n.state = t.memoizedState, c = e.getDerivedStateFromProps, typeof c == "function" && (ei(
        t,
        e,
        c,
        u
      ), n.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (c = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), c !== n.state && ui.enqueueReplaceState(n, n.state, null), $u(t, u, n, a), wu(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), u = !0;
    } else if (l === null) {
      n = t.stateNode;
      var i = t.memoizedProps, s = Ue(e, i);
      n.props = s;
      var m = n.context, p = e.contextType;
      c = We, typeof p == "object" && p !== null && (c = Yl(p));
      var D = e.getDerivedStateFromProps;
      p = typeof D == "function" || typeof n.getSnapshotBeforeUpdate == "function", i = t.pendingProps !== i, p || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (i || m !== c) && Ao(
        t,
        n,
        u,
        c
      ), $t = !1;
      var S = t.memoizedState;
      n.state = S, $u(t, u, n, a), wu(), m = t.memoizedState, i || S !== m || $t ? (typeof D == "function" && (ei(
        t,
        e,
        D,
        u
      ), m = t.memoizedState), (s = $t || Eo(
        t,
        e,
        s,
        u,
        S,
        m,
        c
      )) ? (p || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = u, t.memoizedState = m), n.props = u, n.state = m, n.context = c, u = s) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), u = !1);
    } else {
      n = t.stateNode, Bc(l, t), c = t.memoizedProps, p = Ue(e, c), n.props = p, D = t.pendingProps, S = n.context, m = e.contextType, s = We, typeof m == "object" && m !== null && (s = Yl(m)), i = e.getDerivedStateFromProps, (m = typeof i == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c !== D || S !== s) && Ao(
        t,
        n,
        u,
        s
      ), $t = !1, S = t.memoizedState, n.state = S, $u(t, u, n, a), wu();
      var b = t.memoizedState;
      c !== D || S !== b || $t || l !== null && l.dependencies !== null && Ka(l.dependencies) ? (typeof i == "function" && (ei(
        t,
        e,
        i,
        u
      ), b = t.memoizedState), (p = $t || Eo(
        t,
        e,
        p,
        u,
        S,
        b,
        s
      ) || l !== null && l.dependencies !== null && Ka(l.dependencies)) ? (m || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(u, b, s), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        u,
        b,
        s
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || c === l.memoizedProps && S === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && S === l.memoizedState || (t.flags |= 1024), t.memoizedProps = u, t.memoizedState = b), n.props = u, n.state = b, n.context = s, u = p) : (typeof n.componentDidUpdate != "function" || c === l.memoizedProps && S === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && S === l.memoizedState || (t.flags |= 1024), u = !1);
    }
    return n = u, rn(l, t), u = (t.flags & 128) !== 0, n || u ? (n = t.stateNode, e = u && typeof e.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && u ? (t.child = cu(
      t,
      l.child,
      null,
      a
    ), t.child = cu(
      t,
      null,
      e,
      a
    )) : Ul(l, t, e, a), t.memoizedState = n.state, l = t.child) : l = qt(
      l,
      t,
      a
    ), l;
  }
  function Yo(l, t, e, u) {
    return Gu(), t.flags |= 256, Ul(l, t, e, u), t.child;
  }
  var ci = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function ii(l) {
    return { baseLanes: l, cachePool: Ds() };
  }
  function fi(l, t, e) {
    return l = l !== null ? l.childLanes & ~e : 0, t && (l |= ht), l;
  }
  function Go(l, t, e) {
    var u = t.pendingProps, a = !1, n = (t.flags & 128) !== 0, c;
    if ((c = n) || (c = l !== null && l.memoizedState === null ? !1 : (El.current & 2) !== 0), c && (a = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (tl) {
        if (a ? It(t) : Pt(), tl) {
          var i = vl, s;
          if (s = i) {
            l: {
              for (s = i, i = pt; s.nodeType !== 8; ) {
                if (!i) {
                  i = null;
                  break l;
                }
                if (s = gt(
                  s.nextSibling
                ), s === null) {
                  i = null;
                  break l;
                }
              }
              i = s;
            }
            i !== null ? (t.memoizedState = {
              dehydrated: i,
              treeContext: Ee !== null ? { id: Nt, overflow: xt } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, s = lt(
              18,
              null,
              null,
              0
            ), s.stateNode = i, s.return = t, t.child = s, Zl = t, vl = null, s = !0) : s = !1;
          }
          s || Re(t);
        }
        if (i = t.memoizedState, i !== null && (i = i.dehydrated, i !== null))
          return Ki(i) ? t.lanes = 32 : t.lanes = 536870912, null;
        jt(t);
      }
      return i = u.children, u = u.fallback, a ? (Pt(), a = t.mode, i = dn(
        { mode: "hidden", children: i },
        a
      ), u = pe(
        u,
        a,
        e,
        null
      ), i.return = t, u.return = t, i.sibling = u, t.child = i, a = t.child, a.memoizedState = ii(e), a.childLanes = fi(
        l,
        c,
        e
      ), t.memoizedState = ci, u) : (It(t), si(t, i));
    }
    if (s = l.memoizedState, s !== null && (i = s.dehydrated, i !== null)) {
      if (n)
        t.flags & 256 ? (It(t), t.flags &= -257, t = oi(
          l,
          t,
          e
        )) : t.memoizedState !== null ? (Pt(), t.child = l.child, t.flags |= 128, t = null) : (Pt(), a = u.fallback, i = t.mode, u = dn(
          { mode: "visible", children: u.children },
          i
        ), a = pe(
          a,
          i,
          e,
          null
        ), a.flags |= 2, u.return = t, a.return = t, u.sibling = a, t.child = u, cu(
          t,
          l.child,
          null,
          e
        ), u = t.child, u.memoizedState = ii(e), u.childLanes = fi(
          l,
          c,
          e
        ), t.memoizedState = ci, t = a);
      else if (It(t), Ki(i)) {
        if (c = i.nextSibling && i.nextSibling.dataset, c) var m = c.dgst;
        c = m, u = Error(o(419)), u.stack = "", u.digest = c, Xu({ value: u, source: null, stack: null }), t = oi(
          l,
          t,
          e
        );
      } else if (Dl || Qu(l, t, e, !1), c = (e & l.childLanes) !== 0, Dl || c) {
        if (c = sl, c !== null && (u = e & -e, u = (u & 42) !== 0 ? 1 : Jn(u), u = (u & (c.suspendedLanes | e)) !== 0 ? 0 : u, u !== 0 && u !== s.retryLane))
          throw s.retryLane = u, ke(l, u), nt(c, l, u), Uo;
        i.data === "$?" || zi(), t = oi(
          l,
          t,
          e
        );
      } else
        i.data === "$?" ? (t.flags |= 192, t.child = l.child, t = null) : (l = s.treeContext, vl = gt(
          i.nextSibling
        ), Zl = t, tl = !0, De = null, pt = !1, l !== null && (ot[rt++] = Nt, ot[rt++] = xt, ot[rt++] = Ee, Nt = l.id, xt = l.overflow, Ee = t), t = si(
          t,
          u.children
        ), t.flags |= 4096);
      return t;
    }
    return a ? (Pt(), a = u.fallback, i = t.mode, s = l.child, m = s.sibling, u = Ut(s, {
      mode: "hidden",
      children: u.children
    }), u.subtreeFlags = s.subtreeFlags & 65011712, m !== null ? a = Ut(m, a) : (a = pe(
      a,
      i,
      e,
      null
    ), a.flags |= 2), a.return = t, u.return = t, u.sibling = a, t.child = u, u = a, a = t.child, i = l.child.memoizedState, i === null ? i = ii(e) : (s = i.cachePool, s !== null ? (m = pl._currentValue, s = s.parent !== m ? { parent: m, pool: m } : s) : s = Ds(), i = {
      baseLanes: i.baseLanes | e,
      cachePool: s
    }), a.memoizedState = i, a.childLanes = fi(
      l,
      c,
      e
    ), t.memoizedState = ci, u) : (It(t), e = l.child, l = e.sibling, e = Ut(e, {
      mode: "visible",
      children: u.children
    }), e.return = t, e.sibling = null, l !== null && (c = t.deletions, c === null ? (t.deletions = [l], t.flags |= 16) : c.push(l)), t.child = e, t.memoizedState = null, e);
  }
  function si(l, t) {
    return t = dn(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function dn(l, t) {
    return l = lt(22, l, null, t), l.lanes = 0, l.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, l;
  }
  function oi(l, t, e) {
    return cu(t, l.child, null, e), l = si(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function Xo(l, t, e) {
    l.lanes |= t;
    var u = l.alternate;
    u !== null && (u.lanes |= t), zc(l.return, t, e);
  }
  function ri(l, t, e, u, a) {
    var n = l.memoizedState;
    n === null ? l.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: u,
      tail: e,
      tailMode: a
    } : (n.isBackwards = t, n.rendering = null, n.renderingStartTime = 0, n.last = u, n.tail = e, n.tailMode = a);
  }
  function Qo(l, t, e) {
    var u = t.pendingProps, a = u.revealOrder, n = u.tail;
    if (Ul(l, t, u.children, e), u = El.current, (u & 2) !== 0)
      u = u & 1 | 2, t.flags |= 128;
    else {
      if (l !== null && (l.flags & 128) !== 0)
        l: for (l = t.child; l !== null; ) {
          if (l.tag === 13)
            l.memoizedState !== null && Xo(l, e, t);
          else if (l.tag === 19)
            Xo(l, e, t);
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
      u &= 1;
    }
    switch (M(El, u), a) {
      case "forwards":
        for (e = t.child, a = null; e !== null; )
          l = e.alternate, l !== null && fn(l) === null && (a = e), e = e.sibling;
        e = a, e === null ? (a = t.child, t.child = null) : (a = e.sibling, e.sibling = null), ri(
          t,
          !1,
          a,
          e,
          n
        );
        break;
      case "backwards":
        for (e = null, a = t.child, t.child = null; a !== null; ) {
          if (l = a.alternate, l !== null && fn(l) === null) {
            t.child = a;
            break;
          }
          l = a.sibling, a.sibling = e, e = a, a = l;
        }
        ri(
          t,
          !0,
          e,
          null,
          n
        );
        break;
      case "together":
        ri(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function qt(l, t, e) {
    if (l !== null && (t.dependencies = l.dependencies), ae |= t.lanes, (e & t.childLanes) === 0)
      if (l !== null) {
        if (Qu(
          l,
          t,
          e,
          !1
        ), (e & t.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && t.child !== l.child)
      throw Error(o(153));
    if (t.child !== null) {
      for (l = t.child, e = Ut(l, l.pendingProps), t.child = e, e.return = t; l.sibling !== null; )
        l = l.sibling, e = e.sibling = Ut(l, l.pendingProps), e.return = t;
      e.sibling = null;
    }
    return t.child;
  }
  function di(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && Ka(l)));
  }
  function lh(l, t, e) {
    switch (t.tag) {
      case 3:
        rl(t, t.stateNode.containerInfo), wt(t, pl, l.memoizedState.cache), Gu();
        break;
      case 27:
      case 5:
        Qn(t);
        break;
      case 4:
        rl(t, t.stateNode.containerInfo);
        break;
      case 10:
        wt(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var u = t.memoizedState;
        if (u !== null)
          return u.dehydrated !== null ? (It(t), t.flags |= 128, null) : (e & t.child.childLanes) !== 0 ? Go(l, t, e) : (It(t), l = qt(
            l,
            t,
            e
          ), l !== null ? l.sibling : null);
        It(t);
        break;
      case 19:
        var a = (l.flags & 128) !== 0;
        if (u = (e & t.childLanes) !== 0, u || (Qu(
          l,
          t,
          e,
          !1
        ), u = (e & t.childLanes) !== 0), a) {
          if (u)
            return Qo(
              l,
              t,
              e
            );
          t.flags |= 128;
        }
        if (a = t.memoizedState, a !== null && (a.rendering = null, a.tail = null, a.lastEffect = null), M(El, El.current), u) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Co(l, t, e);
      case 24:
        wt(t, pl, l.memoizedState.cache);
    }
    return qt(l, t, e);
  }
  function Zo(l, t, e) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        Dl = !0;
      else {
        if (!di(l, e) && (t.flags & 128) === 0)
          return Dl = !1, lh(
            l,
            t,
            e
          );
        Dl = (l.flags & 131072) !== 0;
      }
    else
      Dl = !1, tl && (t.flags & 1048576) !== 0 && gs(t, La, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          l = t.pendingProps;
          var u = t.elementType, a = u._init;
          if (u = a(u._payload), t.type = u, typeof u == "function")
            pc(u) ? (l = Ue(u, l), t.tag = 1, t = qo(
              null,
              t,
              u,
              l,
              e
            )) : (t.tag = 0, t = ni(
              null,
              t,
              u,
              l,
              e
            ));
          else {
            if (u != null) {
              if (a = u.$$typeof, a === Vl) {
                t.tag = 11, t = No(
                  null,
                  t,
                  u,
                  l,
                  e
                );
                break l;
              } else if (a === Cl) {
                t.tag = 14, t = xo(
                  null,
                  t,
                  u,
                  l,
                  e
                );
                break l;
              }
            }
            throw t = ye(u) || u, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return ni(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 1:
        return u = t.type, a = Ue(
          u,
          t.pendingProps
        ), qo(
          l,
          t,
          u,
          a,
          e
        );
      case 3:
        l: {
          if (rl(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(o(387));
          u = t.pendingProps;
          var n = t.memoizedState;
          a = n.element, Bc(l, t), $u(t, u, null, e);
          var c = t.memoizedState;
          if (u = c.cache, wt(t, pl, u), u !== n.cache && Mc(
            t,
            [pl],
            e,
            !0
          ), wu(), u = c.element, n.isDehydrated)
            if (n = {
              element: u,
              isDehydrated: !1,
              cache: c.cache
            }, t.updateQueue.baseState = n, t.memoizedState = n, t.flags & 256) {
              t = Yo(
                l,
                t,
                u,
                e
              );
              break l;
            } else if (u !== a) {
              a = ft(
                Error(o(424)),
                t
              ), Xu(a), t = Yo(
                l,
                t,
                u,
                e
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
              for (vl = gt(l.firstChild), Zl = t, tl = !0, De = null, pt = !0, e = To(
                t,
                null,
                u,
                e
              ), t.child = e; e; )
                e.flags = e.flags & -3 | 4096, e = e.sibling;
            }
          else {
            if (Gu(), u === a) {
              t = qt(
                l,
                t,
                e
              );
              break l;
            }
            Ul(
              l,
              t,
              u,
              e
            );
          }
          t = t.child;
        }
        return t;
      case 26:
        return rn(l, t), l === null ? (e = Jr(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = e : tl || (e = t.type, l = t.pendingProps, u = On(
          V.current
        ).createElement(e), u[ql] = t, u[Ll] = l, xl(u, e, l), Al(u), t.stateNode = u) : t.memoizedState = Jr(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return Qn(t), l === null && tl && (u = t.stateNode = Vr(
          t.type,
          t.pendingProps,
          V.current
        ), Zl = t, pt = !0, a = vl, fe(t.type) ? (Ji = a, vl = gt(
          u.firstChild
        )) : vl = a), Ul(
          l,
          t,
          t.pendingProps.children,
          e
        ), rn(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && tl && ((a = u = vl) && (u = zh(
          u,
          t.type,
          t.pendingProps,
          pt
        ), u !== null ? (t.stateNode = u, Zl = t, vl = gt(
          u.firstChild
        ), pt = !1, a = !0) : a = !1), a || Re(t)), Qn(t), a = t.type, n = t.pendingProps, c = l !== null ? l.memoizedProps : null, u = n.children, Zi(a, n) ? u = null : c !== null && Zi(a, c) && (t.flags |= 32), t.memoizedState !== null && (a = Qc(
          l,
          t,
          J0,
          null,
          null,
          e
        ), ma._currentValue = a), rn(l, t), Ul(l, t, u, e), t.child;
      case 6:
        return l === null && tl && ((l = e = vl) && (e = Mh(
          e,
          t.pendingProps,
          pt
        ), e !== null ? (t.stateNode = e, Zl = t, vl = null, l = !0) : l = !1), l || Re(t)), null;
      case 13:
        return Go(l, t, e);
      case 4:
        return rl(
          t,
          t.stateNode.containerInfo
        ), u = t.pendingProps, l === null ? t.child = cu(
          t,
          null,
          u,
          e
        ) : Ul(
          l,
          t,
          u,
          e
        ), t.child;
      case 11:
        return No(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 7:
        return Ul(
          l,
          t,
          t.pendingProps,
          e
        ), t.child;
      case 8:
        return Ul(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 12:
        return Ul(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 10:
        return u = t.pendingProps, wt(t, t.type, u.value), Ul(
          l,
          t,
          u.children,
          e
        ), t.child;
      case 9:
        return a = t.type._context, u = t.pendingProps.children, _e(t), a = Yl(a), u = u(a), t.flags |= 1, Ul(l, t, u, e), t.child;
      case 14:
        return xo(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 15:
        return Ho(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 19:
        return Qo(l, t, e);
      case 31:
        return u = t.pendingProps, e = t.mode, u = {
          mode: u.mode,
          children: u.children
        }, l === null ? (e = dn(
          u,
          e
        ), e.ref = t.ref, t.child = e, e.return = t, t = e) : (e = Ut(l.child, u), e.ref = t.ref, t.child = e, e.return = t, t = e), t;
      case 22:
        return Co(l, t, e);
      case 24:
        return _e(t), u = Yl(pl), l === null ? (a = xc(), a === null && (a = sl, n = Uc(), a.pooledCache = n, n.refCount++, n !== null && (a.pooledCacheLanes |= e), a = n), t.memoizedState = {
          parent: u,
          cache: a
        }, Cc(t), wt(t, pl, a)) : ((l.lanes & e) !== 0 && (Bc(l, t), $u(t, null, null, e), wu()), a = l.memoizedState, n = t.memoizedState, a.parent !== u ? (a = { parent: u, cache: u }, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), wt(t, pl, u)) : (u = n.cache, wt(t, pl, u), u !== a.cache && Mc(
          t,
          [pl],
          e,
          !0
        ))), Ul(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Yt(l) {
    l.flags |= 4;
  }
  function Vo(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !Fr(t)) {
      if (t = dt.current, t !== null && ((F & 4194048) === F ? Et !== null : (F & 62914560) !== F && (F & 536870912) === 0 || t !== Et))
        throw Ku = Hc, Rs;
      l.flags |= 8192;
    }
  }
  function hn(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? Tf() : 536870912, l.lanes |= t, ou |= t);
  }
  function ta(l, t) {
    if (!tl)
      switch (l.tailMode) {
        case "hidden":
          t = l.tail;
          for (var e = null; t !== null; )
            t.alternate !== null && (e = t), t = t.sibling;
          e === null ? l.tail = null : e.sibling = null;
          break;
        case "collapsed":
          e = l.tail;
          for (var u = null; e !== null; )
            e.alternate !== null && (u = e), e = e.sibling;
          u === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : u.sibling = null;
      }
  }
  function hl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, e = 0, u = 0;
    if (t)
      for (var a = l.child; a !== null; )
        e |= a.lanes | a.childLanes, u |= a.subtreeFlags & 65011712, u |= a.flags & 65011712, a.return = l, a = a.sibling;
    else
      for (a = l.child; a !== null; )
        e |= a.lanes | a.childLanes, u |= a.subtreeFlags, u |= a.flags, a.return = l, a = a.sibling;
    return l.subtreeFlags |= u, l.childLanes = e, t;
  }
  function th(l, t, e) {
    var u = t.pendingProps;
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
        return hl(t), null;
      case 1:
        return hl(t), null;
      case 3:
        return e = t.stateNode, u = null, l !== null && (u = l.memoizedState.cache), t.memoizedState.cache !== u && (t.flags |= 2048), Ct(pl), Vt(), e.pendingContext && (e.context = e.pendingContext, e.pendingContext = null), (l === null || l.child === null) && (Yu(t) ? Yt(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ts())), hl(t), null;
      case 26:
        return e = t.memoizedState, l === null ? (Yt(t), e !== null ? (hl(t), Vo(t, e)) : (hl(t), t.flags &= -16777217)) : e ? e !== l.memoizedState ? (Yt(t), hl(t), Vo(t, e)) : (hl(t), t.flags &= -16777217) : (l.memoizedProps !== u && Yt(t), hl(t), t.flags &= -16777217), null;
      case 27:
        Aa(t), e = V.current;
        var a = t.type;
        if (l !== null && t.stateNode != null)
          l.memoizedProps !== u && Yt(t);
        else {
          if (!u) {
            if (t.stateNode === null)
              throw Error(o(166));
            return hl(t), null;
          }
          l = q.current, Yu(t) ? Ss(t) : (l = Vr(a, u, e), t.stateNode = l, Yt(t));
        }
        return hl(t), null;
      case 5:
        if (Aa(t), e = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== u && Yt(t);
        else {
          if (!u) {
            if (t.stateNode === null)
              throw Error(o(166));
            return hl(t), null;
          }
          if (l = q.current, Yu(t))
            Ss(t);
          else {
            switch (a = On(
              V.current
            ), l) {
              case 1:
                l = a.createElementNS(
                  "http://www.w3.org/2000/svg",
                  e
                );
                break;
              case 2:
                l = a.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  e
                );
                break;
              default:
                switch (e) {
                  case "svg":
                    l = a.createElementNS(
                      "http://www.w3.org/2000/svg",
                      e
                    );
                    break;
                  case "math":
                    l = a.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      e
                    );
                    break;
                  case "script":
                    l = a.createElement("div"), l.innerHTML = "<script><\/script>", l = l.removeChild(l.firstChild);
                    break;
                  case "select":
                    l = typeof u.is == "string" ? a.createElement("select", { is: u.is }) : a.createElement("select"), u.multiple ? l.multiple = !0 : u.size && (l.size = u.size);
                    break;
                  default:
                    l = typeof u.is == "string" ? a.createElement(e, { is: u.is }) : a.createElement(e);
                }
            }
            l[ql] = t, l[Ll] = u;
            l: for (a = t.child; a !== null; ) {
              if (a.tag === 5 || a.tag === 6)
                l.appendChild(a.stateNode);
              else if (a.tag !== 4 && a.tag !== 27 && a.child !== null) {
                a.child.return = a, a = a.child;
                continue;
              }
              if (a === t) break l;
              for (; a.sibling === null; ) {
                if (a.return === null || a.return === t)
                  break l;
                a = a.return;
              }
              a.sibling.return = a.return, a = a.sibling;
            }
            t.stateNode = l;
            l: switch (xl(l, e, u), e) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!u.autoFocus;
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
        return hl(t), t.flags &= -16777217, null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== u && Yt(t);
        else {
          if (typeof u != "string" && t.stateNode === null)
            throw Error(o(166));
          if (l = V.current, Yu(t)) {
            if (l = t.stateNode, e = t.memoizedProps, u = null, a = Zl, a !== null)
              switch (a.tag) {
                case 27:
                case 5:
                  u = a.memoizedProps;
              }
            l[ql] = t, l = !!(l.nodeValue === e || u !== null && u.suppressHydrationWarning === !0 || jr(l.nodeValue, e)), l || Re(t);
          } else
            l = On(l).createTextNode(
              u
            ), l[ql] = t, t.stateNode = l;
        }
        return hl(t), null;
      case 13:
        if (u = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (a = Yu(t), u !== null && u.dehydrated !== null) {
            if (l === null) {
              if (!a) throw Error(o(318));
              if (a = t.memoizedState, a = a !== null ? a.dehydrated : null, !a) throw Error(o(317));
              a[ql] = t;
            } else
              Gu(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            hl(t), a = !1;
          } else
            a = Ts(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = a), a = !0;
          if (!a)
            return t.flags & 256 ? (jt(t), t) : (jt(t), null);
        }
        if (jt(t), (t.flags & 128) !== 0)
          return t.lanes = e, t;
        if (e = u !== null, l = l !== null && l.memoizedState !== null, e) {
          u = t.child, a = null, u.alternate !== null && u.alternate.memoizedState !== null && u.alternate.memoizedState.cachePool !== null && (a = u.alternate.memoizedState.cachePool.pool);
          var n = null;
          u.memoizedState !== null && u.memoizedState.cachePool !== null && (n = u.memoizedState.cachePool.pool), n !== a && (u.flags |= 2048);
        }
        return e !== l && e && (t.child.flags |= 8192), hn(t, t.updateQueue), hl(t), null;
      case 4:
        return Vt(), l === null && qi(t.stateNode.containerInfo), hl(t), null;
      case 10:
        return Ct(t.type), hl(t), null;
      case 19:
        if (x(El), a = t.memoizedState, a === null) return hl(t), null;
        if (u = (t.flags & 128) !== 0, n = a.rendering, n === null)
          if (u) ta(a, !1);
          else {
            if (yl !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = fn(l), n !== null) {
                  for (t.flags |= 128, ta(a, !1), l = n.updateQueue, t.updateQueue = l, hn(t, l), t.subtreeFlags = 0, l = e, e = t.child; e !== null; )
                    ms(e, l), e = e.sibling;
                  return M(
                    El,
                    El.current & 1 | 2
                  ), t.child;
                }
                l = l.sibling;
              }
            a.tail !== null && Tt() > mn && (t.flags |= 128, u = !0, ta(a, !1), t.lanes = 4194304);
          }
        else {
          if (!u)
            if (l = fn(n), l !== null) {
              if (t.flags |= 128, u = !0, l = l.updateQueue, t.updateQueue = l, hn(t, l), ta(a, !0), a.tail === null && a.tailMode === "hidden" && !n.alternate && !tl)
                return hl(t), null;
            } else
              2 * Tt() - a.renderingStartTime > mn && e !== 536870912 && (t.flags |= 128, u = !0, ta(a, !1), t.lanes = 4194304);
          a.isBackwards ? (n.sibling = t.child, t.child = n) : (l = a.last, l !== null ? l.sibling = n : t.child = n, a.last = n);
        }
        return a.tail !== null ? (t = a.tail, a.rendering = t, a.tail = t.sibling, a.renderingStartTime = Tt(), t.sibling = null, l = El.current, M(El, u ? l & 1 | 2 : l & 1), t) : (hl(t), null);
      case 22:
      case 23:
        return jt(t), Gc(), u = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== u && (t.flags |= 8192) : u && (t.flags |= 8192), u ? (e & 536870912) !== 0 && (t.flags & 128) === 0 && (hl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : hl(t), e = t.updateQueue, e !== null && hn(t, e.retryQueue), e = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), u = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (u = t.memoizedState.cachePool.pool), u !== e && (t.flags |= 2048), l !== null && x(ze), null;
      case 24:
        return e = null, l !== null && (e = l.memoizedState.cache), t.memoizedState.cache !== e && (t.flags |= 2048), Ct(pl), hl(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function eh(l, t) {
    switch (Rc(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return Ct(pl), Vt(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Aa(t), null;
      case 13:
        if (jt(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Gu();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return x(El), null;
      case 4:
        return Vt(), null;
      case 10:
        return Ct(t.type), null;
      case 22:
      case 23:
        return jt(t), Gc(), l !== null && x(ze), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return Ct(pl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Lo(l, t) {
    switch (Rc(t), t.tag) {
      case 3:
        Ct(pl), Vt();
        break;
      case 26:
      case 27:
      case 5:
        Aa(t);
        break;
      case 4:
        Vt();
        break;
      case 13:
        jt(t);
        break;
      case 19:
        x(El);
        break;
      case 10:
        Ct(t.type);
        break;
      case 22:
      case 23:
        jt(t), Gc(), l !== null && x(ze);
        break;
      case 24:
        Ct(pl);
    }
  }
  function ea(l, t) {
    try {
      var e = t.updateQueue, u = e !== null ? e.lastEffect : null;
      if (u !== null) {
        var a = u.next;
        e = a;
        do {
          if ((e.tag & l) === l) {
            u = void 0;
            var n = e.create, c = e.inst;
            u = n(), c.destroy = u;
          }
          e = e.next;
        } while (e !== a);
      }
    } catch (i) {
      fl(t, t.return, i);
    }
  }
  function le(l, t, e) {
    try {
      var u = t.updateQueue, a = u !== null ? u.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        u = n;
        do {
          if ((u.tag & l) === l) {
            var c = u.inst, i = c.destroy;
            if (i !== void 0) {
              c.destroy = void 0, a = t;
              var s = e, m = i;
              try {
                m();
              } catch (p) {
                fl(
                  a,
                  s,
                  p
                );
              }
            }
          }
          u = u.next;
        } while (u !== n);
      }
    } catch (p) {
      fl(t, t.return, p);
    }
  }
  function Ko(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var e = l.stateNode;
      try {
        Ns(t, e);
      } catch (u) {
        fl(l, l.return, u);
      }
    }
  }
  function Jo(l, t, e) {
    e.props = Ue(
      l.type,
      l.memoizedProps
    ), e.state = l.memoizedState;
    try {
      e.componentWillUnmount();
    } catch (u) {
      fl(l, t, u);
    }
  }
  function ua(l, t) {
    try {
      var e = l.ref;
      if (e !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var u = l.stateNode;
            break;
          case 30:
            u = l.stateNode;
            break;
          default:
            u = l.stateNode;
        }
        typeof e == "function" ? l.refCleanup = e(u) : e.current = u;
      }
    } catch (a) {
      fl(l, t, a);
    }
  }
  function At(l, t) {
    var e = l.ref, u = l.refCleanup;
    if (e !== null)
      if (typeof u == "function")
        try {
          u();
        } catch (a) {
          fl(l, t, a);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof e == "function")
        try {
          e(null);
        } catch (a) {
          fl(l, t, a);
        }
      else e.current = null;
  }
  function wo(l) {
    var t = l.type, e = l.memoizedProps, u = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          e.autoFocus && u.focus();
          break l;
        case "img":
          e.src ? u.src = e.src : e.srcSet && (u.srcset = e.srcSet);
      }
    } catch (a) {
      fl(l, l.return, a);
    }
  }
  function hi(l, t, e) {
    try {
      var u = l.stateNode;
      Ah(u, l.type, e, t), u[Ll] = t;
    } catch (a) {
      fl(l, l.return, a);
    }
  }
  function $o(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && fe(l.type) || l.tag === 4;
  }
  function vi(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || $o(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && fe(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function yi(l, t, e) {
    var u = l.tag;
    if (u === 5 || u === 6)
      l = l.stateNode, t ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(l, t) : (t = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, t.appendChild(l), e = e._reactRootContainer, e != null || t.onclick !== null || (t.onclick = Rn));
    else if (u !== 4 && (u === 27 && fe(l.type) && (e = l.stateNode, t = null), l = l.child, l !== null))
      for (yi(l, t, e), l = l.sibling; l !== null; )
        yi(l, t, e), l = l.sibling;
  }
  function vn(l, t, e) {
    var u = l.tag;
    if (u === 5 || u === 6)
      l = l.stateNode, t ? e.insertBefore(l, t) : e.appendChild(l);
    else if (u !== 4 && (u === 27 && fe(l.type) && (e = l.stateNode), l = l.child, l !== null))
      for (vn(l, t, e), l = l.sibling; l !== null; )
        vn(l, t, e), l = l.sibling;
  }
  function ko(l) {
    var t = l.stateNode, e = l.memoizedProps;
    try {
      for (var u = l.type, a = t.attributes; a.length; )
        t.removeAttributeNode(a[0]);
      xl(t, u, e), t[ql] = l, t[Ll] = e;
    } catch (n) {
      fl(l, l.return, n);
    }
  }
  var Gt = !1, gl = !1, mi = !1, Wo = typeof WeakSet == "function" ? WeakSet : Set, Rl = null;
  function uh(l, t) {
    if (l = l.containerInfo, Xi = xn, l = cs(l), vc(l)) {
      if ("selectionStart" in l)
        var e = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        l: {
          e = (e = l.ownerDocument) && e.defaultView || window;
          var u = e.getSelection && e.getSelection();
          if (u && u.rangeCount !== 0) {
            e = u.anchorNode;
            var a = u.anchorOffset, n = u.focusNode;
            u = u.focusOffset;
            try {
              e.nodeType, n.nodeType;
            } catch {
              e = null;
              break l;
            }
            var c = 0, i = -1, s = -1, m = 0, p = 0, D = l, S = null;
            t: for (; ; ) {
              for (var b; D !== e || a !== 0 && D.nodeType !== 3 || (i = c + a), D !== n || u !== 0 && D.nodeType !== 3 || (s = c + u), D.nodeType === 3 && (c += D.nodeValue.length), (b = D.firstChild) !== null; )
                S = D, D = b;
              for (; ; ) {
                if (D === l) break t;
                if (S === e && ++m === a && (i = c), S === n && ++p === u && (s = c), (b = D.nextSibling) !== null) break;
                D = S, S = D.parentNode;
              }
              D = b;
            }
            e = i === -1 || s === -1 ? null : { start: i, end: s };
          } else e = null;
        }
      e = e || { start: 0, end: 0 };
    } else e = null;
    for (Qi = { focusedElem: l, selectionRange: e }, xn = !1, Rl = t; Rl !== null; )
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
                l = void 0, e = t, a = n.memoizedProps, n = n.memoizedState, u = e.stateNode;
                try {
                  var Q = Ue(
                    e.type,
                    a,
                    e.elementType === e.type
                  );
                  l = u.getSnapshotBeforeUpdate(
                    Q,
                    n
                  ), u.__reactInternalSnapshotBeforeUpdate = l;
                } catch (Y) {
                  fl(
                    e,
                    e.return,
                    Y
                  );
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (l = t.stateNode.containerInfo, e = l.nodeType, e === 9)
                  Li(l);
                else if (e === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Li(l);
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
              if ((l & 1024) !== 0) throw Error(o(163));
          }
          if (l = t.sibling, l !== null) {
            l.return = t.return, Rl = l;
            break;
          }
          Rl = t.return;
        }
  }
  function Fo(l, t, e) {
    var u = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        te(l, e), u & 4 && ea(5, e);
        break;
      case 1:
        if (te(l, e), u & 4)
          if (l = e.stateNode, t === null)
            try {
              l.componentDidMount();
            } catch (c) {
              fl(e, e.return, c);
            }
          else {
            var a = Ue(
              e.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              l.componentDidUpdate(
                a,
                t,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (c) {
              fl(
                e,
                e.return,
                c
              );
            }
          }
        u & 64 && Ko(e), u & 512 && ua(e, e.return);
        break;
      case 3:
        if (te(l, e), u & 64 && (l = e.updateQueue, l !== null)) {
          if (t = null, e.child !== null)
            switch (e.child.tag) {
              case 27:
              case 5:
                t = e.child.stateNode;
                break;
              case 1:
                t = e.child.stateNode;
            }
          try {
            Ns(l, t);
          } catch (c) {
            fl(e, e.return, c);
          }
        }
        break;
      case 27:
        t === null && u & 4 && ko(e);
      case 26:
      case 5:
        te(l, e), t === null && u & 4 && wo(e), u & 512 && ua(e, e.return);
        break;
      case 12:
        te(l, e);
        break;
      case 13:
        te(l, e), u & 4 && lr(l, e), u & 64 && (l = e.memoizedState, l !== null && (l = l.dehydrated, l !== null && (e = dh.bind(
          null,
          e
        ), Uh(l, e))));
        break;
      case 22:
        if (u = e.memoizedState !== null || Gt, !u) {
          t = t !== null && t.memoizedState !== null || gl, a = Gt;
          var n = gl;
          Gt = u, (gl = t) && !n ? ee(
            l,
            e,
            (e.subtreeFlags & 8772) !== 0
          ) : te(l, e), Gt = a, gl = n;
        }
        break;
      case 30:
        break;
      default:
        te(l, e);
    }
  }
  function Io(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, Io(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && kn(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var dl = null, wl = !1;
  function Xt(l, t, e) {
    for (e = e.child; e !== null; )
      Po(l, t, e), e = e.sibling;
  }
  function Po(l, t, e) {
    if (Fl && typeof Fl.onCommitFiberUnmount == "function")
      try {
        Fl.onCommitFiberUnmount(Du, e);
      } catch {
      }
    switch (e.tag) {
      case 26:
        gl || At(e, t), Xt(
          l,
          t,
          e
        ), e.memoizedState ? e.memoizedState.count-- : e.stateNode && (e = e.stateNode, e.parentNode.removeChild(e));
        break;
      case 27:
        gl || At(e, t);
        var u = dl, a = wl;
        fe(e.type) && (dl = e.stateNode, wl = !1), Xt(
          l,
          t,
          e
        ), da(e.stateNode), dl = u, wl = a;
        break;
      case 5:
        gl || At(e, t);
      case 6:
        if (u = dl, a = wl, dl = null, Xt(
          l,
          t,
          e
        ), dl = u, wl = a, dl !== null)
          if (wl)
            try {
              (dl.nodeType === 9 ? dl.body : dl.nodeName === "HTML" ? dl.ownerDocument.body : dl).removeChild(e.stateNode);
            } catch (n) {
              fl(
                e,
                t,
                n
              );
            }
          else
            try {
              dl.removeChild(e.stateNode);
            } catch (n) {
              fl(
                e,
                t,
                n
              );
            }
        break;
      case 18:
        dl !== null && (wl ? (l = dl, Qr(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          e.stateNode
        ), Ta(l)) : Qr(dl, e.stateNode));
        break;
      case 4:
        u = dl, a = wl, dl = e.stateNode.containerInfo, wl = !0, Xt(
          l,
          t,
          e
        ), dl = u, wl = a;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        gl || le(2, e, t), gl || le(4, e, t), Xt(
          l,
          t,
          e
        );
        break;
      case 1:
        gl || (At(e, t), u = e.stateNode, typeof u.componentWillUnmount == "function" && Jo(
          e,
          t,
          u
        )), Xt(
          l,
          t,
          e
        );
        break;
      case 21:
        Xt(
          l,
          t,
          e
        );
        break;
      case 22:
        gl = (u = gl) || e.memoizedState !== null, Xt(
          l,
          t,
          e
        ), gl = u;
        break;
      default:
        Xt(
          l,
          t,
          e
        );
    }
  }
  function lr(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        Ta(l);
      } catch (e) {
        fl(t, t.return, e);
      }
  }
  function ah(l) {
    switch (l.tag) {
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new Wo()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new Wo()), t;
      default:
        throw Error(o(435, l.tag));
    }
  }
  function gi(l, t) {
    var e = ah(l);
    t.forEach(function(u) {
      var a = hh.bind(null, l, u);
      e.has(u) || (e.add(u), u.then(a, a));
    });
  }
  function tt(l, t) {
    var e = t.deletions;
    if (e !== null)
      for (var u = 0; u < e.length; u++) {
        var a = e[u], n = l, c = t, i = c;
        l: for (; i !== null; ) {
          switch (i.tag) {
            case 27:
              if (fe(i.type)) {
                dl = i.stateNode, wl = !1;
                break l;
              }
              break;
            case 5:
              dl = i.stateNode, wl = !1;
              break l;
            case 3:
            case 4:
              dl = i.stateNode.containerInfo, wl = !0;
              break l;
          }
          i = i.return;
        }
        if (dl === null) throw Error(o(160));
        Po(n, c, a), dl = null, wl = !1, n = a.alternate, n !== null && (n.return = null), a.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        tr(t, l), t = t.sibling;
  }
  var mt = null;
  function tr(l, t) {
    var e = l.alternate, u = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        tt(t, l), et(l), u & 4 && (le(3, l, l.return), ea(3, l), le(5, l, l.return));
        break;
      case 1:
        tt(t, l), et(l), u & 512 && (gl || e === null || At(e, e.return)), u & 64 && Gt && (l = l.updateQueue, l !== null && (u = l.callbacks, u !== null && (e = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = e === null ? u : e.concat(u))));
        break;
      case 26:
        var a = mt;
        if (tt(t, l), et(l), u & 512 && (gl || e === null || At(e, e.return)), u & 4) {
          var n = e !== null ? e.memoizedState : null;
          if (u = l.memoizedState, e === null)
            if (u === null)
              if (l.stateNode === null) {
                l: {
                  u = l.type, e = l.memoizedProps, a = a.ownerDocument || a;
                  t: switch (u) {
                    case "title":
                      n = a.getElementsByTagName("title")[0], (!n || n[_u] || n[ql] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = a.createElement(u), a.head.insertBefore(
                        n,
                        a.querySelector("head > title")
                      )), xl(n, u, e), n[ql] = l, Al(n), u = n;
                      break l;
                    case "link":
                      var c = kr(
                        "link",
                        "href",
                        a
                      ).get(u + (e.href || ""));
                      if (c) {
                        for (var i = 0; i < c.length; i++)
                          if (n = c[i], n.getAttribute("href") === (e.href == null || e.href === "" ? null : e.href) && n.getAttribute("rel") === (e.rel == null ? null : e.rel) && n.getAttribute("title") === (e.title == null ? null : e.title) && n.getAttribute("crossorigin") === (e.crossOrigin == null ? null : e.crossOrigin)) {
                            c.splice(i, 1);
                            break t;
                          }
                      }
                      n = a.createElement(u), xl(n, u, e), a.head.appendChild(n);
                      break;
                    case "meta":
                      if (c = kr(
                        "meta",
                        "content",
                        a
                      ).get(u + (e.content || ""))) {
                        for (i = 0; i < c.length; i++)
                          if (n = c[i], n.getAttribute("content") === (e.content == null ? null : "" + e.content) && n.getAttribute("name") === (e.name == null ? null : e.name) && n.getAttribute("property") === (e.property == null ? null : e.property) && n.getAttribute("http-equiv") === (e.httpEquiv == null ? null : e.httpEquiv) && n.getAttribute("charset") === (e.charSet == null ? null : e.charSet)) {
                            c.splice(i, 1);
                            break t;
                          }
                      }
                      n = a.createElement(u), xl(n, u, e), a.head.appendChild(n);
                      break;
                    default:
                      throw Error(o(468, u));
                  }
                  n[ql] = l, Al(n), u = n;
                }
                l.stateNode = u;
              } else
                Wr(
                  a,
                  l.type,
                  l.stateNode
                );
            else
              l.stateNode = $r(
                a,
                u,
                l.memoizedProps
              );
          else
            n !== u ? (n === null ? e.stateNode !== null && (e = e.stateNode, e.parentNode.removeChild(e)) : n.count--, u === null ? Wr(
              a,
              l.type,
              l.stateNode
            ) : $r(
              a,
              u,
              l.memoizedProps
            )) : u === null && l.stateNode !== null && hi(
              l,
              l.memoizedProps,
              e.memoizedProps
            );
        }
        break;
      case 27:
        tt(t, l), et(l), u & 512 && (gl || e === null || At(e, e.return)), e !== null && u & 4 && hi(
          l,
          l.memoizedProps,
          e.memoizedProps
        );
        break;
      case 5:
        if (tt(t, l), et(l), u & 512 && (gl || e === null || At(e, e.return)), l.flags & 32) {
          a = l.stateNode;
          try {
            Ze(a, "");
          } catch (b) {
            fl(l, l.return, b);
          }
        }
        u & 4 && l.stateNode != null && (a = l.memoizedProps, hi(
          l,
          a,
          e !== null ? e.memoizedProps : a
        )), u & 1024 && (mi = !0);
        break;
      case 6:
        if (tt(t, l), et(l), u & 4) {
          if (l.stateNode === null)
            throw Error(o(162));
          u = l.memoizedProps, e = l.stateNode;
          try {
            e.nodeValue = u;
          } catch (b) {
            fl(l, l.return, b);
          }
        }
        break;
      case 3:
        if (Mn = null, a = mt, mt = _n(t.containerInfo), tt(t, l), mt = a, et(l), u & 4 && e !== null && e.memoizedState.isDehydrated)
          try {
            Ta(t.containerInfo);
          } catch (b) {
            fl(l, l.return, b);
          }
        mi && (mi = !1, er(l));
        break;
      case 4:
        u = mt, mt = _n(
          l.stateNode.containerInfo
        ), tt(t, l), et(l), mt = u;
        break;
      case 12:
        tt(t, l), et(l);
        break;
      case 13:
        tt(t, l), et(l), l.child.flags & 8192 && l.memoizedState !== null != (e !== null && e.memoizedState !== null) && (Ai = Tt()), u & 4 && (u = l.updateQueue, u !== null && (l.updateQueue = null, gi(l, u)));
        break;
      case 22:
        a = l.memoizedState !== null;
        var s = e !== null && e.memoizedState !== null, m = Gt, p = gl;
        if (Gt = m || a, gl = p || s, tt(t, l), gl = p, Gt = m, et(l), u & 8192)
          l: for (t = l.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (e === null || s || Gt || gl || Ne(l)), e = null, t = l; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (e === null) {
                s = e = t;
                try {
                  if (n = s.stateNode, a)
                    c = n.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    i = s.stateNode;
                    var D = s.memoizedProps.style, S = D != null && D.hasOwnProperty("display") ? D.display : null;
                    i.style.display = S == null || typeof S == "boolean" ? "" : ("" + S).trim();
                  }
                } catch (b) {
                  fl(s, s.return, b);
                }
              }
            } else if (t.tag === 6) {
              if (e === null) {
                s = t;
                try {
                  s.stateNode.nodeValue = a ? "" : s.memoizedProps;
                } catch (b) {
                  fl(s, s.return, b);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === l) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === l) break l;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === l) break l;
              e === t && (e = null), t = t.return;
            }
            e === t && (e = null), t.sibling.return = t.return, t = t.sibling;
          }
        u & 4 && (u = l.updateQueue, u !== null && (e = u.retryQueue, e !== null && (u.retryQueue = null, gi(l, e))));
        break;
      case 19:
        tt(t, l), et(l), u & 4 && (u = l.updateQueue, u !== null && (l.updateQueue = null, gi(l, u)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        tt(t, l), et(l);
    }
  }
  function et(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var e, u = l.return; u !== null; ) {
          if ($o(u)) {
            e = u;
            break;
          }
          u = u.return;
        }
        if (e == null) throw Error(o(160));
        switch (e.tag) {
          case 27:
            var a = e.stateNode, n = vi(l);
            vn(l, n, a);
            break;
          case 5:
            var c = e.stateNode;
            e.flags & 32 && (Ze(c, ""), e.flags &= -33);
            var i = vi(l);
            vn(l, i, c);
            break;
          case 3:
          case 4:
            var s = e.stateNode.containerInfo, m = vi(l);
            yi(
              l,
              m,
              s
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (p) {
        fl(l, l.return, p);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function er(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        er(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), l = l.sibling;
      }
  }
  function te(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Fo(l, t.alternate, t), t = t.sibling;
  }
  function Ne(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          le(4, t, t.return), Ne(t);
          break;
        case 1:
          At(t, t.return);
          var e = t.stateNode;
          typeof e.componentWillUnmount == "function" && Jo(
            t,
            t.return,
            e
          ), Ne(t);
          break;
        case 27:
          da(t.stateNode);
        case 26:
        case 5:
          At(t, t.return), Ne(t);
          break;
        case 22:
          t.memoizedState === null && Ne(t);
          break;
        case 30:
          Ne(t);
          break;
        default:
          Ne(t);
      }
      l = l.sibling;
    }
  }
  function ee(l, t, e) {
    for (e = e && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var u = t.alternate, a = l, n = t, c = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          ee(
            a,
            n,
            e
          ), ea(4, n);
          break;
        case 1:
          if (ee(
            a,
            n,
            e
          ), u = n, a = u.stateNode, typeof a.componentDidMount == "function")
            try {
              a.componentDidMount();
            } catch (m) {
              fl(u, u.return, m);
            }
          if (u = n, a = u.updateQueue, a !== null) {
            var i = u.stateNode;
            try {
              var s = a.shared.hiddenCallbacks;
              if (s !== null)
                for (a.shared.hiddenCallbacks = null, a = 0; a < s.length; a++)
                  Us(s[a], i);
            } catch (m) {
              fl(u, u.return, m);
            }
          }
          e && c & 64 && Ko(n), ua(n, n.return);
          break;
        case 27:
          ko(n);
        case 26:
        case 5:
          ee(
            a,
            n,
            e
          ), e && u === null && c & 4 && wo(n), ua(n, n.return);
          break;
        case 12:
          ee(
            a,
            n,
            e
          );
          break;
        case 13:
          ee(
            a,
            n,
            e
          ), e && c & 4 && lr(a, n);
          break;
        case 22:
          n.memoizedState === null && ee(
            a,
            n,
            e
          ), ua(n, n.return);
          break;
        case 30:
          break;
        default:
          ee(
            a,
            n,
            e
          );
      }
      t = t.sibling;
    }
  }
  function Si(l, t) {
    var e = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== e && (l != null && l.refCount++, e != null && Zu(e));
  }
  function bi(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Zu(l));
  }
  function Dt(l, t, e, u) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        ur(
          l,
          t,
          e,
          u
        ), t = t.sibling;
  }
  function ur(l, t, e, u) {
    var a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Dt(
          l,
          t,
          e,
          u
        ), a & 2048 && ea(9, t);
        break;
      case 1:
        Dt(
          l,
          t,
          e,
          u
        );
        break;
      case 3:
        Dt(
          l,
          t,
          e,
          u
        ), a & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Zu(l)));
        break;
      case 12:
        if (a & 2048) {
          Dt(
            l,
            t,
            e,
            u
          ), l = t.stateNode;
          try {
            var n = t.memoizedProps, c = n.id, i = n.onPostCommit;
            typeof i == "function" && i(
              c,
              t.alternate === null ? "mount" : "update",
              l.passiveEffectDuration,
              -0
            );
          } catch (s) {
            fl(t, t.return, s);
          }
        } else
          Dt(
            l,
            t,
            e,
            u
          );
        break;
      case 13:
        Dt(
          l,
          t,
          e,
          u
        );
        break;
      case 23:
        break;
      case 22:
        n = t.stateNode, c = t.alternate, t.memoizedState !== null ? n._visibility & 2 ? Dt(
          l,
          t,
          e,
          u
        ) : aa(l, t) : n._visibility & 2 ? Dt(
          l,
          t,
          e,
          u
        ) : (n._visibility |= 2, iu(
          l,
          t,
          e,
          u,
          (t.subtreeFlags & 10256) !== 0
        )), a & 2048 && Si(c, t);
        break;
      case 24:
        Dt(
          l,
          t,
          e,
          u
        ), a & 2048 && bi(t.alternate, t);
        break;
      default:
        Dt(
          l,
          t,
          e,
          u
        );
    }
  }
  function iu(l, t, e, u, a) {
    for (a = a && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var n = l, c = t, i = e, s = u, m = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          iu(
            n,
            c,
            i,
            s,
            a
          ), ea(8, c);
          break;
        case 23:
          break;
        case 22:
          var p = c.stateNode;
          c.memoizedState !== null ? p._visibility & 2 ? iu(
            n,
            c,
            i,
            s,
            a
          ) : aa(
            n,
            c
          ) : (p._visibility |= 2, iu(
            n,
            c,
            i,
            s,
            a
          )), a && m & 2048 && Si(
            c.alternate,
            c
          );
          break;
        case 24:
          iu(
            n,
            c,
            i,
            s,
            a
          ), a && m & 2048 && bi(c.alternate, c);
          break;
        default:
          iu(
            n,
            c,
            i,
            s,
            a
          );
      }
      t = t.sibling;
    }
  }
  function aa(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var e = l, u = t, a = u.flags;
        switch (u.tag) {
          case 22:
            aa(e, u), a & 2048 && Si(
              u.alternate,
              u
            );
            break;
          case 24:
            aa(e, u), a & 2048 && bi(u.alternate, u);
            break;
          default:
            aa(e, u);
        }
        t = t.sibling;
      }
  }
  var na = 8192;
  function fu(l) {
    if (l.subtreeFlags & na)
      for (l = l.child; l !== null; )
        ar(l), l = l.sibling;
  }
  function ar(l) {
    switch (l.tag) {
      case 26:
        fu(l), l.flags & na && l.memoizedState !== null && Vh(
          mt,
          l.memoizedState,
          l.memoizedProps
        );
        break;
      case 5:
        fu(l);
        break;
      case 3:
      case 4:
        var t = mt;
        mt = _n(l.stateNode.containerInfo), fu(l), mt = t;
        break;
      case 22:
        l.memoizedState === null && (t = l.alternate, t !== null && t.memoizedState !== null ? (t = na, na = 16777216, fu(l), na = t) : fu(l));
        break;
      default:
        fu(l);
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
  function ca(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var u = t[e];
          Rl = u, ir(
            u,
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
        ca(l), l.flags & 2048 && le(9, l, l.return);
        break;
      case 3:
        ca(l);
        break;
      case 12:
        ca(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, yn(l)) : ca(l);
        break;
      default:
        ca(l);
    }
  }
  function yn(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var u = t[e];
          Rl = u, ir(
            u,
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
          le(8, t, t.return), yn(t);
          break;
        case 22:
          e = t.stateNode, e._visibility & 2 && (e._visibility &= -3, yn(t));
          break;
        default:
          yn(t);
      }
      l = l.sibling;
    }
  }
  function ir(l, t) {
    for (; Rl !== null; ) {
      var e = Rl;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          le(8, e, t);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var u = e.memoizedState.cachePool.pool;
            u != null && u.refCount++;
          }
          break;
        case 24:
          Zu(e.memoizedState.cache);
      }
      if (u = e.child, u !== null) u.return = e, Rl = u;
      else
        l: for (e = l; Rl !== null; ) {
          u = Rl;
          var a = u.sibling, n = u.return;
          if (Io(u), u === e) {
            Rl = null;
            break l;
          }
          if (a !== null) {
            a.return = n, Rl = a;
            break l;
          }
          Rl = n;
        }
    }
  }
  var nh = {
    getCacheForType: function(l) {
      var t = Yl(pl), e = t.data.get(l);
      return e === void 0 && (e = l(), t.data.set(l, e)), e;
    }
  }, ch = typeof WeakMap == "function" ? WeakMap : Map, el = 0, sl = null, w = null, F = 0, ul = 0, ut = null, ue = !1, su = !1, Ti = !1, Qt = 0, yl = 0, ae = 0, xe = 0, pi = 0, ht = 0, ou = 0, ia = null, $l = null, Ei = !1, Ai = 0, mn = 1 / 0, gn = null, ne = null, Nl = 0, ce = null, ru = null, du = 0, Di = 0, Ri = null, fr = null, fa = 0, Oi = null;
  function at() {
    if ((el & 2) !== 0 && F !== 0)
      return F & -F;
    if (E.T !== null) {
      var l = Pe;
      return l !== 0 ? l : Hi();
    }
    return Af();
  }
  function sr() {
    ht === 0 && (ht = (F & 536870912) === 0 || tl ? bf() : 536870912);
    var l = dt.current;
    return l !== null && (l.flags |= 32), ht;
  }
  function nt(l, t, e) {
    (l === sl && (ul === 2 || ul === 9) || l.cancelPendingCommit !== null) && (hu(l, 0), ie(
      l,
      F,
      ht,
      !1
    )), Ou(l, e), ((el & 2) === 0 || l !== sl) && (l === sl && ((el & 2) === 0 && (xe |= e), yl === 4 && ie(
      l,
      F,
      ht,
      !1
    )), Rt(l));
  }
  function or(l, t, e) {
    if ((el & 6) !== 0) throw Error(o(327));
    var u = !e && (t & 124) === 0 && (t & l.expiredLanes) === 0 || Ru(l, t), a = u ? sh(l, t) : Mi(l, t, !0), n = u;
    do {
      if (a === 0) {
        su && !u && ie(l, t, 0, !1);
        break;
      } else {
        if (e = l.current.alternate, n && !ih(e)) {
          a = Mi(l, t, !1), n = !1;
          continue;
        }
        if (a === 2) {
          if (n = t, l.errorRecoveryDisabledLanes & n)
            var c = 0;
          else
            c = l.pendingLanes & -536870913, c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
          if (c !== 0) {
            t = c;
            l: {
              var i = l;
              a = ia;
              var s = i.current.memoizedState.isDehydrated;
              if (s && (hu(i, c).flags |= 256), c = Mi(
                i,
                c,
                !1
              ), c !== 2) {
                if (Ti && !s) {
                  i.errorRecoveryDisabledLanes |= n, xe |= n, a = 4;
                  break l;
                }
                n = $l, $l = a, n !== null && ($l === null ? $l = n : $l.push.apply(
                  $l,
                  n
                ));
              }
              a = c;
            }
            if (n = !1, a !== 2) continue;
          }
        }
        if (a === 1) {
          hu(l, 0), ie(l, t, 0, !0);
          break;
        }
        l: {
          switch (u = l, n = a, n) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              ie(
                u,
                t,
                ht,
                !ue
              );
              break l;
            case 2:
              $l = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (a = Ai + 300 - Tt(), 10 < a)) {
            if (ie(
              u,
              t,
              ht,
              !ue
            ), _a(u, 0, !0) !== 0) break l;
            u.timeoutHandle = Gr(
              rr.bind(
                null,
                u,
                e,
                $l,
                gn,
                Ei,
                t,
                ht,
                xe,
                ou,
                ue,
                n,
                2,
                -0,
                0
              ),
              a
            );
            break l;
          }
          rr(
            u,
            e,
            $l,
            gn,
            Ei,
            t,
            ht,
            xe,
            ou,
            ue,
            n,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Rt(l);
  }
  function rr(l, t, e, u, a, n, c, i, s, m, p, D, S, b) {
    if (l.timeoutHandle = -1, D = t.subtreeFlags, (D & 8192 || (D & 16785408) === 16785408) && (ya = { stylesheets: null, count: 0, unsuspend: Zh }, ar(t), D = Lh(), D !== null)) {
      l.cancelPendingCommit = D(
        Sr.bind(
          null,
          l,
          t,
          n,
          e,
          u,
          a,
          c,
          i,
          s,
          p,
          1,
          S,
          b
        )
      ), ie(l, n, c, !m);
      return;
    }
    Sr(
      l,
      t,
      n,
      e,
      u,
      a,
      c,
      i,
      s
    );
  }
  function ih(l) {
    for (var t = l; ; ) {
      var e = t.tag;
      if ((e === 0 || e === 11 || e === 15) && t.flags & 16384 && (e = t.updateQueue, e !== null && (e = e.stores, e !== null)))
        for (var u = 0; u < e.length; u++) {
          var a = e[u], n = a.getSnapshot;
          a = a.value;
          try {
            if (!Pl(n(), a)) return !1;
          } catch {
            return !1;
          }
        }
      if (e = t.child, t.subtreeFlags & 16384 && e !== null)
        e.return = t, t = e;
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
  function ie(l, t, e, u) {
    t &= ~pi, t &= ~xe, l.suspendedLanes |= t, l.pingedLanes &= ~t, u && (l.warmLanes |= t), u = l.expirationTimes;
    for (var a = t; 0 < a; ) {
      var n = 31 - Il(a), c = 1 << n;
      u[n] = -1, a &= ~c;
    }
    e !== 0 && pf(l, e, t);
  }
  function Sn() {
    return (el & 6) === 0 ? (sa(0), !1) : !0;
  }
  function _i() {
    if (w !== null) {
      if (ul === 0)
        var l = w.return;
      else
        l = w, Ht = Oe = null, Lc(l), nu = null, Pu = 0, l = w;
      for (; l !== null; )
        Lo(l.alternate, l), l = l.return;
      w = null;
    }
  }
  function hu(l, t) {
    var e = l.timeoutHandle;
    e !== -1 && (l.timeoutHandle = -1, Rh(e)), e = l.cancelPendingCommit, e !== null && (l.cancelPendingCommit = null, e()), _i(), sl = l, w = e = Ut(l.current, null), F = t, ul = 0, ut = null, ue = !1, su = Ru(l, t), Ti = !1, ou = ht = pi = xe = ae = yl = 0, $l = ia = null, Ei = !1, (t & 8) !== 0 && (t |= t & 32);
    var u = l.entangledLanes;
    if (u !== 0)
      for (l = l.entanglements, u &= t; 0 < u; ) {
        var a = 31 - Il(u), n = 1 << a;
        t |= l[a], u &= ~n;
      }
    return Qt = t, Ga(), e;
  }
  function dr(l, t) {
    K = null, E.H = an, t === Lu || t === $a ? (t = zs(), ul = 3) : t === Rs ? (t = zs(), ul = 4) : ul = t === Uo ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, ut = t, w === null && (yl = 1, on(
      l,
      ft(t, l.current)
    ));
  }
  function hr() {
    var l = E.H;
    return E.H = an, l === null ? an : l;
  }
  function vr() {
    var l = E.A;
    return E.A = nh, l;
  }
  function zi() {
    yl = 4, ue || (F & 4194048) !== F && dt.current !== null || (su = !0), (ae & 134217727) === 0 && (xe & 134217727) === 0 || sl === null || ie(
      sl,
      F,
      ht,
      !1
    );
  }
  function Mi(l, t, e) {
    var u = el;
    el |= 2;
    var a = hr(), n = vr();
    (sl !== l || F !== t) && (gn = null, hu(l, t)), t = !1;
    var c = yl;
    l: do
      try {
        if (ul !== 0 && w !== null) {
          var i = w, s = ut;
          switch (ul) {
            case 8:
              _i(), c = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              dt.current === null && (t = !0);
              var m = ul;
              if (ul = 0, ut = null, vu(l, i, s, m), e && su) {
                c = 0;
                break l;
              }
              break;
            default:
              m = ul, ul = 0, ut = null, vu(l, i, s, m);
          }
        }
        fh(), c = yl;
        break;
      } catch (p) {
        dr(l, p);
      }
    while (!0);
    return t && l.shellSuspendCounter++, Ht = Oe = null, el = u, E.H = a, E.A = n, w === null && (sl = null, F = 0, Ga()), c;
  }
  function fh() {
    for (; w !== null; ) yr(w);
  }
  function sh(l, t) {
    var e = el;
    el |= 2;
    var u = hr(), a = vr();
    sl !== l || F !== t ? (gn = null, mn = Tt() + 500, hu(l, t)) : su = Ru(
      l,
      t
    );
    l: do
      try {
        if (ul !== 0 && w !== null) {
          t = w;
          var n = ut;
          t: switch (ul) {
            case 1:
              ul = 0, ut = null, vu(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (Os(n)) {
                ul = 0, ut = null, mr(t);
                break;
              }
              t = function() {
                ul !== 2 && ul !== 9 || sl !== l || (ul = 7), Rt(l);
              }, n.then(t, t);
              break l;
            case 3:
              ul = 7;
              break l;
            case 4:
              ul = 5;
              break l;
            case 7:
              Os(n) ? (ul = 0, ut = null, mr(t)) : (ul = 0, ut = null, vu(l, t, n, 7));
              break;
            case 5:
              var c = null;
              switch (w.tag) {
                case 26:
                  c = w.memoizedState;
                case 5:
                case 27:
                  var i = w;
                  if (!c || Fr(c)) {
                    ul = 0, ut = null;
                    var s = i.sibling;
                    if (s !== null) w = s;
                    else {
                      var m = i.return;
                      m !== null ? (w = m, bn(m)) : w = null;
                    }
                    break t;
                  }
              }
              ul = 0, ut = null, vu(l, t, n, 5);
              break;
            case 6:
              ul = 0, ut = null, vu(l, t, n, 6);
              break;
            case 8:
              _i(), yl = 6;
              break l;
            default:
              throw Error(o(462));
          }
        }
        oh();
        break;
      } catch (p) {
        dr(l, p);
      }
    while (!0);
    return Ht = Oe = null, E.H = u, E.A = a, el = e, w !== null ? 0 : (sl = null, F = 0, Ga(), yl);
  }
  function oh() {
    for (; w !== null && !xd(); )
      yr(w);
  }
  function yr(l) {
    var t = Zo(l.alternate, l, Qt);
    l.memoizedProps = l.pendingProps, t === null ? bn(l) : w = t;
  }
  function mr(l) {
    var t = l, e = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = jo(
          e,
          t,
          t.pendingProps,
          t.type,
          void 0,
          F
        );
        break;
      case 11:
        t = jo(
          e,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          F
        );
        break;
      case 5:
        Lc(t);
      default:
        Lo(e, t), t = w = ms(t, Qt), t = Zo(e, t, Qt);
    }
    l.memoizedProps = l.pendingProps, t === null ? bn(l) : w = t;
  }
  function vu(l, t, e, u) {
    Ht = Oe = null, Lc(t), nu = null, Pu = 0;
    var a = t.return;
    try {
      if (P0(
        l,
        a,
        t,
        e,
        F
      )) {
        yl = 1, on(
          l,
          ft(e, l.current)
        ), w = null;
        return;
      }
    } catch (n) {
      if (a !== null) throw w = a, n;
      yl = 1, on(
        l,
        ft(e, l.current)
      ), w = null;
      return;
    }
    t.flags & 32768 ? (tl || u === 1 ? l = !0 : su || (F & 536870912) !== 0 ? l = !1 : (ue = l = !0, (u === 2 || u === 9 || u === 3 || u === 6) && (u = dt.current, u !== null && u.tag === 13 && (u.flags |= 16384))), gr(t, l)) : bn(t);
  }
  function bn(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        gr(
          t,
          ue
        );
        return;
      }
      l = t.return;
      var e = th(
        t.alternate,
        t,
        Qt
      );
      if (e !== null) {
        w = e;
        return;
      }
      if (t = t.sibling, t !== null) {
        w = t;
        return;
      }
      w = t = l;
    } while (t !== null);
    yl === 0 && (yl = 5);
  }
  function gr(l, t) {
    do {
      var e = eh(l.alternate, l);
      if (e !== null) {
        e.flags &= 32767, w = e;
        return;
      }
      if (e = l.return, e !== null && (e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null), !t && (l = l.sibling, l !== null)) {
        w = l;
        return;
      }
      w = l = e;
    } while (l !== null);
    yl = 6, w = null;
  }
  function Sr(l, t, e, u, a, n, c, i, s) {
    l.cancelPendingCommit = null;
    do
      Tn();
    while (Nl !== 0);
    if ((el & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === l.current) throw Error(o(177));
      if (n = t.lanes | t.childLanes, n |= bc, Zd(
        l,
        e,
        n,
        c,
        i,
        s
      ), l === sl && (w = sl = null, F = 0), ru = t, ce = l, du = e, Di = n, Ri = a, fr = u, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, vh(Da, function() {
        return Ar(), null;
      })) : (l.callbackNode = null, l.callbackPriority = 0), u = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || u) {
        u = E.T, E.T = null, a = U.p, U.p = 2, c = el, el |= 4;
        try {
          uh(l, t, e);
        } finally {
          el = c, U.p = a, E.T = u;
        }
      }
      Nl = 1, br(), Tr(), pr();
    }
  }
  function br() {
    if (Nl === 1) {
      Nl = 0;
      var l = ce, t = ru, e = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || e) {
        e = E.T, E.T = null;
        var u = U.p;
        U.p = 2;
        var a = el;
        el |= 4;
        try {
          tr(t, l);
          var n = Qi, c = cs(l.containerInfo), i = n.focusedElem, s = n.selectionRange;
          if (c !== i && i && i.ownerDocument && ns(
            i.ownerDocument.documentElement,
            i
          )) {
            if (s !== null && vc(i)) {
              var m = s.start, p = s.end;
              if (p === void 0 && (p = m), "selectionStart" in i)
                i.selectionStart = m, i.selectionEnd = Math.min(
                  p,
                  i.value.length
                );
              else {
                var D = i.ownerDocument || document, S = D && D.defaultView || window;
                if (S.getSelection) {
                  var b = S.getSelection(), Q = i.textContent.length, Y = Math.min(s.start, Q), cl = s.end === void 0 ? Y : Math.min(s.end, Q);
                  !b.extend && Y > cl && (c = cl, cl = Y, Y = c);
                  var v = as(
                    i,
                    Y
                  ), d = as(
                    i,
                    cl
                  );
                  if (v && d && (b.rangeCount !== 1 || b.anchorNode !== v.node || b.anchorOffset !== v.offset || b.focusNode !== d.node || b.focusOffset !== d.offset)) {
                    var y = D.createRange();
                    y.setStart(v.node, v.offset), b.removeAllRanges(), Y > cl ? (b.addRange(y), b.extend(d.node, d.offset)) : (y.setEnd(d.node, d.offset), b.addRange(y));
                  }
                }
              }
            }
            for (D = [], b = i; b = b.parentNode; )
              b.nodeType === 1 && D.push({
                element: b,
                left: b.scrollLeft,
                top: b.scrollTop
              });
            for (typeof i.focus == "function" && i.focus(), i = 0; i < D.length; i++) {
              var A = D[i];
              A.element.scrollLeft = A.left, A.element.scrollTop = A.top;
            }
          }
          xn = !!Xi, Qi = Xi = null;
        } finally {
          el = a, U.p = u, E.T = e;
        }
      }
      l.current = t, Nl = 2;
    }
  }
  function Tr() {
    if (Nl === 2) {
      Nl = 0;
      var l = ce, t = ru, e = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || e) {
        e = E.T, E.T = null;
        var u = U.p;
        U.p = 2;
        var a = el;
        el |= 4;
        try {
          Fo(l, t.alternate, t);
        } finally {
          el = a, U.p = u, E.T = e;
        }
      }
      Nl = 3;
    }
  }
  function pr() {
    if (Nl === 4 || Nl === 3) {
      Nl = 0, Hd();
      var l = ce, t = ru, e = du, u = fr;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Nl = 5 : (Nl = 0, ru = ce = null, Er(l, l.pendingLanes));
      var a = l.pendingLanes;
      if (a === 0 && (ne = null), wn(e), t = t.stateNode, Fl && typeof Fl.onCommitFiberRoot == "function")
        try {
          Fl.onCommitFiberRoot(
            Du,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        t = E.T, a = U.p, U.p = 2, E.T = null;
        try {
          for (var n = l.onRecoverableError, c = 0; c < u.length; c++) {
            var i = u[c];
            n(i.value, {
              componentStack: i.stack
            });
          }
        } finally {
          E.T = t, U.p = a;
        }
      }
      (du & 3) !== 0 && Tn(), Rt(l), a = l.pendingLanes, (e & 4194090) !== 0 && (a & 42) !== 0 ? l === Oi ? fa++ : (fa = 0, Oi = l) : fa = 0, sa(0);
    }
  }
  function Er(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, Zu(t)));
  }
  function Tn(l) {
    return br(), Tr(), pr(), Ar();
  }
  function Ar() {
    if (Nl !== 5) return !1;
    var l = ce, t = Di;
    Di = 0;
    var e = wn(du), u = E.T, a = U.p;
    try {
      U.p = 32 > e ? 32 : e, E.T = null, e = Ri, Ri = null;
      var n = ce, c = du;
      if (Nl = 0, ru = ce = null, du = 0, (el & 6) !== 0) throw Error(o(331));
      var i = el;
      if (el |= 4, cr(n.current), ur(
        n,
        n.current,
        c,
        e
      ), el = i, sa(0, !1), Fl && typeof Fl.onPostCommitFiberRoot == "function")
        try {
          Fl.onPostCommitFiberRoot(Du, n);
        } catch {
        }
      return !0;
    } finally {
      U.p = a, E.T = u, Er(l, t);
    }
  }
  function Dr(l, t, e) {
    t = ft(e, t), t = ai(l.stateNode, t, 2), l = Wt(l, t, 2), l !== null && (Ou(l, 2), Rt(l));
  }
  function fl(l, t, e) {
    if (l.tag === 3)
      Dr(l, l, e);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Dr(
            t,
            l,
            e
          );
          break;
        } else if (t.tag === 1) {
          var u = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (ne === null || !ne.has(u))) {
            l = ft(e, l), e = zo(2), u = Wt(t, e, 2), u !== null && (Mo(
              e,
              u,
              t,
              l
            ), Ou(u, 2), Rt(u));
            break;
          }
        }
        t = t.return;
      }
  }
  function Ui(l, t, e) {
    var u = l.pingCache;
    if (u === null) {
      u = l.pingCache = new ch();
      var a = /* @__PURE__ */ new Set();
      u.set(t, a);
    } else
      a = u.get(t), a === void 0 && (a = /* @__PURE__ */ new Set(), u.set(t, a));
    a.has(e) || (Ti = !0, a.add(e), l = rh.bind(null, l, t, e), t.then(l, l));
  }
  function rh(l, t, e) {
    var u = l.pingCache;
    u !== null && u.delete(t), l.pingedLanes |= l.suspendedLanes & e, l.warmLanes &= ~e, sl === l && (F & e) === e && (yl === 4 || yl === 3 && (F & 62914560) === F && 300 > Tt() - Ai ? (el & 2) === 0 && hu(l, 0) : pi |= e, ou === F && (ou = 0)), Rt(l);
  }
  function Rr(l, t) {
    t === 0 && (t = Tf()), l = ke(l, t), l !== null && (Ou(l, t), Rt(l));
  }
  function dh(l) {
    var t = l.memoizedState, e = 0;
    t !== null && (e = t.retryLane), Rr(l, e);
  }
  function hh(l, t) {
    var e = 0;
    switch (l.tag) {
      case 13:
        var u = l.stateNode, a = l.memoizedState;
        a !== null && (e = a.retryLane);
        break;
      case 19:
        u = l.stateNode;
        break;
      case 22:
        u = l.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    u !== null && u.delete(t), Rr(l, e);
  }
  function vh(l, t) {
    return Vn(l, t);
  }
  var pn = null, yu = null, Ni = !1, En = !1, xi = !1, He = 0;
  function Rt(l) {
    l !== yu && l.next === null && (yu === null ? pn = yu = l : yu = yu.next = l), En = !0, Ni || (Ni = !0, mh());
  }
  function sa(l, t) {
    if (!xi && En) {
      xi = !0;
      do
        for (var e = !1, u = pn; u !== null; ) {
          if (l !== 0) {
            var a = u.pendingLanes;
            if (a === 0) var n = 0;
            else {
              var c = u.suspendedLanes, i = u.pingedLanes;
              n = (1 << 31 - Il(42 | l) + 1) - 1, n &= a & ~(c & ~i), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (e = !0, Mr(u, n));
          } else
            n = F, n = _a(
              u,
              u === sl ? n : 0,
              u.cancelPendingCommit !== null || u.timeoutHandle !== -1
            ), (n & 3) === 0 || Ru(u, n) || (e = !0, Mr(u, n));
          u = u.next;
        }
      while (e);
      xi = !1;
    }
  }
  function yh() {
    Or();
  }
  function Or() {
    En = Ni = !1;
    var l = 0;
    He !== 0 && (Dh() && (l = He), He = 0);
    for (var t = Tt(), e = null, u = pn; u !== null; ) {
      var a = u.next, n = _r(u, t);
      n === 0 ? (u.next = null, e === null ? pn = a : e.next = a, a === null && (yu = e)) : (e = u, (l !== 0 || (n & 3) !== 0) && (En = !0)), u = a;
    }
    sa(l);
  }
  function _r(l, t) {
    for (var e = l.suspendedLanes, u = l.pingedLanes, a = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var c = 31 - Il(n), i = 1 << c, s = a[c];
      s === -1 ? ((i & e) === 0 || (i & u) !== 0) && (a[c] = Qd(i, t)) : s <= t && (l.expiredLanes |= i), n &= ~i;
    }
    if (t = sl, e = F, e = _a(
      l,
      l === t ? e : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), u = l.callbackNode, e === 0 || l === t && (ul === 2 || ul === 9) || l.cancelPendingCommit !== null)
      return u !== null && u !== null && Ln(u), l.callbackNode = null, l.callbackPriority = 0;
    if ((e & 3) === 0 || Ru(l, e)) {
      if (t = e & -e, t === l.callbackPriority) return t;
      switch (u !== null && Ln(u), wn(e)) {
        case 2:
        case 8:
          e = gf;
          break;
        case 32:
          e = Da;
          break;
        case 268435456:
          e = Sf;
          break;
        default:
          e = Da;
      }
      return u = zr.bind(null, l), e = Vn(e, u), l.callbackPriority = t, l.callbackNode = e, t;
    }
    return u !== null && u !== null && Ln(u), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function zr(l, t) {
    if (Nl !== 0 && Nl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var e = l.callbackNode;
    if (Tn() && l.callbackNode !== e)
      return null;
    var u = F;
    return u = _a(
      l,
      l === sl ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), u === 0 ? null : (or(l, u, t), _r(l, Tt()), l.callbackNode != null && l.callbackNode === e ? zr.bind(null, l) : null);
  }
  function Mr(l, t) {
    if (Tn()) return null;
    or(l, t, !0);
  }
  function mh() {
    Oh(function() {
      (el & 6) !== 0 ? Vn(
        mf,
        yh
      ) : Or();
    });
  }
  function Hi() {
    return He === 0 && (He = bf()), He;
  }
  function Ur(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : xa("" + l);
  }
  function Nr(l, t) {
    var e = t.ownerDocument.createElement("input");
    return e.name = t.name, e.value = t.value, l.id && e.setAttribute("form", l.id), t.parentNode.insertBefore(e, t), l = new FormData(l), e.parentNode.removeChild(e), l;
  }
  function gh(l, t, e, u, a) {
    if (t === "submit" && e && e.stateNode === a) {
      var n = Ur(
        (a[Ll] || null).action
      ), c = u.submitter;
      c && (t = (t = c[Ll] || null) ? Ur(t.formAction) : c.getAttribute("formAction"), t !== null && (n = t, c = null));
      var i = new ja(
        "action",
        "action",
        null,
        u,
        a
      );
      l.push({
        event: i,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (u.defaultPrevented) {
                if (He !== 0) {
                  var s = c ? Nr(a, c) : new FormData(a);
                  Pc(
                    e,
                    {
                      pending: !0,
                      data: s,
                      method: a.method,
                      action: n
                    },
                    null,
                    s
                  );
                }
              } else
                typeof n == "function" && (i.preventDefault(), s = c ? Nr(a, c) : new FormData(a), Pc(
                  e,
                  {
                    pending: !0,
                    data: s,
                    method: a.method,
                    action: n
                  },
                  n,
                  s
                ));
            },
            currentTarget: a
          }
        ]
      });
    }
  }
  for (var Ci = 0; Ci < Sc.length; Ci++) {
    var Bi = Sc[Ci], Sh = Bi.toLowerCase(), bh = Bi[0].toUpperCase() + Bi.slice(1);
    yt(
      Sh,
      "on" + bh
    );
  }
  yt(ss, "onAnimationEnd"), yt(os, "onAnimationIteration"), yt(rs, "onAnimationStart"), yt("dblclick", "onDoubleClick"), yt("focusin", "onFocus"), yt("focusout", "onBlur"), yt(j0, "onTransitionRun"), yt(q0, "onTransitionStart"), yt(Y0, "onTransitionCancel"), yt(ds, "onTransitionEnd"), Ge("onMouseEnter", ["mouseout", "mouseover"]), Ge("onMouseLeave", ["mouseout", "mouseover"]), Ge("onPointerEnter", ["pointerout", "pointerover"]), Ge("onPointerLeave", ["pointerout", "pointerover"]), ge(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), ge(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), ge("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), ge(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), ge(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), ge(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var oa = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Th = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(oa)
  );
  function xr(l, t) {
    t = (t & 4) !== 0;
    for (var e = 0; e < l.length; e++) {
      var u = l[e], a = u.event;
      u = u.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var c = u.length - 1; 0 <= c; c--) {
            var i = u[c], s = i.instance, m = i.currentTarget;
            if (i = i.listener, s !== n && a.isPropagationStopped())
              break l;
            n = i, a.currentTarget = m;
            try {
              n(a);
            } catch (p) {
              sn(p);
            }
            a.currentTarget = null, n = s;
          }
        else
          for (c = 0; c < u.length; c++) {
            if (i = u[c], s = i.instance, m = i.currentTarget, i = i.listener, s !== n && a.isPropagationStopped())
              break l;
            n = i, a.currentTarget = m;
            try {
              n(a);
            } catch (p) {
              sn(p);
            }
            a.currentTarget = null, n = s;
          }
      }
    }
  }
  function $(l, t) {
    var e = t[$n];
    e === void 0 && (e = t[$n] = /* @__PURE__ */ new Set());
    var u = l + "__bubble";
    e.has(u) || (Hr(t, l, 2, !1), e.add(u));
  }
  function ji(l, t, e) {
    var u = 0;
    t && (u |= 4), Hr(
      e,
      l,
      u,
      t
    );
  }
  var An = "_reactListening" + Math.random().toString(36).slice(2);
  function qi(l) {
    if (!l[An]) {
      l[An] = !0, Rf.forEach(function(e) {
        e !== "selectionchange" && (Th.has(e) || ji(e, !1, l), ji(e, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[An] || (t[An] = !0, ji("selectionchange", !1, t));
    }
  }
  function Hr(l, t, e, u) {
    switch (ud(t)) {
      case 2:
        var a = wh;
        break;
      case 8:
        a = $h;
        break;
      default:
        a = Fi;
    }
    e = a.bind(
      null,
      t,
      e,
      l
    ), a = void 0, !nc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (a = !0), u ? a !== void 0 ? l.addEventListener(t, e, {
      capture: !0,
      passive: a
    }) : l.addEventListener(t, e, !0) : a !== void 0 ? l.addEventListener(t, e, {
      passive: a
    }) : l.addEventListener(t, e, !1);
  }
  function Yi(l, t, e, u, a) {
    var n = u;
    if ((t & 1) === 0 && (t & 2) === 0 && u !== null)
      l: for (; ; ) {
        if (u === null) return;
        var c = u.tag;
        if (c === 3 || c === 4) {
          var i = u.stateNode.containerInfo;
          if (i === a) break;
          if (c === 4)
            for (c = u.return; c !== null; ) {
              var s = c.tag;
              if ((s === 3 || s === 4) && c.stateNode.containerInfo === a)
                return;
              c = c.return;
            }
          for (; i !== null; ) {
            if (c = je(i), c === null) return;
            if (s = c.tag, s === 5 || s === 6 || s === 26 || s === 27) {
              u = n = c;
              continue l;
            }
            i = i.parentNode;
          }
        }
        u = u.return;
      }
    Gf(function() {
      var m = n, p = uc(e), D = [];
      l: {
        var S = hs.get(l);
        if (S !== void 0) {
          var b = ja, Q = l;
          switch (l) {
            case "keypress":
              if (Ca(e) === 0) break l;
            case "keydown":
            case "keyup":
              b = v0;
              break;
            case "focusin":
              Q = "focus", b = sc;
              break;
            case "focusout":
              Q = "blur", b = sc;
              break;
            case "beforeblur":
            case "afterblur":
              b = sc;
              break;
            case "click":
              if (e.button === 2) break l;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              b = Zf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              b = e0;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              b = g0;
              break;
            case ss:
            case os:
            case rs:
              b = n0;
              break;
            case ds:
              b = b0;
              break;
            case "scroll":
            case "scrollend":
              b = l0;
              break;
            case "wheel":
              b = p0;
              break;
            case "copy":
            case "cut":
            case "paste":
              b = i0;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              b = Lf;
              break;
            case "toggle":
            case "beforetoggle":
              b = A0;
          }
          var Y = (t & 4) !== 0, cl = !Y && (l === "scroll" || l === "scrollend"), v = Y ? S !== null ? S + "Capture" : null : S;
          Y = [];
          for (var d = m, y; d !== null; ) {
            var A = d;
            if (y = A.stateNode, A = A.tag, A !== 5 && A !== 26 && A !== 27 || y === null || v === null || (A = Mu(d, v), A != null && Y.push(
              ra(d, A, y)
            )), cl) break;
            d = d.return;
          }
          0 < Y.length && (S = new b(
            S,
            Q,
            null,
            e,
            p
          ), D.push({ event: S, listeners: Y }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (S = l === "mouseover" || l === "pointerover", b = l === "mouseout" || l === "pointerout", S && e !== ec && (Q = e.relatedTarget || e.fromElement) && (je(Q) || Q[Be]))
            break l;
          if ((b || S) && (S = p.window === p ? p : (S = p.ownerDocument) ? S.defaultView || S.parentWindow : window, b ? (Q = e.relatedTarget || e.toElement, b = m, Q = Q ? je(Q) : null, Q !== null && (cl = N(Q), Y = Q.tag, Q !== cl || Y !== 5 && Y !== 27 && Y !== 6) && (Q = null)) : (b = null, Q = m), b !== Q)) {
            if (Y = Zf, A = "onMouseLeave", v = "onMouseEnter", d = "mouse", (l === "pointerout" || l === "pointerover") && (Y = Lf, A = "onPointerLeave", v = "onPointerEnter", d = "pointer"), cl = b == null ? S : zu(b), y = Q == null ? S : zu(Q), S = new Y(
              A,
              d + "leave",
              b,
              e,
              p
            ), S.target = cl, S.relatedTarget = y, A = null, je(p) === m && (Y = new Y(
              v,
              d + "enter",
              Q,
              e,
              p
            ), Y.target = y, Y.relatedTarget = cl, A = Y), cl = A, b && Q)
              t: {
                for (Y = b, v = Q, d = 0, y = Y; y; y = mu(y))
                  d++;
                for (y = 0, A = v; A; A = mu(A))
                  y++;
                for (; 0 < d - y; )
                  Y = mu(Y), d--;
                for (; 0 < y - d; )
                  v = mu(v), y--;
                for (; d--; ) {
                  if (Y === v || v !== null && Y === v.alternate)
                    break t;
                  Y = mu(Y), v = mu(v);
                }
                Y = null;
              }
            else Y = null;
            b !== null && Cr(
              D,
              S,
              b,
              Y,
              !1
            ), Q !== null && cl !== null && Cr(
              D,
              cl,
              Q,
              Y,
              !0
            );
          }
        }
        l: {
          if (S = m ? zu(m) : window, b = S.nodeName && S.nodeName.toLowerCase(), b === "select" || b === "input" && S.type === "file")
            var H = If;
          else if (Wf(S))
            if (Pf)
              H = H0;
            else {
              H = N0;
              var J = U0;
            }
          else
            b = S.nodeName, !b || b.toLowerCase() !== "input" || S.type !== "checkbox" && S.type !== "radio" ? m && tc(m.elementType) && (H = If) : H = x0;
          if (H && (H = H(l, m))) {
            Ff(
              D,
              H,
              e,
              p
            );
            break l;
          }
          J && J(l, S, m), l === "focusout" && m && S.type === "number" && m.memoizedProps.value != null && lc(S, "number", S.value);
        }
        switch (J = m ? zu(m) : window, l) {
          case "focusin":
            (Wf(J) || J.contentEditable === "true") && (Je = J, yc = m, qu = null);
            break;
          case "focusout":
            qu = yc = Je = null;
            break;
          case "mousedown":
            mc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            mc = !1, is(D, e, p);
            break;
          case "selectionchange":
            if (B0) break;
          case "keydown":
          case "keyup":
            is(D, e, p);
        }
        var j;
        if (rc)
          l: {
            switch (l) {
              case "compositionstart":
                var G = "onCompositionStart";
                break l;
              case "compositionend":
                G = "onCompositionEnd";
                break l;
              case "compositionupdate":
                G = "onCompositionUpdate";
                break l;
            }
            G = void 0;
          }
        else
          Ke ? $f(l, e) && (G = "onCompositionEnd") : l === "keydown" && e.keyCode === 229 && (G = "onCompositionStart");
        G && (Kf && e.locale !== "ko" && (Ke || G !== "onCompositionStart" ? G === "onCompositionEnd" && Ke && (j = Xf()) : (Jt = p, cc = "value" in Jt ? Jt.value : Jt.textContent, Ke = !0)), J = Dn(m, G), 0 < J.length && (G = new Vf(
          G,
          l,
          null,
          e,
          p
        ), D.push({ event: G, listeners: J }), j ? G.data = j : (j = kf(e), j !== null && (G.data = j)))), (j = R0 ? O0(l, e) : _0(l, e)) && (G = Dn(m, "onBeforeInput"), 0 < G.length && (J = new Vf(
          "onBeforeInput",
          "beforeinput",
          null,
          e,
          p
        ), D.push({
          event: J,
          listeners: G
        }), J.data = j)), gh(
          D,
          l,
          m,
          e,
          p
        );
      }
      xr(D, t);
    });
  }
  function ra(l, t, e) {
    return {
      instance: l,
      listener: t,
      currentTarget: e
    };
  }
  function Dn(l, t) {
    for (var e = t + "Capture", u = []; l !== null; ) {
      var a = l, n = a.stateNode;
      if (a = a.tag, a !== 5 && a !== 26 && a !== 27 || n === null || (a = Mu(l, e), a != null && u.unshift(
        ra(l, a, n)
      ), a = Mu(l, t), a != null && u.push(
        ra(l, a, n)
      )), l.tag === 3) return u;
      l = l.return;
    }
    return [];
  }
  function mu(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function Cr(l, t, e, u, a) {
    for (var n = t._reactName, c = []; e !== null && e !== u; ) {
      var i = e, s = i.alternate, m = i.stateNode;
      if (i = i.tag, s !== null && s === u) break;
      i !== 5 && i !== 26 && i !== 27 || m === null || (s = m, a ? (m = Mu(e, n), m != null && c.unshift(
        ra(e, m, s)
      )) : a || (m = Mu(e, n), m != null && c.push(
        ra(e, m, s)
      ))), e = e.return;
    }
    c.length !== 0 && l.push({ event: t, listeners: c });
  }
  var ph = /\r\n?/g, Eh = /\u0000|\uFFFD/g;
  function Br(l) {
    return (typeof l == "string" ? l : "" + l).replace(ph, `
`).replace(Eh, "");
  }
  function jr(l, t) {
    return t = Br(t), Br(l) === t;
  }
  function Rn() {
  }
  function nl(l, t, e, u, a, n) {
    switch (e) {
      case "children":
        typeof u == "string" ? t === "body" || t === "textarea" && u === "" || Ze(l, u) : (typeof u == "number" || typeof u == "bigint") && t !== "body" && Ze(l, "" + u);
        break;
      case "className":
        Ma(l, "class", u);
        break;
      case "tabIndex":
        Ma(l, "tabindex", u);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ma(l, e, u);
        break;
      case "style":
        qf(l, u, n);
        break;
      case "data":
        if (t !== "object") {
          Ma(l, "data", u);
          break;
        }
      case "src":
      case "href":
        if (u === "" && (t !== "a" || e !== "href")) {
          l.removeAttribute(e);
          break;
        }
        if (u == null || typeof u == "function" || typeof u == "symbol" || typeof u == "boolean") {
          l.removeAttribute(e);
          break;
        }
        u = xa("" + u), l.setAttribute(e, u);
        break;
      case "action":
      case "formAction":
        if (typeof u == "function") {
          l.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == "function" && (e === "formAction" ? (t !== "input" && nl(l, t, "name", a.name, a, null), nl(
            l,
            t,
            "formEncType",
            a.formEncType,
            a,
            null
          ), nl(
            l,
            t,
            "formMethod",
            a.formMethod,
            a,
            null
          ), nl(
            l,
            t,
            "formTarget",
            a.formTarget,
            a,
            null
          )) : (nl(l, t, "encType", a.encType, a, null), nl(l, t, "method", a.method, a, null), nl(l, t, "target", a.target, a, null)));
        if (u == null || typeof u == "symbol" || typeof u == "boolean") {
          l.removeAttribute(e);
          break;
        }
        u = xa("" + u), l.setAttribute(e, u);
        break;
      case "onClick":
        u != null && (l.onclick = Rn);
        break;
      case "onScroll":
        u != null && $("scroll", l);
        break;
      case "onScrollEnd":
        u != null && $("scrollend", l);
        break;
      case "dangerouslySetInnerHTML":
        if (u != null) {
          if (typeof u != "object" || !("__html" in u))
            throw Error(o(61));
          if (e = u.__html, e != null) {
            if (a.children != null) throw Error(o(60));
            l.innerHTML = e;
          }
        }
        break;
      case "multiple":
        l.multiple = u && typeof u != "function" && typeof u != "symbol";
        break;
      case "muted":
        l.muted = u && typeof u != "function" && typeof u != "symbol";
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
        if (u == null || typeof u == "function" || typeof u == "boolean" || typeof u == "symbol") {
          l.removeAttribute("xlink:href");
          break;
        }
        e = xa("" + u), l.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          e
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
        u != null && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(e, "" + u) : l.removeAttribute(e);
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
        u && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(e, "") : l.removeAttribute(e);
        break;
      case "capture":
      case "download":
        u === !0 ? l.setAttribute(e, "") : u !== !1 && u != null && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(e, u) : l.removeAttribute(e);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        u != null && typeof u != "function" && typeof u != "symbol" && !isNaN(u) && 1 <= u ? l.setAttribute(e, u) : l.removeAttribute(e);
        break;
      case "rowSpan":
      case "start":
        u == null || typeof u == "function" || typeof u == "symbol" || isNaN(u) ? l.removeAttribute(e) : l.setAttribute(e, u);
        break;
      case "popover":
        $("beforetoggle", l), $("toggle", l), za(l, "popover", u);
        break;
      case "xlinkActuate":
        zt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          u
        );
        break;
      case "xlinkArcrole":
        zt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          u
        );
        break;
      case "xlinkRole":
        zt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          u
        );
        break;
      case "xlinkShow":
        zt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          u
        );
        break;
      case "xlinkTitle":
        zt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          u
        );
        break;
      case "xlinkType":
        zt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          u
        );
        break;
      case "xmlBase":
        zt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          u
        );
        break;
      case "xmlLang":
        zt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          u
        );
        break;
      case "xmlSpace":
        zt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          u
        );
        break;
      case "is":
        za(l, "is", u);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N") && (e = Id.get(e) || e, za(l, e, u));
    }
  }
  function Gi(l, t, e, u, a, n) {
    switch (e) {
      case "style":
        qf(l, u, n);
        break;
      case "dangerouslySetInnerHTML":
        if (u != null) {
          if (typeof u != "object" || !("__html" in u))
            throw Error(o(61));
          if (e = u.__html, e != null) {
            if (a.children != null) throw Error(o(60));
            l.innerHTML = e;
          }
        }
        break;
      case "children":
        typeof u == "string" ? Ze(l, u) : (typeof u == "number" || typeof u == "bigint") && Ze(l, "" + u);
        break;
      case "onScroll":
        u != null && $("scroll", l);
        break;
      case "onScrollEnd":
        u != null && $("scrollend", l);
        break;
      case "onClick":
        u != null && (l.onclick = Rn);
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
        if (!Of.hasOwnProperty(e))
          l: {
            if (e[0] === "o" && e[1] === "n" && (a = e.endsWith("Capture"), t = e.slice(2, a ? e.length - 7 : void 0), n = l[Ll] || null, n = n != null ? n[e] : null, typeof n == "function" && l.removeEventListener(t, n, a), typeof u == "function")) {
              typeof n != "function" && n !== null && (e in l ? l[e] = null : l.hasAttribute(e) && l.removeAttribute(e)), l.addEventListener(t, u, a);
              break l;
            }
            e in l ? l[e] = u : u === !0 ? l.setAttribute(e, "") : za(l, e, u);
          }
    }
  }
  function xl(l, t, e) {
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
        $("error", l), $("load", l);
        var u = !1, a = !1, n;
        for (n in e)
          if (e.hasOwnProperty(n)) {
            var c = e[n];
            if (c != null)
              switch (n) {
                case "src":
                  u = !0;
                  break;
                case "srcSet":
                  a = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  nl(l, t, n, c, e, null);
              }
          }
        a && nl(l, t, "srcSet", e.srcSet, e, null), u && nl(l, t, "src", e.src, e, null);
        return;
      case "input":
        $("invalid", l);
        var i = n = c = a = null, s = null, m = null;
        for (u in e)
          if (e.hasOwnProperty(u)) {
            var p = e[u];
            if (p != null)
              switch (u) {
                case "name":
                  a = p;
                  break;
                case "type":
                  c = p;
                  break;
                case "checked":
                  s = p;
                  break;
                case "defaultChecked":
                  m = p;
                  break;
                case "value":
                  n = p;
                  break;
                case "defaultValue":
                  i = p;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (p != null)
                    throw Error(o(137, t));
                  break;
                default:
                  nl(l, t, u, p, e, null);
              }
          }
        Hf(
          l,
          n,
          i,
          s,
          m,
          c,
          a,
          !1
        ), Ua(l);
        return;
      case "select":
        $("invalid", l), u = c = n = null;
        for (a in e)
          if (e.hasOwnProperty(a) && (i = e[a], i != null))
            switch (a) {
              case "value":
                n = i;
                break;
              case "defaultValue":
                c = i;
                break;
              case "multiple":
                u = i;
              default:
                nl(l, t, a, i, e, null);
            }
        t = n, e = c, l.multiple = !!u, t != null ? Qe(l, !!u, t, !1) : e != null && Qe(l, !!u, e, !0);
        return;
      case "textarea":
        $("invalid", l), n = a = u = null;
        for (c in e)
          if (e.hasOwnProperty(c) && (i = e[c], i != null))
            switch (c) {
              case "value":
                u = i;
                break;
              case "defaultValue":
                a = i;
                break;
              case "children":
                n = i;
                break;
              case "dangerouslySetInnerHTML":
                if (i != null) throw Error(o(91));
                break;
              default:
                nl(l, t, c, i, e, null);
            }
        Bf(l, u, a, n), Ua(l);
        return;
      case "option":
        for (s in e)
          if (e.hasOwnProperty(s) && (u = e[s], u != null))
            switch (s) {
              case "selected":
                l.selected = u && typeof u != "function" && typeof u != "symbol";
                break;
              default:
                nl(l, t, s, u, e, null);
            }
        return;
      case "dialog":
        $("beforetoggle", l), $("toggle", l), $("cancel", l), $("close", l);
        break;
      case "iframe":
      case "object":
        $("load", l);
        break;
      case "video":
      case "audio":
        for (u = 0; u < oa.length; u++)
          $(oa[u], l);
        break;
      case "image":
        $("error", l), $("load", l);
        break;
      case "details":
        $("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        $("error", l), $("load", l);
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
        for (m in e)
          if (e.hasOwnProperty(m) && (u = e[m], u != null))
            switch (m) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                nl(l, t, m, u, e, null);
            }
        return;
      default:
        if (tc(t)) {
          for (p in e)
            e.hasOwnProperty(p) && (u = e[p], u !== void 0 && Gi(
              l,
              t,
              p,
              u,
              e,
              void 0
            ));
          return;
        }
    }
    for (i in e)
      e.hasOwnProperty(i) && (u = e[i], u != null && nl(l, t, i, u, e, null));
  }
  function Ah(l, t, e, u) {
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
        var a = null, n = null, c = null, i = null, s = null, m = null, p = null;
        for (b in e) {
          var D = e[b];
          if (e.hasOwnProperty(b) && D != null)
            switch (b) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                s = D;
              default:
                u.hasOwnProperty(b) || nl(l, t, b, null, u, D);
            }
        }
        for (var S in u) {
          var b = u[S];
          if (D = e[S], u.hasOwnProperty(S) && (b != null || D != null))
            switch (S) {
              case "type":
                n = b;
                break;
              case "name":
                a = b;
                break;
              case "checked":
                m = b;
                break;
              case "defaultChecked":
                p = b;
                break;
              case "value":
                c = b;
                break;
              case "defaultValue":
                i = b;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (b != null)
                  throw Error(o(137, t));
                break;
              default:
                b !== D && nl(
                  l,
                  t,
                  S,
                  b,
                  u,
                  D
                );
            }
        }
        Pn(
          l,
          c,
          i,
          s,
          m,
          p,
          n,
          a
        );
        return;
      case "select":
        b = c = i = S = null;
        for (n in e)
          if (s = e[n], e.hasOwnProperty(n) && s != null)
            switch (n) {
              case "value":
                break;
              case "multiple":
                b = s;
              default:
                u.hasOwnProperty(n) || nl(
                  l,
                  t,
                  n,
                  null,
                  u,
                  s
                );
            }
        for (a in u)
          if (n = u[a], s = e[a], u.hasOwnProperty(a) && (n != null || s != null))
            switch (a) {
              case "value":
                S = n;
                break;
              case "defaultValue":
                i = n;
                break;
              case "multiple":
                c = n;
              default:
                n !== s && nl(
                  l,
                  t,
                  a,
                  n,
                  u,
                  s
                );
            }
        t = i, e = c, u = b, S != null ? Qe(l, !!e, S, !1) : !!u != !!e && (t != null ? Qe(l, !!e, t, !0) : Qe(l, !!e, e ? [] : "", !1));
        return;
      case "textarea":
        b = S = null;
        for (i in e)
          if (a = e[i], e.hasOwnProperty(i) && a != null && !u.hasOwnProperty(i))
            switch (i) {
              case "value":
                break;
              case "children":
                break;
              default:
                nl(l, t, i, null, u, a);
            }
        for (c in u)
          if (a = u[c], n = e[c], u.hasOwnProperty(c) && (a != null || n != null))
            switch (c) {
              case "value":
                S = a;
                break;
              case "defaultValue":
                b = a;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (a != null) throw Error(o(91));
                break;
              default:
                a !== n && nl(l, t, c, a, u, n);
            }
        Cf(l, S, b);
        return;
      case "option":
        for (var Q in e)
          if (S = e[Q], e.hasOwnProperty(Q) && S != null && !u.hasOwnProperty(Q))
            switch (Q) {
              case "selected":
                l.selected = !1;
                break;
              default:
                nl(
                  l,
                  t,
                  Q,
                  null,
                  u,
                  S
                );
            }
        for (s in u)
          if (S = u[s], b = e[s], u.hasOwnProperty(s) && S !== b && (S != null || b != null))
            switch (s) {
              case "selected":
                l.selected = S && typeof S != "function" && typeof S != "symbol";
                break;
              default:
                nl(
                  l,
                  t,
                  s,
                  S,
                  u,
                  b
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
        for (var Y in e)
          S = e[Y], e.hasOwnProperty(Y) && S != null && !u.hasOwnProperty(Y) && nl(l, t, Y, null, u, S);
        for (m in u)
          if (S = u[m], b = e[m], u.hasOwnProperty(m) && S !== b && (S != null || b != null))
            switch (m) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (S != null)
                  throw Error(o(137, t));
                break;
              default:
                nl(
                  l,
                  t,
                  m,
                  S,
                  u,
                  b
                );
            }
        return;
      default:
        if (tc(t)) {
          for (var cl in e)
            S = e[cl], e.hasOwnProperty(cl) && S !== void 0 && !u.hasOwnProperty(cl) && Gi(
              l,
              t,
              cl,
              void 0,
              u,
              S
            );
          for (p in u)
            S = u[p], b = e[p], !u.hasOwnProperty(p) || S === b || S === void 0 && b === void 0 || Gi(
              l,
              t,
              p,
              S,
              u,
              b
            );
          return;
        }
    }
    for (var v in e)
      S = e[v], e.hasOwnProperty(v) && S != null && !u.hasOwnProperty(v) && nl(l, t, v, null, u, S);
    for (D in u)
      S = u[D], b = e[D], !u.hasOwnProperty(D) || S === b || S == null && b == null || nl(l, t, D, S, u, b);
  }
  var Xi = null, Qi = null;
  function On(l) {
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
  function Zi(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Vi = null;
  function Dh() {
    var l = window.event;
    return l && l.type === "popstate" ? l === Vi ? !1 : (Vi = l, !0) : (Vi = null, !1);
  }
  var Gr = typeof setTimeout == "function" ? setTimeout : void 0, Rh = typeof clearTimeout == "function" ? clearTimeout : void 0, Xr = typeof Promise == "function" ? Promise : void 0, Oh = typeof queueMicrotask == "function" ? queueMicrotask : typeof Xr < "u" ? function(l) {
    return Xr.resolve(null).then(l).catch(_h);
  } : Gr;
  function _h(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function fe(l) {
    return l === "head";
  }
  function Qr(l, t) {
    var e = t, u = 0, a = 0;
    do {
      var n = e.nextSibling;
      if (l.removeChild(e), n && n.nodeType === 8)
        if (e = n.data, e === "/$") {
          if (0 < u && 8 > u) {
            e = u;
            var c = l.ownerDocument;
            if (e & 1 && da(c.documentElement), e & 2 && da(c.body), e & 4)
              for (e = c.head, da(e), c = e.firstChild; c; ) {
                var i = c.nextSibling, s = c.nodeName;
                c[_u] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && c.rel.toLowerCase() === "stylesheet" || e.removeChild(c), c = i;
              }
          }
          if (a === 0) {
            l.removeChild(n), Ta(t);
            return;
          }
          a--;
        } else
          e === "$" || e === "$?" || e === "$!" ? a++ : u = e.charCodeAt(0) - 48;
      else u = 0;
      e = n;
    } while (e);
    Ta(t);
  }
  function Li(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var e = t;
      switch (t = t.nextSibling, e.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Li(e), kn(e);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (e.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(e);
    }
  }
  function zh(l, t, e, u) {
    for (; l.nodeType === 1; ) {
      var a = e;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!u && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (u) {
        if (!l[_u])
          switch (t) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (n = l.getAttribute("rel"), n === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (n !== a.rel || l.getAttribute("href") !== (a.href == null || a.href === "" ? null : a.href) || l.getAttribute("crossorigin") !== (a.crossOrigin == null ? null : a.crossOrigin) || l.getAttribute("title") !== (a.title == null ? null : a.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (n = l.getAttribute("src"), (n !== (a.src == null ? null : a.src) || l.getAttribute("type") !== (a.type == null ? null : a.type) || l.getAttribute("crossorigin") !== (a.crossOrigin == null ? null : a.crossOrigin)) && n && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (t === "input" && l.type === "hidden") {
        var n = a.name == null ? null : "" + a.name;
        if (a.type === "hidden" && l.getAttribute("name") === n)
          return l;
      } else return l;
      if (l = gt(l.nextSibling), l === null) break;
    }
    return null;
  }
  function Mh(l, t, e) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !e || (l = gt(l.nextSibling), l === null)) return null;
    return l;
  }
  function Ki(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState === "complete";
  }
  function Uh(l, t) {
    var e = l.ownerDocument;
    if (l.data !== "$?" || e.readyState === "complete")
      t();
    else {
      var u = function() {
        t(), e.removeEventListener("DOMContentLoaded", u);
      };
      e.addEventListener("DOMContentLoaded", u), l._reactRetry = u;
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
  var Ji = null;
  function Zr(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "$" || e === "$!" || e === "$?") {
          if (t === 0) return l;
          t--;
        } else e === "/$" && t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function Vr(l, t, e) {
    switch (t = On(e), l) {
      case "html":
        if (l = t.documentElement, !l) throw Error(o(452));
        return l;
      case "head":
        if (l = t.head, !l) throw Error(o(453));
        return l;
      case "body":
        if (l = t.body, !l) throw Error(o(454));
        return l;
      default:
        throw Error(o(451));
    }
  }
  function da(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    kn(l);
  }
  var vt = /* @__PURE__ */ new Map(), Lr = /* @__PURE__ */ new Set();
  function _n(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  }
  var Zt = U.d;
  U.d = {
    f: Nh,
    r: xh,
    D: Hh,
    C: Ch,
    L: Bh,
    m: jh,
    X: Yh,
    S: qh,
    M: Gh
  };
  function Nh() {
    var l = Zt.f(), t = Sn();
    return l || t;
  }
  function xh(l) {
    var t = qe(l);
    t !== null && t.tag === 5 && t.type === "form" ? so(t) : Zt.r(l);
  }
  var gu = typeof document > "u" ? null : document;
  function Kr(l, t, e) {
    var u = gu;
    if (u && typeof t == "string" && t) {
      var a = it(t);
      a = 'link[rel="' + l + '"][href="' + a + '"]', typeof e == "string" && (a += '[crossorigin="' + e + '"]'), Lr.has(a) || (Lr.add(a), l = { rel: l, crossOrigin: e, href: t }, u.querySelector(a) === null && (t = u.createElement("link"), xl(t, "link", l), Al(t), u.head.appendChild(t)));
    }
  }
  function Hh(l) {
    Zt.D(l), Kr("dns-prefetch", l, null);
  }
  function Ch(l, t) {
    Zt.C(l, t), Kr("preconnect", l, t);
  }
  function Bh(l, t, e) {
    Zt.L(l, t, e);
    var u = gu;
    if (u && l && t) {
      var a = 'link[rel="preload"][as="' + it(t) + '"]';
      t === "image" && e && e.imageSrcSet ? (a += '[imagesrcset="' + it(
        e.imageSrcSet
      ) + '"]', typeof e.imageSizes == "string" && (a += '[imagesizes="' + it(
        e.imageSizes
      ) + '"]')) : a += '[href="' + it(l) + '"]';
      var n = a;
      switch (t) {
        case "style":
          n = Su(l);
          break;
        case "script":
          n = bu(l);
      }
      vt.has(n) || (l = B(
        {
          rel: "preload",
          href: t === "image" && e && e.imageSrcSet ? void 0 : l,
          as: t
        },
        e
      ), vt.set(n, l), u.querySelector(a) !== null || t === "style" && u.querySelector(ha(n)) || t === "script" && u.querySelector(va(n)) || (t = u.createElement("link"), xl(t, "link", l), Al(t), u.head.appendChild(t)));
    }
  }
  function jh(l, t) {
    Zt.m(l, t);
    var e = gu;
    if (e && l) {
      var u = t && typeof t.as == "string" ? t.as : "script", a = 'link[rel="modulepreload"][as="' + it(u) + '"][href="' + it(l) + '"]', n = a;
      switch (u) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = bu(l);
      }
      if (!vt.has(n) && (l = B({ rel: "modulepreload", href: l }, t), vt.set(n, l), e.querySelector(a) === null)) {
        switch (u) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(va(n)))
              return;
        }
        u = e.createElement("link"), xl(u, "link", l), Al(u), e.head.appendChild(u);
      }
    }
  }
  function qh(l, t, e) {
    Zt.S(l, t, e);
    var u = gu;
    if (u && l) {
      var a = Ye(u).hoistableStyles, n = Su(l);
      t = t || "default";
      var c = a.get(n);
      if (!c) {
        var i = { loading: 0, preload: null };
        if (c = u.querySelector(
          ha(n)
        ))
          i.loading = 5;
        else {
          l = B(
            { rel: "stylesheet", href: l, "data-precedence": t },
            e
          ), (e = vt.get(n)) && wi(l, e);
          var s = c = u.createElement("link");
          Al(s), xl(s, "link", l), s._p = new Promise(function(m, p) {
            s.onload = m, s.onerror = p;
          }), s.addEventListener("load", function() {
            i.loading |= 1;
          }), s.addEventListener("error", function() {
            i.loading |= 2;
          }), i.loading |= 4, zn(c, t, u);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: i
        }, a.set(n, c);
      }
    }
  }
  function Yh(l, t) {
    Zt.X(l, t);
    var e = gu;
    if (e && l) {
      var u = Ye(e).hoistableScripts, a = bu(l), n = u.get(a);
      n || (n = e.querySelector(va(a)), n || (l = B({ src: l, async: !0 }, t), (t = vt.get(a)) && $i(l, t), n = e.createElement("script"), Al(n), xl(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, u.set(a, n));
    }
  }
  function Gh(l, t) {
    Zt.M(l, t);
    var e = gu;
    if (e && l) {
      var u = Ye(e).hoistableScripts, a = bu(l), n = u.get(a);
      n || (n = e.querySelector(va(a)), n || (l = B({ src: l, async: !0, type: "module" }, t), (t = vt.get(a)) && $i(l, t), n = e.createElement("script"), Al(n), xl(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, u.set(a, n));
    }
  }
  function Jr(l, t, e, u) {
    var a = (a = V.current) ? _n(a) : null;
    if (!a) throw Error(o(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string" ? (t = Su(e.href), e = Ye(
          a
        ).hoistableStyles, u = e.get(t), u || (u = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, e.set(t, u)), u) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (e.rel === "stylesheet" && typeof e.href == "string" && typeof e.precedence == "string") {
          l = Su(e.href);
          var n = Ye(
            a
          ).hoistableStyles, c = n.get(l);
          if (c || (a = a.ownerDocument || a, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, n.set(l, c), (n = a.querySelector(
            ha(l)
          )) && !n._p && (c.instance = n, c.state.loading = 5), vt.has(l) || (e = {
            rel: "preload",
            as: "style",
            href: e.href,
            crossOrigin: e.crossOrigin,
            integrity: e.integrity,
            media: e.media,
            hrefLang: e.hrefLang,
            referrerPolicy: e.referrerPolicy
          }, vt.set(l, e), n || Xh(
            a,
            l,
            e,
            c.state
          ))), t && u === null)
            throw Error(o(528, ""));
          return c;
        }
        if (t && u !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = e.async, e = e.src, typeof e == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = bu(e), e = Ye(
          a
        ).hoistableScripts, u = e.get(t), u || (u = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, e.set(t, u)), u) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, l));
    }
  }
  function Su(l) {
    return 'href="' + it(l) + '"';
  }
  function ha(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function wr(l) {
    return B({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function Xh(l, t, e, u) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]") ? u.loading = 1 : (t = l.createElement("link"), u.preload = t, t.addEventListener("load", function() {
      return u.loading |= 1;
    }), t.addEventListener("error", function() {
      return u.loading |= 2;
    }), xl(t, "link", e), Al(t), l.head.appendChild(t));
  }
  function bu(l) {
    return '[src="' + it(l) + '"]';
  }
  function va(l) {
    return "script[async]" + l;
  }
  function $r(l, t, e) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var u = l.querySelector(
            'style[data-href~="' + it(e.href) + '"]'
          );
          if (u)
            return t.instance = u, Al(u), u;
          var a = B({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null
          });
          return u = (l.ownerDocument || l).createElement(
            "style"
          ), Al(u), xl(u, "style", a), zn(u, e.precedence, l), t.instance = u;
        case "stylesheet":
          a = Su(e.href);
          var n = l.querySelector(
            ha(a)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, Al(n), n;
          u = wr(e), (a = vt.get(a)) && wi(u, a), n = (l.ownerDocument || l).createElement("link"), Al(n);
          var c = n;
          return c._p = new Promise(function(i, s) {
            c.onload = i, c.onerror = s;
          }), xl(n, "link", u), t.state.loading |= 4, zn(n, e.precedence, l), t.instance = n;
        case "script":
          return n = bu(e.src), (a = l.querySelector(
            va(n)
          )) ? (t.instance = a, Al(a), a) : (u = e, (a = vt.get(n)) && (u = B({}, e), $i(u, a)), l = l.ownerDocument || l, a = l.createElement("script"), Al(a), xl(a, "link", u), l.head.appendChild(a), t.instance = a);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (u = t.instance, t.state.loading |= 4, zn(u, e.precedence, l));
    return t.instance;
  }
  function zn(l, t, e) {
    for (var u = e.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), a = u.length ? u[u.length - 1] : null, n = a, c = 0; c < u.length; c++) {
      var i = u[c];
      if (i.dataset.precedence === t) n = i;
      else if (n !== a) break;
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = e.nodeType === 9 ? e.head : e, t.insertBefore(l, t.firstChild));
  }
  function wi(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function $i(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var Mn = null;
  function kr(l, t, e) {
    if (Mn === null) {
      var u = /* @__PURE__ */ new Map(), a = Mn = /* @__PURE__ */ new Map();
      a.set(e, u);
    } else
      a = Mn, u = a.get(e), u || (u = /* @__PURE__ */ new Map(), a.set(e, u));
    if (u.has(l)) return u;
    for (u.set(l, null), e = e.getElementsByTagName(l), a = 0; a < e.length; a++) {
      var n = e[a];
      if (!(n[_u] || n[ql] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = n.getAttribute(t) || "";
        c = l + c;
        var i = u.get(c);
        i ? i.push(n) : u.set(c, [n]);
      }
    }
    return u;
  }
  function Wr(l, t, e) {
    l = l.ownerDocument || l, l.head.insertBefore(
      e,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function Qh(l, t, e) {
    if (e === 1 || t.itemProp != null) return !1;
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
  var ya = null;
  function Zh() {
  }
  function Vh(l, t, e) {
    if (ya === null) throw Error(o(475));
    var u = ya;
    if (t.type === "stylesheet" && (typeof e.media != "string" || matchMedia(e.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var a = Su(e.href), n = l.querySelector(
          ha(a)
        );
        if (n) {
          l = n._p, l !== null && typeof l == "object" && typeof l.then == "function" && (u.count++, u = Un.bind(u), l.then(u, u)), t.state.loading |= 4, t.instance = n, Al(n);
          return;
        }
        n = l.ownerDocument || l, e = wr(e), (a = vt.get(a)) && wi(e, a), n = n.createElement("link"), Al(n);
        var c = n;
        c._p = new Promise(function(i, s) {
          c.onload = i, c.onerror = s;
        }), xl(n, "link", e), t.instance = n;
      }
      u.stylesheets === null && (u.stylesheets = /* @__PURE__ */ new Map()), u.stylesheets.set(t, l), (l = t.state.preload) && (t.state.loading & 3) === 0 && (u.count++, t = Un.bind(u), l.addEventListener("load", t), l.addEventListener("error", t));
    }
  }
  function Lh() {
    if (ya === null) throw Error(o(475));
    var l = ya;
    return l.stylesheets && l.count === 0 && ki(l, l.stylesheets), 0 < l.count ? function(t) {
      var e = setTimeout(function() {
        if (l.stylesheets && ki(l, l.stylesheets), l.unsuspend) {
          var u = l.unsuspend;
          l.unsuspend = null, u();
        }
      }, 6e4);
      return l.unsuspend = t, function() {
        l.unsuspend = null, clearTimeout(e);
      };
    } : null;
  }
  function Un() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) ki(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        this.unsuspend = null, l();
      }
    }
  }
  var Nn = null;
  function ki(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Nn = /* @__PURE__ */ new Map(), t.forEach(Kh, l), Nn = null, Un.call(l));
  }
  function Kh(l, t) {
    if (!(t.state.loading & 4)) {
      var e = Nn.get(l);
      if (e) var u = e.get(null);
      else {
        e = /* @__PURE__ */ new Map(), Nn.set(l, e);
        for (var a = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), n = 0; n < a.length; n++) {
          var c = a[n];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (e.set(c.dataset.precedence, c), u = c);
        }
        u && e.set(null, u);
      }
      a = t.instance, c = a.getAttribute("data-precedence"), n = e.get(c) || u, n === u && e.set(null, a), e.set(c, a), this.count++, u = Un.bind(this), a.addEventListener("load", u), a.addEventListener("error", u), n ? n.parentNode.insertBefore(a, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(a, l.firstChild)), t.state.loading |= 4;
    }
  }
  var ma = {
    $$typeof: Sl,
    Provider: null,
    Consumer: null,
    _currentValue: X,
    _currentValue2: X,
    _threadCount: 0
  };
  function Jh(l, t, e, u, a, n, c, i) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Kn(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Kn(0), this.hiddenUpdates = Kn(null), this.identifierPrefix = u, this.onUncaughtError = a, this.onCaughtError = n, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = i, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Ir(l, t, e, u, a, n, c, i, s, m, p, D) {
    return l = new Jh(
      l,
      t,
      e,
      c,
      i,
      s,
      m,
      D
    ), t = 1, n === !0 && (t |= 24), n = lt(3, null, null, t), l.current = n, n.stateNode = l, t = Uc(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: u,
      isDehydrated: e,
      cache: t
    }, Cc(n), l;
  }
  function Pr(l) {
    return l ? (l = We, l) : We;
  }
  function ld(l, t, e, u, a, n) {
    a = Pr(a), u.context === null ? u.context = a : u.pendingContext = a, u = kt(t), u.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (u.callback = n), e = Wt(l, u, t), e !== null && (nt(e, l, t), Ju(e, l, t));
  }
  function td(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var e = l.retryLane;
      l.retryLane = e !== 0 && e < t ? e : t;
    }
  }
  function Wi(l, t) {
    td(l, t), (l = l.alternate) && td(l, t);
  }
  function ed(l) {
    if (l.tag === 13) {
      var t = ke(l, 67108864);
      t !== null && nt(t, l, 67108864), Wi(l, 67108864);
    }
  }
  var xn = !0;
  function wh(l, t, e, u) {
    var a = E.T;
    E.T = null;
    var n = U.p;
    try {
      U.p = 2, Fi(l, t, e, u);
    } finally {
      U.p = n, E.T = a;
    }
  }
  function $h(l, t, e, u) {
    var a = E.T;
    E.T = null;
    var n = U.p;
    try {
      U.p = 8, Fi(l, t, e, u);
    } finally {
      U.p = n, E.T = a;
    }
  }
  function Fi(l, t, e, u) {
    if (xn) {
      var a = Ii(u);
      if (a === null)
        Yi(
          l,
          t,
          u,
          Hn,
          e
        ), ad(l, u);
      else if (Wh(
        a,
        l,
        t,
        e,
        u
      ))
        u.stopPropagation();
      else if (ad(l, u), t & 4 && -1 < kh.indexOf(l)) {
        for (; a !== null; ) {
          var n = qe(a);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var c = me(n.pendingLanes);
                  if (c !== 0) {
                    var i = n;
                    for (i.pendingLanes |= 2, i.entangledLanes |= 2; c; ) {
                      var s = 1 << 31 - Il(c);
                      i.entanglements[1] |= s, c &= ~s;
                    }
                    Rt(n), (el & 6) === 0 && (mn = Tt() + 500, sa(0));
                  }
                }
                break;
              case 13:
                i = ke(n, 2), i !== null && nt(i, n, 2), Sn(), Wi(n, 2);
            }
          if (n = Ii(u), n === null && Yi(
            l,
            t,
            u,
            Hn,
            e
          ), n === a) break;
          a = n;
        }
        a !== null && u.stopPropagation();
      } else
        Yi(
          l,
          t,
          u,
          null,
          e
        );
    }
  }
  function Ii(l) {
    return l = uc(l), Pi(l);
  }
  var Hn = null;
  function Pi(l) {
    if (Hn = null, l = je(l), l !== null) {
      var t = N(l);
      if (t === null) l = null;
      else {
        var e = t.tag;
        if (e === 13) {
          if (l = C(t), l !== null) return l;
          l = null;
        } else if (e === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return Hn = l, null;
  }
  function ud(l) {
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
        switch (Cd()) {
          case mf:
            return 2;
          case gf:
            return 8;
          case Da:
          case Bd:
            return 32;
          case Sf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var lf = !1, se = null, oe = null, re = null, ga = /* @__PURE__ */ new Map(), Sa = /* @__PURE__ */ new Map(), de = [], kh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function ad(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        se = null;
        break;
      case "dragenter":
      case "dragleave":
        oe = null;
        break;
      case "mouseover":
      case "mouseout":
        re = null;
        break;
      case "pointerover":
      case "pointerout":
        ga.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Sa.delete(t.pointerId);
    }
  }
  function ba(l, t, e, u, a, n) {
    return l === null || l.nativeEvent !== n ? (l = {
      blockedOn: t,
      domEventName: e,
      eventSystemFlags: u,
      nativeEvent: n,
      targetContainers: [a]
    }, t !== null && (t = qe(t), t !== null && ed(t)), l) : (l.eventSystemFlags |= u, t = l.targetContainers, a !== null && t.indexOf(a) === -1 && t.push(a), l);
  }
  function Wh(l, t, e, u, a) {
    switch (t) {
      case "focusin":
        return se = ba(
          se,
          l,
          t,
          e,
          u,
          a
        ), !0;
      case "dragenter":
        return oe = ba(
          oe,
          l,
          t,
          e,
          u,
          a
        ), !0;
      case "mouseover":
        return re = ba(
          re,
          l,
          t,
          e,
          u,
          a
        ), !0;
      case "pointerover":
        var n = a.pointerId;
        return ga.set(
          n,
          ba(
            ga.get(n) || null,
            l,
            t,
            e,
            u,
            a
          )
        ), !0;
      case "gotpointercapture":
        return n = a.pointerId, Sa.set(
          n,
          ba(
            Sa.get(n) || null,
            l,
            t,
            e,
            u,
            a
          )
        ), !0;
    }
    return !1;
  }
  function nd(l) {
    var t = je(l.target);
    if (t !== null) {
      var e = N(t);
      if (e !== null) {
        if (t = e.tag, t === 13) {
          if (t = C(e), t !== null) {
            l.blockedOn = t, Vd(l.priority, function() {
              if (e.tag === 13) {
                var u = at();
                u = Jn(u);
                var a = ke(e, u);
                a !== null && nt(a, e, u), Wi(e, u);
              }
            });
            return;
          }
        } else if (t === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function Cn(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var e = Ii(l.nativeEvent);
      if (e === null) {
        e = l.nativeEvent;
        var u = new e.constructor(
          e.type,
          e
        );
        ec = u, e.target.dispatchEvent(u), ec = null;
      } else
        return t = qe(e), t !== null && ed(t), l.blockedOn = e, !1;
      t.shift();
    }
    return !0;
  }
  function cd(l, t, e) {
    Cn(l) && e.delete(t);
  }
  function Fh() {
    lf = !1, se !== null && Cn(se) && (se = null), oe !== null && Cn(oe) && (oe = null), re !== null && Cn(re) && (re = null), ga.forEach(cd), Sa.forEach(cd);
  }
  function Bn(l, t) {
    l.blockedOn === t && (l.blockedOn = null, lf || (lf = !0, f.unstable_scheduleCallback(
      f.unstable_NormalPriority,
      Fh
    )));
  }
  var jn = null;
  function id(l) {
    jn !== l && (jn = l, f.unstable_scheduleCallback(
      f.unstable_NormalPriority,
      function() {
        jn === l && (jn = null);
        for (var t = 0; t < l.length; t += 3) {
          var e = l[t], u = l[t + 1], a = l[t + 2];
          if (typeof u != "function") {
            if (Pi(u || e) === null)
              continue;
            break;
          }
          var n = qe(e);
          n !== null && (l.splice(t, 3), t -= 3, Pc(
            n,
            {
              pending: !0,
              data: a,
              method: e.method,
              action: u
            },
            u,
            a
          ));
        }
      }
    ));
  }
  function Ta(l) {
    function t(s) {
      return Bn(s, l);
    }
    se !== null && Bn(se, l), oe !== null && Bn(oe, l), re !== null && Bn(re, l), ga.forEach(t), Sa.forEach(t);
    for (var e = 0; e < de.length; e++) {
      var u = de[e];
      u.blockedOn === l && (u.blockedOn = null);
    }
    for (; 0 < de.length && (e = de[0], e.blockedOn === null); )
      nd(e), e.blockedOn === null && de.shift();
    if (e = (l.ownerDocument || l).$$reactFormReplay, e != null)
      for (u = 0; u < e.length; u += 3) {
        var a = e[u], n = e[u + 1], c = a[Ll] || null;
        if (typeof n == "function")
          c || id(e);
        else if (c) {
          var i = null;
          if (n && n.hasAttribute("formAction")) {
            if (a = n, c = n[Ll] || null)
              i = c.formAction;
            else if (Pi(a) !== null) continue;
          } else i = c.action;
          typeof i == "function" ? e[u + 1] = i : (e.splice(u, 3), u -= 3), id(e);
        }
      }
  }
  function tf(l) {
    this._internalRoot = l;
  }
  qn.prototype.render = tf.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var e = t.current, u = at();
    ld(e, u, l, t, null, null);
  }, qn.prototype.unmount = tf.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      ld(l.current, 2, null, l, null, null), Sn(), t[Be] = null;
    }
  };
  function qn(l) {
    this._internalRoot = l;
  }
  qn.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = Af();
      l = { blockedOn: null, target: l, priority: t };
      for (var e = 0; e < de.length && t !== 0 && t < de[e].priority; e++) ;
      de.splice(e, 0, l), e === 0 && nd(l);
    }
  };
  var fd = g.version;
  if (fd !== "19.1.0")
    throw Error(
      o(
        527,
        fd,
        "19.1.0"
      )
    );
  U.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(o(188)) : (l = Object.keys(l).join(","), Error(o(268, l)));
    return l = _(t), l = l !== null ? T(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var Ih = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: E,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Yn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Yn.isDisabled && Yn.supportsFiber)
      try {
        Du = Yn.inject(
          Ih
        ), Fl = Yn;
      } catch {
      }
  }
  return Ea.createRoot = function(l, t) {
    if (!z(l)) throw Error(o(299));
    var e = !1, u = "", a = Do, n = Ro, c = Oo, i = null;
    return t != null && (t.unstable_strictMode === !0 && (e = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onUncaughtError !== void 0 && (a = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (i = t.unstable_transitionCallbacks)), t = Ir(
      l,
      1,
      !1,
      null,
      null,
      e,
      u,
      a,
      n,
      c,
      i,
      null
    ), l[Be] = t.current, qi(l), new tf(t);
  }, Ea.hydrateRoot = function(l, t, e) {
    if (!z(l)) throw Error(o(299));
    var u = !1, a = "", n = Do, c = Ro, i = Oo, s = null, m = null;
    return e != null && (e.unstable_strictMode === !0 && (u = !0), e.identifierPrefix !== void 0 && (a = e.identifierPrefix), e.onUncaughtError !== void 0 && (n = e.onUncaughtError), e.onCaughtError !== void 0 && (c = e.onCaughtError), e.onRecoverableError !== void 0 && (i = e.onRecoverableError), e.unstable_transitionCallbacks !== void 0 && (s = e.unstable_transitionCallbacks), e.formState !== void 0 && (m = e.formState)), t = Ir(
      l,
      1,
      !0,
      t,
      e ?? null,
      u,
      a,
      n,
      c,
      i,
      s,
      m
    ), t.context = Pr(null), e = t.current, u = at(), u = Jn(u), a = kt(u), a.callback = null, Wt(e, a, u), e = u, t.current.lanes = e, Ou(t, e), Rt(t), l[Be] = t.current, qi(l), new qn(t);
  }, Ea.version = "19.1.0", Ea;
}
var Sd;
function fv() {
  if (Sd) return af.exports;
  Sd = 1;
  function f() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (g) {
        console.error(g);
      }
  }
  return f(), af.exports = iv(), af.exports;
}
var sv = fv();
class ov extends ol.Component {
  constructor(g) {
    super(g), this.state = { hasError: !1 };
  }
  static getDerivedStateFromError(g) {
    return { hasError: !0, error: g };
  }
  render() {
    return this.state.hasError ? /* @__PURE__ */ R.jsx("div", { children: "Something went wrong. Please refresh the page or contact express dev team." }) : this.props.children;
  }
}
const bd = "https://www.adobe.com/express-search-api-v3", of = "urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418", Ed = "urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852", df = " AND ", Ad = ",";
function rv(f) {
  f.has("collection") && (f.get("collection") === "default" ? f.set("collectionId", `${of}`) : f.get("collection") === "popular" && f.set("collectionId", `${Ed}`), f.delete("collection")), f.get("collectionId") || f.set("collectionId", `${of}`);
}
function dv(f) {
  f.get("license") && (f.append("filters", `licensingCategory==${f.get("license")}`), f.delete("license")), f.get("behaviors") && (f.append("filters", `behaviors==${f.get("behaviors")}`), f.delete("behaviors")), f.get("tasks") && (f.append("filters", `pages.task.name==${f.get("tasks")}`), f.delete("tasks")), f.get("topics") && (f.get("topics").split(df).forEach((g) => {
    f.append("filters", `topics==${g}`);
  }), f.delete("topics")), f.get("language") && (f.append("filters", `language==${f.get("language")}`), f.delete("language"));
}
function hv(f) {
  const g = {};
  return f.get("prefLang") && (g["x-express-pref-lang"] = f.get("prefLang"), f.delete("prefLang")), f.get("prefRegion") && (g["x-express-pref-region-code"] = f.get("prefRegion"), f.delete("prefRegion")), g;
}
function Dd(f, g) {
  const h = /\[(.+)\]/.exec(g)[1].split(";"), o = new URLSearchParams(f);
  return o.delete("limit"), o.delete("start"), h.forEach((z) => {
    const N = /^-(.+)/.exec(z);
    if (N) {
      o.delete(N[1]);
      return;
    }
    const C = /^(.+)=(.+)/.exec(z);
    C && o.set(C[1], C[2]);
  }), o.toString();
}
function hf(f) {
  const g = {}, h = new URLSearchParams(f);
  if (h.set("queryType", "search"), rv(h), h.has("backup")) {
    const z = h.get("backup");
    h.delete("backup"), g.backupQuery = {
      target: h.get("limit"),
      ...hf(Dd(h, z))
    };
  }
  h.get("templateIds") ? (h.append("filters", `id==${h.get("templateIds")}`), h.delete("templateIds"), h.delete("start"), h.delete("orderBy")) : (dv(h), g.headers = hv(h));
  const o = new URL(bd).host === window.location.host ? "" : "&ax-env=stage";
  return g.url = `${bd}?${decodeURIComponent(h.toString())}${o}`, g;
}
async function sf(f, g) {
  return await (await fetch(f, { headers: g })).json();
}
function vv(f) {
  const [g, h] = [/* @__PURE__ */ new Set(), []];
  return f.forEach((o) => {
    g.has(o.id) || (g.add(o.id), h.push(o));
  }), h;
}
async function yv(f) {
  var T;
  const { url: g, headers: h, backupQuery: o } = hf(f);
  if (!o || !o.target)
    return sf(g, h);
  const [z, N] = [
    sf(g, h),
    sf(o.url, o.headers)
  ], C = await z;
  if (((T = C.items) == null ? void 0 : T.length) >= o.target)
    return C;
  const Z = await N, _ = vv([...C.items, ...Z.items]).slice(0, o.target);
  return {
    metadata: {
      totalHits: _.length,
      start: "0",
      limit: o.target
    },
    items: _
  };
}
function mv(f) {
  var g, h, o;
  return (g = f["dc:title"]) != null && g["i-default"] ? f["dc:title"]["i-default"] : (h = f.moods) != null && h.length && ((o = f.task) != null && o.name) ? `${f.moods.join(", ")} ${f.task.name}` : "";
}
function gv(f) {
  var g, h;
  return (h = (g = f._links) == null ? void 0 : g["http://ns.adobe.com/adobecloud/rel/rendition"]) == null ? void 0 : h.href;
}
function Sv(f) {
  var g, h;
  return (h = (g = f._links) == null ? void 0 : g["http://ns.adobe.com/adobecloud/rel/component"]) == null ? void 0 : h.href;
}
const vf = {
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
  // manual ids
  templateIds: [""],
  // boosting
  prefLang: "",
  prefRegion: "",
  // backup recipe
  backupRecipe: ""
};
function Rd(f, g) {
  return !f && !g || f === g ? !0 : Array.isArray(f) && Array.isArray(g) ? f.length !== g.length ? !1 : f.every((h, o) => Rd(h, g[o])) : !1;
}
const Td = { topics: _d, templateIds: zd };
function bv(f, g) {
  return Object.keys(vf).filter((h) => !["start", "backupRecipe", "limit"].includes(h)).reduce((h, o) => {
    const z = f[o], N = g[o];
    if (Rd(z, N))
      return h;
    if (z && !N)
      return [...h, { type: "-", key: o }];
    if (o in Td) {
      const C = Td[o](N);
      return C ? [...h, { type: "+", key: o, value: C }] : [...h, { type: "-", key: o }];
    }
    return [...h, { type: "+", key: o, value: N }];
  }, []);
}
function Od(f) {
  const g = new URLSearchParams(f), h = structuredClone(vf);
  if (g.has("collectionId") ? g.get("collectionId") === of ? (h.collection = "default", h.collectionId = "") : g.get("collectionId") === Ed ? (h.collection = "popular", h.collectionId = "") : h.collection = "custom" : g.has("collection") && ["default", "popular"].includes(g.get("collection")) ? (h.collection = g.get("collection"), h.collectionId = "") : (h.collection = "default", h.collectionId = ""), g.get("limit") && (h.limit = Number(g.get("limit"))), g.get("backup")) {
    const o = g.get("backup");
    g.delete("backup"), h.backupRecipe = Dd(g, o);
  }
  return g.has("templateIds") && (h.templateIds = g.get("templateIds").split(",")), g.get("start") && (h.start = Number(g.get("start"))), g.get("orderBy") && (h.orderBy = g.get("orderBy")), g.get("q") && (h.q = g.get("q")), g.get("language") && (h.language = g.get("language")), g.get("tasks") && (h.tasks = g.get("tasks")), g.get("topics") && (h.topics = g.get("topics").split(df).map((o) => o.split(Ad))), g.get("license") && (h.license = g.get("license")), g.get("behaviors") && (h.behaviors = g.get("behaviors")), g.get("prefLang") && (h.prefLang = g.get("prefLang")), g.get("prefRegion") && (h.prefRegion = g.get("prefRegion").toUpperCase()), h;
}
function _d(f) {
  return f.filter((g) => g.some(Boolean)).map((g) => g.filter(Boolean).join(Ad)).join(df);
}
function zd(f) {
  return f.filter(Boolean).join(",");
}
function yf(f) {
  const g = f.collection === "custom" ? "" : `collection=${f.collection}`, h = f.collection === "custom" ? `collectionId=${f.collectionId}` : "", o = f.limit ? `limit=${f.limit}` : "";
  let z = "";
  if (f.backupRecipe) {
    const Sl = Od(f.backupRecipe), Vl = bv(f, Sl);
    Vl.length && (z = `backup=[${Vl.map(({ type: Xl, key: Cl, value: Ql }) => Xl === "-" ? `-${Cl}` : `${Cl}=${Ql}`).join(";")}]`);
  }
  const N = f.templateIds.filter(Boolean).map((Sl) => Sl.trim()), C = zd(N);
  if (C)
    return [
      g,
      h,
      `templateIds=${C}`,
      z,
      z && o
    ].filter(Boolean).join("&");
  const Z = f.start ? `start=${f.start}` : "", _ = f.q ? `q=${f.q}` : "", T = f.language ? `language=${f.language}` : "", B = f.tasks ? `tasks=${f.tasks}` : "", W = _d(f.topics), k = W ? `topics=${W}` : "", zl = f.license ? `license=${f.license}` : "", Ml = f.behaviors ? `behaviors=${f.behaviors}` : "", kl = f.orderBy ? `orderBy=${f.orderBy}` : "", Hl = f.prefLang ? `prefLang=${f.prefLang}` : "", Ot = f.prefRegion ? `prefRegion=${f.prefRegion}` : "";
  return [
    _,
    k,
    B,
    T,
    zl,
    Ml,
    kl,
    o,
    g,
    h,
    Hl,
    Ot,
    Z,
    z
  ].filter(Boolean).join("&");
}
const Md = ol.createContext(null), Ud = ol.createContext(null), Nd = ol.createContext(null);
function pu() {
  return ol.useContext(Md);
}
function Eu() {
  return ol.useContext(Ud);
}
function Tv() {
  return ol.useContext(Nd);
}
const _l = {
  UPDATE_RECIPE: "UPDATE_RECIPE",
  UPDATE_FORM: "UPDATE_FORM",
  TOPICS_ADD: "TOPICS_ADD",
  TOPICS_UPDATE: "TOPICS_UPDATE",
  TOPICS_REMOVE: "TOPICS_REMOVE",
  TOPICS_EXPAND: "TOPICS_EXPAND",
  IDS_ADD: "IDS_ADD",
  IDS_REMOVE: "IDS_REMOVE",
  IDS_UPDATE: "IDS_UPDATE"
};
function pv(f, g) {
  const { type: h, payload: o } = g, { field: z, value: N, topicsRow: C, topicsCol: Z, idsRow: _ } = o || {};
  switch (h) {
    case _l.UPDATE_RECIPE:
      return Od(N);
    case _l.UPDATE_FORM:
      return { ...f, [z]: N };
    case _l.TOPICS_ADD: {
      const T = structuredClone(f.topics);
      return T[C].push(""), { ...f, topics: T };
    }
    case _l.TOPICS_REMOVE: {
      const T = structuredClone(f.topics);
      return T[C].pop(), T[C].length || T.splice(C, 1), {
        ...f,
        topics: T
      };
    }
    case _l.TOPICS_UPDATE: {
      const T = structuredClone(f.topics);
      return T[C][Z] = N, {
        ...f,
        topics: T
      };
    }
    case _l.TOPICS_EXPAND:
      return {
        ...f,
        topics: [...f.topics, [""]]
      };
    case _l.IDS_ADD:
      return {
        ...f,
        templateIds: [...f.templateIds, ""]
      };
    case _l.IDS_UPDATE:
      return {
        ...f,
        templateIds: [...f.templateIds.slice(0, _), N, ...f.templateIds.slice(_ + 1)]
      };
    case _l.IDS_REMOVE:
      return {
        ...f,
        templateIds: [...f.templateIds.slice(0, _), ...f.templateIds.slice(_ + 1)]
      };
    default:
      throw new Error(`Unhandled action type: ${h}`);
  }
}
function Ev() {
  const [f, g] = ol.useState(null), h = ol.useRef(null), o = ol.useCallback((z) => {
    h.current && clearTimeout(h.current), g(z), h.current = setTimeout(() => g(null), 5e3);
  }, []);
  return ol.useEffect(() => () => {
    h.current && clearTimeout(h.current);
  }, []), [f, o];
}
function Av({ children: f }) {
  const [g, h] = Ev();
  return /* @__PURE__ */ R.jsx(Nd, { value: { activeInfo: g, showInfo: h }, children: f });
}
function Dv({ children: f }) {
  const [g, h] = ol.useReducer(pv, vf);
  return /* @__PURE__ */ R.jsx(Md, { value: g, children: /* @__PURE__ */ R.jsx(Av, { children: /* @__PURE__ */ R.jsx(Ud, { value: h, children: f }) }) });
}
function Rv() {
  const [f, g] = ol.useState(!1), h = pu(), o = yf(h), z = Eu(), N = () => {
    navigator.clipboard.writeText(o), g(!0), setTimeout(() => g(!1), 2e3);
  };
  return /* @__PURE__ */ R.jsxs("div", { className: "border-grey rounded p-1", children: [
    /* @__PURE__ */ R.jsx("h2", { children: "Recipe to Form:" }),
    /* @__PURE__ */ R.jsx(
      "textarea",
      {
        autoCorrect: "off",
        autoCapitalize: "off",
        spellCheck: "false",
        value: o,
        onChange: (C) => z({
          type: _l.UPDATE_RECIPE,
          payload: { value: C.target.value }
        })
      }
    ),
    /* @__PURE__ */ R.jsxs("div", { className: "copy-button-container flex items-center justify-between", children: [
      /* @__PURE__ */ R.jsx("button", { onClick: N, children: "Copy" }),
      f && /* @__PURE__ */ R.jsx("p", { className: "copied", children: "Copied to clipboard!" })
    ] })
  ] });
}
function Au({ children: f }) {
  return /* @__PURE__ */ R.jsx("label", { className: "flex gap-2 items-center flex-wrap", children: f });
}
function Ov({ topicsGroup: f, rowIndex: g, expandButton: h, inputRefSetter: o }) {
  const z = Eu();
  return /* @__PURE__ */ R.jsxs(Au, { children: [
    g === 0 ? "Topics:" : "AND Topics:",
    f.map((N, C) => /* @__PURE__ */ R.jsx(
      "input",
      {
        ref: (Z) => o && o(Z, g, C),
        className: "topics-input",
        name: `topic-group-${g}-${C}`,
        type: "text",
        value: N,
        onChange: (Z) => z({
          type: _l.TOPICS_UPDATE,
          payload: {
            topicsRow: g,
            topicsCol: C,
            value: Z.target.value
          }
        })
      },
      C
    )),
    /* @__PURE__ */ R.jsxs("div", { className: "flex gap-1", children: [
      g === 0 && f.length === 1 || /* @__PURE__ */ R.jsx(
        "button",
        {
          onClick: (N) => {
            N.preventDefault(), z({
              type: _l.TOPICS_REMOVE,
              payload: {
                topicsRow: g
              }
            });
          },
          children: "-"
        }
      ),
      f.every(Boolean) && /* @__PURE__ */ R.jsx(
        "button",
        {
          onClick: (N) => {
            N.preventDefault(), z({
              type: _l.TOPICS_ADD,
              payload: { topicsRow: g }
            });
          },
          children: "+"
        }
      ),
      h
    ] })
  ] });
}
function _v() {
  const f = pu(), g = Eu(), h = f.topics, o = ol.useRef([]), z = ol.useRef(h.length), N = ol.useRef(h.map((_) => _.length));
  ol.useEffect(() => {
    if (h.length > z.current) {
      const _ = h.length - 1;
      o.current[_] && o.current[_][0] && o.current[_][0].focus();
    } else
      for (let _ = 0; _ < h.length; _++) {
        const T = h[_].length, B = N.current[_] || 0;
        if (T > B) {
          const W = T - 1;
          o.current[_] && o.current[_][W] && o.current[_][W].focus();
          break;
        }
      }
    z.current = h.length, N.current = h.map((_) => _.length);
  }, [h]);
  const C = (_, T, B) => {
    o.current[T] || (o.current[T] = []), o.current[T][B] = _;
  }, Z = /* @__PURE__ */ R.jsx(
    "button",
    {
      onClick: (_) => {
        _.preventDefault(), g({
          type: _l.TOPICS_EXPAND
        });
      },
      children: "AND"
    }
  );
  return /* @__PURE__ */ R.jsx("div", { className: "flex flex-col items-start", children: h.map((_, T) => /* @__PURE__ */ R.jsx(
    Ov,
    {
      rowIndex: T,
      topicsGroup: h[T],
      expandButton: T === h.length - 1 ? Z : null,
      inputRefSetter: C
    },
    T
  )) });
}
function zv({ fieldName: f, content: g }) {
  const { activeInfo: h, showInfo: o } = Tv();
  return /* @__PURE__ */ R.jsxs(R.Fragment, { children: [
    /* @__PURE__ */ R.jsx(
      "button",
      {
        type: "button",
        className: "info-button",
        "aria-label": `Show information for ${f}`,
        onClick: () => o(f),
        children: "？"
      }
    ),
    h === f && /* @__PURE__ */ R.jsx("div", { className: "info-content", tabIndex: "0", children: /* @__PURE__ */ R.jsx("small", { children: g }) })
  ] });
}
const Xn = ol.memo(zv);
function Tu({
  label: f,
  name: g,
  title: h,
  value: o,
  onChange: z,
  info: N,
  required: C,
  disabled: Z,
  ..._
}) {
  return /* @__PURE__ */ R.jsxs(Au, { children: [
    f,
    /* @__PURE__ */ R.jsx(
      "input",
      {
        name: g,
        type: "text",
        title: h,
        required: C,
        disabled: Z,
        value: o,
        onChange: z,
        ..._
      }
    ),
    N && /* @__PURE__ */ R.jsx(
      Xn,
      {
        fieldName: g,
        content: N
      }
    )
  ] });
}
function Gn({
  label: f,
  name: g,
  value: h,
  onChange: o,
  options: z,
  info: N,
  ...C
}) {
  return /* @__PURE__ */ R.jsxs(Au, { children: [
    f,
    /* @__PURE__ */ R.jsx(
      "select",
      {
        name: g,
        value: h,
        onChange: o,
        ...C,
        children: z.map((Z) => /* @__PURE__ */ R.jsx("option", { value: Z.value, children: Z.label }, Z.value))
      }
    ),
    N && /* @__PURE__ */ R.jsx(
      Xn,
      {
        fieldName: g,
        content: N
      }
    )
  ] });
}
function pd({
  label: f,
  name: g,
  value: h,
  onChange: o,
  info: z,
  ...N
}) {
  return /* @__PURE__ */ R.jsxs(Au, { children: [
    f,
    /* @__PURE__ */ R.jsx(
      "input",
      {
        name: g,
        type: "number",
        value: h,
        onChange: o,
        ...N
      }
    ),
    z && /* @__PURE__ */ R.jsx(
      Xn,
      {
        fieldName: g,
        content: z
      }
    )
  ] });
}
function Mv({
  label: f,
  name: g,
  value: h,
  onChange: o,
  info: z
}) {
  return /* @__PURE__ */ R.jsxs(Au, { children: [
    /* @__PURE__ */ R.jsx("small", { children: f }),
    /* @__PURE__ */ R.jsx(
      "textarea",
      {
        autoCorrect: "off",
        autoCapitalize: "off",
        spellCheck: "false",
        name: g,
        value: h,
        onChange: o
      }
    ),
    z && /* @__PURE__ */ R.jsx(
      Xn,
      {
        fieldName: g,
        content: z
      }
    )
  ] });
}
function Uv({ rowIndex: f, templateId: g, expandButton: h, inputRef: o }) {
  const z = Eu();
  return /* @__PURE__ */ R.jsxs(Au, { children: [
    /* @__PURE__ */ R.jsx(
      "input",
      {
        ref: o,
        className: "template-id-input",
        type: "text",
        value: g,
        name: `template-manual-id-${f}`,
        onChange: (N) => z({
          type: _l.IDS_UPDATE,
          payload: {
            idsRow: f,
            value: N.target.value
          }
        })
      }
    ),
    /* @__PURE__ */ R.jsxs("div", { className: "flex gap-1", children: [
      f === 0 || /* @__PURE__ */ R.jsx(
        "button",
        {
          onClick: (N) => {
            N.preventDefault(), z({
              type: _l.IDS_REMOVE,
              payload: {
                idsRow: f
              }
            });
          },
          children: "-"
        }
      ),
      h
    ] })
  ] });
}
function Nv() {
  const f = pu(), g = Eu(), { templateIds: h } = f, o = ol.useRef([]), z = ol.useRef(h.length);
  ol.useEffect(() => {
    if (h.length > z.current) {
      const C = h.length - 1;
      o.current[C] && o.current[C].focus();
    }
    z.current = h.length;
  }, [h.length]);
  const N = /* @__PURE__ */ R.jsx(
    "button",
    {
      onClick: (C) => {
        C.preventDefault(), g({
          type: _l.IDS_ADD
        });
      },
      children: "ADD ID"
    }
  );
  return /* @__PURE__ */ R.jsx("div", { className: "flex flex-col items-start", children: h.map((C, Z) => /* @__PURE__ */ R.jsx(
    Uv,
    {
      rowIndex: Z,
      templateId: C,
      expandButton: Z === h.length - 1 ? N : null,
      inputRef: (_) => o.current[Z] = _
    },
    Z
  )) });
}
function xv() {
  const f = pu(), g = Eu(), h = ol.useCallback(
    (o, z = !1) => ({ target: { value: N } }) => {
      g({
        type: _l.UPDATE_FORM,
        payload: { field: o, value: z ? Number(N) : N }
      });
    },
    [g]
  );
  return /* @__PURE__ */ R.jsxs("form", { className: "border-grey rounded p-1 gap-1", children: [
    /* @__PURE__ */ R.jsx("h2", { children: "Form to Recipe:" }),
    /* @__PURE__ */ R.jsx("h4", { children: "Search Parameters" }),
    /* @__PURE__ */ R.jsx(
      Tu,
      {
        label: "Q:",
        name: "q",
        value: f.q,
        onChange: h("q"),
        info: "Search query. This is more flexible and ambiguous than using filters but also less precise."
      }
    ),
    /* @__PURE__ */ R.jsx(
      Gn,
      {
        label: "Collection:",
        name: "collection",
        value: f.collection,
        onChange: h("collection"),
        options: [
          { value: "default", label: "Default" },
          { value: "popular", label: "Popular" },
          { value: "custom", label: "Use Custom collection ID" }
        ],
        info: "Predefined collections. Select Customized to use specific Collection ID. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). You can also use the Popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852)."
      }
    ),
    /* @__PURE__ */ R.jsx(
      Tu,
      {
        label: "Collection ID:",
        name: "collectionId",
        value: f.collectionId,
        onChange: h("collectionId"),
        title: "Optional. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). Another common is the popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852).",
        disabled: f.collection !== "custom",
        required: f.collection === "custom"
      }
    ),
    f.collection === "custom" && !f.collectionId && /* @__PURE__ */ R.jsx("div", { className: "error-message", children: "Collection ID is required when using a custom collection" }),
    /* @__PURE__ */ R.jsx(
      pd,
      {
        label: "Limit:",
        name: "limit",
        value: f.limit,
        onChange: h("limit", !0),
        info: "Number of results to return"
      }
    ),
    /* @__PURE__ */ R.jsx(
      pd,
      {
        label: "Start:",
        name: "start",
        value: f.start,
        onChange: h("start", !0),
        info: "Starting index for the results"
      }
    ),
    /* @__PURE__ */ R.jsx(
      Gn,
      {
        label: "Order by:",
        name: "orderBy",
        value: f.orderBy,
        onChange: h("orderBy"),
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
      Tu,
      {
        label: "Language:",
        name: "language",
        value: f.language,
        onChange: h("language"),
        info: "Available values : ar-SA, bn-IN, cs-CZ, da-DK, de-DE, el-GR, en-US, es-ES, fil-P,fi-FI, fr-FR,hi-IN, id-ID, it-IT, ja-JP, ko-KR, ms-MY, nb-NO, nl-NL, pl-PL, pt-BR, ro-RO, ru-RU, sv-SE, ta-IN, th-TH, tr-TR, uk-UA, vi-VN, zh-Hans-CN, zh-Hant-TW"
      }
    ),
    /* @__PURE__ */ R.jsx(
      Tu,
      {
        label: "Tasks:",
        name: "tasks",
        value: f.tasks,
        onChange: h("tasks")
      }
    ),
    /* @__PURE__ */ R.jsx(_v, {}),
    /* @__PURE__ */ R.jsx(
      Gn,
      {
        label: "Behaviors:",
        name: "behaviors",
        value: f.behaviors,
        onChange: h("behaviors"),
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
      Gn,
      {
        label: "Licensing Category:",
        name: "license",
        value: f.license,
        onChange: h("license"),
        options: [
          { value: "", label: "All (Default)" },
          { value: "free", label: "Free" },
          { value: "premium", label: "Premium" }
        ]
      }
    ),
    /* @__PURE__ */ R.jsx("h4", { children: "Manual Template IDs (ignoring all but collection and limit)" }),
    /* @__PURE__ */ R.jsx(Nv, {}),
    /* @__PURE__ */ R.jsx("h4", { children: "Boosting:" }),
    /* @__PURE__ */ R.jsx(
      Tu,
      {
        label: "Preferred Language Boosting:",
        name: "prefLang",
        value: f.prefLang,
        onChange: h("prefLang"),
        info: "Boost templates that are in this language. Useful when your results have a mix of languages. Same list as the one for language filter."
      }
    ),
    /* @__PURE__ */ R.jsx(
      Tu,
      {
        label: "Preferred Region Boosting:",
        name: "prefRegion",
        value: f.prefRegion,
        onChange: h("prefRegion"),
        info: "Available values :  AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KR, KV, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, ST, SV, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, YE, YT, ZA, ZM, ZW, ZZ"
      }
    ),
    /* @__PURE__ */ R.jsx("h4", { children: "Backup Recipe:" }),
    /* @__PURE__ */ R.jsx(
      Mv,
      {
        name: "backupRecipe",
        value: f.backupRecipe,
        onChange: h("backupRecipe"),
        label: "When not enough templates exist for the recipe's limit, templates from this backup recipe will be used to backfill. Note: start will stop functioning, and this setup should only be used for 1-page query (no toolbar and pagination)."
      }
    )
  ] });
}
function Hv(f) {
  var Z;
  const g = (Z = f.pages[0].rendition.image) == null ? void 0 : Z.thumbnail, h = Sv(f), o = gv(f), { mediaType: z, componentId: N, hzRevision: C } = g;
  return z === "image/webp" ? h.replace(
    "{&revision,component_id}",
    `&revision=${C || 0}&component_id=${N}`
  ) : o.replace(
    "{&page,size,type,fragment}",
    `&type=${z}&fragment=id=${N}`
  );
}
function Cv({ data: f }) {
  const g = /* @__PURE__ */ R.jsx("img", { src: Hv(f), alt: mv(f) });
  return /* @__PURE__ */ R.jsx("div", { className: "flex flex-col template", children: g });
}
function Bv({ generateResults: f, loading: g, results: h }) {
  return /* @__PURE__ */ R.jsx("button", { onClick: f, disabled: g, children: g ? "Generating..." : h ? "Regenerate" : "Generate" });
}
function jv() {
  var T, B, W;
  const f = pu(), g = yf(f), [h, o] = ol.useState(null), [z, N] = ol.useState(!1), [C, Z] = ol.useState(null), _ = async () => {
    o(null), N(!0), Z(null);
    try {
      const k = await yv(g);
      o(k);
    } catch (k) {
      Z(k);
    } finally {
      N(!1);
    }
  };
  return /* @__PURE__ */ R.jsxs("div", { className: "border-grey rounded p-1 gap-1", children: [
    /* @__PURE__ */ R.jsx("h2", { children: "Results" }),
    /* @__PURE__ */ R.jsx(
      Bv,
      {
        generateResults: _,
        loading: z,
        results: h
      }
    ),
    z && /* @__PURE__ */ R.jsx("p", { children: "Loading..." }),
    C && /* @__PURE__ */ R.jsxs("p", { children: [
      "Error: ",
      C.message
    ] }),
    ((T = h == null ? void 0 : h.metadata) == null ? void 0 : T.totalHits) > 0 && /* @__PURE__ */ R.jsxs("p", { children: [
      "Total hits: ",
      h.metadata.totalHits
    ] }),
    ((B = h == null ? void 0 : h.metadata) == null ? void 0 : B.totalHits) === 0 && /* @__PURE__ */ R.jsx("p", { children: "No results found. Try different recipe." }),
    ((W = h == null ? void 0 : h.items) == null ? void 0 : W.length) > 0 && /* @__PURE__ */ R.jsx("div", { className: "flex flex-wrap gap-2 templates", children: h.items.map((k) => /* @__PURE__ */ R.jsx(Cv, { data: k }, k.id)) })
  ] });
}
function qv() {
  const f = pu(), { url: g, headers: h, backupQuery: o } = hf(yf(f)), z = o ? /* @__PURE__ */ R.jsxs("div", { className: "pt-1", children: [
    /* @__PURE__ */ R.jsx("div", { children: /* @__PURE__ */ R.jsxs("code", { children: [
      "Backup URL: ",
      o.url
    ] }) }),
    /* @__PURE__ */ R.jsx("div", { children: /* @__PURE__ */ R.jsxs("code", { children: [
      "Backup Headers: ",
      JSON.stringify(o.headers, null, 2)
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
          g
        ] }) }),
        /* @__PURE__ */ R.jsx("div", { children: /* @__PURE__ */ R.jsxs("code", { children: [
          "headers: ",
          JSON.stringify(h, null, 2)
        ] }) })
      ] }),
      z
    ] })
  ] });
}
function Yv() {
  return /* @__PURE__ */ R.jsx(ov, { children: /* @__PURE__ */ R.jsx(Dv, { children: /* @__PURE__ */ R.jsxs("div", { className: "app-container m-auto", children: [
    /* @__PURE__ */ R.jsx("h1", { children: "Templates as a Service (TaaS)" }),
    /* @__PURE__ */ R.jsxs("div", { className: "flex flex-wrap gap-1", children: [
      /* @__PURE__ */ R.jsxs("div", { className: "left-container flex flex-col gap-1", children: [
        /* @__PURE__ */ R.jsx(Rv, {}),
        /* @__PURE__ */ R.jsx(xv, {})
      ] }),
      /* @__PURE__ */ R.jsxs("div", { className: "right-container flex flex-col gap-1", children: [
        /* @__PURE__ */ R.jsx(qv, {}),
        /* @__PURE__ */ R.jsx(jv, {})
      ] })
    ] })
  ] }) }) });
}
function Gv(f = "root") {
  const g = document.getElementById(f);
  if (!g) {
    console.error(`Container with id "${f}" not found`);
    return;
  }
  const h = sv.createRoot(g);
  return h.render(
    /* @__PURE__ */ R.jsx(ol.StrictMode, { children: /* @__PURE__ */ R.jsx(Yv, {}) })
  ), h;
}
typeof window < "u" && document.getElementById("root") && Gv("root");
export {
  Gv as initTemplatesAsAService
};
//# sourceMappingURL=templates-as-a-service.min.es.js.map
