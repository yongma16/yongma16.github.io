export interface IServerLoaderRequest {
    url: string;
    options: RequestInit;
}
export declare function fetchServerLoader({ id, basename, cb, pluginManager, }: {
    id: string;
    basename?: string;
    cb: (data: any) => void;
    pluginManager?: any;
}): void;
