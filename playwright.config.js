const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { screenshot: 'only-on-failure', trace: 'retain-on-failure' },
});
