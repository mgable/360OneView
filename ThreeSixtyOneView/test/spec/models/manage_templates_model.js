'use strict';

describe('Service: ManageTemplatesModel', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	var ManageTemplatesModel;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($rootScope, _ManageTemplatesModel_) {
		ManageTemplatesModel = _ManageTemplatesModel_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(ManageTemplatesModel.resource).toBeDefined();
	});
});
