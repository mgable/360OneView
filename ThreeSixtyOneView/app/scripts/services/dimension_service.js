'use strict';

/**
 * @ngdoc service
 * @name ThreeSixtyOneView.DimensionService
 * @description
 * # DimensionService
 * Service in the ThreeSixtyOneView.
 */
 angular.module('ThreeSixtyOneView.services')
    .service('DimensionService', ["$rootScope", "ManageTemplatesService", "EVENTS",
        function DimensionService($rootScope, ManageTemplatesService, EVENTS) {

        var allDimensions = {};

        this.getDimensions = function(templateId) {
            if (!_.has(allDimensions, templateId)) {
                ManageTemplatesService.buildDimensionsTree(templateId).then(function(dimensions) {
                    allDimensions[templateId] = dimensions;
                    $rootScope.$broadcast(EVENTS.dimensionsIsLoaded, allDimensions[templateId]);
                    return allDimensions[templateId];
                });
            } else {
                $rootScope.$broadcast(EVENTS.dimensionsIsLoaded, allDimensions[templateId]);
                return allDimensions[templateId];
            }
        };

        this.getSelectedDimensions = function(dimensions, schema) {
            var tmpDimensions = [];
            _.each(schema, function(_dimension, _dimensionIndex) {
                var dimension = false;
                if(_dimension.isSelected) {
                    dimension = {
                        id: _dimension.id,
                        label: _dimension.label,
                        members: []
                    };
                    _.each(_dimension.members, function(_member, _memberIndex) {
                        if(_member.isSelected) {
                            dimension.members.push(dimensions[_dimensionIndex].members[_memberIndex]);
                        }
                    });
                    tmpDimensions.push(dimension);
                }
            });
            return tmpDimensions;
        };

        this.getSelectedDimensionsLabels = function(dimensions, categorizedValues, type) {
            var maxMembers = 2,
                dimensionLabelList = [];
            _.each(dimensions, function(dimension, index) {
                var membersLabel = '',
                    categorizedValue = categorizedValues[index];
                if (dimension.isSelected) {
                    if (type === 'kpi') {
                        dimensionLabelList.push(dimension.label);
                    } else {
                        if (categorizedValue.selected < categorizedValue.total) {
                            if (categorizedValue.label.length < maxMembers) {
                                membersLabel = '(' + categorizedValue.label.join(', ') + ')';
                            } else {
                                membersLabel = '(' + categorizedValue.label.slice(0, maxMembers).join(', ') + '...)';
                            }
                        } else {
                            membersLabel = '';
                        }
                        dimensionLabelList.push(dimension.label + membersLabel);
                    }
                }
            });
            return dimensionLabelList.join(', ');
        };

}]);
