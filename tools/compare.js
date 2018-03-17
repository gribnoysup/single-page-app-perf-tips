const path = require('path');

const fs = require('fs-extra');
const prompts = require('prompts');
const chalk = require('chalk');
const wunderbar = require('@gribnoysup/wunderbar');
const table = require('text-table');
const stripAnsi = require('strip-ansi');

const measure = require('./measure');
const fetch = require('./fetch');

const logger = require('./utils/logger');
const { getProjectDir } = require('./utils/paths');
const { TEST_ROUTES, TIMINGS } = require('./utils/const');
const f = require('./utils/format');

const compare = async projects => {
  const { routes } = await prompts({
    name: 'routes',
    type: 'multiselect',
    message: 'What routes do you want to compare?',
    choices: TEST_ROUTES,
  });

  const metricsByProject = [];

  for (const project of projects) {
    const projectDir = getProjectDir(project);
    const metricsPath = path.join(projectDir, 'metrics.json');

    if (!await fs.pathExists(projectDir)) {
      logger.warn(`${f(project)} Couldn't find application.`);
      await fetch(project);
    }

    if (!await fs.pathExists(metricsPath)) {
      logger.warn(`${f(project)} Couldn't find metrics for the application.`);
      await measure(project, { skipResults: true });
    }

    metricsByProject.push({
      project,
      metrics: require(metricsPath).filter(({ url }) => routes.includes(url)),
    });
  }

  // PLZ DON'T HATE ME
  const allTimings = metricsByProject.reduce(
    (acc, { metrics, project }) =>
      acc.concat(
        metrics.reduce(
          (acc, { timings, url }) =>
            acc.concat(
              timings.map(timing => Object.assign({}, timing, { project, url }))
            ),
          []
        )
      ),
    []
  );

  const totalMax = Math.max(...allTimings.map(({ timing }) => timing));

  const filteredRoutes = TEST_ROUTES.filter(({ value }) =>
    routes.includes(value)
  );

  let colors = null;

  logger.info(`Comparing timings for ${chalk.bold(projects.join(', '))}`);
  logger.n();

  filteredRoutes.forEach(({ value: route, title }) => {
    const heading = `Route: ${chalk.bold(route)} ${chalk.gray(`(${title})`)}`;

    logger.noformat(heading);
    logger.n();

    TIMINGS.forEach(({ id, title }) => {
      const timingsForRoute = allTimings.filter(
        timing => timing.id === id && timing.url === route
      );

      const minTiming = Math.min(
        ...timingsForRoute.map(({ timing }) => timing)
      );
      const maxTiming = Math.max(
        ...timingsForRoute.map(({ timing }) => timing)
      );

      const normalized = timingsForRoute.map((timing, index) => ({
        value: timing.timing,
        color: colors && colors[index],
        label: timing.project,
      }));

      const heading = `Metric: ${chalk.bold(title)}`;

      logger.noformat(heading);
      logger.n();

      const { chart, scale, __raw } = wunderbar(normalized, {
        length: 64,
        min: 0,
        max: totalMax,
        format: '0',
      });

      if (colors === null) {
        colors = __raw.normalizedValues.map(({ color }) => color);
      }

      const splittedChart = chart.split('\n');

      const output = __raw.normalizedValues.map((value, index) => {
        const label = value.label;
        const timing = value.rawValue;
        const diff =
          timing === minTiming
            ? 'fastest'
            : '-' + (timing / minTiming * 100 - 100).toFixed(2) + '%';

        const diffColor =
          timing === minTiming
            ? chalk.bold.green
            : timing === maxTiming ? chalk.bold.red : _ => _;

        return [
          chalk.bold(label),
          timing.toFixed(2),
          diffColor(diff),
          splittedChart[index],
        ];
      });

      logger.noformat(
        table(output.concat([[], ['', '', '', scale]]), {
          stringLength: _ => stripAnsi(_).length,
          align: ['l', 'r', 'r', 'l'],
        })
      );
      logger.n();
    });

    logger.n();
  });
};

module.exports = compare;
