import { DOMParser } from "domparser-rs";
import fs from "fs";
import path from "path";
function normalizeHtmlPublicPath(globalPublicPath) {
    return globalPublicPath === "runtime" || globalPublicPath === "auto"
        ? ""
        : (globalPublicPath !== null && globalPublicPath !== void 0 ? globalPublicPath : "");
}
export class HtmlPlugin {
    constructor(config) {
        this.config = config;
    }
    async generate(outputDir, assets, globalPublicPath) {
        var _a, _b;
        const templatePath = this.config.template
            ? path.resolve(process.cwd(), this.config.template)
            : undefined;
        const publicPath = normalizeHtmlPublicPath(globalPublicPath);
        let htmlContent = "";
        if (this.config.templateContent) {
            htmlContent = this.config.templateContent;
        }
        else if (templatePath && fs.existsSync(templatePath)) {
            htmlContent = fs.readFileSync(templatePath, "utf-8");
        }
        else {
            htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${this.config.title || "Utoo App"}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        if (this.config.title) {
            const title = doc.querySelector("title");
            if (title) {
                title.textContent = this.config.title;
            }
            else {
                const head = doc.querySelector("head");
                if (head) {
                    const titleNode = doc.createElement("title");
                    titleNode.textContent = this.config.title;
                    head.appendChild(titleNode);
                }
            }
        }
        // Inject meta
        if (this.config.meta) {
            const head = doc.querySelector("head");
            if (head) {
                Object.entries(this.config.meta).forEach(([name, value]) => {
                    const meta = doc.createElement("meta");
                    if (typeof value === "string") {
                        meta.setAttribute("name", name);
                        meta.setAttribute("content", value);
                    }
                    else {
                        Object.entries(value).forEach(([k, v]) => {
                            meta.setAttribute(k, v);
                        });
                    }
                    head.appendChild(meta);
                });
            }
        }
        const head = doc.querySelector("head");
        const body = doc.querySelector("body");
        // Inject CSS
        assets.css.forEach((cssFile) => {
            const link = doc.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", publicPath
                ? publicPath.endsWith("/")
                    ? publicPath + cssFile
                    : publicPath + "/" + cssFile
                : cssFile);
            if (head)
                head.appendChild(link);
        });
        // Inject JS
        assets.js.forEach((jsFile) => {
            const script = doc.createElement("script");
            script.setAttribute("src", publicPath
                ? publicPath.endsWith("/")
                    ? publicPath + jsFile
                    : publicPath + "/" + jsFile
                : jsFile);
            if (this.config.scriptLoading === "defer") {
                script.setAttribute("defer", "");
            }
            else if (this.config.scriptLoading === "module") {
                script.setAttribute("type", "module");
            }
            if (this.config.inject === "head" && head) {
                head.appendChild(script);
            }
            else if (body) {
                body.appendChild(script);
            }
            else if (head) {
                head.appendChild(script); // Fallback
            }
        });
        const finalHtml = doc.outerHTML;
        const filename = this.config.filename || "index.html";
        const finalOutputDir = (_b = (_a = this.config.output) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : outputDir;
        fs.mkdirSync(finalOutputDir, { recursive: true });
        fs.writeFileSync(path.join(finalOutputDir, filename), finalHtml);
    }
}
