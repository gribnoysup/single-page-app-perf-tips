/**
 * ╔══════════════════════════════════════════════════════════════════════════════════════╗
 * ║ !!! THIS IS PRODUCTION CONFIG AND SHOULD BE USED ONLY FOR PRODUCTION ENVIRONMENT !!! ║
 * ╚══════════════════════════════════════════════════════════════════════════════════════╝
 */

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const webpack = require('webpack');

const { default: ImageminPlugin } = require('imagemin-webpack-plugin');
const mozjpeg = require('imagemin-mozjpeg');

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

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),

    // Apply minification to image assets
    new ImageminPlugin({
      test: /\.(png|jpe?g)$/i,
      pngquant: {
        // Production build can take longer, if
        // this means that optimization is done
        // better
        speed: 1,
        // Let's try to minify png without
        // loosing too much in quality
        quality: 80,
      },
      plugins: [
        mozjpeg({
          // Again, as with pngs, we will try to
          // compress images, but not too much
          quality: 80,
        }),
      ],
    }),
  ],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    port: 4242,
    publicPath: '/',
  },
};
