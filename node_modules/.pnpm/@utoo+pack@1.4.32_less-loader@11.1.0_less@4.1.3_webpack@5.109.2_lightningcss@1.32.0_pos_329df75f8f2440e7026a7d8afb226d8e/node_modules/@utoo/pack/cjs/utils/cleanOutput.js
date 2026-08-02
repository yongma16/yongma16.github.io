"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutputPath = getOutputPath;
exports.cleanOutput = cleanOutput;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getOutputPath(config, projectPath) {
    var _a;
    return path_1.default.resolve(projectPath, ((_a = config.output) === null || _a === void 0 ? void 0 : _a.path) || "dist");
}
async function cleanOutput(config, projectPath) {
    var _a;
    if (!((_a = config.output) === null || _a === void 0 ? void 0 : _a.clean)) {
        return;
    }
    const outputPath = getOutputPath(config, projectPath);
    let entries;
    try {
        entries = await fs_1.default.promises.readdir(outputPath, { withFileTypes: true });
    }
    catch (error) {
        if (isNodeError(error) && error.code === "ENOENT") {
            return;
        }
        throw error;
    }
    await Promise.all(entries.map((entry) => fs_1.default.promises.rm(path_1.default.join(outputPath, entry.name), {
        force: true,
        maxRetries: 3,
        recursive: true,
        retryDelay: 50,
    })));
}
function isNodeError(error) {
    return error instanceof Error && "code" in error;
}
