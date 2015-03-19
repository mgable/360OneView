'use strict';

describe('Service: ManageAnalysisViewsService', function () {

	var ManageAnalysisViewsService, ManageAnalysisViewsModel, backend, manageAnalysisViewsUrl, newView;

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		manageAnalysisViewsUrl = SERVER.server + CONFIG.application.api.pivotview;
		manageAnalysisViewsUrl = manageAnalysisViewsUrl.replace(/:cubeId/, cubeId);
		backend = $httpBackend;
		newView = angular.copy(views[views.length - 1]);
		newView.id = null;

		backend.when('GET', manageAnalysisViewsUrl.substr(0, manageAnalysisViewsUrl.search(/:viewId/) - 1)).respond(views);
		backend.when('GET', manageAnalysisViewsUrl.replace(/:viewId/, viewId)).respond(views[views.length - 1]);
		backend.when('GET', manageAnalysisViewsUrl.substr(0, manageAnalysisViewsUrl.search(/:viewId/) - 1) + '?relatedByView=' + viewId).respond(views[views.length - 1]);
		backend.when('POST', manageAnalysisViewsUrl.substr(0, manageAnalysisViewsUrl.search(/:viewId/) - 1), newView).respond(views[views.length - 1]);
		backend.when('POST', manageAnalysisViewsUrl.substr(0, manageAnalysisViewsUrl.search(/:viewId/) - 1) + '?relatedByView=' + viewId, newView).respond(views[views.length - 1]);
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
			ManageAnalysisViewsService.getViewsList(cubeId).then(function(response) {
				expect(response).toEqual(views);
			});
		});

		it('get a specific view', function() {
			ManageAnalysisViewsService.getView(viewId, cubeId).then(function(response) {
				expect(response).toEqual(_.find(views, function(view) {return view.id === viewId}));
			});
		});

		it('get a related by (kpi) view', function() {
			ManageAnalysisViewsService.getViewRelatedBy(viewId, cubeId).then(function(response) {
				expect(response).toEqual(views[views.length - 1]);
			});
		});

		it('create a new view', function() {
			var newView = angular.copy(views[views.length - 1]);
			newView.id = null;
			ManageAnalysisViewsService.createView(newView, cubeId).then(function(response) {
				expect(response).toEqual(views[views.length - 1]);
				expect(response.id).not.toBeNull();
			});
		});

		it('create a new related by view', function() {
			var newView = angular.copy(views[views.length - 1]);
			newView.id = null;
			ManageAnalysisViewsService.createView(newView, cubeId, viewId).then(function(response) {
				expect(response).toEqual(views[views.length - 1]);
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
