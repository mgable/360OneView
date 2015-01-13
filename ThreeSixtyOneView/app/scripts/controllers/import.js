'use strict';

angular.module('ThreeSixtyOneView')
    .controller("importCtrl", ["$scope", '$interval', 'DialogService', function($scope, $interval, DialogService){
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
			$scope.stopTime = $interval(function(){
				if ($scope.importObj.uploadProgress == 100) {
					$interval.cancel($scope.stopTime);
					$scope.importObj.uploadFinished = true;
				} else {
					$scope.importObj.uploadProgress++;
				}
			}, 100);
			// var file = $scope.selectedFile;
			// $.ajax({
			// 	type: 'post',
			// 	url: 'http://127.0.0.1:9001/?name=' + file.name,
			// 	data: file,
			// 	success: function () {
			// 		$scope.importObj.uploadFinished = true;
			// 	},
			// 	xhrFields: {
			// 	  // add listener to XMLHTTPRequest object directly for progress (jquery doesn't have this yet)
			// 	  onprogress: function (progress) {
			// 	    $scope.importObj.uploadProgress = Math.floor((progress.total / progress.totalSize) * 100);
			// 	  }
			// 	},
			// 	processData: false,
			// 	contentType: file.type
			// });
		}
    }])
    //ng-model and ng-change are not supported for input[file]
    .directive("fileread", [function () {
	    return {
	        link: function (scope, element, attributes) {
	            element.bind("change", function (changeEvent) {
	            	scope.$parent.changeFileName(changeEvent.target.files);
	            });
	        }
	    }
	}]);