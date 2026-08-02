import { IApi } from '../../types';
export interface IOnDemandInstallDep {
    name: string;
    version: string;
    reason?: string;
    /**
     * install dev dep by default
     * @default true
     */
    dev?: boolean;
}
export default _default;
declare function _default(api: IApi): void;
export declare function addDeps(opts: {
    pkgPath: string;
    deps: IOnDemandInstallDep[];
}): void;
