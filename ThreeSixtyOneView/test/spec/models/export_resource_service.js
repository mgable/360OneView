'use strict';

describe('Service: ExportResourceService', function () {

	var ExportResourceService, ExportResourceModel, backend, exportUrl,
	elementId = 23,
	sampleView = {
		"id": 1,
		"name": "Default Marketing Plan view",
		"isDefault": true,
		"rows": [
		{
			"dimension": {
				"id": 1,
				"name": "VAR_DIM",
				"label": "VARIABLE"
			},
			"hierarchy": {
				"id": -1
			},
			"level": {
				"id": 3,
				"name": "ATTR2_ID",
				"label": "Brand/Nameplate"
			}
		},
		{
			"dimension": {
				"id": 2,
				"name": "PROD_DIM",
				"label": "PRODUCT"
			},
			"hierarchy": {
				"id": -1
			},
			"level": {
				"id": 1,
				"name": "PROD_ID",
				"label": "Nameplate"
			}
		}
		],
		"columns": [
		{
			"dimension": {
				"id": 1,
				"name": "VAR_DIM",
				"label": "VARIABLE"
			},
			"hierarchy": {
				"id": -1
			},
			"level": {
				"id": 2,
				"name": "ATTR1_ID",
				"label": "National/Local"
			}
		},
		{
			"dimension": {
				"id": 3,
				"name": "GEO_DIM",
				"label": "GEO"
			},
			"hierarchy": {
				"id": -1
			},
			"level": {
				"id": 2,
				"name": "ATTR1_ID",
				"label": "Region"
			}
		}
		],
		"filters": [
		{
			"id": 122,
			"scope": {
				"dimension": {
					"id": 1,
					"name": "VAR_DIM",
					"label": "VARIABLE"
				},
				"hierarchy": {
					"id": 1,
					"name": "National/Local",
					"label": "National/Local"
				},
				"level": {
					"id": 2,
					"name": "ATTR1_ID",
					"label": "National/Local"
				}
			},
			"value": {
				"specification": {
					"type": "All"
				}
			}
		},
		{
			"id": 123,
			"scope": {
				"dimension": {
					"id": 2,
					"name": "PROD_DIM",
					"label": "PRODUCT"
				},
				"hierarchy": {
					"id": 16,
					"name": "Nameplate Category",
					"label": "Nameplate Category"
				},
				"level": {
					"id": 2,
					"name": "ATTR1_ID",
					"label": "Nameplate Category"
				}
			},
			"value": {
				"specification": {
					"type": "All"
				}
			}
		},
		{
			"id": 124,
			"scope": {
				"dimension": {
					"id": 3,
					"name": "GEO_DIM",
					"label": "GEO"
				},
				"hierarchy": {
					"id": 17,
					"name": "Region",
					"label": "Region"
				},
				"level": {
					"id": 2,
					"name": "ATTR1_ID",
					"label": "Region"
				}
			},
			"value": {
				"specification": {
					"type": "All"
				}
			}
		},
		{
			"id": 125,
			"scope": {
				"dimension": {
					"id": 4,
					"name": "TIME_DIM",
					"label": "TIME"
				},
				"hierarchy": {
					"id": 18,
					"name": "YEAR",
					"label": "YEAR"
				},
				"level": {
					"id": 1,
					"name": "YEAR",
					"label": "YEAR"
				}
			},
			"value": {
				"specification": {
					"type": "Absolute",
					"members": [
					{
						"id": 103,
						"name": "2015",
						"label": "2015"
					}
					]
				}
			}
		}
		]
	};

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView.services'));

	// setup backend
	beforeEach(inject(function(SERVER, CONFIG, $httpBackend) {
		exportUrl = SERVER.server + CONFIG.application.api.exportResource;
		exportUrl = exportUrl.replace(/:elementId/, elementId);
		backend = $httpBackend;

		backend.when('POST', exportUrl, sampleView).respond({'status': 'EXPORT_REQUEST_ACCEPTED'});
		backend.when('GET', exportUrl + '/status').respond({'status': 'COMPLETED'});
		backend.when('GET', exportUrl + '/download').respond(exportUrl + '/download');
	}));

	// Initialize the controller and a mock scope
	beforeEach(inject(function (_ExportResourceService_, _ExportResourceModel_, $httpBackend) {
		ExportResourceService = _ExportResourceService_;
		ExportResourceModel = _ExportResourceModel_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(ExportResourceService.resource).toBeDefined();
	});

	it('request an export', function() {
		ExportResourceService.requestExport(elementId, sampleView).then(function(response) {
			console.log(response);
			expect(response.status).toBe('EXPORT_REQUEST_ACCEPTED');
		});
		backend.flush();
		backend.verifyNoOutstandingExpectation();
	});

	it('check the export status', function() {
		ExportResourceService.checkStatus(elementId).then(function(response) {
			expect(response.status).toBe('COMPLETED');
		});
		backend.flush();
		backend.verifyNoOutstandingExpectation();
	});

	it('download the file', function() {
		ExportResourceService.downloadFile(elementId).then(function(response) {
			expect(response).toBe(exportUrl + '/download');
		});
		backend.flush();
		backend.verifyNoOutstandingExpectation();
	});
});
