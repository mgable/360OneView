exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./test/e2e/**/*.js'],
   capabilities: {
    'browserName': 'chrome'
  },
  framework: 'jasmine',
  allScriptsTimeout: 60000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 360000,
    includeStackTrace: false
  }
};