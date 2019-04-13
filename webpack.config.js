var path = require('path')

const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    main: './src/js/index.js',
    ts: './src/js/components/Hello.tsx'
  },
  output:{    
    filename:  '[name].js',
    path: __dirname + '/static'
   },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
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
        use: ['style-loader', 'css-loader'],
      },
    ]
  } 
};