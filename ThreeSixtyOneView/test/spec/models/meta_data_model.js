'use strict';

describe('Service: MetaDataModel', function () {

	// load the controller's module
	beforeEach(module('ThreeSixtyOneView'));

	var MetaDataModel;

	// Initialize the model
	beforeEach(inject(function ($rootScope, _MetaDataModel_) {
		MetaDataModel = _MetaDataModel_;
	}));

	it('resource service should be extended to the current scope', function () {
		expect(MetaDataModel.resource).toBeDefined();
	});

	it('should transform the cube meta to the members tree structure', function() {
		var transformedRresponse = MetaDataModel.metaConfig.transformResponse(scenarioMockData.cubeMeta);
		expect(transformedRresponse.length).toBe(3);
		expect(transformedRresponse[transformedRresponse.length - 1].id).toBeDefined();
		expect(transformedRresponse[transformedRresponse.length - 1].name).toBeDefined();
		expect(transformedRresponse[transformedRresponse.length - 1].label).toBeDefined();
		expect(transformedRresponse[transformedRresponse.length - 1].members).toBeDefined();
	});
});
