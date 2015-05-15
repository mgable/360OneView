'use strict';

describe('Service: ExportResourceModel', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	var ExportResourceModel;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($rootScope, _ExportResourceModel_) {
		ExportResourceModel = _ExportResourceModel_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(ExportResourceModel.resource).toBeDefined();
	});
});
