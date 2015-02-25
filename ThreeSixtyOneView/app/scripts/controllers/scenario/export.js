'use strict';

angular.module('ThreeSixtyOneView').controller('exportCtrl', ['$scope', 'ExportResourceService', '$timeout', 'DialogService', 'PivotMetaService', 'CONFIG',
	function($scope, ExportResourceService, $timeout, DialogService, PivotMetaService, CONFIG) {
		var init = function() {
			$scope.exportViewData = {}; // contains the view data modified for export tab
			$scope.addedExportFilters = {}; // contains the added filter values for the export view
			$scope.categorizedExportValue = []; // categorized filter values based on selected filters for the export tab
			$scope.exportAddedDimensions = {}; // contains the added dimensions for the export view
			$scope.isExportInProgress = false;

			var unwatchViewData = $scope.$watch('viewData', function() {
				$scope.setupExportView();
			});

			$scope.$on('$destroy', function() {
				unwatchViewData();
			});

			$scope.dragOptions = {
				dragStart: function() {
					$scope.isDragging = true;
				},
				dragEnd: function() {
					$scope.isDragging = false;
				},
				containment: '#exportDragArea'
			};
		}, setupExportViewFilters = function() {
			if(!!$scope.addedFilters && !!$scope.dimensions) {
				$scope.addedExportFilters = angular.copy($scope.addedFilters);
				$scope.exportViewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.exportViewData.filters);
				$scope.categorizedExportValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.exportViewData);
				$scope.getLockedDimensions($scope.dimensions, $scope.membersList, $scope.categorizedExportValue);
			}
		}, trackProgress = function() {
			ExportResourceService.checkStatus($scope.exportElementId).then(function(response) {
				if(response.status === exportModel.processingStates.init.message) {
					$scope.statusMessage = exportModel.processingStates.init.description;
				} else if(response.status === exportModel.processingStates.complete.message) {
					$scope.isDownloadReady = true;
					$scope.statusMessage = exportModel.processingStates.complete.description;
					$scope.downloadFile();
				} else if(response.status === exportModel.processingStates.download.message) {
					$scope.statusMessage = exportModel.processingStates.download.description;
					$scope.isDownloadCompleted = true;
					$scope.cancelExport();
					return;
				} else if(response.status === exportModel.processingStates.fail.message) {
					$scope.statusMessage = exportModel.processingStates.fail.description;
					$scope.isExportFailed = true;
					$scope.cancelExport();
					return;
				} else if(response.status === exportModel.processingStates.inprogress.message) {
					$scope.statusMessage = exportModel.processingStates.inprogress.description;
				} else {
					console.log(response);
				}
				
				progressPromise = $timeout(function() {
					trackProgress();
				}, 2000);
			});
		}, exportModel = CONFIG.application.models.ExportModel,
		progressPromise;

		$scope.setupExportView = function() {
			$scope.exportViewData = angular.copy($scope.viewData);
			$scope.exportViewData.rows = $scope.viewData.rows.concat($scope.viewData.columns);
			$scope.exportViewData.columns = [];
			$scope.exportAddedDimensions = angular.copy($scope.added);
			setupExportViewFilters();
		};

		$scope.deleteItem = function(index) {
			$scope.exportAddedDimensions[$scope.exportViewData.rows[index].level.label] = false;
			$scope.exportViewData.rows.splice(index, 1);
		};

		$scope.addItem = function(item) {
			var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
			$scope.exportViewData.rows.push(newItem);
			$scope.exportAddedDimensions[item.label] = true;
		};

		$scope.replaceItem = function(selected, priorLabel) {
			$scope.exportAddedDimensions[priorLabel] = false;
			$scope.exportAddedDimensions[selected.label] = true;
			var match = _.find($scope.exportViewData.rows, function(item) { return item.level.label.toLowerCase() === priorLabel.toLowerCase(); });
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
				{windowSize: 'lg', windowClass: 'filters-modal'});

			dialog.result.then(function(data) {
				$scope.addedExportFilters = data;
				$scope.exportViewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedExportFilters, $scope.membersList, $scope.exportViewData.filters);
				$scope.categorizedExportValue = PivotMetaService.generateCategorizeValueStructure($scope.addedExportFilters, $scope.dimensions, $scope.exportViewData);
				$scope.getLockedDimensions($scope.dimensions, $scope.membersList, $scope.categorizedExportValue);
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

		// get dimensions that cannot be removed due to filters applied on them
		$scope.getLockedDimensions = function(dimensions, membersList, filters) {
			$scope.lockedDimensions = {};
			_.each(dimensions, function(dimension, dimensionIndex) {
				if(filters[dimensionIndex].selected < filters[dimensionIndex].total) {
					var level = _.findWhere(dimension.members, {levelId: membersList[dimension.id][filters[dimensionIndex].label[0]].levelId});
					if(!$scope.exportAddedDimensions[level.label]) {
						$scope.addItem(level);
					}
					$scope.lockedDimensions[level.label] = true;
				}
			});
		};

		// start the export process
		$scope.requestExport = function() {
			$scope.isExportInProgress = true;
			$scope.isDownloadReady = false;
			$scope.progressPercentage = 0;

			$scope.exportElementId = $scope.selectedScenarioElement.id;
			$scope.exportElementName = $scope.selectedScenarioElement.name;

			ExportResourceService.requestExport($scope.exportElementId, $scope.exportViewData).then(function(response) {
				if(response.status === exportModel.exportStates.success.message) {
					$scope.statusMessage = exportModel.exportStates.success.description;
					$scope.isExportFailed = false;
					$scope.isDownloadCompleted = false;
					$timeout(function() {
						trackProgress();
					}, 1000);
				} else {
					console.log(response);
				}
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
			$timeout.cancel(progressPromise);
			$scope.statusMessage = '';
			$scope.isExportInProgress = false;
			$scope.isDownloadReady = false;
		};

		init();
}]);