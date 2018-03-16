const path = require('path');

const fs = require('fs-extra');
const chalk = require('chalk');
const wunderbar = require('@gribnoysup/wunderbar');
const { width: terminalWidth } = require('window-size');

const { getProjectDir } = require('./utils/paths');
const logger = require('./utils/logger');
const { blue } = require('./utils/colors');
const f = require('./utils/format');

const printMetrics = async (project, { metrics } = {}) => {
  const projectDir = getProjectDir(project);
  const metricsPath = path.join(projectDir, 'metrics.json');

  if (!Array.isArray(metrics) && !await fs.pathExists(metricsPath)) {
    logger.warn(`${f(project)} Couldn't find metrics for the application.`);
    await require('./measure')(project, { skipResults: true });
  }

  if (!metrics) {
    metrics = require(metricsPath);
  }

  logger.info(`${f(project)} Application Performance Metrics:`);
  logger.n();

  const allTimings = metrics.reduce(
    (acc, { timings }) => acc.concat(timings.map(({ timing }) => timing)),
    []
  );

  const totalMax = Math.max(...allTimings);

  metrics.forEach(({ url, timings }) => {
    const normalized = timings.map(({ timing, title }, index) => ({
      label: title,
      value: timing,
      color: blue[index],
    }));

    const { chart, legend, scale } = wunderbar(normalized, {
      length: Math.min(terminalWidth, 128),
      min: 0,
      max: totalMax,
      format: '0',
    });

    logger.noformat(chalk.bold(`Route: ${url}`));
    logger.n();
    logger.noformat(chart);
    logger.n();
    logger.noformat(scale);
    logger.n();
    logger.noformat(legend);
    logger.n();
  });
};

module.exports = printMetrics;
