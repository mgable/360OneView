'use strict';

angular
    .module('fileManagerApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/fileManager.html',
                controller: 'fileManagerCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });