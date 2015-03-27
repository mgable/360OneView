
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
                };

                scope.getFilterArray = function(dimension) {
                    var dimensionLength = dimension.members.length,
                        filterArray = _.pluck(_.filter(dimension.members, function(dimension) {
                            return dimension.isSelected === true;
                        }), 'label');
                    return (filterArray.length === dimensionLength) ? 'All' : filterArray.join();
                };

                scope.filtersModal = function(dimensionData) {
                    var filteredDimensions = getFilteredDimensions(scope.allDimensionsData),
                        addedFilters = PivotMetaService.addAllFilters(filteredDimensions);
                    var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl', {
                        dimension: _.find(filteredDimensions, function(v) {
                            return dimensionData.id === v.id;
                        }),
                        addedFilters: addedFilters,
                        viewData: {},
                        dimensions: filteredDimensions
                    }, {
                        windowSize: 'lg',
                        windowClass: 'filters-modal'
                    });

                    dialog.result.then(function(data) {});
                };

            }
        };
    }]);
