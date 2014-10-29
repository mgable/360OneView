'use strict';

angular.module('ThreeSixtyOneView')
  .service('PivotViewService', ["Model", "PivotViewModel", function PivotViewService(Model, PivotViewModel) {
		var MyPivotviewModel, mypivotview;

		MyPivotviewModel = new Model();
		angular.extend(this, MyPivotviewModel.prototype);
		mypivotview = new MyPivotviewModel(PivotViewModel);
		angular.extend(this, mypivotview);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

}]);
