
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
                filterUpdateCallback: '&',
                allDimensionsSchema: '=',
                dimensionIndex: '='
            },
            templateUrl: function(elem, attrs){
                return "views/directives/ms_" + attrs.dimensionType + "_dimension_card.tpl.html";
            },
            link: function(scope) {

                if(!!scope.allDimensionsSchema) {
                    scope.dimensionSchema = scope.allDimensionsSchema[scope.dimensionIndex];
                }
                scope.filtersModal = function(category) {
                    var filteredDimensions = DimensionService.getSelectedDimensions(scope.allDimensionsData, scope.allDimensionsSchema),
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
                scope.isMeasure = function(dimension) {
                    return dimension.type === 'MeasureDimension' ? true : false;
                };
                scope.isEmpty = function(item, dimension) {
                    var memberLength = _.filter(dimension.members, function(member) { return member.isSelected; }).length;
                    if (dimension.type === 'MeasureDimension') {
                        if (memberLength === 1 && item.isSelected) {
                            return true;
                        } else { return false; }
                    } else { return false; }
                };
            }
        };
    }]);
