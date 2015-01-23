'use strict';

angular.module('ThreeSixtyOneView')
  .service('PivotDataService', ["$q", "$rootScope", "EVENTS", "Model", "PivotDataModel", function PivotViewService($q, $rootScope, EVENTS, Model, PivotDataModel) {
		var MyPivotDataModel, mypivotdata, self = this;

		MyPivotDataModel = new Model();
		angular.extend(this, MyPivotDataModel.prototype);
		mypivotdata = new MyPivotDataModel(PivotDataModel);
		angular.extend(this, mypivotdata);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getSlice = function(elementId, viewId) {
			var additionalPath = 'slice';
			return this.resource.get({elementId: elementId, viewId: viewId}, this.pivotConfig, additionalPath).then(function (response) {
				return response;
			});
		};

}]);