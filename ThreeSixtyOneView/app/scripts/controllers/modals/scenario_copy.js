/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller("ScenarioCopyCtrl", ["$scope", "$rootScope", "$controller", "$modalInstance", "data", "CONFIG", "EVENTS", function($scope, $rootScope, $controller, $modalInstance, data, CONFIG, EVENTS) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data}));

        $scope.item = angular.copy(data);
        $scope.item.name = "COPY -- " + $scope.item.name;

        $scope.modalProperties = {
            title: "Copy a Scenario",
            field: "Name",
            button: "Copy Scenario",
            icon: "files-o"
        };

         $scope.submit = function(name, evt){
            if (evt) { evt.preventDefault(); }
            $scope.item.name = name;
            $rootScope.$broadcast(EVENTS.copyScenario, $scope.item);
            $modalInstance.dismiss('create');
         };

        $scope.close = function(evt) {
            if (evt) { evt.preventDefault(); }

            $modalInstance.dismiss('canceled');
        };
    }]);