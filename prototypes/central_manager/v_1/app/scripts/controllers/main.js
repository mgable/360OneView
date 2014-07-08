'use strict';

angular.module('centralManagerApp')
    .controller('CentralManagerCtrl', function($scope, FilesModel, SEARCHITEMS, FilterService) {
        $scope.data = FilesModel.$get();
        $scope.showinfotray = false;
        $scope.menuItems = SEARCHITEMS;
        $scope.seeAll = false;
        $scope.FilterService = FilterService;
        $scope.FilterService.activeFilters.search = "Default Scenarios Elements";
        $scope.selectedCategory = "Default Scenarios Elements";

        $scope.toggleInfoTray = function() {
            $scope.showinfotray = !$scope.showinfotray;
        };

        $scope.setFilter = function(filter, other) {
            $scope.selectedCategory = other ? (typeof other === "boolean" ? filter : other) : filter;

            if (other) {
                FilterService.activeFilters.search = filter;
                FilterService.activeFilters.fileType = (typeof other === 'string') ? other : '';
            } else {
                FilterService.activeFilters.search = '';
                FilterService.activeFilters.fileType = filter === 'All' ? '' : filter;
            }
            //$rootScope.$broadcast('$filter');
        }
    });