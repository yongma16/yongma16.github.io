import type { WebpackConfig } from '@utoo/pack';
type IDevBannerOpts = {
    duration?: number;
    host?: string;
    ip?: string;
    packVersion?: string;
    port?: number;
    protocol: string;
};
type IBuildBannerOpts = {
    assetCount?: number;
    duration?: number;
    outputPath?: string;
    packVersion?: string;
};
export declare function getPackVersion(packVersion?: string): any;
export declare function getCssOutputFilenames(opts: {
    entry: Record<string, string>;
    config: Record<string, any>;
    webpackConfig: WebpackConfig;
    useHash: boolean;
}): {
    cssFilename?: string | undefined;
    cssChunkFilename: string;
};
export declare function getSSRCssSplitChunks(config: Record<string, any>): {
    splitChunks?: undefined;
} | {
    splitChunks: {
        css: {
            minChunkSize: number;
            maxChunkCountPerGroup: number;
            maxMergeChunkSize: number;
        };
    };
};
export declare function getDevBanner({ protocol, host, port, ip, packVersion, duration, }: IDevBannerOpts): string;
export declare function getBuildBanner({ packVersion, duration, outputPath, assetCount, }: IBuildBannerOpts): string;
export {};
