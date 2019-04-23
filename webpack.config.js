var path = require('path')
const webpack = require('webpack');

const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = { 
  devtool: 'source-map',
  entry: {
    main: './src/js/index.js'    
  },
  plugins:[
    new webpack.LoaderOptionsPlugin({ debug: true  }),
  ],
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
          loader: "babel-loader",
          query:{
            sourceMap: true
          },
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