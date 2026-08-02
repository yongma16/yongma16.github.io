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

// src/features/prepare/prepare.ts
var prepare_exports = {};
__export(prepare_exports, {
  default: () => prepare_default
});
module.exports = __toCommonJS(prepare_exports);
var import_utils = require("@umijs/utils");
var import_path = __toESM(require("path"));
var import_watch = require("../../commands/dev/watch");
var prepare_default = (api) => {
  function updateAppdata(prepareData) {
    const buildResult = {
      ...prepareData.buildResult,
      // we don't need output file in prepare stage
      outputFiles: void 0
    };
    api.appData.prepare = {
      buildResult
    };
  }
  api.register({
    key: "onGenerateFiles",
    async fn({ isFirstTime }) {
      var _a, _b;
      if (api.appData.framework === "vue") {
        return;
      }
      if (!isFirstTime)
        return;
      if (api.appData.bundler !== "utoopack") {
        import_utils.logger.info("Preparing...");
      }
      const umiEntry = import_path.default.join(api.paths.absTmpPath, "umi.ts");
      const entryPoints = [umiEntry];
      const { build } = await import("./build.js");
      const watch = api.name === "dev";
      const plugins = await api.applyPlugins({
        key: "addPrepareBuildPlugins",
        initialValue: []
      });
      const unwrappedAlias = import_utils.aliasUtils.parseCircleAlias({
        alias: api.config.alias
      });
      if (api.userConfig.mpa) {
        (_b = (_a = api.appData.mpa) == null ? void 0 : _a.entry) == null ? void 0 : _b.forEach(({ tmpFilePath }) => {
          entryPoints.push(import_path.default.join(api.paths.absTmpPath, tmpFilePath));
        });
      }
      const [buildResult, ctx] = await build({
        entryPoints,
        watch: watch && {
          async onRebuildSuccess({ result }) {
            updateAppdata({ buildResult: result });
            await api.applyPlugins({
              key: "onPrepareBuildSuccess",
              args: {
                isWatch: true,
                result
              }
            });
          }
        },
        config: {
          alias: unwrappedAlias,
          cwd: api.paths.cwd
        },
        plugins
      });
      if (watch) {
        (0, import_watch.addUnWatch)(() => {
          ctx == null ? void 0 : ctx.dispose();
        });
      }
      updateAppdata({ buildResult });
      await api.applyPlugins({
        key: "onPrepareBuildSuccess",
        args: {
          result: buildResult
        }
      });
    },
    stage: Infinity
  });
};
