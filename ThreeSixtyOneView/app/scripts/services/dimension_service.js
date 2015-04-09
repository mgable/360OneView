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
            tmpTimeDimension.members = _.filter(tmpTimeDimension.members, function(member) { return member.label === time; });
            return tmpTimeDimension;
        };

        this.getDimensionsLabel = function(dimensions) {
            var tmpDimensions = dimensions,
                dimensionLabel = [];
            _.each(tmpDimensions, function(tmpDimension) {
                if (tmpDimension.isSelected) {
                    var selectedMembers = _.filter(tmpDimension.members, function(member) { return member.isSelected === true; }),
                        memberLabel = '';
                    if (0 < selectedMembers.length && selectedMembers.length < tmpDimension.members.length) {
                        memberLabel = '(' + _.pluck(selectedMembers, 'label').join() + ')';
                    } else {
                        memberLabel = '';
                    }
                    dimensionLabel.push(tmpDimension.label + memberLabel);
                }
            });
            return dimensionLabel.join(', ');
        };

});
