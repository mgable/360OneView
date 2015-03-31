
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
                allDimensionsData: '='
            },
            templateUrl: function(elem, attrs){
                return "views/directives/ms_" + attrs.dimensionType + "_dimension_card.tpl.html";
            },
            link: function(scope, element, attrs) {

                var filtersModalCallback = function(data) {
                    console.info('filtered data: ', data);
                };

                scope.getDimensionCardLabel = function(dimension) {
                    var dimensionLength = dimension.members.length,
                        filterArray = _.pluck(_.filter(dimension.members, function(dimension) {
                            return dimension.isSelected === true;
                        }), 'label');
                    return (filterArray.length === dimensionLength) ? 'All' : filterArray.join();
                };

                scope.filtersModal = function(category) {
                    var dimensions = DimensionService.getSelectedDimensions(scope.allDimensionsData),
                        addedFilters = PivotMetaService.addAllFilters(dimensions),
                        dimension = _.find(dimensions, function(v) { return category.id === v.id; });
                    DialogService.filtersModal(dimension, addedFilters, undefined, dimensions, filtersModalCallback);
                };

            }
        };
    }]);
