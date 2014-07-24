'use strict';

angular.module('centralManagerApp')
    .controller('CentralManagerCtrl', function($scope, $rootScope, $timeout, filterFilter, $filter, InfoTrayService, DiaglogService, FilesModel, SortAndFilterService, FileDeleteService, ActiveSelection, CENTRALMANAGER) {

        console.info("CentralManagerCtrl");

        FilesModel.$get().$futureFilesData.then(function(response) {
            console.info("getting data in CentralManagerCtrl")
            console.info(response)
            $scope.data = response;
            $scope.display = angular.copy($scope.data);
            SortAndFilterService.setOrderBy('Last Modified');
            SortAndFilterService.setReverse(true);
            SortAndFilterService.setFilter(CENTRALMANAGER.items[0]);
        });

        $scope.$on('SortAndFilterService:filter', function(evt) {
            filter()
        });

        $scope.$watch('SortAndFilterService.searchText', function() {
            filter()
        });

        function filter() {
            console.info("filtering in CentralManagerCtrl")
            if ($scope.data && $scope.data.data) {
                console.info("data")
                var activeFilters = SortAndFilterService.getActiveFilters(),
                    filterBy = SortAndFilterService.getFilterBy(),
                    searchText = SortAndFilterService.getSearchText(),
                    temp = filterFilter($scope.data.data, activeFilters);
                temp = filterFilter(temp, filterBy);
                temp = filterFilter(temp, searchText);
                temp = $filter('orderBy')(temp, SortAndFilterService.getOrderBy(), SortAndFilterService.getReverse());

                $scope.display.data = temp;
            }
        }

        // $scope.SortAndFilterService = SortAndFilterService;
        // $scope.SortAndFilterService.enabledDefaults(true);
        // $scope.SortAndFilterService.setReverse(true);
        // $scope.SortAndFilterService.setFilter(CENTRALMANAGER.items[1].label);

        $scope.SortAndFilterService = SortAndFilterService;
        $scope.FileDeleteService = FileDeleteService;
        $scope.ActiveSelection = ActiveSelection;
        $scope.InfoTrayService = InfoTrayService;
        $scope.DiaglogService = DiaglogService;

        $scope.console = function(msg) {
            console.info(msg);
        }

        $scope.setAsMaster = function(item) {
            var id = item.id,
                value = item.defaults;

            FilesModel.update({
                prop: 'defaults',
                value: !value,
                id: id
            });
        };
    }).controller("ScenarioEditCtrl", function($scope) {
        $scope.foo = "bar";
    }).controller("ProjectsDisplayCtrl", function($scope, ProjectsModel, SortAndFilterService, filterFilter, $filter, PROJECTS) {


        console.info("ProjectsDisplayCtrl");

        ProjectsModel.$get().$futureProjectsData.then(function(response) {
            console.info("getting data in ProjectsDisplayCtrl")
            console.info(response)
            $scope.data = response;
            $scope.display = angular.copy($scope.data);
            SortAndFilterService.setOrderBy('Last Modified');
            SortAndFilterService.setReverse(true);
            SortAndFilterService.setFilter(PROJECTS.items[0]);
        });

        $scope.SortAndFilterService = SortAndFilterService;

        $scope.$on('SortAndFilterService:filter', function(evt) {
            filter()
        });

        $scope.$watch('SortAndFilterService.searchText', function() {
            filter()
        });

        function filter() {
            console.info("filtering in ProjectsDisplayCtrl")
            if ($scope.data && $scope.data.data) {
                console.info("data")
                var activeFilters = SortAndFilterService.getActiveFilters(),
                    filterBy = SortAndFilterService.getFilterBy(),
                    searchText = SortAndFilterService.getSearchText(),
                    temp = filterFilter($scope.data.data, activeFilters);
                temp = filterFilter(temp, filterBy);
                temp = filterFilter(temp, searchText);
                temp = $filter('orderBy')(temp, SortAndFilterService.getOrderBy(), SortAndFilterService.getReverse());

                $scope.display.data = temp;
            }
        }

    }).controller('InfoTrayCtrl', function($scope, ActiveSelection) {
        $scope.selectedItem = ActiveSelection.getActiveItem();
        $scope.seeAll = false;

        $scope.$on('ActiveSelection:activeItemChange', function(event, response) {
            if (response.data !== "") {
                $scope.selectedItem = response.data;
            }
        });

    }).controller('SearchCtrl', function($scope, SortAndFilterService, CENTRALMANAGER) {
        $scope.setFilter = SortAndFilterService.setFilter;
        $scope.menuItems = CENTRALMANAGER;
    }).controller('ProjectsSearchCtrl', function($scope, SortAndFilterService, PROJECTS) {
        $scope.setFilter = SortAndFilterService.setFilter;
        $scope.menuItems = PROJECTS;
    }).controller('DeleteCtrl', function($scope, data, $modalInstance, FileDeleteService) {
        var callback = data;
        $scope.FileDeleteService = FileDeleteService;
        $scope.cancel = function() {
            console.info("cancel")
            FileDeleteService.reset();
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.delete = function() {
            console.info("delete")
            FileDeleteService.remove();
            callback();
            $modalInstance.close('delete');
        }; // end save
    }).controller('CreateCtrl', function($scope, $modalInstance, $location, FilesModel) {
        $scope.create = function(item) {
            console.info("create");
            FilesModel.$create({
                title: item.name,
                type: item.type,
                base: item.base,
                access: item.access
            });
            $modalInstance.dismiss('create');
            $location.path("/scenarioEdit")
        }; //

        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        }; // end cancel
    }).controller('RenameCtrl', function($scope, $modalInstance, FilesModel, data) {
        $scope.data = data;
        $scope.name = $scope.data.title;

        $scope.rename = function(name) {
            $scope.data.title = name;
            FilesModel.$set($scope.data)

            $modalInstance.dismiss('create');
        };

        $scope.close = function() {
            console.info("cancel")
            $modalInstance.dismiss('canceled');
        };
    });