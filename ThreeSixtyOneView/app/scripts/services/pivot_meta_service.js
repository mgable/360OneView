'use strict';

/**
 * @ngdoc service
 * @name ThreeSixtyOneView.PivotMetaService
 * @description
 * # PivotMetaService
 * Service in the ThreeSixtyOneView.
 */
 angular.module('ThreeSixtyOneView.services')
 .service('PivotMetaService', ['MetaDataService', 'ManageAnalysisViewsService', function PivotMetaService(MetaDataService, ManageAnalysisViewsService) {
	var self = this,
		findNAMembers = function(dimension) {
			var output = [];

			if(dimension.members.length > 0) {
				_.each(dimension.members, function(member) {
					if(member.members.length > 0 && member.na) {
						output.push(member);
					}
					output = output.concat(findNAMembers(member));
				});
			} else {
				if(dimension.na) {
					output.push(dimension);
				}
			}

			return output;
		},
		findSelectedFilters = function(_member, _dimension, _add) {
			var add, output = {};
			add = _add || (_dimension.label === _member.label);

			_.each(_dimension.members, function(member) {
				output = angular.extend(output, findSelectedFilters(_member, member, add));
			});

			if(_dimension.members.length === 0 && add) {
				output[_dimension.id + ',' + _dimension.label] = true;
			}

			return output;
		},
		getDefaultViewRow = function(dimensions) {
			return {
				dimension: {id:dimensions[0].dimensionId
				},
				hierarchy: {
					id: -1
				},
				level: {
					id: dimensions[0].members[dimensions[0].members.length-1].levelId,
					label: dimensions[0].members[dimensions[0].members.length-1].label
				}
			};
		},
		getDefaultViewColumn = function(dimensions) {
			return {
				dimension: {
					id: dimensions[dimensions.length-1].dimensionId
				},
				hierarchy: {
					id: -1
				},
				level: {
					id: dimensions[dimensions.length-1].members[0].levelId,
					label: dimensions[dimensions.length-1].members[0].label
				}
			};
		};

	// create the temporary filter object from the view data
	this.getAddedFilters = function(filters, dimensions) {
		var currentDimension,
			addedFilters = {},
			NAMembers = [];

		_.each(filters, function(filter) {
			addedFilters[filter.scope.dimension.label] = {};
			addedFilters[filter.scope.dimension.label].scope = filter.scope;

			currentDimension = _.find(dimensions, function(dimension) {
				return dimension.id === filter.scope.dimension.id;
			});

			if(filter.value.specification.type === 'All') {
				angular.extend(addedFilters[filter.scope.dimension.label], findSelectedFilters(filter.scope.level, currentDimension, false));
			} else {
				_.each(filter.value.specification.members, function(member) {
					angular.extend(addedFilters[filter.scope.dimension.label], findSelectedFilters(member, currentDimension, false));
				});
			}

			NAMembers = findNAMembers(currentDimension.members[0]);
			_.each(NAMembers, function(NAMember) {
				if(NAMember.members.length === 0) {
					angular.extend(addedFilters[filter.scope.dimension.label], findSelectedFilters(NAMember, NAMember, true));
				}
			});
		});

		return addedFilters;
	};

	this.addAllFilters = function(dimensions) {
		var addedFilters = {},
			NAMembers = [];

		_.each(dimensions, function(dimension) {
			addedFilters[dimension.label] = {};
			
			addedFilters[dimension.label].scope = {
				dimension: {
					id: dimension.id,
					name: dimension.name,
					label: dimension.label
				},
				hierarchy: {
					id: -1
				},
				level: {
					id: dimension.members[0].id,
					name: dimension.members[0].name,
					label: dimension.members[0].label
				}
			};

			angular.extend(addedFilters[dimension.label], findSelectedFilters(dimension, dimension, false));

			NAMembers = findNAMembers(dimension.members[0]);
			_.each(NAMembers, function(NAMember) {
				if(NAMember.members.length === 0) {
					angular.extend(addedFilters[dimension.label], findSelectedFilters(NAMember, NAMember, true));
				}
			});
		});

		return addedFilters;
	};

	// aggregate filter values based on categories
	this.getCategorizeValues = function(dimension, items) {
		var i, result;

		var countValues = function(category) {
			var output = {
				label: [],
				id: [],
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
					} else if(tempResult.selected === tempResult.total && tempResult.total > 0) {
						output.label.push(category.members[j].label);
						output.id.push(category.members[j].id);
						output.selected++;
					}

					// does not increase total for NA members
					if(tempResult.total > 0) {
						output.total++;
					}
				}

			} else {
				if(category.na) {
					// return both selected and total as zero if category is NA
					// this way they will be eliminated from the counting
					return output;
				}
				if(items[category.id + ',' + category.label]) {
					output.selected = 1;
					output.label.push(category.label);
					output.id.push(category.id);
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

		return result;
	};

	// generate a flat list of all the members for the purpose of generating filters list
	this.generateMembersList = function(tree) {
		var membersList = [];

		var flattenTree = function(branch, _dimensionId, _hierarchyId, _levelId) {
			var hierarchyId, levelId, output = {};

			hierarchyId = _hierarchyId || branch.hierarchyId || null;
			levelId = _levelId || branch.levelId || null;

			output[branch.id + ',' + branch.label] = {
				id: branch.id,
				dimensionId: _dimensionId,
				hierarchyId: hierarchyId,
				levelId: levelId,
				name: branch.name,
				label: branch.label
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
			_.each(dimensions, function(dimension, index) {
				categorizedValue[index] = self.getCategorizeValues(dimension, addedFilters[dimension.label]);
			});
			return categorizedValue;
		}
	};

	this.formEmptyView = function(dimensions, cubeMeta) {
		var newColumn = getDefaultViewColumn(dimensions),
			newRow = getDefaultViewRow(dimensions),
			columns = [],
			rows = [],
			newView = {
				name: 'Default ' + cubeMeta.label + ' view',
				isDefault: true,
				isDraft: false,
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

		return newView;
	};

	// create an empty view with no rows and columns and ALL for filters
	this.createEmptyView = function(dimensions, cubeMeta, spendViewId) {
		var newView = self.formEmptyView(dimensions, cubeMeta);

		return ManageAnalysisViewsService.createView(newView, cubeMeta.id, spendViewId).then(function(view) {
			return view;
		});
	};

	this.updateView = function(cubeId, view) {
        // filter ids should be set to zero before update
        _.each(view.filters, function(filter) {
            filter.id = 0;
        });
        return ManageAnalysisViewsService.updateView(view, cubeId).then(function(response) {
            return response;
        });
    };

	// find the default (or draft if exists) view from views list
	this.findDefaultView = function(list) {
		var viewId = list[0].id,
			draftView = false;

		// check for draft views
		_.each(list, function(item) {
			// if(item.name.substring(0, 8) === 'Draft - ') {
			if(item.isDraft) {
				viewId = item.id;
				draftView = true;
			} else if(!draftView && item.isDefault) {
				viewId = item.id;
			}
		});

		return viewId;
	};

	// initialize the dimensions, views list, and the default view
	this.initModel = function(cubeMeta) {
		return MetaDataService.buildDimensionsTree(cubeMeta.id).then(function(dimensions) {
			return  ManageAnalysisViewsService.getViewsList(cubeMeta.id).then(function(list) {
				list = _.sortBy(list, function(item){return item.auditInfo.createdOn;}).reverse();
				if(list.length < 1) { // if no items in the list create an empty view
					return self.createEmptyView(dimensions, cubeMeta, false).then(function(view) {
						list.unshift(view);
						return {viewsList: list, viewData: view, dimensions: dimensions};
					});
				} else { // if there are views in the list, load the default/draft view
					var viewId = self.findDefaultView(list);

					return ManageAnalysisViewsService.getView(viewId, cubeMeta.id).then(function(view) {
						var result = {viewsList: list, viewData: view, dimensions: dimensions};
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
		var filters = [], self = this, NAMembers, NAMember;

		_.each(dimensions, function(dimension, dimensionIndex) {
			var dimensionId = dimension.id,
				values = self.getCategorizeValues(dimension, addedFilters[dimension.label]),
				level = _.findWhere(dimension.members, {levelId: membersList[dimensionId][values.id[0] + ',' + values.label[0]].levelId}),
				newFilter = {
					id: viewFilters[dimensionIndex].id,
					value: {
						specification: {}
					},
					scope: {
						dimension: {
							id: dimension.id,
							name: dimension.name,
							label: dimension.label
						},
						hierarchy: {
							id: -1
						},
						level: {
							id: level.id,
							name: level.name,
							label: level.label
						}
					}
				};

			NAMembers = findNAMembers(dimension.members[0]);

			if(values.selected === values.total) {
				newFilter.value.specification.type = 'All';
				newFilter.scope.level.id = dimension.members[0].id;
			} else {
				newFilter.value.specification.type = 'Absolute';
				newFilter.value.specification.members = [];
				_.each(values.label, function(item, index) {
					newFilter.value.specification.members.push({
						id: membersList[dimensionId][values.id[index] + ',' + item].id,
						name: membersList[dimensionId][values.id[index] + ',' + item].name,
						label: membersList[dimensionId][values.id[index] + ',' + item].label
					});
				});

				// manually add NA members, if available
				if(NAMembers.length > 0) {
					NAMember = _.find(NAMembers, function(member) {
						return membersList[dimensionId][member.id + ',' + member.label].levelId === newFilter.scope.level.id;
					});
					newFilter.value.specification.members.push({
						id: NAMember.id,
						name: NAMember.name,
						label: NAMember.label
					});
				}
			}

			filters.push(newFilter);
		});

		return filters;
	};

	this.determineTimeDisability = function(dimensions, added, membersList) {
		var timeDimensionId = 0,
			timeDisabled = false,
			TimeDimension;

		_.each(dimensions, function(dimension) {
			if(dimension.type === 'TimeDimension') {
				timeDimensionId = dimension.id;
				TimeDimension = dimension;
			}
		});

		_.each(TimeDimension.members, function(member) {
			if(added[member.label]) {
				timeDisabled = true;
			}
		});

		return timeDisabled;
	};
}]);
