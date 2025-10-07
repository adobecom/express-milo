import * as e from 'https://new.express.adobe.com/static/add-on-sdk/sdk.js';

let t;
let n;
let a;
let r;
const i = {
  4762: (e, t, n) => {
    const a = n(2540);
    const r = n(4376);
    const i = n(6778);
    const s = n(3696);
    const o = n(7470);
    const c = n(5022);
    const l = (n(5673), n(164), n(1279), n(7250));
    const d = n(3116);
    const u = n(9874);
    const p = n(6922);
    const m = n(1750);
    const h = n(7243);
    const g = n.n(h);
    const v = n(4418);
    const f = ({ ...e }) => (0, a.jsx)(v.I, {
      ...e,
      children: (0, a.jsx)('svg', {
        'aria-hidden': 'true',
        'aria-label': '',
        fill: 'currentColor',
        role: 'img',
        viewBox: '0 0 22 22',
        xmlns: 'http://www.w3.org/2000/svg',
        children: (0, a.jsx)('path', {
          d: 'M20.1658 11.2002C20.6308 9.86629 20.7743 9.64155 20.7743 8.52213V6.1111C20.7743 2.74164 18.0327 0 14.6632 0H9.56483C8.5855 0 7.66407 0.381944 6.97179 1.07421L2.29297 5.75304C1.60011 6.44532 1.21875 7.36675 1.21875 8.34548V14.6667C1.21875 18.0361 3.96039 20.7778 7.32986 20.7778H12.7503C13.2933 21.5405 14.1593 22 15.0965 22C15.9249 22 16.7145 21.6367 17.263 21.0032C17.277 20.9871 17.2908 20.9707 17.3043 20.9543C21.4626 15.8886 21.9965 15.6118 21.9965 14.0556C21.9965 12.9987 21.4096 11.7878 20.1658 11.2002ZM8.55208 2.95052V6.11111C8.55208 6.78548 8.00364 7.33333 7.32986 7.33333H4.16927L8.55208 2.95052ZM11.0765 14.7287C11.2934 15.6827 11.9414 16.4896 12.82 16.9075L12.4011 18.0958C12.3717 18.1734 12.3644 18.2545 12.3418 18.3333H7.32986C5.30794 18.3333 3.66319 16.6886 3.66319 14.6667V9.77778H7.32986C9.35178 9.77778 10.9965 8.13303 10.9965 6.11111V2.44444H14.6632C16.6851 2.44444 18.3299 4.08919 18.3299 6.11111C18.1818 6.14334 18.0356 6.11111 17.883 6.11111C17.0535 6.11126 16.2636 6.47515 15.7154 7.10939C15.7009 7.12609 15.6868 7.14311 15.6727 7.16011L11.7474 11.9584C11.1055 12.7217 10.8548 13.7536 11.0765 14.7287ZM19.3683 14.5873L15.4149 19.4032C15.3225 19.5099 15.2081 19.5556 15.0965 19.5556C14.8184 19.5556 14.5569 19.2725 14.6929 18.947L15.8824 15.5729L13.8921 14.7101C13.4281 14.5087 13.2921 13.9079 13.6253 13.5235L17.5648 8.70789C17.6571 8.60122 17.7714 8.55557 17.883 8.55557C18.1612 8.55557 18.4229 8.83845 18.2869 9.16399L17.1107 12.5382L19.1009 13.401C19.5655 13.6024 19.7003 14.203 19.3683 14.5873Z',
        }),
      }),
    });
    const b = ({ ...e }) => (0, a.jsx)(v.I, {
      ...e,
      children: (0, a.jsx)('svg', {
        'aria-hidden': 'true',
        'aria-label': '',
        fill: 'currentColor',
        role: 'img',
        viewBox: '0 0 18 18',
        xmlns: 'http://www.w3.org/2000/svg',
        children: (0, a.jsx)('path', {
          d: 'M13.873 0a4.114 4.114 0 0 0-2.919 1.206l-9.36 9.367a2.011 2.011 0 0 0-.586 1.41L1 15.99a1 1 0 0 0 .998 1.002L6.013 17a2.01 2.01 0 0 0 1.42-.586l9.384-9.385A4.122 4.122 0 0 0 18 4.129 4.121 4.121 0 0 0 13.873 0Zm0 1.999c.586 0 2.128.458 2.128 2.125a2.15 2.15 0 0 1-.622 1.513l-.098.098-3.012-3.014.1-.1c.414-.414.96-.622 1.505-.622Zm-9.19 8.312 6.172-6.175 3.012 3.014-6.175 6.176a4.996 4.996 0 0 0-3.008-3.015ZM3 12a3.01 3.01 0 0 1 3 3H3v-3Z',
        }),
      }),
    });
    const y = n(2693);
    const w = n(5745);
    const x = n(2787);
    async function _(e) {
      const t = (await Promise.resolve().then(n.bind(n, 8193))).default;
      return await t.app.showModalDialog({
        description:
            e?.description ?? 'Something went wrong. Please try again.',
        title: e?.title ?? 'Oh no!',
        variant: t.constants.Variant.error,
      });
    }
    const z = n(8193);
    const A = {
      at: '.at',
      au: '.com.au',
      be: '.be',
      br: '.com.br',
      ca: '.ca',
      ch: '.ch',
      de: '.de',
      es: '.es',
      fr: '.fr',
      gb: '.co.uk',
      jp: '.co.jp',
      kr: '.co.kr',
      nl: '.nl',
      nz: '.co.nz',
      pt: '.pt',
      se: '.se',
      us: '.com',
    };
    const S = {
      at: 'EUR',
      au: 'AUD',
      be: 'EUR',
      br: 'BRL',
      ca: 'CAD',
      ch: 'CHF',
      de: 'EUR',
      es: 'EUR',
      fr: 'EUR',
      gb: 'GBP',
      jp: 'JPY',
      kr: 'KRW',
      nl: 'EUR',
      nz: 'NZD',
      pt: 'EUR',
      se: 'SEK',
      us: 'USD',
    };
    const j = {
      at: 'de',
      au: 'en',
      be: 'fr',
      br: 'pt',
      ca: 'en',
      ch: 'de',
      de: 'de',
      es: 'de',
      fr: 'fr',
      gb: 'en',
      jp: 'ja',
      kr: 'ko',
      nl: 'nl',
      nz: 'en',
      pt: 'pt',
      se: 'sv',
      us: 'en',
    };
    const N = {
      at: 'metric',
      au: 'metric',
      be: 'metric',
      br: 'metric',
      ca: 'metric',
      ch: 'metric',
      de: 'metric',
      es: 'metric',
      fr: 'metric',
      gb: 'metric',
      jp: 'metric',
      kr: 'metric',
      nl: 'metric',
      nz: 'metric',
      pt: 'metric',
      se: 'metric',
      us: 'imperial',
    };
    const k = [
      'en-us',
      'en-au',
      'en-ca',
      'en-gb',
      'en-nz',
      'de-at',
      'de-ch',
      'de-de',
      'es-es',
      'es-us',
      'fr-be',
      'fr-ca',
      'fr-ch',
      'fr-fr',
      'ja-jp',
      'nl-be',
      'nl-nl',
      'pt-br',
      'pt-pt',
      'sv-se',
    ];
    function T(e) {
      return e.replace('.*', `${A[ZENV.region]}`);
    }
    let P; let E; let C; let
      L;
    const I = () => B('svc/view');
    const O = () => (function (e, t, n = !0) {
      return X(ZENV.staticRlvUrlBase, e, t, n);
    }('svc/view'));
    function R(e, t, n = !0) {
      return X(ZENV.apiUrlBase, e, t, n);
    }
    function B(e, t, n = !0) {
      return Z(`rlv/${(e = V(e))}`, t, n);
    }
    function Z(e, t, n = !0) {
      return X(ZENV.wwwUrlBase, e, t, n);
    }
    function D(e, t) {
      return X(ZENV.videoUrlBase, e, t, !1);
    }
    function V(e) {
      return e.startsWith('/') ? e.substring(1) : e;
    }
    function X(e, t, n, a = !0) {
      return (
        (t = V(t)),
        (0, p.EO)(`https://${e}/${t}`, {
          ...(a
            ? {
              zcur: ZENV.currency,
              lang: ZENV.language,
              region: ZENV.region,
            }
            : void 0),
          ...n,
        })
      );
    }
    const M = n(6701);
    let F;
    async function H(e) {
      if (!Zazzle.PX) return await e();
      for (;;) {
        if (F) {
          try {
            await F;
          } catch {}
        }
        try {
          return await e();
        } catch (e) {
          if (!(e instanceof x.r8 && e.response && e.response.status === 403)) throw e;
          if (!F) {
            const { response: t } = e;
            F = (async () => {
              try {
                const e = await t.json();
                (e.blockScript = new URL(
                  e.blockScript,
                  Z('', void 0, !1),
                ).toString()),
                (e.hostUrl = new URL(
                  e.hostUrl,
                  Z('', void 0, !1),
                ).toString()),
                (e.jsClientSrc = new URL(
                  e.jsClientSrc,
                  Z('', void 0, !1),
                ).toString()),
                await Zazzle.PX.init,
                await new Promise((n) => {
                  (window._pxOnCaptchaSuccess = (e) => {
                    e && n();
                  }),
                  window.dispatchEvent(
                    new CustomEvent('pxHandleAutoABR', {
                      detail: { response: e, responseUrl: t.url },
                    }),
                  );
                });
              } catch (e) {
                console.error(e), await _();
              }
            })();
            try {
              await F;
            } finally {
              F = void 0;
            }
          }
        }
      }
    }
    function U(e, t, n, a) {
      return W(e, t, { method: 'GET', ...n }, a);
    }
    function q(e, t, n, a) {
      return W(e, t, { method: 'POST', ...n }, a);
    }
    async function W(e, t, n, a) {
      return (
        await (0, M.iP)(),
        ({ init: n, env: a } = Q(n, a)),
        H(() => x.Bz(e, t, n, a))
      );
    }
    function Q(e, t) {
      const n = e?.method ?? 'GET';
      return (
        (e = {
          ...e,
          credentials: 'omit',
          enableCsrf: !1,
          retryOnNetworkError: n === 'GET',
        }),
        Zazzle.PX?.cookie
            && (e.headers = { ...e?.headers, 'x-px-cookies': Zazzle.PX.cookie }),
        ZENV.culture
            && ((e.includeI18NParams = !0),
            (t = {
              currency: ZENV.currency,
              language: ZENV.language,
              region: ZENV.region,
              ...t,
            })),
        { init: e, env: t }
      );
    }
    n(6409);
    let J = !!navigator.locks;
    async function G(e, t) {
      if (J) {
        try {
          return await navigator.locks.request(e, t);
        } catch (e) {
          if (!(e instanceof DOMException)) throw e;
          J = !1;
        }
      }
      const n = `${e}_updating`;
      await (async function (e) {
        for (let t = 0; t < 5; t++) {
          if (!(await Y(e))) return !0;
          await (0, p.yy)(500 * (t + 1));
        }
        return await K(e, !1), !1;
      }(n)),
      await K(n, !0);
      try {
        return await t();
      } finally {
        await K(n, !1);
      }
    }
    async function Y(e) {
      let t = !1;
      try {
        const n = await z.default.instance.clientStorage.getItem(e);
        t = typeof n === 'boolean' && n;
      } catch (e) {
        console.error(e);
      }
      return t;
    }
    async function K(e, t) {
      try {
        await z.default.instance.clientStorage.setItem(e, t);
      } catch (e) {
        console.error(e);
      }
    }
    const $ = 'zSession';
    let ee;
    const te = () => ee;
    const ne = {
      getSnapshot: te,
      async save(e) {
        g().isEqual(e, ee)
              || ((ee = Object.freeze(e)),
              await (async function (e) {
                try {
                  if (re.current === 'addOnSDK') {
                    const t = (await Promise.resolve().then(n.bind(n, 8193)))
                      .default;
                    await t.instance.clientStorage.setItem($, e);
                  } else localStorage.setItem($, JSON.stringify(e));
                } catch (e) {
                  console.error(e);
                }
              }(e)),
              ne.notify(),
              ae?.postMessage(e));
      },
      notify() {
        setTimeout(() => {
          for (const e of ne.subscribers) {
            try {
              e();
            } catch (e) {
              console.error(e);
            }
          }
        }, 0);
      },
      subscribers: new Set(),
      subscribe: (e) => (
        ne.subscribers.add(e),
        () => {
          ne.subscribers.delete(e);
        }
      ),
    };
    let ae;
    typeof BroadcastChannel !== 'undefined'
        && ((ae = new BroadcastChannel($)),
        ae.addEventListener('message', (e) => {
          const t = e.data;
          g().isEqual(t, ee) || ((ee = Object.freeze(ie(t))), ne.notify());
        }));
    const re = { current: 'addOnSDK' };
    function ie(e) {
      return e && e.version !== 2
        ? { ...e, culture: ZENV.culture ?? 'en-us', version: 2 }
        : e;
    }
    const se = 3e4;
    function oe(e) {
      return !!e && Date.now() < e.dtmSessionExpires - se;
    }
    const ce = 3e5;
    let le = 0;
    async function de(e) {
      const t = { credentials: 'omit', enableCsrf: !1 };
      let n;
      if (e?.authorized && oe(e)) {
        const a = R('v1/token/get');
        const r = await U(
          a,
          {
            client_id: ZENV.apiClientId,
            client_secret: ZENV.apiClientSecret,
            grant_type: 'refresh_token',
            refresh_token: e.refreshToken,
          },
          t,
        );
        if (r.success) n = r;
        else if (
          typeof r.error !== 'object'
            || !r.error
            || !('id' in r.error)
            || r.error.id !== 'auth_reftoken_invalid'
        ) throw new x.r8(JSON.stringify(r.error), 'GET', a, void 0);
      }
      n
          || (n = await U(
            R('v1/token/getUnauthorized'),
            { client_id: ZENV.apiClientId },
            { ...t, throwSoftJsonErrors: !0 },
          ));
      const { access_token: a, expires_in: r } = n.data;
      const i = 1e3 * r;
      if ('authorized' in n.data && n.data.authorized) {
        const t = e;
        return {
          ...t,
          accessToken: a,
          dtmAuthorizedTokenExpires: Date.now() + i,
          dtmAuthorizationExpires:
              Date.now() + t.slidingAuthorizationInterval,
          dtmSessionExpires: Date.now() + t.slidingSessionInterval,
        };
      }
      return (
        (le = 0),
        {
          accessToken: a,
          authorized: !1,
          culture: ZENV.culture ?? 'en-us',
          dtmSessionExpires: Date.now() + i,
          slidingSessionInterval: i,
          version: 2,
        }
      );
    }
    let ue;
    let pe = !1;
    async function me() {
      let e = pe;
      try {
        await G($, async () => {
          const t = ee;
          let a = await (async function () {
            try {
              let e;
              if (re.current === 'addOnSDK') {
                const t = (await Promise.resolve().then(n.bind(n, 8193)))
                  .default;
                e = await t.instance.clientStorage.getItem($);
              } else {
                const t = localStorage.getItem($) || void 0;
                e = t ? JSON.parse(t) : void 0;
              }
              return Object.freeze(ie(e));
            } catch (e) {
              console.error(e);
            }
          }());
          a && a.culture !== ZENV.culture && (a = void 0);
          const r = (function (e) {
            if (!oe(e)) return !0;
            const t = Date.now();
            return e.authorized
              ? t >= e.dtmAuthorizedTokenExpires - se
              : t >= e.dtmSessionExpires - se;
          }(a));
          let i = r ? await de(a) : a;
          pe && (e = !0);
          const s = pe
              && (function (e) {
                const t = Date.now();
                return (
                  !(t < le + ce)
                  && ((le = t),
                  !e.promo || !e.promo.dtmExpires || e.promo.dtmExpires < t)
                );
              }(i));
          if (s) {
            const e = await ve(i.accessToken);
            e && (i = { ...i, promo: e });
          }
          i && i !== a
            ? await ne.save(i)
            : g().isEqual(t, a) || ((ee = Object.freeze(a)), ne.notify());
        });
      } catch (e) {
        console.error(e);
      }
      return e;
    }
    async function he(e = !0) {
      try {
        ue ? e && (pe = !0) : ((pe = e), (ue = me()));
        const t = await ue;
        pe && !t && (ue || (ue = me()), await ue);
      } finally {
        ue = void 0;
      }
    }
    async function ge() {
      await G($, async () => {
        let e = await de(void 0);
        const t = await ve(e.accessToken);
        t && (e = { ...e, promo: t }), await ne.save(e);
      });
    }
    async function ve(e) {
      let t;
      try {
        const n = await q(
          Z('svc/tracksegment/set3'),
          { associate_id: '238008941328162646' },
          { throwSoftJsonErrors: !0 },
          { access_token: e },
        );
        const { discount: a } = n.data;
        a
            && (t = {
              code: a.code,
              dtmExpires: Math.min(Date.parse(a.dateEnd), Date.now() + 864e5),
              dtmStart: Date.parse(a.dateStart),
            });
      } catch (e) {
        console.error(e);
      }
      return t;
    }
    const fe = (0, s.createContext)(void 0);
    ne.subscribe;
    const be = new URLSearchParams(location.search);
    let ye;
    be.get('hasAC'), be.get('isEmailVerified'), be.get('userGrantedConsent');
    try {
      ye = crypto.randomUUID();
    } catch {
      ye = (0, w.A)();
    }
    function we(e) {
      setTimeout(() => {
        throw e;
      });
    }
    function xe(e, t) {
      let n;
      g().isError(e) || (n = `\nSTACK TRACE:\n${new Error().stack}`);
      const a = (0, y.W)(e, !0, 'ADOBE_EXPRESS_LOG_TO_SERVER|', n);
      console.warn(a),
      (function (e, t) {
        const n = {
          pgid: ye,
          ts: Date.now() - globalThis.Zazzle.clientStartTime,
          ...e,
        };
        t ??= te()?.accessToken;
        const a = Z('svc/logjs');
        const r = { postAsFormUrlEncoded: !0, throwSoftJsonErrors: !0 };
        (async () => {
          if (t) {
            try {
              return void (await (function (e, t, n, a) {
                return q(e, n, a, { access_token: t, ...void 0 });
              }(a, t, n, r)));
            } catch (e) {
              console.warn(
                'LogJS with access token failed. Falling back to raw LogJS.',
                e,
              );
            }
          }
          try {
            await (function (e, t, n) {
              return (async function (e, t, n, a) {
                return (
                  await (0, M.iP)(),
                  ({ init: n, env: a } = Q(n, a)),
                  H(() => x.by(e, t, n, a))
                );
              }(e, t, { method: 'POST', ...n }, void 0));
            }(a, n, r));
          } catch (e) {
            console.error('Raw LogJs failed', e);
          }
        })();
      }({ msg: a, url: '(see stack trace)', ln: 0, col: 0 }, t));
    }
    new Set();
    class _e extends s.Component {
      static defaultProps = { fallback: null };

      state = { hasError: !1 };

      static getDerivedStateFromError() {
        return { hasError: !0 };
      }

      componentDidCatch(e, t) {
        if (
          (xe(
            `ErrorBoundary\nerror name: ${e.name}\nerror message: ${e.message}\nerror stack: ${e.stack}\ncomponent stack: ${t.componentStack}`,
          ),
          this.props.onError)
        ) {
          try {
            this.props.onError(e, t);
          } catch (e) {
            console.error(e);
          }
        }
      }

      render() {
        let e;
        return (
          (e = this.state.hasError
            ? this.props.fallback
            : this.props.children),
          e
        );
      }
    }
    const ze = n(6582);
    const Ae = n(1022);
    function Se(e, t, n) {
      const a = t[e];
      return n ? (0, Ae.B)(a, n) : a;
    }
    const je = function (e, t) {
      if (
        Zazzle.zStrings
            && Object.prototype.hasOwnProperty.call(Zazzle.zStrings, e)
      ) return t ? Se(e, Zazzle.zStrings, t) : Se(e, Zazzle.zStrings);
    };
    const Ne = () => je;
    const ke = n(5292);
    const Te = n.n(ke);
    const Pe = n(9893);
    const Ee = n.n(Pe);
    const Ce = n(9383);
    const Le = n.n(Ce);
    const Ie = n(6884);
    const Oe = n.n(Ie);
    const Re = n(9088);
    const Be = n.n(Re);
    const Ze = n(7997);
    const De = n.n(Ze);
    const Ve = n(2206);
    const Xe = {};
    (Xe.styleTagTransform = De()),
    (Xe.setAttributes = Oe()),
    (Xe.insert = Le().bind(null, 'head')),
    (Xe.domAPI = Ee()),
    (Xe.insertStyleElement = Be()),
    Te()(Ve.A, Xe);
    const Me = Ve.A && Ve.A.locals ? Ve.A.locals : void 0;
    const Fe = ({ className: e, label: t }) => {
      const n = (0, s.useMemo)(
        () => g().uniqueId('loading-overlay-label-'),
        [],
      );
      const r = Ne();
      return (0, a.jsxs)('div', {
        className: (0, m.A)(Me.root, e),
        children: [
          t
                && (0, a.jsx)('div', {
                  className: (0, m.A)(
                    'spectrum-Heading spectrum-Heading--sizeL',
                    Me.label,
                  ),
                  id: n,
                  children: t,
                }),
          (0, a.jsx)(ze.a, {
            'aria-labelledby': t ? n : void 0,
            className: Me.progressCircle,
            indeterminate: !0,
            label:
                  t || t === '' ? '' : r('zi_myzazzle_MediaBrowser_Loading'),
            size: 'l',
          }),
        ],
      });
    };
    const He = n(9379);
    function Ue(e) {
      e.preventDefault();
    }
    function qe(e) {
      return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
    }
    const We = n(9774);
    const Qe = {};
    (Qe.styleTagTransform = De()),
    (Qe.setAttributes = Oe()),
    (Qe.insert = Le().bind(null, 'head')),
    (Qe.domAPI = Ee()),
    (Qe.insertStyleElement = Be()),
    Te()(We.A, Qe);
    const Je = We.A && We.A.locals ? We.A.locals : void 0;
    const Ge = (0, s.forwardRef)(
      ({ quality: e = 'hd', videoId: t, ...n }, r) => (
        (t = t?.toUpperCase()),
        (0, s.createElement)('video', {
          controlsList: 'nodownload',
          ...n,
          key: t,
          ref: r,
          children: [
            (0, a.jsx)('source', {
              type: 'video/mp4',
              src: D(`${t}_${e}.mp4`),
            }),
            (0, a.jsx)('source', {
              type: 'video/webm;codecs="vp8, vorbis"',
              src: D(`${t}_${e}.webm`),
            }),
            e === 'fhd'
                  && (0, a.jsx)('source', {
                    type: 'video/mp4',
                    src: D(`${t}_hd.mp4`),
                  }),
          ],
        })
      ),
    );
    const Ye = (0, s.memo)(
      ({
        autoPlay: e = !0,
        className: t,
        designTimestamp: r,
        imageRef: i,
        imageSize: o,
        itemProp: c,
        outerContainerClassName: l,
        realview: d,
        showControls: u,
        slot: h,
        useSrcSet: v,
        videoQuality: f,
        videoRef: b,
      }) => {
        const y = (0, s.useRef)(null);
        !(function (e) {
          const {
            designTimestamp: t,
            enabled: a,
            realview: r,
            target: i,
            templateParamOverrides: o,
          } = e;
          const c = (0, s.useRef)();
          const l = (0, s.useMemo)(
            () => ({
              inputs: r.dynamicVideoInputs
                .filter((e) => e.type !== 'playervar')
                .map((e) => {
                  if (e.type === 'area') {
                    const n = (0, p.EO)(e.value, { r: t }, o);
                    const a = g().clone(e);
                    return (a.value = n), a;
                  }
                  return e;
                }),
              realview_id: r.id,
            }),
            [t, r, o],
          );
          (0, s.useEffect)(() => {
            if (a) {
              if (c.current) {
                let e;
                try {
                  e = c.current?.getNode();
                } catch {}
                a
                      && c.current
                      && i.current
                      && (!i.current.hasChildNodes()
                        && e
                        && i.current.appendChild(e),
                      c.current.update(l, () => {
                        c.current?.playFromStart();
                      }));
              } else {
                n.e(450)
                  .then(n.t.bind(n, 9450, 23))
                  .then((e) => {
                    if (c.current || !i.current) return;
                    const t = {
                      dynamicURL: B('', void 0, !1),
                      staticURL: B('', void 0, !1),
                    };
                    const n = i.current.getBoundingClientRect().width;
                    c.current = new e.PlayerOne(l, n, t, {
                      onReady: () => {
                        c.current
                              && i.current
                              && (i.current.appendChild(c.current.getNode()),
                              c.current.setLoop(!0),
                              c.current.play());
                      },
                    });
                  });
              }
            } else c.current?.stop();
          }, [a, l]),
          (0, s.useEffect)(
            () => () => {
              if (c.current) {
                try {
                  c.current.dispose();
                } catch (e) {
                  e && we(e);
                }
                c.current = void 0;
              }
            },
            [],
          ),
          (0, s.useMemo)(() => ({ playerOneRef: c }), []);
        }({
          designTimestamp: r,
          enabled: d.media === 'dynamicvideo',
          realview: d,
          target: y,
        }));
        const w = (() => {
          if (d.media === 'dynamicvideo') {
            return (0, a.jsxs)('div', {
              className: Je.dynamicVideoWrapper,
              onContextMenu: Ue,
              children: [
                'Loading...',
                (0, a.jsx)('div', { className: Je.dynamicVideo, ref: y }),
              ],
            });
          }
          if (d.media !== 'video') {
            const e = (0, He.x1)(d, I(), { cacheDefeat: r, max_dim: o });
            const t = (0, p.EO)(e, { max_dim: Math.min(2 * o, 1024) });
            return (0, a.jsx)('div', {
              className: Je.imageContainer,
              ref: i,
              children: (0, a.jsx)('img', {
                alt: d.title,
                className: Je.image,
                draggable: !1,
                itemProp: c,
                onContextMenu: Ue,
                onDragStart: Ue,
                src: e,
                srcSet: v ? `${e} 1x, ${t} 2x` : void 0,
              }),
            });
          }
          if (d.videoId) {
            return (0, a.jsx)(Ge, {
              autoPlay: e,
              className: Je.staticVideo,
              controls: u,
              loop: !0,
              quality: f,
              ref: b,
              videoId: d.videoId,
            });
          }
          if (d.videoParams) {
            const t = (0, He.x1)(
              d,
              I(),
              { cacheDefeat: r, max_dim: o },
              !0,
            );
            return (0, a.jsx)(
              'video',
              {
                autoPlay: e,
                className: Je.staticVideo,
                loop: !0,
                ref: b,
                children: (0, a.jsx)('source', {
                  type: 'video/mp4',
                  src: t,
                }),
              },
              t,
            );
          }
        })();
        return (0, a.jsx)('div', {
          className: (0, m.A)(
            Je.root,
            { [Je.root__cropAttribution]: !d.videoId && o > 1080 },
            t,
          ),
          slot: h,
          children: (0, a.jsx)('div', {
            className: (0, m.A)(Je.outerContainer, l),
            children: w,
          }),
        });
      },
    );
    function Ke(e, t) {
      let { culture: n } = ZENV;
      n === 'en-ca' ? (n = 'en-us') : n === 'fr-ca' && (n = 'fr-fr');
      const a = { style: 'currency', currency: ZENV.currency, ...t };
      return (function (e, t, n, a) {
        return n == null
          ? (we(new Error('value cannot be null or undefined')), '')
          : e.call(n, t, a);
      }(Number.prototype.toLocaleString, n, e, a));
    }
    function $e(e) {
      if (e !== 0) return `${e > 0 ? '+' : '-'}${Ke(Math.abs(e))}`;
    }
    const et = {
      zazzle_foldedthankyoucard: 'card-greeting',
      zazzle_invitation3: 'invitation',
      zazzle_flyer: 'flyer',
      zazzle_print: 'poster',
      zazzle_businesscard: 'business-card',
      zazzle_shirt: 'tshirt',
    };
    const tt = n(1891);
    const nt = n(9872);
    const at = n(5130);
    const rt = n(3556);
    const it = n(5465);
    const st = n(2802);
    const ot = n(9048);
    const ct = n(1167);
    const lt = {};
    (lt.styleTagTransform = De()),
    (lt.setAttributes = Oe()),
    (lt.insert = Le().bind(null, 'head')),
    (lt.domAPI = Ee()),
    (lt.insertStyleElement = Be()),
    Te()(ct.A, lt);
    const dt = ct.A && ct.A.locals ? ct.A.locals : void 0;
    const ut = ({
      boldTitles: e,
      className: t,
      id: n,
      itemClassName: r,
      items: i,
      name: o,
      onChange: c,
      showTitles: l,
      useSrcSet: d,
      value: u,
      withSelectedInsetBorder: h,
    }) => {
      const v = (0, s.useMemo)(() => g().uniqueId('ImageRadioGroup-'), []);
      return (0, a.jsx)('fieldset', {
        className: (0, m.A)(dt.root, t),
        id: n,
        children: i.map((t) => {
          const n = t.value === u;
          const i = parseInt(new URL(t.url).searchParams.get('max_dim'), 10);
          const s = (0, p.EO)(t.url, { max_dim: Math.min(2 * i, 1024) });
          return (0, a.jsxs)(
            'label',
            {
              className: (0, m.A)(
                dt.item,
                n && dt.item__selected,
                h && dt.item__withSelectedInsetBorder,
                r,
              ),
              title: l ? void 0 : t.title,
              children: [
                (0, a.jsx)('input', {
                  checked: n,
                  className: dt.radio,
                  name: o ?? v,
                  onChange: () => {
                    c(t.value);
                  },
                  type: 'radio',
                }),
                (0, a.jsx)('img', {
                  alt: '',
                  className: dt.image,
                  src: t.url,
                  srcSet: d ? `${t.url} 1x, ${s} 2x` : void 0,
                }),
                l
                      && (0, a.jsxs)('div', {
                        className: (0, m.A)(
                          dt.titlePlaceholder,
                          e && dt.titlePlaceholder__bold,
                        ),
                        children: [
                          ' ',
                          (0, a.jsx)('div', {
                            className: dt.title,
                            children: t.title,
                          }),
                        ],
                      }),
                g().isNumber(t.priceDelta)
                      && (0, a.jsx)('div', {
                        className: (0, m.A)(
                          'spectrum-Body',
                          'spectrum-Body--sizeXS',
                          dt.priceDelta,
                        ),
                        children: $e(t.priceDelta),
                      }),
              ],
            },
            t.value,
          );
        }),
      });
    };
    const pt = n(777);
    const mt = {};
    (mt.styleTagTransform = De()),
    (mt.setAttributes = Oe()),
    (mt.insert = Le().bind(null, 'head')),
    (mt.domAPI = Ee()),
    (mt.insertStyleElement = Be()),
    Te()(pt.A, mt);
    const ht = pt.A && pt.A.locals ? pt.A.locals : void 0;
    function gt(e) {
      window.postMessage({
        postMessageType: 'analyticsEvent',
        payload: { event: 'print-iframe-interaction', metadata: e },
      });
    }
    const vt = c.wA.withTypes();
    const ft = c.d4.withTypes();
    const bt = n(1802);
    const yt = (0, bt.Z0)({
      name: 'pdp',
      initialState: {},
      reducers: {
        changeOptions: (e, t) => {
          for (const n in t.payload) e.product.attributes[n].value = t.payload[n];
        },
        changeQuantity: (e, t) => {
          const n = e.product;
          const a = n.pricing.volumeDiscountTiers?.find(
            (e) => e.minQuantity <= n.quantity && n.quantity <= e.maxQuantity,
          );
          const r = n.pricing.volumeDiscountTiers?.find(
            (e) => e.minQuantity <= t.payload && t.payload <= e.maxQuantity,
          );
          (a !== r && (a?.hasDiscount || r?.hasDiscount))
                || (n.quantity = t.payload);
        },
        init: () => {},
        update: (e, t) => {
          t.payload.product
                && (e.product
                  ? Object.assign(e.product, t.payload.product)
                  : (e.product = t.payload.product)),
          Object.assign(e, g().omit(t.payload, ['product']));
        },
      },
    });
    const wt = yt.actions;
    const xt = yt.reducer;
    const _t = () => {
      const e = vt();
      const { entities: t, product: n } = ft(
        (e) => ({ entities: e.entities, product: e.pdp.product }),
        p.bN,
      );
      const r = { ...n.pbjOverrides, ...ZENV.pbjOverrides[n.productType] };
      const i = (0, s.useMemo)(() => {
        const e = (0, st.ml)(r);
        return (0, st.Br)(n.attributes, e, !1, void 0, n.productType, !1);
      }, [r, n.attributes, n.productType]);
      const o = (t) => {
        e(wt.changeOptions(t));
      };
      const c = (0, s.useMemo)(() => g().uniqueId('Attributes-picker'), []);
      return (0, a.jsx)('div', {
        className: ht.root,
        children: i
          .flatMap((e) => e.attributes)
          .map((e) => {
            const i = n.attributes[e.name];
            if (!i) return;
            if (!e.shown) return;
            const s = (0, it.Rt)(
              i,
              r.attributeValueFilter,
              ZENV.culture,
            ).filter((e) => e.isInStock || e.name === i.value);
            const l = s.find((e) => e.name === i.value);
            if (s.length <= e.hideWhen) return;
            const d = `${c}-${i.name}`;
            let u = null;
            switch (e.inlineSelection.type) {
              case 'thumbnails':
              case 'thumbnailsWithPreview': {
                const r = (e.includeDesign || e.includeDesignWhenCustomizing)
                        && (e.thumbnailType === 'realview'
                          || e.thumbnailType === 'firstProductRealview');
                const c = e.inlineSelection;
                const h = c.groups || [{ filter: '' }];
                const g = h.map((e) => (0, it.db)(e.filter, s, c.allowGroupBackfill));
                const v = h.map((s, c) => {
                  const l = g[c];
                  if (l.length === 0) return null;
                  const u = s.label ? t.dbStrings[s.label] : '';
                  return (0, a.jsxs)(
                    'div',
                    {
                      className: ht.selector__thumbnails_group,
                      children: [
                        qe(u),
                        (0, a.jsx)(ut, {
                          className: ht.selector__thumbnails,
                          id: c === 0 ? d : void 0,
                          itemClassName: ht.selector__thumbnails_item,
                          items: l.map((t) => {
                            const n = (0, it.Q)(t, e.thumbnailType);
                            const a = (0, p.EO)(
                              O(),
                              { ...n, max_dim: Math.round(48) },
                              !r && { design: void 0 },
                            );
                            return {
                              priceDelta:
                                      e.showPriceDelta && t.priceDifferential
                                        ? t.priceDifferential
                                        : void 0,
                              title: t.title,
                              url: a,
                              value: t.name,
                            };
                          }),
                          onChange: (e) => {
                            o({ [i.name]: e }),
                            gt({
                              action_name: i.name,
                              action_type: 'radio-button',
                              action_value: e,
                              task_name: et[n.productType],
                            });
                          },
                          useSrcSet: !0,
                          value: i.value,
                          withSelectedInsetBorder: !0,
                        }),
                      ],
                    },
                    c,
                  );
                });
                if (
                  ((u = v),
                  e.inlineSelection.type === 'thumbnailsWithPreview' && l)
                ) {
                  const t = (0, it.Q)(l, e.thumbnailType);
                  const n = (0, p.EO)(
                    O(),
                    { ...t, max_dim: Math.round(192) },
                    !r && { design: void 0 },
                  );
                  u = (0, a.jsxs)(a.Fragment, {
                    children: [
                      l
                            && (0, a.jsxs)('div', {
                              className: ht.selector__thumbnails_preview,
                              children: [
                                (0, a.jsx)('img', {
                                  className:
                                    ht.selector__thumbnails_preview_image,
                                  src: n,
                                }),
                                (0, a.jsx)('div', {
                                  className: (0, m.A)(
                                    'spectrum-Body',
                                    'spectrum-Body--sizeS',
                                    ht.selector__thumbnails_preview_info,
                                  ),
                                  dangerouslySetInnerHTML: {
                                    __html: l.descriptionBrief,
                                  },
                                }),
                              ],
                            }),
                      v,
                    ],
                  });
                }
                break;
              }
              case 'radio':
                u = (0, a.jsx)(rt.z, {
                  change: (e) => {
                    const t = e.target;
                    o({ [i.name]: t.selected }),
                    gt({
                      action_name: i.name,
                      action_type: 'radio-button',
                      action_value: t.selected,
                      task_name: et[n.productType],
                    });
                  },
                  id: d,
                  selected: i.value,
                  children: s.map((t) => {
                    const n = $e(t.priceDifferential);
                    return (0, a.jsxs)(
                      rt.s,
                      {
                        value: t.name,
                        children: [
                          t.title,
                          e.showPriceDelta
                                && n
                                && (0, a.jsxs)(a.Fragment, { children: [' ', n] }),
                        ],
                      },
                      t.name,
                    );
                  }),
                });
                break;
              case 'toggle': {
                const t = i.values.indexOf(l);
                const r = t === 0 ? 1 : 0;
                const s = $e(i.values[r].priceDifferential);
                u = (0, a.jsxs)(tt.S, {
                  checked: t === 1,
                  change: (e) => {
                    const t = e.target;
                    const a = i.values[t.checked ? 1 : 0];
                    o({ [i.name]: a.name }),
                    gt({
                      action_name: i.name,
                      action_type: 'checkbox',
                      action_value: a.name,
                      task_name: et[n.productType],
                    });
                  },
                  id: d,
                  children: [
                    i.values[1].title,
                    e.showPriceDelta
                          && s
                          && (0, a.jsxs)(a.Fragment, { children: [' ', s] }),
                  ],
                });
                break;
              }
              default:
                u = (0, a.jsx)(at.L, {
                  className: ht.selector__select,
                  change: (e) => {
                    const t = e.target;
                    o({ [i.name]: t.value }),
                    gt({
                      action_name: i.name,
                      action_type: 'dropdown',
                      action_value: t.value,
                      task_name: et[n.productType],
                    });
                  },
                  id: d,
                  size: 'm',
                  value: i.value,
                  children: s.map((t) => {
                    const n = $e(t.priceDifferential);
                    return (0, a.jsxs)(
                      nt.Dr,
                      {
                        value: t.name,
                        children: [
                          t.title,
                          e.showPriceDelta
                                && n
                                && (0, a.jsxs)(a.Fragment, { children: [' ', n] }),
                        ],
                      },
                      t.name,
                    );
                  }),
                });
            }
            const h = l
              ? (0, ot.c)(e.inlineSelection, l, (e) => t.dbStrings[e])
              : '';
            return (0, a.jsxs)(
              'div',
              {
                children: [
                  (0, a.jsx)('label', {
                    className: (0, m.A)(
                      'spectrum-Heading',
                      'spectrum-Heading--sizeXS',
                    ),
                    htmlFor: d,
                    children: qe(i.title),
                  }),
                  e.inlineSelection.type.includes('thumbnails')
                        && (0, a.jsx)('div', { children: l?.title }),
                  u,
                  h
                        && (0, a.jsx)('div', {
                          className: ht.subtitle,
                          children: h,
                        }),
                ],
              },
              i.name,
            );
          }),
      });
    };
    const zt = n(5483);
    const At = {};
    (At.styleTagTransform = De()),
    (At.setAttributes = Oe()),
    (At.insert = Le().bind(null, 'head')),
    (At.domAPI = Ee()),
    (At.insertStyleElement = Be()),
    Te()(zt.A, At);
    const St = zt.A && zt.A.locals ? zt.A.locals : void 0;
    const jt = (0, s.memo)(() => {
      const e = ft((e) => e.pdp.product.attributes);
      const t = Ne();
      return (0, a.jsxs)('div', {
        children: [
          (0, a.jsx)('h2', {
            className: (0, m.A)(
              'spectrum-Heading',
              'spectrum-Heading--sizeXS',
            ),
            children: t('zi_product_PDP_ProductDescription_Title'),
          }),
          Object.values(e).map((e) => {
            const t = e.values.find((t) => t.name === e.value) || e.values[0];
            return (
              t.description
                  && (0, a.jsxs)(
                    'div',
                    {
                      className: (0, m.A)(
                        'spectrum-Body',
                        'spectrum-Body--sizeS',
                      ),
                      children: [
                        (0, a.jsxs)('div', {
                          children: [qe(e.title), ': ', t.titleLong],
                        }),
                        (0, a.jsx)('div', {
                          className: St.attributeValueDescription,
                          dangerouslySetInnerHTML: {
                            __html: Nt(t.description),
                          },
                        }),
                      ],
                    },
                    e.name,
                  )
            );
          }),
        ],
      });
    });
    function Nt(e) {
      const t = document.createElement('div');
      return (
        (t.innerHTML = e),
        t.querySelectorAll('li').forEach((e) => {
          e.textContent?.toLowerCase().includes('designer tip') && e.remove();
        }),
        t.innerHTML
      );
    }
    const kt = n(5351);
    const Tt = n(8265);
    const Pt = n(7581);
    const Et = n(8920);
    const Ct = n(2741);
    const Lt = n(4732);
    const It = {};
    (It.styleTagTransform = De()),
    (It.setAttributes = Oe()),
    (It.insert = Le().bind(null, 'head')),
    (It.domAPI = Ee()),
    (It.insertStyleElement = Be()),
    Te()(Lt.A, It);
    const Ot = Lt.A && Lt.A.locals ? Lt.A.locals : void 0;
    const Rt = ({ originalTotalPrice: e, spOpened: t }) => {
      const n = Ne();
      return (0, a.jsxs)('div', {
        className: (0, m.A)(
          'spectrum-Body',
          'spectrum-Body--sizeXS',
          Ot.root,
        ),
        children: [
          (0, a.jsx)('div', {
            className: Ot.strikethrough,
            children: Ke(e),
          }),
          (0, a.jsx)('div', { children: n('zi_product_Price_CompValue') }),
          (0, a.jsxs)(Et.N, {
            spOpened: t,
            placement: 'top',
            children: [
              (0, a.jsx)(Tt.r, {
                quiet: !0,
                size: 'xs',
                slot: 'trigger',
                children: (0, a.jsx)(Pt.m, { size: 'xxs', slot: 'icon' }),
              }),
              (0, a.jsxs)(Ct.A, {
                className: Ot.popover,
                slot: 'hover-content',
                tip: !0,
                children: [
                  (0, a.jsx)('div', {
                    className: (0, m.A)(
                      'spectrum-Heading',
                      'spectrum-Heading--sizeXS',
                    ),
                    children: n('zi_product_Price_OriginalAmountIso'),
                  }),
                  (0, a.jsxs)('div', {
                    className: (0, m.A)(
                      'spectrum-Body',
                      'spectrum-Body--sizeS',
                      Ot.body,
                    ),
                    children: [
                      (0, a.jsx)('p', {
                        children: n(
                          'zi_product_Price_CompValueTooltip1Adobe',
                        ),
                      }),
                      (0, a.jsx)('p', {
                        children: n(
                          'zi_product_Price_CompValueTooltip2Adobe',
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    };
    const Bt = n(5150);
    const Zt = n(7180);
    const Dt = n(5878);
    const Vt = {};
    (Vt.styleTagTransform = De()),
    (Vt.setAttributes = Oe()),
    (Vt.insert = Le().bind(null, 'head')),
    (Vt.domAPI = Ee()),
    (Vt.insertStyleElement = Be()),
    Te()(Dt.A, Vt);
    const Xt = Dt.A && Dt.A.locals ? Dt.A.locals : void 0;
    const Mt = (0, s.memo)(
      ({
        className: e,
        hasForcedQuantities: t,
        maxQuantity: n,
        minQuantity: r,
        onChange: i,
        pluralUnitLabel: o,
        quantities: c,
        quantityIncrement: l,
        showLabelAndDiscount: d = !0,
        singularUnitLabel: u,
        value: p,
        volumeDiscountTiers: h,
      }) => {
        const g = Ne();
        const v = (0, s.useCallback)(
          (e) => {
            const t = e.quantity === 1 ? u : o;
            let n = e.quantity.toString();
            if ((d && t && (n += ` ${t}`), d && e.discount?.discount)) {
              const { discount: t } = e.discount;
              (n += ' '),
              (n += t.includes('%')
                ? g('zi_product_PDP_QuantitySelector_Save', {
                  discount: t,
                })
                : g('zi_product_PDP_QuantitySelector_Save_Each', {
                  discount: t,
                }));
            }
            return n;
          },
          [u, o, d],
        );
        const f = (0, s.useMemo)(() => (0, Zt.AE)(h, c, t), [h, c, t]);
        const b = (0, s.useCallback)(
          (e) => {
            const t = parseInt(e, 10);
            return Number.isNaN(t) || t === p
              ? p
              : (0, Zt.vD)(t, r, n, l);
          },
          [p, r, n, l],
        );
        const y = (0, s.useCallback)(
          (e) => {
            const t = e.target;
            const n = b(t.value);
            (t.value = n.toString()), i(n);
          },
          [i, b],
        );
        return (0, a.jsx)(Bt.G, {
          allowedKeys: '0123456789',
          className: (0, m.A)(Xt.root, e),
          change: y,
          label: 'Quantity',
          size: 'm',
          value: p.toString(),
          children: f.map((e) => (0, a.jsx)(nt.Dr, { noWrap: !0, children: v(e) }, e.quantity)),
        });
      },
    );
    const Ft = n(1280);
    const Ht = {};
    (Ht.styleTagTransform = De()),
    (Ht.setAttributes = Oe()),
    (Ht.insert = Le().bind(null, 'head')),
    (Ht.domAPI = Ee()),
    (Ht.insertStyleElement = Be()),
    Te()(Ft.A, Ht);
    const Ut = Ft.A && Ft.A.locals ? Ft.A.locals : void 0;
    const qt = () => {
      const e = vt();
      const t = ft((e) => e.pdp).product;
      const n = (0, kt.SG)(t.pricing) * t.quantity;
      const r = t.pricing.unitPrice * t.quantity;
      const i = (0, s.useCallback)((n) => {
        e(wt.changeQuantity(n)),
        gt({
          action_name: 'quantity',
          action_type: 'combobox',
          action_value: n.toString(),
          task_name: et[t.productType],
        });
      }, []);
      const o = n !== r;
      const c = (0, a.jsxs)('div', {
        className: Ut.costRow,
        children: [
          (0, a.jsx)(Mt, {
            hasForcedQuantities: t.hasForcedQuantities,
            maxQuantity: t.maxQuantity,
            minQuantity: t.minQuantity,
            onChange: i,
            pluralUnitLabel: t.pluralUnitLabel,
            quantities: t.quantities,
            quantityIncrement: t.quantityIncrement,
            singularUnitLabel: t.singularUnitLabel,
            value: t.quantity,
            volumeDiscountTiers: t.pricing.volumeDiscountTiers,
          }),
          (0, a.jsxs)('div', {
            className: Ut.costRow_pricing,
            children: [
              (0, a.jsx)('div', {
                className: (0, m.A)(
                  'spectrum-Heading',
                  'spectrum-Heading--sizeS',
                  Ut.costRow_price,
                ),
                children: Ke(n),
              }),
              o
                      && (0, a.jsx)(Rt, {
                        spOpened: () => {
                          gt({
                            action_name: 'comp-value',
                            action_type: 'icon',
                            task_name: et[t.productType],
                          });
                        },
                        originalTotalPrice: r,
                      }),
            ],
          }),
        ],
      });
      return (0, a.jsxs)('div', {
        className: Ut.root,
        children: [
          (0, a.jsx)('h2', {
            className: 'spectrum-Heading spectrum-Heading--sizeXS',
            children: 'Quantity',
          }),
          c,
        ],
      });
    };
    const Wt = n(4656);
    const Qt = n(7022);
    const Jt = n(9876);
    const Gt = {};
    (Gt.styleTagTransform = De()),
    (Gt.setAttributes = Oe()),
    (Gt.insert = Le().bind(null, 'head')),
    (Gt.domAPI = Ee()),
    (Gt.insertStyleElement = Be()),
    Te()(Jt.A, Gt);
    const Yt = Jt.A && Jt.A.locals ? Jt.A.locals : void 0;
    const Kt = ({
      buttonVisibility: e = 'hover',
      children: t,
      className: n,
      onClickScrollButton: r,
    }) => {
      const i = (0, s.useRef)(null);
      const [o, c] = (0, s.useState)(!0);
      const [l, d] = (0, s.useState)(!1);
      const u = () => {
        const e = i.current;
        c(e.scrollLeft === 0);
        const t = e.scrollWidth - e.clientWidth;
        d(e.scrollLeft >= t);
      };
      (0, s.useLayoutEffect)(() => {
        u();
      }, []);
      const p = (e) => {
        const t = i.current;
        const n = e === 'previous'
          ? t.scrollLeft - t.clientWidth
          : t.scrollLeft + t.clientWidth;
        t.scrollTo(n, 0);
      };
      return (0, a.jsxs)('div', {
        className: (0, m.A)(
          Yt.root,
          n,
          e === 'hover' && Yt.root__hoverButtons,
        ),
        children: [
          (0, a.jsx)(Tt.r, {
            className: (0, m.A)(Yt.button, Yt.buttonPrev),
            disabled: o,
            onClick: () => {
              p('previous'), r?.('previous');
            },
            quiet: !0,
            children: (0, a.jsx)(Wt.g, {}),
          }),
          (0, a.jsx)('div', {
            className: Yt.scroller,
            ref: i,
            onScroll: u,
            children: (0, a.jsx)('div', {
              className: Yt.content,
              children: t,
            }),
          }),
          (0, a.jsx)(Tt.r, {
            className: (0, m.A)(Yt.button, Yt.buttonNext),
            disabled: l,
            onClick: () => {
              p('next'), r?.('next');
            },
            quiet: !0,
            children: (0, a.jsx)(Qt.V, {}),
          }),
        ],
      });
    };
    const $t = n(2774);
    const en = {};
    (en.styleTagTransform = De()),
    (en.setAttributes = Oe()),
    (en.insert = Le().bind(null, 'head')),
    (en.domAPI = Ee()),
    (en.insertStyleElement = Be()),
    Te()($t.A, en);
    const tn = $t.A && $t.A.locals ? $t.A.locals : void 0;
    const nn = ({
      className: e,
      onClickScrollButton: t,
      onSelectRealview: n,
      preferredRealviewId: r,
      realviews: i,
    }) => (0, a.jsx)(Kt, {
      buttonVisibility: 'always',
      className: (0, m.A)(tn.root, e),
      onClickScrollButton: t,
      children: (0, a.jsx)(ut, {
        className: tn.items,
        itemClassName: tn.item,
        items: i.map((e) => {
          const t = (0, He.x1)(e, O(), { max_dim: Math.round(120) });
          return { title: qe(e.title), url: t, value: e.id };
        }),
        onChange: n,
        value: r,
        useSrcSet: !0,
      }),
    });
    const an = n(4840);
    const rn = {};
    (rn.styleTagTransform = De()),
    (rn.setAttributes = Oe()),
    (rn.insert = Le().bind(null, 'head')),
    (rn.domAPI = Ee()),
    (rn.insertStyleElement = Be()),
    Te()(an.A, rn);
    const sn = an.A && an.A.locals ? an.A.locals : void 0;
    const on = () => {
      const e = vt();
      const {
        designAreasSizes: t,
        product: n,
        templateFetchFailed: r,
      } = ft((e) => e.pdp);
      (0, s.useEffect)(() => {
        e(wt.init());
      }, []);
      let i = null;
      let o = !1;
      if (r) {
        (o = !0),
        (i = (0, a.jsxs)('div', {
          className: sn.templateFail,
          children: [
            (0, a.jsx)('h1', {
              className: (0, m.A)(
                'spectrum-Heading',
                'spectrum-Heading--sizeM',
              ),
              children: "We can't load this design here",
            }),
            (0, a.jsx)('div', {
              children:
                      'We hit a snag loading the template here. Not to worry though! You can customize and print it from Adobe Express.',
            }),
            (0, a.jsx)(d.$n, {
              className: sn.templateFail_cta,
              href: cn(void 0),
              onClick: () => {
                gt({
                  action_name: 'editor-link',
                  action_type: 'hyperlink',
                  task_name: void 0,
                });
              },
              size: 'xl',
              target: '_parent',
              children: (0, a.jsxs)('div', {
                className: sn.ctaContent,
                children: [(0, a.jsx)(f, {}), ' Continue to customize'],
              }),
            }),
          ],
        }));
      } else if (n) {
        const r = n.realviews.find((e) => e.id === n.preferredRealviewId);
        const s = n.realviews.filter((e) => e.type === 'Product');
        i = (0, a.jsxs)('div', {
          className: sn.main,
          children: [
            (0, a.jsxs)('div', {
              className: sn.viewsWrapper,
              children: [
                (0, a.jsxs)('div', {
                  className: sn.mainViewWrapper,
                  children: [
                    (0, a.jsx)(_e, {
                      children: (0, a.jsx)(Ye, {
                        className: sn.mainView,
                        designTimestamp: 0,
                        imageSize: 644,
                        realview: r,
                        useSrcSet: !0,
                      }),
                    }),
                    (0, a.jsx)(l.E, {
                      className: sn.mainView_badge,
                      size: 's',
                      variant: 'neutral',
                      children: r.title,
                    }),
                  ],
                }),
                (0, a.jsx)(_e, {
                  children: (0, a.jsx)(nn, {
                    className: sn.viewSelector,
                    onClickScrollButton: (e) => {
                      gt({
                        action_name: 'view-selector-navigation',
                        action_type: 'button',
                        action_value: e,
                        task_name: et[n.productType],
                      });
                    },
                    onSelectRealview: (t) => {
                      e(wt.update({ product: { preferredRealviewId: t } })),
                      gt({
                        action_name: 'view',
                        action_type: 'radio-button',
                        action_value: n.realviews.find((e) => e.id === t)
                          .title,
                        task_name: et[n.productType],
                      });
                    },
                    preferredRealviewId: n.preferredRealviewId,
                    realviews: s,
                  }),
                }),
              ],
            }),
            (0, a.jsx)('div', {
              className: sn.detailsWrapper,
              children: (0, a.jsxs)('div', {
                className: sn.details,
                children: [
                  (0, a.jsx)('div', {
                    className: sn.info,
                    children: (0, a.jsxs)('div', {
                      children: [
                        (0, a.jsx)('h1', {
                          className: (0, m.A)(
                            sn.title,
                            'spectrum-Heading',
                            'spectrum-Heading--sizeM',
                          ),
                          children: n.title,
                        }),
                        (0, a.jsx)(_t, {}),
                        (0, a.jsx)(qt, {}),
                        (0, a.jsx)(jt, {}),
                      ],
                    }),
                  }),
                  (0, a.jsxs)('div', {
                    className: sn.cta,
                    children: [
                      (0, a.jsx)(d.$n, {
                        href: cn({
                          designAreasSizes: t,
                          qty: n.quantity,
                          ...g().mapValues(n.attributes, (e) => e.value),
                        }),
                        onClick: () => {
                          gt({
                            action_name: 'editor-link',
                            action_type: 'hyperlink',
                            task_name: et[n.productType],
                          });
                        },
                        size: 'xl',
                        target: '_parent',
                        children: (0, a.jsxs)('div', {
                          className: sn.ctaContent,
                          children: [
                            (0, a.jsx)(b, {}),
                            ' Customize and print it',
                          ],
                        }),
                      }),
                      (0, a.jsxs)('div', {
                        className: sn.ctaSatisfaction,
                        children: [
                          'Printing through Zazzle with a promise of',
                          ' ',
                          (0, a.jsx)(u.N, {
                            href: Z('returns'),
                            onClick: () => {
                              gt({
                                action_name: '100%-satisfaction',
                                action_type: 'hyperlink',
                                task_name: et[n.productType],
                              });
                            },
                            target: '_blank',
                            variant: 'secondary',
                            children: '100% satisfaction',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        });
      } else i = (0, a.jsx)(Fe, {});
      return (0, a.jsx)('div', {
        className: (0, m.A)(sn.root, o && sn.root__errorPage),
        children: i,
      });
    };
    const cn = (e) => {
      const t = new URLSearchParams(window.location.search);
      const n = t.get('taskID');
      const a = t.get('shortcode');
      const r = t.get('TD');
      const i = {
        action: `print-${n}-now`,
        loadPrintAddon: !0,
        mv: 'other',
        productSettings: e ? JSON.stringify(e) : void 0,
        referrer: 'a.com-print-and-deliver-seo',
        sdid: 'MH16S6M4',
        taskID: n,
      };
      return a
        ? (0, p.EO)(`https://adobesparkpost.app.link/${a}`, i)
        : (0, p.EO)(
          `https://new.express.adobe.com/design/template/${r}`,
          i,
        );
    };
    const ln = (0, bt.Z0)({
      name: 'entities',
      initialState: { dbStrings: {}, products: {} },
      reducers: {
        receiveEntities: (e, t) => {
          g().merge(e, t.payload);
        },
      },
    });
    const dn = ln.actions;
    const un = ln.reducer;
    async function pn(e, t, n) {
      return (async function (e, t, n) {
        let a;
        (n = {
          getNewPromoIfNeeded: !0,
          retryAfterInvalidAccessToken: !1,
          ...n,
        }),
        mn && (await mn),
        await (0, M.iP)(),
        await he(n.getNewPromoIfNeeded);
        const r = n.retryAfterInvalidAccessToken ? 2 : 1;
        for (let i = 1; i <= r; i++) {
          try {
            const r = { access_token: te().accessToken };
            a = await W(e, t, n, r);
            break;
          } catch (e) {
            if (
              !(
                e instanceof x.r8
                  && e.message.startsWith('Invalid access token')
              )
            ) throw e;
            if (!(i < r)) throw e;
            mn
                || (mn = (async function () {
                  try {
                    await ge();
                  } finally {
                    mn = void 0;
                  }
                }())),
            await mn;
          }
        }
        return a;
      }(e, t, { method: 'GET', ...n }));
    }
    let mn;
    const hn = (0, bt.Nc)();
    const gn = hn.startListening.withTypes();
    async function vn(e) {
      return (
        await pn(Z('svc/z3/product/pricing'), e, { throwSoftJsonErrors: !0 })
      ).data;
    }
    gn({
      actionCreator: wt.changeOptions,
      effect: async (e, t) => {
        t.unsubscribe();
        try {
          const { pdp: n } = t.getState();
          const a = (function (e) {
            return Object.values(e).reduce(
              (e, t) => ((e[t.name] = t.value), e),
              {},
            );
          }(n.product.attributes));
          Object.assign(a, e.payload);
          const r = p.RZ.toString(a);
          const i = await (async function (e) {
            return (
              await pn(
                Z('svc/z3/product/changeOptions'),
                ((t = e),
                g().mapValues(t, (e) => (typeof e === 'object' ? JSON.stringify(e) : e))),
                { throwSoftJsonErrors: !0 },
              )
            ).data.product;
            let t;
          }({
            isCustomizing: !1,
            productModelParams: {
              pd: n.product.id,
              po: r,
              poOverride: r,
              preferredViewId: n.product.preferredRealviewId,
            },
          }));
          t.dispatch(wt.update({ product: i }));
          let s = t.getState().pdp.product;
          const o = await vn({
            dz: s.designId,
            pd: s.id,
            pmCode: '',
            po: s.productOption,
            pt: s.productType,
            qty: s.quantity,
          });
          (s = t.getState().pdp.product),
          t.dispatch(wt.update({ product: { ...s, pricing: o } }));
        } catch (e) {
          we(e);
        } finally {
          t.subscribe();
        }
      },
    }),
    gn({
      actionCreator: wt.changeQuantity,
      effect: async (e, t) => {
        t.cancelActiveListeners();
        try {
          const { pdp: n } = t.getState();
          const a = n.product;
          const r = await t.pause(
            vn({
              dz: a.designId,
              pd: a.id,
              pmCode: '',
              po: a.productOption,
              pt: a.productType,
              qty: e.payload,
            }),
          );
          const i = { ...a, pricing: r, quantity: e.payload };
          t.dispatch(wt.update({ product: i }));
        } catch (e) {
          if (e instanceof bt.mE) return;
          we(e);
        }
      },
    }),
    gn({
      actionCreator: wt.init,
      effect: async (e, t) => {
        t.unsubscribe();
        try {
          const e = new URLSearchParams(window.location.search);
          const n = e.get('TD');
          if (n) {
            const {
              designAreasSizes: e,
              entities: a,
              product: r,
            } = await (async function (e) {
              const t = await pn(
                Z('svc/adobeexpress/getProductFromTemplate'),
                { td: e },
                { throwSoftJsonErrors: !0 },
              );
              return {
                designAreasSizes: t.data.designAreasSizes,
                entities: t.data.entities,
                product: t.data.product,
              };
            }(n));
            t.dispatch(dn.receiveEntities(a));
            const i = await vn({
              dz: r.designId,
              pd: r.id,
              pmCode: '',
              po: r.productOption,
              pt: r.productType,
              qty: r.quantity,
            });
            (r.pricing = i),
            t.dispatch(wt.update({ designAreasSizes: e, product: r })),
            (document.title = r.title);
          }
          e.get('templateFail') === 'true'
                && t.dispatch(wt.update({ templateFetchFailed: !0 }));
        } catch (e) {
          we(e), t.dispatch(wt.update({ templateFetchFailed: !0 }));
        } finally {
          t.subscribe();
        }
      },
    });
    const fn = () => (0, bt.U1)({
      reducer: { entities: un, pdp: xt },
      middleware: (e) => e().prepend([hn.middleware]),
    });
    const bn = () => {
      const e = (0, i.d)(fn);
      (0, s.useEffect)(() => {
        window.Zazzle._store = e;
      }, []);
      const t = (0, s.useSyncExternalStore)(ne.subscribe, ne.getSnapshot);
      return (0, a.jsx)(r.S, {
        className: 'rootTheme',
        color: 'light',
        scale: 'medium',
        theme: 'express',
        children: (0, a.jsx)(
          fe.Provider,
          {
            value: t,
            children: (0, a.jsx)(c.Kq, {
              store: e,
              children: (0, a.jsx)(on, {}),
            }),
          },
          t?.culture,
        ),
      });
    };
    let yn;
    (yn = (0, a.jsx)(bn, {})),
    (globalThis.Zazzle = globalThis.Zazzle || {}),
    (globalThis.Zazzle.adobe = { queryParams: {} }),
    (globalThis.Zazzle.clientStartTime = Date.now()),
    (globalThis.ZENV = {
      adobeClientId: 'aa5c1ca7e1b941d5b4b15930a213ccff',
      apiClientId: 'ca2788df33454daea2f19251438b1402',
      apiClientSecret: '37525389c52640afb91d7ead147dac20',
      apiUrlBase: 'api.zazzle.com',
      enableConsentRevokation: !0,
      enablePerimeterX: !0,
      googleAnalyticsId: 'G-XCFNZM84Q3',
      pbjOverrides: {
        zazzle_businesscard: {
          attributeValueFilter: {
            '*': '',
            'en-ca': 'std={iso}',
            'en-gb': 'std={iso}',
            'en-us': 'std={na}',
            'es-us': 'std={na}',
            'fr-ca': 'std={iso}',
          },
        },
        zazzle_flyer: {
          attributeValueFilter: {
            '*': '',
            'en-ca': 'std={iso}',
            'en-gb': 'std={iso}',
            'en-us': 'std={na}',
            'es-us': 'std={na}',
            'fr-ca': 'std={iso}',
          },
        },
        zazzle_foldedthankyoucard: {
          attributeValueFilter: {
            '*': '',
            'en-ca': 'std={iso}',
            'en-gb': 'std={iso}',
            'en-us': 'std={na}',
            'es-us': 'std={na}',
            'fr-ca': 'std={iso}',
          },
        },
        zazzle_invitation3: {
          attributeValueFilter: {
            '*': '',
            'en-ca': 'std={iso}',
            'en-gb': 'std={iso}',
            'en-us': 'std={na}',
            'es-us': 'std={na}',
            'fr-ca': 'std={iso}',
          },
        },
        zazzle_print: {
          attributeValueFilter: {
            '*': '',
            'en-ca': 'std={iso}',
            'en-gb': '*',
            'en-us': 'std={na}',
            'es-us': 'std={na}',
            'fr-ca': 'std={iso}',
          },
        },
        zazzle_shirt: { attributeValueFilter: { 'en-gb': '' } },
      },
      staticRlvUrlBase: 'rlv.zcache.*',
      supportedLocales: ['en-gb', 'en-us', 'es-us'],
      videoUrlBase: 'asset.zcache.*/vcc',
      wwwAstBase: 'asset.zcache.*/assets/graphics',
      wwwUrlBase: 'www.zazzle.*',
    }),
    (re.current = 'localStorage'),
    (async () => {
      await (async function (e) {
        const t = globalThis.ZENV;
        t.culture = (function () {
          try {
            const e = (0, p.KC)(Zazzle.adobe.queryParams.z_allcultures)
              ? k
              : ZENV.supportedLocales;
            let t = 'en';
            if (Zazzle.adobe.locale) {
              const e = new Intl.Locale(Zazzle.adobe.locale);
              e.language && (t = e.language.toLowerCase());
            }
            const n = Zazzle.adobe.queryParams.z_region?.toLowerCase();
            const a = new URLSearchParams(window.location.search)
              .get('region')
              ?.toLowerCase();
            const r = n || a || 'us';
            let i = `${t}-${r}`;
            if (e.includes(i)) return i;
            const s = j[r];
            if (s) {
              const t = `${s}-${r}`.toLowerCase();
              if (e.includes(t)) return t;
            }
            if (((i = `${t}-us`.toLowerCase()), e.includes(i))) return i;
          } catch (e) {
            we(e);
          }
          return 'en-us';
        }());
        const [n, a] = t.culture.split('-');
        let r;
        (t.language = n),
        (t.region = a),
        (t.currency = S[a]),
        (t.unit = N[a]),
        (P ??= t.staticRlvUrlBase),
        (E ??= t.videoUrlBase),
        (C ??= t.wwwAstBase),
        (L ??= t.wwwUrlBase),
        (t.staticRlvUrlBase = T(P)),
        (t.videoUrlBase = T(E)),
        (t.wwwAstBase = T(C)),
        (t.wwwUrlBase = T(L));
        for (let n = 0; n < 5; n++) {
          try {
            (Zazzle.zStrings = (
              await import(`./strings/${e}.${t.culture}.js`)
            ).default),
            (r = void 0);
            break;
          } catch (e) {
            (r = e), await (0, p.yy)(100 * (n + 1));
          }
        }
        r && (we(r), _());
      }('adobePdp')),
      await he(!1),
      (0, o.H)(document.getElementById('root')).render(yn);
    })();
  },
  9138: (e, t, n) => {
    const a = n(5292);
    const r = n.n(a);
    const i = n(9893);
    const s = n.n(i);
    const o = n(9383);
    const c = n.n(o);
    const l = n(6884);
    const d = n.n(l);
    const u = n(9088);
    const p = n.n(u);
    const m = n(7997);
    const h = n.n(m);
    const g = n(6756);
    const v = {};
    (v.styleTagTransform = h()),
    (v.setAttributes = d()),
    (v.insert = c().bind(null, 'head')),
    (v.domAPI = s()),
    (v.insertStyleElement = p()),
    r()(g.A, v),
    g.A && g.A.locals && g.A.locals,
    n(1857),
    n(2016),
    n(1695),
    n(1968),
    n(3073);
    const f = n(3548);
    const b = {};
    (b.styleTagTransform = h()),
    (b.setAttributes = d()),
    (b.insert = c().bind(null, 'head')),
    (b.domAPI = s()),
    (b.insertStyleElement = p()),
    r()(f.A, b),
    f.A && f.A.locals && f.A.locals;
  },
  4840: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      ".bxxMj_7bB5LXp1CtN60J {\n\twidth: fit-content;\n\tmax-width: 100%;\n\tmargin: 0 auto;\n\tpadding: var(--spectrum-spacing-600) var(--spectrum-spacing-500);\n}\n.c7wKsFboMbDmxJp7rFbo {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\theight: 100vh;\n}\n\n.PAflHMEi0mH0O_vyNuxm {\n\tdisplay: flex;\n\tgap: var(--spectrum-spacing-300);\n\tmin-height: 500px;\n}\n\n.KJbMAV8bVvEX7GPkIjJM {\n\tdisplay: flex;\n\tgap: var(--spectrum-spacing-200);\n\tflex-shrink: 1;\n\tflex-direction: column;\n\twidth: 644px;\n\tmin-width: 200px;\n}\n.OabN0FUVjfqyHpQIrqRJ {\n\tposition: relative;\n}\n.ACtn1By9kNhWheOfept0 {\n\toverflow: hidden;\n\twidth: 100%;\n\tborder-radius: 14px;\n}\n.oXYNOju5H9HIctN8UAFI {\n\tposition: absolute;\n\tbottom: var(--spectrum-spacing-100);\n\tleft: var(--spectrum-spacing-100);\n\tpadding: 1px var(--spectrum-spacing-75);\n\tcolor: white;\n\tfont-size: 12px;\n\tfont-weight: 700;\n\tline-height: 1.3;\n\tpointer-events: none;\n\n\t--mod-badge-background-color-default: #6d6d6d;\n\t--mod-badge-corner-radius: 4px;\n}\n.Fzh992YyKGSJh6cOV8ru {\n\twidth: 100%;\n}\n\n.Z3vdX6s6_alXLqWaRzpv {\n\tposition: relative;\n\tflex-shrink: 0;\n\twidth: 400px;\n}\n.MEPY63NYMr33_ND9wkQl {\n\tposition: absolute;\n\tdisplay: flex;\n\tgap: var(--spectrum-spacing-300);\n\tflex-direction: column;\n\twidth: 100%;\n\theight: 100%;\n\n\t--adobepdp-attributes-gradient-height: 32px;\n}\n.ImL7yOvjbD3X1t6Gdxa9 {\n\tflex: 1;\n\toverflow: hidden auto;\n\tpadding-block-end: var(--adobepdp-attributes-gradient-height);\n\tpadding-inline-end: var(--spectrum-spacing-200);\n}\n.ImL7yOvjbD3X1t6Gdxa9, .ItTpmkPvZNjeJRZG_YEG {\n\tpadding-inline-start: var(--spectrum-spacing-100); /* to allow for focus outlines */\n}\n._vAOr62PYJ9YQxAq58ep {\n\tmargin-bottom: var(--spectrum-spacing-300);\n}\n.ItTpmkPvZNjeJRZG_YEG {\n\tposition: relative;\n}\n.ItTpmkPvZNjeJRZG_YEG::after {\n\tcontent: '';\n\tposition: absolute;\n\tright: 0;\n\tbottom: calc(100% + var(--spectrum-spacing-300));\n\tleft: 0;\n\theight: var(--adobepdp-attributes-gradient-height);\n\tbackground: linear-gradient(to top, white, transparent);\n}\n.Pbv2UInu7Zo6jYE1mBmk {\n\tdisplay: flex;\n\tgap: var(--spectrum-spacing-100);\n\talign-items: center;\n}\n.fueWp3l75ZLlgGptjNot {\n\tmargin-block-start: var(--spectrum-spacing-100);\n}\n\n.cyNgoUxV3aDNv5cXUnsR {\n\tdisplay: flex;\n\tgap: var(--spectrum-spacing-300);\n\tflex-direction: column;\n\tmax-width: 322px;\n}\n.mCZ8sNKPcHXs9xWrq2rZ {\n\talign-self: flex-start;\n}\n",
      '',
    ]),
    (s.locals = {
      root: 'bxxMj_7bB5LXp1CtN60J',
      root__errorPage: 'c7wKsFboMbDmxJp7rFbo',
      main: 'PAflHMEi0mH0O_vyNuxm',
      viewsWrapper: 'KJbMAV8bVvEX7GPkIjJM',
      mainViewWrapper: 'OabN0FUVjfqyHpQIrqRJ',
      mainView: 'ACtn1By9kNhWheOfept0',
      mainView_badge: 'oXYNOju5H9HIctN8UAFI',
      viewSelector: 'Fzh992YyKGSJh6cOV8ru',
      detailsWrapper: 'Z3vdX6s6_alXLqWaRzpv',
      details: 'MEPY63NYMr33_ND9wkQl',
      info: 'ImL7yOvjbD3X1t6Gdxa9',
      cta: 'ItTpmkPvZNjeJRZG_YEG',
      title: '_vAOr62PYJ9YQxAq58ep',
      ctaContent: 'Pbv2UInu7Zo6jYE1mBmk',
      ctaSatisfaction: 'fueWp3l75ZLlgGptjNot',
      templateFail: 'cyNgoUxV3aDNv5cXUnsR',
      templateFail_cta: 'mCZ8sNKPcHXs9xWrq2rZ',
    });
    const o = s;
  },
  777: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      '.H_iiYg_BdAWkzz8ofjAd {\n\tdisplay: flex;\n\tgap: var(--spectrum-spacing-400);\n\tflex-direction: column;\n}\n\n.QXmaNlnMvNljVpqwh4R1 {\n\twidth: 100%;\n\tmargin-top: 2px;\n}\n\n.P1Tg5on_2GJSeK3bGX6o {\n\tdisplay: grid !important;\n\tgrid-template-columns: repeat(6, 1fr);\n\n\t--mod-imageRadioGroup-border-radius: 4px;\n}\n.eTC5pvfSmGDdRCYtamni {\n\tmargin-top: var(--spectrum-spacing-300);\n}\n.B5J0Ey5TcD3rqvXpvAUf {\n\twidth: auto !important;\n}\n\n.Lf_YRVgzAoNpCiOtKQ8M {\n\tdisplay: flex;\n\tgap: var(--spectrum-spacing-100);\n\talign-items: flex-start;\n\tmargin-top: var(--spectrum-spacing-300);\n}\n.kfIz2hRSSeOcpPW4Hjl8 {\n\twidth: 96px;\n\taspect-ratio: 1;\n\tborder-radius: 4px;\n}\n.V4J4AI9vq6zzJlXuIrTA {\n\tline-height: 1.3;\n}\n.V4J4AI9vq6zzJlXuIrTA p {\n\tmargin: 0;\n}\n\n.wKPEGAixHGTtlegPQKBl {\n\tmargin-top: var(--spectrum-spacing-100);\n}\n',
      '',
    ]),
    (s.locals = {
      root: 'H_iiYg_BdAWkzz8ofjAd',
      selector__select: 'QXmaNlnMvNljVpqwh4R1',
      selector__thumbnails: 'P1Tg5on_2GJSeK3bGX6o',
      selector__thumbnails_group: 'eTC5pvfSmGDdRCYtamni',
      selector__thumbnails_item: 'B5J0Ey5TcD3rqvXpvAUf',
      selector__thumbnails_preview: 'Lf_YRVgzAoNpCiOtKQ8M',
      selector__thumbnails_preview_image: 'kfIz2hRSSeOcpPW4Hjl8',
      selector__thumbnails_preview_info: 'V4J4AI9vq6zzJlXuIrTA',
      subtitle: 'wKPEGAixHGTtlegPQKBl',
    });
    const o = s;
  },
  5483: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      '.cbdQkmA4usA6Z4a1Zibb p,\n.cbdQkmA4usA6Z4a1Zibb ul {\n\tmargin: 0;\n}\n.cbdQkmA4usA6Z4a1Zibb ul {\n\tpadding-inline-start: calc(16px + 9px);\n}\n',
      '',
    ]),
    (s.locals = { attributeValueDescription: 'cbdQkmA4usA6Z4a1Zibb' });
    const o = s;
  },
  1280: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      '.joYK5LkAYl2u6t2qbS_A {\n\tpadding-top: var(--spectrum-spacing-400);\n\tpadding-bottom: var(--spectrum-spacing-300);\n}\n\n.McYxW3fZRk0Ydgr_XxU6 {\n\tdisplay: flex;\n\tgap: var(--spectrum-spacing-100);\n\talign-items: center;\n\tjustify-content: space-between;\n\tmargin-bottom: var(--spectrum-spacing-300);\n}\n.JjtnLnKxM63CzKfWXF_o {\n\ttext-align: right;\n}\n.nrVa6b3reToBWwuxXZpf {\n\tcolor: var(--sx-gray-800);\n\n\t--mod-heading-sans-serif-font-weight: 700;\n}\n',
      '',
    ]),
    (s.locals = {
      root: 'joYK5LkAYl2u6t2qbS_A',
      costRow: 'McYxW3fZRk0Ydgr_XxU6',
      costRow_pricing: 'JjtnLnKxM63CzKfWXF_o',
      costRow_price: 'nrVa6b3reToBWwuxXZpf',
    });
    const o = s;
  },
  2774: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      '.lBniZHBqjXcFUDCiv3Fa {\n\twidth: 100%;\n\n\t--mod-scrolly-button-size: 40px;\n}\n\n.XxfRRyrxkvfyaMQT4kzG {\n\tgap: var(--spectrum-spacing-200) !important;\n\n\t--mod-imageRadioGroup-border-radius: 14px;\n}\n\n._aoEwvB3oP01KWwXAi_j {\n\twidth: 120px !important;\n}\n',
      '',
    ]),
    (s.locals = {
      root: 'lBniZHBqjXcFUDCiv3Fa',
      items: 'XxfRRyrxkvfyaMQT4kzG',
      item: '_aoEwvB3oP01KWwXAi_j',
    });
    const o = s;
  },
  1167: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      ".XzqNV26XOPlWzQGZoWy_ {\n\tdisplay: flex;\n\tgap: var(--spectrum-spacing-100);\n\tmargin: 0;\n\tpadding: 0;\n\tborder: none;\n\n\t--imageRadioGroup-border-radius: 8px;\n}\n\n.gXAkAO8xIW2aPvy5ywdH {\n\tposition: relative;\n\tdisplay: flex;\n\tgap: var(--specturm-spacing-200);\n\tflex-direction: column;\n\tscroll-snap-align: start;\n\tscroll-snap-stop: always;\n\twidth: 50px;\n\tcursor: pointer;\n}\n.gXAkAO8xIW2aPvy5ywdH:hover::after,\n.Hx6iwxoXo2ItbgytR4R8::after {\n\tcontent: '';\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\taspect-ratio: 1;\n\tborder: 2px solid black;\n\tborder-radius: var(--mod-imageRadioGroup-border-radius, var(--imageRadioGroup-border-radius));\n}\n.gXAkAO8xIW2aPvy5ywdH:not(.Hx6iwxoXo2ItbgytR4R8):hover::after {\n\tborder-color: #8f8f8f;\n}\n.Hx6iwxoXo2ItbgytR4R8.gkFUS_VdpqUe5uz9l0Fx::before {\n\tcontent: '';\n\tposition: absolute;\n\ttop: 2px;\n\tright: 2px;\n\tleft: 2px;\n\taspect-ratio: 1;\n\tborder: 1px solid white;\n\tborder-radius: calc(var(--mod-imageRadioGroup-border-radius, var(--imageRadioGroup-border-radius)) - 2px);\n}\n\n.MK2uUP3IvELEEGQYDpCr {\n\tposition: absolute;\n\tappearance: none;\n\topacity: 0;\n\twidth: 0;\n\theight: 0;\n\tborder: none;\n}\n\n._5S2qoHQqZZoSikB2_Ho {\n\taspect-ratio: 1;\n\tborder-radius: var(--mod-imageRadioGroup-border-radius, var(--imageRadioGroup-border-radius));\n}\n\n.TTW08ZP0WVF6wWOA_rMT {\n\tposition: relative;\n\tmargin-top: 4px;\n\tfont-size: 12px;\n\tline-height: 1.3em;\n}\n.LenSzcWLXT_wcpesUQYJ {\n\tfont-weight: 700;\n}\n.SNYns_Eb7l1Ek2IONhO1 {\n\tposition: absolute;\n\ttop: 0;\n\tright: 0;\n\tleft: 0;\n\twhite-space: nowrap;\n\toverflow: hidden;\n\ttext-align: center;\n\ttext-overflow: ellipsis;\n}\n\n.abhDeHLMyieyy7ja5avd {\n\tmargin-top: 4px;\n\tline-height: 1.3;\n\ttext-align: center;\n}\n",
      '',
    ]),
    (s.locals = {
      root: 'XzqNV26XOPlWzQGZoWy_',
      item: 'gXAkAO8xIW2aPvy5ywdH',
      item__selected: 'Hx6iwxoXo2ItbgytR4R8',
      item__withSelectedInsetBorder: 'gkFUS_VdpqUe5uz9l0Fx',
      radio: 'MK2uUP3IvELEEGQYDpCr',
      image: '_5S2qoHQqZZoSikB2_Ho',
      titlePlaceholder: 'TTW08ZP0WVF6wWOA_rMT',
      titlePlaceholder__bold: 'LenSzcWLXT_wcpesUQYJ',
      title: 'SNYns_Eb7l1Ek2IONhO1',
      priceDelta: 'abhDeHLMyieyy7ja5avd',
    });
    const o = s;
  },
  2206: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      '.fwBnPODarm8jXy0fPWCJ {\n\tposition: fixed;\n\tz-index: 1;\n\ttop: 0;\n\tleft: 0;\n\t/* Using grid to keep the spinner always in the exact vertical center, regardless of label height/existence */\n\tdisplay: grid;\n\tgrid-template-rows: 1fr auto 1fr;\n\tgap: var(--spectrum-spacing-300);\n\tplace-items: center;\n\twidth: 100%;\n\theight: 100%;\n\tpadding: var(--spectrum-spacing-400);\n\ttext-align: center;\n\tbackground: white;\n}\n\n.tJn1zdzguXIzK0AzITPX {\n\tgrid-row-start: 1;\n\talign-self: end;\n}\n\n.E5ao5rm4uJkd9DacLYhL {\n\tgrid-row-start: 2;\n}\n',
      '',
    ]),
    (s.locals = {
      root: 'fwBnPODarm8jXy0fPWCJ',
      label: 'tJn1zdzguXIzK0AzITPX',
      progressCircle: 'E5ao5rm4uJkd9DacLYhL',
    });
    const o = s;
  },
  9774: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      '.Tvsq2rNpJk_QvFSRpXPY {\n\tposition: relative;\n\tbox-sizing: content-box;\n\tmax-width: 100%;\n\theight: 0;\n\tpadding-bottom: 100%;\n}\n\n.zLBUBPLSRfRx9dBsEaKo,\n.BXpCQuR13RA78HBrFhOg {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\toverflow: hidden;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.aKKlTHuaovF0hQTOhTBx {\n\tdisplay: block;\n\twidth: 100%;\n\tmax-width: none;\n\theight: auto;\n}\n\n.szL7V3sBlgnBQEAblRam .aKKlTHuaovF0hQTOhTBx {\n\twidth: 108%;\n\tmargin-top: -4%;\n\tmargin-left: -4%;\n}\n\n.awfgGzQu2lzBOkkyA0CA {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.cfZKx5PCuEINF3aiK_Y2 {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tline-height: 0;\n}\n',
      '',
    ]),
    (s.locals = {
      outerContainer: 'Tvsq2rNpJk_QvFSRpXPY',
      imageContainer: 'zLBUBPLSRfRx9dBsEaKo',
      staticVideo: 'BXpCQuR13RA78HBrFhOg',
      image: 'aKKlTHuaovF0hQTOhTBx',
      root__cropAttribution: 'szL7V3sBlgnBQEAblRam',
      dynamicVideoWrapper: 'awfgGzQu2lzBOkkyA0CA',
      dynamicVideo: 'cfZKx5PCuEINF3aiK_Y2',
    });
    const o = s;
  },
  9876: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      ".PB5LPyoiwI2STVLh9Nzy {\n\tposition: relative;\n\tdisplay: flex;\n\talign-items: center;\n}\n\n.mJHo4UpDffCetWeA7SXI {\n\toverflow: hidden;\n\tscroll-behavior: smooth;\n\tscroll-snap-type: x mandatory;\n}\n.bjciT6RmmMoJflHIpkP2 {\n\twidth: min-content;\n}\n\n/* A bunch of this is jacked from the scroller button in Adobe's left panel */\n.p3XLSsmNWLz8lS6kpfRP {\n\tposition: absolute;\n\tz-index: 1;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: var(--mod-scrolly-button-size, 24px);\n\theight: var(--mod-scrolly-button-size, 24px);\n\tpadding: 0;\n\tline-height: 1;\n\tborder-radius: var(--mod-scrolly-button-size, 24px);\n\tfilter: drop-shadow(0 1px var(--spectrum-spacing-75) var(--spectrum-popover-shadow-color, var(--spectrum-alias-dropshadow-color)));\n\n\tmin-inline-size: var(--mod-scrolly-button-size, 24px);\n\t--mod-actionbutton-background-color-default: var(--spectrum-white);\n\t--mod-actionbutton-background-color-hover: var(--spectrum-gray-200);\n}\n@media (hover: hover) and (pointer: fine) {\n\t.PB5LPyoiwI2STVLh9Nzy.BFPmlNSTcF5Blu4p8mOQ .p3XLSsmNWLz8lS6kpfRP {\n\t\topacity: 0;\n\t}\n\t.PB5LPyoiwI2STVLh9Nzy.BFPmlNSTcF5Blu4p8mOQ:hover .p3XLSsmNWLz8lS6kpfRP:not([disabled]) {\n\t\topacity: 1;\n\t}\n}\n.p3XLSsmNWLz8lS6kpfRP[disabled] {\n\tdisplay: none;\n}\n.Mb8YLt2F39Z5BnieL2qU {\n\tleft: 0;\n}\n.QIDPXMVBqxNJ9TsOF30y {\n\tright: 0;\n}\n",
      '',
    ]),
    (s.locals = {
      root: 'PB5LPyoiwI2STVLh9Nzy',
      scroller: 'mJHo4UpDffCetWeA7SXI',
      content: 'bjciT6RmmMoJflHIpkP2',
      button: 'p3XLSsmNWLz8lS6kpfRP',
      root__hoverButtons: 'BFPmlNSTcF5Blu4p8mOQ',
      buttonPrev: 'Mb8YLt2F39Z5BnieL2qU',
      buttonNext: 'QIDPXMVBqxNJ9TsOF30y',
    });
    const o = s;
  },
  4732: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      '\n.gNOde1bB60Dy9_meLbrB {\n\tdisplay: flex;\n\tgap: 3px; /* a space */\n\talign-items: center;\n\tjustify-content: flex-end;\n\tmargin-right: -3px;\n\tcolor: var(--strikethrough-color);\n\n\t--strikethrough-color: #505050;\n\t--mod-actionbutton-content-color-default: var(--strikethrough-color);\n}\n.MHX57ve3Tj0lBzy1AQDz {\n\ttext-decoration: line-through;\n}\n\n._3X9meY9uxdUl7xcGMoN {\n\tpadding: var(--spectrum-spacing-400);\n\ttext-align: left;\n\n\t--mod-popover-content-area-spacing-vertical: 0;\n}\n\n._K5qdLHLkTJTNYWeF2nD {\n\tline-height: 1.3;\n}\n._K5qdLHLkTJTNYWeF2nD p:last-child {\n\tmargin-bottom: 0;\n}\n',
      '',
    ]),
    (s.locals = {
      root: 'gNOde1bB60Dy9_meLbrB',
      strikethrough: 'MHX57ve3Tj0lBzy1AQDz',
      popover: '_3X9meY9uxdUl7xcGMoN',
      body: '_K5qdLHLkTJTNYWeF2nD',
    });
    const o = s;
  },
  3548: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      '/* we need `height:100%` all the way down so that we can have vertical layouts */\nhtml,\nbody,\n#root,\n.rootTheme {\n\theight: 100%;\n\n\t/* Copying this variable that is in Express that they want us to use in the add-on */\n\t--sx-gray-800: #292929;\n}\n\n/* TODO: use SCSS and import this? */\n.buttonReset {\n\tdisplay: block;\n\talign-items: normal; /* Not sure why the user agent sets align-items: flex-start on buttons */\n\twidth: 100%;\n\tpadding: 0;\n\ttext-align: left;\n\tbackground: none;\n\tborder: none;\n\tborder-radius: 0;\n\tcursor: pointer;\n\n\t-webkit-appearance: none;\n}\n\n/* https://github.com/ZazzleDev/zazzle-adobe-express-add-on/issues/70 */\n.spectrum-Heading--sizeXL,\n.spectrum-Heading--sizeXS,\n.spectrum-Heading--sizeXXS {\n\t--mod-heading-sans-serif-font-weight: var(--spectrum-bold-font-weight);\n}\n\n#Cardinal-Modal, #Cardinal-ModalContent, #Cardinal-CCA-IFrame {\n\twidth: 318px !important;\n\tmax-width: none !important;\n\tpadding: 0 !important;\n\tborder-radius: 0 !important;\n}\n#Cardinal-ModalContent {\n\toverflow-y: auto !important;\n\theight: calc(100vh - 2px) !important;\n}\n#Cardinal-CCA-IFrame {\n\theight: calc(100vh - 2px) !important;\n}\n',
      '',
    ]);
    const o = s;
  },
  5878: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      '.ZLlTLJfGN8LsolfcWPFR {\n\twhite-space: nowrap;\n\twidth: 95px;\n\tfont-weight: var(--spectrum-regular-font-weight);\n\n\t--mod-menu-item-label-inline-edge-to-content: var(--spectrum-component-edge-to-text-300);\n\t--mod-menu-item-selectable-edge-to-text-not-selected: var(--spectrum-component-edge-to-text-300);\n}\n',
      '',
    ]),
    (s.locals = { root: 'ZLlTLJfGN8LsolfcWPFR' });
    const o = s;
  },
  6756: (e, t, n) => {
    n.d(t, { A: () => o });
    const a = n(8645);
    const r = n.n(a);
    const i = n(278);
    const s = n.n(i)()(r());
    s.push([
      e.id,
      '/* minimum possible resets to work in conjunction with Spectrum (https://www.joshwcomeau.com/css/custom-css-reset/) */\n\n*,\n*::before,\n*::after {\n\tbox-sizing: border-box;\n}\n\nbody {\n\tmargin: 0;\n\n\t-webkit-font-smoothing: antialiased;\n\tisolation: isolate;\n}\n\nimg,\npicture,\nvideo,\ncanvas,\nsvg {\n\tdisplay: block;\n\tmax-width: 100%;\n}\n\np,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n\toverflow-wrap: break-word;\n}\n',
      '',
    ]);
    const o = s;
  },
  8193: (t) => {
    t.exports = e;
  },
  3966: () => {},
};
const s = {};
function o(e) {
  const t = s[e];
  if (void 0 !== t) return t.exports;
  const n = (s[e] = { id: e, loaded: !1, exports: {} });
  return i[e].call(n.exports, n, n.exports, o), (n.loaded = !0), n.exports;
}
(o.m = i),
(t = []),
(o.O = (e, n, a, r) => {
  if (!n) {
    let i = 1 / 0;
    for (d = 0; d < t.length; d++) {
      for (var [n, a, r] = t[d], s = !0, c = 0; c < n.length; c++) {
        (!1 & r || i >= r) && Object.keys(o.O).every((e) => o.O[e](n[c]))
          ? n.splice(c--, 1)
          : ((s = !1), r < i && (i = r));
      }
      if (s) {
        t.splice(d--, 1);
        const l = a();
        void 0 !== l && (e = l);
      }
    }
    return e;
  }
  r = r || 0;
  for (var d = t.length; d > 0 && t[d - 1][2] > r; d--) t[d] = t[d - 1];
  t[d] = [n, a, r];
}),
(o.n = (e) => {
  const t = e && e.__esModule ? () => e.default : () => e;
  return o.d(t, { a: t }), t;
}),
(a = Object.getPrototypeOf
  ? (e) => Object.getPrototypeOf(e)
  : (e) => e.__proto__),
