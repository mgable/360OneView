"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	moreSpecs = require("./2.0-project_dashboard_specs.js"),
	funcs = require('./1.0-project_listing_functions.js'),
	_ = require ("underscore"),
	cache,
	projects = [],
	project,
	dashboardUrl,
	testName = {title: "Project Dashboard DATA", id: 21};

_.extend(specs, moreSpecs);

if(funcs.runTheseTests(testName)){

	describe("executing " + testName.title, function(){
		console.info("executing " + testName.title);
		it("should set up the tests", function(){
			console.info(testName.title + " Tests: ");
			cache = funcs.getCache();
			projects = funcs.sortProjectsByDate(cache.projects);
			project = projects[2],
			dashboardUrl = funcs.getDashboardUrl(project.uuid);
		});
	})

	describe('Project Dashboard Page: ', function() {
		var flow = protractor.promise.controlFlow();

		beforeEach(
			function(){
				browser.driver.manage().window().setSize(1280, 1024);
				browser.get(dashboardUrl);
			}
		);

		xit("should have the correct number of scenarios", function(){
			funcs.getItemCount().getText().then(function(count){
				expect(count).toEqual(cache[project.uuid].length.toString(10));
			});

			funcs.getItems().count().then(function(count){
				expect(count).toEqual(cache[project.uuid].length);
			})
		});

		xit("should have the correct scenarios", function(){
			var index = 0,
				sortedScenarios = funcs.sortProjectsByDate(cache[project.uuid]);

			funcs.getAllItemTitles().each(function(item){
				item.getText().then(function(title){
					expect(title).toBe(sortedScenarios[index].name);
					index++;
				});	
			});
		});

		xit("should have the correct statuses", function(){
			var currentStatus,
				items = funcs.getItems();

			items.each(function(item){
				item.element(by.css(specs.titleClass)).getAttribute('data-ms-id').then(function(id){
					item.element(by.css(specs.statusClass)).getAttribute("class").then(function(status){
						var matches = status.match(/fa\W*fa-(.+)/);
						currentStatus = matches[1] || null;

						flow.await(funcs.getRawData_scenarioStatus(id).then(
							function(status){
								var scenario = _.findWhere(cache[project.uuid], {id: parseInt(id)});
								scenario.status = (status.currentState && status.currentState.name) ? status.currentState.name.toLowerCase() : "not_calculated";
								expect(scenario.status).toEqual(currentStatus);
							}
						)).then(function(){
							funcs.saveInfo("./test/e2e/cache.json", cache);
						});
					});
				});
			});
		});

		xit("should have the correct description", function(){
			var items = funcs.getItems(),
				index = 0,
				sortedScenarios = funcs.sortProjectsByDate(cache[project.uuid]);

			items.each(function(item){
				item.click();
				browser.waitForAngular();

				specs.inlineEditField.isPresent().then(function(isPresent){
					if (isPresent){
						specs.inlineEditField.getText().then(function(description){
							expect(description).toEqual(sortedScenarios[index].description);
							index++;
						});
					} else {
						expect(sortedScenarios[index].description).not.toBeDefined();
						index++;
					}
				});
			});
		});

		xit("should have the correct created by data", function(){
			var items = funcs.getItems(),
				index = 0,
				sortedScenarios = funcs.sortProjectsByDate(cache[project.uuid]);

			items.each(function(item){
				item.click();
				browser.waitForAngular();

				specs.trayCreatedBy.getText().then(function(createdBy){
					var matches = createdBy.match(/^([^,]+)[, ]*(.+)$/),
						creator = matches[1],
						dateCreated = matches[2];
					
					expect(creator).toEqual(sortedScenarios[index].auditInfo.createdBy.name);
					expect(dateCreated).toEqual(funcs.getFormatedDate(sortedScenarios[index].auditInfo.createdOn));
					index++;
				});

			});
		});

		xit("should have the correct modified by data", function(){
			var items = funcs.getItems(),
				index = 0,
				sortedScenarios = funcs.sortProjectsByDate(cache[project.uuid]);

			items.each(function(item){
				item.click();
				browser.waitForAngular();

				specs.trayModifiedBy.getText().then(function(modifiedOn){
					var matches = modifiedOn.match(/^([^,]+)[, ]*(.+)$/),
						creator = matches[1],
						dateCreated = matches[2];
					
					expect(creator).toEqual(sortedScenarios[index].auditInfo.lastUpdatedBy.name);
					expect(dateCreated).toEqual(funcs.getFormatedDate(sortedScenarios[index].auditInfo.lastUpdatedOn));
					index++;
				});

			});
		});

		xit("should have the correct base scenario", function(){
			var items = funcs.getItems(),
				index = 0,
				sortedScenarios = funcs.sortProjectsByDate(cache[project.uuid]);

			items.each(function(item){
				item.click();
				browser.waitForAngular();

				specs.scenarioBaseScenarioElement.getText().then(function(baseScenarioTitle){
					expect(baseScenarioTitle).toEqual(sortedScenarios[index].referenceScenario.name);
					index++;
				});
			});
		});

		it("should have the correct analysis elements", function(done){
			var items = funcs.getItems();
			items.each(function(item){
				item.click();
				browser.waitForAngular();

				item.element(by.css(specs.titleClass)).getAttribute('data-ms-id').then(function(id){

					flow.await(funcs.getRawData_analysisElements(id).then(
						function(analysisElements){
							console.info(analysisElements);
							//done();
							// var scenario = _.findWhere(cache[project.uuid], {id: parseInt(id)});
							// scenario.analysisElements = analysisElements;

							// specs.allScenarioElements.each(function(el){
							// 	el.element(by.css(specs.elementName)).getText().then(function(name){
							// 		el.element(by.css(specs.elementTitle)).getText().then(function(title){
							// 			console.info(name, title);
							// 			done()
							// 		});
							// 	});
							// });
						}
					)).then(function(){
						funcs.saveInfo("./test/e2e/cache.json", cache);
					});

				});
			});
		});
	});
}

