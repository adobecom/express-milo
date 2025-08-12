var ef = { exports: {} }, Ea = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sr;
function Fv() {
  if (sr) return Ea;
  sr = 1;
  var f = Symbol.for("react.transitional.element"), g = Symbol.for("react.fragment");
  function h(o, _, U) {
    var Q = null;
    if (U !== void 0 && (Q = "" + U), _.key !== void 0 && (Q = "" + _.key), "key" in _) {
      U = {};
      for (var F in _)
        F !== "key" && (U[F] = _[F]);
    } else U = _;
    return _ = U.ref, {
      $$typeof: f,
      type: o,
      key: Q,
      ref: _ !== void 0 ? _ : null,
      props: U
    };
  }
  return Ea.Fragment = g, Ea.jsx = h, Ea.jsxs = h, Ea;
}
var or;
function Iv() {
  return or || (or = 1, ef.exports = Fv()), ef.exports;
}
var O = Iv(), uf = { exports: {} }, V = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dr;
function Pv() {
  if (dr) return V;
  dr = 1;
  var f = Symbol.for("react.transitional.element"), g = Symbol.for("react.portal"), h = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), _ = Symbol.for("react.profiler"), U = Symbol.for("react.consumer"), Q = Symbol.for("react.context"), F = Symbol.for("react.forward_ref"), x = Symbol.for("react.suspense"), E = Symbol.for("react.memo"), C = Symbol.for("react.lazy"), tl = Symbol.iterator;
  function $(d) {
    return d === null || typeof d != "object" ? null : (d = tl && d[tl] || d["@@iterator"], typeof d == "function" ? d : null);
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
  }, Ml = Object.assign, wl = {};
  function Hl(d, R, N) {
    this.props = d, this.context = R, this.refs = wl, this.updater = N || zl;
  }
  Hl.prototype.isReactComponent = {}, Hl.prototype.setState = function(d, R) {
    if (typeof d != "object" && typeof d != "function" && d != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, d, R, "setState");
  }, Hl.prototype.forceUpdate = function(d) {
    this.updater.enqueueForceUpdate(this, d, "forceUpdate");
  };
  function St() {
  }
  St.prototype = Hl.prototype;
  function bt(d, R, N) {
    this.props = d, this.context = R, this.refs = wl, this.updater = N || zl;
  }
  var ol = bt.prototype = new St();
  ol.constructor = bt, Ml(ol, Hl.prototype), ol.isPureReactComponent = !0;
  var nt = Array.isArray, k = { H: null, A: null, T: null, S: null, V: null }, Cl = Object.prototype.hasOwnProperty;
  function Xl(d, R, N, z, j, I) {
    return N = I.ref, {
      $$typeof: f,
      type: d,
      key: R,
      ref: N !== void 0 ? N : null,
      props: I
    };
  }
  function $l(d, R) {
    return Xl(
      d.type,
      R,
      void 0,
      void 0,
      void 0,
      d.props
    );
  }
  function Tt(d) {
    return typeof d == "object" && d !== null && d.$$typeof === f;
  }
  function Ce(d) {
    var R = { "=": "=0", ":": "=2" };
    return "$" + d.replace(/[=:]/g, function(N) {
      return R[N];
    });
  }
  var _t = /\/+/g;
  function Bl(d, R) {
    return typeof d == "object" && d !== null && d.key != null ? Ce("" + d.key) : R.toString(36);
  }
  function he() {
  }
  function ye(d) {
    switch (d.status) {
      case "fulfilled":
        return d.value;
      case "rejected":
        throw d.reason;
      default:
        switch (typeof d.status == "string" ? d.then(he, he) : (d.status = "pending", d.then(
          function(R) {
            d.status === "pending" && (d.status = "fulfilled", d.value = R);
          },
          function(R) {
            d.status === "pending" && (d.status = "rejected", d.reason = R);
          }
        )), d.status) {
          case "fulfilled":
            return d.value;
          case "rejected":
            throw d.reason;
        }
    }
    throw d;
  }
  function jl(d, R, N, z, j) {
    var I = typeof d;
    (I === "undefined" || I === "boolean") && (d = null);
    var Z = !1;
    if (d === null) Z = !0;
    else
      switch (I) {
        case "bigint":
        case "string":
        case "number":
          Z = !0;
          break;
        case "object":
          switch (d.$$typeof) {
            case f:
            case g:
              Z = !0;
              break;
            case C:
              return Z = d._init, jl(
                Z(d._payload),
                R,
                N,
                z,
                j
              );
          }
      }
    if (Z)
      return j = j(d), Z = z === "" ? "." + Bl(d, 0) : z, nt(j) ? (N = "", Z != null && (N = Z.replace(_t, "$&/") + "/"), jl(j, R, N, "", function(Vt) {
        return Vt;
      })) : j != null && (Tt(j) && (j = $l(
        j,
        N + (j.key == null || d && d.key === j.key ? "" : ("" + j.key).replace(
          _t,
          "$&/"
        ) + "/") + Z
      )), R.push(j)), 1;
    Z = 0;
    var kl = z === "" ? "." : z + ":";
    if (nt(d))
      for (var dl = 0; dl < d.length; dl++)
        z = d[dl], I = kl + Bl(z, dl), Z += jl(
          z,
          R,
          N,
          I,
          j
        );
    else if (dl = $(d), typeof dl == "function")
      for (d = dl.call(d), dl = 0; !(z = d.next()).done; )
        z = z.value, I = kl + Bl(z, dl++), Z += jl(
          z,
          R,
          N,
          I,
          j
        );
    else if (I === "object") {
      if (typeof d.then == "function")
        return jl(
          ye(d),
          R,
          N,
          z,
          j
        );
      throw R = String(d), Error(
        "Objects are not valid as a React child (found: " + (R === "[object Object]" ? "object with keys {" + Object.keys(d).join(", ") + "}" : R) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return Z;
  }
  function A(d, R, N) {
    if (d == null) return d;
    var z = [], j = 0;
    return jl(d, z, "", "", function(I) {
      return R.call(N, I, j++);
    }), z;
  }
  function M(d) {
    if (d._status === -1) {
      var R = d._result;
      R = R(), R.then(
        function(N) {
          (d._status === 0 || d._status === -1) && (d._status = 1, d._result = N);
        },
        function(N) {
          (d._status === 0 || d._status === -1) && (d._status = 2, d._result = N);
        }
      ), d._status === -1 && (d._status = 0, d._result = R);
    }
    if (d._status === 1) return d._result.default;
    throw d._result;
  }
  var G = typeof reportError == "function" ? reportError : function(d) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var R = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof d == "object" && d !== null && typeof d.message == "string" ? String(d.message) : String(d),
        error: d
      });
      if (!window.dispatchEvent(R)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", d);
      return;
    }
    console.error(d);
  };
  function il() {
  }
  return V.Children = {
    map: A,
    forEach: function(d, R, N) {
      A(
        d,
        function() {
          R.apply(this, arguments);
        },
        N
      );
    },
    count: function(d) {
      var R = 0;
      return A(d, function() {
        R++;
      }), R;
    },
    toArray: function(d) {
      return A(d, function(R) {
        return R;
      }) || [];
    },
    only: function(d) {
      if (!Tt(d))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return d;
    }
  }, V.Component = Hl, V.Fragment = h, V.Profiler = _, V.PureComponent = bt, V.StrictMode = o, V.Suspense = x, V.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = k, V.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(d) {
      return k.H.useMemoCache(d);
    }
  }, V.cache = function(d) {
    return function() {
      return d.apply(null, arguments);
    };
  }, V.cloneElement = function(d, R, N) {
    if (d == null)
      throw Error(
        "The argument must be a React element, but you passed " + d + "."
      );
    var z = Ml({}, d.props), j = d.key, I = void 0;
    if (R != null)
      for (Z in R.ref !== void 0 && (I = void 0), R.key !== void 0 && (j = "" + R.key), R)
        !Cl.call(R, Z) || Z === "key" || Z === "__self" || Z === "__source" || Z === "ref" && R.ref === void 0 || (z[Z] = R[Z]);
    var Z = arguments.length - 2;
    if (Z === 1) z.children = N;
    else if (1 < Z) {
      for (var kl = Array(Z), dl = 0; dl < Z; dl++)
        kl[dl] = arguments[dl + 2];
      z.children = kl;
    }
    return Xl(d.type, j, void 0, void 0, I, z);
  }, V.createContext = function(d) {
    return d = {
      $$typeof: Q,
      _currentValue: d,
      _currentValue2: d,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, d.Provider = d, d.Consumer = {
      $$typeof: U,
      _context: d
    }, d;
  }, V.createElement = function(d, R, N) {
    var z, j = {}, I = null;
    if (R != null)
      for (z in R.key !== void 0 && (I = "" + R.key), R)
        Cl.call(R, z) && z !== "key" && z !== "__self" && z !== "__source" && (j[z] = R[z]);
    var Z = arguments.length - 2;
    if (Z === 1) j.children = N;
    else if (1 < Z) {
      for (var kl = Array(Z), dl = 0; dl < Z; dl++)
        kl[dl] = arguments[dl + 2];
      j.children = kl;
    }
    if (d && d.defaultProps)
      for (z in Z = d.defaultProps, Z)
        j[z] === void 0 && (j[z] = Z[z]);
    return Xl(d, I, void 0, void 0, null, j);
  }, V.createRef = function() {
    return { current: null };
  }, V.forwardRef = function(d) {
    return { $$typeof: F, render: d };
  }, V.isValidElement = Tt, V.lazy = function(d) {
    return {
      $$typeof: C,
      _payload: { _status: -1, _result: d },
      _init: M
    };
  }, V.memo = function(d, R) {
    return {
      $$typeof: E,
      type: d,
      compare: R === void 0 ? null : R
    };
  }, V.startTransition = function(d) {
    var R = k.T, N = {};
    k.T = N;
    try {
      var z = d(), j = k.S;
      j !== null && j(N, z), typeof z == "object" && z !== null && typeof z.then == "function" && z.then(il, G);
    } catch (I) {
      G(I);
    } finally {
      k.T = R;
    }
  }, V.unstable_useCacheRefresh = function() {
    return k.H.useCacheRefresh();
  }, V.use = function(d) {
    return k.H.use(d);
  }, V.useActionState = function(d, R, N) {
    return k.H.useActionState(d, R, N);
  }, V.useCallback = function(d, R) {
    return k.H.useCallback(d, R);
  }, V.useContext = function(d) {
    return k.H.useContext(d);
  }, V.useDebugValue = function() {
  }, V.useDeferredValue = function(d, R) {
    return k.H.useDeferredValue(d, R);
  }, V.useEffect = function(d, R, N) {
    var z = k.H;
    if (typeof N == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return z.useEffect(d, R);
  }, V.useId = function() {
    return k.H.useId();
  }, V.useImperativeHandle = function(d, R, N) {
    return k.H.useImperativeHandle(d, R, N);
  }, V.useInsertionEffect = function(d, R) {
    return k.H.useInsertionEffect(d, R);
  }, V.useLayoutEffect = function(d, R) {
    return k.H.useLayoutEffect(d, R);
  }, V.useMemo = function(d, R) {
    return k.H.useMemo(d, R);
  }, V.useOptimistic = function(d, R) {
    return k.H.useOptimistic(d, R);
  }, V.useReducer = function(d, R, N) {
    return k.H.useReducer(d, R, N);
  }, V.useRef = function(d) {
    return k.H.useRef(d);
  }, V.useState = function(d) {
    return k.H.useState(d);
  }, V.useSyncExternalStore = function(d, R, N) {
    return k.H.useSyncExternalStore(
      d,
      R,
      N
    );
  }, V.useTransition = function() {
    return k.H.useTransition();
  }, V.version = "19.1.0", V;
}
var rr;
function df() {
  return rr || (rr = 1, uf.exports = Pv()), uf.exports;
}
var Al = df(), af = { exports: {} }, Aa = {}, nf = { exports: {} }, cf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vr;
function lh() {
  return vr || (vr = 1, function(f) {
    function g(A, M) {
      var G = A.length;
      A.push(M);
      l: for (; 0 < G; ) {
        var il = G - 1 >>> 1, d = A[il];
        if (0 < _(d, M))
          A[il] = M, A[G] = d, G = il;
        else break l;
      }
    }
    function h(A) {
      return A.length === 0 ? null : A[0];
    }
    function o(A) {
      if (A.length === 0) return null;
      var M = A[0], G = A.pop();
      if (G !== M) {
        A[0] = G;
        l: for (var il = 0, d = A.length, R = d >>> 1; il < R; ) {
          var N = 2 * (il + 1) - 1, z = A[N], j = N + 1, I = A[j];
          if (0 > _(z, G))
            j < d && 0 > _(I, z) ? (A[il] = I, A[j] = G, il = j) : (A[il] = z, A[N] = G, il = N);
          else if (j < d && 0 > _(I, G))
            A[il] = I, A[j] = G, il = j;
          else break l;
        }
      }
      return M;
    }
    function _(A, M) {
      var G = A.sortIndex - M.sortIndex;
      return G !== 0 ? G : A.id - M.id;
    }
    if (f.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var U = performance;
      f.unstable_now = function() {
        return U.now();
      };
    } else {
      var Q = Date, F = Q.now();
      f.unstable_now = function() {
        return Q.now() - F;
      };
    }
    var x = [], E = [], C = 1, tl = null, $ = 3, zl = !1, Ml = !1, wl = !1, Hl = !1, St = typeof setTimeout == "function" ? setTimeout : null, bt = typeof clearTimeout == "function" ? clearTimeout : null, ol = typeof setImmediate < "u" ? setImmediate : null;
    function nt(A) {
      for (var M = h(E); M !== null; ) {
        if (M.callback === null) o(E);
        else if (M.startTime <= A)
          o(E), M.sortIndex = M.expirationTime, g(x, M);
        else break;
        M = h(E);
      }
    }
    function k(A) {
      if (wl = !1, nt(A), !Ml)
        if (h(x) !== null)
          Ml = !0, Cl || (Cl = !0, Bl());
        else {
          var M = h(E);
          M !== null && jl(k, M.startTime - A);
        }
    }
    var Cl = !1, Xl = -1, $l = 5, Tt = -1;
    function Ce() {
      return Hl ? !0 : !(f.unstable_now() - Tt < $l);
    }
    function _t() {
      if (Hl = !1, Cl) {
        var A = f.unstable_now();
        Tt = A;
        var M = !0;
        try {
          l: {
            Ml = !1, wl && (wl = !1, bt(Xl), Xl = -1), zl = !0;
            var G = $;
            try {
              t: {
                for (nt(A), tl = h(x); tl !== null && !(tl.expirationTime > A && Ce()); ) {
                  var il = tl.callback;
                  if (typeof il == "function") {
                    tl.callback = null, $ = tl.priorityLevel;
                    var d = il(
                      tl.expirationTime <= A
                    );
                    if (A = f.unstable_now(), typeof d == "function") {
                      tl.callback = d, nt(A), M = !0;
                      break t;
                    }
                    tl === h(x) && o(x), nt(A);
                  } else o(x);
                  tl = h(x);
                }
                if (tl !== null) M = !0;
                else {
                  var R = h(E);
                  R !== null && jl(
                    k,
                    R.startTime - A
                  ), M = !1;
                }
              }
              break l;
            } finally {
              tl = null, $ = G, zl = !1;
            }
            M = void 0;
          }
        } finally {
          M ? Bl() : Cl = !1;
        }
      }
    }
    var Bl;
    if (typeof ol == "function")
      Bl = function() {
        ol(_t);
      };
    else if (typeof MessageChannel < "u") {
      var he = new MessageChannel(), ye = he.port2;
      he.port1.onmessage = _t, Bl = function() {
        ye.postMessage(null);
      };
    } else
      Bl = function() {
        St(_t, 0);
      };
    function jl(A, M) {
      Xl = St(function() {
        A(f.unstable_now());
      }, M);
    }
    f.unstable_IdlePriority = 5, f.unstable_ImmediatePriority = 1, f.unstable_LowPriority = 4, f.unstable_NormalPriority = 3, f.unstable_Profiling = null, f.unstable_UserBlockingPriority = 2, f.unstable_cancelCallback = function(A) {
      A.callback = null;
    }, f.unstable_forceFrameRate = function(A) {
      0 > A || 125 < A ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : $l = 0 < A ? Math.floor(1e3 / A) : 5;
    }, f.unstable_getCurrentPriorityLevel = function() {
      return $;
    }, f.unstable_next = function(A) {
      switch ($) {
        case 1:
        case 2:
        case 3:
          var M = 3;
          break;
        default:
          M = $;
      }
      var G = $;
      $ = M;
      try {
        return A();
      } finally {
        $ = G;
      }
    }, f.unstable_requestPaint = function() {
      Hl = !0;
    }, f.unstable_runWithPriority = function(A, M) {
      switch (A) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          A = 3;
      }
      var G = $;
      $ = A;
      try {
        return M();
      } finally {
        $ = G;
      }
    }, f.unstable_scheduleCallback = function(A, M, G) {
      var il = f.unstable_now();
      switch (typeof G == "object" && G !== null ? (G = G.delay, G = typeof G == "number" && 0 < G ? il + G : il) : G = il, A) {
        case 1:
          var d = -1;
          break;
        case 2:
          d = 250;
          break;
        case 5:
          d = 1073741823;
          break;
        case 4:
          d = 1e4;
          break;
        default:
          d = 5e3;
      }
      return d = G + d, A = {
        id: C++,
        callback: M,
        priorityLevel: A,
        startTime: G,
        expirationTime: d,
        sortIndex: -1
      }, G > il ? (A.sortIndex = G, g(E, A), h(x) === null && A === h(E) && (wl ? (bt(Xl), Xl = -1) : wl = !0, jl(k, G - il))) : (A.sortIndex = d, g(x, A), Ml || zl || (Ml = !0, Cl || (Cl = !0, Bl()))), A;
    }, f.unstable_shouldYield = Ce, f.unstable_wrapCallback = function(A) {
      var M = $;
      return function() {
        var G = $;
        $ = M;
        try {
          return A.apply(this, arguments);
        } finally {
          $ = G;
        }
      };
    };
  }(cf)), cf;
}
var hr;
function th() {
  return hr || (hr = 1, nf.exports = lh()), nf.exports;
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
var yr;
function eh() {
  if (yr) return Gl;
  yr = 1;
  var f = df();
  function g(x) {
    var E = "https://react.dev/errors/" + x;
    if (1 < arguments.length) {
      E += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var C = 2; C < arguments.length; C++)
        E += "&args[]=" + encodeURIComponent(arguments[C]);
    }
    return "Minified React error #" + x + "; visit " + E + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
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
  }, _ = Symbol.for("react.portal");
  function U(x, E, C) {
    var tl = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: _,
      key: tl == null ? null : "" + tl,
      children: x,
      containerInfo: E,
      implementation: C
    };
  }
  var Q = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function F(x, E) {
    if (x === "font") return "";
    if (typeof E == "string")
      return E === "use-credentials" ? E : "";
  }
  return Gl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Gl.createPortal = function(x, E) {
    var C = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!E || E.nodeType !== 1 && E.nodeType !== 9 && E.nodeType !== 11)
      throw Error(g(299));
    return U(x, E, null, C);
  }, Gl.flushSync = function(x) {
    var E = Q.T, C = o.p;
    try {
      if (Q.T = null, o.p = 2, x) return x();
    } finally {
      Q.T = E, o.p = C, o.d.f();
    }
  }, Gl.preconnect = function(x, E) {
    typeof x == "string" && (E ? (E = E.crossOrigin, E = typeof E == "string" ? E === "use-credentials" ? E : "" : void 0) : E = null, o.d.C(x, E));
  }, Gl.prefetchDNS = function(x) {
    typeof x == "string" && o.d.D(x);
  }, Gl.preinit = function(x, E) {
    if (typeof x == "string" && E && typeof E.as == "string") {
      var C = E.as, tl = F(C, E.crossOrigin), $ = typeof E.integrity == "string" ? E.integrity : void 0, zl = typeof E.fetchPriority == "string" ? E.fetchPriority : void 0;
      C === "style" ? o.d.S(
        x,
        typeof E.precedence == "string" ? E.precedence : void 0,
        {
          crossOrigin: tl,
          integrity: $,
          fetchPriority: zl
        }
      ) : C === "script" && o.d.X(x, {
        crossOrigin: tl,
        integrity: $,
        fetchPriority: zl,
        nonce: typeof E.nonce == "string" ? E.nonce : void 0
      });
    }
  }, Gl.preinitModule = function(x, E) {
    if (typeof x == "string")
      if (typeof E == "object" && E !== null) {
        if (E.as == null || E.as === "script") {
          var C = F(
            E.as,
            E.crossOrigin
          );
          o.d.M(x, {
            crossOrigin: C,
            integrity: typeof E.integrity == "string" ? E.integrity : void 0,
            nonce: typeof E.nonce == "string" ? E.nonce : void 0
          });
        }
      } else E == null && o.d.M(x);
  }, Gl.preload = function(x, E) {
    if (typeof x == "string" && typeof E == "object" && E !== null && typeof E.as == "string") {
      var C = E.as, tl = F(C, E.crossOrigin);
      o.d.L(x, C, {
        crossOrigin: tl,
        integrity: typeof E.integrity == "string" ? E.integrity : void 0,
        nonce: typeof E.nonce == "string" ? E.nonce : void 0,
        type: typeof E.type == "string" ? E.type : void 0,
        fetchPriority: typeof E.fetchPriority == "string" ? E.fetchPriority : void 0,
        referrerPolicy: typeof E.referrerPolicy == "string" ? E.referrerPolicy : void 0,
        imageSrcSet: typeof E.imageSrcSet == "string" ? E.imageSrcSet : void 0,
        imageSizes: typeof E.imageSizes == "string" ? E.imageSizes : void 0,
        media: typeof E.media == "string" ? E.media : void 0
      });
    }
  }, Gl.preloadModule = function(x, E) {
    if (typeof x == "string")
      if (E) {
        var C = F(E.as, E.crossOrigin);
        o.d.m(x, {
          as: typeof E.as == "string" && E.as !== "script" ? E.as : void 0,
          crossOrigin: C,
          integrity: typeof E.integrity == "string" ? E.integrity : void 0
        });
      } else o.d.m(x);
  }, Gl.requestFormReset = function(x) {
    o.d.r(x);
  }, Gl.unstable_batchedUpdates = function(x, E) {
    return x(E);
  }, Gl.useFormState = function(x, E, C) {
    return Q.H.useFormState(x, E, C);
  }, Gl.useFormStatus = function() {
    return Q.H.useHostTransitionStatus();
  }, Gl.version = "19.1.0", Gl;
}
var mr;
function uh() {
  if (mr) return ff.exports;
  mr = 1;
  function f() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (g) {
        console.error(g);
      }
  }
  return f(), ff.exports = eh(), ff.exports;
}
var gr;
function ah() {
  if (gr) return Aa;
  gr = 1;
  /**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = th(), g = df(), h = uh();
  function o(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        t += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function _(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function U(l) {
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
  function Q(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function F(l) {
    if (U(l) !== l)
      throw Error(o(188));
  }
  function x(l) {
    var t = l.alternate;
    if (!t) {
      if (t = U(l), t === null) throw Error(o(188));
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
          if (n === e) return F(a), l;
          if (n === u) return F(a), t;
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
  function E(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = E(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  var C = Object.assign, tl = Symbol.for("react.element"), $ = Symbol.for("react.transitional.element"), zl = Symbol.for("react.portal"), Ml = Symbol.for("react.fragment"), wl = Symbol.for("react.strict_mode"), Hl = Symbol.for("react.profiler"), St = Symbol.for("react.provider"), bt = Symbol.for("react.consumer"), ol = Symbol.for("react.context"), nt = Symbol.for("react.forward_ref"), k = Symbol.for("react.suspense"), Cl = Symbol.for("react.suspense_list"), Xl = Symbol.for("react.memo"), $l = Symbol.for("react.lazy"), Tt = Symbol.for("react.activity"), Ce = Symbol.for("react.memo_cache_sentinel"), _t = Symbol.iterator;
  function Bl(l) {
    return l === null || typeof l != "object" ? null : (l = _t && l[_t] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var he = Symbol.for("react.client.reference");
  function ye(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === he ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case Ml:
        return "Fragment";
      case Hl:
        return "Profiler";
      case wl:
        return "StrictMode";
      case k:
        return "Suspense";
      case Cl:
        return "SuspenseList";
      case Tt:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case zl:
          return "Portal";
        case ol:
          return (l.displayName || "Context") + ".Provider";
        case bt:
          return (l._context.displayName || "Context") + ".Consumer";
        case nt:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case Xl:
          return t = l.displayName || null, t !== null ? t : ye(l.type) || "Memo";
        case $l:
          t = l._payload, l = l._init;
          try {
            return ye(l(t));
          } catch {
          }
      }
    return null;
  }
  var jl = Array.isArray, A = g.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, M = h.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, G = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, il = [], d = -1;
  function R(l) {
    return { current: l };
  }
  function N(l) {
    0 > d || (l.current = il[d], il[d] = null, d--);
  }
  function z(l, t) {
    d++, il[d] = l.current, l.current = t;
  }
  var j = R(null), I = R(null), Z = R(null), kl = R(null);
  function dl(l, t) {
    switch (z(Z, t), z(I, l), z(j, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? qd(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = qd(t), l = Yd(t, l);
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
    N(j), z(j, l);
  }
  function Vt() {
    N(j), N(I), N(Z);
  }
  function Qn(l) {
    l.memoizedState !== null && z(kl, l);
    var t = j.current, e = Yd(t, l.type);
    t !== e && (z(I, l), z(j, e));
  }
  function pa(l) {
    I.current === l && (N(j), N(I)), kl.current === l && (N(kl), ma._currentValue = G);
  }
  var Zn = Object.prototype.hasOwnProperty, Vn = f.unstable_scheduleCallback, Ln = f.unstable_cancelCallback, Mr = f.unstable_shouldYield, Ur = f.unstable_requestPaint, Et = f.unstable_now, Nr = f.unstable_getCurrentPriorityLevel, mf = f.unstable_ImmediatePriority, gf = f.unstable_UserBlockingPriority, Da = f.unstable_NormalPriority, xr = f.unstable_LowPriority, Sf = f.unstable_IdlePriority, Hr = f.log, Cr = f.unstable_setDisableYieldValue, Du = null, Wl = null;
  function Lt(l) {
    if (typeof Hr == "function" && Cr(l), Wl && typeof Wl.setStrictMode == "function")
      try {
        Wl.setStrictMode(Du, l);
      } catch {
      }
  }
  var Fl = Math.clz32 ? Math.clz32 : qr, Br = Math.log, jr = Math.LN2;
  function qr(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (Br(l) / jr | 0) | 0;
  }
  var Oa = 256, Ra = 4194304;
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
  function Ou(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Yr(l, t) {
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
    var l = Oa;
    return Oa <<= 1, (Oa & 4194048) === 0 && (Oa = 256), l;
  }
  function Tf() {
    var l = Ra;
    return Ra <<= 1, (Ra & 62914560) === 0 && (Ra = 4194304), l;
  }
  function Kn(l) {
    for (var t = [], e = 0; 31 > e; e++) t.push(l);
    return t;
  }
  function Ru(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function Gr(l, t, e, u, a, n) {
    var c = l.pendingLanes;
    l.pendingLanes = e, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= e, l.entangledLanes &= e, l.errorRecoveryDisabledLanes &= e, l.shellSuspendCounter = 0;
    var i = l.entanglements, s = l.expirationTimes, m = l.hiddenUpdates;
    for (e = c & ~e; 0 < e; ) {
      var T = 31 - Fl(e), D = 1 << T;
      i[T] = 0, s[T] = -1;
      var S = m[T];
      if (S !== null)
        for (m[T] = null, T = 0; T < S.length; T++) {
          var b = S[T];
          b !== null && (b.lane &= -536870913);
        }
      e &= ~D;
    }
    u !== 0 && Ef(l, u, 0), n !== 0 && a === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(c & ~t));
  }
  function Ef(l, t, e) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var u = 31 - Fl(t);
    l.entangledLanes |= t, l.entanglements[u] = l.entanglements[u] | 1073741824 | e & 4194090;
  }
  function Af(l, t) {
    var e = l.entangledLanes |= t;
    for (l = l.entanglements; e; ) {
      var u = 31 - Fl(e), a = 1 << u;
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
  function pf() {
    var l = M.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : ur(l.type));
  }
  function Xr(l, t) {
    var e = M.p;
    try {
      return M.p = l, t();
    } finally {
      M.p = e;
    }
  }
  var Kt = Math.random().toString(36).slice(2), ql = "__reactFiber$" + Kt, Zl = "__reactProps$" + Kt, Be = "__reactContainer$" + Kt, $n = "__reactEvents$" + Kt, Qr = "__reactListeners$" + Kt, Zr = "__reactHandles$" + Kt, Df = "__reactResources$" + Kt, _u = "__reactMarker$" + Kt;
  function kn(l) {
    delete l[ql], delete l[Zl], delete l[$n], delete l[Qr], delete l[Zr];
  }
  function je(l) {
    var t = l[ql];
    if (t) return t;
    for (var e = l.parentNode; e; ) {
      if (t = e[Be] || e[ql]) {
        if (e = t.alternate, t.child !== null || e !== null && e.child !== null)
          for (l = Zd(l); l !== null; ) {
            if (e = l[ql]) return e;
            l = Zd(l);
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
  function pl(l) {
    l[_u] = !0;
  }
  var Of = /* @__PURE__ */ new Set(), Rf = {};
  function ge(l, t) {
    Ge(l, t), Ge(l + "Capture", t);
  }
  function Ge(l, t) {
    for (Rf[l] = t, l = 0; l < t.length; l++)
      Of.add(t[l]);
  }
  var Vr = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), _f = {}, zf = {};
  function Lr(l) {
    return Zn.call(zf, l) ? !0 : Zn.call(_f, l) ? !1 : Vr.test(l) ? zf[l] = !0 : (_f[l] = !0, !1);
  }
  function za(l, t, e) {
    if (Lr(t))
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
                  var T = `
` + s[u].replace(" at new ", " at ");
                  return l.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", l.displayName)), T;
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
  function Kr(l) {
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
        t += Kr(l), l = l.return;
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
  function Jr(l) {
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
    l._valueTracker || (l._valueTracker = Jr(l));
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
  var wr = /[\n"\\]/g;
  function it(l) {
    return l.replace(
      wr,
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
  var $r = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function jf(l, t, e) {
    var u = t.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === "" ? u ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : u ? l.setProperty(t, e) : typeof e != "number" || e === 0 || $r.has(t) ? t === "float" ? l.cssFloat = e : l[t] = ("" + e).trim() : l[t] = e + "px";
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
  var kr = /* @__PURE__ */ new Map([
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
  ]), Wr = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function xa(l) {
    return Wr.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  var ec = null;
  function uc(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var Ve = null, Le = null;
  function Yf(l) {
    var t = qe(l);
    if (t && (l = t.stateNode)) {
      var e = l[Zl] || null;
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
                var a = u[Zl] || null;
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
    var u = e[Zl] || null;
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
  function Vl(l) {
    function t(e, u, a, n, c) {
      this._reactName = e, this._targetInst = a, this.type = u, this.nativeEvent = n, this.target = c, this.currentTarget = null;
      for (var i in l)
        l.hasOwnProperty(i) && (e = l[i], this[i] = e ? e(n) : n[i]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Ba : Qf, this.isPropagationStopped = Qf, this;
    }
    return C(t.prototype, {
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
  }, ja = Vl(Se), Nu = C({}, Se, { view: 0, detail: 0 }), Fr = Vl(Nu), ic, fc, xu, qa = C({}, Nu, {
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
  }), Zf = Vl(qa), Ir = C({}, qa, { dataTransfer: 0 }), Pr = Vl(Ir), l0 = C({}, Nu, { relatedTarget: 0 }), sc = Vl(l0), t0 = C({}, Se, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), e0 = Vl(t0), u0 = C({}, Se, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), a0 = Vl(u0), n0 = C({}, Se, { data: 0 }), Vf = Vl(n0), c0 = {
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
  }, i0 = {
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
  }, f0 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function s0(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = f0[l]) ? !!t[l] : !1;
  }
  function oc() {
    return s0;
  }
  var o0 = C({}, Nu, {
    key: function(l) {
      if (l.key) {
        var t = c0[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = Ca(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? i0[l.keyCode] || "Unidentified" : "";
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
  }), d0 = Vl(o0), r0 = C({}, qa, {
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
  }), Lf = Vl(r0), v0 = C({}, Nu, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: oc
  }), h0 = Vl(v0), y0 = C({}, Se, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), m0 = Vl(y0), g0 = C({}, qa, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), S0 = Vl(g0), b0 = C({}, Se, {
    newState: 0,
    oldState: 0
  }), T0 = Vl(b0), E0 = [9, 13, 27, 32], dc = Mt && "CompositionEvent" in window, Hu = null;
  Mt && "documentMode" in document && (Hu = document.documentMode);
  var A0 = Mt && "TextEvent" in window && !Hu, Kf = Mt && (!dc || Hu && 8 < Hu && 11 >= Hu), Jf = " ", wf = !1;
  function $f(l, t) {
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
  function kf(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var Ke = !1;
  function p0(l, t) {
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
  function D0(l, t) {
    if (Ke)
      return l === "compositionend" || !dc && $f(l, t) ? (l = Xf(), Ha = cc = Jt = null, Ke = !1, l) : null;
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
  var O0 = {
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
    return t === "input" ? !!O0[l.type] : t === "textarea";
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
  function R0(l) {
    xd(l, 0);
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
    var rc;
    if (Mt) {
      var vc = "oninput" in document;
      if (!vc) {
        var ls = document.createElement("div");
        ls.setAttribute("oninput", "return;"), vc = typeof ls.oninput == "function";
      }
      rc = vc;
    } else rc = !1;
    Pf = rc && (!document.documentMode || 9 < document.documentMode);
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
      ), Gf(R0, t);
    }
  }
  function _0(l, t, e) {
    l === "focusin" ? (ts(), Cu = t, Bu = e, Cu.attachEvent("onpropertychange", es)) : l === "focusout" && ts();
  }
  function z0(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Ya(Bu);
  }
  function M0(l, t) {
    if (l === "click") return Ya(t);
  }
  function U0(l, t) {
    if (l === "input" || l === "change")
      return Ya(t);
  }
  function N0(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var Il = typeof Object.is == "function" ? Object.is : N0;
  function ju(l, t) {
    if (Il(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var e = Object.keys(l), u = Object.keys(t);
    if (e.length !== u.length) return !1;
    for (u = 0; u < e.length; u++) {
      var a = e[u];
      if (!Zn.call(t, a) || !Il(l[a], t[a]))
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
  function hc(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var x0 = Mt && "documentMode" in document && 11 >= document.documentMode, Je = null, yc = null, qu = null, mc = !1;
  function is(l, t, e) {
    var u = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    mc || Je == null || Je !== Na(u) || (u = Je, "selectionStart" in u && hc(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = {
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
  var ss = Te("animationend"), os = Te("animationiteration"), ds = Te("animationstart"), H0 = Te("transitionrun"), C0 = Te("transitionstart"), B0 = Te("transitioncancel"), rs = Te("transitionend"), vs = /* @__PURE__ */ new Map(), Sc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Sc.push("scrollEnd");
  function yt(l, t) {
    vs.set(l, t), ge(t, [l]);
  }
  var hs = /* @__PURE__ */ new WeakMap();
  function ft(l, t) {
    if (typeof l == "object" && l !== null) {
      var e = hs.get(l);
      return e !== void 0 ? e : (t = {
        value: l,
        source: t,
        stack: Uf(t)
      }, hs.set(l, t), t);
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
    return l.tag === 3 ? (n = l.stateNode, a && t !== null && (a = 31 - Fl(e), l = n.hiddenUpdates, u = l[a], u === null ? l[a] = [t] : u.push(t), t.lane = e | 536870912), n) : null;
  }
  function Qa(l) {
    if (50 < fa)
      throw fa = 0, Ri = null, Error(o(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var We = {};
  function j0(l, t, e, u) {
    this.tag = l, this.key = e, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Pl(l, t, e, u) {
    return new j0(l, t, e, u);
  }
  function Ec(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function Ut(l, t) {
    var e = l.alternate;
    return e === null ? (e = Pl(
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
    if (u = l, typeof l == "function") Ec(l) && (c = 1);
    else if (typeof l == "string")
      c = Yv(
        l,
        e,
        j.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (l) {
        case Tt:
          return l = Pl(31, e, t, a), l.elementType = Tt, l.lanes = n, l;
        case Ml:
          return Ee(e.children, a, n, t);
        case wl:
          c = 8, a |= 24;
          break;
        case Hl:
          return l = Pl(12, e, t, a | 2), l.elementType = Hl, l.lanes = n, l;
        case k:
          return l = Pl(13, e, t, a), l.elementType = k, l.lanes = n, l;
        case Cl:
          return l = Pl(19, e, t, a), l.elementType = Cl, l.lanes = n, l;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case St:
              case ol:
                c = 10;
                break l;
              case bt:
                c = 9;
                break l;
              case nt:
                c = 11;
                break l;
              case Xl:
                c = 14;
                break l;
              case $l:
                c = 16, u = null;
                break l;
            }
          c = 29, e = Error(
            o(130, l === null ? "null" : typeof l, "")
          ), u = null;
      }
    return t = Pl(c, e, t, a), t.elementType = l, t.type = u, t.lanes = n, t;
  }
  function Ee(l, t, e, u) {
    return l = Pl(7, l, u, t), l.lanes = e, l;
  }
  function Ac(l, t, e) {
    return l = Pl(6, l, null, t), l.lanes = e, l;
  }
  function pc(l, t, e) {
    return t = Pl(
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
  var Fe = [], Ie = 0, Va = null, La = 0, ot = [], dt = 0, Ae = null, Nt = 1, xt = "";
  function pe(l, t) {
    Fe[Ie++] = La, Fe[Ie++] = Va, Va = l, La = t;
  }
  function gs(l, t, e) {
    ot[dt++] = Nt, ot[dt++] = xt, ot[dt++] = Ae, Ae = l;
    var u = Nt;
    l = xt;
    var a = 32 - Fl(u) - 1;
    u &= ~(1 << a), e += 1;
    var n = 32 - Fl(t) + a;
    if (30 < n) {
      var c = a - a % 5;
      n = (u & (1 << c) - 1).toString(32), u >>= c, a -= c, Nt = 1 << 32 - Fl(t) + a | e << a | u, xt = n + l;
    } else
      Nt = 1 << n | e << a | u, xt = l;
  }
  function Dc(l) {
    l.return !== null && (pe(l, 1), gs(l, 1, 0));
  }
  function Oc(l) {
    for (; l === Va; )
      Va = Fe[--Ie], Fe[Ie] = null, La = Fe[--Ie], Fe[Ie] = null;
    for (; l === Ae; )
      Ae = ot[--dt], ot[dt] = null, xt = ot[--dt], ot[dt] = null, Nt = ot[--dt], ot[dt] = null;
  }
  var Ql = null, hl = null, ll = !1, De = null, At = !1, Rc = Error(o(519));
  function Oe(l) {
    var t = Error(o(418, ""));
    throw Xu(ft(t, l)), Rc;
  }
  function Ss(l) {
    var t = l.stateNode, e = l.type, u = l.memoizedProps;
    switch (t[ql] = l, t[Zl] = u, e) {
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
        for (e = 0; e < oa.length; e++)
          w(oa[e], t);
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
        w("invalid", t), Hf(
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
        w("invalid", t);
        break;
      case "textarea":
        w("invalid", t), Bf(t, u.value, u.defaultValue, u.children), Ua(t);
    }
    e = u.children, typeof e != "string" && typeof e != "number" && typeof e != "bigint" || t.textContent === "" + e || u.suppressHydrationWarning === !0 || jd(t.textContent, e) ? (u.popover != null && (w("beforetoggle", t), w("toggle", t)), u.onScroll != null && w("scroll", t), u.onScrollEnd != null && w("scrollend", t), u.onClick != null && (t.onclick = On), t = !0) : t = !1, t || Oe(l);
  }
  function bs(l) {
    for (Ql = l.return; Ql; )
      switch (Ql.tag) {
        case 5:
        case 13:
          At = !1;
          return;
        case 27:
        case 3:
          At = !0;
          return;
        default:
          Ql = Ql.return;
      }
  }
  function Yu(l) {
    if (l !== Ql) return !1;
    if (!ll) return bs(l), ll = !0, !1;
    var t = l.tag, e;
    if ((e = t !== 3 && t !== 27) && ((e = t === 5) && (e = l.type, e = !(e !== "form" && e !== "button") || Zi(l.type, l.memoizedProps)), e = !e), e && hl && Oe(l), bs(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(317));
      l: {
        for (l = l.nextSibling, t = 0; l; ) {
          if (l.nodeType === 8)
            if (e = l.data, e === "/$") {
              if (t === 0) {
                hl = gt(l.nextSibling);
                break l;
              }
              t--;
            } else
              e !== "$" && e !== "$!" && e !== "$?" || t++;
          l = l.nextSibling;
        }
        hl = null;
      }
    } else
      t === 27 ? (t = hl, fe(l.type) ? (l = Ji, Ji = null, hl = l) : hl = t) : hl = Ql ? gt(l.stateNode.nextSibling) : null;
    return !0;
  }
  function Gu() {
    hl = Ql = null, ll = !1;
  }
  function Ts() {
    var l = De;
    return l !== null && (Jl === null ? Jl = l : Jl.push.apply(
      Jl,
      l
    ), De = null), l;
  }
  function Xu(l) {
    De === null ? De = [l] : De.push(l);
  }
  var _c = R(null), Re = null, Ht = null;
  function wt(l, t, e) {
    z(_c, t._currentValue), t._currentValue = e;
  }
  function Ct(l) {
    l._currentValue = _c.current, N(_c);
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
          Il(a.pendingProps.value, c.value) || (l !== null ? l.push(i) : l = [i]);
        }
      } else if (a === kl.current) {
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
      if (!Il(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function _e(l) {
    Re = l, Ht = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function Yl(l) {
    return Es(Re, l);
  }
  function Ja(l, t) {
    return Re === null && _e(l), Es(l, t);
  }
  function Es(l, t) {
    var e = t._currentValue;
    if (t = { context: t, memoizedValue: e, next: null }, Ht === null) {
      if (l === null) throw Error(o(308));
      Ht = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else Ht = Ht.next = t;
    return e;
  }
  var q0 = typeof AbortController < "u" ? AbortController : function() {
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
  }, Y0 = f.unstable_scheduleCallback, G0 = f.unstable_NormalPriority, Tl = {
    $$typeof: ol,
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
  function Zu(l) {
    l.refCount--, l.refCount === 0 && Y0(G0, function() {
      l.controller.abort();
    });
  }
  var Vu = null, Nc = 0, Pe = 0, lu = null;
  function X0(l, t) {
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
    return Nc++, t.then(As, As), t;
  }
  function As() {
    if (--Nc === 0 && Vu !== null) {
      lu !== null && (lu.status = "fulfilled");
      var l = Vu;
      Vu = null, Pe = 0, lu = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function Q0(l, t) {
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
  var ps = A.S;
  A.S = function(l, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && X0(l, t), ps !== null && ps(l, t);
  };
  var ze = R(null);
  function xc() {
    var l = ze.current;
    return l !== null ? l : sl.pooledCache;
  }
  function wa(l, t) {
    t === null ? z(ze, ze.current) : z(ze, t.pool);
  }
  function Ds() {
    var l = xc();
    return l === null ? null : { parent: Tl._currentValue, pool: l };
  }
  var Lu = Error(o(460)), Os = Error(o(474)), $a = Error(o(542)), Hc = { then: function() {
  } };
  function Rs(l) {
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
      u &= l.pendingLanes, e |= u, t.lanes = e, Af(l, e);
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
      var T = l.alternate;
      T !== null && (T = T.updateQueue, i = T.lastBaseUpdate, i !== c && (i === null ? T.firstBaseUpdate = m : i.next = m, T.lastBaseUpdate = s));
    }
    if (n !== null) {
      var D = a.baseState;
      c = 0, T = m = s = null, i = n;
      do {
        var S = i.lane & -536870913, b = S !== i.lane;
        if (b ? (W & S) === S : (u & S) === S) {
          S !== 0 && S === Pe && (qc = !0), T !== null && (T = T.next = {
            lane: 0,
            tag: i.tag,
            payload: i.payload,
            callback: null,
            next: null
          });
          l: {
            var X = l, q = i;
            S = t;
            var cl = e;
            switch (q.tag) {
              case 1:
                if (X = q.payload, typeof X == "function") {
                  D = X.call(cl, D, S);
                  break l;
                }
                D = X;
                break l;
              case 3:
                X.flags = X.flags & -65537 | 128;
              case 0:
                if (X = q.payload, S = typeof X == "function" ? X.call(cl, D, S) : X, S == null) break l;
                D = C({}, D, S);
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
          }, T === null ? (m = T = b, s = D) : T = T.next = b, c |= S;
        if (i = i.next, i === null) {
          if (i = a.shared.pending, i === null)
            break;
          b = i, i = b.next, b.next = null, a.lastBaseUpdate = b, a.shared.pending = null;
        }
      } while (!0);
      T === null && (s = D), a.baseState = s, a.firstBaseUpdate = m, a.lastBaseUpdate = T, n === null && (a.shared.lanes = 0), ae |= c, l.lanes = c, l.memoizedState = D;
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
  var tu = R(null), Wa = R(0);
  function xs(l, t) {
    l = Qt, z(Wa, l), z(tu, t), Qt = l | t.baseLanes;
  }
  function Yc() {
    z(Wa, Qt), z(tu, tu.current);
  }
  function Gc() {
    Qt = Wa.current, N(tu), N(Wa);
  }
  var Ft = 0, L = null, al = null, Sl = null, Fa = !1, eu = !1, Me = !1, Ia = 0, ku = 0, uu = null, Z0 = 0;
  function ml() {
    throw Error(o(321));
  }
  function Xc(l, t) {
    if (t === null) return !1;
    for (var e = 0; e < t.length && e < l.length; e++)
      if (!Il(l[e], t[e])) return !1;
    return !0;
  }
  function Qc(l, t, e, u, a, n) {
    return Ft = n, L = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, A.H = l === null || l.memoizedState === null ? mo : go, Me = !1, n = e(u, a), Me = !1, eu && (n = Cs(
      t,
      e,
      u,
      a
    )), Hs(l), n;
  }
  function Hs(l) {
    A.H = an;
    var t = al !== null && al.next !== null;
    if (Ft = 0, Sl = al = L = null, Fa = !1, ku = 0, uu = null, t) throw Error(o(300));
    l === null || Dl || (l = l.dependencies, l !== null && Ka(l) && (Dl = !0));
  }
  function Cs(l, t, e, u) {
    L = l;
    var a = 0;
    do {
      if (eu && (uu = null), ku = 0, eu = !1, 25 <= a) throw Error(o(301));
      if (a += 1, Sl = al = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      A.H = k0, n = t(e, u);
    } while (eu);
    return n;
  }
  function V0() {
    var l = A.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? Wu(t) : t, l = l.useState()[0], (al !== null ? al.memoizedState : null) !== l && (L.flags |= 1024), t;
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
    Ft = 0, Sl = al = L = null, eu = !1, ku = Ia = 0, uu = null;
  }
  function Ll() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Sl === null ? L.memoizedState = Sl = l : Sl = Sl.next = l, Sl;
  }
  function bl() {
    if (al === null) {
      var l = L.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = al.next;
    var t = Sl === null ? L.memoizedState : Sl.next;
    if (t !== null)
      Sl = t, al = l;
    else {
      if (l === null)
        throw L.alternate === null ? Error(o(467)) : Error(o(310));
      al = l, l = {
        memoizedState: al.memoizedState,
        baseState: al.baseState,
        baseQueue: al.baseQueue,
        queue: al.queue,
        next: null
      }, Sl === null ? L.memoizedState = Sl = l : Sl = Sl.next = l;
    }
    return Sl;
  }
  function Kc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Wu(l) {
    var t = ku;
    return ku += 1, uu === null && (uu = []), l = _s(uu, l, t), t = L, (Sl === null ? t.memoizedState : Sl.next) === null && (t = t.alternate, A.H = t === null || t.memoizedState === null ? mo : go), l;
  }
  function Pa(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return Wu(l);
      if (l.$$typeof === ol) return Yl(l);
    }
    throw Error(o(438, String(l)));
  }
  function Jc(l) {
    var t = null, e = L.updateQueue;
    if (e !== null && (t = e.memoCache), t == null) {
      var u = L.alternate;
      u !== null && (u = u.updateQueue, u !== null && (u = u.memoCache, u != null && (t = {
        data: u.data.map(function(a) {
          return a.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), e === null && (e = Kc(), L.updateQueue = e), e.memoCache = t, e = t.data[t.index], e === void 0)
      for (e = t.data[t.index] = Array(l), u = 0; u < l; u++)
        e[u] = Ce;
    return t.index++, e;
  }
  function Bt(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function ln(l) {
    var t = bl();
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
      var i = c = null, s = null, m = t, T = !1;
      do {
        var D = m.lane & -536870913;
        if (D !== m.lane ? (W & D) === D : (Ft & D) === D) {
          var S = m.revertLane;
          if (S === 0)
            s !== null && (s = s.next = {
              lane: 0,
              revertLane: 0,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null
            }), D === Pe && (T = !0);
          else if ((Ft & S) === S) {
            m = m.next, S === Pe && (T = !0);
            continue;
          } else
            D = {
              lane: 0,
              revertLane: m.revertLane,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null
            }, s === null ? (i = s = D, c = n) : s = s.next = D, L.lanes |= S, ae |= S;
          D = m.action, Me && e(n, D), n = m.hasEagerState ? m.eagerState : e(n, D);
        } else
          S = {
            lane: D,
            revertLane: m.revertLane,
            action: m.action,
            hasEagerState: m.hasEagerState,
            eagerState: m.eagerState,
            next: null
          }, s === null ? (i = s = S, c = n) : s = s.next = S, L.lanes |= D, ae |= D;
        m = m.next;
      } while (m !== null && m !== t);
      if (s === null ? c = n : s.next = i, !Il(n, l.memoizedState) && (Dl = !0, T && (e = lu, e !== null)))
        throw e;
      l.memoizedState = n, l.baseState = c, l.baseQueue = s, u.lastRenderedState = n;
    }
    return a === null && (u.lanes = 0), [l.memoizedState, u.dispatch];
  }
  function $c(l) {
    var t = bl(), e = t.queue;
    if (e === null) throw Error(o(311));
    e.lastRenderedReducer = l;
    var u = e.dispatch, a = e.pending, n = t.memoizedState;
    if (a !== null) {
      e.pending = null;
      var c = a = a.next;
      do
        n = l(n, c.action), c = c.next;
      while (c !== a);
      Il(n, t.memoizedState) || (Dl = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), e.lastRenderedState = n;
    }
    return [n, u];
  }
  function Bs(l, t, e) {
    var u = L, a = bl(), n = ll;
    if (n) {
      if (e === void 0) throw Error(o(407));
      e = e();
    } else e = t();
    var c = !Il(
      (al || a).memoizedState,
      e
    );
    c && (a.memoizedState = e, Dl = !0), a = a.queue;
    var i = Ys.bind(null, u, a, l);
    if (Fu(2048, 8, i, [l]), a.getSnapshot !== t || c || Sl !== null && Sl.memoizedState.tag & 1) {
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
    l.flags |= 16384, l = { getSnapshot: t, value: e }, t = L.updateQueue, t === null ? (t = Kc(), L.updateQueue = t, t.stores = [l]) : (e = t.stores, e === null ? t.stores = [l] : e.push(l));
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
      return !Il(l, e);
    } catch {
      return !0;
    }
  }
  function Xs(l) {
    var t = ke(l, 2);
    t !== null && at(t, l, 2);
  }
  function kc(l) {
    var t = Ll();
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
  function L0(l, t, e, u, a) {
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
      A.T !== null ? e(!0) : n.isTransition = !1, u(n), e = t.pending, e === null ? (n.next = t.pending = n, Zs(t, n)) : (n.next = e.next, t.pending = e.next = n);
    }
  }
  function Zs(l, t) {
    var e = t.action, u = t.payload, a = l.state;
    if (t.isTransition) {
      var n = A.T, c = {};
      A.T = c;
      try {
        var i = e(a, u), s = A.S;
        s !== null && s(c, i), Vs(l, t, i);
      } catch (m) {
        Wc(l, t, m);
      } finally {
        A.T = n;
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
    if (ll) {
      var e = sl.formState;
      if (e !== null) {
        l: {
          var u = L;
          if (ll) {
            if (hl) {
              t: {
                for (var a = hl, n = At; a.nodeType !== 8; ) {
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
                hl = gt(
                  a.nextSibling
                ), u = a.data === "F!";
                break l;
              }
            }
            Oe(u);
          }
          u = !1;
        }
        u && (t = e[0]);
      }
    }
    return e = Ll(), e.memoizedState = e.baseState = t, u = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Js,
      lastRenderedState: t
    }, e.queue = u, e = vo.bind(
      null,
      L,
      u
    ), u.dispatch = e, u = kc(!1), n = ti.bind(
      null,
      L,
      !1,
      u.queue
    ), u = Ll(), a = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, u.queue = a, e = L0.bind(
      null,
      L,
      a,
      n,
      e
    ), a.dispatch = e, u.memoizedState = l, [t, e, !1];
  }
  function $s(l) {
    var t = bl();
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
    t = bl();
    var a = t.queue, n = a.dispatch;
    return e !== t.memoizedState && (L.flags |= 2048, au(
      9,
      tn(),
      K0.bind(null, a, e),
      null
    )), [u, n, l];
  }
  function K0(l, t) {
    l.action = t;
  }
  function Ws(l) {
    var t = bl(), e = al;
    if (e !== null)
      return ks(t, e, l);
    bl(), t = t.memoizedState, e = bl();
    var u = e.queue.dispatch;
    return e.memoizedState = l, [t, u, !1];
  }
  function au(l, t, e, u) {
    return l = { tag: l, create: e, deps: u, inst: t, next: null }, t = L.updateQueue, t === null && (t = Kc(), L.updateQueue = t), e = t.lastEffect, e === null ? t.lastEffect = l.next = l : (u = e.next, e.next = l, l.next = u, t.lastEffect = l), l;
  }
  function tn() {
    return { destroy: void 0, resource: void 0 };
  }
  function Fs() {
    return bl().memoizedState;
  }
  function en(l, t, e, u) {
    var a = Ll();
    u = u === void 0 ? null : u, L.flags |= l, a.memoizedState = au(
      1 | t,
      tn(),
      e,
      u
    );
  }
  function Fu(l, t, e, u) {
    var a = bl();
    u = u === void 0 ? null : u;
    var n = a.memoizedState.inst;
    al !== null && u !== null && Xc(u, al.memoizedState.deps) ? a.memoizedState = au(t, n, e, u) : (L.flags |= l, a.memoizedState = au(
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
    var e = bl();
    t = t === void 0 ? null : t;
    var u = e.memoizedState;
    return t !== null && Xc(t, u[1]) ? u[0] : (e.memoizedState = [l, t], l);
  }
  function no(l, t) {
    var e = bl();
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
    return e === void 0 || (Ft & 1073741824) !== 0 ? l.memoizedState = t : (l.memoizedState = e, l = sd(), L.lanes |= l, ae |= l, e);
  }
  function co(l, t, e, u) {
    return Il(e, t) ? e : tu.current !== null ? (l = Ic(l, e, u), Il(l, t) || (Dl = !0), l) : (Ft & 42) === 0 ? (Dl = !0, l.memoizedState = e) : (l = sd(), L.lanes |= l, ae |= l, t);
  }
  function io(l, t, e, u, a) {
    var n = M.p;
    M.p = n !== 0 && 8 > n ? n : 8;
    var c = A.T, i = {};
    A.T = i, ti(l, !1, t, e);
    try {
      var s = a(), m = A.S;
      if (m !== null && m(i, s), s !== null && typeof s == "object" && typeof s.then == "function") {
        var T = Q0(
          s,
          u
        );
        Iu(
          l,
          t,
          T,
          ut(l)
        );
      } else
        Iu(
          l,
          t,
          u,
          ut(l)
        );
    } catch (D) {
      Iu(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: D },
        ut()
      );
    } finally {
      M.p = n, A.T = c;
    }
  }
  function J0() {
  }
  function Pc(l, t, e, u) {
    if (l.tag !== 5) throw Error(o(476));
    var a = fo(l).queue;
    io(
      l,
      a,
      t,
      G,
      e === null ? J0 : function() {
        return so(l), e(u);
      }
    );
  }
  function fo(l) {
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
    Iu(l, t, {}, ut());
  }
  function li() {
    return Yl(ma);
  }
  function oo() {
    return bl().memoizedState;
  }
  function ro() {
    return bl().memoizedState;
  }
  function w0(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var e = ut();
          l = kt(e);
          var u = Wt(t, l, e);
          u !== null && (at(u, t, e), Ju(u, t, e)), t = { cache: Uc() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function $0(l, t, e) {
    var u = ut();
    e = {
      lane: u,
      revertLane: 0,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, un(l) ? ho(t, e) : (e = Tc(l, t, e, u), e !== null && (at(e, l, u), yo(e, t, u)));
  }
  function vo(l, t, e) {
    var u = ut();
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
    if (un(l)) ho(t, a);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var c = t.lastRenderedState, i = n(c, e);
          if (a.hasEagerState = !0, a.eagerState = i, Il(i, c))
            return Xa(l, t, a, 0), sl === null && Ga(), !1;
        } catch {
        } finally {
        }
      if (e = Tc(l, t, a, u), e !== null)
        return at(e, l, u), yo(e, t, u), !0;
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
      ), t !== null && at(t, l, 2);
  }
  function un(l) {
    var t = l.alternate;
    return l === L || t !== null && t === L;
  }
  function ho(l, t) {
    eu = Fa = !0;
    var e = l.pending;
    e === null ? t.next = t : (t.next = e.next, e.next = t), l.pending = t;
  }
  function yo(l, t, e) {
    if ((e & 4194048) !== 0) {
      var u = t.lanes;
      u &= l.pendingLanes, e |= u, t.lanes = e, Af(l, e);
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
      return Ll().memoizedState = [
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
      var e = Ll();
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
      var u = Ll();
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
      }, u.queue = l, l = l.dispatch = $0.bind(
        null,
        L,
        l
      ), [u.memoizedState, l];
    },
    useRef: function(l) {
      var t = Ll();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = kc(l);
      var t = l.queue, e = vo.bind(null, L, t);
      return t.dispatch = e, [l.memoizedState, e];
    },
    useDebugValue: Fc,
    useDeferredValue: function(l, t) {
      var e = Ll();
      return Ic(e, l, t);
    },
    useTransition: function() {
      var l = kc(!1);
      return l = io.bind(
        null,
        L,
        l.queue,
        !0,
        !1
      ), Ll().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, e) {
      var u = L, a = Ll();
      if (ll) {
        if (e === void 0)
          throw Error(o(407));
        e = e();
      } else {
        if (e = t(), sl === null)
          throw Error(o(349));
        (W & 124) !== 0 || js(u, t, e);
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
      var l = Ll(), t = sl.identifierPrefix;
      if (ll) {
        var e = xt, u = Nt;
        e = (u & ~(1 << 32 - Fl(u) - 1)).toString(32) + e, t = "«" + t + "R" + e, e = Ia++, 0 < e && (t += "H" + e.toString(32)), t += "»";
      } else
        e = Z0++, t = "«" + t + "r" + e.toString(32) + "»";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: li,
    useFormState: ws,
    useActionState: ws,
    useOptimistic: function(l) {
      var t = Ll();
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
        L,
        !0,
        e
      ), e.dispatch = t, [l, t];
    },
    useMemoCache: Jc,
    useCacheRefresh: function() {
      return Ll().memoizedState = w0.bind(
        null,
        L
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
      var e = bl();
      return co(
        e,
        al.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = ln(Bt)[0], t = bl().memoizedState;
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
      var e = bl();
      return Qs(e, al, l, t);
    },
    useMemoCache: Jc,
    useCacheRefresh: ro
  }, k0 = {
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
      var e = bl();
      return al === null ? Ic(e, l, t) : co(
        e,
        al.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = $c(Bt)[0], t = bl().memoizedState;
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
      var e = bl();
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
    throw t.$$typeof === tl ? Error(o(525)) : (l = Object.prototype.toString.call(t), Error(
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
    function t(v, r) {
      if (l) {
        var y = v.deletions;
        y === null ? (v.deletions = [r], v.flags |= 16) : y.push(r);
      }
    }
    function e(v, r) {
      if (!l) return null;
      for (; r !== null; )
        t(v, r), r = r.sibling;
      return null;
    }
    function u(v) {
      for (var r = /* @__PURE__ */ new Map(); v !== null; )
        v.key !== null ? r.set(v.key, v) : r.set(v.index, v), v = v.sibling;
      return r;
    }
    function a(v, r) {
      return v = Ut(v, r), v.index = 0, v.sibling = null, v;
    }
    function n(v, r, y) {
      return v.index = y, l ? (y = v.alternate, y !== null ? (y = y.index, y < r ? (v.flags |= 67108866, r) : y) : (v.flags |= 67108866, r)) : (v.flags |= 1048576, r);
    }
    function c(v) {
      return l && v.alternate === null && (v.flags |= 67108866), v;
    }
    function i(v, r, y, p) {
      return r === null || r.tag !== 6 ? (r = Ac(y, v.mode, p), r.return = v, r) : (r = a(r, y), r.return = v, r);
    }
    function s(v, r, y, p) {
      var H = y.type;
      return H === Ml ? T(
        v,
        r,
        y.props.children,
        p,
        y.key
      ) : r !== null && (r.elementType === H || typeof H == "object" && H !== null && H.$$typeof === $l && So(H) === r.type) ? (r = a(r, y.props), la(r, y), r.return = v, r) : (r = Za(
        y.type,
        y.key,
        y.props,
        null,
        v.mode,
        p
      ), la(r, y), r.return = v, r);
    }
    function m(v, r, y, p) {
      return r === null || r.tag !== 4 || r.stateNode.containerInfo !== y.containerInfo || r.stateNode.implementation !== y.implementation ? (r = pc(y, v.mode, p), r.return = v, r) : (r = a(r, y.children || []), r.return = v, r);
    }
    function T(v, r, y, p, H) {
      return r === null || r.tag !== 7 ? (r = Ee(
        y,
        v.mode,
        p,
        H
      ), r.return = v, r) : (r = a(r, y), r.return = v, r);
    }
    function D(v, r, y) {
      if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint")
        return r = Ac(
          "" + r,
          v.mode,
          y
        ), r.return = v, r;
      if (typeof r == "object" && r !== null) {
        switch (r.$$typeof) {
          case $:
            return y = Za(
              r.type,
              r.key,
              r.props,
              null,
              v.mode,
              y
            ), la(y, r), y.return = v, y;
          case zl:
            return r = pc(
              r,
              v.mode,
              y
            ), r.return = v, r;
          case $l:
            var p = r._init;
            return r = p(r._payload), D(v, r, y);
        }
        if (jl(r) || Bl(r))
          return r = Ee(
            r,
            v.mode,
            y,
            null
          ), r.return = v, r;
        if (typeof r.then == "function")
          return D(v, nn(r), y);
        if (r.$$typeof === ol)
          return D(
            v,
            Ja(v, r),
            y
          );
        cn(v, r);
      }
      return null;
    }
    function S(v, r, y, p) {
      var H = r !== null ? r.key : null;
      if (typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint")
        return H !== null ? null : i(v, r, "" + y, p);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case $:
            return y.key === H ? s(v, r, y, p) : null;
          case zl:
            return y.key === H ? m(v, r, y, p) : null;
          case $l:
            return H = y._init, y = H(y._payload), S(v, r, y, p);
        }
        if (jl(y) || Bl(y))
          return H !== null ? null : T(v, r, y, p, null);
        if (typeof y.then == "function")
          return S(
            v,
            r,
            nn(y),
            p
          );
        if (y.$$typeof === ol)
          return S(
            v,
            r,
            Ja(v, y),
            p
          );
        cn(v, y);
      }
      return null;
    }
    function b(v, r, y, p, H) {
      if (typeof p == "string" && p !== "" || typeof p == "number" || typeof p == "bigint")
        return v = v.get(y) || null, i(r, v, "" + p, H);
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case $:
            return v = v.get(
              p.key === null ? y : p.key
            ) || null, s(r, v, p, H);
          case zl:
            return v = v.get(
              p.key === null ? y : p.key
            ) || null, m(r, v, p, H);
          case $l:
            var K = p._init;
            return p = K(p._payload), b(
              v,
              r,
              y,
              p,
              H
            );
        }
        if (jl(p) || Bl(p))
          return v = v.get(y) || null, T(r, v, p, H, null);
        if (typeof p.then == "function")
          return b(
            v,
            r,
            y,
            nn(p),
            H
          );
        if (p.$$typeof === ol)
          return b(
            v,
            r,
            y,
            Ja(r, p),
            H
          );
        cn(r, p);
      }
      return null;
    }
    function X(v, r, y, p) {
      for (var H = null, K = null, B = r, Y = r = 0, Rl = null; B !== null && Y < y.length; Y++) {
        B.index > Y ? (Rl = B, B = null) : Rl = B.sibling;
        var P = S(
          v,
          B,
          y[Y],
          p
        );
        if (P === null) {
          B === null && (B = Rl);
          break;
        }
        l && B && P.alternate === null && t(v, B), r = n(P, r, Y), K === null ? H = P : K.sibling = P, K = P, B = Rl;
      }
      if (Y === y.length)
        return e(v, B), ll && pe(v, Y), H;
      if (B === null) {
        for (; Y < y.length; Y++)
          B = D(v, y[Y], p), B !== null && (r = n(
            B,
            r,
            Y
          ), K === null ? H = B : K.sibling = B, K = B);
        return ll && pe(v, Y), H;
      }
      for (B = u(B); Y < y.length; Y++)
        Rl = b(
          B,
          v,
          Y,
          y[Y],
          p
        ), Rl !== null && (l && Rl.alternate !== null && B.delete(
          Rl.key === null ? Y : Rl.key
        ), r = n(
          Rl,
          r,
          Y
        ), K === null ? H = Rl : K.sibling = Rl, K = Rl);
      return l && B.forEach(function(ve) {
        return t(v, ve);
      }), ll && pe(v, Y), H;
    }
    function q(v, r, y, p) {
      if (y == null) throw Error(o(151));
      for (var H = null, K = null, B = r, Y = r = 0, Rl = null, P = y.next(); B !== null && !P.done; Y++, P = y.next()) {
        B.index > Y ? (Rl = B, B = null) : Rl = B.sibling;
        var ve = S(v, B, P.value, p);
        if (ve === null) {
          B === null && (B = Rl);
          break;
        }
        l && B && ve.alternate === null && t(v, B), r = n(ve, r, Y), K === null ? H = ve : K.sibling = ve, K = ve, B = Rl;
      }
      if (P.done)
        return e(v, B), ll && pe(v, Y), H;
      if (B === null) {
        for (; !P.done; Y++, P = y.next())
          P = D(v, P.value, p), P !== null && (r = n(P, r, Y), K === null ? H = P : K.sibling = P, K = P);
        return ll && pe(v, Y), H;
      }
      for (B = u(B); !P.done; Y++, P = y.next())
        P = b(B, v, Y, P.value, p), P !== null && (l && P.alternate !== null && B.delete(P.key === null ? Y : P.key), r = n(P, r, Y), K === null ? H = P : K.sibling = P, K = P);
      return l && B.forEach(function(Wv) {
        return t(v, Wv);
      }), ll && pe(v, Y), H;
    }
    function cl(v, r, y, p) {
      if (typeof y == "object" && y !== null && y.type === Ml && y.key === null && (y = y.props.children), typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case $:
            l: {
              for (var H = y.key; r !== null; ) {
                if (r.key === H) {
                  if (H = y.type, H === Ml) {
                    if (r.tag === 7) {
                      e(
                        v,
                        r.sibling
                      ), p = a(
                        r,
                        y.props.children
                      ), p.return = v, v = p;
                      break l;
                    }
                  } else if (r.elementType === H || typeof H == "object" && H !== null && H.$$typeof === $l && So(H) === r.type) {
                    e(
                      v,
                      r.sibling
                    ), p = a(r, y.props), la(p, y), p.return = v, v = p;
                    break l;
                  }
                  e(v, r);
                  break;
                } else t(v, r);
                r = r.sibling;
              }
              y.type === Ml ? (p = Ee(
                y.props.children,
                v.mode,
                p,
                y.key
              ), p.return = v, v = p) : (p = Za(
                y.type,
                y.key,
                y.props,
                null,
                v.mode,
                p
              ), la(p, y), p.return = v, v = p);
            }
            return c(v);
          case zl:
            l: {
              for (H = y.key; r !== null; ) {
                if (r.key === H)
                  if (r.tag === 4 && r.stateNode.containerInfo === y.containerInfo && r.stateNode.implementation === y.implementation) {
                    e(
                      v,
                      r.sibling
                    ), p = a(r, y.children || []), p.return = v, v = p;
                    break l;
                  } else {
                    e(v, r);
                    break;
                  }
                else t(v, r);
                r = r.sibling;
              }
              p = pc(y, v.mode, p), p.return = v, v = p;
            }
            return c(v);
          case $l:
            return H = y._init, y = H(y._payload), cl(
              v,
              r,
              y,
              p
            );
        }
        if (jl(y))
          return X(
            v,
            r,
            y,
            p
          );
        if (Bl(y)) {
          if (H = Bl(y), typeof H != "function") throw Error(o(150));
          return y = H.call(y), q(
            v,
            r,
            y,
            p
          );
        }
        if (typeof y.then == "function")
          return cl(
            v,
            r,
            nn(y),
            p
          );
        if (y.$$typeof === ol)
          return cl(
            v,
            r,
            Ja(v, y),
            p
          );
        cn(v, y);
      }
      return typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint" ? (y = "" + y, r !== null && r.tag === 6 ? (e(v, r.sibling), p = a(r, y), p.return = v, v = p) : (e(v, r), p = Ac(y, v.mode, p), p.return = v, v = p), c(v)) : e(v, r);
    }
    return function(v, r, y, p) {
      try {
        Pu = 0;
        var H = cl(
          v,
          r,
          y,
          p
        );
        return nu = null, H;
      } catch (B) {
        if (B === Lu || B === $a) throw B;
        var K = Pl(29, B, null, v.mode);
        return K.lanes = p, K.return = v, K;
      } finally {
      }
    };
  }
  var cu = bo(!0), To = bo(!1), rt = R(null), pt = null;
  function It(l) {
    var t = l.alternate;
    z(El, El.current & 1), z(rt, l), pt === null && (t === null || tu.current !== null || t.memoizedState !== null) && (pt = l);
  }
  function Eo(l) {
    if (l.tag === 22) {
      if (z(El, El.current), z(rt, l), pt === null) {
        var t = l.alternate;
        t !== null && t.memoizedState !== null && (pt = l);
      }
    } else Pt();
  }
  function Pt() {
    z(El, El.current), z(rt, rt.current);
  }
  function jt(l) {
    N(rt), pt === l && (pt = null), N(El);
  }
  var El = R(0);
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
    t = l.memoizedState, e = e(u, t), e = e == null ? t : C({}, t, e), l.memoizedState = e, l.lanes === 0 && (l.updateQueue.baseState = e);
  }
  var ui = {
    enqueueSetState: function(l, t, e) {
      l = l._reactInternals;
      var u = ut(), a = kt(u);
      a.payload = t, e != null && (a.callback = e), t = Wt(l, a, u), t !== null && (at(t, l, u), Ju(t, l, u));
    },
    enqueueReplaceState: function(l, t, e) {
      l = l._reactInternals;
      var u = ut(), a = kt(u);
      a.tag = 1, a.payload = t, e != null && (a.callback = e), t = Wt(l, a, u), t !== null && (at(t, l, u), Ju(t, l, u));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var e = ut(), u = kt(e);
      u.tag = 2, t != null && (u.callback = t), t = Wt(l, u, e), t !== null && (at(t, l, e), Ju(t, l, e));
    }
  };
  function Ao(l, t, e, u, a, n, c) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(u, n, c) : t.prototype && t.prototype.isPureReactComponent ? !ju(e, u) || !ju(a, n) : !0;
  }
  function po(l, t, e, u) {
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
      e === t && (e = C({}, e));
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
  function Oo(l) {
    console.error(l);
  }
  function Ro(l) {
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
  function W0(l, t, e, u, a) {
    if (e.flags |= 32768, u !== null && typeof u == "object" && typeof u.then == "function") {
      if (t = e.alternate, t !== null && Qu(
        t,
        e,
        a,
        !0
      ), e = rt.current, e !== null) {
        switch (e.tag) {
          case 13:
            return pt === null ? zi() : e.alternate === null && yl === 0 && (yl = 3), e.flags &= -257, e.flags |= 65536, e.lanes = a, u === Hc ? e.flags |= 16384 : (t = e.updateQueue, t === null ? e.updateQueue = /* @__PURE__ */ new Set([u]) : t.add(u), Ui(l, u, a)), !1;
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
    if (ll)
      return t = rt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = a, u !== Rc && (l = Error(o(422), { cause: u }), Xu(ft(l, e)))) : (u !== Rc && (t = Error(o(423), {
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
    ), i = Zc(), l !== null && !Dl ? (Vc(l, t, a), qt(l, t, a)) : (ll && i && Dc(t), t.flags |= 1, Ul(l, t, u, a), t.child);
  }
  function xo(l, t, e, u, a) {
    if (l === null) {
      var n = e.type;
      return typeof n == "function" && !Ec(n) && n.defaultProps === void 0 && e.compare === null ? (t.tag = 15, t.type = n, Ho(
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
    if (n = l.child, !ri(l, a)) {
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
        if (Dl = !1, t.pendingProps = u = n, ri(l, a))
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
        ), n !== null ? xs(t, n) : Yc(), Eo(t);
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
    return a = a === null ? null : { parent: Tl._currentValue, pool: a }, t.memoizedState = {
      baseLanes: e,
      cachePool: a
    }, l !== null && wa(t, null), Yc(), Eo(t), l !== null && Qu(l, t, u, !0), null;
  }
  function dn(l, t) {
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
    ), u = Zc(), l !== null && !Dl ? (Vc(l, t, a), qt(l, t, a)) : (ll && u && Dc(t), t.flags |= 1, Ul(l, t, e, a), t.child);
  }
  function jo(l, t, e, u, a, n) {
    return _e(t), t.updateQueue = null, e = Cs(
      t,
      u,
      e,
      a
    ), Hs(l), u = Zc(), l !== null && !Dl ? (Vc(l, t, n), qt(l, t, n)) : (ll && u && Dc(t), t.flags |= 1, Ul(l, t, e, n), t.child);
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
      var m = n.context, T = e.contextType;
      c = We, typeof T == "object" && T !== null && (c = Yl(T));
      var D = e.getDerivedStateFromProps;
      T = typeof D == "function" || typeof n.getSnapshotBeforeUpdate == "function", i = t.pendingProps !== i, T || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (i || m !== c) && po(
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
      ), m = t.memoizedState), (s = $t || Ao(
        t,
        e,
        s,
        u,
        S,
        m,
        c
      )) ? (T || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = u, t.memoizedState = m), n.props = u, n.state = m, n.context = c, u = s) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), u = !1);
    } else {
      n = t.stateNode, Bc(l, t), c = t.memoizedProps, T = Ue(e, c), n.props = T, D = t.pendingProps, S = n.context, m = e.contextType, s = We, typeof m == "object" && m !== null && (s = Yl(m)), i = e.getDerivedStateFromProps, (m = typeof i == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c !== D || S !== s) && po(
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
      ), b = t.memoizedState), (T = $t || Ao(
        t,
        e,
        T,
        u,
        S,
        b,
        s
      ) || l !== null && l.dependencies !== null && Ka(l.dependencies)) ? (m || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(u, b, s), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        u,
        b,
        s
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || c === l.memoizedProps && S === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && S === l.memoizedState || (t.flags |= 1024), t.memoizedProps = u, t.memoizedState = b), n.props = u, n.state = b, n.context = s, u = T) : (typeof n.componentDidUpdate != "function" || c === l.memoizedProps && S === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && S === l.memoizedState || (t.flags |= 1024), u = !1);
    }
    return n = u, dn(l, t), u = (t.flags & 128) !== 0, n || u ? (n = t.stateNode, e = u && typeof e.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && u ? (t.child = cu(
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
    return l = l !== null ? l.childLanes & ~e : 0, t && (l |= vt), l;
  }
  function Go(l, t, e) {
    var u = t.pendingProps, a = !1, n = (t.flags & 128) !== 0, c;
    if ((c = n) || (c = l !== null && l.memoizedState === null ? !1 : (El.current & 2) !== 0), c && (a = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (ll) {
        if (a ? It(t) : Pt(), ll) {
          var i = hl, s;
          if (s = i) {
            l: {
              for (s = i, i = At; s.nodeType !== 8; ) {
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
              treeContext: Ae !== null ? { id: Nt, overflow: xt } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, s = Pl(
              18,
              null,
              null,
              0
            ), s.stateNode = i, s.return = t, t.child = s, Ql = t, hl = null, s = !0) : s = !1;
          }
          s || Oe(t);
        }
        if (i = t.memoizedState, i !== null && (i = i.dehydrated, i !== null))
          return Ki(i) ? t.lanes = 32 : t.lanes = 536870912, null;
        jt(t);
      }
      return i = u.children, u = u.fallback, a ? (Pt(), a = t.mode, i = rn(
        { mode: "hidden", children: i },
        a
      ), u = Ee(
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
        )) : t.memoizedState !== null ? (Pt(), t.child = l.child, t.flags |= 128, t = null) : (Pt(), a = u.fallback, i = t.mode, u = rn(
          { mode: "visible", children: u.children },
          i
        ), a = Ee(
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
          throw s.retryLane = u, ke(l, u), at(c, l, u), Uo;
        i.data === "$?" || zi(), t = oi(
          l,
          t,
          e
        );
      } else
        i.data === "$?" ? (t.flags |= 192, t.child = l.child, t = null) : (l = s.treeContext, hl = gt(
          i.nextSibling
        ), Ql = t, ll = !0, De = null, At = !1, l !== null && (ot[dt++] = Nt, ot[dt++] = xt, ot[dt++] = Ae, Nt = l.id, xt = l.overflow, Ae = t), t = si(
          t,
          u.children
        ), t.flags |= 4096);
      return t;
    }
    return a ? (Pt(), a = u.fallback, i = t.mode, s = l.child, m = s.sibling, u = Ut(s, {
      mode: "hidden",
      children: u.children
    }), u.subtreeFlags = s.subtreeFlags & 65011712, m !== null ? a = Ut(m, a) : (a = Ee(
      a,
      i,
      e,
      null
    ), a.flags |= 2), a.return = t, u.return = t, u.sibling = a, t.child = u, u = a, a = t.child, i = l.child.memoizedState, i === null ? i = ii(e) : (s = i.cachePool, s !== null ? (m = Tl._currentValue, s = s.parent !== m ? { parent: m, pool: m } : s) : s = Ds(), i = {
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
    return t = rn(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function rn(l, t) {
    return l = Pl(22, l, null, t), l.lanes = 0, l.stateNode = {
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
  function di(l, t, e, u, a) {
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
    switch (z(El, u), a) {
      case "forwards":
        for (e = t.child, a = null; e !== null; )
          l = e.alternate, l !== null && fn(l) === null && (a = e), e = e.sibling;
        e = a, e === null ? (a = t.child, t.child = null) : (a = e.sibling, e.sibling = null), di(
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
        di(
          t,
          !0,
          e,
          null,
          n
        );
        break;
      case "together":
        di(t, !1, null, null, void 0);
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
  function ri(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && Ka(l)));
  }
  function F0(l, t, e) {
    switch (t.tag) {
      case 3:
        dl(t, t.stateNode.containerInfo), wt(t, Tl, l.memoizedState.cache), Gu();
        break;
      case 27:
      case 5:
        Qn(t);
        break;
      case 4:
        dl(t, t.stateNode.containerInfo);
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
        if (a = t.memoizedState, a !== null && (a.rendering = null, a.tail = null, a.lastEffect = null), z(El, El.current), u) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Co(l, t, e);
      case 24:
        wt(t, Tl, l.memoizedState.cache);
    }
    return qt(l, t, e);
  }
  function Zo(l, t, e) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        Dl = !0;
      else {
        if (!ri(l, e) && (t.flags & 128) === 0)
          return Dl = !1, F0(
            l,
            t,
            e
          );
        Dl = (l.flags & 131072) !== 0;
      }
    else
      Dl = !1, ll && (t.flags & 1048576) !== 0 && gs(t, La, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          l = t.pendingProps;
          var u = t.elementType, a = u._init;
          if (u = a(u._payload), t.type = u, typeof u == "function")
            Ec(u) ? (l = Ue(u, l), t.tag = 1, t = qo(
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
              if (a = u.$$typeof, a === nt) {
                t.tag = 11, t = No(
                  null,
                  t,
                  u,
                  l,
                  e
                );
                break l;
              } else if (a === Xl) {
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
          if (dl(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(o(387));
          u = t.pendingProps;
          var n = t.memoizedState;
          a = n.element, Bc(l, t), $u(t, u, null, e);
          var c = t.memoizedState;
          if (u = c.cache, wt(t, Tl, u), u !== n.cache && Mc(
            t,
            [Tl],
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
              for (hl = gt(l.firstChild), Ql = t, ll = !0, De = null, At = !0, e = To(
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
        return dn(l, t), l === null ? (e = Jd(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = e : ll || (e = t.type, l = t.pendingProps, u = Rn(
          Z.current
        ).createElement(e), u[ql] = t, u[Zl] = l, xl(u, e, l), pl(u), t.stateNode = u) : t.memoizedState = Jd(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return Qn(t), l === null && ll && (u = t.stateNode = Vd(
          t.type,
          t.pendingProps,
          Z.current
        ), Ql = t, At = !0, a = hl, fe(t.type) ? (Ji = a, hl = gt(
          u.firstChild
        )) : hl = a), Ul(
          l,
          t,
          t.pendingProps.children,
          e
        ), dn(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && ll && ((a = u = hl) && (u = Ov(
          u,
          t.type,
          t.pendingProps,
          At
        ), u !== null ? (t.stateNode = u, Ql = t, hl = gt(
          u.firstChild
        ), At = !1, a = !0) : a = !1), a || Oe(t)), Qn(t), a = t.type, n = t.pendingProps, c = l !== null ? l.memoizedProps : null, u = n.children, Zi(a, n) ? u = null : c !== null && Zi(a, c) && (t.flags |= 32), t.memoizedState !== null && (a = Qc(
          l,
          t,
          V0,
          null,
          null,
          e
        ), ma._currentValue = a), dn(l, t), Ul(l, t, u, e), t.child;
      case 6:
        return l === null && ll && ((l = e = hl) && (e = Rv(
          e,
          t.pendingProps,
          At
        ), e !== null ? (t.stateNode = e, Ql = t, hl = null, l = !0) : l = !1), l || Oe(t)), null;
      case 13:
        return Go(l, t, e);
      case 4:
        return dl(
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
        }, l === null ? (e = rn(
          u,
          e
        ), e.ref = t.ref, t.child = e, e.return = t, t = e) : (e = Ut(l.child, u), e.ref = t.ref, t.child = e, e.return = t, t = e), t;
      case 22:
        return Co(l, t, e);
      case 24:
        return _e(t), u = Yl(Tl), l === null ? (a = xc(), a === null && (a = sl, n = Uc(), a.pooledCache = n, n.refCount++, n !== null && (a.pooledCacheLanes |= e), a = n), t.memoizedState = {
          parent: u,
          cache: a
        }, Cc(t), wt(t, Tl, a)) : ((l.lanes & e) !== 0 && (Bc(l, t), $u(t, null, null, e), wu()), a = l.memoizedState, n = t.memoizedState, a.parent !== u ? (a = { parent: u, cache: u }, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), wt(t, Tl, u)) : (u = n.cache, wt(t, Tl, u), u !== a.cache && Mc(
          t,
          [Tl],
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
    else if (l.flags |= 16777216, !Fd(t)) {
      if (t = rt.current, t !== null && ((W & 4194048) === W ? pt !== null : (W & 62914560) !== W && (W & 536870912) === 0 || t !== pt))
        throw Ku = Hc, Os;
      l.flags |= 8192;
    }
  }
  function vn(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? Tf() : 536870912, l.lanes |= t, ou |= t);
  }
  function ta(l, t) {
    if (!ll)
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
  function vl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, e = 0, u = 0;
    if (t)
      for (var a = l.child; a !== null; )
        e |= a.lanes | a.childLanes, u |= a.subtreeFlags & 65011712, u |= a.flags & 65011712, a.return = l, a = a.sibling;
    else
      for (a = l.child; a !== null; )
        e |= a.lanes | a.childLanes, u |= a.subtreeFlags, u |= a.flags, a.return = l, a = a.sibling;
    return l.subtreeFlags |= u, l.childLanes = e, t;
  }
  function I0(l, t, e) {
    var u = t.pendingProps;
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
        return vl(t), null;
      case 1:
        return vl(t), null;
      case 3:
        return e = t.stateNode, u = null, l !== null && (u = l.memoizedState.cache), t.memoizedState.cache !== u && (t.flags |= 2048), Ct(Tl), Vt(), e.pendingContext && (e.context = e.pendingContext, e.pendingContext = null), (l === null || l.child === null) && (Yu(t) ? Yt(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ts())), vl(t), null;
      case 26:
        return e = t.memoizedState, l === null ? (Yt(t), e !== null ? (vl(t), Vo(t, e)) : (vl(t), t.flags &= -16777217)) : e ? e !== l.memoizedState ? (Yt(t), vl(t), Vo(t, e)) : (vl(t), t.flags &= -16777217) : (l.memoizedProps !== u && Yt(t), vl(t), t.flags &= -16777217), null;
      case 27:
        pa(t), e = Z.current;
        var a = t.type;
        if (l !== null && t.stateNode != null)
          l.memoizedProps !== u && Yt(t);
        else {
          if (!u) {
            if (t.stateNode === null)
              throw Error(o(166));
            return vl(t), null;
          }
          l = j.current, Yu(t) ? Ss(t) : (l = Vd(a, u, e), t.stateNode = l, Yt(t));
        }
        return vl(t), null;
      case 5:
        if (pa(t), e = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== u && Yt(t);
        else {
          if (!u) {
            if (t.stateNode === null)
              throw Error(o(166));
            return vl(t), null;
          }
          if (l = j.current, Yu(t))
            Ss(t);
          else {
            switch (a = Rn(
              Z.current
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
            l[ql] = t, l[Zl] = u;
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
        return vl(t), t.flags &= -16777217, null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== u && Yt(t);
        else {
          if (typeof u != "string" && t.stateNode === null)
            throw Error(o(166));
          if (l = Z.current, Yu(t)) {
            if (l = t.stateNode, e = t.memoizedProps, u = null, a = Ql, a !== null)
              switch (a.tag) {
                case 27:
                case 5:
                  u = a.memoizedProps;
              }
            l[ql] = t, l = !!(l.nodeValue === e || u !== null && u.suppressHydrationWarning === !0 || jd(l.nodeValue, e)), l || Oe(t);
          } else
            l = Rn(l).createTextNode(
              u
            ), l[ql] = t, t.stateNode = l;
        }
        return vl(t), null;
      case 13:
        if (u = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (a = Yu(t), u !== null && u.dehydrated !== null) {
            if (l === null) {
              if (!a) throw Error(o(318));
              if (a = t.memoizedState, a = a !== null ? a.dehydrated : null, !a) throw Error(o(317));
              a[ql] = t;
            } else
              Gu(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            vl(t), a = !1;
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
        return e !== l && e && (t.child.flags |= 8192), vn(t, t.updateQueue), vl(t), null;
      case 4:
        return Vt(), l === null && qi(t.stateNode.containerInfo), vl(t), null;
      case 10:
        return Ct(t.type), vl(t), null;
      case 19:
        if (N(El), a = t.memoizedState, a === null) return vl(t), null;
        if (u = (t.flags & 128) !== 0, n = a.rendering, n === null)
          if (u) ta(a, !1);
          else {
            if (yl !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = fn(l), n !== null) {
                  for (t.flags |= 128, ta(a, !1), l = n.updateQueue, t.updateQueue = l, vn(t, l), t.subtreeFlags = 0, l = e, e = t.child; e !== null; )
                    ms(e, l), e = e.sibling;
                  return z(
                    El,
                    El.current & 1 | 2
                  ), t.child;
                }
                l = l.sibling;
              }
            a.tail !== null && Et() > mn && (t.flags |= 128, u = !0, ta(a, !1), t.lanes = 4194304);
          }
        else {
          if (!u)
            if (l = fn(n), l !== null) {
              if (t.flags |= 128, u = !0, l = l.updateQueue, t.updateQueue = l, vn(t, l), ta(a, !0), a.tail === null && a.tailMode === "hidden" && !n.alternate && !ll)
                return vl(t), null;
            } else
              2 * Et() - a.renderingStartTime > mn && e !== 536870912 && (t.flags |= 128, u = !0, ta(a, !1), t.lanes = 4194304);
          a.isBackwards ? (n.sibling = t.child, t.child = n) : (l = a.last, l !== null ? l.sibling = n : t.child = n, a.last = n);
        }
        return a.tail !== null ? (t = a.tail, a.rendering = t, a.tail = t.sibling, a.renderingStartTime = Et(), t.sibling = null, l = El.current, z(El, u ? l & 1 | 2 : l & 1), t) : (vl(t), null);
      case 22:
      case 23:
        return jt(t), Gc(), u = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== u && (t.flags |= 8192) : u && (t.flags |= 8192), u ? (e & 536870912) !== 0 && (t.flags & 128) === 0 && (vl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : vl(t), e = t.updateQueue, e !== null && vn(t, e.retryQueue), e = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), u = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (u = t.memoizedState.cachePool.pool), u !== e && (t.flags |= 2048), l !== null && N(ze), null;
      case 24:
        return e = null, l !== null && (e = l.memoizedState.cache), t.memoizedState.cache !== e && (t.flags |= 2048), Ct(Tl), vl(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function P0(l, t) {
    switch (Oc(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return Ct(Tl), Vt(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return pa(t), null;
      case 13:
        if (jt(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Gu();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return N(El), null;
      case 4:
        return Vt(), null;
      case 10:
        return Ct(t.type), null;
      case 22:
      case 23:
        return jt(t), Gc(), l !== null && N(ze), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return Ct(Tl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Lo(l, t) {
    switch (Oc(t), t.tag) {
      case 3:
        Ct(Tl), Vt();
        break;
      case 26:
      case 27:
      case 5:
        pa(t);
        break;
      case 4:
        Vt();
        break;
      case 13:
        jt(t);
        break;
      case 19:
        N(El);
        break;
      case 10:
        Ct(t.type);
        break;
      case 22:
      case 23:
        jt(t), Gc(), l !== null && N(ze);
        break;
      case 24:
        Ct(Tl);
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
              } catch (T) {
                fl(
                  a,
                  s,
                  T
                );
              }
            }
          }
          u = u.next;
        } while (u !== n);
      }
    } catch (T) {
      fl(t, t.return, T);
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
  function Dt(l, t) {
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
  function vi(l, t, e) {
    try {
      var u = l.stateNode;
      Tv(u, l.type, e, t), u[Zl] = t;
    } catch (a) {
      fl(l, l.return, a);
    }
  }
  function $o(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && fe(l.type) || l.tag === 4;
  }
  function hi(l) {
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
      l = l.stateNode, t ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(l, t) : (t = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, t.appendChild(l), e = e._reactRootContainer, e != null || t.onclick !== null || (t.onclick = On));
    else if (u !== 4 && (u === 27 && fe(l.type) && (e = l.stateNode, t = null), l = l.child, l !== null))
      for (yi(l, t, e), l = l.sibling; l !== null; )
        yi(l, t, e), l = l.sibling;
  }
  function hn(l, t, e) {
    var u = l.tag;
    if (u === 5 || u === 6)
      l = l.stateNode, t ? e.insertBefore(l, t) : e.appendChild(l);
    else if (u !== 4 && (u === 27 && fe(l.type) && (e = l.stateNode), l = l.child, l !== null))
      for (hn(l, t, e), l = l.sibling; l !== null; )
        hn(l, t, e), l = l.sibling;
  }
  function ko(l) {
    var t = l.stateNode, e = l.memoizedProps;
    try {
      for (var u = l.type, a = t.attributes; a.length; )
        t.removeAttributeNode(a[0]);
      xl(t, u, e), t[ql] = l, t[Zl] = e;
    } catch (n) {
      fl(l, l.return, n);
    }
  }
  var Gt = !1, gl = !1, mi = !1, Wo = typeof WeakSet == "function" ? WeakSet : Set, Ol = null;
  function lv(l, t) {
    if (l = l.containerInfo, Xi = xn, l = cs(l), hc(l)) {
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
            var c = 0, i = -1, s = -1, m = 0, T = 0, D = l, S = null;
            t: for (; ; ) {
              for (var b; D !== e || a !== 0 && D.nodeType !== 3 || (i = c + a), D !== n || u !== 0 && D.nodeType !== 3 || (s = c + u), D.nodeType === 3 && (c += D.nodeValue.length), (b = D.firstChild) !== null; )
                S = D, D = b;
              for (; ; ) {
                if (D === l) break t;
                if (S === e && ++m === a && (i = c), S === n && ++T === u && (s = c), (b = D.nextSibling) !== null) break;
                D = S, S = D.parentNode;
              }
              D = b;
            }
            e = i === -1 || s === -1 ? null : { start: i, end: s };
          } else e = null;
        }
      e = e || { start: 0, end: 0 };
    } else e = null;
    for (Qi = { focusedElem: l, selectionRange: e }, xn = !1, Ol = t; Ol !== null; )
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
                l = void 0, e = t, a = n.memoizedProps, n = n.memoizedState, u = e.stateNode;
                try {
                  var X = Ue(
                    e.type,
                    a,
                    e.elementType === e.type
                  );
                  l = u.getSnapshotBeforeUpdate(
                    X,
                    n
                  ), u.__reactInternalSnapshotBeforeUpdate = l;
                } catch (q) {
                  fl(
                    e,
                    e.return,
                    q
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
            l.return = t.return, Ol = l;
            break;
          }
          Ol = t.return;
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
        te(l, e), u & 4 && ld(l, e), u & 64 && (l = e.memoizedState, l !== null && (l = l.dehydrated, l !== null && (e = sv.bind(
          null,
          e
        ), _v(l, e))));
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
  var rl = null, Kl = !1;
  function Xt(l, t, e) {
    for (e = e.child; e !== null; )
      Po(l, t, e), e = e.sibling;
  }
  function Po(l, t, e) {
    if (Wl && typeof Wl.onCommitFiberUnmount == "function")
      try {
        Wl.onCommitFiberUnmount(Du, e);
      } catch {
      }
    switch (e.tag) {
      case 26:
        gl || Dt(e, t), Xt(
          l,
          t,
          e
        ), e.memoizedState ? e.memoizedState.count-- : e.stateNode && (e = e.stateNode, e.parentNode.removeChild(e));
        break;
      case 27:
        gl || Dt(e, t);
        var u = rl, a = Kl;
        fe(e.type) && (rl = e.stateNode, Kl = !1), Xt(
          l,
          t,
          e
        ), ra(e.stateNode), rl = u, Kl = a;
        break;
      case 5:
        gl || Dt(e, t);
      case 6:
        if (u = rl, a = Kl, rl = null, Xt(
          l,
          t,
          e
        ), rl = u, Kl = a, rl !== null)
          if (Kl)
            try {
              (rl.nodeType === 9 ? rl.body : rl.nodeName === "HTML" ? rl.ownerDocument.body : rl).removeChild(e.stateNode);
            } catch (n) {
              fl(
                e,
                t,
                n
              );
            }
          else
            try {
              rl.removeChild(e.stateNode);
            } catch (n) {
              fl(
                e,
                t,
                n
              );
            }
        break;
      case 18:
        rl !== null && (Kl ? (l = rl, Qd(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          e.stateNode
        ), Ta(l)) : Qd(rl, e.stateNode));
        break;
      case 4:
        u = rl, a = Kl, rl = e.stateNode.containerInfo, Kl = !0, Xt(
          l,
          t,
          e
        ), rl = u, Kl = a;
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
        gl || (Dt(e, t), u = e.stateNode, typeof u.componentWillUnmount == "function" && Jo(
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
  function ld(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        Ta(l);
      } catch (e) {
        fl(t, t.return, e);
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
        throw Error(o(435, l.tag));
    }
  }
  function gi(l, t) {
    var e = tv(l);
    t.forEach(function(u) {
      var a = ov.bind(null, l, u);
      e.has(u) || (e.add(u), u.then(a, a));
    });
  }
  function lt(l, t) {
    var e = t.deletions;
    if (e !== null)
      for (var u = 0; u < e.length; u++) {
        var a = e[u], n = l, c = t, i = c;
        l: for (; i !== null; ) {
          switch (i.tag) {
            case 27:
              if (fe(i.type)) {
                rl = i.stateNode, Kl = !1;
                break l;
              }
              break;
            case 5:
              rl = i.stateNode, Kl = !1;
              break l;
            case 3:
            case 4:
              rl = i.stateNode.containerInfo, Kl = !0;
              break l;
          }
          i = i.return;
        }
        if (rl === null) throw Error(o(160));
        Po(n, c, a), rl = null, Kl = !1, n = a.alternate, n !== null && (n.return = null), a.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        td(t, l), t = t.sibling;
  }
  var mt = null;
  function td(l, t) {
    var e = l.alternate, u = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        lt(t, l), tt(l), u & 4 && (le(3, l, l.return), ea(3, l), le(5, l, l.return));
        break;
      case 1:
        lt(t, l), tt(l), u & 512 && (gl || e === null || Dt(e, e.return)), u & 64 && Gt && (l = l.updateQueue, l !== null && (u = l.callbacks, u !== null && (e = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = e === null ? u : e.concat(u))));
        break;
      case 26:
        var a = mt;
        if (lt(t, l), tt(l), u & 512 && (gl || e === null || Dt(e, e.return)), u & 4) {
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
                      )), xl(n, u, e), n[ql] = l, pl(n), u = n;
                      break l;
                    case "link":
                      var c = kd(
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
                      if (c = kd(
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
                  n[ql] = l, pl(n), u = n;
                }
                l.stateNode = u;
              } else
                Wd(
                  a,
                  l.type,
                  l.stateNode
                );
            else
              l.stateNode = $d(
                a,
                u,
                l.memoizedProps
              );
          else
            n !== u ? (n === null ? e.stateNode !== null && (e = e.stateNode, e.parentNode.removeChild(e)) : n.count--, u === null ? Wd(
              a,
              l.type,
              l.stateNode
            ) : $d(
              a,
              u,
              l.memoizedProps
            )) : u === null && l.stateNode !== null && vi(
              l,
              l.memoizedProps,
              e.memoizedProps
            );
        }
        break;
      case 27:
        lt(t, l), tt(l), u & 512 && (gl || e === null || Dt(e, e.return)), e !== null && u & 4 && vi(
          l,
          l.memoizedProps,
          e.memoizedProps
        );
        break;
      case 5:
        if (lt(t, l), tt(l), u & 512 && (gl || e === null || Dt(e, e.return)), l.flags & 32) {
          a = l.stateNode;
          try {
            Ze(a, "");
          } catch (b) {
            fl(l, l.return, b);
          }
        }
        u & 4 && l.stateNode != null && (a = l.memoizedProps, vi(
          l,
          a,
          e !== null ? e.memoizedProps : a
        )), u & 1024 && (mi = !0);
        break;
      case 6:
        if (lt(t, l), tt(l), u & 4) {
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
        if (Mn = null, a = mt, mt = _n(t.containerInfo), lt(t, l), mt = a, tt(l), u & 4 && e !== null && e.memoizedState.isDehydrated)
          try {
            Ta(t.containerInfo);
          } catch (b) {
            fl(l, l.return, b);
          }
        mi && (mi = !1, ed(l));
        break;
      case 4:
        u = mt, mt = _n(
          l.stateNode.containerInfo
        ), lt(t, l), tt(l), mt = u;
        break;
      case 12:
        lt(t, l), tt(l);
        break;
      case 13:
        lt(t, l), tt(l), l.child.flags & 8192 && l.memoizedState !== null != (e !== null && e.memoizedState !== null) && (pi = Et()), u & 4 && (u = l.updateQueue, u !== null && (l.updateQueue = null, gi(l, u)));
        break;
      case 22:
        a = l.memoizedState !== null;
        var s = e !== null && e.memoizedState !== null, m = Gt, T = gl;
        if (Gt = m || a, gl = T || s, lt(t, l), gl = T, Gt = m, tt(l), u & 8192)
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
        lt(t, l), tt(l), u & 4 && (u = l.updateQueue, u !== null && (l.updateQueue = null, gi(l, u)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        lt(t, l), tt(l);
    }
  }
  function tt(l) {
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
            var a = e.stateNode, n = hi(l);
            hn(l, n, a);
            break;
          case 5:
            var c = e.stateNode;
            e.flags & 32 && (Ze(c, ""), e.flags &= -33);
            var i = hi(l);
            hn(l, i, c);
            break;
          case 3:
          case 4:
            var s = e.stateNode.containerInfo, m = hi(l);
            yi(
              l,
              m,
              s
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (T) {
        fl(l, l.return, T);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function ed(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        ed(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), l = l.sibling;
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
          Dt(t, t.return);
          var e = t.stateNode;
          typeof e.componentWillUnmount == "function" && Jo(
            t,
            t.return,
            e
          ), Ne(t);
          break;
        case 27:
          ra(t.stateNode);
        case 26:
        case 5:
          Dt(t, t.return), Ne(t);
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
          ), e && c & 4 && ld(a, n);
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
  function Ot(l, t, e, u) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        ud(
          l,
          t,
          e,
          u
        ), t = t.sibling;
  }
  function ud(l, t, e, u) {
    var a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Ot(
          l,
          t,
          e,
          u
        ), a & 2048 && ea(9, t);
        break;
      case 1:
        Ot(
          l,
          t,
          e,
          u
        );
        break;
      case 3:
        Ot(
          l,
          t,
          e,
          u
        ), a & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Zu(l)));
        break;
      case 12:
        if (a & 2048) {
          Ot(
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
          Ot(
            l,
            t,
            e,
            u
          );
        break;
      case 13:
        Ot(
          l,
          t,
          e,
          u
        );
        break;
      case 23:
        break;
      case 22:
        n = t.stateNode, c = t.alternate, t.memoizedState !== null ? n._visibility & 2 ? Ot(
          l,
          t,
          e,
          u
        ) : aa(l, t) : n._visibility & 2 ? Ot(
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
        Ot(
          l,
          t,
          e,
          u
        ), a & 2048 && bi(t.alternate, t);
        break;
      default:
        Ot(
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
          var T = c.stateNode;
          c.memoizedState !== null ? T._visibility & 2 ? iu(
            n,
            c,
            i,
            s,
            a
          ) : aa(
            n,
            c
          ) : (T._visibility |= 2, iu(
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
        ad(l), l = l.sibling;
  }
  function ad(l) {
    switch (l.tag) {
      case 26:
        fu(l), l.flags & na && l.memoizedState !== null && Xv(
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
  function nd(l) {
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
          Ol = u, id(
            u,
            l
          );
        }
      nd(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        cd(l), l = l.sibling;
  }
  function cd(l) {
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
          Ol = u, id(
            u,
            l
          );
        }
      nd(l);
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
  function id(l, t) {
    for (; Ol !== null; ) {
      var e = Ol;
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
      if (u = e.child, u !== null) u.return = e, Ol = u;
      else
        l: for (e = l; Ol !== null; ) {
          u = Ol;
          var a = u.sibling, n = u.return;
          if (Io(u), u === e) {
            Ol = null;
            break l;
          }
          if (a !== null) {
            a.return = n, Ol = a;
            break l;
          }
          Ol = n;
        }
    }
  }
  var ev = {
    getCacheForType: function(l) {
      var t = Yl(Tl), e = t.data.get(l);
      return e === void 0 && (e = l(), t.data.set(l, e)), e;
    }
  }, uv = typeof WeakMap == "function" ? WeakMap : Map, el = 0, sl = null, J = null, W = 0, ul = 0, et = null, ue = !1, su = !1, Ti = !1, Qt = 0, yl = 0, ae = 0, xe = 0, Ei = 0, vt = 0, ou = 0, ia = null, Jl = null, Ai = !1, pi = 0, mn = 1 / 0, gn = null, ne = null, Nl = 0, ce = null, du = null, ru = 0, Di = 0, Oi = null, fd = null, fa = 0, Ri = null;
  function ut() {
    if ((el & 2) !== 0 && W !== 0)
      return W & -W;
    if (A.T !== null) {
      var l = Pe;
      return l !== 0 ? l : Hi();
    }
    return pf();
  }
  function sd() {
    vt === 0 && (vt = (W & 536870912) === 0 || ll ? bf() : 536870912);
    var l = rt.current;
    return l !== null && (l.flags |= 32), vt;
  }
  function at(l, t, e) {
    (l === sl && (ul === 2 || ul === 9) || l.cancelPendingCommit !== null) && (vu(l, 0), ie(
      l,
      W,
      vt,
      !1
    )), Ru(l, e), ((el & 2) === 0 || l !== sl) && (l === sl && ((el & 2) === 0 && (xe |= e), yl === 4 && ie(
      l,
      W,
      vt,
      !1
    )), Rt(l));
  }
  function od(l, t, e) {
    if ((el & 6) !== 0) throw Error(o(327));
    var u = !e && (t & 124) === 0 && (t & l.expiredLanes) === 0 || Ou(l, t), a = u ? cv(l, t) : Mi(l, t, !0), n = u;
    do {
      if (a === 0) {
        su && !u && ie(l, t, 0, !1);
        break;
      } else {
        if (e = l.current.alternate, n && !av(e)) {
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
              if (s && (vu(i, c).flags |= 256), c = Mi(
                i,
                c,
                !1
              ), c !== 2) {
                if (Ti && !s) {
                  i.errorRecoveryDisabledLanes |= n, xe |= n, a = 4;
                  break l;
                }
                n = Jl, Jl = a, n !== null && (Jl === null ? Jl = n : Jl.push.apply(
                  Jl,
                  n
                ));
              }
              a = c;
            }
            if (n = !1, a !== 2) continue;
          }
        }
        if (a === 1) {
          vu(l, 0), ie(l, t, 0, !0);
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
                vt,
                !ue
              );
              break l;
            case 2:
              Jl = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (a = pi + 300 - Et(), 10 < a)) {
            if (ie(
              u,
              t,
              vt,
              !ue
            ), _a(u, 0, !0) !== 0) break l;
            u.timeoutHandle = Gd(
              dd.bind(
                null,
                u,
                e,
                Jl,
                gn,
                Ai,
                t,
                vt,
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
          dd(
            u,
            e,
            Jl,
            gn,
            Ai,
            t,
            vt,
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
  function dd(l, t, e, u, a, n, c, i, s, m, T, D, S, b) {
    if (l.timeoutHandle = -1, D = t.subtreeFlags, (D & 8192 || (D & 16785408) === 16785408) && (ya = { stylesheets: null, count: 0, unsuspend: Gv }, ad(t), D = Qv(), D !== null)) {
      l.cancelPendingCommit = D(
        Sd.bind(
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
          T,
          1,
          S,
          b
        )
      ), ie(l, n, c, !m);
      return;
    }
    Sd(
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
  function av(l) {
    for (var t = l; ; ) {
      var e = t.tag;
      if ((e === 0 || e === 11 || e === 15) && t.flags & 16384 && (e = t.updateQueue, e !== null && (e = e.stores, e !== null)))
        for (var u = 0; u < e.length; u++) {
          var a = e[u], n = a.getSnapshot;
          a = a.value;
          try {
            if (!Il(n(), a)) return !1;
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
    t &= ~Ei, t &= ~xe, l.suspendedLanes |= t, l.pingedLanes &= ~t, u && (l.warmLanes |= t), u = l.expirationTimes;
    for (var a = t; 0 < a; ) {
      var n = 31 - Fl(a), c = 1 << n;
      u[n] = -1, a &= ~c;
    }
    e !== 0 && Ef(l, e, t);
  }
  function Sn() {
    return (el & 6) === 0 ? (sa(0), !1) : !0;
  }
  function _i() {
    if (J !== null) {
      if (ul === 0)
        var l = J.return;
      else
        l = J, Ht = Re = null, Lc(l), nu = null, Pu = 0, l = J;
      for (; l !== null; )
        Lo(l.alternate, l), l = l.return;
      J = null;
    }
  }
  function vu(l, t) {
    var e = l.timeoutHandle;
    e !== -1 && (l.timeoutHandle = -1, Av(e)), e = l.cancelPendingCommit, e !== null && (l.cancelPendingCommit = null, e()), _i(), sl = l, J = e = Ut(l.current, null), W = t, ul = 0, et = null, ue = !1, su = Ou(l, t), Ti = !1, ou = vt = Ei = xe = ae = yl = 0, Jl = ia = null, Ai = !1, (t & 8) !== 0 && (t |= t & 32);
    var u = l.entangledLanes;
    if (u !== 0)
      for (l = l.entanglements, u &= t; 0 < u; ) {
        var a = 31 - Fl(u), n = 1 << a;
        t |= l[a], u &= ~n;
      }
    return Qt = t, Ga(), e;
  }
  function rd(l, t) {
    L = null, A.H = an, t === Lu || t === $a ? (t = zs(), ul = 3) : t === Os ? (t = zs(), ul = 4) : ul = t === Uo ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, et = t, J === null && (yl = 1, on(
      l,
      ft(t, l.current)
    ));
  }
  function vd() {
    var l = A.H;
    return A.H = an, l === null ? an : l;
  }
  function hd() {
    var l = A.A;
    return A.A = ev, l;
  }
  function zi() {
    yl = 4, ue || (W & 4194048) !== W && rt.current !== null || (su = !0), (ae & 134217727) === 0 && (xe & 134217727) === 0 || sl === null || ie(
      sl,
      W,
      vt,
      !1
    );
  }
  function Mi(l, t, e) {
    var u = el;
    el |= 2;
    var a = vd(), n = hd();
    (sl !== l || W !== t) && (gn = null, vu(l, t)), t = !1;
    var c = yl;
    l: do
      try {
        if (ul !== 0 && J !== null) {
          var i = J, s = et;
          switch (ul) {
            case 8:
              _i(), c = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              rt.current === null && (t = !0);
              var m = ul;
              if (ul = 0, et = null, hu(l, i, s, m), e && su) {
                c = 0;
                break l;
              }
              break;
            default:
              m = ul, ul = 0, et = null, hu(l, i, s, m);
          }
        }
        nv(), c = yl;
        break;
      } catch (T) {
        rd(l, T);
      }
    while (!0);
    return t && l.shellSuspendCounter++, Ht = Re = null, el = u, A.H = a, A.A = n, J === null && (sl = null, W = 0, Ga()), c;
  }
  function nv() {
    for (; J !== null; ) yd(J);
  }
  function cv(l, t) {
    var e = el;
    el |= 2;
    var u = vd(), a = hd();
    sl !== l || W !== t ? (gn = null, mn = Et() + 500, vu(l, t)) : su = Ou(
      l,
      t
    );
    l: do
      try {
        if (ul !== 0 && J !== null) {
          t = J;
          var n = et;
          t: switch (ul) {
            case 1:
              ul = 0, et = null, hu(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (Rs(n)) {
                ul = 0, et = null, md(t);
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
              Rs(n) ? (ul = 0, et = null, md(t)) : (ul = 0, et = null, hu(l, t, n, 7));
              break;
            case 5:
              var c = null;
              switch (J.tag) {
                case 26:
                  c = J.memoizedState;
                case 5:
                case 27:
                  var i = J;
                  if (!c || Fd(c)) {
                    ul = 0, et = null;
                    var s = i.sibling;
                    if (s !== null) J = s;
                    else {
                      var m = i.return;
                      m !== null ? (J = m, bn(m)) : J = null;
                    }
                    break t;
                  }
              }
              ul = 0, et = null, hu(l, t, n, 5);
              break;
            case 6:
              ul = 0, et = null, hu(l, t, n, 6);
              break;
            case 8:
              _i(), yl = 6;
              break l;
            default:
              throw Error(o(462));
          }
        }
        iv();
        break;
      } catch (T) {
        rd(l, T);
      }
    while (!0);
    return Ht = Re = null, A.H = u, A.A = a, el = e, J !== null ? 0 : (sl = null, W = 0, Ga(), yl);
  }
  function iv() {
    for (; J !== null && !Mr(); )
      yd(J);
  }
  function yd(l) {
    var t = Zo(l.alternate, l, Qt);
    l.memoizedProps = l.pendingProps, t === null ? bn(l) : J = t;
  }
  function md(l) {
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
          W
        );
        break;
      case 11:
        t = jo(
          e,
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
        Lo(e, t), t = J = ms(t, Qt), t = Zo(e, t, Qt);
    }
    l.memoizedProps = l.pendingProps, t === null ? bn(l) : J = t;
  }
  function hu(l, t, e, u) {
    Ht = Re = null, Lc(t), nu = null, Pu = 0;
    var a = t.return;
    try {
      if (W0(
        l,
        a,
        t,
        e,
        W
      )) {
        yl = 1, on(
          l,
          ft(e, l.current)
        ), J = null;
        return;
      }
    } catch (n) {
      if (a !== null) throw J = a, n;
      yl = 1, on(
        l,
        ft(e, l.current)
      ), J = null;
      return;
    }
    t.flags & 32768 ? (ll || u === 1 ? l = !0 : su || (W & 536870912) !== 0 ? l = !1 : (ue = l = !0, (u === 2 || u === 9 || u === 3 || u === 6) && (u = rt.current, u !== null && u.tag === 13 && (u.flags |= 16384))), gd(t, l)) : bn(t);
  }
  function bn(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        gd(
          t,
          ue
        );
        return;
      }
      l = t.return;
      var e = I0(
        t.alternate,
        t,
        Qt
      );
      if (e !== null) {
        J = e;
        return;
      }
      if (t = t.sibling, t !== null) {
        J = t;
        return;
      }
      J = t = l;
    } while (t !== null);
    yl === 0 && (yl = 5);
  }
  function gd(l, t) {
    do {
      var e = P0(l.alternate, l);
      if (e !== null) {
        e.flags &= 32767, J = e;
        return;
      }
      if (e = l.return, e !== null && (e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null), !t && (l = l.sibling, l !== null)) {
        J = l;
        return;
      }
      J = l = e;
    } while (l !== null);
    yl = 6, J = null;
  }
  function Sd(l, t, e, u, a, n, c, i, s) {
    l.cancelPendingCommit = null;
    do
      Tn();
    while (Nl !== 0);
    if ((el & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === l.current) throw Error(o(177));
      if (n = t.lanes | t.childLanes, n |= bc, Gr(
        l,
        e,
        n,
        c,
        i,
        s
      ), l === sl && (J = sl = null, W = 0), du = t, ce = l, ru = e, Di = n, Oi = a, fd = u, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, dv(Da, function() {
        return pd(), null;
      })) : (l.callbackNode = null, l.callbackPriority = 0), u = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || u) {
        u = A.T, A.T = null, a = M.p, M.p = 2, c = el, el |= 4;
        try {
          lv(l, t, e);
        } finally {
          el = c, M.p = a, A.T = u;
        }
      }
      Nl = 1, bd(), Td(), Ed();
    }
  }
  function bd() {
    if (Nl === 1) {
      Nl = 0;
      var l = ce, t = du, e = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || e) {
        e = A.T, A.T = null;
        var u = M.p;
        M.p = 2;
        var a = el;
        el |= 4;
        try {
          td(t, l);
          var n = Qi, c = cs(l.containerInfo), i = n.focusedElem, s = n.selectionRange;
          if (c !== i && i && i.ownerDocument && ns(
            i.ownerDocument.documentElement,
            i
          )) {
            if (s !== null && hc(i)) {
              var m = s.start, T = s.end;
              if (T === void 0 && (T = m), "selectionStart" in i)
                i.selectionStart = m, i.selectionEnd = Math.min(
                  T,
                  i.value.length
                );
              else {
                var D = i.ownerDocument || document, S = D && D.defaultView || window;
                if (S.getSelection) {
                  var b = S.getSelection(), X = i.textContent.length, q = Math.min(s.start, X), cl = s.end === void 0 ? q : Math.min(s.end, X);
                  !b.extend && q > cl && (c = cl, cl = q, q = c);
                  var v = as(
                    i,
                    q
                  ), r = as(
                    i,
                    cl
                  );
                  if (v && r && (b.rangeCount !== 1 || b.anchorNode !== v.node || b.anchorOffset !== v.offset || b.focusNode !== r.node || b.focusOffset !== r.offset)) {
                    var y = D.createRange();
                    y.setStart(v.node, v.offset), b.removeAllRanges(), q > cl ? (b.addRange(y), b.extend(r.node, r.offset)) : (y.setEnd(r.node, r.offset), b.addRange(y));
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
              var p = D[i];
              p.element.scrollLeft = p.left, p.element.scrollTop = p.top;
            }
          }
          xn = !!Xi, Qi = Xi = null;
        } finally {
          el = a, M.p = u, A.T = e;
        }
      }
      l.current = t, Nl = 2;
    }
  }
  function Td() {
    if (Nl === 2) {
      Nl = 0;
      var l = ce, t = du, e = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || e) {
        e = A.T, A.T = null;
        var u = M.p;
        M.p = 2;
        var a = el;
        el |= 4;
        try {
          Fo(l, t.alternate, t);
        } finally {
          el = a, M.p = u, A.T = e;
        }
      }
      Nl = 3;
    }
  }
  function Ed() {
    if (Nl === 4 || Nl === 3) {
      Nl = 0, Ur();
      var l = ce, t = du, e = ru, u = fd;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Nl = 5 : (Nl = 0, du = ce = null, Ad(l, l.pendingLanes));
      var a = l.pendingLanes;
      if (a === 0 && (ne = null), wn(e), t = t.stateNode, Wl && typeof Wl.onCommitFiberRoot == "function")
        try {
          Wl.onCommitFiberRoot(
            Du,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        t = A.T, a = M.p, M.p = 2, A.T = null;
        try {
          for (var n = l.onRecoverableError, c = 0; c < u.length; c++) {
            var i = u[c];
            n(i.value, {
              componentStack: i.stack
            });
          }
        } finally {
          A.T = t, M.p = a;
        }
      }
      (ru & 3) !== 0 && Tn(), Rt(l), a = l.pendingLanes, (e & 4194090) !== 0 && (a & 42) !== 0 ? l === Ri ? fa++ : (fa = 0, Ri = l) : fa = 0, sa(0);
    }
  }
  function Ad(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, Zu(t)));
  }
  function Tn(l) {
    return bd(), Td(), Ed(), pd();
  }
  function pd() {
    if (Nl !== 5) return !1;
    var l = ce, t = Di;
    Di = 0;
    var e = wn(ru), u = A.T, a = M.p;
    try {
      M.p = 32 > e ? 32 : e, A.T = null, e = Oi, Oi = null;
      var n = ce, c = ru;
      if (Nl = 0, du = ce = null, ru = 0, (el & 6) !== 0) throw Error(o(331));
      var i = el;
      if (el |= 4, cd(n.current), ud(
        n,
        n.current,
        c,
        e
      ), el = i, sa(0, !1), Wl && typeof Wl.onPostCommitFiberRoot == "function")
        try {
          Wl.onPostCommitFiberRoot(Du, n);
        } catch {
        }
      return !0;
    } finally {
      M.p = a, A.T = u, Ad(l, t);
    }
  }
  function Dd(l, t, e) {
    t = ft(e, t), t = ai(l.stateNode, t, 2), l = Wt(l, t, 2), l !== null && (Ru(l, 2), Rt(l));
  }
  function fl(l, t, e) {
    if (l.tag === 3)
      Dd(l, l, e);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Dd(
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
            ), Ru(u, 2), Rt(u));
            break;
          }
        }
        t = t.return;
      }
  }
  function Ui(l, t, e) {
    var u = l.pingCache;
    if (u === null) {
      u = l.pingCache = new uv();
      var a = /* @__PURE__ */ new Set();
      u.set(t, a);
    } else
      a = u.get(t), a === void 0 && (a = /* @__PURE__ */ new Set(), u.set(t, a));
    a.has(e) || (Ti = !0, a.add(e), l = fv.bind(null, l, t, e), t.then(l, l));
  }
  function fv(l, t, e) {
    var u = l.pingCache;
    u !== null && u.delete(t), l.pingedLanes |= l.suspendedLanes & e, l.warmLanes &= ~e, sl === l && (W & e) === e && (yl === 4 || yl === 3 && (W & 62914560) === W && 300 > Et() - pi ? (el & 2) === 0 && vu(l, 0) : Ei |= e, ou === W && (ou = 0)), Rt(l);
  }
  function Od(l, t) {
    t === 0 && (t = Tf()), l = ke(l, t), l !== null && (Ru(l, t), Rt(l));
  }
  function sv(l) {
    var t = l.memoizedState, e = 0;
    t !== null && (e = t.retryLane), Od(l, e);
  }
  function ov(l, t) {
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
    u !== null && u.delete(t), Od(l, e);
  }
  function dv(l, t) {
    return Vn(l, t);
  }
  var En = null, yu = null, Ni = !1, An = !1, xi = !1, He = 0;
  function Rt(l) {
    l !== yu && l.next === null && (yu === null ? En = yu = l : yu = yu.next = l), An = !0, Ni || (Ni = !0, vv());
  }
  function sa(l, t) {
    if (!xi && An) {
      xi = !0;
      do
        for (var e = !1, u = En; u !== null; ) {
          if (l !== 0) {
            var a = u.pendingLanes;
            if (a === 0) var n = 0;
            else {
              var c = u.suspendedLanes, i = u.pingedLanes;
              n = (1 << 31 - Fl(42 | l) + 1) - 1, n &= a & ~(c & ~i), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (e = !0, Md(u, n));
          } else
            n = W, n = _a(
              u,
              u === sl ? n : 0,
              u.cancelPendingCommit !== null || u.timeoutHandle !== -1
            ), (n & 3) === 0 || Ou(u, n) || (e = !0, Md(u, n));
          u = u.next;
        }
      while (e);
      xi = !1;
    }
  }
  function rv() {
    Rd();
  }
  function Rd() {
    An = Ni = !1;
    var l = 0;
    He !== 0 && (Ev() && (l = He), He = 0);
    for (var t = Et(), e = null, u = En; u !== null; ) {
      var a = u.next, n = _d(u, t);
      n === 0 ? (u.next = null, e === null ? En = a : e.next = a, a === null && (yu = e)) : (e = u, (l !== 0 || (n & 3) !== 0) && (An = !0)), u = a;
    }
    sa(l);
  }
  function _d(l, t) {
    for (var e = l.suspendedLanes, u = l.pingedLanes, a = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var c = 31 - Fl(n), i = 1 << c, s = a[c];
      s === -1 ? ((i & e) === 0 || (i & u) !== 0) && (a[c] = Yr(i, t)) : s <= t && (l.expiredLanes |= i), n &= ~i;
    }
    if (t = sl, e = W, e = _a(
      l,
      l === t ? e : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), u = l.callbackNode, e === 0 || l === t && (ul === 2 || ul === 9) || l.cancelPendingCommit !== null)
      return u !== null && u !== null && Ln(u), l.callbackNode = null, l.callbackPriority = 0;
    if ((e & 3) === 0 || Ou(l, e)) {
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
      return u = zd.bind(null, l), e = Vn(e, u), l.callbackPriority = t, l.callbackNode = e, t;
    }
    return u !== null && u !== null && Ln(u), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function zd(l, t) {
    if (Nl !== 0 && Nl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var e = l.callbackNode;
    if (Tn() && l.callbackNode !== e)
      return null;
    var u = W;
    return u = _a(
      l,
      l === sl ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), u === 0 ? null : (od(l, u, t), _d(l, Et()), l.callbackNode != null && l.callbackNode === e ? zd.bind(null, l) : null);
  }
  function Md(l, t) {
    if (Tn()) return null;
    od(l, t, !0);
  }
  function vv() {
    pv(function() {
      (el & 6) !== 0 ? Vn(
        mf,
        rv
      ) : Rd();
    });
  }
  function Hi() {
    return He === 0 && (He = bf()), He;
  }
  function Ud(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : xa("" + l);
  }
  function Nd(l, t) {
    var e = t.ownerDocument.createElement("input");
    return e.name = t.name, e.value = t.value, l.id && e.setAttribute("form", l.id), t.parentNode.insertBefore(e, t), l = new FormData(l), e.parentNode.removeChild(e), l;
  }
  function hv(l, t, e, u, a) {
    if (t === "submit" && e && e.stateNode === a) {
      var n = Ud(
        (a[Zl] || null).action
      ), c = u.submitter;
      c && (t = (t = c[Zl] || null) ? Ud(t.formAction) : c.getAttribute("formAction"), t !== null && (n = t, c = null));
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
                  var s = c ? Nd(a, c) : new FormData(a);
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
                typeof n == "function" && (i.preventDefault(), s = c ? Nd(a, c) : new FormData(a), Pc(
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
    var Bi = Sc[Ci], yv = Bi.toLowerCase(), mv = Bi[0].toUpperCase() + Bi.slice(1);
    yt(
      yv,
      "on" + mv
    );
  }
  yt(ss, "onAnimationEnd"), yt(os, "onAnimationIteration"), yt(ds, "onAnimationStart"), yt("dblclick", "onDoubleClick"), yt("focusin", "onFocus"), yt("focusout", "onBlur"), yt(H0, "onTransitionRun"), yt(C0, "onTransitionStart"), yt(B0, "onTransitionCancel"), yt(rs, "onTransitionEnd"), Ge("onMouseEnter", ["mouseout", "mouseover"]), Ge("onMouseLeave", ["mouseout", "mouseover"]), Ge("onPointerEnter", ["pointerout", "pointerover"]), Ge("onPointerLeave", ["pointerout", "pointerover"]), ge(
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
  ), gv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(oa)
  );
  function xd(l, t) {
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
            } catch (T) {
              sn(T);
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
            } catch (T) {
              sn(T);
            }
            a.currentTarget = null, n = s;
          }
      }
    }
  }
  function w(l, t) {
    var e = t[$n];
    e === void 0 && (e = t[$n] = /* @__PURE__ */ new Set());
    var u = l + "__bubble";
    e.has(u) || (Hd(t, l, 2, !1), e.add(u));
  }
  function ji(l, t, e) {
    var u = 0;
    t && (u |= 4), Hd(
      e,
      l,
      u,
      t
    );
  }
  var pn = "_reactListening" + Math.random().toString(36).slice(2);
  function qi(l) {
    if (!l[pn]) {
      l[pn] = !0, Of.forEach(function(e) {
        e !== "selectionchange" && (gv.has(e) || ji(e, !1, l), ji(e, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[pn] || (t[pn] = !0, ji("selectionchange", !1, t));
    }
  }
  function Hd(l, t, e, u) {
    switch (ur(t)) {
      case 2:
        var a = Lv;
        break;
      case 8:
        a = Kv;
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
      var m = n, T = uc(e), D = [];
      l: {
        var S = vs.get(l);
        if (S !== void 0) {
          var b = ja, X = l;
          switch (l) {
            case "keypress":
              if (Ca(e) === 0) break l;
            case "keydown":
            case "keyup":
              b = d0;
              break;
            case "focusin":
              X = "focus", b = sc;
              break;
            case "focusout":
              X = "blur", b = sc;
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
              b = Pr;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              b = h0;
              break;
            case ss:
            case os:
            case ds:
              b = e0;
              break;
            case rs:
              b = m0;
              break;
            case "scroll":
            case "scrollend":
              b = Fr;
              break;
            case "wheel":
              b = S0;
              break;
            case "copy":
            case "cut":
            case "paste":
              b = a0;
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
              b = T0;
          }
          var q = (t & 4) !== 0, cl = !q && (l === "scroll" || l === "scrollend"), v = q ? S !== null ? S + "Capture" : null : S;
          q = [];
          for (var r = m, y; r !== null; ) {
            var p = r;
            if (y = p.stateNode, p = p.tag, p !== 5 && p !== 26 && p !== 27 || y === null || v === null || (p = Mu(r, v), p != null && q.push(
              da(r, p, y)
            )), cl) break;
            r = r.return;
          }
          0 < q.length && (S = new b(
            S,
            X,
            null,
            e,
            T
          ), D.push({ event: S, listeners: q }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (S = l === "mouseover" || l === "pointerover", b = l === "mouseout" || l === "pointerout", S && e !== ec && (X = e.relatedTarget || e.fromElement) && (je(X) || X[Be]))
            break l;
          if ((b || S) && (S = T.window === T ? T : (S = T.ownerDocument) ? S.defaultView || S.parentWindow : window, b ? (X = e.relatedTarget || e.toElement, b = m, X = X ? je(X) : null, X !== null && (cl = U(X), q = X.tag, X !== cl || q !== 5 && q !== 27 && q !== 6) && (X = null)) : (b = null, X = m), b !== X)) {
            if (q = Zf, p = "onMouseLeave", v = "onMouseEnter", r = "mouse", (l === "pointerout" || l === "pointerover") && (q = Lf, p = "onPointerLeave", v = "onPointerEnter", r = "pointer"), cl = b == null ? S : zu(b), y = X == null ? S : zu(X), S = new q(
              p,
              r + "leave",
              b,
              e,
              T
            ), S.target = cl, S.relatedTarget = y, p = null, je(T) === m && (q = new q(
              v,
              r + "enter",
              X,
              e,
              T
            ), q.target = y, q.relatedTarget = cl, p = q), cl = p, b && X)
              t: {
                for (q = b, v = X, r = 0, y = q; y; y = mu(y))
                  r++;
                for (y = 0, p = v; p; p = mu(p))
                  y++;
                for (; 0 < r - y; )
                  q = mu(q), r--;
                for (; 0 < y - r; )
                  v = mu(v), y--;
                for (; r--; ) {
                  if (q === v || v !== null && q === v.alternate)
                    break t;
                  q = mu(q), v = mu(v);
                }
                q = null;
              }
            else q = null;
            b !== null && Cd(
              D,
              S,
              b,
              q,
              !1
            ), X !== null && cl !== null && Cd(
              D,
              cl,
              X,
              q,
              !0
            );
          }
        }
        l: {
          if (S = m ? zu(m) : window, b = S.nodeName && S.nodeName.toLowerCase(), b === "select" || b === "input" && S.type === "file")
            var H = If;
          else if (Wf(S))
            if (Pf)
              H = U0;
            else {
              H = z0;
              var K = _0;
            }
          else
            b = S.nodeName, !b || b.toLowerCase() !== "input" || S.type !== "checkbox" && S.type !== "radio" ? m && tc(m.elementType) && (H = If) : H = M0;
          if (H && (H = H(l, m))) {
            Ff(
              D,
              H,
              e,
              T
            );
            break l;
          }
          K && K(l, S, m), l === "focusout" && m && S.type === "number" && m.memoizedProps.value != null && lc(S, "number", S.value);
        }
        switch (K = m ? zu(m) : window, l) {
          case "focusin":
            (Wf(K) || K.contentEditable === "true") && (Je = K, yc = m, qu = null);
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
            mc = !1, is(D, e, T);
            break;
          case "selectionchange":
            if (x0) break;
          case "keydown":
          case "keyup":
            is(D, e, T);
        }
        var B;
        if (dc)
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
          Ke ? $f(l, e) && (Y = "onCompositionEnd") : l === "keydown" && e.keyCode === 229 && (Y = "onCompositionStart");
        Y && (Kf && e.locale !== "ko" && (Ke || Y !== "onCompositionStart" ? Y === "onCompositionEnd" && Ke && (B = Xf()) : (Jt = T, cc = "value" in Jt ? Jt.value : Jt.textContent, Ke = !0)), K = Dn(m, Y), 0 < K.length && (Y = new Vf(
          Y,
          l,
          null,
          e,
          T
        ), D.push({ event: Y, listeners: K }), B ? Y.data = B : (B = kf(e), B !== null && (Y.data = B)))), (B = A0 ? p0(l, e) : D0(l, e)) && (Y = Dn(m, "onBeforeInput"), 0 < Y.length && (K = new Vf(
          "onBeforeInput",
          "beforeinput",
          null,
          e,
          T
        ), D.push({
          event: K,
          listeners: Y
        }), K.data = B)), hv(
          D,
          l,
          m,
          e,
          T
        );
      }
      xd(D, t);
    });
  }
  function da(l, t, e) {
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
        da(l, a, n)
      ), a = Mu(l, t), a != null && u.push(
        da(l, a, n)
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
  function Cd(l, t, e, u, a) {
    for (var n = t._reactName, c = []; e !== null && e !== u; ) {
      var i = e, s = i.alternate, m = i.stateNode;
      if (i = i.tag, s !== null && s === u) break;
      i !== 5 && i !== 26 && i !== 27 || m === null || (s = m, a ? (m = Mu(e, n), m != null && c.unshift(
        da(e, m, s)
      )) : a || (m = Mu(e, n), m != null && c.push(
        da(e, m, s)
      ))), e = e.return;
    }
    c.length !== 0 && l.push({ event: t, listeners: c });
  }
  var Sv = /\r\n?/g, bv = /\u0000|\uFFFD/g;
  function Bd(l) {
    return (typeof l == "string" ? l : "" + l).replace(Sv, `
`).replace(bv, "");
  }
  function jd(l, t) {
    return t = Bd(t), Bd(l) === t;
  }
  function On() {
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
        u != null && (l.onclick = On);
        break;
      case "onScroll":
        u != null && w("scroll", l);
        break;
      case "onScrollEnd":
        u != null && w("scrollend", l);
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
        w("beforetoggle", l), w("toggle", l), za(l, "popover", u);
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
        (!(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N") && (e = kr.get(e) || e, za(l, e, u));
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
        u != null && w("scroll", l);
        break;
      case "onScrollEnd":
        u != null && w("scrollend", l);
        break;
      case "onClick":
        u != null && (l.onclick = On);
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
        if (!Rf.hasOwnProperty(e))
          l: {
            if (e[0] === "o" && e[1] === "n" && (a = e.endsWith("Capture"), t = e.slice(2, a ? e.length - 7 : void 0), n = l[Zl] || null, n = n != null ? n[e] : null, typeof n == "function" && l.removeEventListener(t, n, a), typeof u == "function")) {
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
        w("error", l), w("load", l);
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
        w("invalid", l);
        var i = n = c = a = null, s = null, m = null;
        for (u in e)
          if (e.hasOwnProperty(u)) {
            var T = e[u];
            if (T != null)
              switch (u) {
                case "name":
                  a = T;
                  break;
                case "type":
                  c = T;
                  break;
                case "checked":
                  s = T;
                  break;
                case "defaultChecked":
                  m = T;
                  break;
                case "value":
                  n = T;
                  break;
                case "defaultValue":
                  i = T;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (T != null)
                    throw Error(o(137, t));
                  break;
                default:
                  nl(l, t, u, T, e, null);
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
        w("invalid", l), u = c = n = null;
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
        w("invalid", l), n = a = u = null;
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
        w("beforetoggle", l), w("toggle", l), w("cancel", l), w("close", l);
        break;
      case "iframe":
      case "object":
        w("load", l);
        break;
      case "video":
      case "audio":
        for (u = 0; u < oa.length; u++)
          w(oa[u], l);
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
          for (T in e)
            e.hasOwnProperty(T) && (u = e[T], u !== void 0 && Gi(
              l,
              t,
              T,
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
  function Tv(l, t, e, u) {
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
        var a = null, n = null, c = null, i = null, s = null, m = null, T = null;
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
                T = b;
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
          T,
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
        for (var X in e)
          if (S = e[X], e.hasOwnProperty(X) && S != null && !u.hasOwnProperty(X))
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
        for (var q in e)
          S = e[q], e.hasOwnProperty(q) && S != null && !u.hasOwnProperty(q) && nl(l, t, q, null, u, S);
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
          for (T in u)
            S = u[T], b = e[T], !u.hasOwnProperty(T) || S === b || S === void 0 && b === void 0 || Gi(
              l,
              t,
              T,
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
  function Rn(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function qd(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Yd(l, t) {
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
  function Ev() {
    var l = window.event;
    return l && l.type === "popstate" ? l === Vi ? !1 : (Vi = l, !0) : (Vi = null, !1);
  }
  var Gd = typeof setTimeout == "function" ? setTimeout : void 0, Av = typeof clearTimeout == "function" ? clearTimeout : void 0, Xd = typeof Promise == "function" ? Promise : void 0, pv = typeof queueMicrotask == "function" ? queueMicrotask : typeof Xd < "u" ? function(l) {
    return Xd.resolve(null).then(l).catch(Dv);
  } : Gd;
  function Dv(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function fe(l) {
    return l === "head";
  }
  function Qd(l, t) {
    var e = t, u = 0, a = 0;
    do {
      var n = e.nextSibling;
      if (l.removeChild(e), n && n.nodeType === 8)
        if (e = n.data, e === "/$") {
          if (0 < u && 8 > u) {
            e = u;
            var c = l.ownerDocument;
            if (e & 1 && ra(c.documentElement), e & 2 && ra(c.body), e & 4)
              for (e = c.head, ra(e), c = e.firstChild; c; ) {
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
  function Ov(l, t, e, u) {
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
  function Rv(l, t, e) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !e || (l = gt(l.nextSibling), l === null)) return null;
    return l;
  }
  function Ki(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState === "complete";
  }
  function _v(l, t) {
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
  function Zd(l) {
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
  function Vd(l, t, e) {
    switch (t = Rn(e), l) {
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
  function ra(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    kn(l);
  }
  var ht = /* @__PURE__ */ new Map(), Ld = /* @__PURE__ */ new Set();
  function _n(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  }
  var Zt = M.d;
  M.d = {
    f: zv,
    r: Mv,
    D: Uv,
    C: Nv,
    L: xv,
    m: Hv,
    X: Bv,
    S: Cv,
    M: jv
  };
  function zv() {
    var l = Zt.f(), t = Sn();
    return l || t;
  }
  function Mv(l) {
    var t = qe(l);
    t !== null && t.tag === 5 && t.type === "form" ? so(t) : Zt.r(l);
  }
  var gu = typeof document > "u" ? null : document;
  function Kd(l, t, e) {
    var u = gu;
    if (u && typeof t == "string" && t) {
      var a = it(t);
      a = 'link[rel="' + l + '"][href="' + a + '"]', typeof e == "string" && (a += '[crossorigin="' + e + '"]'), Ld.has(a) || (Ld.add(a), l = { rel: l, crossOrigin: e, href: t }, u.querySelector(a) === null && (t = u.createElement("link"), xl(t, "link", l), pl(t), u.head.appendChild(t)));
    }
  }
  function Uv(l) {
    Zt.D(l), Kd("dns-prefetch", l, null);
  }
  function Nv(l, t) {
    Zt.C(l, t), Kd("preconnect", l, t);
  }
  function xv(l, t, e) {
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
      ht.has(n) || (l = C(
        {
          rel: "preload",
          href: t === "image" && e && e.imageSrcSet ? void 0 : l,
          as: t
        },
        e
      ), ht.set(n, l), u.querySelector(a) !== null || t === "style" && u.querySelector(va(n)) || t === "script" && u.querySelector(ha(n)) || (t = u.createElement("link"), xl(t, "link", l), pl(t), u.head.appendChild(t)));
    }
  }
  function Hv(l, t) {
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
      if (!ht.has(n) && (l = C({ rel: "modulepreload", href: l }, t), ht.set(n, l), e.querySelector(a) === null)) {
        switch (u) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(ha(n)))
              return;
        }
        u = e.createElement("link"), xl(u, "link", l), pl(u), e.head.appendChild(u);
      }
    }
  }
  function Cv(l, t, e) {
    Zt.S(l, t, e);
    var u = gu;
    if (u && l) {
      var a = Ye(u).hoistableStyles, n = Su(l);
      t = t || "default";
      var c = a.get(n);
      if (!c) {
        var i = { loading: 0, preload: null };
        if (c = u.querySelector(
          va(n)
        ))
          i.loading = 5;
        else {
          l = C(
            { rel: "stylesheet", href: l, "data-precedence": t },
            e
          ), (e = ht.get(n)) && wi(l, e);
          var s = c = u.createElement("link");
          pl(s), xl(s, "link", l), s._p = new Promise(function(m, T) {
            s.onload = m, s.onerror = T;
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
  function Bv(l, t) {
    Zt.X(l, t);
    var e = gu;
    if (e && l) {
      var u = Ye(e).hoistableScripts, a = bu(l), n = u.get(a);
      n || (n = e.querySelector(ha(a)), n || (l = C({ src: l, async: !0 }, t), (t = ht.get(a)) && $i(l, t), n = e.createElement("script"), pl(n), xl(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, u.set(a, n));
    }
  }
  function jv(l, t) {
    Zt.M(l, t);
    var e = gu;
    if (e && l) {
      var u = Ye(e).hoistableScripts, a = bu(l), n = u.get(a);
      n || (n = e.querySelector(ha(a)), n || (l = C({ src: l, async: !0, type: "module" }, t), (t = ht.get(a)) && $i(l, t), n = e.createElement("script"), pl(n), xl(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, u.set(a, n));
    }
  }
  function Jd(l, t, e, u) {
    var a = (a = Z.current) ? _n(a) : null;
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
            va(l)
          )) && !n._p && (c.instance = n, c.state.loading = 5), ht.has(l) || (e = {
            rel: "preload",
            as: "style",
            href: e.href,
            crossOrigin: e.crossOrigin,
            integrity: e.integrity,
            media: e.media,
            hrefLang: e.hrefLang,
            referrerPolicy: e.referrerPolicy
          }, ht.set(l, e), n || qv(
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
  function va(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function wd(l) {
    return C({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function qv(l, t, e, u) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]") ? u.loading = 1 : (t = l.createElement("link"), u.preload = t, t.addEventListener("load", function() {
      return u.loading |= 1;
    }), t.addEventListener("error", function() {
      return u.loading |= 2;
    }), xl(t, "link", e), pl(t), l.head.appendChild(t));
  }
  function bu(l) {
    return '[src="' + it(l) + '"]';
  }
  function ha(l) {
    return "script[async]" + l;
  }
  function $d(l, t, e) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var u = l.querySelector(
            'style[data-href~="' + it(e.href) + '"]'
          );
          if (u)
            return t.instance = u, pl(u), u;
          var a = C({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null
          });
          return u = (l.ownerDocument || l).createElement(
            "style"
          ), pl(u), xl(u, "style", a), zn(u, e.precedence, l), t.instance = u;
        case "stylesheet":
          a = Su(e.href);
          var n = l.querySelector(
            va(a)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, pl(n), n;
          u = wd(e), (a = ht.get(a)) && wi(u, a), n = (l.ownerDocument || l).createElement("link"), pl(n);
          var c = n;
          return c._p = new Promise(function(i, s) {
            c.onload = i, c.onerror = s;
          }), xl(n, "link", u), t.state.loading |= 4, zn(n, e.precedence, l), t.instance = n;
        case "script":
          return n = bu(e.src), (a = l.querySelector(
            ha(n)
          )) ? (t.instance = a, pl(a), a) : (u = e, (a = ht.get(n)) && (u = C({}, e), $i(u, a)), l = l.ownerDocument || l, a = l.createElement("script"), pl(a), xl(a, "link", u), l.head.appendChild(a), t.instance = a);
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
  function kd(l, t, e) {
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
  function Wd(l, t, e) {
    l = l.ownerDocument || l, l.head.insertBefore(
      e,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function Yv(l, t, e) {
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
  function Fd(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  var ya = null;
  function Gv() {
  }
  function Xv(l, t, e) {
    if (ya === null) throw Error(o(475));
    var u = ya;
    if (t.type === "stylesheet" && (typeof e.media != "string" || matchMedia(e.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var a = Su(e.href), n = l.querySelector(
          va(a)
        );
        if (n) {
          l = n._p, l !== null && typeof l == "object" && typeof l.then == "function" && (u.count++, u = Un.bind(u), l.then(u, u)), t.state.loading |= 4, t.instance = n, pl(n);
          return;
        }
        n = l.ownerDocument || l, e = wd(e), (a = ht.get(a)) && wi(e, a), n = n.createElement("link"), pl(n);
        var c = n;
        c._p = new Promise(function(i, s) {
          c.onload = i, c.onerror = s;
        }), xl(n, "link", e), t.instance = n;
      }
      u.stylesheets === null && (u.stylesheets = /* @__PURE__ */ new Map()), u.stylesheets.set(t, l), (l = t.state.preload) && (t.state.loading & 3) === 0 && (u.count++, t = Un.bind(u), l.addEventListener("load", t), l.addEventListener("error", t));
    }
  }
  function Qv() {
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
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Nn = /* @__PURE__ */ new Map(), t.forEach(Zv, l), Nn = null, Un.call(l));
  }
  function Zv(l, t) {
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
    $$typeof: ol,
    Provider: null,
    Consumer: null,
    _currentValue: G,
    _currentValue2: G,
    _threadCount: 0
  };
  function Vv(l, t, e, u, a, n, c, i) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Kn(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Kn(0), this.hiddenUpdates = Kn(null), this.identifierPrefix = u, this.onUncaughtError = a, this.onCaughtError = n, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = i, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Id(l, t, e, u, a, n, c, i, s, m, T, D) {
    return l = new Vv(
      l,
      t,
      e,
      c,
      i,
      s,
      m,
      D
    ), t = 1, n === !0 && (t |= 24), n = Pl(3, null, null, t), l.current = n, n.stateNode = l, t = Uc(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: u,
      isDehydrated: e,
      cache: t
    }, Cc(n), l;
  }
  function Pd(l) {
    return l ? (l = We, l) : We;
  }
  function lr(l, t, e, u, a, n) {
    a = Pd(a), u.context === null ? u.context = a : u.pendingContext = a, u = kt(t), u.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (u.callback = n), e = Wt(l, u, t), e !== null && (at(e, l, t), Ju(e, l, t));
  }
  function tr(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var e = l.retryLane;
      l.retryLane = e !== 0 && e < t ? e : t;
    }
  }
  function Wi(l, t) {
    tr(l, t), (l = l.alternate) && tr(l, t);
  }
  function er(l) {
    if (l.tag === 13) {
      var t = ke(l, 67108864);
      t !== null && at(t, l, 67108864), Wi(l, 67108864);
    }
  }
  var xn = !0;
  function Lv(l, t, e, u) {
    var a = A.T;
    A.T = null;
    var n = M.p;
    try {
      M.p = 2, Fi(l, t, e, u);
    } finally {
      M.p = n, A.T = a;
    }
  }
  function Kv(l, t, e, u) {
    var a = A.T;
    A.T = null;
    var n = M.p;
    try {
      M.p = 8, Fi(l, t, e, u);
    } finally {
      M.p = n, A.T = a;
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
        ), ar(l, u);
      else if (wv(
        a,
        l,
        t,
        e,
        u
      ))
        u.stopPropagation();
      else if (ar(l, u), t & 4 && -1 < Jv.indexOf(l)) {
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
                      var s = 1 << 31 - Fl(c);
                      i.entanglements[1] |= s, c &= ~s;
                    }
                    Rt(n), (el & 6) === 0 && (mn = Et() + 500, sa(0));
                  }
                }
                break;
              case 13:
                i = ke(n, 2), i !== null && at(i, n, 2), Sn(), Wi(n, 2);
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
      var t = U(l);
      if (t === null) l = null;
      else {
        var e = t.tag;
        if (e === 13) {
          if (l = Q(t), l !== null) return l;
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
  function ur(l) {
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
        switch (Nr()) {
          case mf:
            return 2;
          case gf:
            return 8;
          case Da:
          case xr:
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
  var lf = !1, se = null, oe = null, de = null, ga = /* @__PURE__ */ new Map(), Sa = /* @__PURE__ */ new Map(), re = [], Jv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function ar(l, t) {
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
        de = null;
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
    }, t !== null && (t = qe(t), t !== null && er(t)), l) : (l.eventSystemFlags |= u, t = l.targetContainers, a !== null && t.indexOf(a) === -1 && t.push(a), l);
  }
  function wv(l, t, e, u, a) {
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
        return de = ba(
          de,
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
  function nr(l) {
    var t = je(l.target);
    if (t !== null) {
      var e = U(t);
      if (e !== null) {
        if (t = e.tag, t === 13) {
          if (t = Q(e), t !== null) {
            l.blockedOn = t, Xr(l.priority, function() {
              if (e.tag === 13) {
                var u = ut();
                u = Jn(u);
                var a = ke(e, u);
                a !== null && at(a, e, u), Wi(e, u);
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
        return t = qe(e), t !== null && er(t), l.blockedOn = e, !1;
      t.shift();
    }
    return !0;
  }
  function cr(l, t, e) {
    Cn(l) && e.delete(t);
  }
  function $v() {
    lf = !1, se !== null && Cn(se) && (se = null), oe !== null && Cn(oe) && (oe = null), de !== null && Cn(de) && (de = null), ga.forEach(cr), Sa.forEach(cr);
  }
  function Bn(l, t) {
    l.blockedOn === t && (l.blockedOn = null, lf || (lf = !0, f.unstable_scheduleCallback(
      f.unstable_NormalPriority,
      $v
    )));
  }
  var jn = null;
  function ir(l) {
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
    se !== null && Bn(se, l), oe !== null && Bn(oe, l), de !== null && Bn(de, l), ga.forEach(t), Sa.forEach(t);
    for (var e = 0; e < re.length; e++) {
      var u = re[e];
      u.blockedOn === l && (u.blockedOn = null);
    }
    for (; 0 < re.length && (e = re[0], e.blockedOn === null); )
      nr(e), e.blockedOn === null && re.shift();
    if (e = (l.ownerDocument || l).$$reactFormReplay, e != null)
      for (u = 0; u < e.length; u += 3) {
        var a = e[u], n = e[u + 1], c = a[Zl] || null;
        if (typeof n == "function")
          c || ir(e);
        else if (c) {
          var i = null;
          if (n && n.hasAttribute("formAction")) {
            if (a = n, c = n[Zl] || null)
              i = c.formAction;
            else if (Pi(a) !== null) continue;
          } else i = c.action;
          typeof i == "function" ? e[u + 1] = i : (e.splice(u, 3), u -= 3), ir(e);
        }
      }
  }
  function tf(l) {
    this._internalRoot = l;
  }
  qn.prototype.render = tf.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var e = t.current, u = ut();
    lr(e, u, l, t, null, null);
  }, qn.prototype.unmount = tf.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      lr(l.current, 2, null, l, null, null), Sn(), t[Be] = null;
    }
  };
  function qn(l) {
    this._internalRoot = l;
  }
  qn.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = pf();
      l = { blockedOn: null, target: l, priority: t };
      for (var e = 0; e < re.length && t !== 0 && t < re[e].priority; e++) ;
      re.splice(e, 0, l), e === 0 && nr(l);
    }
  };
  var fr = g.version;
  if (fr !== "19.1.0")
    throw Error(
      o(
        527,
        fr,
        "19.1.0"
      )
    );
  M.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(o(188)) : (l = Object.keys(l).join(","), Error(o(268, l)));
    return l = x(t), l = l !== null ? E(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var kv = {
    bundleType: 0,
    version: "19.1.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: A,
    reconcilerVersion: "19.1.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Yn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Yn.isDisabled && Yn.supportsFiber)
      try {
        Du = Yn.inject(
          kv
        ), Wl = Yn;
      } catch {
      }
  }
  return Aa.createRoot = function(l, t) {
    if (!_(l)) throw Error(o(299));
    var e = !1, u = "", a = Do, n = Oo, c = Ro, i = null;
    return t != null && (t.unstable_strictMode === !0 && (e = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onUncaughtError !== void 0 && (a = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (i = t.unstable_transitionCallbacks)), t = Id(
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
  }, Aa.hydrateRoot = function(l, t, e) {
    if (!_(l)) throw Error(o(299));
    var u = !1, a = "", n = Do, c = Oo, i = Ro, s = null, m = null;
    return e != null && (e.unstable_strictMode === !0 && (u = !0), e.identifierPrefix !== void 0 && (a = e.identifierPrefix), e.onUncaughtError !== void 0 && (n = e.onUncaughtError), e.onCaughtError !== void 0 && (c = e.onCaughtError), e.onRecoverableError !== void 0 && (i = e.onRecoverableError), e.unstable_transitionCallbacks !== void 0 && (s = e.unstable_transitionCallbacks), e.formState !== void 0 && (m = e.formState)), t = Id(
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
    ), t.context = Pd(null), e = t.current, u = ut(), u = Jn(u), a = kt(u), a.callback = null, Wt(e, a, u), e = u, t.current.lanes = e, Ru(t, e), Rt(t), l[Be] = t.current, qi(l), new qn(t);
  }, Aa.version = "19.1.0", Aa;
}
var Sr;
function nh() {
  if (Sr) return af.exports;
  Sr = 1;
  function f() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (g) {
        console.error(g);
      }
  }
  return f(), af.exports = ah(), af.exports;
}
var ch = nh();
class ih extends Al.Component {
  constructor(g) {
    super(g), this.state = { hasError: !1 };
  }
  static getDerivedStateFromError(g) {
    return { hasError: !0, error: g };
  }
  render() {
    return this.state.hasError ? /* @__PURE__ */ O.jsx("div", { children: "Something went wrong. Please refresh the page or contact express dev team." }) : this.props.children;
  }
}
const br = "https://www.adobe.com/express-search-api-v3", of = "urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418", Er = "urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852", rf = " AND ", Ar = ",";
function pr(f, g) {
  const h = /\[(.+)\]/.exec(g)[1].split(";"), o = new URLSearchParams(f);
  return h.forEach((_) => {
    const U = /^-(.+)/.exec(_);
    if (U) {
      o.delete(U[1]);
      return;
    }
    const Q = /^(.+)=(.+)/.exec(_);
    Q && o.set(Q[1], Q[2]);
  }), o.toString();
}
function fh(f) {
  f.has("collection") && (f.get("collection") === "default" ? f.set("collectionId", `${of}`) : f.get("collection") === "popular" && f.set("collectionId", `${Er}`), f.delete("collection")), f.get("collectionId") || f.set("collectionId", `${of}`);
}
function sh(f) {
  f.get("license") && (f.append("filters", `licensingCategory==${f.get("license")}`), f.delete("license")), f.get("behaviors") && (f.append("filters", `behaviors==${f.get("behaviors")}`), f.delete("behaviors")), f.get("tasks") && (f.append("filters", `pages.task.name==${f.get("tasks")}`), f.delete("tasks")), f.get("topics") && (f.get("topics").split(rf).forEach((g) => {
    f.append("filters", `topics==${g}`);
  }), f.delete("topics")), f.get("language") && (f.append("filters", `language==${f.get("language")}`), f.delete("language"));
}
function oh(f) {
  const g = {};
  return f.get("prefLang") && (g["x-express-pref-lang"] = f.get("prefLang"), f.delete("prefLang")), f.get("prefRegion") && (g["x-express-pref-region-code"] = f.get("prefRegion"), f.delete("prefRegion")), g;
}
function vf(f) {
  const g = {}, h = new URLSearchParams(f);
  if (h.set("queryType", "search"), fh(h), h.get("templateIds"))
    h.append("filters", `id==${h.get("templateIds")}`), h.delete("templateIds");
  else {
    if (h.has("backup")) {
      const _ = h.get("backup");
      h.delete("backup"), g.backupQuery = {
        target: h.get("limit"),
        ...vf(pr(h, _))
      };
    }
    sh(h), g.headers = oh(h);
  }
  const o = new URL(br).host === window.location.host ? "" : "&ax-env=stage";
  return g.url = `${br}?${decodeURIComponent(h.toString())}${o}`, g;
}
async function sf(f, g) {
  return await (await fetch(f, { headers: g })).json();
}
function dh(f) {
  const [g, h] = [/* @__PURE__ */ new Set(), []];
  return f.forEach((o) => {
    g.has(o.id) || (g.add(o.id), h.push(o));
  }), h;
}
async function rh(f) {
  var E;
  const { url: g, headers: h, backupQuery: o } = vf(f);
  if (!o || !o.target)
    return sf(g, h);
  const [_, U] = [
    sf(g, h),
    sf(o.url, o.headers)
  ], Q = await _;
  if (((E = Q.items) == null ? void 0 : E.length) >= o.target)
    return Q;
  const F = await U, x = dh([...Q.items, ...F.items]).slice(0, o.target);
  return {
    metadata: {
      totalHits: x.length,
      start: "0",
      limit: o.target
    },
    items: x
  };
}
function vh(f) {
  var g, h, o;
  return (g = f["dc:title"]) != null && g["i-default"] ? f["dc:title"]["i-default"] : (h = f.moods) != null && h.length && ((o = f.task) != null && o.name) ? `${f.moods.join(", ")} ${f.task.name}` : "";
}
function hh(f) {
  var g, h;
  return (h = (g = f._links) == null ? void 0 : g["http://ns.adobe.com/adobecloud/rel/rendition"]) == null ? void 0 : h.href;
}
function yh(f) {
  var g, h;
  return (h = (g = f._links) == null ? void 0 : g["http://ns.adobe.com/adobecloud/rel/component"]) == null ? void 0 : h.href;
}
const hf = {
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
function Dr(f, g) {
  return !f && !g || f === g ? !0 : Array.isArray(f) && Array.isArray(g) ? f.length !== g.length ? !1 : f.every((h, o) => Dr(h, g[o])) : !1;
}
function mh(f, g) {
  return Object.keys(hf).filter((h) => !["start", "backupRecipe", "limit"].includes(h)).reduce((h, o) => {
    const _ = f[o], U = g[o];
    return Dr(_, U) ? h : _ && !U ? [...h, { type: "-", key: o }] : [...h, { type: "+", key: o, value: U }];
  }, []);
}
function Or(f) {
  const g = new URLSearchParams(f), h = structuredClone(hf);
  if (g.has("collectionId") ? g.get("collectionId") === of ? (h.collection = "default", h.collectionId = "") : g.get("collectionId") === Er ? (h.collection = "popular", h.collectionId = "") : h.collection = "custom" : g.has("collection") && ["default", "popular"].includes(g.get("collection")) ? (h.collection = g.get("collection"), h.collectionId = "") : (h.collection = "default", h.collectionId = ""), g.has("templateIds"))
    return h.templateIds = g.get("templateIds").split(","), h;
  if (g.get("limit") && (h.limit = Number(g.get("limit"))), g.get("start") && (h.start = Number(g.get("start"))), g.get("orderBy") && (h.orderBy = g.get("orderBy")), g.get("q") && (h.q = g.get("q")), g.get("language") && (h.language = g.get("language")), g.get("tasks") && (h.tasks = g.get("tasks")), g.get("topics") && (h.topics = g.get("topics").split(rf).map((o) => o.split(Ar))), g.get("license") && (h.license = g.get("license")), g.get("behaviors") && (h.behaviors = g.get("behaviors")), g.get("prefLang") && (h.prefLang = g.get("prefLang")), g.get("prefRegion") && (h.prefRegion = g.get("prefRegion").toUpperCase()), g.get("backup")) {
    const o = g.get("backup");
    g.delete("backup"), h.backupRecipe = pr(g, o);
  }
  return h;
}
function yf(f) {
  const g = f.collection === "custom" ? "" : `collection=${f.collection}`, h = f.collection === "custom" ? `collectionId=${f.collectionId}` : "", o = f.templateIds.filter(Boolean).map((ol) => ol.trim()), _ = o[0] ? `templateIds=${o.join(",")}` : "";
  if (_)
    return [g, h, _].filter(Boolean).join("&");
  const U = f.limit ? `limit=${f.limit}` : "", Q = f.start ? `start=${f.start}` : "", F = f.q ? `q=${f.q}` : "", x = f.language ? `language=${f.language}` : "", E = f.tasks ? `tasks=${f.tasks}` : "", C = f.topics.filter((ol) => ol.some(Boolean)).map((ol) => ol.filter(Boolean).join(Ar)).join(rf), tl = C ? `topics=${C}` : "", $ = f.license ? `license=${f.license}` : "", zl = f.behaviors ? `behaviors=${f.behaviors}` : "", Ml = f.orderBy ? `orderBy=${f.orderBy}` : "", wl = f.prefLang ? `prefLang=${f.prefLang}` : "", Hl = f.prefRegion ? `prefRegion=${f.prefRegion}` : "";
  let St = "";
  if (f.backupRecipe) {
    const ol = mh(f, Or(f.backupRecipe));
    ol.length && (St = `backup=[${ol.map(({ type: k, key: Cl, value: Xl }) => k === "-" ? `-${Cl}` : `${Cl}=${Xl}`).join(";")}]`);
  }
  return [
    F,
    tl,
    E,
    x,
    $,
    zl,
    Ml,
    U,
    g,
    h,
    wl,
    Hl,
    Q,
    St
  ].filter(Boolean).join("&");
}
const Rr = Al.createContext(null), _r = Al.createContext(null), zr = Al.createContext(null);
function Eu() {
  return Al.useContext(Rr);
}
function Au() {
  return Al.useContext(_r);
}
function gh() {
  return Al.useContext(zr);
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
function Sh(f, g) {
  const { type: h, payload: o } = g, { field: _, value: U, topicsRow: Q, topicsCol: F, idsRow: x } = o || {};
  switch (h) {
    case _l.UPDATE_RECIPE:
      return Or(U);
    case _l.UPDATE_FORM:
      return { ...f, [_]: U };
    case _l.TOPICS_ADD: {
      const E = structuredClone(f.topics);
      return E[Q].push(""), { ...f, topics: E };
    }
    case _l.TOPICS_REMOVE: {
      const E = structuredClone(f.topics);
      return E[Q].pop(), E[Q].length || E.splice(Q, 1), {
        ...f,
        topics: E
      };
    }
    case _l.TOPICS_UPDATE: {
      const E = structuredClone(f.topics);
      return E[Q][F] = U, {
        ...f,
        topics: E
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
        templateIds: [...f.templateIds.slice(0, x), U, ...f.templateIds.slice(x + 1)]
      };
    case _l.IDS_REMOVE:
      return {
        ...f,
        templateIds: [...f.templateIds.slice(0, x), ...f.templateIds.slice(x + 1)]
      };
    default:
      throw new Error(`Unhandled action type: ${h}`);
  }
}
function bh() {
  const [f, g] = Al.useState(null), h = Al.useRef(null), o = Al.useCallback((_) => {
    h.current && clearTimeout(h.current), g(_), h.current = setTimeout(() => g(null), 5e3);
  }, []);
  return Al.useEffect(() => () => {
    h.current && clearTimeout(h.current);
  }, []), [f, o];
}
function Th({ children: f }) {
  const [g, h] = bh();
  return /* @__PURE__ */ O.jsx(zr, { value: { activeInfo: g, showInfo: h }, children: f });
}
function Eh({ children: f }) {
  const [g, h] = Al.useReducer(Sh, hf);
  return /* @__PURE__ */ O.jsx(Rr, { value: g, children: /* @__PURE__ */ O.jsx(Th, { children: /* @__PURE__ */ O.jsx(_r, { value: h, children: f }) }) });
}
function Ah() {
  const [f, g] = Al.useState(!1), h = Eu(), o = yf(h), _ = Au(), U = () => {
    navigator.clipboard.writeText(o), g(!0), setTimeout(() => g(!1), 2e3);
  };
  return /* @__PURE__ */ O.jsxs("div", { className: "border-grey rounded p-1", children: [
    /* @__PURE__ */ O.jsx("h2", { children: "Recipe to Form:" }),
    /* @__PURE__ */ O.jsx(
      "textarea",
      {
        autoCorrect: "off",
        autoCapitalize: "off",
        spellCheck: "false",
        value: o,
        onChange: (Q) => _({
          type: _l.UPDATE_RECIPE,
          payload: { value: Q.target.value }
        })
      }
    ),
    /* @__PURE__ */ O.jsxs("div", { className: "copy-button-container flex items-center justify-between", children: [
      /* @__PURE__ */ O.jsx("button", { onClick: U, children: "Copy" }),
      f && /* @__PURE__ */ O.jsx("p", { className: "copied", children: "Copied to clipboard!" })
    ] })
  ] });
}
function pu({ children: f }) {
  return /* @__PURE__ */ O.jsx("label", { className: "flex gap-2 items-center flex-wrap", children: f });
}
function ph({ topicsGroup: f, rowIndex: g, expandButton: h }) {
  const o = Au();
  return /* @__PURE__ */ O.jsxs(pu, { children: [
    g === 0 ? "Topics:" : "AND Topics:",
    f.map((_, U) => /* @__PURE__ */ O.jsx(
      "input",
      {
        className: "topics-input",
        name: `topic-group-${g}-${U}`,
        type: "text",
        value: _,
        onChange: (Q) => o({
          type: _l.TOPICS_UPDATE,
          payload: {
            topicsRow: g,
            topicsCol: U,
            value: Q.target.value
          }
        })
      },
      U
    )),
    /* @__PURE__ */ O.jsxs("div", { className: "flex gap-1", children: [
      g === 0 && f.length === 1 || /* @__PURE__ */ O.jsx(
        "button",
        {
          onClick: (_) => {
            _.preventDefault(), o({
              type: _l.TOPICS_REMOVE,
              payload: {
                topicsRow: g
              }
            });
          },
          children: "-"
        }
      ),
      f.every(Boolean) && /* @__PURE__ */ O.jsx(
        "button",
        {
          onClick: (_) => {
            _.preventDefault(), o({
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
function Dh() {
  const f = Eu(), g = Au(), h = f.topics, o = /* @__PURE__ */ O.jsx(
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
  return /* @__PURE__ */ O.jsx("div", { className: "flex flex-col items-start", children: h.map((_, U) => /* @__PURE__ */ O.jsx(
    ph,
    {
      rowIndex: U,
      topicsGroup: h[U],
      expandButton: U === h.length - 1 ? o : null
    },
    U
  )) });
}
function Oh({ fieldName: f, content: g }) {
  const { activeInfo: h, showInfo: o } = gh();
  return /* @__PURE__ */ O.jsxs(O.Fragment, { children: [
    /* @__PURE__ */ O.jsx(
      "button",
      {
        type: "button",
        className: "info-button",
        "aria-label": `Show information for ${f}`,
        onClick: () => o(f),
        children: "？"
      }
    ),
    h === f && /* @__PURE__ */ O.jsx("div", { className: "info-content", tabIndex: "0", children: /* @__PURE__ */ O.jsx("small", { children: g }) })
  ] });
}
const Xn = Al.memo(Oh);
function Tu({
  label: f,
  name: g,
  title: h,
  value: o,
  onChange: _,
  info: U,
  required: Q,
  disabled: F,
  ...x
}) {
  return /* @__PURE__ */ O.jsxs(pu, { children: [
    f,
    /* @__PURE__ */ O.jsx(
      "input",
      {
        name: g,
        type: "text",
        title: h,
        required: Q,
        disabled: F,
        value: o,
        onChange: _,
        ...x
      }
    ),
    U && /* @__PURE__ */ O.jsx(
      Xn,
      {
        fieldName: g,
        content: U
      }
    )
  ] });
}
function Gn({
  label: f,
  name: g,
  value: h,
  onChange: o,
  options: _,
  info: U,
  ...Q
}) {
  return /* @__PURE__ */ O.jsxs(pu, { children: [
    f,
    /* @__PURE__ */ O.jsx(
      "select",
      {
        name: g,
        value: h,
        onChange: o,
        ...Q,
        children: _.map((F) => /* @__PURE__ */ O.jsx("option", { value: F.value, children: F.label }, F.value))
      }
    ),
    U && /* @__PURE__ */ O.jsx(
      Xn,
      {
        fieldName: g,
        content: U
      }
    )
  ] });
}
function Tr({
  label: f,
  name: g,
  value: h,
  onChange: o,
  info: _,
  ...U
}) {
  return /* @__PURE__ */ O.jsxs(pu, { children: [
    f,
    /* @__PURE__ */ O.jsx(
      "input",
      {
        name: g,
        type: "number",
        value: h,
        onChange: o,
        ...U
      }
    ),
    _ && /* @__PURE__ */ O.jsx(
      Xn,
      {
        fieldName: g,
        content: _
      }
    )
  ] });
}
function Rh({
  label: f,
  name: g,
  value: h,
  onChange: o,
  info: _
}) {
  return /* @__PURE__ */ O.jsxs(pu, { children: [
    /* @__PURE__ */ O.jsx("small", { children: f }),
    /* @__PURE__ */ O.jsx(
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
    _ && /* @__PURE__ */ O.jsx(
      Xn,
      {
        fieldName: g,
        content: _
      }
    )
  ] });
}
function _h({ rowIndex: f, templateId: g, expandButton: h }) {
  const o = Au();
  return /* @__PURE__ */ O.jsxs(pu, { children: [
    /* @__PURE__ */ O.jsx(
      "input",
      {
        className: "template-id-input",
        type: "text",
        value: g,
        name: `template-manual-id-${f}`,
        onChange: (_) => o({
          type: _l.IDS_UPDATE,
          payload: {
            idsRow: f,
            value: _.target.value
          }
        })
      }
    ),
    /* @__PURE__ */ O.jsxs("div", { className: "flex gap-1", children: [
      f === 0 || /* @__PURE__ */ O.jsx(
        "button",
        {
          onClick: (_) => {
            _.preventDefault(), o({
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
function zh() {
  const f = Eu(), g = Au(), { templateIds: h } = f, o = /* @__PURE__ */ O.jsx(
    "button",
    {
      onClick: (_) => {
        _.preventDefault(), g({
          type: _l.IDS_ADD
        });
      },
      children: "ADD ID"
    }
  );
  return /* @__PURE__ */ O.jsx("div", { className: "flex flex-col items-start", children: h.map((_, U) => /* @__PURE__ */ O.jsx(
    _h,
    {
      rowIndex: U,
      templateId: _,
      expandButton: U === h.length - 1 ? o : null
    },
    U
  )) });
}
function Mh() {
  const f = Eu(), g = Au(), h = Al.useCallback(
    (o, _ = !1) => ({ target: { value: U } }) => {
      g({
        type: _l.UPDATE_FORM,
        payload: { field: o, value: _ ? Number(U) : U }
      });
    },
    [g]
  );
  return /* @__PURE__ */ O.jsxs("form", { className: "border-grey rounded p-1 gap-1", children: [
    /* @__PURE__ */ O.jsx("h2", { children: "Form to Recipe:" }),
    /* @__PURE__ */ O.jsx("h4", { children: "Search Parameters" }),
    /* @__PURE__ */ O.jsx(
      Tu,
      {
        label: "Q:",
        name: "q",
        value: f.q,
        onChange: h("q"),
        info: "Search query. This is more flexible and ambiguous than using filters but also less precise."
      }
    ),
    /* @__PURE__ */ O.jsx(
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
    /* @__PURE__ */ O.jsx(
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
    f.collection === "custom" && !f.collectionId && /* @__PURE__ */ O.jsx("div", { className: "error-message", children: "Collection ID is required when using a custom collection" }),
    /* @__PURE__ */ O.jsx(
      Tr,
      {
        label: "Limit:",
        name: "limit",
        value: f.limit,
        onChange: h("limit", !0),
        info: "Number of results to return"
      }
    ),
    /* @__PURE__ */ O.jsx(
      Tr,
      {
        label: "Start:",
        name: "start",
        value: f.start,
        onChange: h("start", !0),
        info: "Starting index for the results"
      }
    ),
    /* @__PURE__ */ O.jsx(
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
    /* @__PURE__ */ O.jsx("h4", { children: "Filters (comma separated):" }),
    /* @__PURE__ */ O.jsx(
      Tu,
      {
        label: "Language:",
        name: "language",
        value: f.language,
        onChange: h("language"),
        info: "Available values : ar-SA, bn-IN, cs-CZ, da-DK, de-DE, el-GR, en-US, es-ES, fil-P,fi-FI, fr-FR,hi-IN, id-ID, it-IT, ja-JP, ko-KR, ms-MY, nb-NO, nl-NL, pl-PL, pt-BR, ro-RO, ru-RU, sv-SE, ta-IN, th-TH, tr-TR, uk-UA, vi-VN, zh-Hans-CN, zh-Hant-TW"
      }
    ),
    /* @__PURE__ */ O.jsx(
      Tu,
      {
        label: "Tasks:",
        name: "tasks",
        value: f.tasks,
        onChange: h("tasks")
      }
    ),
    /* @__PURE__ */ O.jsx(Dh, {}),
    /* @__PURE__ */ O.jsx(
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
    /* @__PURE__ */ O.jsx(
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
    /* @__PURE__ */ O.jsx("h4", { children: "Manual Template IDs (exclusive and disable rest of form)" }),
    /* @__PURE__ */ O.jsx(zh, {}),
    /* @__PURE__ */ O.jsx("h4", { children: "Boosting:" }),
    /* @__PURE__ */ O.jsx(
      Tu,
      {
        label: "Preferred Language Boosting:",
        name: "prefLang",
        value: f.prefLang,
        onChange: h("prefLang"),
        info: "Boost templates that are in this language. Useful when your results have a mix of languages. Same list as the one for language filter."
      }
    ),
    /* @__PURE__ */ O.jsx(
      Tu,
      {
        label: "Preferred Region Boosting:",
        name: "prefRegion",
        value: f.prefRegion,
        onChange: h("prefRegion"),
        info: "Available values :  AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KR, KV, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, ST, SV, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, YE, YT, ZA, ZM, ZW, ZZ"
      }
    ),
    /* @__PURE__ */ O.jsx("h4", { children: "Backup Recipe:" }),
    /* @__PURE__ */ O.jsx(
      Rh,
      {
        name: "backupRecipe",
        value: f.backupRecipe,
        onChange: h("backupRecipe"),
        label: "When not enough templates exist for the recipe's limit, templates from this backup recipe will be used to backfill. Note: start will stop functioning, and this setup should only be used for 1-page query (no toolbar and pagination)."
      }
    )
  ] });
}
function Uh(f) {
  var F;
  const g = (F = f.pages[0].rendition.image) == null ? void 0 : F.thumbnail, h = yh(f), o = hh(f), { mediaType: _, componentId: U, hzRevision: Q } = g;
  return _ === "image/webp" ? h.replace(
    "{&revision,component_id}",
    `&revision=${Q || 0}&component_id=${U}`
  ) : o.replace(
    "{&page,size,type,fragment}",
    `&type=${_}&fragment=id=${U}`
  );
}
function Nh({ data: f }) {
  const g = /* @__PURE__ */ O.jsx("img", { src: Uh(f), alt: vh(f) });
  return /* @__PURE__ */ O.jsx("div", { className: "flex flex-col template", children: g });
}
function xh({ generateResults: f, loading: g, results: h }) {
  return /* @__PURE__ */ O.jsx("button", { onClick: f, disabled: g, children: g ? "Generating..." : h ? "Regenerate" : "Generate" });
}
function Hh() {
  var E, C, tl;
  const f = Eu(), g = yf(f), [h, o] = Al.useState(null), [_, U] = Al.useState(!1), [Q, F] = Al.useState(null), x = async () => {
    o(null), U(!0), F(null);
    try {
      const $ = await rh(g);
      o($);
    } catch ($) {
      F($);
    } finally {
      U(!1);
    }
  };
  return /* @__PURE__ */ O.jsxs("div", { className: "border-grey rounded p-1 gap-1", children: [
    /* @__PURE__ */ O.jsx("h2", { children: "Results" }),
    /* @__PURE__ */ O.jsx(
      xh,
      {
        generateResults: x,
        loading: _,
        results: h
      }
    ),
    _ && /* @__PURE__ */ O.jsx("p", { children: "Loading..." }),
    Q && /* @__PURE__ */ O.jsxs("p", { children: [
      "Error: ",
      Q.message
    ] }),
    ((E = h == null ? void 0 : h.metadata) == null ? void 0 : E.totalHits) > 0 && /* @__PURE__ */ O.jsxs("p", { children: [
      "Total hits: ",
      h.metadata.totalHits
    ] }),
    ((C = h == null ? void 0 : h.metadata) == null ? void 0 : C.totalHits) === 0 && /* @__PURE__ */ O.jsx("p", { children: "No results found. Try different recipe." }),
    ((tl = h == null ? void 0 : h.items) == null ? void 0 : tl.length) > 0 && /* @__PURE__ */ O.jsx("div", { className: "flex flex-wrap gap-2 templates", children: h.items.map(($) => /* @__PURE__ */ O.jsx(Nh, { data: $ }, $.id)) })
  ] });
}
function Ch() {
  const f = Eu(), { url: g, headers: h, backupQuery: o } = vf(yf(f)), _ = o ? /* @__PURE__ */ O.jsxs("div", { className: "pt-1", children: [
    /* @__PURE__ */ O.jsx("div", { children: /* @__PURE__ */ O.jsxs("code", { children: [
      "Backup URL: ",
      o.url
    ] }) }),
    /* @__PURE__ */ O.jsx("div", { children: /* @__PURE__ */ O.jsxs("code", { children: [
      "Backup Headers: ",
      JSON.stringify(o.headers, null, 2)
    ] }) })
  ] }) : null;
  return /* @__PURE__ */ O.jsxs("div", { className: "border-grey rounded p-1", children: [
    /* @__PURE__ */ O.jsx("h2", { children: "Support" }),
    /* @__PURE__ */ O.jsxs("p", { children: [
      "Authoring questions, copy the ",
      /* @__PURE__ */ O.jsx("strong", { children: "recipe (left)" }),
      " and ask in",
      " ",
      /* @__PURE__ */ O.jsx("a", { href: "https://adobe.enterprise.slack.com/archives/C04UH0M1CRG", children: "#express-dev-core" }),
      "."
    ] }),
    /* @__PURE__ */ O.jsxs("p", { children: [
      "API/Content Tagging questions, copy the url and headers below and ask in",
      " ",
      /* @__PURE__ */ O.jsx("a", { href: "https://adobe.enterprise.slack.com/archives/C01KV8N5EPR", children: "#express-content-clients" }),
      "."
    ] }),
    /* @__PURE__ */ O.jsxs("div", { className: "support--code", children: [
      /* @__PURE__ */ O.jsxs("div", { children: [
        /* @__PURE__ */ O.jsx("div", { children: /* @__PURE__ */ O.jsxs("code", { children: [
          "URL: ",
          g
        ] }) }),
        /* @__PURE__ */ O.jsx("div", { children: /* @__PURE__ */ O.jsxs("code", { children: [
          "headers: ",
          JSON.stringify(h, null, 2)
        ] }) })
      ] }),
      _
    ] })
  ] });
}
function Bh() {
  return /* @__PURE__ */ O.jsx(ih, { children: /* @__PURE__ */ O.jsx(Eh, { children: /* @__PURE__ */ O.jsxs("div", { className: "app-container m-auto", children: [
    /* @__PURE__ */ O.jsx("h1", { children: "Templates as a Service (TaaS)" }),
    /* @__PURE__ */ O.jsxs("div", { className: "flex flex-wrap gap-1", children: [
      /* @__PURE__ */ O.jsxs("div", { className: "left-container flex flex-col gap-1", children: [
        /* @__PURE__ */ O.jsx(Ah, {}),
        /* @__PURE__ */ O.jsx(Mh, {})
      ] }),
      /* @__PURE__ */ O.jsxs("div", { className: "right-container flex flex-col gap-1", children: [
        /* @__PURE__ */ O.jsx(Ch, {}),
        /* @__PURE__ */ O.jsx(Hh, {})
      ] })
    ] })
  ] }) }) });
}
function jh(f = "root") {
  const g = document.getElementById(f);
  if (!g) {
    console.error(`Container with id "${f}" not found`);
    return;
  }
  const h = ch.createRoot(g);
  return h.render(
    /* @__PURE__ */ O.jsx(Al.StrictMode, { children: /* @__PURE__ */ O.jsx(Bh, {}) })
  ), h;
}
typeof window < "u" && document.getElementById("root") && jh("root");
export {
  jh as initTemplatesAsAService
};
//# sourceMappingURL=templates-as-a-service.min.es.js.map
