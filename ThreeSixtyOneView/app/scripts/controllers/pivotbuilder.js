'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView')
	.controller('PivotBuilderCtrl', ['$scope', '$rootScope', 'EVENTS', '$timeout', '$q', 'ManageAnalysisViewsService', 'DialogService',
	
	function ($scope, $rootScope, EVENTS, $timeout, $q, ManageAnalysisViewsService, DialogService) {

	var init = function() {
			$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];
			$scope.saveAs = false;
			$scope.rename = false;

			$scope.dragOptions = {
				itemMoved: function() {
					$scope.saveDraftView();
				},
				orderChanged: function() {
					$scope.saveDraftView();
				},
				dragStart: function() {
					$scope.isDragging = true;
				},
				dragEnd: function() {
					$scope.isDragging = false;
				},
				containment: '#dragDropArea'
			};
		},	
		renameView = function(cubeId, view) { // rename the view
			ManageAnalysisViewsService.renameView(view.id, cubeId, view.name).then(function(response) {
				_.each($scope.viewsList, function(item) {
					if(item.id === response.id) {
						item.name = response.name;
					}
				});
			});
		},
		deleteView = function(cubeId, viewId) {
            ManageAnalysisViewsService.deleteView(viewId, cubeId).then(function() {
                $scope.viewsList = _.reject($scope.viewsList, function(view) { return view.id === viewId; });
                $scope.draftView = false;
            });
        },
        createView = function(cubeId, view, viewList) {
            var i;
            $scope.viewsList = viewList;
            // remove conflicting elements from the view
            view.id = null;
            for(i = 0; i < view.filters.length; i++) {
                view.filters[i].id = null;
            }

            return ManageAnalysisViewsService.createView(view, cubeId).then(function(view) {
                $scope.viewData = angular.copy(view);
                $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                $scope.viewsList.unshift(view);
                $scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
                return view;
            });
        },
        updateView = function(cubeId, view) {
            // filter ids should be set to zero before update
            _.each(view.filters, function(filter) {
                filter.id = 0;
            });
            return ManageAnalysisViewsService.updateView(view, cubeId).then(function(response) {
                return response;
            });
        };

		// delete an item from column/row
		$scope.deleteItem =  function(index, element) {
			$scope.added[$scope.viewData[element][index].level.label] = false;
			$scope.viewData[element].splice(index, 1);

			$scope.saveDraftView();
		};

		// add item to row/column
		$scope.addItem = function(item, element) {
			var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
			$scope.viewData[element].push(newItem);
			$scope.added[item.label] = true;

			$scope.saveDraftView();
		};

		// replace the draggable item on the screen
		$scope.replaceItem = function(selected, priorLabel, element) {
			$scope.added[priorLabel] = false;
			$scope.added[selected.label] = true;
			var match = _.find($scope.viewData[element], function(item) { return item.level.label === priorLabel; });
			if (match) {
				var newItem = {dimension:{id:selected.dimensionId},hierarchy:{id:-1},level:{id:selected.levelId, label:selected.label}};
	            var index = _.indexOf($scope.viewData[element], match);
	            $scope.viewData[element].splice(index, 1, newItem);
	        }

			$scope.saveDraftView();
		};

		// open/dismiss filters selection modal
		$scope.filtersModal = function(category) {
			var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
				{cat: category, addedFilters: $scope.addedFilters, viewData: $scope.viewData.rows.concat($scope.viewData.columns), dimensions: $scope.dimensions},
				{windowSize: 'lg', windowClass: 'filtersSelectionModal'});

			dialog.result.then(function(data) {
				$scope.updateFilterValues(data);
				
				$scope.saveDraftView();
			});
		};

		// update filter values after any change made to them in the filters modal
        $scope.updateFilterValues = function(newFilterData) {
            $scope.addedFilters = newFilterData;

            $scope.viewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.viewData.filters);
            $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.views.currentView);
        };

		// load a view from the backend
        $scope.loadView = function(cubeId, viewId) {
            ManageAnalysisViewsService.getView(viewId, cubeId).then(function(view) {
                // remove the draft view if one exists and is not selected
                if($scope.draftView) {
                    var draftId;

                    _.each($scope.viewsList, function(listItem) {
                        if(listItem.name.substring(0, 8) === 'Draft - ') {
                            draftId = listItem.id;
                        }
                    });

                    if(viewId !== draftId) {
                        deleteView($scope.cubeId, draftId);
                    }
                }

                $scope.views.currentView = view;
                $scope.viewData = view;
                $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                $scope.membersList = PivotMetaService.generateMembersList($scope.dimensions);
                $scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
                $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, view);

                $scope.loadPivotTable($scope.selectedScenarioElement, view);
            });
        };

		// returns list of all the views in the current cube
		// DUPE
		$scope.getViewsList = function() {
			return $scope.viewsList;
		};

		// get list of the dimensions in the current cube
		$scope.getDimensions = function() {
			return $scope.dimensions;
		};

		// save the draft view
        $scope.saveDraftView = function() {
            if(!$scope.draftView) {
                $scope.draftView = true;
                var draftView = angular.copy($scope.viewData);
                draftView.name = 'Draft - ' + draftView.name;
                createView($scope.cubeId, draftView, $scope.viewsList).then(function() {
                    $scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
                });
            } else {
                updateView($scope.cubeId, $scope.viewData).then(function() {
                    $scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
                });
            }
        };

        // save the changes in the current view
        $scope.saveView = function() {
            if($scope.draftView) {
                var originalViewName = $scope.viewData.name.substring(8);
                var originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;
                var draftViewId = $scope.viewData.id;

                $scope.viewData.name = originalViewName;
                $scope.viewData.id = originalViewId;
                updateView($scope.cubeId, $scope.viewData).then(function(view) {
                    $scope.viewData = view;
                    $scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                });
                deleteView($scope.cubeId, draftViewId);
            }
        };

		// open the modal for the list of all views
		//DUPE
		$scope.openAllViewsModal = function() {
			var dialog = DialogService.openLightbox('views/modal/all_views.tpl.html', 'AllViewsCtrl',
				{viewsList: $scope.viewsList, selectedViewId: $scope.viewData.id, e2e: $scope.e2e},
				{windowSize: 'lg', windowClass: 'AllViewsModal'});

			dialog.result.then(function(data) {
				$scope.loadView($scope.cubeId, data);
			});
		};

		// returns element titles in the view: rows and columns
		$scope.getPivotBuilderItems = function() {
			return $scope.pivotBuilderItems;
		};

		// returns items in a view element
		$scope.getViewData = function(element) {
			return $scope.viewData[element];
		};

		// reset the view to the last saved state
		// DUPE
		$scope.revertView = function() {
			if($scope.draftView) {
				var originalViewName = $scope.viewData.name.substring(8),
					originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;

				// load view automatically deletes draft view if a non-draft is loaded
				$scope.loadView($scope.cubeId, originalViewId);
			}
		};

		// start save as process
		$scope.startSaveAs = function() {
			$scope.saveAsName = $scope.viewData.name;
			$scope.saveAs = true;
			$scope.rename = false;
		};

		// submit save as process
		$scope.submitSaveAs = function(evt) {
			if (evt){
				evt.stopPropagation();
			}
			$scope.viewData.name = $scope.saveAsName;

			if($scope.rename) { // if submitting
				$scope.draftView = false;
				renameView($scope.cubeId, $scope.viewData);
			} else if (!$scope.rename) {
				$scope.viewData.id = null;
				$scope.createView($scope.cubeId, $scope.viewData, $scope.viewsList);
			}

			$scope.cancelSaveAs();
		};

		// cancel the save as process
		$scope.cancelSaveAs = function(evt) {
			console.info(evt);
			// stop the click from bubbling up
			if (evt && evt.stopPropagation){
				evt.stopPropagation();
			}
			$scope.rename = false;
			$scope.saveAs = false;

			console.info("hey saveas is");
			console.info($scope.saveAs);
		};

		// start the rename process
		$scope.startRename = function() {
			$scope.saveAsName = $scope.viewData.name;
			$scope.saveAs = true;
			$scope.rename = true;
		};

		// show table/filters section and update height for pivot table
		$scope.showTable = function(filtersVisible){
			$scope.isFiltersVisible = filtersVisible;
			$scope.heightChanged();
		};

		// get height of the pivot table builder and broadcast is as an event for adjusting pivot table height
		$scope.heightChanged = function() {
			$timeout(function() {
				$scope.pivotBuilderHeight = angular.element.find('#pivotBuilder')[0].offsetHeight;
				$rootScope.$broadcast(EVENTS.heightChanged, $scope.pivotBuilderHeight);
	        }, 400);
		};

		$scope.$on(EVENTS.tabClosed, function(){
			$scope.$apply($scope.cancelSaveAs);
		});

		init();
	}]);