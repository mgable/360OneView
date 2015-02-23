'use strict';

// globals
var edit = "li[data-ms-id='scenario.edit.button']",
	results = "li[data-ms-id='scenario.results.button']",
	simulate = "span[data-ms-id='scenario.simulate.button']",
	analysisElementsDropdown = "div[data-ms-id='ScenarioEdit.analysisElements']",
	analysisElements = "element in group",
	selectedAnalysisElement = analysisElementsDropdown + " .dropdown-toggle",
	copyAndReplaceCube = analysisElementsDropdown + " .copy-replace-holder",
	copyAndReplaceCubeName = copyAndReplaceCube + " .dropdown-filename",
	replaceButton = "span[data-ms-id='ScenarioEdit.replaceElement']",
	copyButton = "span[data-ms-id='ScenarioEdit.copyElement']",
	analysisElementFileList = "file in fileList",
	analysisElementReplace = "div[data-ms-id='analysisElementReplace']",
	analysisElementCopy = "div[data-ms-id='analysisElementCopy']", 
	cancelButton = analysisElementCopy + " .ms-btn-cancel",
	submitButton = analysisElementCopy + " .ms-btn-submit",
	replaceSubmitButton = analysisElementReplace + " .ms-btn-submit",
	replaceCancelButton = analysisElementReplace + " .ms-btn-cancel",
	copyAndReplaceField = "newElement.name",
	copyAndReplaceDescriptionField = "newElement.description",

	assumedData = { "cubes":
			['Marketing Plan',
			'Competitive Incentive (PNVS) Spend',
			'Competitive Intent',
			'Competitive Marketshare',
			'Competitive Product Lifecycle',
			'Competitive Vehicle Price',
			'Floating Base',
			'GQV',
			'Incentives',
			'Macroeconomics',
			'Product Lifecycle',
			'Vehicle Price',
			'Web Traffic'],
		'preloadedAnalysisElement': 'PRELOADED SIMULATION',
		'defaultSelectedAnalysisElement': 'Marketing Plan'
	},


	data = {
		assumedData: assumedData,
		editButton: element(by.css(edit)),
		resultsButton: element(by.css(results)),
		simulateButton: element(by.css(simulate)),
		analysisElements: element.all(by.repeater(analysisElements)),
		selectedAnalysisElement: element(by.css(selectedAnalysisElement)),
		copyAndReplaceCube: element(by.css(copyAndReplaceCube)),
		replaceButton: element(by.css(replaceButton)),
		copyButton: element(by.css(copyButton)),
		analysisElementFileList: element.all(by.repeater(analysisElementFileList)),
		cancelButton: element(by.css(cancelButton)),
		copyAndReplaceNameField: element(by.model(copyAndReplaceField)),
		copyAndReplaceDescriptionField: element(by.model(copyAndReplaceDescriptionField)),
		submitButton: element(by.css(submitButton)),
		copyAndReplaceCubeName: element(by.css(copyAndReplaceCubeName)),
		replaceSubmitButton: element(by.css(replaceSubmitButton)),
		replaceCancelButton: element(by.css(replaceCancelButton))
	};

module.exports = data;