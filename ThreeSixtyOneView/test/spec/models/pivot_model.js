'use strict';

describe('Service: PivotModel', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	var PivotModel;

	// Initialize the controller and a mock scope
	beforeEach(inject(function (_PivotModel_) {
		PivotModel = _PivotModel_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(PivotModel.resource).toBeDefined();
	});
});
