const path = require('path');

const fs = require('fs-extra');
const prompts = require('prompts');
const b = require('chalk').bold;

const printMetrics = require('./print-metrics');

const logger = require('./utils/logger');
const { getProjectDir } = require('./utils/paths');
const { blue, red } = require('./utils/colors');
const f = require('./utils/format');

const compare = async projects => {
  if (projects.length === 1) {
    const { shouldPrintMetrics } = await prompts({
      message:
        'You selected one application. Do you want to print metrics for one application instead?',
      type: 'confirm',
      name: 'shouldPrintMetrics',
    });

    if (shouldPrintMetrics === true) {
      await printMetrics(projects[0]);
    }

    return;
  }

  const metrics = [];

  for (const project of projects) {
    const projectDir = getProjectDir(project);
    const metricsPath = path.join(projectDir, 'metrics.json');

    if (!await fs.pathExists(metricsPath)) {
      const message =
        `${f(project)} Couldn't find metrics.json for the application. ` +
        `Please run ${b('npm run measure')} first`;

      logger.error(message);
      return;
    }

    metrics.push({
      project,
      metrics: require(metricsPath),
    });
  }
};

module.exports = compare;
