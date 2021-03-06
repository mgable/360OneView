// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'app/scripts/external/servers.js',
            'app/bower_components/underscore/underscore.js',
            'app/bower_components/jquery/dist/jquery.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/angular-resource/angular-resource.js',
            'app/bower_components/angular-sanitize/angular-sanitize.js',
            'app/bower_components/angular-animate/angular-animate.js',
            'app/bower_components/angular-ui-router/release/angular-ui-router.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/bower_components/angular-translate/angular-translate.js',
            'app/bower_components/angular-ui-utils/ui-utils.js',
            'app/bower_components/ng-sortable/dist/ng-sortable.js',
            'app/scripts/vendor/dialogs.js',
            'app/scripts/vendor/jquery.wijmo.wijspread.all.js',
            'app/scripts/vendor/angular.wijmo.wijspread.js',
            'app/bower_components/angular-virtual-scroll/angular-virtual-scroll.js',
            'app/scripts/*.js',
            'app/scripts/**/*.js',
            'test/spec/**/*.js',
            'app/views/**/*.html'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 9876,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,
        preprocessors: {
            "app/views/**/*.html": ["ng-html2js"],
            'app/scripts/**/*.js': 'coverage'
        },
        reporters:  ['dots', 'junit'],
        junitReporter:  {
             outputFile: 'test-results.xml'
        },
        coverageReporter: {
             type: 'cobertura',
             dir: 'coverage/',
             file: 'coverage.xml'
        },


        ngHtml2JsPreprocessor: {
            // If your build process changes the path to your templates,
            // use stripPrefix and prependPrefix to adjust it.
            stripPrefix: "app/",
            // prependPrefix: "web/path/to/templates/",

            // the name of the Angular module to create
            moduleName: "my.templates"
        }
    });
};