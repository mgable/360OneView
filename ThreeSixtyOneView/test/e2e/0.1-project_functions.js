"use strict";

var specs = require('./0.0-specs.js'),
	_ = require('underscore'),

data = {
	selectMasterProject: function(){
		var masterProject;
		
		this.searchMasterProject();
		masterProject = specs.getFirstItem();
		masterProject.click();
	},
	searchMasterProject: function(){
		specs.searchInputField.sendKeys(specs.masterProject);
	},
	testInputRestrictions: function(input, submit){
		_.each(specs.inputRestrictions, function(restrictedCharacter){
			input.clear();
			input.sendKeys(specs.minimumCharacters + restrictedCharacter);
			expect(submit.getAttribute('disabled')).toBeTruthy();
		});
	},
	hoverAndClick: function(button){
		browser.actions().mouseMove(button).perform();
		button.click();
	}
};

module.exports = data;