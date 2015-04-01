'use strict';

describe('Controller: ScenarioTemplatesCtrl', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	var ScenarioTemplatesCtrl,
	scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		ScenarioTemplatesCtrl = $controller('ScenarioTemplatesCtrl', {
			$scope: scope
		});
	}));

	it('should attach a list of awesomeThings to the scope', function () {
		expect(scope).toBeDefined();
	});
});
