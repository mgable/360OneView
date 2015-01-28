'use strict';

angular.module('ThreeSixtyOneView').controller('exportCtrl', ['$scope', 'ExportResourceService', '$interval', 'DialogService', 'PivotMetaService',
    function($scope, ExportResourceService, $interval, DialogService, PivotMetaService) {
    	var init = function() {
    		$scope.exportViewData = {};
    		$scope.addedExportFilters = {};
    		$scope.categorizedExportValue = [];

    		$scope.$watch('viewData', function() {
    			setupExportView($scope.viewData);
    		});

    		$scope.dragOptions = {
				dragStart: function() {
					$scope.isDragging = true;
				},
				dragEnd: function() {
					$scope.isDragging = false;
				}
				// containment: '.pbSec'
			};
    	}, setupExportView = function(originalView) {
    		if(!!originalView) {
	    		$scope.exportViewData = angular.copy(originalView);
	    		$scope.exportViewData.rows = $scope.viewData.rows.concat($scope.viewData.columns);
	    		$scope.exportViewData.columns = [];
	    		setupExportViewFilters();
	    	}
    	}, setupExportViewFilters = function() {
    		if(!!$scope.addedFilters && !!$scope.dimensions) {
	    		$scope.addedExportFilters = angular.copy($scope.addedFilters);
				$scope.exportViewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.exportViewData.filters);
				$scope.categorizedExportValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.exportViewData);
			}
    	};

		$scope.deleteItem = function(index) {
			$scope.added[$scope.exportViewData.rows[index].level.label] = false;
			$scope.exportViewData.rows.splice(index, 1);
		};

		$scope.addItem = function(item) {
			var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
			$scope.exportViewData.rows.push(newItem);
			$scope.added[item.label] = true;
		};

		$scope.replaceItem = function(selected, priorLabel) {
			$scope.added[priorLabel] = false;
			$scope.added[selected.label] = true;
			var match = _.find($scope.exportViewData.rows, function(item) { return item.level.label.toLowerCase() === priorLabel.toLowerCase() });
			if (match) {
				var newItem = {dimension:{id:selected.dimensionId},hierarchy:{id:-1},level:{id:selected.levelId, label:selected.label}};
	            var index = _.indexOf($scope.exportViewData.rows, match);
	            $scope.exportViewData.rows.splice(index, 1, newItem);
	        }
		};

		// open/dismiss filters selection modal
		$scope.filtersModal = function(category) {
			var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
				{cat: category, addedFilters: $scope.addedExportFilters, viewData: $scope.exportViewData.rows, dimensions: $scope.dimensions},
				{windowSize: 'lg', windowClass: 'filtersSelectionModal'});

			dialog.result.then(function(data) {
				$scope.addedExportFilters = data;
				$scope.exportViewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedExportFilters, $scope.membersList, $scope.exportViewData.filters);
				$scope.categorizedExportValue = PivotMetaService.generateCategorizeValueStructure($scope.addedExportFilters, $scope.dimensions, $scope.exportViewData);
			});
		};

		// get list of the dimensions in the current cube
		$scope.getDimensions = function() {
			return $scope.dimensions;
		};

		// get all added rows and columns in the current view
		$scope.getExportViewDataRows = function() {
			return $scope.exportViewData.rows;
		};

		// start the export process
		$scope.requestExport = function() {
			$scope.exportInProgress = true;
			$scope.downloadReady = false;
			$scope.progressPercentage = 0;

			console.log($scope.selectedScenarioElement.id);
			console.log($scope.exportViewData);
			ExportResourceService.requestExport($scope.selectedScenarioElement.id, $scope.exportViewData).then(function(response) {
				console.log(response);
			});

			$scope.progressPromise = $interval(function() {
				if($scope.progressPercentage >= 100) {
					$scope.downloadReady = true;
				}
				$scope.progressPercentage += 20;
			}, 1000, 6);
		};

		// cancel the export process
		$scope.cancelExport = function() {
			$interval.cancel($scope.progressPromise);
			$scope.exportInProgress = false;
			$scope.downloadReady = false;
		};

		init();
}]);