var path = require("path");
const webpack = require("webpack");

// eslint-disable-next-line no-unused-vars
const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {  
  devtool: "source-map",
  entry: {
    // vendor: ["@material-ui/styles"],
    main: path.join(__dirname, "src/js/index.js")
  },
  plugins: [new webpack.LoaderOptionsPlugin({ debug: true })],
  output: {
    // filename: "[name].js",
    filename: "main.js",
    path: __dirname + "/static",
    publicPath: "/static/"
  },

  module: {
    rules: [
      // {
      //   test: /\.ts(x?)$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: "ts-loader"
      //     }
      //   ]
      // },
      // All
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,

        use: {
          loader: "babel-loader",
          query: {
            sourceMap: true
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,

        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
