'use strict';

angular.module('ThreeSixtyOneView')
  .controller('ProjectCurrentScenarioCtrl', ["$scope", "$modalInstance", "data", function($scope, $modalInstance, data) {
        $scope.scenario = data.scenario;
        var selectedRow = 0;

        $scope.scenarioList = [
            { id: 1, name: 'Scenario Title', color: 'ff2f92', label: 'Al', type: '' },
            { id: 2, name: 'Scenario Title (RESULTS NOT CALCULATED)', color: 'ff2f92', label: 'Al', type: 'not-calculated' },
            { id: 3, name: 'Scenario Title', color: 'ff2f92', label: 'Al', type: '' },
            { id: 4, name: 'Scenario Title (OUT OF SYNC)', color: 'ff9300', label: 'A', type: '' },
            { id: 5, name: 'Scenario Title', color: '075895', label: 'S', type: ''},
            { id: 6, name: 'Scenario Title', color: 'ff9300', label: 'A', type: '' },
            { id: 7, name: 'Scenario Title', color: '075895', label: 'S', type: ''},
            { id: 8, name: 'Scenario Title', color: 'ff2f92', label: 'Al', type: '' },
            { id: 9, name: 'Scenario Title', color: '075895', label: 'S', type: ''},
            { id: 10, name: 'Scenario Title', color: '075895', label: 'S', type: ''}
        ];

        $scope.getRow = function(id){
            selectedRow = id;
        };

        $scope.showRow = function(){
            return selectedRow;
        }

        $scope.close = function() {
            console.info("cancel");
            $modalInstance.dismiss('canceled');
        };
}]);
