/**
 * Copyright (C) 2013-2015 Litixsoft GmbH <info@litixsoft.de>
 * Licensed under the MIT license.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * https://github.com/litixsoft/karma-detect-browsers
 */

const fs = require('fs-extra');
const which = require('which');

const Chrome = {
  name: 'Chrome',
  DEFAULT_CMD: {
    // Try chromium-browser before chromium to avoid conflict with the legacy
    // chromium-bsu package previously known as 'chromium' in Debian and Ubuntu.
    linux: [
      'chromium-browser',
      'chromium',
      'google-chrome',
      'google-chrome-stable',
    ],
    darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
    win32: [
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env.ProgramW6432 + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env.ProgramFiles + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env['ProgramFiles(x86)'] +
        '\\Google\\Chrome\\Application\\chrome.exe',
    ],
  },
  ENV_CMD: 'CHROME_BIN',
};

const asyncWhich = async name =>
  new Promise((resolve, reject) => {
    which(name, (err, path) => {
      if (err) {
        reject(err);
      } else {
        resolve(path);
      }
    });
  });

/**
 * Returns all browser names found on the current system.
 *
 * @param {!Object} browsers The object with all browsers fro the browsers directory.
 * @returns {Array}
 */
const getInstalledBrowsers = async (browsers = {}) => {
  const browserNames = Object.keys(browsers);
  const result = [];

  // iterate over all browsers in the browsers folder
  for (const name of browserNames) {
    const browser = browsers[name];
    const browserPaths = browser.DEFAULT_CMD[process.platform] || [];

    // iterate over all browser paths
    for (const browserPath of browserPaths) {
      try {
        const browserLocated =
          (await fs.exists(browserPath)) ||
          (await asyncWhich(browserPath)) ||
          process.env[browser.ENV_CMD];

        if (browserLocated && result.indexOf(browser.name) < 0) {
          // add browser when found in file system or when env variable is set
          result.push(browser.name);

          // set env variable on win32 when it does not exist yet
          if (process.platform === 'win32' && !process.env[browser.ENV_CMD]) {
            process.env[browser.ENV_CMD] = browserPath;
          }

          break;
        }
      } catch (e) {
        // which() failed to find the browser.
      }
    }
  }

  return result;
};

module.exports = async () =>
  (await getInstalledBrowsers({ Chrome })).includes(Chrome.name);
