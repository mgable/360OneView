'use strict';

angular.module('centralManagerApp')
    .controller('CentralManagerCtrl', function($scope, $rootScope, FilesModel, SortAndFilterService, SEARCHITEMS, FileDeleteService, $filter) {
        $scope.data = FilesModel.$get();
        $scope.showinfotray = false;
        $scope.menuItems = SEARCHITEMS;
        $scope.seeAll = false;
        $scope.selectedCategory = $scope.menuItems[0].label;
        $scope.enableDisplayActions = false;
        $scope.SortAndFilterService = SortAndFilterService;
        $scope.SortAndFilterService.activeFilters.search = $scope.menuItems[0].label;

        $scope.$on("orderBy", function() {
            console.info("received orderby event")
            $scope.orderBy = $filter('camelCase')(SortAndFilterService.getOrderBy());
            console.info($scope.orderBy)
        })

        $scope.toggleInfoTray = function() {
            if ($scope.enableDisplayActions == 1) {
                $scope.showinfotray = !$scope.showinfotray;
            }
        };

        $scope.$on('FileDeleteService:change', function() {
            $scope.enableDisplayActions = FileDeleteService.getFileCount();
        });

        $scope.alert = function(msg) {
            alert(msg);
        }

        $scope.setFilter = function(filter, other) {
            $scope.selectedCategory = other ? (typeof other === "boolean" ? filter : other) : filter;

            if (other) {
                SortAndFilterService.activeFilters.search = filter;
                SortAndFilterService.activeFilters.type = (typeof other === 'string') ? other : '';
            } else {
                SortAndFilterService.activeFilters.search = '';
                SortAndFilterService.activeFilters.type = filter === 'All' ? '' : filter;
            }
            $rootScope.$broadcast('$filter');
        }
    });