'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ScenarioElementService', ["Model", "ScenarioElementModel", function (Model, ScenarioElementModel) {
	var MyScenarioElement, myElements, self = this;

		MyScenarioElement = new Model();
		angular.extend(this, MyScenarioElement.prototype);
		myElements = new MyScenarioElement(ScenarioElementModel);
		angular.extend(this, myElements);

		this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.get = function(id){
			return myElements.get.call(this, {"id": id}).then(function(response){
				return response;
			});
		};
  }]);
