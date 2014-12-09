'use strict';

angular.module('ThreeSixtyOneView')
  .service('PivotViewService', ["$q", "$rootScope", "EVENTS", "Model", "PivotViewModel",  function PivotViewService($q, $rootScope, EVENTS, Model, PivotViewModel) {
		var MyPivotviewModel, mypivotview, self = this;

		MyPivotviewModel = new Model();
		angular.extend(this, MyPivotviewModel.prototype);
		mypivotview = new MyPivotviewModel(PivotViewModel);
		angular.extend(this, mypivotview);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getDefaultView = function(views, cubeId){
			// this logic will change
			var viewId = views[0].id;
			return this.get({viewId: viewId});
		};

		this.getViewsAndDefault = function(cubeId){
			return this.get().then(function(views){
				if (views.length && views.length > 0){
					return self.getDefaultView(views, cubeId).then(function(defaultView){
						return {"views": views, "defaultView": defaultView};
					});
				}
				$rootScope.$broadcast(EVENTS.error, {title: "ERROR: No Views", msg: "There are no views available"});
				return {"views": [], "defaultView": {}};
			});
		};

}]);
