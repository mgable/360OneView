'use strict';

angular.module('ThreeSixtyOneView')
  .service('ExportResourceService', ["$q", "$rootScope", "EVENTS", "Model", "ExportResourceModel", '$timeout', function ($q, $rootScope, EVENTS, Model, ExportResourceModel, $timeout) {
		var MyExportModel, myView, self = this;

		MyExportModel = new Model();
		angular.extend(this, MyExportModel.prototype);
		myView = new MyExportModel(ExportResourceModel);
		angular.extend(this, myView);

		// this.prepareFile = function(data, cubeId, localeId) {
		// 	return self.resource.post(data, self.config, {}, "do/" + cubeId + "/"+ localeId); 
		// };

		// this.checkStatus1 = function(groupId, localeId) {
		// 	return self.resource.get({}, self.config, "checkStatus/" + groupId + "/"+ localeId);
		// };

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
			return this.resource.get({elementId: elementId}, this.config, additionalPath).then(function(response) {
				return self.config.url;
				// return response;
			});
		};
		// this.downloadFile(68).then(function(response) {
		// 	var a = angular.element('<a>');
		// 	$('body').append(a);
		// 	a.text('wow');
		// 	a.attr('href',response);
		// 	a.attr('id','exportLink');
		// 	$timeout(function() {
		// 		console.log(a);
		// 		document.getElementById('exportLink').click();
		// 	}, 1000);
		// });
}]);