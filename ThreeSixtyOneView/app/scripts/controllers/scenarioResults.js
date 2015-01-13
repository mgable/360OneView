'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioResultCtrl
* @description
* # scenarioResultCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl',
    ['$scope', 'resultsData', 'Scenarios', 'DialogService', 'PivotViewService', 'CubeService', 'PivotIntermediatesService', '$q',
    function ($scope, resultsData, Scenarios, DialogService, PivotViewService, CubeService, PivotIntermediatesService, $q) {

    // private variables
    var cnt = 0;

    // get the data for spend summary chart
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
    },
    // delete a view
    deleteView = function(cubeId, viewId) {
        PivotViewService.deleteView(viewId, cubeId).then(function() {
            $scope.viewsList = _.reject($scope.viewsList, function(view) { return view.id === viewId; });
        });
    },
    // save the view
    updateView = function(cubeId, view) {
        _.each(view.filters, function(filter) {
            filter.id = 0;
        });
        return PivotViewService.updateView(view, cubeId).then(function(response) {
            return response;
        });
    },
    // rename the view
    renameView = function(cubeId, view) {
        PivotViewService.renameView(view.id, cubeId, view.name);
    },
    // create a new view
    createView = function(cubeId, view, viewList) {
        var i;
        $scope.viewsList = viewList;
        // remove conflicting elements from the view
        view.id = null;
        for(i = 0; i < view.filters.length; i++) {
            view.filters[i].id = null;
        }

        PivotViewService.createView(view, cubeId).then(function(view) {
            $scope.viewData = view;
            $scope.viewName = view.name;
            $scope.added = PivotIntermediatesService.setUpAddedLevels(view.columns.concat(view.rows));
            $scope.viewsList.unshift(view);
            $scope.addedFilters = PivotIntermediatesService.getAddedFilters(view.filters, $scope.dimensions);
        });
    },
    // init function
    init = function() {
        // scope variables
        $scope.srShow    = false;
        $scope.saveAs    = false;
        $scope.rename    = false;
        $scope.isTest    = null;

        $scope.viewData   = [];
        $scope.viewName   = $scope.views.currentView.name;
        $scope.dimensions = [];
        $scope.added      = {};

        $scope.selectedView      = Scenarios[0];
        $scope.spendDatumHeader  = resultsData.spendData.header;
        $scope.chartData         = [];

        $scope.addedFilters = {};
        $scope.categorizedValue = [];
        PivotIntermediatesService.initModel($scope.selectedScenarioElement.cubeMeta, $scope.cubeId)
            .then(function(result) {
                var foundView = _.find(result.viewsList, function(view){ return view.id == result.view.id; });
                if (foundView) {
                    $scope.draftView = foundView.name.substring(0, 8) === 'Draft - ';
                }
                $scope.viewData = result.view.rows.concat(result.view.columns);
                $scope.added = PivotIntermediatesService.setUpAddedLevels(result.view.columns.concat(result.view.rows));
                $scope.dimensions = result.dimensions;

                $scope.membersList = PivotIntermediatesService.generateMembersList(result.dimensions);
                $scope.addedFilters = PivotIntermediatesService.getAddedFilters(result.view.filters, result.dimensions);
                $scope.categorizedValue = PivotIntermediatesService.generateCategorizeValueStructure($scope.addedFilters, result.dimensions, result.view);
            });

        angular.element('.Scenario').css('height', 'auto');
        getChartData();
    };

    // get KPI raw data
    $scope.getKpiData = function() {
        return resultsData.kpiData;
    };
    // get spend raw data
    $scope.getSpendDataBody = function() {
        return resultsData.spendData.body;
    };
    // get compared views list
    $scope.getComparedViews = function() {
        return Scenarios;
    }
    // set compared view
    $scope.setComparedView = function(view) {
        $scope.selectedView = view;
    };
    // add sign to KPI summary
    $scope.addSign = function(direction) {
        return direction === 'increase' ? '+' : '-';
    };
    // add arrow to KPI summary
    $scope.addArrow = function(direction) {
        return direction === 'increase' ? 'arrow-up' : 'arrow-down';
    };
    // reset the view to the last saved state
    $scope.resetView = function() {
        if($scope.draftView) {
            var originalViewName = $scope.viewName.substring(8);
            var originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;
            var draftViewId = $scope.viewData.id;

            $scope.loadView($scope.cubeId, originalViewId);
            deleteView($scope.cubeId, draftViewId);
            $scope.draftView = false;
        }
    };
    // save the draft view
    $scope.saveDraftView = function() {
        if(!$scope.draftView) {
            $scope.draftView = true;
            var draftView = angular.copy($scope.viewData);
            draftView.name = 'Draft - ' + draftView.name;
            createView($scope.cubeId, draftView, $scope.viewsList);
        } else {
            updateView($scope.cubeId, $scope.viewData);
        }
    };
    // save the changes in the current view
    $scope.saveView = function() {
        if($scope.draftView) {
            var originalViewName = $scope.viewName.substring(8);
            var originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;
            var draftViewId = $scope.viewData.id;

            $scope.viewData.name = originalViewName;
            $scope.viewData.id = originalViewId;
            updateView($scope.cubeId, $scope.viewData).then(function(view) {
                $scope.viewData = view;
                $scope.viewName = view.name;
                $scope.added = PivotIntermediatesService.setUpAddedLevels(view.columns.concat(view.rows));
            });
            deleteView($scope.cubeId, draftViewId);
            $scope.draftView = false;
        }
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

            renameView($scope.cubeId, $scope.viewData);

            $scope.viewRecentViews = false;
        } else if (save && !$scope.rename) {
            $scope.viewData.name = $scope.saveAsName;
            $scope.viewData.id = null;
            createView($scope.cubeId, $scope.viewData, $scope.viewsList);
        }

        $scope.saveAs = false;
    };
    // open/dismiss filters selection modal
    $scope.filtersModal = function(category) {
        var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
            {cat: category, addedFilters: $scope.addedFilters, viewData: $scope.viewData, dimensions: $scope.dimensions},
            {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

        dialog.result.then(function(data) {
            $scope.addedFilters = data;
            $scope.categorizedValue = PivotIntermediatesService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.viewData);
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