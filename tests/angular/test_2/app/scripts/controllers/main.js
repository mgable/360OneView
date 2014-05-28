'use strict';

angular.module('filemanagerApp')
    .controller('MainCtrl', function($scope, myData, FilesFactory) {
        $scope.data = myData;
    }).controller('FileManagerNavigationCtrl', function($scope, filterService, GroupFileDelete) {
        $scope.filterService = filterService;

        $scope.filesToDeleteCount = GroupFileDelete.getFileCount();
        $scope.filesToDelete = GroupFileDelete.getFilesToDelete();

        $scope.$watch(GroupFileDelete.getFileCount, function() {
            $scope.filesToDeleteCount = GroupFileDelete.getFileCount();
        });

        $scope.cb = function() {
            GroupFileDelete.reset();
        }

        $scope.$watch(GroupFileDelete.getFilesToDelete, function() {
            $scope.filesToDelete = GroupFileDelete.getFilesToDelete();
        });

        $scope.setFilter = function(filter, other) {
            if (other) {
                filterService.activeFilters.search = filter;
                filterService.activeFilters.fileType = (typeof other === "string") ? other : "";
            } else {
                filterService.activeFilters.fileType = filter === "All" ? "" : filter;
                filterService.activeFilters.search = "";
            }
        }

        $scope.setFilterCreated = function(filter) {
            filterService.activeFilters.createdBy = (filter === "All") ? "" : filter;
        }

        $scope.clearCreatedBy = function(x) {
            if (x === null) {
                delete filterService.activeFilters.createdBy;
            }
        };

        $scope.menuItems = [{
            "label": "All"
        }, {
            "label": "Master Set"
        }, {
            "label": "Media Plans"
        }, {
            "label": "Constraints",
            "subMenu": [{
                "label": "Hard Constraints"
            }, {
                "label": "Soft Constraints"
            }]
        }, {
            "label": "Cost Assumptions"
        }, {
            "label": "Environmental Factors",
            "subMenu": [{
                "label": "Economic Variables"
            }, {
                "label": "Marketing Factors"
            }, {
                "label": "Competitive Spend"
            }, {
                "label": "Brand Awardness"
            }, {
                "label": "Pricing"
            }, {
                "label": "Product Factors"
            }]
        }, {
            "label": "Objectives"
        }, {
            "label": "Scenarios"
        }, {
            "label": "Playbook"
        }, {
            "label": "Decision Books"
        }];
    }).controller('FileBrowserCtrl', function($scope, filterService, FilesFactory) {
        $scope.filterService = filterService;

        $scope.modalOpen = false;
        $scope.hideScenarios = false;

        $scope.$on('$close', function() {
            $scope.modalOpen = false;
        });

        $scope.cb = function() {
            console.info("rename");
        };

        $scope.stop = function(evt) {
            $scope.dontPassEvent(evt);
            $scope.modalOpen = true;
        };

        $scope.sortBy = function(which) {
            $scope.orderBy = which;
        };

        $scope.dontPassEvent = function(evt) {
            evt.stopPropagation();
            //evt.preventDefault();
        };

        $scope.toggleScenarioView = function(evt) {
            $scope.dontPassEvent(evt)
            $scope.hideScenarios = $scope.hideScenarios === false ? true : false;
        };

        $scope.updateName = function(data, list) {
            for (var x = 0, limit = list.length; x < limit; x++) {
                for (var prop in list[x]) {
                    if (list[x].hasOwnProperty(prop)) {
                        if (prop === "id" && list[x][prop] === +data.id) {
                            list[x]['title'] = data.name;
                            FilesFactory.set(data.id, list[0]);
                            return;
                        }
                    }
                }
            }
        };

        $scope.$on('update', function(evt, data) {
            $scope.updateName(data, $scope.data.data)
        });
    });