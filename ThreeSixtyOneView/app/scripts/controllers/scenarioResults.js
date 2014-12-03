'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl', function ($scope, $window, resultsData) {

    $scope.kpiData = resultsData.kpiData;

    $scope.data1 = [{
        'results': 47,
        'compared': 42,
        'category': 'Local Spend',
        'color': 1
    }, {
        'results': 53,
        'compared': 58,
        'category': 'National Spend',
        'color': 2
    }];

    $scope.data2 = [{
        'results': 55,
        'compared': 57,
        'category': 'Product Spend',
        'color': 3
    }, {
        'results': 45,
        'compared': 43,
        'category': 'Brand Spand',
        'color': 4
    }];

    $window.addEventListener('resize', function () {
        $scope.$broadcast('windowResize');
    });

}).factory('resultsData', function () {
    return {
        "kpiData": [
            {
                "title": "awareness",
                "incremental": {
                    "number": 432,
                    "unit": "K"
                },
                "total": "3.6M",
                "percent": "+12%",
                "direction": "increase"
            }, {
                "title": "web visit",
                "incremental": {
                    "number": 77,
                    "unit": "K"
                },
                "total": "10.3M",
                "percent": "+7.5%",
                "direction": "increase"
            }, {
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
        ]
    };
})