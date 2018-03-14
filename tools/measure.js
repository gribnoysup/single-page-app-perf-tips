const path = require('path');

const fs = require('fs-extra');
const chalk = require('chalk');
const prompts = require('prompts');
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');
const wunderbar = require('@gribnoysup/wunderbar');
const { width: terminalWidth } = require('window-size');

// We would not use PWmetrics directly because we need to modify config
// in a not supproted way. We will still use some helper methods from
// the library to format the data
const pwMetrics = require('pwmetrics/lib/metrics');

const build = require('./build');
const start = require('./start');
const clear = require('./clear');

const logger = require('./utils/logger');
const isChromeAvailable = require('./utils/isChromeAvailable');
const { getProjectDir } = require('./utils/paths');
const f = require('./utils/format');

const TEST_ROUTES = ['/', '/catalog', '/product/SK-A-1718', '/cart'];

const NUMBER_OF_RUNS = process.env.NUMBER_OF_RUNS || 3;

// We use modified PWMetrics config to bump threshold on all metrics,
// otherwise we are not registering VC100 and PSI correctly. Original
// config could be found in pwmetrics/lib/lh-config
const pwConfig = {
  passes: [
    {
      recordTrace: true,
      pauseBeforeTraceEndMs: 15000,
      pauseAfterNetworkQuietMs: 15000,
      pauseAfterLoadMs: 15000,
      networkQuietThresholdMs: 15000,
      cpuQuietThresholdMs: 15000,
      useThrottling: true,
      gatherers: [],
    },
  ],
  audits: [
    'first-meaningful-paint',
    'speed-index-metric',
    'estimated-input-latency',
    'first-interactive',
    'consistently-interactive',
  ],
};

const waitForAppReady = (project, subprocess) =>
  new Promise((resolve, reject) => {
    const throwTimeout = setTimeout(() => {
      reject(new Error(`${project} took too much time to start`));
    }, 20000);

    subprocess.on('message', data => {
      if (data && typeof data === 'object' && data.state === 'READY') {
        clearTimeout(throwTimeout);
        resolve(data.url);
      }
    });
  });

const median = values => {
  if (values.length === 1) return values[0];

  const sorted = values.slice().sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);

  return sorted[half];
};

const runAuditAndFindMedian = async (project, url, options, config) => {
  const runs = Array.from({ length: NUMBER_OF_RUNS }, (_, idx) => idx);

  logger.process.fresh(
    `${f(project)} Gathering metrics for ${url} (0/${runs.length})`
  );

  for (const runIdx of runs) {
    logger.process(
      `${f(project)} Gathering metrics for ${url} (${runIdx + 1}/${
        runs.length
      })`
    );

    runs[runIdx] = pwMetrics.prepareData(
      await lighthouse(url, options, config)
    );
  }

  const timingValues = runs.map(
    run => run.timings.find(timing => timing.id === pwMetrics.ids.TTFI).timing
  );

  const medianTimings = median(timingValues);

  return runs.find(run =>
    run.timings.find(
      timing =>
        timing.id === pwMetrics.ids.TTFI && timing.timing === medianTimings
    )
  );
};

const measure = async (
  project,
  {
    skipResults = false,
    chromeFlags = ['--headless', '--disable-gpu', '--incognito'],
  } = {}
) => {
  const projectDir = getProjectDir(project);
  let serverProcess, chromeProcess;

  try {
    if (!await isChromeAvailable()) {
      throw new Error("Can't run performance tests. Chrome is non installed");
    }

    logger.info(`${f(project)} Creating fresh build`);

    await clear(project);
    await build(project);

    logger.process.fresh(`${f(project)} Starting application`);

    serverProcess = await start(project, {
      stdio: 'ignore',
      returnSubprocess: true,
    });

    const baseUrl = await waitForAppReady(project, serverProcess);

    logger.process.fresh(`${f(project)} Starting chrome`);

    chromeProcess = await chromeLauncher.launch({
      startingUrl: 'about:blank',
      chromeFlags,
    });

    logger.process.succeed();

    const lighthouseOptions = {
      output: 'json',
      port: chromeProcess.port,
      chromeFlags,
    };

    const results = [];

    for (const route of TEST_ROUTES) {
      const result = await runAuditAndFindMedian(
        project,
        baseUrl + route,
        lighthouseOptions,
        pwConfig
      );

      results.push({ url: route, timings: result.timings });
    }

    logger.process.fresh(`${f(project)} Writing metrics.json`);

    await fs.writeJSON(path.join(projectDir, 'metrics.json'), results);

    logger.process.succeed();

    if (skipResults === false) {
      const { shouldPrintResults } = await prompts({
        type: 'confirm',
        name: 'shouldPrintResults',
        message: `${f(project)} Do you want to print the results?`,
        initial: true,
      });

      if (shouldPrintResults === true) {
        logger.info(`${f(project)} Application Performance Metrics:`);
        logger.n();

        results.forEach(({ url, timings }) => {
          const normalized = timings.map(({ timing, title }) => ({
            label: title,
            value: timing,
          }));

          const { chart, legend, scale } = wunderbar(normalized, {
            length: Math.min(terminalWidth, 128),
            randomColorOptions: { seed: 'unicorn' },
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
      }
    }

    logger.info('All done. Cleaning up.');
  } finally {
    if (chromeProcess && typeof chromeProcess.kill === 'function') {
      chromeProcess.kill();
    }
    if (serverProcess && typeof serverProcess.kill === 'function') {
      serverProcess.kill();
    }
  }
};

module.exports = measure;
