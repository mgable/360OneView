'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('PivotService', ["$q", "$rootScope", "EVENTS", "Model", "PivotModel", function ($q, $rootScope, EVENTS, Model, PivotModel) {
		var MyPivotDataModel, mypivotdata;

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

		this.updateCell = function(elementId, viewId, cellData) {
			var additionalPath = 'updateCell';
			return this.resource.post(cellData, this.config, {elementId: elementId, viewId: viewId}, additionalPath).then(function (response) {
				return response;
			});
		};

}]);