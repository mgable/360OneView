'use strict';

angular
    .module('test1App', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
        'dialogs.main',
        'ngAnimate'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/login.html',
                controller: 'LogInViewCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardViewCtrl'
            })
            .when('/decisionbook', {
                templateUrl: 'views/decisionbook.html',
                controller: 'DecisionbookViewCtrl'
            })
            .when('/projects', {
                templateUrl: 'views/projects.html',
                controller: 'ProjectsViewCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).constant('SERVER', 'http://127.0.0.1:3001/marketshare');