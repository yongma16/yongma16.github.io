"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadApp = loadApp;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var _noop2 = _interopRequireDefault(require("lodash/noop"));

var _concat2 = _interopRequireDefault(require("lodash/concat"));

var _mergeWith3 = _interopRequireDefault(require("lodash/mergeWith"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _forEach2 = _interopRequireDefault(require("lodash/forEach"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _importHtmlEntry = require("import-html-entry");

var _addons = _interopRequireDefault(require("./addons"));

var _error = require("./error");

var _globalState = require("./globalState");

var _sandbox = require("./sandbox");

var _proxySandbox = require("./sandbox/proxySandbox");

var _utils = require("./utils");

var _excluded = ["singular", "sandbox", "excludeAssetFilter", "globalContext"];

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }

function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @author Kuitos
                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @since 2020-04-01
                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */

function assertElementExist(element, msg) {
  if (!element) {
    if (msg) {
      throw new _error.QiankunError(msg);
    }

    throw new _error.QiankunError('element not existed!');
  }
}

function execHooksChain(hooks, app) {
  var global = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;

  if (hooks.length) {
    return hooks.reduce(function (chain, hook) {
      return chain.then(function () {
        return hook(app, global);
      });
    }, Promise.resolve());
  }

  return Promise.resolve();
}

function validateSingularMode(_x, _x2) {
  return _validateSingularMode.apply(this, arguments);
}

function _validateSingularMode() {
  _validateSingularMode = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee(validate, app) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          return _context.a(2, typeof validate === 'function' ? validate(app) : !!validate);
      }
    }, _callee);
  }));
  return _validateSingularMode.apply(this, arguments);
}

var supportShadowDOM = !!document.head.attachShadow || !!document.head.createShadowRoot;

function createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId) {
  var containerElement = document.createElement('div');
  containerElement.innerHTML = appContent; // appContent always wrapped with a singular div

  var appElement = containerElement.firstChild;

  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn('[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!');
    } else {
      var innerHTML = appElement.innerHTML;
      appElement.innerHTML = '';
      var shadow;

      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({
          mode: 'open'
        });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = appElement.createShadowRoot();
      }

      shadow.innerHTML = innerHTML;
    }
  }

  if (scopedCSS) {
    var attr = appElement.getAttribute(_sandbox.css.QiankunCSSRewriteAttr);

    if (!attr) {
      appElement.setAttribute(_sandbox.css.QiankunCSSRewriteAttr, appInstanceId);
    }

    var styleNodes = appElement.querySelectorAll('style') || [];
    (0, _forEach2.default)(styleNodes, function (stylesheetElement) {
      _sandbox.css.process(appElement, stylesheetElement, appInstanceId);
    });
  }

  return appElement;
}
/** generate app wrapper dom getter */


function getAppWrapperGetter(appInstanceId, useLegacyRender, strictStyleIsolation, scopedCSS, elementGetter) {
  return function () {
    if (useLegacyRender) {
      if (strictStyleIsolation) throw new _error.QiankunError('strictStyleIsolation can not be used with legacy render!');
      if (scopedCSS) throw new _error.QiankunError('experimentalStyleIsolation can not be used with legacy render!');
      var appWrapper = document.getElementById((0, _utils.getWrapperId)(appInstanceId));
      assertElementExist(appWrapper, "Wrapper element for ".concat(appInstanceId, " is not existed!"));
      return appWrapper;
    }

    var element = elementGetter();
    assertElementExist(element, "Wrapper element for ".concat(appInstanceId, " is not existed!"));

    if (strictStyleIsolation && supportShadowDOM) {
      return element.shadowRoot;
    }

    return element;
  };
}

var rawAppendChild = HTMLElement.prototype.appendChild;
var rawRemoveChild = HTMLElement.prototype.removeChild;
/**
 * Get the render function
 * If the legacy render function is provide, used as it, otherwise we will insert the app element to target container by qiankun
 * @param appInstanceId
 * @param appContent
 * @param legacyRender
 */

