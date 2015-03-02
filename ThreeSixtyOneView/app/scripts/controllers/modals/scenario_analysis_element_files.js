/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ScenarioAnalysisElementFilesCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data", "MetaDataService",
    function($scope, $controller, $modalInstance, CONFIG, data, MetaDataService) {        
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var init = function() {
            $scope.fileList = [];

            $scope.elementTypeItems = ['All', 'By Me', 'Favorite'];
            $scope.currentElementType = 0;

            $scope.selectedScenarioElement = data.selectedScenarioElement;
            $scope.currentFile = {id: data.selectedScenarioElement.id};
            $scope.e2e = data.e2e;

            MetaDataService.getCubeAnalysisElements($scope.selectedScenarioElement.cubeMeta.id).then(function(response) {
                $scope.fileList = response;
            });
        };

        // change element type
        $scope.changeElementType = function(type) {
            $scope.currentElementType = type;
        };

        // cancel the changes and dismiss the modal
        $scope.cancelChangeFile = function() {
            $scope.fileList = [];
            $modalInstance.dismiss('canceled');
        };

        // pass back the selected file and dismiss the modal
        $scope.changeFile = function() {
            var newFile = _.find($scope.fileList, function(file) {
                return file.id === $scope.currentFile.id;
            });
            $modalInstance.close(newFile);
        };

        init();
    }]);