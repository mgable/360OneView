"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	_ = require ("underscore"),
	projectInfo = {};

if(!browser.params.tests || browser.params.tests === 11){


	describe("executing listing tests", function(){
		console.info("executing listing DATA tests");
		it("should set up the tests", function(){
			console.info("Project Listing DATA Tests:");
		});

	})

	describe('Project Listing Page: ', function() {
		beforeEach(
			function(){
				browser.driver.manage().window().setSize(1280, 1024);
				browser.get(funcs.getProjectUrl());
			}
		);

		xit("should have the correct number of projects", function(){
			var flow = protractor.promise.controlFlow(),
				projects;

			flow.await(funcs.getRawData_projects().then(function(data){
				projects = data
			})).then(function(){
				funcs.getItems().count().then(function(count){
					expect(count).toBe(projects.length);
				});
			});
		});

		xit("should have the correct projects", function(){
			var flow = protractor.promise.controlFlow(),
				projects

			flow.await(funcs.getRawData_projects().then(function(data){
				projects = funcs.sortProjectsByDate(data)
			})).then(function(){
				funcs.getAllItemTitles().getText().then(function(titles){
					_.each(titles, function(title, i, a){
						expect(title).toEqual(projects[i].name);
					})
				});
			});
		});

		xit("should list the correct scenarios associated with a project", function(){
			var items = funcs.getItems(),
				flow = protractor.promise.controlFlow(),
				projects,
				data = []

			flow.await(funcs.getRawData_projects().then(function(p){
				projects = funcs.sortProjectsByDate(p)
			})).then(function(){
				_.each(projects, function(project,index,array){
		 			flow.await(funcs.getRawData_scenarios(project.uuid).then(function(scenarios){
						data.push({uuid: project.uuid, scenarios:scenarios});
					}))
				});
			}).then(function(){
				items.each(function(item){
					item.element(by.css(specs.titleClass)).getAttribute("data-ms-id").then(function(dataMsId){
						var scenarios = _.findWhere(data, {uuid: dataMsId});
						item.click();
						browser.waitForAngular();
						funcs.getScenarios().count().then(function(count){
							expect(count).toEqual(scenarios.scenarios.length)
						});
						var index = 0;
						funcs.getScenarios().each(function(scenario){
							scenario.getText().then(function(name){
								expect(name).toEqual(scenarios.scenarios[index].name);
								index++;

							})
							
						})
					});
				});
 			});
		});

		it("should have the correct meta data", function(){
			var flow = protractor.promise.controlFlow(),
				items = funcs.getItems(),
				projects;

			flow.await(funcs.getRawData_projects().then(function(p){
				projects = funcs.sortProjectsByDate(p);
			})).then(function(){
				items.each(function(item){
					item.element(by.css(specs.titleClass)).getAttribute("data-ms-id").then(function(dataMsId){
						var project = _.findWhere(projects, {uuid: dataMsId});
						item.click();
						browser.waitForAngular();

						item.element(by.css(specs.titleClass)).getText().then(function(title){
							if(title.toLowerCase() !== "master project") {
								specs.inlineEditField.isPresent().then(function(isPresent){
									if (isPresent){
										specs.inlineEditField.getText().then(function(description){
											expect(description).toEqual(project.description);
										});
									}
								});
							};
						});
					});
				});
			});
		});
	});
}
