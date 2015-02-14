'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('PivotModel', ["$location", "Resource", "CONFIG", "SERVER", function ($location, Resource, CONFIG, SERVER) {
	var resource = new Resource(SERVER[$location.host()]  + CONFIG.application.api.pivotdata),
		getNumberOfColumns = function(response) {
			var output = !!response[0][0].key.value.coordinates.columnAddresses ? response[0][0].key.value.coordinates.columnAddresses.length : 1;
			return output;
		},
		getNumberOfRows = function(response) {
			var output = !!response[0][0].key.value.coordinates.rowAddresses ? response[0][0].key.value.coordinates.rowAddresses.length : 1;
			return output;
		},
		transformResponse = function(data) {
			if(data === '') {
				return data;
			}

			var response = JSON.parse(data);
			
			if(response.length > 0) {
				var i, j,
					tableTree = {},
					numCols = getNumberOfColumns(response),
					numRows = getNumberOfRows(response),
					pivotTable = [],
					columnIndex = numRows,
					helperObject = [];

				for(i = 0; i < numCols; i++) {
					pivotTable[i] = {};
					helperObject[i] = {};
					for(j = 0; j < numRows; j++) {
						pivotTable[i][j] = '';
					}
				}

				_.each(response, function(row, rowIndex) {
					pivotTable[rowIndex + numCols] = {};
					helperObject[rowIndex + numCols] = {};
					_.each(row[0].key.value.coordinates.rowAddresses, function(rowElement, rowElementIndex) {
						pivotTable[rowIndex + numCols][rowElementIndex] = rowElement.cellValue.specification.members[0].label;
						pivotTable[numCols - 1][rowElementIndex] = rowElement.scope.level.label;
					});
					_.each(row, function(column) {
						if(!column.key.value.coordinates.columnAddresses) {
							if(!!tableTree.Values) {
								tableTree.Values.push({value: column.value.value, format: column.format});
							} else {
								tableTree.Values = [{value: column.value.value, format: column.format}];
							}
						} else {
							var branch = [];
							_.each(column.key.value.coordinates.columnAddresses, function(columnElement, columnIndex) {
								var columnLabel = columnElement.cellValue.specification.members[0].label;

								if(columnIndex === 0 && numCols > 1) {
									tableTree[columnLabel] = branch[columnIndex] = tableTree[columnLabel] || {};
								} else if(columnIndex === 0) {
									tableTree[columnLabel] = branch[columnIndex] = tableTree[columnLabel] || [];
									branch[columnIndex][rowIndex] = {value: column.value.value, format: column.format};
								} else if(columnIndex === numCols - 1) {
									branch[columnIndex - 1][columnLabel] = branch[columnIndex] = branch[columnIndex - 1][columnLabel] || [];
									branch[columnIndex][rowIndex] = {value: column.value.value, format: column.format};
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
							pivotTable[index + numCols][columnIndex] = value.value;
							helperObject[index + numCols][columnIndex] = value.format;
						});
						_.each(columnLabels, function(columnLabel, index) {
							pivotTable[index] = pivotTable[index] || {};
							pivotTable[index][columnIndex] = columnLabel;
							helperObject[index] = helperObject[index] || {};
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

				return {formatted: pivotTable, original: response, helperObject: helperObject};
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
