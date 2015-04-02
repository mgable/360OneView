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
            if (_.isArray(dimensions)) {
                return _.filter(angular.copy(dimensions), function(v) {
                    v.members = _.filter(v.members, function(v1) {
                        return v1.isSelected === true;
                    });
                    return v.isSelected === true;
                });
            }
        };

        this.generateDimensionsLabels = function(dimensions) {
            var labelsArray = [];
            _.each(dimensions, function(v) {
                if (v.isSelected) {
                    var filtered = _.filter(v.members, function(v1) { return v1.isSelected === true; }),
                        childrenLabelsArray;
                    if (0 < filtered.length && filtered.length < v.members.length) {
                        childrenLabelsArray = '(' + _.pluck(filtered, 'label').join() + ')';
                    } else {
                        childrenLabelsArray = '';
                    }
                    labelsArray.push(v.label + childrenLabelsArray);
                }
            });
            return labelsArray.join();
        };

        this.switchTimeDimension = function(timeDimension, time) {
            if(!_.isUndefined(timeDimension)) {
                var tmpTimeDimension = angular.copy(timeDimension);
                switch (time)
                {
                    case "Weekly":
                        tmpTimeDimension.members = tmpTimeDimension.members.slice(4,5);
                        break;
                    case "Monthly":
                        tmpTimeDimension.members = tmpTimeDimension.members.slice(3,5);
                        break;
                    case "Quarterly":
                        tmpTimeDimension.members = tmpTimeDimension.members.slice(2,5);
                        break;
                    default:
                        tmpTimeDimension.members = tmpTimeDimension.members;
                        break;
                }
                return tmpTimeDimension;
            }
        };

});
