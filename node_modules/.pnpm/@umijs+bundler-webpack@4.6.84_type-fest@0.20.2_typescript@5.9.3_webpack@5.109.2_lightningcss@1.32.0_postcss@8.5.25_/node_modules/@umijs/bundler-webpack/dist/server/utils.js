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

// src/server/utils.ts
var utils_exports = {};
__export(utils_exports, {
  resolvePathWithinRoot: () => resolvePathWithinRoot
});
module.exports = __toCommonJS(utils_exports);
var import_path = require("path");
function resolvePathWithinRoot(root, file) {
  const resolvedRoot = (0, import_path.resolve)(root);
  const filePath = (0, import_path.resolve)(resolvedRoot, `.${file}`);
  const relativePath = (0, import_path.relative)(resolvedRoot, filePath);
  if (relativePath === ".." || relativePath.startsWith(`..${import_path.sep}`) || (0, import_path.isAbsolute)(relativePath)) {
    return null;
  }
  return filePath;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resolvePathWithinRoot
});
