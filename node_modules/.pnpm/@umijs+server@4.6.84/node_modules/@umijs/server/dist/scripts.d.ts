export type IScript = string | {
    src?: string;
    content?: string;
};
export declare function normalizeScripts(scripts: IScript[]): {
    src?: string;
    content?: string;
}[];
export declare function normalizeScript(script: IScript): {
    src?: string;
    content?: string;
};
