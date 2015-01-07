"use strict";

var specs = require('./0.0-specs.js'),

data = {
	selectMasterProject: function(){
		var masterProject;
		
		specs.searchInputField.sendKeys(specs.masterProject);
		masterProject = specs.getFirstItem();
		masterProject.click();
	}
}

module.exports = data;