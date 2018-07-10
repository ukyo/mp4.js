module.exports = {
  entry: {
    mp4: "./src/browser.ts",
    test: "./test/test.ts"
  },
  output: {
    filename: "[name].min.js",
    path: __dirname + "/dist"
  },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }]
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
};
