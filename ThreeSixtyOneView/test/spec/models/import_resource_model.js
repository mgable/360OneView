'use strict';

describe('Service: ImportResourceModel', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	var ImportResourceModel;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($rootScope, _ImportResourceModel_) {
		ImportResourceModel = _ImportResourceModel_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(ImportResourceModel.resource).toBeDefined();
	});
});
