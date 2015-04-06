'use strict';

angular.module('ThreeSixtyOneView.services')
.service('ManageTemplatesService', ['Model', 'ManageTemplatesModel', function (Model, ManageTemplatesModel) {
	var MyManageTemplatesModel, mymanagetemplatesdata;

	MyManageTemplatesModel = new Model();
	angular.extend(this, MyManageTemplatesModel.prototype);
	mymanagetemplatesdata = new MyManageTemplatesModel(ManageTemplatesModel);
	angular.extend(this, mymanagetemplatesdata);

	this.getAll = function(type) {
		var config = {
			params: {}
		};
		if(!!type) {
			config.params.type = type;
		}

		return this.resource.get({}, config, '').then(function(response) {
			return response;
		});
	};

	this.get = function(templateId) {
		return this.resource.get({templateId: templateId}, {}, '').then(function(response) {
			return response;
		});
	};
}]);
