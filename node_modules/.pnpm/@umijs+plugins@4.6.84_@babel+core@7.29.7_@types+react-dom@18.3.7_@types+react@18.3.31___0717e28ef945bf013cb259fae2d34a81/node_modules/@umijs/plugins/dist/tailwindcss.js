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

// src/tailwindcss.ts
var tailwindcss_exports = {};
__export(tailwindcss_exports, {
  default: () => tailwindcss_default
});
module.exports = __toCommonJS(tailwindcss_exports);
var import_fs = require("fs");
var import_path = require("path");
var import_plugin_utils = require("umi/plugin-utils");
var CHECK_INTERVAL = 300;
var CHECK_TIMEOUT = process.env.CHECK_TIMEOUT ? parseInt(process.env.CHECK_TIMEOUT, 10) : 5;
var tailwindcss_default = (api) => {
  api.describe({
    key: "tailwindcss",
    config: {
      schema({ zod }) {
        return zod.record(zod.any());
      }
    },
    enableBy: api.EnableBy.config
  });
  let tailwind = null;
  const outputPath = "plugin-tailwindcss/tailwind.css";
  api.modifyConfig((memo) => {
    var _a, _b, _c;
    if (!memo.utoopack || !isTailwindV4({ cwd: api.cwd })) {
      return memo;
    }
    const ruleKey = "*.css";
    return {
      ...memo,
      utoopack: {
        ...memo.utoopack,
        module: {
          ...(_a = memo.utoopack) == null ? void 0 : _a.module,
          rules: {
            [ruleKey]: {
              condition: {
                path: /(^|[\\\/])tailwind\.css$/
              },
              loaders: [
                {
                  loader: getTailwindWebpackLoaderPath({ cwd: api.cwd }, api),
                  options: {
                    base: api.cwd
                  }
                }
              ],
              as: "*.css"
            },
            ...(_c = (_b = memo.utoopack) == null ? void 0 : _b.module) == null ? void 0 : _c.rules
          }
        }
      }
    };
  });
  api.chainWebpack((memo) => {
    if (!shouldUseTailwindWebpackLoader(api)) {
      return;
    }
    memo.module.rule("tailwindcss").enforce("pre").test(/(^|[\\\/])tailwind\.css$/).use("tailwindcss-loader").loader(getTailwindWebpackLoaderPath({ cwd: api.cwd }, api)).options({
      base: api.cwd
    });
  });
  api.onBeforeCompiler(() => {
    const inputPath = (0, import_path.join)(api.cwd, "tailwind.css");
    const generatedPath = (0, import_path.join)(api.paths.absTmpPath, outputPath);
    const configPath = (0, import_path.join)(api.cwd, "tailwind.config.js");
    if (isTailwindV4({ cwd: api.cwd })) {
      return;
    }
    const binPath = getTailwindBinPath({ cwd: api.cwd });
    if (process.env.IS_UMI_BUILD_WORKER) {
      return;
    }
    return new Promise((resolve) => {
      tailwind = (0, import_plugin_utils.crossSpawn)(
        `${binPath}`,
        [
          "-c",
          configPath,
          "-i",
          inputPath,
          "-o",
          generatedPath,
          api.env === "development" ? "--watch=always" : ""
        ],
        {
          stdio: "inherit",
          cwd: process.env.APP_ROOT || api.cwd
        }
      );
      tailwind.on("error", (m) => {
        api.logger.error("tailwindcss service encounter an error: " + m);
      });
      if (api.env === "production") {
        tailwind.on("exit", () => {
          api.logger.info("tailwindcss service exited");
          resolve();
        });
      } else {
        api.logger.info("tailwindcss service started");
        const interval = setInterval(() => {
          if ((0, import_fs.existsSync)(generatedPath)) {
            clearInterval(interval);
            resolve();
          }
        }, CHECK_INTERVAL);
        const timer = setTimeout(() => {
          if (!(0, import_fs.existsSync)(generatedPath)) {
            clearInterval(timer);
            api.logger.error(
              `tailwindcss generate failed after ${CHECK_TIMEOUT} seconds, please check your tailwind.css and tailwind.config.js`
            );
            process.exit(1);
          }
        }, CHECK_TIMEOUT * 1e3);
      }
    });
  });
  api.addEntryImports(() => {
    if (isTailwindV4({ cwd: api.cwd })) {
      return [{ source: (0, import_plugin_utils.winPath)((0, import_path.join)(api.cwd, "tailwind.css")) }];
    }
    const generatedPath = (0, import_plugin_utils.winPath)((0, import_path.join)(api.paths.absTmpPath, outputPath));
    return [{ source: generatedPath }];
  });
};
function isTailwindV4(opts) {
  const pkgPath = require.resolve("tailwindcss/package.json", {
    paths: [opts.cwd]
  });
  const tailwind = require(pkgPath);
  return tailwind.version.startsWith("4");
}
function shouldUseTailwindWebpackLoader(api) {
  if (!isTailwindV4({ cwd: api.cwd })) {
    return false;
  }
  return Boolean(!api.config.utoopack && !api.config.vite && !api.config.mako);
}
function getTailwindBinPath(opts) {
  const pkgPath = require.resolve("tailwindcss/package.json", {
    paths: [opts.cwd]
  });
  const tailwindPath = require(pkgPath).bin["tailwind"];
  return (0, import_path.join)((0, import_path.dirname)(pkgPath), tailwindPath);
}
function getTailwindWebpackLoaderPath(opts, api) {
  for (const cwd of [__dirname, opts.cwd]) {
    const loaderPath = tryResolveTailwindWebpackLoader(cwd);
    if (loaderPath)
      return loaderPath;
  }
  api.logger.error(
    "tailwindcss v4 with webpack or utoopack requires @tailwindcss/webpack"
  );
  process.exit(1);
}
function tryResolveTailwindWebpackLoader(cwd) {
  try {
    return require.resolve("@tailwindcss/webpack", {
      paths: [cwd]
    });
  } catch {
    return null;
  }
}
