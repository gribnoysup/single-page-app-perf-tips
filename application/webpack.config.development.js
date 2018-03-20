/**
 * ╔════════════════════════════════════════════════════════════════════════════════════════╗
 * ║ !!! THIS IS DEVELOPMENT CONFIG AND SHOULD BE USED ONLY FOR DEVELOPMENT ENVIRONMENT !!! ║
 * ╚════════════════════════════════════════════════════════════════════════════════════════╝
 */

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');

module.exports = {
  entry: {
    app: [
      require.resolve('babel-polyfill'),
      path.resolve(__dirname, 'src', 'index.js'),
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        use: [{ loader: require.resolve('babel-loader') }],
      },
      {
        test: /\.css$/,
        use: [
          { loader: require.resolve('style-loader') },
          {
            loader: require.resolve('css-loader'),
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:4]',
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g)$/,
        use: [
          {
            // Responsive loader allows us to provide required
            // image size right in our source code
            loader: require.resolve('responsive-loader'),
            options: {
              name: '[hash].[width].[ext]',
              adapter: require(require.resolve('responsive-loader/sharp')),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'public', '*.{png,ico}'),
        to: path.resolve(__dirname, 'build', '[name].[ext]'),
      },
    ]),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    port: 4242,
    publicPath: '/',
  },
};