function getRender(appInstanceId, appContent, legacyRender) {
  var render = function render(_ref, phase) {
    var element = _ref.element,
        loading = _ref.loading,
        container = _ref.container;

    if (legacyRender) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[qiankun] Custom rendering function is deprecated and will be removed in 3.0, you can use the container element setting instead!');
      }

      return legacyRender({
        loading: loading,
        appContent: element ? appContent : ''
      });
    }

    var containerElement = (0, _utils.getContainer)(container); // The container might have be removed after micro app unmounted.
    // Such as the micro app unmount lifecycle called by a react componentWillUnmount lifecycle, after micro app unmounted, the react component might also be removed

    if (phase !== 'unmounted') {
      var errorMsg = function () {
        switch (phase) {
          case 'loading':
          case 'mounting':
            return "Target container with ".concat(container, " not existed while ").concat(appInstanceId, " ").concat(phase, "!");

          case 'mounted':
            return "Target container with ".concat(container, " not existed after ").concat(appInstanceId, " ").concat(phase, "!");

          default:
            return "Target container with ".concat(container, " not existed while ").concat(appInstanceId, " rendering!");
        }
      }();

      assertElementExist(containerElement, errorMsg);
    }

    if (containerElement && !containerElement.contains(element)) {
      // clear the container
      while (containerElement.firstChild) {
        rawRemoveChild.call(containerElement, containerElement.firstChild);
      } // append the element to container if it exist


      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }

    return undefined;
  };

  return render;
}

