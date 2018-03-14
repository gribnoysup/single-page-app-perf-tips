const path = require('path');

const tmpFolder = 'sandbox';

const rootDir = path.resolve(__dirname, '..', '..');

const packageJson = require(path.join(rootDir, 'package.json'));

const getProjectDir = appOrTagName => {
  if (appOrTagName === 'current') {
    return path.join(rootDir, 'application');
  } else {
    return path.join(rootDir, tmpFolder, appOrTagName);
  }
};

module.exports = {
  rootDir,
  getProjectDir,
  repoPath: packageJson.repository.url,
  tmpFolder,
};
