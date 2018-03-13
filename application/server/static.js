const path = require('path');
const fs = require('fs');

const express = require('express');

const router = express.Router();

const buildPath = path.resolve(__dirname, '..', 'build');

router.get(/\.(js|css|map|png|jpe?g|ico)$/, (req, res) => {
  const filePath = path.join(buildPath, req.url);

  fs.stat(filePath, (err, stats) => {
    if (stats && stats.isFile()) {
      res.sendFile(filePath);
    } else {
      res.sendStatus(404);
    }
  });
});

router.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

module.exports = router;
