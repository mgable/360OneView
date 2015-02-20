"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	_ = require('underscore'),
	projectInfo = funcs.readProjectInfo();


beforeEach(
	function(){
		browser.driver.manage().window().setSize(1280, 1024);
	}
);


describe("calculations", function(){

	it("should calculate a scenario", function(){
		browser.get(projectInfo.scenario.url);
		specs.simulateButton.click();
		browser.waitForAngular();
		browser.getLocationAbsUrl().then(function(url){
			expect(url).toContain("/calculate")
		});
	});

	it("should update the scenarios last modified", function(){
		browser.get(projectInfo.project.url);
		funcs.getFirstItemTitle().getText().then(function(title){
			expect(title).toEqual(projectInfo.scenario.title);
		});
	});

	it("should set the scenarios status to 'in process'", function(){
		browser.get(projectInfo.project.url);
		var status = funcs.getFirstItem().element(by.css(specs.statusClass));
		expect(funcs.hasClass(status, "fa-in_progress")).toBe(true);
	});

	it("should click through to the calculate page when the scenario is 'in progress'", function(){
		browser.get(projectInfo.project.url);
		funcs.getFirstItem().click();
		browser.waitForAngular();
		setTimeout(function(){
			browser.getLocationAbsUrl().then(function(url){
				expect(url).toContain("/calculate");
			});
		}, 2000);
	});
});