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

// src/features/ssr/utils.ts
var utils_exports = {};
__export(utils_exports, {
  absServerBuildPath: () => absServerBuildPath,
  esbuildUmiPlugin: () => esbuildUmiPlugin,
  generateBuildManifest: () => generateBuildManifest,
  generateBuildManifestFromStats: () => generateBuildManifestFromStats
});
module.exports = __toCommonJS(utils_exports);
var import_utils = require("@umijs/utils");
var import_lodash = require("@umijs/utils/compiled/lodash");
var import_fs = require("fs");
var import_path = require("path");
function esbuildUmiPlugin(api) {
  return {
    name: "umi",
    setup(build) {
      build.onResolve(
        { filter: /^(umi|@umijs\/max|@alipay\/bigfish)$/ },
        () => ({
          path: (0, import_path.join)(api.paths.absTmpPath, "exports.ts")
        })
      );
    }
  };
}
function absServerBuildPath(api) {
  if (api.env === "development") {
    return (0, import_path.join)(api.paths.absTmpPath, "server/umi.server.js");
  }
  const manifestPath = (0, import_path.join)(api.paths.cwd, "server", "build-manifest.json");
  if (api.userConfig.ssr.serverBuildPath || !(0, import_fs.existsSync)(manifestPath)) {
    return (0, import_path.join)(
      api.paths.cwd,
      api.userConfig.ssr.serverBuildPath || "server/umi.server.js"
    );
  }
  delete require.cache[manifestPath];
  const manifest = require(manifestPath);
  return (0, import_path.join)(api.paths.cwd, "server", (0, import_path.basename)(manifest.assets["umi.js"]));
}
var generateBuildManifest = (api) => {
  var _a;
  const publicPath = api.userConfig.publicPath || "/";
  const manifestFileName = ((_a = api.config.manifest) == null ? void 0 : _a.fileName) || "asset-manifest.json";
  const finalJsonObj = {};
  const assetFilePath = (0, import_path.join)(api.paths.absOutputPath, manifestFileName);
  const buildFilePath = (0, import_path.join)(api.paths.absOutputPath, "build-manifest.json");
  const json = (0, import_fs.existsSync)(assetFilePath) ? import_utils.fsExtra.readJSONSync(assetFilePath) : {};
  (0, import_lodash.forEach)(json, (path, key) => {
    json[key] = `${publicPath}${path}`;
  });
  finalJsonObj.assets = json;
  (0, import_fs.writeFileSync)(buildFilePath, JSON.stringify(finalJsonObj, null, 2), {
    flag: "w"
  });
};
function addPublicPath(publicPath, file) {
  if (/^(?:https?:)?\/\//.test(file) || file.startsWith("/")) {
    return file;
  }
  if (publicPath === "auto") {
    return `/${file}`;
  }
  return `${publicPath.replace(/\/?$/, "/")}${file}`;
}
var assetExts = /* @__PURE__ */ new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".mp3",
  ".mp4"
]);
function getOriginalAssetName(file) {
  const ext = (0, import_path.extname)(file);
  return `${(0, import_path.basename)(file, ext).replace(/\.[a-f0-9]{8,}$/i, "")}${ext}`;
}
function walkSourceAssets(dir, cwd, ret = []) {
  if (!(0, import_fs.existsSync)(dir))
    return ret;
  for (const entry of (0, import_fs.readdirSync)(dir, { withFileTypes: true })) {
    const absPath = (0, import_path.join)(dir, entry.name);
    if (entry.isDirectory()) {
      if ([
        "node_modules",
        "dist",
        "server",
        ".umi",
        ".umi-production",
        ".turbopack"
      ].includes(entry.name)) {
        continue;
      }
      walkSourceAssets(absPath, cwd, ret);
    } else if (assetExts.has((0, import_path.extname)(entry.name))) {
      ret.push(absPath);
    }
  }
  return ret;
}
function isCssFile(file) {
  return /\.css(?:[?#].*)?$/.test(file) && !/\.css\.map(?:[?#].*)?$/.test(file);
}
function isUmiCssFile(file) {
  return /^umi(?:\.[a-f0-9]+)?\.css$/i.test((0, import_path.basename)(file.split(/[?#]/)[0]));
}
function isUtoopackSingleCss(file) {
  return /\.single\.css(?:[?#].*)?$/.test(file);
}
function findClientCssFiles(files) {
  const cssFiles = files.filter(isCssFile);
  return Array.from(
    /* @__PURE__ */ new Set([
      ...cssFiles.filter(isUmiCssFile),
      ...cssFiles.filter((file) => !isUmiCssFile(file))
    ])
  ).filter((file) => !isUtoopackSingleCss(file));
}
function getSourceAssetMap(api, statsAssets, publicPath) {
  const outputAssets = statsAssets.filter((file) => assetExts.has((0, import_path.extname)(file))).map((file) => {
    const absPath = (0, import_path.join)(api.paths.absOutputPath, file);
    if (!(0, import_fs.existsSync)(absPath))
      return null;
    return {
      file,
      name: getOriginalAssetName(file),
      size: (0, import_fs.statSync)(absPath).size
    };
  }).filter(Boolean);
  return walkSourceAssets(api.cwd, api.cwd).reduce((memo, absPath) => {
    const stat = (0, import_fs.statSync)(absPath);
    const matched = outputAssets.find((asset) => {
      return asset.name === (0, import_path.basename)(absPath) && asset.size === stat.size;
    });
    if (matched) {
      memo[(0, import_utils.winPath)((0, import_path.relative)(api.cwd, absPath))] = addPublicPath(
        publicPath,
        matched.file
      );
    }
    return memo;
  }, {});
}
var generateBuildManifestFromStats = (api, stats) => {
  var _a;
  const publicPath = api.userConfig.publicPath || "/";
  const buildFilePath = (0, import_path.join)(api.paths.absOutputPath, "build-manifest.json");
  const statsJson = (stats == null ? void 0 : stats.toJson) ? stats.toJson() : stats || {};
  const entrypoint = (_a = statsJson.entrypoints) == null ? void 0 : _a.umi;
  const entryFiles = /* @__PURE__ */ new Set();
  for (const asset of (entrypoint == null ? void 0 : entrypoint.assets) || []) {
    entryFiles.add(typeof asset === "string" ? asset : asset.name);
  }
  for (const chunkId of (entrypoint == null ? void 0 : entrypoint.chunks) || []) {
    const chunk = (statsJson.chunks || []).find((item) => {
      var _a2, _b;
      return (item == null ? void 0 : item.id) === chunkId || ((_b = (_a2 = item == null ? void 0 : item.names) == null ? void 0 : _a2.includes) == null ? void 0 : _b.call(_a2, chunkId));
    });
    for (const file of (chunk == null ? void 0 : chunk.files) || []) {
      entryFiles.add(file);
    }
  }
  const statsAssets = (statsJson.assets || []).map((asset) => typeof asset === "string" ? asset : asset.name).filter(Boolean);
  const files = Array.from(/* @__PURE__ */ new Set([...entryFiles, ...statsAssets])).filter(
    Boolean
  );
  const jsFiles = files.filter((file) => /\.m?js$/.test(file));
  const umiJs = jsFiles.find((file) => /^umi(?:\.[a-f0-9]+)?\.js$/i.test((0, import_path.basename)(file))) || jsFiles[0];
  const finalJsonObj = {
    assets: {
      ...files.reduce((memo, file) => {
        memo[file] = addPublicPath(publicPath, file);
        return memo;
      }, {}),
      ...getSourceAssetMap(api, statsAssets, publicPath)
    }
  };
  if (umiJs) {
    finalJsonObj.assets["umi.js"] = addPublicPath(publicPath, umiJs);
  }
  const umiCssFiles = findClientCssFiles([...entryFiles, ...statsAssets]);
  if (umiCssFiles.length) {
    finalJsonObj.assets["umi.css"] = umiCssFiles.map(
      (file) => addPublicPath(publicPath, file)
    );
  }
  (0, import_fs.writeFileSync)(buildFilePath, JSON.stringify(finalJsonObj, null, 2), {
    flag: "w"
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  absServerBuildPath,
  esbuildUmiPlugin,
  generateBuildManifest,
  generateBuildManifestFromStats
});
