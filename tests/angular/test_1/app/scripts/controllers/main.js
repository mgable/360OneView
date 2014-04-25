'use strict';

angular.module('test1App')
    .controller('MainCtrl', function($scope, Data) {
        Data.getMenu('home').then(function(results) {
            $scope.menuItems = results;
        });
    })
    .controller('dashboardCtrl', function($scope, Data) {
        Data.getMenu('dashboard').then(function(results) {
            $scope.menuItems = results;
        });
    })
    .controller('decisionbookCtrl', function($scope, Data) {
        Data.getMenu('decisionbook').then(function(results) {
            $scope.menuItems = results;
        });
    });