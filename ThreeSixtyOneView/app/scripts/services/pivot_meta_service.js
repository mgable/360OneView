'use strict';

/**
 * @ngdoc service
 * @name threeSixtOneViewApp.PivotMetaService
 * @description
 * # PivotMetaService
 * Service in the threeSixtOneViewApp.
 */
 angular.module('ThreeSixtyOneView.services')
 .service('PivotMetaService', ['MetaDataService', 'ManageAnalysisViewsService', function PivotMetaService(MetaDataService, ManageAnalysisViewsService) {
 	var self = this;
	// create the temporary filter object from the view data
	this.getAddedFilters = function(filters, dimensions) {
		var currentDimension;
		var addedFilters = {};

		var findTree = function(_label, _dimension, _add) {
			var add, output = {};
			add = _add || (_dimension.label === _label);

			_.each(_dimension.members, function(member) {
				output = angular.extend(output, findTree(_label, member, add));
			});

			if(_dimension.members.length === 0 && add) {
				output[_dimension.label] = true;
			}

			return output;
		};

		_.each(filters, function(filter) {
			addedFilters[filter.scope.dimension.label] = {};
			addedFilters[filter.scope.dimension.label].scope = filter.scope;

			currentDimension = _.find(dimensions, function(dimension) {
				return dimension.id === filter.scope.dimension.id;
			});

			if(filter.value.specification.type === 'All') {
				angular.extend(addedFilters[filter.scope.dimension.label], findTree(filter.scope.level.label, currentDimension, false));
			} else {
				_.each(filter.value.specification.members, function(member) {
					angular.extend(addedFilters[filter.scope.dimension.label], findTree(member.label, currentDimension, false));
				});
			}
		});

		return addedFilters;
	};

	// aggregate filter values based on categories
	this.getCategorizeValues = function(dimension, items) {
		console.info("getCategorizeValues");
		console.info(dimension, items);
		var i, result;

		var countValues = function(category) {
			var output = {
				label: [],
				selected: 0,
				total: 0
			};
			var j, tempResult;

			if(category.members.length > 0) {
				for(j = 0; j < category.members.length; j++) {
					tempResult = countValues(category.members[j]);

					if(!tempResult) {
						return false;
					} else if(tempResult.selected > 0 && tempResult.selected !== tempResult.total) {
						return false;
					} else if(tempResult.selected === tempResult.total) {
						output.label.push(category.members[j].label);
						output.selected++;
					}
					output.total++;
				}

			} else {
				if(items[category.label]) {
					output.selected = 1;
					output.label.push(category.label);
				}
				output.total = 1;
			}

			return output;
		};

		for(i = 0; i < dimension.members.length; i++) {
			result = countValues(dimension.members[i]);

			if(!_.isUndefined(result) && result.selected !== result.total) {
				return result;
			}
		}

		console.info("The results are");
		console.info(result);
		return result;
	};

	// generate a flat list of all the members for the purpose of generating filters list
	this.generateMembersList = function(tree) {
		var membersList = [];

		var flattenTree = function(branch, _dimensionId, _hierarchyId, _levelId) {
			var hierarchyId, levelId, output = {};

			hierarchyId = _hierarchyId || branch.hierarchyId || null;
			levelId = _levelId || branch.levelId || null;

			output[branch.label] = {
				id: branch.id,
				dimensionId: _dimensionId,
				hierarchyId: hierarchyId,
				levelId: levelId
			};

			_.each(branch.members, function(_member) {
				angular.extend(output, flattenTree(_member, _dimensionId, hierarchyId, levelId));
			});

			return output;
		};

		_.each(tree, function(_branch) {
			membersList[_branch.dimensionId] = flattenTree(_branch, _branch.dimensionId, null, null);
		});

		return membersList;
	};

	this.generateCategorizeValueStructure = function(addedFilters, dimensions, viewData) {
		if(!_.isEmpty(viewData)) {
			var categorizedValue = [];
			for(var i = 0; i < dimensions.length; i++) {
				categorizedValue[i] = this.getCategorizeValues(dimensions[i], addedFilters[dimensions[i].label]);
			}
			return categorizedValue;
		}
	};

	// create an empty view with no rows and columns and ALL for filters
	this.createEmptyView = function(dimensions, cubeMeta, spendViewId) {
		var i,
			newColumn = {dimension:{id:dimensions[dimensions.length-1].dimensionId},hierarchy:{id:-1},level:{id:dimensions[dimensions.length-1].members[0].levelId}},
			newRow = {dimension:{id:dimensions[0].dimensionId},hierarchy:{id:-1},level:{id:dimensions[0].members[dimensions[0].members.length-1].levelId}},
			columns = [],
			rows = [],
			newView = {
				name: 'Default ' + cubeMeta.label + ' view',
				isDefault: true,
				columns: columns,
				rows: rows,
				filters: []
			};
		newView.columns.push(newColumn);
		newView.rows.push(newRow);

		_.each(dimensions, function(dimension) {
			newView.filters.push({
				scope: {
					dimension: {id: dimension.id},
					hierarchy: {id: dimension.members[0].hierarchyId},
					level: {id: dimension.members[0].levelId}
				},
				value: {
					specification: {type: 'All'}
				}
			});
			// for time filter, only have the current year selected
			if(dimension.label === 'TIME') {
				var currentYear =_.find(dimension.members[0].members, function(year) {
					return year.label.indexOf(new Date().getFullYear()) > -1;
				});
				newView.filters[newView.filters.length-1].value.specification = {
					type: 'Absolute',
					members: [{
						id: currentYear.id
					}]
				};
			}
		});

		return ManageAnalysisViewsService.createView(newView, cubeMeta.id, spendViewId).then(function(view) {
			return view;
		});
	};

	// find the default (or draft if exists) view from views list
	this.findDefaultView = function(list) {
		var viewId = list[0].id;

		// check for draft views
		_.each(list, function(item) {
			if(item.name.substring(0, 8) === 'Draft - ') {// || item.isDefault) {
				viewId = item.id;
			}
		});

			return viewId;
		};

	// initialize the dimensions, views list, and the default view
	this.initModel = function(cubeMeta) {
		return MetaDataService.buildDimensionsTree(cubeMeta.id).then(function(dimensions) {
			return  ManageAnalysisViewsService.getViewsList(cubeMeta.id).then(function(list) {
				if(list.length < 1) { // if no items in the list create an empty view
					return self.createEmptyView(dimensions, cubeMeta, false).then(function(view) {
						list.unshift(view);
						return {viewsList: list, view: view, dimensions: dimensions};
					});
				} else { // if there are views in the list, load the default/draft view
					var viewId = self.findDefaultView(list);

					return ManageAnalysisViewsService.getView(viewId, cubeMeta.id).then(function(view) {
						var result = {viewsList: list, view: view, dimensions: dimensions};
						return result;
					});
				}
			});
		});
	};

	this.setUpAddedLevels = function(colAndRow) {
		var added = {};

		_.each(colAndRow, function(item) {
			added[item.level.label] = true;
		});

		return added;
	};

	this.updateFilters = function(dimensions, addedFilters, membersList, viewFilters) { // update view filters based on the user selections
		var filters = [], self = this;

		_.each(dimensions, function(dimension, dimensionIndex) {
			var dimensionId = dimension.id,
				values = self.getCategorizeValues(dimension, addedFilters[dimension.label]),
				newFilter = {
					id: viewFilters[dimensionIndex].id,
					value: {
						specification: {}
					},
					scope: {
						dimension: {id: membersList[dimensionId][values.label[0]].dimensionId},
						hierarchy: {id: membersList[dimensionId][values.label[0]].hierarchyId},
						level: {id: membersList[dimensionId][values.label[0]].levelId}
					}
				};

			if(values.selected === values.total) {
				newFilter.value.specification.type = 'All';
				newFilter.scope.level.id = dimension.members[0].id;
			} else {
				newFilter.value.specification.type = 'Absolute';
				newFilter.value.specification.members = [];
				_.each(values.label, function(item, index) {
					newFilter.value.specification.members.push({id: membersList[dimensionId][item].id});
				});
			}

			filters.push(newFilter);
		});

		return filters;
	};
}]);
