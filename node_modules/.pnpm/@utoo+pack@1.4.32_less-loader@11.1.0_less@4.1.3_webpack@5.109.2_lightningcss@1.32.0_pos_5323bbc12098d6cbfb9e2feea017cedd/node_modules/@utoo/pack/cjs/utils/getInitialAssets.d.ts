import type { NapiWrittenEndpoint } from "../binding";
export interface Assets {
    js: string[];
    css: string[];
}
export declare function getInitialAssetsFromStats(outputDir: string): Assets;
export declare function getInitialAssetsFromEndpointPaths(endpoints: NapiWrittenEndpoint[]): Assets;
