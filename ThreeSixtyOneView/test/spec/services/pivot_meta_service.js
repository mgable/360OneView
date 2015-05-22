'use strict';

describe('Service: PivotMetaService', function () {

	beforeEach(module('ThreeSixtyOneView'));

	var PivotMetaService, MetaDataService, ManageAnalysisViewsService;

	var viewData = JSON.parse(scenarioMockData.touchpointView),
		dimensions = JSON.parse(scenarioMockData.dimensionTree),
		cubeMeta = JSON.parse(scenarioMockData.cubeMeta),
		addedFilters,
		membersList;

	beforeEach(inject(function (_PivotMetaService_, _MetaDataService_, _ManageAnalysisViewsService_) {
		PivotMetaService = _PivotMetaService_;
		MetaDataService = _MetaDataService_;
		ManageAnalysisViewsService = _ManageAnalysisViewsService_;

		var dimensionsPromise = function() {
			return {
				then: function(callback) {
					callback(dimensions);
					return this;
				}
			};
		};

		var viewsPromise = function() {
			return {
				then: function(callback) {
					callback([viewData]);
					return this;
				}
			};
		};

		spyOn(ManageAnalysisViewsService, 'createView').and.callThrough();
		spyOn(ManageAnalysisViewsService, 'updateView').and.callThrough();
		spyOn(MetaDataService, 'buildDimensionsTree').and.callFake(dimensionsPromise);
		spyOn(ManageAnalysisViewsService, 'getViewsList').and.callFake(viewsPromise);
	}));

	it('should be defined', function () {
		expect(PivotMetaService).toBeDefined();
	});

	it('should generate the added filters object from raw values', function() {
		addedFilters = PivotMetaService.getAddedFilters(viewData.filters, dimensions);

		for(var i = 0; i < dimensions.length; i++) {
			expect(addedFilters[dimensions[i].label]).toBeDefined();
			expect(addedFilters[dimensions[i].label].scope).toBeDefined();
		}
	});

	it('should add all filters for given dimensions', function() {
		var allFilters = PivotMetaService.addAllFilters(dimensions);

		for(var i = 0; i < dimensions.length; i++) {
			expect(allFilters[dimensions[i].label]).toBeDefined();
			expect(allFilters[dimensions[i].label].scope).toBeDefined();

			for(var member in allFilters[dimensions[i].label]) {
				if(member !== 'scope') {
					expect(allFilters[dimensions[i].label][member]).toBeTruthy();
				}
			}
		}
	});

	it('should generate the categorized and count values for a filters object', function() {
		var i, categorizedValues;
		for(i = 0; i < dimensions.length; i++) {
			categorizedValues = PivotMetaService.getCategorizeValues(dimensions[i], addedFilters[dimensions[i].label]);

			expect(categorizedValues.label).toBeDefined();
			expect(categorizedValues.label.length > 0).toBeTruthy();
			expect(categorizedValues.id).toBeDefined();
			expect(categorizedValues.id.length > 0).toBeTruthy();
			expect(categorizedValues.total > 0).toBeTruthy();
			expect(categorizedValues.total >= categorizedValues.selected).toBeTruthy();
		}
	});

	it('should generate flat list of all the members for a given dimension', function() {
		membersList = PivotMetaService.generateMembersList(dimensions);

		for(var i = 0; i < dimensions.length; i++) {
			expect(membersList[dimensions[i].id]).toBeDefined();
		}
	});

	it('should generate the categorized and count values for the whole pivot view', function() {
		var i, categorizedValues = PivotMetaService.generateCategorizeValueStructure(addedFilters, dimensions, viewData);

		for(i = 0; i < dimensions.length; i++) {
			expect(categorizedValues[i]).toBeDefined();
			expect(categorizedValues[i].label.length > 0).toBeTruthy();
			expect(categorizedValues[i].id.length > 0).toBeTruthy();
			expect(categorizedValues[i].total >= categorizedValues[i].selected).toBeTruthy();
		}
	});

	it('should form an empty view with all the default values', function() {
		var newView = PivotMetaService.formEmptyView(dimensions, cubeMeta);

		expect(newView.name).toBe('Default ' + cubeMeta.label + ' view');
		expect(newView.isDraft).toBeFalsy();
		expect(newView.isDefault).toBeTruthy();
		expect(newView.rows.length).toBe(1);
		expect(newView.columns.length).toBe(1);
		expect(newView.filters.length).toBe(dimensions.length);
		for(var i = 0; i < dimensions.length; i++) {
			if(dimensions[i].type === 'TimeDimension') {
				expect(newView.filters[i].value.specification.type).toBe('Absolute');
			} else {
				expect(newView.filters[i].value.specification.type).toBe('All');
			}
		}
	});

	it('should create an empty view', function() {
		PivotMetaService.createEmptyView(dimensions, cubeMeta);

		expect(ManageAnalysisViewsService.createView).toHaveBeenCalled();
	});

	it('should update the view', function() {
		PivotMetaService.updateView(cubeMeta.id, viewData);
		var i, modifiedView = angular.copy(viewData);
		for(i = 0; i < dimensions.length; i++) {
			modifiedView.filters[i].id = 0;
		}

		expect(ManageAnalysisViewsService.updateView).toHaveBeenCalledWith(modifiedView, cubeMeta.id);
	});

	it('should find the default view in the views list', function() {
		var i, tempView, list = [];
		for(i = 0; i < 5; i++) {
			tempView = angular.copy(viewData);
			tempView.id = i;
			tempView.isDraft = false;
			list.push(tempView);
		}
		list[2].isDraft = true;

		expect(PivotMetaService.findDefaultView(list)).toBe(2);
	});

	it('should initialize the model by getting dimensions and views', function() {
		PivotMetaService.initModel(cubeMeta);

		expect(MetaDataService.buildDimensionsTree).toHaveBeenCalledWith(cubeMeta.id);
		expect(ManageAnalysisViewsService.getViewsList).toHaveBeenCalledWith(cubeMeta.id);
	});

	it('should generate the object containing added rows and columns in the pivot view', function() {
		var items = [].concat(viewData.rows, viewData.columns),
			added = PivotMetaService.setUpAddedLevels(items),
			i;

		for(i = 0; i < items.length; i++) {
			expect(added[items[i].level.label]).toBeTruthy();
		}
	});

	it('should generate the filters object in the server format from the ui format', function() {
		var filters = PivotMetaService.updateFilters(dimensions, addedFilters, membersList, viewData.filters);

		expect(filters.length).toBe(dimensions.length);
		for(var i = 0; i < filters.length; i++) {
			expect(filters[i].id).toBe(0);
			expect(filters[i].value.specification.type).toBeDefined();
			expect(filters[i].scope).toBeDefined();
		}
	});

	it('should determine whether time dimension members can be added to the pivot view', function() {
		var disability = PivotMetaService.determineTimeDisability(dimensions, PivotMetaService.setUpAddedLevels([].concat(viewData.rows, viewData.columns)));
		expect(disability).toBeTruthy();
		disability = PivotMetaService.determineTimeDisability(dimensions, PivotMetaService.setUpAddedLevels([]));
		expect(disability).toBeFalsy();
	});
});
