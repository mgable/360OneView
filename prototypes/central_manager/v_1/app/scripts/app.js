'use strict';

angular
    .module('centralManagerApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',
        'pasvaz.bindonce',
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.tpl.html',
                controller: '',
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function(FilesModel) {
        FilesModel.$find();
    });