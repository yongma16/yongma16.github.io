import type { ZodTypeAny } from '@umijs/utils/compiled/zod';
export type LiteralType = string | number | boolean;
export type ZodToTsOptions = {};
export interface IZodToTsOpts {
    zod: ZodTypeAny;
    identifier?: string;
    options?: ZodToTsOptions;
}
