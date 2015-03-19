'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ManageScenariosService', ["Model", "ManageScenariosModel", function (Model, ManageScenariosModel) {
	var MyScenarioElement, myElements;

		MyScenarioElement = new Model();
		angular.extend(this, MyScenarioElement.prototype);
		myElements = new MyScenarioElement(ManageScenariosModel);
		angular.extend(this, myElements);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.get = function(scenarioId) {
			var additionalPath = "analysis-element";
			return this.resource.get({"id": scenarioId}, this.config, additionalPath).then(function(response) {
				return response;
			});
		};

		this.getAnalysisElementByScenarioAndCube = function(scenarioId, cubeId) {
			var additionalPath = "cube/:cubeId/analysis-element";
			return this.resource.get({"id": scenarioId, "cubeId": cubeId}, {}, additionalPath).then(function(response) {
				return response;
			});
		};

		this.getAnalysisElementByCubeName = function(scenarioId, cubeName) {
			var additionalPath = 'analysis-element',
				config = {
					params: {
						cubeName: cubeName
					}
				};
			return this.resource.get({'id': scenarioId}, config, additionalPath).then(function(response){
				return response;
			});
		};

		this.replaceAnalysisElementForCube = function(scenarioId, cubeId, analysisElementId) {
			var additionalPath = "cube/:cubeId/analysis-element";
			return this.resource.put({'id': analysisElementId}, {}, {id: scenarioId, cubeId: cubeId}, additionalPath).then(function (response) {
				return response;
			});
		};

		this.copyAndReplaceAnalysisElementForCube = function(scenarioId, cubeId, sourceElementId, analysisElement) {
			var additionalPath = 'cube/:cubeId/analysis-element',
				config = {
					params: {
						source: sourceElementId
					}
				};
			return this.resource.post(analysisElement, config, {id: scenarioId, cubeId: cubeId}, additionalPath).then(function (response) {
				return response;
			});
		};
  }]);
