/**
 * ╔══════════════════════════════════════════════════════════════════════════════════════╗
 * ║ !!! THIS IS PRODUCTION CONFIG AND SHOULD BE USED ONLY FOR PRODUCTION ENVIRONMENT !!! ║
 * ╚══════════════════════════════════════════════════════════════════════════════════════╝
 */

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
        use: [{ loader: require.resolve('file-loader') }],
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

    // Apply minification to JavaScript bundle
    new UglifyJsPlugin({
      // Parallel will allow webpack to
      // run several uglifiers in parallel
      // speeding up our build process if
      // possible
      parallel: true,
      uglifyOptions: {
        // Several passes can produce better
        // minification results in some cases
        compress: { passes: 2 },
        // This can shave off a few bytes
        output: { comments: false },
      },
      // Enable source maps
      // (makes file a little bit bigger)
      sourceMap: true,
    }),
  ],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    port: 4242,
    publicPath: '/',
  },
};
