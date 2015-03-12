'use strict';

describe('Service: ManageScenariosModel', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	var ManageScenariosModel;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($rootScope, _ManageScenariosModel_) {
		ManageScenariosModel = _ManageScenariosModel_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(ManageScenariosModel.resource).toBeDefined();
	});
});
