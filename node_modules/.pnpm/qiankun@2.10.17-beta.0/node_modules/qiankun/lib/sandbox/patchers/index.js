"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = void 0;
exports.patchAtBootstrapping = patchAtBootstrapping;
exports.patchAtMounting = patchAtMounting;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _interfaces = require("../../interfaces");

var css = _interopRequireWildcard(require("./css"));

exports.css = css;

var _dynamicAppend = require("./dynamicAppend");

var _historyListener = _interopRequireDefault(require("./historyListener"));

var _interval = _interopRequireDefault(require("./interval"));

var _windowListener = _interopRequireDefault(require("./windowListener"));

function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }

/**
 * @author Kuitos
 * @since 2019-04-11
 */
function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
  var _patchersInSandbox$sa;

  var basePatchers = [function () {
    return (0, _interval.default)(sandbox.proxy);
  }, function () {
    return (0, _windowListener.default)(sandbox.proxy);
  }, function () {
    return (0, _historyListener.default)();
  }];
  var patchersInSandbox = (0, _defineProperty2.default)((0, _defineProperty2.default)((0, _defineProperty2.default)({}, _interfaces.SandBoxType.LegacyProxy, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter);
  }])), _interfaces.SandBoxType.Proxy, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchStrictSandbox)(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter, speedySandBox);
  }])), _interfaces.SandBoxType.Snapshot, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter);
  }]));
  return (_patchersInSandbox$sa = patchersInSandbox[sandbox.type]) === null || _patchersInSandbox$sa === void 0 ? void 0 : _patchersInSandbox$sa.map(function (patch) {
    return patch();
  });
}

function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
  var _patchersInSandbox$sa2;

  var patchersInSandbox = (0, _defineProperty2.default)((0, _defineProperty2.default)((0, _defineProperty2.default)({}, _interfaces.SandBoxType.LegacyProxy, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter);
  }]), _interfaces.SandBoxType.Proxy, [function () {
    return (0, _dynamicAppend.patchStrictSandbox)(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter, speedySandBox);
  }]), _interfaces.SandBoxType.Snapshot, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter);
  }]);
  return (_patchersInSandbox$sa2 = patchersInSandbox[sandbox.type]) === null || _patchersInSandbox$sa2 === void 0 ? void 0 : _patchersInSandbox$sa2.map(function (patch) {
    return patch();
  });
}