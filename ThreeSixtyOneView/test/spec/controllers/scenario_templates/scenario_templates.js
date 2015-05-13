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

		var returnThen = function() {
			return {
				then: function(callback) {
					callback(JSON.parse(templateMockData.masterProject));
					return this;
				}
			};
		};

		spyOn($state, 'go');
		spyOn(ManageTemplatesService, 'getAll').and.callFake(returnThen);
		spyOn(ProjectsService, 'getMasterProject').and.callFake(returnThen);
		spyOn(DialogService, 'openLightbox').and.callThrough();

		ctrl = $controller('ScenarioTemplatesCtrl', {
			$scope: scope
		});
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		expect(getAPI(scope)).areArraysEqual(templateMockData.scenarioTemplatesCtrlSignature);
	});

	it('should get list of all templates', function() {
		expect(ManageTemplatesService.getAll).toHaveBeenCalled();
	});

	it('should get the master project', function() {
		expect(ProjectsService.getMasterProject).toHaveBeenCalled();
	});

	it('should should open the module pick dialog box', function() {
		scope.openModulePickDialog();
		expect(ProjectsService.getMasterProject).toHaveBeenCalled();
	});
});
