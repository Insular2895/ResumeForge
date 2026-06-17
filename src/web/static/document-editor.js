//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, a) => (a = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.iterator;
	function m(e) {
		return typeof e != "object" || !e ? null : (e = p && e[p] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var h = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, g = Object.assign, _ = {};
	function v(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	v.prototype.isReactComponent = {}, v.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, v.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function y() {}
	y.prototype = v.prototype;
	function b(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	var x = b.prototype = new y();
	x.constructor = b, g(x, v.prototype), x.isPureReactComponent = !0;
	var ee = Array.isArray;
	function te() {}
	var S = {
		H: null,
		A: null,
		T: null,
		S: null
	}, ne = Object.prototype.hasOwnProperty;
	function C(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function re(e, t) {
		return C(e.type, t, e.props);
	}
	function ie(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function ae(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var w = /\/+/g;
	function oe(e, t) {
		return typeof e == "object" && e && e.key != null ? ae("" + e.key) : t.toString(36);
	}
	function T(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(te, te) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function se(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, se(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + oe(e, 0) : a, ee(o) ? (i = "", c != null && (i = c.replace(w, "$&/") + "/"), se(o, r, i, "", function(e) {
			return e;
		})) : o != null && (ie(o) && (o = re(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(w, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (ee(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + oe(a, u), c += se(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + oe(a, u++), c += se(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return se(T(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function ce(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return se(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function le(e) {
		if (e._status === -1) {
			var t = e._result;
			t = t(), t.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t);
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t);
			}), e._status === -1 && (e._status = 0, e._result = t);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var E = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, D = {
		map: ce,
		forEach: function(e, t, n) {
			ce(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return ce(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return ce(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!ie(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = D, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = S, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return S.H.useMemoCache(e);
		}
	}, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = g({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !ne.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return C(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) ne.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return C(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = ie, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: le
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = function(e) {
		var t = S.T, n = {};
		S.T = n;
		try {
			var r = e(), i = S.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(te, E);
		} catch (e) {
			E(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), S.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return S.H.useCacheRefresh();
	}, e.use = function(e) {
		return S.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return S.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return S.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return S.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return S.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return S.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return S.H.useEffectEvent(e);
	}, e.useId = function() {
		return S.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return S.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return S.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return S.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return S.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return S.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return S.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return S.H.useRef(e);
	}, e.useState = function(e) {
		return S.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return S.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return S.H.useTransition();
	}, e.version = "19.2.7";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) if (n(c) !== null) m = !0, ee || (ee = !0, ie());
		else {
			var t = n(l);
			t !== null && oe(x, t.startTime - e);
		}
	}
	var ee = !1, te = -1, S = 5, ne = -1;
	function C() {
		return g ? !0 : !(e.unstable_now() - ne < S);
	}
	function re() {
		if (g = !1, ee) {
			var t = e.unstable_now();
			ne = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(te), te = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && C());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && oe(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? ie() : ee = !1;
			}
		}
	}
	var ie;
	if (typeof y == "function") ie = function() {
		y(re);
	};
	else if (typeof MessageChannel < "u") {
		var ae = new MessageChannel(), w = ae.port2;
		ae.port1.onmessage = re, ie = function() {
			w.postMessage(null);
		};
	} else ie = function() {
		_(re, 0);
	};
	function oe(t, n) {
		te = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : S = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
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
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(te), te = -1) : h = !0, oe(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, ee || (ee = !0, ie()))), r;
	}, e.unstable_shouldYield = C, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal");
	function o(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var s = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function c(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return o(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = s.T, n = i.p;
		try {
			if (s.T = null, i.p = 2, e) return e();
		} finally {
			s.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") if (typeof t == "object" && t) {
			if (t.as == null || t.as === "script") {
				var n = c(t.as, t.crossOrigin);
				i.d.M(e, {
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0
				});
			}
		} else t ?? i.d.M(e);
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") if (t) {
			var n = c(t.as, t.crossOrigin);
			i.d.m(e, {
				as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0
			});
		} else i.d.m(e);
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return s.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return s.H.useHostTransitionStatus();
	}, e.version = "19.2.7";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		var t = e, n = e;
		if (e.alternate) for (; t.return;) t = t.return;
		else {
			e = t;
			do
				t = e, t.flags & 4098 && (n = t.return), e = t.return;
			while (e);
		}
		return t.tag === 3 ? n : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), ee = Symbol.for("react.consumer"), te = Symbol.for("react.context"), S = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), C = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), ie = Symbol.for("react.lazy"), ae = Symbol.for("react.activity"), w = Symbol.for("react.memo_cache_sentinel"), oe = Symbol.iterator;
	function T(e) {
		return typeof e != "object" || !e ? null : (e = oe && e[oe] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var se = Symbol.for("react.client.reference");
	function ce(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === se ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case ne: return "Suspense";
			case C: return "SuspenseList";
			case ae: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case te: return e.displayName || "Context";
			case ee: return (e._context.displayName || "Context") + ".Consumer";
			case S:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case re: return t = e.displayName || null, t === null ? ce(e.type) || "Memo" : t;
			case ie:
				t = e._payload, e = e._init;
				try {
					return ce(e(t));
				} catch {}
		}
		return null;
	}
	var le = Array.isArray, E = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, D = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ue = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, de = [], fe = -1;
	function pe(e) {
		return { current: e };
	}
	function me(e) {
		0 > fe || (e.current = de[fe], de[fe] = null, fe--);
	}
	function O(e, t) {
		fe++, de[fe] = e.current, e.current = t;
	}
	var he = pe(null), ge = pe(null), _e = pe(null), ve = pe(null);
	function ye(e, t) {
		switch (O(_e, t), O(ge, e), O(he, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? Wd(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = Wd(t), e = Gd(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		me(he), O(he, e);
	}
	function be() {
		me(he), me(ge), me(_e);
	}
	function xe(e) {
		e.memoizedState !== null && O(ve, e);
		var t = he.current, n = Gd(t, e.type);
		t !== n && (O(ge, e), O(he, n));
	}
	function Se(e) {
		ge.current === e && (me(he), me(ge)), ve.current === e && (me(ve), tp._currentValue = ue);
	}
	var Ce, we;
	function Te(e) {
		if (Ce === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Ce = t && t[1] || "", we = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Ce + e + we;
	}
	var Ee = !1;
	function De(e, t) {
		if (!e || Ee) return "";
		Ee = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							e.call(n.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Ee = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Te(n) : "";
	}
	function Oe(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Te(e.type);
			case 16: return Te("Lazy");
			case 13: return e.child !== t && t !== null ? Te("Suspense Fallback") : Te("Suspense");
			case 19: return Te("SuspenseList");
			case 0:
			case 15: return De(e.type, !1);
			case 11: return De(e.type.render, !1);
			case 1: return De(e.type, !0);
			case 31: return Te("Activity");
			default: return "";
		}
	}
	function ke(e) {
		try {
			var t = "", n = null;
			do
				t += Oe(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Ae = Object.prototype.hasOwnProperty, je = t.unstable_scheduleCallback, Me = t.unstable_cancelCallback, Ne = t.unstable_shouldYield, Pe = t.unstable_requestPaint, Fe = t.unstable_now, Ie = t.unstable_getCurrentPriorityLevel, Le = t.unstable_ImmediatePriority, Re = t.unstable_UserBlockingPriority, ze = t.unstable_NormalPriority, Be = t.unstable_LowPriority, Ve = t.unstable_IdlePriority, He = t.log, Ue = t.unstable_setDisableYieldValue, We = null, Ge = null;
	function Ke(e) {
		if (typeof He == "function" && Ue(e), Ge && typeof Ge.setStrictMode == "function") try {
			Ge.setStrictMode(We, e);
		} catch {}
	}
	var qe = Math.clz32 ? Math.clz32 : Xe, Je = Math.log, Ye = Math.LN2;
	function Xe(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Je(e) / Ye | 0) | 0;
	}
	var Ze = 256, Qe = 262144, $e = 4194304;
	function et(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function tt(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = et(n))) : i = et(o) : i = et(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = et(n))) : i = et(o)) : i = et(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function nt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function rt(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
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
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function it() {
		var e = $e;
		return $e <<= 1, !($e & 62914560) && ($e = 4194304), e;
	}
	function at(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function ot(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function st(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - qe(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && ct(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function ct(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - qe(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function lt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - qe(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function ut(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : dt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function dt(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
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
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function ft(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function pt() {
		var e = D.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : _p(e.type)) : e;
	}
	function mt(e, t) {
		var n = D.p;
		try {
			return D.p = e, t();
		} finally {
			D.p = n;
		}
	}
	var ht = Math.random().toString(36).slice(2), gt = "__reactFiber$" + ht, _t = "__reactProps$" + ht, vt = "__reactContainer$" + ht, yt = "__reactEvents$" + ht, bt = "__reactListeners$" + ht, xt = "__reactHandles$" + ht, St = "__reactResources$" + ht, Ct = "__reactMarker$" + ht;
	function wt(e) {
		delete e[gt], delete e[_t], delete e[yt], delete e[bt], delete e[xt];
	}
	function Tt(e) {
		var t = e[gt];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[vt] || n[gt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = mf(e); e !== null;) {
					if (n = e[gt]) return n;
					e = mf(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Et(e) {
		if (e = e[gt] || e[vt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Dt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Ot(e) {
		var t = e[St];
		return t ||= e[St] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function kt(e) {
		e[Ct] = !0;
	}
	var At = /* @__PURE__ */ new Set(), jt = {};
	function Mt(e, t) {
		Nt(e, t), Nt(e + "Capture", t);
	}
	function Nt(e, t) {
		for (jt[e] = t, e = 0; e < t.length; e++) At.add(t[e]);
	}
	var Pt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ft = {}, It = {};
	function Lt(e) {
		return Ae.call(It, e) ? !0 : Ae.call(Ft, e) ? !1 : Pt.test(e) ? It[e] = !0 : (Ft[e] = !0, !1);
	}
	function Rt(e, t, n) {
		if (Lt(t)) if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
					e.removeAttribute(t);
					return;
				case "boolean":
					var r = t.toLowerCase().slice(0, 5);
					if (r !== "data-" && r !== "aria-") {
						e.removeAttribute(t);
						return;
					}
			}
			e.setAttribute(t, "" + n);
		}
	}
	function zt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, "" + n);
		}
	}
	function Bt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, "" + r);
		}
	}
	function Vt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Ht(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Ut(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Wt(e) {
		if (!e._valueTracker) {
			var t = Ht(e) ? "checked" : "value";
			e._valueTracker = Ut(e, t, "" + e[t]);
		}
	}
	function Gt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Ht(e) ? e.checked ? "true" : "false" : e.value), e = r, e === n ? !1 : (t.setValue(e), !0);
	}
	function Kt(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var qt = /[\n"\\]/g;
	function Jt(e) {
		return e.replace(qt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Yt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Vt(t)) : e.value !== "" + Vt(t) && (e.value = "" + Vt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Zt(e, o, Vt(n)) : Zt(e, o, Vt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Vt(s) : e.removeAttribute("name");
	}
	function Xt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Wt(e);
				return;
			}
			n = n == null ? "" : "" + Vt(n), t = t == null ? n : "" + Vt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Wt(e);
	}
	function Zt(e, t, n) {
		t === "number" && Kt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Qt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Vt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function $t(e, t, n) {
		if (t != null && (t = "" + Vt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Vt(n);
	}
	function en(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (le(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Vt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Wt(e);
	}
	function tn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var nn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function rn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || nn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function an(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && rn(e, a, r);
		} else for (var o in t) t.hasOwnProperty(o) && rn(e, o, t[o]);
	}
	function on(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var sn = new Map([
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
	]), cn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function ln(e) {
		return cn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function un() {}
	var dn = null;
	function fn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var pn = null, mn = null;
	function hn(e) {
		var t = Et(e);
		if (t && (e = t.stateNode)) {
			var n = e[_t] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Yt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Jt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[_t] || null;
								if (!a) throw Error(i(90));
								Yt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Gt(r);
					}
					break a;
				case "textarea":
					$t(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Qt(e, !!n.multiple, t, !1);
			}
		}
	}
	var gn = !1;
	function _n(e, t, n) {
		if (gn) return e(t, n);
		gn = !0;
		try {
			return e(t);
		} finally {
			if (gn = !1, (pn !== null || mn !== null) && (Cu(), pn && (t = pn, e = mn, mn = pn = null, hn(t), e))) for (t = 0; t < e.length; t++) hn(e[t]);
		}
	}
	function vn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[_t] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
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
				(r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var yn = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), bn = !1;
	if (yn) try {
		var xn = {};
		Object.defineProperty(xn, "passive", { get: function() {
			bn = !0;
		} }), window.addEventListener("test", xn, xn), window.removeEventListener("test", xn, xn);
	} catch {
		bn = !1;
	}
	var Sn = null, Cn = null, wn = null;
	function Tn() {
		if (wn) return wn;
		var e, t = Cn, n = t.length, r, i = "value" in Sn ? Sn.value : Sn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return wn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function En(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Dn() {
		return !0;
	}
	function On() {
		return !1;
	}
	function kn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Dn : On, this.isPropagationStopped = On, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Dn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Dn);
			},
			persist: function() {},
			isPersistent: Dn
		}), t;
	}
	var An = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, jn = kn(An), Mn = h({}, An, {
		view: 0,
		detail: 0
	}), k = kn(Mn), Nn, Pn, Fn, A = h({}, Mn, {
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
		getModifierState: Gn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Fn && (Fn && e.type === "mousemove" ? (Nn = e.screenX - Fn.screenX, Pn = e.screenY - Fn.screenY) : Pn = Nn = 0, Fn = e), Nn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Pn;
		}
	}), In = kn(A), j = kn(h({}, A, { dataTransfer: 0 })), Ln = kn(h({}, Mn, { relatedTarget: 0 })), Rn = kn(h({}, An, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), zn = kn(h({}, An, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Bn = kn(h({}, An, { data: 0 })), Vn = {
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
	}, Hn = {
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
	}, Un = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Wn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Un[e]) ? !!t[e] : !1;
	}
	function Gn() {
		return Wn;
	}
	var Kn = kn(h({}, Mn, {
		key: function(e) {
			if (e.key) {
				var t = Vn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = En(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Hn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Gn,
		charCode: function(e) {
			return e.type === "keypress" ? En(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? En(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), qn = kn(h({}, A, {
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
	})), Jn = kn(h({}, Mn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Gn
	})), Yn = kn(h({}, An, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Xn = kn(h({}, A, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Zn = kn(h({}, An, {
		newState: 0,
		oldState: 0
	})), Qn = [
		9,
		13,
		27,
		32
	], $n = yn && "CompositionEvent" in window, er = null;
	yn && "documentMode" in document && (er = document.documentMode);
	var tr = yn && "TextEvent" in window && !er, nr = yn && (!$n || er && 8 < er && 11 >= er), rr = " ", ir = !1;
	function ar(e, t) {
		switch (e) {
			case "keyup": return Qn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function or(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var sr = !1;
	function cr(e, t) {
		switch (e) {
			case "compositionend": return or(t);
			case "keypress": return t.which === 32 ? (ir = !0, rr) : null;
			case "textInput": return e = t.data, e === rr && ir ? null : e;
			default: return null;
		}
	}
	function lr(e, t) {
		if (sr) return e === "compositionend" || !$n && ar(e, t) ? (e = Tn(), wn = Cn = Sn = null, sr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return nr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var ur = {
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
	function dr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!ur[e.type] : t === "textarea";
	}
	function fr(e, t, n, r) {
		pn ? mn ? mn.push(r) : mn = [r] : pn = r, t = kd(t, "onChange"), 0 < t.length && (n = new jn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var pr = null, mr = null;
	function hr(e) {
		Sd(e, 0);
	}
	function gr(e) {
		if (Gt(Dt(e))) return e;
	}
	function _r(e, t) {
		if (e === "change") return t;
	}
	var vr = !1;
	if (yn) {
		var yr;
		if (yn) {
			var br = "oninput" in document;
			if (!br) {
				var xr = document.createElement("div");
				xr.setAttribute("oninput", "return;"), br = typeof xr.oninput == "function";
			}
			yr = br;
		} else yr = !1;
		vr = yr && (!document.documentMode || 9 < document.documentMode);
	}
	function Sr() {
		pr && (pr.detachEvent("onpropertychange", Cr), mr = pr = null);
	}
	function Cr(e) {
		if (e.propertyName === "value" && gr(mr)) {
			var t = [];
			fr(t, mr, e, fn(e)), _n(hr, t);
		}
	}
	function wr(e, t, n) {
		e === "focusin" ? (Sr(), pr = t, mr = n, pr.attachEvent("onpropertychange", Cr)) : e === "focusout" && Sr();
	}
	function Tr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return gr(mr);
	}
	function Er(e, t) {
		if (e === "click") return gr(t);
	}
	function Dr(e, t) {
		if (e === "input" || e === "change") return gr(t);
	}
	function Or(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var kr = typeof Object.is == "function" ? Object.is : Or;
	function Ar(e, t) {
		if (kr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ae.call(t, i) || !kr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function jr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Mr(e, t) {
		var n = jr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = jr(n);
		}
	}
	function Nr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Nr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Pr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Kt(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Kt(e.document);
		}
		return t;
	}
	function Fr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Ir = yn && "documentMode" in document && 11 >= document.documentMode, Lr = null, Rr = null, zr = null, Br = !1;
	function Vr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Br || Lr == null || Lr !== Kt(r) || (r = Lr, "selectionStart" in r && Fr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), zr && Ar(zr, r) || (zr = r, r = kd(Rr, "onSelect"), 0 < r.length && (t = new jn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Lr)));
	}
	function Hr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Ur = {
		animationend: Hr("Animation", "AnimationEnd"),
		animationiteration: Hr("Animation", "AnimationIteration"),
		animationstart: Hr("Animation", "AnimationStart"),
		transitionrun: Hr("Transition", "TransitionRun"),
		transitionstart: Hr("Transition", "TransitionStart"),
		transitioncancel: Hr("Transition", "TransitionCancel"),
		transitionend: Hr("Transition", "TransitionEnd")
	}, Wr = {}, Gr = {};
	yn && (Gr = document.createElement("div").style, "AnimationEvent" in window || (delete Ur.animationend.animation, delete Ur.animationiteration.animation, delete Ur.animationstart.animation), "TransitionEvent" in window || delete Ur.transitionend.transition);
	function Kr(e) {
		if (Wr[e]) return Wr[e];
		if (!Ur[e]) return e;
		var t = Ur[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Gr) return Wr[e] = t[n];
		return e;
	}
	var qr = Kr("animationend"), Jr = Kr("animationiteration"), Yr = Kr("animationstart"), Xr = Kr("transitionrun"), Zr = Kr("transitionstart"), Qr = Kr("transitioncancel"), $r = Kr("transitionend"), ei = /* @__PURE__ */ new Map(), ti = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	ti.push("scrollEnd");
	function ni(e, t) {
		ei.set(e, t), Mt(t, [e]);
	}
	var ri = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, ii = [], ai = 0, oi = 0;
	function si() {
		for (var e = ai, t = oi = ai = 0; t < e;) {
			var n = ii[t];
			ii[t++] = null;
			var r = ii[t];
			ii[t++] = null;
			var i = ii[t];
			ii[t++] = null;
			var a = ii[t];
			if (ii[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && di(n, i, a);
		}
	}
	function ci(e, t, n, r) {
		ii[ai++] = e, ii[ai++] = t, ii[ai++] = n, ii[ai++] = r, oi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function li(e, t, n, r) {
		return ci(e, t, n, r), fi(e);
	}
	function ui(e, t) {
		return ci(e, null, null, t), fi(e);
	}
	function di(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - qe(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function fi(e) {
		if (50 < mu) throw mu = 0, hu = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var pi = {};
	function mi(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function M(e, t, n, r) {
		return new mi(e, t, n, r);
	}
	function hi(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function gi(e, t) {
		var n = e.alternate;
		return n === null ? (n = M(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function _i(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function vi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof e == "function") hi(e) && (s = 1);
		else if (typeof e == "string") s = Kf(e, n, he.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case ae: return e = M(31, n, t, a), e.elementType = ae, e.lanes = o, e;
			case y: return yi(n.children, a, o, t);
			case b:
				s = 8, a |= 24;
				break;
			case x: return e = M(12, n, t, a | 2), e.elementType = x, e.lanes = o, e;
			case ne: return e = M(13, n, t, a), e.elementType = ne, e.lanes = o, e;
			case C: return e = M(19, n, t, a), e.elementType = C, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case te:
						s = 10;
						break a;
					case ee:
						s = 9;
						break a;
					case S:
						s = 11;
						break a;
					case re:
						s = 14;
						break a;
					case ie:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = M(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function yi(e, t, n, r) {
		return e = M(7, e, r, t), e.lanes = n, e;
	}
	function bi(e, t, n) {
		return e = M(6, e, null, t), e.lanes = n, e;
	}
	function xi(e) {
		var t = M(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Si(e, t, n) {
		return t = M(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Ci = /* @__PURE__ */ new WeakMap();
	function wi(e, t) {
		if (typeof e == "object" && e) {
			var n = Ci.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: ke(t)
			}, Ci.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: ke(t)
		};
	}
	var Ti = [], Ei = 0, Di = null, Oi = 0, ki = [], Ai = 0, ji = null, Mi = 1, Ni = "";
	function Pi(e, t) {
		Ti[Ei++] = Oi, Ti[Ei++] = Di, Di = e, Oi = t;
	}
	function Fi(e, t, n) {
		ki[Ai++] = Mi, ki[Ai++] = Ni, ki[Ai++] = ji, ji = e;
		var r = Mi;
		e = Ni;
		var i = 32 - qe(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - qe(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Mi = 1 << 32 - qe(t) + i | n << i | r, Ni = a + e;
		} else Mi = 1 << a | n << i | r, Ni = e;
	}
	function Ii(e) {
		e.return !== null && (Pi(e, 1), Fi(e, 1, 0));
	}
	function Li(e) {
		for (; e === Di;) Di = Ti[--Ei], Ti[Ei] = null, Oi = Ti[--Ei], Ti[Ei] = null;
		for (; e === ji;) ji = ki[--Ai], ki[Ai] = null, Ni = ki[--Ai], ki[Ai] = null, Mi = ki[--Ai], ki[Ai] = null;
	}
	function Ri(e, t) {
		ki[Ai++] = Mi, ki[Ai++] = Ni, ki[Ai++] = ji, Mi = t.id, Ni = t.overflow, ji = e;
	}
	var zi = null, N = null, P = !1, Bi = null, Vi = !1, Hi = Error(i(519));
	function Ui(e) {
		throw Yi(wi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Hi;
	}
	function Wi(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[gt] = e, t[_t] = r, n) {
			case "dialog":
				X("cancel", t), X("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				X("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < bd.length; n++) X(bd[n], t);
				break;
			case "source":
				X("error", t);
				break;
			case "img":
			case "image":
			case "link":
				X("error", t), X("load", t);
				break;
			case "details":
				X("toggle", t);
				break;
			case "input":
				X("invalid", t), Xt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				X("invalid", t);
				break;
			case "textarea": X("invalid", t), en(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Fd(t.textContent, n) ? (r.popover != null && (X("beforetoggle", t), X("toggle", t)), r.onScroll != null && X("scroll", t), r.onScrollEnd != null && X("scrollend", t), r.onClick != null && (t.onclick = un), t = !0) : t = !1, t || Ui(e, !0);
	}
	function Gi(e) {
		for (zi = e.return; zi;) switch (zi.tag) {
			case 5:
			case 31:
			case 13:
				Vi = !1;
				return;
			case 27:
			case 3:
				Vi = !0;
				return;
			default: zi = zi.return;
		}
	}
	function Ki(e) {
		if (e !== zi) return !1;
		if (!P) return Gi(e), P = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Kd(e.type, e.memoizedProps)), n = !n), n && N && Ui(e), Gi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			N = pf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			N = pf(e);
		} else t === 27 ? (t = N, ef(e.type) ? (e = ff, ff = null, N = e) : N = t) : N = zi ? df(e.stateNode.nextSibling) : null;
		return !0;
	}
	function qi() {
		N = zi = null, P = !1;
	}
	function Ji() {
		var e = Bi;
		return e !== null && (J === null ? J = e : J.push.apply(J, e), Bi = null), e;
	}
	function Yi(e) {
		Bi === null ? Bi = [e] : Bi.push(e);
	}
	var Xi = pe(null), Zi = null, Qi = null;
	function $i(e, t, n) {
		O(Xi, t._currentValue), t._currentValue = n;
	}
	function ea(e) {
		e._currentValue = Xi.current, me(Xi);
	}
	function ta(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function na(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), ta(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), ta(s, n, e), s = null;
			} else s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function ra(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					kr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === ve.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [tp] : e.push(tp));
			}
			a = a.return;
		}
		e !== null && na(t, e, n, r), t.flags |= 262144;
	}
	function ia(e) {
		for (e = e.firstContext; e !== null;) {
			if (!kr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function aa(e) {
		Zi = e, Qi = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function F(e) {
		return sa(Zi, e);
	}
	function oa(e, t) {
		return Zi === null && aa(e), sa(e, t);
	}
	function sa(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Qi === null) {
			if (e === null) throw Error(i(308));
			Qi = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Qi = Qi.next = t;
		return n;
	}
	var ca = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, la = t.unstable_scheduleCallback, ua = t.unstable_NormalPriority, da = {
		$$typeof: te,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function fa() {
		return {
			controller: new ca(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function pa(e) {
		e.refCount--, e.refCount === 0 && la(ua, function() {
			e.controller.abort();
		});
	}
	var ma = null, ha = 0, ga = 0, _a = null;
	function va(e, t) {
		if (ma === null) {
			var n = ma = [];
			ha = 0, ga = md(), _a = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return ha++, t.then(ya, ya), t;
	}
	function ya() {
		if (--ha === 0 && ma !== null) {
			_a !== null && (_a.status = "fulfilled");
			var e = ma;
			ma = null, ga = 0, _a = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function ba(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var xa = E.S;
	E.S = function(e, t) {
		ru = Fe(), typeof t == "object" && t && typeof t.then == "function" && va(e, t), xa !== null && xa(e, t);
	};
	var Sa = pe(null);
	function Ca() {
		var e = Sa.current;
		return e === null ? H.pooledCache : e;
	}
	function wa(e, t) {
		t === null ? O(Sa, Sa.current) : O(Sa, t.pool);
	}
	function Ta() {
		var e = Ca();
		return e === null ? null : {
			parent: da._currentValue,
			pool: e
		};
	}
	var Ea = Error(i(460)), Da = Error(i(474)), Oa = Error(i(542)), ka = { then: function() {} };
	function Aa(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function ja(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(un, un), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Fa(e), e;
			default:
				if (typeof t.status == "string") t.then(un, un);
				else {
					if (e = H, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, Fa(e), e;
				}
				throw Na = t, Ea;
		}
	}
	function Ma(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Na = e, Ea) : e;
		}
	}
	var Na = null;
	function Pa() {
		if (Na === null) throw Error(i(459));
		var e = Na;
		return Na = null, e;
	}
	function Fa(e) {
		if (e === Ea || e === Oa) throw Error(i(483));
	}
	var Ia = null, La = 0;
	function Ra(e) {
		var t = La;
		return La += 1, Ia === null && (Ia = []), ja(Ia, e, t);
	}
	function za(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Ba(e, t) {
		throw t.$$typeof === g ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function Va(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = gi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = bi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === ie && Ma(i) === t.type) ? (t = a(t, n.props), za(t, n), t.return = e, t) : (t = vi(n.type, n.key, n.props, null, e.mode, r), za(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Si(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = yi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = bi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = vi(t.type, t.key, t.props, null, e.mode, n), za(n, t), n.return = e, n;
					case v: return t = Si(t, e.mode, n), t.return = e, t;
					case ie: return t = Ma(t), f(e, t, n);
				}
				if (le(t) || T(t)) return t = yi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Ra(t), n);
				if (t.$$typeof === te) return f(e, oa(e, t), n);
				Ba(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case _: return n.key === i ? l(e, t, n, r) : null;
					case v: return n.key === i ? u(e, t, n, r) : null;
					case ie: return n = Ma(n), p(e, t, n, r);
				}
				if (le(n) || T(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Ra(n), r);
				if (n.$$typeof === te) return p(e, t, oa(e, n), r);
				Ba(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case ie: return r = Ma(r), m(e, t, n, r, i);
				}
				if (le(r) || T(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Ra(r), i);
				if (r.$$typeof === te) return m(e, t, n, oa(t, r), i);
				Ba(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), P && Pi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return P && Pi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), P && Pi(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), P && Pi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return P && Pi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), P && Pi(a, g), u;
		}
		function b(e, r, o, c) {
			if (typeof o == "object" && o && o.type === y && o.key === null && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case _:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === y) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === ie && Ma(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), za(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								} else t(e, r);
								r = r.sibling;
							}
							o.type === y ? (c = yi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = vi(o.type, o.key, o.props, null, e.mode, c), za(c, o), c.return = e, e = c);
						}
						return s(e);
					case v:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
									n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
									break a;
								} else {
									n(e, r);
									break;
								}
								else t(e, r);
								r = r.sibling;
							}
							c = Si(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case ie: return o = Ma(o), b(e, r, o, c);
				}
				if (le(o)) return h(e, r, o, c);
				if (T(o)) {
					if (l = T(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Ra(o), c);
				if (o.$$typeof === te) return b(e, r, oa(e, o), c);
				Ba(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = bi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				La = 0;
				var i = b(e, t, n, r);
				return Ia = null, i;
			} catch (t) {
				if (t === Ea || t === Oa) throw t;
				var a = M(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Ha = Va(!0), Ua = Va(!1), Wa = !1;
	function Ga(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function Ka(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function qa(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Ja(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, V & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = fi(e), di(e, null, n), t;
		}
		return ci(e, r, t, n), fi(e);
	}
	function Ya(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, lt(e, n);
		}
	}
	function Xa(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
			return;
		}
		e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var Za = !1;
	function Qa() {
		if (Za) {
			var e = _a;
			if (e !== null) throw e;
		}
	}
	function $a(e, t, n, r) {
		Za = !1;
		var i = e.updateQueue;
		Wa = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (W & f) === f : (r & f) === f) {
					f !== 0 && f === ga && (Za = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, g = s;
						f = t;
						var _ = n;
						switch (g.tag) {
							case 1:
								if (m = g.payload, typeof m == "function") {
									d = m.call(_, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = g.payload, f = typeof m == "function" ? m.call(_, d, f) : m, f == null) break a;
								d = h({}, d, f);
								break a;
							case 2: Wa = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), q |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function eo(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function to(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) eo(n[e], t);
	}
	var no = pe(null), ro = pe(0);
	function io(e, t) {
		e = Jl, O(ro, e), O(no, t), Jl = e | t.baseLanes;
	}
	function ao() {
		O(ro, Jl), O(no, no.current);
	}
	function oo() {
		Jl = ro.current, me(no), me(ro);
	}
	var so = pe(null), co = null;
	function lo(e) {
		var t = e.alternate;
		O(ho, ho.current & 1), O(so, e), co === null && (t === null || no.current !== null || t.memoizedState !== null) && (co = e);
	}
	function uo(e) {
		O(ho, ho.current), O(so, e), co === null && (co = e);
	}
	function fo(e) {
		e.tag === 22 ? (O(ho, ho.current), O(so, e), co === null && (co = e)) : po(e);
	}
	function po() {
		O(ho, ho.current), O(so, so.current);
	}
	function mo(e) {
		me(so), co === e && (co = null), me(ho);
	}
	var ho = pe(0);
	function go(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || cf(n) || lf(n))) return t;
			} else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var _o = 0, I = null, L = null, vo = null, yo = !1, bo = !1, xo = !1, So = 0, Co = 0, wo = null, To = 0;
	function Eo() {
		throw Error(i(321));
	}
	function Do(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!kr(e[n], t[n])) return !1;
		return !0;
	}
	function Oo(e, t, n, r, i, a) {
		return _o = a, I = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, E.H = e === null || e.memoizedState === null ? Ks : qs, xo = !1, a = n(r, i), xo = !1, bo && (a = Ao(t, n, r, i)), ko(e), a;
	}
	function ko(e) {
		E.H = Gs;
		var t = L !== null && L.next !== null;
		if (_o = 0, vo = L = I = null, yo = !1, Co = 0, wo = null, t) throw Error(i(300));
		e === null || uc || (e = e.dependencies, e !== null && ia(e) && (uc = !0));
	}
	function Ao(e, t, n, r) {
		I = e;
		var a = 0;
		do {
			if (bo && (wo = null), Co = 0, bo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, vo = L = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			E.H = Js, o = t(n, r);
		} while (bo);
		return o;
	}
	function jo() {
		var e = E.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Ro(t) : t, e = e.useState()[0], (L === null ? null : L.memoizedState) !== e && (I.flags |= 1024), t;
	}
	function Mo() {
		var e = So !== 0;
		return So = 0, e;
	}
	function No(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Po(e) {
		if (yo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			yo = !1;
		}
		_o = 0, vo = L = I = null, bo = !1, Co = So = 0, wo = null;
	}
	function Fo() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return vo === null ? I.memoizedState = vo = e : vo = vo.next = e, vo;
	}
	function Io() {
		if (L === null) {
			var e = I.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = L.next;
		var t = vo === null ? I.memoizedState : vo.next;
		if (t !== null) vo = t, L = e;
		else {
			if (e === null) throw I.alternate === null ? Error(i(467)) : Error(i(310));
			L = e, e = {
				memoizedState: L.memoizedState,
				baseState: L.baseState,
				baseQueue: L.baseQueue,
				queue: L.queue,
				next: null
			}, vo === null ? I.memoizedState = vo = e : vo = vo.next = e;
		}
		return vo;
	}
	function Lo() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Ro(e) {
		var t = Co;
		return Co += 1, wo === null && (wo = []), e = ja(wo, e, t), t = I, (vo === null ? t.memoizedState : vo.next) === null && (t = t.alternate, E.H = t === null || t.memoizedState === null ? Ks : qs), e;
	}
	function zo(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Ro(e);
			if (e.$$typeof === te) return F(e);
		}
		throw Error(i(438, String(e)));
	}
	function Bo(e) {
		var t = null, n = I.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = I.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = Lo(), I.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = w;
		return t.index++, n;
	}
	function Vo(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Ho(e) {
		return Uo(Io(), L, e);
	}
	function Uo(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (_o & f) === f : (W & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === ga && (d = !0);
					else if ((_o & p) === p) {
						u = u.next, p === ga && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, I.lanes |= p, q |= p;
					f = u.action, xo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, I.lanes |= f, q |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !kr(o, e.memoizedState) && (uc = !0, d && (n = _a, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Wo(e) {
		var t = Io(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			kr(o, t.memoizedState) || (uc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Go(e, t, n) {
		var r = I, a = Io(), o = P;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !kr((L || a).memoizedState, n);
		if (s && (a.memoizedState = n, uc = !0), a = a.queue, _s(Jo.bind(null, r, a, e), [e]), a.getSnapshot !== t || s || vo !== null && vo.memoizedState.tag & 1) {
			if (r.flags |= 2048, fs(9, { destroy: void 0 }, qo.bind(null, r, a, n, t), null), H === null) throw Error(i(349));
			o || _o & 127 || Ko(r, t, n);
		}
		return n;
	}
	function Ko(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = I.updateQueue, t === null ? (t = Lo(), I.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function qo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Yo(t) && Xo(e);
	}
	function Jo(e, t, n) {
		return n(function() {
			Yo(t) && Xo(e);
		});
	}
	function Yo(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !kr(e, n);
		} catch {
			return !0;
		}
	}
	function Xo(e) {
		var t = ui(e, 2);
		t !== null && vu(t, e, 2);
	}
	function Zo(e) {
		var t = Fo();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), xo) {
				Ke(!0);
				try {
					n();
				} finally {
					Ke(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Vo,
			lastRenderedState: e
		}, t;
	}
	function Qo(e, t, n, r) {
		return e.baseState = n, Uo(e, L, typeof r == "function" ? r : Vo);
	}
	function $o(e, t, n, r, a) {
		if (Hs(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			E.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, es(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function es(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = E.T, o = {};
			E.T = o;
			try {
				var s = n(i, r), c = E.S;
				c !== null && c(o, s), ts(e, t, s);
			} catch (n) {
				rs(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), E.T = a;
			}
		} else try {
			a = n(i, r), ts(e, t, a);
		} catch (n) {
			rs(e, t, n);
		}
	}
	function ts(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			ns(e, t, n);
		}, function(n) {
			return rs(e, t, n);
		}) : ns(e, t, n);
	}
	function ns(e, t, n) {
		t.status = "fulfilled", t.value = n, is(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, es(e, n)));
	}
	function rs(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, is(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function is(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function as(e, t) {
		return t;
	}
	function ss(e, t) {
		if (P) {
			var n = H.formState;
			if (n !== null) {
				a: {
					var r = I;
					if (P) {
						if (N) {
							b: {
								for (var i = N, a = Vi; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = df(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								N = df(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Ui(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = Fo(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: as,
			lastRenderedState: t
		}, n.queue = r, n = zs.bind(null, I, r), r.dispatch = n, r = Zo(!1), a = Vs.bind(null, I, !1, r.queue), r = Fo(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = $o.bind(null, I, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function cs(e) {
		return ls(Io(), L, e);
	}
	function ls(e, t, n) {
		if (t = Uo(e, t, as)[0], e = Ho(Vo)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Ro(t);
		} catch (e) {
			throw e === Ea ? Oa : e;
		}
		else r = t;
		t = Io();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (I.flags |= 2048, fs(9, { destroy: void 0 }, us.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function us(e, t) {
		e.action = t;
	}
	function ds(e) {
		var t = Io(), n = L;
		if (n !== null) return ls(t, n, e);
		Io(), t = t.memoizedState, n = Io();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function fs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = I.updateQueue, t === null && (t = Lo(), I.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function ps() {
		return Io().memoizedState;
	}
	function ms(e, t, n, r) {
		var i = Fo();
		I.flags |= e, i.memoizedState = fs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function hs(e, t, n, r) {
		var i = Io();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		L !== null && r !== null && Do(r, L.memoizedState.deps) ? i.memoizedState = fs(t, a, n, r) : (I.flags |= e, i.memoizedState = fs(1 | t, a, n, r));
	}
	function gs(e, t) {
		ms(8390656, 8, e, t);
	}
	function _s(e, t) {
		hs(2048, 8, e, t);
	}
	function vs(e) {
		I.flags |= 4;
		var t = I.updateQueue;
		if (t === null) t = Lo(), I.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function ys(e) {
		var t = Io().memoizedState;
		return vs({
			ref: t,
			nextImpl: e
		}), function() {
			if (V & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function bs(e, t) {
		return hs(4, 2, e, t);
	}
	function xs(e, t) {
		return hs(4, 4, e, t);
	}
	function Ss(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Cs(e, t, n) {
		n = n == null ? null : n.concat([e]), hs(4, 4, Ss.bind(null, t, e), n);
	}
	function ws() {}
	function Ts(e, t) {
		var n = Io();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Do(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Es(e, t) {
		var n = Io();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Do(t, r[1])) return r[0];
		if (r = e(), xo) {
			Ke(!0);
			try {
				e();
			} finally {
				Ke(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Ds(e, t, n) {
		return n === void 0 || _o & 1073741824 && !(W & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = _u(), I.lanes |= e, q |= e, n);
	}
	function Os(e, t, n, r) {
		return kr(n, t) ? n : no.current === null ? !(_o & 42) || _o & 1073741824 && !(W & 261930) ? (uc = !0, e.memoizedState = n) : (e = _u(), I.lanes |= e, q |= e, t) : (e = Ds(e, n, r), kr(e, t) || (uc = !0), e);
	}
	function ks(e, t, n, r, i) {
		var a = D.p;
		D.p = a !== 0 && 8 > a ? a : 8;
		var o = E.T, s = {};
		E.T = s, Vs(e, !1, t, n);
		try {
			var c = i(), l = E.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Bs(e, t, ba(c, r), gu(e)) : Bs(e, t, r, gu(e));
		} catch (n) {
			Bs(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, gu());
		} finally {
			D.p = a, o !== null && s.types !== null && (o.types = s.types), E.T = o;
		}
	}
	function As() {}
	function js(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Ms(e).queue;
		ks(e, a, t, ue, n === null ? As : function() {
			return Ns(e), n(r);
		});
	}
	function Ms(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: ue,
			baseState: ue,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Vo,
				lastRenderedState: ue
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Vo,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Ns(e) {
		var t = Ms(e);
		t.next === null && (t = e.alternate.memoizedState), Bs(e, t.next.queue, {}, gu());
	}
	function Ps() {
		return F(tp);
	}
	function Fs() {
		return Io().memoizedState;
	}
	function Is() {
		return Io().memoizedState;
	}
	function Ls(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = gu();
					e = qa(n);
					var r = Ja(t, e, n);
					r !== null && (vu(r, t, n), Ya(r, t, n)), t = { cache: fa() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function Rs(e, t, n) {
		var r = gu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Hs(e) ? Us(t, n) : (n = li(e, t, n, r), n !== null && (vu(n, e, r), Ws(n, t, r)));
	}
	function zs(e, t, n) {
		Bs(e, t, n, gu());
	}
	function Bs(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Hs(e)) Us(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, kr(s, o)) return ci(e, t, i, 0), H === null && si(), !1;
			} catch {}
			if (n = li(e, t, i, r), n !== null) return vu(n, e, r), Ws(n, t, r), !0;
		}
		return !1;
	}
	function Vs(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: md(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Hs(e)) {
			if (t) throw Error(i(479));
		} else t = li(e, n, r, 2), t !== null && vu(t, e, 2);
	}
	function Hs(e) {
		var t = e.alternate;
		return e === I || t !== null && t === I;
	}
	function Us(e, t) {
		bo = yo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Ws(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, lt(e, n);
		}
	}
	var Gs = {
		readContext: F,
		use: zo,
		useCallback: Eo,
		useContext: Eo,
		useEffect: Eo,
		useImperativeHandle: Eo,
		useLayoutEffect: Eo,
		useInsertionEffect: Eo,
		useMemo: Eo,
		useReducer: Eo,
		useRef: Eo,
		useState: Eo,
		useDebugValue: Eo,
		useDeferredValue: Eo,
		useTransition: Eo,
		useSyncExternalStore: Eo,
		useId: Eo,
		useHostTransitionStatus: Eo,
		useFormState: Eo,
		useActionState: Eo,
		useOptimistic: Eo,
		useMemoCache: Eo,
		useCacheRefresh: Eo
	};
	Gs.useEffectEvent = Eo;
	var Ks = {
		readContext: F,
		use: zo,
		useCallback: function(e, t) {
			return Fo().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: F,
		useEffect: gs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), ms(4194308, 4, Ss.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return ms(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			ms(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = Fo();
			t = t === void 0 ? null : t;
			var r = e();
			if (xo) {
				Ke(!0);
				try {
					e();
				} finally {
					Ke(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = Fo();
			if (n !== void 0) {
				var i = n(t);
				if (xo) {
					Ke(!0);
					try {
						n(t);
					} finally {
						Ke(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Rs.bind(null, I, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Fo();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Zo(e);
			var t = e.queue, n = zs.bind(null, I, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: ws,
		useDeferredValue: function(e, t) {
			return Ds(Fo(), e, t);
		},
		useTransition: function() {
			var e = Zo(!1);
			return e = ks.bind(null, I, e.queue, !0, !1), Fo().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = I, a = Fo();
			if (P) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), H === null) throw Error(i(349));
				W & 127 || Ko(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, gs(Jo.bind(null, r, o, e), [e]), r.flags |= 2048, fs(9, { destroy: void 0 }, qo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = Fo(), t = H.identifierPrefix;
			if (P) {
				var n = Ni, r = Mi;
				n = (r & ~(1 << 32 - qe(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = So++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = To++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Ps,
		useFormState: ss,
		useActionState: ss,
		useOptimistic: function(e) {
			var t = Fo();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Vs.bind(null, I, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Bo,
		useCacheRefresh: function() {
			return Fo().memoizedState = Ls.bind(null, I);
		},
		useEffectEvent: function(e) {
			var t = Fo(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (V & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, qs = {
		readContext: F,
		use: zo,
		useCallback: Ts,
		useContext: F,
		useEffect: _s,
		useImperativeHandle: Cs,
		useInsertionEffect: bs,
		useLayoutEffect: xs,
		useMemo: Es,
		useReducer: Ho,
		useRef: ps,
		useState: function() {
			return Ho(Vo);
		},
		useDebugValue: ws,
		useDeferredValue: function(e, t) {
			return Os(Io(), L.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Ho(Vo)[0], t = Io().memoizedState;
			return [typeof e == "boolean" ? e : Ro(e), t];
		},
		useSyncExternalStore: Go,
		useId: Fs,
		useHostTransitionStatus: Ps,
		useFormState: cs,
		useActionState: cs,
		useOptimistic: function(e, t) {
			return Qo(Io(), L, e, t);
		},
		useMemoCache: Bo,
		useCacheRefresh: Is
	};
	qs.useEffectEvent = ys;
	var Js = {
		readContext: F,
		use: zo,
		useCallback: Ts,
		useContext: F,
		useEffect: _s,
		useImperativeHandle: Cs,
		useInsertionEffect: bs,
		useLayoutEffect: xs,
		useMemo: Es,
		useReducer: Wo,
		useRef: ps,
		useState: function() {
			return Wo(Vo);
		},
		useDebugValue: ws,
		useDeferredValue: function(e, t) {
			var n = Io();
			return L === null ? Ds(n, e, t) : Os(n, L.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Wo(Vo)[0], t = Io().memoizedState;
			return [typeof e == "boolean" ? e : Ro(e), t];
		},
		useSyncExternalStore: Go,
		useId: Fs,
		useHostTransitionStatus: Ps,
		useFormState: ds,
		useActionState: ds,
		useOptimistic: function(e, t) {
			var n = Io();
			return L === null ? (n.baseState = e, [e, n.queue.dispatch]) : Qo(n, L, e, t);
		},
		useMemoCache: Bo,
		useCacheRefresh: Is
	};
	Js.useEffectEvent = ys;
	function Ys(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Xs = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = gu(), i = qa(r);
			i.payload = t, n != null && (i.callback = n), t = Ja(e, i, r), t !== null && (vu(t, e, r), Ya(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = gu(), i = qa(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ja(e, i, r), t !== null && (vu(t, e, r), Ya(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = gu(), r = qa(n);
			r.tag = 2, t != null && (r.callback = t), t = Ja(e, r, n), t !== null && (vu(t, e, n), Ya(t, e, n));
		}
	};
	function Zs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Ar(n, r) || !Ar(i, a) : !0;
	}
	function Qs(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Xs.enqueueReplaceState(t, t.state, null);
	}
	function $s(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function ec(e) {
		ri(e);
	}
	function tc(e) {
		console.error(e);
	}
	function nc(e) {
		ri(e);
	}
	function rc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function ic(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function ac(e, t, n) {
		return n = qa(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			rc(e, t);
		}, n;
	}
	function oc(e) {
		return e = qa(e), e.tag = 3, e;
	}
	function sc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				ic(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			ic(t, n, r), typeof i != "function" && (ou === null ? ou = new Set([this]) : ou.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function cc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ra(t, n, a, !0), n = so.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return co === null ? Au() : n.alternate === null && Yl === 0 && (Yl = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === ka ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = new Set([r]) : t.add(r), Ju(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === ka ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = new Set([r]) : n.add(r)), Ju(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return Ju(e, r, a), Au(), !1;
		}
		if (P) return t = so.current, t === null ? (r !== Hi && (t = Error(i(423), { cause: r }), Yi(wi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = wi(r, n), a = ac(e.stateNode, r, a), Xa(e, a), Yl !== 4 && (Yl = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== Hi && (e = Error(i(422), { cause: r }), Yi(wi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = wi(o, n), eu === null ? eu = [o] : eu.push(o), Yl !== 4 && (Yl = 2), t === null) return !0;
		r = wi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = ac(n.stateNode, r, e), Xa(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (ou === null || !ou.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = oc(a), sc(a, e, n, r), Xa(n, a), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var lc = Error(i(461)), uc = !1;
	function dc(e, t, n, r) {
		t.child = e === null ? Ua(t, null, n, r) : Ha(t, e.child, n, r);
	}
	function fc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return aa(t), r = Oo(e, t, n, o, a, i), s = Mo(), e !== null && !uc ? (No(e, t, i), Pc(e, t, i)) : (P && s && Ii(t), t.flags |= 1, dc(e, t, r, i), t.child);
	}
	function pc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !hi(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, mc(e, t, a, r, i)) : (e = vi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !Fc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Ar : n, n(o, r) && e.ref === t.ref) return Pc(e, t, i);
		}
		return t.flags |= 1, e = gi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function mc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Ar(a, r) && e.ref === t.ref) if (uc = !1, t.pendingProps = r = a, Fc(e, i)) e.flags & 131072 && (uc = !0);
			else return t.lanes = e.lanes, Pc(e, t, i);
		}
		return Sc(e, t, n, r, i);
	}
	function hc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return _c(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && wa(t, a === null ? null : a.cachePool), a === null ? ao() : io(t, a), fo(t);
			else return r = t.lanes = 536870912, _c(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && wa(t, null), ao(), po(t)) : (wa(t, a.cachePool), io(t, a), po(t), t.memoizedState = null);
		return dc(e, t, i, n), t.child;
	}
	function gc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function _c(e, t, n, r, i) {
		var a = Ca();
		return a = a === null ? null : {
			parent: da._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && wa(t, null), ao(), fo(t), e !== null && ra(e, t, r, !0), t.childLanes = i, null;
	}
	function vc(e, t) {
		return t = kc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function yc(e, t, n) {
		return Ha(t, e.child, null, n), e = vc(t, t.pendingProps), e.flags |= 2, mo(t), t.memoizedState = null, e;
	}
	function bc(e, t, n) {
		var r = t.pendingProps, a = (t.flags & 128) != 0;
		if (t.flags &= -129, e === null) {
			if (P) {
				if (r.mode === "hidden") return e = vc(t, r), t.lanes = 536870912, gc(null, e);
				if (uo(t), (e = N) ? (e = sf(e, Vi), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: ji === null ? null : {
						id: Mi,
						overflow: Ni
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = xi(e), n.return = t, t.child = n, zi = t, N = null)) : e = null, e === null) throw Ui(t);
				return t.lanes = 536870912, null;
			}
			return vc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (uo(t), a) if (t.flags & 256) t.flags &= -257, t = yc(e, t, n);
			else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
			else throw Error(i(558));
			else if (uc || ra(e, t, n, !1), a = (n & e.childLanes) !== 0, uc || a) {
				if (r = H, r !== null && (s = ut(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, ui(e, s), vu(r, e, s), lc;
				Au(), t = yc(e, t, n);
			} else e = o.treeContext, N = df(s.nextSibling), zi = t, P = !0, Bi = null, Vi = !1, e !== null && Ri(t, e), t = vc(t, r), t.flags |= 4096;
			return t;
		}
		return e = gi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function xc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Sc(e, t, n, r, i) {
		return aa(t), n = Oo(e, t, n, r, void 0, i), r = Mo(), e !== null && !uc ? (No(e, t, i), Pc(e, t, i)) : (P && r && Ii(t), t.flags |= 1, dc(e, t, n, i), t.child);
	}
	function Cc(e, t, n, r, i, a) {
		return aa(t), t.updateQueue = null, n = Ao(t, r, n, i), ko(e), r = Mo(), e !== null && !uc ? (No(e, t, a), Pc(e, t, a)) : (P && r && Ii(t), t.flags |= 1, dc(e, t, n, a), t.child);
	}
	function wc(e, t, n, r, i) {
		if (aa(t), t.stateNode === null) {
			var a = pi, o = n.contextType;
			typeof o == "object" && o && (a = F(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Xs, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Ga(t), o = n.contextType, a.context = typeof o == "object" && o ? F(o) : pi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Ys(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Xs.enqueueReplaceState(a, a.state, null), $a(t, r, a, i), Qa(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = $s(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = pi, typeof u == "object" && u && (o = F(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Qs(t, a, r, o), Wa = !1;
			var f = t.memoizedState;
			a.state = f, $a(t, r, a, i), Qa(), l = t.memoizedState, s || f !== l || Wa ? (typeof d == "function" && (Ys(t, n, d, r), l = t.memoizedState), (c = Wa || Zs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Ka(e, t), o = t.memoizedProps, u = $s(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = pi, typeof l == "object" && l && (c = F(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Qs(t, a, r, c), Wa = !1, f = t.memoizedState, a.state = f, $a(t, r, a, i), Qa();
			var p = t.memoizedState;
			o !== d || f !== p || Wa || e !== null && e.dependencies !== null && ia(e.dependencies) ? (typeof s == "function" && (Ys(t, n, s, r), p = t.memoizedState), (u = Wa || Zs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ia(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, xc(e, t), r = (t.flags & 128) != 0, a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Ha(t, e.child, null, i), t.child = Ha(t, null, n, i)) : dc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Pc(e, t, i), e;
	}
	function Tc(e, t, n, r) {
		return qi(), t.flags |= 256, dc(e, t, n, r), t.child;
	}
	var R = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Ec(e) {
		return {
			baseLanes: e,
			cachePool: Ta()
		};
	}
	function Dc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Ql), e;
	}
	function Oc(e, t, n) {
		var r = t.pendingProps, a = !1, o = (t.flags & 128) != 0, s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (ho.current & 2) != 0), s && (a = !0, t.flags &= -129), s = (t.flags & 32) != 0, t.flags &= -33, e === null) {
			if (P) {
				if (a ? lo(t) : po(t), (e = N) ? (e = sf(e, Vi), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: ji === null ? null : {
						id: Mi,
						overflow: Ni
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = xi(e), n.return = t, t.child = n, zi = t, N = null)) : e = null, e === null) throw Ui(t);
				return lf(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, a ? (po(t), a = t.mode, c = kc({
				mode: "hidden",
				children: c
			}, a), r = yi(r, a, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = Ec(n), r.childLanes = Dc(e, s, n), t.memoizedState = R, gc(null, r)) : (lo(t), z(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (lo(t), t.flags &= -257, t = Ac(e, t, n)) : t.memoizedState === null ? (po(t), c = r.fallback, a = t.mode, r = kc({
				mode: "visible",
				children: r.children
			}, a), c = yi(c, a, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Ha(t, e.child, null, n), r = t.child, r.memoizedState = Ec(n), r.childLanes = Dc(e, s, n), t.memoizedState = R, t = gc(null, r)) : (po(t), t.child = e.child, t.flags |= 128, t = null);
			else if (lo(t), lf(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(i(419)), r.stack = "", r.digest = s, Yi({
					value: r,
					source: null,
					stack: null
				}), t = Ac(e, t, n);
			} else if (uc || ra(e, t, n, !1), s = (n & e.childLanes) !== 0, uc || s) {
				if (s = H, s !== null && (r = ut(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, ui(e, r), vu(s, e, r), lc;
				cf(c) || Au(), t = Ac(e, t, n);
			} else cf(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, N = df(c.nextSibling), zi = t, P = !0, Bi = null, Vi = !1, e !== null && Ri(t, e), t = z(t, r.children), t.flags |= 4096);
			return t;
		}
		return a ? (po(t), c = r.fallback, a = t.mode, l = e.child, u = l.sibling, r = gi(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = yi(c, a, n, null), c.flags |= 2) : c = gi(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, gc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = Ec(n) : (a = c.cachePool, a === null ? a = Ta() : (l = da._currentValue, a = a.parent === l ? a : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: a
		}), r.memoizedState = c, r.childLanes = Dc(e, s, n), t.memoizedState = R, gc(e.child, r)) : (lo(t), n = e.child, e = n.sibling, n = gi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function z(e, t) {
		return t = kc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function kc(e, t) {
		return e = M(22, e, null, t), e.lanes = 0, e;
	}
	function Ac(e, t, n) {
		return Ha(t, e.child, null, n), e = z(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function jc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), ta(e.return, t, n);
	}
	function Mc(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function Nc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = ho.current, s = (o & 2) != 0;
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, O(ho, o), dc(e, t, r, n), r = P ? Oi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && jc(e, n, t);
			else if (e.tag === 19) jc(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "forwards":
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && go(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Mc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && go(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Mc(t, !0, n, null, a, r);
				break;
			case "together":
				Mc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Pc(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), q |= t.lanes, (n & t.childLanes) === 0) if (e !== null) {
			if (ra(e, t, n, !1), (n & t.childLanes) === 0) return null;
		} else return null;
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = gi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = gi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function Fc(e, t) {
		return (e.lanes & t) === 0 ? (e = e.dependencies, !!(e !== null && ia(e))) : !0;
	}
	function Ic(e, t, n) {
		switch (t.tag) {
			case 3:
				ye(t, t.stateNode.containerInfo), $i(t, da, e.memoizedState.cache), qi();
				break;
			case 27:
			case 5:
				xe(t);
				break;
			case 4:
				ye(t, t.stateNode.containerInfo);
				break;
			case 10:
				$i(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, uo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (lo(t), e = Pc(e, t, n), e === null ? null : e.sibling) : Oc(e, t, n) : (lo(t), t.flags |= 128, null);
				lo(t);
				break;
			case 19:
				var i = (e.flags & 128) != 0;
				if (r = (n & t.childLanes) !== 0, r ||= (ra(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return Nc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), O(ho, ho.current), r) break;
				return null;
			case 22: return t.lanes = 0, hc(e, t, n, t.pendingProps);
			case 24: $i(t, da, e.memoizedState.cache);
		}
		return Pc(e, t, n);
	}
	function Lc(e, t, n) {
		if (e !== null) if (e.memoizedProps !== t.pendingProps) uc = !0;
		else {
			if (!Fc(e, n) && !(t.flags & 128)) return uc = !1, Ic(e, t, n);
			uc = !!(e.flags & 131072);
		}
		else uc = !1, P && t.flags & 1048576 && Fi(t, Oi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Ma(t.elementType), t.type = e, typeof e == "function") hi(e) ? (r = $s(e, r), t.tag = 1, t = wc(null, t, e, r, n)) : (t.tag = 0, t = Sc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === S) {
								t.tag = 11, t = fc(null, t, e, r, n);
								break a;
							} else if (a === re) {
								t.tag = 14, t = pc(null, t, e, r, n);
								break a;
							}
						}
						throw t = ce(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Sc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = $s(r, t.pendingProps), wc(e, t, r, a, n);
			case 3:
				a: {
					if (ye(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Ka(e, t), $a(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, $i(t, da, r), r !== o.cache && na(t, [da], n, !0), Qa(), r = s.element, o.isDehydrated) if (o = {
						element: r,
						isDehydrated: !1,
						cache: s.cache
					}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
						t = Tc(e, t, r, n);
						break a;
					} else if (r !== a) {
						a = wi(Error(i(424)), t), Yi(a), t = Tc(e, t, r, n);
						break a;
					} else {
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (N = df(e.firstChild), zi = t, P = !0, Bi = null, Vi = !0, n = Ua(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					}
					else {
						if (qi(), r === a) {
							t = Pc(e, t, n);
							break a;
						}
						dc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return xc(e, t), e === null ? (n = Mf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : P || (n = t.type, e = t.pendingProps, r = Ud(_e.current).createElement(n), r[gt] = t, r[_t] = e, Ld(r, n, e), kt(r), t.stateNode = r) : t.memoizedState = Mf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return xe(t), e === null && P && (r = t.stateNode = hf(t.type, t.pendingProps, _e.current), zi = t, Vi = !0, a = N, ef(t.type) ? (ff = a, N = df(r.firstChild)) : N = a), dc(e, t, t.pendingProps.children, n), xc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && P && ((a = r = N) && (r = af(r, t.type, t.pendingProps, Vi), r === null ? a = !1 : (t.stateNode = r, zi = t, N = df(r.firstChild), Vi = !1, a = !0)), a || Ui(t)), xe(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Kd(a, o) ? r = null : s !== null && Kd(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = Oo(e, t, jo, null, null, n), tp._currentValue = a), xc(e, t), dc(e, t, r, n), t.child;
			case 6: return e === null && P && ((e = n = N) && (n = of(n, t.pendingProps, Vi), n === null ? e = !1 : (t.stateNode = n, zi = t, N = null, e = !0)), e || Ui(t)), null;
			case 13: return Oc(e, t, n);
			case 4: return ye(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Ha(t, null, r, n) : dc(e, t, r, n), t.child;
			case 11: return fc(e, t, t.type, t.pendingProps, n);
			case 7: return dc(e, t, t.pendingProps, n), t.child;
			case 8: return dc(e, t, t.pendingProps.children, n), t.child;
			case 12: return dc(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, $i(t, t.type, r.value), dc(e, t, r.children, n), t.child;
			case 9: return a = t.type._context, r = t.pendingProps.children, aa(t), a = F(a), r = r(a), t.flags |= 1, dc(e, t, r, n), t.child;
			case 14: return pc(e, t, t.type, t.pendingProps, n);
			case 15: return mc(e, t, t.type, t.pendingProps, n);
			case 19: return Nc(e, t, n);
			case 31: return bc(e, t, n);
			case 22: return hc(e, t, n, t.pendingProps);
			case 24: return aa(t), r = F(da), e === null ? (a = Ca(), a === null && (a = H, o = fa(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, Ga(t), $i(t, da, a)) : ((e.lanes & n) !== 0 && (Ka(e, t), $a(t, null, null, n), Qa()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, $i(t, da, r), r !== a.cache && na(t, [da], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), $i(t, da, r))), dc(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function Rc(e) {
		e.flags |= 4;
	}
	function zc(e, t, n, r, i) {
		if ((t = (e.mode & 32) != 0) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) if (e.stateNode.complete) e.flags |= 8192;
			else if (Du()) e.flags |= 8192;
			else throw Na = ka, Da;
		} else e.flags &= -16777217;
	}
	function Bc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !qf(t)) if (Du()) e.flags |= 8192;
		else throw Na = ka, Da;
	}
	function Vc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : it(), e.lanes |= t, $l |= t);
	}
	function Hc(e, t) {
		if (!P) switch (e.tailMode) {
			case "hidden":
				t = e.tail;
				for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
				break;
			case "collapsed":
				n = e.tail;
				for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
		}
	}
	function Uc(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Wc(e, t, n) {
		var r = t.pendingProps;
		switch (Li(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Uc(t), null;
			case 1: return Uc(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), ea(da), be(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Ki(t) ? Rc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Ji())), Uc(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (Rc(t), o === null ? (Uc(t), zc(t, a, null, r, n)) : (Uc(t), Bc(t, o))) : o ? o === e.memoizedState ? (Uc(t), t.flags &= -16777217) : (Rc(t), Uc(t), Bc(t, o)) : (e = e.memoizedProps, e !== r && Rc(t), Uc(t), zc(t, a, e, r, n)), null;
			case 27:
				if (Se(t), n = _e.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Rc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Uc(t), null;
					}
					e = he.current, Ki(t) ? Wi(t, e) : (e = hf(a, r, n), t.stateNode = e, Rc(t));
				}
				return Uc(t), null;
			case 5:
				if (Se(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Rc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Uc(t), null;
					}
					if (o = he.current, Ki(t)) Wi(t, o);
					else {
						var s = Ud(_e.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[gt] = t, o[_t] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (Ld(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && Rc(t);
					}
				}
				return Uc(t), zc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Rc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = _e.current, Ki(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = zi, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[gt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Fd(e.nodeValue, n)), e || Ui(t, !0);
					} else e = Ud(e).createTextNode(r), e[gt] = t, t.stateNode = e;
				}
				return Uc(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Ki(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[gt] = t;
						} else qi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Uc(t), e = !1;
					} else n = Ji(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (mo(t), t) : (mo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return Uc(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Ki(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[gt] = t;
						} else qi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Uc(t), a = !1;
					} else a = Ji(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (mo(t), t) : (mo(t), null);
				}
				return mo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Vc(t, t.updateQueue), Uc(t), null);
			case 4: return be(), e === null && Td(t.stateNode.containerInfo), Uc(t), null;
			case 10: return ea(t.type), Uc(t), null;
			case 19:
				if (me(ho), r = t.memoizedState, r === null) return Uc(t), null;
				if (a = (t.flags & 128) != 0, o = r.rendering, o === null) if (a) Hc(r, !1);
				else {
					if (Yl !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
						if (o = go(e), o !== null) {
							for (t.flags |= 128, Hc(r, !1), e = o.updateQueue, t.updateQueue = e, Vc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) _i(n, e), n = n.sibling;
							return O(ho, ho.current & 1 | 2), P && Pi(t, r.treeForkCount), t.child;
						}
						e = e.sibling;
					}
					r.tail !== null && Fe() > iu && (t.flags |= 128, a = !0, Hc(r, !1), t.lanes = 4194304);
				}
				else {
					if (!a) if (e = go(o), e !== null) {
						if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Vc(t, e), Hc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !P) return Uc(t), null;
					} else 2 * Fe() - r.renderingStartTime > iu && n !== 536870912 && (t.flags |= 128, a = !0, Hc(r, !1), t.lanes = 4194304);
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (Uc(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Fe(), e.sibling = null, n = ho.current, O(ho, a ? n & 1 | 2 : n & 1), P && Pi(t, r.treeForkCount), e);
			case 22:
			case 23: return mo(t), oo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Uc(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Uc(t), n = t.updateQueue, n !== null && Vc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && me(Sa), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), ea(da), Uc(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(i(156, t.tag));
	}
	function Gc(e, t) {
		switch (Li(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return ea(da), be(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Se(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (mo(t), t.alternate === null) throw Error(i(340));
					qi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (mo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					qi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return me(ho), null;
			case 4: return be(), null;
			case 10: return ea(t.type), null;
			case 22:
			case 23: return mo(t), oo(), e !== null && me(Sa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return ea(da), null;
			case 25: return null;
			default: return null;
		}
	}
	function Kc(e, t) {
		switch (Li(t), t.tag) {
			case 3:
				ea(da), be();
				break;
			case 26:
			case 27:
			case 5:
				Se(t);
				break;
			case 4:
				be();
				break;
			case 31:
				t.memoizedState !== null && mo(t);
				break;
			case 13:
				mo(t);
				break;
			case 19:
				me(ho);
				break;
			case 10:
				ea(t.type);
				break;
			case 22:
			case 23:
				mo(t), oo(), e !== null && me(Sa);
				break;
			case 24: ea(da);
		}
	}
	function qc(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function Jc(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Y(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function Yc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				to(t, n);
			} catch (t) {
				Y(e, e.return, t);
			}
		}
	}
	function Xc(e, t, n) {
		n.props = $s(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Y(e, t, n);
		}
	}
	function Zc(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Y(e, t, n);
		}
	}
	function Qc(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) if (typeof r == "function") try {
			r();
		} catch (n) {
			Y(e, t, n);
		} finally {
			e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
		}
		else if (typeof n == "function") try {
			n(null);
		} catch (n) {
			Y(e, t, n);
		}
		else n.current = null;
	}
	function $c(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	function el(e, t, n) {
		try {
			var r = e.stateNode;
			Rd(r, e.type, n, t), r[_t] = t;
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	function tl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ef(e.type) || e.tag === 4;
	}
	function nl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || tl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && ef(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function rl(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = un));
		else if (r !== 4 && (r === 27 && ef(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (rl(e, t, n), e = e.sibling; e !== null;) rl(e, t, n), e = e.sibling;
	}
	function il(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && ef(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (il(e, t, n), e = e.sibling; e !== null;) il(e, t, n), e = e.sibling;
	}
	function al(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Ld(t, r, n), t[gt] = e, t[_t] = n;
		} catch (t) {
			Y(e, e.return, t);
		}
	}
	var ol = !1, sl = !1, cl = !1, ll = typeof WeakSet == "function" ? WeakSet : Set, ul = null;
	function dl(e, t) {
		if (e = e.containerInfo, Vd = up, e = Pr(e), Fr(e)) {
			if ("selectionStart" in e) var n = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				n = (n = e.ownerDocument) && n.defaultView || window;
				var r = n.getSelection && n.getSelection();
				if (r && r.rangeCount !== 0) {
					n = r.anchorNode;
					var a = r.anchorOffset, o = r.focusNode;
					r = r.focusOffset;
					try {
						n.nodeType, o.nodeType;
					} catch {
						n = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== n || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || r !== 0 && f.nodeType !== 3 || (l = s + r), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === n && ++u === a && (c = s), p === o && ++d === r && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					n = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else n = null;
			}
			n ||= {
				start: 0,
				end: 0
			};
		} else n = null;
		for (Hd = {
			focusedElem: e,
			selectionRange: n
		}, up = !1, ul = t; ul !== null;) if (t = ul, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, ul = e;
		else for (; ul !== null;) {
			switch (t = ul, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) a = e[n], a.ref.impl = a.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, a = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = $s(n.type, a);
							e = r.getSnapshotBeforeUpdate(h, o), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							Y(n, n.return, e);
						}
					}
					break;
				case 3:
					if (e & 1024) {
						if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9) rf(e);
						else if (n === 1) switch (e.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								rf(e);
								break;
							default: e.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (e & 1024) throw Error(i(163));
			}
			if (e = t.sibling, e !== null) {
				e.return = t.return, ul = e;
				break;
			}
			ul = t.return;
		}
	}
	function fl(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				El(e, n), r & 4 && qc(5, n);
				break;
			case 1:
				if (El(e, n), r & 4) if (e = n.stateNode, t === null) try {
					e.componentDidMount();
				} catch (e) {
					Y(n, n.return, e);
				}
				else {
					var i = $s(n.type, t.memoizedProps);
					t = t.memoizedState;
					try {
						e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
					} catch (e) {
						Y(n, n.return, e);
					}
				}
				r & 64 && Yc(n), r & 512 && Zc(n, n.return);
				break;
			case 3:
				if (El(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						to(e, t);
					} catch (e) {
						Y(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && al(n);
			case 26:
			case 5:
				El(e, n), t === null && r & 4 && $c(n), r & 512 && Zc(n, n.return);
				break;
			case 12:
				El(e, n);
				break;
			case 31:
				El(e, n), r & 4 && _l(e, n);
				break;
			case 13:
				El(e, n), r & 4 && vl(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = Zu.bind(null, n), uf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || ol, !r) {
					t = t !== null && t.memoizedState !== null || sl, i = ol;
					var a = sl;
					ol = r, (sl = t) && !a ? Ol(e, n, (n.subtreeFlags & 8772) != 0) : El(e, n), ol = i, sl = a;
				}
				break;
			case 30: break;
			default: El(e, n);
		}
	}
	function pl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, pl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && wt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var B = null, ml = !1;
	function hl(e, t, n) {
		for (n = n.child; n !== null;) gl(e, t, n), n = n.sibling;
	}
	function gl(e, t, n) {
		if (Ge && typeof Ge.onCommitFiberUnmount == "function") try {
			Ge.onCommitFiberUnmount(We, n);
		} catch {}
		switch (n.tag) {
			case 26:
				sl || Qc(n, t), hl(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				sl || Qc(n, t);
				var r = B, i = ml;
				ef(n.type) && (B = n.stateNode, ml = !1), hl(e, t, n), gf(n.stateNode), B = r, ml = i;
				break;
			case 5: sl || Qc(n, t);
			case 6:
				if (r = B, i = ml, B = null, hl(e, t, n), B = r, ml = i, B !== null) if (ml) try {
					(B.nodeType === 9 ? B.body : B.nodeName === "HTML" ? B.ownerDocument.body : B).removeChild(n.stateNode);
				} catch (e) {
					Y(n, t, e);
				}
				else try {
					B.removeChild(n.stateNode);
				} catch (e) {
					Y(n, t, e);
				}
				break;
			case 18:
				B !== null && (ml ? (e = B, tf(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Ip(e)) : tf(B, n.stateNode));
				break;
			case 4:
				r = B, i = ml, B = n.stateNode.containerInfo, ml = !0, hl(e, t, n), B = r, ml = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Jc(2, n, t), sl || Jc(4, n, t), hl(e, t, n);
				break;
			case 1:
				sl || (Qc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Xc(n, t, r)), hl(e, t, n);
				break;
			case 21:
				hl(e, t, n);
				break;
			case 22:
				sl = (r = sl) || n.memoizedState !== null, hl(e, t, n), sl = r;
				break;
			default: hl(e, t, n);
		}
	}
	function _l(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Ip(e);
			} catch (e) {
				Y(t, t.return, e);
			}
		}
	}
	function vl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Ip(e);
		} catch (e) {
			Y(t, t.return, e);
		}
	}
	function yl(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new ll()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new ll()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function bl(e, t) {
		var n = yl(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Qu.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function xl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var a = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (ef(c.type)) {
							B = c.stateNode, ml = !1;
							break a;
						}
						break;
					case 5:
						B = c.stateNode, ml = !1;
						break a;
					case 3:
					case 4:
						B = c.stateNode.containerInfo, ml = !0;
						break a;
				}
				c = c.return;
			}
			if (B === null) throw Error(i(160));
			gl(o, s, a), B = null, ml = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Cl(t, e), t = t.sibling;
	}
	var Sl = null;
	function Cl(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				xl(t, e), wl(e), r & 4 && (Jc(3, e, e.return), qc(3, e), Jc(5, e, e.return));
				break;
			case 1:
				xl(t, e), wl(e), r & 512 && (sl || n === null || Qc(n, n.return)), r & 64 && ol && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var a = Sl;
				if (xl(t, e), wl(e), r & 512 && (sl || n === null || Qc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) if (r === null) if (e.stateNode === null) {
						a: {
							r = e.type, n = e.memoizedProps, a = a.ownerDocument || a;
							b: switch (r) {
								case "title":
									o = a.getElementsByTagName("title")[0], (!o || o[Ct] || o[gt] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = a.createElement(r), a.head.insertBefore(o, a.querySelector("head > title"))), Ld(o, r, n), o[gt] = e, kt(o), r = o;
									break a;
								case "link":
									var s = Wf("link", "href", a).get(r + (n.href || ""));
									if (s) {
										for (var c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Ld(o, r, n), a.head.appendChild(o);
									break;
								case "meta":
									if (s = Wf("meta", "content", a).get(r + (n.content || ""))) {
										for (c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Ld(o, r, n), a.head.appendChild(o);
									break;
								default: throw Error(i(468, r));
							}
							o[gt] = e, kt(o), r = o;
						}
						e.stateNode = r;
					} else Gf(a, e.type, e.stateNode);
					else e.stateNode = zf(a, r, e.memoizedProps);
					else o === r ? r === null && e.stateNode !== null && el(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Gf(a, e.type, e.stateNode) : zf(a, r, e.memoizedProps));
				}
				break;
			case 27:
				xl(t, e), wl(e), r & 512 && (sl || n === null || Qc(n, n.return)), n !== null && r & 4 && el(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (xl(t, e), wl(e), r & 512 && (sl || n === null || Qc(n, n.return)), e.flags & 32) {
					a = e.stateNode;
					try {
						tn(a, "");
					} catch (t) {
						Y(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (a = e.memoizedProps, el(e, a, n === null ? a : n.memoizedProps)), r & 1024 && (cl = !0);
				break;
			case 6:
				if (xl(t, e), wl(e), r & 4) {
					if (e.stateNode === null) throw Error(i(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						Y(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Uf = null, a = Sl, Sl = yf(t.containerInfo), xl(t, e), Sl = a, wl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Ip(t.containerInfo);
				} catch (t) {
					Y(e, e.return, t);
				}
				cl && (cl = !1, Tl(e));
				break;
			case 4:
				r = Sl, Sl = yf(e.stateNode.containerInfo), xl(t, e), wl(e), Sl = r;
				break;
			case 12:
				xl(t, e), wl(e);
				break;
			case 31:
				xl(t, e), wl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, bl(e, r)));
				break;
			case 13:
				xl(t, e), wl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (nu = Fe()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, bl(e, r)));
				break;
			case 22:
				a = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = ol, d = sl;
				if (ol = u || a, sl = d || l, xl(t, e), sl = d, ol = u, wl(e), r & 8192) a: for (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (n === null || l || ol || sl || Dl(e)), n = null, t = e;;) {
					if (t.tag === 5 || t.tag === 26) {
						if (n === null) {
							l = n = t;
							try {
								if (o = l.stateNode, a) s = o.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
								else {
									c = l.stateNode;
									var f = l.memoizedProps.style, p = f != null && f.hasOwnProperty("display") ? f.display : null;
									c.style.display = p == null || typeof p == "boolean" ? "" : ("" + p).trim();
								}
							} catch (e) {
								Y(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = a ? "" : l.memoizedProps;
							} catch (e) {
								Y(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								a ? nf(m, !0) : nf(l.stateNode, !1);
							} catch (e) {
								Y(l, l.return, e);
							}
						}
					} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
						t.child.return = t, t = t.child;
						continue;
					}
					if (t === e) break a;
					for (; t.sibling === null;) {
						if (t.return === null || t.return === e) break a;
						n === t && (n = null), t = t.return;
					}
					n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
				}
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, bl(e, n))));
				break;
			case 19:
				xl(t, e), wl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, bl(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: xl(t, e), wl(e);
		}
	}
	function wl(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (tl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var a = n.stateNode;
						il(e, nl(e), a);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (tn(o, ""), n.flags &= -33), il(e, nl(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						rl(e, nl(e), s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Y(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Tl(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Tl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function El(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) fl(e, t.alternate, t), t = t.sibling;
	}
	function Dl(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Jc(4, t, t.return), Dl(t);
					break;
				case 1:
					Qc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Xc(t, t.return, n), Dl(t);
					break;
				case 27: gf(t.stateNode);
				case 26:
				case 5:
					Qc(t, t.return), Dl(t);
					break;
				case 22:
					t.memoizedState === null && Dl(t);
					break;
				case 30:
					Dl(t);
					break;
				default: Dl(t);
			}
			e = e.sibling;
		}
	}
	function Ol(e, t, n) {
		for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Ol(i, a, n), qc(4, a);
					break;
				case 1:
					if (Ol(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Y(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) eo(c[i], s);
						} catch (e) {
							Y(r, r.return, e);
						}
					}
					n && o & 64 && Yc(a), Zc(a, a.return);
					break;
				case 27: al(a);
				case 26:
				case 5:
					Ol(i, a, n), n && r === null && o & 4 && $c(a), Zc(a, a.return);
					break;
				case 12:
					Ol(i, a, n);
					break;
				case 31:
					Ol(i, a, n), n && o & 4 && _l(i, a);
					break;
				case 13:
					Ol(i, a, n), n && o & 4 && vl(i, a);
					break;
				case 22:
					a.memoizedState === null && Ol(i, a, n), Zc(a, a.return);
					break;
				case 30: break;
				default: Ol(i, a, n);
			}
			t = t.sibling;
		}
	}
	function kl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && pa(n));
	}
	function Al(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && pa(e));
	}
	function jl(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) Ml(e, t, n, r), t = t.sibling;
	}
	function Ml(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				jl(e, t, n, r), i & 2048 && qc(9, t);
				break;
			case 1:
				jl(e, t, n, r);
				break;
			case 3:
				jl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && pa(e)));
				break;
			case 12:
				if (i & 2048) {
					jl(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						Y(t, t.return, e);
					}
				} else jl(e, t, n, r);
				break;
			case 31:
				jl(e, t, n, r);
				break;
			case 13:
				jl(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? jl(e, t, n, r) : (a._visibility |= 2, Nl(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1)) : a._visibility & 2 ? jl(e, t, n, r) : Pl(e, t), i & 2048 && kl(o, t);
				break;
			case 24:
				jl(e, t, n, r), i & 2048 && Al(t.alternate, t);
				break;
			default: jl(e, t, n, r);
		}
	}
	function Nl(e, t, n, r, i) {
		for (i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Nl(a, o, s, c, i), qc(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Nl(a, o, s, c, i)) : u._visibility & 2 ? Nl(a, o, s, c, i) : Pl(a, o), i && l & 2048 && kl(o.alternate, o);
					break;
				case 24:
					Nl(a, o, s, c, i), i && l & 2048 && Al(o.alternate, o);
					break;
				default: Nl(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Pl(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Pl(n, r), i & 2048 && kl(r.alternate, r);
					break;
				case 24:
					Pl(n, r), i & 2048 && Al(r.alternate, r);
					break;
				default: Pl(n, r);
			}
			t = t.sibling;
		}
	}
	var Fl = 8192;
	function Il(e, t, n) {
		if (e.subtreeFlags & Fl) for (e = e.child; e !== null;) Ll(e, t, n), e = e.sibling;
	}
	function Ll(e, t, n) {
		switch (e.tag) {
			case 26:
				Il(e, t, n), e.flags & Fl && e.memoizedState !== null && Jf(n, Sl, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				Il(e, t, n);
				break;
			case 3:
			case 4:
				var r = Sl;
				Sl = yf(e.stateNode.containerInfo), Il(e, t, n), Sl = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Fl, Fl = 16777216, Il(e, t, n), Fl = r) : Il(e, t, n));
				break;
			default: Il(e, t, n);
		}
	}
	function Rl(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function zl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				ul = r, Hl(r, e);
			}
			Rl(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Bl(e), e = e.sibling;
	}
	function Bl(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				zl(e), e.flags & 2048 && Jc(9, e, e.return);
				break;
			case 3:
				zl(e);
				break;
			case 12:
				zl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Vl(e)) : zl(e);
				break;
			default: zl(e);
		}
	}
	function Vl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				ul = r, Hl(r, e);
			}
			Rl(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Jc(8, t, t.return), Vl(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Vl(t));
					break;
				default: Vl(t);
			}
			e = e.sibling;
		}
	}
	function Hl(e, t) {
		for (; ul !== null;) {
			var n = ul;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Jc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: pa(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, ul = r;
			else a: for (n = e; ul !== null;) {
				r = ul;
				var i = r.sibling, a = r.return;
				if (pl(r), r === n) {
					ul = null;
					break a;
				}
				if (i !== null) {
					i.return = a, ul = i;
					break a;
				}
				ul = a;
			}
		}
	}
	var Ul = {
		getCacheForType: function(e) {
			var t = F(da), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return F(da).controller.signal;
		}
	}, Wl = typeof WeakMap == "function" ? WeakMap : Map, V = 0, H = null, U = null, W = 0, G = 0, Gl = null, Kl = !1, K = !1, ql = !1, Jl = 0, Yl = 0, q = 0, Xl = 0, Zl = 0, Ql = 0, $l = 0, eu = null, J = null, tu = !1, nu = 0, ru = 0, iu = Infinity, au = null, ou = null, su = 0, cu = null, lu = null, uu = 0, du = 0, fu = null, pu = null, mu = 0, hu = null;
	function gu() {
		return V & 2 && W !== 0 ? W & -W : E.T === null ? pt() : md();
	}
	function _u() {
		if (Ql === 0) if (!(W & 536870912) || P) {
			var e = Qe;
			Qe <<= 1, !(Qe & 3932160) && (Qe = 262144), Ql = e;
		} else Ql = 536870912;
		return e = so.current, e !== null && (e.flags |= 32), Ql;
	}
	function vu(e, t, n) {
		(e === H && (G === 2 || G === 9) || e.cancelPendingCommit !== null) && (Tu(e, 0), Su(e, W, Ql, !1)), ot(e, n), (!(V & 2) || e !== H) && (e === H && (!(V & 2) && (Xl |= n), Yl === 4 && Su(e, W, Ql, !1)), od(e));
	}
	function yu(e, t, n) {
		if (V & 6) throw Error(i(327));
		var r = !n && (t & 127) == 0 && (t & e.expiredLanes) === 0 || nt(e, t), a = r ? Nu(e, t) : ju(e, t, !0), o = r;
		do {
			if (a === 0) {
				K && !r && Su(e, t, 0, !1);
				break;
			} else {
				if (n = e.current.alternate, o && !xu(n)) {
					a = ju(e, t, !1), o = !1;
					continue;
				}
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = eu;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Tu(c, s).flags |= 256), s = ju(c, s, !1), s !== 2) {
								if (ql && !l) {
									c.errorRecoveryDisabledLanes |= o, Xl |= o, a = 4;
									break a;
								}
								o = J, J = a, o !== null && (J === null ? J = o : J.push.apply(J, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Tu(e, 0), Su(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t) break;
						case 6:
							Su(r, t, Ql, !Kl);
							break a;
						case 2:
							J = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = nu + 300 - Fe(), 10 < a)) {
						if (Su(r, t, Ql, !Kl), tt(r, 0, !0) !== 0) break a;
						uu = t, r.timeoutHandle = Yd(bu.bind(null, r, n, J, au, tu, t, Ql, Xl, $l, Kl, o, "Throttled", -0, 0), a);
						break a;
					}
					bu(r, n, J, au, tu, t, Ql, Xl, $l, Kl, o, null, -0, 0);
				}
			}
			break;
		} while (1);
		od(e);
	}
	function bu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: un
			}, Ll(t, a, d);
			var m = (a & 62914560) === a ? nu - Fe() : (a & 4194048) === a ? ru - Fe() : 0;
			if (m = Xf(d, m), m !== null) {
				uu = a, e.cancelPendingCommit = m(Bu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), Su(e, a, o, !l);
				return;
			}
		}
		Bu(e, t, a, n, r, i, o, s, c);
	}
	function xu(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!kr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Su(e, t, n, r) {
		t &= ~Zl, t &= ~Xl, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - qe(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && ct(e, n, t);
	}
	function Cu() {
		return V & 6 ? !0 : (sd(0, !1), !1);
	}
	function wu() {
		if (U !== null) {
			if (G === 0) var e = U.return;
			else e = U, Qi = Zi = null, Po(e), Ia = null, La = 0, e = U;
			for (; e !== null;) Kc(e.alternate, e), e = e.return;
			U = null;
		}
	}
	function Tu(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, Xd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), uu = 0, wu(), H = e, U = n = gi(e.current, null), W = t, G = 0, Gl = null, Kl = !1, K = nt(e, t), ql = !1, $l = Ql = Zl = Xl = q = Yl = 0, J = eu = null, tu = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - qe(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Jl = t, si(), n;
	}
	function Eu(e, t) {
		I = null, E.H = Gs, t === Ea || t === Oa ? (t = Pa(), G = 3) : t === Da ? (t = Pa(), G = 4) : G = t === lc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Gl = t, U === null && (Yl = 1, rc(e, wi(t, e.current)));
	}
	function Du() {
		var e = so.current;
		return e === null ? !0 : (W & 4194048) === W ? co === null : (W & 62914560) === W || W & 536870912 ? e === co : !1;
	}
	function Ou() {
		var e = E.H;
		return E.H = Gs, e === null ? Gs : e;
	}
	function ku() {
		var e = E.A;
		return E.A = Ul, e;
	}
	function Au() {
		Yl = 4, Kl || (W & 4194048) !== W && so.current !== null || (K = !0), !(q & 134217727) && !(Xl & 134217727) || H === null || Su(H, W, Ql, !1);
	}
	function ju(e, t, n) {
		var r = V;
		V |= 2;
		var i = Ou(), a = ku();
		(H !== e || W !== t) && (au = null, Tu(e, t)), t = !1;
		var o = Yl;
		a: do
			try {
				if (G !== 0 && U !== null) {
					var s = U, c = Gl;
					switch (G) {
						case 8:
							wu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							so.current === null && (t = !0);
							var l = G;
							if (G = 0, Gl = null, Lu(e, s, c, l), n && K) {
								o = 0;
								break a;
							}
							break;
						default: l = G, G = 0, Gl = null, Lu(e, s, c, l);
					}
				}
				Mu(), o = Yl;
				break;
			} catch (t) {
				Eu(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, Qi = Zi = null, V = r, E.H = i, E.A = a, U === null && (H = null, W = 0, si()), o;
	}
	function Mu() {
		for (; U !== null;) Fu(U);
	}
	function Nu(e, t) {
		var n = V;
		V |= 2;
		var r = Ou(), a = ku();
		H !== e || W !== t ? (au = null, iu = Fe() + 500, Tu(e, t)) : K = nt(e, t);
		a: do
			try {
				if (G !== 0 && U !== null) {
					t = U;
					var o = Gl;
					b: switch (G) {
						case 1:
							G = 0, Gl = null, Lu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Aa(o)) {
								G = 0, Gl = null, Iu(t);
								break;
							}
							t = function() {
								G !== 2 && G !== 9 || H !== e || (G = 7), od(e);
							}, o.then(t, t);
							break a;
						case 3:
							G = 7;
							break a;
						case 4:
							G = 5;
							break a;
						case 7:
							Aa(o) ? (G = 0, Gl = null, Iu(t)) : (G = 0, Gl = null, Lu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (U.tag) {
								case 26: s = U.memoizedState;
								case 5:
								case 27:
									var c = U;
									if (s ? qf(s) : c.stateNode.complete) {
										G = 0, Gl = null;
										var l = c.sibling;
										if (l !== null) U = l;
										else {
											var u = c.return;
											u === null ? U = null : (U = u, Ru(u));
										}
										break b;
									}
							}
							G = 0, Gl = null, Lu(e, t, o, 5);
							break;
						case 6:
							G = 0, Gl = null, Lu(e, t, o, 6);
							break;
						case 8:
							wu(), Yl = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Pu();
				break;
			} catch (t) {
				Eu(e, t);
			}
		while (1);
		return Qi = Zi = null, E.H = r, E.A = a, V = n, U === null ? (H = null, W = 0, si(), Yl) : 0;
	}
	function Pu() {
		for (; U !== null && !Ne();) Fu(U);
	}
	function Fu(e) {
		var t = Lc(e.alternate, e, Jl);
		e.memoizedProps = e.pendingProps, t === null ? Ru(e) : U = t;
	}
	function Iu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Cc(n, t, t.pendingProps, t.type, void 0, W);
				break;
			case 11:
				t = Cc(n, t, t.pendingProps, t.type.render, t.ref, W);
				break;
			case 5: Po(t);
			default: Kc(n, t), t = U = _i(t, Jl), t = Lc(n, t, Jl);
		}
		e.memoizedProps = e.pendingProps, t === null ? Ru(e) : U = t;
	}
	function Lu(e, t, n, r) {
		Qi = Zi = null, Po(t), Ia = null, La = 0;
		var i = t.return;
		try {
			if (cc(e, i, t, n, W)) {
				Yl = 1, rc(e, wi(n, e.current)), U = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw U = i, t;
			Yl = 1, rc(e, wi(n, e.current)), U = null;
			return;
		}
		t.flags & 32768 ? (P || r === 1 ? e = !0 : K || W & 536870912 ? e = !1 : (Kl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = so.current, r !== null && r.tag === 13 && (r.flags |= 16384))), zu(t, e)) : Ru(t);
	}
	function Ru(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				zu(t, Kl);
				return;
			}
			e = t.return;
			var n = Wc(t.alternate, t, Jl);
			if (n !== null) {
				U = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				U = t;
				return;
			}
			U = t = e;
		} while (t !== null);
		Yl === 0 && (Yl = 5);
	}
	function zu(e, t) {
		do {
			var n = Gc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, U = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				U = e;
				return;
			}
			U = e = n;
		} while (e !== null);
		Yl = 6, U = null;
	}
	function Bu(e, t, n, r, a, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Gu();
		while (su !== 0);
		if (V & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (o = t.lanes | t.childLanes, o |= oi, st(e, n, o, s, c, l), e === H && (U = H = null, W = 0), lu = t, cu = e, uu = n, du = o, fu = a, pu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, $u(ze, function() {
				return Ku(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = (t.flags & 13878) != 0, t.subtreeFlags & 13878 || r) {
				r = E.T, E.T = null, a = D.p, D.p = 2, s = V, V |= 4;
				try {
					dl(e, t, n);
				} finally {
					V = s, D.p = a, E.T = r;
				}
			}
			su = 1, Vu(), Hu(), Uu();
		}
	}
	function Vu() {
		if (su === 1) {
			su = 0;
			var e = cu, t = lu, n = (t.flags & 13878) != 0;
			if (t.subtreeFlags & 13878 || n) {
				n = E.T, E.T = null;
				var r = D.p;
				D.p = 2;
				var i = V;
				V |= 4;
				try {
					Cl(t, e);
					var a = Hd, o = Pr(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && Nr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Fr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Mr(s, h), v = Mr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					up = !!Vd, Hd = Vd = null;
				} finally {
					V = i, D.p = r, E.T = n;
				}
			}
			e.current = t, su = 2;
		}
	}
	function Hu() {
		if (su === 2) {
			su = 0;
			var e = cu, t = lu, n = (t.flags & 8772) != 0;
			if (t.subtreeFlags & 8772 || n) {
				n = E.T, E.T = null;
				var r = D.p;
				D.p = 2;
				var i = V;
				V |= 4;
				try {
					fl(e, t.alternate, t);
				} finally {
					V = i, D.p = r, E.T = n;
				}
			}
			su = 3;
		}
	}
	function Uu() {
		if (su === 4 || su === 3) {
			su = 0, Pe();
			var e = cu, t = lu, n = uu, r = pu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? su = 5 : (su = 0, lu = cu = null, Wu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (ou = null), ft(n), t = t.stateNode, Ge && typeof Ge.onCommitFiberRoot == "function") try {
				Ge.onCommitFiberRoot(We, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = E.T, i = D.p, D.p = 2, E.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					E.T = t, D.p = i;
				}
			}
			uu & 3 && Gu(), od(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === hu ? mu++ : (mu = 0, hu = e) : mu = 0, sd(0, !1);
		}
	}
	function Wu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, pa(t)));
	}
	function Gu() {
		return Vu(), Hu(), Uu(), Ku();
	}
	function Ku() {
		if (su !== 5) return !1;
		var e = cu, t = du;
		du = 0;
		var n = ft(uu), r = E.T, a = D.p;
		try {
			D.p = 32 > n ? 32 : n, E.T = null, n = fu, fu = null;
			var o = cu, s = uu;
			if (su = 0, lu = cu = null, uu = 0, V & 6) throw Error(i(331));
			var c = V;
			if (V |= 4, Bl(o.current), Ml(o, o.current, s, n), V = c, sd(0, !1), Ge && typeof Ge.onPostCommitFiberRoot == "function") try {
				Ge.onPostCommitFiberRoot(We, o);
			} catch {}
			return !0;
		} finally {
			D.p = a, E.T = r, Wu(e, t);
		}
	}
	function qu(e, t, n) {
		t = wi(n, t), t = ac(e.stateNode, t, 2), e = Ja(e, t, 2), e !== null && (ot(e, 2), od(e));
	}
	function Y(e, t, n) {
		if (e.tag === 3) qu(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				qu(t, e, n);
				break;
			} else if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (ou === null || !ou.has(r))) {
					e = wi(n, e), n = oc(2), r = Ja(t, n, 2), r !== null && (sc(n, r, t, e), ot(r, 2), od(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function Ju(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Wl();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (ql = !0, i.add(n), e = Yu.bind(null, e, t, n), t.then(e, e));
	}
	function Yu(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, H === e && (W & n) === n && (Yl === 4 || Yl === 3 && (W & 62914560) === W && 300 > Fe() - nu ? !(V & 2) && Tu(e, 0) : Zl |= n, $l === W && ($l = 0)), od(e);
	}
	function Xu(e, t) {
		t === 0 && (t = it()), e = ui(e, t), e !== null && (ot(e, t), od(e));
	}
	function Zu(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), Xu(e, n);
	}
	function Qu(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), Xu(e, n);
	}
	function $u(e, t) {
		return je(e, t);
	}
	var ed = null, td = null, nd = !1, rd = !1, id = !1, ad = 0;
	function od(e) {
		e !== td && e.next === null && (td === null ? ed = td = e : td = td.next = e), rd = !0, nd || (nd = !0, pd());
	}
	function sd(e, t) {
		if (!id && rd) {
			id = !0;
			do
				for (var n = !1, r = ed; r !== null;) {
					if (!t) if (e !== 0) {
						var i = r.pendingLanes;
						if (i === 0) var a = 0;
						else {
							var o = r.suspendedLanes, s = r.pingedLanes;
							a = (1 << 31 - qe(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
						}
						a !== 0 && (n = !0, fd(r, a));
					} else a = W, a = tt(r, r === H ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || nt(r, a) || (n = !0, fd(r, a));
					r = r.next;
				}
			while (n);
			id = !1;
		}
	}
	function cd() {
		ld();
	}
	function ld() {
		rd = nd = !1;
		var e = 0;
		ad !== 0 && Jd() && (e = ad);
		for (var t = Fe(), n = null, r = ed; r !== null;) {
			var i = r.next, a = ud(r, t);
			a === 0 ? (r.next = null, n === null ? ed = i : n.next = i, i === null && (td = n)) : (n = r, (e !== 0 || a & 3) && (rd = !0)), r = i;
		}
		su !== 0 && su !== 5 || sd(e, !1), ad !== 0 && (ad = 0);
	}
	function ud(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - qe(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = rt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = H, n = W, n = tt(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (G === 2 || G === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Me(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || nt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Me(r), ft(n)) {
				case 2:
				case 8:
					n = Re;
					break;
				case 32:
					n = ze;
					break;
				case 268435456:
					n = Ve;
					break;
				default: n = ze;
			}
			return r = dd.bind(null, e), n = je(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Me(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function dd(e, t) {
		if (su !== 0 && su !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Gu() && e.callbackNode !== n) return null;
		var r = W;
		return r = tt(e, e === H ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (yu(e, r, t), ud(e, Fe()), e.callbackNode != null && e.callbackNode === n ? dd.bind(null, e) : null);
	}
	function fd(e, t) {
		if (Gu()) return null;
		yu(e, t, !0);
	}
	function pd() {
		Qd(function() {
			V & 6 ? je(Le, cd) : ld();
		});
	}
	function md() {
		if (ad === 0) {
			var e = ga;
			e === 0 && (e = Ze, Ze <<= 1, !(Ze & 261888) && (Ze = 256)), ad = e;
		}
		return ad;
	}
	function hd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : ln("" + e);
	}
	function gd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function _d(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = hd((i[_t] || null).action), o = r.submitter;
			o && (t = (t = o[_t] || null) ? hd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new jn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (ad !== 0) {
								var e = o ? gd(i, o) : new FormData(i);
								js(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? gd(i, o) : new FormData(i), js(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var vd = 0; vd < ti.length; vd++) {
		var yd = ti[vd];
		ni(yd.toLowerCase(), "on" + (yd[0].toUpperCase() + yd.slice(1)));
	}
	ni(qr, "onAnimationEnd"), ni(Jr, "onAnimationIteration"), ni(Yr, "onAnimationStart"), ni("dblclick", "onDoubleClick"), ni("focusin", "onFocus"), ni("focusout", "onBlur"), ni(Xr, "onTransitionRun"), ni(Zr, "onTransitionStart"), ni(Qr, "onTransitionCancel"), ni($r, "onTransitionEnd"), Nt("onMouseEnter", ["mouseout", "mouseover"]), Nt("onMouseLeave", ["mouseout", "mouseover"]), Nt("onPointerEnter", ["pointerout", "pointerover"]), Nt("onPointerLeave", ["pointerout", "pointerover"]), Mt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Mt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Mt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Mt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Mt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Mt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var bd = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), xd = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(bd));
	function Sd(e, t) {
		t = (t & 4) != 0;
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						ri(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						ri(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function X(e, t) {
		var n = t[yt];
		n === void 0 && (n = t[yt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Ed(t, e, 2, !1), n.add(r));
	}
	function Cd(e, t, n) {
		var r = 0;
		t && (r |= 4), Ed(n, e, r, t);
	}
	var wd = "_reactListening" + Math.random().toString(36).slice(2);
	function Td(e) {
		if (!e[wd]) {
			e[wd] = !0, At.forEach(function(t) {
				t !== "selectionchange" && (xd.has(t) || Cd(t, !1, e), Cd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[wd] || (t[wd] = !0, Cd("selectionchange", !1, t));
		}
	}
	function Ed(e, t, n, r) {
		switch (_p(t)) {
			case 2:
				var i = dp;
				break;
			case 8:
				i = fp;
				break;
			default: i = pp;
		}
		n = i.bind(null, t, n, e), i = void 0, !bn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Dd(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = Tt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		_n(function() {
			var r = a, i = fn(n), s = [];
			a: {
				var c = ei.get(e);
				if (c !== void 0) {
					var l = jn, u = e;
					switch (e) {
						case "keypress": if (En(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Kn;
							break;
						case "focusin":
							u = "focus", l = Ln;
							break;
						case "focusout":
							u = "blur", l = Ln;
							break;
						case "beforeblur":
						case "afterblur":
							l = Ln;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = In;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = j;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Jn;
							break;
						case qr:
						case Jr:
						case Yr:
							l = Rn;
							break;
						case $r:
							l = Yn;
							break;
						case "scroll":
						case "scrollend":
							l = k;
							break;
						case "wheel":
							l = Xn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = zn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = qn;
							break;
						case "toggle":
						case "beforetoggle": l = Zn;
					}
					var d = (t & 4) != 0, f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = vn(m, p), g != null && d.push(Od(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== dn && (u = n.relatedTarget || n.fromElement) && (Tt(u) || u[vt])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? Tt(u) : null, u !== null && (f = o(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = In, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = qn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : Dt(l), h = u == null ? c : Dt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, Tt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
							for (d = Ad, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
							g = 0;
							for (var _ = m; _; _ = d(_)) g++;
							for (; 0 < h - g;) p = d(p), h--;
							for (; 0 < g - h;) m = d(m), g--;
							for (; h--;) {
								if (p === m || m !== null && p === m.alternate) {
									d = p;
									break b;
								}
								p = d(p), m = d(m);
							}
							d = null;
						}
						else d = null;
						l !== null && jd(s, c, l, d, !1), u !== null && f !== null && jd(s, f, u, d, !0);
					}
				}
				a: {
					if (c = r ? Dt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = _r;
					else if (dr(c)) if (vr) v = Dr;
					else {
						v = Tr;
						var y = wr;
					}
					else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && on(r.elementType) && (v = _r) : v = Er;
					if (v &&= v(e, r)) {
						fr(s, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Zt(c, "number", c.value);
				}
				switch (y = r ? Dt(r) : window, e) {
					case "focusin":
						(dr(y) || y.contentEditable === "true") && (Lr = y, Rr = r, zr = null);
						break;
					case "focusout":
						zr = Rr = Lr = null;
						break;
					case "mousedown":
						Br = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Br = !1, Vr(s, n, i);
						break;
					case "selectionchange": if (Ir) break;
					case "keydown":
					case "keyup": Vr(s, n, i);
				}
				var b;
				if ($n) b: {
					switch (e) {
						case "compositionstart":
							var x = "onCompositionStart";
							break b;
						case "compositionend":
							x = "onCompositionEnd";
							break b;
						case "compositionupdate":
							x = "onCompositionUpdate";
							break b;
					}
					x = void 0;
				}
				else sr ? ar(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (nr && n.locale !== "ko" && (sr || x !== "onCompositionStart" ? x === "onCompositionEnd" && sr && (b = Tn()) : (Sn = i, Cn = "value" in Sn ? Sn.value : Sn.textContent, sr = !0)), y = kd(r, x), 0 < y.length && (x = new Bn(x, e, null, n, i), s.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = or(n), b !== null && (x.data = b)))), (b = tr ? cr(e, n) : lr(e, n)) && (x = kd(r, "onBeforeInput"), 0 < x.length && (y = new Bn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: y,
					listeners: x
				}), y.data = b)), _d(s, e, r, n, i);
			}
			Sd(s, t);
		});
	}
	function Od(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function kd(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = vn(e, n), i != null && r.unshift(Od(e, i, a)), i = vn(e, t), i != null && r.push(Od(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Ad(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function jd(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = vn(n, a), l != null && o.unshift(Od(n, l, c))) : i || (l = vn(n, a), l != null && o.push(Od(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Md = /\r\n?/g, Nd = /\u0000|\uFFFD/g;
	function Pd(e) {
		return (typeof e == "string" ? e : "" + e).replace(Md, "\n").replace(Nd, "");
	}
	function Fd(e, t) {
		return t = Pd(t), Pd(e) === t;
	}
	function Z(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || tn(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && tn(e, "" + r);
				break;
			case "className":
				zt(e, "class", r);
				break;
			case "tabIndex":
				zt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				zt(e, n, r);
				break;
			case "style":
				an(e, r, o);
				break;
			case "data": if (t !== "object") {
				zt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href")) {
					e.removeAttribute(n);
					break;
				}
				if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = ln("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				} else typeof o == "function" && (n === "formAction" ? (t !== "input" && Z(e, t, "name", a.name, a, null), Z(e, t, "formEncType", a.formEncType, a, null), Z(e, t, "formMethod", a.formMethod, a, null), Z(e, t, "formTarget", a.formTarget, a, null)) : (Z(e, t, "encType", a.encType, a, null), Z(e, t, "method", a.method, a, null), Z(e, t, "target", a.target, a, null)));
				if (r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = ln("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = un);
				break;
			case "onScroll":
				r != null && X("scroll", e);
				break;
			case "onScrollEnd":
				r != null && X("scrollend", e);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = ln("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "" + r) : e.removeAttribute(n);
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
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				X("beforetoggle", e), X("toggle", e), Rt(e, "popover", r);
				break;
			case "xlinkActuate":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Rt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = sn.get(n) || n, Rt(e, n, r));
		}
	}
	function Id(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				an(e, r, o);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "children":
				typeof r == "string" ? tn(e, r) : (typeof r == "number" || typeof r == "bigint") && tn(e, "" + r);
				break;
			case "onScroll":
				r != null && X("scroll", e);
				break;
			case "onScrollEnd":
				r != null && X("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = un);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!jt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), t = n.slice(2, a ? n.length - 7 : void 0), o = e[_t] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, a), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, a);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Rt(e, n, r);
			}
		}
	}
	function Ld(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				X("error", e), X("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: Z(e, t, o, s, n, null);
					}
				}
				a && Z(e, t, "srcSet", n.srcSet, n, null), r && Z(e, t, "src", n.src, n, null);
				return;
			case "input":
				X("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: Z(e, t, r, d, n, null);
					}
				}
				Xt(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in X("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: Z(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Qt(e, !!r, n, !0) : Qt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in X("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: Z(e, t, s, c, n, null);
				}
				en(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: Z(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				X("beforetoggle", e), X("toggle", e), X("cancel", e), X("close", e);
				break;
			case "iframe":
			case "object":
				X("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < bd.length; r++) X(bd[r], e);
				break;
			case "image":
				X("error", e), X("load", e);
				break;
			case "details":
				X("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": X("error", e), X("load", e);
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
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: Z(e, t, u, r, n, null);
				}
				return;
			default: if (on(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && Id(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && Z(e, t, c, r, n, null));
	}
	function Rd(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || Z(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							o = m;
							break;
						case "name":
							a = m;
							break;
						case "checked":
							u = m;
							break;
						case "defaultChecked":
							d = m;
							break;
						case "value":
							s = m;
							break;
						case "defaultValue":
							c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && Z(e, t, p, m, r, f);
					}
				}
				Yt(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || Z(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && Z(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Qt(e, !!n, n ? [] : "", !1) : Qt(e, !!n, t, !0)) : Qt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: Z(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						p = a;
						break;
					case "defaultValue":
						m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && Z(e, t, s, a, r, o);
				}
				$t(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: Z(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: Z(e, t, l, p, r, m);
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
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && Z(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: Z(e, t, u, p, r, m);
				}
				return;
			default: if (on(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && Id(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || Id(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && Z(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || Z(e, t, f, p, r, m);
	}
	function zd(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function Bd() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && zd(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && zd(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var Vd = null, Hd = null;
	function Ud(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function Wd(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function Gd(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function Kd(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var qd = null;
	function Jd() {
		var e = window.event;
		return e && e.type === "popstate" ? e === qd ? !1 : (qd = e, !0) : (qd = null, !1);
	}
	var Yd = typeof setTimeout == "function" ? setTimeout : void 0, Xd = typeof clearTimeout == "function" ? clearTimeout : void 0, Zd = typeof Promise == "function" ? Promise : void 0, Qd = typeof queueMicrotask == "function" ? queueMicrotask : Zd === void 0 ? Yd : function(e) {
		return Zd.resolve(null).then(e).catch($d);
	};
	function $d(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function ef(e) {
		return e === "head";
	}
	function tf(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === "/$" || n === "/&") {
				if (r === 0) {
					e.removeChild(i), Ip(t);
					return;
				}
				r--;
			} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
			else if (n === "html") gf(e.ownerDocument.documentElement);
			else if (n === "head") {
				n = e.ownerDocument.head, gf(n);
				for (var a = n.firstChild; a;) {
					var o = a.nextSibling, s = a.nodeName;
					a[Ct] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
				}
			} else n === "body" && gf(e.ownerDocument.body);
			n = i;
		} while (n);
		Ip(t);
	}
	function nf(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) if (n = r.data, n === "/$") {
				if (e === 0) break;
				e--;
			} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			n = r;
		} while (n);
	}
	function rf(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					rf(n), wt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function af(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) if (t === "input" && e.type === "hidden") {
				var a = i.name == null ? null : "" + i.name;
				if (i.type === "hidden" && e.getAttribute("name") === a) return e;
			} else return e;
			else if (!e[Ct]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = df(e.nextSibling), e === null) break;
		}
		return null;
	}
	function of(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = df(e.nextSibling), e === null)) return null;
		return e;
	}
	function sf(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = df(e.nextSibling), e === null)) return null;
		return e;
	}
	function cf(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function lf(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function uf(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function df(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var ff = null;
	function pf(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return df(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function mf(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function hf(e, t, n) {
		switch (t = Ud(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function gf(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		wt(e);
	}
	var _f = /* @__PURE__ */ new Map(), vf = /* @__PURE__ */ new Set();
	function yf(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var bf = D.d;
	D.d = {
		f: xf,
		r: Sf,
		D: Tf,
		C: Ef,
		L: Df,
		m: Of,
		X: Af,
		S: kf,
		M: jf
	};
	function xf() {
		var e = bf.f(), t = Cu();
		return e || t;
	}
	function Sf(e) {
		var t = Et(e);
		t !== null && t.tag === 5 && t.type === "form" ? Ns(t) : bf.r(e);
	}
	var Cf = typeof document > "u" ? null : document;
	function wf(e, t, n) {
		var r = Cf;
		if (r && typeof t == "string" && t) {
			var i = Jt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), vf.has(i) || (vf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Ld(t, "link", e), kt(t), r.head.appendChild(t)));
		}
	}
	function Tf(e) {
		bf.D(e), wf("dns-prefetch", e, null);
	}
	function Ef(e, t) {
		bf.C(e, t), wf("preconnect", e, t);
	}
	function Df(e, t, n) {
		bf.L(e, t, n);
		var r = Cf;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + Jt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Jt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Jt(n.imageSizes) + "\"]")) : i += "[href=\"" + Jt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Nf(e);
					break;
				case "script": a = Lf(e);
			}
			_f.has(a) || (e = h({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), _f.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Pf(a)) || t === "script" && r.querySelector(Rf(a)) || (t = r.createElement("link"), Ld(t, "link", e), kt(t), r.head.appendChild(t)));
		}
	}
	function Of(e, t) {
		bf.m(e, t);
		var n = Cf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Jt(r) + "\"][href=\"" + Jt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Lf(e);
			}
			if (!_f.has(a) && (e = h({
				rel: "modulepreload",
				href: e
			}, t), _f.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Rf(a))) return;
				}
				r = n.createElement("link"), Ld(r, "link", e), kt(r), n.head.appendChild(r);
			}
		}
	}
	function kf(e, t, n) {
		bf.S(e, t, n);
		var r = Cf;
		if (r && e) {
			var i = Ot(r).hoistableStyles, a = Nf(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Pf(a))) s.loading = 5;
				else {
					e = h({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = _f.get(a)) && Vf(e, n);
					var c = o = r.createElement("link");
					kt(c), Ld(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Bf(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Af(e, t) {
		bf.X(e, t);
		var n = Cf;
		if (n && e) {
			var r = Ot(n).hoistableScripts, i = Lf(e), a = r.get(i);
			a || (a = n.querySelector(Rf(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = _f.get(i)) && Hf(e, t), a = n.createElement("script"), kt(a), Ld(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function jf(e, t) {
		bf.M(e, t);
		var n = Cf;
		if (n && e) {
			var r = Ot(n).hoistableScripts, i = Lf(e), a = r.get(i);
			a || (a = n.querySelector(Rf(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = _f.get(i)) && Hf(e, t), a = n.createElement("script"), kt(a), Ld(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mf(e, t, n, r) {
		var a = (a = _e.current) ? yf(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Nf(n.href), n = Ot(a).hoistableStyles, r = n.get(t), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Nf(n.href);
					var o = Ot(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Pf(e))) && !o._p && (s.instance = o, s.state.loading = 5), _f.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, _f.set(e, n), o || If(a, e, n, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Lf(n), n = Ot(a).hoistableScripts, r = n.get(t), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Nf(e) {
		return "href=\"" + Jt(e) + "\"";
	}
	function Pf(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Ff(e) {
		return h({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function If(e, t, n, r) {
		e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		}), Ld(t, "link", n), kt(t), e.head.appendChild(t));
	}
	function Lf(e) {
		return "[src=\"" + Jt(e) + "\"]";
	}
	function Rf(e) {
		return "script[async]" + e;
	}
	function zf(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Jt(n.href) + "\"]");
				if (r) return t.instance = r, kt(r), r;
				var a = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), kt(r), Ld(r, "style", a), Bf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Nf(n.href);
				var o = e.querySelector(Pf(a));
				if (o) return t.state.loading |= 4, t.instance = o, kt(o), o;
				r = Ff(n), (a = _f.get(a)) && Vf(r, a), o = (e.ownerDocument || e).createElement("link"), kt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Ld(o, "link", r), t.state.loading |= 4, Bf(o, n.precedence, e), t.instance = o;
			case "script": return o = Lf(n.src), (a = e.querySelector(Rf(o))) ? (t.instance = a, kt(a), a) : (r = n, (a = _f.get(o)) && (r = h({}, n), Hf(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), kt(a), Ld(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Bf(r, n.precedence, e));
		return t.instance;
	}
	function Bf(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Vf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Hf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Uf = null;
	function Wf(e, t, n) {
		if (Uf === null) {
			var r = /* @__PURE__ */ new Map(), i = Uf = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Uf, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[Ct] || a[gt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Gf(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Kf(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function qf(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Jf(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Nf(r.href), a = t.querySelector(Pf(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Zf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, kt(a);
					return;
				}
				a = t.ownerDocument || t, r = Ff(r), (i = _f.get(i)) && Vf(r, i), a = a.createElement("link"), kt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Ld(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = Zf.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var Yf = 0;
	function Xf(e, t) {
		return e.stylesheets && e.count === 0 && $f(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && $f(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && Yf === 0 && (Yf = 62500 * Bd());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && $f(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > Yf ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function Zf() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) $f(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				this.unsuspend = null, e();
			}
		}
	}
	var Qf = null;
	function $f(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, Qf = /* @__PURE__ */ new Map(), t.forEach(ep, e), Qf = null, Zf.call(e));
	}
	function ep(e, t) {
		if (!(t.state.loading & 4)) {
			var n = Qf.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), Qf.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = Zf.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var tp = {
		$$typeof: te,
		Provider: null,
		Consumer: null,
		_currentValue: ue,
		_currentValue2: ue,
		_threadCount: 0
	};
	function np(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = at(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = at(0), this.hiddenUpdates = at(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function rp(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new np(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = M(3, null, null, t), e.current = a, a.stateNode = e, t = fa(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Ga(a), e;
	}
	function ip(e) {
		return e ? (e = pi, e) : pi;
	}
	function ap(e, t, n, r, i, a) {
		i = ip(i), r.context === null ? r.context = i : r.pendingContext = i, r = qa(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Ja(e, r, t), n !== null && (vu(n, e, t), Ya(n, e, t));
	}
	function op(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function sp(e, t) {
		op(e, t), (e = e.alternate) && op(e, t);
	}
	function cp(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = ui(e, 67108864);
			t !== null && vu(t, e, 67108864), sp(e, 67108864);
		}
	}
	function lp(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = gu();
			t = dt(t);
			var n = ui(e, t);
			n !== null && vu(n, e, t), sp(e, t);
		}
	}
	var up = !0;
	function dp(e, t, n, r) {
		var i = E.T;
		E.T = null;
		var a = D.p;
		try {
			D.p = 2, pp(e, t, n, r);
		} finally {
			D.p = a, E.T = i;
		}
	}
	function fp(e, t, n, r) {
		var i = E.T;
		E.T = null;
		var a = D.p;
		try {
			D.p = 8, pp(e, t, n, r);
		} finally {
			D.p = a, E.T = i;
		}
	}
	function pp(e, t, n, r) {
		if (up) {
			var i = mp(r);
			if (i === null) Dd(e, t, r, hp, n), Ep(e, r);
			else if (Op(i, e, t, n, r)) r.stopPropagation();
			else if (Ep(e, r), t & 4 && -1 < Tp.indexOf(e)) {
				for (; i !== null;) {
					var a = Et(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = et(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - qe(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									od(a), !(V & 6) && (iu = Fe() + 500, sd(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = ui(a, 2), s !== null && vu(s, a, 2), Cu(), sp(a, 2);
					}
					if (a = mp(r), a === null && Dd(e, t, r, hp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Dd(e, t, r, null, n);
		}
	}
	function mp(e) {
		return e = fn(e), gp(e);
	}
	var hp = null;
	function gp(e) {
		if (hp = null, e = Tt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return hp = e, null;
	}
	function _p(e) {
		switch (e) {
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
			case "selectstart": return 2;
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
			case "pointerleave": return 8;
			case "message": switch (Ie()) {
				case Le: return 2;
				case Re: return 8;
				case ze:
				case Be: return 32;
				case Ve: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var vp = !1, yp = null, bp = null, xp = null, Sp = /* @__PURE__ */ new Map(), Cp = /* @__PURE__ */ new Map(), wp = [], Tp = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Ep(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				yp = null;
				break;
			case "dragenter":
			case "dragleave":
				bp = null;
				break;
			case "mouseover":
			case "mouseout":
				xp = null;
				break;
			case "pointerover":
			case "pointerout":
				Sp.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": Cp.delete(t.pointerId);
		}
	}
	function Dp(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Et(t), t !== null && cp(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Op(e, t, n, r, i) {
		switch (t) {
			case "focusin": return yp = Dp(yp, e, t, n, r, i), !0;
			case "dragenter": return bp = Dp(bp, e, t, n, r, i), !0;
			case "mouseover": return xp = Dp(xp, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Sp.set(a, Dp(Sp.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, Cp.set(a, Dp(Cp.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function kp(e) {
		var t = Tt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, mt(e.priority, function() {
							lp(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, mt(e.priority, function() {
							lp(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ap(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = mp(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				dn = r, n.target.dispatchEvent(r), dn = null;
			} else return t = Et(n), t !== null && cp(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function jp(e, t, n) {
		Ap(e) && n.delete(t);
	}
	function Mp() {
		vp = !1, yp !== null && Ap(yp) && (yp = null), bp !== null && Ap(bp) && (bp = null), xp !== null && Ap(xp) && (xp = null), Sp.forEach(jp), Cp.forEach(jp);
	}
	function Np(e, n) {
		e.blockedOn === n && (e.blockedOn = null, vp || (vp = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Mp)));
	}
	var Pp = null;
	function Fp(e) {
		Pp !== e && (Pp = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Pp === e && (Pp = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (gp(r || n) === null) continue;
					break;
				}
				var a = Et(n);
				a !== null && (e.splice(t, 3), t -= 3, js(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Ip(e) {
		function t(t) {
			return Np(t, e);
		}
		yp !== null && Np(yp, e), bp !== null && Np(bp, e), xp !== null && Np(xp, e), Sp.forEach(t), Cp.forEach(t);
		for (var n = 0; n < wp.length; n++) {
			var r = wp[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < wp.length && (n = wp[0], n.blockedOn === null);) kp(n), n.blockedOn === null && wp.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[_t] || null;
			if (typeof a == "function") o || Fp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[_t] || null) s = o.formAction;
					else if (gp(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Fp(n);
			}
		}
	}
	function Lp() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Rp(e) {
		this._internalRoot = e;
	}
	zp.prototype.render = Rp.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		ap(n, gu(), e, t, null, null);
	}, zp.prototype.unmount = Rp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			ap(e.current, 2, null, e, null, null), Cu(), t[vt] = null;
		}
	};
	function zp(e) {
		this._internalRoot = e;
	}
	zp.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = pt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < wp.length && t !== 0 && t < wp[n].priority; n++);
			wp.splice(n, 0, e), n === 0 && kp(e);
		}
	};
	var Bp = n.version;
	if (Bp !== "19.2.7") throw Error(i(527, Bp, "19.2.7"));
	D.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var Vp = {
		bundleType: 0,
		version: "19.2.7",
		rendererPackageName: "react-dom",
		currentDispatcherRef: E,
		reconcilerVersion: "19.2.7"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Hp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Hp.isDisabled && Hp.supportsFiber) try {
			We = Hp.inject(Vp), Ge = Hp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = ec, s = tc, c = nc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = rp(e, 1, !1, null, null, n, r, null, o, s, c, Lp), e[vt] = t.current, Td(e), new Rp(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var r = typeof Object.is == "function" ? Object.is : n, i = t.useState, a = t.useEffect, o = t.useLayoutEffect, s = t.useDebugValue;
	function c(e, t) {
		var n = t(), r = i({ inst: {
			value: n,
			getSnapshot: t
		} }), c = r[0].inst, u = r[1];
		return o(function() {
			c.value = n, c.getSnapshot = t, l(c) && u({ inst: c });
		}, [
			e,
			n,
			t
		]), a(function() {
			return l(c) && u({ inst: c }), e(function() {
				l(c) && u({ inst: c });
			});
		}, [e]), s(n), n;
	}
	function l(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !r(e, n);
		} catch {
			return !0;
		}
	}
	function d(e, t) {
		return t();
	}
	var f = typeof window > "u" || window.document === void 0 || window.document.createElement === void 0 ? d : c;
	e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? f : t.useSyncExternalStore;
})), v = /* @__PURE__ */ o(((e, t) => {
	t.exports = _();
})), y = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), b = /* @__PURE__ */ o(((e, t) => {
	t.exports = y();
}));
//#endregion
//#region node_modules/orderedmap/dist/index.js
function x(e) {
	this.content = e;
}
x.prototype = {
	constructor: x,
	find: function(e) {
		for (var t = 0; t < this.content.length; t += 2) if (this.content[t] === e) return t;
		return -1;
	},
	get: function(e) {
		var t = this.find(e);
		return t == -1 ? void 0 : this.content[t + 1];
	},
	update: function(e, t, n) {
		var r = n && n != e ? this.remove(n) : this, i = r.find(e), a = r.content.slice();
		return i == -1 ? a.push(n || e, t) : (a[i + 1] = t, n && (a[i] = n)), new x(a);
	},
	remove: function(e) {
		var t = this.find(e);
		if (t == -1) return this;
		var n = this.content.slice();
		return n.splice(t, 2), new x(n);
	},
	addToStart: function(e, t) {
		return new x([e, t].concat(this.remove(e).content));
	},
	addToEnd: function(e, t) {
		var n = this.remove(e).content.slice();
		return n.push(e, t), new x(n);
	},
	addBefore: function(e, t, n) {
		var r = this.remove(t), i = r.content.slice(), a = r.find(e);
		return i.splice(a == -1 ? i.length : a, 0, t, n), new x(i);
	},
	forEach: function(e) {
		for (var t = 0; t < this.content.length; t += 2) e(this.content[t], this.content[t + 1]);
	},
	prepend: function(e) {
		return e = x.from(e), e.size ? new x(e.content.concat(this.subtract(e).content)) : this;
	},
	append: function(e) {
		return e = x.from(e), e.size ? new x(this.subtract(e).content.concat(e.content)) : this;
	},
	subtract: function(e) {
		var t = this;
		e = x.from(e);
		for (var n = 0; n < e.content.length; n += 2) t = t.remove(e.content[n]);
		return t;
	},
	toObject: function() {
		var e = {};
		return this.forEach(function(t, n) {
			e[t] = n;
		}), e;
	},
	get size() {
		return this.content.length >> 1;
	}
}, x.from = function(e) {
	if (e instanceof x) return e;
	var t = [];
	if (e) for (var n in e) t.push(n, e[n]);
	return new x(t);
};
//#endregion
//#region node_modules/prosemirror-model/dist/index.js
function ee(e, t, n) {
	for (let r = 0;; r++) {
		if (r == e.childCount || r == t.childCount) return e.childCount == t.childCount ? null : n;
		let i = e.child(r), a = t.child(r);
		if (i == a) {
			n += i.nodeSize;
			continue;
		}
		if (!i.sameMarkup(a)) return n;
		if (i.isText && i.text != a.text) {
			let e = i.text, t = a.text, r = 0;
			for (; e[r] == t[r]; r++) n++;
			return r && r < e.length && r < t.length && ne(e.charCodeAt(r - 1)) && S(e.charCodeAt(r)) && n--, n;
		}
		if (i.content.size || a.content.size) {
			let e = ee(i.content, a.content, n + 1);
			if (e != null) return e;
		}
		n += i.nodeSize;
	}
}
function te(e, t, n, r) {
	for (let i = e.childCount, a = t.childCount;;) {
		if (i == 0 || a == 0) return i == a ? null : {
			a: n,
			b: r
		};
		let o = e.child(--i), s = t.child(--a), c = o.nodeSize;
		if (o == s) {
			n -= c, r -= c;
			continue;
		}
		if (!o.sameMarkup(s)) return {
			a: n,
			b: r
		};
		if (o.isText && o.text != s.text) {
			let e = o.text, t = s.text, i = e.length, a = t.length;
			for (; i > 0 && a > 0 && e[i - 1] == t[a - 1];) i--, a--, n--, r--;
			return i && a && i < e.length && ne(e.charCodeAt(i - 1)) && S(e.charCodeAt(i)) && (n++, r++), {
				a: n,
				b: r
			};
		}
		if (o.content.size || s.content.size) {
			let e = te(o.content, s.content, n - 1, r - 1);
			if (e) return e;
		}
		n -= c, r -= c;
	}
}
function S(e) {
	return e >= 56320 && e < 57344;
}
function ne(e) {
	return e >= 55296 && e < 56320;
}
var C = class e {
	constructor(e, t) {
		if (this.content = e, this.size = t || 0, t == null) for (let t = 0; t < e.length; t++) this.size += e[t].nodeSize;
	}
	nodesBetween(e, t, n, r = 0, i) {
		for (let a = 0, o = 0; o < t; a++) {
			let s = this.content[a], c = o + s.nodeSize;
			if (c > e && n(s, r + o, i || null, a) !== !1 && s.content.size) {
				let i = o + 1;
				s.nodesBetween(Math.max(0, e - i), Math.min(s.content.size, t - i), n, r + i);
			}
			o = c;
		}
	}
	descendants(e) {
		this.nodesBetween(0, this.size, e);
	}
	textBetween(e, t, n, r) {
		let i = "", a = !0;
		return this.nodesBetween(e, t, (o, s) => {
			let c = o.isText ? o.text.slice(Math.max(e, s) - s, t - s) : o.isLeaf ? r ? typeof r == "function" ? r(o) : r : o.type.spec.leafText ? o.type.spec.leafText(o) : "" : "";
			o.isBlock && (o.isLeaf && c || o.isTextblock) && n && (a ? a = !1 : i += n), i += c;
		}, 0), i;
	}
	append(t) {
		if (!t.size) return this;
		if (!this.size) return t;
		let n = this.lastChild, r = t.firstChild, i = this.content.slice(), a = 0;
		for (n.isText && n.sameMarkup(r) && (i[i.length - 1] = n.withText(n.text + r.text), a = 1); a < t.content.length; a++) i.push(t.content[a]);
		return new e(i, this.size + t.size);
	}
	cut(t, n = this.size) {
		if (t == 0 && n == this.size) return this;
		let r = [], i = 0;
		if (n > t) for (let e = 0, a = 0; a < n; e++) {
			let o = this.content[e], s = a + o.nodeSize;
			s > t && ((a < t || s > n) && (o = o.isText ? o.cut(Math.max(0, t - a), Math.min(o.text.length, n - a)) : o.cut(Math.max(0, t - a - 1), Math.min(o.content.size, n - a - 1))), r.push(o), i += o.nodeSize), a = s;
		}
		return new e(r, i);
	}
	cutByIndex(t, n) {
		return t == n ? e.empty : t == 0 && n == this.content.length ? this : new e(this.content.slice(t, n));
	}
	replaceChild(t, n) {
		let r = this.content[t];
		if (r == n) return this;
		let i = this.content.slice(), a = this.size + n.nodeSize - r.nodeSize;
		return i[t] = n, new e(i, a);
	}
	addToStart(t) {
		return new e([t].concat(this.content), this.size + t.nodeSize);
	}
	addToEnd(t) {
		return new e(this.content.concat(t), this.size + t.nodeSize);
	}
	eq(e) {
		if (this.content.length != e.content.length) return !1;
		for (let t = 0; t < this.content.length; t++) if (!this.content[t].eq(e.content[t])) return !1;
		return !0;
	}
	get firstChild() {
		return this.content.length ? this.content[0] : null;
	}
	get lastChild() {
		return this.content.length ? this.content[this.content.length - 1] : null;
	}
	get childCount() {
		return this.content.length;
	}
	child(e) {
		let t = this.content[e];
		if (!t) throw RangeError("Index " + e + " out of range for " + this);
		return t;
	}
	maybeChild(e) {
		return this.content[e] || null;
	}
	forEach(e) {
		for (let t = 0, n = 0; t < this.content.length; t++) {
			let r = this.content[t];
			e(r, n, t), n += r.nodeSize;
		}
	}
	findDiffStart(e, t = 0) {
		return ee(this, e, t);
	}
	findDiffEnd(e, t = this.size, n = e.size) {
		return te(this, e, t, n);
	}
	findIndex(e) {
		if (e == 0) return ie(0, e);
		if (e == this.size) return ie(this.content.length, e);
		if (e > this.size || e < 0) throw RangeError(`Position ${e} outside of fragment (${this})`);
		for (let t = 0, n = 0;; t++) {
			let r = this.child(t), i = n + r.nodeSize;
			if (i >= e) return i == e ? ie(t + 1, i) : ie(t, n);
			n = i;
		}
	}
	toString() {
		return "<" + this.toStringInner() + ">";
	}
	toStringInner() {
		return this.content.join(", ");
	}
	toJSON() {
		return this.content.length ? this.content.map((e) => e.toJSON()) : null;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		if (!Array.isArray(n)) throw RangeError("Invalid input for Fragment.fromJSON");
		return e.fromArray(n.map(t.nodeFromJSON));
	}
	static fromArray(t) {
		if (!t.length) return e.empty;
		let n, r = 0;
		for (let e = 0; e < t.length; e++) {
			let i = t[e];
			r += i.nodeSize, e && i.isText && t[e - 1].sameMarkup(i) ? (n ||= t.slice(0, e), n[n.length - 1] = i.withText(n[n.length - 1].text + i.text)) : n && n.push(i);
		}
		return new e(n || t, r);
	}
	static from(t) {
		if (!t) return e.empty;
		if (t instanceof e) return t;
		if (Array.isArray(t)) return this.fromArray(t);
		if (t.attrs) return new e([t], t.nodeSize);
		throw RangeError("Can not convert " + t + " to a Fragment" + (t.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
	}
};
C.empty = new C([], 0);
var re = {
	index: 0,
	offset: 0
};
function ie(e, t) {
	return re.index = e, re.offset = t, re;
}
function ae(e, t) {
	if (e === t) return !0;
	if (!(e && typeof e == "object") || !(t && typeof t == "object")) return !1;
	let n = Array.isArray(e);
	if (Array.isArray(t) != n) return !1;
	if (n) {
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!ae(e[n], t[n])) return !1;
	} else {
		for (let n in e) if (!(n in t) || !ae(e[n], t[n])) return !1;
		for (let n in t) if (!(n in e)) return !1;
	}
	return !0;
}
var w = class e {
	constructor(e, t) {
		this.type = e, this.attrs = t;
	}
	addToSet(e) {
		let t, n = !1;
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.eq(i)) return e;
			if (this.type.excludes(i.type)) t ||= e.slice(0, r);
			else if (i.type.excludes(this.type)) return e;
			else !n && i.type.rank > this.type.rank && (t ||= e.slice(0, r), t.push(this), n = !0), t && t.push(i);
		}
		return t ||= e.slice(), n || t.push(this), t;
	}
	removeFromSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
		return !1;
	}
	eq(e) {
		return this == e || this.type == e.type && ae(this.attrs, e.attrs);
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Mark.fromJSON");
		let n = e.marks[t.type];
		if (!n) throw RangeError(`There is no mark type ${t.type} in this schema`);
		let r = n.create(t.attrs);
		return n.checkAttrs(r.attrs), r;
	}
	static sameSet(e, t) {
		if (e == t) return !0;
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!e[n].eq(t[n])) return !1;
		return !0;
	}
	static setFrom(t) {
		if (!t || Array.isArray(t) && t.length == 0) return e.none;
		if (t instanceof e) return [t];
		let n = t.slice();
		return n.sort((e, t) => e.type.rank - t.type.rank), n;
	}
};
w.none = [];
var oe = class extends Error {}, T = class e {
	constructor(e, t, n) {
		this.content = e, this.openStart = t, this.openEnd = n;
	}
	get size() {
		return this.content.size - this.openStart - this.openEnd;
	}
	insertAt(t, n) {
		let r = ce(this.content, t + this.openStart, n, this.openStart + 1, this.openEnd + 1);
		return r && new e(r, this.openStart, this.openEnd);
	}
	removeBetween(t, n) {
		return new e(se(this.content, t + this.openStart, n + this.openStart), this.openStart, this.openEnd);
	}
	eq(e) {
		return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
	}
	toString() {
		return this.content + "(" + this.openStart + "," + this.openEnd + ")";
	}
	toJSON() {
		if (!this.content.size) return null;
		let e = { content: this.content.toJSON() };
		return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		let r = n.openStart || 0, i = n.openEnd || 0;
		if (typeof r != "number" || typeof i != "number") throw RangeError("Invalid input for Slice.fromJSON");
		return new e(C.fromJSON(t, n.content), r, i);
	}
	static maxOpen(t, n = !0) {
		let r = 0, i = 0;
		for (let e = t.firstChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.firstChild) r++;
		for (let e = t.lastChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.lastChild) i++;
		return new e(t, r, i);
	}
};
T.empty = new T(C.empty, 0, 0);
function se(e, t, n) {
	let { index: r, offset: i } = e.findIndex(t), a = e.maybeChild(r), { index: o, offset: s } = e.findIndex(n);
	if (i == t || a.isText) {
		if (s != n && !e.child(o).isText) throw RangeError("Removing non-flat range");
		return e.cut(0, t).append(e.cut(n));
	}
	if (r != o) throw RangeError("Removing non-flat range");
	return e.replaceChild(r, a.copy(se(a.content, t - i - 1, n - i - 1)));
}
function ce(e, t, n, r, i, a) {
	let { index: o, offset: s } = e.findIndex(t), c = e.maybeChild(o);
	if (s == t || c.isText) return a && r <= 0 && i <= 0 && !a.canReplace(o, o, n) ? null : e.cut(0, t).append(n).append(e.cut(t));
	let l = ce(c.content, t - s - 1, n, o == 0 ? r - 1 : 0, o == e.childCount - 1 ? i - 1 : 0, c);
	return l && e.replaceChild(o, c.copy(l));
}
function le(e, t, n) {
	if (n.openStart > e.depth) throw new oe("Inserted content deeper than insertion position");
	if (e.depth - n.openStart != t.depth - n.openEnd) throw new oe("Inconsistent open depths");
	return E(e, t, n, 0);
}
function E(e, t, n, r) {
	let i = e.index(r), a = e.node(r);
	if (i == t.index(r) && r < e.depth - n.openStart) {
		let o = E(e, t, n, r + 1);
		return a.copy(a.content.replaceChild(i, o));
	} else if (!n.content.size) return pe(a, O(e, t, r));
	else if (!n.openStart && !n.openEnd && e.depth == r && t.depth == r) {
		let r = e.parent, i = r.content;
		return pe(r, i.cut(0, e.parentOffset).append(n.content).append(i.cut(t.parentOffset)));
	} else {
		let { start: i, end: o } = he(n, e);
		return pe(a, me(e, i, o, t, r));
	}
}
function D(e, t) {
	if (!t.type.compatibleContent(e.type)) throw new oe("Cannot join " + t.type.name + " onto " + e.type.name);
}
function ue(e, t, n) {
	let r = e.node(n);
	return D(r, t.node(n)), r;
}
function de(e, t) {
	let n = t.length - 1;
	n >= 0 && e.isText && e.sameMarkup(t[n]) ? t[n] = e.withText(t[n].text + e.text) : t.push(e);
}
function fe(e, t, n, r) {
	let i = (t || e).node(n), a = 0, o = t ? t.index(n) : i.childCount;
	e && (a = e.index(n), e.depth > n ? a++ : e.textOffset && (de(e.nodeAfter, r), a++));
	for (let e = a; e < o; e++) de(i.child(e), r);
	t && t.depth == n && t.textOffset && de(t.nodeBefore, r);
}
function pe(e, t) {
	if (!e.type.validContent(t)) throw new oe("Invalid content for node " + e.type.name);
	return e.copy(t);
}
function me(e, t, n, r, i) {
	let a = e.depth > i && ue(e, t, i + 1), o = r.depth > i && ue(n, r, i + 1), s = [];
	return fe(null, e, i, s), a && o && t.index(i) == n.index(i) ? (D(a, o), de(pe(a, me(e, t, n, r, i + 1)), s)) : (a && de(pe(a, O(e, t, i + 1)), s), fe(t, n, i, s), o && de(pe(o, O(n, r, i + 1)), s)), fe(r, null, i, s), new C(s);
}
function O(e, t, n) {
	let r = [];
	return fe(null, e, n, r), e.depth > n && de(pe(ue(e, t, n + 1), O(e, t, n + 1)), r), fe(t, null, n, r), new C(r);
}
function he(e, t) {
	let n = t.depth - e.openStart, r = t.node(n).copy(e.content);
	for (let e = n - 1; e >= 0; e--) r = t.node(e).copy(C.from(r));
	return {
		start: r.resolveNoCache(e.openStart + n),
		end: r.resolveNoCache(r.content.size - e.openEnd - n)
	};
}
var ge = class e {
	constructor(e, t, n) {
		this.pos = e, this.path = t, this.parentOffset = n, this.depth = t.length / 3 - 1;
	}
	resolveDepth(e) {
		return e == null ? this.depth : e < 0 ? this.depth + e : e;
	}
	get parent() {
		return this.node(this.depth);
	}
	get doc() {
		return this.node(0);
	}
	node(e) {
		return this.path[this.resolveDepth(e) * 3];
	}
	index(e) {
		return this.path[this.resolveDepth(e) * 3 + 1];
	}
	indexAfter(e) {
		return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
	}
	start(e) {
		return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
	}
	end(e) {
		return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
	}
	before(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position before the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
	}
	after(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position after the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
	}
	get textOffset() {
		return this.pos - this.path[this.path.length - 1];
	}
	get nodeAfter() {
		let e = this.parent, t = this.index(this.depth);
		if (t == e.childCount) return null;
		let n = this.pos - this.path[this.path.length - 1], r = e.child(t);
		return n ? e.child(t).cut(n) : r;
	}
	get nodeBefore() {
		let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
		return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
	}
	posAtIndex(e, t) {
		t = this.resolveDepth(t);
		let n = this.path[t * 3], r = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
		for (let t = 0; t < e; t++) r += n.child(t).nodeSize;
		return r;
	}
	marks() {
		let e = this.parent, t = this.index();
		if (e.content.size == 0) return w.none;
		if (this.textOffset) return e.child(t).marks;
		let n = e.maybeChild(t - 1), r = e.maybeChild(t);
		if (!n) {
			let e = n;
			n = r, r = e;
		}
		let i = n.marks;
		for (var a = 0; a < i.length; a++) i[a].type.spec.inclusive === !1 && (!r || !i[a].isInSet(r.marks)) && (i = i[a--].removeFromSet(i));
		return i;
	}
	marksAcross(e) {
		let t = this.parent.maybeChild(this.index());
		if (!t || !t.isInline) return null;
		let n = t.marks, r = e.parent.maybeChild(e.index());
		for (var i = 0; i < n.length; i++) n[i].type.spec.inclusive === !1 && (!r || !n[i].isInSet(r.marks)) && (n = n[i--].removeFromSet(n));
		return n;
	}
	sharedDepth(e) {
		for (let t = this.depth; t > 0; t--) if (this.start(t) <= e && this.end(t) >= e) return t;
		return 0;
	}
	blockRange(e = this, t) {
		if (e.pos < this.pos) return e.blockRange(this);
		for (let n = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); n >= 0; n--) if (e.pos <= this.end(n) && (!t || t(this.node(n)))) return new be(this, e, n);
		return null;
	}
	sameParent(e) {
		return this.pos - this.parentOffset == e.pos - e.parentOffset;
	}
	max(e) {
		return e.pos > this.pos ? e : this;
	}
	min(e) {
		return e.pos < this.pos ? e : this;
	}
	toString() {
		let e = "";
		for (let t = 1; t <= this.depth; t++) e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
		return e + ":" + this.parentOffset;
	}
	static resolve(t, n) {
		if (!(n >= 0 && n <= t.content.size)) throw RangeError("Position " + n + " out of range");
		let r = [], i = 0, a = n;
		for (let e = t;;) {
			let { index: t, offset: n } = e.content.findIndex(a), o = a - n;
			if (r.push(e, t, i + n), !o || (e = e.child(t), e.isText)) break;
			a = o - 1, i += n + 1;
		}
		return new e(n, r, a);
	}
	static resolveCached(t, n) {
		let r = ye.get(t);
		if (r) for (let e = 0; e < r.elts.length; e++) {
			let t = r.elts[e];
			if (t.pos == n) return t;
		}
		else ye.set(t, r = new _e());
		let i = r.elts[r.i] = e.resolve(t, n);
		return r.i = (r.i + 1) % ve, i;
	}
}, _e = class {
	constructor() {
		this.elts = [], this.i = 0;
	}
}, ve = 12, ye = /* @__PURE__ */ new WeakMap(), be = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.depth = n;
	}
	get start() {
		return this.$from.before(this.depth + 1);
	}
	get end() {
		return this.$to.after(this.depth + 1);
	}
	get parent() {
		return this.$from.node(this.depth);
	}
	get startIndex() {
		return this.$from.index(this.depth);
	}
	get endIndex() {
		return this.$to.indexAfter(this.depth);
	}
}, xe = Object.create(null), Se = class e {
	constructor(e, t, n, r = w.none) {
		this.type = e, this.attrs = t, this.marks = r, this.content = n || C.empty;
	}
	get children() {
		return this.content.content;
	}
	get nodeSize() {
		return this.isLeaf ? 1 : 2 + this.content.size;
	}
	get childCount() {
		return this.content.childCount;
	}
	child(e) {
		return this.content.child(e);
	}
	maybeChild(e) {
		return this.content.maybeChild(e);
	}
	forEach(e) {
		this.content.forEach(e);
	}
	nodesBetween(e, t, n, r = 0) {
		this.content.nodesBetween(e, t, n, r, this);
	}
	descendants(e) {
		this.nodesBetween(0, this.content.size, e);
	}
	get textContent() {
		return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
	}
	textBetween(e, t, n, r) {
		return this.content.textBetween(e, t, n, r);
	}
	get firstChild() {
		return this.content.firstChild;
	}
	get lastChild() {
		return this.content.lastChild;
	}
	eq(e) {
		return this == e || this.sameMarkup(e) && this.content.eq(e.content);
	}
	sameMarkup(e) {
		return this.hasMarkup(e.type, e.attrs, e.marks);
	}
	hasMarkup(e, t, n) {
		return this.type == e && ae(this.attrs, t || e.defaultAttrs || xe) && w.sameSet(this.marks, n || w.none);
	}
	copy(t = null) {
		return t == this.content ? this : new e(this.type, this.attrs, t, this.marks);
	}
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.content, t);
	}
	cut(e, t = this.content.size) {
		return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
	}
	slice(e, t = this.content.size, n = !1) {
		if (e == t) return T.empty;
		let r = this.resolve(e), i = this.resolve(t), a = n ? 0 : r.sharedDepth(t), o = r.start(a);
		return new T(r.node(a).content.cut(r.pos - o, i.pos - o), r.depth - a, i.depth - a);
	}
	replace(e, t, n) {
		return le(this.resolve(e), this.resolve(t), n);
	}
	nodeAt(e) {
		for (let t = this;;) {
			let { index: n, offset: r } = t.content.findIndex(e);
			if (t = t.maybeChild(n), !t) return null;
			if (r == e || t.isText) return t;
			e -= r + 1;
		}
	}
	childAfter(e) {
		let { index: t, offset: n } = this.content.findIndex(e);
		return {
			node: this.content.maybeChild(t),
			index: t,
			offset: n
		};
	}
	childBefore(e) {
		if (e == 0) return {
			node: null,
			index: 0,
			offset: 0
		};
		let { index: t, offset: n } = this.content.findIndex(e);
		if (n < e) return {
			node: this.content.child(t),
			index: t,
			offset: n
		};
		let r = this.content.child(t - 1);
		return {
			node: r,
			index: t - 1,
			offset: n - r.nodeSize
		};
	}
	resolve(e) {
		return ge.resolveCached(this, e);
	}
	resolveNoCache(e) {
		return ge.resolve(this, e);
	}
	rangeHasMark(e, t, n) {
		let r = !1;
		return t > e && this.nodesBetween(e, t, (e) => (n.isInSet(e.marks) && (r = !0), !r)), r;
	}
	get isBlock() {
		return this.type.isBlock;
	}
	get isTextblock() {
		return this.type.isTextblock;
	}
	get inlineContent() {
		return this.type.inlineContent;
	}
	get isInline() {
		return this.type.isInline;
	}
	get isText() {
		return this.type.isText;
	}
	get isLeaf() {
		return this.type.isLeaf;
	}
	get isAtom() {
		return this.type.isAtom;
	}
	toString() {
		if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
		let e = this.type.name;
		return this.content.size && (e += "(" + this.content.toStringInner() + ")"), we(this.marks, e);
	}
	contentMatchAt(e) {
		let t = this.type.contentMatch.matchFragment(this.content, 0, e);
		if (!t) throw Error("Called contentMatchAt on a node with invalid content");
		return t;
	}
	canReplace(e, t, n = C.empty, r = 0, i = n.childCount) {
		let a = this.contentMatchAt(e).matchFragment(n, r, i), o = a && a.matchFragment(this.content, t);
		if (!o || !o.validEnd) return !1;
		for (let e = r; e < i; e++) if (!this.type.allowsMarks(n.child(e).marks)) return !1;
		return !0;
	}
	canReplaceWith(e, t, n, r) {
		if (r && !this.type.allowsMarks(r)) return !1;
		let i = this.contentMatchAt(e).matchType(n), a = i && i.matchFragment(this.content, t);
		return a ? a.validEnd : !1;
	}
	canAppend(e) {
		return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
	}
	check() {
		this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
		let e = w.none;
		for (let t = 0; t < this.marks.length; t++) {
			let n = this.marks[t];
			n.type.checkAttrs(n.attrs), e = n.addToSet(e);
		}
		if (!w.sameSet(e, this.marks)) throw RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((e) => e.type.name)}`);
		this.content.forEach((e) => e.check());
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((e) => e.toJSON())), e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Node.fromJSON");
		let n;
		if (t.marks) {
			if (!Array.isArray(t.marks)) throw RangeError("Invalid mark data for Node.fromJSON");
			n = t.marks.map(e.markFromJSON);
		}
		if (t.type == "text") {
			if (typeof t.text != "string") throw RangeError("Invalid text node in JSON");
			return e.text(t.text, n);
		}
		let r = C.fromJSON(e, t.content), i = e.nodeType(t.type).create(t.attrs, r, n);
		return i.type.checkAttrs(i.attrs), i;
	}
};
Se.prototype.text = void 0;
var Ce = class e extends Se {
	constructor(e, t, n, r) {
		if (super(e, t, null, r), !n) throw RangeError("Empty text nodes are not allowed");
		this.text = n;
	}
	toString() {
		return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : we(this.marks, JSON.stringify(this.text));
	}
	get textContent() {
		return this.text;
	}
	textBetween(e, t) {
		return this.text.slice(e, t);
	}
	get nodeSize() {
		return this.text.length;
	}
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.text, t);
	}
	withText(t) {
		return t == this.text ? this : new e(this.type, this.attrs, t, this.marks);
	}
	cut(e = 0, t = this.text.length) {
		return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
	}
	eq(e) {
		return this.sameMarkup(e) && this.text == e.text;
	}
	toJSON() {
		let e = super.toJSON();
		return e.text = this.text, e;
	}
};
function we(e, t) {
	for (let n = e.length - 1; n >= 0; n--) t = e[n].type.name + "(" + t + ")";
	return t;
}
var Te = class e {
	constructor(e) {
		this.validEnd = e, this.next = [], this.wrapCache = [];
	}
	static parse(t, n) {
		let r = new Ee(t, n);
		if (r.next == null) return e.empty;
		let i = De(r);
		r.next && r.err("Unexpected trailing text");
		let a = Le(Pe(i));
		return Re(a, r), a;
	}
	matchType(e) {
		for (let t = 0; t < this.next.length; t++) if (this.next[t].type == e) return this.next[t].next;
		return null;
	}
	matchFragment(e, t = 0, n = e.childCount) {
		let r = this;
		for (let i = t; r && i < n; i++) r = r.matchType(e.child(i).type);
		return r;
	}
	get inlineContent() {
		return this.next.length != 0 && this.next[0].type.isInline;
	}
	get defaultType() {
		for (let e = 0; e < this.next.length; e++) {
			let { type: t } = this.next[e];
			if (!(t.isText || t.hasRequiredAttrs())) return t;
		}
		return null;
	}
	compatible(e) {
		for (let t = 0; t < this.next.length; t++) for (let n = 0; n < e.next.length; n++) if (this.next[t].type == e.next[n].type) return !0;
		return !1;
	}
	fillBefore(e, t = !1, n = 0) {
		let r = [this];
		function i(a, o) {
			let s = a.matchFragment(e, n);
			if (s && (!t || s.validEnd)) return C.from(o.map((e) => e.createAndFill()));
			for (let e = 0; e < a.next.length; e++) {
				let { type: t, next: n } = a.next[e];
				if (!(t.isText || t.hasRequiredAttrs()) && r.indexOf(n) == -1) {
					r.push(n);
					let e = i(n, o.concat(t));
					if (e) return e;
				}
			}
			return null;
		}
		return i(this, []);
	}
	findWrapping(e) {
		for (let t = 0; t < this.wrapCache.length; t += 2) if (this.wrapCache[t] == e) return this.wrapCache[t + 1];
		let t = this.computeWrapping(e);
		return this.wrapCache.push(e, t), t;
	}
	computeWrapping(e) {
		let t = Object.create(null), n = [{
			match: this,
			type: null,
			via: null
		}];
		for (; n.length;) {
			let r = n.shift(), i = r.match;
			if (i.matchType(e)) {
				let e = [];
				for (let t = r; t.type; t = t.via) e.push(t.type);
				return e.reverse();
			}
			for (let e = 0; e < i.next.length; e++) {
				let { type: a, next: o } = i.next[e];
				!a.isLeaf && !a.hasRequiredAttrs() && !(a.name in t) && (!r.type || o.validEnd) && (n.push({
					match: a.contentMatch,
					type: a,
					via: r
				}), t[a.name] = !0);
			}
		}
		return null;
	}
	get edgeCount() {
		return this.next.length;
	}
	edge(e) {
		if (e >= this.next.length) throw RangeError(`There's no ${e}th edge in this content match`);
		return this.next[e];
	}
	toString() {
		let e = [];
		function t(n) {
			e.push(n);
			for (let r = 0; r < n.next.length; r++) e.indexOf(n.next[r].next) == -1 && t(n.next[r].next);
		}
		return t(this), e.map((t, n) => {
			let r = n + (t.validEnd ? "*" : " ") + " ";
			for (let n = 0; n < t.next.length; n++) r += (n ? ", " : "") + t.next[n].type.name + "->" + e.indexOf(t.next[n].next);
			return r;
		}).join("\n");
	}
};
Te.empty = new Te(!0);
var Ee = class {
	constructor(e, t) {
		this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
	}
	get next() {
		return this.tokens[this.pos];
	}
	eat(e) {
		return this.next == e && (this.pos++ || !0);
	}
	err(e) {
		throw SyntaxError(e + " (in content expression '" + this.string + "')");
	}
};
function De(e) {
	let t = [];
	do
		t.push(Oe(e));
	while (e.eat("|"));
	return t.length == 1 ? t[0] : {
		type: "choice",
		exprs: t
	};
}
function Oe(e) {
	let t = [];
	do
		t.push(ke(e));
	while (e.next && e.next != ")" && e.next != "|");
	return t.length == 1 ? t[0] : {
		type: "seq",
		exprs: t
	};
}
function ke(e) {
	let t = Ne(e);
	for (;;) if (e.eat("+")) t = {
		type: "plus",
		expr: t
	};
	else if (e.eat("*")) t = {
		type: "star",
		expr: t
	};
	else if (e.eat("?")) t = {
		type: "opt",
		expr: t
	};
	else if (e.eat("{")) t = je(e, t);
	else break;
	return t;
}
function Ae(e) {
	/\D/.test(e.next) && e.err("Expected number, got '" + e.next + "'");
	let t = Number(e.next);
	return e.pos++, t;
}
function je(e, t) {
	let n = Ae(e), r = n;
	return e.eat(",") && (r = e.next == "}" ? -1 : Ae(e)), e.eat("}") || e.err("Unclosed braced range"), {
		type: "range",
		min: n,
		max: r,
		expr: t
	};
}
function Me(e, t) {
	let n = e.nodeTypes, r = n[t];
	if (r) return [r];
	let i = [];
	for (let e in n) {
		let r = n[e];
		r.isInGroup(t) && i.push(r);
	}
	return i.length == 0 && e.err("No node type or group '" + t + "' found"), i;
}
function Ne(e) {
	if (e.eat("(")) {
		let t = De(e);
		return e.eat(")") || e.err("Missing closing paren"), t;
	} else if (/\W/.test(e.next)) e.err("Unexpected token '" + e.next + "'");
	else {
		let t = Me(e, e.next).map((t) => (e.inline == null ? e.inline = t.isInline : e.inline != t.isInline && e.err("Mixing inline and block content"), {
			type: "name",
			value: t
		}));
		return e.pos++, t.length == 1 ? t[0] : {
			type: "choice",
			exprs: t
		};
	}
}
function Pe(e) {
	let t = [[]];
	return i(a(e, 0), n()), t;
	function n() {
		return t.push([]) - 1;
	}
	function r(e, n, r) {
		let i = {
			term: r,
			to: n
		};
		return t[e].push(i), i;
	}
	function i(e, t) {
		e.forEach((e) => e.to = t);
	}
	function a(e, t) {
		if (e.type == "choice") return e.exprs.reduce((e, n) => e.concat(a(n, t)), []);
		if (e.type == "seq") for (let r = 0;; r++) {
			let o = a(e.exprs[r], t);
			if (r == e.exprs.length - 1) return o;
			i(o, t = n());
		}
		else if (e.type == "star") {
			let o = n();
			return r(t, o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "plus") {
			let o = n();
			return i(a(e.expr, t), o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "opt") return [r(t)].concat(a(e.expr, t));
		else if (e.type == "range") {
			let o = t;
			for (let t = 0; t < e.min; t++) {
				let t = n();
				i(a(e.expr, o), t), o = t;
			}
			if (e.max == -1) i(a(e.expr, o), o);
			else for (let t = e.min; t < e.max; t++) {
				let t = n();
				r(o, t), i(a(e.expr, o), t), o = t;
			}
			return [r(o)];
		} else if (e.type == "name") return [r(t, void 0, e.value)];
		else throw Error("Unknown expr type");
	}
}
function Fe(e, t) {
	return t - e;
}
function Ie(e, t) {
	let n = [];
	return r(t), n.sort(Fe);
	function r(t) {
		let i = e[t];
		if (i.length == 1 && !i[0].term) return r(i[0].to);
		n.push(t);
		for (let e = 0; e < i.length; e++) {
			let { term: t, to: a } = i[e];
			!t && n.indexOf(a) == -1 && r(a);
		}
	}
}
function Le(e) {
	let t = Object.create(null);
	return n(Ie(e, 0));
	function n(r) {
		let i = [];
		r.forEach((t) => {
			e[t].forEach(({ term: t, to: n }) => {
				if (!t) return;
				let r;
				for (let e = 0; e < i.length; e++) i[e][0] == t && (r = i[e][1]);
				Ie(e, n).forEach((e) => {
					r || i.push([t, r = []]), r.indexOf(e) == -1 && r.push(e);
				});
			});
		});
		let a = t[r.join(",")] = new Te(r.indexOf(e.length - 1) > -1);
		for (let e = 0; e < i.length; e++) {
			let r = i[e][1].sort(Fe);
			a.next.push({
				type: i[e][0],
				next: t[r.join(",")] || n(r)
			});
		}
		return a;
	}
}
function Re(e, t) {
	for (let n = 0, r = [e]; n < r.length; n++) {
		let e = r[n], i = !e.validEnd, a = [];
		for (let t = 0; t < e.next.length; t++) {
			let { type: n, next: o } = e.next[t];
			a.push(n.name), i && !(n.isText || n.hasRequiredAttrs()) && (i = !1), r.indexOf(o) == -1 && r.push(o);
		}
		i && t.err("Only non-generatable nodes (" + a.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
	}
}
function ze(e) {
	let t = Object.create(null);
	for (let n in e) {
		let r = e[n];
		if (!r.hasDefault) return null;
		t[n] = r.default;
	}
	return t;
}
function Be(e, t) {
	let n = Object.create(null);
	for (let r in e) {
		let i = t && t[r];
		if (i === void 0) {
			let t = e[r];
			if (t.hasDefault) i = t.default;
			else throw RangeError("No value supplied for attribute " + r);
		}
		n[r] = i;
	}
	return n;
}
function Ve(e, t, n, r) {
	for (let i in t) if (!(i in e)) throw RangeError(`Unsupported attribute ${i} for ${n} of type ${r}`);
	for (let n in e) e[n].validate && e[n].validate(t[n]);
}
function He(e, t) {
	let n = Object.create(null);
	if (t) for (let r in t) n[r] = new Ge(e, r, t[r]);
	return n;
}
var Ue = class e {
	constructor(e, t, n) {
		this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = He(e, n.attrs), this.defaultAttrs = ze(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
	}
	get isInline() {
		return !this.isBlock;
	}
	get isTextblock() {
		return this.isBlock && this.inlineContent;
	}
	get isLeaf() {
		return this.contentMatch == Te.empty;
	}
	get isAtom() {
		return this.isLeaf || !!this.spec.atom;
	}
	isInGroup(e) {
		return this.groups.indexOf(e) > -1;
	}
	get whitespace() {
		return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
	}
	hasRequiredAttrs() {
		for (let e in this.attrs) if (this.attrs[e].isRequired) return !0;
		return !1;
	}
	compatibleContent(e) {
		return this == e || this.contentMatch.compatible(e.contentMatch);
	}
	computeAttrs(e) {
		return !e && this.defaultAttrs ? this.defaultAttrs : Be(this.attrs, e);
	}
	create(e = null, t, n) {
		if (this.isText) throw Error("NodeType.create can't construct text nodes");
		return new Se(this, this.computeAttrs(e), C.from(t), w.setFrom(n));
	}
	createChecked(e = null, t, n) {
		return t = C.from(t), this.checkContent(t), new Se(this, this.computeAttrs(e), t, w.setFrom(n));
	}
	createAndFill(e = null, t, n) {
		if (e = this.computeAttrs(e), t = C.from(t), t.size) {
			let e = this.contentMatch.fillBefore(t);
			if (!e) return null;
			t = e.append(t);
		}
		let r = this.contentMatch.matchFragment(t), i = r && r.fillBefore(C.empty, !0);
		return i ? new Se(this, e, t.append(i), w.setFrom(n)) : null;
	}
	validContent(e) {
		let t = this.contentMatch.matchFragment(e);
		if (!t || !t.validEnd) return !1;
		for (let t = 0; t < e.childCount; t++) if (!this.allowsMarks(e.child(t).marks)) return !1;
		return !0;
	}
	checkContent(e) {
		if (!this.validContent(e)) throw RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
	}
	checkAttrs(e) {
		Ve(this.attrs, e, "node", this.name);
	}
	allowsMarkType(e) {
		return this.markSet == null || this.markSet.indexOf(e) > -1;
	}
	allowsMarks(e) {
		if (this.markSet == null) return !0;
		for (let t = 0; t < e.length; t++) if (!this.allowsMarkType(e[t].type)) return !1;
		return !0;
	}
	allowedMarks(e) {
		if (this.markSet == null) return e;
		let t;
		for (let n = 0; n < e.length; n++) this.allowsMarkType(e[n].type) ? t && t.push(e[n]) : t ||= e.slice(0, n);
		return t ? t.length ? t : w.none : e;
	}
	static compile(t, n) {
		let r = Object.create(null);
		t.forEach((t, i) => r[t] = new e(t, n, i));
		let i = n.spec.topNode || "doc";
		if (!r[i]) throw RangeError("Schema is missing its top node type ('" + i + "')");
		if (!r.text) throw RangeError("Every schema needs a 'text' type");
		for (let e in r.text.attrs) throw RangeError("The text node type should not have attributes");
		return r;
	}
};
function We(e, t, n) {
	let r = n.split("|");
	return (n) => {
		let i = n === null ? "null" : typeof n;
		if (r.indexOf(i) < 0) throw RangeError(`Expected value of type ${r} for attribute ${t} on type ${e}, got ${i}`);
	};
}
var Ge = class {
	constructor(e, t, n) {
		this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? We(e, t, n.validate) : n.validate;
	}
	get isRequired() {
		return !this.hasDefault;
	}
}, Ke = class e {
	constructor(e, t, n, r) {
		this.name = e, this.rank = t, this.schema = n, this.spec = r, this.attrs = He(e, r.attrs), this.excluded = null;
		let i = ze(this.attrs);
		this.instance = i ? new w(this, i) : null;
	}
	create(e = null) {
		return !e && this.instance ? this.instance : new w(this, Be(this.attrs, e));
	}
	static compile(t, n) {
		let r = Object.create(null), i = 0;
		return t.forEach((t, a) => r[t] = new e(t, i++, n, a)), r;
	}
	removeFromSet(e) {
		for (var t = 0; t < e.length; t++) e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (e[t].type == this) return e[t];
	}
	checkAttrs(e) {
		Ve(this.attrs, e, "mark", this.name);
	}
	excludes(e) {
		return this.excluded.indexOf(e) > -1;
	}
}, qe = class {
	constructor(e) {
		this.linebreakReplacement = null, this.cached = Object.create(null);
		let t = this.spec = {};
		for (let n in e) t[n] = e[n];
		t.nodes = x.from(e.nodes), t.marks = x.from(e.marks || {}), this.nodes = Ue.compile(this.spec.nodes, this), this.marks = Ke.compile(this.spec.marks, this);
		let n = Object.create(null);
		for (let e in this.nodes) {
			if (e in this.marks) throw RangeError(e + " can not be both a node and a mark");
			let t = this.nodes[e], r = t.spec.content || "", i = t.spec.marks;
			if (t.contentMatch = n[r] || (n[r] = Te.parse(r, this.nodes)), t.inlineContent = t.contentMatch.inlineContent, t.spec.linebreakReplacement) {
				if (this.linebreakReplacement) throw RangeError("Multiple linebreak nodes defined");
				if (!t.isInline || !t.isLeaf) throw RangeError("Linebreak replacement nodes must be inline leaf nodes");
				this.linebreakReplacement = t;
			}
			t.markSet = i == "_" ? null : i ? Je(this, i.split(" ")) : i == "" || !t.inlineContent ? [] : null;
		}
		for (let e in this.marks) {
			let t = this.marks[e], n = t.spec.excludes;
			t.excluded = n == null ? [t] : n == "" ? [] : Je(this, n.split(" "));
		}
		this.nodeFromJSON = (e) => Se.fromJSON(this, e), this.markFromJSON = (e) => w.fromJSON(this, e), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = Object.create(null);
	}
	node(e, t = null, n, r) {
		if (typeof e == "string") e = this.nodeType(e);
		else if (!(e instanceof Ue)) throw RangeError("Invalid node type: " + e);
		else if (e.schema != this) throw RangeError("Node type from different schema used (" + e.name + ")");
		return e.createChecked(t, n, r);
	}
	text(e, t) {
		let n = this.nodes.text;
		return new Ce(n, n.defaultAttrs, e, w.setFrom(t));
	}
	mark(e, t) {
		return typeof e == "string" && (e = this.marks[e]), e.create(t);
	}
	nodeType(e) {
		let t = this.nodes[e];
		if (!t) throw RangeError("Unknown node type: " + e);
		return t;
	}
};
function Je(e, t) {
	let n = [];
	for (let r = 0; r < t.length; r++) {
		let i = t[r], a = e.marks[i], o = a;
		if (a) n.push(a);
		else for (let t in e.marks) {
			let r = e.marks[t];
			(i == "_" || r.spec.group && r.spec.group.split(" ").indexOf(i) > -1) && n.push(o = r);
		}
		if (!o) throw SyntaxError("Unknown mark type: '" + t[r] + "'");
	}
	return n;
}
function Ye(e) {
	return e.tag != null;
}
function Xe(e) {
	return e.style != null;
}
var Ze = class e {
	constructor(e, t) {
		this.schema = e, this.rules = t, this.tags = [], this.styles = [];
		let n = this.matchedStyles = [];
		t.forEach((e) => {
			if (Ye(e)) this.tags.push(e);
			else if (Xe(e)) {
				let t = /[^=]*/.exec(e.style)[0];
				n.indexOf(t) < 0 && n.push(t), this.styles.push(e);
			}
		}), this.normalizeLists = !this.tags.some((t) => {
			if (!/^(ul|ol)\b/.test(t.tag) || !t.node) return !1;
			let n = e.nodes[t.node];
			return n.contentMatch.matchType(n);
		});
	}
	parse(e, t = {}) {
		let n = new ot(this, t, !1);
		return n.addAll(e, w.none, t.from, t.to), n.finish();
	}
	parseSlice(e, t = {}) {
		let n = new ot(this, t, !0);
		return n.addAll(e, w.none, t.from, t.to), T.maxOpen(n.finish());
	}
	matchTag(e, t, n) {
		for (let r = n ? this.tags.indexOf(n) + 1 : 0; r < this.tags.length; r++) {
			let n = this.tags[r];
			if (ct(e, n.tag) && (n.namespace === void 0 || e.namespaceURI == n.namespace) && (!n.context || t.matchesContext(n.context))) {
				if (n.getAttrs) {
					let t = n.getAttrs(e);
					if (t === !1) continue;
					n.attrs = t || void 0;
				}
				return n;
			}
		}
	}
	matchStyle(e, t, n, r) {
		for (let i = r ? this.styles.indexOf(r) + 1 : 0; i < this.styles.length; i++) {
			let r = this.styles[i], a = r.style;
			if (!(a.indexOf(e) != 0 || r.context && !n.matchesContext(r.context) || a.length > e.length && (a.charCodeAt(e.length) != 61 || a.slice(e.length + 1) != t))) {
				if (r.getAttrs) {
					let e = r.getAttrs(t);
					if (e === !1) continue;
					r.attrs = e || void 0;
				}
				return r;
			}
		}
	}
	static schemaRules(e) {
		let t = [];
		function n(e) {
			let n = e.priority == null ? 50 : e.priority, r = 0;
			for (; r < t.length; r++) {
				let e = t[r];
				if ((e.priority == null ? 50 : e.priority) < n) break;
			}
			t.splice(r, 0, e);
		}
		for (let t in e.marks) {
			let r = e.marks[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = lt(e)), e.mark || e.ignore || e.clearMark || (e.mark = t);
			});
		}
		for (let t in e.nodes) {
			let r = e.nodes[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = lt(e)), e.node || e.ignore || e.mark || (e.node = t);
			});
		}
		return t;
	}
	static fromSchema(t) {
		return t.cached.domParser || (t.cached.domParser = new e(t, e.schemaRules(t)));
	}
}, Qe = {
	address: !0,
	article: !0,
	aside: !0,
	blockquote: !0,
	canvas: !0,
	dd: !0,
	div: !0,
	dl: !0,
	fieldset: !0,
	figcaption: !0,
	figure: !0,
	footer: !0,
	form: !0,
	h1: !0,
	h2: !0,
	h3: !0,
	h4: !0,
	h5: !0,
	h6: !0,
	header: !0,
	hgroup: !0,
	hr: !0,
	li: !0,
	noscript: !0,
	ol: !0,
	output: !0,
	p: !0,
	pre: !0,
	section: !0,
	table: !0,
	tfoot: !0,
	ul: !0
}, $e = {
	head: !0,
	noscript: !0,
	object: !0,
	script: !0,
	style: !0,
	title: !0
}, et = {
	ol: !0,
	ul: !0
}, tt = 1, nt = 2, rt = 4;
function it(e, t, n) {
	return t == null ? e && e.whitespace == "pre" ? 3 : n & -5 : (t ? tt : 0) | (t === "full" ? nt : 0);
}
var at = class {
	constructor(e, t, n, r, i, a) {
		this.type = e, this.attrs = t, this.marks = n, this.solid = r, this.options = a, this.content = [], this.activeMarks = w.none, this.match = i || (a & rt ? null : e.contentMatch);
	}
	findWrapping(e) {
		if (!this.match) {
			if (!this.type) return [];
			let t = this.type.contentMatch.fillBefore(C.from(e));
			if (t) this.match = this.type.contentMatch.matchFragment(t);
			else {
				let t = this.type.contentMatch, n;
				return (n = t.findWrapping(e.type)) ? (this.match = t, n) : null;
			}
		}
		return this.match.findWrapping(e.type);
	}
	finish(e) {
		if (!(this.options & tt)) {
			let e = this.content[this.content.length - 1], t;
			if (e && e.isText && (t = /[ \t\r\n\u000c]+$/.exec(e.text))) {
				let n = e;
				e.text.length == t[0].length ? this.content.pop() : this.content[this.content.length - 1] = n.withText(n.text.slice(0, n.text.length - t[0].length));
			}
		}
		let t = C.from(this.content);
		return !e && this.match && (t = t.append(this.match.fillBefore(C.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
	}
	inlineContext(e) {
		return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Qe.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
	}
}, ot = class {
	constructor(e, t, n) {
		this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
		let r = t.topNode, i, a = it(null, t.preserveWhitespace, 0) | (n ? rt : 0);
		i = r ? new at(r.type, r.attrs, w.none, !0, t.topMatch || r.type.contentMatch, a) : n ? new at(null, null, w.none, !0, null, a) : new at(e.schema.topNodeType, null, w.none, !0, null, a), this.nodes = [i], this.find = t.findPositions, this.needsBlock = !1;
	}
	get top() {
		return this.nodes[this.open];
	}
	addDOM(e, t) {
		e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
	}
	addTextNode(e, t) {
		let n = e.nodeValue, r = this.top, i = r.options & nt ? "full" : this.localPreserveWS || (r.options & tt) > 0, { schema: a } = this.parser;
		if (i === "full" || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
			if (!i) {
				if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
					let t = r.content[r.content.length - 1], i = e.previousSibling;
					(!t || i && i.nodeName == "BR" || t.isText && /[ \t\r\n\u000c]$/.test(t.text)) && (n = n.slice(1));
				}
			} else if (i === "full") n = n.replace(/\r\n?/g, "\n");
			else if (a.linebreakReplacement && /[\r\n]/.test(n) && this.top.findWrapping(a.linebreakReplacement.create())) {
				let e = n.split(/\r?\n|\r/);
				for (let n = 0; n < e.length; n++) n && this.insertNode(a.linebreakReplacement.create(), t, !0), e[n] && this.insertNode(a.text(e[n]), t, !/\S/.test(e[n]));
				n = "";
			} else n = n.replace(/\r?\n|\r/g, " ");
			n && this.insertNode(a.text(n), t, !/\S/.test(n)), this.findInText(e);
		} else this.findInside(e);
	}
	addElement(e, t, n) {
		let r = this.localPreserveWS, i = this.top;
		(e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
		let a = e.nodeName.toLowerCase(), o;
		et.hasOwnProperty(a) && this.parser.normalizeLists && st(e);
		let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, n));
		out: if (s ? s.ignore : $e.hasOwnProperty(a)) this.findInside(e), this.ignoreFallback(e, t);
		else if (!s || s.skip || s.closeParent) {
			s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
			let n, r = this.needsBlock;
			if (Qe.hasOwnProperty(a)) i.content.length && i.content[0].isInline && this.open && (this.open--, i = this.top), n = !0, i.type || (this.needsBlock = !0);
			else if (!e.firstChild) {
				this.leafFallback(e, t);
				break out;
			}
			let o = s && s.skip ? t : this.readStyles(e, t);
			o && this.addAll(e, o), n && this.sync(i), this.needsBlock = r;
		} else {
			let n = this.readStyles(e, t);
			n && this.addElementByRule(e, s, n, s.consuming === !1 ? o : void 0);
		}
		this.localPreserveWS = r;
	}
	leafFallback(e, t) {
		e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode("\n"), t);
	}
	ignoreFallback(e, t) {
		e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
	}
	readStyles(e, t) {
		let n = e.style;
		if (n && n.length) for (let e = 0; e < this.parser.matchedStyles.length; e++) {
			let r = this.parser.matchedStyles[e], i = n.getPropertyValue(r);
			if (i) for (let e;;) {
				let n = this.parser.matchStyle(r, i, this, e);
				if (!n) break;
				if (n.ignore) return null;
				if (t = n.clearMark ? t.filter((e) => !n.clearMark(e)) : t.concat(this.parser.schema.marks[n.mark].create(n.attrs)), n.consuming === !1) e = n;
				else break;
			}
		}
		return t;
	}
	addElementByRule(e, t, n, r) {
		let i, a;
		if (t.node) if (a = this.parser.schema.nodes[t.node], a.isLeaf) this.insertNode(a.create(t.attrs), n, e.nodeName == "BR") || this.leafFallback(e, n);
		else {
			let e = this.enter(a, t.attrs || null, n, t.preserveWhitespace);
			e && (i = !0, n = e);
		}
		else {
			let e = this.parser.schema.marks[t.mark];
			n = n.concat(e.create(t.attrs));
		}
		let o = this.top;
		if (a && a.isLeaf) this.findInside(e);
		else if (r) this.addElement(e, n, r);
		else if (t.getContent) this.findInside(e), t.getContent(e, this.parser.schema).forEach((e) => this.insertNode(e, n, !1));
		else {
			let r = e;
			typeof t.contentElement == "string" ? r = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? r = t.contentElement(e) : t.contentElement && (r = t.contentElement), this.findAround(e, r, !0), this.addAll(r, n), this.findAround(e, r, !1);
		}
		i && this.sync(o) && this.open--;
	}
	addAll(e, t, n, r) {
		let i = n || 0;
		for (let a = n ? e.childNodes[n] : e.firstChild, o = r == null ? null : e.childNodes[r]; a != o; a = a.nextSibling, ++i) this.findAtPoint(e, i), this.addDOM(a, t);
		this.findAtPoint(e, i);
	}
	findPlace(e, t, n) {
		let r, i;
		for (let t = this.open, a = 0; t >= 0; t--) {
			let o = this.nodes[t], s = o.findWrapping(e);
			if (s && (!r || r.length > s.length + a) && (r = s, i = o, !s.length)) break;
			if (o.solid) {
				if (n) break;
				a += 2;
			}
		}
		if (!r) return null;
		this.sync(i);
		for (let e = 0; e < r.length; e++) t = this.enterInner(r[e], null, t, !1);
		return t;
	}
	insertNode(e, t, n) {
		if (e.isInline && this.needsBlock && !this.top.type) {
			let e = this.textblockFromContext();
			e && (t = this.enterInner(e, null, t));
		}
		let r = this.findPlace(e, t, n);
		if (r) {
			this.closeExtra();
			let t = this.top;
			t.match &&= t.match.matchType(e.type);
			let n = w.none;
			for (let i of r.concat(e.marks)) (t.type ? t.type.allowsMarkType(i.type) : ut(i.type, e.type)) && (n = i.addToSet(n));
			return t.content.push(e.mark(n)), !0;
		}
		return !1;
	}
	enter(e, t, n, r) {
		let i = this.findPlace(e.create(t), n, !1);
		return i &&= this.enterInner(e, t, n, !0, r), i;
	}
	enterInner(e, t, n, r = !1, i) {
		this.closeExtra();
		let a = this.top;
		a.match = a.match && a.match.matchType(e);
		let o = it(e, i, a.options);
		a.options & rt && a.content.length == 0 && (o |= rt);
		let s = w.none;
		return n = n.filter((t) => (a.type ? a.type.allowsMarkType(t.type) : ut(t.type, e)) ? (s = t.addToSet(s), !1) : !0), this.nodes.push(new at(e, t, s, r, null, o)), this.open++, n;
	}
	closeExtra(e = !1) {
		let t = this.nodes.length - 1;
		if (t > this.open) {
			for (; t > this.open; t--) this.nodes[t - 1].content.push(this.nodes[t].finish(e));
			this.nodes.length = this.open + 1;
		}
	}
	finish() {
		return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
	}
	sync(e) {
		for (let t = this.open; t >= 0; t--) if (this.nodes[t] == e) return this.open = t, !0;
		else this.localPreserveWS && (this.nodes[t].options |= tt);
		return !1;
	}
	get currentPos() {
		this.closeExtra();
		let e = 0;
		for (let t = this.open; t >= 0; t--) {
			let n = this.nodes[t].content;
			for (let t = n.length - 1; t >= 0; t--) e += n[t].nodeSize;
			t && e++;
		}
		return e;
	}
	findAtPoint(e, t) {
		if (this.find) for (let n = 0; n < this.find.length; n++) this.find[n].node == e && this.find[n].offset == t && (this.find[n].pos = this.currentPos);
	}
	findInside(e) {
		if (this.find) for (let t = 0; t < this.find.length; t++) this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
	}
	findAround(e, t, n) {
		if (e != t && this.find) for (let r = 0; r < this.find.length; r++) this.find[r].pos == null && e.nodeType == 1 && e.contains(this.find[r].node) && t.compareDocumentPosition(this.find[r].node) & (n ? 2 : 4) && (this.find[r].pos = this.currentPos);
	}
	findInText(e) {
		if (this.find) for (let t = 0; t < this.find.length; t++) this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
	}
	matchesContext(e) {
		if (e.indexOf("|") > -1) return e.split(/\s*\|\s*/).some(this.matchesContext, this);
		let t = e.split("/"), n = this.options.context, r = !this.isOpen && (!n || n.parent.type == this.nodes[0].type), i = -(n ? n.depth + 1 : 0) + +!r, a = (e, o) => {
			for (; e >= 0; e--) {
				let s = t[e];
				if (s == "") {
					if (e == t.length - 1 || e == 0) continue;
					for (; o >= i; o--) if (a(e - 1, o)) return !0;
					return !1;
				} else {
					let e = o > 0 || o == 0 && r ? this.nodes[o].type : n && o >= i ? n.node(o - i).type : null;
					if (!e || e.name != s && !e.isInGroup(s)) return !1;
					o--;
				}
			}
			return !0;
		};
		return a(t.length - 1, this.open);
	}
	textblockFromContext() {
		let e = this.options.context;
		if (e) for (let t = e.depth; t >= 0; t--) {
			let n = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
			if (n && n.isTextblock && n.defaultAttrs) return n;
		}
		for (let e in this.parser.schema.nodes) {
			let t = this.parser.schema.nodes[e];
			if (t.isTextblock && t.defaultAttrs) return t;
		}
	}
};
function st(e) {
	for (let t = e.firstChild, n = null; t; t = t.nextSibling) {
		let e = t.nodeType == 1 ? t.nodeName.toLowerCase() : null;
		e && et.hasOwnProperty(e) && n ? (n.appendChild(t), t = n) : e == "li" ? n = t : e && (n = null);
	}
}
function ct(e, t) {
	return (e.matches || e.msMatchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector).call(e, t);
}
function lt(e) {
	let t = {};
	for (let n in e) t[n] = e[n];
	return t;
}
function ut(e, t) {
	let n = t.schema.nodes;
	for (let r in n) {
		let i = n[r];
		if (!i.allowsMarkType(e)) continue;
		let a = [], o = (e) => {
			a.push(e);
			for (let n = 0; n < e.edgeCount; n++) {
				let { type: r, next: i } = e.edge(n);
				if (r == t || a.indexOf(i) < 0 && o(i)) return !0;
			}
		};
		if (o(i.contentMatch)) return !0;
	}
}
var dt = class e {
	constructor(e, t) {
		this.nodes = e, this.marks = t;
	}
	serializeFragment(e, t = {}, n) {
		n ||= pt(t).createDocumentFragment();
		let r = n, i = [];
		return e.forEach((e) => {
			if (i.length || e.marks.length) {
				let n = 0, a = 0;
				for (; n < i.length && a < e.marks.length;) {
					let t = e.marks[a];
					if (!this.marks[t.type.name]) {
						a++;
						continue;
					}
					if (!t.eq(i[n][0]) || t.type.spec.spanning === !1) break;
					n++, a++;
				}
				for (; n < i.length;) r = i.pop()[1];
				for (; a < e.marks.length;) {
					let n = e.marks[a++], o = this.serializeMark(n, e.isInline, t);
					o && (i.push([n, r]), r.appendChild(o.dom), r = o.contentDOM || o.dom);
				}
			}
			r.appendChild(this.serializeNodeInner(e, t));
		}), n;
	}
	serializeNodeInner(e, t) {
		if (e.isText) return pt(t).createTextNode(e.text);
		let { dom: n, contentDOM: r } = _t(pt(t), this.nodes[e.type.name](e), null, e.attrs);
		if (r) {
			if (e.isLeaf) throw RangeError("Content hole not allowed in a leaf node spec");
			this.serializeFragment(e.content, t, r);
		}
		return n;
	}
	serializeNode(e, t = {}) {
		let n = this.serializeNodeInner(e, t);
		for (let r = e.marks.length - 1; r >= 0; r--) {
			let i = this.serializeMark(e.marks[r], e.isInline, t);
			i && ((i.contentDOM || i.dom).appendChild(n), n = i.dom);
		}
		return n;
	}
	serializeMark(e, t, n = {}) {
		let r = this.marks[e.type.name];
		return r && _t(pt(n), r(e, t), null, e.attrs);
	}
	static renderSpec(e, t, n = null, r) {
		return typeof t == "string" ? { dom: e.createTextNode(t) } : _t(e, t, n, r);
	}
	static fromSchema(t) {
		return t.cached.domSerializer || (t.cached.domSerializer = new e(this.nodesFromSchema(t), this.marksFromSchema(t)));
	}
	static nodesFromSchema(e) {
		let t = ft(e.nodes);
		return t.text ||= (e) => e.text, t;
	}
	static marksFromSchema(e) {
		return ft(e.marks);
	}
};
function ft(e) {
	let t = {};
	for (let n in e) {
		let r = e[n].spec.toDOM;
		r && (t[n] = r);
	}
	return t;
}
function pt(e) {
	return e.document || window.document;
}
var mt = /* @__PURE__ */ new WeakMap();
function ht(e) {
	let t = mt.get(e);
	return t === void 0 && mt.set(e, t = gt(e)), t;
}
function gt(e) {
	let t = null;
	function n(e) {
		if (e && typeof e == "object") if (Array.isArray(e)) if (typeof e[0] == "string") t ||= [], t.push(e);
		else for (let t = 0; t < e.length; t++) n(e[t]);
		else for (let t in e) n(e[t]);
	}
	return n(e), t;
}
function _t(e, t, n, r) {
	if (t.nodeType == 1) return { dom: t };
	if (t.dom && t.dom.nodeType == 1) return t;
	let i = t[0], a;
	if (typeof i != "string") throw RangeError("Invalid array passed to renderSpec");
	if (r && (a = ht(r)) && a.indexOf(t) > -1) throw RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
	let o = i.indexOf(" ");
	o > 0 && (n = i.slice(0, o), i = i.slice(o + 1));
	let s, c = n ? e.createElementNS(n, i) : e.createElement(i), l = t[1], u = 1;
	if (l && typeof l == "object" && l.nodeType == null && !Array.isArray(l)) {
		u = 2;
		for (let e in l) if (l[e] != null) {
			let t = e.indexOf(" ");
			t > 0 ? c.setAttributeNS(e.slice(0, t), e.slice(t + 1), l[e]) : e == "style" && c.style ? c.style.cssText = l[e] : c.setAttribute(e, l[e]);
		}
	}
	for (let i = u; i < t.length; i++) {
		let a = t[i];
		if (a === 0) {
			if (i < t.length - 1 || i > u) throw RangeError("Content hole must be the only child of its parent node");
			return {
				dom: c,
				contentDOM: c
			};
		} else if (typeof a == "string") c.appendChild(e.createTextNode(a));
		else {
			let { dom: t, contentDOM: i } = _t(e, a, n, r);
			if (c.appendChild(t), i) {
				if (s) throw RangeError("Multiple content holes");
				s = i;
			}
		}
	}
	return {
		dom: c,
		contentDOM: s
	};
}
//#endregion
//#region node_modules/prosemirror-transform/dist/index.js
var vt = 65535, yt = 2 ** 16;
function bt(e, t) {
	return e + t * yt;
}
function xt(e) {
	return e & vt;
}
function St(e) {
	return (e - (e & vt)) / yt;
}
var Ct = 1, wt = 2, Tt = 4, Et = 8, Dt = class {
	constructor(e, t, n) {
		this.pos = e, this.delInfo = t, this.recover = n;
	}
	get deleted() {
		return (this.delInfo & Et) > 0;
	}
	get deletedBefore() {
		return (this.delInfo & 5) > 0;
	}
	get deletedAfter() {
		return (this.delInfo & 6) > 0;
	}
	get deletedAcross() {
		return (this.delInfo & Tt) > 0;
	}
}, Ot = class e {
	constructor(t, n = !1) {
		if (this.ranges = t, this.inverted = n, !t.length && e.empty) return e.empty;
	}
	recover(e) {
		let t = 0, n = xt(e);
		if (!this.inverted) for (let e = 0; e < n; e++) t += this.ranges[e * 3 + 2] - this.ranges[e * 3 + 1];
		return this.ranges[n * 3] + t + St(e);
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	map(e, t = 1) {
		return this._map(e, t, !0);
	}
	_map(e, t, n) {
		let r = 0, i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let o = 0; o < this.ranges.length; o += 3) {
			let s = this.ranges[o] - (this.inverted ? r : 0);
			if (s > e) break;
			let c = this.ranges[o + i], l = this.ranges[o + a], u = s + c;
			if (e <= u) {
				let i = c ? e == s ? -1 : e == u ? 1 : t : t, a = s + r + (i < 0 ? 0 : l);
				if (n) return a;
				let d = e == (t < 0 ? s : u) ? null : bt(o / 3, e - s), f = e == s ? wt : e == u ? Ct : Tt;
				return (t < 0 ? e != s : e != u) && (f |= Et), new Dt(a, f, d);
			}
			r += l - c;
		}
		return n ? e + r : new Dt(e + r, 0, null);
	}
	touches(e, t) {
		let n = 0, r = xt(t), i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let t = 0; t < this.ranges.length; t += 3) {
			let o = this.ranges[t] - (this.inverted ? n : 0);
			if (o > e) break;
			let s = this.ranges[t + i];
			if (e <= o + s && t == r * 3) return !0;
			n += this.ranges[t + a] - s;
		}
		return !1;
	}
	forEach(e) {
		let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
		for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
			let a = this.ranges[r], o = a - (this.inverted ? i : 0), s = a + (this.inverted ? 0 : i), c = this.ranges[r + t], l = this.ranges[r + n];
			e(o, o + c, s, s + l), i += l - c;
		}
	}
	invert() {
		return new e(this.ranges, !this.inverted);
	}
	toString() {
		return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
	}
	static offset(t) {
		return t == 0 ? e.empty : new e(t < 0 ? [
			0,
			-t,
			0
		] : [
			0,
			0,
			t
		]);
	}
};
Ot.empty = new Ot([]);
var kt = class e {
	constructor(e, t, n = 0, r = e ? e.length : 0) {
		this.mirror = t, this.from = n, this.to = r, this._maps = e || [], this.ownData = !(e || t);
	}
	get maps() {
		return this._maps;
	}
	slice(t = 0, n = this.maps.length) {
		return new e(this._maps, this.mirror, t, n);
	}
	appendMap(e, t) {
		this.ownData ||= (this._maps = this._maps.slice(), this.mirror = this.mirror && this.mirror.slice(), !0), this.to = this._maps.push(e), t != null && this.setMirror(this._maps.length - 1, t);
	}
	appendMapping(e) {
		for (let t = 0, n = this._maps.length; t < e._maps.length; t++) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t], r != null && r < t ? n + r : void 0);
		}
	}
	getMirror(e) {
		if (this.mirror) {
			for (let t = 0; t < this.mirror.length; t++) if (this.mirror[t] == e) return this.mirror[t + (t % 2 ? -1 : 1)];
		}
	}
	setMirror(e, t) {
		this.mirror ||= [], this.mirror.push(e, t);
	}
	appendMappingInverted(e) {
		for (let t = e.maps.length - 1, n = this._maps.length + e._maps.length; t >= 0; t--) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t].invert(), r != null && r > t ? n - r - 1 : void 0);
		}
	}
	invert() {
		let t = new e();
		return t.appendMappingInverted(this), t;
	}
	map(e, t = 1) {
		if (this.mirror) return this._map(e, t, !0);
		for (let n = this.from; n < this.to; n++) e = this._maps[n].map(e, t);
		return e;
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	_map(e, t, n) {
		let r = 0;
		for (let n = this.from; n < this.to; n++) {
			let i = this._maps[n].mapResult(e, t);
			if (i.recover != null) {
				let t = this.getMirror(n);
				if (t != null && t > n && t < this.to) {
					n = t, e = this._maps[t].recover(i.recover);
					continue;
				}
			}
			r |= i.delInfo, e = i.pos;
		}
		return n ? e : new Dt(e, r, null);
	}
}, At = Object.create(null), jt = class {
	getMap() {
		return Ot.empty;
	}
	merge(e) {
		return null;
	}
	static fromJSON(e, t) {
		if (!t || !t.stepType) throw RangeError("Invalid input for Step.fromJSON");
		let n = At[t.stepType];
		if (!n) throw RangeError(`No step type ${t.stepType} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in At) throw RangeError("Duplicate use of step JSON ID " + e);
		return At[e] = t, t.prototype.jsonID = e, t;
	}
}, Mt = class e {
	constructor(e, t) {
		this.doc = e, this.failed = t;
	}
	static ok(t) {
		return new e(t, null);
	}
	static fail(t) {
		return new e(null, t);
	}
	static fromReplace(t, n, r, i) {
		try {
			return e.ok(t.replace(n, r, i));
		} catch (t) {
			if (t instanceof oe) return e.fail(t.message);
			throw t;
		}
	}
};
function Nt(e, t, n) {
	let r = [];
	for (let i = 0; i < e.childCount; i++) {
		let a = e.child(i);
		a.content.size && (a = a.copy(Nt(a.content, t, a))), a.isInline && (a = t(a, n, i)), r.push(a);
	}
	return C.fromArray(r);
}
var Pt = class e extends jt {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = e.resolve(this.from), r = n.node(n.sharedDepth(this.to)), i = new T(Nt(t.content, (e, t) => !e.isAtom || !t.type.allowsMarkType(this.mark.type) ? e : e.mark(this.mark.addToSet(e.marks)), r), t.openStart, t.openEnd);
		return Mt.fromReplace(e, this.from, this.to, i);
	}
	invert() {
		return new Ft(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "addMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for AddMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
jt.jsonID("addMark", Pt);
var Ft = class e extends jt {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = new T(Nt(t.content, (e) => e.mark(this.mark.removeFromSet(e.marks)), e), t.openStart, t.openEnd);
		return Mt.fromReplace(e, this.from, this.to, n);
	}
	invert() {
		return new Pt(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "removeMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for RemoveMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
jt.jsonID("removeMark", Ft);
var It = class e extends jt {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return Mt.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
		return Mt.fromReplace(e, this.pos, this.pos + 1, new T(C.from(n), 0, +!t.isLeaf));
	}
	invert(t) {
		let n = t.nodeAt(this.pos);
		if (n) {
			let t = this.mark.addToSet(n.marks);
			if (t.length == n.marks.length) {
				for (let r = 0; r < n.marks.length; r++) if (!n.marks[r].isInSet(t)) return new e(this.pos, n.marks[r]);
				return new e(this.pos, this.mark);
			}
		}
		return new Lt(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "addNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for AddNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
jt.jsonID("addNodeMark", It);
var Lt = class e extends jt {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return Mt.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
		return Mt.fromReplace(e, this.pos, this.pos + 1, new T(C.from(n), 0, +!t.isLeaf));
	}
	invert(e) {
		let t = e.nodeAt(this.pos);
		return !t || !this.mark.isInSet(t.marks) ? this : new It(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "removeNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
jt.jsonID("removeNodeMark", Lt);
var Rt = class e extends jt {
	constructor(e, t, n, r = !1) {
		super(), this.from = e, this.to = t, this.slice = n, this.structure = r;
	}
	apply(e) {
		return this.structure && Bt(e, this.from, this.to) ? Mt.fail("Structure replace would overwrite content") : Mt.fromReplace(e, this.from, this.to, this.slice);
	}
	getMap() {
		return new Ot([
			this.from,
			this.to - this.from,
			this.slice.size
		]);
	}
	invert(t) {
		return new e(this.from, this.from + this.slice.size, t.slice(this.from, this.to));
	}
	map(t) {
		let n = t.mapResult(this.to, -1), r = this.from == this.to && e.MAP_BIAS < 0 ? n : t.mapResult(this.from, 1);
		return r.deletedAcross && n.deletedAcross ? null : new e(r.pos, Math.max(r.pos, n.pos), this.slice, this.structure);
	}
	merge(t) {
		if (!(t instanceof e) || t.structure || this.structure) return null;
		if (this.from + this.slice.size == t.from && !this.slice.openEnd && !t.slice.openStart) {
			let n = this.slice.size + t.slice.size == 0 ? T.empty : new T(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
			return new e(this.from, this.to + (t.to - t.from), n, this.structure);
		} else if (t.to == this.from && !this.slice.openStart && !t.slice.openEnd) {
			let n = this.slice.size + t.slice.size == 0 ? T.empty : new T(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
			return new e(t.from, this.to, n, this.structure);
		} else return null;
	}
	toJSON() {
		let e = {
			stepType: "replace",
			from: this.from,
			to: this.to
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for ReplaceStep.fromJSON");
		return new e(n.from, n.to, T.fromJSON(t, n.slice), !!n.structure);
	}
};
Rt.MAP_BIAS = 1, jt.jsonID("replace", Rt);
var zt = class e extends jt {
	constructor(e, t, n, r, i, a, o = !1) {
		super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = r, this.slice = i, this.insert = a, this.structure = o;
	}
	apply(e) {
		if (this.structure && (Bt(e, this.from, this.gapFrom) || Bt(e, this.gapTo, this.to))) return Mt.fail("Structure gap-replace would overwrite content");
		let t = e.slice(this.gapFrom, this.gapTo);
		if (t.openStart || t.openEnd) return Mt.fail("Gap is not a flat range");
		let n = this.slice.insertAt(this.insert, t.content);
		return n ? Mt.fromReplace(e, this.from, this.to, n) : Mt.fail("Content does not fit in gap");
	}
	getMap() {
		return new Ot([
			this.from,
			this.gapFrom - this.from,
			this.insert,
			this.gapTo,
			this.to - this.gapTo,
			this.slice.size - this.insert
		]);
	}
	invert(t) {
		let n = this.gapTo - this.gapFrom;
		return new e(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, t.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1), i = this.from == this.gapFrom ? n.pos : t.map(this.gapFrom, -1), a = this.to == this.gapTo ? r.pos : t.map(this.gapTo, 1);
		return n.deletedAcross && r.deletedAcross || i < n.pos || a > r.pos ? null : new e(n.pos, r.pos, i, a, this.slice, this.insert, this.structure);
	}
	toJSON() {
		let e = {
			stepType: "replaceAround",
			from: this.from,
			to: this.to,
			gapFrom: this.gapFrom,
			gapTo: this.gapTo,
			insert: this.insert
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number" || typeof n.gapFrom != "number" || typeof n.gapTo != "number" || typeof n.insert != "number") throw RangeError("Invalid input for ReplaceAroundStep.fromJSON");
		return new e(n.from, n.to, n.gapFrom, n.gapTo, T.fromJSON(t, n.slice), n.insert, !!n.structure);
	}
};
jt.jsonID("replaceAround", zt);
function Bt(e, t, n) {
	let r = e.resolve(t), i = n - t, a = r.depth;
	for (; i > 0 && a > 0 && r.indexAfter(a) == r.node(a).childCount;) a--, i--;
	if (i > 0) {
		let e = r.node(a).maybeChild(r.indexAfter(a));
		for (; i > 0;) {
			if (!e || e.isLeaf) return !0;
			e = e.firstChild, i--;
		}
	}
	return !1;
}
function Vt(e, t, n, r) {
	let i = [], a = [], o, s;
	e.doc.nodesBetween(t, n, (e, c, l) => {
		if (!e.isInline) return;
		let u = e.marks;
		if (!r.isInSet(u) && l.type.allowsMarkType(r.type)) {
			let l = Math.max(c, t), d = Math.min(c + e.nodeSize, n), f = r.addToSet(u);
			for (let e = 0; e < u.length; e++) u[e].isInSet(f) || (o && o.to == l && o.mark.eq(u[e]) ? o.to = d : i.push(o = new Ft(l, d, u[e])));
			s && s.to == l ? s.to = d : a.push(s = new Pt(l, d, r));
		}
	}), i.forEach((t) => e.step(t)), a.forEach((t) => e.step(t));
}
function Ht(e, t, n, r) {
	let i = [], a = 0;
	e.doc.nodesBetween(t, n, (e, o) => {
		if (!e.isInline) return;
		a++;
		let s = null;
		if (r instanceof Ke) {
			let t = e.marks, n;
			for (; n = r.isInSet(t);) (s ||= []).push(n), t = n.removeFromSet(t);
		} else r ? r.isInSet(e.marks) && (s = [r]) : s = e.marks;
		if (s && s.length) {
			let r = Math.min(o + e.nodeSize, n);
			for (let e = 0; e < s.length; e++) {
				let n = s[e], c;
				for (let e = 0; e < i.length; e++) {
					let t = i[e];
					t.step == a - 1 && n.eq(i[e].style) && (c = t);
				}
				c ? (c.to = r, c.step = a) : i.push({
					style: n,
					from: Math.max(o, t),
					to: r,
					step: a
				});
			}
		}
	}), i.forEach((t) => e.step(new Ft(t.from, t.to, t.style)));
}
function Ut(e, t, n, r = n.contentMatch, i = !0) {
	let a = e.doc.nodeAt(t), o = [], s = t + 1;
	for (let t = 0; t < a.childCount; t++) {
		let c = a.child(t), l = s + c.nodeSize, u = r.matchType(c.type);
		if (!u) o.push(new Rt(s, l, T.empty));
		else {
			r = u;
			for (let t = 0; t < c.marks.length; t++) n.allowsMarkType(c.marks[t].type) || e.step(new Ft(s, l, c.marks[t]));
			if (i && c.isText && n.whitespace != "pre") {
				let e, t = /\r?\n|\r/g, r;
				for (; e = t.exec(c.text);) r ||= new T(C.from(n.schema.text(" ", n.allowedMarks(c.marks))), 0, 0), o.push(new Rt(s + e.index, s + e.index + e[0].length, r));
			}
		}
		s = l;
	}
	if (!r.validEnd) {
		let t = r.fillBefore(C.empty, !0);
		e.replace(s, s, new T(t, 0, 0));
	}
	for (let t = o.length - 1; t >= 0; t--) e.step(o[t]);
}
function Wt(e, t, n) {
	return (t == 0 || e.canReplace(t, e.childCount)) && (n == e.childCount || e.canReplace(0, n));
}
function Gt(e) {
	let t = e.parent.content.cutByIndex(e.startIndex, e.endIndex);
	for (let n = e.depth, r = 0, i = 0;; --n) {
		let a = e.$from.node(n), o = e.$from.index(n) + r, s = e.$to.indexAfter(n) - i;
		if (n < e.depth && a.canReplace(o, s, t)) return n;
		if (n == 0 || a.type.spec.isolating || !Wt(a, o, s)) break;
		o && (r = 1), s < a.childCount && (i = 1);
	}
	return null;
}
function Kt(e, t, n) {
	let { $from: r, $to: i, depth: a } = t, o = r.before(a + 1), s = i.after(a + 1), c = o, l = s, u = C.empty, d = 0;
	for (let e = a, t = !1; e > n; e--) t || r.index(e) > 0 ? (t = !0, u = C.from(r.node(e).copy(u)), d++) : c--;
	let f = C.empty, p = 0;
	for (let e = a, t = !1; e > n; e--) t || i.after(e + 1) < i.end(e) ? (t = !0, f = C.from(i.node(e).copy(f)), p++) : l++;
	e.step(new zt(c, l, o, s, new T(u.append(f), d, p), u.size - d, !0));
}
function qt(e, t, n = null, r = e) {
	let i = Yt(e, t), a = i && Xt(r, t);
	return a ? i.map(Jt).concat({
		type: t,
		attrs: n
	}).concat(a.map(Jt)) : null;
}
function Jt(e) {
	return {
		type: e,
		attrs: null
	};
}
function Yt(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.contentMatchAt(r).findWrapping(t);
	if (!a) return null;
	let o = a.length ? a[0] : t;
	return n.canReplaceWith(r, i, o) ? a : null;
}
function Xt(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.child(r), o = t.contentMatch.findWrapping(a.type);
	if (!o) return null;
	let s = (o.length ? o[o.length - 1] : t).contentMatch;
	for (let e = r; s && e < i; e++) s = s.matchType(n.child(e).type);
	return !s || !s.validEnd ? null : o;
}
function Zt(e, t, n) {
	let r = C.empty;
	for (let e = n.length - 1; e >= 0; e--) {
		if (r.size) {
			let t = n[e].type.contentMatch.matchFragment(r);
			if (!t || !t.validEnd) throw RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
		}
		r = C.from(n[e].type.create(n[e].attrs, r));
	}
	let i = t.start, a = t.end;
	e.step(new zt(i, a, i, a, new T(r, 0, 0), n.length, !0));
}
function Qt(e, t, n, r, i) {
	if (!r.isTextblock) throw RangeError("Type given to setBlockType should be a textblock");
	let a = e.steps.length;
	e.doc.nodesBetween(t, n, (t, n) => {
		let o = typeof i == "function" ? i(t) : i;
		if (t.isTextblock && !t.hasMarkup(r, o) && tn(e.doc, e.mapping.slice(a).map(n), r)) {
			let i = null;
			if (r.schema.linebreakReplacement) {
				let e = r.whitespace == "pre", t = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
				e && !t ? i = !1 : !e && t && (i = !0);
			}
			i === !1 && en(e, t, n, a), Ut(e, e.mapping.slice(a).map(n, 1), r, void 0, i === null);
			let s = e.mapping.slice(a), c = s.map(n, 1), l = s.map(n + t.nodeSize, 1);
			return e.step(new zt(c, l, c + 1, l - 1, new T(C.from(r.create(o, null, t.marks)), 0, 0), 1, !0)), i === !0 && $t(e, t, n, a), !1;
		}
	});
}
function $t(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.isText) {
			let o, s = /\r?\n|\r/g;
			for (; o = s.exec(i.text);) {
				let i = e.mapping.slice(r).map(n + 1 + a + o.index);
				e.replaceWith(i, i + 1, t.type.schema.linebreakReplacement.create());
			}
		}
	});
}
function en(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.type == i.type.schema.linebreakReplacement) {
			let i = e.mapping.slice(r).map(n + 1 + a);
			e.replaceWith(i, i + 1, t.type.schema.text("\n"));
		}
	});
}
function tn(e, t, n) {
	let r = e.resolve(t), i = r.index();
	return r.parent.canReplaceWith(i, i + 1, n);
}
function nn(e, t, n, r, i) {
	let a = e.doc.nodeAt(t);
	if (!a) throw RangeError("No node at given position");
	n ||= a.type;
	let o = n.create(r, null, i || a.marks);
	if (a.isLeaf) return e.replaceWith(t, t + a.nodeSize, o);
	if (!n.validContent(a.content)) throw RangeError("Invalid content for node type " + n.name);
	e.step(new zt(t, t + a.nodeSize, t + 1, t + a.nodeSize - 1, new T(C.from(o), 0, 0), 1, !0));
}
function rn(e, t, n = 1, r) {
	let i = e.resolve(t), a = i.depth - n, o = r && r[r.length - 1] || i.parent;
	if (a < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount))) return !1;
	for (let e = i.depth - 1, t = n - 2; e > a; e--, t--) {
		let n = i.node(e), a = i.index(e);
		if (n.type.spec.isolating) return !1;
		let o = n.content.cutByIndex(a, n.childCount), s = r && r[t + 1];
		s && (o = o.replaceChild(0, s.type.create(s.attrs)));
		let c = r && r[t] || n;
		if (!n.canReplace(a + 1, n.childCount) || !c.type.validContent(o)) return !1;
	}
	let s = i.indexAfter(a), c = r && r[0];
	return i.node(a).canReplaceWith(s, s, c ? c.type : i.node(a + 1).type);
}
function an(e, t, n = 1, r) {
	let i = e.doc.resolve(t), a = C.empty, o = C.empty;
	for (let e = i.depth, t = i.depth - n, s = n - 1; e > t; e--, s--) {
		a = C.from(i.node(e).copy(a));
		let t = r && r[s];
		o = C.from(t ? t.type.create(t.attrs, o) : i.node(e).copy(o));
	}
	e.step(new Rt(t, t, new T(a.append(o), n, n), !0));
}
function on(e, t) {
	let n = e.resolve(t), r = n.index();
	return cn(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function sn(e, t) {
	t.content.size || e.type.compatibleContent(t.type);
	let n = e.contentMatchAt(e.childCount), { linebreakReplacement: r } = e.type.schema;
	for (let i = 0; i < t.childCount; i++) {
		let a = t.child(i), o = a.type == r ? e.type.schema.nodes.text : a.type;
		if (n = n.matchType(o), !n || !e.type.allowsMarks(a.marks)) return !1;
	}
	return n.validEnd;
}
function cn(e, t) {
	return !!(e && t && !e.isLeaf && sn(e, t));
}
function ln(e, t, n = -1) {
	let r = e.resolve(t);
	for (let e = r.depth;; e--) {
		let i, a, o = r.index(e);
		if (e == r.depth ? (i = r.nodeBefore, a = r.nodeAfter) : n > 0 ? (i = r.node(e + 1), o++, a = r.node(e).maybeChild(o)) : (i = r.node(e).maybeChild(o - 1), a = r.node(e + 1)), i && !i.isTextblock && cn(i, a) && r.node(e).canReplace(o, o + 1)) return t;
		if (e == 0) break;
		t = n < 0 ? r.before(e) : r.after(e);
	}
}
function un(e, t, n) {
	let r = null, { linebreakReplacement: i } = e.doc.type.schema, a = e.doc.resolve(t - n), o = a.node().type;
	if (i && o.inlineContent) {
		let e = o.whitespace == "pre", t = !!o.contentMatch.matchType(i);
		e && !t ? r = !1 : !e && t && (r = !0);
	}
	let s = e.steps.length;
	if (r === !1) {
		let r = e.doc.resolve(t + n);
		en(e, r.node(), r.before(), s);
	}
	o.inlineContent && Ut(e, t + n - 1, o, a.node().contentMatchAt(a.index()), r == null);
	let c = e.mapping.slice(s), l = c.map(t - n);
	if (e.step(new Rt(l, c.map(t + n, -1), T.empty, !0)), r === !0) {
		let t = e.doc.resolve(l);
		$t(e, t.node(), t.before(), e.steps.length);
	}
	return e;
}
function dn(e, t, n) {
	let r = e.resolve(t);
	if (r.parent.canReplaceWith(r.index(), r.index(), n)) return t;
	if (r.parentOffset == 0) for (let e = r.depth - 1; e >= 0; e--) {
		let t = r.index(e);
		if (r.node(e).canReplaceWith(t, t, n)) return r.before(e + 1);
		if (t > 0) return null;
	}
	if (r.parentOffset == r.parent.content.size) for (let e = r.depth - 1; e >= 0; e--) {
		let t = r.indexAfter(e);
		if (r.node(e).canReplaceWith(t, t, n)) return r.after(e + 1);
		if (t < r.node(e).childCount) return null;
	}
	return null;
}
function fn(e, t, n) {
	let r = e.resolve(t);
	if (!n.content.size) return t;
	let i = n.content;
	for (let e = 0; e < n.openStart; e++) i = i.firstChild.content;
	for (let e = 1; e <= (n.openStart == 0 && n.size ? 2 : 1); e++) for (let t = r.depth; t >= 0; t--) {
		let n = t == r.depth ? 0 : r.pos <= (r.start(t + 1) + r.end(t + 1)) / 2 ? -1 : 1, a = r.index(t) + +(n > 0), o = r.node(t), s = !1;
		if (e == 1) s = o.canReplace(a, a, i);
		else {
			let e = o.contentMatchAt(a).findWrapping(i.firstChild.type);
			s = e && o.canReplaceWith(a, a, e[0]);
		}
		if (s) return n == 0 ? r.pos : n < 0 ? r.before(t + 1) : r.after(t + 1);
	}
	return null;
}
function pn(e, t, n = t, r = T.empty) {
	if (t == n && !r.size) return null;
	let i = e.resolve(t), a = e.resolve(n);
	return mn(i, a, r) ? new Rt(t, n, r) : new hn(i, a, r).fit();
}
function mn(e, t, n) {
	return !n.openStart && !n.openEnd && e.start() == t.start() && e.parent.canReplace(e.index(), t.index(), n.content);
}
var hn = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = C.empty;
		for (let t = 0; t <= e.depth; t++) {
			let n = e.node(t);
			this.frontier.push({
				type: n.type,
				match: n.contentMatchAt(e.indexAfter(t))
			});
		}
		for (let t = e.depth; t > 0; t--) this.placed = C.from(e.node(t).copy(this.placed));
	}
	get depth() {
		return this.frontier.length - 1;
	}
	fit() {
		for (; this.unplaced.size;) {
			let e = this.findFittable();
			e ? this.placeNodes(e) : this.openMore() || this.dropNode();
		}
		let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, n = this.$from, r = this.close(e < 0 ? this.$to : n.doc.resolve(e));
		if (!r) return null;
		let i = this.placed, a = n.depth, o = r.depth;
		for (; a && o && i.childCount == 1;) i = i.firstChild.content, a--, o--;
		let s = new T(i, a, o);
		return e > -1 ? new zt(n.pos, e, this.$to.pos, this.$to.end(), s, t) : s.size || n.pos != this.$to.pos ? new Rt(n.pos, r.pos, s) : null;
	}
	findFittable() {
		let e = this.unplaced.openStart;
		for (let t = this.unplaced.content, n = 0, r = this.unplaced.openEnd; n < e; n++) {
			let i = t.firstChild;
			if (t.childCount > 1 && (r = 0), i.type.spec.isolating && r <= n) {
				e = n;
				break;
			}
			t = i.content;
		}
		for (let t = 1; t <= 2; t++) for (let n = t == 1 ? e : this.unplaced.openStart; n >= 0; n--) {
			let e, r = null;
			n ? (r = vn(this.unplaced.content, n - 1).firstChild, e = r.content) : e = this.unplaced.content;
			let i = e.firstChild;
			for (let e = this.depth; e >= 0; e--) {
				let { type: a, match: o } = this.frontier[e], s, c = null;
				if (t == 1 && (i ? o.matchType(i.type) || (c = o.fillBefore(C.from(i), !1)) : r && a.compatibleContent(r.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					inject: c
				};
				if (t == 2 && i && (s = o.findWrapping(i.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					wrap: s
				};
				if (r && o.matchType(r.type)) break;
			}
		}
	}
	openMore() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = vn(e, t);
		return !r.childCount || r.firstChild.isLeaf ? !1 : (this.unplaced = new T(e, t + 1, Math.max(n, r.size + t >= e.size - n ? t + 1 : 0)), !0);
	}
	dropNode() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = vn(e, t);
		if (r.childCount <= 1 && t > 0) {
			let i = e.size - t <= t + r.size;
			this.unplaced = new T(gn(e, t - 1, 1), t - 1, i ? t - 1 : n);
		} else this.unplaced = new T(gn(e, t, 1), t, n);
	}
	placeNodes({ sliceDepth: e, frontierDepth: t, parent: n, inject: r, wrap: i }) {
		for (; this.depth > t;) this.closeFrontierNode();
		if (i) for (let e = 0; e < i.length; e++) this.openFrontierNode(i[e]);
		let a = this.unplaced, o = n ? n.content : a.content, s = a.openStart - e, c = 0, l = [], { match: u, type: d } = this.frontier[t];
		if (r) {
			for (let e = 0; e < r.childCount; e++) l.push(r.child(e));
			u = u.matchFragment(r);
		}
		let f = o.size + e - (a.content.size - a.openEnd);
		for (; c < o.childCount;) {
			let e = o.child(c), t = u.matchType(e.type);
			if (!t) break;
			c++, (c > 1 || s == 0 || e.content.size) && (u = t, l.push(yn(e.mark(d.allowedMarks(e.marks)), c == 1 ? s : 0, c == o.childCount ? f : -1)));
		}
		let p = c == o.childCount;
		p || (f = -1), this.placed = _n(this.placed, t, C.from(l)), this.frontier[t].match = u, p && f < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
		for (let e = 0, t = o; e < f; e++) {
			let e = t.lastChild;
			this.frontier.push({
				type: e.type,
				match: e.contentMatchAt(e.childCount)
			}), t = e.content;
		}
		this.unplaced = p ? e == 0 ? T.empty : new T(gn(a.content, e - 1, 1), e - 1, f < 0 ? a.openEnd : e - 1) : new T(gn(a.content, e, c), a.openStart, a.openEnd);
	}
	mustMoveInline() {
		if (!this.$to.parent.isTextblock) return -1;
		let e = this.frontier[this.depth], t;
		if (!e.type.isTextblock || !bn(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth) return -1;
		let { depth: n } = this.$to, r = this.$to.after(n);
		for (; n > 1 && r == this.$to.end(--n);) ++r;
		return r;
	}
	findCloseLevel(e) {
		scan: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
			let { match: n, type: r } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), a = bn(e, t, r, n, i);
			if (a) {
				for (let n = t - 1; n >= 0; n--) {
					let { match: t, type: r } = this.frontier[n], i = bn(e, n, r, t, !0);
					if (!i || i.childCount) continue scan;
				}
				return {
					depth: t,
					fit: a,
					move: i ? e.doc.resolve(e.after(t + 1)) : e
				};
			}
		}
	}
	close(e) {
		let t = this.findCloseLevel(e);
		if (!t) return null;
		for (; this.depth > t.depth;) this.closeFrontierNode();
		t.fit.childCount && (this.placed = _n(this.placed, t.depth, t.fit)), e = t.move;
		for (let n = t.depth + 1; n <= e.depth; n++) {
			let t = e.node(n), r = t.type.contentMatch.fillBefore(t.content, !0, e.index(n));
			this.openFrontierNode(t.type, t.attrs, r);
		}
		return e;
	}
	openFrontierNode(e, t = null, n) {
		let r = this.frontier[this.depth];
		r.match = r.match.matchType(e), this.placed = _n(this.placed, this.depth, C.from(e.create(t, n))), this.frontier.push({
			type: e,
			match: e.contentMatch
		});
	}
	closeFrontierNode() {
		let e = this.frontier.pop().match.fillBefore(C.empty, !0);
		e.childCount && (this.placed = _n(this.placed, this.frontier.length, e));
	}
};
function gn(e, t, n) {
	return t == 0 ? e.cutByIndex(n, e.childCount) : e.replaceChild(0, e.firstChild.copy(gn(e.firstChild.content, t - 1, n)));
}
function _n(e, t, n) {
	return t == 0 ? e.append(n) : e.replaceChild(e.childCount - 1, e.lastChild.copy(_n(e.lastChild.content, t - 1, n)));
}
function vn(e, t) {
	for (let n = 0; n < t; n++) e = e.firstChild.content;
	return e;
}
function yn(e, t, n) {
	if (t <= 0) return e;
	let r = e.content;
	return t > 1 && (r = r.replaceChild(0, yn(r.firstChild, t - 1, r.childCount == 1 ? n - 1 : 0))), t > 0 && (r = e.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(e.type.contentMatch.matchFragment(r).fillBefore(C.empty, !0)))), e.copy(r);
}
function bn(e, t, n, r, i) {
	let a = e.node(t), o = i ? e.indexAfter(t) : e.index(t);
	if (o == a.childCount && !n.compatibleContent(a.type)) return null;
	let s = r.fillBefore(a.content, !0, o);
	return s && !xn(n, a.content, o) ? s : null;
}
function xn(e, t, n) {
	for (let r = n; r < t.childCount; r++) if (!e.allowsMarks(t.child(r).marks)) return !0;
	return !1;
}
function Sn(e) {
	return e.spec.defining || e.spec.definingForContent;
}
function Cn(e, t, n, r) {
	if (!r.size) return e.deleteRange(t, n);
	let i = e.doc.resolve(t), a = e.doc.resolve(n);
	if (mn(i, a, r)) return e.step(new Rt(t, n, r));
	let o = Dn(i, a);
	o[o.length - 1] == 0 && o.pop();
	let s = -(i.depth + 1);
	o.unshift(s);
	for (let e = i.depth, t = i.pos - 1; e > 0; e--, t--) {
		let n = i.node(e).type.spec;
		if (n.defining || n.definingAsContext || n.isolating) break;
		o.indexOf(e) > -1 ? s = e : i.before(e) == t && o.splice(1, 0, -e);
	}
	let c = o.indexOf(s), l = [], u = r.openStart;
	for (let e = r.content, t = 0;; t++) {
		let n = e.firstChild;
		if (l.push(n), t == r.openStart) break;
		e = n.content;
	}
	for (let e = u - 1; e >= 0; e--) {
		let t = l[e], n = Sn(t.type);
		if (n && !t.sameMarkup(i.node(Math.abs(s) - 1))) u = e;
		else if (n || !t.type.isTextblock) break;
	}
	for (let t = r.openStart; t >= 0; t--) {
		let s = (t + u + 1) % (r.openStart + 1), d = l[s];
		if (d) for (let t = 0; t < o.length; t++) {
			let l = o[(t + c) % o.length], u = !0;
			l < 0 && (u = !1, l = -l);
			let f = i.node(l - 1), p = i.index(l - 1);
			if (f.canReplaceWith(p, p, d.type, d.marks)) return e.replace(i.before(l), u ? a.after(l) : n, new T(wn(r.content, 0, r.openStart, s), s, r.openEnd));
		}
	}
	let d = e.steps.length;
	for (let s = o.length - 1; s >= 0 && (e.replace(t, n, r), !(e.steps.length > d)); s--) {
		let e = o[s];
		e < 0 || (t = i.before(e), n = a.after(e));
	}
}
function wn(e, t, n, r, i) {
	if (t < n) {
		let i = e.firstChild;
		e = e.replaceChild(0, i.copy(wn(i.content, t + 1, n, r, i)));
	}
	if (t > r) {
		let t = i.contentMatchAt(0), n = t.fillBefore(e).append(e);
		e = n.append(t.matchFragment(n).fillBefore(C.empty, !0));
	}
	return e;
}
function Tn(e, t, n, r) {
	if (!r.isInline && t == n && e.doc.resolve(t).parent.content.size) {
		let i = dn(e.doc, t, r.type);
		i != null && (t = n = i);
	}
	e.replaceRange(t, n, new T(C.from(r), 0, 0));
}
function En(e, t, n) {
	let r = e.doc.resolve(t), i = e.doc.resolve(n);
	if (r.parent.isTextblock && i.parent.isTextblock && r.start() != i.start() && r.parentOffset == 0 && i.parentOffset == 0) {
		let a = r.sharedDepth(n), o = !1;
		for (let e = r.depth; e > a; e--) r.node(e).type.spec.isolating && (o = !0);
		for (let e = i.depth; e > a; e--) i.node(e).type.spec.isolating && (o = !0);
		if (!o) {
			for (let e = r.depth; e > 0 && t == r.start(e); e--) t = r.before(e);
			for (let e = i.depth; e > 0 && n == i.start(e); e--) n = i.before(e);
			r = e.doc.resolve(t), i = e.doc.resolve(n);
		}
	}
	let a = Dn(r, i);
	for (let t = 0; t < a.length; t++) {
		let n = a[t], o = t == a.length - 1;
		if (o && n == 0 || r.node(n).type.contentMatch.validEnd) return e.delete(r.start(n), i.end(n));
		if (n > 0 && (o || r.node(n - 1).canReplace(r.index(n - 1), i.indexAfter(n - 1)))) return e.delete(r.before(n), i.after(n));
	}
	for (let a = 1; a <= r.depth && a <= i.depth; a++) if (t - r.start(a) == r.depth - a && n > r.end(a) && i.end(a) - n != i.depth - a && r.start(a - 1) == i.start(a - 1) && r.node(a - 1).canReplace(r.index(a - 1), i.index(a - 1))) return e.delete(r.before(a), n);
	e.delete(t, n);
}
function Dn(e, t) {
	let n = [], r = Math.min(e.depth, t.depth);
	for (let i = r; i >= 0; i--) {
		let r = e.start(i);
		if (r < e.pos - (e.depth - i) || t.end(i) > t.pos + (t.depth - i) || e.node(i).type.spec.isolating || t.node(i).type.spec.isolating) break;
		(r == t.start(i) || i == e.depth && i == t.depth && e.parent.inlineContent && t.parent.inlineContent && i && t.start(i - 1) == r - 1) && n.push(i);
	}
	return n;
}
var On = class e extends jt {
	constructor(e, t, n) {
		super(), this.pos = e, this.attr = t, this.value = n;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return Mt.fail("No node at attribute step's position");
		let n = Object.create(null);
		for (let e in t.attrs) n[e] = t.attrs[e];
		n[this.attr] = this.value;
		let r = t.type.create(n, null, t.marks);
		return Mt.fromReplace(e, this.pos, this.pos + 1, new T(C.from(r), 0, +!t.isLeaf));
	}
	getMap() {
		return Ot.empty;
	}
	invert(t) {
		return new e(this.pos, this.attr, t.nodeAt(this.pos).attrs[this.attr]);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.attr, this.value);
	}
	toJSON() {
		return {
			stepType: "attr",
			pos: this.pos,
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number" || typeof n.attr != "string") throw RangeError("Invalid input for AttrStep.fromJSON");
		return new e(n.pos, n.attr, n.value);
	}
};
jt.jsonID("attr", On);
var kn = class e extends jt {
	constructor(e, t) {
		super(), this.attr = e, this.value = t;
	}
	apply(e) {
		let t = Object.create(null);
		for (let n in e.attrs) t[n] = e.attrs[n];
		t[this.attr] = this.value;
		let n = e.type.create(t, e.content, e.marks);
		return Mt.ok(n);
	}
	getMap() {
		return Ot.empty;
	}
	invert(t) {
		return new e(this.attr, t.attrs[this.attr]);
	}
	map(e) {
		return this;
	}
	toJSON() {
		return {
			stepType: "docAttr",
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.attr != "string") throw RangeError("Invalid input for DocAttrStep.fromJSON");
		return new e(n.attr, n.value);
	}
};
jt.jsonID("docAttr", kn);
var An = class extends Error {};
An = function e(t) {
	let n = Error.call(this, t);
	return n.__proto__ = e.prototype, n;
}, An.prototype = Object.create(Error.prototype), An.prototype.constructor = An, An.prototype.name = "TransformError";
var jn = class {
	constructor(e) {
		this.doc = e, this.steps = [], this.docs = [], this.mapping = new kt();
	}
	get before() {
		return this.docs.length ? this.docs[0] : this.doc;
	}
	step(e) {
		let t = this.maybeStep(e);
		if (t.failed) throw new An(t.failed);
		return this;
	}
	maybeStep(e) {
		let t = e.apply(this.doc);
		return t.failed || this.addStep(e, t.doc), t;
	}
	get docChanged() {
		return this.steps.length > 0;
	}
	changedRange() {
		let e = 1e9, t = -1e9;
		for (let n = 0; n < this.mapping.maps.length; n++) {
			let r = this.mapping.maps[n];
			n && (e = r.map(e, 1), t = r.map(t, -1)), r.forEach((n, r, i, a) => {
				e = Math.min(e, i), t = Math.max(t, a);
			});
		}
		return e == 1e9 ? null : {
			from: e,
			to: t
		};
	}
	addStep(e, t) {
		this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
	}
	replace(e, t = e, n = T.empty) {
		let r = pn(this.doc, e, t, n);
		return r && this.step(r), this;
	}
	replaceWith(e, t, n) {
		return this.replace(e, t, new T(C.from(n), 0, 0));
	}
	delete(e, t) {
		return this.replace(e, t, T.empty);
	}
	insert(e, t) {
		return this.replaceWith(e, e, t);
	}
	replaceRange(e, t, n) {
		return Cn(this, e, t, n), this;
	}
	replaceRangeWith(e, t, n) {
		return Tn(this, e, t, n), this;
	}
	deleteRange(e, t) {
		return En(this, e, t), this;
	}
	lift(e, t) {
		return Kt(this, e, t), this;
	}
	join(e, t = 1) {
		return un(this, e, t), this;
	}
	wrap(e, t) {
		return Zt(this, e, t), this;
	}
	setBlockType(e, t = e, n, r = null) {
		return Qt(this, e, t, n, r), this;
	}
	setNodeMarkup(e, t, n = null, r) {
		return nn(this, e, t, n, r), this;
	}
	setNodeAttribute(e, t, n) {
		return this.step(new On(e, t, n)), this;
	}
	setDocAttribute(e, t) {
		return this.step(new kn(e, t)), this;
	}
	addNodeMark(e, t) {
		return this.step(new It(e, t)), this;
	}
	removeNodeMark(e, t) {
		let n = this.doc.nodeAt(e);
		if (!n) throw RangeError("No node at position " + e);
		if (t instanceof w) t.isInSet(n.marks) && this.step(new Lt(e, t));
		else {
			let r = n.marks, i, a = [];
			for (; i = t.isInSet(r);) a.push(new Lt(e, i)), r = i.removeFromSet(r);
			for (let e = a.length - 1; e >= 0; e--) this.step(a[e]);
		}
		return this;
	}
	split(e, t = 1, n) {
		return an(this, e, t, n), this;
	}
	addMark(e, t, n) {
		return Vt(this, e, t, n), this;
	}
	removeMark(e, t, n) {
		return Ht(this, e, t, n), this;
	}
	clearIncompatible(e, t, n) {
		return Ut(this, e, t, n), this;
	}
}, Mn = Object.create(null), k = class {
	constructor(e, t, n) {
		this.$anchor = e, this.$head = t, this.ranges = n || [new Nn(e.min(t), e.max(t))];
	}
	get anchor() {
		return this.$anchor.pos;
	}
	get head() {
		return this.$head.pos;
	}
	get from() {
		return this.$from.pos;
	}
	get to() {
		return this.$to.pos;
	}
	get $from() {
		return this.ranges[0].$from;
	}
	get $to() {
		return this.ranges[0].$to;
	}
	get empty() {
		let e = this.ranges;
		for (let t = 0; t < e.length; t++) if (e[t].$from.pos != e[t].$to.pos) return !1;
		return !0;
	}
	content() {
		return this.$from.doc.slice(this.from, this.to, !0);
	}
	replace(e, t = T.empty) {
		let n = t.content.lastChild, r = null;
		for (let e = 0; e < t.openEnd; e++) r = n, n = n.lastChild;
		let i = e.steps.length, a = this.ranges;
		for (let o = 0; o < a.length; o++) {
			let { $from: s, $to: c } = a[o], l = e.mapping.slice(i);
			e.replaceRange(l.map(s.pos), l.map(c.pos), o ? T.empty : t), o == 0 && Vn(e, i, (n ? n.isInline : r && r.isTextblock) ? -1 : 1);
		}
	}
	replaceWith(e, t) {
		let n = e.steps.length, r = this.ranges;
		for (let i = 0; i < r.length; i++) {
			let { $from: a, $to: o } = r[i], s = e.mapping.slice(n), c = s.map(a.pos), l = s.map(o.pos);
			i ? e.deleteRange(c, l) : (e.replaceRangeWith(c, l, t), Vn(e, n, t.isInline ? -1 : 1));
		}
	}
	static findFrom(e, t, n = !1) {
		let r = e.parent.inlineContent ? new A(e) : Bn(e.node(0), e.parent, e.pos, e.index(), t, n);
		if (r) return r;
		for (let r = e.depth - 1; r >= 0; r--) {
			let i = t < 0 ? Bn(e.node(0), e.node(r), e.before(r + 1), e.index(r), t, n) : Bn(e.node(0), e.node(r), e.after(r + 1), e.index(r) + 1, t, n);
			if (i) return i;
		}
		return null;
	}
	static near(e, t = 1) {
		return this.findFrom(e, t) || this.findFrom(e, -t) || new Rn(e.node(0));
	}
	static atStart(e) {
		return Bn(e, e, 0, 0, 1) || new Rn(e);
	}
	static atEnd(e) {
		return Bn(e, e, e.content.size, e.childCount, -1) || new Rn(e);
	}
	static fromJSON(e, t) {
		if (!t || !t.type) throw RangeError("Invalid input for Selection.fromJSON");
		let n = Mn[t.type];
		if (!n) throw RangeError(`No selection type ${t.type} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in Mn) throw RangeError("Duplicate use of selection JSON ID " + e);
		return Mn[e] = t, t.prototype.jsonID = e, t;
	}
	getBookmark() {
		return A.between(this.$anchor, this.$head).getBookmark();
	}
};
k.prototype.visible = !0;
var Nn = class {
	constructor(e, t) {
		this.$from = e, this.$to = t;
	}
}, Pn = !1;
function Fn(e) {
	!Pn && !e.parent.inlineContent && (Pn = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + e.parent.type.name + ")"));
}
var A = class e extends k {
	constructor(e, t = e) {
		Fn(e), Fn(t), super(e, t);
	}
	get $cursor() {
		return this.$anchor.pos == this.$head.pos ? this.$head : null;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		if (!r.parent.inlineContent) return k.near(r);
		let i = t.resolve(n.map(this.anchor));
		return new e(i.parent.inlineContent ? i : r, r);
	}
	replace(e, t = T.empty) {
		if (super.replace(e, t), t == T.empty) {
			let t = this.$from.marksAcross(this.$to);
			t && e.ensureMarks(t);
		}
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor && t.head == this.head;
	}
	getBookmark() {
		return new In(this.anchor, this.head);
	}
	toJSON() {
		return {
			type: "text",
			anchor: this.anchor,
			head: this.head
		};
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number" || typeof n.head != "number") throw RangeError("Invalid input for TextSelection.fromJSON");
		return new e(t.resolve(n.anchor), t.resolve(n.head));
	}
	static create(e, t, n = t) {
		let r = e.resolve(t);
		return new this(r, n == t ? r : e.resolve(n));
	}
	static between(t, n, r) {
		let i = t.pos - n.pos;
		if ((!r || i) && (r = i >= 0 ? 1 : -1), !n.parent.inlineContent) {
			let e = k.findFrom(n, r, !0) || k.findFrom(n, -r, !0);
			if (e) n = e.$head;
			else return k.near(n, r);
		}
		return t.parent.inlineContent || (i == 0 ? t = n : (t = (k.findFrom(t, -r, !0) || k.findFrom(t, r, !0)).$anchor, t.pos < n.pos != i < 0 && (t = n))), new e(t, n);
	}
};
k.jsonID("text", A);
var In = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		return A.between(e.resolve(this.anchor), e.resolve(this.head));
	}
}, j = class e extends k {
	constructor(e) {
		let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
		super(e, n), this.node = t;
	}
	map(t, n) {
		let { deleted: r, pos: i } = n.mapResult(this.anchor), a = t.resolve(i);
		return r ? k.near(a) : new e(a);
	}
	content() {
		return new T(C.from(this.node), 0, 0);
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor;
	}
	toJSON() {
		return {
			type: "node",
			anchor: this.anchor
		};
	}
	getBookmark() {
		return new Ln(this.anchor);
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number") throw RangeError("Invalid input for NodeSelection.fromJSON");
		return new e(t.resolve(n.anchor));
	}
	static create(t, n) {
		return new e(t.resolve(n));
	}
	static isSelectable(e) {
		return !e.isText && e.type.spec.selectable !== !1;
	}
};
j.prototype.visible = !1, k.jsonID("node", j);
var Ln = class e {
	constructor(e) {
		this.anchor = e;
	}
	map(t) {
		let { deleted: n, pos: r } = t.mapResult(this.anchor);
		return n ? new In(r, r) : new e(r);
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = t.nodeAfter;
		return n && j.isSelectable(n) ? new j(t) : k.near(t);
	}
}, Rn = class e extends k {
	constructor(e) {
		super(e.resolve(0), e.resolve(e.content.size));
	}
	replace(e, t = T.empty) {
		if (t == T.empty) {
			e.delete(0, e.doc.content.size);
			let t = k.atStart(e.doc);
			t.eq(e.selection) || e.setSelection(t);
		} else super.replace(e, t);
	}
	toJSON() {
		return { type: "all" };
	}
	static fromJSON(t) {
		return new e(t);
	}
	map(t) {
		return new e(t);
	}
	eq(t) {
		return t instanceof e;
	}
	getBookmark() {
		return zn;
	}
};
k.jsonID("all", Rn);
var zn = {
	map() {
		return this;
	},
	resolve(e) {
		return new Rn(e);
	}
};
function Bn(e, t, n, r, i, a = !1) {
	if (t.inlineContent) return A.create(e, n);
	for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < t.childCount : o >= 0; o += i) {
		let r = t.child(o);
		if (!r.isAtom) {
			let t = Bn(e, r, n + i, i < 0 ? r.childCount : 0, i, a);
			if (t) return t;
		} else if (!a && j.isSelectable(r)) return j.create(e, n - (i < 0 ? r.nodeSize : 0));
		n += r.nodeSize * i;
	}
	return null;
}
function Vn(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof Rt || i instanceof zt)) return;
	let a = e.mapping.maps[r], o;
	a.forEach((e, t, n, r) => {
		o ??= r;
	}), e.setSelection(k.near(e.doc.resolve(o), n));
}
var Hn = 1, Un = 2, Wn = 4, Gn = class extends jn {
	constructor(e) {
		super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
	}
	get selection() {
		return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
	}
	setSelection(e) {
		if (e.$from.doc != this.doc) throw RangeError("Selection passed to setSelection must point at the current document");
		return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Hn) & -3, this.storedMarks = null, this;
	}
	get selectionSet() {
		return (this.updated & Hn) > 0;
	}
	setStoredMarks(e) {
		return this.storedMarks = e, this.updated |= Un, this;
	}
	ensureMarks(e) {
		return w.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
	}
	addStoredMark(e) {
		return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
	}
	removeStoredMark(e) {
		return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
	}
	get storedMarksSet() {
		return (this.updated & Un) > 0;
	}
	addStep(e, t) {
		super.addStep(e, t), this.updated &= -3, this.storedMarks = null;
	}
	setTime(e) {
		return this.time = e, this;
	}
	replaceSelection(e) {
		return this.selection.replace(this, e), this;
	}
	replaceSelectionWith(e, t = !0) {
		let n = this.selection;
		return t && (e = e.mark(this.storedMarks || (n.empty ? n.$from.marks() : n.$from.marksAcross(n.$to) || w.none))), n.replaceWith(this, e), this;
	}
	deleteSelection() {
		return this.selection.replace(this), this;
	}
	insertText(e, t, n) {
		let r = this.doc.type.schema;
		if (t == null) return e ? this.replaceSelectionWith(r.text(e), !0) : this.deleteSelection();
		{
			if (n ??= t, !e) return this.deleteRange(t, n);
			let i = this.storedMarks;
			if (!i) {
				let e = this.doc.resolve(t);
				i = n == t ? e.marks() : e.marksAcross(this.doc.resolve(n));
			}
			return this.replaceRangeWith(t, n, r.text(e, i)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(k.near(this.selection.$to)), this;
		}
	}
	setMeta(e, t) {
		return this.meta[typeof e == "string" ? e : e.key] = t, this;
	}
	getMeta(e) {
		return this.meta[typeof e == "string" ? e : e.key];
	}
	get isGeneric() {
		for (let e in this.meta) return !1;
		return !0;
	}
	scrollIntoView() {
		return this.updated |= Wn, this;
	}
	get scrolledIntoView() {
		return (this.updated & Wn) > 0;
	}
};
function Kn(e, t) {
	return !t || !e ? e : e.bind(t);
}
var qn = class {
	constructor(e, t, n) {
		this.name = e, this.init = Kn(t.init, n), this.apply = Kn(t.apply, n);
	}
}, Jn = [
	new qn("doc", {
		init(e) {
			return e.doc || e.schema.topNodeType.createAndFill();
		},
		apply(e) {
			return e.doc;
		}
	}),
	new qn("selection", {
		init(e, t) {
			return e.selection || k.atStart(t.doc);
		},
		apply(e) {
			return e.selection;
		}
	}),
	new qn("storedMarks", {
		init(e) {
			return e.storedMarks || null;
		},
		apply(e, t, n, r) {
			return r.selection.$cursor ? e.storedMarks : null;
		}
	}),
	new qn("scrollToSelection", {
		init() {
			return 0;
		},
		apply(e, t) {
			return e.scrolledIntoView ? t + 1 : t;
		}
	})
], Yn = class {
	constructor(e, t) {
		this.schema = e, this.plugins = [], this.pluginsByKey = Object.create(null), this.fields = Jn.slice(), t && t.forEach((e) => {
			if (this.pluginsByKey[e.key]) throw RangeError("Adding different instances of a keyed plugin (" + e.key + ")");
			this.plugins.push(e), this.pluginsByKey[e.key] = e, e.spec.state && this.fields.push(new qn(e.key, e.spec.state, e));
		});
	}
}, Xn = class e {
	constructor(e) {
		this.config = e;
	}
	get schema() {
		return this.config.schema;
	}
	get plugins() {
		return this.config.plugins;
	}
	apply(e) {
		return this.applyTransaction(e).state;
	}
	filterTransaction(e, t = -1) {
		for (let n = 0; n < this.config.plugins.length; n++) if (n != t) {
			let t = this.config.plugins[n];
			if (t.spec.filterTransaction && !t.spec.filterTransaction.call(t, e, this)) return !1;
		}
		return !0;
	}
	applyTransaction(e) {
		if (!this.filterTransaction(e)) return {
			state: this,
			transactions: []
		};
		let t = [e], n = this.applyInner(e), r = null;
		for (;;) {
			let i = !1;
			for (let a = 0; a < this.config.plugins.length; a++) {
				let o = this.config.plugins[a];
				if (o.spec.appendTransaction) {
					let s = r ? r[a].n : 0, c = r ? r[a].state : this, l = s < t.length && o.spec.appendTransaction.call(o, s ? t.slice(s) : t, c, n);
					if (l && n.filterTransaction(l, a)) {
						if (l.setMeta("appendedTransaction", e), !r) {
							r = [];
							for (let e = 0; e < this.config.plugins.length; e++) r.push(e < a ? {
								state: n,
								n: t.length
							} : {
								state: this,
								n: 0
							});
						}
						t.push(l), n = n.applyInner(l), i = !0;
					}
					r && (r[a] = {
						state: n,
						n: t.length
					});
				}
			}
			if (!i) return {
				state: n,
				transactions: t
			};
		}
	}
	applyInner(t) {
		if (!t.before.eq(this.doc)) throw RangeError("Applying a mismatched transaction");
		let n = new e(this.config), r = this.config.fields;
		for (let e = 0; e < r.length; e++) {
			let i = r[e];
			n[i.name] = i.apply(t, this[i.name], this, n);
		}
		return n;
	}
	get tr() {
		return new Gn(this);
	}
	static create(t) {
		let n = new Yn(t.doc ? t.doc.type.schema : t.schema, t.plugins), r = new e(n);
		for (let e = 0; e < n.fields.length; e++) r[n.fields[e].name] = n.fields[e].init(t, r);
		return r;
	}
	reconfigure(t) {
		let n = new Yn(this.schema, t.plugins), r = n.fields, i = new e(n);
		for (let e = 0; e < r.length; e++) {
			let n = r[e].name;
			i[n] = this.hasOwnProperty(n) ? this[n] : r[e].init(t, i);
		}
		return i;
	}
	toJSON(e) {
		let t = {
			doc: this.doc.toJSON(),
			selection: this.selection.toJSON()
		};
		if (this.storedMarks && (t.storedMarks = this.storedMarks.map((e) => e.toJSON())), e && typeof e == "object") for (let n in e) {
			if (n == "doc" || n == "selection") throw RangeError("The JSON fields `doc` and `selection` are reserved");
			let r = e[n], i = r.spec.state;
			i && i.toJSON && (t[n] = i.toJSON.call(r, this[r.key]));
		}
		return t;
	}
	static fromJSON(t, n, r) {
		if (!n) throw RangeError("Invalid input for EditorState.fromJSON");
		if (!t.schema) throw RangeError("Required config field 'schema' missing");
		let i = new Yn(t.schema, t.plugins), a = new e(i);
		return i.fields.forEach((e) => {
			if (e.name == "doc") a.doc = Se.fromJSON(t.schema, n.doc);
			else if (e.name == "selection") a.selection = k.fromJSON(a.doc, n.selection);
			else if (e.name == "storedMarks") n.storedMarks && (a.storedMarks = n.storedMarks.map(t.schema.markFromJSON));
			else {
				if (r) for (let i in r) {
					let o = r[i], s = o.spec.state;
					if (o.key == e.name && s && s.fromJSON && Object.prototype.hasOwnProperty.call(n, i)) {
						a[e.name] = s.fromJSON.call(o, t, n[i], a);
						return;
					}
				}
				a[e.name] = e.init(t, a);
			}
		}), a;
	}
};
function Zn(e, t, n) {
	for (let r in e) {
		let i = e[r];
		i instanceof Function ? i = i.bind(t) : r == "handleDOMEvents" && (i = Zn(i, t, {})), n[r] = i;
	}
	return n;
}
var Qn = class {
	constructor(e) {
		this.spec = e, this.props = {}, e.props && Zn(e.props, this, this.props), this.key = e.key ? e.key.key : er("plugin");
	}
	getState(e) {
		return e[this.key];
	}
}, $n = Object.create(null);
function er(e) {
	return e in $n ? e + "$" + ++$n[e] : ($n[e] = 0, e + "$");
}
var tr = class {
	constructor(e = "key") {
		this.key = er(e);
	}
	get(e) {
		return e.config.pluginsByKey[this.key];
	}
	getState(e) {
		return e[this.key];
	}
}, nr = (e, t) => e.selection.empty ? !1 : (t && t(e.tr.deleteSelection().scrollIntoView()), !0);
function rr(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("backward", e) : n.parentOffset > 0) ? null : n;
}
var ir = (e, t, n) => {
	let r = rr(e, n);
	if (!r) return !1;
	let i = ur(r);
	if (!i) {
		let n = r.blockRange(), i = n && Gt(n);
		return i == null ? !1 : (t && t(e.tr.lift(n, i).scrollIntoView()), !0);
	}
	let a = i.nodeBefore;
	if (Or(e, i, t, -1)) return !0;
	if (r.parent.content.size == 0 && (cr(a, "end") || j.isSelectable(a))) for (let n = r.depth;; n--) {
		let o = pn(e.doc, r.before(n), r.after(n), T.empty);
		if (o && o.slice.size < o.to - o.from) {
			if (t) {
				let n = e.tr.step(o);
				n.setSelection(cr(a, "end") ? k.findFrom(n.doc.resolve(n.mapping.map(i.pos, -1)), -1) : j.create(n.doc, i.pos - a.nodeSize)), t(n.scrollIntoView());
			}
			return !0;
		}
		if (n == 1 || r.node(n - 1).childCount > 1) break;
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos - a.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, ar = (e, t, n) => {
	let r = rr(e, n);
	if (!r) return !1;
	let i = ur(r);
	return i ? sr(e, i, t) : !1;
}, or = (e, t, n) => {
	let r = dr(e, n);
	if (!r) return !1;
	let i = mr(r);
	return i ? sr(e, i, t) : !1;
};
function sr(e, t, n) {
	let r = t.nodeBefore, i = t.pos - 1;
	for (; !r.isTextblock; i--) {
		if (r.type.spec.isolating) return !1;
		let e = r.lastChild;
		if (!e) return !1;
		r = e;
	}
	let a = t.nodeAfter, o = t.pos + 1;
	for (; !a.isTextblock; o++) {
		if (a.type.spec.isolating) return !1;
		let e = a.firstChild;
		if (!e) return !1;
		a = e;
	}
	let s = pn(e.doc, i, o, T.empty);
	if (!s || s.from != i || s instanceof Rt && s.slice.size >= o - i) return !1;
	if (n) {
		let t = e.tr.step(s);
		t.setSelection(A.create(t.doc, i)), n(t.scrollIntoView());
	}
	return !0;
}
function cr(e, t, n = !1) {
	for (let r = e; r; r = t == "start" ? r.firstChild : r.lastChild) {
		if (r.isTextblock) return !0;
		if (n && r.childCount != 1) return !1;
	}
	return !1;
}
var lr = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("backward", e) : r.parentOffset > 0) return !1;
		a = ur(r);
	}
	let o = a && a.nodeBefore;
	return !o || !j.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(j.create(e.doc, a.pos - o.nodeSize)).scrollIntoView()), !0);
};
function ur(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		if (e.index(t) > 0) return e.doc.resolve(e.before(t + 1));
		if (e.node(t).type.spec.isolating) break;
	}
	return null;
}
function dr(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("forward", e) : n.parentOffset < n.parent.content.size) ? null : n;
}
var fr = (e, t, n) => {
	let r = dr(e, n);
	if (!r) return !1;
	let i = mr(r);
	if (!i) return !1;
	let a = i.nodeAfter;
	if (Or(e, i, t, 1)) return !0;
	if (r.parent.content.size == 0 && (cr(a, "start") || j.isSelectable(a))) {
		let n = pn(e.doc, r.before(), r.after(), T.empty);
		if (n && n.slice.size < n.to - n.from) {
			if (t) {
				let r = e.tr.step(n);
				r.setSelection(cr(a, "start") ? k.findFrom(r.doc.resolve(r.mapping.map(i.pos)), 1) : j.create(r.doc, r.mapping.map(i.pos))), t(r.scrollIntoView());
			}
			return !0;
		}
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos, i.pos + a.nodeSize).scrollIntoView()), !0) : !1;
}, pr = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("forward", e) : r.parentOffset < r.parent.content.size) return !1;
		a = mr(r);
	}
	let o = a && a.nodeAfter;
	return !o || !j.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(j.create(e.doc, a.pos)).scrollIntoView()), !0);
};
function mr(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		let n = e.node(t);
		if (e.index(t) + 1 < n.childCount) return e.doc.resolve(e.after(t + 1));
		if (n.type.spec.isolating) break;
	}
	return null;
}
var hr = (e, t) => {
	let n = e.selection, r = n instanceof j, i;
	if (r) {
		if (n.node.isTextblock || !on(e.doc, n.from)) return !1;
		i = n.from;
	} else if (i = ln(e.doc, n.from, -1), i == null) return !1;
	if (t) {
		let n = e.tr.join(i);
		r && n.setSelection(j.create(n.doc, i - e.doc.resolve(i).nodeBefore.nodeSize)), t(n.scrollIntoView());
	}
	return !0;
}, gr = (e, t) => {
	let n = e.selection, r;
	if (n instanceof j) {
		if (n.node.isTextblock || !on(e.doc, n.to)) return !1;
		r = n.to;
	} else if (r = ln(e.doc, n.to, 1), r == null) return !1;
	return t && t(e.tr.join(r).scrollIntoView()), !0;
}, _r = (e, t) => {
	let { $from: n, $to: r } = e.selection, i = n.blockRange(r), a = i && Gt(i);
	return a == null ? !1 : (t && t(e.tr.lift(i, a).scrollIntoView()), !0);
}, vr = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (t && t(e.tr.insertText("\n").scrollIntoView()), !0);
};
function yr(e) {
	for (let t = 0; t < e.edgeCount; t++) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var br = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	if (!n.parent.type.spec.code || !n.sameParent(r)) return !1;
	let i = n.node(-1), a = n.indexAfter(-1), o = yr(i.contentMatchAt(a));
	if (!o || !i.canReplaceWith(a, a, o)) return !1;
	if (t) {
		let r = n.after(), i = e.tr.replaceWith(r, r, o.createAndFill());
		i.setSelection(k.near(i.doc.resolve(r), 1)), t(i.scrollIntoView());
	}
	return !0;
}, xr = (e, t) => {
	let n = e.selection, { $from: r, $to: i } = n;
	if (n instanceof Rn || r.parent.inlineContent || i.parent.inlineContent) return !1;
	let a = yr(i.parent.contentMatchAt(i.indexAfter()));
	if (!a || !a.isTextblock) return !1;
	if (t) {
		let n = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, o = e.tr.insert(n, a.createAndFill());
		o.setSelection(A.create(o.doc, n + 1)), t(o.scrollIntoView());
	}
	return !0;
}, Sr = (e, t) => {
	let { $cursor: n } = e.selection;
	if (!n || n.parent.content.size) return !1;
	if (n.depth > 1 && n.after() != n.end(-1)) {
		let r = n.before();
		if (rn(e.doc, r)) return t && t(e.tr.split(r).scrollIntoView()), !0;
	}
	let r = n.blockRange(), i = r && Gt(r);
	return i == null ? !1 : (t && t(e.tr.lift(r, i).scrollIntoView()), !0);
};
function Cr(e) {
	return (t, n) => {
		let { $from: r, $to: i } = t.selection;
		if (t.selection instanceof j && t.selection.node.isBlock) return !r.parentOffset || !rn(t.doc, r.pos) ? !1 : (n && n(t.tr.split(r.pos).scrollIntoView()), !0);
		if (!r.depth) return !1;
		let a = [], o, s, c = !1, l = !1;
		for (let t = r.depth;; t--) if (r.node(t).isBlock) {
			c = r.end(t) == r.pos + (r.depth - t), l = r.start(t) == r.pos - (r.depth - t), s = yr(r.node(t - 1).contentMatchAt(r.indexAfter(t - 1)));
			let n = e && e(i.parent, c, r);
			a.unshift(n || (c && s ? { type: s } : null)), o = t;
			break;
		} else {
			if (t == 1) return !1;
			a.unshift(null);
		}
		let u = t.tr;
		(t.selection instanceof A || t.selection instanceof Rn) && u.deleteSelection();
		let d = u.mapping.map(r.pos), f = rn(u.doc, d, a.length, a);
		if (f ||= (a[0] = s ? { type: s } : null, rn(u.doc, d, a.length, a)), !f) return !1;
		if (u.split(d, a.length, a), !c && l && r.node(o).type != s) {
			let e = u.mapping.map(r.before(o)), t = u.doc.resolve(e);
			s && r.node(o - 1).canReplaceWith(t.index(), t.index() + 1, s) && u.setNodeMarkup(u.mapping.map(r.before(o)), s);
		}
		return n && n(u.scrollIntoView()), !0;
	};
}
var wr = Cr(), Tr = (e, t) => {
	let { $from: n, to: r } = e.selection, i, a = n.sharedDepth(r);
	return a == 0 ? !1 : (i = n.before(a), t && t(e.tr.setSelection(j.create(e.doc, i))), !0);
}, Er = (e, t) => (t && t(e.tr.setSelection(new Rn(e.doc))), !0);
function Dr(e, t, n) {
	let r = t.nodeBefore, i = t.nodeAfter, a = t.index();
	return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && t.parent.canReplace(a - 1, a) ? (n && n(e.tr.delete(t.pos - r.nodeSize, t.pos).scrollIntoView()), !0) : !t.parent.canReplace(a, a + 1) || !(i.isTextblock || on(e.doc, t.pos)) ? !1 : (n && n(e.tr.join(t.pos).scrollIntoView()), !0);
}
function Or(e, t, n, r) {
	let i = t.nodeBefore, a = t.nodeAfter, o, s, c = i.type.spec.isolating || a.type.spec.isolating;
	if (!c && Dr(e, t, n)) return !0;
	let l = !c && t.parent.canReplace(t.index(), t.index() + 1);
	if (l && (o = (s = i.contentMatchAt(i.childCount)).findWrapping(a.type)) && s.matchType(o[0] || a.type).validEnd) {
		if (n) {
			let r = t.pos + a.nodeSize, s = C.empty;
			for (let e = o.length - 1; e >= 0; e--) s = C.from(o[e].create(null, s));
			s = C.from(i.copy(s));
			let c = e.tr.step(new zt(t.pos - 1, r, t.pos, r, new T(s, 1, 0), o.length, !0)), l = c.doc.resolve(r + 2 * o.length);
			l.nodeAfter && l.nodeAfter.type == i.type && on(c.doc, l.pos) && c.join(l.pos), n(c.scrollIntoView());
		}
		return !0;
	}
	let u = a.type.spec.isolating || r > 0 && c ? null : k.findFrom(t, 1), d = u && u.$from.blockRange(u.$to), f = d && Gt(d);
	if (f != null && f >= t.depth) return n && n(e.tr.lift(d, f).scrollIntoView()), !0;
	if (l && cr(a, "start", !0) && cr(i, "end")) {
		let r = i, o = [];
		for (; o.push(r), !r.isTextblock;) r = r.lastChild;
		let s = a, c = 1;
		for (; !s.isTextblock; s = s.firstChild) c++;
		if (r.canReplace(r.childCount, r.childCount, s.content)) {
			if (n) {
				let r = C.empty;
				for (let e = o.length - 1; e >= 0; e--) r = C.from(o[e].copy(r));
				n(e.tr.step(new zt(t.pos - o.length, t.pos + a.nodeSize, t.pos + c, t.pos + a.nodeSize - c, new T(r, o.length, 0), 0, !0)).scrollIntoView());
			}
			return !0;
		}
	}
	return !1;
}
function kr(e) {
	return function(t, n) {
		let r = t.selection, i = e < 0 ? r.$from : r.$to, a = i.depth;
		for (; i.node(a).isInline;) {
			if (!a) return !1;
			a--;
		}
		return i.node(a).isTextblock ? (n && n(t.tr.setSelection(A.create(t.doc, e < 0 ? i.start(a) : i.end(a)))), !0) : !1;
	};
}
var Ar = kr(-1), jr = kr(1);
function Mr(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a), s = o && qt(o, e, t);
		return s ? (r && r(n.tr.wrap(o, s).scrollIntoView()), !0) : !1;
	};
}
function Nr(e, t = null) {
	return function(n, r) {
		let i = !1;
		for (let r = 0; r < n.selection.ranges.length && !i; r++) {
			let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
			n.doc.nodesBetween(a, o, (r, a) => {
				if (i) return !1;
				if (!(!r.isTextblock || r.hasMarkup(e, t))) if (r.type == e) i = !0;
				else {
					let t = n.doc.resolve(a), r = t.index();
					i = t.parent.canReplaceWith(r, r + 1, e);
				}
			});
		}
		if (!i) return !1;
		if (r) {
			let i = n.tr;
			for (let r = 0; r < n.selection.ranges.length; r++) {
				let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
				i.setBlockType(a, o, e, t);
			}
			r(i.scrollIntoView());
		}
		return !0;
	};
}
function Pr(...e) {
	return function(t, n, r) {
		for (let i = 0; i < e.length; i++) if (e[i](t, n, r)) return !0;
		return !1;
	};
}
var Fr = Pr(nr, ir, lr), Ir = Pr(nr, fr, pr), Lr = {
	Enter: Pr(vr, xr, Sr, wr),
	"Mod-Enter": br,
	Backspace: Fr,
	"Mod-Backspace": Fr,
	"Shift-Backspace": Fr,
	Delete: Ir,
	"Mod-Delete": Ir,
	"Mod-a": Er
}, Rr = {
	"Ctrl-h": Lr.Backspace,
	"Alt-Backspace": Lr["Mod-Backspace"],
	"Ctrl-d": Lr.Delete,
	"Ctrl-Alt-Backspace": Lr["Mod-Delete"],
	"Alt-Delete": Lr["Mod-Delete"],
	"Alt-d": Lr["Mod-Delete"],
	"Ctrl-a": Ar,
	"Ctrl-e": jr
};
for (let e in Lr) Rr[e] = Lr[e];
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform();
//#endregion
//#region node_modules/prosemirror-schema-list/dist/index.js
function zr(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a);
		if (!o) return !1;
		let s = r ? n.tr : null;
		return Br(s, o, e, t) ? (r && r(s.scrollIntoView()), !0) : !1;
	};
}
function Br(e, t, n, r = null) {
	let i = !1, a = t, o = t.$from.doc;
	if (t.depth >= 2 && t.$from.node(t.depth - 1).type.compatibleContent(n) && t.startIndex == 0) {
		if (t.$from.index(t.depth - 1) == 0) return !1;
		let e = o.resolve(t.start - 2);
		a = new be(e, e, t.depth), t.endIndex < t.parent.childCount && (t = new be(t.$from, o.resolve(t.$to.end(t.depth)), t.depth)), i = !0;
	}
	let s = qt(a, n, r, t);
	return s ? (e && Vr(e, t, s, i, n), !0) : !1;
}
function Vr(e, t, n, r, i) {
	let a = C.empty;
	for (let e = n.length - 1; e >= 0; e--) a = C.from(n[e].type.create(n[e].attrs, a));
	e.step(new zt(t.start - (r ? 2 : 0), t.end, t.start, t.end, new T(a, 0, 0), n.length, !0));
	let o = 0;
	for (let e = 0; e < n.length; e++) n[e].type == i && (o = e + 1);
	let s = n.length - o, c = t.start + n.length - (r ? 2 : 0), l = t.parent;
	for (let n = t.startIndex, r = t.endIndex, i = !0; n < r; n++, i = !1) !i && rn(e.doc, c, s) && (e.split(c, s), c += 2 * s), c += l.child(n).nodeSize;
	return e;
}
function Hr(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && t.firstChild.type == e);
		return a ? n ? r.node(a.depth - 1).type == e ? Ur(t, n, e, a) : Wr(t, n, a) : !0 : !1;
	};
}
function Ur(e, t, n, r) {
	let i = e.tr, a = r.end, o = r.$to.end(r.depth);
	a < o && (i.step(new zt(a - 1, o, a, o, new T(C.from(n.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new be(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
	let s = Gt(r);
	if (s == null) return !1;
	i.lift(r, s);
	let c = i.doc.resolve(i.mapping.map(a, -1) - 1);
	return on(i.doc, c.pos) && c.nodeBefore.type == c.nodeAfter.type && i.join(c.pos), t(i.scrollIntoView()), !0;
}
function Wr(e, t, n) {
	let r = e.tr, i = n.parent;
	for (let e = n.end, t = n.endIndex - 1, a = n.startIndex; t > a; t--) e -= i.child(t).nodeSize, r.delete(e - 1, e + 1);
	let a = r.doc.resolve(n.start), o = a.nodeAfter;
	if (r.mapping.map(n.end) != n.start + a.nodeAfter.nodeSize) return !1;
	let s = n.startIndex == 0, c = n.endIndex == i.childCount, l = a.node(-1), u = a.index(-1);
	if (!l.canReplace(u + +!s, u + 1, o.content.append(c ? C.empty : C.from(i)))) return !1;
	let d = a.pos, f = d + o.nodeSize;
	return r.step(new zt(d - +!!s, f + +!!c, d + 1, f - 1, new T((s ? C.empty : C.from(i.copy(C.empty))).append(c ? C.empty : C.from(i.copy(C.empty))), +!s, +!c), +!s)), t(r.scrollIntoView()), !0;
}
function Gr(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && t.firstChild.type == e);
		if (!a) return !1;
		let o = a.startIndex;
		if (o == 0) return !1;
		let s = a.parent, c = s.child(o - 1);
		if (c.type != e) return !1;
		if (n) {
			let r = c.lastChild && c.lastChild.type == s.type, i = C.from(r ? e.create() : null), o = new T(C.from(e.create(null, C.from(s.type.create(null, i)))), r ? 3 : 1, 0), l = a.start, u = a.end;
			n(t.tr.step(new zt(l - (r ? 3 : 1), u, l, u, o, 1, !0)).scrollIntoView());
		}
		return !0;
	};
}
//#endregion
//#region node_modules/prosemirror-view/dist/index.js
var Kr = function(e) {
	for (var t = 0;; t++) if (e = e.previousSibling, !e) return t;
}, qr = function(e) {
	let t = e.assignedSlot || e.parentNode;
	return t && t.nodeType == 11 ? t.host : t;
}, Jr = null, Yr = function(e, t, n) {
	let r = Jr ||= document.createRange();
	return r.setEnd(e, n ?? e.nodeValue.length), r.setStart(e, t || 0), r;
}, Xr = function() {
	Jr = null;
}, Zr = function(e, t, n, r) {
	return n && ($r(e, t, n, r, -1) || $r(e, t, n, r, 1));
}, Qr = /^(img|br|input|textarea|hr)$/i;
function $r(e, t, n, r, i) {
	for (;;) {
		if (e == n && t == r) return !0;
		if (t == (i < 0 ? 0 : ei(e))) {
			let n = e.parentNode;
			if (!n || n.nodeType != 1 || ii(e) || Qr.test(e.nodeName) || e.contentEditable == "false") return !1;
			t = Kr(e) + (i < 0 ? 0 : 1), e = n;
		} else if (e.nodeType == 1) {
			let n = e.childNodes[t + (i < 0 ? -1 : 0)];
			if (n.nodeType == 1 && n.contentEditable == "false") if (n.pmViewDesc?.ignoreForSelection) t += i;
			else return !1;
			else e = n, t = i < 0 ? ei(e) : 0;
		} else return !1;
	}
}
function ei(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function ti(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t) return e;
		if (e.nodeType == 1 && t > 0) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t - 1], t = ei(e);
		} else if (e.parentNode && !ii(e)) t = Kr(e), e = e.parentNode;
		else return null;
	}
}
function ni(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t < e.nodeValue.length) return e;
		if (e.nodeType == 1 && t < e.childNodes.length) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t], t = 0;
		} else if (e.parentNode && !ii(e)) t = Kr(e) + 1, e = e.parentNode;
		else return null;
	}
}
function ri(e, t, n) {
	for (let r = t == 0, i = t == ei(e); r || i;) {
		if (e == n) return !0;
		let t = Kr(e);
		if (e = e.parentNode, !e) return !1;
		r &&= t == 0, i &&= t == ei(e);
	}
}
function ii(e) {
	let t;
	for (let n = e; n && !(t = n.pmViewDesc); n = n.parentNode);
	return t && t.node && t.node.isBlock && (t.dom == e || t.contentDOM == e);
}
var ai = function(e) {
	return e.focusNode && Zr(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset);
};
function oi(e, t) {
	let n = document.createEvent("Event");
	return n.initEvent("keydown", !0, !0), n.keyCode = e, n.key = n.code = t, n;
}
function si(e) {
	let t = e.activeElement;
	for (; t && t.shadowRoot;) t = t.shadowRoot.activeElement;
	return t;
}
function ci(e, t, n) {
	if (e.caretPositionFromPoint) try {
		let r = e.caretPositionFromPoint(t, n);
		if (r) return {
			node: r.offsetNode,
			offset: Math.min(ei(r.offsetNode), r.offset)
		};
	} catch {}
	if (e.caretRangeFromPoint) {
		let r = e.caretRangeFromPoint(t, n);
		if (r) return {
			node: r.startContainer,
			offset: Math.min(ei(r.startContainer), r.startOffset)
		};
	}
}
var li = typeof navigator < "u" ? navigator : null, ui = typeof document < "u" ? document : null, di = li && li.userAgent || "", fi = /Edge\/(\d+)/.exec(di), pi = /MSIE \d/.exec(di), mi = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(di), M = !!(pi || mi || fi), hi = pi ? document.documentMode : mi ? +mi[1] : fi ? +fi[1] : 0, gi = !M && /gecko\/(\d+)/i.test(di);
gi && +(/Firefox\/(\d+)/.exec(di) || [0, 0])[1];
var _i = !M && /Chrome\/(\d+)/.exec(di), vi = !!_i, yi = _i ? +_i[1] : 0, bi = !M && !!li && /Apple Computer/.test(li.vendor), xi = bi && (/Mobile\/\w+/.test(di) || !!li && li.maxTouchPoints > 2), Si = xi || (li ? /Mac/.test(li.platform) : !1), Ci = li ? /Win/.test(li.platform) : !1, wi = /Android \d/.test(di), Ti = !!ui && "webkitFontSmoothing" in ui.documentElement.style, Ei = Ti ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function Di(e) {
	let t = e.defaultView && e.defaultView.visualViewport;
	return t ? {
		left: 0,
		right: t.width,
		top: 0,
		bottom: t.height
	} : {
		left: 0,
		right: e.documentElement.clientWidth,
		top: 0,
		bottom: e.documentElement.clientHeight
	};
}
function Oi(e, t) {
	return typeof e == "number" ? e : e[t];
}
function ki(e) {
	let t = e.getBoundingClientRect(), n = t.width / e.offsetWidth || 1, r = t.height / e.offsetHeight || 1;
	return {
		left: t.left,
		right: t.left + e.clientWidth * n,
		top: t.top,
		bottom: t.top + e.clientHeight * r
	};
}
function Ai(e, t, n) {
	let r = e.someProp("scrollThreshold") || 0, i = e.someProp("scrollMargin") || 5, a = e.dom.ownerDocument;
	for (let o = n || e.dom; o;) {
		if (o.nodeType != 1) {
			o = qr(o);
			continue;
		}
		let e = o, n = e == a.body, s = n ? Di(a) : ki(e), c = 0, l = 0;
		if (t.top < s.top + Oi(r, "top") ? l = -(s.top - t.top + Oi(i, "top")) : t.bottom > s.bottom - Oi(r, "bottom") && (l = t.bottom - t.top > s.bottom - s.top ? t.top + Oi(i, "top") - s.top : t.bottom - s.bottom + Oi(i, "bottom")), t.left < s.left + Oi(r, "left") ? c = -(s.left - t.left + Oi(i, "left")) : t.right > s.right - Oi(r, "right") && (c = t.right - s.right + Oi(i, "right")), c || l) if (n) a.defaultView.scrollBy(c, l);
		else {
			let n = e.scrollLeft, r = e.scrollTop;
			l && (e.scrollTop += l), c && (e.scrollLeft += c);
			let i = e.scrollLeft - n, a = e.scrollTop - r;
			t = {
				left: t.left - i,
				top: t.top - a,
				right: t.right - i,
				bottom: t.bottom - a
			};
		}
		let u = n ? "fixed" : getComputedStyle(o).position;
		if (/^(fixed|sticky)$/.test(u)) break;
		o = u == "absolute" ? o.offsetParent : qr(o);
	}
}
function ji(e) {
	let t = e.dom.getBoundingClientRect(), n = Math.max(0, t.top), r, i;
	for (let a = (t.left + t.right) / 2, o = n + 1; o < Math.min(innerHeight, t.bottom); o += 5) {
		let t = e.root.elementFromPoint(a, o);
		if (!t || t == e.dom || !e.dom.contains(t)) continue;
		let s = t.getBoundingClientRect();
		if (s.top >= n - 20) {
			r = t, i = s.top;
			break;
		}
	}
	return {
		refDOM: r,
		refTop: i,
		stack: Mi(e.dom)
	};
}
function Mi(e) {
	let t = [], n = e.ownerDocument;
	for (let r = e; r && (t.push({
		dom: r,
		top: r.scrollTop,
		left: r.scrollLeft
	}), e != n); r = qr(r));
	return t;
}
function Ni({ refDOM: e, refTop: t, stack: n }) {
	let r = e ? e.getBoundingClientRect().top : 0;
	Pi(n, r == 0 ? 0 : r - t);
}
function Pi(e, t) {
	for (let n = 0; n < e.length; n++) {
		let { dom: r, top: i, left: a } = e[n];
		r.scrollTop != i + t && (r.scrollTop = i + t), r.scrollLeft != a && (r.scrollLeft = a);
	}
}
var Fi = null;
function Ii(e) {
	if (e.setActive) return e.setActive();
	if (Fi) return e.focus(Fi);
	let t = Mi(e);
	e.focus(Fi == null ? { get preventScroll() {
		return Fi = { preventScroll: !0 }, !0;
	} } : void 0), Fi || (Fi = !1, Pi(t, 0));
}
function Li(e, t) {
	let n, r = 2e8, i, a = 0, o = t.top, s = t.top, c, l;
	for (let u = e.firstChild, d = 0; u; u = u.nextSibling, d++) {
		let e;
		if (u.nodeType == 1) e = u.getClientRects();
		else if (u.nodeType == 3) e = Yr(u).getClientRects();
		else continue;
		for (let f = 0; f < e.length; f++) {
			let p = e[f];
			if (p.top <= o && p.bottom >= s) {
				o = Math.max(p.bottom, o), s = Math.min(p.top, s);
				let e = p.left > t.left ? p.left - t.left : p.right < t.left ? t.left - p.right : 0;
				if (e < r) {
					n = u, r = e, i = e && n.nodeType == 3 ? {
						left: p.right < t.left ? p.right : p.left,
						top: t.top
					} : t, u.nodeType == 1 && e && (a = d + +(t.left >= (p.left + p.right) / 2));
					continue;
				}
			} else p.top > t.top && !c && p.left <= t.left && p.right >= t.left && (c = u, l = {
				left: Math.max(p.left, Math.min(p.right, t.left)),
				top: p.top
			});
			!n && (t.left >= p.right && t.top >= p.top || t.left >= p.left && t.top >= p.bottom) && (a = d + 1);
		}
	}
	return !n && c && (n = c, i = l, r = 0), n && n.nodeType == 3 ? Ri(n, i) : !n || r && n.nodeType == 1 ? {
		node: e,
		offset: a
	} : Li(n, i);
}
function Ri(e, t) {
	let n = e.nodeValue.length, r = document.createRange(), i;
	for (let a = 0; a < n; a++) {
		r.setEnd(e, a + 1), r.setStart(e, a);
		let n = Wi(r, 1);
		if (n.top != n.bottom && zi(t, n)) {
			i = {
				node: e,
				offset: a + +(t.left >= (n.left + n.right) / 2)
			};
			break;
		}
	}
	return r.detach(), i || {
		node: e,
		offset: 0
	};
}
function zi(e, t) {
	return e.left >= t.left - 1 && e.left <= t.right + 1 && e.top >= t.top - 1 && e.top <= t.bottom + 1;
}
function N(e, t) {
	let n = e.parentNode;
	return n && /^li$/i.test(n.nodeName) && t.left < e.getBoundingClientRect().left ? n : e;
}
function P(e, t, n) {
	let { node: r, offset: i } = Li(t, n), a = -1;
	if (r.nodeType == 1 && !r.firstChild) {
		let e = r.getBoundingClientRect();
		a = e.left != e.right && n.left > (e.left + e.right) / 2 ? 1 : -1;
	}
	return e.docView.posFromDOM(r, i, a);
}
function Bi(e, t, n, r) {
	let i = -1;
	for (let n = t, a = !1; n != e.dom;) {
		let t = e.docView.nearestDesc(n, !0), o;
		if (!t) return null;
		if (t.dom.nodeType == 1 && (t.node.isBlock && t.parent || !t.contentDOM) && ((o = t.dom.getBoundingClientRect()).width || o.height) && (t.node.isBlock && t.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(t.dom.nodeName) && (!a && o.left > r.left || o.top > r.top ? i = t.posBefore : (!a && o.right < r.left || o.bottom < r.top) && (i = t.posAfter), a = !0), !t.contentDOM && i < 0 && !t.node.isText)) return (t.node.isBlock ? r.top < (o.top + o.bottom) / 2 : r.left < (o.left + o.right) / 2) ? t.posBefore : t.posAfter;
		n = t.dom.parentNode;
	}
	return i > -1 ? i : e.docView.posFromDOM(t, n, -1);
}
function Vi(e, t, n) {
	let r = e.childNodes.length;
	if (r && n.top < n.bottom) for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (t.top - n.top) / (n.bottom - n.top)) - 2)), a = i;;) {
		let n = e.childNodes[a];
		if (n.nodeType == 1) {
			let e = n.getClientRects();
			for (let r = 0; r < e.length; r++) {
				let i = e[r];
				if (zi(t, i)) return Vi(n, t, i);
			}
		}
		if ((a = (a + 1) % r) == i) break;
	}
	return e;
}
function Hi(e, t) {
	let n = e.dom.ownerDocument, r, i = 0, a = ci(n, t.left, t.top);
	a && ({node: r, offset: i} = a);
	let o = (e.root.elementFromPoint ? e.root : n).elementFromPoint(t.left, t.top), s;
	if (!o || !e.dom.contains(o.nodeType == 1 ? o : o.parentNode)) {
		let n = e.dom.getBoundingClientRect();
		if (!zi(t, n) || (o = Vi(e.dom, t, n), !o)) return null;
	}
	if (bi) for (let e = o; r && e; e = qr(e)) e.draggable && (r = void 0);
	if (o = N(o, t), r) {
		if (gi && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
			let e = r.childNodes[i], n;
			e.nodeName == "IMG" && (n = e.getBoundingClientRect()).right <= t.left && n.bottom > t.top && i++;
		}
		let n;
		Ti && i && r.nodeType == 1 && (n = r.childNodes[i - 1]).nodeType == 1 && n.contentEditable == "false" && n.getBoundingClientRect().top >= t.top && i--, r == e.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && t.top > r.lastChild.getBoundingClientRect().bottom ? s = e.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (s = Bi(e, r, i, t));
	}
	s ??= P(e, o, t);
	let c = e.docView.nearestDesc(o, !0);
	return {
		pos: s,
		inside: c ? c.posAtStart - c.border : -1
	};
}
function Ui(e) {
	return e.top < e.bottom || e.left < e.right;
}
function Wi(e, t) {
	let n = e.getClientRects();
	if (n.length) {
		let e = n[t < 0 ? 0 : n.length - 1];
		if (Ui(e)) return e;
	}
	return Array.prototype.find.call(n, Ui) || e.getBoundingClientRect();
}
var Gi = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Ki(e, t, n) {
	let { node: r, offset: i, atom: a } = e.docView.domFromPos(t, n < 0 ? -1 : 1), o = Ti || gi;
	if (r.nodeType == 3) if (o && (Gi.test(r.nodeValue) || (n < 0 ? !i : i == r.nodeValue.length))) {
		let e = Wi(Yr(r, i, i), n);
		if (gi && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
			let t = Wi(Yr(r, i - 1, i - 1), -1);
			if (t.top == e.top) {
				let n = Wi(Yr(r, i, i + 1), -1);
				if (n.top != e.top) return qi(n, n.left < t.left);
			}
		}
		return e;
	} else {
		let e = i, t = i, a = n < 0 ? 1 : -1;
		return n < 0 && !i ? (t++, a = -1) : n >= 0 && i == r.nodeValue.length ? (e--, a = 1) : n < 0 ? e-- : t++, qi(Wi(Yr(r, e, t), a), a < 0);
	}
	if (!e.state.doc.resolve(t - (a || 0)).parent.inlineContent) {
		if (a == null && i && (n < 0 || i == ei(r))) {
			let e = r.childNodes[i - 1];
			if (e.nodeType == 1) return Ji(e.getBoundingClientRect(), !1);
		}
		if (a == null && i < ei(r)) {
			let e = r.childNodes[i];
			if (e.nodeType == 1) return Ji(e.getBoundingClientRect(), !0);
		}
		return Ji(r.getBoundingClientRect(), n >= 0);
	}
	if (a == null && i && (n < 0 || i == ei(r))) {
		let e = r.childNodes[i - 1], t = e.nodeType == 3 ? Yr(e, ei(e) - +!o) : e.nodeType == 1 && (e.nodeName != "BR" || !e.nextSibling) ? e : null;
		if (t) return qi(Wi(t, 1), !1);
	}
	if (a == null && i < ei(r)) {
		let e = r.childNodes[i];
		for (; e.pmViewDesc && e.pmViewDesc.ignoreForCoords;) e = e.nextSibling;
		let t = e ? e.nodeType == 3 ? Yr(e, 0, +!o) : e.nodeType == 1 ? e : null : null;
		if (t) return qi(Wi(t, -1), !0);
	}
	return qi(Wi(r.nodeType == 3 ? Yr(r) : r, -n), n >= 0);
}
function qi(e, t) {
	if (e.width == 0) return e;
	let n = t ? e.left : e.right;
	return {
		top: e.top,
		bottom: e.bottom,
		left: n,
		right: n
	};
}
function Ji(e, t) {
	if (e.height == 0) return e;
	let n = t ? e.top : e.bottom;
	return {
		top: n,
		bottom: n,
		left: e.left,
		right: e.right
	};
}
function Yi(e, t, n) {
	let r = e.state, i = e.root.activeElement;
	r != t && e.updateState(t), i != e.dom && e.focus();
	try {
		return n();
	} finally {
		r != t && e.updateState(r), i != e.dom && i && i.focus();
	}
}
function Xi(e, t, n) {
	let r = t.selection, i = n == "up" ? r.$from : r.$to;
	return Yi(e, t, () => {
		let { node: t } = e.docView.domFromPos(i.pos, n == "up" ? -1 : 1);
		for (;;) {
			let n = e.docView.nearestDesc(t, !0);
			if (!n) break;
			if (n.node.isBlock) {
				t = n.contentDOM || n.dom;
				break;
			}
			t = n.dom.parentNode;
		}
		let r = Ki(e, i.pos, 1);
		for (let e = t.firstChild; e; e = e.nextSibling) {
			let t;
			if (e.nodeType == 1) t = e.getClientRects();
			else if (e.nodeType == 3) t = Yr(e, 0, e.nodeValue.length).getClientRects();
			else continue;
			for (let e = 0; e < t.length; e++) {
				let i = t[e];
				if (i.bottom > i.top + 1 && (n == "up" ? r.top - i.top > (i.bottom - r.top) * 2 : i.bottom - r.bottom > (r.bottom - i.top) * 2)) return !1;
			}
		}
		return !0;
	});
}
var Zi = /[\u0590-\u08ac]/;
function Qi(e, t, n) {
	let { $head: r } = t.selection;
	if (!r.parent.isTextblock) return !1;
	let i = r.parentOffset, a = !i, o = i == r.parent.content.size, s = e.domSelection();
	return s ? !Zi.test(r.parent.textContent) || !s.modify ? n == "left" || n == "backward" ? a : o : Yi(e, t, () => {
		let { focusNode: t, focusOffset: i, anchorNode: a, anchorOffset: o } = e.domSelectionRange(), c = s.caretBidiLevel;
		s.modify("move", n, "character");
		let l = r.depth ? e.docView.domAfterPos(r.before()) : e.dom, { focusNode: u, focusOffset: d } = e.domSelectionRange(), f = u && !l.contains(u.nodeType == 1 ? u : u.parentNode) || t == u && i == d;
		try {
			s.collapse(a, o), t && (t != a || i != o) && s.extend && s.extend(t, i);
		} catch {}
		return c != null && (s.caretBidiLevel = c), f;
	}) : r.pos == r.start() || r.pos == r.end();
}
var $i = null, ea = null, ta = !1;
function na(e, t, n) {
	return $i == t && ea == n ? ta : ($i = t, ea = n, ta = n == "up" || n == "down" ? Xi(e, t, n) : Qi(e, t, n));
}
var ra = 0, ia = 1, aa = 2, F = 3, oa = class {
	constructor(e, t, n, r) {
		this.parent = e, this.children = t, this.dom = n, this.contentDOM = r, this.dirty = ra, n.pmViewDesc = this;
	}
	matchesWidget(e) {
		return !1;
	}
	matchesMark(e) {
		return !1;
	}
	matchesNode(e, t, n) {
		return !1;
	}
	matchesHack(e) {
		return !1;
	}
	parseRule() {
		return null;
	}
	stopEvent(e) {
		return !1;
	}
	get size() {
		let e = 0;
		for (let t = 0; t < this.children.length; t++) e += this.children[t].size;
		return e;
	}
	get border() {
		return 0;
	}
	destroy() {
		this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
		for (let e = 0; e < this.children.length; e++) this.children[e].destroy();
	}
	posBeforeChild(e) {
		for (let t = 0, n = this.posAtStart;; t++) {
			let r = this.children[t];
			if (r == e) return n;
			n += r.size;
		}
	}
	get posBefore() {
		return this.parent.posBeforeChild(this);
	}
	get posAtStart() {
		return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
	}
	get posAfter() {
		return this.posBefore + this.size;
	}
	get posAtEnd() {
		return this.posAtStart + this.size - 2 * this.border;
	}
	localPosFromDOM(e, t, n) {
		if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode)) if (n < 0) {
			let n, r;
			if (e == this.contentDOM) n = e.childNodes[t - 1];
			else {
				for (; e.parentNode != this.contentDOM;) e = e.parentNode;
				n = e.previousSibling;
			}
			for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.previousSibling;
			return n ? this.posBeforeChild(r) + r.size : this.posAtStart;
		} else {
			let n, r;
			if (e == this.contentDOM) n = e.childNodes[t];
			else {
				for (; e.parentNode != this.contentDOM;) e = e.parentNode;
				n = e.nextSibling;
			}
			for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.nextSibling;
			return n ? this.posBeforeChild(r) : this.posAtEnd;
		}
		let r;
		if (e == this.dom && this.contentDOM) r = t > Kr(this.contentDOM);
		else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) r = e.compareDocumentPosition(this.contentDOM) & 2;
		else if (this.dom.firstChild) {
			if (t == 0) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !1;
					break;
				}
				if (t.previousSibling) break;
			}
			if (r == null && t == e.childNodes.length) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !0;
					break;
				}
				if (t.nextSibling) break;
			}
		}
		return r ?? n > 0 ? this.posAtEnd : this.posAtStart;
	}
	nearestDesc(e, t = !1) {
		for (let n = !0, r = e; r; r = r.parentNode) {
			let i = this.getDesc(r), a;
			if (i && (!t || i.node)) if (n && (a = i.nodeDOM) && !(a.nodeType == 1 ? a.contains(e.nodeType == 1 ? e : e.parentNode) : a == e)) n = !1;
			else return i;
		}
	}
	getDesc(e) {
		let t = e.pmViewDesc;
		for (let e = t; e; e = e.parent) if (e == this) return t;
	}
	posFromDOM(e, t, n) {
		for (let r = e; r; r = r.parentNode) {
			let i = this.getDesc(r);
			if (i) return i.localPosFromDOM(e, t, n);
		}
		return -1;
	}
	descAt(e) {
		for (let t = 0, n = 0; t < this.children.length; t++) {
			let r = this.children[t], i = n + r.size;
			if (n == e && i != n) {
				for (; !r.border && r.children.length;) for (let e = 0; e < r.children.length; e++) {
					let t = r.children[e];
					if (t.size) {
						r = t;
						break;
					}
				}
				return r;
			}
			if (e < i) return r.descAt(e - n - r.border);
			n = i;
		}
	}
	domFromPos(e, t) {
		if (!this.contentDOM) return {
			node: this.dom,
			offset: 0,
			atom: e + 1
		};
		let n = 0, r = 0;
		for (let t = 0; n < this.children.length; n++) {
			let i = this.children[n], a = t + i.size;
			if (a > e || i instanceof pa) {
				r = e - t;
				break;
			}
			t = a;
		}
		if (r) return this.children[n].domFromPos(r - this.children[n].border, t);
		for (let e; n && !(e = this.children[n - 1]).size && e instanceof sa && e.side >= 0; n--);
		if (t <= 0) {
			let e, r = !0;
			for (; e = n ? this.children[n - 1] : null, !(!e || e.dom.parentNode == this.contentDOM); n--, r = !1);
			return e && t && r && !e.border && !e.domAtom ? e.domFromPos(e.size, t) : {
				node: this.contentDOM,
				offset: e ? Kr(e.dom) + 1 : 0
			};
		} else {
			let e, r = !0;
			for (; e = n < this.children.length ? this.children[n] : null, !(!e || e.dom.parentNode == this.contentDOM); n++, r = !1);
			return e && r && !e.border && !e.domAtom ? e.domFromPos(0, t) : {
				node: this.contentDOM,
				offset: e ? Kr(e.dom) : this.contentDOM.childNodes.length
			};
		}
	}
	parseRange(e, t, n = 0) {
		if (this.children.length == 0) return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: 0,
			toOffset: this.contentDOM.childNodes.length
		};
		let r = -1, i = -1;
		for (let a = n, o = 0;; o++) {
			let n = this.children[o], s = a + n.size;
			if (r == -1 && e <= s) {
				let i = a + n.border;
				if (e >= i && t <= s - n.border && n.node && n.contentDOM && this.contentDOM.contains(n.contentDOM)) return n.parseRange(e, t, i);
				e = a;
				for (let t = o; t > 0; t--) {
					let n = this.children[t - 1];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(1)) {
						r = Kr(n.dom) + 1;
						break;
					}
					e -= n.size;
				}
				r == -1 && (r = 0);
			}
			if (r > -1 && (s > t || o == this.children.length - 1)) {
				t = s;
				for (let e = o + 1; e < this.children.length; e++) {
					let n = this.children[e];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(-1)) {
						i = Kr(n.dom);
						break;
					}
					t += n.size;
				}
				i == -1 && (i = this.contentDOM.childNodes.length);
				break;
			}
			a = s;
		}
		return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: r,
			toOffset: i
		};
	}
	emptyChildAt(e) {
		if (this.border || !this.contentDOM || !this.children.length) return !1;
		let t = this.children[e < 0 ? 0 : this.children.length - 1];
		return t.size == 0 || t.emptyChildAt(e);
	}
	domAfterPos(e) {
		let { node: t, offset: n } = this.domFromPos(e, 0);
		if (t.nodeType != 1 || n == t.childNodes.length) throw RangeError("No node after pos " + e);
		return t.childNodes[n];
	}
	setSelection(e, t, n, r = !1) {
		let i = Math.min(e, t), a = Math.max(e, t);
		for (let o = 0, s = 0; o < this.children.length; o++) {
			let c = this.children[o], l = s + c.size;
			if (i > s && a < l) return c.setSelection(e - s - c.border, t - s - c.border, n, r);
			s = l;
		}
		let o = this.domFromPos(e, e ? -1 : 1), s = t == e ? o : this.domFromPos(t, t ? -1 : 1), c = n.root.getSelection(), l = n.domSelectionRange(), u = !1;
		if ((gi || bi) && e == t) {
			let { node: e, offset: t } = o;
			if (e.nodeType == 3) {
				if (u = !!(t && e.nodeValue[t - 1] == "\n"), u && t == e.nodeValue.length) for (let t = e, n; t; t = t.parentNode) {
					if (n = t.nextSibling) {
						n.nodeName == "BR" && (o = s = {
							node: n.parentNode,
							offset: Kr(n) + 1
						});
						break;
					}
					let e = t.pmViewDesc;
					if (e && e.node && e.node.isBlock) break;
				}
			} else {
				let n = e.childNodes[t - 1];
				u = n && (n.nodeName == "BR" || n.contentEditable == "false");
			}
		}
		if (gi && l.focusNode && l.focusNode != s.node && l.focusNode.nodeType == 1) {
			let e = l.focusNode.childNodes[l.focusOffset];
			e && e.contentEditable == "false" && (r = !0);
		}
		if (!(r || u && bi) && Zr(o.node, o.offset, l.anchorNode, l.anchorOffset) && Zr(s.node, s.offset, l.focusNode, l.focusOffset)) return;
		let d = !1;
		if ((c.extend || e == t) && !(u && gi)) {
			c.collapse(o.node, o.offset);
			try {
				e != t && c.extend(s.node, s.offset), d = !0;
			} catch {}
		}
		if (!d) {
			if (e > t) {
				let e = o;
				o = s, s = e;
			}
			let n = document.createRange();
			n.setEnd(s.node, s.offset), n.setStart(o.node, o.offset), c.removeAllRanges(), c.addRange(n);
		}
	}
	ignoreMutation(e) {
		return !this.contentDOM && e.type != "selection";
	}
	get contentLost() {
		return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
	}
	markDirty(e, t) {
		for (let n = 0, r = 0; r < this.children.length; r++) {
			let i = this.children[r], a = n + i.size;
			if (n == a ? e <= a && t >= n : e < a && t > n) {
				let r = n + i.border, o = a - i.border;
				if (e >= r && t <= o) {
					this.dirty = e == n || t == a ? aa : ia, e == r && t == o && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = F : i.markDirty(e - r, t - r);
					return;
				} else i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? aa : F;
			}
			n = a;
		}
		this.dirty = aa;
	}
	markParentsDirty() {
		let e = 1;
		for (let t = this.parent; t; t = t.parent, e++) {
			let n = e == 1 ? aa : ia;
			t.dirty < n && (t.dirty = n);
		}
	}
	get domAtom() {
		return !1;
	}
	get ignoreForCoords() {
		return !1;
	}
	get ignoreForSelection() {
		return !1;
	}
	isText(e) {
		return !1;
	}
}, sa = class extends oa {
	constructor(e, t, n, r) {
		let i, a = t.type.toDOM;
		if (typeof a == "function" && (a = a(n, () => {
			if (!i) return r;
			if (i.parent) return i.parent.posBeforeChild(i);
		})), !t.type.spec.raw) {
			if (a.nodeType != 1) {
				let e = document.createElement("span");
				e.appendChild(a), a = e;
			}
			a.contentEditable = "false", a.classList.add("ProseMirror-widget");
		}
		super(e, [], a, null), this.widget = t, this.widget = t, i = this;
	}
	matchesWidget(e) {
		return this.dirty == ra && e.type.eq(this.widget.type);
	}
	parseRule() {
		return { ignore: !0 };
	}
	stopEvent(e) {
		let t = this.widget.spec.stopEvent;
		return t ? t(e) : !1;
	}
	ignoreMutation(e) {
		return e.type != "selection" || this.widget.spec.ignoreSelection;
	}
	destroy() {
		this.widget.type.destroy(this.dom), super.destroy();
	}
	get domAtom() {
		return !0;
	}
	get ignoreForSelection() {
		return !!this.widget.type.spec.relaxedSide;
	}
	get side() {
		return this.widget.type.side;
	}
}, ca = class extends oa {
	constructor(e, t, n, r) {
		super(e, [], t, null), this.textDOM = n, this.text = r;
	}
	get size() {
		return this.text.length;
	}
	localPosFromDOM(e, t) {
		return e == this.textDOM ? this.posAtStart + t : this.posAtStart + (t ? this.size : 0);
	}
	domFromPos(e) {
		return {
			node: this.textDOM,
			offset: e
		};
	}
	ignoreMutation(e) {
		return e.type === "characterData" && e.target.nodeValue == e.oldValue;
	}
}, la = class e extends oa {
	constructor(e, t, n, r, i) {
		super(e, [], n, r), this.mark = t, this.spec = i;
	}
	static create(t, n, r, i) {
		let a = i.nodeViews[n.type.name], o = a && a(n, i, r);
		return (!o || !o.dom) && (o = dt.renderSpec(document, n.type.spec.toDOM(n, r), null, n.attrs)), new e(t, n, o.dom, o.contentDOM || o.dom, o);
	}
	parseRule() {
		return this.dirty & F || this.mark.type.spec.reparseInView ? null : {
			mark: this.mark.type.name,
			attrs: this.mark.attrs,
			contentElement: this.contentDOM
		};
	}
	matchesMark(e) {
		return this.dirty != F && this.mark.eq(e);
	}
	markDirty(e, t) {
		if (super.markDirty(e, t), this.dirty != ra) {
			let e = this.parent;
			for (; !e.node;) e = e.parent;
			e.dirty < this.dirty && (e.dirty = this.dirty), this.dirty = ra;
		}
	}
	slice(t, n, r) {
		let i = e.create(this.parent, this.mark, !0, r), a = this.children, o = this.size;
		n < o && (a = Aa(a, n, o, r)), t > 0 && (a = Aa(a, 0, t, r));
		for (let e = 0; e < a.length; e++) a[e].parent = i;
		return i.children = a, i;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
}, ua = class e extends oa {
	constructor(e, t, n, r, i, a, o, s, c) {
		super(e, [], i, a), this.node = t, this.outerDeco = n, this.innerDeco = r, this.nodeDOM = o;
	}
	static create(t, n, r, i, a, o) {
		let s = a.nodeViews[n.type.name], c, l = s && s(n, a, () => {
			if (!c) return o;
			if (c.parent) return c.parent.posBeforeChild(c);
		}, r, i), u = l && l.dom, d = l && l.contentDOM;
		if (n.isText) {
			if (!u) u = document.createTextNode(n.text);
			else if (u.nodeType != 3) throw RangeError("Text must be rendered as a DOM text node");
		} else if (!u) {
			let e = dt.renderSpec(document, n.type.spec.toDOM(n), null, n.attrs);
			({dom: u, contentDOM: d} = e);
		}
		!d && !n.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), n.type.spec.draggable && (u.draggable = !0));
		let f = u;
		return u = xa(u, r, n), l ? c = new ma(t, n, r, i, u, d || null, f, l, a, o + 1) : n.isText ? new fa(t, n, r, i, u, f, a) : new e(t, n, r, i, u, d || null, f, a, o + 1);
	}
	parseRule() {
		if (this.node.type.spec.reparseInView) return null;
		let e = {
			node: this.node.type.name,
			attrs: this.node.attrs
		};
		if (this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"), !this.contentDOM) e.getContent = () => this.node.content;
		else if (!this.contentLost) e.contentElement = this.contentDOM;
		else {
			for (let t = this.children.length - 1; t >= 0; t--) {
				let n = this.children[t];
				if (this.dom.contains(n.dom.parentNode)) {
					e.contentElement = n.dom.parentNode;
					break;
				}
			}
			e.contentElement || (e.getContent = () => C.empty);
		}
		return e;
	}
	matchesNode(e, t, n) {
		return this.dirty == ra && e.eq(this.node) && Sa(t, this.outerDeco) && n.eq(this.innerDeco);
	}
	get size() {
		return this.node.nodeSize;
	}
	get border() {
		return +!this.node.isLeaf;
	}
	updateChildren(e, t) {
		let n = this.node.inlineContent, r = t, i = e.composing ? this.localCompositionInfo(e, t) : null, a = i && i.pos > -1 ? i : null, o = i && i.pos < 0, s = new wa(this, a && a.node, e);
		Da(this.node, this.innerDeco, (t, i, a) => {
			t.spec.marks ? s.syncToMarks(t.spec.marks, n, e, i) : t.type.side >= 0 && !a && s.syncToMarks(i == this.node.childCount ? w.none : this.node.child(i).marks, n, e, i), s.placeWidget(t, e, r);
		}, (t, a, c, l) => {
			s.syncToMarks(t.marks, n, e, l);
			let u;
			s.findNodeMatch(t, a, c, l) || o && e.state.selection.from > r && e.state.selection.to < r + t.nodeSize && (u = s.findIndexWithChild(i.node)) > -1 && s.updateNodeAt(t, a, c, u, e) || s.updateNextNode(t, a, c, e, l, r) || s.addNode(t, a, c, e, r), r += t.nodeSize;
		}), s.syncToMarks([], n, e, 0), this.node.isTextblock && s.addTextblockHacks(), s.destroyRest(), (s.changed || this.dirty == aa) && (a && this.protectLocalComposition(e, a), ha(this.contentDOM, this.children, e), xi && Oa(this.dom));
	}
	localCompositionInfo(e, t) {
		let { from: n, to: r } = e.state.selection;
		if (!(e.state.selection instanceof A) || n < t || r > t + this.node.content.size) return null;
		let i = e.input.compositionNode;
		if (!i || !this.dom.contains(i.parentNode)) return null;
		if (this.node.inlineContent) {
			let e = i.nodeValue, a = ka(this.node.content, e, n - t, r - t);
			return a < 0 ? null : {
				node: i,
				pos: a,
				text: e
			};
		} else return {
			node: i,
			pos: -1,
			text: ""
		};
	}
	protectLocalComposition(e, { node: t, pos: n, text: r }) {
		if (this.getDesc(t)) return;
		let i = t;
		for (; i.parentNode != this.contentDOM; i = i.parentNode) {
			for (; i.previousSibling;) i.parentNode.removeChild(i.previousSibling);
			for (; i.nextSibling;) i.parentNode.removeChild(i.nextSibling);
			i.pmViewDesc &&= void 0;
		}
		let a = new ca(this, i, t, r);
		e.input.compositionNodes.push(a), this.children = Aa(this.children, n, n + r.length, e, a);
	}
	update(e, t, n, r) {
		return this.dirty == F || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, n, r), !0);
	}
	updateInner(e, t, n, r) {
		this.updateOuterDeco(t), this.node = e, this.innerDeco = n, this.contentDOM && this.updateChildren(r, this.posAtStart), this.dirty = ra;
	}
	updateOuterDeco(e) {
		if (Sa(e, this.outerDeco)) return;
		let t = this.nodeDOM.nodeType != 1, n = this.dom;
		this.dom = ya(this.dom, this.nodeDOM, va(this.outerDeco, this.node, t), va(e, this.node, t)), this.dom != n && (n.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
	}
	selectNode() {
		this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
	}
	deselectNode() {
		this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
	}
	get domAtom() {
		return this.node.isAtom;
	}
};
function da(e, t, n, r, i) {
	xa(r, t, e);
	let a = new ua(void 0, e, t, n, r, r, r, i, 0);
	return a.contentDOM && a.updateChildren(i, 0), a;
}
var fa = class e extends ua {
	constructor(e, t, n, r, i, a, o) {
		super(e, t, n, r, i, null, a, o, 0);
	}
	parseRule() {
		let e = this.nodeDOM.parentNode;
		for (; e && e != this.dom && !e.pmIsDeco;) e = e.parentNode;
		return { skip: e || !0 };
	}
	update(e, t, n, r) {
		return this.dirty == F || this.dirty != ra && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != ra || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, r.trackWrites == this.nodeDOM && (r.trackWrites = null)), this.node = e, this.dirty = ra, !0);
	}
	inParent() {
		let e = this.parent.contentDOM;
		for (let t = this.nodeDOM; t; t = t.parentNode) if (t == e) return !0;
		return !1;
	}
	domFromPos(e) {
		return {
			node: this.nodeDOM,
			offset: e
		};
	}
	localPosFromDOM(e, t, n) {
		return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, n);
	}
	ignoreMutation(e) {
		return e.type != "characterData" && e.type != "selection";
	}
	slice(t, n, r) {
		let i = this.node.cut(t, n), a = document.createTextNode(i.text);
		return new e(this.parent, i, this.outerDeco, this.innerDeco, a, a, r);
	}
	markDirty(e, t) {
		super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = F);
	}
	get domAtom() {
		return !1;
	}
	isText(e) {
		return this.node.text == e;
	}
}, pa = class extends oa {
	parseRule() {
		return { ignore: !0 };
	}
	matchesHack(e) {
		return this.dirty == ra && this.dom.nodeName == e;
	}
	get domAtom() {
		return !0;
	}
	get ignoreForCoords() {
		return this.dom.nodeName == "IMG";
	}
}, ma = class extends ua {
	constructor(e, t, n, r, i, a, o, s, c, l) {
		super(e, t, n, r, i, a, o, c, l), this.spec = s;
	}
	update(e, t, n, r) {
		if (this.dirty == F) return !1;
		if (this.spec.update && (this.node.type == e.type || this.spec.multiType)) {
			let i = this.spec.update(e, t, n);
			return i && this.updateInner(e, t, n, r), i;
		} else if (!this.contentDOM && !e.isLeaf) return !1;
		else return super.update(e, t, n, r);
	}
	selectNode() {
		this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
	}
	deselectNode() {
		this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
	}
	setSelection(e, t, n, r) {
		this.spec.setSelection ? this.spec.setSelection(e, t, n.root) : super.setSelection(e, t, n, r);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
	stopEvent(e) {
		return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
};
function ha(e, t, n) {
	let r = e.firstChild, i = !1;
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = o.dom;
		if (s.parentNode == e) {
			for (; s != r;) r = Ca(r), i = !0;
			r = r.nextSibling;
		} else i = !0, e.insertBefore(s, r);
		if (o instanceof la) {
			let t = r ? r.previousSibling : e.lastChild;
			ha(o.contentDOM, o.children, n), r = t ? t.nextSibling : e.firstChild;
		}
	}
	for (; r;) r = Ca(r), i = !0;
	i && n.trackWrites == e && (n.trackWrites = null);
}
var ga = function(e) {
	e && (this.nodeName = e);
};
ga.prototype = Object.create(null);
var _a = [new ga()];
function va(e, t, n) {
	if (e.length == 0) return _a;
	let r = n ? _a[0] : new ga(), i = [r];
	for (let a = 0; a < e.length; a++) {
		let o = e[a].type.attrs;
		if (o) {
			o.nodeName && i.push(r = new ga(o.nodeName));
			for (let e in o) {
				let a = o[e];
				a != null && (n && i.length == 1 && i.push(r = new ga(t.isInline ? "span" : "div")), e == "class" ? r.class = (r.class ? r.class + " " : "") + a : e == "style" ? r.style = (r.style ? r.style + ";" : "") + a : e != "nodeName" && (r[e] = a));
			}
		}
	}
	return i;
}
function ya(e, t, n, r) {
	if (n == _a && r == _a) return t;
	let i = t;
	for (let t = 0; t < r.length; t++) {
		let a = r[t], o = n[t];
		if (t) {
			let t;
			o && o.nodeName == a.nodeName && i != e && (t = i.parentNode) && t.nodeName.toLowerCase() == a.nodeName ? i = t : (t = document.createElement(a.nodeName), t.pmIsDeco = !0, t.appendChild(i), o = _a[0], i = t);
		}
		ba(i, o || _a[0], a);
	}
	return i;
}
function ba(e, t, n) {
	for (let r in t) r != "class" && r != "style" && r != "nodeName" && !(r in n) && e.removeAttribute(r);
	for (let r in n) r != "class" && r != "style" && r != "nodeName" && n[r] != t[r] && e.setAttribute(r, n[r]);
	if (t.class != n.class) {
		let r = t.class ? t.class.split(" ").filter(Boolean) : [], i = n.class ? n.class.split(" ").filter(Boolean) : [];
		for (let t = 0; t < r.length; t++) i.indexOf(r[t]) == -1 && e.classList.remove(r[t]);
		for (let t = 0; t < i.length; t++) r.indexOf(i[t]) == -1 && e.classList.add(i[t]);
		e.classList.length == 0 && e.removeAttribute("class");
	}
	if (t.style != n.style) {
		if (t.style) {
			let n = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, r;
			for (; r = n.exec(t.style);) e.style.removeProperty(r[1]);
		}
		n.style && (e.style.cssText += n.style);
	}
}
function xa(e, t, n) {
	return ya(e, e, _a, va(t, n, e.nodeType != 1));
}
function Sa(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!e[n].type.eq(t[n].type)) return !1;
	return !0;
}
function Ca(e) {
	let t = e.nextSibling;
	return e.parentNode.removeChild(e), t;
}
var wa = class {
	constructor(e, t, n) {
		this.lock = t, this.view = n, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Ta(e.node.content, e);
	}
	destroyBetween(e, t) {
		if (e != t) {
			for (let n = e; n < t; n++) this.top.children[n].destroy();
			this.top.children.splice(e, t - e), this.changed = !0;
		}
	}
	destroyRest() {
		this.destroyBetween(this.index, this.top.children.length);
	}
	syncToMarks(e, t, n, r) {
		let i = 0, a = this.stack.length >> 1, o = Math.min(a, e.length);
		for (; i < o && (i == a - 1 ? this.top : this.stack[i + 1 << 1]).matchesMark(e[i]) && e[i].type.spec.spanning !== !1;) i++;
		for (; i < a;) this.destroyRest(), this.top.dirty = ra, this.index = this.stack.pop(), this.top = this.stack.pop(), a--;
		for (; a < e.length;) {
			this.stack.push(this.top, this.index + 1);
			let i = -1, o = this.top.children.length;
			r < this.preMatch.index && (o = Math.min(this.index + 3, o));
			for (let t = this.index; t < o; t++) {
				let n = this.top.children[t];
				if (n.matchesMark(e[a]) && !this.isLocked(n.dom)) {
					i = t;
					break;
				}
			}
			if (i > -1) i > this.index && (this.changed = !0, this.destroyBetween(this.index, i)), this.top = this.top.children[this.index];
			else {
				let r = la.create(this.top, e[a], t, n);
				this.top.children.splice(this.index, 0, r), this.top = r, this.changed = !0;
			}
			this.index = 0, a++;
		}
	}
	findNodeMatch(e, t, n, r) {
		let i = -1, a;
		if (r >= this.preMatch.index && (a = this.preMatch.matches[r - this.preMatch.index]).parent == this.top && a.matchesNode(e, t, n)) i = this.top.children.indexOf(a, this.index);
		else for (let r = this.index, a = Math.min(this.top.children.length, r + 5); r < a; r++) {
			let a = this.top.children[r];
			if (a.matchesNode(e, t, n) && !this.preMatch.matched.has(a)) {
				i = r;
				break;
			}
		}
		return i < 0 ? !1 : (this.destroyBetween(this.index, i), this.index++, !0);
	}
	updateNodeAt(e, t, n, r, i) {
		let a = this.top.children[r];
		return a.dirty == F && a.dom == a.contentDOM && (a.dirty = aa), a.update(e, t, n, i) ? (this.destroyBetween(this.index, r), this.index++, !0) : !1;
	}
	findIndexWithChild(e) {
		for (;;) {
			let t = e.parentNode;
			if (!t) return -1;
			if (t == this.top.contentDOM) {
				let t = e.pmViewDesc;
				if (t) {
					for (let e = this.index; e < this.top.children.length; e++) if (this.top.children[e] == t) return e;
				}
				return -1;
			}
			e = t;
		}
	}
	updateNextNode(e, t, n, r, i, a) {
		for (let o = this.index; o < this.top.children.length; o++) {
			let s = this.top.children[o];
			if (s instanceof ua) {
				let c = this.preMatch.matched.get(s);
				if (c != null && c != i) return !1;
				let l = s.dom, u, d = this.isLocked(l) && !(e.isText && s.node && s.node.isText && s.nodeDOM.nodeValue == e.text && s.dirty != F && Sa(t, s.outerDeco));
				if (!d && s.update(e, t, n, r)) return this.destroyBetween(this.index, o), s.dom != l && (this.changed = !0), this.index++, !0;
				if (!d && (u = this.recreateWrapper(s, e, t, n, r, a))) return this.destroyBetween(this.index, o), this.top.children[this.index] = u, u.contentDOM && (u.dirty = aa, u.updateChildren(r, a + 1), u.dirty = ra), this.changed = !0, this.index++, !0;
				break;
			}
		}
		return !1;
	}
	recreateWrapper(e, t, n, r, i, a) {
		if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !Sa(n, e.outerDeco) || !r.eq(e.innerDeco)) return null;
		let o = ua.create(this.top, t, n, r, i, a);
		if (o.contentDOM) {
			o.children = e.children, e.children = [];
			for (let e of o.children) e.parent = o;
		}
		return e.destroy(), o;
	}
	addNode(e, t, n, r, i) {
		let a = ua.create(this.top, e, t, n, r, i);
		a.contentDOM && a.updateChildren(r, i + 1), this.top.children.splice(this.index++, 0, a), this.changed = !0;
	}
	placeWidget(e, t, n) {
		let r = this.index < this.top.children.length ? this.top.children[this.index] : null;
		if (r && r.matchesWidget(e) && (e == r.widget || !r.widget.type.toDOM.parentNode)) this.index++;
		else {
			let r = new sa(this.top, e, t, n);
			this.top.children.splice(this.index++, 0, r), this.changed = !0;
		}
	}
	addTextblockHacks() {
		let e = this.top.children[this.index - 1], t = this.top;
		for (; e instanceof la;) t = e, e = t.children[t.children.length - 1];
		(!e || !(e instanceof fa) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((bi || vi) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
	}
	addHackNode(e, t) {
		if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e)) this.index++;
		else {
			let n = document.createElement(e);
			e == "IMG" && (n.className = "ProseMirror-separator", n.alt = ""), e == "BR" && (n.className = "ProseMirror-trailingBreak");
			let r = new pa(this.top, [], n, null);
			t == this.top ? t.children.splice(this.index++, 0, r) : t.children.push(r), this.changed = !0;
		}
	}
	isLocked(e) {
		return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
	}
};
function Ta(e, t) {
	let n = t, r = n.children.length, i = e.childCount, a = /* @__PURE__ */ new Map(), o = [];
	outer: for (; i > 0;) {
		let s;
		for (;;) if (r) {
			let e = n.children[r - 1];
			if (e instanceof la) n = e, r = e.children.length;
			else {
				s = e, r--;
				break;
			}
		} else if (n == t) break outer;
		else r = n.parent.children.indexOf(n), n = n.parent;
		let c = s.node;
		if (c) {
			if (c != e.child(i - 1)) break;
			--i, a.set(s, i), o.push(s);
		}
	}
	return {
		index: i,
		matched: a,
		matches: o.reverse()
	};
}
function Ea(e, t) {
	return e.type.side - t.type.side;
}
function Da(e, t, n, r) {
	let i = t.locals(e), a = 0;
	if (i.length == 0) {
		for (let n = 0; n < e.childCount; n++) {
			let o = e.child(n);
			r(o, i, t.forChild(a, o), n), a += o.nodeSize;
		}
		return;
	}
	let o = 0, s = [], c = null;
	for (let l = 0;;) {
		let u, d;
		for (; o < i.length && i[o].to == a;) {
			let e = i[o++];
			e.widget && (u ? (d ||= [u]).push(e) : u = e);
		}
		if (u) if (d) {
			d.sort(Ea);
			for (let e = 0; e < d.length; e++) n(d[e], l, !!c);
		} else n(u, l, !!c);
		let f, p;
		if (c) p = -1, f = c, c = null;
		else if (l < e.childCount) p = l, f = e.child(l++);
		else break;
		for (let e = 0; e < s.length; e++) s[e].to <= a && s.splice(e--, 1);
		for (; o < i.length && i[o].from <= a && i[o].to > a;) s.push(i[o++]);
		let m = a + f.nodeSize;
		if (f.isText) {
			let e = m;
			o < i.length && i[o].from < e && (e = i[o].from);
			for (let t = 0; t < s.length; t++) s[t].to < e && (e = s[t].to);
			e < m && (c = f.cut(e - a), f = f.cut(0, e - a), m = e, p = -1);
		} else for (; o < i.length && i[o].to < m;) o++;
		let h = f.isInline && !f.isLeaf ? s.filter((e) => !e.inline) : s.slice();
		r(f, h, t.forChild(a, f), p), a = m;
	}
}
function Oa(e) {
	if (e.nodeName == "UL" || e.nodeName == "OL") {
		let t = e.style.cssText;
		e.style.cssText = t + "; list-style: square !important", window.getComputedStyle(e).listStyle, e.style.cssText = t;
	}
}
function ka(e, t, n, r) {
	for (let i = 0, a = 0; i < e.childCount && a <= r;) {
		let o = e.child(i++), s = a;
		if (a += o.nodeSize, !o.isText) continue;
		let c = o.text;
		for (; i < e.childCount;) {
			let t = e.child(i++);
			if (a += t.nodeSize, !t.isText) break;
			c += t.text;
		}
		if (a >= n) {
			if (a >= r && c.slice(r - t.length - s, r - s) == t) return r - t.length;
			let e = s < r ? c.lastIndexOf(t, r - s - 1) : -1;
			if (e >= 0 && e + t.length + s >= n) return s + e;
			if (n == r && c.length >= r + t.length - s && c.slice(r - s, r - s + t.length) == t) return r;
		}
	}
	return -1;
}
function Aa(e, t, n, r, i) {
	let a = [];
	for (let o = 0, s = 0; o < e.length; o++) {
		let c = e[o], l = s, u = s += c.size;
		l >= n || u <= t ? a.push(c) : (l < t && a.push(c.slice(0, t - l, r)), i &&= (a.push(i), void 0), u > n && a.push(c.slice(n - l, c.size, r)));
	}
	return a;
}
function ja(e, t = null) {
	let n = e.domSelectionRange(), r = e.state.doc;
	if (!n.focusNode) return null;
	let i = e.docView.nearestDesc(n.focusNode), a = i && i.size == 0, o = e.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
	if (o < 0) return null;
	let s = r.resolve(o), c, l;
	if (ai(n)) {
		for (c = o; i && !i.node;) i = i.parent;
		let e = i.node;
		if (i && e.isAtom && j.isSelectable(e) && i.parent && !(e.isInline && ri(n.focusNode, n.focusOffset, i.dom))) {
			let e = i.posBefore;
			l = new j(o == e ? s : r.resolve(e));
		}
	} else {
		if (n instanceof e.dom.ownerDocument.defaultView.Selection && n.rangeCount > 1) {
			let t = o, i = o;
			for (let r = 0; r < n.rangeCount; r++) {
				let a = n.getRangeAt(r);
				t = Math.min(t, e.docView.posFromDOM(a.startContainer, a.startOffset, 1)), i = Math.max(i, e.docView.posFromDOM(a.endContainer, a.endOffset, -1));
			}
			if (t < 0) return null;
			[c, o] = i == e.state.selection.anchor ? [i, t] : [t, i], s = r.resolve(o);
		} else c = e.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
		if (c < 0) return null;
	}
	let u = r.resolve(c);
	if (!l) {
		let n = t == "pointer" || e.state.selection.head < s.pos && !a ? 1 : -1;
		l = Ha(e, u, s, n);
	}
	return l;
}
function Ma(e) {
	return e.editable ? e.hasFocus() : Wa(e) && document.activeElement && document.activeElement.contains(e.dom);
}
function Na(e, t = !1) {
	let n = e.state.selection;
	if (Ba(e, n), !Ma(e)) return;
	let r = e.input.mouseDown;
	if (!t && vi && r) {
		let t = e.domSelectionRange(), n = e.domObserver.currentSelection;
		if (t.anchorNode && n.anchorNode && Zr(t.anchorNode, t.anchorOffset, n.anchorNode, n.anchorOffset) && r.delaySelUpdate()) {
			e.domObserver.setCurSelection();
			return;
		}
	}
	if (e.domObserver.disconnectSelection(), e.cursorWrapper) za(e);
	else {
		let { anchor: r, head: i } = n, a, o;
		Pa && !(n instanceof A) && (n.$from.parent.inlineContent || (a = Fa(e, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = Fa(e, n.to))), e.docView.setSelection(r, i, e, t), Pa && (a && La(a), o && La(o)), n.visible ? e.dom.classList.remove("ProseMirror-hideselection") : (e.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Ra(e));
	}
	e.domObserver.setCurSelection(), e.domObserver.connectSelection();
}
var Pa = bi || vi && yi < 63;
function Fa(e, t) {
	let { node: n, offset: r } = e.docView.domFromPos(t, 0), i = r < n.childNodes.length ? n.childNodes[r] : null, a = r ? n.childNodes[r - 1] : null;
	if (bi && i && i.contentEditable == "false") return Ia(i);
	if ((!i || i.contentEditable == "false") && (!a || a.contentEditable == "false")) {
		if (i) return Ia(i);
		if (a) return Ia(a);
	}
}
function Ia(e) {
	return e.contentEditable = "true", bi && e.draggable && (e.draggable = !1, e.wasDraggable = !0), e;
}
function La(e) {
	e.contentEditable = "false", e.wasDraggable &&= (e.draggable = !0, null);
}
function Ra(e) {
	let t = e.dom.ownerDocument;
	t.removeEventListener("selectionchange", e.input.hideSelectionGuard);
	let n = e.domSelectionRange(), r = n.anchorNode, i = n.anchorOffset;
	t.addEventListener("selectionchange", e.input.hideSelectionGuard = () => {
		(n.anchorNode != r || n.anchorOffset != i) && (t.removeEventListener("selectionchange", e.input.hideSelectionGuard), setTimeout(() => {
			(!Ma(e) || e.state.selection.visible) && e.dom.classList.remove("ProseMirror-hideselection");
		}, 20));
	});
}
function za(e) {
	let t = e.domSelection();
	if (!t) return;
	let n = e.cursorWrapper.dom, r = n.nodeName == "IMG";
	r ? t.collapse(n.parentNode, Kr(n) + 1) : t.collapse(n, 0), !r && !e.state.selection.visible && M && hi <= 11 && (n.disabled = !0, n.disabled = !1);
}
function Ba(e, t) {
	if (t instanceof j) {
		let n = e.docView.descAt(t.from);
		n != e.lastSelectedViewDesc && (Va(e), n && n.selectNode(), e.lastSelectedViewDesc = n);
	} else Va(e);
}
function Va(e) {
	e.lastSelectedViewDesc &&= (e.lastSelectedViewDesc.parent && e.lastSelectedViewDesc.deselectNode(), void 0);
}
function Ha(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || A.between(t, n, r);
}
function Ua(e) {
	return e.editable && !e.hasFocus() ? !1 : Wa(e);
}
function Wa(e) {
	let t = e.domSelectionRange();
	if (!t.anchorNode) return !1;
	try {
		return e.dom.contains(t.anchorNode.nodeType == 3 ? t.anchorNode.parentNode : t.anchorNode) && (e.editable || e.dom.contains(t.focusNode.nodeType == 3 ? t.focusNode.parentNode : t.focusNode));
	} catch {
		return !1;
	}
}
function Ga(e) {
	let t = e.docView.domFromPos(e.state.selection.anchor, 0), n = e.domSelectionRange();
	return Zr(t.node, t.offset, n.anchorNode, n.anchorOffset);
}
function Ka(e, t) {
	let { $anchor: n, $head: r } = e.selection, i = t > 0 ? n.max(r) : n.min(r), a = i.parent.inlineContent ? i.depth ? e.doc.resolve(t > 0 ? i.after() : i.before()) : null : i;
	return a && k.findFrom(a, t);
}
function qa(e, t) {
	return e.dispatch(e.state.tr.setSelection(t).scrollIntoView()), !0;
}
function Ja(e, t, n) {
	let r = e.state.selection;
	if (r instanceof A) {
		if (n.indexOf("s") > -1) {
			let { $head: n } = r, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter;
			if (!i || i.isText || !i.isLeaf) return !1;
			let a = e.state.doc.resolve(n.pos + i.nodeSize * (t < 0 ? -1 : 1));
			return qa(e, new A(r.$anchor, a));
		} else if (!r.empty) return !1;
		else if (e.endOfTextblock(t > 0 ? "forward" : "backward")) {
			let n = Ka(e.state, t);
			return n && n instanceof j ? qa(e, n) : !1;
		} else if (!(Si && n.indexOf("m") > -1)) {
			let n = r.$head, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter, a;
			if (!i || i.isText) return !1;
			let o = t < 0 ? n.pos - i.nodeSize : n.pos;
			return i.isAtom || (a = e.docView.descAt(o)) && !a.contentDOM ? j.isSelectable(i) ? qa(e, new j(t < 0 ? e.state.doc.resolve(n.pos - i.nodeSize) : n)) : Ti ? qa(e, new A(e.state.doc.resolve(t < 0 ? o : o + i.nodeSize))) : !1 : !1;
		}
	} else if (r instanceof j && r.node.isInline) return qa(e, new A(t > 0 ? r.$to : r.$from));
	else {
		let n = Ka(e.state, t);
		return n ? qa(e, n) : !1;
	}
}
function Ya(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function Xa(e, t) {
	let n = e.pmViewDesc;
	return n && n.size == 0 && (t < 0 || e.nextSibling || e.nodeName != "BR");
}
function Za(e, t) {
	return t < 0 ? Qa(e) : $a(e);
}
function Qa(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i, a, o = !1;
	for (gi && n.nodeType == 1 && r < Ya(n) && Xa(n.childNodes[r], -1) && (o = !0);;) if (r > 0) {
		if (n.nodeType != 1) break;
		{
			let e = n.childNodes[r - 1];
			if (Xa(e, -1)) i = n, a = --r;
			else if (e.nodeType == 3) n = e, r = n.nodeValue.length;
			else break;
		}
	} else if (eo(n)) break;
	else {
		let t = n.previousSibling;
		for (; t && Xa(t, -1);) i = n.parentNode, a = Kr(t), t = t.previousSibling;
		if (t) n = t, r = Ya(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = 0;
		}
	}
	o ? ro(e, n, r) : i && ro(e, i, a);
}
function $a(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i = Ya(n), a, o;
	for (;;) if (r < i) {
		if (n.nodeType != 1) break;
		let e = n.childNodes[r];
		if (Xa(e, 1)) a = n, o = ++r;
		else break;
	} else if (eo(n)) break;
	else {
		let t = n.nextSibling;
		for (; t && Xa(t, 1);) a = t.parentNode, o = Kr(t) + 1, t = t.nextSibling;
		if (t) n = t, r = 0, i = Ya(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = i = 0;
		}
	}
	a && ro(e, a, o);
}
function eo(e) {
	let t = e.pmViewDesc;
	return t && t.node && t.node.isBlock;
}
function to(e, t) {
	for (; e && t == e.childNodes.length && !ii(e);) t = Kr(e) + 1, e = e.parentNode;
	for (; e && t < e.childNodes.length;) {
		let n = e.childNodes[t];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = 0;
	}
}
function no(e, t) {
	for (; e && !t && !ii(e);) t = Kr(e), e = e.parentNode;
	for (; e && t;) {
		let n = e.childNodes[t - 1];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = e.childNodes.length;
	}
}
function ro(e, t, n) {
	if (t.nodeType != 3) {
		let e, r;
		(r = to(t, n)) ? (t = r, n = 0) : (e = no(t, n)) && (t = e, n = e.nodeValue.length);
	}
	let r = e.domSelection();
	if (!r) return;
	if (ai(r)) {
		let e = document.createRange();
		e.setEnd(t, n), e.setStart(t, n), r.removeAllRanges(), r.addRange(e);
	} else r.extend && r.extend(t, n);
	e.domObserver.setCurSelection();
	let { state: i } = e;
	setTimeout(() => {
		e.state == i && Na(e);
	}, 50);
}
function io(e, t) {
	let n = e.state.doc.resolve(t);
	if (!(vi || Ci) && n.parent.inlineContent) {
		let r = e.coordsAtPos(t);
		if (t > n.start()) {
			let n = e.coordsAtPos(t - 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left < r.left ? "ltr" : "rtl";
		}
		if (t < n.end()) {
			let n = e.coordsAtPos(t + 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left > r.left ? "ltr" : "rtl";
		}
	}
	return getComputedStyle(e.dom).direction == "rtl" ? "rtl" : "ltr";
}
function ao(e, t, n) {
	let r = e.state.selection;
	if (r instanceof A && !r.empty || n.indexOf("s") > -1 || Si && n.indexOf("m") > -1) return !1;
	let { $from: i, $to: a } = r;
	if (!i.parent.inlineContent || e.endOfTextblock(t < 0 ? "up" : "down")) {
		let n = Ka(e.state, t);
		if (n && n instanceof j) return qa(e, n);
	}
	if (!i.parent.inlineContent) {
		let n = t < 0 ? i : a, o = r instanceof Rn ? k.near(n, t) : k.findFrom(n, t);
		return o ? qa(e, o) : !1;
	}
	return !1;
}
function oo(e, t) {
	if (!(e.state.selection instanceof A)) return !0;
	let { $head: n, $anchor: r, empty: i } = e.state.selection;
	if (!n.sameParent(r)) return !0;
	if (!i) return !1;
	if (e.endOfTextblock(t > 0 ? "forward" : "backward")) return !0;
	let a = !n.textOffset && (t < 0 ? n.nodeBefore : n.nodeAfter);
	if (a && !a.isText) {
		let r = e.state.tr;
		return t < 0 ? r.delete(n.pos - a.nodeSize, n.pos) : r.delete(n.pos, n.pos + a.nodeSize), e.dispatch(r), !0;
	}
	return !1;
}
function so(e, t, n) {
	e.domObserver.stop(), t.contentEditable = n, e.domObserver.start();
}
function co(e) {
	if (!bi || e.state.selection.$head.parentOffset > 0) return !1;
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (t && t.nodeType == 1 && n == 0 && t.firstChild && t.firstChild.contentEditable == "false") {
		let n = t.firstChild;
		so(e, n, "true"), setTimeout(() => so(e, n, "false"), 20);
	}
	return !1;
}
function lo(e) {
	let t = "";
	return e.ctrlKey && (t += "c"), e.metaKey && (t += "m"), e.altKey && (t += "a"), e.shiftKey && (t += "s"), t;
}
function uo(e, t) {
	let n = t.keyCode, r = lo(t);
	if (n == 8 || Si && n == 72 && r == "c") return oo(e, -1) || Za(e, -1);
	if (n == 46 && !t.shiftKey || Si && n == 68 && r == "c") return oo(e, 1) || Za(e, 1);
	if (n == 13 || n == 27) return !0;
	if (n == 37 || Si && n == 66 && r == "c") {
		let t = n == 37 ? io(e, e.state.selection.from) == "ltr" ? -1 : 1 : -1;
		return Ja(e, t, r) || Za(e, t);
	} else if (n == 39 || Si && n == 70 && r == "c") {
		let t = n == 39 ? io(e, e.state.selection.from) == "ltr" ? 1 : -1 : 1;
		return Ja(e, t, r) || Za(e, t);
	} else if (n == 38 || Si && n == 80 && r == "c") return ao(e, -1, r) || Za(e, -1);
	else if (n == 40 || Si && n == 78 && r == "c") return co(e) || ao(e, 1, r) || Za(e, 1);
	else if (r == (Si ? "m" : "c") && (n == 66 || n == 73 || n == 89 || n == 90)) return !0;
	return !1;
}
function fo(e, t) {
	e.someProp("transformCopied", (n) => {
		t = n(t, e);
	});
	let n = [], { content: r, openStart: i, openEnd: a } = t;
	for (; i > 1 && a > 1 && r.childCount == 1 && r.firstChild.childCount == 1;) {
		i--, a--;
		let e = r.firstChild;
		n.push(e.type.name, e.attrs == e.type.defaultAttrs ? null : e.attrs), r = e.content;
	}
	let o = e.someProp("clipboardSerializer") || dt.fromSchema(e.state.schema), s = xo(), c = s.createElement("div");
	c.appendChild(o.serializeFragment(r, { document: s }));
	let l = c.firstChild, u, d = 0;
	for (; l && l.nodeType == 1 && (u = yo[l.nodeName.toLowerCase()]);) {
		for (let e = u.length - 1; e >= 0; e--) {
			let t = s.createElement(u[e]);
			for (; c.firstChild;) t.appendChild(c.firstChild);
			c.appendChild(t), d++;
		}
		l = c.firstChild;
	}
	return l && l.nodeType == 1 && l.setAttribute("data-pm-slice", `${i} ${a}${d ? ` -${d}` : ""} ${JSON.stringify(n)}`), {
		dom: c,
		text: e.someProp("clipboardTextSerializer", (n) => n(t, e)) || t.content.textBetween(0, t.content.size, "\n\n"),
		slice: t
	};
}
function po(e, t, n, r, i) {
	let a = i.parent.type.spec.code, o, s;
	if (!n && !t) return null;
	let c = !!t && (r || a || !n);
	if (c) {
		if (e.someProp("transformPastedText", (n) => {
			t = n(t, a || r, e);
		}), a) return s = new T(C.from(e.state.schema.text(t.replace(/\r\n?/g, "\n"))), 0, 0), e.someProp("transformPasted", (t) => {
			s = t(s, e, !0);
		}), s;
		let n = e.someProp("clipboardTextParser", (n) => n(t, i, r, e));
		if (n) s = n;
		else {
			let n = i.marks(), { schema: r } = e.state, a = dt.fromSchema(r);
			o = document.createElement("div"), t.split(/(?:\r\n?|\n)+/).forEach((e) => {
				let t = o.appendChild(document.createElement("p"));
				e && t.appendChild(a.serializeNode(r.text(e, n)));
			});
		}
	} else e.someProp("transformPastedHTML", (t) => {
		n = t(n, e);
	}), o = wo(n), Ti && To(o);
	let l = o && o.querySelector("[data-pm-slice]"), u = l && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(l.getAttribute("data-pm-slice") || "");
	if (u && u[3]) for (let e = +u[3]; e > 0; e--) {
		let e = o.firstChild;
		for (; e && e.nodeType != 1;) e = e.nextSibling;
		if (!e) break;
		o = e;
	}
	if (s ||= (e.someProp("clipboardParser") || e.someProp("domParser") || Ze.fromSchema(e.state.schema)).parseSlice(o, {
		preserveWhitespace: !!(c || u),
		context: i,
		ruleFromNode(e) {
			return e.nodeName == "BR" && !e.nextSibling && e.parentNode && !mo.test(e.parentNode.nodeName) ? { ignore: !0 } : null;
		}
	}), u) s = Eo(vo(s, +u[1], +u[2]), u[4]);
	else if (s = T.maxOpen(ho(s.content, i), !0), s.openStart || s.openEnd) {
		let e = 0, t = 0;
		for (let t = s.content.firstChild; e < s.openStart && !t.type.spec.isolating; e++, t = t.firstChild);
		for (let e = s.content.lastChild; t < s.openEnd && !e.type.spec.isolating; t++, e = e.lastChild);
		s = vo(s, e, t);
	}
	return e.someProp("transformPasted", (t) => {
		s = t(s, e, c);
	}), s;
}
var mo = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function ho(e, t) {
	if (e.childCount < 2) return e;
	for (let n = t.depth; n >= 0; n--) {
		let r = t.node(n).contentMatchAt(t.index(n)), i, a = [];
		if (e.forEach((e) => {
			if (!a) return;
			let t = r.findWrapping(e.type), n;
			if (!t) return a = null;
			if (n = a.length && i.length && _o(t, i, e, a[a.length - 1], 0)) a[a.length - 1] = n;
			else {
				a.length && (a[a.length - 1] = I(a[a.length - 1], i.length));
				let n = go(e, t);
				a.push(n), r = r.matchType(n.type), i = t;
			}
		}), a) return C.from(a);
	}
	return e;
}
function go(e, t, n = 0) {
	for (let r = t.length - 1; r >= n; r--) e = t[r].create(null, C.from(e));
	return e;
}
function _o(e, t, n, r, i) {
	if (i < e.length && i < t.length && e[i] == t[i]) {
		let a = _o(e, t, n, r.lastChild, i + 1);
		if (a) return r.copy(r.content.replaceChild(r.childCount - 1, a));
		if (r.contentMatchAt(r.childCount).matchType(i == e.length - 1 ? n.type : e[i + 1])) return r.copy(r.content.append(C.from(go(n, e, i + 1))));
	}
}
function I(e, t) {
	if (t == 0) return e;
	let n = e.content.replaceChild(e.childCount - 1, I(e.lastChild, t - 1)), r = e.contentMatchAt(e.childCount).fillBefore(C.empty, !0);
	return e.copy(n.append(r));
}
function L(e, t, n, r, i, a) {
	let o = t < 0 ? e.firstChild : e.lastChild, s = o.content;
	return e.childCount > 1 && (a = 0), i < r - 1 && (s = L(s, t, n, r, i + 1, a)), i >= n && (s = t < 0 ? o.contentMatchAt(0).fillBefore(s, a <= i).append(s) : s.append(o.contentMatchAt(o.childCount).fillBefore(C.empty, !0))), e.replaceChild(t < 0 ? 0 : e.childCount - 1, o.copy(s));
}
function vo(e, t, n) {
	return t < e.openStart && (e = new T(L(e.content, -1, t, e.openStart, 0, e.openEnd), t, e.openEnd)), n < e.openEnd && (e = new T(L(e.content, 1, n, e.openEnd, 0, 0), e.openStart, n)), e;
}
var yo = {
	thead: ["table"],
	tbody: ["table"],
	tfoot: ["table"],
	caption: ["table"],
	colgroup: ["table"],
	col: ["table", "colgroup"],
	tr: ["table", "tbody"],
	td: [
		"table",
		"tbody",
		"tr"
	],
	th: [
		"table",
		"tbody",
		"tr"
	]
}, bo = null;
function xo() {
	return bo ||= document.implementation.createHTMLDocument("title");
}
var So = null;
function Co(e) {
	let t = window.trustedTypes;
	return t ? (So ||= t.defaultPolicy || t.createPolicy("ProseMirrorClipboard", { createHTML: (e) => e }), So.createHTML(e)) : e;
}
function wo(e) {
	let t = /^(\s*<meta [^>]*>)*/.exec(e);
	t && (e = e.slice(t[0].length));
	let n = xo().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(e), i;
	if ((i = r && yo[r[1].toLowerCase()]) && (e = i.map((e) => "<" + e + ">").join("") + e + i.map((e) => "</" + e + ">").reverse().join("")), n.innerHTML = Co(e), i) for (let e = 0; e < i.length; e++) n = n.querySelector(i[e]) || n;
	return n;
}
function To(e) {
	let t = e.querySelectorAll(vi ? "span:not([class]):not([style])" : "span.Apple-converted-space");
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		r.childNodes.length == 1 && r.textContent == "\xA0" && r.parentNode && r.parentNode.replaceChild(e.ownerDocument.createTextNode(" "), r);
	}
}
function Eo(e, t) {
	if (!e.size) return e;
	let n = e.content.firstChild.type.schema, r;
	try {
		r = JSON.parse(t);
	} catch {
		return e;
	}
	let { content: i, openStart: a, openEnd: o } = e;
	for (let e = r.length - 2; e >= 0; e -= 2) {
		let t = n.nodes[r[e]];
		if (!t || t.hasRequiredAttrs()) break;
		i = C.from(t.create(r[e + 1], i)), a++, o++;
	}
	return new T(i, a, o);
}
var Do = {}, Oo = {}, ko = {
	touchstart: !0,
	touchmove: !0
}, Ao = class {
	constructor() {
		this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = {
			time: 0,
			x: 0,
			y: 0,
			type: "",
			button: 0
		}, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = Object.create(null), this.hideSelectionGuard = null;
	}
};
function jo(e) {
	for (let t in Do) {
		let n = Do[t];
		e.dom.addEventListener(t, e.input.eventHandlers[t] = (t) => {
			Io(e, t) && !Fo(e, t) && (e.editable || !(t.type in Oo)) && n(e, t);
		}, ko[t] ? { passive: !0 } : void 0);
	}
	bi && e.dom.addEventListener("input", () => null), Po(e);
}
function Mo(e, t) {
	e.input.lastSelectionOrigin = t, e.input.lastSelectionTime = Date.now();
}
function No(e) {
	e.input.mouseDown && e.input.mouseDown.done(), e.domObserver.stop();
	for (let t in e.input.eventHandlers) e.dom.removeEventListener(t, e.input.eventHandlers[t]);
	clearTimeout(e.input.composingTimeout), clearTimeout(e.input.lastIOSEnterFallbackTimeout);
}
function Po(e) {
	e.someProp("handleDOMEvents", (t) => {
		for (let n in t) e.input.eventHandlers[n] || e.dom.addEventListener(n, e.input.eventHandlers[n] = (t) => Fo(e, t));
	});
}
function Fo(e, t) {
	return e.someProp("handleDOMEvents", (n) => {
		let r = n[t.type];
		return r ? r(e, t) || t.defaultPrevented : !1;
	});
}
function Io(e, t) {
	if (!t.bubbles) return !0;
	if (t.defaultPrevented) return !1;
	for (let n = t.target; n != e.dom; n = n.parentNode) if (!n || n.nodeType == 11 || n.pmViewDesc && n.pmViewDesc.stopEvent(t)) return !1;
	return !0;
}
function Lo(e, t) {
	!Fo(e, t) && Do[t.type] && (e.editable || !(t.type in Oo)) && Do[t.type](e, t);
}
Oo.keydown = (e, t) => {
	let n = t;
	if (e.input.shiftKey = n.keyCode == 16 || n.shiftKey, !es(e) && (e.input.lastKeyCode = n.keyCode, e.input.lastKeyCodeTime = Date.now(), !(wi && vi && n.keyCode == 13))) if (n.keyCode != 229 && e.domObserver.forceFlush(), xi && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
		let t = Date.now();
		e.input.lastIOSEnter = t, e.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
			e.input.lastIOSEnter == t && (e.someProp("handleKeyDown", (t) => t(e, oi(13, "Enter"))), e.input.lastIOSEnter = 0);
		}, 200);
	} else e.someProp("handleKeyDown", (t) => t(e, n)) || uo(e, n) ? n.preventDefault() : Mo(e, "key");
}, Oo.keyup = (e, t) => {
	t.keyCode == 16 && (e.input.shiftKey = !1);
}, Oo.keypress = (e, t) => {
	let n = t;
	if (es(e) || !n.charCode || n.ctrlKey && !n.altKey || Si && n.metaKey) return;
	if (e.someProp("handleKeyPress", (t) => t(e, n))) {
		n.preventDefault();
		return;
	}
	let r = e.state.selection;
	if (!(r instanceof A) || !r.$from.sameParent(r.$to)) {
		let t = String.fromCharCode(n.charCode), i = () => e.state.tr.insertText(t).scrollIntoView();
		!/[\r\n]/.test(t) && !e.someProp("handleTextInput", (n) => n(e, r.$from.pos, r.$to.pos, t, i)) && e.dispatch(i()), n.preventDefault();
	}
};
function Ro(e) {
	return {
		left: e.clientX,
		top: e.clientY
	};
}
function zo(e, t) {
	let n = t.x - e.clientX, r = t.y - e.clientY;
	return n * n + r * r < 100;
}
function Bo(e, t, n, r, i) {
	if (r == -1) return !1;
	let a = e.state.doc.resolve(r);
	for (let r = a.depth + 1; r > 0; r--) if (e.someProp(t, (t) => r > a.depth ? t(e, n, a.nodeAfter, a.before(r), i, !0) : t(e, n, a.node(r), a.before(r), i, !1))) return !0;
	return !1;
}
function Vo(e, t, n) {
	if (e.focused || e.focus(), e.state.selection.eq(t)) return;
	let r = e.state.tr.setSelection(t);
	n == "pointer" && r.setMeta("pointer", !0), e.dispatch(r);
}
function Ho(e, t) {
	if (t == -1) return !1;
	let n = e.state.doc.resolve(t), r = n.nodeAfter;
	return r && r.isAtom && j.isSelectable(r) ? (Vo(e, new j(n), "pointer"), !0) : !1;
}
function Uo(e, t) {
	if (t == -1) return !1;
	let n = e.state.selection, r, i;
	n instanceof j && (r = n.node);
	let a = e.state.doc.resolve(t);
	for (let e = a.depth + 1; e > 0; e--) {
		let t = e > a.depth ? a.nodeAfter : a.node(e);
		if (j.isSelectable(t)) {
			i = r && n.$from.depth > 0 && e >= n.$from.depth && a.before(n.$from.depth + 1) == n.$from.pos ? a.before(n.$from.depth) : a.before(e);
			break;
		}
	}
	return i == null ? !1 : (Vo(e, j.create(e.state.doc, i), "pointer"), !0);
}
function Wo(e, t, n, r, i) {
	return Bo(e, "handleClickOn", t, n, r) || e.someProp("handleClick", (n) => n(e, t, r)) || (i ? Uo(e, n) : Ho(e, n));
}
function Go(e, t, n, r) {
	return Bo(e, "handleDoubleClickOn", t, n, r) || e.someProp("handleDoubleClick", (n) => n(e, t, r));
}
function Ko(e, t, n, r) {
	return Bo(e, "handleTripleClickOn", t, n, r) || e.someProp("handleTripleClick", (n) => n(e, t, r)) || qo(e, n, r);
}
function qo(e, t, n) {
	if (n.button != 0) return !1;
	let r = Jo(e, t, !0), i = e.state.doc;
	return r ? (Vo(e, r, "pointer"), r instanceof A && i.eq(e.state.doc) && (e.input.mouseDown = new $o(e, r)), !0) : !1;
}
function Jo(e, t, n) {
	let r = e.state.doc;
	if (t == -1) return r.inlineContent ? A.create(r, 0, r.content.size) : null;
	let i = r.resolve(t);
	for (let e = i.depth + 1; e > 0; e--) {
		let t = e > i.depth ? i.nodeAfter : i.node(e), a = i.before(e);
		if (t.inlineContent) return A.create(r, a + 1, a + 1 + t.content.size);
		if (n && j.isSelectable(t)) return j.create(r, a);
	}
	return null;
}
function Yo(e) {
	return ss(e);
}
var Xo = Si ? "metaKey" : "ctrlKey";
Do.mousedown = (e, t) => {
	let n = t;
	e.input.shiftKey = n.shiftKey;
	let r = Yo(e), i = Date.now(), a = "singleClick";
	i - e.input.lastClick.time < 500 && zo(n, e.input.lastClick) && !n[Xo] && e.input.lastClick.button == n.button && (e.input.lastClick.type == "singleClick" ? a = "doubleClick" : e.input.lastClick.type == "doubleClick" && (a = "tripleClick")), e.input.lastClick = {
		time: i,
		x: n.clientX,
		y: n.clientY,
		type: a,
		button: n.button
	}, e.input.mouseDown && e.input.mouseDown.done();
	let o = e.posAtCoords(Ro(n));
	o && (a == "singleClick" ? e.input.mouseDown = new Qo(e, o, n, !!r) : (a == "doubleClick" ? Go : Ko)(e, o.pos, o.inside, n) ? n.preventDefault() : Mo(e, "pointer"));
};
var Zo = class {
	constructor(e) {
		this.view = e, this.mightDrag = null, e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this));
	}
	up(e) {
		this.done();
	}
	move(e) {
		e.buttons == 0 && this.done();
	}
	done() {
		this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.view.input.mouseDown == this && (this.view.input.mouseDown = null);
	}
	delaySelUpdate() {
		return !1;
	}
}, Qo = class extends Zo {
	constructor(e, t, n, r) {
		super(e), this.pos = t, this.event = n, this.flushed = r, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!n[Xo], this.allowDefault = n.shiftKey;
		let i, a;
		if (t.inside > -1) i = e.state.doc.nodeAt(t.inside), a = t.inside;
		else {
			let n = e.state.doc.resolve(t.pos);
			i = n.parent, a = n.depth ? n.before() : 0;
		}
		let o = r ? null : n.target, s = o ? e.docView.nearestDesc(o, !0) : null;
		this.target = s && s.nodeDOM.nodeType == 1 ? s.nodeDOM : null;
		let { selection: c } = e.state;
		n.button == 0 && (i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof j && c.from <= a && c.to > a) && (this.mightDrag = {
			node: i,
			pos: a,
			addAttr: !!(this.target && !this.target.draggable),
			setUneditable: !!(this.target && gi && !this.target.hasAttribute("contentEditable"))
		}), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
			this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
		}, 20), this.view.domObserver.start()), Mo(e, "pointer");
	}
	done() {
		super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
			this.view.isDestroyed || Na(this.view);
		});
	}
	up(e) {
		if (this.done(), !this.view.dom.contains(e.target)) return;
		let t = this.pos;
		this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Ro(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Mo(this.view, "pointer") : Wo(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || bi && this.mightDrag && !this.mightDrag.node.isAtom || vi && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Vo(this.view, k.near(this.view.state.doc.resolve(t.pos)), "pointer"), e.preventDefault()) : Mo(this.view, "pointer");
	}
	move(e) {
		this.updateAllowDefault(e), Mo(this.view, "pointer"), super.move(e);
	}
	updateAllowDefault(e) {
		!this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
	}
	delaySelUpdate() {
		return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
	}
}, $o = class extends Zo {
	constructor(e, t) {
		super(e), this.startSelection = t, this.startDoc = e.state.doc;
	}
	move(e) {
		if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
			this.done();
			return;
		}
		e.preventDefault(), Mo(this.view, "pointer");
		let t = this.view.posAtCoords(Ro(e)), n = t && Jo(this.view, t.inside, !1);
		if (!n) return;
		let { doc: r } = this.view.state, i = this.startSelection, [a, o] = n.from < i.from ? [i.to, n.from] : [i.from, n.to];
		Vo(this.view, A.create(r, a, o), "pointer");
	}
};
Do.touchstart = (e) => {
	e.input.lastTouch = Date.now(), Yo(e), Mo(e, "pointer");
}, Do.touchmove = (e) => {
	e.input.lastTouch = Date.now(), Mo(e, "pointer");
}, Do.contextmenu = (e) => Yo(e);
function es(e, t) {
	return e.composing ? !0 : bi && Math.abs(Date.now() - e.input.compositionEndedAt) < 500 ? (e.input.compositionEndedAt = -2e8, !0) : !1;
}
var ts = wi ? 5e3 : -1;
Oo.compositionstart = Oo.compositionupdate = (e) => {
	if (!e.composing) {
		e.domObserver.flush();
		let { state: t } = e, n = t.selection.$to;
		if (t.selection instanceof A && (t.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((e) => e.type.spec.inclusive === !1) || vi && Ci && ns(e))) e.markCursor = e.state.storedMarks || n.marks(), ss(e, !0), e.markCursor = null;
		else if (ss(e, !t.selection.empty), gi && t.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
			let t = e.domSelectionRange();
			for (let n = t.focusNode, r = t.focusOffset; n && n.nodeType == 1 && r != 0;) {
				let t = r < 0 ? n.lastChild : n.childNodes[r - 1];
				if (!t) break;
				if (t.nodeType == 3) {
					let n = e.domSelection();
					n && n.collapse(t, t.nodeValue.length);
					break;
				} else n = t, r = -1;
			}
		}
		e.input.composing = !0;
	}
	rs(e, ts);
};
function ns(e) {
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (!t || t.nodeType != 1 || n >= t.childNodes.length) return !1;
	let r = t.childNodes[n];
	return r.nodeType == 1 && r.contentEditable == "false";
}
Oo.compositionend = (e, t) => {
	e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now(), e.input.compositionPendingChanges = e.domObserver.pendingRecords().length ? e.input.compositionID : 0, e.input.compositionNode = null, e.input.badSafariComposition ? e.domObserver.forceFlush() : e.input.compositionPendingChanges && Promise.resolve().then(() => e.domObserver.flush()), e.input.compositionID++, rs(e, 20));
};
function rs(e, t) {
	clearTimeout(e.input.composingTimeout), t > -1 && (e.input.composingTimeout = setTimeout(() => ss(e), t));
}
function is(e) {
	for (e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now()); e.input.compositionNodes.length > 0;) e.input.compositionNodes.pop().markParentsDirty();
}
function as(e) {
	let t = e.domSelectionRange();
	if (!t.focusNode) return null;
	let n = ti(t.focusNode, t.focusOffset), r = ni(t.focusNode, t.focusOffset);
	if (n && r && n != r) {
		let t = r.pmViewDesc, i = e.domObserver.lastChangedTextNode;
		if (n == i || r == i) return i;
		if (!t || !t.isText(r.nodeValue)) return r;
		if (e.input.compositionNode == r) {
			let e = n.pmViewDesc;
			if (!(!e || !e.isText(n.nodeValue))) return r;
		}
	}
	return n || r;
}
function ss(e, t = !1) {
	if (!(wi && e.domObserver.flushingSoon >= 0)) {
		if (e.domObserver.forceFlush(), is(e), t || e.docView && e.docView.dirty) {
			let n = ja(e), r = e.state.selection;
			return n && !n.eq(r) ? e.dispatch(e.state.tr.setSelection(n)) : (e.markCursor || t) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? e.dispatch(e.state.tr.deleteSelection()) : e.updateState(e.state), !0;
		}
		return !1;
	}
}
function cs(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.dom.parentNode.appendChild(document.createElement("div"));
	n.appendChild(t), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
	let r = getSelection(), i = document.createRange();
	i.selectNodeContents(t), e.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
		n.parentNode && n.parentNode.removeChild(n), e.focus();
	}, 50);
}
var ls = M && hi < 15 || xi && Ei < 604;
Do.copy = Oo.cut = (e, t) => {
	let n = t, r = e.state.selection, i = n.type == "cut";
	if (r.empty) return;
	let a = ls ? null : n.clipboardData, { dom: o, text: s } = fo(e, r.content());
	a ? (n.preventDefault(), a.clearData(), a.setData("text/html", o.innerHTML), a.setData("text/plain", s)) : cs(e, o), i && e.dispatch(e.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function us(e) {
	return e.openStart == 0 && e.openEnd == 0 && e.content.childCount == 1 ? e.content.firstChild : null;
}
function ds(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.input.shiftKey || e.state.selection.$from.parent.type.spec.code, r = e.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
	n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
	let i = e.input.shiftKey && e.input.lastKeyCode != 45;
	setTimeout(() => {
		e.focus(), r.parentNode && r.parentNode.removeChild(r), n ? fs(e, r.value, null, i, t) : fs(e, r.textContent, r.innerHTML, i, t);
	}, 50);
}
function fs(e, t, n, r, i) {
	let a = po(e, t, n, r, e.state.selection.$from);
	if (e.someProp("handlePaste", (t) => t(e, i, a || T.empty))) return !0;
	if (!a) return !1;
	let o = us(a), s = o ? e.state.tr.replaceSelectionWith(o, r) : e.state.tr.replaceSelection(a);
	return e.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function ps(e) {
	let t = e.getData("text/plain") || e.getData("Text");
	if (t) return t;
	let n = e.getData("text/uri-list");
	return n ? n.replace(/\r?\n/g, " ") : "";
}
Oo.paste = (e, t) => {
	let n = t;
	if (e.composing && !wi) return;
	let r = ls ? null : n.clipboardData, i = e.input.shiftKey && e.input.lastKeyCode != 45;
	r && fs(e, ps(r), r.getData("text/html"), i, n) ? n.preventDefault() : ds(e, n);
};
var ms = class {
	constructor(e, t, n) {
		this.slice = e, this.move = t, this.node = n;
	}
}, hs = Si ? "altKey" : "ctrlKey";
function gs(e, t) {
	let n;
	return e.someProp("dragCopies", (e) => {
		n ||= e(t);
	}), n == null ? !t[hs] : !n;
}
Do.dragstart = (e, t) => {
	let n = t, r = e.input.mouseDown;
	if (r && r.done(), !n.dataTransfer) return;
	let i = e.state.selection, a = i.empty ? null : e.posAtCoords(Ro(n)), o;
	if (!(a && a.pos >= i.from && a.pos <= (i instanceof j ? i.to - 1 : i.to))) {
		if (r && r.mightDrag) o = j.create(e.state.doc, r.mightDrag.pos);
		else if (n.target && n.target.nodeType == 1) {
			let t = e.docView.nearestDesc(n.target, !0);
			t && t.node.type.spec.draggable && t != e.docView && (o = j.create(e.state.doc, t.posBefore));
		}
	}
	let { dom: s, text: c, slice: l } = fo(e, (o || e.state.selection).content());
	(!n.dataTransfer.files.length || !vi || yi > 120) && n.dataTransfer.clearData(), n.dataTransfer.setData(ls ? "Text" : "text/html", s.innerHTML), n.dataTransfer.effectAllowed = "copyMove", ls || n.dataTransfer.setData("text/plain", c), e.dragging = new ms(l, gs(e, n), o);
}, Do.dragend = (e) => {
	let t = e.dragging;
	window.setTimeout(() => {
		e.dragging == t && (e.dragging = null);
	}, 50);
}, Oo.dragover = Oo.dragenter = (e, t) => t.preventDefault(), Oo.drop = (e, t) => {
	try {
		_s(e, t, e.dragging);
	} finally {
		e.dragging = null;
	}
};
function _s(e, t, n) {
	if (!t.dataTransfer) return;
	let r = e.posAtCoords(Ro(t));
	if (!r) return;
	let i = e.state.doc.resolve(r.pos), a = n && n.slice;
	a ? e.someProp("transformPasted", (t) => {
		a = t(a, e, !1);
	}) : a = po(e, ps(t.dataTransfer), ls ? null : t.dataTransfer.getData("text/html"), !1, i);
	let o = !!(n && gs(e, t));
	if (e.someProp("handleDrop", (n) => n(e, t, a || T.empty, o))) {
		t.preventDefault();
		return;
	}
	if (!a) return;
	t.preventDefault();
	let s = a ? fn(e.state.doc, i.pos, a) : i.pos;
	s ??= i.pos;
	let c = e.state.tr;
	if (o) {
		let { node: e } = n;
		e ? e.replace(c) : c.deleteSelection();
	}
	let l = c.mapping.map(s), u = a.openStart == 0 && a.openEnd == 0 && a.content.childCount == 1, d = c.doc;
	if (u ? c.replaceRangeWith(l, l, a.content.firstChild) : c.replaceRange(l, l, a), c.doc.eq(d)) return;
	let f = c.doc.resolve(l);
	if (u && j.isSelectable(a.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(a.content.firstChild)) c.setSelection(new j(f));
	else {
		let t = c.mapping.map(s);
		c.mapping.maps[c.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), c.setSelection(Ha(e, f, c.doc.resolve(t)));
	}
	e.focus(), e.dispatch(c.setMeta("uiEvent", "drop"));
}
Do.focus = (e) => {
	e.input.lastFocus = Date.now(), e.focused || (e.domObserver.stop(), e.dom.classList.add("ProseMirror-focused"), e.domObserver.start(), e.focused = !0, setTimeout(() => {
		e.docView && e.hasFocus() && !e.domObserver.currentSelection.eq(e.domSelectionRange()) && Na(e);
	}, 20));
}, Do.blur = (e, t) => {
	let n = t;
	e.focused &&= (e.domObserver.stop(), e.dom.classList.remove("ProseMirror-focused"), e.domObserver.start(), n.relatedTarget && e.dom.contains(n.relatedTarget) && e.domObserver.currentSelection.clear(), !1);
}, Do.beforeinput = (e, t) => {
	if (vi && wi && t.inputType == "deleteContentBackward") {
		e.domObserver.flushSoon();
		let { domChangeCount: t } = e.input;
		setTimeout(() => {
			if (e.input.domChangeCount != t || (e.dom.blur(), e.focus(), e.someProp("handleKeyDown", (t) => t(e, oi(8, "Backspace"))))) return;
			let { $cursor: n } = e.state.selection;
			n && n.pos > 0 && e.dispatch(e.state.tr.delete(n.pos - 1, n.pos).scrollIntoView());
		}, 50);
	}
};
for (let e in Oo) Do[e] = Oo[e];
function vs(e, t) {
	if (e == t) return !0;
	for (let n in e) if (e[n] !== t[n]) return !1;
	for (let n in t) if (!(n in e)) return !1;
	return !0;
}
var ys = class e {
	constructor(e, t) {
		this.toDOM = e, this.spec = t || ws, this.side = this.spec.side || 0;
	}
	map(e, t, n, r) {
		let { pos: i, deleted: a } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
		return a ? null : new Ss(i - n, i - n, this);
	}
	valid() {
		return !0;
	}
	eq(t) {
		return this == t || t instanceof e && (this.spec.key && this.spec.key == t.spec.key || this.toDOM == t.toDOM && vs(this.spec, t.spec));
	}
	destroy(e) {
		this.spec.destroy && this.spec.destroy(e);
	}
}, bs = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || ws;
	}
	map(e, t, n, r) {
		let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - n, a = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - n;
		return i >= a ? null : new Ss(i, a, this);
	}
	valid(e, t) {
		return t.from < t.to;
	}
	eq(t) {
		return this == t || t instanceof e && vs(this.attrs, t.attrs) && vs(this.spec, t.spec);
	}
	static is(t) {
		return t.type instanceof e;
	}
	destroy() {}
}, xs = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || ws;
	}
	map(e, t, n, r) {
		let i = e.mapResult(t.from + r, 1);
		if (i.deleted) return null;
		let a = e.mapResult(t.to + r, -1);
		return a.deleted || a.pos <= i.pos ? null : new Ss(i.pos - n, a.pos - n, this);
	}
	valid(e, t) {
		let { index: n, offset: r } = e.content.findIndex(t.from), i;
		return r == t.from && !(i = e.child(n)).isText && r + i.nodeSize == t.to;
	}
	eq(t) {
		return this == t || t instanceof e && vs(this.attrs, t.attrs) && vs(this.spec, t.spec);
	}
	destroy() {}
}, Ss = class e {
	constructor(e, t, n) {
		this.from = e, this.to = t, this.type = n;
	}
	copy(t, n) {
		return new e(t, n, this.type);
	}
	eq(e, t = 0) {
		return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
	}
	map(e, t, n) {
		return this.type.map(e, this, t, n);
	}
	static widget(t, n, r) {
		return new e(t, t, new ys(n, r));
	}
	static inline(t, n, r, i) {
		return new e(t, n, new bs(r, i));
	}
	static node(t, n, r, i) {
		return new e(t, n, new xs(r, i));
	}
	get spec() {
		return this.type.spec;
	}
	get inline() {
		return this.type instanceof bs;
	}
	get widget() {
		return this.type instanceof ys;
	}
}, Cs = [], ws = {}, Ts = class e {
	constructor(e, t) {
		this.local = e.length ? e : Cs, this.children = t.length ? t : Cs;
	}
	static create(e, t) {
		return t.length ? Ns(t, e, 0, ws) : Es;
	}
	find(e, t, n) {
		let r = [];
		return this.findInner(e ?? 0, t ?? 1e9, r, 0, n), r;
	}
	findInner(e, t, n, r, i) {
		for (let a = 0; a < this.local.length; a++) {
			let o = this.local[a];
			o.from <= t && o.to >= e && (!i || i(o.spec)) && n.push(o.copy(o.from + r, o.to + r));
		}
		for (let a = 0; a < this.children.length; a += 3) if (this.children[a] < t && this.children[a + 1] > e) {
			let o = this.children[a] + 1;
			this.children[a + 2].findInner(e - o, t - o, n, r + o, i);
		}
	}
	map(e, t, n) {
		return this == Es || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, n || ws);
	}
	mapInner(t, n, r, i, a) {
		let o;
		for (let e = 0; e < this.local.length; e++) {
			let s = this.local[e].map(t, r, i);
			s && s.type.valid(n, s) ? (o ||= []).push(s) : a.onRemove && a.onRemove(this.local[e].spec);
		}
		return this.children.length ? Os(this.children, o || [], t, n, r, i, a) : o ? new e(o.sort(Ps), Cs) : Es;
	}
	add(t, n) {
		return n.length ? this == Es ? e.create(t, n) : this.addInner(t, n, 0) : this;
	}
	addInner(t, n, r) {
		let i, a = 0;
		t.forEach((e, t) => {
			let o = t + r, s;
			if (s = js(n, e, o)) {
				for (i ||= this.children.slice(); a < i.length && i[a] < t;) a += 3;
				i[a] == t ? i[a + 2] = i[a + 2].addInner(e, s, o + 1) : i.splice(a, 0, t, t + e.nodeSize, Ns(s, e, o + 1, ws)), a += 3;
			}
		});
		let o = ks(a ? Ms(n) : n, -r);
		for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || o.splice(e--, 1);
		return new e(o.length ? this.local.concat(o).sort(Ps) : this.local, i || this.children);
	}
	remove(e) {
		return e.length == 0 || this == Es ? this : this.removeInner(e, 0);
	}
	removeInner(t, n) {
		let r = this.children, i = this.local;
		for (let e = 0; e < r.length; e += 3) {
			let i, a = r[e] + n, o = r[e + 1] + n;
			for (let e = 0, n; e < t.length; e++) (n = t[e]) && n.from > a && n.to < o && (t[e] = null, (i ||= []).push(n));
			if (!i) continue;
			r == this.children && (r = this.children.slice());
			let s = r[e + 2].removeInner(i, a + 1);
			s == Es ? (r.splice(e, 3), e -= 3) : r[e + 2] = s;
		}
		if (i.length) {
			for (let e = 0, r; e < t.length; e++) if (r = t[e]) for (let e = 0; e < i.length; e++) i[e].eq(r, n) && (i == this.local && (i = this.local.slice()), i.splice(e--, 1));
		}
		return r == this.children && i == this.local ? this : i.length || r.length ? new e(i, r) : Es;
	}
	forChild(t, n) {
		if (this == Es) return this;
		if (n.isLeaf) return e.empty;
		let r, i;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] >= t) {
			this.children[e] == t && (r = this.children[e + 2]);
			break;
		}
		let a = t + 1, o = a + n.content.size;
		for (let e = 0; e < this.local.length; e++) {
			let t = this.local[e];
			if (t.from < o && t.to > a && t.type instanceof bs) {
				let e = Math.max(a, t.from) - a, n = Math.min(o, t.to) - a;
				e < n && (i ||= []).push(t.copy(e, n));
			}
		}
		if (i) {
			let t = new e(i.sort(Ps), Cs);
			return r ? new Ds([t, r]) : t;
		}
		return r || Es;
	}
	eq(t) {
		if (this == t) return !0;
		if (!(t instanceof e) || this.local.length != t.local.length || this.children.length != t.children.length) return !1;
		for (let e = 0; e < this.local.length; e++) if (!this.local[e].eq(t.local[e])) return !1;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] != t.children[e] || this.children[e + 1] != t.children[e + 1] || !this.children[e + 2].eq(t.children[e + 2])) return !1;
		return !0;
	}
	locals(e) {
		return Fs(this.localsInner(e));
	}
	localsInner(e) {
		if (this == Es) return Cs;
		if (e.inlineContent || !this.local.some(bs.is)) return this.local;
		let t = [];
		for (let e = 0; e < this.local.length; e++) this.local[e].type instanceof bs || t.push(this.local[e]);
		return t;
	}
	forEachSet(e) {
		e(this);
	}
};
Ts.empty = new Ts([], []), Ts.removeOverlap = Fs;
var Es = Ts.empty, Ds = class e {
	constructor(e) {
		this.members = e;
	}
	map(t, n) {
		let r = this.members.map((e) => e.map(t, n, ws));
		return e.from(r);
	}
	forChild(t, n) {
		if (n.isLeaf) return Ts.empty;
		let r = [];
		for (let i = 0; i < this.members.length; i++) {
			let a = this.members[i].forChild(t, n);
			a != Es && (a instanceof e ? r = r.concat(a.members) : r.push(a));
		}
		return e.from(r);
	}
	eq(t) {
		if (!(t instanceof e) || t.members.length != this.members.length) return !1;
		for (let e = 0; e < this.members.length; e++) if (!this.members[e].eq(t.members[e])) return !1;
		return !0;
	}
	locals(e) {
		let t, n = !0;
		for (let r = 0; r < this.members.length; r++) {
			let i = this.members[r].localsInner(e);
			if (i.length) if (!t) t = i;
			else {
				n &&= (t = t.slice(), !1);
				for (let e = 0; e < i.length; e++) t.push(i[e]);
			}
		}
		return t ? Fs(n ? t : t.sort(Ps)) : Cs;
	}
	static from(t) {
		switch (t.length) {
			case 0: return Es;
			case 1: return t[0];
			default: return new e(t.every((e) => e instanceof Ts) ? t : t.reduce((e, t) => e.concat(t instanceof Ts ? t : t.members), []));
		}
	}
	forEachSet(e) {
		for (let t = 0; t < this.members.length; t++) this.members[t].forEachSet(e);
	}
};
function Os(e, t, n, r, i, a, o) {
	let s = e.slice();
	for (let e = 0, t = a; e < n.maps.length; e++) {
		let r = 0;
		n.maps[e].forEach((e, n, i, a) => {
			let o = a - i - (n - e);
			for (let i = 0; i < s.length; i += 3) {
				let a = s[i + 1];
				if (a < 0 || e > a + t - r) continue;
				let c = s[i] + t - r;
				n >= c ? s[i + 1] = e <= c ? -2 : -1 : e >= t && o && (s[i] += o, s[i + 1] += o);
			}
			r += o;
		}), t = n.maps[e].map(t, -1);
	}
	let c = !1;
	for (let t = 0; t < s.length; t += 3) if (s[t + 1] < 0) {
		if (s[t + 1] == -2) {
			c = !0, s[t + 1] = -1;
			continue;
		}
		let l = n.map(e[t] + a), u = l - i;
		if (u < 0 || u >= r.content.size) {
			c = !0;
			continue;
		}
		let d = n.map(e[t + 1] + a, -1) - i, { index: f, offset: p } = r.content.findIndex(u), m = r.maybeChild(f);
		if (m && p == u && p + m.nodeSize == d) {
			let r = s[t + 2].mapInner(n, m, l + 1, e[t] + a + 1, o);
			r == Es ? (s[t + 1] = -2, c = !0) : (s[t] = u, s[t + 1] = d, s[t + 2] = r);
		} else c = !0;
	}
	if (c) {
		let c = Ns(As(s, e, t, n, i, a, o), r, 0, o);
		t = c.local;
		for (let e = 0; e < s.length; e += 3) s[e + 1] < 0 && (s.splice(e, 3), e -= 3);
		for (let e = 0, t = 0; e < c.children.length; e += 3) {
			let n = c.children[e];
			for (; t < s.length && s[t] < n;) t += 3;
			s.splice(t, 0, c.children[e], c.children[e + 1], c.children[e + 2]);
		}
	}
	return new Ts(t.sort(Ps), s);
}
function ks(e, t) {
	if (!t || !e.length) return e;
	let n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		n.push(new Ss(i.from + t, i.to + t, i.type));
	}
	return n;
}
function As(e, t, n, r, i, a, o) {
	function s(e, t) {
		for (let a = 0; a < e.local.length; a++) {
			let s = e.local[a].map(r, i, t);
			s ? n.push(s) : o.onRemove && o.onRemove(e.local[a].spec);
		}
		for (let n = 0; n < e.children.length; n += 3) s(e.children[n + 2], e.children[n] + t + 1);
	}
	for (let n = 0; n < e.length; n += 3) e[n + 1] == -1 && s(e[n + 2], t[n] + a + 1);
	return n;
}
function js(e, t, n) {
	if (t.isLeaf) return null;
	let r = n + t.nodeSize, i = null;
	for (let t = 0, a; t < e.length; t++) (a = e[t]) && a.from > n && a.to < r && ((i ||= []).push(a), e[t] = null);
	return i;
}
function Ms(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) e[n] != null && t.push(e[n]);
	return t;
}
function Ns(e, t, n, r) {
	let i = [], a = !1;
	t.forEach((t, o) => {
		let s = js(e, t, o + n);
		if (s) {
			a = !0;
			let e = Ns(s, t, n + o + 1, r);
			e != Es && i.push(o, o + t.nodeSize, e);
		}
	});
	let o = ks(a ? Ms(e) : e, -n).sort(Ps);
	for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || (r.onRemove && r.onRemove(o[e].spec), o.splice(e--, 1));
	return o.length || i.length ? new Ts(o, i) : Es;
}
function Ps(e, t) {
	return e.from - t.from || e.to - t.to;
}
function Fs(e) {
	let t = e;
	for (let n = 0; n < t.length - 1; n++) {
		let r = t[n];
		if (r.from != r.to) for (let i = n + 1; i < t.length; i++) {
			let a = t[i];
			if (a.from == r.from) {
				a.to != r.to && (t == e && (t = e.slice()), t[i] = a.copy(a.from, r.to), Is(t, i + 1, a.copy(r.to, a.to)));
				continue;
			} else {
				a.from < r.to && (t == e && (t = e.slice()), t[n] = r.copy(r.from, a.from), Is(t, i, r.copy(a.from, r.to)));
				break;
			}
		}
	}
	return t;
}
function Is(e, t, n) {
	for (; t < e.length && Ps(n, e[t]) > 0;) t++;
	e.splice(t, 0, n);
}
function Ls(e) {
	let t = [];
	return e.someProp("decorations", (n) => {
		let r = n(e.state);
		r && r != Es && t.push(r);
	}), e.cursorWrapper && t.push(Ts.create(e.state.doc, [e.cursorWrapper.deco])), Ds.from(t);
}
var Rs = {
	childList: !0,
	characterData: !0,
	characterDataOldValue: !0,
	attributes: !0,
	attributeOldValue: !0,
	subtree: !0
}, zs = M && hi <= 11, Bs = class {
	constructor() {
		this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
	}
	set(e) {
		this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
	}
	clear() {
		this.anchorNode = this.focusNode = null;
	}
	eq(e) {
		return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
	}
}, Vs = class {
	constructor(e, t) {
		this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new Bs(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((t) => {
			for (let e = 0; e < t.length; e++) this.queue.push(t[e]);
			M && hi <= 11 && t.some((e) => e.type == "childList" && e.removedNodes.length || e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length) ? this.flushSoon() : bi && e.composing && t.some((e) => e.type == "childList" && e.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
		}), zs && (this.onCharData = (e) => {
			this.queue.push({
				target: e.target,
				type: "characterData",
				oldValue: e.prevValue
			}), this.flushSoon();
		}), this.onSelectionChange = this.onSelectionChange.bind(this);
	}
	flushSoon() {
		this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
			this.flushingSoon = -1, this.flush();
		}, 20));
	}
	forceFlush() {
		this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
	}
	start() {
		this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, Rs)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
	}
	stop() {
		if (this.observer) {
			let e = this.observer.takeRecords();
			if (e.length) {
				for (let t = 0; t < e.length; t++) this.queue.push(e[t]);
				window.setTimeout(() => this.flush(), 20);
			}
			this.observer.disconnect();
		}
		this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
	}
	connectSelection() {
		this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
	}
	disconnectSelection() {
		this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
	}
	suppressSelectionUpdates() {
		this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
	}
	onSelectionChange() {
		if (Ua(this.view)) {
			if (this.suppressingSelectionUpdates) return Na(this.view);
			if (M && hi <= 11 && !this.view.state.selection.empty) {
				let e = this.view.domSelectionRange();
				if (e.focusNode && Zr(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset)) return this.flushSoon();
			}
			this.flush();
		}
	}
	setCurSelection() {
		this.currentSelection.set(this.view.domSelectionRange());
	}
	ignoreSelectionChange(e) {
		if (!e.focusNode) return !0;
		let t = /* @__PURE__ */ new Set(), n;
		for (let n = e.focusNode; n; n = qr(n)) t.add(n);
		for (let r = e.anchorNode; r; r = qr(r)) if (t.has(r)) {
			n = r;
			break;
		}
		let r = n && this.view.docView.nearestDesc(n);
		if (r && r.ignoreMutation({
			type: "selection",
			target: n.nodeType == 3 ? n.parentNode : n
		})) return this.setCurSelection(), !0;
	}
	pendingRecords() {
		if (this.observer) for (let e of this.observer.takeRecords()) this.queue.push(e);
		return this.queue;
	}
	flush() {
		let { view: e } = this;
		if (!e.docView || this.flushingSoon > -1) return;
		let t = this.pendingRecords();
		t.length && (this.queue = []);
		let n = e.domSelectionRange(), r = !this.suppressingSelectionUpdates && !this.currentSelection.eq(n) && Ua(e) && !this.ignoreSelectionChange(n), i = -1, a = -1, o = !1, s = [];
		if (e.editable) for (let e = 0; e < t.length; e++) {
			let n = this.registerMutation(t[e], s);
			n && (i = i < 0 ? n.from : Math.min(n.from, i), a = a < 0 ? n.to : Math.max(n.to, a), n.typeOver && (o = !0));
		}
		if (s.some((e) => e.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || vi && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((e) => e.type == "childList" && e.removedNodes.length))) {
			for (let e of s) if (e.nodeName == "BR" && e.parentNode) {
				let t = e.nextSibling;
				for (; t && t.nodeType == 1;) {
					if (t.contentEditable == "false") {
						e.parentNode.removeChild(e);
						break;
					}
					t = t.firstChild;
				}
			}
		} else if (gi && s.length) {
			let t = s.filter((e) => e.nodeName == "BR");
			if (t.length == 2) {
				let [e, n] = t;
				e.parentNode && e.parentNode.parentNode == n.parentNode ? n.remove() : e.remove();
			} else {
				let { focusNode: n } = this.currentSelection;
				for (let r of t) {
					let t = r.parentNode;
					t && t.nodeName == "LI" && (!n || qs(e, n) != t) && r.remove();
				}
			}
		}
		let c = null;
		i < 0 && r && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && ai(n) && (c = ja(e)) && c.eq(k.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Na(e), this.currentSelection.set(n), e.scrollToSelection()) : (i > -1 || r) && (i > -1 && (e.docView.markDirty(i, a), Ws(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, Js(e, s)), this.handleDOMChange(i, a, o, s), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(n) || Na(e), this.currentSelection.set(n));
	}
	registerMutation(e, t) {
		if (t.indexOf(e.target) > -1) return null;
		let n = this.view.docView.nearestDesc(e.target);
		if (e.type == "attributes" && (n == this.view.docView || e.attributeName == "contenteditable" || e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !n || n.ignoreMutation(e)) return null;
		if (e.type == "childList") {
			for (let n = 0; n < e.addedNodes.length; n++) {
				let r = e.addedNodes[n];
				t.push(r), r.nodeType == 3 && (this.lastChangedTextNode = r);
			}
			if (n.contentDOM && n.contentDOM != n.dom && !n.contentDOM.contains(e.target)) return {
				from: n.posBefore,
				to: n.posAfter
			};
			let r = e.previousSibling, i = e.nextSibling;
			if (M && hi <= 11 && e.addedNodes.length) for (let t = 0; t < e.addedNodes.length; t++) {
				let { previousSibling: n, nextSibling: a } = e.addedNodes[t];
				(!n || Array.prototype.indexOf.call(e.addedNodes, n) < 0) && (r = n), (!a || Array.prototype.indexOf.call(e.addedNodes, a) < 0) && (i = a);
			}
			let a = r && r.parentNode == e.target ? Kr(r) + 1 : 0, o = n.localPosFromDOM(e.target, a, -1), s = i && i.parentNode == e.target ? Kr(i) : e.target.childNodes.length;
			return {
				from: o,
				to: n.localPosFromDOM(e.target, s, 1)
			};
		} else if (e.type == "attributes") return {
			from: n.posAtStart - n.border,
			to: n.posAtEnd + n.border
		};
		else return this.lastChangedTextNode = e.target, {
			from: n.posAtStart,
			to: n.posAtEnd,
			typeOver: e.target.nodeValue == e.oldValue
		};
	}
}, Hs = /* @__PURE__ */ new WeakMap(), Us = !1;
function Ws(e) {
	if (!Hs.has(e) && (Hs.set(e, null), [
		"normal",
		"nowrap",
		"pre-line"
	].indexOf(getComputedStyle(e.dom).whiteSpace) !== -1)) {
		if (e.requiresGeckoHackNode = gi, Us) return;
		console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Us = !0;
	}
}
function Gs(e, t) {
	let n = t.startContainer, r = t.startOffset, i = t.endContainer, a = t.endOffset, o = e.domAtPos(e.state.selection.anchor);
	return Zr(o.node, o.offset, i, a) && ([n, r, i, a] = [
		i,
		a,
		n,
		r
	]), {
		anchorNode: n,
		anchorOffset: r,
		focusNode: i,
		focusOffset: a
	};
}
function Ks(e, t) {
	if (t.getComposedRanges) {
		let n = t.getComposedRanges(e.root)[0];
		if (n) return Gs(e, n);
	}
	let n;
	function r(e) {
		e.preventDefault(), e.stopImmediatePropagation(), n = e.getTargetRanges()[0];
	}
	return e.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), e.dom.removeEventListener("beforeinput", r, !0), n ? Gs(e, n) : null;
}
function qs(e, t) {
	for (let n = t.parentNode; n && n != e.dom; n = n.parentNode) {
		let t = e.docView.nearestDesc(n, !0);
		if (t && t.node.isBlock) return n;
	}
	return null;
}
function Js(e, t) {
	let { focusNode: n, focusOffset: r } = e.domSelectionRange();
	for (let i of t) if (i.parentNode?.nodeName == "TR") {
		let t = i.nextSibling;
		for (; t && t.nodeName != "TD" && t.nodeName != "TH";) t = t.nextSibling;
		if (t) {
			let a = t;
			for (;;) {
				let e = a.firstChild;
				if (!e || e.nodeType != 1 || e.contentEditable == "false" || /^(BR|IMG)$/.test(e.nodeName)) break;
				a = e;
			}
			a.insertBefore(i, a.firstChild), n == i && e.domSelection().collapse(i, r);
		} else i.parentNode.removeChild(i);
	}
}
function Ys(e, t, n) {
	let { node: r, fromOffset: i, toOffset: a, from: o, to: s } = e.docView.parseRange(t, n), c = e.domSelectionRange(), l, u = c.anchorNode;
	if (u && e.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (l = [{
		node: u,
		offset: c.anchorOffset
	}], ai(c) || l.push({
		node: c.focusNode,
		offset: c.focusOffset
	})), vi && e.input.lastKeyCode === 8) for (let e = a; e > i; e--) {
		let t = r.childNodes[e - 1], n = t.pmViewDesc;
		if (t.nodeName == "BR" && !n) {
			a = e;
			break;
		}
		if (!n || n.size) break;
	}
	let d = e.state.doc, f = e.someProp("domParser") || Ze.fromSchema(e.state.schema), p = d.resolve(o), m = null, h = f.parse(r, {
		topNode: p.parent,
		topMatch: p.parent.contentMatchAt(p.index()),
		topOpen: !0,
		from: i,
		to: a,
		preserveWhitespace: p.parent.type.whitespace == "pre" ? "full" : !0,
		findPositions: l,
		ruleFromNode: Xs,
		context: p
	});
	if (l && l[0].pos != null) {
		let e = l[0].pos, t = l[1] && l[1].pos;
		t ??= e, m = {
			anchor: e + o,
			head: t + o
		};
	}
	return {
		doc: h,
		sel: m,
		from: o,
		to: s
	};
}
function Xs(e) {
	let t = e.pmViewDesc;
	if (t) return t.parseRule();
	if (e.nodeName == "BR" && e.parentNode) {
		if (bi && /^(ul|ol)$/i.test(e.parentNode.nodeName)) {
			let e = document.createElement("div");
			return e.appendChild(document.createElement("li")), { skip: e };
		} else if (e.parentNode.lastChild == e || bi && /^(tr|table)$/i.test(e.parentNode.nodeName)) return { ignore: !0 };
	} else if (e.nodeName == "IMG" && e.getAttribute("mark-placeholder")) return { ignore: !0 };
	return null;
}
var Zs = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Qs(e, t, n, r, i) {
	let a = e.input.compositionPendingChanges || (e.composing ? e.input.compositionID : 0);
	if (e.input.compositionPendingChanges = 0, t < 0) {
		let t = e.input.lastSelectionTime > Date.now() - 50 ? e.input.lastSelectionOrigin : null, n = ja(e, t);
		if (n && !e.state.selection.eq(n)) {
			if (vi && wi && e.input.lastKeyCode === 13 && Date.now() - 100 < e.input.lastKeyCodeTime && e.someProp("handleKeyDown", (t) => t(e, oi(13, "Enter")))) return;
			let r = e.state.tr.setSelection(n);
			t == "pointer" ? r.setMeta("pointer", !0) : t == "key" && r.scrollIntoView(), a && r.setMeta("composition", a), e.dispatch(r);
		}
		return;
	}
	let o = e.state.doc.resolve(t), s = o.sharedDepth(n);
	t = o.before(s + 1), n = e.state.doc.resolve(n).after(s + 1);
	let c = e.state.selection, l = Ys(e, t, n), u = e.state.doc, d = u.slice(l.from, l.to), f, p;
	e.input.lastKeyCode === 8 && Date.now() - 100 < e.input.lastKeyCodeTime ? (f = e.state.selection.to, p = "end") : (f = e.state.selection.from, p = "start"), e.input.lastKeyCode = null;
	let m = rc(d.content, l.doc.content, l.from, f, p);
	if (m && e.input.domChangeCount++, (xi && e.input.lastIOSEnter > Date.now() - 225 || wi) && i.some((e) => e.nodeType == 1 && !Zs.test(e.nodeName)) && (!m || m.endA >= m.endB) && e.someProp("handleKeyDown", (t) => t(e, oi(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (!m) if (r && c instanceof A && !c.empty && c.$head.sameParent(c.$anchor) && !e.composing && !(l.sel && l.sel.anchor != l.sel.head)) m = {
		start: c.from,
		endA: c.to,
		endB: c.to
	};
	else {
		if (l.sel) {
			let t = $s(e, e.state.doc, l.sel);
			if (t && !t.eq(e.state.selection)) {
				let n = e.state.tr.setSelection(t);
				a && n.setMeta("composition", a), e.dispatch(n);
			}
		}
		return;
	}
	e.state.selection.from < e.state.selection.to && m.start == m.endB && e.state.selection instanceof A && (m.start > e.state.selection.from && m.start <= e.state.selection.from + 2 && e.state.selection.from >= l.from ? m.start = e.state.selection.from : m.endA < e.state.selection.to && m.endA >= e.state.selection.to - 2 && e.state.selection.to <= l.to && (m.endB += e.state.selection.to - m.endA, m.endA = e.state.selection.to)), M && hi <= 11 && m.endB == m.start + 1 && m.endA == m.start && m.start > l.from && l.doc.textBetween(m.start - l.from - 1, m.start - l.from + 1) == " \xA0" && (m.start--, m.endA--, m.endB--);
	let h = l.doc.resolveNoCache(m.start - l.from), g = l.doc.resolveNoCache(m.endB - l.from), _ = u.resolve(m.start), v = h.sameParent(g) && h.parent.inlineContent && _.end() >= m.endA;
	if ((xi && e.input.lastIOSEnter > Date.now() - 225 && (!v || i.some((e) => e.nodeName == "DIV" || e.nodeName == "P")) || !v && h.pos < l.doc.content.size && (!h.sameParent(g) || !h.parent.inlineContent) && h.pos < g.pos && !/\S/.test(l.doc.textBetween(h.pos, g.pos, "", ""))) && e.someProp("handleKeyDown", (t) => t(e, oi(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (e.state.selection.anchor > m.start && tc(u, m.start, m.endA, h, g) && e.someProp("handleKeyDown", (t) => t(e, oi(8, "Backspace")))) {
		wi && vi && e.domObserver.suppressSelectionUpdates();
		return;
	}
	vi && m.endB == m.start && (e.input.lastChromeDelete = Date.now()), wi && !v && h.start() != g.start() && g.parentOffset == 0 && h.depth == g.depth && l.sel && l.sel.anchor == l.sel.head && l.sel.head == m.endA && (m.endB -= 2, g = l.doc.resolveNoCache(m.endB - l.from), setTimeout(() => {
		e.someProp("handleKeyDown", function(t) {
			return t(e, oi(13, "Enter"));
		});
	}, 20));
	let y = m.start, b = m.endA, x = (t) => {
		let n = t || e.state.tr.replace(y, b, l.doc.slice(m.start - l.from, m.endB - l.from));
		if (l.sel) {
			let t = $s(e, n.doc, l.sel);
			t && !(vi && e.composing && t.empty && (m.start != m.endB || e.input.lastChromeDelete < Date.now() - 100) && (t.head == y || t.head == n.mapping.map(b) - 1) || M && t.empty && t.head == y) && n.setSelection(t);
		}
		return a && n.setMeta("composition", a), n.scrollIntoView();
	}, ee;
	if (v) if (h.pos == g.pos) {
		M && hi <= 11 && h.parentOffset == 0 && (e.domObserver.suppressSelectionUpdates(), setTimeout(() => Na(e), 20));
		let t = x(e.state.tr.delete(y, b)), n = u.resolve(m.start).marksAcross(u.resolve(m.endA));
		n && t.ensureMarks(n), e.dispatch(t);
	} else if (m.endA == m.endB && (ee = ec(h.parent.content.cut(h.parentOffset, g.parentOffset), _.parent.content.cut(_.parentOffset, m.endA - _.start())))) {
		let t = x(e.state.tr);
		ee.type == "add" ? t.addMark(y, b, ee.mark) : t.removeMark(y, b, ee.mark), e.dispatch(t);
	} else if (h.parent.child(h.index()).isText && h.index() == g.index() - +!g.textOffset) {
		let t = h.parent.textBetween(h.parentOffset, g.parentOffset), n = () => x(e.state.tr.insertText(t, y, b));
		e.someProp("handleTextInput", (r) => r(e, y, b, t, n)) || e.dispatch(n());
	} else e.dispatch(x());
	else e.dispatch(x());
}
function $s(e, t, n) {
	return Math.max(n.anchor, n.head) > t.content.size ? null : Ha(e, t.resolve(n.anchor), t.resolve(n.head));
}
function ec(e, t) {
	let n = e.firstChild.marks, r = t.firstChild.marks, i = n, a = r, o, s, c;
	for (let e = 0; e < r.length; e++) i = r[e].removeFromSet(i);
	for (let e = 0; e < n.length; e++) a = n[e].removeFromSet(a);
	if (i.length == 1 && a.length == 0) s = i[0], o = "add", c = (e) => e.mark(s.addToSet(e.marks));
	else if (i.length == 0 && a.length == 1) s = a[0], o = "remove", c = (e) => e.mark(s.removeFromSet(e.marks));
	else return null;
	let l = [];
	for (let e = 0; e < t.childCount; e++) l.push(c(t.child(e)));
	if (C.from(l).eq(e)) return {
		mark: s,
		type: o
	};
}
function tc(e, t, n, r, i) {
	if (n - t <= i.pos - r.pos || nc(r, !0, !1) < i.pos) return !1;
	let a = e.resolve(t);
	if (!r.parent.isTextblock) {
		let e = a.nodeAfter;
		return e != null && n == t + e.nodeSize;
	}
	if (a.parentOffset < a.parent.content.size || !a.parent.isTextblock) return !1;
	let o = e.resolve(nc(a, !0, !0));
	return !o.parent.isTextblock || o.pos > n || nc(o, !0, !1) < n ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function nc(e, t, n) {
	let r = e.depth, i = t ? e.end() : e.pos;
	for (; r > 0 && (t || e.indexAfter(r) == e.node(r).childCount);) r--, i++, t = !1;
	if (n) {
		let t = e.node(r).maybeChild(e.indexAfter(r));
		for (; t && !t.isLeaf;) t = t.firstChild, i++;
	}
	return i;
}
function rc(e, t, n, r, i) {
	let a = e.findDiffStart(t, n), o = n + e.size, s = n + t.size;
	if (a == null) return null;
	let { a: c, b: l } = e.findDiffEnd(t, o, s);
	if (i == "end") {
		let e = Math.max(0, a - Math.min(c, l));
		r -= c + e - a;
	}
	if (c < a && o < s) {
		let e = r <= a && r >= c ? a - r : 0;
		a -= e, l = a + (l - c), c = a;
	} else if (l < a) {
		let e = r <= a && r >= l ? a - r : 0;
		a -= e, c = a + (c - l), l = a;
	}
	return {
		start: a,
		endA: c,
		endB: l
	};
}
var ic = class {
	constructor(e, t) {
		this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Ao(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(dc), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = sc(this), oc(this), this.nodeViews = lc(this), this.docView = da(this.state.doc, ac(this), Ls(this), this.dom, this), this.domObserver = new Vs(this, (e, t, n, r) => Qs(this, e, t, n, r)), this.domObserver.start(), jo(this), this.updatePluginViews();
	}
	get composing() {
		return this.input.composing;
	}
	get props() {
		if (this._props.state != this.state) {
			let e = this._props;
			this._props = {};
			for (let t in e) this._props[t] = e[t];
			this._props.state = this.state;
		}
		return this._props;
	}
	update(e) {
		e.handleDOMEvents != this._props.handleDOMEvents && Po(this);
		let t = this._props;
		this._props = e, e.plugins && (e.plugins.forEach(dc), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
	}
	setProps(e) {
		let t = {};
		for (let e in this._props) t[e] = this._props[e];
		t.state = this.state;
		for (let n in e) t[n] = e[n];
		this.update(t);
	}
	updateState(e) {
		this.updateStateInner(e, this._props);
	}
	updateStateInner(e, t) {
		let n = this.state, r = !1, i = !1;
		e.storedMarks && this.composing && (is(this), i = !0), this.state = e;
		let a = n.plugins != e.plugins || this._props.plugins != t.plugins;
		if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
			let e = lc(this);
			uc(e, this.nodeViews) && (this.nodeViews = e, r = !0);
		}
		(a || t.handleDOMEvents != this._props.handleDOMEvents) && Po(this), this.editable = sc(this), oc(this);
		let o = Ls(this), s = ac(this), c = n.plugins != e.plugins && !n.doc.eq(e.doc) ? "reset" : e.scrollToSelection > n.scrollToSelection ? "to selection" : "preserve", l = r || !this.docView.matchesNode(e.doc, s, o);
		(l || !e.selection.eq(n.selection)) && (i = !0);
		let u = c == "preserve" && i && this.dom.style.overflowAnchor == null && ji(this);
		if (i) {
			this.domObserver.stop();
			let t = l && (M || vi) && !this.composing && !n.selection.empty && !e.selection.empty && cc(n.selection, e.selection);
			if (l) {
				let n = vi ? this.trackWrites = this.domSelectionRange().focusNode : null;
				this.composing && (this.input.compositionNode = as(this)), (r || !this.docView.update(e.doc, s, o, this)) && (this.docView.updateOuterDeco(s), this.docView.destroy(), this.docView = da(e.doc, s, o, this.dom, this)), n && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (t = !0);
			}
			let i = this.input.mouseDown;
			t || !(i && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Ga(this) && i.delaySelUpdate()) ? Na(this, t) : (Ba(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
		}
		this.updatePluginViews(n), this.dragging?.node && !n.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, n), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : u && Ni(u);
	}
	scrollToSelection() {
		let e = this.domSelectionRange().focusNode;
		if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode)) && !this.someProp("handleScrollToSelection", (e) => e(this))) if (this.state.selection instanceof j) {
			let t = this.docView.domAfterPos(this.state.selection.from);
			t.nodeType == 1 && Ai(this, t.getBoundingClientRect(), e);
		} else Ai(this, this.coordsAtPos(this.state.selection.head, 1), e);
	}
	destroyPluginViews() {
		let e;
		for (; e = this.pluginViews.pop();) e.destroy && e.destroy();
	}
	updatePluginViews(e) {
		if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
			this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
			for (let e = 0; e < this.directPlugins.length; e++) {
				let t = this.directPlugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
			for (let e = 0; e < this.state.plugins.length; e++) {
				let t = this.state.plugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
		} else for (let t = 0; t < this.pluginViews.length; t++) {
			let n = this.pluginViews[t];
			n.update && n.update(this, e);
		}
	}
	updateDraggedNode(e, t) {
		let n = e.node, r = -1;
		if (n.from < this.state.doc.content.size && this.state.doc.nodeAt(n.from) == n.node) r = n.from;
		else {
			let e = n.from + (this.state.doc.content.size - t.doc.content.size);
			(e > 0 && e < this.state.doc.content.size && this.state.doc.nodeAt(e)) == n.node && (r = e);
		}
		this.dragging = new ms(e.slice, e.move, r < 0 ? void 0 : j.create(this.state.doc, r));
	}
	someProp(e, t) {
		let n = this._props && this._props[e], r;
		if (n != null && (r = t ? t(n) : n)) return r;
		for (let n = 0; n < this.directPlugins.length; n++) {
			let i = this.directPlugins[n].props[e];
			if (i != null && (r = t ? t(i) : i)) return r;
		}
		let i = this.state.plugins;
		if (i) for (let n = 0; n < i.length; n++) {
			let a = i[n].props[e];
			if (a != null && (r = t ? t(a) : a)) return r;
		}
	}
	hasFocus() {
		if (M) {
			let e = this.root.activeElement;
			if (e == this.dom) return !0;
			if (!e || !this.dom.contains(e)) return !1;
			for (; e && this.dom != e && this.dom.contains(e);) {
				if (e.contentEditable == "false") return !1;
				e = e.parentElement;
			}
			return !0;
		}
		return this.root.activeElement == this.dom;
	}
	focus() {
		this.domObserver.stop(), this.editable && Ii(this.dom), Na(this), this.domObserver.start();
	}
	get root() {
		let e = this._root;
		if (e == null) {
			for (let e = this.dom.parentNode; e; e = e.parentNode) if (e.nodeType == 9 || e.nodeType == 11 && e.host) return e.getSelection || (Object.getPrototypeOf(e).getSelection = () => e.ownerDocument.getSelection()), this._root = e;
		}
		return e || document;
	}
	updateRoot() {
		this._root = null;
	}
	posAtCoords(e) {
		return Hi(this, e);
	}
	coordsAtPos(e, t = 1) {
		return Ki(this, e, t);
	}
	domAtPos(e, t = 0) {
		return this.docView.domFromPos(e, t);
	}
	nodeDOM(e) {
		let t = this.docView.descAt(e);
		return t ? t.nodeDOM : null;
	}
	posAtDOM(e, t, n = -1) {
		let r = this.docView.posFromDOM(e, t, n);
		if (r == null) throw RangeError("DOM position not inside the editor");
		return r;
	}
	endOfTextblock(e, t) {
		return na(this, t || this.state, e);
	}
	pasteHTML(e, t) {
		return fs(this, "", e, !1, t || new ClipboardEvent("paste"));
	}
	pasteText(e, t) {
		return fs(this, e, null, !0, t || new ClipboardEvent("paste"));
	}
	serializeForClipboard(e) {
		return fo(this, e);
	}
	destroy() {
		this.docView && (No(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Ls(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Xr());
	}
	get isDestroyed() {
		return this.docView == null;
	}
	dispatchEvent(e) {
		return Lo(this, e);
	}
	domSelectionRange() {
		let e = this.domSelection();
		return e ? bi && this.root.nodeType === 11 && si(this.dom.ownerDocument) == this.dom && Ks(this, e) || e : {
			focusNode: null,
			focusOffset: 0,
			anchorNode: null,
			anchorOffset: 0
		};
	}
	domSelection() {
		return this.root.getSelection();
	}
};
ic.prototype.dispatch = function(e) {
	let t = this._props.dispatchTransaction;
	t ? t.call(this, e) : this.updateState(this.state.apply(e));
};
function ac(e) {
	let t = Object.create(null);
	return t.class = "ProseMirror", t.contenteditable = String(e.editable), e.someProp("attributes", (n) => {
		if (typeof n == "function" && (n = n(e.state)), n) for (let e in n) e == "class" ? t.class += " " + n[e] : e == "style" ? t.style = (t.style ? t.style + ";" : "") + n[e] : !t[e] && e != "contenteditable" && e != "nodeName" && (t[e] = String(n[e]));
	}), t.translate ||= "no", [Ss.node(0, e.state.doc.content.size, t)];
}
function oc(e) {
	if (e.markCursor) {
		let t = document.createElement("img");
		t.className = "ProseMirror-separator", t.setAttribute("mark-placeholder", "true"), t.setAttribute("alt", ""), e.cursorWrapper = {
			dom: t,
			deco: Ss.widget(e.state.selection.from, t, {
				raw: !0,
				marks: e.markCursor
			})
		};
	} else e.cursorWrapper = null;
}
function sc(e) {
	return !e.someProp("editable", (t) => t(e.state) === !1);
}
function cc(e, t) {
	let n = Math.min(e.$anchor.sharedDepth(e.head), t.$anchor.sharedDepth(t.head));
	return e.$anchor.start(n) != t.$anchor.start(n);
}
function lc(e) {
	let t = Object.create(null);
	function n(e) {
		for (let n in e) Object.prototype.hasOwnProperty.call(t, n) || (t[n] = e[n]);
	}
	return e.someProp("nodeViews", n), e.someProp("markViews", n), t;
}
function uc(e, t) {
	let n = 0, r = 0;
	for (let r in e) {
		if (e[r] != t[r]) return !0;
		n++;
	}
	for (let e in t) r++;
	return n != r;
}
function dc(e) {
	if (e.spec.state || e.spec.filterTransaction || e.spec.appendTransaction) throw RangeError("Plugins passed directly to the view must not have a state component");
}
for (var fc = {
	8: "Backspace",
	9: "Tab",
	10: "Enter",
	12: "NumLock",
	13: "Enter",
	16: "Shift",
	17: "Control",
	18: "Alt",
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
	44: "PrintScreen",
	45: "Insert",
	46: "Delete",
	59: ";",
	61: "=",
	91: "Meta",
	92: "Meta",
	106: "*",
	107: "+",
	108: ",",
	109: "-",
	110: ".",
	111: "/",
	144: "NumLock",
	145: "ScrollLock",
	160: "Shift",
	161: "Shift",
	162: "Control",
	163: "Control",
	164: "Alt",
	165: "Alt",
	173: "-",
	186: ";",
	187: "=",
	188: ",",
	189: "-",
	190: ".",
	191: "/",
	192: "`",
	219: "[",
	220: "\\",
	221: "]",
	222: "'"
}, pc = {
	48: ")",
	49: "!",
	50: "@",
	51: "#",
	52: "$",
	53: "%",
	54: "^",
	55: "&",
	56: "*",
	57: "(",
	59: ":",
	61: "+",
	173: "_",
	186: ":",
	187: "+",
	188: "<",
	189: "_",
	190: ">",
	191: "?",
	192: "~",
	219: "{",
	220: "|",
	221: "}",
	222: "\""
}, mc = typeof navigator < "u" && /Mac/.test(navigator.platform), hc = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), gc = 0; gc < 10; gc++) fc[48 + gc] = fc[96 + gc] = String(gc);
for (var gc = 1; gc <= 24; gc++) fc[gc + 111] = "F" + gc;
for (var gc = 65; gc <= 90; gc++) fc[gc] = String.fromCharCode(gc + 32), pc[gc] = String.fromCharCode(gc);
for (var _c in fc) pc.hasOwnProperty(_c) || (pc[_c] = fc[_c]);
function vc(e) {
	var t = !(mc && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey || hc && e.shiftKey && e.key && e.key.length == 1 || e.key == "Unidentified") && e.key || (e.shiftKey ? pc : fc)[e.keyCode] || e.key || "Unidentified";
	return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
//#endregion
//#region node_modules/prosemirror-keymap/dist/index.js
var yc = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), bc = typeof navigator < "u" && /Win/.test(navigator.platform);
function xc(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n == "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e++) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) yc ? o = !0 : i = !0;
		else throw Error("Unrecognized modifier name: " + n);
	}
	return r && (n = "Alt-" + n), i && (n = "Ctrl-" + n), o && (n = "Meta-" + n), a && (n = "Shift-" + n), n;
}
function Sc(e) {
	let t = Object.create(null);
	for (let n in e) t[xc(n)] = e[n];
	return t;
}
function Cc(e, t, n = !0) {
	return t.altKey && (e = "Alt-" + e), t.ctrlKey && (e = "Ctrl-" + e), t.metaKey && (e = "Meta-" + e), n && t.shiftKey && (e = "Shift-" + e), e;
}
function wc(e) {
	return new Qn({ props: { handleKeyDown: Tc(e) } });
}
function Tc(e) {
	let t = Sc(e);
	return function(e, n) {
		let r = vc(n), i, a = t[Cc(r, n)];
		if (a && a(e.state, e.dispatch, e)) return !0;
		if (r.length == 1 && r != " ") {
			if (n.shiftKey) {
				let i = t[Cc(r, n, !1)];
				if (i && i(e.state, e.dispatch, e)) return !0;
			}
			if ((n.altKey || n.metaKey || n.ctrlKey) && !(bc && n.ctrlKey && n.altKey) && (i = fc[n.keyCode]) && i != r) {
				let r = t[Cc(i, n)];
				if (r && r(e.state, e.dispatch, e)) return !0;
			}
		}
		return !1;
	};
}
//#endregion
//#region node_modules/@tiptap/core/dist/index.js
var R = /* @__PURE__ */ c(u(), 1), Ec = /* @__PURE__ */ c(m(), 1), Dc = g(), Oc = v(), z = b(), kc = Object.defineProperty, Ac = (e, t) => {
	for (var n in t) kc(e, n, {
		get: t[n],
		enumerable: !0
	});
};
function jc(e) {
	let { state: t, transaction: n } = e, { selection: r } = n, { doc: i } = n, { storedMarks: a } = n;
	return {
		...t,
		apply: t.apply.bind(t),
		applyTransaction: t.applyTransaction.bind(t),
		plugins: t.plugins,
		schema: t.schema,
		reconfigure: t.reconfigure.bind(t),
		toJSON: t.toJSON.bind(t),
		get storedMarks() {
			return a;
		},
		get selection() {
			return r;
		},
		get doc() {
			return i;
		},
		get tr() {
			return r = n.selection, i = n.doc, a = n.storedMarks, n;
		}
	};
}
var Mc = class {
	constructor(e) {
		this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
	}
	get hasCustomState() {
		return !!this.customState;
	}
	get state() {
		return this.customState || this.editor.state;
	}
	get commands() {
		let { rawCommands: e, editor: t, state: n } = this, { view: r } = t, { tr: i } = n, a = this.buildProps(i);
		return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, (...e) => {
			let n = t(...e)(a);
			return !i.getMeta("preventDispatch") && !this.hasCustomState && r.dispatch(i), n;
		}]));
	}
	get chain() {
		return () => this.createChain();
	}
	get can() {
		return () => this.createCan();
	}
	createChain(e, t = !0) {
		let { rawCommands: n, editor: r, state: i } = this, { view: a } = r, o = [], s = !!e, c = e || i.tr, l = () => (!s && t && !c.getMeta("preventDispatch") && !this.hasCustomState && a.dispatch(c), o.every((e) => e === !0)), u = {
			...Object.fromEntries(Object.entries(n).map(([e, n]) => [e, (...e) => {
				let r = this.buildProps(c, t), i = n(...e)(r);
				return o.push(i), u;
			}])),
			run: l
		};
		return u;
	}
	createCan(e) {
		let { rawCommands: t, state: n } = this, r = e || n.tr, i = this.buildProps(r, !1);
		return {
			...Object.fromEntries(Object.entries(t).map(([e, t]) => [e, (...e) => t(...e)({
				...i,
				dispatch: void 0
			})])),
			chain: () => this.createChain(r, !1)
		};
	}
	buildProps(e, t = !0) {
		let { rawCommands: n, editor: r, state: i } = this, { view: a } = r, o = {
			tr: e,
			editor: r,
			view: a,
			state: jc({
				state: i,
				transaction: e
			}),
			dispatch: t ? () => void 0 : void 0,
			chain: () => this.createChain(e, t),
			can: () => this.createCan(e),
			get commands() {
				return Object.fromEntries(Object.entries(n).map(([e, t]) => [e, (...e) => t(...e)(o)]));
			}
		};
		return o;
	}
}, Nc = {};
Ac(Nc, {
	blur: () => Pc,
	clearContent: () => Fc,
	clearNodes: () => Ic,
	command: () => Lc,
	createParagraphNear: () => Rc,
	cut: () => zc,
	deleteCurrentNode: () => Bc,
	deleteNode: () => Hc,
	deleteRange: () => Uc,
	deleteSelection: () => qc,
	enter: () => Jc,
	exitCode: () => Yc,
	extendMarkRange: () => nl,
	first: () => rl,
	focus: () => ul,
	forEach: () => dl,
	insertContent: () => fl,
	insertContentAt: () => _l,
	joinBackward: () => bl,
	joinDown: () => yl,
	joinForward: () => xl,
	joinItemBackward: () => Sl,
	joinItemForward: () => Cl,
	joinTextblockBackward: () => wl,
	joinTextblockForward: () => Tl,
	joinUp: () => vl,
	keyboardShortcut: () => Ol,
	lift: () => Al,
	liftEmptyBlock: () => jl,
	liftListItem: () => Ml,
	newlineInCode: () => Nl,
	resetAttributes: () => Il,
	scrollIntoView: () => Ll,
	selectAll: () => Rl,
	selectNodeBackward: () => zl,
	selectNodeForward: () => Bl,
	selectParentNode: () => Vl,
	selectTextblockEnd: () => Hl,
	selectTextblockStart: () => Ul,
	setContent: () => V,
	setMark: () => Fu,
	setMeta: () => Iu,
	setNode: () => Lu,
	setNodeSelection: () => Ru,
	setTextDirection: () => zu,
	setTextSelection: () => Bu,
	sinkListItem: () => Vu,
	splitBlock: () => Uu,
	splitListItem: () => Wu,
	toggleList: () => Yu,
	toggleMark: () => Xu,
	toggleNode: () => Zu,
	toggleWrap: () => Qu,
	undoInputRule: () => $u,
	unsetAllMarks: () => ed,
	unsetMark: () => td,
	unsetTextDirection: () => nd,
	updateAttributes: () => rd,
	wrapIn: () => id,
	wrapInList: () => ad
});
var Pc = () => ({ editor: e, view: t }) => (requestAnimationFrame(() => {
	var n;
	e.isDestroyed || (t.dom.blur(), (n = window == null ? void 0 : window.getSelection()) == null || n.removeAllRanges());
}), !0), Fc = (e = !0) => ({ commands: t }) => t.setContent("", { emitUpdate: e }), Ic = () => ({ state: e, tr: t, dispatch: n }) => {
	let { selection: r } = t, { ranges: i } = r;
	return n && i.forEach(({ $from: n, $to: r }) => {
		e.doc.nodesBetween(n.pos, r.pos, (e, n) => {
			if (e.type.isText) return;
			let { doc: r, mapping: i } = t, a = r.resolve(i.map(n)), o = r.resolve(i.map(n + e.nodeSize)), s = a.blockRange(o);
			if (!s) return;
			let c = Gt(s);
			if (e.type.isTextblock) {
				let { defaultType: e } = a.parent.contentMatchAt(a.index());
				t.setNodeMarkup(s.start, e);
			}
			(c || c === 0) && t.lift(s, c);
		});
	}), !0;
}, Lc = (e) => (t) => e(t), Rc = () => ({ state: e, dispatch: t }) => xr(e, t), zc = (e, t) => ({ editor: n, tr: r }) => {
	let { state: i } = n, a = i.doc.slice(e.from, e.to);
	r.deleteRange(e.from, e.to);
	let o = r.mapping.map(t);
	return r.insert(o, a.content), r.setSelection(new A(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, Bc = () => ({ tr: e, dispatch: t }) => {
	let { selection: n } = e, r = n.$anchor.node();
	if (r.content.size > 0) return !1;
	let i = e.selection.$anchor;
	for (let n = i.depth; n > 0; --n) if (i.node(n).type === r.type) {
		if (t) {
			let t = i.before(n), r = i.after(n);
			e.delete(t, r).scrollIntoView();
		}
		return !0;
	}
	return !1;
};
function Vc(e, t) {
	if (typeof e == "string") {
		if (!t.nodes[e]) throw Error(`There is no node type named '${e}'. Maybe you forgot to add the extension?`);
		return t.nodes[e];
	}
	return e;
}
var Hc = (e) => ({ tr: t, state: n, dispatch: r }) => {
	let i = Vc(e, n.schema), a = t.selection.$anchor;
	for (let e = a.depth; e > 0; --e) if (a.node(e).type === i) {
		if (r) {
			let n = a.before(e), r = a.after(e);
			t.delete(n, r).scrollIntoView();
		}
		return !0;
	}
	return !1;
}, Uc = (e) => ({ tr: t, dispatch: n }) => {
	let { from: r, to: i } = e;
	return n && t.delete(r, i), !0;
}, Wc = (e) => e.content ? /^text(\*|\+)/.test(e.content) : !1, Gc = (e, t, n) => {
	if (!e.parent.isInline || n === "left" && e.pos > e.start() || n === "right" && e.pos < e.end()) return e.pos;
	let r = t.nodes[e.parent.type.name].spec;
	return Wc(r) ? n === "left" ? e.start() - 1 : e.end() + 1 : e.pos;
}, Kc = (e, t, n) => ({
	from: Gc(e, n, "left"),
	to: Gc(t, n, "right")
}), qc = () => ({ state: e, dispatch: t }) => {
	let { $from: n, $to: r } = e.selection;
	if (e.selection.empty) return !1;
	let { from: i, to: a } = Kc(n, r, e.schema);
	return t && (e.tr.deleteRange(i, a).scrollIntoView(), t(e.tr)), !0;
}, Jc = () => ({ commands: e }) => e.keyboardShortcut("Enter"), Yc = () => ({ state: e, dispatch: t }) => br(e, t);
function Xc(e) {
	return Object.prototype.toString.call(e) === "[object RegExp]";
}
function Zc(e, t, n = { strict: !0 }) {
	let r = Object.keys(t);
	return r.length ? r.every((r) => n.strict ? t[r] === e[r] : Xc(t[r]) ? t[r].test(e[r]) : t[r] === e[r]) : !0;
}
function Qc(e, t, n = {}) {
	return e.find((e) => e.type === t && Zc(Object.fromEntries(Object.keys(n).map((t) => [t, e.attrs[t]])), n));
}
function $c(e, t, n = {}) {
	return !!Qc(e, t, n);
}
function el(e, t, n) {
	if (!e || !t) return;
	let r = e.parent.childAfter(e.parentOffset);
	if ((!r.node || !r.node.marks.some((e) => e.type === t)) && (r = e.parent.childBefore(e.parentOffset)), !r.node || !r.node.marks.some((e) => e.type === t)) return;
	if (!n) {
		let e = r.node.marks.find((e) => e.type === t);
		e && (n = e.attrs);
	}
	if (!Qc([...r.node.marks], t, n)) return;
	let i = r.index, a = e.start() + r.offset, o = i + 1, s = a + r.node.nodeSize;
	for (; i > 0 && $c([...e.parent.child(i - 1).marks], t, n);) --i, a -= e.parent.child(i).nodeSize;
	for (; o < e.parent.childCount && $c([...e.parent.child(o).marks], t, n);) s += e.parent.child(o).nodeSize, o += 1;
	return {
		from: a,
		to: s
	};
}
function tl(e, t) {
	if (typeof e == "string") {
		if (!t.marks[e]) throw Error(`There is no mark type named '${e}'. Maybe you forgot to add the extension?`);
		return t.marks[e];
	}
	return e;
}
var nl = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let a = tl(e, r.schema), { doc: o, selection: s } = n, { $from: c, from: l, to: u } = s;
	if (i) {
		let e = el(c, a, t);
		if (e && e.from <= l && e.to >= u) {
			let t = A.create(o, e.from, e.to);
			n.setSelection(t);
		}
	}
	return !0;
}, rl = (e) => (t) => {
	let n = typeof e == "function" ? e(t) : e;
	for (let e = 0; e < n.length; e += 1) if (n[e](t)) return !0;
	return !1;
};
function il(e) {
	return e instanceof A;
}
function al(e = 0, t = 0, n = 0) {
	return Math.min(Math.max(e, t), n);
}
function ol(e, t = null) {
	if (!t) return null;
	let n = k.atStart(e), r = k.atEnd(e);
	if (t === "start" || t === !0) return n;
	if (t === "end") return r;
	let i = n.from, a = r.to;
	return t === "all" ? A.create(e, al(0, i, a), al(e.content.size, i, a)) : A.create(e, al(t, i, a), al(t, i, a));
}
function sl() {
	return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function cl() {
	return [
		"iPad Simulator",
		"iPhone Simulator",
		"iPod Simulator",
		"iPad",
		"iPhone",
		"iPod"
	].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function ll() {
	return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
var ul = (e = null, t = {}) => ({ editor: n, view: r, tr: i, dispatch: a }) => {
	t = {
		scrollIntoView: !0,
		...t
	};
	let o = () => {
		(cl() || sl()) && r.dom.focus(), ll() && !cl() && !sl() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
			n.isDestroyed || (r.focus(), t?.scrollIntoView && n.commands.scrollIntoView());
		});
	};
	try {
		if (r.hasFocus() && e === null || e === !1) return !0;
	} catch {
		return !1;
	}
	if (a && e === null && !il(n.state.selection)) return o(), !0;
	let s = ol(i.doc, e) || n.state.selection, c = n.state.selection.eq(s);
	return a && (c || i.setSelection(s), c && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, dl = (e, t) => (n) => e.every((e, r) => t(e, {
	...n,
	index: r
})), fl = (e, t) => ({ tr: n, commands: r }) => r.insertContentAt({
	from: n.selection.from,
	to: n.selection.to
}, e, t), pl = (e) => {
	let t = e.childNodes;
	for (let n = t.length - 1; n >= 0; --n) {
		let r = t[n];
		r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? e.removeChild(r) : r.nodeType === 1 && pl(r);
	}
	return e;
};
function B(e) {
	if (typeof window > "u") throw Error("[tiptap error]: there is no window object available, so this function cannot be used");
	let t = `<body>${e}</body>`, n = new window.DOMParser().parseFromString(t, "text/html").body;
	return pl(n);
}
function ml(e, t, n) {
	if (e instanceof Se || e instanceof C) return e;
	n = {
		slice: !0,
		parseOptions: {},
		...n
	};
	let r = typeof e == "object" && !!e, i = typeof e == "string";
	if (r) try {
		if (Array.isArray(e) && e.length > 0) return C.fromArray(e.map((e) => t.nodeFromJSON(e)));
		let r = t.nodeFromJSON(e);
		return n.errorOnInvalidContent && r.check(), r;
	} catch (r) {
		if (n.errorOnInvalidContent) throw Error("[tiptap error]: Invalid JSON content", { cause: r });
		return console.warn("[tiptap warn]: Invalid content.", "Passed value:", e, "Error:", r), ml("", t, n);
	}
	if (i) {
		if (n.errorOnInvalidContent) {
			let r = !1, i = "", a = new qe({
				topNode: t.spec.topNode,
				marks: t.spec.marks,
				nodes: t.spec.nodes.append({ __tiptap__private__unknown__catch__all__node: {
					content: "inline*",
					group: "block",
					parseDOM: [{
						tag: "*",
						getAttrs: (e) => (r = !0, i = typeof e == "string" ? e : e.outerHTML, null)
					}]
				} })
			});
			if (n.slice ? Ze.fromSchema(a).parseSlice(B(e), n.parseOptions) : Ze.fromSchema(a).parse(B(e), n.parseOptions), n.errorOnInvalidContent && r) throw Error("[tiptap error]: Invalid HTML content", { cause: /* @__PURE__ */ Error(`Invalid element found: ${i}`) });
		}
		let r = Ze.fromSchema(t);
		return n.slice ? r.parseSlice(B(e), n.parseOptions).content : r.parse(B(e), n.parseOptions);
	}
	return ml("", t, n);
}
function hl(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof Rt || i instanceof zt)) return;
	let a = e.mapping.maps[r], o = 0;
	a.forEach((e, t, n, r) => {
		o === 0 && (o = r);
	}), e.setSelection(k.near(e.doc.resolve(o), n));
}
var gl = (e) => !("type" in e), _l = (e, t, n) => ({ tr: r, dispatch: i, editor: a }) => {
	if (i) {
		n = {
			parseOptions: a.options.parseOptions,
			updateSelection: !0,
			applyInputRules: !1,
			applyPasteRules: !1,
			...n
		};
		let i, o = (e) => {
			a.emit("contentError", {
				editor: a,
				error: e,
				disableCollaboration: () => {
					"collaboration" in a.storage && typeof a.storage.collaboration == "object" && a.storage.collaboration && (a.storage.collaboration.isDisabled = !0);
				}
			});
		}, s = {
			preserveWhitespace: "full",
			...n.parseOptions
		};
		if (!n.errorOnInvalidContent && !a.options.enableContentCheck && a.options.emitContentError) try {
			ml(t, a.schema, {
				parseOptions: s,
				errorOnInvalidContent: !0
			});
		} catch (e) {
			o(e);
		}
		try {
			i = ml(t, a.schema, {
				parseOptions: s,
				errorOnInvalidContent: n.errorOnInvalidContent ?? a.options.enableContentCheck
			});
		} catch (e) {
			return o(e), !1;
		}
		let { from: c, to: l } = typeof e == "number" ? {
			from: e,
			to: e
		} : {
			from: e.from,
			to: e.to
		}, u = !0, d = !0;
		if ((gl(i) ? i : [i]).forEach((e) => {
			e.check(), u = u ? e.isText && e.marks.length === 0 : !1, d = d ? e.isBlock : !1;
		}), c === l && d) {
			let { parent: e } = r.doc.resolve(c);
			e.isTextblock && !e.type.spec.code && !e.childCount && (--c, l += 1);
		}
		let f;
		if (u) {
			if (Array.isArray(t)) f = t.map((e) => e.text || "").join("");
			else if (t instanceof C) {
				let e = "";
				t.forEach((t) => {
					t.text && (e += t.text);
				}), f = e;
			} else f = typeof t == "object" && t && t.text ? t.text : t;
			r.insertText(f, c, l);
		} else {
			f = i;
			let e = r.doc.resolve(c), t = e.node(), n = e.parentOffset === 0, a = t.isText || t.isTextblock, o = t.content.size > 0;
			n && a && o && d && (c = Math.max(0, c - 1)), r.replaceWith(c, l, f);
		}
		n.updateSelection && hl(r, r.steps.length - 1, -1), n.applyInputRules && r.setMeta("applyInputRules", {
			from: c,
			text: f
		}), n.applyPasteRules && r.setMeta("applyPasteRules", {
			from: c,
			text: f
		});
	}
	return !0;
}, vl = () => ({ state: e, dispatch: t }) => hr(e, t), yl = () => ({ state: e, dispatch: t }) => gr(e, t), bl = () => ({ state: e, dispatch: t }) => ir(e, t), xl = () => ({ state: e, dispatch: t }) => fr(e, t), Sl = () => ({ state: e, dispatch: t, tr: n }) => {
	try {
		let r = ln(e.doc, e.selection.$from.pos, -1);
		return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
	} catch {
		return !1;
	}
}, Cl = () => ({ state: e, dispatch: t, tr: n }) => {
	try {
		let r = ln(e.doc, e.selection.$from.pos, 1);
		return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
	} catch {
		return !1;
	}
}, wl = () => ({ state: e, dispatch: t }) => ar(e, t), Tl = () => ({ state: e, dispatch: t }) => or(e, t);
function El() {
	return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Dl(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n === "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e += 1) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) cl() || El() ? o = !0 : i = !0;
		else throw Error(`Unrecognized modifier name: ${n}`);
	}
	return r && (n = `Alt-${n}`), i && (n = `Ctrl-${n}`), o && (n = `Meta-${n}`), a && (n = `Shift-${n}`), n;
}
var Ol = (e) => ({ editor: t, view: n, tr: r, dispatch: i }) => {
	let a = Dl(e).split(/-(?!$)/), o = a.find((e) => ![
		"Alt",
		"Ctrl",
		"Meta",
		"Shift"
	].includes(e)), s = new KeyboardEvent("keydown", {
		key: o === "Space" ? " " : o,
		altKey: a.includes("Alt"),
		ctrlKey: a.includes("Ctrl"),
		metaKey: a.includes("Meta"),
		shiftKey: a.includes("Shift"),
		bubbles: !0,
		cancelable: !0
	});
	return t.captureTransaction(() => {
		n.someProp("handleKeyDown", (e) => e(n, s));
	})?.steps.forEach((e) => {
		let t = e.map(r.mapping);
		t && i && r.maybeStep(t);
	}), !0;
};
function kl(e, t, n = {}) {
	let { from: r, to: i, empty: a } = e.selection, o = t ? Vc(t, e.schema) : null, s = [];
	e.doc.nodesBetween(r, i, (e, t) => {
		if (e.isText) return;
		let n = Math.max(r, t), a = Math.min(i, t + e.nodeSize);
		s.push({
			node: e,
			from: n,
			to: a
		});
	});
	let c = i - r, l = s.filter((e) => o ? o.name === e.node.type.name : !0).filter((e) => Zc(e.node.attrs, n, { strict: !1 }));
	return a ? !!l.length : l.reduce((e, t) => e + t.to - t.from, 0) >= c;
}
var Al = (e, t = {}) => ({ state: n, dispatch: r }) => kl(n, Vc(e, n.schema), t) ? _r(n, r) : !1, jl = () => ({ state: e, dispatch: t }) => Sr(e, t), Ml = (e) => ({ state: t, dispatch: n }) => Hr(Vc(e, t.schema))(t, n), Nl = () => ({ state: e, dispatch: t }) => vr(e, t);
function Pl(e, t) {
	return t.nodes[e] ? "node" : t.marks[e] ? "mark" : null;
}
function Fl(e, t) {
	let n = typeof t == "string" ? [t] : t;
	return Object.keys(e).reduce((t, r) => (n.includes(r) || (t[r] = e[r]), t), {});
}
var Il = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let a = null, o = null, s = Pl(typeof e == "string" ? e : e.name, r.schema);
	if (!s) return !1;
	s === "node" && (a = Vc(e, r.schema)), s === "mark" && (o = tl(e, r.schema));
	let c = !1;
	return n.selection.ranges.forEach((e) => {
		r.doc.nodesBetween(e.$from.pos, e.$to.pos, (e, r) => {
			a && a === e.type && (c = !0, i && n.setNodeMarkup(r, void 0, Fl(e.attrs, t))), o && e.marks.length && e.marks.forEach((a) => {
				o === a.type && (c = !0, i && n.addMark(r, r + e.nodeSize, o.create(Fl(a.attrs, t))));
			});
		});
	}), c;
}, Ll = () => ({ tr: e, dispatch: t }) => (t && e.scrollIntoView(), !0), Rl = () => ({ tr: e, dispatch: t }) => {
	if (t) {
		let t = new Rn(e.doc);
		e.setSelection(t);
	}
	return !0;
}, zl = () => ({ state: e, dispatch: t }) => lr(e, t), Bl = () => ({ state: e, dispatch: t }) => pr(e, t), Vl = () => ({ state: e, dispatch: t }) => Tr(e, t), Hl = () => ({ state: e, dispatch: t }) => jr(e, t), Ul = () => ({ state: e, dispatch: t }) => Ar(e, t);
function Wl(e, t, n = {}, r = {}) {
	return ml(e, t, {
		slice: !1,
		parseOptions: n,
		errorOnInvalidContent: r.errorOnInvalidContent
	});
}
var V = (e, { errorOnInvalidContent: t, emitUpdate: n = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: a, dispatch: o, commands: s }) => {
	let { doc: c } = a;
	if (r.preserveWhitespace !== "full") {
		let s = Wl(e, i.schema, r, { errorOnInvalidContent: t ?? i.options.enableContentCheck });
		return o && a.replaceWith(0, c.content.size, s).setMeta("preventUpdate", !n), !0;
	}
	return o && a.setMeta("preventUpdate", !n), s.insertContentAt({
		from: 0,
		to: c.content.size
	}, e, {
		parseOptions: r,
		errorOnInvalidContent: t ?? i.options.enableContentCheck
	});
};
function H(e, t) {
	let n = tl(t, e.schema), { from: r, to: i, empty: a } = e.selection, o = [];
	a ? (e.storedMarks && o.push(...e.storedMarks), o.push(...e.selection.$head.marks())) : e.doc.nodesBetween(r, i, (e) => {
		o.push(...e.marks);
	});
	let s = o.find((e) => e.type.name === n.name);
	return s ? { ...s.attrs } : {};
}
function U(e, t) {
	let n = new jn(e);
	return t.forEach((e) => {
		e.steps.forEach((e) => {
			n.step(e);
		});
	}), n;
}
function W(e) {
	for (let t = 0; t < e.edgeCount; t += 1) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
function G(e, t, n) {
	let r = [];
	return e.nodesBetween(t.from, t.to, (e, t) => {
		n(e) && r.push({
			node: e,
			pos: t
		});
	}), r;
}
function Gl(e, t) {
	for (let n = e.depth; n > 0; --n) {
		let r = e.node(n);
		if (t(r)) return {
			pos: n > 0 ? e.before(n) : 0,
			start: e.start(n),
			depth: n,
			node: r
		};
	}
}
function Kl(e) {
	return (t) => Gl(t.$from, e);
}
function K(e, t, n) {
	return e.config[t] === void 0 && e.parent ? K(e.parent, t, n) : typeof e.config[t] == "function" ? e.config[t].bind({
		...n,
		parent: e.parent ? K(e.parent, t, n) : null
	}) : e.config[t];
}
function ql(e) {
	return e.map((e) => {
		let t = K(e, "addExtensions", {
			name: e.name,
			options: e.options,
			storage: e.storage
		});
		return t ? [e, ...ql(t())] : e;
	}).flat(10);
}
function Jl(e, t) {
	let n = dt.fromSchema(t).serializeFragment(e), r = document.implementation.createHTMLDocument().createElement("div");
	return r.appendChild(n), r.innerHTML;
}
function Yl(e) {
	return typeof e == "function";
}
function q(e, t = void 0, ...n) {
	return Yl(e) ? t ? e.bind(t)(...n) : e(...n) : e;
}
function Xl(e = {}) {
	return Object.keys(e).length === 0 && e.constructor === Object;
}
function Zl(e) {
	return {
		baseExtensions: e.filter((e) => e.type === "extension"),
		nodeExtensions: e.filter((e) => e.type === "node"),
		markExtensions: e.filter((e) => e.type === "mark")
	};
}
function Ql(e) {
	let t = [], { nodeExtensions: n, markExtensions: r } = Zl(e), i = [...n, ...r], a = {
		default: null,
		validate: void 0,
		rendered: !0,
		renderHTML: null,
		parseHTML: null,
		keepOnSplit: !0,
		isRequired: !1
	}, o = n.filter((e) => e.name !== "text").map((e) => e.name), s = r.map((e) => e.name), c = [...o, ...s];
	return e.forEach((e) => {
		let n = K(e, "addGlobalAttributes", {
			name: e.name,
			options: e.options,
			storage: e.storage,
			extensions: i
		});
		n && n().forEach((e) => {
			let n;
			n = Array.isArray(e.types) ? e.types : e.types === "*" ? c : e.types === "nodes" ? o : e.types === "marks" ? s : [], n.forEach((n) => {
				Object.entries(e.attributes).forEach(([e, r]) => {
					t.push({
						type: n,
						name: e,
						attribute: {
							...a,
							...r
						}
					});
				});
			});
		});
	}), i.forEach((e) => {
		let n = K(e, "addAttributes", {
			name: e.name,
			options: e.options,
			storage: e.storage
		});
		if (!n) return;
		let r = n();
		Object.entries(r).forEach(([n, r]) => {
			let i = {
				...a,
				...r
			};
			typeof i?.default == "function" && (i.default = i.default()), i?.isRequired && i?.default === void 0 && delete i.default, t.push({
				type: e.name,
				name: n,
				attribute: i
			});
		});
	}), t;
}
function $l(e) {
	let t = [], n = "", r = !1, i = !1, a = 0, o = e.length;
	for (let s = 0; s < o; s += 1) {
		let o = e[s];
		if (o === "'" && !i) {
			r = !r, n += o;
			continue;
		}
		if (o === "\"" && !r) {
			i = !i, n += o;
			continue;
		}
		if (!r && !i) {
			if (o === "(") {
				a += 1, n += o;
				continue;
			}
			if (o === ")" && a > 0) {
				--a, n += o;
				continue;
			}
			if (o === ";" && a === 0) {
				t.push(n), n = "";
				continue;
			}
		}
		n += o;
	}
	return n && t.push(n), t;
}
function eu(e) {
	let t = [], n = $l(e || ""), r = n.length;
	for (let e = 0; e < r; e += 1) {
		let r = n[e], i = r.indexOf(":");
		if (i === -1) continue;
		let a = r.slice(0, i).trim(), o = r.slice(i + 1).trim();
		a && o && t.push([a, o]);
	}
	return t;
}
function J(...e) {
	return e.filter((e) => !!e).reduce((e, t) => {
		let n = { ...e };
		return Object.entries(t).forEach(([e, t]) => {
			if (!n[e]) {
				n[e] = t;
				return;
			}
			if (e === "class") {
				let r = t ? String(t).split(" ") : [], i = n[e] ? n[e].split(" ") : [], a = r.filter((e) => !i.includes(e));
				n[e] = [...i, ...a].join(" ");
			} else if (e === "style") {
				let r = new Map([...eu(n[e]), ...eu(t)]);
				n[e] = Array.from(r.entries()).map(([e, t]) => `${e}: ${t}`).join("; ");
			} else n[e] = t;
		}), n;
	}, {});
}
function tu(e, t) {
	return t.filter((t) => t.type === e.type.name).filter((e) => e.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(e.attrs) || {} : { [t.name]: e.attrs[t.name] }).reduce((e, t) => J(e, t), {});
}
function nu(e) {
	return typeof e == "string" ? e.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(e) : e === "true" ? !0 : e === "false" ? !1 : e : e;
}
function ru(e, t) {
	return "style" in e ? e : {
		...e,
		getAttrs: (n) => {
			let r = e.getAttrs ? e.getAttrs(n) : e.attrs;
			if (r === !1) return !1;
			let i = t.reduce((e, t) => {
				let r = t.attribute.parseHTML ? t.attribute.parseHTML(n) : nu(n.getAttribute(t.name));
				return r == null ? e : {
					...e,
					[t.name]: r
				};
			}, {});
			return {
				...r,
				...i
			};
		}
	};
}
function iu(e) {
	return Object.fromEntries(Object.entries(e).filter(([e, t]) => e === "attrs" && Xl(t) ? !1 : t != null));
}
function au(e) {
	let t = {};
	return !e?.attribute?.isRequired && "default" in (e?.attribute || {}) && (t.default = e.attribute.default), e?.attribute?.validate !== void 0 && (t.validate = e.attribute.validate), [e.name, t];
}
function ou(e, t) {
	let n = Ql(e), { nodeExtensions: r, markExtensions: i } = Zl(e);
	return new qe({
		topNode: r.find((e) => K(e, "topNode"))?.name,
		nodes: Object.fromEntries(r.map((r) => {
			let i = n.filter((e) => e.type === r.name), a = {
				name: r.name,
				options: r.options,
				storage: r.storage,
				editor: t
			}, o = iu({
				...e.reduce((e, t) => {
					let n = K(t, "extendNodeSchema", a);
					return {
						...e,
						...n ? n(r) : {}
					};
				}, {}),
				content: q(K(r, "content", a)),
				marks: q(K(r, "marks", a)),
				group: q(K(r, "group", a)),
				inline: q(K(r, "inline", a)),
				atom: q(K(r, "atom", a)),
				selectable: q(K(r, "selectable", a)),
				draggable: q(K(r, "draggable", a)),
				code: q(K(r, "code", a)),
				whitespace: q(K(r, "whitespace", a)),
				linebreakReplacement: q(K(r, "linebreakReplacement", a)),
				defining: q(K(r, "defining", a)),
				isolating: q(K(r, "isolating", a)),
				attrs: Object.fromEntries(i.map(au))
			}), s = q(K(r, "parseHTML", a));
			s && (o.parseDOM = s.map((e) => ru(e, i)));
			let c = K(r, "renderHTML", a);
			c && (o.toDOM = (e) => c({
				node: e,
				HTMLAttributes: tu(e, i)
			}));
			let l = K(r, "renderText", a);
			return l && (o.toText = l), [r.name, o];
		})),
		marks: Object.fromEntries(i.map((r) => {
			let i = n.filter((e) => e.type === r.name), a = {
				name: r.name,
				options: r.options,
				storage: r.storage,
				editor: t
			}, o = iu({
				...e.reduce((e, t) => {
					let n = K(t, "extendMarkSchema", a);
					return {
						...e,
						...n ? n(r) : {}
					};
				}, {}),
				inclusive: q(K(r, "inclusive", a)),
				excludes: q(K(r, "excludes", a)),
				group: q(K(r, "group", a)),
				spanning: q(K(r, "spanning", a)),
				code: q(K(r, "code", a)),
				attrs: Object.fromEntries(i.map(au))
			}), s = q(K(r, "parseHTML", a));
			s && (o.parseDOM = s.map((e) => ru(e, i)));
			let c = K(r, "renderHTML", a);
			return c && (o.toDOM = (e) => c({
				mark: e,
				HTMLAttributes: tu(e, i)
			})), [r.name, o];
		}))
	});
}
function su(e) {
	let t = e.filter((t, n) => e.indexOf(t) !== n);
	return Array.from(new Set(t));
}
function cu(e) {
	return e.sort((e, t) => {
		let n = K(e, "priority") || 100, r = K(t, "priority") || 100;
		return n > r ? -1 : +(n < r);
	});
}
function lu(e) {
	let t = cu(ql(e)), n = su(t.map((e) => e.name));
	return n.length && console.warn(`[tiptap warn]: Duplicate extension names found: [${n.map((e) => `'${e}'`).join(", ")}]. This can lead to issues.`), t;
}
function uu(e, t, n) {
	let { from: r, to: i } = t, { blockSeparator: a = "\n\n", textSerializers: o = {} } = n || {}, s = "";
	return e.nodesBetween(r, i, (e, n, c, l) => {
		e.isBlock && n > r && (s += a);
		let u = o?.[e.type.name];
		if (u) return c && (s += u({
			node: e,
			pos: n,
			parent: c,
			index: l,
			range: t
		})), !1;
		e.isText && (s += (e?.text)?.slice(Math.max(r, n) - n, i - n));
	}), s;
}
function du(e, t) {
	return uu(e, {
		from: 0,
		to: e.content.size
	}, t);
}
function fu(e) {
	return Object.fromEntries(Object.entries(e.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
function pu(e, t) {
	let n = Vc(t, e.schema), { from: r, to: i } = e.selection, a = [];
	e.doc.nodesBetween(r, i, (e) => {
		a.push(e);
	});
	let o = a.reverse().find((e) => e.type.name === n.name);
	return o ? { ...o.attrs } : {};
}
function mu(e, t) {
	let n = Pl(typeof t == "string" ? t : t.name, e.schema);
	return n === "node" ? pu(e, t) : n === "mark" ? H(e, t) : {};
}
function hu(e, t = JSON.stringify) {
	let n = {};
	return e.filter((e) => {
		let r = t(e);
		return Object.prototype.hasOwnProperty.call(n, r) ? !1 : n[r] = !0;
	});
}
function gu(e) {
	let t = hu(e);
	return t.length === 1 ? t : t.filter((e, n) => !t.filter((e, t) => t !== n).some((t) => e.oldRange.from >= t.oldRange.from && e.oldRange.to <= t.oldRange.to && e.newRange.from >= t.newRange.from && e.newRange.to <= t.newRange.to));
}
function _u(e) {
	let { mapping: t, steps: n } = e, r = [];
	return t.maps.forEach((e, i) => {
		let a = [];
		if (e.ranges.length) e.forEach((e, t) => {
			a.push({
				from: e,
				to: t
			});
		});
		else {
			let { from: e, to: t } = n[i];
			if (e === void 0 || t === void 0) return;
			a.push({
				from: e,
				to: t
			});
		}
		a.forEach(({ from: e, to: n }) => {
			let a = t.slice(i).map(e, -1), o = t.slice(i).map(n), s = t.invert().map(a, -1), c = t.invert().map(o);
			r.push({
				oldRange: {
					from: s,
					to: c
				},
				newRange: {
					from: a,
					to: o
				}
			});
		});
	}), gu(r);
}
function vu(e, t, n) {
	let r = [];
	return e === t ? n.resolve(e).marks().forEach((t) => {
		let i = el(n.resolve(e), t.type);
		i && r.push({
			mark: t,
			...i
		});
	}) : n.nodesBetween(e, t, (e, t) => {
		!e || e?.nodeSize === void 0 || r.push(...e.marks.map((n) => ({
			from: t,
			to: t + e.nodeSize,
			mark: n
		})));
	}), r;
}
var yu = (e, t, n, r = 20) => {
	let i = e.doc.resolve(n), a = r, o = null;
	for (; a > 0 && o === null;) {
		let e = i.node(a);
		e?.type.name === t ? o = e : --a;
	}
	return [o, a];
};
function bu(e, t) {
	return t.nodes[e] || t.marks[e] || null;
}
function xu(e, t, n) {
	return Object.fromEntries(Object.entries(n).filter(([n]) => {
		let r = e.find((e) => e.type === t && e.name === n);
		return r ? r.attribute.keepOnSplit : !1;
	}));
}
var Su = (e, t = 500) => {
	let n = "", r = e.parentOffset;
	return e.parent.nodesBetween(Math.max(0, r - t), r, (e, t, i, a) => {
		var o;
		let s = (o = e.type.spec).toText?.call(o, {
			node: e,
			pos: t,
			parent: i,
			index: a
		}) || e.textContent || "%leaf%";
		n += e.isAtom && !e.isText ? s : s.slice(0, Math.max(0, r - t));
	}), n;
};
function Cu(e, t, n = {}) {
	let { empty: r, ranges: i } = e.selection, a = t ? tl(t, e.schema) : null;
	if (r) return !!(e.storedMarks || e.selection.$from.marks()).filter((e) => a ? a.name === e.type.name : !0).find((e) => Zc(e.attrs, n, { strict: !1 }));
	let o = 0, s = [];
	if (i.forEach(({ $from: t, $to: n }) => {
		let r = t.pos, i = n.pos;
		e.doc.nodesBetween(r, i, (e, t) => {
			if (a && e.inlineContent && !e.type.allowsMarkType(a)) return !1;
			if (!e.isText && !e.marks.length) return;
			let n = Math.max(r, t), c = Math.min(i, t + e.nodeSize), l = c - n;
			o += l, s.push(...e.marks.map((e) => ({
				mark: e,
				from: n,
				to: c
			})));
		});
	}), o === 0) return !1;
	let c = s.filter((e) => a ? a.name === e.mark.type.name : !0).filter((e) => Zc(e.mark.attrs, n, { strict: !1 })).reduce((e, t) => e + t.to - t.from, 0), l = s.filter((e) => a ? e.mark.type !== a && e.mark.type.excludes(a) : !0).reduce((e, t) => e + t.to - t.from, 0);
	return (c > 0 ? c + l : c) >= o;
}
function wu(e, t, n = {}) {
	if (!t) return kl(e, null, n) || Cu(e, null, n);
	let r = Pl(t, e.schema);
	return r === "node" ? kl(e, t, n) : r === "mark" ? Cu(e, t, n) : !1;
}
var Tu = (e, t) => {
	let { $from: n, $to: r, $anchor: i } = e.selection;
	if (t) {
		let n = Kl((e) => e.type.name === t)(e.selection);
		if (!n) return !1;
		let r = e.doc.resolve(n.pos + 1);
		return i.pos + 1 === r.end();
	}
	return !(r.parentOffset < r.parent.nodeSize - 2 || n.pos !== r.pos);
}, Eu = (e) => {
	let { $from: t, $to: n } = e.selection;
	return !(t.parentOffset > 0 || t.pos !== n.pos);
};
function Du(e, t) {
	return Array.isArray(t) ? t.some((t) => (typeof t == "string" ? t : t.name) === e.name) : t;
}
function Ou(e, t) {
	let { nodeExtensions: n } = Zl(t), r = n.find((t) => t.name === e);
	if (!r) return !1;
	let i = q(K(r, "group", {
		name: r.name,
		options: r.options,
		storage: r.storage
	}));
	return typeof i == "string" ? i.split(" ").includes("list") : !1;
}
function ku(e, { checkChildren: t = !0, ignoreWhitespace: n = !1 } = {}) {
	if (n) {
		if (e.type.name === "hardBreak") return !0;
		if (e.isText) return !/\S/.test(e.text ?? "");
	}
	if (e.isText) return !e.text;
	if (e.isAtom || e.isLeaf) return !1;
	if (e.content.childCount === 0) return !0;
	if (t) {
		let r = !0;
		return e.content.forEach((e) => {
			r !== !1 && (ku(e, {
				ignoreWhitespace: n,
				checkChildren: t
			}) || (r = !1));
		}), r;
	}
	return !1;
}
function Au(e) {
	return e instanceof j;
}
var ju = class e {
	constructor(e) {
		this.position = e;
	}
	static fromJSON(t) {
		return new e(t.position);
	}
	toJSON() {
		return { position: this.position };
	}
};
function Mu(e, t) {
	let n = t.mapping.mapResult(e.position);
	return {
		position: new ju(n.pos),
		mapResult: n
	};
}
function Nu(e) {
	return new ju(e);
}
function Pu(e, t, n) {
	let { selection: r } = t, i = null;
	if (il(r) && (i = r.$cursor), i) {
		let t = e.storedMarks ?? i.marks();
		return i.parent.type.allowsMarkType(n) && (!!n.isInSet(t) || !t.some((e) => e.type.excludes(n)));
	}
	let { ranges: a } = r;
	return a.some(({ $from: t, $to: r }) => {
		let i = t.depth === 0 ? e.doc.inlineContent && e.doc.type.allowsMarkType(n) : !1;
		return e.doc.nodesBetween(t.pos, r.pos, (e, t, r) => {
			if (i) return !1;
			if (e.isInline) {
				let t = !r || r.type.allowsMarkType(n), a = !!n.isInSet(e.marks) || !e.marks.some((e) => e.type.excludes(n));
				i = t && a;
			}
			return !i;
		}), i;
	});
}
var Fu = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let { selection: a } = n, { empty: o, ranges: s } = a, c = tl(e, r.schema);
	if (i) if (o) {
		let e = H(r, c);
		n.addStoredMark(c.create({
			...e,
			...t
		}));
	} else s.forEach((e) => {
		let i = e.$from.pos, a = e.$to.pos;
		r.doc.nodesBetween(i, a, (e, r) => {
			let o = Math.max(r, i), s = Math.min(r + e.nodeSize, a);
			e.marks.find((e) => e.type === c) ? e.marks.forEach((e) => {
				c === e.type && n.addMark(o, s, c.create({
					...e.attrs,
					...t
				}));
			}) : n.addMark(o, s, c.create(t));
		});
	});
	return Pu(r, n, c);
}, Iu = (e, t) => ({ tr: n }) => (n.setMeta(e, t), !0), Lu = (e, t = {}) => ({ state: n, dispatch: r, chain: i }) => {
	let a = Vc(e, n.schema), o;
	return n.selection.$anchor.sameParent(n.selection.$head) && (o = n.selection.$anchor.parent.attrs), a.isTextblock ? i().command(({ commands: e }) => Nr(a, {
		...o,
		...t
	})(n) ? !0 : e.clearNodes()).command(({ state: e }) => Nr(a, {
		...o,
		...t
	})(e, r)).run() : (console.warn("[tiptap warn]: Currently \"setNode()\" only supports text block nodes."), !1);
}, Ru = (e) => ({ tr: t, dispatch: n }) => {
	if (n) {
		let { doc: n } = t, r = al(e, 0, n.content.size), i = j.create(n, r);
		t.setSelection(i);
	}
	return !0;
}, zu = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let { selection: a } = r, o, s;
	return typeof t == "number" ? (o = t, s = t) : t && "from" in t && "to" in t ? (o = t.from, s = t.to) : (o = a.from, s = a.to), i && n.doc.nodesBetween(o, s, (t, r) => {
		t.isText || n.setNodeMarkup(r, void 0, {
			...t.attrs,
			dir: e
		});
	}), !0;
}, Bu = (e) => ({ tr: t, dispatch: n }) => {
	if (n) {
		let { doc: n } = t, { from: r, to: i } = typeof e == "number" ? {
			from: e,
			to: e
		} : e, a = A.atStart(n).from, o = A.atEnd(n).to, s = al(r, a, o), c = al(i, a, o), l = A.create(n, s, c);
		t.setSelection(l);
	}
	return !0;
}, Vu = (e) => ({ state: t, dispatch: n }) => Gr(Vc(e, t.schema))(t, n);
function Hu(e, t) {
	let n = e.storedMarks || e.selection.$to.parentOffset && e.selection.$from.marks();
	if (n) {
		let r = n.filter((e) => t?.includes(e.type.name));
		e.tr.ensureMarks(r);
	}
}
var Uu = ({ keepMarks: e = !0 } = {}) => ({ tr: t, state: n, dispatch: r, editor: i }) => {
	let { selection: a, doc: o } = t, { $from: s, $to: c } = a, l = i.extensionManager.attributes, u = xu(l, s.node().type.name, s.node().attrs);
	if (a instanceof j && a.node.isBlock) return !s.parentOffset || !rn(o, s.pos) ? !1 : (r && (e && Hu(n, i.extensionManager.splittableMarks), t.split(s.pos).scrollIntoView()), !0);
	if (!s.parent.isBlock) return !1;
	let d = c.parentOffset === c.parent.content.size, f = s.depth === 0 ? void 0 : W(s.node(-1).contentMatchAt(s.indexAfter(-1))), p = d && f ? [{
		type: f,
		attrs: u
	}] : void 0, m = rn(t.doc, t.mapping.map(s.pos), 1, p);
	if (!p && !m && rn(t.doc, t.mapping.map(s.pos), 1, f ? [{ type: f }] : void 0) && (m = !0, p = f ? [{
		type: f,
		attrs: u
	}] : void 0), r) {
		if (m && (a instanceof A && t.deleteSelection(), t.split(t.mapping.map(s.pos), 1, p), f && !d && !s.parentOffset && s.parent.type !== f)) {
			let e = t.mapping.map(s.before()), n = t.doc.resolve(e);
			s.node(-1).canReplaceWith(n.index(), n.index() + 1, f) && t.setNodeMarkup(t.mapping.map(s.before()), f);
		}
		e && Hu(n, i.extensionManager.splittableMarks), t.scrollIntoView();
	}
	return m;
}, Wu = (e, t = {}) => ({ tr: n, state: r, dispatch: i, editor: a }) => {
	let o = Vc(e, r.schema), { $from: s, $to: c } = r.selection, l = r.selection.node;
	if (l && l.isBlock || s.depth < 2 || !s.sameParent(c)) return !1;
	let u = s.node(-1);
	if (u.type !== o) return !1;
	let d = a.extensionManager.attributes;
	if (s.parent.content.size === 0 && s.node(-1).childCount === s.indexAfter(-1)) {
		if (s.depth === 2 || s.node(-3).type !== o || s.index(-2) !== s.node(-2).childCount - 1) return !1;
		if (i) {
			let e = C.empty, r = s.index(-1) ? 1 : s.index(-2) ? 2 : 3;
			for (let t = s.depth - r; t >= s.depth - 3; --t) e = C.from(s.node(t).copy(e));
			let i = s.indexAfter(-1) < s.node(-2).childCount ? 1 : s.indexAfter(-2) < s.node(-3).childCount ? 2 : 3, a = {
				...xu(d, s.node().type.name, s.node().attrs),
				...t
			}, c = o.contentMatch.defaultType?.createAndFill(a) || void 0;
			e = e.append(C.from(o.createAndFill(null, c) || void 0));
			let l = s.before(s.depth - (r - 1));
			n.replace(l, s.after(-i), new T(e, 4 - r, 0));
			let u = -1;
			n.doc.nodesBetween(l, n.doc.content.size, (e, t) => {
				if (u > -1) return !1;
				e.isTextblock && e.content.size === 0 && (u = t + 1);
			}), u > -1 && n.setSelection(A.near(n.doc.resolve(u))), n.scrollIntoView();
		}
		return !0;
	}
	let f = c.pos === s.end() ? u.contentMatchAt(0).defaultType : null, p = {
		...xu(d, u.type.name, u.attrs),
		...t
	}, m = {
		...xu(d, s.node().type.name, s.node().attrs),
		...t
	};
	n.delete(s.pos, c.pos);
	let h = f ? [{
		type: o,
		attrs: p
	}, {
		type: f,
		attrs: m
	}] : [{
		type: o,
		attrs: p
	}];
	if (!rn(n.doc, s.pos, 2)) return !1;
	if (i) {
		let { selection: e, storedMarks: t } = r, { splittableMarks: o } = a.extensionManager, c = t || e.$to.parentOffset && e.$from.marks();
		if (n.split(s.pos, 2, h).scrollIntoView(), !c || !i) return !0;
		let l = c.filter((e) => o.includes(e.type.name));
		n.ensureMarks(l);
	}
	return !0;
};
function Gu(e) {
	return !e || e === "1" ? null : e;
}
function Ku(e, t) {
	return Gu(e) === Gu(t);
}
var qu = (e, t) => {
	let n = Kl((e) => e.type === t)(e.selection);
	if (!n) return !0;
	let r = e.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
	if (r === void 0) return !0;
	let i = e.doc.nodeAt(r);
	return !(n.node.type === i?.type && on(e.doc, n.pos)) || !Ku(n.node.attrs.type, i?.attrs.type) || e.join(n.pos), !0;
}, Y = (e, t) => {
	let n = Kl((e) => e.type === t)(e.selection);
	if (!n) return !0;
	let r = e.doc.resolve(n.start).after(n.depth);
	if (r === void 0) return !0;
	let i = e.doc.nodeAt(r);
	return !(n.node.type === i?.type && on(e.doc, r)) || !Ku(n.node.attrs.type, i?.attrs.type) || e.join(r), !0;
};
function Ju(e) {
	let t = e.doc, n = t.firstChild;
	if (!n) return null;
	let r = t.resolve(1), i = t.resolve(n.nodeSize - 1);
	return A.between(r, i);
}
var Yu = (e, t, n, r = {}) => ({ editor: i, tr: a, state: o, dispatch: s, chain: c, commands: l, can: u }) => {
	let { extensions: d, splittableMarks: f } = i.extensionManager, p = Vc(e, o.schema), m = Vc(t, o.schema), { selection: h, storedMarks: g } = o, { $from: _, $to: v } = h, y = _.blockRange(v), b = g || h.$to.parentOffset && h.$from.marks();
	if (!y) return !1;
	let x = Kl((e) => Ou(e.type.name, d))(h), ee = h.from === 0 && h.to === o.doc.content.size, te = o.doc.content.content, S = te.length === 1 ? te[0] : null, ne = ee && S && Ou(S.type.name, d) ? {
		node: S,
		pos: 0,
		depth: 0
	} : null, C = x ?? ne, re = !!x && y.depth >= 1 && y.depth - x.depth <= 1, ie = !!ne;
	if ((re || ie) && C) {
		if (C.node.type === p) return ee && ie ? c().command(({ tr: e, dispatch: t }) => {
			let n = Ju(e);
			return n ? (e.setSelection(n), t && t(e), !0) : !1;
		}).liftListItem(m).run() : l.liftListItem(m);
		if (Ou(C.node.type.name, d) && p.validContent(C.node.content)) return c().command(() => (a.setNodeMarkup(C.pos, p), !0)).command(() => qu(a, p)).command(() => Y(a, p)).run();
	}
	return !n || !b || !s ? c().command(() => u().wrapInList(p, r) ? !0 : l.clearNodes()).wrapInList(p, r).command(() => qu(a, p)).command(() => Y(a, p)).run() : c().command(() => {
		let e = u().wrapInList(p, r), t = b.filter((e) => f.includes(e.type.name));
		return a.ensureMarks(t), e ? !0 : l.clearNodes();
	}).wrapInList(p, r).command(() => qu(a, p)).command(() => Y(a, p)).run();
}, Xu = (e, t = {}, n = {}) => ({ state: r, commands: i }) => {
	let { extendEmptyMarkRange: a = !1 } = n, o = tl(e, r.schema);
	return Cu(r, o, t) ? i.unsetMark(o, { extendEmptyMarkRange: a }) : i.setMark(o, t);
}, Zu = (e, t, n = {}) => ({ state: r, commands: i }) => {
	let a = Vc(e, r.schema), o = Vc(t, r.schema), s = kl(r, a, n), c;
	return r.selection.$anchor.sameParent(r.selection.$head) && (c = r.selection.$anchor.parent.attrs), s ? i.setNode(o, c) : i.setNode(a, {
		...c,
		...n
	});
}, Qu = (e, t = {}) => ({ state: n, commands: r }) => {
	let i = Vc(e, n.schema);
	return kl(n, i, t) ? r.lift(i) : r.wrapIn(i, t);
}, $u = () => ({ state: e, dispatch: t }) => {
	let n = e.plugins;
	for (let r = 0; r < n.length; r += 1) {
		let i = n[r], a;
		if (i.spec.isInputRules && (a = i.getState(e))) {
			if (t) {
				let t = e.tr, n = a.transform;
				for (let e = n.steps.length - 1; e >= 0; --e) t.step(n.steps[e].invert(n.docs[e]));
				if (a.text) {
					let n = t.doc.resolve(a.from).marks();
					t.replaceWith(a.from, a.to, e.schema.text(a.text, n));
				} else t.delete(a.from, a.to);
			}
			return !0;
		}
	}
	return !1;
}, ed = (e = {}) => ({ tr: t, dispatch: n, editor: r }) => {
	let { ignoreClearable: i = !1 } = e, { selection: a } = t, { empty: o, ranges: s } = a;
	if (o) return !0;
	let { nonClearableMarks: c } = r.extensionManager;
	if (n) {
		let e = Object.values(r.schema.marks).filter((e) => i || !c.includes(e.name));
		s.forEach((n) => {
			for (let r of e) t.removeMark(n.$from.pos, n.$to.pos, r);
		});
	}
	return !0;
}, td = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let { extendEmptyMarkRange: a = !1 } = t, { selection: o } = n, s = tl(e, r.schema), { $from: c, empty: l, ranges: u } = o;
	if (!i) return !0;
	if (l && a) {
		let { from: e, to: t } = o, r = el(c, s, c.marks().find((e) => e.type === s)?.attrs);
		r && (e = r.from, t = r.to), n.removeMark(e, t, s);
	} else u.forEach((e) => {
		n.removeMark(e.$from.pos, e.$to.pos, s);
	});
	return n.removeStoredMark(s), !0;
}, nd = (e) => ({ tr: t, state: n, dispatch: r }) => {
	let { selection: i } = n, a, o;
	return typeof e == "number" ? (a = e, o = e) : e && "from" in e && "to" in e ? (a = e.from, o = e.to) : (a = i.from, o = i.to), r && t.doc.nodesBetween(a, o, (e, n) => {
		if (e.isText) return;
		let r = { ...e.attrs };
		delete r.dir, t.setNodeMarkup(n, void 0, r);
	}), !0;
}, rd = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let a = null, o = null, s = Pl(typeof e == "string" ? e : e.name, r.schema);
	if (!s) return !1;
	s === "node" && (a = Vc(e, r.schema)), s === "mark" && (o = tl(e, r.schema));
	let c = !1;
	return n.selection.ranges.forEach((e) => {
		let s = e.$from.pos, l = e.$to.pos, u, d, f, p;
		n.selection.empty ? r.doc.nodesBetween(s, l, (e, t) => {
			a && a === e.type && (c = !0, f = Math.max(t, s), p = Math.min(t + e.nodeSize, l), u = t, d = e);
		}) : r.doc.nodesBetween(s, l, (e, r) => {
			r < s && a && a === e.type && (c = !0, f = Math.max(r, s), p = Math.min(r + e.nodeSize, l), u = r, d = e), r >= s && r <= l && (a && a === e.type && (c = !0, i && n.setNodeMarkup(r, void 0, {
				...e.attrs,
				...t
			})), o && e.marks.length && e.marks.forEach((a) => {
				if (o === a.type && (c = !0, i)) {
					let i = Math.max(r, s), c = Math.min(r + e.nodeSize, l);
					n.addMark(i, c, o.create({
						...a.attrs,
						...t
					}));
				}
			}));
		}), d && (u !== void 0 && i && n.setNodeMarkup(u, void 0, {
			...d.attrs,
			...t
		}), o && d.marks.length && d.marks.forEach((e) => {
			o === e.type && i && n.addMark(f, p, o.create({
				...e.attrs,
				...t
			}));
		}));
	}), c;
}, id = (e, t = {}) => ({ state: n, dispatch: r }) => Mr(Vc(e, n.schema), t)(n, r), ad = (e, t = {}) => ({ state: n, dispatch: r }) => zr(Vc(e, n.schema), t)(n, r), od = class {
	constructor() {
		this.callbacks = {};
	}
	on(e, t) {
		return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
	}
	emit(e, ...t) {
		let n = this.callbacks[e];
		return n && n.forEach((e) => e.apply(this, t)), this;
	}
	off(e, t) {
		let n = this.callbacks[e];
		return n && (t ? this.callbacks[e] = n.filter((e) => e !== t) : delete this.callbacks[e]), this;
	}
	once(e, t) {
		let n = (...r) => {
			this.off(e, n), t.apply(this, r);
		};
		return this.on(e, n);
	}
	removeAllListeners() {
		this.callbacks = {};
	}
};
function sd(e, t) {
	let { selection: n } = e, { $from: r } = n;
	if (n instanceof j) {
		let e = r.index();
		return r.parent.canReplaceWith(e, e + 1, t);
	}
	let i = r.depth;
	for (; i >= 0;) {
		let e = r.index(i);
		if (r.node(i).contentMatchAt(e).matchType(t)) return !0;
		--i;
	}
	return !1;
}
function cd(e, t, n) {
	let r = document.querySelector(`style[data-tiptap-style${n ? `-${n}` : ""}]`);
	if (r !== null) return r;
	let i = document.createElement("style");
	return t && i.setAttribute("nonce", t), i.setAttribute(`data-tiptap-style${n ? `-${n}` : ""}`, ""), i.innerHTML = e, document.getElementsByTagName("head")[0].appendChild(i), i;
}
function ld(e) {
	return typeof e == "number";
}
function ud(e) {
	return Object.prototype.toString.call(e).slice(8, -1);
}
function dd(e) {
	return ud(e) === "Object" ? e.constructor === Object && Object.getPrototypeOf(e) === Object.prototype : !1;
}
Ac({}, {
	createAtomBlockMarkdownSpec: () => md,
	createBlockMarkdownSpec: () => hd,
	createInlineMarkdownSpec: () => vd,
	parseAttributes: () => fd,
	parseIndentedBlocks: () => yd,
	renderNestedMarkdownContent: () => bd,
	serializeAttributes: () => pd
});
function fd(e) {
	if (!e?.trim()) return {};
	let t = {}, n = [], r = e.replace(/["']([^"']*)["']/g, (e) => (n.push(e), `__QUOTED_${n.length - 1}__`)), i = r.match(/(?:^|\s)\.([\w-]+)/g);
	i && (t.class = i.map((e) => e.trim().slice(1)).join(" "));
	let a = r.match(/(?:^|\s)#([\w-]+)/);
	a && (t.id = a[1]), Array.from(r.matchAll(/([a-zA-Z][\w-]*)\s*=\s*(__QUOTED_\d+__)/g)).forEach(([, e, r]) => {
		let i = n[parseInt(r.match(/__QUOTED_(\d+)__/)?.[1] || "0", 10)];
		i && (t[e] = i.slice(1, -1));
	});
	let o = r.replace(/(?:^|\s)\.([\w-]+)/g, "").replace(/(?:^|\s)#([\w-]+)/g, "").replace(/([a-zA-Z][\w-]*)\s*=\s*__QUOTED_\d+__/g, "").trim();
	return o && o.split(/\s+/).filter(Boolean).forEach((e) => {
		e.match(/^[a-zA-Z][\w-]*$/) && (t[e] = !0);
	}), t;
}
function pd(e) {
	if (!e || Object.keys(e).length === 0) return "";
	let t = [];
	return e.class && String(e.class).split(/\s+/).filter(Boolean).forEach((e) => t.push(`.${e}`)), e.id && t.push(`#${e.id}`), Object.entries(e).forEach(([e, n]) => {
		e === "class" || e === "id" || (n === !0 ? t.push(e) : n !== !1 && n != null && t.push(`${e}="${String(n)}"`));
	}), t.join(" ");
}
function md(e) {
	let { nodeName: t, name: n, parseAttributes: r = fd, serializeAttributes: i = pd, defaultAttributes: a = {}, requiredAttributes: o = [], allowedAttributes: s } = e, c = n || t, l = (e) => {
		if (!s) return e;
		let t = {};
		return s.forEach((n) => {
			n in e && (t[n] = e[n]);
		}), t;
	};
	return {
		parseMarkdown: (e, n) => {
			let r = {
				...a,
				...e.attributes
			};
			return n.createNode(t, r, []);
		},
		markdownTokenizer: {
			name: t,
			level: "block",
			start(e) {
				let t = RegExp(`^:::${c}(?:\\s|$)`, "m"), n = e.match(t)?.index;
				return n === void 0 ? -1 : n;
			},
			tokenize(e, n, i) {
				let a = RegExp(`^:::${c}(?:\\s+\\{([^}]*)\\})?\\s*:::(?:\\n|$)`), s = e.match(a);
				if (!s) return;
				let l = r(s[1] || "");
				if (!o.find((e) => !(e in l))) return {
					type: t,
					raw: s[0],
					attributes: l
				};
			}
		},
		renderMarkdown: (e) => {
			let t = i(l(e.attrs || {}));
			return `:::${c}${t ? ` {${t}}` : ""} :::`;
		}
	};
}
function hd(e) {
	let { nodeName: t, name: n, getContent: r, parseAttributes: i = fd, serializeAttributes: a = pd, defaultAttributes: o = {}, content: s = "block", allowedAttributes: c } = e, l = n || t, u = (e) => {
		if (!c) return e;
		let t = {};
		return c.forEach((n) => {
			n in e && (t[n] = e[n]);
		}), t;
	};
	return {
		parseMarkdown: (e, n) => {
			let i;
			if (r) {
				let t = r(e);
				i = typeof t == "string" ? [{
					type: "text",
					text: t
				}] : t;
			} else i = s === "block" ? n.parseChildren(e.tokens || []) : n.parseInline(e.tokens || []);
			let a = {
				...o,
				...e.attributes
			};
			return n.createNode(t, a, i);
		},
		markdownTokenizer: {
			name: t,
			level: "block",
			start(e) {
				let t = RegExp(`^:::${l}`, "m"), n = e.match(t)?.index;
				return n === void 0 ? -1 : n;
			},
			tokenize(e, n, r) {
				let a = RegExp(`^:::${l}(?:\\s+\\{([^}]*)\\})?\\s*\\n`), o = e.match(a);
				if (!o) return;
				let [c, u = ""] = o, d = i(u), f = 1, p = c.length, m = "", h = /^:::([\w-]*)(\s.*)?/gm, g = e.slice(p);
				for (h.lastIndex = 0;;) {
					let n = h.exec(g);
					if (n === null) break;
					let i = n.index, a = n[1];
					if (!n[2]?.endsWith(":::")) {
						if (a) f += 1;
						else if (--f, f === 0) {
							let a = g.slice(0, i);
							m = a.trim();
							let o = e.slice(0, p + i + n[0].length), c = [];
							if (m) if (s === "block") for (c = r.blockTokens(a), c.forEach((e) => {
								e.text && (!e.tokens || e.tokens.length === 0) && (e.tokens = r.inlineTokens(e.text));
							}); c.length > 0;) {
								let e = c[c.length - 1];
								if (e.type === "paragraph" && (!e.text || e.text.trim() === "")) c.pop();
								else break;
							}
							else c = r.inlineTokens(m);
							return {
								type: t,
								raw: o,
								attributes: d,
								content: m,
								tokens: c
							};
						}
					}
				}
			}
		},
		renderMarkdown: (e, t) => {
			let n = a(u(e.attrs || {}));
			return `:::${l}${n ? ` {${n}}` : ""}

${t.renderChildren(e.content || [], "\n\n")}

:::`;
		}
	};
}
function gd(e) {
	if (!e.trim()) return {};
	let t = {}, n = /(\w+)=(?:"([^"]*)"|'([^']*)')/g, r = n.exec(e);
	for (; r !== null;) {
		let [, i, a, o] = r;
		t[i] = a || o, r = n.exec(e);
	}
	return t;
}
function _d(e) {
	return Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function vd(e) {
	let { nodeName: t, name: n, getContent: r, parseAttributes: i = gd, serializeAttributes: a = _d, defaultAttributes: o = {}, selfClosing: s = !1, allowedAttributes: c } = e, l = n || t, u = (e) => {
		if (!c) return e;
		let t = {};
		return c.forEach((n) => {
			let r = typeof n == "string" ? n : n.name, i = typeof n == "string" ? void 0 : n.skipIfDefault;
			if (r in e) {
				let n = e[r];
				if (i !== void 0 && n === i) return;
				t[r] = n;
			}
		}), t;
	}, d = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return {
		parseMarkdown: (e, n) => {
			let i = {
				...o,
				...e.attributes
			};
			if (s) return n.createNode(t, i);
			let a = r ? r(e) : e.content || "";
			return a ? n.createNode(t, i, [n.createTextNode(a)]) : n.createNode(t, i, []);
		},
		markdownTokenizer: {
			name: t,
			level: "inline",
			start(e) {
				let t = RegExp(s ? `\\[${d}\\s*[^\\]]*\\]` : `\\[${d}\\s*[^\\]]*\\][\\s\\S]*?\\[\\/${d}\\]`), n = e.match(t)?.index;
				return n === void 0 ? -1 : n;
			},
			tokenize(e, n, r) {
				let a = RegExp(s ? `^\\[${d}\\s*([^\\]]*)\\]` : `^\\[${d}\\s*([^\\]]*)\\]([\\s\\S]*?)\\[\\/${d}\\]`), o = e.match(a);
				if (!o) return;
				let c = "", l = "";
				if (s) {
					let [, e] = o;
					l = e;
				} else {
					let [, e, t] = o;
					l = e, c = t || "";
				}
				let u = i(l.trim());
				return {
					type: t,
					raw: o[0],
					content: c.trim(),
					attributes: u
				};
			}
		},
		renderMarkdown: (e) => {
			let t = "";
			r ? t = r(e) : e.content && e.content.length > 0 && (t = e.content.filter((e) => e.type === "text").map((e) => e.text).join(""));
			let n = a(u(e.attrs || {})), i = n ? ` ${n}` : "";
			return s ? `[${l}${i}]` : `[${l}${i}]${t}[/${l}]`;
		}
	};
}
function yd(e, t, n) {
	let r = e.split("\n"), i = [], a = "", o = 0, s = t.baseIndentSize || 2;
	for (; o < r.length;) {
		let e = r[o], c = e.match(t.itemPattern);
		if (!c) {
			if (i.length > 0) break;
			if (e.trim() === "") {
				o += 1, a = `${a}${e}
`;
				continue;
			} else return;
		}
		let l = t.extractItemData(c), { indentLevel: u, mainContent: d } = l;
		a = `${a}${e}
`;
		let f = [d];
		for (o += 1; o < r.length;) {
			let e = r[o];
			if (e.trim() === "") {
				let t = r.slice(o + 1).findIndex((e) => e.trim() !== "");
				if (t === -1) break;
				if ((r[o + 1 + t].match(/^(\s*)/)?.[1]?.length || 0) > u) {
					f.push(e), a = `${a}${e}
`, o += 1;
					continue;
				} else break;
			}
			if ((e.match(/^(\s*)/)?.[1]?.length || 0) > u) f.push(e), a = `${a}${e}
`, o += 1;
			else break;
		}
		let p, m = f.slice(1);
		if (m.length > 0) {
			let e = m.map((e) => e.slice(u + s)).join("\n");
			e.trim() && (p = t.customNestedParser ? t.customNestedParser(e) : n.blockTokens(e));
		}
		let h = t.createToken(l, p);
		i.push(h);
	}
	if (i.length !== 0) return {
		items: i,
		raw: a
	};
}
function bd(e, t, n, r) {
	if (!e || !Array.isArray(e.content)) return "";
	let i = typeof n == "function" ? n(r) : n, [a, ...o] = e.content, s = `${i}${t.renderChildren([a])}`;
	return o && o.length > 0 && o.forEach((e, n) => {
		let r = t.renderChild?.call(t, e, n + 1) ?? t.renderChildren([e]);
		if (r != null) {
			let n = r.split("\n").map((e) => e ? t.indent(e) : t.indent("")).join("\n");
			s += e.type === "paragraph" ? `

${n}` : `
${n}`;
		}
	}), s;
}
function xd(e, t) {
	let n = { ...e };
	return dd(e) && dd(t) && Object.keys(t).forEach((r) => {
		dd(t[r]) && dd(e[r]) ? n[r] = xd(e[r], t[r]) : n[r] = t[r];
	}), n;
}
function Sd(e, t, n = {}) {
	let { state: r } = t, { doc: i, tr: a } = r, o = e;
	i.descendants((t, r) => {
		let i = a.mapping.map(r), s = a.mapping.map(r) + t.nodeSize, c = null;
		if (t.marks.forEach((e) => {
			if (e !== o) return !1;
			c = e;
		}), !c) return;
		let l = !1;
		if (Object.keys(n).forEach((e) => {
			n[e] !== c.attrs[e] && (l = !0);
		}), l) {
			let t = e.type.create({
				...e.attrs,
				...n
			});
			a.removeMark(i, s, e.type), a.addMark(i, s, t);
		}
	}), a.docChanged && t.view.dispatch(a);
}
var X = class {
	constructor(e) {
		this.find = e.find, this.handler = e.handler, this.undoable = e.undoable ?? !0;
	}
}, Cd = (e, t) => {
	if (Xc(t)) return t.exec(e);
	let n = t(e);
	if (!n) return null;
	let r = [n.text];
	return r.index = n.index, r.input = e, r.data = n.data, n.replaceWith && (n.text.includes(n.replaceWith) || console.warn("[tiptap warn]: \"inputRuleMatch.replaceWith\" must be part of \"inputRuleMatch.text\"."), r.push(n.replaceWith)), r;
};
function wd(e) {
	let { editor: t, from: n, to: r, text: i, rules: a, plugin: o } = e, { view: s } = t;
	if (s.composing) return !1;
	let c = s.state.doc.resolve(n);
	if (c.parent.type.spec.code || (c.nodeBefore || c.nodeAfter)?.marks.find((e) => e.type.spec.code)) return !1;
	let l = !1, u = Su(c) + i;
	return a.forEach((e) => {
		if (l) return;
		let a = Cd(u, e.find);
		if (!a) return;
		let c = s.state.tr, d = jc({
			state: s.state,
			transaction: c
		}), f = {
			from: n - (a[0].length - i.length),
			to: r
		}, { commands: p, chain: m, can: h } = new Mc({
			editor: t,
			state: d
		});
		e.handler({
			state: d,
			range: f,
			match: a,
			commands: p,
			chain: m,
			can: h
		}) === null || !c.steps.length || (e.undoable && c.setMeta(o, {
			transform: c,
			from: n,
			to: r,
			text: i
		}), s.dispatch(c), l = !0);
	}), l;
}
function Td(e) {
	let { editor: t, rules: n } = e, r = new Qn({
		state: {
			init() {
				return null;
			},
			apply(e, i, a) {
				let o = e.getMeta(r);
				if (o) return o;
				let s = e.getMeta("applyInputRules");
				return s && setTimeout(() => {
					let { text: e } = s;
					e = typeof e == "string" ? e : Jl(C.from(e), a.schema);
					let { from: i } = s;
					wd({
						editor: t,
						from: i,
						to: i + e.length,
						text: e,
						rules: n,
						plugin: r
					});
				}), e.selectionSet || e.docChanged ? null : i;
			}
		},
		props: {
			handleTextInput(e, i, a, o) {
				return wd({
					editor: t,
					from: i,
					to: a,
					text: o,
					rules: n,
					plugin: r
				});
			},
			handleDOMEvents: { compositionend: (e) => (setTimeout(() => {
				let { $cursor: i } = e.state.selection;
				i && wd({
					editor: t,
					from: i.pos,
					to: i.pos,
					text: "",
					rules: n,
					plugin: r
				});
			}), !1) },
			handleKeyDown(e, i) {
				if (i.key !== "Enter") return !1;
				let { $cursor: a } = e.state.selection;
				return a ? wd({
					editor: t,
					from: a.pos,
					to: a.pos,
					text: "\n",
					rules: n,
					plugin: r
				}) : !1;
			}
		},
		isInputRules: !0
	});
	return r;
}
var Ed = class {
	constructor(e = {}) {
		this.type = "extendable", this.parent = null, this.child = null, this.name = "", this.config = { name: this.name }, this.config = {
			...this.config,
			...e
		}, this.name = this.config.name;
	}
	get options() {
		return { ...q(K(this, "addOptions", { name: this.name })) };
	}
	get storage() {
		return { ...q(K(this, "addStorage", {
			name: this.name,
			options: this.options
		})) };
	}
	configure(e = {}) {
		let t = this.extend({
			...this.config,
			addOptions: () => xd(this.options, e)
		});
		return t.name = this.name, t.parent = this.parent, this.child = null, t;
	}
	extend(e = {}) {
		let t = new this.constructor({
			...this.config,
			...e
		});
		return t.parent = this, this.child = t, t.name = "name" in e ? e.name : t.parent.name, t;
	}
}, Dd = class e extends Ed {
	constructor() {
		super(...arguments), this.type = "mark";
	}
	static create(t = {}) {
		return new e(typeof t == "function" ? t() : t);
	}
	static handleExit({ editor: e, mark: t }) {
		let { tr: n } = e.state, r = e.state.selection.$from;
		if (r.pos === r.end()) {
			let i = r.marks();
			if (!i.find((e) => e?.type.name === t.name)) return !1;
			let a = i.find((e) => e?.type.name === t.name);
			return a && n.removeStoredMark(a), n.insertText(" ", r.pos), e.view.dispatch(n), !0;
		}
		return !1;
	}
	configure(e) {
		return super.configure(e);
	}
	extend(e) {
		let t = typeof e == "function" ? e() : e;
		return super.extend(t);
	}
}, Od = class {
	constructor(e) {
		this.find = e.find, this.handler = e.handler;
	}
}, kd = (e, t, n) => {
	if (Xc(t)) return [...e.matchAll(t)];
	let r = t(e, n);
	return r ? r.map((t) => {
		let n = [t.text];
		return n.index = t.index, n.input = e, n.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn("[tiptap warn]: \"pasteRuleMatch.replaceWith\" must be part of \"pasteRuleMatch.text\"."), n.push(t.replaceWith)), n;
	}) : [];
};
function Ad(e) {
	let { editor: t, state: n, from: r, to: i, rule: a, pasteEvent: o, dropEvent: s } = e, { commands: c, chain: l, can: u } = new Mc({
		editor: t,
		state: n
	}), d = [];
	return n.doc.nodesBetween(r, i, (e, t) => {
		if (e.type?.spec?.code || !(e.isText || e.isTextblock || e.isInline)) return;
		let f = e.content?.size ?? e.nodeSize ?? 0, p = Math.max(r, t), m = Math.min(i, t + f);
		p >= m || kd(e.isText ? e.text || "" : e.textBetween(p - t, m - t, void 0, "￼"), a.find, o).forEach((e) => {
			if (e.index === void 0) return;
			let t = p + e.index + 1, r = t + e[0].length, i = {
				from: n.tr.mapping.map(t),
				to: n.tr.mapping.map(r)
			}, f = a.handler({
				state: n,
				range: i,
				match: e,
				commands: c,
				chain: l,
				can: u,
				pasteEvent: o,
				dropEvent: s
			});
			d.push(f);
		});
	}), d.every((e) => e !== null);
}
var jd = null, Md = (e) => {
	var t;
	let n = new ClipboardEvent("paste", { clipboardData: new DataTransfer() });
	return (t = n.clipboardData) == null || t.setData("text/html", e), n;
};
function Nd(e) {
	let { editor: t, rules: n } = e, r = null, i = !1, a = !1, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, s;
	try {
		s = typeof DragEvent < "u" ? new DragEvent("drop") : null;
	} catch {
		s = null;
	}
	let c = ({ state: e, from: n, to: r, rule: i, pasteEvt: a }) => {
		let c = e.tr;
		if (!(!Ad({
			editor: t,
			state: jc({
				state: e,
				transaction: c
			}),
			from: Math.max(n - 1, 0),
			to: r.b - 1,
			rule: i,
			pasteEvent: a,
			dropEvent: s
		}) || !c.steps.length)) {
			try {
				s = typeof DragEvent < "u" ? new DragEvent("drop") : null;
			} catch {
				s = null;
			}
			return o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, c;
		}
	};
	return n.map((e) => new Qn({
		view(e) {
			let n = (n) => {
				r = e.dom.parentElement?.contains(n.target) ? e.dom.parentElement : null, r && (jd = t);
			}, i = () => {
				jd &&= null;
			};
			return window.addEventListener("dragstart", n), window.addEventListener("dragend", i), { destroy() {
				window.removeEventListener("dragstart", n), window.removeEventListener("dragend", i);
			} };
		},
		props: { handleDOMEvents: {
			drop: (e, t) => {
				if (a = r === e.dom.parentElement, s = t, !a) {
					let e = jd;
					e?.isEditable && setTimeout(() => {
						let t = e.state.selection;
						t && e.commands.deleteRange({
							from: t.from,
							to: t.to
						});
					}, 10);
				}
				return !1;
			},
			paste: (e, t) => {
				let n = t.clipboardData?.getData("text/html");
				return o = t, i = !!n?.includes("data-pm-slice"), !1;
			}
		} },
		appendTransaction: (t, n, r) => {
			let s = t[0], l = s.getMeta("uiEvent") === "paste" && !i, u = s.getMeta("uiEvent") === "drop" && !a, d = s.getMeta("applyPasteRules"), f = !!d;
			if (!l && !u && !f) return;
			if (f) {
				let { text: t } = d;
				t = typeof t == "string" ? t : Jl(C.from(t), r.schema);
				let { from: n } = d, i = n + t.length, a = Md(t);
				return c({
					rule: e,
					state: r,
					from: n,
					to: { b: i },
					pasteEvt: a
				});
			}
			let p = n.doc.content.findDiffStart(r.doc.content), m = n.doc.content.findDiffEnd(r.doc.content);
			if (!(!ld(p) || !m || p === m.b)) return c({
				rule: e,
				state: r,
				from: p,
				to: m,
				pasteEvt: o
			});
		}
	}));
}
var Pd = class {
	constructor(e, t) {
		this.splittableMarks = [], this.nonClearableMarks = [], this.editor = t, this.baseExtensions = e, this.extensions = lu(e), this.schema = ou(this.extensions, t), this.setupExtensions();
	}
	get commands() {
		return this.extensions.reduce((e, t) => {
			let n = K(t, "addCommands", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: this.editor,
				type: bu(t.name, this.schema)
			});
			return n ? {
				...e,
				...n()
			} : e;
		}, {});
	}
	get plugins() {
		let { editor: e } = this;
		return cu([...this.extensions].reverse()).flatMap((t) => {
			let n = {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: bu(t.name, this.schema)
			}, r = [], i = K(t, "addKeyboardShortcuts", n), a = {};
			if (t.type === "mark" && K(t, "exitable", n) && (a.ArrowRight = () => Dd.handleExit({
				editor: e,
				mark: t
			})), i) {
				let t = Object.fromEntries(Object.entries(i()).map(([t, n]) => [t, () => n({ editor: e })]));
				a = {
					...a,
					...t
				};
			}
			let o = wc(a);
			r.push(o);
			let s = K(t, "addInputRules", n);
			if (Du(t, e.options.enableInputRules) && s) {
				let t = s();
				if (t && t.length) {
					let n = Td({
						editor: e,
						rules: t
					}), i = Array.isArray(n) ? n : [n];
					r.push(...i);
				}
			}
			let c = K(t, "addPasteRules", n);
			if (Du(t, e.options.enablePasteRules) && c) {
				let t = c();
				if (t && t.length) {
					let n = Nd({
						editor: e,
						rules: t
					});
					r.push(...n);
				}
			}
			let l = K(t, "addProseMirrorPlugins", n);
			if (l) {
				let e = l();
				r.push(...e);
			}
			return r;
		});
	}
	get attributes() {
		return Ql(this.extensions);
	}
	get nodeViews() {
		let { editor: e } = this, { nodeExtensions: t } = Zl(this.extensions);
		return Object.fromEntries(t.filter((e) => !!K(e, "addNodeView")).map((t) => {
			let n = this.attributes.filter((e) => e.type === t.name), r = K(t, "addNodeView", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: Vc(t.name, this.schema)
			});
			if (!r) return [];
			let i = r();
			return i ? [t.name, (r, a, o, s, c) => i({
				node: r,
				view: a,
				getPos: o,
				decorations: s,
				innerDecorations: c,
				editor: e,
				extension: t,
				HTMLAttributes: tu(r, n)
			})] : [];
		}));
	}
	dispatchTransaction(e) {
		let { editor: t } = this;
		return cu([...this.extensions].reverse()).reduceRight((e, n) => {
			let r = {
				name: n.name,
				options: n.options,
				storage: this.editor.extensionStorage[n.name],
				editor: t,
				type: bu(n.name, this.schema)
			}, i = K(n, "dispatchTransaction", r);
			return i ? (t) => {
				i.call(r, {
					transaction: t,
					next: e
				});
			} : e;
		}, e);
	}
	transformPastedHTML(e) {
		let { editor: t } = this;
		return cu([...this.extensions]).reduce((e, n) => {
			let r = {
				name: n.name,
				options: n.options,
				storage: this.editor.extensionStorage[n.name],
				editor: t,
				type: bu(n.name, this.schema)
			}, i = K(n, "transformPastedHTML", r);
			return i ? (t, n) => {
				let a = e(t, n);
				return i.call(r, a);
			} : e;
		}, e || ((e) => e));
	}
	get markViews() {
		let { editor: e } = this, { markExtensions: t } = Zl(this.extensions);
		return Object.fromEntries(t.filter((e) => !!K(e, "addMarkView")).map((t) => {
			let n = this.attributes.filter((e) => e.type === t.name), r = K(t, "addMarkView", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: tl(t.name, this.schema)
			});
			return r ? [t.name, (i, a, o) => {
				let s = tu(i, n);
				return r()({
					mark: i,
					view: a,
					inline: o,
					editor: e,
					extension: t,
					HTMLAttributes: s,
					updateAttributes: (t) => {
						Sd(i, e, t);
					}
				});
			}] : [];
		}));
	}
	destroy() {
		this.extensions.forEach((e) => {
			let t = e;
			for (; t.parent;) {
				let e = t.parent;
				e.child === t && (e.child = null), t = e;
			}
		}), this.extensions = [], this.baseExtensions = [], this.schema = null, this.editor = null;
	}
	setupExtensions() {
		let e = this.extensions;
		this.editor.extensionStorage = Object.fromEntries(e.map((e) => [e.name, e.storage])), e.forEach((e) => {
			let t = {
				name: e.name,
				options: e.options,
				storage: this.editor.extensionStorage[e.name],
				editor: this.editor,
				type: bu(e.name, this.schema)
			};
			e.type === "mark" && ((q(K(e, "keepOnSplit", t)) ?? !0) && this.splittableMarks.push(e.name), (q(K(e, "clearable", t)) ?? !0) || this.nonClearableMarks.push(e.name));
			let n = K(e, "onBeforeCreate", t), r = K(e, "onCreate", t), i = K(e, "onUpdate", t), a = K(e, "onSelectionUpdate", t), o = K(e, "onTransaction", t), s = K(e, "onFocus", t), c = K(e, "onBlur", t), l = K(e, "onDestroy", t);
			n && this.editor.on("beforeCreate", n), r && this.editor.on("create", r), i && this.editor.on("update", i), a && this.editor.on("selectionUpdate", a), o && this.editor.on("transaction", o), s && this.editor.on("focus", s), c && this.editor.on("blur", c), l && this.editor.on("destroy", l);
		});
	}
};
Pd.resolve = lu, Pd.sort = cu, Pd.flatten = ql, Ac({}, {
	ClipboardTextSerializer: () => Z,
	Commands: () => Id,
	Delete: () => Ld,
	Drop: () => Rd,
	Editable: () => zd,
	FocusEvents: () => Vd,
	Keymap: () => Hd,
	Paste: () => Ud,
	Tabindex: () => Wd,
	TextDirection: () => Gd,
	focusEventsPluginKey: () => Bd
});
var Fd = class e extends Ed {
	constructor() {
		super(...arguments), this.type = "extension";
	}
	static create(t = {}) {
		return new e(typeof t == "function" ? t() : t);
	}
	configure(e) {
		return super.configure(e);
	}
	extend(e) {
		let t = typeof e == "function" ? e() : e;
		return super.extend(t);
	}
}, Z = Fd.create({
	name: "clipboardTextSerializer",
	addOptions() {
		return { blockSeparator: void 0 };
	},
	addProseMirrorPlugins() {
		return [new Qn({
			key: new tr("clipboardTextSerializer"),
			props: { clipboardTextSerializer: () => {
				let { editor: e } = this, { state: t, schema: n } = e, { doc: r, selection: i } = t, a = fu(n), { blockSeparator: o } = this.options, s = {
					...o === void 0 ? {} : { blockSeparator: o },
					textSerializers: a
				};
				return [...i.ranges].sort((e, t) => e.$from.pos - t.$from.pos).map(({ $from: e, $to: t }) => uu(r, {
					from: e.pos,
					to: t.pos
				}, s)).join(o ?? "\n\n");
			} }
		})];
	}
}), Id = Fd.create({
	name: "commands",
	addCommands() {
		return { ...Nc };
	}
}), Ld = Fd.create({
	name: "delete",
	onUpdate({ transaction: e, appendedTransactions: t }) {
		let n = () => {
			var n;
			if (((n = this.editor.options.coreExtensionOptions?.delete)?.filterTransaction)?.call(n, e) ?? e.getMeta("y-sync$")) return;
			let r = U(e.before, [e, ...t]);
			_u(r).forEach((t) => {
				r.mapping.mapResult(t.oldRange.from).deletedAfter && r.mapping.mapResult(t.oldRange.to).deletedBefore && r.before.nodesBetween(t.oldRange.from, t.oldRange.to, (n, i) => {
					let a = i + n.nodeSize - 2, o = t.oldRange.from <= i && a <= t.oldRange.to;
					this.editor.emit("delete", {
						type: "node",
						node: n,
						from: i,
						to: a,
						newFrom: r.mapping.map(i),
						newTo: r.mapping.map(a),
						deletedRange: t.oldRange,
						newRange: t.newRange,
						partial: !o,
						editor: this.editor,
						transaction: e,
						combinedTransform: r
					});
				});
			});
			let i = r.mapping;
			r.steps.forEach((t, n) => {
				if (t instanceof Ft) {
					let a = i.slice(n).map(t.from, -1), o = i.slice(n).map(t.to), s = i.invert().map(a, -1), c = i.invert().map(o), l = a > 0 ? r.doc.nodeAt(a - 1)?.marks.some((e) => e.eq(t.mark)) : !1, u = r.doc.nodeAt(o)?.marks.some((e) => e.eq(t.mark));
					this.editor.emit("delete", {
						type: "mark",
						mark: t.mark,
						from: t.from,
						to: t.to,
						deletedRange: {
							from: s,
							to: c
						},
						newRange: {
							from: a,
							to: o
						},
						partial: !!(u || l),
						editor: this.editor,
						transaction: e,
						combinedTransform: r
					});
				}
			});
		};
		this.editor.options.coreExtensionOptions?.delete?.async ?? !0 ? setTimeout(n, 0) : n();
	}
}), Rd = Fd.create({
	name: "drop",
	addProseMirrorPlugins() {
		return [new Qn({
			key: new tr("tiptapDrop"),
			props: { handleDrop: (e, t, n, r) => {
				this.editor.emit("drop", {
					editor: this.editor,
					event: t,
					slice: n,
					moved: r
				});
			} }
		})];
	}
}), zd = Fd.create({
	name: "editable",
	addProseMirrorPlugins() {
		return [new Qn({
			key: new tr("editable"),
			props: { editable: () => this.editor.options.editable }
		})];
	}
}), Bd = new tr("focusEvents"), Vd = Fd.create({
	name: "focusEvents",
	addProseMirrorPlugins() {
		let { editor: e } = this;
		return [new Qn({
			key: Bd,
			props: { handleDOMEvents: {
				focus: (t, n) => {
					e.isFocused = !0;
					let r = e.state.tr.setMeta("focus", { event: n }).setMeta("addToHistory", !1);
					return t.dispatch(r), !1;
				},
				blur: (t, n) => {
					e.isFocused = !1;
					let r = e.state.tr.setMeta("blur", { event: n }).setMeta("addToHistory", !1);
					return t.dispatch(r), !1;
				}
			} }
		})];
	}
}), Hd = Fd.create({
	name: "keymap",
	addKeyboardShortcuts() {
		let e = () => this.editor.commands.first(({ commands: e }) => [
			() => e.undoInputRule(),
			() => e.command(({ tr: t }) => {
				let { selection: n, doc: r } = t, { empty: i, $anchor: a } = n, { pos: o, parent: s } = a, c = a.parent.isTextblock && o > 0 ? t.doc.resolve(o - 1) : a, l = c.parent.type.spec.isolating, u = a.pos - a.parentOffset, d = l && c.parent.childCount === 1 ? u === a.pos : k.atStart(r).from === o;
				return !i || !s.type.isTextblock || s.textContent.length || !d || d && a.parent.type.name === "paragraph" ? !1 : e.clearNodes();
			}),
			() => e.deleteSelection(),
			() => e.joinBackward(),
			() => e.selectNodeBackward()
		]), t = () => this.editor.commands.first(({ commands: e }) => [
			() => e.deleteSelection(),
			() => e.deleteCurrentNode(),
			() => e.joinForward(),
			() => e.selectNodeForward()
		]), n = {
			Enter: () => this.editor.commands.first(({ commands: e }) => [
				() => e.newlineInCode(),
				() => e.createParagraphNear(),
				() => e.liftEmptyBlock(),
				() => e.splitBlock()
			]),
			"Mod-Enter": () => this.editor.commands.exitCode(),
			Backspace: e,
			"Mod-Backspace": e,
			"Shift-Backspace": e,
			Delete: t,
			"Mod-Delete": t,
			"Mod-a": () => this.editor.commands.selectAll()
		}, r = { ...n }, i = {
			...n,
			"Ctrl-h": e,
			"Alt-Backspace": e,
			"Ctrl-d": t,
			"Ctrl-Alt-Backspace": t,
			"Alt-Delete": t,
			"Alt-d": t,
			"Ctrl-a": () => this.editor.commands.selectTextblockStart(),
			"Ctrl-e": () => this.editor.commands.selectTextblockEnd()
		};
		return cl() || El() ? i : r;
	},
	addProseMirrorPlugins() {
		return [new Qn({
			key: new tr("clearDocument"),
			appendTransaction: (e, t, n) => {
				if (e.some((e) => e.getMeta("composition"))) return;
				let r = e.some((e) => e.docChanged) && !t.doc.eq(n.doc), i = e.some((e) => e.getMeta("preventClearDocument"));
				if (!r || i) return;
				let { empty: a, from: o, to: s } = t.selection, c = k.atStart(t.doc).from, l = k.atEnd(t.doc).to;
				if (a || !(o === c && s === l) || !ku(n.doc)) return;
				let u = n.tr, d = jc({
					state: n,
					transaction: u
				}), { commands: f } = new Mc({
					editor: this.editor,
					state: d
				});
				if (f.clearNodes(), u.steps.length) return u;
			}
		})];
	}
}), Ud = Fd.create({
	name: "paste",
	addProseMirrorPlugins() {
		return [new Qn({
			key: new tr("tiptapPaste"),
			props: { handlePaste: (e, t, n) => {
				this.editor.emit("paste", {
					editor: this.editor,
					event: t,
					slice: n
				});
			} }
		})];
	}
}), Wd = Fd.create({
	name: "tabindex",
	addOptions() {
		return { value: void 0 };
	},
	addProseMirrorPlugins() {
		return [new Qn({
			key: new tr("tabindex"),
			props: { attributes: () => !this.editor.isEditable && this.options.value === void 0 ? {} : { tabindex: this.options.value ?? "0" } }
		})];
	}
}), Gd = Fd.create({
	name: "textDirection",
	addOptions() {
		return { direction: void 0 };
	},
	addGlobalAttributes() {
		if (!this.options.direction) return [];
		let { nodeExtensions: e } = Zl(this.extensions);
		return [{
			types: e.filter((e) => e.name !== "text").map((e) => e.name),
			attributes: { dir: {
				default: this.options.direction,
				parseHTML: (e) => {
					let t = e.getAttribute("dir");
					return t && (t === "ltr" || t === "rtl" || t === "auto") ? t : this.options.direction;
				},
				renderHTML: (e) => e.dir ? { dir: e.dir } : {}
			} }
		}];
	},
	addProseMirrorPlugins() {
		return [new Qn({
			key: new tr("textDirection"),
			props: { attributes: () => {
				let e = this.options.direction;
				return e ? { dir: e } : {};
			} }
		})];
	}
}), Kd = class e {
	constructor(e, t, n = !1, r = null) {
		this.currentNode = null, this.actualDepth = null, this.isBlock = n, this.resolvedPos = e, this.editor = t, this.currentNode = r;
	}
	get name() {
		return this.node.type.name;
	}
	get node() {
		return this.currentNode || this.resolvedPos.node();
	}
	get element() {
		return this.editor.view.domAtPos(this.pos).node;
	}
	get depth() {
		return this.actualDepth ?? this.resolvedPos.depth;
	}
	get pos() {
		return this.resolvedPos.pos;
	}
	get content() {
		return this.node.content;
	}
	set content(e) {
		let t = this.from, n = this.to;
		if (this.isBlock) {
			if (this.content.size === 0) {
				console.error(`You can\u2019t set content on a block node. Tried to set content on ${this.name} at ${this.pos}`);
				return;
			}
			t = this.from + 1, n = this.to - 1;
		}
		this.editor.commands.insertContentAt({
			from: t,
			to: n
		}, e);
	}
	get attributes() {
		return this.node.attrs;
	}
	get textContent() {
		return this.node.textContent;
	}
	get size() {
		return this.node.nodeSize;
	}
	get from() {
		return this.isBlock ? this.pos : this.resolvedPos.start(this.resolvedPos.depth);
	}
	get range() {
		return {
			from: this.from,
			to: this.to
		};
	}
	get to() {
		return this.isBlock ? this.pos + this.size : this.resolvedPos.end(this.resolvedPos.depth) + +!this.node.isText;
	}
	get parent() {
		if (this.depth === 0) return null;
		let t = this.resolvedPos.start(this.resolvedPos.depth - 1);
		return new e(this.resolvedPos.doc.resolve(t), this.editor);
	}
	get before() {
		let t = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
		return t.depth !== this.depth && (t = this.resolvedPos.doc.resolve(this.from - 3)), new e(t, this.editor);
	}
	get after() {
		let t = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
		return t.depth !== this.depth && (t = this.resolvedPos.doc.resolve(this.to + 3)), new e(t, this.editor);
	}
	get children() {
		let t = [];
		return this.node.content.forEach((n, r) => {
			let i = n.isBlock && !n.isTextblock, a = n.isAtom && !n.isText, o = n.isInline, s = this.pos + r + +!a;
			if (s < 0 || s > this.resolvedPos.doc.nodeSize - 2) return;
			let c = this.resolvedPos.doc.resolve(s);
			if (!i && !o && c.depth <= this.depth) return;
			let l = new e(c, this.editor, i, i || o ? n : null);
			i && (l.actualDepth = this.depth + 1), t.push(l);
		}), t;
	}
	get firstChild() {
		return this.children[0] || null;
	}
	get lastChild() {
		let e = this.children;
		return e[e.length - 1] || null;
	}
	closest(e, t = {}) {
		let n = null, r = this.parent;
		for (; r && !n;) {
			if (r.node.type.name === e) if (Object.keys(t).length > 0) {
				let e = r.node.attrs, n = Object.keys(t);
				for (let r = 0; r < n.length; r += 1) {
					let i = n[r];
					if (e[i] !== t[i]) break;
				}
			} else n = r;
			r = r.parent;
		}
		return n;
	}
	querySelector(e, t = {}) {
		return this.querySelectorAll(e, t, !0)[0] || null;
	}
	querySelectorAll(e, t = {}, n = !1) {
		let r = [];
		if (!this.children || this.children.length === 0) return r;
		let i = Object.keys(t);
		return this.children.forEach((a) => {
			n && r.length > 0 || (a.node.type.name === e && i.every((e) => t[e] === a.node.attrs[e]) && r.push(a), !(n && r.length > 0) && (r = r.concat(a.querySelectorAll(e, t, n))));
		}), r;
	}
	setAttribute(e) {
		let { tr: t } = this.editor.state;
		t.setNodeMarkup(this.from, void 0, {
			...this.node.attrs,
			...e
		}), this.editor.view.dispatch(t);
	}
}, qd = ".ProseMirror {\n  position: relative;\n}\n\n.ProseMirror {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  white-space: break-spaces;\n  -webkit-font-variant-ligatures: none;\n  font-variant-ligatures: none;\n  font-feature-settings: \"liga\" 0; /* the above doesn't seem to work in Edge */\n}\n\n.ProseMirror [contenteditable=\"false\"] {\n  white-space: normal;\n}\n\n.ProseMirror [contenteditable=\"false\"] [contenteditable=\"true\"] {\n  white-space: pre-wrap;\n}\n\n.ProseMirror pre {\n  white-space: pre-wrap;\n}\n\nimg.ProseMirror-separator {\n  display: inline !important;\n  border: none !important;\n  margin: 0 !important;\n  width: 0 !important;\n  height: 0 !important;\n}\n\n.ProseMirror-gapcursor {\n  display: none;\n  pointer-events: none;\n  position: absolute;\n  margin: 0;\n}\n\n.ProseMirror-gapcursor:after {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: -2px;\n  width: 20px;\n  border-top: 1px solid black;\n  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;\n}\n\n@keyframes ProseMirror-cursor-blink {\n  to {\n    visibility: hidden;\n  }\n}\n\n.ProseMirror-hideselection *::selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection *::-moz-selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection * {\n  caret-color: transparent;\n}\n\n.ProseMirror-focused .ProseMirror-gapcursor {\n  display: block;\n}", Jd = class extends od {
	constructor(e = {}) {
		super(), this.css = null, this.className = "tiptap", this.editorView = null, this.isFocused = !1, this.destroyed = !1, this.isInitialized = !1, this.extensionStorage = {}, this.instanceId = Math.random().toString(36).slice(2, 9), this.options = {
			element: typeof document < "u" ? document.createElement("div") : null,
			content: "",
			injectCSS: !0,
			injectNonce: void 0,
			extensions: [],
			autofocus: !1,
			editable: !0,
			textDirection: void 0,
			editorProps: {},
			parseOptions: {},
			coreExtensionOptions: {},
			enableInputRules: !0,
			enablePasteRules: !0,
			enableCoreExtensions: !0,
			enableContentCheck: !1,
			emitContentError: !1,
			onBeforeCreate: () => null,
			onCreate: () => null,
			onMount: () => null,
			onUnmount: () => null,
			onUpdate: () => null,
			onSelectionUpdate: () => null,
			onTransaction: () => null,
			onFocus: () => null,
			onBlur: () => null,
			onDestroy: () => null,
			onContentError: ({ error: e }) => {
				throw e;
			},
			onPaste: () => null,
			onDrop: () => null,
			onDelete: () => null,
			enableExtensionDispatchTransaction: !0
		}, this.isCapturingTransaction = !1, this.capturedTransaction = null, this.utils = {
			getUpdatedPosition: Mu,
			createMappablePosition: Nu
		}, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: e, slice: t, moved: n }) => this.options.onDrop(e, t, n)), this.on("paste", ({ event: e, slice: t }) => this.options.onPaste(e, t)), this.on("delete", this.options.onDelete);
		let t = this.createDoc(), n = ol(t, this.options.autofocus);
		this.editorState = Xn.create({
			doc: t,
			schema: this.schema,
			selection: n || void 0
		}), this.options.element && this.mount(this.options.element);
	}
	mount(e) {
		if (typeof document > "u") throw Error("[tiptap error]: The editor cannot be mounted because there is no 'document' defined in this environment.");
		this.createView(e), this.emit("mount", { editor: this }), this.css && !document.head.contains(this.css) && document.head.appendChild(this.css), window.setTimeout(() => {
			this.isDestroyed || (this.options.autofocus !== !1 && this.options.autofocus !== null && this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }), this.isInitialized = !0);
		}, 0);
	}
	unmount() {
		if (this.editorView) {
			let e = this.editorView.dom;
			e?.editor && delete e.editor, this.editorView.destroy();
		}
		if (this.editorView = null, this.isInitialized = !1, this.css && !document.querySelectorAll(`.${this.className}`).length) try {
			typeof this.css.remove == "function" ? this.css.remove() : this.css.parentNode && this.css.parentNode.removeChild(this.css);
		} catch (e) {
			console.warn("Failed to remove CSS element:", e);
		}
		this.css = null, this.emit("unmount", { editor: this });
	}
	get storage() {
		return this.extensionStorage;
	}
	get commands() {
		return this.commandManager.commands;
	}
	chain() {
		return this.commandManager.chain();
	}
	can() {
		return this.commandManager.can();
	}
	injectCSS() {
		this.options.injectCSS && typeof document < "u" && (this.css = cd(qd, this.options.injectNonce));
	}
	setOptions(e = {}) {
		this.options = {
			...this.options,
			...e
		}, !(!this.editorView || !this.state || this.isDestroyed) && (this.options.editorProps && this.view.setProps(this.options.editorProps), this.view.updateState(this.state));
	}
	setEditable(e, t = !0) {
		this.setOptions({ editable: e }), t && this.emit("update", {
			editor: this,
			transaction: this.state.tr,
			appendedTransactions: []
		});
	}
	get isEditable() {
		return this.options.editable && this.view && this.view.editable;
	}
	get view() {
		return this.editorView ? this.editorView : new Proxy({
			state: this.editorState,
			updateState: (e) => {
				this.editorState = e;
			},
			dispatch: (e) => {
				this.dispatchTransaction(e);
			},
			composing: !1,
			dragging: null,
			editable: !0,
			isDestroyed: !1
		}, { get: (e, t) => {
			if (this.editorView) return this.editorView[t];
			if (t === "state") return this.editorState;
			if (t in e) return Reflect.get(e, t);
			throw Error(`[tiptap error]: The editor view is not available. Cannot access view['${t}']. The editor may not be mounted yet.`);
		} });
	}
	get state() {
		return this.editorView && (this.editorState = this.view.state), this.editorState;
	}
	registerPlugin(e, t) {
		let n = Yl(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], r = this.state.reconfigure({ plugins: n });
		return this.view.updateState(r), r;
	}
	unregisterPlugin(e) {
		if (this.isDestroyed) return;
		let t = this.state.plugins, n = t;
		if ([].concat(e).forEach((e) => {
			let t = typeof e == "string" ? `${e}$` : e.key;
			n = n.filter((e) => !e.key.startsWith(t));
		}), t.length === n.length) return;
		let r = this.state.reconfigure({ plugins: n });
		return this.view.updateState(r), r;
	}
	createExtensionManager() {
		let e = [...this.options.enableCoreExtensions ? [
			zd,
			Z.configure({ blockSeparator: this.options.coreExtensionOptions?.clipboardTextSerializer?.blockSeparator }),
			Id,
			Vd,
			Hd,
			Wd.configure({ value: this.options.coreExtensionOptions?.tabindex?.value }),
			Rd,
			Ud,
			Ld,
			Gd.configure({ direction: this.options.textDirection })
		].filter((e) => typeof this.options.enableCoreExtensions == "object" ? this.options.enableCoreExtensions[e.name] !== !1 : !0) : [], ...this.options.extensions].filter((e) => [
			"extension",
			"node",
			"mark"
		].includes(e?.type));
		this.extensionManager = new Pd(e, this);
	}
	createCommandManager() {
		this.commandManager = new Mc({ editor: this });
	}
	createSchema() {
		this.schema = this.extensionManager.schema;
	}
	createDoc() {
		let e;
		try {
			e = Wl(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: this.options.enableContentCheck });
		} catch (t) {
			if (!(t instanceof Error) || !["[tiptap error]: Invalid JSON content", "[tiptap error]: Invalid HTML content"].includes(t.message)) throw t;
			this.emit("contentError", {
				editor: this,
				error: t,
				disableCollaboration: () => {
					"collaboration" in this.storage && typeof this.storage.collaboration == "object" && this.storage.collaboration && (this.storage.collaboration.isDisabled = !0), this.options.extensions = this.options.extensions.filter((e) => e.name !== "collaboration"), this.createExtensionManager();
				}
			}), e = Wl(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: !1 });
		}
		return e;
	}
	createView(e) {
		let { editorProps: t, enableExtensionDispatchTransaction: n } = this.options, r = t.dispatchTransaction || this.dispatchTransaction.bind(this), i = n ? this.extensionManager.dispatchTransaction(r) : r, a = t.transformPastedHTML, o = this.extensionManager.transformPastedHTML(a);
		this.editorView = new ic(e, {
			...t,
			attributes: {
				role: "textbox",
				...t?.attributes
			},
			dispatchTransaction: i,
			transformPastedHTML: o,
			state: this.editorState,
			markViews: this.extensionManager.markViews,
			nodeViews: this.extensionManager.nodeViews
		});
		let s = this.state.reconfigure({ plugins: this.extensionManager.plugins });
		this.view.updateState(s), this.prependClass(), this.injectCSS();
		let c = this.view.dom;
		c.editor = this;
	}
	createNodeViews() {
		this.view.isDestroyed || this.view.setProps({
			markViews: this.extensionManager.markViews,
			nodeViews: this.extensionManager.nodeViews
		});
	}
	prependClass() {
		this.view.dom.className = `${this.className} ${this.view.dom.className}`;
	}
	captureTransaction(e) {
		this.isCapturingTransaction = !0, e(), this.isCapturingTransaction = !1;
		let t = this.capturedTransaction;
		return this.capturedTransaction = null, t;
	}
	dispatchTransaction(e) {
		if (this.view.isDestroyed) return;
		if (this.isCapturingTransaction) {
			if (!this.capturedTransaction) {
				this.capturedTransaction = e;
				return;
			}
			e.steps.forEach((e) => this.capturedTransaction?.step(e));
			return;
		}
		let { state: t, transactions: n } = this.state.applyTransaction(e), r = !this.state.selection.eq(t.selection), i = n.includes(e), a = this.state;
		if (this.emit("beforeTransaction", {
			editor: this,
			transaction: e,
			nextState: t
		}), !i) return;
		this.view.updateState(t), this.emit("transaction", {
			editor: this,
			transaction: e,
			appendedTransactions: n.slice(1)
		}), r && this.emit("selectionUpdate", {
			editor: this,
			transaction: e
		});
		let o = n.findLast((e) => e.getMeta("focus") || e.getMeta("blur")), s = o?.getMeta("focus"), c = o?.getMeta("blur");
		s && this.emit("focus", {
			editor: this,
			event: s.event,
			transaction: o
		}), c && this.emit("blur", {
			editor: this,
			event: c.event,
			transaction: o
		}), !(e.getMeta("preventUpdate") || !n.some((e) => e.docChanged) || a.doc.eq(t.doc)) && this.emit("update", {
			editor: this,
			transaction: e,
			appendedTransactions: n.slice(1)
		});
	}
	getAttributes(e) {
		return mu(this.state, e);
	}
	isActive(e, t) {
		let n = typeof e == "string" ? e : null, r = typeof e == "string" ? t : e;
		return wu(this.state, n, r);
	}
	getJSON() {
		return this.state.doc.toJSON();
	}
	getHTML() {
		return Jl(this.state.doc.content, this.schema);
	}
	getText(e) {
		let { blockSeparator: t = "\n\n", textSerializers: n = {} } = e || {};
		return du(this.state.doc, {
			blockSeparator: t,
			textSerializers: {
				...fu(this.schema),
				...n
			}
		});
	}
	get isEmpty() {
		return ku(this.state.doc);
	}
	destroy() {
		this.destroyed || (this.destroyed = !0, this.emit("destroy"), this.unmount(), this.removeAllListeners(), this.extensionManager.destroy(), this.extensionManager = null, this.schema = null, this.commandManager = null, this.extensionStorage = {});
	}
	get isDestroyed() {
		return this.editorView?.isDestroyed ?? !0;
	}
	$node(e, t) {
		return this.$doc?.querySelector(e, t) || null;
	}
	$nodes(e, t) {
		return this.$doc?.querySelectorAll(e, t) || null;
	}
	$pos(e) {
		let t = this.state.doc.resolve(e), n = e > 0 && t.nodeAfter && !t.nodeAfter.isText ? t.nodeAfter : null;
		return new Kd(t, this, !1, n);
	}
	get $doc() {
		return this.$pos(0);
	}
};
function Yd(e) {
	return new X({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = q(e.getAttributes, void 0, r);
			if (i === !1 || i === null) return null;
			let { tr: a } = t, o = r[r.length - 1], s = r[0];
			if (o) {
				let r = s.search(/\S/), c = n.from + s.indexOf(o), l = c + o.length;
				if (vu(n.from, n.to, t.doc).filter((t) => t.mark.type.excluded.find((n) => n === e.type && n !== t.mark.type)).filter((e) => e.to > c).length) return null;
				l < n.to && a.delete(l, n.to), c > n.from && a.delete(n.from + r, c);
				let u = n.from + r + o.length;
				a.addMark(n.from + r, u, e.type.create(i || {})), a.removeStoredMark(e.type);
			}
		},
		undoable: e.undoable
	});
}
function Xd(e) {
	return new X({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = q(e.getAttributes, void 0, r) || {}, { tr: a } = t, o = n.from, s = n.to, c = e.type.create(i);
			if (r[1]) {
				let e = o + r[0].lastIndexOf(r[1]);
				e > s ? e = s : s = e + r[1].length;
				let t = r[0][r[0].length - 1];
				a.insertText(t, o + r[0].length - 1), a.replaceWith(e, s, c);
			} else if (r[0]) {
				let t = e.type.isInline ? o : o - 1;
				a.insert(t, e.type.create(i)).delete(a.mapping.map(o), a.mapping.map(s));
			}
			a.scrollIntoView();
		},
		undoable: e.undoable
	});
}
function Zd(e) {
	return new X({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = t.doc.resolve(n.from), a = q(e.getAttributes, void 0, r) || {};
			if (!i.node(-1).canReplaceWith(i.index(-1), i.indexAfter(-1), e.type)) return null;
			t.tr.delete(n.from, n.to).setBlockType(n.from, n.from, e.type, a);
		},
		undoable: e.undoable
	});
}
function Qd(e) {
	return new X({
		find: e.find,
		handler: ({ state: t, range: n, match: r, chain: i }) => {
			let a = q(e.getAttributes, void 0, r) || {}, o = t.tr.delete(n.from, n.to), s = o.doc.resolve(n.from).blockRange(), c = s && qt(s, e.type, a);
			if (!c) return null;
			if (o.wrap(s, c), e.keepMarks && e.editor) {
				let { selection: n, storedMarks: r } = t, { splittableMarks: i } = e.editor.extensionManager, a = r || n.$to.parentOffset && n.$from.marks();
				if (a) {
					let e = a.filter((e) => i.includes(e.type.name));
					o.ensureMarks(e);
				}
			}
			if (e.keepAttributes) {
				let t = e.type.name === "bulletList" || e.type.name === "orderedList" ? "listItem" : "taskList";
				i().updateAttributes(t, a).run();
			}
			let l = o.doc.resolve(n.from - 1).nodeBefore;
			l && l.type === e.type && on(o.doc, n.from - 1) && (!e.joinPredicate || e.joinPredicate(r, l)) && o.join(n.from - 1);
		},
		undoable: e.undoable
	});
}
var $d = class e extends Ed {
	constructor() {
		super(...arguments), this.type = "node";
	}
	static create(t = {}) {
		return new e(typeof t == "function" ? t() : t);
	}
	configure(e) {
		return super.configure(e);
	}
	extend(e) {
		let t = typeof e == "function" ? e() : e;
		return super.extend(t);
	}
};
function ef(e) {
	return new Od({
		find: e.find,
		handler: ({ state: t, range: n, match: r, pasteEvent: i }) => {
			let a = q(e.getAttributes, void 0, r, i);
			if (a === !1 || a === null) return null;
			let { tr: o } = t, s = r[r.length - 1], c = r[0], l = n.to;
			if (s) {
				let i = c.search(/\S/), u = n.from + c.indexOf(s), d = u + s.length;
				if (vu(n.from, n.to, t.doc).filter((t) => t.mark.type.excluded.find((n) => n === e.type && n !== t.mark.type)).filter((e) => e.to > u).length) return null;
				d < n.to && o.delete(d, n.to), u > n.from && o.delete(n.from + i, u), l = n.from + i + s.length, o.addMark(n.from + i, l, e.type.create(a || {})), r.index !== void 0 && r.input !== void 0 && r.index + r[0].length >= r.input.length || o.removeStoredMark(e.type);
			}
		}
	});
}
//#endregion
//#region node_modules/fast-equals/dist/es/index.mjs
var { getOwnPropertyNames: tf, getOwnPropertySymbols: nf } = Object, { hasOwnProperty: rf } = Object.prototype;
function af(e, t) {
	return function(n, r, i) {
		return e(n, r, i) && t(n, r, i);
	};
}
function of(e) {
	return function(t, n, r) {
		if (!t || !n || typeof t != "object" || typeof n != "object") return e(t, n, r);
		let { cache: i } = r, a = i.get(t), o = i.get(n);
		if (a && o) return a === n && o === t;
		i.set(t, n), i.set(n, t);
		let s = e(t, n, r);
		return i.delete(t), i.delete(n), s;
	};
}
function sf(e) {
	return e?.[Symbol.toStringTag];
}
function cf(e) {
	return tf(e).concat(nf(e));
}
var lf = Object.hasOwn || ((e, t) => rf.call(e, t));
function uf(e, t) {
	return e === t || !e && !t && e !== e && t !== t;
}
var df = "__v", ff = "__o", pf = "_owner", { getOwnPropertyDescriptor: mf, keys: hf } = Object;
function gf(e, t) {
	return e.byteLength === t.byteLength && kf(new Uint8Array(e), new Uint8Array(t));
}
function _f(e, t, n) {
	let r = e.length;
	if (t.length !== r) return !1;
	for (; r-- > 0;) if (!n.equals(e[r], t[r], r, r, e, t, n)) return !1;
	return !0;
}
function vf(e, t) {
	return e.byteLength === t.byteLength && kf(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), new Uint8Array(t.buffer, t.byteOffset, t.byteLength));
}
function yf(e, t) {
	return uf(e.getTime(), t.getTime());
}
function bf(e, t) {
	return e.name === t.name && e.message === t.message && e.cause === t.cause && e.stack === t.stack;
}
function xf(e, t) {
	return e === t;
}
function Sf(e, t, n) {
	let r = e.size;
	if (r !== t.size) return !1;
	if (!r) return !0;
	let i = Array(r), a = e.entries(), o, s, c = 0;
	for (; (o = a.next()) && !o.done;) {
		let r = t.entries(), a = !1, l = 0;
		for (; (s = r.next()) && !s.done;) {
			if (i[l]) {
				l++;
				continue;
			}
			let r = o.value, u = s.value;
			if (n.equals(r[0], u[0], c, l, e, t, n) && n.equals(r[1], u[1], r[0], u[0], e, t, n)) {
				a = i[l] = !0;
				break;
			}
			l++;
		}
		if (!a) return !1;
		c++;
	}
	return !0;
}
var Cf = uf;
function wf(e, t, n) {
	let r = hf(e), i = r.length;
	if (hf(t).length !== i) return !1;
	for (; i-- > 0;) if (!jf(e, t, n, r[i])) return !1;
	return !0;
}
function Tf(e, t, n) {
	let r = cf(e), i = r.length;
	if (cf(t).length !== i) return !1;
	let a, o, s;
	for (; i-- > 0;) if (a = r[i], !jf(e, t, n, a) || (o = mf(e, a), s = mf(t, a), (o || s) && (!o || !s || o.configurable !== s.configurable || o.enumerable !== s.enumerable || o.writable !== s.writable))) return !1;
	return !0;
}
function Ef(e, t) {
	return uf(e.valueOf(), t.valueOf());
}
function Df(e, t) {
	return e.source === t.source && e.flags === t.flags;
}
function Of(e, t, n) {
	let r = e.size;
	if (r !== t.size) return !1;
	if (!r) return !0;
	let i = Array(r), a = e.values(), o, s;
	for (; (o = a.next()) && !o.done;) {
		let r = t.values(), a = !1, c = 0;
		for (; (s = r.next()) && !s.done;) {
			if (!i[c] && n.equals(o.value, s.value, o.value, s.value, e, t, n)) {
				a = i[c] = !0;
				break;
			}
			c++;
		}
		if (!a) return !1;
	}
	return !0;
}
function kf(e, t) {
	let n = e.byteLength;
	if (t.byteLength !== n || e.byteOffset !== t.byteOffset) return !1;
	for (; n-- > 0;) if (e[n] !== t[n]) return !1;
	return !0;
}
function Af(e, t) {
	return e.hostname === t.hostname && e.pathname === t.pathname && e.protocol === t.protocol && e.port === t.port && e.hash === t.hash && e.username === t.username && e.password === t.password;
}
function jf(e, t, n, r) {
	return (r === pf || r === ff || r === df) && (e.$$typeof || t.$$typeof) ? !0 : lf(t, r) && n.equals(e[r], t[r], r, r, e, t, n);
}
var Mf = "[object ArrayBuffer]", Nf = "[object Arguments]", Pf = "[object Boolean]", Ff = "[object DataView]", If = "[object Date]", Lf = "[object Error]", Rf = "[object Map]", zf = "[object Number]", Bf = "[object Object]", Vf = "[object RegExp]", Hf = "[object Set]", Uf = "[object String]", Wf = {
	"[object Int8Array]": !0,
	"[object Uint8Array]": !0,
	"[object Uint8ClampedArray]": !0,
	"[object Int16Array]": !0,
	"[object Uint16Array]": !0,
	"[object Int32Array]": !0,
	"[object Uint32Array]": !0,
	"[object Float16Array]": !0,
	"[object Float32Array]": !0,
	"[object Float64Array]": !0,
	"[object BigInt64Array]": !0,
	"[object BigUint64Array]": !0
}, Gf = "[object URL]", Kf = Object.prototype.toString;
function qf({ areArrayBuffersEqual: e, areArraysEqual: t, areDataViewsEqual: n, areDatesEqual: r, areErrorsEqual: i, areFunctionsEqual: a, areMapsEqual: o, areNumbersEqual: s, areObjectsEqual: c, arePrimitiveWrappersEqual: l, areRegExpsEqual: u, areSetsEqual: d, areTypedArraysEqual: f, areUrlsEqual: p, unknownTagComparators: m }) {
	return function(h, g, _) {
		if (h === g) return !0;
		if (h == null || g == null) return !1;
		let v = typeof h;
		if (v !== typeof g) return !1;
		if (v !== "object") return v === "number" ? s(h, g, _) : v === "function" ? a(h, g, _) : !1;
		let y = h.constructor;
		if (y !== g.constructor) return !1;
		if (y === Object) return c(h, g, _);
		if (Array.isArray(h)) return t(h, g, _);
		if (y === Date) return r(h, g, _);
		if (y === RegExp) return u(h, g, _);
		if (y === Map) return o(h, g, _);
		if (y === Set) return d(h, g, _);
		let b = Kf.call(h);
		if (b === If) return r(h, g, _);
		if (b === Vf) return u(h, g, _);
		if (b === Rf) return o(h, g, _);
		if (b === Hf) return d(h, g, _);
		if (b === Bf) return typeof h.then != "function" && typeof g.then != "function" && c(h, g, _);
		if (b === Gf) return p(h, g, _);
		if (b === Lf) return i(h, g, _);
		if (b === Nf) return c(h, g, _);
		if (Wf[b]) return f(h, g, _);
		if (b === Mf) return e(h, g, _);
		if (b === Ff) return n(h, g, _);
		if (b === Pf || b === zf || b === Uf) return l(h, g, _);
		if (m) {
			let e = m[b];
			if (!e) {
				let t = sf(h);
				t && (e = m[t]);
			}
			if (e) return e(h, g, _);
		}
		return !1;
	};
}
function Jf({ circular: e, createCustomConfig: t, strict: n }) {
	let r = {
		areArrayBuffersEqual: gf,
		areArraysEqual: n ? Tf : _f,
		areDataViewsEqual: vf,
		areDatesEqual: yf,
		areErrorsEqual: bf,
		areFunctionsEqual: xf,
		areMapsEqual: n ? af(Sf, Tf) : Sf,
		areNumbersEqual: Cf,
		areObjectsEqual: n ? Tf : wf,
		arePrimitiveWrappersEqual: Ef,
		areRegExpsEqual: Df,
		areSetsEqual: n ? af(Of, Tf) : Of,
		areTypedArraysEqual: n ? af(kf, Tf) : kf,
		areUrlsEqual: Af,
		unknownTagComparators: void 0
	};
	if (t && (r = Object.assign({}, r, t(r))), e) {
		let e = of(r.areArraysEqual), t = of(r.areMapsEqual), n = of(r.areObjectsEqual), i = of(r.areSetsEqual);
		r = Object.assign({}, r, {
			areArraysEqual: e,
			areMapsEqual: t,
			areObjectsEqual: n,
			areSetsEqual: i
		});
	}
	return r;
}
function Yf(e) {
	return function(t, n, r, i, a, o, s) {
		return e(t, n, s);
	};
}
function Xf({ circular: e, comparator: t, createState: n, equals: r, strict: i }) {
	if (n) return function(a, o) {
		let { cache: s = e ? /* @__PURE__ */ new WeakMap() : void 0, meta: c } = n();
		return t(a, o, {
			cache: s,
			equals: r,
			meta: c,
			strict: i
		});
	};
	if (e) return function(e, n) {
		return t(e, n, {
			cache: /* @__PURE__ */ new WeakMap(),
			equals: r,
			meta: void 0,
			strict: i
		});
	};
	let a = {
		cache: void 0,
		equals: r,
		meta: void 0,
		strict: i
	};
	return function(e, n) {
		return t(e, n, a);
	};
}
var Zf = Qf();
Qf({ strict: !0 }), Qf({ circular: !0 }), Qf({
	circular: !0,
	strict: !0
}), Qf({ createInternalComparator: () => uf }), Qf({
	strict: !0,
	createInternalComparator: () => uf
}), Qf({
	circular: !0,
	createInternalComparator: () => uf
}), Qf({
	circular: !0,
	createInternalComparator: () => uf,
	strict: !0
});
function Qf(e = {}) {
	let { circular: t = !1, createInternalComparator: n, createState: r, strict: i = !1 } = e, a = qf(Jf(e));
	return Xf({
		circular: t,
		comparator: a,
		createState: r,
		equals: n ? n(a) : Yf(a),
		strict: i
	});
}
//#endregion
//#region node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.production.js
var $f = /* @__PURE__ */ o(((e) => {
	var t = u(), n = v();
	function r(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var i = typeof Object.is == "function" ? Object.is : r, a = n.useSyncExternalStore, o = t.useRef, s = t.useEffect, c = t.useMemo, l = t.useDebugValue;
	e.useSyncExternalStoreWithSelector = function(e, t, n, r, u) {
		var d = o(null);
		if (d.current === null) {
			var f = {
				hasValue: !1,
				value: null
			};
			d.current = f;
		} else f = d.current;
		d = c(function() {
			function e(e) {
				if (!a) {
					if (a = !0, o = e, e = r(e), u !== void 0 && f.hasValue) {
						var t = f.value;
						if (u(t, e)) return s = t;
					}
					return s = e;
				}
				if (t = s, i(o, e)) return t;
				var n = r(e);
				return u !== void 0 && u(t, n) ? (o = e, t) : (o = e, s = n);
			}
			var a = !1, o, s, c = n === void 0 ? null : n;
			return [function() {
				return e(t());
			}, c === null ? void 0 : function() {
				return e(c());
			}];
		}, [
			t,
			n,
			r,
			u
		]);
		var p = a(e, d[0], d[1]);
		return s(function() {
			f.hasValue = !0, f.value = p;
		}, [p]), l(p), p;
	};
})), ep = (/* @__PURE__ */ o(((e, t) => {
	t.exports = $f();
})))(), tp = (...e) => (t) => {
	e.forEach((e) => {
		typeof e == "function" ? e(t) : e && (e.current = t);
	});
}, np = ({ contentComponent: e }) => {
	let t = (0, Oc.useSyncExternalStore)(e.subscribe, e.getSnapshot, e.getServerSnapshot);
	return /* @__PURE__ */ (0, z.jsx)(z.Fragment, { children: Object.values(t) });
};
function rp() {
	let e = /* @__PURE__ */ new Set(), t = {};
	return {
		subscribe(t) {
			return e.add(t), () => {
				e.delete(t);
			};
		},
		getSnapshot() {
			return t;
		},
		getServerSnapshot() {
			return t;
		},
		setRenderer(n, r) {
			t = {
				...t,
				[n]: Ec.createPortal(r.reactElement, r.element, n)
			}, e.forEach((e) => e());
		},
		removeRenderer(n) {
			let r = { ...t };
			delete r[n], t = r, e.forEach((e) => e());
		}
	};
}
var ip = class extends R.Component {
	constructor(e) {
		super(e), this.editorContentRef = R.createRef();
	}
	componentDidMount() {
		this.init();
	}
	componentDidUpdate() {
		this.init();
	}
	init() {
		let e = this.props.editor;
		if (e && !e.isDestroyed && e.view.dom?.parentNode) {
			if (e.contentComponent) return;
			let t = this.editorContentRef.current;
			t.append(...e.view.dom.parentNode.childNodes), e.setOptions({ element: t }), e.contentComponent = rp(), e.createNodeViews(), e.isEditorContentInitialized = !0, this.forceUpdate();
		}
	}
	componentWillUnmount() {
		let e = this.props.editor;
		if (e) {
			e.isEditorContentInitialized = !1, e.isDestroyed || e.view.setProps({ nodeViews: {} }), e.contentComponent = null;
			try {
				if (!e.view.dom?.parentNode) return;
				let t = document.createElement("div");
				t.append(...e.view.dom.parentNode.childNodes), e.setOptions({ element: t });
			} catch {}
		}
	}
	render() {
		let { editor: e, innerRef: t, ...n } = this.props;
		return /* @__PURE__ */ (0, z.jsxs)(z.Fragment, { children: [/* @__PURE__ */ (0, z.jsx)("div", {
			ref: tp(t, this.editorContentRef),
			...n
		}), e?.contentComponent && /* @__PURE__ */ (0, z.jsx)(np, { contentComponent: e.contentComponent })] });
	}
}, ap = (0, R.forwardRef)((e, t) => {
	let n = R.useMemo(() => Math.floor(Math.random() * 4294967295).toString(), [e.editor]);
	return R.createElement(ip, {
		key: n,
		innerRef: t,
		...e
	});
}), op = R.memo(ap), sp = typeof window < "u" ? R.useLayoutEffect : R.useEffect, cp = class {
	constructor(e) {
		this.transactionNumber = 0, this.lastTransactionNumber = 0, this.subscribers = /* @__PURE__ */ new Set(), this.editor = e, this.lastSnapshot = {
			editor: e,
			transactionNumber: 0
		}, this.getSnapshot = this.getSnapshot.bind(this), this.getServerSnapshot = this.getServerSnapshot.bind(this), this.watch = this.watch.bind(this), this.subscribe = this.subscribe.bind(this);
	}
	getSnapshot() {
		return this.transactionNumber === this.lastTransactionNumber ? this.lastSnapshot : (this.lastTransactionNumber = this.transactionNumber, this.lastSnapshot = {
			editor: this.editor,
			transactionNumber: this.transactionNumber
		}, this.lastSnapshot);
	}
	getServerSnapshot() {
		return {
			editor: null,
			transactionNumber: 0
		};
	}
	subscribe(e) {
		return this.subscribers.add(e), () => {
			this.subscribers.delete(e);
		};
	}
	watch(e) {
		if (this.editor = e, this.editor) {
			let e = () => {
				this.transactionNumber += 1, this.subscribers.forEach((e) => e());
			}, t = this.editor;
			return t.on("transaction", e), () => {
				t.off("transaction", e);
			};
		}
	}
};
function lp(e) {
	let [t] = (0, R.useState)(() => new cp(e.editor)), n = (0, ep.useSyncExternalStoreWithSelector)(t.subscribe, t.getSnapshot, t.getServerSnapshot, e.selector, e.equalityFn ?? Zf);
	return sp(() => t.watch(e.editor), [e.editor, t]), (0, R.useDebugValue)(n), n;
}
var up = !1, dp = typeof window > "u", fp = dp || !!(typeof window < "u" && window.next), pp = class e {
	constructor(e) {
		this.editor = null, this.subscriptions = /* @__PURE__ */ new Set(), this.isComponentMounted = !1, this.previousDeps = null, this.instanceId = "", this.options = e, this.subscriptions = /* @__PURE__ */ new Set(), this.setEditor(this.getInitialEditor()), this.scheduleDestroy(), this.getEditor = this.getEditor.bind(this), this.getServerSnapshot = this.getServerSnapshot.bind(this), this.subscribe = this.subscribe.bind(this), this.refreshEditorInstance = this.refreshEditorInstance.bind(this), this.scheduleDestroy = this.scheduleDestroy.bind(this), this.onRender = this.onRender.bind(this), this.createEditor = this.createEditor.bind(this);
	}
	setEditor(e) {
		this.editor = e, this.instanceId = Math.random().toString(36).slice(2, 9), this.subscriptions.forEach((e) => e());
	}
	getInitialEditor() {
		let e = this.options.current.immediatelyRender, t = e ?? !0;
		return dp ? (t && up && console.warn("SSR detected. `immediatelyRender` has been set to false to avoid hydration mismatches"), t = !1) : fp && e === void 0 && (t = !1, up && console.warn("Next.js detected. `immediatelyRender` defaults to false to avoid hydration mismatches. Pass `immediatelyRender: true` explicitly if you are rendering the editor only on the client.")), t ? this.createEditor() : null;
	}
	createEditor() {
		return new Jd({
			...this.options.current,
			onBeforeCreate: (...e) => {
				var t;
				return (t = this.options.current).onBeforeCreate?.call(t, ...e);
			},
			onBlur: (...e) => {
				var t;
				return (t = this.options.current).onBlur?.call(t, ...e);
			},
			onCreate: (...e) => {
				var t;
				return (t = this.options.current).onCreate?.call(t, ...e);
			},
			onDestroy: (...e) => {
				var t;
				return (t = this.options.current).onDestroy?.call(t, ...e);
			},
			onFocus: (...e) => {
				var t;
				return (t = this.options.current).onFocus?.call(t, ...e);
			},
			onSelectionUpdate: (...e) => {
				var t;
				return (t = this.options.current).onSelectionUpdate?.call(t, ...e);
			},
			onTransaction: (...e) => {
				var t;
				return (t = this.options.current).onTransaction?.call(t, ...e);
			},
			onUpdate: (...e) => {
				var t;
				return (t = this.options.current).onUpdate?.call(t, ...e);
			},
			onContentError: (...e) => {
				var t;
				return (t = this.options.current).onContentError?.call(t, ...e);
			},
			onDrop: (...e) => {
				var t;
				return (t = this.options.current).onDrop?.call(t, ...e);
			},
			onPaste: (...e) => {
				var t;
				return (t = this.options.current).onPaste?.call(t, ...e);
			},
			onDelete: (...e) => {
				var t;
				return (t = this.options.current).onDelete?.call(t, ...e);
			}
		});
	}
	getEditor() {
		return this.editor;
	}
	getServerSnapshot() {
		return null;
	}
	subscribe(e) {
		return this.subscriptions.add(e), () => {
			this.subscriptions.delete(e);
		};
	}
	static compareOptions(e, t) {
		return Object.keys(e).every((n) => [
			"onCreate",
			"onBeforeCreate",
			"onDestroy",
			"onUpdate",
			"onTransaction",
			"onFocus",
			"onBlur",
			"onSelectionUpdate",
			"onContentError",
			"onDrop",
			"onPaste"
		].includes(n) ? !0 : n === "extensions" && e.extensions && t.extensions ? e.extensions.length === t.extensions.length ? e.extensions.every((e, n) => e === t.extensions?.[n]) : !1 : e[n] === t[n]);
	}
	onRender(t) {
		return () => (this.isComponentMounted = !0, clearTimeout(this.scheduledDestructionTimeout), this.editor && !this.editor.isDestroyed && t.length === 0 ? e.compareOptions(this.options.current, this.editor.options) || this.editor.setOptions({
			...this.options.current,
			editable: this.editor.isEditable
		}) : this.refreshEditorInstance(t), () => {
			this.isComponentMounted = !1, this.scheduleDestroy();
		});
	}
	refreshEditorInstance(e) {
		if (this.editor && !this.editor.isDestroyed) {
			if (this.previousDeps === null) {
				this.previousDeps = e;
				return;
			}
			if (this.previousDeps.length === e.length && this.previousDeps.every((t, n) => t === e[n])) return;
		}
		this.editor && !this.editor.isDestroyed && this.editor.destroy(), this.setEditor(this.createEditor()), this.previousDeps = e;
	}
	scheduleDestroy() {
		let e = this.instanceId, t = this.editor;
		this.scheduledDestructionTimeout = setTimeout(() => {
			if (this.isComponentMounted && this.instanceId === e) {
				t && t.setOptions(this.options.current);
				return;
			}
			t && !t.isDestroyed && (t.destroy(), this.instanceId === e && this.setEditor(null));
		}, 1);
	}
};
function mp(e = {}, t = []) {
	let n = (0, R.useRef)(e);
	n.current = e;
	let [r] = (0, R.useState)(() => new pp(n)), i = (0, Oc.useSyncExternalStore)(r.subscribe, r.getEditor, r.getServerSnapshot);
	return (0, R.useDebugValue)(i), (0, R.useEffect)(r.onRender(t)), lp({
		editor: i,
		selector: ({ transactionNumber: t }) => e.shouldRerenderOnTransaction === !1 || e.shouldRerenderOnTransaction === void 0 ? null : e.immediatelyRender && t === 0 ? 0 : t + 1
	}), i;
}
var hp = (0, R.createContext)({ editor: null });
hp.Consumer;
var gp = (0, R.createContext)({
	onDragStart: () => {},
	nodeViewContentChildren: void 0,
	nodeViewContentRef: () => {}
}), _p = () => (0, R.useContext)(gp);
R.forwardRef((e, t) => {
	let { onDragStart: n } = _p();
	return /* @__PURE__ */ (0, z.jsx)(e.as || "div", {
		...e,
		ref: t,
		"data-node-view-wrapper": "",
		onDragStart: n,
		style: {
			whiteSpace: "normal",
			...e.style
		}
	});
}), R.createContext({ markViewContentRef: () => {} });
var vp = (0, R.createContext)({ get editor() {
	throw Error("useTiptap must be used within a <Tiptap> provider");
} });
vp.displayName = "TiptapContext";
var yp = () => (0, R.useContext)(vp);
function bp({ editor: e, instance: t, children: n }) {
	let r = e ?? t;
	if (!r) throw Error("Tiptap: An editor instance is required. Pass a non-null `editor` prop.");
	let i = (0, R.useMemo)(() => ({ editor: r }), [r]), a = (0, R.useMemo)(() => ({ editor: r }), [r]);
	return /* @__PURE__ */ (0, z.jsx)(hp.Provider, {
		value: a,
		children: /* @__PURE__ */ (0, z.jsx)(vp.Provider, {
			value: i,
			children: n
		})
	});
}
bp.displayName = "Tiptap";
function xp({ ...e }) {
	let { editor: t } = yp();
	return /* @__PURE__ */ (0, z.jsx)(op, {
		editor: t,
		...e
	});
}
xp.displayName = "Tiptap.Content", Object.assign(bp, { Content: xp });
//#endregion
//#region node_modules/@tiptap/core/dist/jsx-runtime/jsx-runtime.js
var Sp = (e, t) => {
	if (e === "slot") return 0;
	if (e instanceof Function) return e(t);
	let { children: n, ...r } = t ?? {};
	if (e === "svg") throw Error("SVG elements are not supported in the JSX syntax, use the array syntax instead");
	return [
		e,
		r,
		n
	];
};
//#endregion
//#region node_modules/@tiptap/extension-blockquote/dist/index.js
function Cp(e, t, n) {
	for (let r = 0;; r++) {
		if (r == e.childCount || r == t.childCount) return e.childCount == t.childCount ? null : n;
		let i = e.child(r), a = t.child(r);
		if (i == a) {
			n += i.nodeSize;
			continue;
		}
		if (!i.sameMarkup(a)) return n;
		if (i.isText && i.text != a.text) {
			for (let e = 0; i.text[e] == a.text[e]; e++) n++;
			return n;
		}
		if (i.content.size || a.content.size) {
			let e = Cp(i.content, a.content, n + 1);
			if (e != null) return e;
		}
		n += i.nodeSize;
	}
}
function wp(e, t, n, r) {
	for (let i = e.childCount, a = t.childCount;;) {
		if (i == 0 || a == 0) return i == a ? null : {
			a: n,
			b: r
		};
		let o = e.child(--i), s = t.child(--a), c = o.nodeSize;
		if (o == s) {
			n -= c, r -= c;
			continue;
		}
		if (!o.sameMarkup(s)) return {
			a: n,
			b: r
		};
		if (o.isText && o.text != s.text) {
			let e = 0, t = Math.min(o.text.length, s.text.length);
			for (; e < t && o.text[o.text.length - e - 1] == s.text[s.text.length - e - 1];) e++, n--, r--;
			return {
				a: n,
				b: r
			};
		}
		if (o.content.size || s.content.size) {
			let e = wp(o.content, s.content, n - 1, r - 1);
			if (e) return e;
		}
		n -= c, r -= c;
	}
}
var Tp = class e {
	constructor(e, t) {
		if (this.content = e, this.size = t || 0, t == null) for (let t = 0; t < e.length; t++) this.size += e[t].nodeSize;
	}
	nodesBetween(e, t, n, r = 0, i) {
		for (let a = 0, o = 0; o < t; a++) {
			let s = this.content[a], c = o + s.nodeSize;
			if (c > e && n(s, r + o, i || null, a) !== !1 && s.content.size) {
				let i = o + 1;
				s.nodesBetween(Math.max(0, e - i), Math.min(s.content.size, t - i), n, r + i);
			}
			o = c;
		}
	}
	descendants(e) {
		this.nodesBetween(0, this.size, e);
	}
	textBetween(e, t, n, r) {
		let i = "", a = !0;
		return this.nodesBetween(e, t, (o, s) => {
			let c = o.isText ? o.text.slice(Math.max(e, s) - s, t - s) : o.isLeaf ? r ? typeof r == "function" ? r(o) : r : o.type.spec.leafText ? o.type.spec.leafText(o) : "" : "";
			o.isBlock && (o.isLeaf && c || o.isTextblock) && n && (a ? a = !1 : i += n), i += c;
		}, 0), i;
	}
	append(t) {
		if (!t.size) return this;
		if (!this.size) return t;
		let n = this.lastChild, r = t.firstChild, i = this.content.slice(), a = 0;
		for (n.isText && n.sameMarkup(r) && (i[i.length - 1] = n.withText(n.text + r.text), a = 1); a < t.content.length; a++) i.push(t.content[a]);
		return new e(i, this.size + t.size);
	}
	cut(t, n = this.size) {
		if (t == 0 && n == this.size) return this;
		let r = [], i = 0;
		if (n > t) for (let e = 0, a = 0; a < n; e++) {
			let o = this.content[e], s = a + o.nodeSize;
			s > t && ((a < t || s > n) && (o = o.isText ? o.cut(Math.max(0, t - a), Math.min(o.text.length, n - a)) : o.cut(Math.max(0, t - a - 1), Math.min(o.content.size, n - a - 1))), r.push(o), i += o.nodeSize), a = s;
		}
		return new e(r, i);
	}
	cutByIndex(t, n) {
		return t == n ? e.empty : t == 0 && n == this.content.length ? this : new e(this.content.slice(t, n));
	}
	replaceChild(t, n) {
		let r = this.content[t];
		if (r == n) return this;
		let i = this.content.slice(), a = this.size + n.nodeSize - r.nodeSize;
		return i[t] = n, new e(i, a);
	}
	addToStart(t) {
		return new e([t].concat(this.content), this.size + t.nodeSize);
	}
	addToEnd(t) {
		return new e(this.content.concat(t), this.size + t.nodeSize);
	}
	eq(e) {
		if (this.content.length != e.content.length) return !1;
		for (let t = 0; t < this.content.length; t++) if (!this.content[t].eq(e.content[t])) return !1;
		return !0;
	}
	get firstChild() {
		return this.content.length ? this.content[0] : null;
	}
	get lastChild() {
		return this.content.length ? this.content[this.content.length - 1] : null;
	}
	get childCount() {
		return this.content.length;
	}
	child(e) {
		let t = this.content[e];
		if (!t) throw RangeError("Index " + e + " out of range for " + this);
		return t;
	}
	maybeChild(e) {
		return this.content[e] || null;
	}
	forEach(e) {
		for (let t = 0, n = 0; t < this.content.length; t++) {
			let r = this.content[t];
			e(r, n, t), n += r.nodeSize;
		}
	}
	findDiffStart(e, t = 0) {
		return Cp(this, e, t);
	}
	findDiffEnd(e, t = this.size, n = e.size) {
		return wp(this, e, t, n);
	}
	findIndex(e) {
		if (e == 0) return Dp(0, e);
		if (e == this.size) return Dp(this.content.length, e);
		if (e > this.size || e < 0) throw RangeError(`Position ${e} outside of fragment (${this})`);
		for (let t = 0, n = 0;; t++) {
			let r = this.child(t), i = n + r.nodeSize;
			if (i >= e) return i == e ? Dp(t + 1, i) : Dp(t, n);
			n = i;
		}
	}
	toString() {
		return "<" + this.toStringInner() + ">";
	}
	toStringInner() {
		return this.content.join(", ");
	}
	toJSON() {
		return this.content.length ? this.content.map((e) => e.toJSON()) : null;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		if (!Array.isArray(n)) throw RangeError("Invalid input for Fragment.fromJSON");
		return e.fromArray(n.map(t.nodeFromJSON));
	}
	static fromArray(t) {
		if (!t.length) return e.empty;
		let n, r = 0;
		for (let e = 0; e < t.length; e++) {
			let i = t[e];
			r += i.nodeSize, e && i.isText && t[e - 1].sameMarkup(i) ? (n ||= t.slice(0, e), n[n.length - 1] = i.withText(n[n.length - 1].text + i.text)) : n && n.push(i);
		}
		return new e(n || t, r);
	}
	static from(t) {
		if (!t) return e.empty;
		if (t instanceof e) return t;
		if (Array.isArray(t)) return this.fromArray(t);
		if (t.attrs) return new e([t], t.nodeSize);
		throw RangeError("Can not convert " + t + " to a Fragment" + (t.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
	}
};
Tp.empty = new Tp([], 0);
var Ep = {
	index: 0,
	offset: 0
};
function Dp(e, t) {
	return Ep.index = e, Ep.offset = t, Ep;
}
function Op(e, t) {
	if (e === t) return !0;
	if (!(e && typeof e == "object") || !(t && typeof t == "object")) return !1;
	let n = Array.isArray(e);
	if (Array.isArray(t) != n) return !1;
	if (n) {
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!Op(e[n], t[n])) return !1;
	} else {
		for (let n in e) if (!(n in t) || !Op(e[n], t[n])) return !1;
		for (let n in t) if (!(n in e)) return !1;
	}
	return !0;
}
var kp = class e {
	constructor(e, t) {
		this.type = e, this.attrs = t;
	}
	addToSet(e) {
		let t, n = !1;
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.eq(i)) return e;
			if (this.type.excludes(i.type)) t ||= e.slice(0, r);
			else if (i.type.excludes(this.type)) return e;
			else !n && i.type.rank > this.type.rank && (t ||= e.slice(0, r), t.push(this), n = !0), t && t.push(i);
		}
		return t ||= e.slice(), n || t.push(this), t;
	}
	removeFromSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
		return !1;
	}
	eq(e) {
		return this == e || this.type == e.type && Op(this.attrs, e.attrs);
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Mark.fromJSON");
		let n = e.marks[t.type];
		if (!n) throw RangeError(`There is no mark type ${t.type} in this schema`);
		let r = n.create(t.attrs);
		return n.checkAttrs(r.attrs), r;
	}
	static sameSet(e, t) {
		if (e == t) return !0;
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!e[n].eq(t[n])) return !1;
		return !0;
	}
	static setFrom(t) {
		if (!t || Array.isArray(t) && t.length == 0) return e.none;
		if (t instanceof e) return [t];
		let n = t.slice();
		return n.sort((e, t) => e.type.rank - t.type.rank), n;
	}
};
kp.none = [];
var Ap = class extends Error {}, jp = class e {
	constructor(e, t, n) {
		this.content = e, this.openStart = t, this.openEnd = n;
	}
	get size() {
		return this.content.size - this.openStart - this.openEnd;
	}
	insertAt(t, n) {
		let r = Np(this.content, t + this.openStart, n, this.openStart + 1, this.openEnd + 1);
		return r && new e(r, this.openStart, this.openEnd);
	}
	removeBetween(t, n) {
		return new e(Mp(this.content, t + this.openStart, n + this.openStart), this.openStart, this.openEnd);
	}
	eq(e) {
		return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
	}
	toString() {
		return this.content + "(" + this.openStart + "," + this.openEnd + ")";
	}
	toJSON() {
		if (!this.content.size) return null;
		let e = { content: this.content.toJSON() };
		return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		let r = n.openStart || 0, i = n.openEnd || 0;
		if (typeof r != "number" || typeof i != "number") throw RangeError("Invalid input for Slice.fromJSON");
		return new e(Tp.fromJSON(t, n.content), r, i);
	}
	static maxOpen(t, n = !0) {
		let r = 0, i = 0;
		for (let e = t.firstChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.firstChild) r++;
		for (let e = t.lastChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.lastChild) i++;
		return new e(t, r, i);
	}
};
jp.empty = new jp(Tp.empty, 0, 0);
function Mp(e, t, n) {
	let { index: r, offset: i } = e.findIndex(t), a = e.maybeChild(r), { index: o, offset: s } = e.findIndex(n);
	if (i == t || a.isText) {
		if (s != n && !e.child(o).isText) throw RangeError("Removing non-flat range");
		return e.cut(0, t).append(e.cut(n));
	}
	if (r != o) throw RangeError("Removing non-flat range");
	return e.replaceChild(r, a.copy(Mp(a.content, t - i - 1, n - i - 1)));
}
function Np(e, t, n, r, i, a) {
	let { index: o, offset: s } = e.findIndex(t), c = e.maybeChild(o);
	if (s == t || c.isText) return a && r <= 0 && i <= 0 && !a.canReplace(o, o, n) ? null : e.cut(0, t).append(n).append(e.cut(t));
	let l = Np(c.content, t - s - 1, n, o == 0 ? r - 1 : 0, o == e.childCount - 1 ? i - 1 : 0, c);
	return l && e.replaceChild(o, c.copy(l));
}
function Pp(e, t, n) {
	if (n.openStart > e.depth) throw new Ap("Inserted content deeper than insertion position");
	if (e.depth - n.openStart != t.depth - n.openEnd) throw new Ap("Inconsistent open depths");
	return Fp(e, t, n, 0);
}
function Fp(e, t, n, r) {
	let i = e.index(r), a = e.node(r);
	if (i == t.index(r) && r < e.depth - n.openStart) {
		let o = Fp(e, t, n, r + 1);
		return a.copy(a.content.replaceChild(i, o));
	} else if (!n.content.size) return Bp(a, Hp(e, t, r));
	else if (!n.openStart && !n.openEnd && e.depth == r && t.depth == r) {
		let r = e.parent, i = r.content;
		return Bp(r, i.cut(0, e.parentOffset).append(n.content).append(i.cut(t.parentOffset)));
	} else {
		let { start: i, end: o } = Up(n, e);
		return Bp(a, Vp(e, i, o, t, r));
	}
}
function Ip(e, t) {
	if (!t.type.compatibleContent(e.type)) throw new Ap("Cannot join " + t.type.name + " onto " + e.type.name);
}
function Lp(e, t, n) {
	let r = e.node(n);
	return Ip(r, t.node(n)), r;
}
function Rp(e, t) {
	let n = t.length - 1;
	n >= 0 && e.isText && e.sameMarkup(t[n]) ? t[n] = e.withText(t[n].text + e.text) : t.push(e);
}
function zp(e, t, n, r) {
	let i = (t || e).node(n), a = 0, o = t ? t.index(n) : i.childCount;
	e && (a = e.index(n), e.depth > n ? a++ : e.textOffset && (Rp(e.nodeAfter, r), a++));
	for (let e = a; e < o; e++) Rp(i.child(e), r);
	t && t.depth == n && t.textOffset && Rp(t.nodeBefore, r);
}
function Bp(e, t) {
	return e.type.checkContent(t), e.copy(t);
}
function Vp(e, t, n, r, i) {
	let a = e.depth > i && Lp(e, t, i + 1), o = r.depth > i && Lp(n, r, i + 1), s = [];
	return zp(null, e, i, s), a && o && t.index(i) == n.index(i) ? (Ip(a, o), Rp(Bp(a, Vp(e, t, n, r, i + 1)), s)) : (a && Rp(Bp(a, Hp(e, t, i + 1)), s), zp(t, n, i, s), o && Rp(Bp(o, Hp(n, r, i + 1)), s)), zp(r, null, i, s), new Tp(s);
}
function Hp(e, t, n) {
	let r = [];
	return zp(null, e, n, r), e.depth > n && Rp(Bp(Lp(e, t, n + 1), Hp(e, t, n + 1)), r), zp(t, null, n, r), new Tp(r);
}
function Up(e, t) {
	let n = t.depth - e.openStart, r = t.node(n).copy(e.content);
	for (let e = n - 1; e >= 0; e--) r = t.node(e).copy(Tp.from(r));
	return {
		start: r.resolveNoCache(e.openStart + n),
		end: r.resolveNoCache(r.content.size - e.openEnd - n)
	};
}
var Wp = class e {
	constructor(e, t, n) {
		this.pos = e, this.path = t, this.parentOffset = n, this.depth = t.length / 3 - 1;
	}
	resolveDepth(e) {
		return e == null ? this.depth : e < 0 ? this.depth + e : e;
	}
	get parent() {
		return this.node(this.depth);
	}
	get doc() {
		return this.node(0);
	}
	node(e) {
		return this.path[this.resolveDepth(e) * 3];
	}
	index(e) {
		return this.path[this.resolveDepth(e) * 3 + 1];
	}
	indexAfter(e) {
		return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
	}
	start(e) {
		return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
	}
	end(e) {
		return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
	}
	before(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position before the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
	}
	after(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position after the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
	}
	get textOffset() {
		return this.pos - this.path[this.path.length - 1];
	}
	get nodeAfter() {
		let e = this.parent, t = this.index(this.depth);
		if (t == e.childCount) return null;
		let n = this.pos - this.path[this.path.length - 1], r = e.child(t);
		return n ? e.child(t).cut(n) : r;
	}
	get nodeBefore() {
		let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
		return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
	}
	posAtIndex(e, t) {
		t = this.resolveDepth(t);
		let n = this.path[t * 3], r = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
		for (let t = 0; t < e; t++) r += n.child(t).nodeSize;
		return r;
	}
	marks() {
		let e = this.parent, t = this.index();
		if (e.content.size == 0) return kp.none;
		if (this.textOffset) return e.child(t).marks;
		let n = e.maybeChild(t - 1), r = e.maybeChild(t);
		if (!n) {
			let e = n;
			n = r, r = e;
		}
		let i = n.marks;
		for (var a = 0; a < i.length; a++) i[a].type.spec.inclusive === !1 && (!r || !i[a].isInSet(r.marks)) && (i = i[a--].removeFromSet(i));
		return i;
	}
	marksAcross(e) {
		let t = this.parent.maybeChild(this.index());
		if (!t || !t.isInline) return null;
		let n = t.marks, r = e.parent.maybeChild(e.index());
		for (var i = 0; i < n.length; i++) n[i].type.spec.inclusive === !1 && (!r || !n[i].isInSet(r.marks)) && (n = n[i--].removeFromSet(n));
		return n;
	}
	sharedDepth(e) {
		for (let t = this.depth; t > 0; t--) if (this.start(t) <= e && this.end(t) >= e) return t;
		return 0;
	}
	blockRange(e = this, t) {
		if (e.pos < this.pos) return e.blockRange(this);
		for (let n = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); n >= 0; n--) if (e.pos <= this.end(n) && (!t || t(this.node(n)))) return new Jp(this, e, n);
		return null;
	}
	sameParent(e) {
		return this.pos - this.parentOffset == e.pos - e.parentOffset;
	}
	max(e) {
		return e.pos > this.pos ? e : this;
	}
	min(e) {
		return e.pos < this.pos ? e : this;
	}
	toString() {
		let e = "";
		for (let t = 1; t <= this.depth; t++) e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
		return e + ":" + this.parentOffset;
	}
	static resolve(t, n) {
		if (!(n >= 0 && n <= t.content.size)) throw RangeError("Position " + n + " out of range");
		let r = [], i = 0, a = n;
		for (let e = t;;) {
			let { index: t, offset: n } = e.content.findIndex(a), o = a - n;
			if (r.push(e, t, i + n), !o || (e = e.child(t), e.isText)) break;
			a = o - 1, i += n + 1;
		}
		return new e(n, r, a);
	}
	static resolveCached(t, n) {
		let r = qp.get(t);
		if (r) for (let e = 0; e < r.elts.length; e++) {
			let t = r.elts[e];
			if (t.pos == n) return t;
		}
		else qp.set(t, r = new Gp());
		let i = r.elts[r.i] = e.resolve(t, n);
		return r.i = (r.i + 1) % Kp, i;
	}
}, Gp = class {
	constructor() {
		this.elts = [], this.i = 0;
	}
}, Kp = 12, qp = /* @__PURE__ */ new WeakMap(), Jp = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.depth = n;
	}
	get start() {
		return this.$from.before(this.depth + 1);
	}
	get end() {
		return this.$to.after(this.depth + 1);
	}
	get parent() {
		return this.$from.node(this.depth);
	}
	get startIndex() {
		return this.$from.index(this.depth);
	}
	get endIndex() {
		return this.$to.indexAfter(this.depth);
	}
}, Yp = /* @__PURE__ */ Object.create(null), Xp = class e {
	constructor(e, t, n, r = kp.none) {
		this.type = e, this.attrs = t, this.marks = r, this.content = n || Tp.empty;
	}
	get children() {
		return this.content.content;
	}
	get nodeSize() {
		return this.isLeaf ? 1 : 2 + this.content.size;
	}
	get childCount() {
		return this.content.childCount;
	}
	child(e) {
		return this.content.child(e);
	}
	maybeChild(e) {
		return this.content.maybeChild(e);
	}
	forEach(e) {
		this.content.forEach(e);
	}
	nodesBetween(e, t, n, r = 0) {
		this.content.nodesBetween(e, t, n, r, this);
	}
	descendants(e) {
		this.nodesBetween(0, this.content.size, e);
	}
	get textContent() {
		return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
	}
	textBetween(e, t, n, r) {
		return this.content.textBetween(e, t, n, r);
	}
	get firstChild() {
		return this.content.firstChild;
	}
	get lastChild() {
		return this.content.lastChild;
	}
	eq(e) {
		return this == e || this.sameMarkup(e) && this.content.eq(e.content);
	}
	sameMarkup(e) {
		return this.hasMarkup(e.type, e.attrs, e.marks);
	}
	hasMarkup(e, t, n) {
		return this.type == e && Op(this.attrs, t || e.defaultAttrs || Yp) && kp.sameSet(this.marks, n || kp.none);
	}
	copy(t = null) {
		return t == this.content ? this : new e(this.type, this.attrs, t, this.marks);
	}
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.content, t);
	}
	cut(e, t = this.content.size) {
		return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
	}
	slice(e, t = this.content.size, n = !1) {
		if (e == t) return jp.empty;
		let r = this.resolve(e), i = this.resolve(t), a = n ? 0 : r.sharedDepth(t), o = r.start(a);
		return new jp(r.node(a).content.cut(r.pos - o, i.pos - o), r.depth - a, i.depth - a);
	}
	replace(e, t, n) {
		return Pp(this.resolve(e), this.resolve(t), n);
	}
	nodeAt(e) {
		for (let t = this;;) {
			let { index: n, offset: r } = t.content.findIndex(e);
			if (t = t.maybeChild(n), !t) return null;
			if (r == e || t.isText) return t;
			e -= r + 1;
		}
	}
	childAfter(e) {
		let { index: t, offset: n } = this.content.findIndex(e);
		return {
			node: this.content.maybeChild(t),
			index: t,
			offset: n
		};
	}
	childBefore(e) {
		if (e == 0) return {
			node: null,
			index: 0,
			offset: 0
		};
		let { index: t, offset: n } = this.content.findIndex(e);
		if (n < e) return {
			node: this.content.child(t),
			index: t,
			offset: n
		};
		let r = this.content.child(t - 1);
		return {
			node: r,
			index: t - 1,
			offset: n - r.nodeSize
		};
	}
	resolve(e) {
		return Wp.resolveCached(this, e);
	}
	resolveNoCache(e) {
		return Wp.resolve(this, e);
	}
	rangeHasMark(e, t, n) {
		let r = !1;
		return t > e && this.nodesBetween(e, t, (e) => (n.isInSet(e.marks) && (r = !0), !r)), r;
	}
	get isBlock() {
		return this.type.isBlock;
	}
	get isTextblock() {
		return this.type.isTextblock;
	}
	get inlineContent() {
		return this.type.inlineContent;
	}
	get isInline() {
		return this.type.isInline;
	}
	get isText() {
		return this.type.isText;
	}
	get isLeaf() {
		return this.type.isLeaf;
	}
	get isAtom() {
		return this.type.isAtom;
	}
	toString() {
		if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
		let e = this.type.name;
		return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Zp(this.marks, e);
	}
	contentMatchAt(e) {
		let t = this.type.contentMatch.matchFragment(this.content, 0, e);
		if (!t) throw Error("Called contentMatchAt on a node with invalid content");
		return t;
	}
	canReplace(e, t, n = Tp.empty, r = 0, i = n.childCount) {
		let a = this.contentMatchAt(e).matchFragment(n, r, i), o = a && a.matchFragment(this.content, t);
		if (!o || !o.validEnd) return !1;
		for (let e = r; e < i; e++) if (!this.type.allowsMarks(n.child(e).marks)) return !1;
		return !0;
	}
	canReplaceWith(e, t, n, r) {
		if (r && !this.type.allowsMarks(r)) return !1;
		let i = this.contentMatchAt(e).matchType(n), a = i && i.matchFragment(this.content, t);
		return a ? a.validEnd : !1;
	}
	canAppend(e) {
		return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
	}
	check() {
		this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
		let e = kp.none;
		for (let t = 0; t < this.marks.length; t++) {
			let n = this.marks[t];
			n.type.checkAttrs(n.attrs), e = n.addToSet(e);
		}
		if (!kp.sameSet(e, this.marks)) throw RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((e) => e.type.name)}`);
		this.content.forEach((e) => e.check());
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((e) => e.toJSON())), e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Node.fromJSON");
		let n;
		if (t.marks) {
			if (!Array.isArray(t.marks)) throw RangeError("Invalid mark data for Node.fromJSON");
			n = t.marks.map(e.markFromJSON);
		}
		if (t.type == "text") {
			if (typeof t.text != "string") throw RangeError("Invalid text node in JSON");
			return e.text(t.text, n);
		}
		let r = Tp.fromJSON(e, t.content), i = e.nodeType(t.type).create(t.attrs, r, n);
		return i.type.checkAttrs(i.attrs), i;
	}
};
Xp.prototype.text = void 0;
function Zp(e, t) {
	for (let n = e.length - 1; n >= 0; n--) t = e[n].type.name + "(" + t + ")";
	return t;
}
var Qp = class e {
	constructor(e) {
		this.validEnd = e, this.next = [], this.wrapCache = [];
	}
	static parse(t, n) {
		let r = new $p(t, n);
		if (r.next == null) return e.empty;
		let i = em(r);
		r.next && r.err("Unexpected trailing text");
		let a = um(sm(i));
		return dm(a, r), a;
	}
	matchType(e) {
		for (let t = 0; t < this.next.length; t++) if (this.next[t].type == e) return this.next[t].next;
		return null;
	}
	matchFragment(e, t = 0, n = e.childCount) {
		let r = this;
		for (let i = t; r && i < n; i++) r = r.matchType(e.child(i).type);
		return r;
	}
	get inlineContent() {
		return this.next.length != 0 && this.next[0].type.isInline;
	}
	get defaultType() {
		for (let e = 0; e < this.next.length; e++) {
			let { type: t } = this.next[e];
			if (!(t.isText || t.hasRequiredAttrs())) return t;
		}
		return null;
	}
	compatible(e) {
		for (let t = 0; t < this.next.length; t++) for (let n = 0; n < e.next.length; n++) if (this.next[t].type == e.next[n].type) return !0;
		return !1;
	}
	fillBefore(e, t = !1, n = 0) {
		let r = [this];
		function i(a, o) {
			let s = a.matchFragment(e, n);
			if (s && (!t || s.validEnd)) return Tp.from(o.map((e) => e.createAndFill()));
			for (let e = 0; e < a.next.length; e++) {
				let { type: t, next: n } = a.next[e];
				if (!(t.isText || t.hasRequiredAttrs()) && r.indexOf(n) == -1) {
					r.push(n);
					let e = i(n, o.concat(t));
					if (e) return e;
				}
			}
			return null;
		}
		return i(this, []);
	}
	findWrapping(e) {
		for (let t = 0; t < this.wrapCache.length; t += 2) if (this.wrapCache[t] == e) return this.wrapCache[t + 1];
		let t = this.computeWrapping(e);
		return this.wrapCache.push(e, t), t;
	}
	computeWrapping(e) {
		let t = /* @__PURE__ */ Object.create(null), n = [{
			match: this,
			type: null,
			via: null
		}];
		for (; n.length;) {
			let r = n.shift(), i = r.match;
			if (i.matchType(e)) {
				let e = [];
				for (let t = r; t.type; t = t.via) e.push(t.type);
				return e.reverse();
			}
			for (let e = 0; e < i.next.length; e++) {
				let { type: a, next: o } = i.next[e];
				!a.isLeaf && !a.hasRequiredAttrs() && !(a.name in t) && (!r.type || o.validEnd) && (n.push({
					match: a.contentMatch,
					type: a,
					via: r
				}), t[a.name] = !0);
			}
		}
		return null;
	}
	get edgeCount() {
		return this.next.length;
	}
	edge(e) {
		if (e >= this.next.length) throw RangeError(`There's no ${e}th edge in this content match`);
		return this.next[e];
	}
	toString() {
		let e = [];
		function t(n) {
			e.push(n);
			for (let r = 0; r < n.next.length; r++) e.indexOf(n.next[r].next) == -1 && t(n.next[r].next);
		}
		return t(this), e.map((t, n) => {
			let r = n + (t.validEnd ? "*" : " ") + " ";
			for (let n = 0; n < t.next.length; n++) r += (n ? ", " : "") + t.next[n].type.name + "->" + e.indexOf(t.next[n].next);
			return r;
		}).join("\n");
	}
};
Qp.empty = new Qp(!0);
var $p = class {
	constructor(e, t) {
		this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
	}
	get next() {
		return this.tokens[this.pos];
	}
	eat(e) {
		return this.next == e && (this.pos++ || !0);
	}
	err(e) {
		throw SyntaxError(e + " (in content expression '" + this.string + "')");
	}
};
function em(e) {
	let t = [];
	do
		t.push(tm(e));
	while (e.eat("|"));
	return t.length == 1 ? t[0] : {
		type: "choice",
		exprs: t
	};
}
function tm(e) {
	let t = [];
	do
		t.push(nm(e));
	while (e.next && e.next != ")" && e.next != "|");
	return t.length == 1 ? t[0] : {
		type: "seq",
		exprs: t
	};
}
function nm(e) {
	let t = om(e);
	for (;;) if (e.eat("+")) t = {
		type: "plus",
		expr: t
	};
	else if (e.eat("*")) t = {
		type: "star",
		expr: t
	};
	else if (e.eat("?")) t = {
		type: "opt",
		expr: t
	};
	else if (e.eat("{")) t = im(e, t);
	else break;
	return t;
}
function rm(e) {
	/\D/.test(e.next) && e.err("Expected number, got '" + e.next + "'");
	let t = Number(e.next);
	return e.pos++, t;
}
function im(e, t) {
	let n = rm(e), r = n;
	return e.eat(",") && (r = e.next == "}" ? -1 : rm(e)), e.eat("}") || e.err("Unclosed braced range"), {
		type: "range",
		min: n,
		max: r,
		expr: t
	};
}
function am(e, t) {
	let n = e.nodeTypes, r = n[t];
	if (r) return [r];
	let i = [];
	for (let e in n) {
		let r = n[e];
		r.isInGroup(t) && i.push(r);
	}
	return i.length == 0 && e.err("No node type or group '" + t + "' found"), i;
}
function om(e) {
	if (e.eat("(")) {
		let t = em(e);
		return e.eat(")") || e.err("Missing closing paren"), t;
	} else if (/\W/.test(e.next)) e.err("Unexpected token '" + e.next + "'");
	else {
		let t = am(e, e.next).map((t) => (e.inline == null ? e.inline = t.isInline : e.inline != t.isInline && e.err("Mixing inline and block content"), {
			type: "name",
			value: t
		}));
		return e.pos++, t.length == 1 ? t[0] : {
			type: "choice",
			exprs: t
		};
	}
}
function sm(e) {
	let t = [[]];
	return i(a(e, 0), n()), t;
	function n() {
		return t.push([]) - 1;
	}
	function r(e, n, r) {
		let i = {
			term: r,
			to: n
		};
		return t[e].push(i), i;
	}
	function i(e, t) {
		e.forEach((e) => e.to = t);
	}
	function a(e, t) {
		if (e.type == "choice") return e.exprs.reduce((e, n) => e.concat(a(n, t)), []);
		if (e.type == "seq") for (let r = 0;; r++) {
			let o = a(e.exprs[r], t);
			if (r == e.exprs.length - 1) return o;
			i(o, t = n());
		}
		else if (e.type == "star") {
			let o = n();
			return r(t, o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "plus") {
			let o = n();
			return i(a(e.expr, t), o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "opt") return [r(t)].concat(a(e.expr, t));
		else if (e.type == "range") {
			let o = t;
			for (let t = 0; t < e.min; t++) {
				let t = n();
				i(a(e.expr, o), t), o = t;
			}
			if (e.max == -1) i(a(e.expr, o), o);
			else for (let t = e.min; t < e.max; t++) {
				let t = n();
				r(o, t), i(a(e.expr, o), t), o = t;
			}
			return [r(o)];
		} else if (e.type == "name") return [r(t, void 0, e.value)];
		else throw Error("Unknown expr type");
	}
}
function cm(e, t) {
	return t - e;
}
function lm(e, t) {
	let n = [];
	return r(t), n.sort(cm);
	function r(t) {
		let i = e[t];
		if (i.length == 1 && !i[0].term) return r(i[0].to);
		n.push(t);
		for (let e = 0; e < i.length; e++) {
			let { term: t, to: a } = i[e];
			!t && n.indexOf(a) == -1 && r(a);
		}
	}
}
function um(e) {
	let t = /* @__PURE__ */ Object.create(null);
	return n(lm(e, 0));
	function n(r) {
		let i = [];
		r.forEach((t) => {
			e[t].forEach(({ term: t, to: n }) => {
				if (!t) return;
				let r;
				for (let e = 0; e < i.length; e++) i[e][0] == t && (r = i[e][1]);
				lm(e, n).forEach((e) => {
					r || i.push([t, r = []]), r.indexOf(e) == -1 && r.push(e);
				});
			});
		});
		let a = t[r.join(",")] = new Qp(r.indexOf(e.length - 1) > -1);
		for (let e = 0; e < i.length; e++) {
			let r = i[e][1].sort(cm);
			a.next.push({
				type: i[e][0],
				next: t[r.join(",")] || n(r)
			});
		}
		return a;
	}
}
function dm(e, t) {
	for (let n = 0, r = [e]; n < r.length; n++) {
		let e = r[n], i = !e.validEnd, a = [];
		for (let t = 0; t < e.next.length; t++) {
			let { type: n, next: o } = e.next[t];
			a.push(n.name), i && !(n.isText || n.hasRequiredAttrs()) && (i = !1), r.indexOf(o) == -1 && r.push(o);
		}
		i && t.err("Only non-generatable nodes (" + a.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
	}
}
var fm = 65535, pm = 2 ** 16;
function mm(e, t) {
	return e + t * pm;
}
function hm(e) {
	return e & fm;
}
function gm(e) {
	return (e - (e & fm)) / pm;
}
var _m = 1, vm = 2, ym = 4, bm = 8, xm = class {
	constructor(e, t, n) {
		this.pos = e, this.delInfo = t, this.recover = n;
	}
	get deleted() {
		return (this.delInfo & bm) > 0;
	}
	get deletedBefore() {
		return (this.delInfo & (_m | ym)) > 0;
	}
	get deletedAfter() {
		return (this.delInfo & (vm | ym)) > 0;
	}
	get deletedAcross() {
		return (this.delInfo & ym) > 0;
	}
}, Sm = class e {
	constructor(t, n = !1) {
		if (this.ranges = t, this.inverted = n, !t.length && e.empty) return e.empty;
	}
	recover(e) {
		let t = 0, n = hm(e);
		if (!this.inverted) for (let e = 0; e < n; e++) t += this.ranges[e * 3 + 2] - this.ranges[e * 3 + 1];
		return this.ranges[n * 3] + t + gm(e);
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	map(e, t = 1) {
		return this._map(e, t, !0);
	}
	_map(e, t, n) {
		let r = 0, i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let o = 0; o < this.ranges.length; o += 3) {
			let s = this.ranges[o] - (this.inverted ? r : 0);
			if (s > e) break;
			let c = this.ranges[o + i], l = this.ranges[o + a], u = s + c;
			if (e <= u) {
				let i = c ? e == s ? -1 : e == u ? 1 : t : t, a = s + r + (i < 0 ? 0 : l);
				if (n) return a;
				let d = e == (t < 0 ? s : u) ? null : mm(o / 3, e - s), f = e == s ? vm : e == u ? _m : ym;
				return (t < 0 ? e != s : e != u) && (f |= bm), new xm(a, f, d);
			}
			r += l - c;
		}
		return n ? e + r : new xm(e + r, 0, null);
	}
	touches(e, t) {
		let n = 0, r = hm(t), i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let t = 0; t < this.ranges.length; t += 3) {
			let o = this.ranges[t] - (this.inverted ? n : 0);
			if (o > e) break;
			let s = this.ranges[t + i];
			if (e <= o + s && t == r * 3) return !0;
			n += this.ranges[t + a] - s;
		}
		return !1;
	}
	forEach(e) {
		let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
		for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
			let a = this.ranges[r], o = a - (this.inverted ? i : 0), s = a + (this.inverted ? 0 : i), c = this.ranges[r + t], l = this.ranges[r + n];
			e(o, o + c, s, s + l), i += l - c;
		}
	}
	invert() {
		return new e(this.ranges, !this.inverted);
	}
	toString() {
		return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
	}
	static offset(t) {
		return t == 0 ? e.empty : new e(t < 0 ? [
			0,
			-t,
			0
		] : [
			0,
			0,
			t
		]);
	}
};
Sm.empty = new Sm([]);
var Cm = /* @__PURE__ */ Object.create(null), wm = class {
	getMap() {
		return Sm.empty;
	}
	merge(e) {
		return null;
	}
	static fromJSON(e, t) {
		if (!t || !t.stepType) throw RangeError("Invalid input for Step.fromJSON");
		let n = Cm[t.stepType];
		if (!n) throw RangeError(`No step type ${t.stepType} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in Cm) throw RangeError("Duplicate use of step JSON ID " + e);
		return Cm[e] = t, t.prototype.jsonID = e, t;
	}
}, Tm = class e {
	constructor(e, t) {
		this.doc = e, this.failed = t;
	}
	static ok(t) {
		return new e(t, null);
	}
	static fail(t) {
		return new e(null, t);
	}
	static fromReplace(t, n, r, i) {
		try {
			return e.ok(t.replace(n, r, i));
		} catch (t) {
			if (t instanceof Ap) return e.fail(t.message);
			throw t;
		}
	}
};
function Em(e, t, n) {
	let r = [];
	for (let i = 0; i < e.childCount; i++) {
		let a = e.child(i);
		a.content.size && (a = a.copy(Em(a.content, t, a))), a.isInline && (a = t(a, n, i)), r.push(a);
	}
	return Tp.fromArray(r);
}
var Dm = class e extends wm {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = e.resolve(this.from), r = n.node(n.sharedDepth(this.to)), i = new jp(Em(t.content, (e, t) => !e.isAtom || !t.type.allowsMarkType(this.mark.type) ? e : e.mark(this.mark.addToSet(e.marks)), r), t.openStart, t.openEnd);
		return Tm.fromReplace(e, this.from, this.to, i);
	}
	invert() {
		return new Om(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "addMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for AddMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
wm.jsonID("addMark", Dm);
var Om = class e extends wm {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = new jp(Em(t.content, (e) => e.mark(this.mark.removeFromSet(e.marks)), e), t.openStart, t.openEnd);
		return Tm.fromReplace(e, this.from, this.to, n);
	}
	invert() {
		return new Dm(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "removeMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for RemoveMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
wm.jsonID("removeMark", Om);
var km = class e extends wm {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return Tm.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
		return Tm.fromReplace(e, this.pos, this.pos + 1, new jp(Tp.from(n), 0, +!t.isLeaf));
	}
	invert(t) {
		let n = t.nodeAt(this.pos);
		if (n) {
			let t = this.mark.addToSet(n.marks);
			if (t.length == n.marks.length) {
				for (let r = 0; r < n.marks.length; r++) if (!n.marks[r].isInSet(t)) return new e(this.pos, n.marks[r]);
				return new e(this.pos, this.mark);
			}
		}
		return new Am(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "addNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for AddNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
wm.jsonID("addNodeMark", km);
var Am = class e extends wm {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return Tm.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
		return Tm.fromReplace(e, this.pos, this.pos + 1, new jp(Tp.from(n), 0, +!t.isLeaf));
	}
	invert(e) {
		let t = e.nodeAt(this.pos);
		return !t || !this.mark.isInSet(t.marks) ? this : new km(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "removeNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
wm.jsonID("removeNodeMark", Am);
var jm = class e extends wm {
	constructor(e, t, n, r = !1) {
		super(), this.from = e, this.to = t, this.slice = n, this.structure = r;
	}
	apply(e) {
		return this.structure && Nm(e, this.from, this.to) ? Tm.fail("Structure replace would overwrite content") : Tm.fromReplace(e, this.from, this.to, this.slice);
	}
	getMap() {
		return new Sm([
			this.from,
			this.to - this.from,
			this.slice.size
		]);
	}
	invert(t) {
		return new e(this.from, this.from + this.slice.size, t.slice(this.from, this.to));
	}
	map(t) {
		let n = t.mapResult(this.to, -1), r = this.from == this.to && e.MAP_BIAS < 0 ? n : t.mapResult(this.from, 1);
		return r.deletedAcross && n.deletedAcross ? null : new e(r.pos, Math.max(r.pos, n.pos), this.slice, this.structure);
	}
	merge(t) {
		if (!(t instanceof e) || t.structure || this.structure) return null;
		if (this.from + this.slice.size == t.from && !this.slice.openEnd && !t.slice.openStart) {
			let n = this.slice.size + t.slice.size == 0 ? jp.empty : new jp(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
			return new e(this.from, this.to + (t.to - t.from), n, this.structure);
		} else if (t.to == this.from && !this.slice.openStart && !t.slice.openEnd) {
			let n = this.slice.size + t.slice.size == 0 ? jp.empty : new jp(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
			return new e(t.from, this.to, n, this.structure);
		} else return null;
	}
	toJSON() {
		let e = {
			stepType: "replace",
			from: this.from,
			to: this.to
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for ReplaceStep.fromJSON");
		return new e(n.from, n.to, jp.fromJSON(t, n.slice), !!n.structure);
	}
};
jm.MAP_BIAS = 1, wm.jsonID("replace", jm);
var Mm = class e extends wm {
	constructor(e, t, n, r, i, a, o = !1) {
		super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = r, this.slice = i, this.insert = a, this.structure = o;
	}
	apply(e) {
		if (this.structure && (Nm(e, this.from, this.gapFrom) || Nm(e, this.gapTo, this.to))) return Tm.fail("Structure gap-replace would overwrite content");
		let t = e.slice(this.gapFrom, this.gapTo);
		if (t.openStart || t.openEnd) return Tm.fail("Gap is not a flat range");
		let n = this.slice.insertAt(this.insert, t.content);
		return n ? Tm.fromReplace(e, this.from, this.to, n) : Tm.fail("Content does not fit in gap");
	}
	getMap() {
		return new Sm([
			this.from,
			this.gapFrom - this.from,
			this.insert,
			this.gapTo,
			this.to - this.gapTo,
			this.slice.size - this.insert
		]);
	}
	invert(t) {
		let n = this.gapTo - this.gapFrom;
		return new e(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, t.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1), i = this.from == this.gapFrom ? n.pos : t.map(this.gapFrom, -1), a = this.to == this.gapTo ? r.pos : t.map(this.gapTo, 1);
		return n.deletedAcross && r.deletedAcross || i < n.pos || a > r.pos ? null : new e(n.pos, r.pos, i, a, this.slice, this.insert, this.structure);
	}
	toJSON() {
		let e = {
			stepType: "replaceAround",
			from: this.from,
			to: this.to,
			gapFrom: this.gapFrom,
			gapTo: this.gapTo,
			insert: this.insert
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number" || typeof n.gapFrom != "number" || typeof n.gapTo != "number" || typeof n.insert != "number") throw RangeError("Invalid input for ReplaceAroundStep.fromJSON");
		return new e(n.from, n.to, n.gapFrom, n.gapTo, jp.fromJSON(t, n.slice), n.insert, !!n.structure);
	}
};
wm.jsonID("replaceAround", Mm);
function Nm(e, t, n) {
	let r = e.resolve(t), i = n - t, a = r.depth;
	for (; i > 0 && a > 0 && r.indexAfter(a) == r.node(a).childCount;) a--, i--;
	if (i > 0) {
		let e = r.node(a).maybeChild(r.indexAfter(a));
		for (; i > 0;) {
			if (!e || e.isLeaf) return !0;
			e = e.firstChild, i--;
		}
	}
	return !1;
}
var Pm = class e extends wm {
	constructor(e, t, n) {
		super(), this.pos = e, this.attr = t, this.value = n;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return Tm.fail("No node at attribute step's position");
		let n = /* @__PURE__ */ Object.create(null);
		for (let e in t.attrs) n[e] = t.attrs[e];
		n[this.attr] = this.value;
		let r = t.type.create(n, null, t.marks);
		return Tm.fromReplace(e, this.pos, this.pos + 1, new jp(Tp.from(r), 0, +!t.isLeaf));
	}
	getMap() {
		return Sm.empty;
	}
	invert(t) {
		return new e(this.pos, this.attr, t.nodeAt(this.pos).attrs[this.attr]);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.attr, this.value);
	}
	toJSON() {
		return {
			stepType: "attr",
			pos: this.pos,
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number" || typeof n.attr != "string") throw RangeError("Invalid input for AttrStep.fromJSON");
		return new e(n.pos, n.attr, n.value);
	}
};
wm.jsonID("attr", Pm);
var Fm = class e extends wm {
	constructor(e, t) {
		super(), this.attr = e, this.value = t;
	}
	apply(e) {
		let t = /* @__PURE__ */ Object.create(null);
		for (let n in e.attrs) t[n] = e.attrs[n];
		t[this.attr] = this.value;
		let n = e.type.create(t, e.content, e.marks);
		return Tm.ok(n);
	}
	getMap() {
		return Sm.empty;
	}
	invert(t) {
		return new e(this.attr, t.attrs[this.attr]);
	}
	map(e) {
		return this;
	}
	toJSON() {
		return {
			stepType: "docAttr",
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.attr != "string") throw RangeError("Invalid input for DocAttrStep.fromJSON");
		return new e(n.attr, n.value);
	}
};
wm.jsonID("docAttr", Fm);
var Im = class extends Error {};
Im = function e(t) {
	let n = Error.call(this, t);
	return n.__proto__ = e.prototype, n;
}, Im.prototype = Object.create(Error.prototype), Im.prototype.constructor = Im, Im.prototype.name = "TransformError";
var Lm = /* @__PURE__ */ Object.create(null), Rm = class {
	constructor(e, t, n) {
		this.$anchor = e, this.$head = t, this.ranges = n || [new zm(e.min(t), e.max(t))];
	}
	get anchor() {
		return this.$anchor.pos;
	}
	get head() {
		return this.$head.pos;
	}
	get from() {
		return this.$from.pos;
	}
	get to() {
		return this.$to.pos;
	}
	get $from() {
		return this.ranges[0].$from;
	}
	get $to() {
		return this.ranges[0].$to;
	}
	get empty() {
		let e = this.ranges;
		for (let t = 0; t < e.length; t++) if (e[t].$from.pos != e[t].$to.pos) return !1;
		return !0;
	}
	content() {
		return this.$from.doc.slice(this.from, this.to, !0);
	}
	replace(e, t = jp.empty) {
		let n = t.content.lastChild, r = null;
		for (let e = 0; e < t.openEnd; e++) r = n, n = n.lastChild;
		let i = e.steps.length, a = this.ranges;
		for (let o = 0; o < a.length; o++) {
			let { $from: s, $to: c } = a[o], l = e.mapping.slice(i);
			e.replaceRange(l.map(s.pos), l.map(c.pos), o ? jp.empty : t), o == 0 && Ym(e, i, (n ? n.isInline : r && r.isTextblock) ? -1 : 1);
		}
	}
	replaceWith(e, t) {
		let n = e.steps.length, r = this.ranges;
		for (let i = 0; i < r.length; i++) {
			let { $from: a, $to: o } = r[i], s = e.mapping.slice(n), c = s.map(a.pos), l = s.map(o.pos);
			i ? e.deleteRange(c, l) : (e.replaceRangeWith(c, l, t), Ym(e, n, t.isInline ? -1 : 1));
		}
	}
	static findFrom(e, t, n = !1) {
		let r = e.parent.inlineContent ? new Hm(e) : Jm(e.node(0), e.parent, e.pos, e.index(), t, n);
		if (r) return r;
		for (let r = e.depth - 1; r >= 0; r--) {
			let i = t < 0 ? Jm(e.node(0), e.node(r), e.before(r + 1), e.index(r), t, n) : Jm(e.node(0), e.node(r), e.after(r + 1), e.index(r) + 1, t, n);
			if (i) return i;
		}
		return null;
	}
	static near(e, t = 1) {
		return this.findFrom(e, t) || this.findFrom(e, -t) || new Km(e.node(0));
	}
	static atStart(e) {
		return Jm(e, e, 0, 0, 1) || new Km(e);
	}
	static atEnd(e) {
		return Jm(e, e, e.content.size, e.childCount, -1) || new Km(e);
	}
	static fromJSON(e, t) {
		if (!t || !t.type) throw RangeError("Invalid input for Selection.fromJSON");
		let n = Lm[t.type];
		if (!n) throw RangeError(`No selection type ${t.type} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in Lm) throw RangeError("Duplicate use of selection JSON ID " + e);
		return Lm[e] = t, t.prototype.jsonID = e, t;
	}
	getBookmark() {
		return Hm.between(this.$anchor, this.$head).getBookmark();
	}
};
Rm.prototype.visible = !0;
var zm = class {
	constructor(e, t) {
		this.$from = e, this.$to = t;
	}
}, Bm = !1;
function Vm(e) {
	!Bm && !e.parent.inlineContent && (Bm = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + e.parent.type.name + ")"));
}
var Hm = class e extends Rm {
	constructor(e, t = e) {
		Vm(e), Vm(t), super(e, t);
	}
	get $cursor() {
		return this.$anchor.pos == this.$head.pos ? this.$head : null;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		if (!r.parent.inlineContent) return Rm.near(r);
		let i = t.resolve(n.map(this.anchor));
		return new e(i.parent.inlineContent ? i : r, r);
	}
	replace(e, t = jp.empty) {
		if (super.replace(e, t), t == jp.empty) {
			let t = this.$from.marksAcross(this.$to);
			t && e.ensureMarks(t);
		}
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor && t.head == this.head;
	}
	getBookmark() {
		return new Um(this.anchor, this.head);
	}
	toJSON() {
		return {
			type: "text",
			anchor: this.anchor,
			head: this.head
		};
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number" || typeof n.head != "number") throw RangeError("Invalid input for TextSelection.fromJSON");
		return new e(t.resolve(n.anchor), t.resolve(n.head));
	}
	static create(e, t, n = t) {
		let r = e.resolve(t);
		return new this(r, n == t ? r : e.resolve(n));
	}
	static between(t, n, r) {
		let i = t.pos - n.pos;
		if ((!r || i) && (r = i >= 0 ? 1 : -1), !n.parent.inlineContent) {
			let e = Rm.findFrom(n, r, !0) || Rm.findFrom(n, -r, !0);
			if (e) n = e.$head;
			else return Rm.near(n, r);
		}
		return t.parent.inlineContent || (i == 0 ? t = n : (t = (Rm.findFrom(t, -r, !0) || Rm.findFrom(t, r, !0)).$anchor, t.pos < n.pos != i < 0 && (t = n))), new e(t, n);
	}
};
Rm.jsonID("text", Hm);
var Um = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		return Hm.between(e.resolve(this.anchor), e.resolve(this.head));
	}
}, Wm = class e extends Rm {
	constructor(e) {
		let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
		super(e, n), this.node = t;
	}
	map(t, n) {
		let { deleted: r, pos: i } = n.mapResult(this.anchor), a = t.resolve(i);
		return r ? Rm.near(a) : new e(a);
	}
	content() {
		return new jp(Tp.from(this.node), 0, 0);
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor;
	}
	toJSON() {
		return {
			type: "node",
			anchor: this.anchor
		};
	}
	getBookmark() {
		return new Gm(this.anchor);
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number") throw RangeError("Invalid input for NodeSelection.fromJSON");
		return new e(t.resolve(n.anchor));
	}
	static create(t, n) {
		return new e(t.resolve(n));
	}
	static isSelectable(e) {
		return !e.isText && e.type.spec.selectable !== !1;
	}
};
Wm.prototype.visible = !1, Rm.jsonID("node", Wm);
var Gm = class e {
	constructor(e) {
		this.anchor = e;
	}
	map(t) {
		let { deleted: n, pos: r } = t.mapResult(this.anchor);
		return n ? new Um(r, r) : new e(r);
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = t.nodeAfter;
		return n && Wm.isSelectable(n) ? new Wm(t) : Rm.near(t);
	}
}, Km = class e extends Rm {
	constructor(e) {
		super(e.resolve(0), e.resolve(e.content.size));
	}
	replace(e, t = jp.empty) {
		if (t == jp.empty) {
			e.delete(0, e.doc.content.size);
			let t = Rm.atStart(e.doc);
			t.eq(e.selection) || e.setSelection(t);
		} else super.replace(e, t);
	}
	toJSON() {
		return { type: "all" };
	}
	static fromJSON(t) {
		return new e(t);
	}
	map(t) {
		return new e(t);
	}
	eq(t) {
		return t instanceof e;
	}
	getBookmark() {
		return qm;
	}
};
Rm.jsonID("all", Km);
var qm = {
	map() {
		return this;
	},
	resolve(e) {
		return new Km(e);
	}
};
function Jm(e, t, n, r, i, a = !1) {
	if (t.inlineContent) return Hm.create(e, n);
	for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < t.childCount : o >= 0; o += i) {
		let r = t.child(o);
		if (!r.isAtom) {
			let t = Jm(e, r, n + i, i < 0 ? r.childCount : 0, i, a);
			if (t) return t;
		} else if (!a && Wm.isSelectable(r)) return Wm.create(e, n - (i < 0 ? r.nodeSize : 0));
		n += r.nodeSize * i;
	}
	return null;
}
function Ym(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof jm || i instanceof Mm)) return;
	let a = e.mapping.maps[r], o;
	a.forEach((e, t, n, r) => {
		o ??= r;
	}), e.setSelection(Rm.near(e.doc.resolve(o), n));
}
function Xm(e, t) {
	return !t || !e ? e : e.bind(t);
}
var Zm = class {
	constructor(e, t, n) {
		this.name = e, this.init = Xm(t.init, n), this.apply = Xm(t.apply, n);
	}
};
new Zm("doc", {
	init(e) {
		return e.doc || e.schema.topNodeType.createAndFill();
	},
	apply(e) {
		return e.doc;
	}
}), new Zm("selection", {
	init(e, t) {
		return e.selection || Rm.atStart(t.doc);
	},
	apply(e) {
		return e.selection;
	}
}), new Zm("storedMarks", {
	init(e) {
		return e.storedMarks || null;
	},
	apply(e, t, n, r) {
		return r.selection.$cursor ? e.storedMarks : null;
	}
}), new Zm("scrollToSelection", {
	init() {
		return 0;
	},
	apply(e, t) {
		return e.scrolledIntoView ? t + 1 : t;
	}
});
var Qm = (e, t) => {
	let { state: n, view: r } = e, { selection: i } = n;
	if (!i.empty) return !1;
	let { $from: a } = i;
	if (a.parentOffset !== 0) return !1;
	let o = a.depth - 1, s = a.node(o), c = a.index(o);
	if (c === 0) return !1;
	if (s.type === t) return e.commands.lift(t.name);
	let l = s.child(c - 1);
	if (l.type !== t || !l.lastChild?.isTextblock) return !1;
	let u = a.before(), d = u - 1 - 1, { tr: f } = n;
	return f.delete(u, a.after()).insert(d, a.parent.content), f.setSelection(Hm.create(f.doc, d)), r.dispatch(f.scrollIntoView()), !0;
}, $m = /^\s*>\s$/, eh = $d.create({
	name: "blockquote",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	content: "block+",
	group: "block",
	defining: !0,
	parseHTML() {
		return [{ tag: "blockquote" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return /* @__PURE__ */ Sp("blockquote", {
			...J(this.options.HTMLAttributes, e),
			children: /* @__PURE__ */ Sp("slot", {})
		});
	},
	parseMarkdown: (e, t) => {
		let n = t.parseBlockChildren ?? t.parseChildren;
		return t.createNode("blockquote", void 0, n(e.tokens || []));
	},
	renderMarkdown: (e, t) => {
		if (!e.content) return "";
		let n = [];
		return e.content.forEach((e, r) => {
			let i = (t.renderChild?.call(t, e, r) ?? t.renderChildren([e])).split("\n").map((e) => e.trim() === "" ? ">" : `> ${e}`);
			n.push(i.join("\n"));
		}), n.join("\n>\n");
	},
	addCommands() {
		return {
			setBlockquote: () => ({ commands: e }) => e.wrapIn(this.name),
			toggleBlockquote: () => ({ commands: e }) => e.toggleWrap(this.name),
			unsetBlockquote: () => ({ commands: e }) => e.lift(this.name)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-Shift-b": () => this.editor.commands.toggleBlockquote(),
			Backspace: () => Qm(this.editor, this.type)
		};
	},
	addInputRules() {
		return [Qd({
			find: $m,
			type: this.type
		})];
	}
}), th = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/, nh = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g, rh = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/, ih = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g, ah = Dd.create({
	name: "bold",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [
			{ tag: "strong" },
			{
				tag: "b",
				getAttrs: (e) => e.style.fontWeight !== "normal" && null
			},
			{
				style: "font-weight=400",
				clearMark: (e) => e.type.name === this.name
			},
			{
				style: "font-weight",
				getAttrs: (e) => /^(bold(er)?|[5-9]\d{2,})$/.test(e) && null
			}
		];
	},
	renderHTML({ HTMLAttributes: e }) {
		return /* @__PURE__ */ Sp("strong", {
			...J(this.options.HTMLAttributes, e),
			children: /* @__PURE__ */ Sp("slot", {})
		});
	},
	markdownTokenName: "strong",
	parseMarkdown: (e, t) => t.applyMark("bold", t.parseInline(e.tokens || [])),
	markdownOptions: { htmlReopen: {
		open: "<strong>",
		close: "</strong>"
	} },
	renderMarkdown: (e, t) => `**${t.renderChildren(e)}**`,
	addCommands() {
		return {
			setBold: () => ({ commands: e }) => e.setMark(this.name),
			toggleBold: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetBold: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-b": () => this.editor.commands.toggleBold(),
			"Mod-B": () => this.editor.commands.toggleBold()
		};
	},
	addInputRules() {
		return [Yd({
			find: th,
			type: this.type
		}), Yd({
			find: rh,
			type: this.type
		})];
	},
	addPasteRules() {
		return [ef({
			find: nh,
			type: this.type
		}), ef({
			find: ih,
			type: this.type
		})];
	}
}), oh = (e) => {
	let t = /`([^`]+)`(?!`)$/.exec(e);
	return !t || t.index > 0 && e[t.index - 1] === "`" ? null : {
		index: t.index,
		text: t[0],
		replaceWith: t[1]
	};
}, sh = (e) => {
	let t = /`([^`]+)`(?!`)/g, n = [], r;
	for (; (r = t.exec(e)) !== null;) r.index > 0 && e[r.index - 1] === "`" || n.push({
		index: r.index,
		text: r[0],
		replaceWith: r[1]
	});
	return n;
}, ch = Dd.create({
	name: "code",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	excludes: "_",
	code: !0,
	exitable: !0,
	parseHTML() {
		return [{ tag: "code" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"code",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "codespan",
	parseMarkdown: (e, t) => t.applyMark("code", [{
		type: "text",
		text: e.text || ""
	}]),
	renderMarkdown: (e, t) => e.content ? `\`${t.renderChildren(e.content)}\`` : "",
	addCommands() {
		return {
			setCode: () => ({ commands: e }) => e.setMark(this.name),
			toggleCode: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetCode: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return { "Mod-e": () => this.editor.commands.toggleCode() };
	},
	addInputRules() {
		return [Yd({
			find: oh,
			type: this.type
		})];
	},
	addPasteRules() {
		return [ef({
			find: sh,
			type: this.type
		})];
	}
}), lh = 4, uh = /^```([a-z]+)?[\s\n]$/, dh = /^~~~([a-z]+)?[\s\n]$/, fh = $d.create({
	name: "codeBlock",
	addOptions() {
		return {
			languageClassPrefix: "language-",
			exitOnTripleEnter: !0,
			exitOnArrowDown: !0,
			defaultLanguage: null,
			enableTabIndentation: !1,
			tabSize: lh,
			HTMLAttributes: {}
		};
	},
	content: "text*",
	marks: "",
	group: "block",
	code: !0,
	defining: !0,
	addAttributes() {
		return { language: {
			default: this.options.defaultLanguage,
			parseHTML: (e) => {
				let { languageClassPrefix: t } = this.options;
				return t && [...e.firstElementChild?.classList || []].filter((e) => e.startsWith(t)).map((e) => e.replace(t, ""))[0] || null;
			},
			rendered: !1
		} };
	},
	parseHTML() {
		return [{
			tag: "pre",
			preserveWhitespace: "full"
		}];
	},
	renderHTML({ node: e, HTMLAttributes: t }) {
		return [
			"pre",
			J(this.options.HTMLAttributes, t),
			[
				"code",
				{ class: e.attrs.language ? this.options.languageClassPrefix + e.attrs.language : null },
				0
			]
		];
	},
	markdownTokenName: "code",
	parseMarkdown: (e, t) => e.raw?.startsWith("```") === !1 && e.raw?.startsWith("~~~") === !1 && e.codeBlockStyle !== "indented" ? [] : t.createNode("codeBlock", { language: e.lang || null }, e.text ? [t.createTextNode(e.text)] : []),
	renderMarkdown: (e, t) => {
		let n = "", r = e.attrs?.language || "";
		return n = e.content ? [
			`\`\`\`${r}`,
			t.renderChildren(e.content),
			"```"
		].join("\n") : `\`\`\`${r}

\`\`\``, n;
	},
	addCommands() {
		return {
			setCodeBlock: (e) => ({ commands: t }) => t.setNode(this.name, e),
			toggleCodeBlock: (e) => ({ commands: t }) => t.toggleNode(this.name, "paragraph", e)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
			Backspace: () => {
				let { empty: e, $anchor: t } = this.editor.state.selection, n = t.pos === 1;
				return !e || t.parent.type.name !== this.name ? !1 : n || !t.parent.textContent.length ? this.editor.commands.clearNodes() : !1;
			},
			Tab: ({ editor: e }) => {
				if (!this.options.enableTabIndentation) return !1;
				let t = this.options.tabSize ?? lh, { state: n } = e, { selection: r } = n, { $from: i, empty: a } = r;
				if (i.parent.type !== this.type) return !1;
				let o = " ".repeat(t);
				return a ? e.commands.insertContent(o) : e.commands.command(({ tr: e }) => {
					let { from: t, to: i } = r, a = n.doc.textBetween(t, i, "\n", "\n").split("\n").map((e) => o + e).join("\n");
					return e.replaceWith(t, i, n.schema.text(a)), !0;
				});
			},
			"Shift-Tab": ({ editor: e }) => {
				if (!this.options.enableTabIndentation) return !1;
				let t = this.options.tabSize ?? lh, { state: n } = e, { selection: r } = n, { $from: i, empty: a } = r;
				return i.parent.type === this.type ? a ? e.commands.command(({ tr: e }) => {
					let { pos: r } = i, a = i.start(), o = i.end(), s = n.doc.textBetween(a, o, "\n", "\n").split("\n"), c = 0, l = 0, u = r - a;
					for (let e = 0; e < s.length; e += 1) {
						if (l + s[e].length >= u) {
							c = e;
							break;
						}
						l += s[e].length + 1;
					}
					let d = s[c].match(/^ */)?.[0] || "", f = Math.min(d.length, t);
					if (f === 0) return !0;
					let p = a;
					for (let e = 0; e < c; e += 1) p += s[e].length + 1;
					return e.delete(p, p + f), r - p <= f && e.setSelection(A.create(e.doc, p)), !0;
				}) : e.commands.command(({ tr: e }) => {
					let { from: i, to: a } = r, o = n.doc.textBetween(i, a, "\n", "\n").split("\n").map((e) => {
						let n = e.match(/^ */)?.[0] || "", r = Math.min(n.length, t);
						return e.slice(r);
					}).join("\n");
					return e.replaceWith(i, a, n.schema.text(o)), !0;
				}) : !1;
			},
			Enter: ({ editor: e }) => {
				if (!this.options.exitOnTripleEnter) return !1;
				let { state: t } = e, { selection: n } = t, { $from: r, empty: i } = n;
				if (!i || r.parent.type !== this.type) return !1;
				let a = r.parentOffset === r.parent.nodeSize - 2, o = r.parent.textContent.endsWith("\n\n");
				return !a || !o ? !1 : e.chain().command(({ tr: e }) => (e.delete(r.pos - 2, r.pos), !0)).exitCode().run();
			},
			ArrowDown: ({ editor: e }) => {
				if (!this.options.exitOnArrowDown) return !1;
				let { state: t } = e, { selection: n, doc: r } = t, { $from: i, empty: a } = n;
				if (!a || i.parent.type !== this.type || i.parentOffset !== i.parent.nodeSize - 2) return !1;
				let o = i.after();
				return o === void 0 ? !1 : r.nodeAt(o) ? e.commands.command(({ tr: e }) => (e.setSelection(k.near(r.resolve(o))), !0)) : e.commands.exitCode();
			}
		};
	},
	addInputRules() {
		return [Zd({
			find: uh,
			type: this.type,
			getAttributes: (e) => ({ language: e[1] })
		}), Zd({
			find: dh,
			type: this.type,
			getAttributes: (e) => ({ language: e[1] })
		})];
	},
	addProseMirrorPlugins() {
		return [new Qn({
			key: new tr("codeBlockVSCodeHandler"),
			props: { handlePaste: (e, t) => {
				if (!t.clipboardData || this.editor.isActive(this.type.name)) return !1;
				let n = t.clipboardData.getData("text/plain"), r = t.clipboardData.getData("vscode-editor-data"), i = (r ? JSON.parse(r) : void 0)?.mode;
				if (!n || !i) return !1;
				let { tr: a, schema: o } = e.state, s = o.text(n.replace(/\r\n?/g, "\n"));
				return a.replaceSelectionWith(this.type.create({ language: i }, s)), a.selection.$from.parent.type !== this.type && a.setSelection(A.near(a.doc.resolve(Math.max(0, a.selection.from - 2)))), a.setMeta("paste", !0), e.dispatch(a), !0;
			} }
		})];
	}
}), ph = $d.create({
	name: "doc",
	topNode: !0,
	content: "block+",
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n\n") : ""
}), mh = $d.create({
	name: "hardBreak",
	markdownTokenName: "br",
	addOptions() {
		return {
			keepMarks: !0,
			HTMLAttributes: {}
		};
	},
	inline: !0,
	group: "inline",
	selectable: !1,
	linebreakReplacement: !0,
	parseHTML() {
		return [{ tag: "br" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return ["br", J(this.options.HTMLAttributes, e)];
	},
	renderText() {
		return "\n";
	},
	renderMarkdown: () => "  \n",
	parseMarkdown: () => ({ type: "hardBreak" }),
	addCommands() {
		return { setHardBreak: () => ({ commands: e, chain: t, state: n, editor: r }) => e.first([() => e.exitCode(), () => e.command(() => {
			let { selection: e, storedMarks: i } = n;
			if (e.$from.parent.type.spec.isolating) return !1;
			let { keepMarks: a } = this.options, { splittableMarks: o } = r.extensionManager, s = i || e.$to.parentOffset && e.$from.marks();
			return t().insertContent({ type: this.name }).command(({ tr: e, dispatch: t }) => {
				if (t && s && a) {
					let t = s.filter((e) => o.includes(e.type.name));
					e.ensureMarks(t);
				}
				return !0;
			}).run();
		})]) };
	},
	addKeyboardShortcuts() {
		return {
			"Mod-Enter": () => this.editor.commands.setHardBreak(),
			"Shift-Enter": () => this.editor.commands.setHardBreak()
		};
	}
}), hh = $d.create({
	name: "heading",
	addOptions() {
		return {
			levels: [
				1,
				2,
				3,
				4,
				5,
				6
			],
			HTMLAttributes: {}
		};
	},
	content: "inline*",
	group: "block",
	defining: !0,
	addAttributes() {
		return { level: {
			default: 1,
			rendered: !1
		} };
	},
	parseHTML() {
		return this.options.levels.map((e) => ({
			tag: `h${e}`,
			attrs: { level: e }
		}));
	},
	renderHTML({ node: e, HTMLAttributes: t }) {
		return [
			`h${this.options.levels.includes(e.attrs.level) ? e.attrs.level : this.options.levels[0]}`,
			J(this.options.HTMLAttributes, t),
			0
		];
	},
	parseMarkdown: (e, t) => t.createNode("heading", { level: e.depth || 1 }, t.parseInline(e.tokens || [])),
	renderMarkdown: (e, t) => {
		let n = e.attrs?.level ? parseInt(e.attrs.level, 10) : 1, r = "#".repeat(n);
		return e.content ? `${r} ${t.renderChildren(e.content)}` : "";
	},
	addCommands() {
		return {
			setHeading: (e) => ({ commands: t }) => this.options.levels.includes(e.level) ? t.setNode(this.name, e) : !1,
			toggleHeading: (e) => ({ commands: t }) => this.options.levels.includes(e.level) ? t.toggleNode(this.name, "paragraph", e) : !1
		};
	},
	addKeyboardShortcuts() {
		return this.options.levels.reduce((e, t) => ({
			...e,
			[`Mod-Alt-${t}`]: () => this.editor.commands.toggleHeading({ level: t })
		}), {});
	},
	addInputRules() {
		return this.options.levels.map((e) => Zd({
			find: RegExp(`^(#{${Math.min(...this.options.levels)},${e}})\\s$`),
			type: this.type,
			getAttributes: { level: e }
		}));
	}
}), gh = $d.create({
	name: "horizontalRule",
	addOptions() {
		return {
			HTMLAttributes: {},
			nextNodeType: "paragraph"
		};
	},
	group: "block",
	parseHTML() {
		return [{ tag: "hr" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return ["hr", J(this.options.HTMLAttributes, e)];
	},
	markdownTokenName: "hr",
	parseMarkdown: (e, t) => t.createNode("horizontalRule"),
	renderMarkdown: () => "---",
	addCommands() {
		return { setHorizontalRule: () => ({ chain: e, state: t }) => {
			if (!sd(t, t.schema.nodes[this.name])) return !1;
			let { selection: n } = t, { $to: r } = n, i = e();
			return Au(n) ? i.insertContentAt(r.pos, { type: this.name }) : i.insertContent({ type: this.name }), i.command(({ state: e, tr: t, dispatch: n }) => {
				if (n) {
					let { $to: n } = t.selection, r = n.end();
					if (n.nodeAfter) n.nodeAfter.isTextblock ? t.setSelection(A.create(t.doc, n.pos + 1)) : n.nodeAfter.isBlock ? t.setSelection(j.create(t.doc, n.pos)) : t.setSelection(A.create(t.doc, n.pos));
					else {
						let i = (e.schema.nodes[this.options.nextNodeType] || n.parent.type.contentMatch.defaultType)?.create();
						i && (t.insert(r, i), t.setSelection(A.create(t.doc, r + 1)));
					}
					t.scrollIntoView();
				}
				return !0;
			}).run();
		} };
	},
	addInputRules() {
		return [Xd({
			find: /^(?:---|—-|___\s|\*\*\*\s)$/,
			type: this.type
		})];
	}
}), _h = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/, vh = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g, yh = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/, bh = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g, xh = Dd.create({
	name: "italic",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [
			{ tag: "em" },
			{
				tag: "i",
				getAttrs: (e) => e.style.fontStyle !== "normal" && null
			},
			{
				style: "font-style=normal",
				clearMark: (e) => e.type.name === this.name
			},
			{ style: "font-style=italic" }
		];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"em",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	addCommands() {
		return {
			setItalic: () => ({ commands: e }) => e.setMark(this.name),
			toggleItalic: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetItalic: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	markdownTokenName: "em",
	parseMarkdown: (e, t) => t.applyMark("italic", t.parseInline(e.tokens || [])),
	markdownOptions: { htmlReopen: {
		open: "<em>",
		close: "</em>"
	} },
	renderMarkdown: (e, t) => `*${t.renderChildren(e)}*`,
	addKeyboardShortcuts() {
		return {
			"Mod-i": () => this.editor.commands.toggleItalic(),
			"Mod-I": () => this.editor.commands.toggleItalic()
		};
	},
	addInputRules() {
		return [Yd({
			find: _h,
			type: this.type
		}), Yd({
			find: yh,
			type: this.type
		})];
	},
	addPasteRules() {
		return [ef({
			find: vh,
			type: this.type
		}), ef({
			find: bh,
			type: this.type
		})];
	}
}), Sh = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", Ch = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", wh = "numeric", Th = "ascii", Eh = "alpha", Dh = "asciinumeric", Oh = "alphanumeric", kh = "domain", Ah = "emoji", jh = "scheme", Mh = "slashscheme", Nh = "whitespace";
function Ph(e, t) {
	return e in t || (t[e] = []), t[e];
}
function Fh(e, t, n) {
	t[wh] && (t[Dh] = !0, t[Oh] = !0), t[Th] && (t[Dh] = !0, t[Eh] = !0), t[Dh] && (t[Oh] = !0), t[Eh] && (t[Oh] = !0), t[Oh] && (t[kh] = !0), t[Ah] && (t[kh] = !0);
	for (let r in t) {
		let t = Ph(r, n);
		t.indexOf(e) < 0 && t.push(e);
	}
}
function Ih(e, t) {
	let n = {};
	for (let r in t) t[r].indexOf(e) >= 0 && (n[r] = !0);
	return n;
}
function Lh(e = null) {
	this.j = {}, this.jr = [], this.jd = null, this.t = e;
}
Lh.groups = {}, Lh.prototype = {
	accepts() {
		return !!this.t;
	},
	go(e) {
		let t = this, n = t.j[e];
		if (n) return n;
		for (let n = 0; n < t.jr.length; n++) {
			let r = t.jr[n][0], i = t.jr[n][1];
			if (i && r.test(e)) return i;
		}
		return t.jd;
	},
	has(e, t = !1) {
		return t ? e in this.j : !!this.go(e);
	},
	ta(e, t, n, r) {
		for (let i = 0; i < e.length; i++) this.tt(e[i], t, n, r);
	},
	tr(e, t, n, r) {
		r ||= Lh.groups;
		let i;
		return t && t.j ? i = t : (i = new Lh(t), n && r && Fh(t, n, r)), this.jr.push([e, i]), i;
	},
	ts(e, t, n, r) {
		let i = this, a = e.length;
		if (!a) return i;
		for (let t = 0; t < a - 1; t++) i = i.tt(e[t]);
		return i.tt(e[a - 1], t, n, r);
	},
	tt(e, t, n, r) {
		r ||= Lh.groups;
		let i = this;
		if (t && t.j) return i.j[e] = t, t;
		let a = t, o, s = i.go(e);
		return s ? (o = new Lh(), Object.assign(o.j, s.j), o.jr.push.apply(o.jr, s.jr), o.jd = s.jd, o.t = s.t) : o = new Lh(), a && (r && (o.t && typeof o.t == "string" ? Fh(a, Object.assign(Ih(o.t, r), n), r) : n && Fh(a, n, r)), o.t = a), i.j[e] = o, o;
	}
};
var Q = (e, t, n, r, i) => e.ta(t, n, r, i), Rh = (e, t, n, r, i) => e.tr(t, n, r, i), zh = (e, t, n, r, i) => e.ts(t, n, r, i), $ = (e, t, n, r, i) => e.tt(t, n, r, i), Bh = "WORD", Vh = "UWORD", Hh = "ASCIINUMERICAL", Uh = "ALPHANUMERICAL", Wh = "LOCALHOST", Gh = "TLD", Kh = "UTLD", qh = "SCHEME", Jh = "SLASH_SCHEME", Yh = "NUM", Xh = "WS", Zh = "NL", Qh = "OPENBRACE", $h = "CLOSEBRACE", eg = "OPENBRACKET", tg = "CLOSEBRACKET", ng = "OPENPAREN", rg = "CLOSEPAREN", ig = "OPENANGLEBRACKET", ag = "CLOSEANGLEBRACKET", og = "FULLWIDTHLEFTPAREN", sg = "FULLWIDTHRIGHTPAREN", cg = "LEFTCORNERBRACKET", lg = "RIGHTCORNERBRACKET", ug = "LEFTWHITECORNERBRACKET", dg = "RIGHTWHITECORNERBRACKET", fg = "FULLWIDTHLESSTHAN", pg = "FULLWIDTHGREATERTHAN", mg = "AMPERSAND", hg = "APOSTROPHE", gg = "ASTERISK", _g = "AT", vg = "BACKSLASH", yg = "BACKTICK", bg = "CARET", xg = "COLON", Sg = "COMMA", Cg = "DOLLAR", wg = "DOT", Tg = "EQUALS", Eg = "EXCLAMATION", Dg = "HYPHEN", Og = "PERCENT", kg = "PIPE", Ag = "PLUS", jg = "POUND", Mg = "QUERY", Ng = "QUOTE", Pg = "FULLWIDTHMIDDLEDOT", Fg = "SEMI", Ig = "SLASH", Lg = "TILDE", Rg = "UNDERSCORE", zg = "EMOJI", Bg = "SYM", Vg = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	ALPHANUMERICAL: Uh,
	AMPERSAND: mg,
	APOSTROPHE: hg,
	ASCIINUMERICAL: Hh,
	ASTERISK: gg,
	AT: _g,
	BACKSLASH: vg,
	BACKTICK: yg,
	CARET: bg,
	CLOSEANGLEBRACKET: ag,
	CLOSEBRACE: $h,
	CLOSEBRACKET: tg,
	CLOSEPAREN: rg,
	COLON: xg,
	COMMA: Sg,
	DOLLAR: Cg,
	DOT: wg,
	EMOJI: zg,
	EQUALS: Tg,
	EXCLAMATION: Eg,
	FULLWIDTHGREATERTHAN: pg,
	FULLWIDTHLEFTPAREN: og,
	FULLWIDTHLESSTHAN: fg,
	FULLWIDTHMIDDLEDOT: Pg,
	FULLWIDTHRIGHTPAREN: sg,
	HYPHEN: Dg,
	LEFTCORNERBRACKET: cg,
	LEFTWHITECORNERBRACKET: ug,
	LOCALHOST: Wh,
	NL: Zh,
	NUM: Yh,
	OPENANGLEBRACKET: ig,
	OPENBRACE: Qh,
	OPENBRACKET: eg,
	OPENPAREN: ng,
	PERCENT: Og,
	PIPE: kg,
	PLUS: Ag,
	POUND: jg,
	QUERY: Mg,
	QUOTE: Ng,
	RIGHTCORNERBRACKET: lg,
	RIGHTWHITECORNERBRACKET: dg,
	SCHEME: qh,
	SEMI: Fg,
	SLASH: Ig,
	SLASH_SCHEME: Jh,
	SYM: Bg,
	TILDE: Lg,
	TLD: Gh,
	UNDERSCORE: Rg,
	UTLD: Kh,
	UWORD: Vh,
	WORD: Bh,
	WS: Xh
}), Hg = /[a-z]/, Ug = /\p{L}/u, Wg = /\p{Emoji}/u, Gg = /\d/, Kg = /\s/, qg = "\r", Jg = "\n", Yg = "️", Xg = "‍", Zg = "￼", Qg = null, $g = null;
function e_(e = []) {
	let t = {};
	Lh.groups = t;
	let n = new Lh();
	Qg ??= i_(Sh), $g ??= i_(Ch), $(n, "'", hg), $(n, "{", Qh), $(n, "}", $h), $(n, "[", eg), $(n, "]", tg), $(n, "(", ng), $(n, ")", rg), $(n, "<", ig), $(n, ">", ag), $(n, "（", og), $(n, "）", sg), $(n, "「", cg), $(n, "」", lg), $(n, "『", ug), $(n, "』", dg), $(n, "＜", fg), $(n, "＞", pg), $(n, "&", mg), $(n, "*", gg), $(n, "@", _g), $(n, "`", yg), $(n, "^", bg), $(n, ":", xg), $(n, ",", Sg), $(n, "$", Cg), $(n, ".", wg), $(n, "=", Tg), $(n, "!", Eg), $(n, "-", Dg), $(n, "%", Og), $(n, "|", kg), $(n, "+", Ag), $(n, "#", jg), $(n, "?", Mg), $(n, "\"", Ng), $(n, "/", Ig), $(n, ";", Fg), $(n, "~", Lg), $(n, "_", Rg), $(n, "\\", vg), $(n, "・", Pg);
	let r = Rh(n, Gg, Yh, { [wh]: !0 });
	Rh(r, Gg, r);
	let i = Rh(r, Hg, Hh, { [Dh]: !0 }), a = Rh(r, Ug, Uh, { [Oh]: !0 }), o = Rh(n, Hg, Bh, { [Th]: !0 });
	Rh(o, Gg, i), Rh(o, Hg, o), Rh(i, Gg, i), Rh(i, Hg, i);
	let s = Rh(n, Ug, Vh, { [Eh]: !0 });
	Rh(s, Hg), Rh(s, Gg, a), Rh(s, Ug, s), Rh(a, Gg, a), Rh(a, Hg), Rh(a, Ug, a);
	let c = $(n, Jg, Zh, { [Nh]: !0 }), l = $(n, qg, Xh, { [Nh]: !0 }), u = Rh(n, Kg, Xh, { [Nh]: !0 });
	$(n, Zg, u), $(l, Jg, c), $(l, Zg, u), Rh(l, Kg, u), $(u, qg), $(u, Jg), Rh(u, Kg, u), $(u, Zg, u);
	let d = Rh(n, Wg, zg, { [Ah]: !0 });
	$(d, "#"), Rh(d, Wg, d), $(d, Yg, d);
	let f = $(d, Xg);
	$(f, "#"), Rh(f, Wg, d);
	let p = [[Hg, o], [Gg, i]], m = [
		[Hg, null],
		[Ug, s],
		[Gg, a]
	];
	for (let e = 0; e < Qg.length; e++) r_(n, Qg[e], Gh, Bh, p);
	for (let e = 0; e < $g.length; e++) r_(n, $g[e], Kh, Vh, m);
	Fh(Gh, {
		tld: !0,
		ascii: !0
	}, t), Fh(Kh, {
		utld: !0,
		alpha: !0
	}, t), r_(n, "file", qh, Bh, p), r_(n, "mailto", qh, Bh, p), r_(n, "http", Jh, Bh, p), r_(n, "https", Jh, Bh, p), r_(n, "ftp", Jh, Bh, p), r_(n, "ftps", Jh, Bh, p), Fh(qh, {
		scheme: !0,
		ascii: !0
	}, t), Fh(Jh, {
		slashscheme: !0,
		ascii: !0
	}, t), e = e.sort((e, t) => e[0] > t[0] ? 1 : -1);
	for (let t = 0; t < e.length; t++) {
		let r = e[t][0], i = e[t][1] ? { [jh]: !0 } : { [Mh]: !0 };
		r.indexOf("-") >= 0 ? i[kh] = !0 : Hg.test(r) ? Gg.test(r) ? i[Dh] = !0 : i[Th] = !0 : i[wh] = !0, zh(n, r, r, i);
	}
	return zh(n, "localhost", Wh, { ascii: !0 }), n.jd = new Lh(Bg), {
		start: n,
		tokens: Object.assign({ groups: t }, Vg)
	};
}
function t_(e, t) {
	let n = n_(t.replace(/[A-Z]/g, (e) => e.toLowerCase())), r = n.length, i = [], a = 0, o = 0;
	for (; o < r;) {
		let s = e, c = null, l = 0, u = null, d = -1, f = -1;
		for (; o < r && (c = s.go(n[o]));) s = c, s.accepts() ? (d = 0, f = 0, u = s) : d >= 0 && (d += n[o].length, f++), l += n[o].length, a += n[o].length, o++;
		a -= d, o -= f, l -= d, i.push({
			t: u.t,
			v: t.slice(a - l, a),
			s: a - l,
			e: a
		});
	}
	return i;
}
function n_(e) {
	let t = [], n = e.length, r = 0;
	for (; r < n;) {
		let i = e.charCodeAt(r), a, o = i < 55296 || i > 56319 || r + 1 === n || (a = e.charCodeAt(r + 1)) < 56320 || a > 57343 ? e[r] : e.slice(r, r + 2);
		t.push(o), r += o.length;
	}
	return t;
}
function r_(e, t, n, r, i) {
	let a, o = t.length;
	for (let n = 0; n < o - 1; n++) {
		let o = t[n];
		e.j[o] ? a = e.j[o] : (a = new Lh(r), a.jr = i.slice(), e.j[o] = a), e = a;
	}
	return a = new Lh(n), a.jr = i.slice(), e.j[t[o - 1]] = a, a;
}
function i_(e) {
	let t = [], n = [], r = 0;
	for (; r < e.length;) {
		let i = 0;
		for (; "0123456789".indexOf(e[r + i]) >= 0;) i++;
		if (i > 0) {
			t.push(n.join(""));
			for (let t = parseInt(e.substring(r, r + i), 10); t > 0; t--) n.pop();
			r += i;
		} else n.push(e[r]), r++;
	}
	return t;
}
var a_ = {
	defaultProtocol: "http",
	events: null,
	format: s_,
	formatHref: s_,
	nl2br: !1,
	tagName: "a",
	target: null,
	rel: null,
	validate: !0,
	truncate: Infinity,
	className: null,
	attributes: null,
	ignoreTags: [],
	render: null
};
function o_(e, t = null) {
	let n = Object.assign({}, a_);
	e && (n = Object.assign(n, e instanceof o_ ? e.o : e));
	let r = n.ignoreTags, i = [];
	for (let e = 0; e < r.length; e++) i.push(r[e].toUpperCase());
	this.o = n, t && (this.defaultRender = t), this.ignoreTags = i;
}
o_.prototype = {
	o: a_,
	ignoreTags: [],
	defaultRender(e) {
		return e;
	},
	check(e) {
		return this.get("validate", e.toString(), e);
	},
	get(e, t, n) {
		let r = t != null, i = this.o[e];
		return i && (typeof i == "object" ? (i = n.t in i ? i[n.t] : a_[e], typeof i == "function" && r && (i = i(t, n))) : typeof i == "function" && r && (i = i(t, n.t, n)), i);
	},
	getObj(e, t, n) {
		let r = this.o[e];
		return typeof r == "function" && t != null && (r = r(t, n.t, n)), r;
	},
	render(e) {
		let t = e.render(this);
		return (this.get("render", null, e) || this.defaultRender)(t, e.t, e);
	}
};
function s_(e) {
	return e;
}
function c_(e, t) {
	this.t = "token", this.v = e, this.tk = t;
}
c_.prototype = {
	isLink: !1,
	toString() {
		return this.v;
	},
	toHref(e) {
		return this.toString();
	},
	toFormattedString(e) {
		let t = this.toString(), n = e.get("truncate", t, this), r = e.get("format", t, this);
		return n && r.length > n ? r.substring(0, n) + "…" : r;
	},
	toFormattedHref(e) {
		return e.get("formatHref", this.toHref(e.get("defaultProtocol")), this);
	},
	startIndex() {
		return this.tk[0].s;
	},
	endIndex() {
		return this.tk[this.tk.length - 1].e;
	},
	toObject(e = a_.defaultProtocol) {
		return {
			type: this.t,
			value: this.toString(),
			isLink: this.isLink,
			href: this.toHref(e),
			start: this.startIndex(),
			end: this.endIndex()
		};
	},
	toFormattedObject(e) {
		return {
			type: this.t,
			value: this.toFormattedString(e),
			isLink: this.isLink,
			href: this.toFormattedHref(e),
			start: this.startIndex(),
			end: this.endIndex()
		};
	},
	validate(e) {
		return e.get("validate", this.toString(), this);
	},
	render(e) {
		let t = this, n = this.toHref(e.get("defaultProtocol")), r = e.get("formatHref", n, this), i = e.get("tagName", n, t), a = this.toFormattedString(e), o = {}, s = e.get("className", n, t), c = e.get("target", n, t), l = e.get("rel", n, t), u = e.getObj("attributes", n, t), d = e.getObj("events", n, t);
		return o.href = r, s && (o.class = s), c && (o.target = c), l && (o.rel = l), u && Object.assign(o, u), {
			tagName: i,
			attributes: o,
			content: a,
			eventListeners: d
		};
	}
};
function l_(e, t) {
	class n extends c_ {
		constructor(t, n) {
			super(t, n), this.t = e;
		}
	}
	for (let e in t) n.prototype[e] = t[e];
	return n.t = e, n;
}
var u_ = l_("email", {
	isLink: !0,
	toHref() {
		return "mailto:" + this.toString();
	}
}), d_ = l_("text"), f_ = l_("nl"), p_ = l_("url", {
	isLink: !0,
	toHref(e = a_.defaultProtocol) {
		return this.hasProtocol() ? this.v : `${e}://${this.v}`;
	},
	hasProtocol() {
		let e = this.tk;
		return e.length >= 2 && e[0].t !== Wh && e[1].t === xg;
	}
}), m_ = (e) => new Lh(e);
function h_({ groups: e }) {
	let t = e.domain.concat([
		mg,
		gg,
		_g,
		vg,
		yg,
		bg,
		Cg,
		Tg,
		Dg,
		Yh,
		Og,
		kg,
		Ag,
		jg,
		Ig,
		Bg,
		Lg,
		Rg
	]), n = [
		hg,
		xg,
		Sg,
		wg,
		Eg,
		Og,
		Mg,
		Ng,
		Fg,
		ig,
		ag,
		Qh,
		$h,
		tg,
		eg,
		ng,
		rg,
		og,
		sg,
		cg,
		lg,
		ug,
		dg,
		fg,
		pg
	], r = [
		mg,
		hg,
		gg,
		vg,
		yg,
		bg,
		Cg,
		Tg,
		Dg,
		Qh,
		$h,
		Og,
		kg,
		Ag,
		jg,
		Mg,
		Ig,
		Bg,
		Lg,
		Rg
	], i = m_(), a = $(i, Lg);
	Q(a, r, a), Q(a, e.domain, a);
	let o = m_(), s = m_(), c = m_();
	Q(i, e.domain, o), Q(i, e.scheme, s), Q(i, e.slashscheme, c), Q(o, r, a), Q(o, e.domain, o);
	let l = $(o, _g);
	$(a, _g, l), $(s, _g, l), $(c, _g, l);
	let u = $(a, wg);
	Q(u, r, a), Q(u, e.domain, a);
	let d = m_();
	Q(l, e.domain, d), Q(d, e.domain, d);
	let f = $(d, wg);
	Q(f, e.domain, d);
	let p = m_(u_);
	Q(f, e.tld, p), Q(f, e.utld, p), $(l, Wh, p);
	let m = $(d, Dg);
	$(m, Dg, m), Q(m, e.domain, d), Q(p, e.domain, d), $(p, wg, f), $(p, Dg, m);
	let h = $(o, Dg), g = $(o, wg);
	$(h, Dg, h), Q(h, e.domain, o), Q(g, r, a), Q(g, e.domain, o);
	let _ = m_(p_);
	Q(g, e.tld, _), Q(g, e.utld, _), Q(_, e.domain, o), Q(_, r, a), $(_, wg, g), $(_, Dg, h), $(_, _g, l);
	let v = $(_, xg), y = m_(p_);
	Q(v, e.numeric, y);
	let b = m_(p_), x = m_();
	Q(b, t, b), Q(b, n, x), Q(x, t, b), Q(x, n, x), $(_, Ig, b), $(y, Ig, b);
	let ee = $(s, xg), te = $($($(c, xg), Ig), Ig);
	Q(s, e.domain, o), $(s, wg, g), $(s, Dg, h), Q(c, e.domain, o), $(c, wg, g), $(c, Dg, h), Q(ee, e.domain, b), $(ee, Ig, b), $(ee, Mg, b), Q(te, e.domain, b), Q(te, t, b), $(te, Ig, b);
	let S = [
		[Qh, $h],
		[eg, tg],
		[ng, rg],
		[ig, ag],
		[og, sg],
		[cg, lg],
		[ug, dg],
		[fg, pg]
	];
	for (let e = 0; e < S.length; e++) {
		let [r, i] = S[e], a = $(b, r);
		$(x, r, a);
		let o = m_(p_);
		Q(a, t, o);
		let s = m_();
		Q(a, n, s), $(a, i, b), Q(o, t, o), Q(o, n, s), Q(s, t, o), Q(s, n, s), $(o, i, b), $(s, i, b);
	}
	return $(i, Wh, _), $(i, Zh, f_), {
		start: i,
		tokens: Vg
	};
}
function g_(e, t, n) {
	let r = n.length, i = 0, a = [], o = [];
	for (; i < r;) {
		let s = e, c = null, l = null, u = 0, d = null, f = -1;
		for (; i < r && !(c = s.go(n[i].t));) o.push(n[i++]);
		for (; i < r && (l = c || s.go(n[i].t));) c = null, s = l, s.accepts() ? (f = 0, d = s) : f >= 0 && f++, i++, u++;
		if (f < 0) i -= u, i < r && (o.push(n[i]), i++);
		else {
			o.length > 0 && (a.push(__(d_, t, o)), o = []), i -= f, u -= f;
			let e = d.t, r = n.slice(i - u, i);
			a.push(__(e, t, r));
		}
	}
	return o.length > 0 && a.push(__(d_, t, o)), a;
}
function __(e, t, n) {
	let r = n[0].s, i = n[n.length - 1].e;
	return new e(t.slice(r, i), n);
}
var v_ = typeof console < "u" && console && console.warn || (() => {}), y_ = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", b_ = {
	scanner: null,
	parser: null,
	tokenQueue: [],
	pluginQueue: [],
	customSchemes: [],
	initialized: !1
};
function x_() {
	return Lh.groups = {}, b_.scanner = null, b_.parser = null, b_.tokenQueue = [], b_.pluginQueue = [], b_.customSchemes = [], b_.initialized = !1, b_;
}
function S_(e, t = !1) {
	if (b_.initialized && v_(`linkifyjs: already initialized - will not register custom scheme "${e}" ${y_}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(e)) throw Error("linkifyjs: incorrect scheme format.\n1. Must only contain digits, lowercase ASCII letters or \"-\"\n2. Cannot start or end with \"-\"\n3. \"-\" cannot repeat");
	b_.customSchemes.push([e, t]);
}
function C_() {
	b_.scanner = e_(b_.customSchemes);
	for (let e = 0; e < b_.tokenQueue.length; e++) b_.tokenQueue[e][1]({ scanner: b_.scanner });
	b_.parser = h_(b_.scanner.tokens);
	for (let e = 0; e < b_.pluginQueue.length; e++) b_.pluginQueue[e][1]({
		scanner: b_.scanner,
		parser: b_.parser
	});
	return b_.initialized = !0, b_;
}
function w_(e) {
	return b_.initialized || C_(), g_(b_.parser.start, e, t_(b_.scanner.start, e));
}
w_.scan = t_;
function T_(e, t = null, n = null) {
	if (t && typeof t == "object") {
		if (n) throw Error(`linkifyjs: Invalid link type ${t}; must be a string`);
		n = t, t = null;
	}
	let r = new o_(n), i = w_(e), a = [];
	for (let e = 0; e < i.length; e++) {
		let n = i[e];
		n.isLink && (!t || n.t === t) && r.check(n) && a.push(n.toFormattedObject(r));
	}
	return a;
}
//#endregion
//#region node_modules/@tiptap/extension-link/dist/index.js
var E_ = "[\0- \xA0 ᠎ -\u2029 　]", D_ = new RegExp(E_), O_ = RegExp(`${E_}$`), k_ = new RegExp(E_, "g");
function A_(e) {
	return e.length === 1 ? e[0].isLink : e.length === 3 && e[1].isLink ? ["()", "[]"].includes(e[0].value + e[2].value) : !1;
}
function j_(e) {
	return new Qn({
		key: new tr("autolink"),
		appendTransaction: (t, n, r) => {
			let i = t.some((e) => e.docChanged) && !n.doc.eq(r.doc), a = t.some((e) => e.getMeta("preventAutolink"));
			if (!i || a) return;
			let { tr: o } = r;
			if (_u(U(n.doc, [...t])).forEach(({ newRange: t }) => {
				let n = G(r.doc, t, (e) => e.isTextblock), i, a;
				if (n.length > 1) i = n[0], a = r.doc.textBetween(i.pos, i.pos + i.node.nodeSize, void 0, " ");
				else if (n.length) {
					let e = r.doc.textBetween(t.from, t.to, " ", " ");
					if (!O_.test(e)) return;
					i = n[0], a = r.doc.textBetween(i.pos, t.to, void 0, " ");
				}
				if (i && a) {
					let t = a.split(D_).filter(Boolean);
					if (t.length <= 0) return !1;
					let n = t[t.length - 1], s = i.pos + a.lastIndexOf(n);
					if (!n) return !1;
					let c = w_(n).map((t) => t.toObject(e.defaultProtocol));
					if (!A_(c)) return !1;
					c.filter((e) => e.isLink).map((e) => ({
						...e,
						from: s + e.start + 1,
						to: s + e.end + 1
					})).filter((e) => r.schema.marks.code ? !r.doc.rangeHasMark(e.from, e.to, r.schema.marks.code) : !0).filter((t) => e.validate(t.value)).filter((t) => e.shouldAutoLink(t.value)).forEach((t) => {
						vu(t.from, t.to, r.doc).some((t) => t.mark.type === e.type) || o.addMark(t.from, t.to, e.type.create({ href: t.href }));
					});
				}
			}), o.steps.length) return o;
		}
	});
}
function M_(e) {
	return new Qn({
		key: new tr("handleClickLink"),
		props: { handleClick: (t, n, r) => {
			if (r.button !== 0 || !t.editable) return !1;
			let i = null;
			if (r.target instanceof HTMLAnchorElement) i = r.target;
			else {
				let t = r.target;
				if (!t) return !1;
				let n = e.editor.view.dom;
				i = t.closest("a"), i && !n.contains(i) && (i = null);
			}
			if (!i) return !1;
			let a = !1;
			if (e.enableClickSelection && (a = e.editor.commands.extendMarkRange(e.type.name)), e.openOnClick) {
				let n = mu(t.state, e.type.name), r = i.href ?? n.href, o = i.target ?? n.target;
				r && (window.open(r, o), a = !0);
			}
			return a;
		} }
	});
}
function N_(e) {
	return new Qn({
		key: new tr("handlePasteLink"),
		props: { handlePaste: (t, n, r) => {
			let { shouldAutoLink: i } = e, { state: a } = t, { selection: o } = a, { empty: s } = o;
			if (s) return !1;
			let c = "";
			r.content.forEach((e) => {
				c += e.textContent;
			});
			let l = T_(c, { defaultProtocol: e.defaultProtocol }).find((e) => e.isLink && e.value === c);
			return !c || !l || i !== void 0 && !i(l.value) ? !1 : e.editor.commands.setMark(e.type, { href: l.href });
		} }
	});
}
function P_(e, t) {
	let n = [
		"http",
		"https",
		"ftp",
		"ftps",
		"mailto",
		"tel",
		"callto",
		"sms",
		"cid",
		"xmpp"
	];
	return t && t.forEach((e) => {
		let t = typeof e == "string" ? e : e.scheme;
		t && n.push(t);
	}), !e || e.replace(k_, "").match(RegExp(`^(?:(?:${n.map((e) => e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")}):|[^a-z]|[a-z0-9+.\\-]+(?:[^a-z+.\\-:]|$))`, "i"));
}
var F_ = Dd.create({
	name: "link",
	priority: 1e3,
	keepOnSplit: !1,
	exitable: !0,
	onCreate() {
		this.options.validate && !this.options.shouldAutoLink && (this.options.shouldAutoLink = this.options.validate, console.warn("The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.")), this.options.protocols.forEach((e) => {
			if (typeof e == "string") {
				S_(e);
				return;
			}
			S_(e.scheme, e.optionalSlashes);
		});
	},
	onDestroy() {
		x_();
	},
	inclusive() {
		return this.options.autolink;
	},
	addOptions() {
		return {
			openOnClick: !0,
			enableClickSelection: !1,
			linkOnPaste: !0,
			autolink: !0,
			protocols: [],
			defaultProtocol: "http",
			HTMLAttributes: {
				target: "_blank",
				rel: "noopener noreferrer nofollow",
				class: null
			},
			isAllowedUri: (e, t) => !!P_(e, t.protocols),
			validate: (e) => !!e,
			shouldAutoLink: (e) => {
				let t = /^[a-z][a-z0-9+.-]*:\/\//i.test(e), n = /^[a-z][a-z0-9+.-]*:/i.test(e);
				if (t || n && !e.includes("@")) return !0;
				let r = (e.includes("@") ? e.split("@").pop() : e).split(/[/?#:]/)[0];
				return !(/^\d{1,3}(\.\d{1,3}){3}$/.test(r) || !/\./.test(r));
			}
		};
	},
	addAttributes() {
		return {
			href: {
				default: null,
				parseHTML(e) {
					return e.getAttribute("href");
				}
			},
			target: { default: this.options.HTMLAttributes.target },
			rel: { default: this.options.HTMLAttributes.rel },
			class: { default: this.options.HTMLAttributes.class },
			title: { default: null }
		};
	},
	parseHTML() {
		return [{
			tag: "a[href]",
			getAttrs: (e) => {
				let t = e.getAttribute("href");
				return !t || !this.options.isAllowedUri(t, {
					defaultValidate: (e) => !!P_(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? !1 : null;
			}
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return this.options.isAllowedUri(e.href, {
			defaultValidate: (e) => !!P_(e, this.options.protocols),
			protocols: this.options.protocols,
			defaultProtocol: this.options.defaultProtocol
		}) ? [
			"a",
			J(this.options.HTMLAttributes, e),
			0
		] : [
			"a",
			J(this.options.HTMLAttributes, {
				...e,
				href: ""
			}),
			0
		];
	},
	markdownTokenName: "link",
	parseMarkdown: (e, t) => t.applyMark("link", t.parseInline(e.tokens || []), {
		href: e.href,
		title: e.title || null
	}),
	renderMarkdown: (e, t) => {
		let n = e.attrs?.href ?? "", r = e.attrs?.title ?? "", i = t.renderChildren(e);
		return r ? `[${i}](${n} "${r}")` : `[${i}](${n})`;
	},
	addCommands() {
		return {
			setLink: (e) => ({ chain: t }) => {
				let { href: n } = e;
				return this.options.isAllowedUri(n, {
					defaultValidate: (e) => !!P_(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? t().setMark(this.name, e).setMeta("preventAutolink", !0).run() : !1;
			},
			toggleLink: (e) => ({ chain: t }) => {
				let { href: n } = e || {};
				return n && !this.options.isAllowedUri(n, {
					defaultValidate: (e) => !!P_(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? !1 : t().toggleMark(this.name, e, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run();
			},
			unsetLink: () => ({ chain: e }) => e().unsetMark(this.name, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run()
		};
	},
	addPasteRules() {
		return [ef({
			find: (e) => {
				let t = [];
				if (e) {
					let { protocols: n, defaultProtocol: r } = this.options, i = T_(e).filter((e) => e.isLink && this.options.isAllowedUri(e.value, {
						defaultValidate: (e) => !!P_(e, n),
						protocols: n,
						defaultProtocol: r
					}));
					i.length && i.forEach((e) => {
						this.options.shouldAutoLink(e.value) && t.push({
							text: e.value,
							data: { href: e.href },
							index: e.start
						});
					});
				}
				return t;
			},
			type: this.type,
			getAttributes: (e) => ({ href: e.data?.href })
		})];
	},
	addProseMirrorPlugins() {
		let e = [], { protocols: t, defaultProtocol: n } = this.options;
		return this.options.autolink && e.push(j_({
			type: this.type,
			defaultProtocol: this.options.defaultProtocol,
			validate: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!P_(e, t),
				protocols: t,
				defaultProtocol: n
			}),
			shouldAutoLink: this.options.shouldAutoLink
		})), e.push(M_({
			type: this.type,
			editor: this.editor,
			openOnClick: this.options.openOnClick === "whenNotEditable" ? !0 : this.options.openOnClick,
			enableClickSelection: this.options.enableClickSelection
		})), this.options.linkOnPaste && e.push(N_({
			editor: this.editor,
			defaultProtocol: this.options.defaultProtocol,
			type: this.type,
			shouldAutoLink: this.options.shouldAutoLink
		})), e;
	}
}), I_ = Object.defineProperty, L_ = (e, t) => {
	for (var n in t) I_(e, n, {
		get: t[n],
		enumerable: !0
	});
}, R_ = "listItem", z_ = "textStyle", B_ = /^\s*([-+*])\s$/, V_ = $d.create({
	name: "bulletList",
	addOptions() {
		return {
			itemTypeName: "listItem",
			HTMLAttributes: {},
			keepMarks: !1,
			keepAttributes: !1
		};
	},
	group: "block list",
	content() {
		return `${this.options.itemTypeName}+`;
	},
	parseHTML() {
		return [{ tag: "ul" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"ul",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "list",
	parseMarkdown: (e, t) => e.type !== "list" || e.ordered ? [] : {
		type: "bulletList",
		content: e.items ? t.parseChildren(e.items) : []
	},
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n") : "",
	markdownOptions: { indentsContent: !0 },
	addCommands() {
		return { toggleBulletList: () => ({ commands: e, chain: t }) => this.options.keepAttributes ? t().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(R_, this.editor.getAttributes(z_)).run() : e.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-8": () => this.editor.commands.toggleBulletList() };
	},
	addInputRules() {
		let e = Qd({
			find: B_,
			type: this.type
		});
		return (this.options.keepMarks || this.options.keepAttributes) && (e = Qd({
			find: B_,
			type: this.type,
			keepMarks: this.options.keepMarks,
			keepAttributes: this.options.keepAttributes,
			getAttributes: () => this.editor.getAttributes(z_),
			editor: this.editor
		})), [e];
	}
}), H_ = (e, t, n) => {
	let { selection: r } = e;
	if (!r.empty) return null;
	let { $from: i } = r;
	if (!i.parent.isTextblock || i.parentOffset !== i.parent.content.size) return null;
	let a = -1;
	for (let e = i.depth; e > 0; --e) if (i.node(e).type.name === t) {
		a = e;
		break;
	}
	if (a < 0) return null;
	let o = i.node(a), s = i.index(a);
	if (s + 1 >= o.childCount) return null;
	let c = o.child(s + 1);
	if (!n.includes(c.type.name)) return null;
	let l = e.schema.nodes[t], u = !1;
	if (c.forEach((e) => {
		e.type === l && e.childCount > 1 && (u = !0);
	}), !u) return null;
	let d = e.doc.resolve(i.after()).nodeAfter;
	if (!d || !n.includes(d.type.name)) return null;
	let f = [];
	return d.forEach((e) => {
		f.push(e);
	}), f.length === 0 ? null : {
		listItemDepth: a,
		nestedList: d,
		nestedListPos: i.after(),
		insertPos: i.after(a),
		items: f
	};
}, U_ = (e, t, n, r) => {
	let i = H_(e, n, r);
	if (!i) return !1;
	let { selection: a } = e, { nestedList: o, nestedListPos: s, insertPos: c, items: l } = i, u = e.tr;
	u.delete(s, s + o.nodeSize);
	let d = u.mapping.map(c);
	return u.insert(d, C.from(l)), u.setSelection(a.map(u.doc, u.mapping)), t && t(u), !0;
}, W_ = (e, t, n) => U_(e.state, e.view.dispatch, t, n), G_ = (e, t) => Fd.create({
	name: `${e}BranchingDeleteKeymap`,
	priority: 101,
	addKeyboardShortcuts() {
		let n = () => W_(this.editor, e, t);
		return {
			Delete: n,
			"Mod-Delete": n
		};
	}
}), K_ = [
	[1e3, "m"],
	[900, "cm"],
	[500, "d"],
	[400, "cd"],
	[100, "c"],
	[90, "xc"],
	[50, "l"],
	[40, "xl"],
	[10, "x"],
	[9, "ix"],
	[5, "v"],
	[4, "iv"],
	[1, "i"]
], q_ = "abcdefghijklmnopqrstuvwxyz", J_ = String.raw`\d+|[ivxlcdmIVXLCDM]+|${"[a-zA-Z]{1,2}"}`;
function Y_(e) {
	let t = e, n = "";
	for (let [e, r] of K_) for (; t >= e;) n += r, t -= e;
	return n;
}
function X_(e) {
	return Y_(e).toUpperCase();
}
function Z_(e) {
	let t = e.toLowerCase(), n = 0, r = 0;
	for (; n < t.length;) {
		let e = !1;
		for (let [i, a] of K_) if (t.startsWith(a, n)) {
			r += i, n += a.length, e = !0;
			break;
		}
		if (!e) return 0;
	}
	return r;
}
function Q_(e) {
	if (!/^[ivxlcdmIVXLCDM]+$/.test(e)) return !1;
	let t = Z_(e);
	return t <= 0 ? !1 : (e === e.toLowerCase() ? Y_(t) : X_(t)) === e;
}
function $_(e) {
	let t = e.toLowerCase();
	if (t.length === 1) return t.charCodeAt(0) - 97 + 1;
	if (t.length === 2) {
		let e = t.charCodeAt(0) - 97, n = t.charCodeAt(1) - 97;
		return (e + 1) * 26 + n + 1;
	}
	return 0;
}
function ev(e) {
	if (e <= 26) return q_[e - 1];
	let t = Math.floor((e - 1) / 26) - 1, n = (e - 1) % 26;
	return t < 0 ? q_[n] : q_[t] + q_[n];
}
function tv(e) {
	if (!(!e || /^\d+$/.test(e))) {
		if (Q_(e)) return e === e.toLowerCase() ? "i" : "I";
		if (/^[a-z]{1,2}$/.test(e)) return "a";
		if (/^[A-Z]{1,2}$/.test(e)) return "A";
	}
}
function nv(e) {
	if (/^\d+$/.test(e)) return parseInt(e, 10);
	let t = tv(e);
	if (t === "i" || t === "I") return Z_(e);
	if (t === "a" || t === "A") {
		let t = $_(e);
		return t > 0 ? t : 1;
	}
	let n = parseInt(e, 10);
	return Number.isNaN(n) ? 1 : n;
}
function rv(e, t) {
	if (e === "numeric") return String(t);
	switch (e) {
		case "a": return ev(t);
		case "A": return ev(t).toUpperCase();
		case "i": return Y_(t);
		case "I": return X_(t);
		default: return String(t);
	}
}
function iv(e) {
	if (e.length === 0) return !1;
	let t = tv(e[0]) ?? "numeric", n = nv(e[0]);
	if (n < 1) return !1;
	for (let r = 0; r < e.length; r++) {
		let i = rv(t, n + r);
		if (e[r] !== i) return !1;
	}
	return !0;
}
function av(e) {
	return {
		type: tv(e),
		start: nv(e)
	};
}
function ov(e) {
	let { type: t, start: n } = av(e), r = {};
	return t && (r.type = t), n !== 1 && (r.start = n), r;
}
function sv(e, t, n = ". ") {
	let r = t + 1;
	if (!e || e === "1") return `${r}${n}`;
	switch (e) {
		case "a": return `${ev(r)}${n}`;
		case "A": return `${ev(r).toUpperCase()}${n}`;
		case "i": return `${Y_(r)}${n}`;
		case "I": return `${X_(r)}${n}`;
		default: return `${r}${n}`;
	}
}
function cv(e) {
	let t = e.tokens?.[0];
	return !!(e.text && e.tokens?.length === 1 && t?.type === "list" && t.ordered && t.raw === e.text);
}
function lv(e, t) {
	return t.tokenizeInline ? t.parseInline(t.tokenizeInline(e)) : t.parseInline([{
		type: "text",
		raw: e,
		text: e
	}]);
}
var uv = $d.create({
	name: "listItem",
	addOptions() {
		return {
			HTMLAttributes: {},
			bulletListTypeName: "bulletList",
			orderedListTypeName: "orderedList"
		};
	},
	content: "paragraph block*",
	defining: !0,
	parseHTML() {
		return [{ tag: "li" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"li",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "list_item",
	parseMarkdown: (e, t) => {
		if (e.type !== "list_item") return [];
		let n = t.parseBlockChildren ?? t.parseChildren, r = [];
		if (e.tokens && e.tokens.length > 0) {
			if (cv(e)) return {
				type: "listItem",
				content: [{
					type: "paragraph",
					content: lv(e.text || "", t)
				}]
			};
			if (e.tokens.some((e) => e.type === "paragraph")) r = n(e.tokens);
			else {
				let i = e.tokens[0];
				if (i && i.type === "text" && i.tokens && i.tokens.length > 0) {
					if (r = [{
						type: "paragraph",
						content: t.parseInline(i.tokens)
					}], e.tokens.length > 1) {
						let t = n(e.tokens.slice(1));
						r.push(...t);
					}
				} else r = n(e.tokens);
			}
		}
		return r.length === 0 && (r = [{
			type: "paragraph",
			content: []
		}]), {
			type: "listItem",
			content: r
		};
	},
	renderMarkdown: (e, t, n) => bd(e, t, (e) => {
		if (e.parentType === "bulletList") return "- ";
		if (e.parentType === "orderedList") {
			let t = e.meta?.parentAttrs?.start || 1;
			return sv(e.meta?.parentAttrs?.type, t - 1 + (e.index || 0), ". ");
		}
		return "- ";
	}, n),
	addExtensions() {
		return [G_(this.name, [this.options.bulletListTypeName, this.options.orderedListTypeName])];
	},
	addKeyboardShortcuts() {
		return {
			Enter: () => this.editor.commands.splitListItem(this.name),
			Tab: () => this.editor.commands.sinkListItem(this.name),
			"Shift-Tab": () => this.editor.commands.liftListItem(this.name)
		};
	}
});
L_({}, {
	findListItemPos: () => dv,
	getNextListDepth: () => fv,
	handleBackspace: () => mv,
	handleDelete: () => _v,
	hasListBefore: () => pv,
	hasListItemAfter: () => vv,
	hasListItemBefore: () => yv,
	listItemHasSubList: () => bv,
	nextListIsDeeper: () => hv,
	nextListIsHigher: () => gv
});
var dv = (e, t) => {
	let { $from: n } = t.selection, r = Vc(e, t.schema), i = null, a = n.depth, o = n.pos, s = null;
	for (; a > 0 && s === null;) i = n.node(a), i.type === r ? s = a : (--a, --o);
	return s === null ? null : {
		$pos: t.doc.resolve(o),
		depth: s
	};
}, fv = (e, t) => {
	let n = dv(e, t);
	if (!n) return !1;
	let [, r] = yu(t, e, n.$pos.pos + 4);
	return r;
}, pv = (e, t, n) => {
	let { $anchor: r } = e.selection, i = Math.max(0, r.pos - 2), a = e.doc.resolve(i).node();
	return !(!a || !n.includes(a.type.name));
}, mv = (e, t, n) => {
	if (e.commands.undoInputRule()) return !0;
	if (e.state.selection.from !== e.state.selection.to) return !1;
	if (!kl(e.state, t) && pv(e.state, t, n)) {
		let { $anchor: n } = e.state.selection, r = e.state.doc.resolve(n.before() - 1), i = [];
		r.node().descendants((e, n) => {
			e.type.name === t && i.push({
				node: e,
				pos: n
			});
		});
		let a = i.at(-1);
		if (!a) return !1;
		let o = e.state.doc.resolve(r.start() + a.pos + 1);
		return e.chain().cut({
			from: n.start() - 1,
			to: n.end() + 1
		}, o.end()).joinForward().run();
	}
	return !kl(e.state, t) || !Eu(e.state) ? !1 : e.chain().liftListItem(t).run();
}, hv = (e, t) => {
	let n = fv(e, t), r = dv(e, t);
	return !r || !n ? !1 : n > r.depth;
}, gv = (e, t) => {
	let n = fv(e, t), r = dv(e, t);
	return !r || !n ? !1 : n < r.depth;
}, _v = (e, t) => {
	if (!kl(e.state, t) || !Tu(e.state, t)) return !1;
	let { selection: n } = e.state, { $from: r, $to: i } = n;
	return !n.empty && r.sameParent(i) ? !1 : hv(t, e.state) ? e.chain().focus(e.state.selection.from + 4).lift(t).joinBackward().run() : gv(t, e.state) ? e.chain().joinForward().joinBackward().run() : e.commands.joinItemForward();
}, vv = (e, t) => {
	let { $anchor: n } = t.selection, r = t.doc.resolve(n.pos - n.parentOffset - 2);
	return !(r.index() === r.parent.childCount - 1 || r.nodeAfter?.type.name !== e);
}, yv = (e, t) => {
	let { $anchor: n } = t.selection, r = t.doc.resolve(n.pos - 2);
	return !(r.index() === 0 || r.nodeBefore?.type.name !== e);
}, bv = (e, t, n) => {
	if (!n) return !1;
	let r = Vc(e, t.schema), i = !1;
	return n.descendants((e) => {
		e.type === r && (i = !0);
	}), i;
}, xv = Fd.create({
	name: "listKeymap",
	addOptions() {
		return { listTypes: [{
			itemName: "listItem",
			wrapperNames: ["bulletList", "orderedList"]
		}, {
			itemName: "taskItem",
			wrapperNames: ["taskList"]
		}] };
	},
	addKeyboardShortcuts() {
		return {
			Delete: ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n }) => {
					e.state.schema.nodes[n] !== void 0 && _v(e, n) && (t = !0);
				}), t;
			},
			"Mod-Delete": ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n }) => {
					e.state.schema.nodes[n] !== void 0 && _v(e, n) && (t = !0);
				}), t;
			},
			Backspace: ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n, wrapperNames: r }) => {
					e.state.schema.nodes[n] !== void 0 && mv(e, n, r) && (t = !0);
				}), t;
			},
			"Mod-Backspace": ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n, wrapperNames: r }) => {
					e.state.schema.nodes[n] !== void 0 && mv(e, n, r) && (t = !0);
				}), t;
			}
		};
	}
}), Sv = RegExp(`^(\\s*)(${J_})([.)])\\s+(.*)$`), Cv = RegExp(`^(\\s*)(${J_})([.)])\\s+`), wv = /^\s/;
function Tv(e) {
	return Sv.test(e.trimStart());
}
function Ev(e) {
	let t = e.trimStart();
	return /^[-+*]\s+/.test(t) || Tv(t) || /^>\s?/.test(t) || /^```/.test(t) || /^~~~/.test(t);
}
function Dv(e) {
	let t = [], n = [], r = !1;
	return e.forEach((e) => {
		if (r) {
			n.push(e);
			return;
		}
		if (e.trim() === "") {
			r = !0, n.push(e);
			return;
		}
		if (t.length > 0 && Ev(e)) {
			r = !0, n.push(e);
			return;
		}
		t.push(e);
	}), {
		paragraphLines: t,
		blockLines: n
	};
}
function Ov(e) {
	let t = [], n = 0, r = 0;
	for (; n < e.length;) {
		let i = e[n], a = i.match(Sv);
		if (!a) break;
		let [, o, s, c, l] = a, u = o.length, d = parseInt(s, 10), f = isNaN(d) ? tv(s) : void 0, p = isNaN(d) ? nv(s) : d, m = [l], h = n + 1, g = [i], _ = !1;
		for (; h < e.length;) {
			let t = e[h];
			if (t.match(Sv)) break;
			if (t.trim() === "") g.push(t), m.push(""), _ = !0, h += 1;
			else if (t.match(wv)) g.push(t), m.push(t.slice(u + 2)), h += 1;
			else {
				if (_) break;
				g.push(t), m.push(t), h += 1;
			}
		}
		t.push({
			indent: u,
			number: p,
			type: f,
			content: m.join("\n").trim(),
			contentLines: m,
			raw: g.join("\n")
		}), r = h, n = h;
	}
	return [t, r];
}
var kv = RegExp(`^(${J_})([.)])\\s+(.+)$`);
function Av(e) {
	let t = e.split("\n").filter((e) => e.trim().length > 0);
	if (t.length === 0) return null;
	let n = [];
	for (let e of t) {
		let t = e.trim().match(kv);
		if (!t) return null;
		n.push({
			marker: t[1],
			content: t[3]
		});
	}
	return iv(n.map((e) => e.marker)) ? {
		type: "orderedList",
		attrs: ov(n[0].marker),
		content: n.map((e) => ({
			type: "listItem",
			content: [{
				type: "paragraph",
				content: [{
					type: "text",
					text: e.content
				}]
			}]
		}))
	} : null;
}
function jv(e, t, n) {
	let r = [], i = 0;
	for (; i < e.length;) {
		let a = e[i];
		if (a.indent === t) {
			let { paragraphLines: o, blockLines: s } = Dv(a.contentLines), c = o.join("\n").trim(), l = [];
			c && l.push({
				type: "paragraph",
				raw: c,
				tokens: n.inlineTokens(c)
			});
			let u = s.join("\n").trim();
			if (u) {
				let e = n.blockTokens(u);
				l.push(...e);
			}
			let d = i + 1, f = [];
			for (; d < e.length && e[d].indent > t;) f.push(e[d]), d += 1;
			if (f.length > 0) {
				let e = jv(f, Math.min(...f.map((e) => e.indent)), n);
				l.push({
					type: "list",
					ordered: !0,
					start: f[0].number,
					typeMarker: f[0].type,
					items: e,
					raw: f.map((e) => e.raw).join("\n")
				});
			}
			r.push({
				type: "list_item",
				raw: a.raw,
				tokens: l
			}), i = d;
		} else i += 1;
	}
	return r;
}
function Mv(e, t) {
	return e.map((e) => {
		if (e.type !== "list_item") return t.parseChildren([e])[0];
		let n = [];
		return e.tokens && e.tokens.length > 0 && e.tokens.forEach((e) => {
			if (e.type === "paragraph" || e.type === "list" || e.type === "blockquote" || e.type === "code") n.push(...t.parseChildren([e]));
			else if (e.type === "text" && e.tokens) {
				let r = t.parseChildren([e]);
				n.push({
					type: "paragraph",
					content: r
				});
			} else {
				let r = t.parseChildren([e]);
				r.length > 0 && n.push(...r);
			}
		}), {
			type: "listItem",
			content: n
		};
	});
}
var Nv = "listItem", Pv = "textStyle", Fv = /^(\d+)\.\s$/;
function Iv(e) {
	let t = e.match(/list-style-type\s*:\s*([^;]+)/i);
	if (!t) return null;
	switch (t[1].trim().toLowerCase()) {
		case "upper-roman": return "I";
		case "lower-roman": return "i";
		case "upper-alpha":
		case "upper-latin": return "A";
		case "lower-alpha":
		case "lower-latin": return "a";
		default: return null;
	}
}
var Lv = $d.create({
	name: "orderedList",
	addOptions() {
		return {
			itemTypeName: "listItem",
			HTMLAttributes: {},
			keepMarks: !1,
			keepAttributes: !1
		};
	},
	group: "block list",
	content() {
		return `${this.options.itemTypeName}+`;
	},
	addAttributes() {
		return {
			start: {
				default: 1,
				parseHTML: (e) => e.hasAttribute("start") ? parseInt(e.getAttribute("start") || "", 10) : 1
			},
			type: {
				default: null,
				parseHTML: (e) => {
					let t = e.getAttribute("type");
					if (t) return t;
					let n = e.getAttribute("style");
					if (n) {
						let e = Iv(n);
						if (e) return e;
					}
					let r = e.querySelector("li");
					if (r) {
						let e = r.getAttribute("style");
						if (e) {
							let t = Iv(e);
							if (t) return t;
						}
					}
					return null;
				}
			}
		};
	},
	parseHTML() {
		return [{ tag: "ol" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		let { start: t, type: n, ...r } = e, i = J(this.options.HTMLAttributes, r);
		return t !== 1 && (i.start = t), n && n !== "1" && (i.type = n), [
			"ol",
			i,
			0
		];
	},
	markdownTokenName: "list",
	parseMarkdown: (e, t) => {
		if (e.type !== "list" || !e.ordered) return [];
		let n = e.start || 1, r = e.typeMarker, i = e.items ? Mv(e.items, t) : [], a = {};
		return n !== 1 && (a.start = n), r && (a.type = r), Object.keys(a).length > 0 ? {
			type: "orderedList",
			attrs: a,
			content: i
		} : {
			type: "orderedList",
			content: i
		};
	},
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n") : "",
	markdownTokenizer: {
		name: "orderedList",
		level: "block",
		start: (e) => {
			let t = e.match(Cv)?.index;
			return t === void 0 ? -1 : t;
		},
		tokenize: (e, t, n) => {
			let r = e.split("\n"), [i, a] = Ov(r);
			if (i.length === 0) return;
			let o = jv(i, 0, n);
			if (o.length !== 0) return {
				type: "list",
				ordered: !0,
				start: i[0]?.number || 1,
				typeMarker: i[0]?.type,
				items: o,
				raw: r.slice(0, a).join("\n")
			};
		}
	},
	markdownOptions: { indentsContent: !0 },
	addCommands() {
		return { toggleOrderedList: () => ({ commands: e, chain: t }) => this.options.keepAttributes ? t().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Nv, this.editor.getAttributes(Pv)).run() : e.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-7": () => this.editor.commands.toggleOrderedList() };
	},
	addProseMirrorPlugins() {
		return [new Qn({ props: { handlePaste: (e, t) => {
			if ((t.clipboardData?.getData("text/html"))?.trim()) return !1;
			let n = t.clipboardData?.getData("text/plain");
			if (!n) return !1;
			let r = Av(n);
			if (!r) return !1;
			try {
				let t = e.state.schema.nodeFromJSON(r), n = e.state.tr.replaceSelectionWith(t);
				return e.dispatch(n), !0;
			} catch {
				return !1;
			}
		} } })];
	},
	addInputRules() {
		let e = (e, t) => (!t.attrs.type || t.attrs.type === "1") && t.childCount + t.attrs.start === +e[1], t = Qd({
			find: Fv,
			type: this.type,
			getAttributes: (e) => ({ start: +e[1] }),
			joinPredicate: e
		});
		return (this.options.keepMarks || this.options.keepAttributes) && (t = Qd({
			find: Fv,
			type: this.type,
			keepMarks: this.options.keepMarks,
			keepAttributes: this.options.keepAttributes,
			getAttributes: (e) => ({
				start: +e[1],
				...this.editor.getAttributes(Pv)
			}),
			joinPredicate: e,
			editor: this.editor
		})), [t];
	}
}), Rv = /^\s*(\[([( |x])?\])\s$/, zv = $d.create({
	name: "taskItem",
	addOptions() {
		return {
			nested: !1,
			HTMLAttributes: {},
			taskListTypeName: "taskList",
			a11y: void 0
		};
	},
	content() {
		return this.options.nested ? "paragraph block*" : "paragraph+";
	},
	defining: !0,
	addAttributes() {
		return { checked: {
			default: !1,
			keepOnSplit: !1,
			parseHTML: (e) => {
				let t = e.getAttribute("data-checked");
				return t === "" || t === "true";
			},
			renderHTML: (e) => ({ "data-checked": e.checked })
		} };
	},
	parseHTML() {
		return [{
			tag: `li[data-type="${this.name}"]`,
			priority: 51
		}];
	},
	renderHTML({ node: e, HTMLAttributes: t }) {
		return [
			"li",
			J(this.options.HTMLAttributes, t, { "data-type": this.name }),
			[
				"label",
				["input", {
					type: "checkbox",
					checked: e.attrs.checked ? "checked" : null
				}],
				["span"]
			],
			["div", 0]
		];
	},
	parseMarkdown: (e, t) => {
		let n = [];
		if (e.tokens && e.tokens.length > 0 ? n.push(t.createNode("paragraph", {}, t.parseInline(e.tokens))) : e.text ? n.push(t.createNode("paragraph", {}, [t.createNode("text", { text: e.text })])) : n.push(t.createNode("paragraph", {}, [])), e.nestedTokens && e.nestedTokens.length > 0) {
			let r = t.parseChildren(e.nestedTokens);
			n.push(...r);
		}
		return t.createNode("taskItem", { checked: e.checked || !1 }, n);
	},
	renderMarkdown: (e, t) => bd(e, t, `- [${e.attrs?.checked ? "x" : " "}] `),
	addExtensions() {
		return this.options.nested ? [G_(this.name, [this.options.taskListTypeName])] : [];
	},
	addKeyboardShortcuts() {
		let e = {
			Enter: () => this.editor.commands.splitListItem(this.name),
			"Shift-Tab": () => this.editor.commands.liftListItem(this.name)
		};
		return this.options.nested ? {
			...e,
			Tab: () => this.editor.commands.sinkListItem(this.name)
		} : e;
	},
	addNodeView() {
		return ({ node: e, HTMLAttributes: t, getPos: n, editor: r }) => {
			let i = document.createElement("li"), a = document.createElement("label"), o = document.createElement("span"), s = document.createElement("input"), c = document.createElement("div"), l = (e) => {
				var t;
				s.ariaLabel = ((t = this.options.a11y)?.checkboxLabel)?.call(t, e, s.checked) || `Task item checkbox for ${e.textContent || "empty task item"}`;
			};
			l(e), a.contentEditable = "false", s.type = "checkbox", s.addEventListener("mousedown", (e) => e.preventDefault()), s.addEventListener("change", (t) => {
				if (!r.isEditable && !this.options.onReadOnlyChecked) {
					s.checked = !s.checked;
					return;
				}
				let { checked: i } = t.target;
				r.isEditable && typeof n == "function" && r.chain().focus(void 0, { scrollIntoView: !1 }).command(({ tr: e }) => {
					let t = n();
					if (typeof t != "number") return !1;
					let r = e.doc.nodeAt(t);
					return e.setNodeMarkup(t, void 0, {
						...r?.attrs,
						checked: i
					}), !0;
				}).run(), !r.isEditable && this.options.onReadOnlyChecked && (this.options.onReadOnlyChecked(e, i) || (s.checked = !s.checked));
			}), Object.entries(this.options.HTMLAttributes).forEach(([e, t]) => {
				i.setAttribute(e, t);
			}), i.dataset.checked = e.attrs.checked, s.checked = e.attrs.checked, a.append(s, o), i.append(a, c), Object.entries(t).forEach(([e, t]) => {
				i.setAttribute(e, t);
			});
			let u = new Set(Object.keys(t));
			return {
				dom: i,
				contentDOM: c,
				update: (e) => {
					if (e.type !== this.type) return !1;
					i.dataset.checked = e.attrs.checked, s.checked = e.attrs.checked, l(e);
					let t = r.extensionManager.attributes, n = tu(e, t), a = new Set(Object.keys(n)), o = this.options.HTMLAttributes;
					return u.forEach((e) => {
						a.has(e) || (e in o ? i.setAttribute(e, o[e]) : i.removeAttribute(e));
					}), Object.entries(n).forEach(([e, t]) => {
						t == null ? e in o ? i.setAttribute(e, o[e]) : i.removeAttribute(e) : i.setAttribute(e, t);
					}), u = a, !0;
				}
			};
		};
	},
	addInputRules() {
		return [Qd({
			find: Rv,
			type: this.type,
			getAttributes: (e) => ({ checked: e[e.length - 1] === "x" })
		})];
	}
}), Bv = $d.create({
	name: "taskList",
	addOptions() {
		return {
			itemTypeName: "taskItem",
			HTMLAttributes: {}
		};
	},
	group: "block list",
	content() {
		return `${this.options.itemTypeName}+`;
	},
	parseHTML() {
		return [{
			tag: `ul[data-type="${this.name}"]`,
			priority: 51
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"ul",
			J(this.options.HTMLAttributes, e, { "data-type": this.name }),
			0
		];
	},
	parseMarkdown: (e, t) => t.createNode("taskList", {}, t.parseChildren(e.items || [])),
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n") : "",
	markdownTokenizer: {
		name: "taskList",
		level: "block",
		start(e) {
			let t = e.match(/^\s*[-+*]\s+\[([ xX])\]\s+/)?.index;
			return t === void 0 ? -1 : t;
		},
		tokenize(e, t, n) {
			let r = (e) => {
				let t = yd(e, {
					itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,
					extractItemData: (e) => ({
						indentLevel: e[1].length,
						mainContent: e[4],
						checked: e[3].toLowerCase() === "x"
					}),
					createToken: (e, t) => ({
						type: "taskItem",
						raw: "",
						mainContent: e.mainContent,
						indentLevel: e.indentLevel,
						checked: e.checked,
						text: e.mainContent,
						tokens: n.inlineTokens(e.mainContent),
						nestedTokens: t
					}),
					customNestedParser: r
				}, n);
				return t ? [{
					type: "taskList",
					raw: t.raw,
					items: t.items
				}] : n.blockTokens(e);
			}, i = yd(e, {
				itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,
				extractItemData: (e) => ({
					indentLevel: e[1].length,
					mainContent: e[4],
					checked: e[3].toLowerCase() === "x"
				}),
				createToken: (e, t) => ({
					type: "taskItem",
					raw: "",
					mainContent: e.mainContent,
					indentLevel: e.indentLevel,
					checked: e.checked,
					text: e.mainContent,
					tokens: n.inlineTokens(e.mainContent),
					nestedTokens: t
				}),
				customNestedParser: r
			}, n);
			if (i) return {
				type: "taskList",
				raw: i.raw,
				items: i.items
			};
		}
	},
	markdownOptions: { indentsContent: !0 },
	addCommands() {
		return { toggleTaskList: () => ({ commands: e }) => e.toggleList(this.name, this.options.itemTypeName) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-9": () => this.editor.commands.toggleTaskList() };
	}
});
Fd.create({
	name: "listKit",
	addExtensions() {
		let e = [];
		return this.options.bulletList !== !1 && e.push(V_.configure(this.options.bulletList)), this.options.listItem !== !1 && e.push(uv.configure(this.options.listItem)), this.options.listKeymap !== !1 && e.push(xv.configure(this.options.listKeymap)), this.options.orderedList !== !1 && e.push(Lv.configure(this.options.orderedList)), this.options.taskItem !== !1 && e.push(zv.configure(this.options.taskItem)), this.options.taskList !== !1 && e.push(Bv.configure(this.options.taskList)), e;
	}
});
//#endregion
//#region node_modules/@tiptap/extension-paragraph/dist/index.js
var Vv = "&nbsp;", Hv = "\xA0", Uv = $d.create({
	name: "paragraph",
	priority: 1e3,
	addOptions() {
		return { HTMLAttributes: {} };
	},
	group: "block",
	content: "inline*",
	parseHTML() {
		return [{ tag: "p" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"p",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	parseMarkdown: (e, t) => {
		let n = e.tokens || [];
		if (n.length === 1 && n[0].type === "image") return t.parseChildren([n[0]]);
		let r = t.parseInline(n);
		return n.length === 1 && n[0].type === "text" && (n[0].raw === Vv || n[0].text === Vv || n[0].raw === Hv || n[0].text === Hv) && r.length === 1 && r[0].type === "text" && (r[0].text === Vv || r[0].text === Hv) ? t.createNode("paragraph", void 0, []) : t.createNode("paragraph", void 0, r);
	},
	renderMarkdown: (e, t, n) => {
		if (!e) return "";
		let r = Array.isArray(e.content) ? e.content : [];
		if (r.length === 0) {
			let e = Array.isArray(n?.previousNode?.content) ? n.previousNode.content : [];
			return n?.previousNode?.type === "paragraph" && e.length === 0 ? Vv : "";
		}
		return t.renderChildren(r);
	},
	addCommands() {
		return { setParagraph: () => ({ commands: e }) => e.setNode(this.name) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Alt-0": () => this.editor.commands.setParagraph() };
	}
}), Wv = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/, Gv = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g, Kv = Dd.create({
	name: "strike",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [
			{ tag: "s" },
			{ tag: "del" },
			{ tag: "strike" },
			{
				style: "text-decoration",
				consuming: !1,
				getAttrs: (e) => e.includes("line-through") ? {} : !1
			}
		];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"s",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "del",
	parseMarkdown: (e, t) => t.applyMark("strike", t.parseInline(e.tokens || [])),
	renderMarkdown: (e, t) => `~~${t.renderChildren(e)}~~`,
	addCommands() {
		return {
			setStrike: () => ({ commands: e }) => e.setMark(this.name),
			toggleStrike: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetStrike: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-s": () => this.editor.commands.toggleStrike() };
	},
	addInputRules() {
		return [Yd({
			find: Wv,
			type: this.type
		})];
	},
	addPasteRules() {
		return [ef({
			find: Gv,
			type: this.type
		})];
	}
}), qv = $d.create({
	name: "text",
	group: "inline",
	parseMarkdown: (e) => ({
		type: "text",
		text: e.text || ""
	}),
	renderMarkdown: (e) => e.text || ""
}), Jv = Dd.create({
	name: "underline",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [{ tag: "u" }, {
			style: "text-decoration",
			consuming: !1,
			getAttrs: (e) => e.includes("underline") ? {} : !1
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"u",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	parseMarkdown(e, t) {
		return t.applyMark(this.name || "underline", t.parseInline(e.tokens || []));
	},
	renderMarkdown(e, t) {
		return `++${t.renderChildren(e)}++`;
	},
	markdownTokenizer: {
		name: "underline",
		level: "inline",
		start(e) {
			return e.indexOf("++");
		},
		tokenize(e, t, n) {
			let r = /^(\+\+)([\s\S]+?)(\+\+)/.exec(e);
			if (!r) return;
			let i = r[2].trim();
			return {
				type: "underline",
				raw: r[0],
				text: i,
				tokens: n.inlineTokens(i)
			};
		}
	},
	addCommands() {
		return {
			setUnderline: () => ({ commands: e }) => e.setMark(this.name),
			toggleUnderline: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetUnderline: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-u": () => this.editor.commands.toggleUnderline(),
			"Mod-U": () => this.editor.commands.toggleUnderline()
		};
	}
});
//#endregion
//#region node_modules/prosemirror-dropcursor/dist/index.js
function Yv(e = {}) {
	return new Qn({ view(t) {
		return new Xv(t, e);
	} });
}
var Xv = class {
	constructor(e, t) {
		this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = t.width ?? 1, this.color = t.color === !1 ? void 0 : t.color || "black", this.class = t.class, this.handlers = [
			"dragover",
			"dragend",
			"drop",
			"dragleave"
		].map((t) => {
			let n = (e) => {
				this[t](e);
			};
			return e.dom.addEventListener(t, n), {
				name: t,
				handler: n
			};
		});
	}
	destroy() {
		this.handlers.forEach(({ name: e, handler: t }) => this.editorView.dom.removeEventListener(e, t));
	}
	update(e, t) {
		this.cursorPos != null && t.doc != e.state.doc && (this.cursorPos > e.state.doc.content.size ? this.setCursor(null) : this.updateOverlay());
	}
	setCursor(e) {
		e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
	}
	updateOverlay() {
		let e = this.editorView.state.doc.resolve(this.cursorPos), t = !e.parent.inlineContent, n, r = this.editorView.dom, i = r.getBoundingClientRect(), a = i.width / r.offsetWidth, o = i.height / r.offsetHeight;
		if (t) {
			let t = e.nodeBefore, r = e.nodeAfter;
			if (t || r) {
				let e = this.editorView.nodeDOM(this.cursorPos - (t ? t.nodeSize : 0));
				if (e) {
					let i = e.getBoundingClientRect(), a = t ? i.bottom : i.top;
					t && r && (a = (a + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2);
					let s = this.width / 2 * o;
					n = {
						left: i.left,
						right: i.right,
						top: a - s,
						bottom: a + s
					};
				}
			}
		}
		if (!n) {
			let e = this.editorView.coordsAtPos(this.cursorPos), t = this.width / 2 * a;
			n = {
				left: e.left - t,
				right: e.left + t,
				top: e.top,
				bottom: e.bottom
			};
		}
		let s = this.editorView.dom.offsetParent;
		this.element || (this.element = s.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", t), this.element.classList.toggle("prosemirror-dropcursor-inline", !t);
		let c, l;
		if (!s || s == document.body && getComputedStyle(s).position == "static") c = -pageXOffset, l = -pageYOffset;
		else {
			let e = s.getBoundingClientRect(), t = e.width / s.offsetWidth, n = e.height / s.offsetHeight;
			c = e.left - s.scrollLeft * t, l = e.top - s.scrollTop * n;
		}
		this.element.style.left = (n.left - c) / a + "px", this.element.style.top = (n.top - l) / o + "px", this.element.style.width = (n.right - n.left) / a + "px", this.element.style.height = (n.bottom - n.top) / o + "px";
	}
	scheduleRemoval(e) {
		clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
	}
	dragover(e) {
		if (!this.editorView.editable) return;
		let t = this.editorView.posAtCoords({
			left: e.clientX,
			top: e.clientY
		}), n = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), r = n && n.type.spec.disableDropCursor, i = typeof r == "function" ? r(this.editorView, t, e) : r;
		if (t && !i) {
			let e = t.pos;
			if (this.editorView.dragging && this.editorView.dragging.slice) {
				let t = fn(this.editorView.state.doc, e, this.editorView.dragging.slice);
				t != null && (e = t);
			}
			this.setCursor(e), this.scheduleRemoval(5e3);
		}
	}
	dragend() {
		this.scheduleRemoval(20);
	}
	drop() {
		this.scheduleRemoval(20);
	}
	dragleave(e) {
		this.editorView.dom.contains(e.relatedTarget) || this.setCursor(null);
	}
}, Zv = class e extends k {
	constructor(e) {
		super(e, e);
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		return e.valid(r) ? new e(r) : k.near(r);
	}
	content() {
		return T.empty;
	}
	eq(t) {
		return t instanceof e && t.head == this.head;
	}
	toJSON() {
		return {
			type: "gapcursor",
			pos: this.head
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for GapCursor.fromJSON");
		return new e(t.resolve(n.pos));
	}
	getBookmark() {
		return new Qv(this.anchor);
	}
	static valid(e) {
		let t = e.parent;
		if (t.inlineContent || !ey(e) || !ty(e)) return !1;
		let n = t.type.spec.allowGapCursor;
		if (n != null) return n;
		let r = t.contentMatchAt(e.index()).defaultType;
		return r && r.isTextblock;
	}
	static findGapCursorFrom(t, n, r = !1) {
		search: for (;;) {
			if (!r && e.valid(t)) return t;
			let i = t.pos, a = null;
			for (let r = t.depth;; r--) {
				let o = t.node(r);
				if (n > 0 ? t.indexAfter(r) < o.childCount : t.index(r) > 0) {
					a = o.child(n > 0 ? t.indexAfter(r) : t.index(r) - 1);
					break;
				} else if (r == 0) return null;
				i += n;
				let s = t.doc.resolve(i);
				if (e.valid(s)) return s;
			}
			for (;;) {
				let o = n > 0 ? a.firstChild : a.lastChild;
				if (!o) {
					if (a.isAtom && !a.isText && !j.isSelectable(a)) {
						t = t.doc.resolve(i + a.nodeSize * n), r = !1;
						continue search;
					}
					break;
				}
				a = o, i += n;
				let s = t.doc.resolve(i);
				if (e.valid(s)) return s;
			}
			return null;
		}
	}
};
Zv.prototype.visible = !1, Zv.findFrom = Zv.findGapCursorFrom, k.jsonID("gapcursor", Zv);
var Qv = class e {
	constructor(e) {
		this.pos = e;
	}
	map(t) {
		return new e(t.map(this.pos));
	}
	resolve(e) {
		let t = e.resolve(this.pos);
		return Zv.valid(t) ? new Zv(t) : k.near(t);
	}
};
function $v(e) {
	return e.isAtom || e.spec.isolating || e.spec.createGapCursor;
}
function ey(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.index(t), r = e.node(t);
		if (n == 0) {
			if (r.type.spec.isolating) return !0;
			continue;
		}
		for (let e = r.child(n - 1);; e = e.lastChild) {
			if (e.childCount == 0 && !e.inlineContent || $v(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function ty(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.indexAfter(t), r = e.node(t);
		if (n == r.childCount) {
			if (r.type.spec.isolating) return !0;
			continue;
		}
		for (let e = r.child(n);; e = e.firstChild) {
			if (e.childCount == 0 && !e.inlineContent || $v(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function ny() {
	return new Qn({ props: {
		decorations: sy,
		createSelectionBetween(e, t, n) {
			return t.pos == n.pos && Zv.valid(n) ? new Zv(n) : null;
		},
		handleClick: ay,
		handleKeyDown: ry,
		handleDOMEvents: { beforeinput: oy }
	} });
}
var ry = Tc({
	ArrowLeft: iy("horiz", -1),
	ArrowRight: iy("horiz", 1),
	ArrowUp: iy("vert", -1),
	ArrowDown: iy("vert", 1)
});
function iy(e, t) {
	let n = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
	return function(e, r, i) {
		let a = e.selection, o = t > 0 ? a.$to : a.$from, s = a.empty;
		if (a instanceof A) {
			if (!i.endOfTextblock(n) || o.depth == 0) return !1;
			s = !1, o = e.doc.resolve(t > 0 ? o.after() : o.before());
		}
		let c = Zv.findGapCursorFrom(o, t, s);
		return c ? (r && r(e.tr.setSelection(new Zv(c))), !0) : !1;
	};
}
function ay(e, t, n) {
	if (!e || !e.editable) return !1;
	let r = e.state.doc.resolve(t);
	if (!Zv.valid(r)) return !1;
	let i = e.posAtCoords({
		left: n.clientX,
		top: n.clientY
	});
	return i && i.inside > -1 && j.isSelectable(e.state.doc.nodeAt(i.inside)) ? !1 : (e.dispatch(e.state.tr.setSelection(new Zv(r))), !0);
}
function oy(e, t) {
	if (t.inputType != "insertCompositionText" || !(e.state.selection instanceof Zv)) return !1;
	let { $from: n } = e.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(e.state.schema.nodes.text);
	if (!r) return !1;
	let i = C.empty;
	for (let e = r.length - 1; e >= 0; e--) i = C.from(r[e].createAndFill(null, i));
	let a = e.state.tr.replace(n.pos, n.pos, new T(i, 0, 0));
	return a.setSelection(A.near(a.doc.resolve(n.pos + 1))), e.dispatch(a), !1;
}
function sy(e) {
	if (!(e.selection instanceof Zv)) return null;
	let t = document.createElement("div");
	return t.className = "ProseMirror-gapcursor", Ts.create(e.doc, [Ss.widget(e.selection.head, t, { key: "gapcursor" })]);
}
//#endregion
//#region node_modules/rope-sequence/dist/index.js
var cy = 200, ly = function() {};
ly.prototype.append = function(e) {
	return e.length ? (e = ly.from(e), !this.length && e || e.length < cy && this.leafAppend(e) || this.length < cy && e.leafPrepend(this) || this.appendInner(e)) : this;
}, ly.prototype.prepend = function(e) {
	return e.length ? ly.from(e).append(this) : this;
}, ly.prototype.appendInner = function(e) {
	return new dy(this, e);
}, ly.prototype.slice = function(e, t) {
	return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? ly.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
}, ly.prototype.get = function(e) {
	if (!(e < 0 || e >= this.length)) return this.getInner(e);
}, ly.prototype.forEach = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length), t <= n ? this.forEachInner(e, t, n, 0) : this.forEachInvertedInner(e, t, n, 0);
}, ly.prototype.map = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length);
	var r = [];
	return this.forEach(function(t, n) {
		return r.push(e(t, n));
	}, t, n), r;
}, ly.from = function(e) {
	return e instanceof ly ? e : e && e.length ? new uy(e) : ly.empty;
};
var uy = /* @__PURE__ */ function(e) {
	function t(t) {
		e.call(this), this.values = t;
	}
	e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
	var n = {
		length: { configurable: !0 },
		depth: { configurable: !0 }
	};
	return t.prototype.flatten = function() {
		return this.values;
	}, t.prototype.sliceInner = function(e, n) {
		return e == 0 && n == this.length ? this : new t(this.values.slice(e, n));
	}, t.prototype.getInner = function(e) {
		return this.values[e];
	}, t.prototype.forEachInner = function(e, t, n, r) {
		for (var i = t; i < n; i++) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		for (var i = t - 1; i >= n; i--) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.leafAppend = function(e) {
		if (this.length + e.length <= cy) return new t(this.values.concat(e.flatten()));
	}, t.prototype.leafPrepend = function(e) {
		if (this.length + e.length <= cy) return new t(e.flatten().concat(this.values));
	}, n.length.get = function() {
		return this.values.length;
	}, n.depth.get = function() {
		return 0;
	}, Object.defineProperties(t.prototype, n), t;
}(ly);
ly.empty = new uy([]);
var dy = /* @__PURE__ */ function(e) {
	function t(t, n) {
		e.call(this), this.left = t, this.right = n, this.length = t.length + n.length, this.depth = Math.max(t.depth, n.depth) + 1;
	}
	return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.flatten = function() {
		return this.left.flatten().concat(this.right.flatten());
	}, t.prototype.getInner = function(e) {
		return e < this.left.length ? this.left.get(e) : this.right.get(e - this.left.length);
	}, t.prototype.forEachInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t < i && this.left.forEachInner(e, t, Math.min(n, i), r) === !1 || n > i && this.right.forEachInner(e, Math.max(t - i, 0), Math.min(this.length, n) - i, r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t > i && this.right.forEachInvertedInner(e, t - i, Math.max(n, i) - i, r + i) === !1 || n < i && this.left.forEachInvertedInner(e, Math.min(t, i), n, r) === !1) return !1;
	}, t.prototype.sliceInner = function(e, t) {
		if (e == 0 && t == this.length) return this;
		var n = this.left.length;
		return t <= n ? this.left.slice(e, t) : e >= n ? this.right.slice(e - n, t - n) : this.left.slice(e, n).append(this.right.slice(0, t - n));
	}, t.prototype.leafAppend = function(e) {
		var n = this.right.leafAppend(e);
		if (n) return new t(this.left, n);
	}, t.prototype.leafPrepend = function(e) {
		var n = this.left.leafPrepend(e);
		if (n) return new t(n, this.right);
	}, t.prototype.appendInner = function(e) {
		return this.left.depth >= Math.max(this.right.depth, e.depth) + 1 ? new t(this.left, new t(this.right, e)) : new t(this, e);
	}, t;
}(ly), fy = 500, py = class e {
	constructor(e, t) {
		this.items = e, this.eventCount = t;
	}
	popEvent(t, n) {
		if (this.eventCount == 0) return null;
		let r = this.items.length;
		for (;; r--) if (this.items.get(r - 1).selection) {
			--r;
			break;
		}
		let i, a;
		n && (i = this.remapping(r, this.items.length), a = i.maps.length);
		let o = t.tr, s, c, l = [], u = [];
		return this.items.forEach((t, n) => {
			if (!t.step) {
				i || (i = this.remapping(r, n + 1), a = i.maps.length), a--, u.push(t);
				return;
			}
			if (i) {
				u.push(new hy(t.map));
				let e = t.step.map(i.slice(a)), n;
				e && o.maybeStep(e).doc && (n = o.mapping.maps[o.mapping.maps.length - 1], l.push(new hy(n, void 0, void 0, l.length + u.length))), a--, n && i.appendMap(n, a);
			} else o.maybeStep(t.step);
			if (t.selection) return s = i ? t.selection.map(i.slice(a)) : t.selection, c = new e(this.items.slice(0, r).append(u.reverse().concat(l)), this.eventCount - 1), !1;
		}, this.items.length, 0), {
			remaining: c,
			transform: o,
			selection: s
		};
	}
	addTransform(t, n, r, i) {
		let a = [], o = this.eventCount, s = this.items, c = !i && s.length ? s.get(s.length - 1) : null;
		for (let e = 0; e < t.steps.length; e++) {
			let r = t.steps[e].invert(t.docs[e]), l = new hy(t.mapping.maps[e], r, n), u;
			(u = c && c.merge(l)) && (l = u, e ? a.pop() : s = s.slice(0, s.length - 1)), a.push(l), n &&= (o++, void 0), i || (c = l);
		}
		let l = o - r.depth;
		return l > _y && (s = my(s, l), o -= l), new e(s.append(a), o);
	}
	remapping(e, t) {
		let n = new kt();
		return this.items.forEach((t, r) => {
			let i = t.mirrorOffset != null && r - t.mirrorOffset >= e ? n.maps.length - t.mirrorOffset : void 0;
			n.appendMap(t.map, i);
		}, e, t), n;
	}
	addMaps(t) {
		return this.eventCount == 0 ? this : new e(this.items.append(t.map((e) => new hy(e))), this.eventCount);
	}
	rebased(t, n) {
		if (!this.eventCount) return this;
		let r = [], i = Math.max(0, this.items.length - n), a = t.mapping, o = t.steps.length, s = this.eventCount;
		this.items.forEach((e) => {
			e.selection && s--;
		}, i);
		let c = n;
		this.items.forEach((e) => {
			let n = a.getMirror(--c);
			if (n == null) return;
			o = Math.min(o, n);
			let i = a.maps[n];
			if (e.step) {
				let o = t.steps[n].invert(t.docs[n]), l = e.selection && e.selection.map(a.slice(c + 1, n));
				l && s++, r.push(new hy(i, o, l));
			} else r.push(new hy(i));
		}, i);
		let l = [];
		for (let e = n; e < o; e++) l.push(new hy(a.maps[e]));
		let u = new e(this.items.slice(0, i).append(l).append(r), s);
		return u.emptyItemCount() > fy && (u = u.compress(this.items.length - r.length)), u;
	}
	emptyItemCount() {
		let e = 0;
		return this.items.forEach((t) => {
			t.step || e++;
		}), e;
	}
	compress(t = this.items.length) {
		let n = this.remapping(0, t), r = n.maps.length, i = [], a = 0;
		return this.items.forEach((e, o) => {
			if (o >= t) i.push(e), e.selection && a++;
			else if (e.step) {
				let t = e.step.map(n.slice(r)), o = t && t.getMap();
				if (r--, o && n.appendMap(o, r), t) {
					let s = e.selection && e.selection.map(n.slice(r));
					s && a++;
					let c = new hy(o.invert(), t, s), l, u = i.length - 1;
					(l = i.length && i[u].merge(c)) ? i[u] = l : i.push(c);
				}
			} else e.map && r--;
		}, this.items.length, 0), new e(ly.from(i.reverse()), a);
	}
};
py.empty = new py(ly.empty, 0);
function my(e, t) {
	let n;
	return e.forEach((e, r) => {
		if (e.selection && t-- == 0) return n = r, !1;
	}), e.slice(n);
}
var hy = class e {
	constructor(e, t, n, r) {
		this.map = e, this.step = t, this.selection = n, this.mirrorOffset = r;
	}
	merge(t) {
		if (this.step && t.step && !t.selection) {
			let n = t.step.merge(this.step);
			if (n) return new e(n.getMap().invert(), n, this.selection);
		}
	}
}, gy = class {
	constructor(e, t, n, r, i) {
		this.done = e, this.undone = t, this.prevRanges = n, this.prevTime = r, this.prevComposition = i;
	}
}, _y = 20;
function vy(e, t, n, r) {
	let i = n.getMeta(Ey), a;
	if (i) return i.historyState;
	n.getMeta(Dy) && (e = new gy(e.done, e.undone, null, 0, -1));
	let o = n.getMeta("appendedTransaction");
	if (n.steps.length == 0) return e;
	if (o && o.getMeta(Ey)) return o.getMeta(Ey).redo ? new gy(e.done.addTransform(n, void 0, r, Ty(t)), e.undone, by(n.mapping.maps), e.prevTime, e.prevComposition) : new gy(e.done, e.undone.addTransform(n, void 0, r, Ty(t)), null, e.prevTime, e.prevComposition);
	if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
		let i = n.getMeta("composition"), a = e.prevTime == 0 || !o && e.prevComposition != i && (e.prevTime < (n.time || 0) - r.newGroupDelay || !yy(n, e.prevRanges)), s = o ? xy(e.prevRanges, n.mapping) : by(n.mapping.maps);
		return new gy(e.done.addTransform(n, a ? t.selection.getBookmark() : void 0, r, Ty(t)), py.empty, s, n.time, i ?? e.prevComposition);
	} else if (a = n.getMeta("rebased")) return new gy(e.done.rebased(n, a), e.undone.rebased(n, a), xy(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
	else return new gy(e.done.addMaps(n.mapping.maps), e.undone.addMaps(n.mapping.maps), xy(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
}
function yy(e, t) {
	if (!t) return !1;
	if (!e.docChanged) return !0;
	let n = !1;
	return e.mapping.maps[0].forEach((e, r) => {
		for (let i = 0; i < t.length; i += 2) e <= t[i + 1] && r >= t[i] && (n = !0);
	}), n;
}
function by(e) {
	let t = [];
	for (let n = e.length - 1; n >= 0 && t.length == 0; n--) e[n].forEach((e, n, r, i) => t.push(r, i));
	return t;
}
function xy(e, t) {
	if (!e) return null;
	let n = [];
	for (let r = 0; r < e.length; r += 2) {
		let i = t.map(e[r], 1), a = t.map(e[r + 1], -1);
		i <= a && n.push(i, a);
	}
	return n;
}
function Sy(e, t, n) {
	let r = Ty(t), i = Ey.get(t).spec.config, a = (n ? e.undone : e.done).popEvent(t, r);
	if (!a) return null;
	let o = a.selection.resolve(a.transform.doc), s = (n ? e.done : e.undone).addTransform(a.transform, t.selection.getBookmark(), i, r), c = new gy(n ? s : a.remaining, n ? a.remaining : s, null, 0, -1);
	return a.transform.setSelection(o).setMeta(Ey, {
		redo: n,
		historyState: c
	});
}
var Cy = !1, wy = null;
function Ty(e) {
	let t = e.plugins;
	if (wy != t) {
		Cy = !1, wy = t;
		for (let e = 0; e < t.length; e++) if (t[e].spec.historyPreserveItems) {
			Cy = !0;
			break;
		}
	}
	return Cy;
}
var Ey = new tr("history"), Dy = new tr("closeHistory");
function Oy(e = {}) {
	return e = {
		depth: e.depth || 100,
		newGroupDelay: e.newGroupDelay || 500
	}, new Qn({
		key: Ey,
		state: {
			init() {
				return new gy(py.empty, py.empty, null, 0, -1);
			},
			apply(t, n, r) {
				return vy(n, r, t, e);
			}
		},
		config: e,
		props: { handleDOMEvents: { beforeinput(e, t) {
			let n = t.inputType, r = n == "historyUndo" ? Ay : n == "historyRedo" ? jy : null;
			return !r || !e.editable ? !1 : (t.preventDefault(), r(e.state, e.dispatch));
		} } }
	});
}
function ky(e, t) {
	return (n, r) => {
		let i = Ey.getState(n);
		if (!i || (e ? i.undone : i.done).eventCount == 0) return !1;
		if (r) {
			let a = Sy(i, n, e);
			a && r(t ? a.scrollIntoView() : a);
		}
		return !0;
	};
}
var Ay = ky(!1, !0), jy = ky(!0, !0);
Fd.create({
	name: "characterCount",
	addOptions() {
		return {
			limit: null,
			autoTrim: !0,
			mode: "textSize",
			textCounter: (e) => e.length,
			wordCounter: (e) => e.split(" ").filter((e) => e !== "").length
		};
	},
	addStorage() {
		return {
			characters: () => 0,
			words: () => 0
		};
	},
	onBeforeCreate() {
		this.storage.characters = (e) => {
			let t = e?.node || this.editor.state.doc;
			if ((e?.mode || this.options.mode) === "textSize") {
				let e = t.textBetween(0, t.content.size, void 0, " ");
				return this.options.textCounter(e);
			}
			return t.nodeSize;
		}, this.storage.words = (e) => {
			let t = e?.node || this.editor.state.doc, n = t.textBetween(0, t.content.size, " ", " ");
			return this.options.wordCounter(n);
		};
	},
	addProseMirrorPlugins() {
		let e = !1;
		return [new Qn({
			key: new tr("characterCount"),
			appendTransaction: (t, n, r) => {
				if (e) return;
				let i = this.options.limit, a = this.options.autoTrim;
				if (i == null || i === 0 || a === !1) {
					e = !0;
					return;
				}
				let o = this.storage.characters({ node: r.doc });
				if (o > i) {
					let t = o - i;
					console.warn(`[CharacterCount] Initial content exceeded limit of ${i} characters. Content was automatically trimmed.`);
					let n = r.tr.deleteRange(0, t);
					return e = !0, n;
				}
				e = !0;
			},
			filterTransaction: (e, t) => {
				let n = this.options.limit;
				if (!e.docChanged || n === 0 || n == null) return !0;
				let r = this.storage.characters({ node: t.doc }), i = this.storage.characters({ node: e.doc });
				if (i <= n || r > n && i > n && i <= r) return !0;
				if (r > n && i > n && i > r || !e.getMeta("paste")) return !1;
				let a = e.selection.$head.pos, o = a - (i - n), s = a;
				return e.deleteRange(o, s), !(this.storage.characters({ node: e.doc }) > n);
			}
		})];
	}
});
var My = Fd.create({
	name: "dropCursor",
	addOptions() {
		return {
			color: "currentColor",
			width: 1,
			class: void 0
		};
	},
	addProseMirrorPlugins() {
		return [Yv(this.options)];
	}
});
Fd.create({
	name: "focus",
	addOptions() {
		return {
			className: "has-focus",
			mode: "all"
		};
	},
	addProseMirrorPlugins() {
		return [new Qn({
			key: new tr("focus"),
			props: { decorations: ({ doc: e, selection: t }) => {
				let { isEditable: n, isFocused: r } = this.editor, { anchor: i } = t, a = [];
				if (!n || !r) return Ts.create(e, []);
				let o = 0;
				this.options.mode === "deepest" && e.descendants((e, t) => {
					if (!e.isText) {
						if (!(i >= t && i <= t + e.nodeSize - 1)) return !1;
						o += 1;
					}
				});
				let s = 0;
				return e.descendants((e, t) => {
					if (e.isText || !(i >= t && i <= t + e.nodeSize - 1)) return !1;
					if (s += 1, this.options.mode === "deepest" && o - s > 0 || this.options.mode === "shallowest" && s > 1) return this.options.mode === "deepest";
					a.push(Ss.node(t, t + e.nodeSize, { class: this.options.className }));
				}), Ts.create(e, a);
			} }
		})];
	}
});
var Ny = Fd.create({
	name: "gapCursor",
	addProseMirrorPlugins() {
		return [ny()];
	},
	extendNodeSchema(e) {
		return { allowGapCursor: q(K(e, "allowGapCursor", {
			name: e.name,
			options: e.options,
			storage: e.storage
		})) ?? null };
	}
}), Py = "placeholder", Fy = new tr("tiptap__placeholder"), Iy = 200;
function Ly(e) {
	let { editor: t, placeholder: n, dataAttribute: r, pos: i, node: a, isEmptyDoc: o, hasAnchor: s, classes: { emptyNode: c, emptyEditor: l } } = e, u = [c];
	return o && u.push(l), Ss.node(i, i + a.nodeSize, {
		class: u.join(" "),
		[r]: typeof n == "function" ? n({
			editor: t,
			node: a,
			pos: i,
			hasAnchor: s
		}) : n
	});
}
function Ry(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function zy({ editor: e, options: t, dataAttribute: n, doc: r, selection: i }) {
	if (!(e.isEditable || !t.showOnlyWhenEditable)) return null;
	let { anchor: a } = i, o = [], s = e.isEmpty;
	if (t.showOnlyCurrent && !t.includeChildren) {
		let i = r.resolve(a), c = i.depth > 0 ? i.node(1) : i.nodeAfter, l = i.depth > 0 ? i.before(1) : a;
		if (c && c.type.isTextblock && ku(c)) {
			let r = a >= l && a <= l + c.nodeSize;
			o.push(Ly({
				editor: e,
				isEmptyDoc: s,
				dataAttribute: n,
				hasAnchor: r,
				placeholder: t.placeholder,
				classes: {
					emptyEditor: t.emptyEditorClass,
					emptyNode: Ry(t.emptyNodeClass, {
						editor: e,
						node: c,
						pos: l,
						hasAnchor: r
					})
				},
				node: c,
				pos: l
			}));
		}
	} else {
		let i = Fy.getState(e.state), c = i?.topPos ?? 0, l = i?.bottomPos ?? r.content.size;
		r.nodesBetween(c, l, (r, i) => {
			let c = a >= i && a <= i + r.nodeSize, l = !r.isLeaf && ku(r);
			return r.type.isTextblock && (c || !t.showOnlyCurrent) && l && o.push(Ly({
				editor: e,
				isEmptyDoc: s,
				dataAttribute: n,
				hasAnchor: c,
				placeholder: t.placeholder,
				classes: {
					emptyEditor: t.emptyEditorClass,
					emptyNode: Ry(t.emptyNodeClass, {
						editor: e,
						node: r,
						pos: i,
						hasAnchor: c
					})
				},
				node: r,
				pos: i
			})), t.includeChildren;
		});
	}
	return Ts.create(r, o);
}
function By(e) {
	return e.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/^[0-9-]+/, "").replace(/^-+/, "").toLowerCase();
}
function Vy(e) {
	let t = getComputedStyle(e), n = `${t.overflow} ${t.overflowY} ${t.overflowX}`;
	return /auto|scroll|overlay/.test(n);
}
function Hy(e) {
	let t = e;
	for (; t;) {
		if (Vy(t)) return t;
		let e = t.parentElement;
		if (!e) {
			let e = t.getRootNode();
			if (e instanceof ShadowRoot) {
				t = e.host;
				continue;
			}
			return window;
		}
		t = e;
	}
	return window;
}
function Uy(e) {
	return e === window ? {
		top: 0,
		bottom: window.innerHeight
	} : e.getBoundingClientRect();
}
function Wy({ doc: e, view: t, scrollContainer: n }) {
	let r = t.dom.getBoundingClientRect(), i = n ? Uy(n) : {
		top: 0,
		bottom: window.innerHeight
	}, a = Math.max(r.top, i.top) - Iy, o = Math.min(r.bottom, i.bottom) + Iy;
	if (a >= o) return {
		top: 0,
		bottom: e.content.size
	};
	let s = getComputedStyle(t.dom).direction === "rtl" ? Math.max(r.right - 2, r.left + 2) : r.left + 2, c = t.posAtCoords({
		left: s,
		top: a + 2
	}), l = t.posAtCoords({
		left: s,
		top: o - 2
	});
	return {
		top: c ? c.pos : 0,
		bottom: l ? l.pos : e.content.size
	};
}
var Gy = {
	init() {
		return {
			topPos: null,
			bottomPos: null
		};
	},
	apply(e, t) {
		let n = e.getMeta(Fy);
		return n?.positions ? {
			topPos: n.positions.top,
			bottomPos: n.positions.bottom
		} : e.docChanged ? {
			topPos: t.topPos === null ? null : e.mapping.map(t.topPos),
			bottomPos: t.bottomPos === null ? null : e.mapping.map(t.bottomPos)
		} : t;
	}
};
function Ky(e) {
	let t = Hy(e.dom), n = () => {
		let n = Wy({
			view: e,
			doc: e.state.doc,
			scrollContainer: t
		}), r = Fy.getState(e.state);
		if (r?.topPos === n.top && r?.bottomPos === n.bottom) return;
		let i = e.state.tr.setMeta(Fy, { positions: n });
		e.dispatch(i);
	}, r = null, i = 0, a = () => {
		r === null && (r = requestAnimationFrame(() => {
			r = null;
			let e = performance.now();
			e - i >= 150 ? (i = e, n()) : a();
		}));
	};
	return t.addEventListener("scroll", a, { passive: !0 }), n(), {
		update(t, n) {
			e.state.doc.content.size !== n.doc.content.size && a();
		},
		destroy: () => {
			r !== null && cancelAnimationFrame(r), t.removeEventListener("scroll", a);
		}
	};
}
function qy({ editor: e, options: t }) {
	let n = t.dataAttribute ? `data-${By(t.dataAttribute)}` : `data-${Py}`;
	return new Qn({
		key: Fy,
		state: Gy,
		view: Ky,
		props: { decorations: ({ doc: r, selection: i }) => zy({
			editor: e,
			options: t,
			dataAttribute: n,
			doc: r,
			selection: i
		}) }
	});
}
Fd.create({
	name: "placeholder",
	addOptions() {
		return {
			emptyEditorClass: "is-editor-empty",
			emptyNodeClass: "is-empty",
			dataAttribute: Py,
			placeholder: "Write something …",
			showOnlyWhenEditable: !0,
			showOnlyCurrent: !0,
			includeChildren: !1
		};
	},
	addProseMirrorPlugins() {
		return [qy({
			editor: this.editor,
			options: this.options
		})];
	}
});
var Jy = ".ProseMirror:not(.ProseMirror-focused) *::selection {\n  background: transparent;\n}\n\n.ProseMirror:not(.ProseMirror-focused) *::-moz-selection {\n  background: transparent;\n}";
Fd.create({
	name: "selection",
	addOptions() {
		return { className: "selection" };
	},
	addProseMirrorPlugins() {
		let { editor: e, options: t } = this;
		return e.options.injectCSS && typeof document < "u" && cd(Jy, e.options.injectNonce, "selection"), [new Qn({
			key: new tr("selection"),
			props: { decorations(n) {
				return n.selection.empty || e.isFocused || !e.isEditable || Au(n.selection) || e.view.dragging ? null : Ts.create(n.doc, [Ss.inline(n.selection.from, n.selection.to, { class: t.className })]);
			} }
		})];
	}
});
function Yy({ types: e, node: t }) {
	return t && Array.isArray(e) && e.includes(t.type) || t?.type === e;
}
var Xy = Fd.create({
	name: "trailingNode",
	addOptions() {
		return {
			node: void 0,
			notAfter: []
		};
	},
	addProseMirrorPlugins() {
		let e = new tr(this.name), t = this.options.node || this.editor.schema.topNodeType.contentMatch.defaultType?.name || "paragraph", n = Object.entries(this.editor.schema.nodes).map(([, e]) => e).filter((e) => (this.options.notAfter || []).concat(t).includes(e.name));
		return [new Qn({
			key: e,
			appendTransaction: (n, r, i) => {
				let { doc: a, tr: o, schema: s } = i, c = e.getState(i), l = a.content.size, u = s.nodes[t];
				if (!n.some((e) => e.getMeta("skipTrailingNode")) && c) return o.insert(l, u.create());
			},
			state: {
				init: (e, t) => {
					let r = t.tr.doc.lastChild;
					return !Yy({
						node: r,
						types: n
					});
				},
				apply: (e, t) => {
					if (!e.docChanged || e.getMeta("__uniqueIDTransaction")) return t;
					let r = e.doc.lastChild;
					return !Yy({
						node: r,
						types: n
					});
				}
			}
		})];
	}
}), Zy = Fd.create({
	name: "undoRedo",
	addOptions() {
		return {
			depth: 100,
			newGroupDelay: 500
		};
	},
	addCommands() {
		return {
			undo: () => ({ state: e, dispatch: t }) => Ay(e, t),
			redo: () => ({ state: e, dispatch: t }) => jy(e, t)
		};
	},
	addProseMirrorPlugins() {
		return [Oy(this.options)];
	},
	addKeyboardShortcuts() {
		return {
			"Mod-z": () => this.editor.commands.undo(),
			"Shift-Mod-z": () => this.editor.commands.redo(),
			"Mod-y": () => this.editor.commands.redo(),
			"Mod-я": () => this.editor.commands.undo(),
			"Shift-Mod-я": () => this.editor.commands.redo()
		};
	}
}), Qy = Fd.create({
	name: "starterKit",
	addExtensions() {
		let e = [];
		return this.options.bold !== !1 && e.push(ah.configure(this.options.bold)), this.options.blockquote !== !1 && e.push(eh.configure(this.options.blockquote)), this.options.bulletList !== !1 && e.push(V_.configure(this.options.bulletList)), this.options.code !== !1 && e.push(ch.configure(this.options.code)), this.options.codeBlock !== !1 && e.push(fh.configure(this.options.codeBlock)), this.options.document !== !1 && e.push(ph.configure(this.options.document)), this.options.dropcursor !== !1 && e.push(My.configure(this.options.dropcursor)), this.options.gapcursor !== !1 && e.push(Ny.configure(this.options.gapcursor)), this.options.hardBreak !== !1 && e.push(mh.configure(this.options.hardBreak)), this.options.heading !== !1 && e.push(hh.configure(this.options.heading)), this.options.undoRedo !== !1 && e.push(Zy.configure(this.options.undoRedo)), this.options.horizontalRule !== !1 && e.push(gh.configure(this.options.horizontalRule)), this.options.italic !== !1 && e.push(xh.configure(this.options.italic)), this.options.listItem !== !1 && e.push(uv.configure(this.options.listItem)), this.options.listKeymap !== !1 && e.push(xv.configure(this.options?.listKeymap)), this.options.link !== !1 && e.push(F_.configure(this.options?.link)), this.options.orderedList !== !1 && e.push(Lv.configure(this.options.orderedList)), this.options.paragraph !== !1 && e.push(Uv.configure(this.options.paragraph)), this.options.strike !== !1 && e.push(Kv.configure(this.options.strike)), this.options.text !== !1 && e.push(qv.configure(this.options.text)), this.options.underline !== !1 && e.push(Jv.configure(this.options?.underline)), this.options.trailingNode !== !1 && e.push(Xy.configure(this.options?.trailingNode)), e;
	}
});
//#endregion
//#region src/web/frontend/main.tsx
function $y() {
	let e = document.getElementById("document-editor-data");
	if (!e?.textContent) throw Error("Preview data missing");
	return JSON.parse(e.textContent);
}
function eb({ editor: e }) {
	return e ? /* @__PURE__ */ (0, z.jsxs)("div", {
		className: "editor-toolbar",
		"aria-label": "Outils de mise en forme",
		children: [
			/* @__PURE__ */ (0, z.jsx)("button", {
				type: "button",
				onClick: () => e.chain().focus().toggleBold().run(),
				className: e.isActive("bold") ? "active" : "",
				children: "Gras"
			}),
			/* @__PURE__ */ (0, z.jsx)("button", {
				type: "button",
				onClick: () => e.chain().focus().toggleItalic().run(),
				className: e.isActive("italic") ? "active" : "",
				children: "Italique"
			}),
			/* @__PURE__ */ (0, z.jsx)("button", {
				type: "button",
				onClick: () => e.chain().focus().toggleBulletList().run(),
				className: e.isActive("bulletList") ? "active" : "",
				children: "Liste"
			}),
			/* @__PURE__ */ (0, z.jsx)("button", {
				type: "button",
				onClick: () => e.chain().focus().undo().run(),
				children: "Annuler"
			}),
			/* @__PURE__ */ (0, z.jsx)("button", {
				type: "button",
				onClick: () => e.chain().focus().redo().run(),
				children: "Rétablir"
			})
		]
	}) : null;
}
function tb({ label: e, generated: t, edited: n, onChange: r }) {
	let i = mp({
		extensions: [Qy],
		content: n || t,
		immediatelyRender: !1,
		onUpdate: ({ editor: e }) => {
			r(e.getHTML(), e.getHTML() !== t);
		}
	});
	return /* @__PURE__ */ (0, z.jsxs)("div", {
		className: "document-editor-panel",
		"aria-label": e,
		children: [/* @__PURE__ */ (0, z.jsx)(eb, { editor: i }), /* @__PURE__ */ (0, z.jsx)("div", {
			className: "document-workspace",
			"aria-label": `Zone de travail ${e}`,
			children: /* @__PURE__ */ (0, z.jsx)(op, {
				editor: i,
				className: "document-editor document-page"
			})
		})]
	});
}
function nb({ session: e }) {
	let [t, n] = (0, R.useState)("cv"), [r] = (0, R.useState)(e.cv_generated), [i, a] = (0, R.useState)(e.cv_edited || e.cv_generated), [o, s] = (0, R.useState)(e.cv_is_dirty), [c] = (0, R.useState)(e.lm_generated), [l, u] = (0, R.useState)(e.lm_edited || e.lm_generated), [d, f] = (0, R.useState)(e.lm_is_dirty);
	return /* @__PURE__ */ (0, z.jsxs)("form", {
		method: "post",
		action: `/preview/${e.preview_id}/export`,
		className: "document-editor-form",
		children: [
			/* @__PURE__ */ (0, z.jsx)("input", {
				type: "hidden",
				name: "cv_edited",
				value: i
			}),
			/* @__PURE__ */ (0, z.jsx)("input", {
				type: "hidden",
				name: "cv_is_dirty",
				value: String(o)
			}),
			/* @__PURE__ */ (0, z.jsx)("input", {
				type: "hidden",
				name: "lm_edited",
				value: l
			}),
			/* @__PURE__ */ (0, z.jsx)("input", {
				type: "hidden",
				name: "lm_is_dirty",
				value: String(d)
			}),
			/* @__PURE__ */ (0, z.jsxs)("div", {
				className: "editor-tabs",
				role: "tablist",
				"aria-label": "Documents",
				children: [/* @__PURE__ */ (0, z.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": t === "cv",
					onClick: () => n("cv"),
					children: ["CV ", o ? "modifié" : "généré"]
				}), /* @__PURE__ */ (0, z.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": t === "lm",
					onClick: () => n("lm"),
					children: ["Lettre de motivation ", d ? "modifiée" : "générée"]
				})]
			}),
			/* @__PURE__ */ (0, z.jsx)("div", {
				hidden: t !== "cv",
				children: /* @__PURE__ */ (0, z.jsx)(tb, {
					label: "CV",
					generated: r,
					edited: i,
					onChange: (e, t) => {
						a(e), s(t);
					}
				})
			}),
			/* @__PURE__ */ (0, z.jsx)("div", {
				hidden: t !== "lm",
				children: /* @__PURE__ */ (0, z.jsx)(tb, {
					label: "Lettre de motivation",
					generated: c,
					edited: l,
					onChange: (e, t) => {
						u(e), f(t);
					}
				})
			}),
			/* @__PURE__ */ (0, z.jsx)("button", {
				className: "button primary",
				type: "submit",
				children: "Télécharger ZIP"
			})
		]
	});
}
var rb = document.getElementById("document-editor-root");
rb && (0, Dc.createRoot)(rb).render(/* @__PURE__ */ (0, z.jsx)(nb, { session: $y() }));
//#endregion
