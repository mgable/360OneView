"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	_ = require("underscore"),
	projectInfo = {},
	allData = {};

	console.info("the tests to run are:");
	console.info(browser.params.test || "all");

if(!browser.params.test || browser.params.test === "setup"){

	describe("executing setup", function(){
		console.info("executing setup");
	});

	describe("finding project types", function(){
		beforeEach(
			function(){
				browser.driver.manage().window().setSize(1280, 1024);
				browser.get(funcs.getProjectUrl());
			}
		);

		it("should find a 'calculated scenario", function(){
			var projects = funcs.getAllItemTitles(),
				projectId;
			projects.each(function(project){
				project.click();
				browser.getLocationAbsUrl().then(function(url){
					projectId = funcs.getProjectId(url);
					console.info("the project id is");
					console.info(projectId);
				})
				var scenarios = funcs.getItems();
				scenarios.each(function(scenario){
					scenario.element(by.css('.title a')).getText().then(function(title){
						console.info("the title is");
						console.info(title);
						funcs.getClass(scenario.element(by.css(specs.statusClass))).then(function(classes){
							console.info("the status is");
							console.info(classes);
							scenario.element(by.css('.title a')).getAttribute('data-ms-id').then(function(id){
								console.info("the scenario id is ");
								console.info(id);
							});
						});
					});
				
				});
				browser.get(funcs.getProjectUrl());
			})
		});
	});
};