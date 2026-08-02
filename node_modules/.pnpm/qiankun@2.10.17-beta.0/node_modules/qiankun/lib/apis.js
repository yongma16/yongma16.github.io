"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.frameworkConfiguration = void 0;
exports.loadMicroApp = loadMicroApp;
exports.registerMicroApps = registerMicroApps;
exports.start = start;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _noop2 = _interopRequireDefault(require("lodash/noop"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var _singleSpa = require("single-spa");

var _loader = require("./loader");

var _prefetch = require("./prefetch");

var _utils = require("./utils");

var _excluded = ["name", "activeRule", "loader", "props"],
    _excluded2 = ["mount"],
    _excluded3 = ["prefetch", "urlRerouteOnly"];

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }

function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }

var microApps = [];
var frameworkConfiguration = exports.frameworkConfiguration = {};
var started = false;
var defaultUrlRerouteOnly = true;
var frameworkStartedDefer = new _utils.Deferred();

var autoDowngradeForLowVersionBrowser = function autoDowngradeForLowVersionBrowser(configuration) {
  var _configuration$sandbo = configuration.sandbox,
      sandbox = _configuration$sandbo === void 0 ? true : _configuration$sandbo,
      singular = configuration.singular;

  if (sandbox) {
    if (!window.Proxy) {
      console.warn('[qiankun] Missing window.Proxy, proxySandbox will degenerate into snapshotSandbox');

      if (singular === false) {
        console.warn('[qiankun] Setting singular as false may cause unexpected behavior while your browser not support window.Proxy');
      }

      return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, configuration), {}, {
        sandbox: (0, _typeof2.default)(sandbox) === 'object' ? (0, _objectSpread2.default)((0, _objectSpread2.default)({}, sandbox), {}, {
          loose: true
        }) : {
          loose: true
        }
      });
    }

    if (!(0, _utils.isConstDestructAssignmentSupported)() && (sandbox === true || (0, _typeof2.default)(sandbox) === 'object' && sandbox.speedy !== false)) {
      console.warn('[qiankun] Speedy mode will turn off as const destruct assignment not supported in current browser!');
      return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, configuration), {}, {
        sandbox: (0, _typeof2.default)(sandbox) === 'object' ? (0, _objectSpread2.default)((0, _objectSpread2.default)({}, sandbox), {}, {
          speedy: false
        }) : {
          speedy: false
        }
      });
    }
  }

  return configuration;
};

