'use strict';

angular.module('ThreeSixtyOneView')
    .controller("importCtrl", ["$scope", '$interval', 'DialogService', 'ImportService', function($scope, $interval, DialogService, ImportService){
		$scope.importObj = {uploadProgress:0, fileSelected:false, invalidFile: false, importClicked: false, uploadFinished: false};
		$scope.selectedFile = {name: "Select a file to import"};
		$scope.stopTime;

		$scope.changeFileName = function(files) {
			if (files.length > 0) {
				$scope.selectedFile = files[0];
				$scope.importObj.fileSelected = true;
				$scope.importObj.invalidFile = !($scope.selectedFile.type == "application/vnd.ms-excel");

			} else {
				$scope.selectedFile = {name: "Select a file to import"};
				$scope.importObj.fileSelected = false;
				$scope.importObj.invalidFile = false;
			}

			$scope.$apply(); 
		}

		$scope.initStatus = function() {
			$interval.cancel($scope.stopTime);
			$scope.importObj = {uploadProgress:0, fileSelected:false, invalidFile: false, importClicked: false, uploadFinished: false};
			$scope.selectedFile = {name: "Select a file to import"};
		}

		$scope.uploadFile = function() {
			$scope.importObj.importClicked = true;
			
			var file = $scope.selectedFile;
			ImportService.uploadFile(file.name, file).then(function(response) {
				$scope.stopTime = $interval(function(){
					ImportService.checkStatus($scope.cubeId, 1).then(function(response){
						if (response == 100) {
							$interval.cancel($scope.stopTime);
							$scope.importObj.uploadFinished = true;
						} else {
							$scope.importObj.uploadProgress = response;
						}
					});	
				}, 10000);
			});
		}
    }])
    //ng-model and ng-change are not supported for input[file]
    .directive("fileread", [function () {
	    return {
	        link: function (scope, element, attributes) {
	            element.bind("change", function (changeEvent) {
	            	scope.changeFileName(changeEvent.target.files);
	            });
	        }
	    }
	}]);