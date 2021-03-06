'use strict';

describe('Service: PivotModel', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	var PivotModel;

	// Initialize the controller and a mock scope
	beforeEach(inject(function (_PivotModel_) {
		PivotModel = _PivotModel_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(PivotModel.resource).toBeDefined();
	});

	it('transform response for the pivot table slice call', function() {
		var transformedResponse = PivotModel.pivotConfig.transformResponse(scenarioMockData.pivotSlice);

		expect(transformedResponse).toEqual(JSON.parse(scenarioMockData.pivotSliceTransformed));
	});
});
