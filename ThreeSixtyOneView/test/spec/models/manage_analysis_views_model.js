'use strict';

describe('Service: ManageAnalysisViewsModel', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	var ManageAnalysisViewsModel;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($rootScope, _ManageAnalysisViewsModel_) {
		ManageAnalysisViewsModel = _ManageAnalysisViewsModel_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(ManageAnalysisViewsModel.resource).toBeDefined();
	});
});