function getLifecyclesFromExports(scriptExports, appName, global, globalLatestSetProp) {
  if ((0, _utils.validateExportLifecycle)(scriptExports)) {
    return scriptExports;
  } // fallback to sandbox latest set property if it had


  if (globalLatestSetProp) {
    var lifecycles = global[globalLatestSetProp];

    if ((0, _utils.validateExportLifecycle)(lifecycles)) {
      return lifecycles;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn("[qiankun] lifecycle not found from ".concat(appName, " entry exports, fallback to get from window['").concat(appName, "']"));
  } // fallback to global variable who named with ${appName} while module exports not found


  var globalVariableExports = global[appName];

  if ((0, _utils.validateExportLifecycle)(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new _error.QiankunError("You need to export lifecycle functions in ".concat(appName, " entry"));
}

var prevAppUnmountedDeferred;

function loadApp(_x3) {
  return _loadApp.apply(this, arguments);
}

function _loadApp() {
  _loadApp = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee15(app) {
    var _sandboxContainer, _sandboxContainer$ins;

    var configuration,
        lifeCycles,
        entry,
        appName,
        appInstanceId,
        markName,
        _configuration$singul,
        singular,
        _configuration$sandbo,
        sandbox,
        excludeAssetFilter,
        _configuration$global,
        globalContext,
        importEntryOpts,
        _yield$importEntry,
        template,
        execScripts,
        assetPublicPath,
        getExternalScripts,
        appContent,
        strictStyleIsolation,
        scopedCSS,
        initialAppWrapperElement,
        initialContainer,
        legacyRender,
        render,
        initialAppWrapperGetter,
        global,
        mountSandbox,
        unmountSandbox,
        useLooseSandbox,
        speedySandbox,
        sandboxContainer,
        _mergeWith,
        _mergeWith$beforeUnmo,
        beforeUnmount,
        _mergeWith$afterUnmou,
        afterUnmount,
        _mergeWith$afterMount,
        afterMount,
        _mergeWith$beforeMoun,
        beforeMount,
        _mergeWith$beforeLoad,
        beforeLoad,
        resetCurrentScript,
        execScriptOpts,
        scriptExports,
        _getLifecyclesFromExp,
        bootstrap,
        mount,
        unmount,
        update,
        _getMicroAppStateActi,
        onGlobalStateChange,
        setGlobalState,
        offGlobalStateChange,
        syncAppWrapperElement2Sandbox,
        parcelConfigGetter,
        _args15 = arguments;

    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          configuration = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : {};
          lifeCycles = _args15.length > 2 ? _args15[2] : undefined;
          entry = app.entry, appName = app.name;
          appInstanceId = (0, _utils.genAppInstanceIdByName)(appName);
          markName = "[qiankun] App ".concat(appInstanceId, " Loading");

          if (process.env.NODE_ENV === 'development') {
            (0, _utils.performanceMark)(markName);
          }

          _configuration$singul = configuration.singular, singular = _configuration$singul === void 0 ? false : _configuration$singul, _configuration$sandbo = configuration.sandbox, sandbox = _configuration$sandbo === void 0 ? true : _configuration$sandbo, excludeAssetFilter = configuration.excludeAssetFilter, _configuration$global = configuration.globalContext, globalContext = _configuration$global === void 0 ? window : _configuration$global, importEntryOpts = (0, _objectWithoutProperties2.default)(configuration, _excluded); // get the entry html content and script executor

          _context15.n = 1;
          return (0, _importHtmlEntry.importEntry)(entry, importEntryOpts);

        case 1:
          _yield$importEntry = _context15.v;
          template = _yield$importEntry.template;
          execScripts = _yield$importEntry.execScripts;
          assetPublicPath = _yield$importEntry.assetPublicPath;
          getExternalScripts = _yield$importEntry.getExternalScripts;
          _context15.n = 2;
          return getExternalScripts();

        case 2:
          _context15.n = 3;
          return validateSingularMode(singular, app);

        case 3:
          if (!_context15.v) {
            _context15.n = 4;
            break;
          }

          _context15.n = 4;
          return prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise;

        case 4:
          appContent = (0, _utils.getDefaultTplWrapper)(appInstanceId, sandbox)(template);
          strictStyleIsolation = (0, _typeof2.default)(sandbox) === 'object' && !!sandbox.strictStyleIsolation;

          if (process.env.NODE_ENV === 'development' && strictStyleIsolation) {
            console.warn("[qiankun] strictStyleIsolation configuration will be removed in 3.0, pls don't depend on it or use experimentalStyleIsolation instead!");
          }

          scopedCSS = (0, _utils.isEnableScopedCSS)(sandbox);
          initialAppWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId);
          initialContainer = 'container' in app ? app.container : undefined;
          legacyRender = 'render' in app ? app.render : undefined;
          render = getRender(appInstanceId, appContent, legacyRender); // 第一次加载设置应用可见区域 dom 结构
          // 确保每次应用加载前容器 dom 结构已经设置完毕

          render({
            element: initialAppWrapperElement,
            loading: true,
            container: initialContainer
          }, 'loading');
          initialAppWrapperGetter = getAppWrapperGetter(appInstanceId, !!legacyRender, strictStyleIsolation, scopedCSS, function () {
            return initialAppWrapperElement;
          });
          global = globalContext;

          mountSandbox = function mountSandbox() {
            return Promise.resolve();
          };

          unmountSandbox = function unmountSandbox() {
            return Promise.resolve();
          };

          useLooseSandbox = (0, _typeof2.default)(sandbox) === 'object' && !!sandbox.loose; // enable speedy mode by default

          speedySandbox = (0, _typeof2.default)(sandbox) === 'object' ? sandbox.speedy !== false : true;

          if (sandbox) {
            sandboxContainer = (0, _sandbox.createSandboxContainer)(appInstanceId, // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/qiankun/issues/518
            initialAppWrapperGetter, scopedCSS, useLooseSandbox, excludeAssetFilter, global, speedySandbox); // 用沙箱的代理对象作为接下来使用的全局对象

            global = sandboxContainer.instance.proxy;
            mountSandbox = sandboxContainer.mount;
            unmountSandbox = sandboxContainer.unmount;
          }

          _mergeWith = (0, _mergeWith3.default)({}, (0, _addons.default)(global, assetPublicPath), lifeCycles, function (v1, v2) {
            return (0, _concat2.default)(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
          }), _mergeWith$beforeUnmo = _mergeWith.beforeUnmount, beforeUnmount = _mergeWith$beforeUnmo === void 0 ? [] : _mergeWith$beforeUnmo, _mergeWith$afterUnmou = _mergeWith.afterUnmount, afterUnmount = _mergeWith$afterUnmou === void 0 ? [] : _mergeWith$afterUnmou, _mergeWith$afterMount = _mergeWith.afterMount, afterMount = _mergeWith$afterMount === void 0 ? [] : _mergeWith$afterMount, _mergeWith$beforeMoun = _mergeWith.beforeMount, beforeMount = _mergeWith$beforeMoun === void 0 ? [] : _mergeWith$beforeMoun, _mergeWith$beforeLoad = _mergeWith.beforeLoad, beforeLoad = _mergeWith$beforeLoad === void 0 ? [] : _mergeWith$beforeLoad;
          _context15.n = 5;
          return execHooksChain((0, _utils.toArray)(beforeLoad), app, global);

        case 5:
          // Expose a browser-like `document.currentScript` while import-html-entry executes the entry scripts.
          // Bundlers such as Turbopack/utoopack may resolve chunk URLs from `document.currentScript`, which is
          // otherwise null during qiankun's fetch + eval execution. `afterExec` clears it after each script, and
          // the `.finally` below guarantees cleanup when a script throws (where `afterExec` is not invoked).
          resetCurrentScript = _noop2.default;
          execScriptOpts = {
            scopedGlobalVariables: speedySandbox ? _proxySandbox.cachedGlobals : [],
            beforeExec: function beforeExec(_code, script) {
              resetCurrentScript();
              resetCurrentScript = (0, _utils.patchCurrentScript)((0, _utils.createFakeCurrentScript)(script));
            },
            afterExec: function afterExec() {
              resetCurrentScript();
              resetCurrentScript = _noop2.default;
            }
          }; // get the lifecycle hooks from module exports

          _context15.n = 6;
          return execScripts(global, sandbox && !useLooseSandbox, execScriptOpts).finally(function () {
            return resetCurrentScript();
          });

        case 6:
          scriptExports = _context15.v;
          _getLifecyclesFromExp = getLifecyclesFromExports(scriptExports, appName, global, (_sandboxContainer = sandboxContainer) === null || _sandboxContainer === void 0 ? void 0 : (_sandboxContainer$ins = _sandboxContainer.instance) === null || _sandboxContainer$ins === void 0 ? void 0 : _sandboxContainer$ins.latestSetProp), bootstrap = _getLifecyclesFromExp.bootstrap, mount = _getLifecyclesFromExp.mount, unmount = _getLifecyclesFromExp.unmount, update = _getLifecyclesFromExp.update;
          _getMicroAppStateActi = (0, _globalState.getMicroAppStateActions)(appInstanceId), onGlobalStateChange = _getMicroAppStateActi.onGlobalStateChange, setGlobalState = _getMicroAppStateActi.setGlobalState, offGlobalStateChange = _getMicroAppStateActi.offGlobalStateChange; // FIXME temporary way

          syncAppWrapperElement2Sandbox = function syncAppWrapperElement2Sandbox(element) {
            return initialAppWrapperElement = element;
          };

          parcelConfigGetter = function parcelConfigGetter() {
            var remountContainer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialContainer;
            var appWrapperElement;
            var appWrapperGetter;
            var parcelConfig = {
              name: appInstanceId,
              bootstrap: bootstrap,
              mount: [/*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee2() {
                var marks;
                return _regenerator().w(function (_context2) {
                  while (1) switch (_context2.n) {
                    case 0:
                      if (process.env.NODE_ENV === 'development') {
                        marks = (0, _utils.performanceGetEntriesByName)(markName, 'mark'); // mark length is zero means the app is remounting

                        if (marks && !marks.length) {
                          (0, _utils.performanceMark)(markName);
                        }
                      }

                    case 1:
                      return _context2.a(2);
                  }
                }, _callee2);
              })), /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee3() {
                var _t;

                return _regenerator().w(function (_context3) {
                  while (1) switch (_context3.n) {
                    case 0:
                      _context3.n = 1;
                      return validateSingularMode(singular, app);

                    case 1:
                      _t = _context3.v;

                      if (!_t) {
                        _context3.n = 2;
                        break;
                      }

                      _t = prevAppUnmountedDeferred;

                    case 2:
                      if (!_t) {
                        _context3.n = 3;
                        break;
                      }

                      return _context3.a(2, prevAppUnmountedDeferred.promise);

                    case 3:
                      return _context3.a(2, undefined);
                  }
                }, _callee3);
              })),
              /*#__PURE__*/
              // initial wrapper element before app mount/remount
              (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee4() {
                return _regenerator().w(function (_context4) {
                  while (1) switch (_context4.n) {
                    case 0:
                      appWrapperElement = initialAppWrapperElement;
                      appWrapperGetter = getAppWrapperGetter(appInstanceId, !!legacyRender, strictStyleIsolation, scopedCSS, function () {
                        return appWrapperElement;
                      });

                    case 1:
                      return _context4.a(2);
                  }
                }, _callee4);
              })),
              /*#__PURE__*/
              // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
              (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee5() {
                var useNewContainer;
                return _regenerator().w(function (_context5) {
                  while (1) switch (_context5.n) {
                    case 0:
                      useNewContainer = remountContainer !== initialContainer;

                      if (useNewContainer || !appWrapperElement) {
                        // element will be destroyed after unmounted, we need to recreate it if it not exist
                        // or we try to remount into a new container
                        appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId);
                        syncAppWrapperElement2Sandbox(appWrapperElement);
                      }

                      render({
                        element: appWrapperElement,
                        loading: true,
                        container: remountContainer
                      }, 'mounting');

                    case 1:
                      return _context5.a(2);
                  }
                }, _callee5);
              })), mountSandbox,
              /*#__PURE__*/
              // exec the chain after rendering to keep the behavior with beforeLoad
              (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee6() {
                return _regenerator().w(function (_context6) {
                  while (1) switch (_context6.n) {
                    case 0:
                      return _context6.a(2, execHooksChain((0, _utils.toArray)(beforeMount), app, global));
                  }
                }, _callee6);
              })), /*#__PURE__*/function () {
                var _ref7 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee7(props) {
                  return _regenerator().w(function (_context7) {
                    while (1) switch (_context7.n) {
                      case 0:
                        return _context7.a(2, mount((0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
                          container: appWrapperGetter(),
                          setGlobalState: setGlobalState,
                          onGlobalStateChange: onGlobalStateChange
                        })));
                    }
                  }, _callee7);
                }));

                return function (_x4) {
                  return _ref7.apply(this, arguments);
                };
              }(),
              /*#__PURE__*/
              // finish loading after app mounted
              (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee8() {
                return _regenerator().w(function (_context8) {
                  while (1) switch (_context8.n) {
                    case 0:
                      return _context8.a(2, render({
                        element: appWrapperElement,
                        loading: false,
                        container: remountContainer
                      }, 'mounted'));
                  }
                }, _callee8);
              })), /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee9() {
                return _regenerator().w(function (_context9) {
                  while (1) switch (_context9.n) {
                    case 0:
                      return _context9.a(2, execHooksChain((0, _utils.toArray)(afterMount), app, global));
                  }
                }, _callee9);
              })),
              /*#__PURE__*/
              // initialize the unmount defer after app mounted and resolve the defer after it unmounted
              (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee0() {
                return _regenerator().w(function (_context0) {
                  while (1) switch (_context0.n) {
                    case 0:
                      _context0.n = 1;
                      return validateSingularMode(singular, app);

                    case 1:
                      if (!_context0.v) {
                        _context0.n = 2;
                        break;
                      }

                      prevAppUnmountedDeferred = new _utils.Deferred();

                    case 2:
                      return _context0.a(2);
                  }
                }, _callee0);
              })), /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee1() {
                var measureName;
                return _regenerator().w(function (_context1) {
                  while (1) switch (_context1.n) {
                    case 0:
                      if (process.env.NODE_ENV === 'development') {
                        measureName = "[qiankun] App ".concat(appInstanceId, " Loading Consuming");
                        (0, _utils.performanceMeasure)(measureName, markName);
                      }

                    case 1:
                      return _context1.a(2);
                  }
                }, _callee1);
              }))],
              unmount: [/*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee10() {
                return _regenerator().w(function (_context10) {
                  while (1) switch (_context10.n) {
                    case 0:
                      return _context10.a(2, execHooksChain((0, _utils.toArray)(beforeUnmount), app, global));
                  }
                }, _callee10);
              })), /*#__PURE__*/function () {
                var _ref11 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee11(props) {
                  return _regenerator().w(function (_context11) {
                    while (1) switch (_context11.n) {
                      case 0:
                        return _context11.a(2, unmount((0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
                          container: appWrapperGetter()
                        })));
                    }
                  }, _callee11);
                }));

                return function (_x5) {
                  return _ref11.apply(this, arguments);
                };
              }(), unmountSandbox, /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee12() {
                return _regenerator().w(function (_context12) {
                  while (1) switch (_context12.n) {
                    case 0:
                      return _context12.a(2, execHooksChain((0, _utils.toArray)(afterUnmount), app, global));
                  }
                }, _callee12);
              })), /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee13() {
                return _regenerator().w(function (_context13) {
                  while (1) switch (_context13.n) {
                    case 0:
                      render({
                        element: null,
                        loading: false,
                        container: remountContainer
                      }, 'unmounted');
                      offGlobalStateChange(appInstanceId); // for gc

                      appWrapperElement = null;
                      syncAppWrapperElement2Sandbox(appWrapperElement);

                    case 1:
                      return _context13.a(2);
                  }
                }, _callee13);
              })), /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator().m(function _callee14() {
                var _t2;

                return _regenerator().w(function (_context14) {
                  while (1) switch (_context14.n) {
                    case 0:
                      _context14.n = 1;
                      return validateSingularMode(singular, app);

                    case 1:
                      _t2 = _context14.v;

                      if (!_t2) {
                        _context14.n = 2;
                        break;
                      }

                      _t2 = prevAppUnmountedDeferred;

                    case 2:
                      if (!_t2) {
                        _context14.n = 3;
                        break;
                      }

                      prevAppUnmountedDeferred.resolve();

                    case 3:
                      return _context14.a(2);
                  }
                }, _callee14);
              }))]
            };

            if (typeof update === 'function') {
              parcelConfig.update = update;
            }

            return parcelConfig;
          };

          return _context15.a(2, parcelConfigGetter);
      }
    }, _callee15);
  }));
  return _loadApp.apply(this, arguments);
}