exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./test/e2e/*.js'],
   capabilities: {
    'browserName': 'chrome'
  },
  framework: 'jasmine',
  allScriptsTimeout: 60000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 360000,
    includeStackTrace: false
  },
  onPrepare: function() {
      var reports = require('jasmine-reporters');
      jasmine.getEnv().addReporter(new reports.JUnitXmlReporter({'savePath': "./reports"}));
    }
};