'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioResultCtrl
* @description
* # scenarioResultCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl',
    ['$scope', 'resultsData', 'Scenarios', 'ManageAnalysisViewsService', 'ManageScenariosService', 'MetaDataService', '$interval', 'DialogService', 'PivotMetaService', '$q',
    function ($scope, resultsData, Scenarios, ManageAnalysisViewsService, ManageScenariosService, MetaDataService, $interval, DialogService, PivotMetaService, $q) {

    // private variables
    var cnt = 0,
        spendCubeMeta = _.find($scope.scenarioElements, function(v) {
            return v.cubeMeta.name === "TOUCHPOINT";
        }).cubeMeta,

    // get the data for spend summary chart
    getChartData = function() {
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
    initiateSpendModel = function(cubeMeta) {
        PivotMetaService.initModel(cubeMeta).then(function(result) {
            var foundView = _.find(result.viewsList, function(view){ return view.id === result.view.id; });
            if (foundView) {
                $scope.draftView = foundView.name.substring(0, 8) === 'Draft - ';
            }
            $scope.spendViewsList = result.viewsList;
            // $scope.spendViews.currentView = result.view;
            $scope.spendViewData = result.view;
            $scope.spendViewName = result.view.name;
            $scope.spendDimensions = result.dimensions;

            $scope.spendAdded = PivotMetaService.setUpAddedLevels(result.view.columns.concat(result.view.rows));
            $scope.spendMembersList = PivotMetaService.generateMembersList(result.dimensions);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(result.view.filters, result.dimensions);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, result.dimensions, result.view);
        });
    },
    // init function
    init = function() {
        // scope variables
        $scope.srShow    = false;
        $scope.isTest    = null;

        $scope.selectedView      = Scenarios[0];
        $scope.spendDatumHeader  = resultsData.spendData.header;
        $scope.chartData         = [];

        angular.element('.Scenario').css('height', 'auto');
        getChartData();

        initiateSpendModel(spendCubeMeta);

    };

    // spend cube id
    $scope.spendCubeId = spendCubeMeta.id;
    // returns list of all the views in the current cube
    $scope.getViewsList = function() {
        return $scope.spendViewsList;
    };
    // open the modal for the list of all views
    $scope.openAllViewsModal = function() {
        var dialog = DialogService.openLightbox('views/modal/pivot_builder_all_views.tpl.html', 'pivotBuilderAllViewsCtrl',
            {viewsList: $scope.spendViewsList, selectedViewId: $scope.spendViewData.id, e2e: $scope.e2e},
            {windowSize: 'lg', windowClass: 'pivotBuilderAllViewsModal'});

        dialog.result.then(function(data) {
            $scope.loadView($scope.spendCubeId, data);
        });
    };
    // load view
    $scope.loadView = function(cubeId, viewId) {
        ManageAnalysisViewsService.getView(viewId, cubeId).then(function(view) {
            // $scope.views.currentView = view;
            $scope.spendViewData = view;
            $scope.spendAdded = PivotMetaService.setUpAddedLevels(result.view.columns.concat(result.view.rows));
            $scope.spendMembersList = PivotMetaService.generateMembersList(result.dimensions);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(result.view.filters, result.dimensions);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, result.dimensions, result.view);
        });
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
    // open/dismiss filters selection modal
    $scope.filtersModal = function(category) {
        var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
            {cat: category, addedFilters: $scope.spendAddedFilters, viewData: $scope.spendViewData, dimensions: $scope.dimensions},
            {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

        dialog.result.then(function(data) {
            $scope.spendAddedFilters = data;
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, $scope.dimensions, $scope.spendViewData);
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