const path = require('path');
const isNonEmptyDirectory = require('./isNonEmptyDir');

const isBuildExists = async pathToDir => {
  const pathToBuild = path.resolve(pathToDir, 'build');
  const pathToNodeModules = path.resolve(pathToDir, 'node_modules');

  try {
    return (
      (await isNonEmptyDirectory(pathToBuild)) &&
      (await isNonEmptyDirectory(pathToNodeModules))
    );
  } catch (e) {
    return false;
  }
};

module.exports = isBuildExists;
