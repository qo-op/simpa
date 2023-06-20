const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/main/ts/simpa.ts",
  output: {
    path: path.resolve(__dirname, "."),
    filename: "simpa.js",
    library: "Simpa",
    libraryTarget: "umd",
    globalObject: "this",
    devtoolModuleFilenameTemplate: (info) =>
      path
        .relative("./src/main/ts", info.absoluteResourcePath)
        .replace(/\\/g, "/"),
    devtoolFallbackModuleFilenameTemplate: (info) =>
      path
        .relative("./src/main/ts", info.absoluteResourcePath)
        .replace(/\\/g, "/") +
      "?" +
      info.hash,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "source-map",
};