function registerMicroApps(apps, lifeCycles) {
  // Each app only needs to be registered once
  var unregisteredApps = apps.filter(function (app) {
    return !microApps.some(function (registeredApp) {
      return registeredApp.name === app.name;
    });
  });
  microApps = [].concat((0, _toConsumableArray2.default)(microApps), (0, _toConsumableArray2.default)(unregisteredApps));
  unregisteredApps.forEach(function (app) {
    var name = app.name,
        activeRule = app.activeRule,
        _app$loader = app.loader,
        loader = _app$loader === void 0 ? _noop2.default : _app$loader,
        props = app.props,
        appConfig = (0, _objectWithoutProperties2.default)(app, _excluded);
    (0, _singleSpa.registerApplication)({
      name: name,
      app: function () {
        var _app = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee3() {
          var _yield$loadApp, mount, otherMicroAppConfigs, _t;

          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.n) {
              case 0:
                loader(true);
                _context3.n = 1;
                return frameworkStartedDefer.promise;

              case 1:
                _context3.n = 2;
                return (0, _loader.loadApp)((0, _objectSpread2.default)({
                  name: name,
                  props: props
                }, appConfig), frameworkConfiguration, lifeCycles);

              case 2:
                _t = _context3.v;
                _yield$loadApp = _t();
                mount = _yield$loadApp.mount;
                otherMicroAppConfigs = (0, _objectWithoutProperties2.default)(_yield$loadApp, _excluded2);
                return _context3.a(2, (0, _objectSpread2.default)({
                  mount: [/*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee() {
                    return _regenerator().w(function (_context) {
                      while (1) switch (_context.n) {
                        case 0:
                          return _context.a(2, loader(true));
                      }
                    }, _callee);
                  }))].concat((0, _toConsumableArray2.default)((0, _utils.toArray)(mount)), [/*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee2() {
                    return _regenerator().w(function (_context2) {
                      while (1) switch (_context2.n) {
                        case 0:
                          return _context2.a(2, loader(false));
                      }
                    }, _callee2);
                  }))])
                }, otherMicroAppConfigs));
            }
          }, _callee3);
        }));

        function app() {
          return _app.apply(this, arguments);
        }

        return app;
      }(),
      activeWhen: activeRule,
      customProps: props
    });
  });
}

var appConfigPromiseGetterMap = new Map();
var containerMicroAppsMap = new Map();

function loadMicroApp(app, configuration, lifeCycles) {
  var props = app.props,
      name = app.name;
  var container = 'container' in app ? app.container : undefined; // Must compute the container xpath at beginning to keep it consist around app running
  // If we compute it every time, the container dom structure most probably been changed and result in a different xpath value

  var containerXPath = (0, _utils.getContainerXPath)(container);
  var appContainerXPathKey = "".concat(name, "-").concat(containerXPath);
  var microApp;

  var wrapParcelConfigForRemount = function wrapParcelConfigForRemount(config) {
    var microAppConfig = config;

    if (container) {
      if (containerXPath) {
        var containerMicroApps = containerMicroAppsMap.get(appContainerXPathKey);

        if (containerMicroApps === null || containerMicroApps === void 0 ? void 0 : containerMicroApps.length) {
          var mount = [/*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee4() {
            var prevLoadMicroApps, prevLoadMicroAppsWhichNotBroken;
            return _regenerator().w(function (_context4) {
              while (1) switch (_context4.n) {
                case 0:
                  // While there are multiple micro apps mounted on the same container, we must wait until the prev instances all had unmounted
                  // Otherwise it will lead some concurrent issues
                  prevLoadMicroApps = containerMicroApps.slice(0, containerMicroApps.indexOf(microApp));
                  prevLoadMicroAppsWhichNotBroken = prevLoadMicroApps.filter(function (v) {
                    return v.getStatus() !== 'LOAD_ERROR' && v.getStatus() !== 'SKIP_BECAUSE_BROKEN';
                  });
                  _context4.n = 1;
                  return Promise.all(prevLoadMicroAppsWhichNotBroken.map(function (v) {
                    return v.unmountPromise;
                  }));

                case 1:
                  return _context4.a(2);
              }
            }, _callee4);
          }))].concat((0, _toConsumableArray2.default)((0, _utils.toArray)(microAppConfig.mount)));
          microAppConfig = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, config), {}, {
            mount: mount
          });
        }
      }
    }

    return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, microAppConfig), {}, {
      // empty bootstrap hook which should not run twice while it calling from cached micro app
      bootstrap: function bootstrap() {
        return Promise.resolve();
      }
    });
  };
  /**
   * using name + container xpath as the micro app instance id,
   * it means if you rendering a micro app to a dom which have been rendered before,
   * the micro app would not load and evaluate its lifecycles again
   */


  var memorizedLoadingFn = /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee5() {
      var userConfiguration, $$cacheLifecycleByAppName, parcelConfigGetterPromise, _parcelConfigGetterPromise, parcelConfigObjectGetterPromise, _t2, _t3, _t4, _t5, _t6;

      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            userConfiguration = autoDowngradeForLowVersionBrowser(configuration !== null && configuration !== void 0 ? configuration : (0, _objectSpread2.default)((0, _objectSpread2.default)({}, frameworkConfiguration), {}, {
              singular: false
            }));
            $$cacheLifecycleByAppName = userConfiguration.$$cacheLifecycleByAppName;

            if (!container) {
              _context5.n = 4;
              break;
            }

            if (!$$cacheLifecycleByAppName) {
              _context5.n = 2;
              break;
            }

            parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name);

            if (!parcelConfigGetterPromise) {
              _context5.n = 2;
              break;
            }

            _t2 = wrapParcelConfigForRemount;
            _context5.n = 1;
            return parcelConfigGetterPromise;

          case 1:
            _t3 = _context5.v;
            return _context5.a(2, _t2(_t3(container)));

          case 2:
            if (!containerXPath) {
              _context5.n = 4;
              break;
            }

            _parcelConfigGetterPromise = appConfigPromiseGetterMap.get(appContainerXPathKey);

            if (!_parcelConfigGetterPromise) {
              _context5.n = 4;
              break;
            }

            _t4 = wrapParcelConfigForRemount;
            _context5.n = 3;
            return _parcelConfigGetterPromise;

          case 3:
            _t5 = _context5.v;
            return _context5.a(2, _t4(_t5(container)));

          case 4:
            parcelConfigObjectGetterPromise = (0, _loader.loadApp)(app, userConfiguration, lifeCycles);

            if (container) {
              if ($$cacheLifecycleByAppName) {
                appConfigPromiseGetterMap.set(name, parcelConfigObjectGetterPromise);
              } else if (containerXPath) appConfigPromiseGetterMap.set(appContainerXPathKey, parcelConfigObjectGetterPromise);
            }

            _context5.n = 5;
            return parcelConfigObjectGetterPromise;

          case 5:
            _t6 = _context5.v;
            return _context5.a(2, _t6(container));
        }
      }, _callee5);
    }));

    return function memorizedLoadingFn() {
      return _ref4.apply(this, arguments);
    };
  }();

  if (!started && (configuration === null || configuration === void 0 ? void 0 : configuration.autoStart) !== false) {
    var _frameworkConfigurati;

    // We need to invoke start method of single-spa as the popstate event should be dispatched while the main app calling pushState/replaceState automatically,
    // but in single-spa it will check the start status before it dispatch popstate
    // see https://github.com/single-spa/single-spa/blob/f28b5963be1484583a072c8145ac0b5a28d91235/src/navigation/navigation-events.js#L101
    // ref https://github.com/umijs/qiankun/pull/1071
    (0, _singleSpa.start)({
      urlRerouteOnly: (_frameworkConfigurati = frameworkConfiguration.urlRerouteOnly) !== null && _frameworkConfigurati !== void 0 ? _frameworkConfigurati : defaultUrlRerouteOnly
    });
  }

  microApp = (0, _singleSpa.mountRootParcel)(memorizedLoadingFn, (0, _objectSpread2.default)({
    domElement: document.createElement('div')
  }, props));

  if (container) {
    if (containerXPath) {
      // Store the microApps which they mounted on the same container
      var microAppsRef = containerMicroAppsMap.get(appContainerXPathKey) || [];
      microAppsRef.push(microApp);
      containerMicroAppsMap.set(appContainerXPathKey, microAppsRef);

      var cleanup = function cleanup() {
        var index = microAppsRef.indexOf(microApp);
        microAppsRef.splice(index, 1); // @ts-ignore

        microApp = null;
      }; // gc after unmount


      microApp.unmountPromise.then(cleanup).catch(cleanup);
    }
  }

  return microApp;
}

function start() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  exports.frameworkConfiguration = frameworkConfiguration = (0, _objectSpread2.default)({
    prefetch: true,
    singular: true,
    sandbox: true
  }, opts);
  var _frameworkConfigurati2 = frameworkConfiguration,
      prefetch = _frameworkConfigurati2.prefetch,
      _frameworkConfigurati3 = _frameworkConfigurati2.urlRerouteOnly,
      urlRerouteOnly = _frameworkConfigurati3 === void 0 ? defaultUrlRerouteOnly : _frameworkConfigurati3,
      importEntryOpts = (0, _objectWithoutProperties2.default)(_frameworkConfigurati2, _excluded3);

  if (prefetch) {
    (0, _prefetch.doPrefetchStrategy)(microApps, prefetch, importEntryOpts);
  }

  exports.frameworkConfiguration = frameworkConfiguration = autoDowngradeForLowVersionBrowser(frameworkConfiguration);
  (0, _singleSpa.start)({
    urlRerouteOnly: urlRerouteOnly
  });
  started = true;
  frameworkStartedDefer.resolve();
}