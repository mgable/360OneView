'use strict';

describe('Service: PivotMetaService', function () {

	beforeEach(module('ThreeSixtyOneView'));

	var PivotMetaService, MetaDataService, ManageAnalysisViewsService;

	var viewData = JSON.parse(scenarioMockData.touchpointView),
		dimensions = JSON.parse(scenarioMockData.dimensionTree),
		addedFilters,
		membersList;

	beforeEach(inject(function (_PivotMetaService_, _MetaDataService_, _ManageAnalysisViewsService_) {
		PivotMetaService = _PivotMetaService_;
		MetaDataService = _MetaDataService_;
		ManageAnalysisViewsService = _ManageAnalysisViewsService_;
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

	it('should generate flas list of all the members for a given dimension', function() {
		membersList = PivotMetaService.generateMembersList(dimensions);

		for(var i = 0; i < dimensions.length; i++) {
			expect(membersList[dimensions[i].id]).toBeDefined();
		}
	});
});
