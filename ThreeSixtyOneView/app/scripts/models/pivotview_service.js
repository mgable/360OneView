'use strict';

angular.module('ThreeSixtyOneView')
  .service('PivotViewService', ["$q", "$rootScope", "EVENTS", "Model", "PivotViewModel", function PivotViewService($q, $rootScope, EVENTS, Model, PivotViewModel) {
		var MyPivotviewModel, mypivotview, self = this;

		MyPivotviewModel = new Model();
		angular.extend(this, MyPivotviewModel.prototype);
		mypivotview = new MyPivotviewModel(PivotViewModel);
		angular.extend(this, mypivotview);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getDefaultView = function(views, cubeId){
			// this logic will change
			var viewId = views[0].id;
			return this.get({viewId: viewId, cubeId: cubeId});
		};

		this.getViewsAndDefault = function(cubeId){
			return this.get({cubeId: cubeId}).then(function(views){
				if (views.length && views.length > 0){
					return self.getDefaultView(views, cubeId).then(function(currentView){
						return {"views": views, "currentView": currentView};
					});
				}
				$rootScope.$broadcast(EVENTS.error, {title: "ERROR: No Views", msg: "There are no views available"});
				return {"views": [], "currentView": {}};
			});
		};

		this.getViewsList = function(cubeId) {
			return this.resource.get({cubeId: cubeId}, this.config, '').then(function (response) {
				return response;
			});
		};

		this.getView = function(viewId, cubeId) {
			return this.resource.get({viewId: viewId, cubeId: cubeId}, this.config, '').then(function (response) {
				return response;
			});
		};

		this.createView = function(newView, cubeId) {
			return this.resource.post(newView, this.config, {cubeId: cubeId}, '').then(function (response) {
				return response;
			});
		};

		this.updateView = function(modifiedView, cubeId) {
			return this.resource.put(modifiedView, this.config, {viewId: modifiedView.id, cubeId: cubeId}, '').then(function (response) {
				return response;
			});
		};

		this.renameView = function(viewId, cubeId, newName) {
			return this.resource.put({name: newName}, this.config, {viewId: viewId, cubeId: cubeId}, 'name').then(function (response) {
				return response;
			});
		};

		this.deleteView = function(viewId, cubeId) {
			return this.resource.delete('', this.config, {viewId: viewId, cubeId: cubeId}, '').then(function (response) {
				return response;
			});
		};

}])
	.service('PivotIntermediatesService', ['CubeService', 'PivotViewService', function PivotIntermediatesService(CubeService, PivotViewService) {
		// create the temporary filter object from the view data
		this.getAddedFilters = function(filters, dimensions) {
			var i, j, dimensionIndex;
			var addedFilters = {};

			var findTree = function(_label, _dimension, _add) {
				var i, add, output = {};

				add = _add || (_dimension.label === _label);

				for(i = 0; i < _dimension.members.length; i++) {
					output = angular.extend(output, findTree(_label, _dimension.members[i], add));
					// output = output.concat(findTree(_label, _dimension.members[i], add));
				}

				if(_dimension.members.length === 0 && add) {
					output[_dimension.label] = true;
				}

				return output;
			};

			for(i = 0; i < filters.length; i++) {
				addedFilters[filters[i].scope.dimension.label] = {};
				addedFilters[filters[i].scope.dimension.label].scope = filters[i].scope;

				for(j = 0; j < dimensions.length; j++) {
					if(filters[i].scope.dimension.id === dimensions[j].id) {
						dimensionIndex = j;
						break;
					}
				}

				if(filters[i].value.specification.type === 'All') {
					angular.extend(addedFilters[filters[i].scope.dimension.label],
						findTree(filters[i].scope.level.label, dimensions[dimensionIndex], false));
				} else {
					for(j = 0; j < filters[i].value.specification.members.length; j++) {
						angular.extend(addedFilters[filters[i].scope.dimension.label],
							findTree(filters[i].value.specification.members[j].label, dimensions[dimensionIndex], false));
					}
				}
			}

			return addedFilters;
		};

		// aggregate filter values based on categories
		this.getCategorizeValues = function(dimension, items) {
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
						}

						if(tempResult.selected > 0 && tempResult.selected !== tempResult.total) {
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

				if(!!result) {
					if(result.selected !== result.total) {
						return result;
					}
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

		this.initModel = function(cubeMeta, scoptCubeId) {
			return CubeService.buildDimensionsTree(cubeMeta.id).then(function(dimensions) {
				return  PivotViewService.getViewsList(cubeMeta.id).then(function(list) {
					if(list.length < 1) {
						// create an empty initial view if there are no views in the selected cube
						var i, newView = {
							name: 'Default ' + cubeMeta.label + ' view',
							isDefault: true,
							columns: [],
							rows: [],
							filters: []
						};

						for(i = 0; i < dimensions.length; i++) {
							newView.filters.push({
								scope: {
									dimension: {id: dimensions[i].id},
									hierarchy: {id: dimensions[i].members[0].hierarchyId},
									level: {id: dimensions[i].members[0].levelId}
								},
								value: {
									specification: {type: 'All'}
								}
							});
						}

						return PivotViewService.createView(view, cubeId).then(function(view) {
							list.unshift(view);
							var result = {viewsList: list, view: view, dimensions: dimensions};
							return result;
						});
					} else {
						var cId = cubeMeta.id,
							vId = list[0].id,
							isDraftView = false;
						// check for draft or default views
						_.each(list, function(item) {
							if(item.name.substring(0, 8) === 'Draft - ' || item.isDefault) {
								cId = scoptCubeId;
								vId = item.id;
							}
						});

						// load the proper view
						return PivotViewService.getView(vId, cId).then(function(view) {
							var result = {viewsList: list, view: view, dimensions: dimensions};
							return result;	
						});	
					}
				});
			});
		};

		this.setUpAddedLevels = function(colAndRow) {
			var i, added = {};

			for(i = 0; i < colAndRow.length; i++) {
				added[colAndRow[i].level.label] = true;
			}
			return added;
		};

	}]);
