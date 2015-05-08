'use strict';

describe('Controller: ScenarioTemplatesCtrl', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	var ctrl, $rootScope, $state, $controller, CONFIG, scope, DialogService, ManageTemplatesService, ProjectsService;

	// Initialize the controller and a mock scope
	beforeEach(inject(function(_$rootScope_, _$state_, _$controller_, _CONFIG_){
		$rootScope = _$rootScope_;
		$state = _$state_;
		$controller = _$controller_;
		CONFIG = _CONFIG_;
		
		scope = $rootScope.$new();
	}));

	beforeEach(inject(function(_DialogService_, _ManageTemplatesService_, _ProjectsService_) {
		DialogService = _DialogService_;
		ManageTemplatesService = _ManageTemplatesService_;
		ProjectsService = _ProjectsService_;

		$state.current.url = scenarioRoutes[0];

		spyOn($state, 'go');

		ctrl = $controller('ScenarioTemplatesCtrl', {
			$scope: scope
		});
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		// signature = scenarioCtrlSignature;
		expect(getAPI(scope)).areArraysEqual(scenarioTemplatesCtrlSignature);
	});
});
