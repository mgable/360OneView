
'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directives:msDimensionCard
 * @description
 * # ms-dimension-card
 */

angular.module('ThreeSixtyOneView.directives')
    .directive('msDimensionCard', ['PivotMetaService', 'DialogService', 'DimensionService', function(PivotMetaService, DialogService, DimensionService) {
        return {
            restrict: "AE",
            replace: true,
            scope: {
                dimensionData: '=',
                allDimensionsData: '=',
                filtersData: '=',
                templateType: '@',
                filterUpdateCallback: '&'
            },
            templateUrl: function(elem, attrs){
                return "views/directives/ms_" + attrs.dimensionType + "_dimension_card.tpl.html";
            },
            link: function(scope) {
                scope.filtersModal = function(category) {
                    var filteredDimensions = DimensionService.getSelectedDimensions(scope.allDimensionsData),
                        filtersModalCallback = function(newFilterData) {
                            scope.filterUpdateCallback({addedMembers: newFilterData});
                    };
                    DialogService.filtersModal(category, scope.filtersData, undefined, filteredDimensions, filtersModalCallback);
                };
            }
        };
    }]);