(o.t = function (e, t) {
  if ((1 & t && (e = this(e)), 8 & t)) return e;
  if (typeof e === 'object' && e) {
    if (4 & t && e.__esModule) return e;
    if (16 & t && typeof e.then === 'function') return e;
  }
  const r = Object.create(null);
  o.r(r);
  const i = {};
  n = n || [null, a({}), a([]), a(a)];
  for (let s = 2 & t && e; typeof s === 'object' && !~n.indexOf(s); s = a(s)) Object.getOwnPropertyNames(s).forEach((t) => (i[t] = () => e[t]));
  return (i.default = () => e), o.d(r, i), r;
}),
(o.d = (e, t) => {
  for (const n in t) {
    o.o(t, n)
        && !o.o(e, n)
        && Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
  }
}),
(o.f = {}),
(o.e = (e) => Promise.all(Object.keys(o.f).reduce((t, n) => (o.f[n](e, t), t), []))),
(o.u = (e) => `${e}.js`),
(o.g = (function () {
  if (typeof globalThis === 'object') return globalThis;
  try {
    return this || new Function('return this')();
  } catch (e) {
    if (typeof window === 'object') return window;
  }
}())),
(o.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
(r = {}),
(o.l = (e, t, n, a) => {
  if (r[e]) r[e].push(t);
  else {
    let i; let
      s;
    if (void 0 !== n) {
      for (
        let c = document.getElementsByTagName('script'), l = 0;
        l < c.length;
        l++
      ) {
        const d = c[l];
        if (d.getAttribute('src') == e) {
          i = d;
          break;
        }
      }
    }
    i
        || ((s = !0),
        ((i = document.createElement('script')).type = 'module'),
        (i.charset = 'utf-8'),
        (i.timeout = 120),
        o.nc && i.setAttribute('nonce', o.nc),
        (i.src = e)),
    (r[e] = [t]);
    const u = (t, n) => {
      (i.onerror = i.onload = null), clearTimeout(p);
      const a = r[e];
      if (
        (delete r[e],
        i.parentNode && i.parentNode.removeChild(i),
        a && a.forEach((e) => e(n)),
        t)
      ) return t(n);
    };
    var p = setTimeout(
      u.bind(null, void 0, { type: 'timeout', target: i }),
      12e4,
    );
    (i.onerror = u.bind(null, i.onerror)),
    (i.onload = u.bind(null, i.onload)),
    s && document.head.appendChild(i);
  }
}),
(o.r = (e) => {
  typeof Symbol !== 'undefined'
      && Symbol.toStringTag
      && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
  Object.defineProperty(e, '__esModule', { value: !0 });
}),
(o.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e)),
(() => {
  let e;
  if ((typeof import.meta.url === 'string' && (e = import.meta.url), !e)) throw new Error('Automatic publicPath is not supported in this browser');
  (e = e
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\/[^\/]+$/, '/')),
  (o.p = e);
})(),
(() => {
  const e = { 580: 0 };
  (o.f.j = (t, n) => {
    let a = o.o(e, t) ? e[t] : void 0;
    if (a !== 0) {
      if (a) n.push(a[2]);
      else {
        const r = new Promise((n, r) => (a = e[t] = [n, r]));
        n.push((a[2] = r));
        const i = o.p + o.u(t);
        const s = new Error();
        o.l(
          i,
          (n) => {
            if (o.o(e, t) && ((a = e[t]) !== 0 && (e[t] = void 0), a)) {
              const r = n && (n.type === 'load' ? 'missing' : n.type);
              const i = n && n.target && n.target.src;
              (s.message = `Loading chunk ${t} failed.\n(${r}: ${i})`),
              (s.name = 'ChunkLoadError'),
              (s.type = r),
              (s.request = i),
              a[1](s);
            }
          },
          `chunk-${t}`,
          t,
        );
      }
    }
  }),
  (o.O.j = (t) => e[t] === 0);
  const t = (t, n) => {
    let a;
    let r;
    const [i, s, c] = n;
    let l = 0;
    if (i.some((t) => e[t] !== 0)) {
      for (a in s) o.o(s, a) && (o.m[a] = s[a]);
      if (c) var d = c(o);
    }
    for (t && t(n); l < i.length; l++) (r = i[l]), o.o(e, r) && e[r] && e[r][0](), (e[r] = 0);
    return o.O(d);
  };
  const n = (self.webpackChunk = self.webpackChunk || []);
  n.forEach(t.bind(null, 0)), (n.push = t.bind(null, n.push.bind(n)));
})(),
(o.nc = void 0),
o.O(void 0, [671, 187, 872, 246, 756], () => o(9138));
let c = o.O(void 0, [671, 187, 872, 246, 756], () => o(4762));
c = o.O(c);
