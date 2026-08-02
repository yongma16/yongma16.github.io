import esbuild from '@umijs/bundler-utils/compiled/esbuild';
export declare function ensureLastSlash(path: string): string;
export declare function hashString(str: string): string;
export declare function getClassNames(code: Uint8Array, filename: string): string[];
export declare function cssLoader(opts: {
    cwd: string;
}): esbuild.Plugin;
