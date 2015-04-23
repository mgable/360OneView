
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
                categorizedData: '=',
                templateType: '=',
                filterUpdateCallback: '&'
            },
            templateUrl: function(elem, attrs){
                return "views/directives/ms_" + attrs.dimensionType + "_dimension_card.tpl.html";
            },
            link: function(scope) {
                scope.filtersModal = function(category) {
                    var filteredDimensions = DimensionService.getSelectedDimensions(scope.allDimensionsData),
                        filteredDimension = _.find(filteredDimensions, function(v) { return category.id === v.id; }),
                        filtersModalCallback = function(newFilterData) {
                            scope.filterUpdateCallback({addedMembers: newFilterData});
                    };
                    DialogService.filtersModal(filteredDimension, scope.filtersData, scope.viewData, filteredDimensions, filtersModalCallback);
                };
                scope.getFormattedLabel = function(categorizedData) {
                    if (categorizedData.selected < categorizedData.total) {
                        return categorizedData.label.join(', ');
                    } else {
                        return 'All';
                    }
                };
            }
        };
    }]);
