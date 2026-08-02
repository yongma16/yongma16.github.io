var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/features/ssr/utoopack/utoopack.ts
var utoopack_exports = {};
__export(utoopack_exports, {
  build: () => build
});
module.exports = __toCommonJS(utoopack_exports);
var import_bundler_webpack = require("@umijs/bundler-webpack");
var import_utils = require("@umijs/utils");
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var import_utils2 = require("../utils");
function addPublicPath(publicPath, file) {
  if (/^(?:https?:)?\/\//.test(file) || file.startsWith("/")) {
    return file;
  }
  if (publicPath === "auto") {
    return `/${file}`;
  }
  return `${publicPath.replace(/\/?$/, "/")}${file}`;
}
function getServerBuildFile(stats) {
  var _a;
  const statsJson = (stats == null ? void 0 : stats.toJson) ? stats.toJson() : stats || {};
  const entrypoint = (_a = statsJson.entrypoints) == null ? void 0 : _a["umi.server"];
  const files = /* @__PURE__ */ new Set();
  for (const asset of (entrypoint == null ? void 0 : entrypoint.assets) || []) {
    files.add(typeof asset === "string" ? asset : asset.name);
  }
  for (const chunkId of (entrypoint == null ? void 0 : entrypoint.chunks) || []) {
    const chunk = (statsJson.chunks || []).find((item) => {
      var _a2, _b;
      return (item == null ? void 0 : item.id) === chunkId || ((_b = (_a2 = item == null ? void 0 : item.names) == null ? void 0 : _a2.includes) == null ? void 0 : _b.call(_a2, chunkId));
    });
    for (const file of (chunk == null ? void 0 : chunk.files) || []) {
      files.add(file);
    }
  }
  for (const asset of statsJson.assets || []) {
    const name = typeof asset === "string" ? asset : asset.name;
    if (/^umi\.server(?:\..*)?\.js$/.test((0, import_path.basename)(name))) {
      files.add(name);
    }
  }
  return Array.from(files).find((file) => /\.m?js$/.test(file));
}
var build = async (api, opts) => {
  import_utils.logger.wait("[SSR] Compiling by utoopack...");
  const now = (/* @__PURE__ */ new Date()).getTime();
  const absOutputFile = (0, import_utils2.absServerBuildPath)(api);
  require("@umijs/bundler-webpack/dist/requireHook");
  const { buildSSR } = require(process.env.UTOOPACK);
  const useHash = api.config.hash && api.env === import_bundler_webpack.Env.production;
  const publicPath = api.userConfig.publicPath || "/";
  const entry = import_path.default.resolve(api.paths.absTmpPath, "umi.server.ts");
  const stats = await buildSSR({
    ...opts,
    cwd: api.cwd,
    entry: {
      "umi.server": entry
    },
    config: api.config,
    serverBuildPath: absOutputFile,
    useHash,
    isDev: api.env === import_bundler_webpack.Env.development
  });
  const serverFile = getServerBuildFile(stats) || (0, import_path.basename)(absOutputFile);
  const jsonFilePath = (0, import_path.join)((0, import_path.dirname)(absOutputFile), "build-manifest.json");
  const assets = {
    "umi.server.js": addPublicPath(publicPath, serverFile),
    "umi.js": addPublicPath(publicPath, serverFile)
  };
  if (!(0, import_fs.existsSync)((0, import_path.dirname)(absOutputFile))) {
    require("fs").mkdirSync((0, import_path.dirname)(absOutputFile), { recursive: true });
  }
  (0, import_fs.writeFileSync)(jsonFilePath, JSON.stringify({ assets }, null, 2), {
    flag: "w"
  });
  const diff = (/* @__PURE__ */ new Date()).getTime() - now;
  import_utils.logger.info(`[SSR] Compiled in ${diff}ms`);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  build
});
