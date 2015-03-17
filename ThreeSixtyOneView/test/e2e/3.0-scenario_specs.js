'use strict';

var coreSpecs = require('./0.0-specs.js'),
	_ = require('underscore'),

// globals
	edit = "li[data-ms-id='scenario.edit.button']",
	results = "li[data-ms-id='scenario.results.button']",
	analysisElementsDropdown = "div[data-ms-id='ScenarioEdit.analysisElements']",
	analysisElements = "element in group",
	selectedAnalysisElement = analysisElementsDropdown + " .dropdown-toggle",
	copyAndReplaceCube = "span[data-ms-id='ScenarioEdit.copyReplaceElementHolder']",
	copyAndReplaceCubeName = copyAndReplaceCube + " .filename",
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
	editorTabs = ".nav-tabs li",
	editorTabContent = "tab in tabs",
	pivotBuilderTab = "#pivotBuilder",
	viewName = "viewData.name", 
	viewDropDown = "#pivotBuilder .save-menu .dropdown-toggle",
	viewSaveAsButton = ['.menu-item', 'Save As'],
	viewRenameButton = ['.menu-item', 'Rename'],
	viewRevertButton = ['.menu-item', 'Revert'],
	saveAsBox = ".saveAsBox",
	saveAsNameField = "saveAsName",
	saveAsSubmitButton = ".saveAsBox .submit",

	draggableDimensions = "item in getViewData(pivotBuilderItem.name)",

	assumedData = { 
		'defaultSelectedAnalysisElement': 'Marketing Plan'
	},

	data = {
		scenarioUrl: '#/scenario/:projectId/:scenarioId/edit/',
		calculateUrl: '#/scenario/:projectId/:scenarioId/calculate',
		assumedData: assumedData,
		editButton: element(by.css(edit)),
		resultsButton: element(by.css(results)),
		cubes: element.all(by.repeater(analysisElements)),
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
		replaceCancelButton: element(by.css(replaceCancelButton)),
		editorTabs: element.all(by.css(editorTabs)),
		pivotBuilderTab: element(by.css(pivotBuilderTab)),
		viewName: element(by.binding(viewName)),
		viewDropDown: element(by.css(viewDropDown)),
		viewRevertButton: element(by.cssContainingText(viewRevertButton[0], viewRevertButton[1])),
		viewSaveAsButton: element(by.cssContainingText(viewSaveAsButton[0], viewSaveAsButton[1])),
		saveAsNameField: element(by.model(saveAsNameField)),
		saveAsBox: element(by.css(saveAsBox)),
		saveAsSubmitButton: element(by.css(saveAsSubmitButton)),
		draggableDimensions: element.all(by.repeater(draggableDimensions))
	};

_.extend(data, coreSpecs);

module.exports = data;