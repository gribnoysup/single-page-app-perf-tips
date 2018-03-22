const path = require('path');

const express = require('express');

const { ENCODINGS, fileMiddleware } = require('./fileMiddleware');

const router = express.Router();

const buildPath = path.resolve(__dirname, '..', 'build');

router.use((req, res, next) => {
  // Determine path to the asset from the request path
  res.locals.filePath = path.join(buildPath, req.path);
  next();
});

// We are not compressing our images with gzip or
// brotli, so there is no point in wasting time
// on looking for compressed file
router.get(/\.(png|jpe?g|ico)$/, fileMiddleware());

// For everything that is compressed during build,
// we will try to provide compressed asset first
router.get(
  /\.(js|css|map)$/,
  fileMiddleware(ENCODINGS.Brotli),
  fileMiddleware(ENCODINGS.Gzip),
  fileMiddleware()
);

// Everything else is a special case, where we will try
// to send compressed index.html
router.get(
  '*',
  (req, res, next) => {
    res.locals.filePath = path.join(buildPath, 'index.html');
    next();
  },
  fileMiddleware(ENCODINGS.Brotli),
  fileMiddleware(ENCODINGS.Gzip),
  fileMiddleware()
);

module.exports = router;
