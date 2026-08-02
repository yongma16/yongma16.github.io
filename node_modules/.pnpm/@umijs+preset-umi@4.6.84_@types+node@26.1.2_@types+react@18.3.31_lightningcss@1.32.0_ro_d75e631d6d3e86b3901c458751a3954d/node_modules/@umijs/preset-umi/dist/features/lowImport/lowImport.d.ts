import { IApi } from '../../types';
export interface IOpts {
    withObjs: Record<string, any>;
    identifierToLib: Record<string, string>;
    defaultToLib: Record<string, string>;
    namespaceToLib: Record<string, string>;
}
export default _default;
declare function _default(api: IApi): void;
