'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('PivotService', ["$q", "$rootScope", "EVENTS", "Model", "PivotModel", function ($q, $rootScope, EVENTS, Model, PivotModel) {
		var MyPivotDataModel, mypivotdata, self = this;

		MyPivotDataModel = new Model();
		angular.extend(this, MyPivotDataModel.prototype);
		mypivotdata = new MyPivotDataModel(PivotModel);
		angular.extend(this, mypivotdata);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getSlice = function(elementId, viewId) {
			var additionalPath = 'slice';
			return this.resource.get({elementId: elementId, viewId: viewId}, this.pivotConfig, additionalPath).then(function (response) {
				return response;
			});
		};

}]);