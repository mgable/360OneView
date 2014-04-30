'use strict';

angular
    .module('test1App', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
        'dialogs.main'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'dashboardCtrl'
            })
            .when('/decisionbook', {
                templateUrl: 'views/decisionbook.html',
                controller: 'decisionbookCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });