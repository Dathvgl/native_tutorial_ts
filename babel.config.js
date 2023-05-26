module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["nativewind/babel"],
      ["react-native-reanimated/plugin"],
      [
        "module-resolver",
        {
          alias: {
            "~globals": "./src/globals.d.ts",
            "~types": "./src/types.d.ts",
            "~hooks": "./src/hooks",
            "~models": "./src/models",
            "~components": "./src/components",
            "~screens": "./src/screens",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
    ],
  };
};
