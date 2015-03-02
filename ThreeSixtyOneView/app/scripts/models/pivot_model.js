'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('PivotModel', ["$location", "Resource", "CONFIG", "ServerService", function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.pivotdata),
		pivotTable,
		// contains styling and formatting information
		helperObject,
		columnIndex,
		getNumberOfRows = function(response) {
			var output = !!response[0][0].key.value.coordinates.rowAddresses ? response[0][0].key.value.coordinates.rowAddresses.length : 1;
			return output;
		},
		getNumberOfColumns = function(response) {
			var output = !!response[0][0].key.value.coordinates.columnAddresses ? response[0][0].key.value.coordinates.columnAddresses.length : 1;
			return output;
		},
		getRowElements = function(row) {
			return row.key.value.coordinates.rowAddresses;
		},
		getColumnElements = function(column) {
			return column.key.value.coordinates.columnAddresses;
		},
		getElementLabel = function(element) {
			return element.cellValue.specification.members[0].label;
		},
		initializeTransformOutputs = function(numRows, numCols) {
			var i, j;
			pivotTable = [];
			helperObject = [];
			for(i = 0; i < numCols; i++) {
				pivotTable[i] = {};
				helperObject[i] = {};
				for(j = 0; j < numRows; j++) {
					pivotTable[i][j] = '';
				}
			}
		},
		formPivotTable = function(tree, numCols, columnLabels) {
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
					formPivotTable(branch, numCols, newLabels);
				});
			}
		},
		transformResponse = function(data) {
			if(data === '') {
				return data;
			}

			var response = JSON.parse(data);
			
			if(response.length > 0) {
				var tableTree = {},
					// number of selected dimensions in columns
					numCols = getNumberOfColumns(response),
					// number of selected dimensions in rows
					numRows = getNumberOfRows(response);

				// columns index start from row headers, e.g., if there are two row headers, first column is at index 2
				columnIndex = numRows;

				initializeTransformOutputs(numRows, numCols);

				_.each(response, function(row, rowIndex) {
					pivotTable[rowIndex + numCols] = {};
					helperObject[rowIndex + numCols] = {};
					_.each(getRowElements(row[0]), function(rowElement, rowElementIndex) {
						pivotTable[rowIndex + numCols][rowElementIndex] = getElementLabel(rowElement);
						pivotTable[numCols - 1][rowElementIndex] = rowElement.scope.level.label;
					});
					_.each(row, function(column) {
						if(!getColumnElements(column)) {
							if(!!tableTree.Values) {
								tableTree.Values.push({value: column.value.value, format: column.format});
							} else {
								tableTree.Values = [{value: column.value.value, format: column.format}];
							}
						} else {
							var branch = [];
							_.each(getColumnElements(column), function(columnElement, columnIndex) {
								var columnLabel = getElementLabel(columnElement);

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

				formPivotTable(tableTree, numCols, []);

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
