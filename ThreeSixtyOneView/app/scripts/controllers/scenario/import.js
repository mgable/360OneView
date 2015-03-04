'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ImportCtrl', ['$scope', '$interval', 'ImportResourceService', '$timeout', 'CONFIG', function($scope, $interval, ImportResourceService, $timeout, CONFIG) {
		var init = function() {
			$scope.resetUploadForm();
		},	importModel = CONFIG.application.models.ImportModel;

		$scope.newFileSelected = function(event) {
			var files = event.target.files;
			if (files.length > 0) {
				$scope.selectedFile = files[0];
				$scope.selectedFileName = $scope.selectedFile.name;
				$scope.isFileSelected = true;
				$scope.isFileInvalid = $scope.selectedFile.type.toLowerCase() !== importModel.acceptedFileType;

			} else {
				$scope.selectedFile = {};
				$scope.selectedFileName = 'Select a file to import';
				$scope.isFileSelected = false;
				$scope.isFileInvalid = false;
			}
			$scope.$apply();
		};

		$scope.startUpload = function() {
			$scope.isImportStarted = true;
			$scope.isImportCompleted = false;
			$scope.statusMessage = 'Uploading file ...';

			ImportResourceService.uploadFile($scope.selectedScenarioElement.id, $scope.selectedFile).then(function(response) {
				switch(response.status) {
					case importModel.uploadStates.success.message:
						$scope.statusMessage = importModel.uploadStates.success.description;
						$timeout(function() {
							$scope.checkStatus();
						}, 1000);
						break;
					case importModel.uploadStates.empty.message:
						$scope.statusMessage = importModel.uploadStates.empty.description;
						$scope.cancelButtonLabel = 'Reset';
						$scope.isImportFailed = true;
						break;
					case importModel.uploadStates.fail.message:
						$scope.statusMessage = importModel.uploadStates.fail.description;
						$scope.isImportFailed = true;
						break;
					default:
						console.log(response);
						break;

				}
			});
		};

		$scope.checkStatus = function() {
			if($scope.isImportStarted && !$scope.isImportCompleted) {
				ImportResourceService.checkStatus($scope.selectedScenarioElement.id).then(function(response) {
					switch(response.status) {
						case importModel.importStates.success.message:
							$scope.statusMessage = importModel.importStates.success.description;
							$scope.isImportCompleted = true;
							$scope.cancelButtonLabel = 'Reset';
							$scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
							return;
							break;
						case importModel.importStates.init.message:
							$scope.statusMessage = importModel.importStates.init.description;
							break;
						case importModel.importStates.inprogress.message:
							$scope.statusMessage = importModel.importStates.inprogress.description;
							break;
						case importModel.importStates.fail.message:
							$scope.statusMessage = importModel.importStates.fail.description;
							$scope.cancelButtonLabel = 'Reset';
							$scope.isImportFailed = true;
							return;
							break;
						default:
							console.log(response);
					}

					$scope.statusPromise = $timeout(function() {
						$scope.checkStatus();
					}, 2000);
				});
			}
		};

		$scope.resetUploadForm = function() {
			$timeout.cancel($scope.statusPromise);
			$scope.selectedFile = {};
			$scope.selectedFileName = 'Select a file to import';
			$scope.cancelButtonLabel = 'Cancel';
			$scope.isFileSelected = false;
			$scope.isImportStarted = false;
			$scope.isImportCompleted = false;
			$scope.isImportFailed = false;
			$scope.isFileInvalid = false;
			$scope.statusMessage = '';
			if(!!document.getElementById('fileInput')) {
				document.getElementById('fileInput').value = '';
			}
		};

		init();
    }]);