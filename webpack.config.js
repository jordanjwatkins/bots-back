const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

const projectTitle = require('./package.json').displayName

module.exports = {
  devServer: {
    hot: true,
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
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: [
            'css-loader?importLoaders=1&url=false&sourceMap=true',
            'postcss-loader?sourceMap=true',
          ],
        })),
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
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      title: projectTitle,
      favicon: './favicon.ico',
      template: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
