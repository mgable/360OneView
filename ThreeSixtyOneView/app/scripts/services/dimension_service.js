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

        this.getDimensionsLabel = function(dimensions) {
            var tmpDimensions = dimensions,
                dimensionLabel = [];
            _.each(tmpDimensions, function(tmpDimension) {
                if (tmpDimension.isSelected) {
                    var selectedAttributes = _.filter(tmpDimension.members, function(attribute) { return attribute.isSelected === true; }),
                        attributeLabel = '';
                    if (0 < selectedAttributes.length && selectedAttributes.length < tmpDimension.members.length) {
                        attributeLabel = '(' + _.pluck(selectedAttributes, 'label').join() + ')';
                    } else {
                        attributeLabel = '';
                    }
                    dimensionLabel.push(tmpDimension.label + attributeLabel);
                }
            });
            return dimensionLabel.join(', ');
        };

}]);
