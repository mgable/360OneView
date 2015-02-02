'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ImportResourceService', ["$q", "$rootScope", "EVENTS", "Model", "ImportResourceModel", function ($q, $rootScope, EVENTS, Model, ImportResourceModel) {
		var MyImportModel, myView, self = this;

		MyImportModel = new Model();
		angular.extend(this, MyImportModel.prototype);
		myView = new MyImportModel(ImportResourceModel);
		angular.extend(this, myView);

		this.uploadFile = function(elementId, file){
	        var additionalPath = 'upload',
	        	formData = new FormData();
	        formData.append('file', file);

			// return this.resource.post(formData, { headers: {'Content-Type': undefined} }, {elementId: elementId}, additionalPath).then(function (response) {
			return this.resource.post(formData, { transformRequest: angular.identity, headers: {'Content-Type': undefined} }, {elementId: elementId}, additionalPath).then(function (response) {
				return response;
			});
		};

		this.checkStatus = function(elementId) {
			var additionalPath = 'status';
			return this.resource.get({elementId: elementId}, this.config, additionalPath).then(function(response) {
				return response;
			});
		};
}]);