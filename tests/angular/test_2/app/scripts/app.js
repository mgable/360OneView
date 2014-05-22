'use strict';

angular
    .module('filemanagerApp', [
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
                templateUrl: 'views/filemanager.html',
                controller: 'MainCtrl',
                resolve: {
                    Data: function(GetData) {
                        return GetData.query();
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    });