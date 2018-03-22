const path = require('path');
const express = require('express');
const compressionMiddleware = require('compression');

const router = express.Router();

const fixturePath = path.resolve(__dirname, '..', '__fixtures__');

router.use(compressionMiddleware());

router.get('/catalog', (req, res) => {
  res.sendFile(path.join(fixturePath, 'catalog.json'));
});

router.get('/catalog/:objectNumber', (req, res) => {
  const { objectNumber } = req.params;
  res.sendFile(path.join(fixturePath, 'items', objectNumber + '.json'));
});

router.get('/catalog/:objectNumber/small', (req, res) => {
  const { objectNumber } = req.params;
  const catalog = require(path.join(fixturePath, 'catalog.json'));

  res.send(
    catalog.artObjects.find(object => object.objectNumber === objectNumber)
  );
});

module.exports = router;
