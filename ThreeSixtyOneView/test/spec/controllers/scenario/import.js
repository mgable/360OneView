/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe("ImportCtrl: ImportCtrl", function(){
	var scope, ImportResourceService, timeout, CONFIG, ctrl,
		signature = ['newFileSelected','startUpload','checkStatus','resetUploadForm','selectedFile','selectedFileName','cancelButtonLabel','isFileSelected','isImportStarted','isImportCompleted','isImportFailed','isFileInvalid','statusMessage'];

	beforeEach(module('ThreeSixtyOneView'));

	beforeEach(inject(function($rootScope, $controller, $timeout, _ImportResourceService_, _CONFIG_) {
		scope = $rootScope.$new();
		timeout = $timeout;
		CONFIG = _CONFIG_;
		ImportResourceService = _ImportResourceService_;

		ctrl = $controller('ImportCtrl', {
			$scope: scope
		});

		spyOn(ImportResourceService, 'uploadFile').and.callThrough();
		spyOn(ImportResourceService, 'checkStatus').and.callThrough();
	}));

	it('should be defined', function() {
		expect(ctrl).toBeDefined();
	});

	it('should have a defined api', function() {
		expect(getAPI(scope)).areArraysEqual(signature);
	});

	it('should select a valid new file', function() {
		scope.newFileSelected({target: {files:[{name: 'test file', type: CONFIG.application.models.ImportModel.acceptedFileType}]}});

		expect(scope.selectedFile).toEqual({name: 'test file', type: CONFIG.application.models.ImportModel.acceptedFileType});
		expect(scope.selectedFileName).toBe('test file');
		expect(scope.isFileSelected).toBeTruthy();
		expect(scope.isFileInvalid).toBeFalsy();
	});

	it('should not select an invalid new file', function() {
		scope.newFileSelected({target: {files:[{name: 'test file', type: 'random type'}]}});
		
		expect(scope.selectedFile).toEqual({name: 'test file', type: 'random type'});
		expect(scope.selectedFileName).toBe('test file');
		expect(scope.isFileSelected).toBeTruthy();
		expect(scope.isFileInvalid).toBeTruthy();
	});

	it('should start the upload process', function() {
		scope.selectedScenarioElement = {id: 2};
		scope.startUpload();

		expect(ImportResourceService.uploadFile).toHaveBeenCalled();
		expect(scope.isImportStarted).toBeTruthy();
		expect(scope.isImportCompleted).toBeFalsy();
		expect(scope.statusMessage).toBe('Uploading file ...');
	});

	it('should check status of the import process', function() {
		scope.selectedScenarioElement = {id: 2};
		scope.isImportStarted = true;
		scope.isImportCompleted = false;
		scope.checkStatus();

		expect(ImportResourceService.checkStatus).toHaveBeenCalled();
	});

	it('should reset the upload form', function() {
		scope.resetUploadForm();

		expect(scope.selectedFile).toEqual({});
		expect(scope.selectedFileName).toBe('Select a file to import');
		expect(scope.cancelButtonLabel).toBe('Cancel');
		expect(scope.isFileSelected).toBeFalsy();
		expect(scope.isImportStarted).toBeFalsy();
		expect(scope.isImportCompleted).toBeFalsy();
		expect(scope.isImportFailed).toBeFalsy();
		expect(scope.isFileInvalid).toBeFalsy();
		expect(scope.statusMessage).toBe('');
	});
});