'use strict';

angular.module('ThreeSixtyOneView.directives')
  .directive('inputEdit', ["$rootScope", function ($rootScope) {
    return {
      template: '<span><span ng-click="activate(this)"><span ng-hide="editMode">{{value}}</span><span ng-show="editMode"><input class="editable" type="text" ng-model="value" ng-change="change()"/></span></span><span ng-show="editMode">&nbsp;<a ng-click="submit()"><icon type="check"></icon></a>&nbsp;<a ng-click="cancel()"><icon type="times"></icon></a></span></span>',      restrict: 'EA',
      scope: {
      	value: "@"
      },
      replace: true,
      link: function (scope, element, attrs) {
      		var currentText;
        	scope.editMode = false;
        	scope.activate = function(which){
        		if (!scope.editMode){
        			scope.editMode = !scope.editMode;
        			currentText = scope.value;
        		}
        		$rootScope.$broadcast("inputEdit:opened", which)
        	}

        	scope.cancel = function(){
        		$rootScope.$broadcast("inputEdit:save", "revert")
        		scope.value = currentText;
        		scope.editMode = false;
        	}

        	scope.change = function(){
        		$rootScope.$broadcast("inputEdit:change", "editing")
        	}

        	scope.submit = function(){
        		$rootScope.$broadcast("inputEdit:save", "saving")
        		scope.editMode = false;
        	}

        	scope.$on("inputEdit:opened", function (evnt, data){
        		if (data !== scope){
        			scope.editMode = false;
        		}
        	})
      }
    };
  }]).directive("savedState", ["$timeout", "$rootScope", function($timeout, $rootScope){
  	return {
  		template: "<span>{{state}}</span>",
  		replace: true,
  		restrict: "AE",
  		link: function(scope, element, attrs){
  			var msg = {};
  			msg.done = "";
  			msg.editing = "you have unsaved changes";
  			msg.saving = "saving changes";
  			msg.revert = "reverting - nothing was saved";

  			scope.state = msg.done;

  			var setState = function(which){
  				scope.state = msg[which]
  			}

  			var setStateAndRemove = function(which){
  				scope.state = msg[which];
  				$timeout(function(){
  					scope.state = msg.done;
  				},3000);
  			}

  			scope.$on("inputEdit:change", function (evnt, data){
        		setState(data);
        	})

        	scope.$on("inputEdit:save", function (evnt, data){
        		setStateAndRemove(data);
        	})
  		}
  	}
  }])