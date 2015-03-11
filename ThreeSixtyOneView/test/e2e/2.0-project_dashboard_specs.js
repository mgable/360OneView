"use strict";
var noScenarios = "a[data-ms-id='noScenariosAlert']", 
	title = "scenario.title",
	description = "input[data-ms-id='ScenarioCreate.inputDescription']",
	baseScenario = "label[data-ms-id='ScenarioCreate.inputBaseScenario']",
	submit = "button[data-ms-id='ScenarioCreate.submit']",
	cancel = "button[data-ms-id='ScenarioCreate.cancel']",
	confirmBaseScenario = "button[data-ms-id='ScenarioCreate.confirmBaseScenario']",
	cancelBaseScenario = "button[data-ms-id='ScenarioCreate.cancelBaseScenario']",
	baseScenarioInput = "scenario.referenceScenario.name",
	scenarioBaseScenario = "a[data-ms-id='ScenarioListing:baseScenario']",

	data = {
		testScenarionNameFirst: "My FIRST new test scenario title - " + Date.now(),
		testScenarionNameSecond: "My SECOND new test scenario title - " + Date.now(),
		testScenarionDescription: "My new test scenario description.",

		noScenariosAlert: element(by.css(noScenarios)),
		scenarioBaseScenarioElement: element(by.css(scenarioBaseScenario )),
		baseScenarioInputField: element(by.model(baseScenarioInput)),

		inputName: element(by.model(title)),
		inputDescription: element(by.css(description)),
		inputbaseScenario: element(by.css(baseScenario)),
		submitButton: element(by.css(submit)),
		cancelButton: element(by.css(cancel)),
		confirmBaseScenarioButton: element(by.css(confirmBaseScenario)),
		cancelBaseScenarioButton: element(by.css(cancelBaseScenario)),
	};

module.exports = data;