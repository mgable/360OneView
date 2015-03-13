'use strict';

describe('Service: ScenarioTemplatesService', function () {

// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	var ScenarioTemplatesService;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($rootScope, _ScenarioTemplatesService_) {
		ScenarioTemplatesService = _ScenarioTemplatesService_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(ScenarioTemplatesService.resource).toBeDefined();
	});
});
