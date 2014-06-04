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
                controller: 'MainCtrl',
                resolve: {
                    myData: function(FilesFactory) {
                        return FilesFactory.get();
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    }).config(['$sceDelegateProvider',
        function($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://127.0.0.1:3001/**']);

        }
    ])