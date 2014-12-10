'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioResultCtrl
* @description
* # scenarioResultCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl', function ($scope, resultsData) {

    $scope.srShow = false;
    $scope.isTest = null;
    $('.Scenario').css('height', 'auto');

    $scope.kpiData = resultsData.kpiData;
    $scope.spendDataHeader = resultsData.spendData[0];
    $scope.spendDataBody = _.rest(resultsData.spendData,1);

    $scope.data1 = resultsData.spendDataBarChart.slice(0,2);
    $scope.data2 = resultsData.spendDataBarChart.slice(2,4);

    $scope.idSelectedRow = 1;
    $scope.lineChartData = resultsData.kpiData[0].monthly;
    $scope.setSelected = function (idSelectedRow) {
        $scope.idSelectedRow = idSelectedRow;
        $scope.lineChartData = resultsData.kpiData[$scope.idSelectedRow-1].monthly;
    };

    $scope.dropdownItems = resultsData.dropdownItems;
    $scope.selectedDropdownId = "1";
    $scope.onDropdownSelect = function(selectedDropdown){
      $scope.selectedDropdownId = selectedDropdown.id;
    }
    $scope.selectInitial = function(id){
        for (var i = 0; i < $scope.dropdownItems.length; i++) {
            if ($scope.dropdownItems[i].id == id) {
              return $scope.dropdownItems[i].description;
            }
        }
    }

    $scope.addSign =function(direction) {
        if (direction === 'increase')
            return '+';
        else
            return '-';
    }

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
        "spendData": [
            {
                id: 0,
                'title': 'Total Spend',
                'total': '$10M',
                'incremental': '+$5M',
                'percent': '+100%'
            }, {
                id: 1,
                'title': '',
                'total': '',
                'incremental': '',
                'percent': ''
            }, {
                id: 2,
                'title': 'Local Spend',
                'total': '$12M',
                'incremental': '+$2.5M',
                'percent': '+12%'
            }, {
                id: 3,
                'title': 'National Spend',
                'total': '$17M',
                'incremental': '+$3.7M',
                'percent': '+7.5%'
            }, {
                id: 4,
                'title': '',
                'total': '',
                'incremental': '',
                'percent': ''
            }, {
                id: 5,
                'title': 'Product Spend',
                'total': '$6M',
                'incremental': '+$1.3M',
                'percent': '+22.4%'
            }, {
                id: 6,
                'title': 'Brand Spend',
                'total': '$9.3M',
                'incremental': '+$300K',
                'percent': '+13.1%'
            }
        ],
        "spendDataBarChart": [
            {
                'id': 1,
                'results': 47,
                'compared': 42,
                'category': 'Local Spend',
            }, {
                'id': 2,
                'results': 53,
                'compared': 58,
                'category': 'National Spend'
            }, {
                'id': 3,
                'results': 55,
                'compared': 57,
                'category': 'Product Spend'
            }, {
                'id': 4,
                'results': 45,
                'compared': 43,
                'category': 'Brand Spand'
            }
        ],
        "dropdownItems": [
            {
                "id": 1,
                "description": "Goals"
            }, {
                "id": 2,
                "description": "Goals Number 1"
            }, {
                "id": 3,
                "description": "Goals Number 2"
            }, {
                "id": 4,
                "description": "Goals Number 3"
            }
        ]
    };
})