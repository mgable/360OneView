"use strict";

var specs = require('./0.0-specs.js'),
	_ = require('underscore'),

data = {
	selectMasterProject: function(){
		var masterProject;
		
		this.enterSearch(specs.masterProject);
		masterProject = specs.getFirstItem();
		masterProject.click();
	},
	enterSearch: function(searchTerm){
		specs.searchInputField.sendKeys(searchTerm);
	},
	testInputRestrictions: function(input, submit){
		_.each(specs.inputRestrictions, function(restrictedCharacter){
			input.clear();
			input.sendKeys(specs.minimumCharacters + restrictedCharacter);
			expect(submit.getAttribute('disabled')).toBeTruthy();
		});
	},
	testMinAndMaxNameLength: function(input, submit){
		input.clear();
		input.sendKeys("x");
		expect(submit.isEnabled()).toBe(false);

		input.clear();
		input.sendKeys(specs.minimumCharacters);
		expect(submit.isEnabled()).toBe(true);

		input.clear();
		input.sendKeys(specs.maximumCharacters);
		expect(submit.isEnabled()).toBe(true);

		input.sendKeys("z");
		expect(submit.isEnabled()).toBe(false);

		input.clear();
		input.sendKeys("this is just right");
		expect(submit.isEnabled()).toBe(true);
	},
	hoverAndClick: function(button){
		browser.actions().mouseMove(button).perform();
		button.click();
	},
	filterByFavorites: function(){
		specs.filterByButton.click();
		specs.filterByfavoritesButton.click();
	},
	filterByItem: function(){
		specs.filterByButton.click();
		specs.filterByItemButton.click();
	},
	getProjectUrl: function(){
		return this.getProjectAbsoluteUrl() + specs.testQuery;
	},
	getProjectAbsoluteUrl: function(){
		return browser.params.path + specs.projectUrl;
	},
	getDashboardUrl: function(id){
		return this.getDashboardAbsoluteUrl(id) + specs.testQuery;
	},
	getDashboardAbsoluteUrl: function(id){
		return browser.params.path + specs.dashboardUrl.replace(/:id/, id );
	}
};

module.exports = data;