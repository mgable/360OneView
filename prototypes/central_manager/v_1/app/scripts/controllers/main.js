'use strict';

angular.module('centralManagerApp')
    .controller('CentralManagerCtrl', function($scope, FilesModel) {
        $scope.data = FilesModel.$get();
    $scope.showinfotray = false;

        $scope.toggleInfoTray = function() {
            console.info("goo")
        $scope.showinfotray = !$scope.showinfotray;
        }
    });