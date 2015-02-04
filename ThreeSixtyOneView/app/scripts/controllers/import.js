'use strict';

angular.module('ThreeSixtyOneView')
    .controller('importCtrl', ['$scope', '$interval', 'ImportResourceService', '$timeout', function($scope, $interval, ImportResourceService, $timeout) {
		var init = function() {
			$scope.selectedFile = {};
			$scope.selectedFileName = 'Select a file to import';
			$scope.isFileSelected = false;
			$scope.cancelButtonLabel = 'Cancel';
		};

		init();

		$scope.newFileSelected = function(event) {
			var files = event.target.files;
			if (files.length > 0) {
				$scope.selectedFile = files[0];
				$scope.selectedFileName = $scope.selectedFile.name;
				$scope.isFileSelected = true;
				$scope.isFileInvalid = !($scope.selectedFile.type.toLowerCase() === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

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
				if(response.status === 'IMPORT_REQUEST_ACCEPTED') {
					$scope.statusMessage = 'Upload successful.';
					$scope.checkStatus();
				} else if (response.status === 'EMPTY_FILE_IMPORTED') {
					$scope.statusMessage = 'Uploaded file is empty.';
					$scope.isImportFailed = true;
				} else if (response.status === 'FILE_UPLOAD_FAILED') {
					$scope.statusMessage = 'File upload failed, please try again.';
					$scope.isImportFailed = true;
				} else {
					console.log(response);
				}
			});
		};

		$scope.checkStatus = function() {
			if($scope.isImportStarted && !$scope.isImportCompleted) {
				ImportResourceService.checkStatus($scope.selectedScenarioElement.id).then(function(response) {
					if(response.status === 'COMPLETED') {
						$scope.statusMessage = 'Import completed.';
						$scope.isImportCompleted = true;
						$scope.cancelButtonLabel = 'Reset';
						return;
					} else if(response.status === 'INIT') {
						$scope.statusMessage = 'Initializing the import process ...';
					} else if(response.status === 'IN_PROGRESS') {
						$scope.statusMessage = 'Processing the imported file ...';
					} else if (response.status === 'FAILED') {
						$scope.statusMessage = 'Processing the uploaded file failed, please try again.';
						$scope.isImportFailed = true;
						return;
					} else {
						console.log(response);
					}
					$scope.statusPromise = $timeout(function() {
						$scope.checkStatus();
					}, 2000);
				});
			}
		};

		$scope.cancelUpload = function() {
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
		};
    }]);