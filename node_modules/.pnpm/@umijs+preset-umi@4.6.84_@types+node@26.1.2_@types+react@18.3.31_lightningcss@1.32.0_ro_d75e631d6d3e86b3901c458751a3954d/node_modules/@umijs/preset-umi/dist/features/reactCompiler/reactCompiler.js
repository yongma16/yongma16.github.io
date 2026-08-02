var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/features/reactCompiler/reactCompiler.ts
var reactCompiler_exports = {};
__export(reactCompiler_exports, {
  default: () => reactCompiler_default
});
module.exports = __toCommonJS(reactCompiler_exports);
var import_path = require("path");
var import_resolveProjectDep = require("../../utils/resolveProjectDep");
var BABEL_PLUGIN_NAME = "babel-plugin-react-compiler";
function getReactCompilerConfig(api) {
  if ("reactCompiler" in api.userConfig) {
    return api.userConfig.reactCompiler === true ? {} : api.userConfig.reactCompiler || {};
  }
  const forgetConfig = api.userConfig.forget;
  if (forgetConfig === true)
    return {};
  return (forgetConfig == null ? void 0 : forgetConfig.ReactCompilerConfig) || {};
}
function resolveReactCompilerPlugin(api) {
  try {
    return (0, import_resolveProjectDep.resolveProjectDep)({
      pkg: api.pkg,
      cwd: api.cwd,
      dep: BABEL_PLUGIN_NAME
    }) || (0, import_path.dirname)(require.resolve(`${BABEL_PLUGIN_NAME}/package.json`));
  } catch (e) {
    throw new Error(
      `Cannot find ${BABEL_PLUGIN_NAME}. Please install ${BABEL_PLUGIN_NAME} first.`
    );
  }
}
var reactCompiler_default = (api) => {
  api.describe({
    key: "reactCompiler",
    config: {
      schema({ zod }) {
        return zod.union([zod.boolean(), zod.record(zod.any())]);
      }
    },
    enableBy: ({ userConfig }) => {
      if (userConfig.reactCompiler === false)
        return false;
      return "reactCompiler" in userConfig || "forget" in userConfig;
    }
  });
  api.onCheckConfig(() => {
    if (api.config.mfsu) {
      throw new Error(
        `reactCompiler is not compatible with mfsu, please disable mfsu first.`
      );
    }
    if (api.config.mako) {
      throw new Error(
        `reactCompiler is not compatible with mako, please disable mako first.`
      );
    }
  });
  api.onCheck(() => {
    const reactMajorVersion = Number(api.appData.react.version.split(".")[0]);
    const compilerConfig = getReactCompilerConfig(api);
    const target = compilerConfig.target;
    if (reactMajorVersion < 19 && (!target || target === "19" || target === 19)) {
      throw new Error(
        `reactCompiler requires React 19 by default. For React 17 or 18, please set reactCompiler.target and install react-compiler-runtime.`
      );
    }
  });
  api.addBeforeBabelPlugins({
    name: "reactCompiler",
    stage: -1e4,
    fn: () => {
      return [[resolveReactCompilerPlugin(api), getReactCompilerConfig(api)]];
    }
  });
};
