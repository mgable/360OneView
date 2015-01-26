/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
    .controller("MainCtrl", ["$scope", "$location", "ErrorService", function($scope, $location, ErrorService) {
        // Error service surfaced here
        // For unit testing only;
        $scope.ErrorService = ErrorService;

        // querystring 'e2e' formats data for protractor tests
        if ($location.search().e2e === "true"){
            $scope.e2e = true;
        }

        // convenience methods
        $scope.console = function(msg) {
            console.info(msg);
        };

        $scope.alert = function(msg, evt) {
            window.alert(msg);
            if (evt){
                evt.stopPropagation();
            }
        };

    }]);