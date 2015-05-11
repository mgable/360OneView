/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller("ModalBaseCtrl", ["$scope", "$modalInstance", "CONFIG", "ErrorService", "data", function($scope, $modalInstance, CONFIG, ErrorService, data){
        $scope.inputRestrictions = CONFIG.application.inputRestrictions;

        $scope.getError = function(type){
        	return ErrorService.getError(type);
        }

        $scope.close = function(evt) {
            if (evt) { evt.preventDefault(); }
            $modalInstance.dismiss('canceled');
        };

        $scope.validator = data.validator || function(){return true};
        $scope.errorType = data.errorType || "";
    }]);