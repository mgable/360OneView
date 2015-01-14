'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'PivotViewService', 'CubeService', '$interval', 'DialogService', 'PivotMetaService', '$q',
    	function($scope, PivotViewService, CubeService, $interval, DialogService, PivotMetaService, $q){

		$scope.deleteItem = function(index) {
			$scope.added[$scope.viewDataExport[index].level.label] = false;
			$scope.viewDataExport.splice(index, 1);
		}

		$scope.addItem = function(item) {
			var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
			$scope.viewDataExport.push(newItem);
			$scope.added[item.label] = true;
		}

		$scope.replaceItem = function(selected, priorLabel) {
			$scope.added[priorLabel] = false;
			$scope.added[selected.label] = true;
			var match = _.find($scope.viewDataExport, function(item) { return item.level.label.toUpperCase() == priorLabel.toUpperCase() });
			if (match) {
				var newItem = {dimension:{id:selected.dimensionId},hierarchy:{id:-1},level:{id:selected.levelId, label:selected.label}};
	            var index = _.indexOf($scope.viewDataExport, match);
	            $scope.viewDataExport.splice(index, 1, newItem);
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

		var init = function() {
			$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false, exceedLimit:false};
			$scope.stopTime;
		};
		init();

		// open/dismiss filters selection modal
		$scope.filtersModal = function(category) {
			var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
				{cat: category, addedFilters: $scope.addedFilters, viewData: $scope.viewDataExport, dimensions: $scope.dimensions},
				{windowSize: 'lg', windowClass: 'filtersSelectionModal'});

			dialog.result.then(function(data) {
				$scope.addedFilters = data;
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.viewDataExport);
			});
		};

		$scope.initStatus = function() {
			$interval.cancel($scope.stopTime);
			$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false, exceedLimit:false};
		}

    }]);