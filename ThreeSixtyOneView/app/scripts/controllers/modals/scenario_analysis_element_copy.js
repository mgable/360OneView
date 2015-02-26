/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ScenarioAnalysisElementCopyCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data",
    function($scope, $controller, $modalInstance, CONFIG, data) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var init = function() {
            $scope.selectedScenarioElement = data.selectedScenarioElement;

            $scope.newElement = {
                name: data.selectedScenarioElement.name + ' - copy',
                description: ''
            };
        };

        // cancel the changes and dismiss the modal
        $scope.cancelCopyFile = function() {
            $modalInstance.dismiss('canceled');
        };

        // pass back the selected file and dismiss the modal
        $scope.copyFile = function() {
            $modalInstance.close($scope.newElement);
        };

        init();
    }]);