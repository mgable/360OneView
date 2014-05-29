'use strict';

angular.module('filemanagerApp')
    .controller('MainCtrl', function($scope, myData) {
        $scope.data = myData;
    }).controller('FileManagerNavigationCtrl', function($scope, filterService, GroupFileDelete) {
        $scope.filterService = filterService;

        $scope.filesToDeleteCount = GroupFileDelete.getFileCount();
        $scope.filesToDelete = GroupFileDelete.getFilesToDelete();

        $scope.$watch(GroupFileDelete.getFileCount, function() {
            $scope.filesToDeleteCount = GroupFileDelete.getFileCount();
        });

        $scope.cb = function() {
            GroupFileDelete.remove();
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

        // delete single file 
        $scope.deleteSingleFile = function(which) {
            $scope.deleteFiles(which, $scope.data.data)
        };

        $scope.cloneFile = function(which) {
            console.info("cloning " + which)
            FilesFactory.clone(which).then(function(data) {
                $scope.data.data.push(data);
            });
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
                        if (prop === "id" && list[x][prop] === data.id) {
                            list[x]['title'] = data.name;
                            //TODO: get this out of here
                            FilesFactory.set(data.id, list[x]);

                            return;
                        }
                    }
                }
            }
        };

        $scope.deleteFiles = function(data, list) {
            var indexes = [],
                itemsToDelete = _.isArray(data) ? data : [data];

            for (var x = 0, limit = itemsToDelete.length; x < limit; x++) {
                _.each(list, function(e, i, l) {
                    if (e.id === itemsToDelete[x]) {
                        indexes.push(i);
                        return;
                    }
                })
            }

            indexes.sort().reverse();

            for (var x = 0, limit = indexes.length; x < limit; x++) {
                list.splice(indexes[x], 1);
            }

            FilesFactory.remove(data);
        }

        $scope.$on('update', function(evt, data) {
            $scope.updateName(data, $scope.data.data)
        });

        $scope.$on('delete', function(evt, data) {
            $scope.deleteFiles(data, $scope.data.data)
        });
    });