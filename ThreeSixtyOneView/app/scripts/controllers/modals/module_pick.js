/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
.controller("ModulePickCtrl", ["$scope", "$rootScope", "$controller", "$modalInstance", "data", "CONFIG",
	function($scope, $rootScope, $controller, $modalInstance, data, CONFIG) {
		angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

		var init = function() {
			$scope.modules = data.modules;
		};

		$scope.submit = function(){
			$modalInstance.dismiss('start');
		};

		init();
	}]);