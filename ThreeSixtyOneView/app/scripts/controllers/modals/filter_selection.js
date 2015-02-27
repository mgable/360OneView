/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('FilterSelectionCtrl', ["$scope", "$window", "$rootScope", "$modalInstance", "$controller", "data", "CONFIG", "PivotMetaService",
    function($scope, $window, $rootScope, $modalInstance, $controller, data, CONFIG, PivotMetaService) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

        var init = function() {
            $scope.selectedFilter = {};
            $scope.selectedFilter.cat = data.cat;
            $scope.addedFilter = data.addedFilters;
            $scope.dimensions = data.dimensions;
            $scope.viewData = data.viewData;
            $scope.e2e = data.e2e;

            $scope.categorizedValue = [];
            $scope.filterSearch = {label: ''};
            $scope.emptyFiltersList = [];
            $scope.noFilterSelected = false;

            $scope.chooseFilter($scope.selectedFilter.cat, false, false);
            getWindowHeight();
        },
        getWindowHeight = function(){
            var w = angular.element($window);
            $scope.getWindowDimensions = function () {
                return {
                    'h': w[0].innerHeight,
                    'w': w[0].innerWidth
                };
            };
            $scope.$watch($scope.getWindowDimensions, function (newValue) {
                $scope.windowHeight = newValue.h;
                $scope.windowWidth = newValue.w;

            }, true);

            w.bind('resize', function () {
                $scope.$apply();
            });
        };

        // open the filters modal for the selected filter
        $scope.chooseFilter = function(category, newSelection, index) {
            if(angular.isNumber(index)) {
                $scope.selectedFilter.selFil = $scope.chooseViewBy(category.members, index);
                return null;
            }

            $scope.filterSearch.label = '';
            $scope.selectedFilter.cat = category;
            $scope.selectedFilter.selFil = $scope.chooseViewBy(category.members, false);

            if(newSelection) {
                $scope.cancelChangeFilter();
            }
        };

        // choose a filter based on the passed name
        $scope.chooseFilterByName = function(name) {
            var i;

            for(i = 0; i < $scope.dimensions.length; i++) {
                if($scope.dimensions[i].label === name) {
                    $scope.chooseFilter($scope.dimensions[i], false, false);
                    return null;
                }
            }
        };

        // choose the view based on added items in the column/row
        $scope.chooseViewBy = function(items, index) {
            if(angular.isNumber(index)) {
                $scope.searchFilters(items[index], $scope.filterSearch);
                return items[index];
            }

            for(var i = 0; i < items.length; i++) {
                for(var j = 0; j < $scope.viewData.length; j++) {
                    if(items[i].label === $scope.viewData[j].level.label) {
                        $scope.searchFilters(items[i], $scope.filterSearch);
                        return items[i];
                    }
                }
            }

            $scope.searchFilters(items[0], $scope.filterSearch);
            return items[0];
        };

        // cancel the made changes to the filter
        $scope.cancelChangeFilter = function() {
            // $scope.filterSearch = {label: ''};
            $scope.filterCollapse = {};
            $modalInstance.dismiss('canceled');
        };

        // search filter values
        $scope.searchFilters = function(obj, search) {
            if(!obj) {
                return null;
            }

            var searchResults = {};

            var treeSearch = function(tree, searchLabel, initial) {
                var output = null;

                if(angular.lowercase(tree.label).indexOf(angular.lowercase(searchLabel)) > -1 && !initial) {
                    return tree;
                }

                if(tree.members.length > 0) {
                    for(var i = 0; i < tree.members.length; i++) {
                        var results = treeSearch(tree.members[i], searchLabel, false);
                        if(!!results && !!results.members) {
                            if(!output) {
                                output = {
                                    label: tree.label,
                                    members: []
                                };
                            }
                            output.members.push(results);
                        }
                    }
                } else {
                    if(angular.lowercase(tree.label).indexOf(angular.lowercase(searchLabel)) > -1) {
                        return tree;
                    } else {
                        return null;
                    }
                }

                return output;
            };

            searchResults = treeSearch(obj, search.label, true);

            $scope.searchResults = searchResults;
            $scope.countFilters(searchResults, $scope.addedFilter);
        };

        // count number of selected and total filters
        $scope.countFilters = function(object, _addedFilter) {
            var output = {
                selected: 0,
                total: 0
            };

            if(!object) {
                $scope.filterCount = output;
                return output;
            }
            var treeCount = function(tree) {
                var output = {
                    selected: 0,
                    total: 0
                };

                if(tree.members.length > 0) {
                    for(var i = 0; i < tree.members.length; i++) {
                        var results = treeCount(tree.members[i]);
                        output.selected += results.selected;
                        output.total += results.total;
                    }
                } else {
                    if(_addedFilter[$scope.selectedFilter.cat.label][tree.label]) {
                        output.selected++;
                    }
                    output.total++;
                }
                return output;
            };

            output = treeCount(object);

            $scope.filterCount = output;
            return output;
        };

        // handle select/deselect of visible/invisible filter search values
        $scope.selectFilters = function(category, visible, add) {
            var i = 0,
                val;

            var getFilters = function(list) {
                var output = [],
                    i = 0;

                if(list.members.length > 0) {
                    for(i = 0; i < list.members.length; i++) {
                        output = output.concat(getFilters(list.members[i]));
                    }
                } else {
                    return [list.label];
                }

                return output;
            };

            var list = getFilters($scope.searchResults);

            if(visible) {
                for(i = 0; i < list.length; i++) {
                    $scope.addedFilter[category][list[i]] = add;
                }
            } else {
                for(val in $scope.addedFilter[category]) {
                    if($scope.addedFilter[category][val] && list.indexOf(val) === -1) {
                        $scope.addedFilter[category][val] = add;
                    }
                }
            }
        };

        // make the temporary changes in the filters
        $scope.changeFilter = function() {
            $modalInstance.close($scope.addedFilter);
        };

        $scope.categorizeValuesCount = function(_index, addedFilter) {
            var index, output = PivotMetaService.getCategorizeValues($scope.dimensions[_index], addedFilter);
            $scope.categorizedValue[_index] = output;

            // add empty category to the empty items list and show error
            if(output.selected === 0) {
                index = $scope.emptyFiltersList.indexOf($scope.dimensions[_index].label);
                if(index < 0) {
                    $scope.emptyFiltersList.push($scope.dimensions[_index].label);
                }
                $scope.noFilterSelected = true;
            }
            // check if any item is selected from an empty list, remove it
            if($scope.noFilterSelected && output.selected > 0) {
                index = $scope.emptyFiltersList.indexOf($scope.dimensions[_index].label);
                if(index > -1) {
                    $scope.emptyFiltersList.splice(index, 1);
                    if($scope.emptyFiltersList.length < 1) {
                        $scope.noFilterSelected = false;
                    }
                }
            }
            return output;
        };

        init();
    }]);