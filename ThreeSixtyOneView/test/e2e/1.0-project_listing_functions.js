"use strict";

var coreFunctions = require('./0.0-functions.js'),
	specs = require('./1.0-project_listing_specs.js'),
	_ = require('underscore'),

	data = {
		selectMasterProject: function(){
			var masterProject;
			
			this.enterSearch(specs.masterProject);
			masterProject = this.getFirstItem();
			masterProject.click();
		},
		enterSearch: function(searchTerm){
			specs.searchInputField.sendKeys(searchTerm);
		},
		clearSearch: function(){
			specs.searchInputField.clear();
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
			return this.getProjectAbsoluteUrl() + specs.testQuery + "&" + specs.server;
		},
		getProjectAbsoluteUrl: function(){
			return browser.params.path + specs.projectUrl;
		},
		getDashboardUrl: function(id){
			return this.getDashboardAbsoluteUrl(id) + specs.testQuery + "&" + specs.server;
		},
		getDashboardAbsoluteUrl: function(id){
			return browser.params.path + specs.dashboardUrl.replace(/:id/, id );
		},
		getMasterProjectItem: function(){
			return element(by.css(specs.masterProjectClass));
		},
		getItemCount: function(){
			return element(by.css(specs.itemCount));
		},
		getFirstItemTitle: function(){
			return element.all(by.repeater(specs.items).column('name')).first();
		},
		getLastItemTitle: function(){
			return element.all(by.repeater(specs.items).column('name')).last();
		},
		getSelectedItemTitle: function(){
			return element(by.css(specs.selectedItemTitle));
		},
		getAllItemTitles: function(){
			return element.all(by.repeater(specs.items).column('name'));
		},
		getAllItemModifiedOn: function(){
			return element.all(by.repeater(specs.items).column('auditInfo.lastUpdatedOn'));
		},
		getAllItemCreatedOn: function(){
			return element.all(by.repeater(specs.items).column('auditInfo.createdOn'));
		},
		getFavorites: function(){
			return element.all(by.css(specs.favoriteClassHolder));
		},
		getItems: function(){
			return element.all(by.repeater(specs.items));
		},
		getFirstItem: function(){
			return element(by.repeater(specs.items).row(0));
		},
		getLastItem: function(){
			return element.all(by.repeater(specs.items)).last();
		},
		getScenarios: function(){
			return element.all(by.repeater(specs.scenariosElement));
		},
		getFirstScenario: function(){
			var allScenarios = element.all(by.repeater(specs.scenariosElement)),
				firstScenarioElement = allScenarios.first().element(by.css("span"));
			return firstScenarioElement;
		}
	};

_.extend(data, coreFunctions);

module.exports = data;