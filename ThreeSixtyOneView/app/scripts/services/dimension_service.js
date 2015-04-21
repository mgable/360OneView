'use strict';

/**
 * @ngdoc service
 * @name ThreeSixtyOneView.DimensionService
 * @description
 * # DimensionService
 * Service in the ThreeSixtyOneView.
 */
 angular.module('ThreeSixtyOneView.services')
    .service('DimensionService', function DimensionService() {

        this.getSelectedDimensions = function(dimensions) {
            var tmpDimensions = angular.copy(dimensions);
            return _.filter(tmpDimensions, function(tmpDimension) {
                tmpDimension.members = _.filter(tmpDimension.members, function(member) { return member.isSelected === true; });
                return tmpDimension.isSelected === true;
            });
        };

        this.getSelectedTimeDimension = function(timeDimension, time) {
            var tmpTimeDimension = angular.copy(timeDimension);
            tmpTimeDimension.attributes = _.filter(tmpTimeDimension.attributes, function(attribute) { return attribute.label === time; });
            return tmpTimeDimension;
        };

        this.getDimensionsLabel = function(dimensions) {
            var tmpDimensions = dimensions,
                dimensionLabel = [];
            _.each(tmpDimensions, function(tmpDimension) {
                if (tmpDimension.isSelected) {
                    var selectedAttributes = _.filter(tmpDimension.attributes, function(attribute) { return attribute.isSelected === true; }),
                        attributeLabel = '';
                    if (0 < selectedAttributes.length && selectedAttributes.length < tmpDimension.attributes.length) {
                        attributeLabel = '(' + _.pluck(selectedAttributes, 'label').join() + ')';
                    } else {
                        attributeLabel = '';
                    }
                    dimensionLabel.push(tmpDimension.label + attributeLabel);
                }
            });
            return dimensionLabel.join(', ');
        };

});
