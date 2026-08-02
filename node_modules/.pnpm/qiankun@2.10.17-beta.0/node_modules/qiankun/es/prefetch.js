import _isFunction from "lodash/isFunction";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }

function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }

/**
 * @author Kuitos
 * @since 2019-02-26
 */
import { importEntry } from 'import-html-entry';
import { getAppStatus, getMountedApps, NOT_LOADED } from 'single-spa';

function idleCall(cb, start) {
  cb({
    didTimeout: false,
    timeRemaining: function timeRemaining() {
      return Math.max(0, 50 - (Date.now() - start));
    }
  });
} // RIC and shim for browsers setTimeout() without it idle


var requestIdleCallback;

if (typeof window.requestIdleCallback !== 'undefined') {
  requestIdleCallback = window.requestIdleCallback;
} else if (typeof window.MessageChannel !== 'undefined') {
  // The first recommendation is to use MessageChannel because
  // it does not have the 4ms delay of setTimeout
  var channel = new MessageChannel();
  var port = channel.port2;
  var tasks = [];

  channel.port1.onmessage = function (_ref) {
    var data = _ref.data;
    var task = tasks.shift();

    if (!task) {
      return;
    }

    idleCall(task, data.start);
  };

  requestIdleCallback = function requestIdleCallback(cb) {
    tasks.push(cb);
    port.postMessage({
      start: Date.now()
    });
  };
} else {
  requestIdleCallback = function requestIdleCallback(cb) {
    return setTimeout(idleCall, 0, cb, Date.now());
  };
}

var isSlowNetwork = navigator.connection ? navigator.connection.saveData || navigator.connection.type !== 'wifi' && navigator.connection.type !== 'ethernet' && /([23])g/.test(navigator.connection.effectiveType) : false;
/**
 * prefetch assets, do nothing while in mobile network
 * @param entry
 * @param opts
 */

function prefetch(entry, opts) {
  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }

  requestIdleCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regenerator().m(function _callee() {
    var _yield$importEntry, getExternalScripts, getExternalStyleSheets;

    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return importEntry(entry, opts);

        case 1:
          _yield$importEntry = _context.v;
          getExternalScripts = _yield$importEntry.getExternalScripts;
          getExternalStyleSheets = _yield$importEntry.getExternalStyleSheets;
          requestIdleCallback(getExternalStyleSheets);
          requestIdleCallback(getExternalScripts);

        case 2:
          return _context.a(2);
      }
    }, _callee);
  })));
}

function prefetchAfterFirstMounted(apps, opts) {
  window.addEventListener('single-spa:first-mount', function listener() {
    var notLoadedApps = apps.filter(function (app) {
      return getAppStatus(app.name) === NOT_LOADED;
    });

    if (process.env.NODE_ENV === 'development') {
      var mountedApps = getMountedApps();
      console.log("[qiankun] prefetch starting after ".concat(mountedApps, " mounted..."), notLoadedApps);
    }

    notLoadedApps.forEach(function (_ref3) {
      var entry = _ref3.entry;
      return prefetch(entry, opts);
    });
    window.removeEventListener('single-spa:first-mount', listener);
  });
}

export function prefetchImmediately(apps, opts) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[qiankun] prefetch starting for apps...', apps);
  }

  apps.forEach(function (_ref4) {
    var entry = _ref4.entry;
    return prefetch(entry, opts);
  });
}
export function doPrefetchStrategy(apps, prefetchStrategy, importEntryOpts) {
  var appsName2Apps = function appsName2Apps(names) {
    return apps.filter(function (app) {
      return names.includes(app.name);
    });
  };

  if (Array.isArray(prefetchStrategy)) {
    prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy), importEntryOpts);
  } else if (_isFunction(prefetchStrategy)) {
    _asyncToGenerator( /*#__PURE__*/_regenerator().m(function _callee2() {
      var _yield$prefetchStrate, _yield$prefetchStrate2, criticalAppNames, _yield$prefetchStrate3, minorAppsName;

      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return prefetchStrategy(apps);

          case 1:
            _yield$prefetchStrate = _context2.v;
            _yield$prefetchStrate2 = _yield$prefetchStrate.criticalAppNames;
            criticalAppNames = _yield$prefetchStrate2 === void 0 ? [] : _yield$prefetchStrate2;
            _yield$prefetchStrate3 = _yield$prefetchStrate.minorAppsName;
            minorAppsName = _yield$prefetchStrate3 === void 0 ? [] : _yield$prefetchStrate3;
            prefetchImmediately(appsName2Apps(criticalAppNames), importEntryOpts);
            prefetchAfterFirstMounted(appsName2Apps(minorAppsName), importEntryOpts);

          case 2:
            return _context2.a(2);
        }
      }, _callee2);
    }))();
  } else {
    switch (prefetchStrategy) {
      case true:
        prefetchAfterFirstMounted(apps, importEntryOpts);
        break;

      case 'all':
        prefetchImmediately(apps, importEntryOpts);
        break;

      default:
        break;
    }
  }
}