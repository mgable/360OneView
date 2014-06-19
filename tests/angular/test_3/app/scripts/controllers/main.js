'use strict';

angular.module('fileManagerApp')
    .controller('FileManagerCtrl', function($scope, Modal) {
        $scope.$on("modal", function(evt, data) {
            $scope.modelEnabled = data
        });
    })
    .controller('FileManagerDisplayCtrl', function($scope, FILTERBY, FileDeleteService, FilterService, FilesModel, DATERANGE) {
        $scope.FilterService = FilterService;
        $scope.filterBy = FILTERBY;
        // set the default selected item for the filterBy dropdown
        $scope.FilterService.filterBy = $scope.filterBy[0].filter;

        $scope.dateRange = DATERANGE;
        // set the default selected item for the date range dropdown
        $scope.FilterService.dateRange = $scope.dateRange[0].filter;
        
        $scope.data = FilesModel.$get();
        $scope.hideScenarios = false;


        $scope.alert = function(data) {
            console.info("the data is ")
            console.info(data)
        }

        $scope.deleteFiles = function() {
            FileDeleteService.remove();
        }

        $scope.dontPassEvent = function(evt) {
            evt.stopPropagation();
        };

        //TODO: clean this up
        $scope.setAsMaster = function(config) {
            var config = config.split(',');
            var id = config[0],
                value = (config[1] === 'true') ? true : false;

            console.info(id, value)
            FilesModel.update({
                prop: 'masterSet',
                value: !value,
                id: id
            });
        };

        $scope.toggleScenarioView = function(evt) {
            $scope.dontPassEvent(evt);
            $scope.hideScenarios = $scope.hideScenarios === false ? true : false;
        };

        $scope.deleteSingleFile = function(id) {
            FileDeleteService.setFilesToDelete([{
                id: id
            }]);
            $scope.deleteFiles();
        };

        $scope.cloneFile = function(id) {
            FilesModel.$clone(id);
        };

    })
    .controller('FileManagerSearchCtrl', function($scope, SEARCHITEMS, FilterService, $rootScope) {
        $scope.menuItems = SEARCHITEMS;
        $scope.FilterService = FilterService;

        $scope.setFilter = function(filter, other) {
            if (other) {
                FilterService.activeFilters.search = filter;
                FilterService.activeFilters.fileType = (typeof other === 'string') ? other : '';
            } else {
                FilterService.activeFilters.search = '';
                FilterService.activeFilters.fileType = filter === 'All' ? '' : filter;
            }
            $rootScope.$broadcast('$filter');
        }
    }).controller('SortingController', function($scope) {
        $scope.reverse = false;

        this.sort = function(which) {
            $scope.orderBy = which;
        }
    });