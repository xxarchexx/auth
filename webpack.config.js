const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all"
    }
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ];
  }

  return config;
};

const filename = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    },
    "css-loader"
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelOptions = preset => {
  const opts = {
    presets: ["@babel/preset-env"],
    plugins: [
      "@babel/plugin-transform-runtime",
      "@babel/plugin-proposal-class-properties"
    ]
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: babelOptions()
    }
  ];

  if (isDev) {
    loaders.push("eslint-loader");
  }

  return loaders;
};

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "template/index.html"),
      filename: path.resolve(__dirname, "views/index.html"),
      minify: {
        collapseWhitespace: isProd
      }
    }),
  
  
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src/favicon.ico"),
        to: path.resolve(__dirname, "dist")
      },
      {
        from: path.resolve(__dirname, "dist"),
        to: path.resolve(__dirname, "static")
      }
      // {
      //   from: path.resolve(__dirname, 'dist/index.html'),
      //   to: path.resolve(__dirname, 'views/index.html'),
      //   toType: 'file'
      // }
    ]),
    new MiniCssExtractPlugin({
      filename: filename("css")
    }),
   
    
  ];

  // if (isProd) {
  //   base.push(new BundleAnalyzerPlugin())
  // }

  return base;
};

module.exports = {
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./src/js/index.jsx"]
  },
  output: {
    publicPath: "/dist/",
    filename: filename("js"),
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".png"],
    alias: {
      "@": path.resolve(__dirname, "src/js")
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev
  },

  devtool: "source-map",
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.less$/,
        use: cssLoaders("less-loader")
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader")
      },
      {
        test: /\.svg$/,
        loader: "file-loader",
        options: {
          name: "[name].[contenthash].[ext]"
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"]
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"]
      },
      {
        test: /\.csv$/,
        use: ["csv-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript")
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react")
        }
      }
    ]
  }
};
