'use strict';

describe('Service: ManageAnalysisViewsService', function () {

	var ManageAnalysisViewsService, ManageAnalysisViewsModel, backend, manageAnalysisViewsUrl, newView;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		manageAnalysisViewsUrl = SERVER.server + CONFIG.application.api.pivotview;
		manageAnalysisViewsUrl = manageAnalysisViewsUrl.replace(/:cubeId/, scenarioMockData.cubeId);
		backend = $httpBackend;
		newView = angular.copy(scenarioMockData.views[scenarioMockData.views.length - 1]);
		newView.id = null;

		backend.when('GET', manageAnalysisViewsUrl.substr(0, manageAnalysisViewsUrl.search(/:viewId/) - 1)).respond(scenarioMockData.views);
		backend.when('GET', manageAnalysisViewsUrl.replace(/:viewId/, scenarioMockData.viewId)).respond(scenarioMockData.views[scenarioMockData.views.length - 1]);
		backend.when('GET', manageAnalysisViewsUrl.substr(0, manageAnalysisViewsUrl.search(/:viewId/) - 1) + '?relatedByView=' + scenarioMockData.viewId).respond(scenarioMockData.views[scenarioMockData.views.length - 1]);
		backend.when('POST', manageAnalysisViewsUrl.substr(0, manageAnalysisViewsUrl.search(/:viewId/) - 1), newView).respond(scenarioMockData.views[scenarioMockData.views.length - 1]);
		backend.when('POST', manageAnalysisViewsUrl.substr(0, manageAnalysisViewsUrl.search(/:viewId/) - 1) + '?relatedByView=' + scenarioMockData.viewId, newView).respond(scenarioMockData.views[scenarioMockData.views.length - 1]);
		backend.when('PUT', manageAnalysisViewsUrl.replace(/:viewId/, scenarioMockData.viewId), newView).respond(scenarioMockData.views[scenarioMockData.views.length - 1]);
	}));

	// Initialize the services
	beforeEach(inject(function (_ManageAnalysisViewsService_, _ManageAnalysisViewsModel_) {
		ManageAnalysisViewsService = _ManageAnalysisViewsService_;
		ManageAnalysisViewsModel = _ManageAnalysisViewsModel_;
	}));

	afterEach(function() {
		backend.verifyNoOutstandingExpectation();
	});

	it('resource service should be extended to the current scope', function () {
		expect(ManageAnalysisViewsService.resource).toBeDefined();
	});

	describe('API calls', function() {
		afterEach(function() {
			backend.flush();
		});

		it('get list of the views in a cube', function() {
			ManageAnalysisViewsService.getViewsList(scenarioMockData.cubeId).then(function(response) {
				expect(response).toEqual(scenarioMockData.views);
			});
		});

		xit('get a specific view', function() {
			ManageAnalysisViewsService.getView(scenarioMockData.viewId, scenarioMockData.cubeId).then(function(response) {
				expect(response).toEqual(_.find(scenarioMockData.views, function(view) {return view.id === scenarioMockData.viewId}));
			});
		});

		xit('get a related by (kpi) view', function() {
			console.log(manageAnalysisViewsUrl.replace(/:viewId/, scenarioMockData.viewId));
			ManageAnalysisViewsService.getViewRelatedBy(scenarioMockData.viewId, scenarioMockData.cubeId).then(function(response) {
				expect(response).toEqual(scenarioMockData.views[scenarioMockData.views.length - 1]);
			});
		});

		it('create a new view', function() {
			var newView = angular.copy(scenarioMockData.views[scenarioMockData.views.length - 1]);
			newView.id = null;
			ManageAnalysisViewsService.createView(newView, scenarioMockData.cubeId).then(function(response) {
				expect(response).toEqual(scenarioMockData.views[scenarioMockData.views.length - 1]);
				expect(response.id).not.toBeNull();
			});
		});

		it('create a new related by view', function() {
			var newView = angular.copy(scenarioMockData.views[scenarioMockData.views.length - 1]);
			newView.id = null;
			ManageAnalysisViewsService.createView(newView, scenarioMockData.cubeId, scenarioMockData.viewId).then(function(response) {
				expect(response).toEqual(scenarioMockData.views[scenarioMockData.views.length - 1]);
				expect(response.id).not.toBeNull();
			});
		});

		// it('update a view', function() {
		// 	ManageAnalysisViewsService.updateView(views[views.length - 1], cubeId).then(function(response) {
		// 		expect(response).toEqual(views[views.length - 1]);
		// 	});
		// });
	});

});
