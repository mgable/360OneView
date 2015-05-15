/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
	.controller("AnalysisElementCtrl", ["$scope", 'EVENTS', "DialogService", "ManageScenariosService", 'ScenarioService',
	function($scope, EVENTS, DialogService, ManageScenariosService, ScenarioService) {
		// Inherited from parent controller scenario.js
		// $scope.scenarioElements
		// $scope.setScenarioElement
		// $scope.selectedScenarioElement
		// $scope.selectedScenarioElementsFile
		// $scope.groupedScenarioElements;
		// $scope.loadPivotTable()
		var init = function(){
			},
			replaceScenarioElement = function(newElement) {
				_.each($scope.scenarioElements, function(element, index) {
					if(element.cubeMeta.id === newElement.cubeMeta.id) {
						$scope.scenarioElements.splice(index, 1, newElement);
					}
				});
				$scope.setScenarioElement(newElement, false);
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
			},
			getModelingPeriod = function(timeLevelId) {
				if($scope.scenario.type === 'Action') {
					ManageScenariosService.getModelingPeriod(timeLevelId).then(function(periods) {
						$scope.modelingPeriod = periods;
						$scope.fromDate = _.find(periods, function(period) {
							return period.id === $scope.scenario.modellingStartTime;
						});
						$scope.toDate = _.find(periods, function(period) {
							return period.id === $scope.scenario.modellingEndTime;
						});
					});
				}
			},
			updateScenario = function() {
				ScenarioService.setModelingTime($scope.project.uuid, $scope.scenario);//.then(function(scenario) {});
			};

		// hide scenario copy and replace options if part of the marketing plan
		$scope.isHiddenElement = function(element) {
			return element.group === 'Marketing Plan';
		};

		$scope.getGroupedScenarioElements = function() {
			return $scope.groupedScenarioElements;
		};

		$scope.openScenarioElementFileModal = function(scenarioId, selectedScenarioElement, e2e) {
			var dialog = DialogService.openLightbox('views/modal/ms_list_lightbox.tpl.html', 'ScenarioAnalysisElementFilesCtrl',
				{selectedScenarioElement: selectedScenarioElement, e2e: e2e},
				{windowSize: 'lg', windowClass: 'list-lightbox'});

			dialog.result.then(function(data) {
				replaceAnalysisElementForCube(scenarioId, selectedScenarioElement.cubeMeta.id, data.id);
			});
		};

		$scope.openScenarioElementCopyModal = function(scenarioId, selectedScenarioElement) {
			var dialog = DialogService.openLightbox('views/modal/scenario_analysis_element_copy.tpl.html', 'ScenarioAnalysisElementCopyCtrl',
				{selectedScenarioElement: selectedScenarioElement},
				{windowSize: 'lg', windowClass: 'form-lightbox'});

			dialog.result.then(function(data) {
				copyAndReplaceAnalysisElementForCube($scope.scenario.id, $scope.cubeId, selectedScenarioElement.id, data);
			});
		};

		$scope.setFromDate = function(time) {
			$scope.fromDate = time;
			$scope.scenario.modellingStartTime = time.id;
			updateScenario();
		};

		$scope.setToDate = function(time) {
			$scope.toDate = time;
			$scope.scenario.modellingEndTime = time.id;
			updateScenario();
		};

		$scope.$on(EVENTS.dimensionsReady, function(event, dimensions) {
			var timeDimension, timeLevelId;
			timeDimension = _.filter(dimensions, function(dimension) {
				return dimension.type === 'TimeDimension';
			})[0];
			timeLevelId = timeDimension.members[timeDimension.members.length - 1].id;
			getModelingPeriod(timeLevelId);
		});

		init();
	}]);