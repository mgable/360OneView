'use strict';

angular.module('ThreeSixtyOneView')
    .controller('importCtrl', ['$scope', '$interval', 'DialogService', 'ImportResourceService', function($scope, $interval, DialogService, ImportResourceService) {
		$scope.importObj = {uploadProgress:0, fileSelected:false, invalidFile: false, importClicked: false, uploadFinished: false};
		$scope.selectedFile = {name: 'Select a file to import'};
		$scope.stopTime;

		$scope.changeFileName = function(event) {
			var files = event.target.files;
			if (files.length > 0) {
				$scope.selectedFile = files[0];
				$scope.importObj.fileSelected = true;
				$scope.importObj.invalidFile = !($scope.selectedFile.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

			} else {
				$scope.selectedFile = {name: 'Select a file to import'};
				$scope.importObj.fileSelected = false;
				$scope.importObj.invalidFile = false;
			}
			$scope.$apply(); 
		};

		$scope.initStatus = function() {
			$interval.cancel($scope.stopTime);
			$scope.importObj = {uploadProgress:0, fileSelected:false, invalidFile: false, importClicked: false, uploadFinished: false};
			$scope.selectedFile = {name: 'Select a file to import'};
		};

		$scope.uploadFile = function() {
			$scope.importObj.importClicked = true;
			
			var file = $scope.selectedFile;
			ImportResourceService.uploadFile(file.name, file).then(function(response) {
				$scope.stopTime = $interval(function(){
					ImportResourceService.checkStatus($scope.cubeId, 1).then(function(response){
						if (response.message == 'COMPLETED') {
							$interval.cancel($scope.stopTime);
							$scope.importObj.uploadFinished = true;
							$scope.importObj.uploadProgress = 100;
							//send out scenario call and refresh table
						} else {
							// support later
						}
					});	
				}, 10000);
			});;
		}
    }]);