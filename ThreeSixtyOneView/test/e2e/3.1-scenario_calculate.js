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
	var calculatingScenario;

	it("should find the scenario in the items list", function(){
		browser.get(projectInfo.project.url);
		var items = funcs.getItems();
		items.each(function(item){
			item.element(by.css(specs.titleClass)).getText().then(function(title){
				if (title.trim() === projectInfo.scenario.title.trim()){
					calculatingScenario = item;
				}
			})
		})
	});

	it("should calculate a scenario", function(){
		browser.get(projectInfo.scenario.url);
		specs.simulateButton.click();
		browser.waitForAngular();
		browser.getLocationAbsUrl().then(function(url){
			expect(url).toContain("/calculate")
		});
	});

	it("should set the scenarios status to 'in process'", function(){
		browser.get(projectInfo.project.url);
		var status = calculatingScenario.element(by.css(specs.statusClass));
		expect(funcs.hasClass(status, "fa-in_progress")).toBe(true);
	});

	it("should click through to the calculate page when the scenario is 'in progress'", function(){
		browser.get(projectInfo.project.url);
		var calculatingScenarioButton = calculatingScenario.element(by.css(".title a"));
		calculatingScenarioButton.click();
		browser.waitForAngular();
		setTimeout(function(){
			browser.getLocationAbsUrl().then(function(url){
				expect(url).toContain("/calculate");
				_.extend(projectInfo,  {"calculate": {"url": url}});
				funcs.saveProjectInfo(projectInfo);
			});
		}, 2000);
	});

	it("should disabled the 'simulate' button when a scenario is 'in progress'", function(){
		browser.get(projectInfo.calculate.url);
		expect(funcs.hasClass(specs.simulateButton, 'disabled')).toBeTruthy();
	});
});