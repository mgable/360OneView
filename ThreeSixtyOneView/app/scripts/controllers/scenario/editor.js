/* globals _, window */
/*jshint unused:false*/

'use strict';
angular.module('ThreeSixtyOneView')
.controller("ScenarioEditorCtrl", ["$scope", "$rootScope", "$timeout", "Project", "Scenario", "ScenarioAnalysisElements", "$state", "EVENTS", "ManageScenariosService", "DialogService", "PivotMetaService", "Calculate", "PivotService", "ManageAnalysisViewsService", "AnalyticCalculationsService", "ScenarioStatesService", "CONFIG",
	function($scope, $rootScope, $timeout, Project, Scenario, ScenarioAnalysisElements, $state, EVENTS, ManageScenariosService, DialogService, PivotMetaService, Calculate, PivotService, ManageAnalysisViewsService, AnalyticCalculationsService, ScenarioStatesService, CONFIG) {

		var init = function() {
			// determines if the current view is a draft view
			$scope.draftView = false;
			// determines if adding time dimensions in rows and columns is disabled
			$scope.timeDisabled = false;
			// added items in rows and columns
			$scope.added = {};
			// added filters
			$scope.addedFilters = {};
			// added filters in categorized format
			$scope.categorizedValue = [];
			$scope.pivotTableData = '';

			ScenarioStatesService.startPull([Scenario.id]);

			// this is how pivotbuilder and pivottable communicate
			$scope.spread = {sheet: {loading: true}};

			initiateModel($scope.selectedScenarioElement.cubeMeta);
		},
		initiateModel = function(cubeMeta) {
			$scope.viewData = {name: 'Loading ...'};
			PivotMetaService.initModel(cubeMeta).then(function(result) {
				var foundView = _.find(result.viewsList, function(view){ return view.id === result.viewData.id; });
				if (foundView) {
					$scope.draftView = foundView.name.substring(0, 8) === 'Draft - ';
				}

				angular.extend($scope, result);
				$scope.viewName = result.viewData.name;

				$scope.added = PivotMetaService.setUpAddedLevels(result.viewData.columns.concat(result.viewData.rows));
				$scope.membersList = PivotMetaService.generateMembersList(result.dimensions);
				$scope.determineTimeDisability($scope.added);
				$scope.addedFilters = PivotMetaService.getAddedFilters(result.viewData.filters, result.dimensions);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, result.dimensions, result.viewData);

				$scope.loadPivotTable($scope.selectedScenarioElement, result.viewData);
			});
		};

		$scope.deleteView = function(cubeId, viewId) {
			ManageAnalysisViewsService.deleteView(viewId, cubeId).then(function() {
				$scope.viewsList = _.reject($scope.viewsList, function(view) { return view.id === viewId; });
				$scope.draftView = false;
			});
		};

		// save the draft view
		$scope.saveDraftView = function() {
			if(!$scope.draftView) {
				$scope.draftView = true;
				var draftView = angular.copy($scope.viewData);
				draftView.name = 'Draft - ' + draftView.name;
				$scope.createView($scope.cubeId, draftView).then(function() {
					$scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
				});
			} else {
				PivotMetaService.updateView($scope.cubeId, $scope.viewData).then(function() {
					$scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
				});
			}
		};

		// save the changes in the current view
		$scope.saveView = function() {
			if($scope.draftView) {
				var originalViewName = $scope.viewData.name.substring(8),
					originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id,
					draftViewId = $scope.viewData.id;

				$scope.viewData.name = originalViewName;
				$scope.viewData.id = originalViewId;
				PivotMetaService.updateView($scope.cubeId, $scope.viewData).then(function(view) {
					$scope.viewData = view;
					$scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
					$scope.determineTimeDisability($scope.added);
				});
				$scope.deleteView($scope.cubeId, draftViewId);
			}
		};

		$scope.loadPivotTable = function(element, view) {
			if(!!$scope.spread.updateSheet) {
				$scope.spread.sheet.loading = true;
				$scope.spread.updateSheet('');
				$rootScope.$broadcast(EVENTS.pivotTableStatusChange, CONFIG.application.models.PivotServiceModel.pivotDataStatus.loading);
				PivotService.getSlice(element.id, view.id).then(function(response) {
					var numCols = view.columns.length,
						numRows = view.rows.length;
					$scope.spread.updateSheet(response.formatted, numCols, numRows, response.helperObject);
					$scope.pivotTableObject = response.original;
					$scope.pivotTableData = response.formatted;
					$scope.pivotTableHelper = response.helperObject;
				});
			}
		};

		// update filter values after any change made to them in the filters modal
		$scope.updateFilterValues = function(newFilterData) {
			$scope.addedFilters = newFilterData;

			$scope.viewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.viewData.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.viewData);
		};

		// load a view from the backend
		$scope.loadView = function(cubeId, viewId) {
			$scope.viewData = {name: 'Loading ...'};
			$rootScope.$broadcast(EVENTS.pivotViewChange, {});
			ManageAnalysisViewsService.getView(viewId, cubeId).then(function(view) {
				// remove the draft view if one exists and is not selected
				if($scope.draftView) {
					var draftId = _.find($scope.viewsList, function(view) {return view.name.substring(0,8) === 'Draft - ';}).id;

					if(viewId !== draftId) {
						$scope.deleteView($scope.cubeId, draftId);
					}
				}

				$scope.viewData = view;
				$scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
				$scope.determineTimeDisability($scope.added);
				$scope.membersList = PivotMetaService.generateMembersList($scope.dimensions);
				$scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, view);

				$scope.loadPivotTable($scope.selectedScenarioElement, view);
			});
		};

		$scope.createView = function(cubeId, view) {
			view.id = null;
			return ManageAnalysisViewsService.createView(view, cubeId).then(function(view) {
				$scope.viewData = angular.copy(view);
				$scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
				$scope.determineTimeDisability($scope.added);
				$scope.viewsList.unshift(view);
				$scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
				return view;
			});
		};

		$scope.renameView = function(cubeId, view) { // rename the view
			ManageAnalysisViewsService.renameView(view.id, cubeId, view.name).then(function(response) {
				_.each($scope.viewsList, function(item) {
					if(item.id === response.id) {
						item.name = response.name;
					}
				});
			});
		};

		$scope.isViewDraft = function(draft) {
			if(typeof draft === 'undefined') {
				return $scope.draftView;
			} else {
				$scope.draftView = draft;
			}
		};

		$scope.determineTimeDisability = function(added) {
			var timeDimensionId = 0;

			_.each($scope.dimensions, function(dimension) {
				if(dimension.type === 'TimeDimension') {
					timeDimensionId = dimension.id;
				}
			});

			$scope.timeDisabled = false;
			_.each(added, function(item, key) {
				if($scope.membersList[timeDimensionId][key] && added[key]) {
					$scope.timeDisabled = true;
				}
			});
		};

		$scope.determineReadOnlyMode = function(currentState) {
			var states = CONFIG.application.models.ScenarioAnalytics.states;
			if(states.IN_PROGRESS.message === currentState) {
				$scope.readOnlyMode = true;
				$scope.disableSimulateBtn(true);
			} else {
				$scope.readOnlyMode = false;
				$scope.disableSimulateBtn(false);
			}
		};

		$scope.$on(EVENTS.scenarioElementChange, function(evt, cubeMeta) {
			initiateModel(cubeMeta);
		});

		$scope.$on(EVENTS.broadcastStates, function($event, response) {
			$scope.determineReadOnlyMode(response[0].currentState.message);
		});

		init();
	}]);