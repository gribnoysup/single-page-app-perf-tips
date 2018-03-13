const express = require('express');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');

const webpackConfig = require('../webpack.config');
const { devServer } = webpackConfig;

const router = express.Router();

const compiler = webpack(webpackConfig);

module.exports = logger => {
  router.use(middleware(compiler, { ...devServer, logger }));
  return router;
};
