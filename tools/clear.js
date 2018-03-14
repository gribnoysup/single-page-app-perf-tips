const path = require('path');

const fs = require('fs-extra');
const b = require('chalk').bold;

const logger = require('./utils/logger');
const { getProjectDir } = require('./utils/paths');
const f = require('./utils/format');

const clear = async (project, { folders = ['build', 'node_modules'] } = {}) => {
  let cleared = [];

  for (const folderName of folders) {
    const fullPath = path.join(getProjectDir(project), folderName);

    if (await fs.pathExists(fullPath)) {
      cleared.push(folderName);
      logger.process(`${f(project)} Removing ${b(folderName)} folder`);
      await fs.remove(fullPath);
    }
  }

  if (cleared.length > 0) {
    logger.process.succeed(
      `${f(project)} Removed ${b(cleared.join(', '))} folder(s)`
    );
  }
};

module.exports = clear;
