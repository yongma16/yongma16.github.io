import * as t from '@umijs/bundler-utils/compiled/babel/types';
interface IResolver<U> {
    is(src: any): boolean;
    get(src: U): any;
}
export declare const LITERAL_NODE_RESOLVERS: (IResolver<t.ArrayExpression> | IResolver<t.BooleanLiteral> | IResolver<t.Identifier> | IResolver<t.NullLiteral> | IResolver<t.NumericLiteral> | IResolver<t.ObjectExpression> | IResolver<t.StringLiteral>)[];
export declare const NODE_RESOLVERS: (IResolver<t.ArrayExpression> | IResolver<t.ArrowFunctionExpression> | IResolver<t.BooleanLiteral> | IResolver<t.FunctionExpression> | IResolver<t.Identifier> | IResolver<t.NullLiteral> | IResolver<t.NumericLiteral> | IResolver<t.ObjectExpression> | IResolver<t.StringLiteral> | IResolver<t.Class>)[];
export declare function findObjectLiteralProperties(node: t.ObjectExpression): {};
export declare function findObjectMembers(node: t.ObjectExpression): {};
export declare function findClassStaticProperty(node: t.Class): {} | undefined;
export declare function findArrayLiteralElements(node: t.ArrayExpression): any[];
export declare function findArrayElements(node: t.ArrayExpression): any[];
export {};
