'use strict';

angular.module('centralManagerApp')
    .controller('CentralManagerCtrl', function($scope, FilesModel) {
        $scope.data = FilesModel.$get();
        $scope.showInfoTray = false;

        $scope.toggleInfoTray = function() {
            console.info("goo")
            $scope.showInfoTray = !$scope.showInfoTray;
        }
    });