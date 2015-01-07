'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioResultCtrl
* @description
* # scenarioResultCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl',
    ['$scope', 'resultsData', 'Element', 'Scenarios', 'DialogService', 'PivotViewService', 'CubeService', 'PivotIntermediatesService', '$q',
    function ($scope, resultsData, Element, Scenarios, DialogService, PivotViewService, CubeService, PivotIntermediatesService, $q) {

    // private variables
    var cnt = 0;

    // private functions
    var getChartData = function() {
        _.each($scope.getSpendDataBody(), function(v) {
            var chartSubData = {};
            chartSubData.id = v.id;
            chartSubData.name = v.category;
            chartSubData.data = [];
            _.each(v.children, function(v1) {
                if (_.has(v1, 'chart')) {
                    v1.chart.categoryId = v.id;
                    v1.chart.id = v1.id;
                    v1.chart.colorId = ++cnt;
                    v1.chart.category = v1.title;
                    chartSubData.data.push(v1.chart);
                }
            });
            $scope.chartData.push(chartSubData);
        });
    }
    var loadDimension = function() {
        $scope.loadDimensions($scope.cubeId).then(function() {
            $scope.addedFilters = PivotIntermediatesService.getAddedFilters($scope.filters, $scope.dimensions);
            _.each($scope.dimensions, function(_dimension) {
                _dimension.catVal = PivotIntermediatesService.getCategorizeValues(_dimension, $scope.addedFilters[_dimension.label]);
            });
        });
    }
    var init = function() {
        // scope variables
        $scope.srShow    = false;
        $scope.saveAs    = false;
        $scope.draftView = false;
        $scope.isTest    = null;

        $scope.viewData  = $scope.views.currentView;
        $scope.viewName  = $scope.views.currentView.name;
        $scope.viewsList = $scope.views.views;

        $scope.add = {selected: ''};
        $scope.added = {};

        $scope.setUpAddedLevels($scope.viewData);
        $scope.addedFilters = {};
        $scope.filterSearch = {label: ''};

        $scope.spendDatumHeader  = resultsData.spendData.header;
        $scope.chartData         = [];
        $scope.selectedView      = Scenarios[0];
        $scope.dimensions        = [];
        $scope.filters           = $scope.views.currentView.filters;

        angular.element('.Scenario').css('height', 'auto');
        loadDimension();
        getChartData();
    };

    // scope functions
    $scope.getKpiData = function() {
        return resultsData.kpiData;
    };
    $scope.getSpendDataBody = function() {
        return resultsData.spendData.body;
    };
    $scope.getFilters = function() {
        return resultsData.viewData.filters;
    };
    $scope.getComparedViews = function() {
        return Scenarios;
    }
    $scope.setComparedView = function(view) {
        $scope.selectedView = view;
    };
    $scope.addSign = function(direction) {
        return direction === 'increase' ? '+' : '-';
    };
    $scope.addArrow = function(direction) {
        return direction === 'increase' ? 'arrow-up' : 'arrow-down';
    };

    // start save as process
    $scope.startSaveAs = function(rename) {
        $scope.saveAsName = $scope.viewName;
        $scope.saveAs = true;
        $scope.rename = rename;
    };

    // handle keyboard actions in the rename process
    $scope.renameAction = function (event) {
        if(event.keyCode === 13) {
            $scope.finishSaveAs(true);
        } else if(event.keyCode === 27) {
            $scope.finishSaveAs(false);
        }
    };

    // finish save as process
    $scope.finishSaveAs = function(save) {
        if(save && $scope.rename) {
            var i;

            $scope.viewName = $scope.saveAsName;
            $scope.draftView = false;

            $scope.viewData.name = $scope.saveAsName;
            for(i = 0; i < $scope.viewsList.length; i++) {
                if($scope.viewsList[i].id === $scope.viewData.id) {
                    // $scope.viewsList[i].name = $scope.saveAsName;
                }
            }

            $scope.renameView($scope.viewData);

            $scope.viewRecentViews = false;
        } else if (save && !$scope.rename) {
            $scope.viewData.name = $scope.saveAsName;
            $scope.viewData.id = null;
            $scope.createView($scope.cubeId, $scope.viewData);
        }

        $scope.saveAs = false;
    };

    // rename the view
    $scope.renameView = function(cubeId, view) {
        PivotViewService.renameView(view.id, cubeId, view.name);
        console.log(view.id, cubeId, view.name);
    };

    // create a new view
    $scope.createView = function(cubeId, view) {
        var i;

        // remove conflicting elements from the view
        view.id = null;
        for(i = 0; i < view.filters.length; i++) {
            view.filters[i].id = null;
        }

        PivotViewService.createView(view, cubeId).then(function(view) {
            $scope.viewData = view;
            $scope.viewName = view.name;
            $scope.setUpAddedLevels(view);
            $scope.viewsList.unshift(view);
            $scope.addedFilters = PivotIntermediatesService.getAddedFilters(view.filters, $scope.dimensions);
        });
    };

    // set up added levels
    $scope.setUpAddedLevels = function(view) {
        var i;
        $scope.added = {};

        for(i = 0; i < view.columns.length; i++) {
            $scope.added[view.columns[i].level.label] = true;
        }
        for(i = 0; i < view.rows.length; i++) {
            $scope.added[view.rows[i].level.label] = true;
        }
    };

    $scope.loadDimensions = function(cubeId) {
        return CubeService.getMeta(cubeId).then(function(dimensions) {
            // get all members of all dimensions and build the dimensions tree
            var i, j, k, count = 0, timeIndex, promises = [];

            _.each(dimensions, function(_dimension, _index) {
                _.each(_dimension.members, function(_member) {
                    if(!_member.leafLevel) {
                        promises.push(CubeService.getViewByMembers(cubeId, _dimension.id, _member.levelId));
                        if(_dimension.type === 'TimeDimension') {
                            timeIndex = _index;
                        }
                    }
                });
            });

            return $q.all(promises).then(function(response) {
                var timeAdded = false, lastMembers;

                _.each(dimensions, function(_dimension) {
                    _.each(_dimension.members, function(_member) {
                        if(!_member.leafLevel) {
                            _member.members = response[count++].members;
                        } else {
                            _.each(lastMembers, function(_lastMember) {
                                _member.members = _member.members.concat(_lastMember.members);
                            });
                        }
                        lastMembers = _member.members;
                    });
                });

                $scope.dimensions = dimensions;
            });
        });
    };
    $scope.filtersModal = function(category) {
        var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl', {cat: category, addedFilters: $scope.addedFilters, viewData: $scope.viewData, dimensions: $scope.dimensions}, {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

        dialog.result.then(function(data) {
            $scope.addedFilters = data;
        });
    };

    // fire off init function
    init();

}]).factory('resultsData', function () {
    return {
        "kpiData": [
            {
                "id": 1,
                "title": "awareness",
                "incremental": {
                    "number": 432,
                    "unit": "K"
                },
                "total": "3.6M",
                "percent": "+12%",
                "direction": "increase"
            }, {
                "id": 2,
                "title": "web visit",
                "incremental": {
                    "number": 770,
                    "unit": "K"
                },
                "total": "10.3M",
                "percent": "+7.5%",
                "direction": "increase"
            }, {
                "id": 3,
                "title": "sales",
                "incremental": {
                    "current": "$",
                    "number": 3.5,
                    "unit": "M"
                },
                "total": "$90M",
                "percent": "+3.9%",
                "direction": "increase"
            }, {
                "id": 4,
                "title": "Revenue",
                "incremental": {
                    "current": "$",
                    "number": 76,
                    "unit": "K"
                },
                "total": "$19M",
                "percent": "+0.4%",
                "direction": "increase"
            }, {
                "id": 5,
                "title": "Profit",
                "incremental": {
                    "current": "$",
                    "number": 2.1,
                    "unit": "M"
                },
                "total": "$60M",
                "percent": "-3.5%",
                "direction": "decrease"
            },
        ],
        "spendData": {
            header: {
                id: 0,
                title: 'Total Spend',
                total: '$10M',
                incremental: '+$5M',
                percent: '+100%',
                direction: 'increase'
            },
            body: [
                {
                    id: 0,
                    category: "Local-National",
                    children: [
                        {
                            id: 0,
                            title: '',
                            total: '',
                            incremental: '',
                            percent: '',
                            direction: ''
                        }, {
                            id: 1,
                            title: 'Local Spend',
                            total: '$12M',
                            incremental: '+$2.5M',
                            percent: '+12%',
                            direction: 'increase',
                            chart: {
                                results: 47,
                                compared: 42
                            }
                        }, {
                            id: 2,
                            title: 'National Spend',
                            total: '$17M',
                            incremental: '+$3.7M',
                            percent: '+7.5%',
                            direction: 'increase',
                            chart: {
                                results: 53,
                                compared: 58
                            }
                        }]
                }, {
                    id: 1,
                    category: "Product-Brand",
                    children: [
                        {
                            id: 0,
                            title: '',
                            total: '',
                            incremental: '',
                            percent: '',
                            direction: ''
                        }, {
                            id: 1,
                            title: 'Product Spend',
                            total: '$6M',
                            incremental: '+$1.3M',
                            percent: '+22.4%',
                            direction: 'increase',
                            chart: {
                                results: 55,
                                compared: 57
                            }
                        }, {
                            id: 2,
                            title: 'Brand Spend',
                            total: '$9.3M',
                            incremental: '+$300K',
                            percent: '+13.1%',
                            direction: 'increase',
                            chart: {
                                results: 45,
                                compared: 43
                            }
                        }]
                }
            ]
        }
    };
});