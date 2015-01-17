'use strict';

angular.module('ThreeSixtyOneView')
  .service('ExportService', ["$q", "$rootScope", "EVENTS", "Model", "ExportModel", function ExportService($q, $rootScope, EVENTS, Model, ExportModel) {
		var MyExportModel, myView, self = this;

		MyExportModel = new Model();
		angular.extend(this, MyExportModel.prototype);
		myView = new MyExportModel(ExportModel);
		angular.extend(this, myView);

		this.prepareFile = function(data, cubeId, localeId) {
			return self.resource.post(data, self.config, {}, "do/" + cubeId + "/"+ localeId); 
		};

		this.checkStatus = function(groupId, localeId) {
			return self.resource.get({}, self.config, "checkStatus/" + groupId + "/"+ localeId);
		};
}]);