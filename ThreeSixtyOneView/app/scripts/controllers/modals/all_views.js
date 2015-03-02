/* global _ */
'use strict';

angular.module('ThreeSixtyOneView')
    .controller('AllViewsCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data",
    function($scope, $controller, $modalInstance, CONFIG, data) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var init = function() {
            $scope.viewsList = data.viewsList;
            $scope.e2e = data.e2e;

            $scope.elementTypeItems = ['All', 'By Me', 'Favorite'];
            $scope.currentElementType = 0;

            $scope.selectedView = {
                id: data.selectedViewId
            };
        };

        // change element type
        $scope.changeElementType = function(type) {
            $scope.currentElementType = type;
        };

        // cancel the changes and dismiss the modal
        $scope.cancelChangeView = function() {
            $scope.viewsList = [];
            $modalInstance.dismiss('canceled');
        };

        // pass back the selected file and dismiss the modal
        $scope.changeView = function() {
            var newViewId = $scope.selectedView.id;
            $modalInstance.close(newViewId);
        };

        init();
    }]);