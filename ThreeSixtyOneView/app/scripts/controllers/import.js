'use strict';

angular.module('ThreeSixtyOneView')
    .controller("importCtrl", ["$scope", '$interval', 'DialogService', function($scope, $interval, DialogService){
		$scope.importObj = {prepareProgress:0, fileSelected:false, invalidFile: false, importClicked: false, uploadFinished: false};
		$scope.selectedFile = "";
		$scope.stopTime;

		$scope.changeFileName = function(name) {
			if (name) {
				$scope.selectedFile = name;
			}

			// if valid
			$scope.importObj.fileSelected = true;
			$scope.importObj.invalidFile = false;
			// else
			// $scope.importObj.fileSelected = false;
			// $scope.importObj.invalidFile = true;
			$scope.$apply(); 
		}

		$scope.collapseTab = function() {

		}

		$scope.initStatus = function() {
			$interval.cancel($scope.stopTime);
			$scope.importObj = {prepareProgress:0, fileSelected:false, invalidFile: false, importClicked: false, uploadFinished: false};
			$scope.selectedFile = "";
		}

		$scope.uploadFile = function() {
			$scope.importObj.importClicked = true;
			$scope.stopTime = $interval(function(){
				if ($scope.importObj.prepareProgress == 100) {
					$interval.cancel($scope.stopTime);
					$scope.importObj.uploadFinished = true;
				} else {
					$scope.importObj.prepareProgress++;
				}
			}, 100);
		}
    }])
    //ng-model and ng-change are not supported for input[file]
    .directive("fileread", [function () {
	    return {
	        link: function (scope, element, attributes) {
	            element.bind("change", function (changeEvent) {
	            	scope.$parent.changeFileName(changeEvent.target.files[0].name);
	            });
	        }
	    }
	}]);