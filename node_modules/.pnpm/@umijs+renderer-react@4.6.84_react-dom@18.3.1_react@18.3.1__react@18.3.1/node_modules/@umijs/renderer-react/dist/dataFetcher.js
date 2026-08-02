export function fetchServerLoader(_ref) {
  var id = _ref.id,
    basename = _ref.basename,
    cb = _ref.cb,
    pluginManager = _ref.pluginManager;
  var query = new URLSearchParams({
    route: id,
    url: window.location.href
  }).toString();
  // 在有basename的情况下__serverLoader的请求路径需要加上basename
  // FIXME: 先临时解自定义 serverLoader 请求路径的问题，后续改造 serverLoader 时再提取成类似 runtimeServerLoader 的配置项
  var defaultUrl = "".concat(withEndSlash(window.umiServerLoaderPath || basename), "__serverLoader?").concat(query);

  // Runtime hook to let consumers rewrite the direct serverLoader request
  // (e.g. add gateway headers/query when calling WebGW FaaS directly).
  // The framework stays agnostic of any gateway protocol.
  var req = {
    url: defaultUrl,
    options: {
      credentials: 'include'
    }
  };
  if (pluginManager !== null && pluginManager !== void 0 && pluginManager.applyPlugins) {
    req = pluginManager.applyPlugins({
      key: 'modifyServerLoaderRequest',
      type: 'modify',
      initialValue: req,
      args: {
        id: id,
        basename: basename
      }
    });
  }
  fetch(req.url, req.options).then(function (d) {
    return d.json();
  }).then(cb).catch(console.error);
}
function withEndSlash() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return str.endsWith('/') ? str : "".concat(str, "/");
}