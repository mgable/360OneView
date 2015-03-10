'use strict';

describe('Service: ScenarioTemplatesModel', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	var ScenarioTemplatesModel;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($rootScope, _ScenarioTemplatesModel_) {
		ScenarioTemplatesModel = _ScenarioTemplatesModel_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(ScenarioTemplatesModel.resource).toBeDefined();
	});
});
