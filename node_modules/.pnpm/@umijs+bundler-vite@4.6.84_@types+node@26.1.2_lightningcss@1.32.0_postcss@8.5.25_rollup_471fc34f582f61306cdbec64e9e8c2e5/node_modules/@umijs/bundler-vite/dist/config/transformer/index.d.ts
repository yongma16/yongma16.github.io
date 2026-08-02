import type { InlineConfig as ViteInlineConfig } from '../../../compiled/vite';
type ITmpUserConfig = Record<string, any>;
/**
 * type of config processor
 */
export type IConfigProcessor = (userConfig: ITmpUserConfig, currentViteConfig: Partial<ViteInlineConfig>) => Partial<ViteInlineConfig>;
export default _default;
/**
 * config transformer
 */
declare function _default(userConfig: ITmpUserConfig): ViteInlineConfig;
