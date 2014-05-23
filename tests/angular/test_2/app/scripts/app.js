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
                    myData: function(FilesFactory) {
                        var x = FilesFactory.get();
                        console.info("hey");
                        console.info(x);
                        return x;
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    });