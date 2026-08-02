import { IApi } from '../../types';
import { type IArgsComponent } from './utils';
export default _default;
declare function _default(api: IApi): void;
export declare class ComponentGenerator {
    readonly opts: {
        componentName: string;
        srcPath: string;
        appRoot: string;
        args: IArgsComponent;
    };
    private readonly name;
    private readonly dir;
    constructor(opts: {
        componentName: string;
        srcPath: string;
        appRoot: string;
        args: IArgsComponent;
    });
    run(): Promise<void>;
}
