var path = require("path");
const webpack = require("webpack");

// eslint-disable-next-line no-unused-vars

module.exports = {  
  
  
  devtool: "source-map",
  entry: {
    // vendor: ["@material-ui/styles"],
    main: path.join(__dirname, "src/js/index.js")
  },
  // plugins: [new webpack.LoaderOptionsPlugin({ debug: true })],
  output: {
    // filename: "[name].js",
    filename: "main.js",
    path: __dirname + "/static",
    publicPath: "/static/"
  },

  module: {
    rules: [      
      {
        test: /\.svg/,
        use: {
            loader: 'svg-url-loader',
            options: {}
        }
    },
       {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        loader: 'css-loader'        
      },
      {
        test: /\.css$/,
        loader: 'style-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,

        use: {
          loader: "babel-loader",
          query: {
            sourceMap: true
          }
        }
      }     
    ]
  }
};
