'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ImportService', ["$q", "$rootScope", "EVENTS", "Model", "ImportModel", function ImportService($q, $rootScope, EVENTS, Model, ImportModel) {
		var MyImportModel, myView, self = this;

		MyImportModel = new Model();
		angular.extend(this, MyImportModel.prototype);
		myView = new MyImportModel(ImportModel);
		angular.extend(this, myView);

		this.uploadFile = function(name, file){
	        var fd = new FormData();
	        fd.append('file', file);

	        return self.resource.post(fd, { transformRequest: angular.identity, headers: {'Content-Type': undefined} }, {}, "upload?name="+name); 
		};

		this.checkStatus = function(groupId, localeId) {
			return self.resource.get({}, self.config, "checkStatus?varGroupId="+groupId+"&LocaleId="+localeId);
		};
}]);