export type IStyle = string | {
    src?: string;
    content?: string;
};
export declare function normalizeStyles(scripts: IStyle[]): {
    src?: string;
    content?: string;
}[];
export declare function normalizeStyle(style: IStyle): {
    src?: string;
    content?: string;
};
