interface IOpts {
    presetEnv: any;
    presetReact: any;
    presetTypeScript: any;
    pluginTransformRuntime: any;
    pluginLockCoreJS: any;
    pluginDynamicImportNode: any;
    pluginAutoCSSModules: any;
    stripExports: {
        exports: string[];
    };
    classPropertiesLoose: any;
    pluginDecorators: any;
}
export default _default;
declare function _default(_context: any, opts: IOpts): {
    presets: (false | any[])[];
    plugins: any[];
};
