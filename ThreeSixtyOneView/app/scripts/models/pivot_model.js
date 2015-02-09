'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('PivotModel', ["$location", "Resource", "CONFIG", "SERVER", function ($location, Resource, CONFIG, SERVER) {
	var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.pivotdata),
		transformResponse = function(data) {
			if(data === '') {
				return data;
			}

			var response = JSON.parse(data);
			
			if(response.length > 0) {
				var i, j,
					tableTree = {},
					numCols = !!response[0][0].key.value.coordinates.columnAddresses ? response[0][0].key.value.coordinates.columnAddresses.length : 1,
					numRows = !!response[0][0].key.value.coordinates.rowAddresses ? response[0][0].key.value.coordinates.rowAddresses.length : 1,
					pivotTable = [],
					columnIndex = numRows;

				for(i = 0; i < numCols; i++) {
					pivotTable[i] = {};
					for(j = 0; j < numRows; j++) {
						pivotTable[i][j] = '';
					}
				}

				_.each(response, function(row, rowIndex) {
					pivotTable[rowIndex + numCols] = {};
					_.each(row[0].key.value.coordinates.rowAddresses, function(rowElement, rowElementIndex) {
						pivotTable[rowIndex + numCols][rowElementIndex] = rowElement.cellValue.specification.members[0].label;
						pivotTable[numCols - 1][rowElementIndex] = rowElement.scope.level.label;
					});
					_.each(row, function(column) {
						if(!column.key.value.coordinates.columnAddresses) {
							!!tableTree['Values'] ? tableTree['Values'].push(column.value.value) : tableTree['Values'] = [column.value.value];
						} else {
							var branch = [];
							_.each(column.key.value.coordinates.columnAddresses, function(columnElement, columnIndex) {
								var columnLabel = columnElement.cellValue.specification.members[0].label;

								if(columnIndex === 0 && numCols > 1) {
									tableTree[columnLabel] = branch[columnIndex] = tableTree[columnLabel] || {};
								} else if(columnIndex === 0) {
									tableTree[columnLabel] = branch[columnIndex] = tableTree[columnLabel] || [];
									branch[columnIndex][rowIndex] = column.value.value;
								} else if(columnIndex === numCols - 1) {
									branch[columnIndex - 1][columnLabel] = branch[columnIndex] = branch[columnIndex - 1][columnLabel] || [];
									branch[columnIndex][rowIndex] = column.value.value;
								} else {
									branch[columnIndex - 1][columnLabel] = branch[columnIndex] = branch[columnIndex - 1][columnLabel] || {};
								}
							});
						}
					});
				});

				var formPivotTable = function(tree, columnLabels) {
					if(angular.isArray(tree)) {
						_.each(tree, function(value, index) {
							pivotTable[index + numCols][columnIndex] = value;
						});
						_.each(columnLabels, function(columnLabel, index) {
							pivotTable[index] = pivotTable[index] || {};
							pivotTable[index][columnIndex] = columnLabel;
						});
						columnIndex++;
					} else if(angular.isObject(tree)) {
						_.each(tree, function(branch, columnLabel) {
							var newLabels = _.values(columnLabels);
							newLabels.push(columnLabel);
							formPivotTable(branch, newLabels);
						});
					}
				};
				formPivotTable(tableTree, []);

				return {formatted: pivotTable, original: response};
			}

			return response;
		};

	return {
		resource: resource,
		pivotConfig: {
			transformResponse: function(data) { return transformResponse(data); }
		}
	};
}]);
