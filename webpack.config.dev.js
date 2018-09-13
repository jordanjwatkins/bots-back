const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const projectTitle = require('./package.json').displayName

module.exports = {
  mode: 'development',

  devServer: {
    hot: false,
    inline: true,
  },

  entry: {
    app: './src/js/index.js',
    styles: './src/styles/app.css',
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },

  devtool: 'cheap-module-eval-source-map',

  resolve: {
    alias: {
      './src': path.resolve(__dirname, 'src/'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]-[hash].[ext]',
            outputPath: 'images/',
          },
        }],
      },

      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]-[hash].[ext]',
            outputPath: 'sounds/',
          },
        }],
      },

      {
        test: /styles.*$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          'css-loader?importLoaders=1&url=false&sourceMap=true',
          'postcss-loader?sourceMap=true',
        ],
      },

      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
          plugins: [
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin('[name]-[hash].min.css'),

    new HtmlWebpackPlugin({
      title: projectTitle,
      favicon: './favicon.ico',
      template: 'index.html',
    }),

    new webpack.HotModuleReplacementPlugin(),
  ],
}
