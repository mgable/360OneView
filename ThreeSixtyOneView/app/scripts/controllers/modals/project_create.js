/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ProjectCreateCtrl', ["data" ,"$scope", "$rootScope", "$controller", "$modalInstance", "EVENTS", function(data, $scope, $rootScope, $controller, $modalInstance, EVENTS) {

        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, data: data, $modalInstance: $modalInstance}));

        
        $scope.modalProperties = {
            title: "Create a New Project",
            field: "Name",
            button: "Create New Project",
            icon: "star"
        };

        $scope.submit = function(title, evt) {
            if (evt) { evt.preventDefault(); }
            $rootScope.$broadcast(EVENTS.createProject, title.trim());
            $modalInstance.dismiss('create');
        };
    }]);