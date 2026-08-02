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

// src/util.ts
var util_exports = {};
__export(util_exports, {
  getBuildBanner: () => getBuildBanner,
  getCssOutputFilenames: () => getCssOutputFilenames,
  getDevBanner: () => getDevBanner,
  getPackVersion: () => getPackVersion,
  getSSRCssSplitChunks: () => getSSRCssSplitChunks
});
module.exports = __toCommonJS(util_exports);
var import_utils = require("@umijs/utils");
function cleanVersionRange(version) {
  return version == null ? void 0 : version.replace(/^[^\d]*/, "");
}
function getPackVersion(packVersion) {
  var _a;
  if (packVersion) {
    return packVersion;
  }
  try {
    const pkgPath = require.resolve("@utoo/pack/package.json", {
      paths: [__dirname]
    });
    const pkg = require(pkgPath);
    if (pkg.version) {
      return pkg.version;
    }
  } catch {
  }
  try {
    const pkg = require("../package.json");
    return cleanVersionRange((_a = pkg.dependencies) == null ? void 0 : _a["@utoo/pack"]);
  } catch {
    return void 0;
  }
}
function formatDuration(duration) {
  if (typeof duration !== "number") {
    return void 0;
  }
  return `${Math.max(0, Math.round(duration))}ms`;
}
function normalizeUtoopackFilenameTemplate(filename) {
  return filename.replace(
    /\[(?:hash|chunkhash)(?::(\d+))?\]/g,
    (_, length) => `[contenthash${length ? `:${length}` : ""}]`
  );
}
function getMiniCssExtractPluginOptions(webpackConfig) {
  var _a;
  const plugin = (_a = webpackConfig.plugins) == null ? void 0 : _a.find((p) => {
    var _a2;
    return p && typeof p === "object" && ((_a2 = p.constructor) == null ? void 0 : _a2.name) === "MiniCssExtractPlugin";
  });
  return plugin == null ? void 0 : plugin.options;
}
function getEntryCssFilename(entry, filenameTemplate, replaceName) {
  const normalizedFilenameTemplate = normalizeUtoopackFilenameTemplate(filenameTemplate);
  if (!replaceName) {
    return normalizedFilenameTemplate;
  }
  const entryNames = Object.keys(entry || {});
  if (entryNames.length !== 1) {
    return void 0;
  }
  return normalizedFilenameTemplate.replace(/\[name\]/g, entryNames[0]);
}
function getCssOutputFilenames(opts) {
  const miniCssExtractOptions = getMiniCssExtractPluginOptions(
    opts.webpackConfig
  );
  const hash = opts.useHash ? ".[contenthash:8]" : "";
  const cssFilenameTemplate = typeof (miniCssExtractOptions == null ? void 0 : miniCssExtractOptions.filename) === "string" ? miniCssExtractOptions.filename : `[name]${hash}.css`;
  let cssChunkFilenameTemplate = typeof (miniCssExtractOptions == null ? void 0 : miniCssExtractOptions.chunkFilename) === "string" ? miniCssExtractOptions.chunkFilename : void 0;
  if (!cssChunkFilenameTemplate) {
    cssChunkFilenameTemplate = opts.config.ssr ? `umi${hash}.css` : `[name]${hash}.chunk.css`;
  }
  const cssFilename = getEntryCssFilename(
    opts.entry,
    cssFilenameTemplate,
    !!opts.config.ssr
  );
  return {
    ...cssFilename ? { cssFilename } : {},
    cssChunkFilename: normalizeUtoopackFilenameTemplate(
      cssChunkFilenameTemplate
    )
  };
}
function getSSRCssSplitChunks(config) {
  if (!config.ssr) {
    return {};
  }
  return {
    splitChunks: {
      css: {
        minChunkSize: 1e8,
        maxChunkCountPerGroup: 1,
        maxMergeChunkSize: 1e8
      }
    }
  };
}
function getDevBanner({
  protocol,
  host,
  port,
  ip,
  packVersion,
  duration
}) {
  const hostStr = !host || host === "0.0.0.0" ? "localhost" : host;
  const resolvedPackVersion = getPackVersion(packVersion);
  const readyTime = formatDuration(duration);
  const header = [
    import_utils.chalk.cyan.bold("utoo pack"),
    resolvedPackVersion ? import_utils.chalk.blueBright(`v${resolvedPackVersion}`) : null,
    import_utils.chalk.green("ready"),
    readyTime ? import_utils.chalk.dim(`in ${readyTime}`) : null
  ].filter(Boolean).join(" ");
  const messages = [
    "",
    `  ${header}`,
    "",
    `  ${import_utils.chalk.green("➜")}  Local:   ${import_utils.chalk.cyan(
      `${protocol}//${hostStr}:${port}`
    )}`
  ];
  if (ip && ip !== "0.0.0.0" && ip !== hostStr) {
    messages.push(
      `  ${import_utils.chalk.green("➜")}  Network: ${import_utils.chalk.cyan(
        `${protocol}//${ip}:${port}`
      )}`
    );
  }
  return messages.join("\n");
}
function getBuildBanner({
  packVersion,
  duration,
  outputPath,
  assetCount
}) {
  const resolvedPackVersion = getPackVersion(packVersion);
  const builtTime = formatDuration(duration);
  const messages = [
    "",
    `  ${[
      import_utils.chalk.cyan.bold("utoo pack"),
      resolvedPackVersion ? import_utils.chalk.blueBright(`v${resolvedPackVersion}`) : null,
      import_utils.chalk.green("built"),
      builtTime ? import_utils.chalk.dim(`in ${builtTime}`) : null
    ].filter(Boolean).join(" ")}`
  ];
  if (outputPath || typeof assetCount === "number") {
    messages.push("");
  }
  if (outputPath) {
    messages.push(`  ${import_utils.chalk.green("➜")}  Output:  ${import_utils.chalk.cyan(outputPath)}`);
  }
  if (typeof assetCount === "number") {
    messages.push(
      `  ${import_utils.chalk.green("➜")}  Assets:  ${import_utils.chalk.cyan(
        `${assetCount} file${assetCount === 1 ? "" : "s"}`
      )}`
    );
  }
  return messages.join("\n");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBuildBanner,
  getCssOutputFilenames,
  getDevBanner,
  getPackVersion,
  getSSRCssSplitChunks
});
