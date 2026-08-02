import prompts from '../../compiled/prompts';
declare const generateFile: ({ path, target, baseDir, data, questions, }: {
    path: string;
    target: string;
    baseDir?: string;
    data?: any;
    questions?: prompts.PromptObject[];
}) => Promise<void>;
export default generateFile;
