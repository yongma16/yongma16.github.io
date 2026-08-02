import type { ConfigComplete } from "../config/types";
export declare function getOutputPath(config: ConfigComplete, projectPath: string): string;
export declare function cleanOutput(config: ConfigComplete, projectPath: string): Promise<void>;
