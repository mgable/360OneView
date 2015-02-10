'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ExportResourceService', ["$q", "$rootScope", "EVENTS", "Model", "ExportResourceModel", function ($q, $rootScope, EVENTS, Model, ExportResourceModel) {
		var MyExportModel, myView, self = this;

		MyExportModel = new Model();
		angular.extend(this, MyExportModel.prototype);
		myView = new MyExportModel(ExportResourceModel);
		angular.extend(this, myView);

		this.requestExport = function(elementId, analysisView) {
			var additionalPath = '';
			return this.resource.post(analysisView, this.config, {elementId: elementId}, additionalPath).then(function (response) {
				return response;
			});
		};

		this.checkStatus = function(elementId) {
			var additionalPath = 'status';
			return this.resource.get({elementId: elementId}, this.config, additionalPath).then(function(response) {
				return response;
			});
		};

		this.downloadFile = function(elementId) {
			var additionalPath = 'download';
			return this.resource.get({elementId: elementId}, this.config, additionalPath).then(function() {
				return self.config.url;
			});
		};
}]);