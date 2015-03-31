'use strict';

angular.module('ThreeSixtyOneView.services')
.service('ManageTemplatesService', ['Model', 'ManageTemplatesModel', function (Model, ManageTemplatesModel) {
	var MyManageTemplatesModel, mymanagetemplatesdata;

	MyManageTemplatesModel = new Model();
	angular.extend(this, MyManageTemplatesModel.prototype);
	mymanagetemplatesdata = new MyManageTemplatesModel(ManageTemplatesModel);
	angular.extend(this, mymanagetemplatesdata);

	this.getAll = function() {
		this.resource.get({}, {}, '').then(function(response) {
			return response;
		});
	};
}]);
