const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/main.js",
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },

  plugins: [
    new webpack.ProvidePlugin({
      p5: "p5",
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 1234,
  },

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|ogg)$/,
        type: "asset/resource",
      },
    ],
  },

  resolve: {
    extensions: [".js"],
  },
};