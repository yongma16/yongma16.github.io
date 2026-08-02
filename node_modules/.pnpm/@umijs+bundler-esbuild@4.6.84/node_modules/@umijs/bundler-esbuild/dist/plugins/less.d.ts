import { Plugin } from '@umijs/bundler-utils/compiled/esbuild';
import { IConfig } from '../types';
export declare const aliasLessImportPath: (filePath: string, alias: Record<string, string>, importer: string) => Promise<string | null>;
export default _default;
declare function _default(options?: Less.Options & {
    alias?: Record<string, string>;
    inlineStyle?: boolean;
    config?: IConfig;
}): Plugin;
