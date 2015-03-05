"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	Q = require('q'),
	_ = require("underscore"),
	projectInfo = {},
	allData = {};


	console.info("The tests to be run are:");
	console.info(browser.params.tests || "all");

if(!browser.params.tests || browser.params.test === "setup"){

	xdescribe("executing setup", function(){
		console.info("executing setup");
	});

	xdescribe("finding project types", function(){
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
				lookingFor = ['failed'], //, 'successful'
				promise;
			
			for (var i = 0, limit = 5; i < limit; i++){
				project = projects.get(i);
				promise = project.getAttribute('data-ms-id').then(function(_projectId_){
					projectId =_projectId_;
					allData[projectId] = {};
				});

				promises.push(promise);
				project.click();

				var scenarios = funcs.getItems();	
				promise = scenarios.each(function(scenario){
					var obj = {};
					scenario.element(by.css('.title a')).getText().then(function(title){
						obj.title = title;
						funcs.getClass(scenario.element(by.css(specs.statusClass))).then(function(classes){
							obj.status = classes.match(/(\w+)/g)[2];
							//lookingFor = _.reject(lookingFor, function(item){ return item === obj.status })
							scenario.element(by.css('.title a')).getAttribute('data-ms-id').then(function(id){
								allData[projectId][id] = obj
							});
						});
					});
				});

				promises.push(promise);
				browser.get(funcs.getProjectUrl());
			};

			Q.all(promises).done(function(){
				console.info("allData- XXXXXXXXXXXXXXXXX");
				console.info(allData);
			});

		});
	});
};