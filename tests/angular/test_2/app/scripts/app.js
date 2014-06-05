'use strict';

angular
    .module('filemanagerApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.mypopover',
        'dialogs.main',
        'ngAnimate'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/filemanager.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).config(['$sceDelegateProvider',
        function($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://127.0.0.1:3001/**']);

        }
    ]).constant('SERVER', 'http://127.0.0.1:3001')
    .run(function(FilesFactory) {
        FilesFactory.$find();
    });