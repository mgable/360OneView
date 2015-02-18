'use strict';

// globals
var edit = "li[data-ms-id='scenario.edit.button']",
	results = "li[data-ms-id='scenario.results.button']",
	simulate = "span[data-ms-id='scenario.simulate.button']",
	analysisElementsDropdown = "div[data-ms-id='ScenarioEdit.analysisElements']",
	analysisElements = "element in group",
	selectedAnalysisElement = analysisElementsDropdown + " .dropdown-toggle",
	copyAndReplaceCube = analysisElementsDropdown + " .copy-replace-holder"


	data = {
		editButton: element(by.css(edit)),
		resultsButton: element(by.css(results)),
		simulateButton: element(by.css(simulate)),
		analysisElements: element.all(by.repeater(analysisElements)),
		selectedAnalysisElement: element(by.css(selectedAnalysisElement)),
		copyAndReplaceCube: element(by.css(copyAndReplaceCube))
	};

module.exports = data;