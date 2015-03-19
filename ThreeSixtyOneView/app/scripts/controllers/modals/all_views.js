/* global _ */
'use strict';

angular.module('ThreeSixtyOneView')
    .controller('AllViewsCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data",
    function($scope, $controller, $modalInstance, CONFIG, data) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var init = function() {
            $scope.e2e = data.e2e;
            $scope.subTitle = data.subTitle || 'View';

            $scope.selectedView = {
                id: data.selectedViewId
            };
        },
        viewsList = data.viewsList;

        $scope.getViewsList = function(){
            return viewsList;
        };

        // cancel the changes and dismiss the modal
        $scope.cancelChangeView = function() {
            viewsList = [];
            $modalInstance.dismiss('canceled');
        };

        // pass back the selected file and dismiss the modal
        $scope.changeView = function() {
            var newViewId = $scope.selectedView.id;
            $modalInstance.close(newViewId);
        };

        init();
    }]);