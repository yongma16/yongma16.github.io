import fs from "fs";
import path from "path";
export function getOutputPath(config, projectPath) {
    var _a;
    return path.resolve(projectPath, ((_a = config.output) === null || _a === void 0 ? void 0 : _a.path) || "dist");
}
export async function cleanOutput(config, projectPath) {
    var _a;
    if (!((_a = config.output) === null || _a === void 0 ? void 0 : _a.clean)) {
        return;
    }
    const outputPath = getOutputPath(config, projectPath);
    let entries;
    try {
        entries = await fs.promises.readdir(outputPath, { withFileTypes: true });
    }
    catch (error) {
        if (isNodeError(error) && error.code === "ENOENT") {
            return;
        }
        throw error;
    }
    await Promise.all(entries.map((entry) => fs.promises.rm(path.join(outputPath, entry.name), {
        force: true,
        maxRetries: 3,
        recursive: true,
        retryDelay: 50,
    })));
}
function isNodeError(error) {
    return error instanceof Error && "code" in error;
}
