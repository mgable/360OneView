'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl', function ($scope, $window, resultsData) {

    $('.Scenario').css('height', 'auto');

    $scope.kpiData = resultsData.kpiData;

    $scope.data1 = resultsData.spendData1;
    $scope.data2 = resultsData.spendData2;
    $scope.data3 = resultsData.spendData3;
    $scope.data4 = resultsData.spendData4;

    $scope.idSelectedRow = 1;
    $scope.salesData = resultsData.kpiData[0].monthly;
    $scope.setSelected = function (idSelectedRow) {
        $scope.idSelectedRow = idSelectedRow;
        $scope.salesData = resultsData.kpiData[$scope.idSelectedRow-1].monthly;
    };

    $window.addEventListener('resize', function () {
        $scope.$broadcast('windowResize');
    });

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
                "direction": "increase",
                "monthly": [{
                    "This Year": 50,
                    "Last Year": 20,
                    "quarter": "Sept 2014"
                }, {
                    "This Year": 54,
                    "Last Year": 24,
                    "quarter": "Oct 2014"
                }, {
                    "This Year": 62,
                    "Last Year": 57,
                    "quarter": "Nov 2014"
                }]
            }, {
                "id": 2,
                "title": "web visit",
                "incremental": {
                    "number": 77,
                    "unit": "K"
                },
                "total": "10.3M",
                "percent": "+7.5%",
                "direction": "increase",
                "monthly": [{
                    "This Year": 24,
                    "Last Year": 30,
                    "quarter": "Sept 2014"
                }, {
                    "This Year": 65,
                    "Last Year": 54,
                    "quarter": "Oct 2014"
                }, {
                    "This Year": 32,
                    "Last Year": 43,
                    "quarter": "Nov 2014"
                }]
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
                "direction": "increase",
                "monthly": [{
                    "This Year": 30,
                    "Last Year": 35,
                    "quarter": "Sept 2014"
                }, {
                    "This Year": 14,
                    "Last Year": 34,
                    "quarter": "Oct 2014"
                }, {
                    "This Year": 52,
                    "Last Year": 57,
                    "quarter": "Nov 2014"
                }]
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
                "direction": "increase",
                "monthly": [{
                    "This Year": 13,
                    "Last Year": 22,
                    "quarter": "Sept 2014"
                }, {
                    "This Year": 32,
                    "Last Year": 34,
                    "quarter": "Oct 2014"
                }, {
                    "This Year": 56,
                    "Last Year": 43,
                    "quarter": "Nov 2014"
                }]
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
                "direction": "decrease",
                "monthly": [{
                    "This Year": 12,
                    "Last Year": 32,
                    "quarter": "Sept 2014"
                }, {
                    "This Year": 43,
                    "Last Year": 24,
                    "quarter": "Oct 2014"
                }, {
                    "This Year": 43,
                    "Last Year": 34,
                    "quarter": "Nov 2014"
                }]
            },
        ],
        "spendData1": [{
            'id': 1,
            'results': 47,
            'compared': 42,
            'category': 'Local Spend',
        }, {
            'id': 2,
            'results': 53,
            'compared': 58,
            'category': 'National Spend'
        }],
        "spendData2": [{
            'id': 3,
            'results': 55,
            'compared': 57,
            'category': 'Product Spend'
        }, {
            'id': 4,
            'results': 45,
            'compared': 43,
            'category': 'Brand Spand'
        }],
        "spendData3": [{
            'id': 1,
            'results': 47,
            'compared': 42,
            'category': 'Local Spend'
        }, {
            'id': 2,
            'results': 53,
            'compared': 58,
            'category': 'National Spend'
        }],
        "spendData4": [{
            'id': 3,
            'results': 55,
            'compared': 57,
            'category': 'Product Spend'
        }, {
            'id': 4,
            'results': 45,
            'compared': 43,
            'category': 'Brand Spand'
        }],
    };
})