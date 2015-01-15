'use strict';

angular.module('ThreeSixtyOneView')
  .service('ImportService', ["$q", "$rootScope", "EVENTS", "Model", "ImportModel", function ImportService($q, $rootScope, EVENTS, Model, ImportModel) {
		var MyImportModel, myView, self = this;

		MyImportModel = new Model();
		angular.extend(this, MyImportModel.prototype);
		myView = new MyImportModel(ImportModel);
		angular.extend(this, myView);

		this.uploadFile = function(name, file){
			var reader = new FileReader(), deferred = $q.defer();
			
		    reader.onload = deferred.resolve;
			reader.readAsDataURL(file);
		    
		    return deferred.promise.then(function(e) { 
		    	return self.resource.post(e.target.result, self.config, {}, "upload?name="+name); 
		    });
		};

		this.checkStatus = function(groupId, localeId) {
			return self.resource.get({}, self.config, "checkStatus?varGroupId="+groupId+"&LocaleId="+localeId);
		};
}]);