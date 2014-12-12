'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioResultCtrl
* @description
* # scenarioResultCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl', function ($scope, resultsData) {

    var init = function() {

        $('.Scenario').css('height', 'auto');

    };

    $scope.srShow    = false;
    $scope.saveAs    = false;
    $scope.draftView = false;
    $scope.isTest    = null;

    $scope.viewName  = resultsData.viewData.name;
    $scope.filters   = resultsData.viewData.filters;

    $scope.kpiData         = resultsData.kpiData;
    $scope.spendData       = resultsData.spendData;
    $scope.spendDataHeader = $scope.spendData.header;
    $scope.spendDataBody   = $scope.spendData.body;

    $scope.chartData = [];
    _.each($scope.spendDataBody, function(v) {
        var chartSubData = {};
        chartSubData.id = v.id;
        chartSubData.name = v.category;
        chartSubData.data = [];
        _.each(v.children, function(v1) {
            if (_.has(v1, 'chart')) {
                chartSubData.data.push(v1.chart);
            }
        });
        $scope.chartData.push(chartSubData);
    });


    $scope.viewsList = resultsData.viewsList;
    $scope.selectedView = $scope.viewsList[0];
    $scope.setView = function(view) {
        $scope.selectedView = view;
    };


    $scope.addSign = function(direction) {
        return direction === 'increase' ? '+' : '-';
    };
    $scope.addArrow = function(direction) {
        return direction === 'increase' ? 'arrow-up' : 'arrow-down';
    };


    $scope.saveView = function() {
        if($scope.draftView) {
            $scope.viewName = resultsData.viewData.name;
        }
        $scope.draftView = false;
    };
    $scope.startSaveAs = function() {
        $scope.saveAsName = $scope.viewName;
        $scope.saveAs = true;
    };
    $scope.renameAction = function (event) {
        if(event.keyCode === 13) {
            $scope.finishSaveAs(true);
        } else if(event.keyCode === 27) {
            $scope.finishSaveAs(false);
        }
    };
    $scope.finishSaveAs = function(save) {
        if(save) {
            $scope.viewName = $scope.saveAsName;
            $scope.draftView = false;
        }
        $scope.saveAs = false;
    };

    init();

}).factory('resultsData', function () {
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
                    "number": 77,
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
                                categoryId: 0,
                                colorId: 1,
                                id: 1,
                                results: 47,
                                compared: 42,
                                category: 'Local Spend'
                            }
                        }, {
                            id: 2,
                            title: 'National Spend',
                            total: '$17M',
                            incremental: '+$3.7M',
                            percent: '+7.5%',
                            direction: 'increase',
                            chart: {
                                categoryId: 0,
                                colorId: 2,
                                id: 2,
                                results: 53,
                                compared: 58,
                                category: 'National Spend'
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
                                categoryId: 1,
                                colorId: 3,
                                id: 1,
                                results: 55,
                                compared: 57,
                                category: 'Product Spend'
                            }
                        }, {
                            id: 2,
                            title: 'Brand Spend',
                            total: '$9.3M',
                            incremental: '+$300K',
                            percent: '+13.1%',
                            direction: 'increase',
                            chart: {
                                categoryId: 1,
                                colorId: 4,
                                id: 2,
                                results: 45,
                                compared: 43,
                                category: 'Brand Spand'
                            }
                        }]
                }
            ]
        },
        "viewsList": [
            {name: 'Joe\'s View',id: '1'},
            {name: 'Fiesta 2015',id: '2'},
            {name: 'Region by nameplate 2013',id: '3'},
            {name: 'Behrooz\'s View',id: '4'}
        ],
        "viewData": {
            id: '4',
            name: 'Behrooz\'s View',
            filters: [
                {
                    name: 'Spend Filters',
                    items: [
                        { name: 'Product', value: 'Fiesta' },
                        { name: 'Touchpoint', value: 'All' },
                        { name: 'Geography', value: 'All' },
                        { name: 'Time', value: '2015' },
                    ]
                }, {
                    name: 'KPI Filters',
                    items: [
                        { name: 'Product', value: 'Fiesta' },
                        { name: 'Geography', value: 'All' },
                        { name: 'Sales Channel', value: 'Online' },
                        { name: 'Time', value: 'All' },
                    ]
                }
            ]
        }
    };
});