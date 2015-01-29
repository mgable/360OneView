'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ReportsModel', ["$location", "Resource", "CONFIG", "SERVER", function ReportsModel($location, Resource, CONFIG, SERVER) {
    var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.reports),
    	transformResponse = function(data) {
    		var response = JSON.parse(data),
    			reportTree = [];

            _.each(response.cells, function(cell, cellIndex) {
                _.each(cell, function(row, rowIndex) {
                    if(!!row[0].key.value.coordinates.measure) {
                        reportTree[cellIndex] = reportTree[cellIndex] || {};
                        reportTree[cellIndex][row[0].key.value.coordinates.measure.label] = row[0].value.value;
                    } else {
                        _.each(row[0].key.value.coordinates.rowAddresses[0].cellValue.specification.members, function(member, memberIndex) {
                            reportTree[cellIndex] = reportTree[cellIndex] || {};
                            reportTree[cellIndex][member.label] = row[0].value.value;
                        });
                    }
                });
            });

            return reportTree;
    	};

    return {
        resource: resource,
        config: {},
        reportConfig: {
        	transformResponse: function(data) { return transformResponse(data); }
        }
    };
}]);
