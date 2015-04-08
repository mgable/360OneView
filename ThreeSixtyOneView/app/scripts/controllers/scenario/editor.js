/* globals _, window */
/*jshint unused:false*/

'use strict';
angular.module('ThreeSixtyOneView')
.controller("ScenarioEditorCtrl", ["$scope", "$rootScope", "EVENTS", "PivotMetaService", "PivotService", "ManageAnalysisViewsService", "ScenarioStatesService", "CONFIG",
	function($scope, $rootScope, EVENTS, PivotMetaService, PivotService, ManageAnalysisViewsService, ScenarioStatesService, CONFIG) {

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

			$scope.readOnlyMode = false;

			ScenarioStatesService.startPull([$scope.scenario.id]);

			// this is how pivotbuilder and pivottable communicate
			$scope.spread = {sheet: {loading: true}};

			initiateModel($scope.selectedScenarioElement.cubeMeta);
		},
		initiateModel = function(cubeMeta) {
			$scope.viewData = {name: 'Loading ...'};
			PivotMetaService.initModel(cubeMeta).then(function(result) {
				var foundView = _.find(result.viewsList, function(view){ return view.id === result.viewData.id; });
				if (foundView) {
					$scope.draftView = foundView.isDraft;
				}

				angular.extend($scope, result);
				$scope.viewName = result.viewData.name;

				$scope.added = PivotMetaService.setUpAddedLevels(result.viewData.columns.concat(result.viewData.rows));
				$scope.membersList = PivotMetaService.generateMembersList(result.dimensions);
				$scope.determineTimeDisability($scope.added);
				$scope.addedFilters = PivotMetaService.getAddedFilters(result.viewData.filters, result.dimensions);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, result.dimensions, result.viewData);

				$scope.lockVariableDimension($scope.added);

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
				ManageAnalysisViewsService.defaultView($scope.cubeId, $scope.viewData.id, false);
				$scope.draftView = true;
				var draftView = angular.copy($scope.viewData);
				draftView.name = 'Draft - ' + draftView.name;
				draftView.isDraft = true;
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
				$scope.viewData.isDraft = false;
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
			var oldViewId = $scope.viewData.id;
			$scope.viewData = {name: 'Loading ...'};
			$rootScope.$broadcast(EVENTS.pivotViewChange, {});
			ManageAnalysisViewsService.getView(viewId, cubeId).then(function(view) {
				//undefault the previous view
				if(!!oldViewId && !$scope.draftView) {
					ManageAnalysisViewsService.defaultView(cubeId, oldViewId, false);
				}
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

				$scope.lockVariableDimension($scope.added);

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
			ManageAnalysisViewsService.renameView(view.id, cubeId, view).then(function(response) {
				view.isDraft = false;
				$scope.draftView = false;
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
			$scope.timeDisabled = PivotMetaService.determineTimeDisability($scope.dimensions, added);
		};

		// locks the last variable item in rows/columns if its aggregatable type is false
		$scope.lockVariableDimension = function(addedItems) {
			var variableDimension = _.find($scope.dimensions, function(dimension) {
				return dimension.hasOwnProperty('aggregatable') && dimension.aggregatable === false;
			}),
			addedVariableMembers = [];

			$scope.lockedDimensions = {};

			if(variableDimension) {
				_.each(variableDimension.members, function(member) {
					if(addedItems[member.label]) {
						addedVariableMembers.push(member.label);
					}
				});
			}

			if(addedVariableMembers.length === 1) {
				$scope.isVariableDimensionLocked = true;
				$scope.lockedDimensions[addedVariableMembers[0]] = true;
			} else {
				$scope.isVariableDimensionLocked = false;
			}
		};

		$scope.determineReadOnlyMode = function(currentState) {
			var states = CONFIG.application.models.ScenarioAnalytics.states;

			if(states.IN_PROGRESS.message === currentState) {
				if(!$scope.readOnlyMode) {
					$scope.readOnlyMode = true;
					$scope.disableSimulateButton(true);
					if(!!$scope.spread.setReadOnly) {
						$scope.spread.setReadOnly(true);
					}
				}
			} else {
				if($scope.readOnlyMode) {
					$scope.readOnlyMode = false;
					$scope.disableSimulateButton(false);
					if(!!$scope.spread.setReadOnly) {
						$scope.spread.setReadOnly(false);
					}
				}
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