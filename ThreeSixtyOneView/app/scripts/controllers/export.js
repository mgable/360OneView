'use strict';

angular.module('ThreeSixtyOneView').controller('exportCtrl', ['$scope', 'ExportResourceService', '$timeout', 'DialogService', 'PivotMetaService',
    function($scope, ExportResourceService, $timeout, DialogService, PivotMetaService) {
    	var init = function() {
    		$scope.exportViewData = {};
    		$scope.addedExportFilters = {};
    		$scope.categorizedExportValue = [];
    		$scope.exportAdded = {};

    		$scope.$watch('viewData', function() {
    			$scope.setupExportView();
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
    	}, setupExportViewFilters = function() {
    		if(!!$scope.addedFilters && !!$scope.dimensions) {
	    		$scope.addedExportFilters = angular.copy($scope.addedFilters);
				$scope.exportViewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.exportViewData.filters);
				$scope.categorizedExportValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.exportViewData);
			}
    	};

    	$scope.setupExportView = function() {
	    		$scope.exportViewData = angular.copy($scope.viewData);
	    		$scope.exportViewData.rows = $scope.viewData.rows.concat($scope.viewData.columns);
	    		$scope.exportViewData.columns = [];
	    		$scope.exportAdded = angular.copy($scope.added);
	    		setupExportViewFilters();
    	};

		$scope.deleteItem = function(index) {
			$scope.exportAdded[$scope.exportViewData.rows[index].level.label] = false;
			$scope.exportViewData.rows.splice(index, 1);
		};

		$scope.addItem = function(item) {
			var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
			$scope.exportViewData.rows.push(newItem);
			$scope.exportAdded[item.label] = true;
		};

		$scope.replaceItem = function(selected, priorLabel) {
			$scope.exportAdded[priorLabel] = false;
			$scope.exportAdded[selected.label] = true;
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
			$scope.isExportInProgress = true;
			$scope.isDownloadReady = false;
			$scope.progressPercentage = 0;

			$scope.exportElementId = $scope.selectedScenarioElement.id;
			$scope.exportElementName = $scope.selectedScenarioElement.name;

			// console.log($scope.exportElementId);
			// console.log($scope.exportViewData);
			ExportResourceService.requestExport($scope.exportElementId, $scope.exportViewData).then(function(response) {
				if(response.status === 'EXPORT_REQUEST_ACCEPTED') {
					$scope.trackProgress();
				} else {
					console.log(response);
				}
			});
		};

		// tracks the export preparation progress and request download upon completion
		$scope.trackProgress = function() {
			$scope.statusMessage = 'Initializing the export process ...';
			ExportResourceService.checkStatus($scope.exportElementId).then(function(response) {
				if(response.status === 'INIT') {
					$scope.statusMessage = 'Initializing the export process ...';
				} else if(response.status === 'COMPLETED') {
					$scope.isDownloadReady = true;
					$scope.statusMessage = 'Export process completed, initializing the download process ...';
					$scope.downloadFile();
				} else if(response.status === 'DOWNLOADED') {
					$scope.statusMessage = 'File downloaded successfully.';
					$scope.isDownloadCompleted = true;
					$scope.cancelExport();
					return;
				} else if(response.status === 'FAILED') {
					$scope.statusMessage = 'Export failed, please try again.';
					return;
				} else {
					console.log(response);
				}
				$scope.progressPromise = $timeout(function() {
					$scope.trackProgress();
				}, 2000);
			});
		};

		// download the prepared export file
		$scope.downloadFile = function() {
			ExportResourceService.downloadFile($scope.exportElementId).then(function(response) {
				var a = angular.element('<a>').css('display', 'none').attr('href',response).attr('id','exportLink');//.attr('download',$scope.exportElementName+'.xlsx');
				$('body').append(a);
				$timeout(function() {
					document.getElementById('exportLink').click();
					a.remove();
				}, 100);
			});
			$scope.cancelExport();
		};

		// cancel the export process
		$scope.cancelExport = function() {
			$timeout.cancel($scope.progressPromise);
			$scope.statusMessage = '';
			$scope.isExportInProgress = false;
			$scope.isDownloadReady = false;
			$scope.isDownloadCompleted = false;
		};

		init();
}]);