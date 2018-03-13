const path = require('path');

const fs = require('fs-extra');
const b = require('chalk').bold;

const logger = require('./logger');
const { getPathToApp } = require('./utils/paths');

const clear = async (project, { folders = ['build', 'node_modules'] }) => {
  for (const folderName of folders) {
    const fullPath = path.join(getPathToApp(project), folderName);

    if (await fs.pathExists(fullPath)) {
      logger.process(`Removing ${b(folderName)} for ${b(project)}`);
      await fs.remove(fullPath);
    }
  }

  logger.process.succeed(`Cleared project ${b(project)}`);
};

module.exports = clear;
