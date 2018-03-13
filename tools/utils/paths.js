const path = require('path');

const rootPath = path.resolve(__dirname, '..', '..');

const packageJson = require(path.join(rootPath, 'package.json'));

const getPathToApp = pathOrTagName => {
  if (pathOrTagName === 'current') {
    return path.join(rootPath, 'application');
  } else {
    return path.join(rootPath, 'tmp', pathOrTagName);
  }
};

module.exports = {
  rootPath,
  getPathToApp,
  repoPath: packageJson.repository.url,
};
