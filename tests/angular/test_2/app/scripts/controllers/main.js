'use strict';

angular.module('filemanagerApp')
    .controller('MainCtrl', function($scope, FilesFactory) {
        $scope.data = FilesFactory.$get();
    }).controller('FileManagerNavigationCtrl', function($scope, filterService, GroupFileDelete, FilesFactory, $rootScope) {
        $scope.filterService = filterService;

        $scope.data = FilesFactory.$get();

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
                filterService.activeFilters.search = "";
                filterService.activeFilters.fileType = filter === "All" ? "" : filter;
            }
            $rootScope.$broadcast("$filter");
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
        $scope.data = FilesFactory.$get();

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
            FilesFactory.$clone(which).then(function(data) {
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


        $scope.save = function(id, item) {
            FilesFactory.$set(id, item);
        }

        $scope.setAsMaster = function(id) {
            var item = $scope.getItemById(id, $scope.data.data)
            // $scope.updateProperty({
            //     id: id,
            //     prop: 'masterSet',
            //     name: true,
            // }, $scope.data.data);


            if (item.masterSet) {
                item.search.splice(_.indexOf(item.search, "Master Set"), 1)
            } else {
                item.search.push('Master Set');
            }

            item.masterSet = !item.masterSet;
            FilesFactory.$edit(item);
        }

        $scope.updateProperty = function(config, data) {
            var item = $scope.getItemById(config.id, data);
            console.info(item);
            if (item) {
                item[config.prop] = config.name;
            };
        };

        $scope.appendProperty = function(config, data) {
            var item = $scope.getItemById(config.id, data);
            if (item) {
                if (item[config.prop] === '') {
                    item[config.prop] = [config.name];
                } else {
                    item[config.prop].push(config.name);
                }
            };
        };

        $scope.getItemById = function(id, items) {
            var item = false;
            for (var x = 0, limit = items.length; x < limit; x++) {
                if (items[x].id === id) {
                    return items[x];
                }
            }
            return item;
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

            FilesFactory.$delete(data);
        }

        $scope.$on('update', function(evt, data) {
            $scope.updateProperty(data, $scope.data.data)
        });

        $scope.$on('delete', function(evt, data) {
            $scope.deleteFiles(data, $scope.data.data)
        });
    });