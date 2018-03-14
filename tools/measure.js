const path = require('path');

const fs = require('fs-extra');
const prompts = require('prompts');
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');

// We would not use PWmetrics directly because we need to modify config
// in a not supproted way. We will still use some helper methods from
// the library to format the data
const pwMetrics = require('pwmetrics/lib/metrics');

const build = require('./build');
const start = require('./start');
const clear = require('./clear');
const printMetrics = require('./print-metrics');

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
      pauseBeforeTraceEndMs: 25000,
      pauseAfterNetworkQuietMs: 15000,
      pauseAfterLoadMs: 25000,
      networkQuietThresholdMs: 25000,
      cpuQuietThresholdMs: 25000,
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
  { skipResults = false, chromeFlags = ['--headless', '--disable-gpu'] } = {}
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
      extraHeaders: {
        Cookie: '__cart_items__=SK-A-1796|SK-C-2|SK-A-3148',
        'Lighthouse-Cookie': '__cart_items__=SK-A-1796|SK-C-2|SK-A-3148',
      },
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

    await fs.writeFile(
      path.join(projectDir, 'metrics.json'),
      JSON.stringify(results, null, 2)
    );

    logger.process.succeed();

    if (skipResults === false) {
      const { shouldPrintResults } = await prompts({
        type: 'confirm',
        name: 'shouldPrintResults',
        message: `${f(project)} Do you want to print the results?`,
        initial: true,
      });

      if (shouldPrintResults === true) {
        printMetrics(project, { metrics: results });
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
