"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printServerInfo = printServerInfo;
const os_1 = __importDefault(require("os"));
const picocolors_1 = __importDefault(require("picocolors"));
const BOX_INNER_WIDTH = 50;
function printServerInfo(protocol, hostname, port) {
    const localUrl = `${protocol}://localhost:${port}`;
    const networkAddress = getNetworkAddress();
    const networkUrl = networkAddress
        ? `${protocol}://${networkAddress}:${port}`
        : null;
    console.log();
    console.log(picocolors_1.default.green("  ┌──────────────────────────────────────────────────┐"));
    printPlainBoxLine();
    printStyledBoxLine("   Serving!", `   ${picocolors_1.default.bold("Serving!")}`);
    printPlainBoxLine();
    printStyledBoxLine(`   - Local:    ${localUrl}`, `   - Local:    ${picocolors_1.default.cyan(localUrl)}`);
    if (networkUrl) {
        printStyledBoxLine(`   - Network:  ${networkUrl}`, `   - Network:  ${picocolors_1.default.cyan(networkUrl)}`);
    }
    printPlainBoxLine();
    printPlainBoxLine("   Copied local address to clipboard!");
    printPlainBoxLine();
    console.log(picocolors_1.default.green("  └──────────────────────────────────────────────────┘"));
    console.log();
}
function printPlainBoxLine(content = "") {
    console.log(picocolors_1.default.green(`  │${content.padEnd(BOX_INNER_WIDTH, " ")}│`));
}
function printStyledBoxLine(plainContent, styledContent) {
    console.log(picocolors_1.default.green("  │") +
        styledContent +
        picocolors_1.default.green(`${" ".repeat(Math.max(0, BOX_INNER_WIDTH - plainContent.length))}│`));
}
function getNetworkAddress() {
    const interfaces = os_1.default.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return undefined;
}
