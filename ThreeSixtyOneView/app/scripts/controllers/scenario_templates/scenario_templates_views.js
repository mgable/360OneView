'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ScenarioTemplatesScenarioTemplatesViewsCtrl
 * @description
 * # ScenarioTemplatesScenarioTemplatesViewsCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
    .controller('ScenarioTemplatesViewsCtrl', ['$scope', 'dimensionsData', function($scope, dimensionsData) {
        $scope.done = function(){
            console.info("done!!!!!");
        };
        $scope.spendDimensionsList = dimensionsData.spendDimensionsList;
        $scope.kpiDimensionsList = dimensionsData.kpiDimensionsList;
        $scope.getFilterArray = function(dimension) {
            var dimensionLength = dimension.children.length,
                filterArray = _.pluck(_.filter(dimension.children, function(dimension) { return dimension.isSelected === true; }), 'label');
            return (filterArray.length === dimensionLength) ? 'All' : filterArray.join();
        }
    }]).factory('dimensionsData', function() {
        var dimensionsData = {
            spendDimensionsList: [{
                id: 1,
                label: "VARIABLE",
                children: [
                    {isSelected: true, label: "National/Local"},
                    {isSelected: true, label: "Brand/Nameplate"},
                    {isSelected: false, label: "Touchpoint"}
                ]
                }, {
                    id: 2,
                    label: "PRODUCT",
                    children: [
                        {isSelected: false, label: "Nameplate"},
                        {isSelected: false, label: "Nameplate Category"}
                    ]
                }, {
                    id: 3,
                    label: "GEO",
                    children: [
                        {isSelected: true, label: "Region"},
                        {isSelected: true, label: "city"}
                    ]
                }, {
                    id: 4,
                    label: "YEAR",
                    children: [
                        {isSelected: true, label: "Year"},
                        {isSelected: false, label: "Half Year"},
                        {isSelected: false, label: "Quarter"},
                        {isSelected: true, label: "Month"},
                        {isSelected: false, label: "Weekly"},
                        {isSelected: true, label: "daily"}
                    ]
                }, {
                    id: 5,
                    label: "ONE CHILDREN",
                    children: [
                        {isSelected: true, label: "ONE CHILDREN"},
                    ]
            }],
            kpiDimensionsList: [{
                id: 1,
                label: "KPIs",
                children: [
                    { id: 1, label: "Revenue", isSelected: true, isLocked: true },
                    { id: 2, label: "Sales", isSelected: false, isLocked: false },
                    { id: 3, label: "Total Incentives", isSelected: true, isLocked: false },
                    { id: 4, label: "KPIs 4", isSelected: true, isLocked: true },
                    { id: 5, label: "KPIs 5", isSelected: true, isLocked: false },
                    { id: 6, label: "KPIs 6", isSelected: false, isLocked: false },
                    { id: 7, label: "KPIs 7", isSelected: false, isLocked: false },
                    { id: 8, label: "KPIs 8", isSelected: true, isLocked: false }
                ]
            }]
        };
        return dimensionsData;
    });
