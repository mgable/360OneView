/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
.controller("SelectModuleCtrl", ["$scope", "$rootScope", "$controller", "$modalInstance", "data",
	function($scope, $rootScope, $controller, $modalInstance, data) {
		angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data}));

		var init = function() {
			$scope.modules = data.modules;
			$scope.selectedModule = false;
		};

		$scope.select = function(module) {
			$scope.selectedModule = module;
		};

		$scope.isModuleSelected = function() {
			return !!$scope.selectedModule;
		};

		$scope.submit = function() {
			$modalInstance.close({selectedModule: $scope.selectedModule});
		};

		init();
	}]);