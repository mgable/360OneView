'use strict';

describe('Service: ManageTemplatesService', function () {

// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	var ManageTemplatesService;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($rootScope, _ManageTemplatesService_) {
		ManageTemplatesService = _ManageTemplatesService_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(ManageTemplatesService.resource).toBeDefined();
	});
});
