const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const path = require('path');
const basePath = path.resolve(__dirname);
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  context: basePath,

  entry: {
    index: "./src/components/index.js",
  },

  output: {
    filename: "[name]-[chunkhash].js",
    chunkFilename: "[id].[chunkhash].bundle.js",
    publicPath: __dirname + "/dist",
    path: __dirname + "/dist"
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: true,
      path: __dirname + "/dist",
      template: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    })
  ],

  resolve: {
    modules: [
      "node_modules"
    ],
  },

  devtool: 'eval-source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                "@babel/react",
              ],
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ]
      },
    ]
  }
};