'use strict';

angular.module('ThreeSixtyOneView')
  .service('PivotViewService', ["$q", "Model", "PivotViewModel",  function PivotViewService($q, Model, PivotViewModel) {
		var MyPivotviewModel, mypivotview, self = this;

		MyPivotviewModel = new Model();
		angular.extend(this, MyPivotviewModel.prototype);
		mypivotview = new MyPivotviewModel(PivotViewModel);
		angular.extend(this, mypivotview);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getDefaultView = function(views, cubeId){
			// this logic will change
			var viewId = views[0].id;
			return this.get({cubeId:cubeId, viewId: viewId});
		};

		this.getViewsAndDefault = function(cubeId){
  			return this.get({cubeId:cubeId}).then(function(views){
  				return self.getDefaultView(views, cubeId).then(function(defaultView){
  					return {"views": views, "defaultView": defaultView};
  				});
  			});
		};

}]);
