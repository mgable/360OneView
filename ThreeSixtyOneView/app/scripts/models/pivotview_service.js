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
			return this.get({viewId: viewId, cubeId: cubeId});
		};

		this.getViewsList = function(cubeId) {
			return this.resource.get({cubeId: cubeId}, this.config, '').then(function (response) {
				return response;
			});
		};

		this.getView = function(viewId, cubeId) {
			return this.resource.get({viewId: viewId, cubeId: cubeId}, this.config, '').then(function (response) {
				return response;
			});
		};

		this.createView = function(newView, cubeId) {
			return this.resource.post(newView, this.config, {cubeId: cubeId}, '').then(function (response) {
				return response;
			});
		};

		this.updateView = function(modifiedView, cubeId) {
			return this.resource.put(modifiedView, this.config, {viewId: modifiedView.id, cubeId: cubeId}, '').then(function (response) {
				return response;
			});
		};

		this.renameView = function(viewId, cubeId, newName) {
			return this.resource.put({name: newName}, this.config, {viewId: viewId, cubeId: cubeId}, 'name').then(function (response) {
				return response;
			});
		};

		this.deleteView = function(viewId, cubeId) {
			return this.resource.delete('', this.config, {viewId: viewId, cubeId: cubeId}, '').then(function (response) {
				return response;
			});
		};

}]);