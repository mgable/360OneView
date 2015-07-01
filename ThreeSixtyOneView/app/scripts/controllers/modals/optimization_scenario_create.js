/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('OptimizationScenarioCreateCtrl', ["$scope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", "EVENTS", "GotoService", '$filter', 'ManageTemplatesService',
        function($scope, $modalInstance, $controller, data, ScenarioService, CONFIG, EVENTS, GotoService, $filter, ManageTemplatesService) {
        
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data}));

        var init = function init() {
            $scope.types = [
                {label: 'Hit Target'},
                {label: 'Allocate'},
                {label: 'Max Profit'}
            ];
        };

        $scope.submit = function(scenario){
            $scope.close();
        };

        init();
    }]);