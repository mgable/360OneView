'use strict';

var coreSpecs = require('./0.0-specs.js'),
	_ = require('underscore'),

	newViewName = "My New Test View " + Date.now(),
	edit = "li[data-ms-id='scenario.edit.button']",
	results = "li[data-ms-id='scenario.results.button']",
	analysisElementsDropdown = "div[data-ms-id='ScenarioEdit.analysisElements']",
	analysisElements = "element in group",
	selectedAnalysisElement = analysisElementsDropdown + " .dropdown-toggle",
	copyAndReplaceCube = "span[data-ms-id='ScenarioEdit.copyReplaceElementHolder']",
	copyAndReplaceCubeName = copyAndReplaceCube + " .filename",
	replaceButton = "span[data-ms-id='ScenarioEdit.replaceElement']",
	copyButton = "span[data-ms-id='ScenarioEdit.copyElement']",
	analysisElementFileList = "item in getList()",
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
	importTab = "#importBody",
	exportTab = "#exportBody",
	viewName = "viewData.name", 
	viewDropDown = "#pivotBuilder .save-menu .dropdown-toggle",
	viewSaveAsButton = ['.menu-item', 'Save As'],
	viewRenameButton = ['.menu-item', 'Rename'],
	viewRevertButton = ['.menu-item', 'Revert'],
	allViewsButton = ['.menu-item', 'All Views'],
	saveButton = ['.ms-button', 'Save View'],
	saveAsBox = ".saveAsBox",
	saveAsNameField = "saveAsName",
	saveAsSubmitButton = ".saveAsBox .submit",
	collapseHandle = ".collapse-handle span", 

	// drop down menu
	recentViews = "view in getViewsList()",
	recentViewsDropDown = "#pivotBuilder .recent-items .dropdown-toggle",
	tableFilterToggle = ".toggle-switch .switch",
	recentViewsModal = "item in getList()",

	dimensions = "dimension in getDimensions()",
	//dimensions =  "menuItem in dimension.members",
	addDimensionsButton =  [".add-label", "Add"], 
	dimensionsArea = "#dragDropArea",
	filterArea = ".filters-list",
	filterModal = "div[data-ms-id='filterModal']",
	filterSelectionList = "member in searchResults.members",
	filterLevelList = "item in selectedFilter.dimension.members",
	filterlevelDropdown = "selectedFilter.level.label",
	filterSeachField = "filterSearch.label",

	draggableDimensions = "item in getViewData(pivotBuilderItem.name)",
	columnDimensionsClass = ".dimensions-list",

	assumedData = { 
		'defaultSelectedAnalysisElement': 'Marketing Plan'
	},
	draftText = "Draft - ",
	draftRegEx = new RegExp("^" + draftText),

	data = {
		dimensionsRepeater: dimensions,
		filterLevelListRepeater: filterLevelList,
		filterSelectionListRepeater: filterSelectionList,
		newViewName: newViewName, 
		draftRegEx: draftRegEx,
		draftText: draftText,
		filterModal: filterModal, 
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
		importTab: element(by.css(importTab)),
		exportTab: element(by.css(exportTab)),
		viewName: element(by.binding(viewName)),
		viewDropDown: element(by.css(viewDropDown)),
		viewRevertButton: element(by.cssContainingText(viewRevertButton[0], viewRevertButton[1])),
		viewSaveAsButton: element(by.cssContainingText(viewSaveAsButton[0], viewSaveAsButton[1])),
		allViewsButton: element(by.cssContainingText(allViewsButton[0], allViewsButton[1])),
		viewRenameButton: element(by.cssContainingText(viewRenameButton[0], viewRenameButton[1])),
		saveAsNameField: element(by.model(saveAsNameField)),
		saveAsBox: element(by.css(saveAsBox)),
		saveAsSubmitButton: element(by.css(saveAsSubmitButton)),
		draggableDimensions: element.all(by.repeater(draggableDimensions)),
		recentViews: element.all(by.repeater(recentViews)),
		recentViewsDropDown: element(by.css(recentViewsDropDown)),
		dimensions: element.all(by.repeater(dimensions)),
		saveButton: element(by.cssContainingText(saveButton[0], saveButton[1])),
		addDimensionsButton: element.all(by.cssContainingText(addDimensionsButton[0], addDimensionsButton[1])),
		addColumnDimensionsButton: element.all(by.cssContainingText(addDimensionsButton[0], addDimensionsButton[1])).get(0),
		addRowDimensionsButton: element.all(by.cssContainingText(addDimensionsButton[0], addDimensionsButton[1])).get(1),
		collapseHandle: element(by.css(collapseHandle)),
		columnDimensions: element.all(by.css(columnDimensionsClass)).get(0).all(by.repeater(draggableDimensions)),
		rowDimensions: element.all(by.css(columnDimensionsClass)).get(1).all(by.repeater(draggableDimensions)),
		toggleTable: element.all(by.css(tableFilterToggle)).get(0),
		toggleFilters: element.all(by.css(tableFilterToggle)).get(1),
		dimensionsArea: element(by.css(dimensionsArea)),
		filterArea: element.all(by.css(filterArea)).get(0),
		recentViewsModal: element.all(by.repeater(recentViewsModal)),
		filters: element.all(by.css(filterArea)).get(0).all(by.repeater(dimensions)),
		filterSideMenu: element(by.css(filterModal)).element(by.css(".side-menu")).all(by.repeater(dimensions)),
		filterSelectionList: element.all(by.repeater(filterSelectionList)),
		filterLevelList: element.all(by.repeater(filterLevelList)),
		filterlevelDropdown: element(by.binding(filterlevelDropdown)),
		filterSeachField: element(by.model(filterSeachField))
	};

_.extend(data, coreSpecs);

module.exports = data;