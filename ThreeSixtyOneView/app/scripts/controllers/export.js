'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'PivotViewService', 'ExportService', '$interval', 'DialogService', 'PivotMetaService', '$q',
    	function($scope, PivotViewService, ExportService, $interval, DialogService, PivotMetaService, $q){

		$scope.deleteItem = function(index) {
			$scope.added[$scope.viewDataExport[index].level.label] = false;
			$scope.viewDataExport.splice(index, 1);
		};

		$scope.addItem = function(item) {
			var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
			$scope.viewDataExport.push(newItem);
			$scope.added[item.label] = true;
		};

		$scope.replaceItem = function(selected, priorLabel) {
			$scope.added[priorLabel] = false;
			$scope.added[selected.label] = true;
			var match = _.find($scope.viewDataExport, function(item) { return item.level.label.toUpperCase() == priorLabel.toUpperCase() });
			if (match) {
				var newItem = {dimension:{id:selected.dimensionId},hierarchy:{id:-1},level:{id:selected.levelId, label:selected.label}};
	            var index = _.indexOf($scope.viewDataExport, match);
	            $scope.viewDataExport.splice(index, 1, newItem);
	        }
		};

		$scope.prepareFile = function() {
			$scope.exportObj.exportClicked = true;

			ExportService.prepareFile({
				rows:$scope.viewDataExport,
				columns:[],
				filters:$scope.viewData.filters,
				auditInfo:$scope.viewData.auditInfo
			}, $scope.cubeId, 1)
			.then(function(response) {
				$scope.stopTime = $interval(function(){
					ExportService.checkStatus($scope.cubeId, 1).then(function(pollingResponse){
						if (pollingResponse.message == "COMPLETED") {
							$interval.cancel($scope.stopTime);
							$scope.exportObj.readyForDownload = true;
							$scope.exportObj.prepareProgress = 100;
						} else {
							// support later
						}
					});	
				}, 10000);
			});
		};

		var init = function() {
			$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false, exceedLimit:false};
			$scope.stopTime;

			$scope.dragOptions = {
				dragStart: function() {
					$scope.isDragging = true;
				},
				dragEnd: function() {
					$scope.isDragging = false;
				}
				// containment: '.pbSec'
			};
		};
		init();

		// open/dismiss filters selection modal
		$scope.filtersModal = function(category) {
			var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
				{cat: category, addedFilters: $scope.addedFilters, viewData: $scope.viewDataExport, dimensions: $scope.dimensions},
				{windowSize: 'lg', windowClass: 'filtersSelectionModal'});

			dialog.result.then(function(data) {
				$scope.addedFilters = data;
				$scope.viewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.viewData.filters);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.viewDataExport);
			});
		};

		$scope.initStatus = function() {
			$interval.cancel($scope.stopTime);
			$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false, exceedLimit:false};
		};

		// get list of the dimensions in the current cube
		$scope.getDimensions = function() {
			return $scope.dimensions;
		};

		// get all added rows and columns in the current view
		$scope.getViewDataExport = function() {
			return $scope.viewDataExport;
		};

    }]);