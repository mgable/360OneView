"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	Q = require('q'),
	_ = require("underscore"),
	projectInfo = {},
	allData = {};

	console.info("the tests to run are:");
	console.info(browser.params);
	console.info(browser.params.tests || "all");

if(!browser.params.tests || browser.params.tests === "setup"){

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
				projectId, 
				project,
				promises = [],
				promise;
			//projects.each(function(project){
			for (var i = 0, limit = 1; i < limit; i++){
				project = projects.get(i);
				promise = project.getAttribute('data-ms-id').then(function(projectId){
					console.info("the project id is");
					console.info(projectId);
					allData[projectId] = {};
					project.click();

					var scenarios = funcs.getItems();
					scenarios.each(function(scenario){
						var obj = {};
						scenario.element(by.css('.title a')).getText().then(function(title){
							console.info("the title is");
							console.info(title);
							obj.title = title;

							funcs.getClass(scenario.element(by.css(specs.statusClass))).then(function(classes){
								console.info("the status is");
								console.info(classes);
								obj.status = classes;
								scenario.element(by.css('.title a')).getAttribute('data-ms-id').then(function(id){
									console.info("the scenario id is ");
									allData[projectId][id] = obj
									console.info(id);
								});
							});
						});
					});
				});
				promises.push(promise);
				browser.get(funcs.getProjectUrl());
			}
			//});

			Q.all(promises).done(function(){
				console.info("allData- XXXXXXXXXXXXXXXXX");
				console.info(allData);
			});

		});
	});
};