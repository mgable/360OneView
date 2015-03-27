
'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directives:msDimensionCard
 * @description
 * # ms-dimension-card
 */

angular.module('ThreeSixtyOneView.directives')
    .directive('msDimensionCard', ['PivotMetaService', 'DialogService', function(PivotMetaService, DialogService) {
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

                var getFilteredDimensions = function(dimension) {
                    return _.filter(angular.copy(dimension), function(v) {
                        v.members = _.filter(v.members, function(v1) {
                            return v1.isSelected === true;
                        });
                        return v.isSelected === true;
                    });
                },
                filtersModalCallback = function(data) {
                    console.info('filtered data: ', data);
                };

                scope.getFilterArray = function(dimension) {
                    var dimensionLength = dimension.members.length,
                        filterArray = _.pluck(_.filter(dimension.members, function(dimension) {
                            return dimension.isSelected === true;
                        }), 'label');
                    return (filterArray.length === dimensionLength) ? 'All' : filterArray.join();
                };

                scope.dimensions = getFilteredDimensions(scope.allDimensionsData);
                scope.addedFilters = PivotMetaService.addAllFilters(scope.dimensions);
                scope.filtersModal = function(category) {
                    var dimension = _.find(scope.dimensions, function(v) { return category.id === v.id; });
                    DialogService.filtersModal(dimension, scope.addedFilters, scope.viewData, scope.dimensions, filtersModalCallback);
                };

            }
        };
    }]);
