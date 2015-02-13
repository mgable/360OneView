/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
    .controller("AnalysisElementCtrl", ["$scope", "DialogService", "ManageScenariosService", function($scope, DialogService, ManageScenariosService) {
        // Inherited from parent controller scenario.js
        // $scope.scenarioElements
        // $scope.setScenarioElement
        // $scope.selectedScenarioElement
        // $scope.selectedScenarioElementsFile
        // $scope.groupedScenarioElements;
        // $scope.loadPivotTable()
        var replaceScenarioElement = function(newElement) {
            console.info("the new element is");
            console.info(newElement);
            console.info($scope.scenarioElements);
                _.each($scope.scenarioElements, function(element, index) {
                    if(element.cubeMeta.id === newElement.cubeMeta.id) {
                        $scope.scenarioElements.splice(index, 1, newElement);
                    }
                });
                console.info($scope.scenarioElements);
                $scope.setScenarioElement(newElement);
                $scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
            },
            replaceAnalysisElementForCube = function(scenarioId, cubeId, elementId) {
                ManageScenariosService.replaceAnalysisElementForCube(scenarioId, cubeId, elementId).then(function(element) {
                    replaceScenarioElement(element);
                });
            },
            copyAndReplaceAnalysisElementForCube = function(scenarioId, cubeId, sourceElementId, newElementData) {
                ManageScenariosService.copyAndReplaceAnalysisElementForCube(scenarioId, cubeId, sourceElementId, newElementData).then(function(element){
                    replaceScenarioElement(element);
                });
            };

       // hide scenario copy and replace options if part of the marketing plan
        $scope.isHiddenElement = function(element) {
            return element.group === 'Marketing Plan';
        };

         $scope.getGroupedScenarioElements = function() {
            return $scope.groupedScenarioElements;
        };

        $scope.openScenarioElementFileModal = function(scenarioId, selectedScenarioElement, e2e) {
            var dialog = DialogService.openLightbox('views/modal/scenario_analysis_element_files.tpl.html', 'ScenarioAnalysisElementFilesCtrl',
                {selectedScenarioElement: selectedScenarioElement, e2e: e2e},
                {windowSize: 'lg', windowClass: 'scenarioAnalysisElementFiles'});

            dialog.result.then(function(data) {
                replaceAnalysisElementForCube(scenarioId, selectedScenarioElement.cubeMeta.id, data.id);
            });
        };

        $scope.openScenarioElementCopyModal = function(scenarioId, selectedScenarioElement) {
            var dialog = DialogService.openLightbox('views/modal/scenario_analysis_element_copy.tpl.html', 'ScenarioAnalysisElementCopyCtrl',
                {selectedScenarioElement: selectedScenarioElement},
                {windowSize: 'lg', windowClass: 'scenarioAnalysisElementCopy'});

            dialog.result.then(function(data) {
                copyAndReplaceAnalysisElementForCube($scope.scenario.id, $scope.cubeId, selectedScenarioElement.id, data);
            });
        };

        $scope.copyAndReplaceAnalysisElementForCube = function(scenarioId, cubeId, sourceElementId, newElementData) {
            ManageScenariosService.copyAndReplaceAnalysisElementForCube(scenarioId, cubeId, sourceElementId, newElementData).then(function(element){
                replaceScenarioElement(element);
            });
        };

    }]);