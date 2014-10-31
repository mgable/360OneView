'use strict';

angular.module('ThreeSixtyOneView')
  .service('PivotViewService', ["$q", "Model", "PivotViewModel",  function PivotViewService($q, Model, PivotViewModel) {
		var MyPivotviewModel, mypivotview, 


		MyPivotviewModel = new Model();
		angular.extend(this, MyPivotviewModel.prototype);
		mypivotview = new MyPivotviewModel(PivotViewModel);
		angular.extend(this, mypivotview);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getDefaultView = function(){
			return this.get({cubeId:1, viewId: 1});
		};

		this.getViewsAndDefault = function(){
			return $q.all([this.get(), this.getDefaultView()]).then(function(response){
				console.info(response);
			});
		};

}]);
