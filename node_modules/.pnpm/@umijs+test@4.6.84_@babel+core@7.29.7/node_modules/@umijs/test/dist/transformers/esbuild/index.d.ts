import { Transformer } from '@jest/transform';
import { UserOptions } from './type';
declare const createTransformer: (userOptions?: UserOptions) => Transformer<UserOptions>;
declare const _default: {
    createTransformer: typeof createTransformer;
};
export default _default;
