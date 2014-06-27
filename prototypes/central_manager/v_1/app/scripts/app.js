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
                templateUrl: 'views/central_manager.tpl.html',
                controller: 'CentralManagerCtrl',
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function(FilesModel) {
        FilesModel.$find();
    });