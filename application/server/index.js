const pino = require('pino');
const pinoColada = require('pino-colada');

const express = require('express');
const loggerMiddleware = require('express-pino-logger');

const apiRouter = require('./api');
const staticRouter = require('./static');

const PORT = process.env.PORT || 4242;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const DEV = process.argv.includes('--dev');

const app = express();
const prettyStream = pinoColada();

const pinoLogger = pino({ level: LOG_LEVEL }, prettyStream);

// Pino-colada will format all logs and stream them to stdout
prettyStream.pipe(process.stdout);

app.use((req, res, next) => {
  // We will use Lighthouse-Cookie header to detect
  // that request is coming from lighthouse
  if (req.get('Lighthouse-Cookie')) {
    // We will use this cookie to simulate non-empty cart in our tests
    const [name, value] = req.get('Lighthouse-Cookie').split('=');
    res.cookie(name, value);
  }

  next();
});

// Activate logger middleware for all routes
app.use(loggerMiddleware({ logger: pinoLogger }));

// Use API router for all /api requests
app.use('/api', apiRouter);

// As our dev server also needs API support to work properly,
// we will use webpack-dev-middleware if a special --dev flag
// is provided, otherwise we will just serve build assets with
// static router
app.use(DEV === true ? require('./development')(pinoLogger) : staticRouter);

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;

  pinoLogger.info(`App is listening at ${url}`);

  // Send a signal that app is ready to parent
  // process, if there is one
  if (typeof process.send === 'function') {
    process.send({ state: 'READY', url });
  }
});
