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

// src/features/reactCompiler/forget.ts
var forget_exports = {};
__export(forget_exports, {
  default: () => forget_default
});
module.exports = __toCommonJS(forget_exports);
var forget_default = (api) => {
  api.describe({
    key: "forget",
    config: {
      schema({ zod }) {
        return zod.union([
          zod.boolean(),
          zod.object({
            ReactCompilerConfig: zod.record(zod.any()).optional()
          }).partial()
        ]);
      }
    },
    enableBy: api.EnableBy.config
  });
  api.onStart(() => {
    api.logger.warn(
      "`forget` is deprecated. Please use `reactCompiler` instead."
    );
  });
};
