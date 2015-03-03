'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ManageAnalysisViewsService', ["$q", "$rootScope", "EVENTS", "Model", "ManageAnalysisViewsModel", function ManageAnalysisViewsService($q, $rootScope, EVENTS, Model, ManageAnalysisViewsModel) {
		var MyPivotviewModel, mypivotview,
			// view and filter ids should be null when creating a new view
			resetView = function(newView) {
				newView.id = null;
				_.each(newView.filters, function(filter) {
					filter.id = null;
				});
				return newView
			};

		MyPivotviewModel = new Model();
		angular.extend(this, MyPivotviewModel.prototype);
		mypivotview = new MyPivotviewModel(ManageAnalysisViewsModel);
		angular.extend(this, mypivotview);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

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

		this.getViewRelatedBy = function(viewId, cubeId) {
			return this.get({cubeId: cubeId}, {params: {relatedByView: viewId}}).then(function (response) {
				return response;
			});
		};

		this.createView = function(newView, cubeId, relatedByView) {
			var config = {};
			if(!!relatedByView) {
				config.params = {
					relatedByView: relatedByView
				};
			}

			return this.resource.post(resetView(newView), config, {cubeId: cubeId}).then(function (response) {
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