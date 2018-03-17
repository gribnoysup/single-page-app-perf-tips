/**
 * Our build config is defined by NODE_ENV variable.
 * If NODE_ENV is not provided, we will fallback to production.
 */
Object.assign(process.env, {
  NODE_ENV: process.env.NODE_ENV || 'production',
});

module.exports = require(`./webpack.config.${process.env.NODE_ENV}`);
