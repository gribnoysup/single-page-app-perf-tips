const fs = require('fs-extra');

const isNonEmptyDir = async pathToDir => {
  return (
    (await fs.pathExists(pathToDir)) &&
    (await fs.stat(pathToDir)).isDirectory() &&
    (await fs.readdir(pathToDir)).length > 0
  );
};

module.exports = isNonEmptyDir;
