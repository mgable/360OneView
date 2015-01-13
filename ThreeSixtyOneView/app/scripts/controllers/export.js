'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'PivotViewService', 'CubeService', '$interval', 'DialogService', 'PivotIntermediatesService', '$q',
    	function($scope, PivotViewService, CubeService, $interval, DialogService, PivotIntermediatesService, $q){

		$scope.deleteItem = function(index) {
			$scope.added[$scope.viewData[index].level.label] = false;
			$scope.viewData.splice(index, 1);
		}

		$scope.addItem = function(item) {
			var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
			$scope.viewData.push(newItem);
			$scope.added[item.label] = true;
		}

		$scope.replaceItem = function(selected, priorLabel) {
			$scope.added[priorLabel] = false;
			$scope.added[selected.label] = true;
			var match = _.find($scope.viewData, function(item) { return item.level.label.toUpperCase() == priorLabel.toUpperCase() });
			if (match) {
				var newItem = {dimension:{id:selected.dimensionId},hierarchy:{id:-1},level:{id:selected.levelId, label:selected.label}};
	            var index = _.indexOf($scope.viewData, match);
	            $scope.viewData.splice(index, 1, newItem);
	        }
		}

		$scope.prepareFile = function() {
			$scope.exportObj.exportClicked = true;
			$scope.stopTime = $interval(function(){
				if ($scope.exportObj.prepareProgress == 100) {
					$interval.cancel($scope.stopTime);
					$scope.exportObj.readyForDownload = true;
				} else {
					$scope.exportObj.prepareProgress++;
				}
			}, 100);
		}

		$scope.init = function() {
			$scope.viewData = [];
			$scope.dimensions = [];
			$scope.added = {};
			$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false};
			$scope.stopTime;

			$scope.addedFilters = {};
			$scope.categorizedValue = [];
			PivotIntermediatesService.initModel($scope.selectedScenarioElement.cubeMeta, $scope.cubeId)
				.then(function(result) {
					$scope.viewData = result.view.rows.concat(result.view.columns);
					$scope.added = PivotIntermediatesService.setUpAddedLevels(result.view.columns.concat(result.view.rows));
					$scope.dimensions = result.dimensions;
					
					$scope.addedFilters = PivotIntermediatesService.getAddedFilters(result.view.filters, result.dimensions);
					$scope.categorizedValue = PivotIntermediatesService.generateCategorizeValueStructure($scope.addedFilters, result.dimensions, result.view);
				});
		};
		$scope.init();

		// open/dismiss filters selection modal
		$scope.filtersModal = function(category) {
			var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
				{cat: category, addedFilters: $scope.addedFilters, viewData: $scope.viewData, dimensions: $scope.dimensions},
				{windowSize: 'lg', windowClass: 'filtersSelectionModal'});

			dialog.result.then(function(data) {
				$scope.addedFilters = data;
				$scope.categorizedValue = PivotIntermediatesService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.viewData);
			});
		};

		$scope.initStatus = function() {
			$interval.cancel($scope.stopTime);
			$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false};
		}

    }]);