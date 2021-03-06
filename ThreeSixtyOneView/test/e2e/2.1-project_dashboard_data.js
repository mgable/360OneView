"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	moreSpecs = require("./2.0-project_dashboard_specs.js"),
	funcs = require('./2.0-project_dashboard_functions.js'),
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
			project = projects[0],
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

		it("should have the correct number of scenarios", function(){
			funcs.getRAW_Scenarios(project.uuid, function(scenarios){
				funcs.getItems().count().then(function(count){
					expect(count).toBe(scenarios.length);
				});
			});
		});

		it("should have the correct scenarios", function(){
			funcs.getRAW_Scenarios(project.uuid, function(scenarios){
				funcs.getItems().count().then(function(count){
					var sortedScenarios = funcs.sortProjectsByDate(scenarios);
			
					funcs.getAllItemTitles().each(function(item, index){
						item.getText().then(function(title){
							expect(title).toBe(sortedScenarios[index].name);
						});	
					});
				});
			});
		});

		it("should have the correct statuses", function(){
			var currentStatus,
				items = funcs.getItems();

			items.each(function(item){
				item.element(by.css(specs.titleClass)).getAttribute('data-ms-id').then(function(id){
					item.element(by.css(specs.statusClass)).getAttribute("class").then(function(status){
						var matches = status.match(/fa\W*fa-(.+)/);
						currentStatus = matches[1] || null;

						flow.await(funcs.getRawData_scenarioStatus(id).then(
							function(status){
								var status = (status.currentState && status.currentState.name) ? status.currentState.name.toLowerCase() : "not_calculated";
								expect(status).toEqual(currentStatus);
							}
						)).then(function(){
							funcs.saveInfo("./test/e2e/cache.json", cache);
						});
					});
				});
			});
		});

		it("should have the correct description", function(){
			funcs.getRAW_Scenarios(project.uuid, function(scenarios){
				var sortedScenarios = funcs.sortProjectsByDate(scenarios),
					items = funcs.getItems(),
					index = 0;

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
		});

		it("should have the correct created by data", function(){
			funcs.getRAW_Scenarios(project.uuid, function(scenarios){
				var sortedScenarios = funcs.sortProjectsByDate(scenarios),
				items = funcs.getItems(),
				index = 0;

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
		});

		it("should have the correct modified by data", function(){
			funcs.getRAW_Scenarios(project.uuid, function(scenarios){
				var items = funcs.getItems(),
					index = 0,
					sortedScenarios = funcs.sortProjectsByDate(scenarios);

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
		});

		it("should have the correct base scenario", function(){
			funcs.getRAW_Scenarios(project.uuid, function(scenarios){
				var items = funcs.getItems(),
					index = 0,
					sortedScenarios = funcs.sortProjectsByDate(scenarios);

				items.each(function(item){
					item.click();
					browser.waitForAngular();

					specs.scenarioBaseScenarioElement.getText().then(function(baseScenarioTitle){
						expect(baseScenarioTitle).toEqual(sortedScenarios[index].referenceScenario.name);
						index++;
					});
				});
			});
		});

		it("should have the correct analysis elements", function(){
			funcs.getRAW_Scenarios(project.uuid, function(scenarios){
				var items = funcs.getItems();
				items.each(function(item){
					item.click();
					browser.waitForAngular();

					item.element(by.css(specs.titleClass)).getAttribute('data-ms-id').then(function(id){
						var scenario = {};

						flow.await(funcs.getRawData_analysisElements(id).then(
							function(analysisElements){
								var groupedAnalysisElements = _.groupBy(analysisElements, 'group'),
									ae = _.flatten([groupedAnalysisElements["Cost Assumption"], groupedAnalysisElements["Marketing Plan"], groupedAnalysisElements["Non-Marketing Drivers"].sort(
										function(a,b){
											if (a.cubeMeta.label.toLowerCase() > b.cubeMeta.label.toLowerCase()){
												return 1;
											} else if (a.cubeMeta.label.toLowerCase() < b.cubeMeta.label.toLowerCase()){
												return -1;
											} else {
												return 0;
											}
										}
									)]);

								scenario[id] = _.findWhere(scenarios, {id: parseInt(id)});
								scenario[id].analysisElements = ae;
							}
						)).then(function(){
							var index = 0;
							specs.allScenarioElements.each(function(el){

								el.element(by.css(specs.elementName)).getText().then(function(name){
									el.element(by.css(specs.elementTitle)).getText().then(function(title){
										expect(title).toEqual(scenario[id].analysisElements[index].cubeMeta.label);
										expect(name).toEqual(scenario[id].analysisElements[index].name)
										index++;
									});
								});

							});

							console.info("DONE!!!!");
							funcs.saveInfo("./test/e2e/cache.json", cache);
						});

					});

				});
			});
		});
	});
}

