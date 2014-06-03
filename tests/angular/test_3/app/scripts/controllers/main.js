'use strict';

angular.module('fileManagerApp')
    .controller('MainCtrl', function($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }).controller('fileManagerCtrl', function($scope) {
        $scope.data = 'foo';
    });