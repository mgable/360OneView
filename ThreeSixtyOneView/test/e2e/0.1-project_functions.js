"use strict";

var specs = require('./0.0-specs.js'),
	_ = require('underscore'),
	fs = require('fs'),
	filename = "./test/e2e/project.json";

data = {
	saveProjectInfo: function(url, project, scenario){
		var data = JSON.stringify({url: url, project: project, scenario: scenario});
		fs.writeFileSync(filename, data);
	},
	readProjectInfo: function(){
		return JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
	},
	deleteProjectInfo: function(){
		fs.unlinkSync(filename);
	},
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
	hasClass: function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
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
		return browser.params.path + specs.projectUrl + specs.testQuery;
	},
	getDashboardUrl: function(projectId){
		return browser.params.path + specs.dashboardUrl.replace(/:id/, projectId) + specs.testQuery;
	}
};

module.exports = data;