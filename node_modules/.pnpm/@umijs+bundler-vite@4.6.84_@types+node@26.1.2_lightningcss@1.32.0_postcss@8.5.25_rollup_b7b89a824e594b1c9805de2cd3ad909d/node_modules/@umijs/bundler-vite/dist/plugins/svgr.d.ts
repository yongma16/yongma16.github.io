import { TransformOptions } from '@umijs/bundler-utils/compiled/esbuild';
import type { Plugin } from '../../compiled/vite';
type SVGROption = {
    [key: string]: any;
};
type SVGOOption = {
    [key: string]: any;
} | false;
/**
 * an universal tool to transform SVG into React components
 * @param svgr svgr options
 * @param svgo svgo options
 * @param transformOptions include transform options to translate svg ReactComponent
 */
export default function svgrPlugin(svgr?: SVGROption, svgo?: SVGOOption, transformOptions?: TransformOptions): Plugin;
export {};
