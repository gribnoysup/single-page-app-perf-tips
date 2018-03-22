const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mime = require('mime-types');

const statAsync = promisify(fs.stat);

// This array is an order in which we will
// try to resolve compressed file to send to
// the client before falling back to the
// original
const ENCODINGS = {
  Brotli: { id: 'br', ext: '.br' },
  Gzip: { id: 'gzip', ext: '.gz' },
};

// This helper function will show us if
// the file exists
const isFileExists = filePath =>
  statAsync(filePath).then(
    stats => stats.isFile(),
    err => {
      if (err.code === 'ENOENT') return false;
      throw err;
    }
  );

// This middleware will check if client accepts the
// provided encoding and if the file with this encoding
// is avaliable and will send it if it is. Otherwise it
// will pass response handling to the next middleware
const fileMiddleware = (encoding = null) => (req, res, next) => {
  if (encoding === null) {
    res.sendFile(res.locals.filePath);
  } else if (req.acceptsEncodings(encoding.id)) {
    const pathToCompressedFile = res.locals.filePath + encoding.ext;

    isFileExists(pathToCompressedFile)
      .then(exists => {
        if (exists === true) {
          const mimeType = mime.contentType(path.extname(res.locals.filePath));
          // Before sending file to the client we need to set
          // an appropriate Content-Encoding header ...
          res.set('Content-Encoding', encoding.id);
          // ... and also a Content-Type header based on the
          // original requested file; otherwise Express.js
          // will try to detect it automatically by file
          // extension and will set wrong one
          res.set('Content-Type', mimeType);

          res.sendFile(pathToCompressedFile);
        } else {
          next();
        }
      })
      .catch(err => res.sendStatus(500));
  } else {
    next();
  }
};

module.exports = { ENCODINGS, fileMiddleware };
