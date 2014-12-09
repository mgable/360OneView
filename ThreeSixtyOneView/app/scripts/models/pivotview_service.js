'use strict';

angular.module('ThreeSixtyOneView')
  .service('PivotViewService', ["$q", "$rootScope", "EVENTS", "Model", "PivotViewModel", function PivotViewService($q, $rootScope, EVENTS, Model, PivotViewModel) {
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
					return self.getDefaultView(views, cubeId).then(function(currentView){
						return {"views": views, "currentView": currentView};
					});
				}
				$rootScope.$broadcast(EVENTS.error, {title: "ERROR: No Views", msg: "There are no views available"});
				return {"views": [], "currentView": {}};
			});
		};

		this.renameView = function(viewId, newName) {
			return this.resource.put({name: newName}, this.config, {cubeId: 1, viewId: viewId}, 'name').then(function (response) {});
		};

		this.getView = function(viewId) {
			return this.resource.get({cubeId: 1, viewId: viewId}, this.config, '').then(function (response) {});
		};

		// this one does not work for now
		this.deleteView = function(viewId) {
			return this.resource.delete('', this.config, {cubeId: 1, viewId: viewId}, '').then(function (response) {
				// console.log(response);
			});
		};

		this.createView = function(newView) {
			return this.resource.post(newView, this.config, {cubeId: 1}, '').then(function (response) {
				console.log(response);
			});
		}

}]);
