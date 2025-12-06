const { defineConfig } = require('cypress')

module.exports = defineConfig({
    chromeWebSecurity: false,
    retries: 2,
    video: false,
    defaultCommandTimeout: 5000,
    watchForFileChanges: false,
    videosFolder: 'tests/cypress/videos',
    screenshotsFolder: 'tests/cypress/screenshots',
    fixturesFolder: 'tests/cypress/fixture',
    e2e: {
        setupNodeEvents(on, config) {
            return require('./tests/cypress/plugins/index.cjs')(on, config)
        },
        baseUrl: 'http://ninja.test:8000/',
        specPattern: 'tests/cypress/e2e/**/*.cy.{js,cjs}',
        supportFile: 'tests/cypress/support/index.js',
    },
})
