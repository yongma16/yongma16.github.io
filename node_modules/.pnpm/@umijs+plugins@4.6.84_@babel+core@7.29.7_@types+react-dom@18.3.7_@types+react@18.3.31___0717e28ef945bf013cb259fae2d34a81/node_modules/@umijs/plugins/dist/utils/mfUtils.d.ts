type SimpleRemote = {
    entry: string;
    name: string;
    aliasName?: string;
    runtimeEntryPath?: object;
};
type RemoteEntries = {
    name: string;
    entries: object;
    keyResolver: string;
    aliasName?: string;
    runtimeEntryPath?: object;
};
type Remote = SimpleRemote | RemoteEntries;
export declare function toRemotesCodeString(remotes: Remote[]): string;
export {};
