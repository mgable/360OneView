"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	_ = require('underscore'),
	projectInfo,
	dashboardUrl,
	projectId,
	testName = {title: "Project Dashboard", id: 2};

if(funcs.runTheseTests(testName)){

	describe("executing " + testName.title, function(){
		console.info("executing " + testName.title);
		it("should set up the tests", function(){
			console.info(testName.title + " Tests: ");
			projectInfo = funcs.readProjectInfo();
			projectId = projectInfo.project.id,
			dashboardUrl = funcs.getDashboardUrl(projectId);
			console.info(dashboardUrl);
		});

	})

	describe('Project Dashboard', function() {
		beforeEach(
			function(){
				browser.driver.manage().window().setSize(1280, 1024);
			}
		);

		describe("Scenario List", function(){

			beforeEach(function(){
				browser.get(dashboardUrl);
			});


			describe("Create functions: ", function(){
				it("should have no scenarios at time of creation", function(){
					var items = funcs.getItems(),
						itemCount = funcs.getItemCount();
					expect(items.count()).toEqual(0);
					itemCount.getText().then(function(count){
						expect(parseInt(count)).toEqual(0);
					});
				});

				it("should not enabled the rename, copy or edit buttons", function(){
					expect(specs.trayCopyButton.isPresent()).toBeFalsy();
					expect(specs.renameButton.isPresent()).toBeFalsy();
					expect(specs.editDescriptionButton.isPresent()).toBeFalsy();
				});

				it("should enable the create button", function(){
					expect(specs.createButton.getAttribute("disabled")).toBeFalsy();
				});
			
				it("should display the create scenario alert", function(){
					expect(specs.noScenariosAlert.isPresent()).toBe(true);
				});

				it("should not allow a new scenario to be created without a name", function(){
					specs.createButton.click();
					browser.waitForAngular();
					expect(specs.submitButton.isEnabled()).toBe(false);
				});

				it("should allow a new scenario to be created with a name but no description", function(){
					specs.createButton.click();
					browser.waitForAngular();
					expect(specs.submitButton.isEnabled()).toBe(false);
					specs.inputName.sendKeys("New " + specs.testScenarionNameFirst);
					expect(specs.submitButton.isEnabled()).toBe(true);
				});

				it("should restrict which characters can be used in a name", function(){
					specs.createButton.click();
					browser.waitForAngular();

					funcs.testInputRestrictions(specs.inputName, specs.submitButton);
				});

				it("should not allow names less than two characters or more than 256 characters", function(){
					specs.createButton.click();
					browser.waitForAngular();

					funcs.testMinAndMaxNameLength(specs.inputName, specs.submitButton);
				});

				it("should not allow the base reference scenario to be edited", function(){

					specs.createButton.click();
					browser.waitForAngular();

					specs.baseScenarioInputField.getAttribute("readonly").then(function(attributeValue){
						expect(attributeValue).toEqual('true');
					});
				});

				it("should keep the same base scenario on confirm if a new scenario has not been selected", function(){
					specs.createButton.click();
					browser.waitForAngular();
					specs.baseScenarioInputField.getAttribute("value").then(function(text){
						specs.baseScenarioInputField.click();
						browser.waitForAngular();
						specs.confirmBaseScenarioButton.click();
						specs.baseScenarioInputField.getAttribute("value").then(function(newText){
							expect(text).toEqual(newText);
						});
					});
				});


				it("should open the create new scenario dialog", function(){
					specs.createButton.click();
					browser.waitForAngular();
					expect(specs.scenarioCreateModal.isPresent()).toBe(true);
				})

				// scenario needs to exist for this to work
				it("should open the create new scenario dialog box and create a new scenario", function(){
					specs.createButton.click();
					browser.waitForAngular();
					expect(specs.scenarioCreateModal.isPresent()).toBe(true);
					specs.inputName.sendKeys(specs.testScenarionNameFirst);
					specs.inputDescription.sendKeys(specs.testScenarionDescription);
					specs.submitButton.click();
					browser.waitForAngular();
					browser.getLocationAbsUrl().then(function(url){
						var scenarioId = url.match(/\d+(?=\/edit)/)[0];
						funcs.saveProjectInfo(_.extend(projectInfo, {scenario: {url: url, id: scenarioId, title: specs.testScenarionNameFirst,}}));
						expect(url).toContain("#/scenario/");
					});
					browser.get(dashboardUrl);
					browser.waitForAngular();
					
					var items = funcs.getItems(),
						itemCount = funcs.getItemCount(),
						title = funcs.getFirstItemTitle();
					// expect(items.count()).toBe(1);
					// itemCount.getText().then(function(count){
					// 	expect(parseInt(count)).toBe(1);
					// });

					expect(specs.noScenariosAlert.isPresent()).toBe(false);
					title.getText().then(function(text){
						expect(text).toBe(specs.testScenarionNameFirst);
					})
				});

				it("should have a status of 'not calculated'", function(){
					var status = funcs.getFirstItem().element(by.css(specs.statusClass));
					expect(funcs.hasClass(status, "fa-not_calculated")).toBe(true);
				});

				it("should not allow a duplicate scenario name", function(){
					specs.createButton.click();
					browser.waitForAngular();
					expect(specs.submitButton.isEnabled()).toBe(false);
					specs.inputName.sendKeys(specs.testScenarionNameFirst);
					expect(specs.submitButton.isEnabled()).toBe(false);
				});

				it("should copy a scenario", function(){
					var scenarioTitle = funcs.getFirstItemTitle(),
						scenario = funcs.getFirstItem(),
						items = funcs.getItems(),
						itemCount = funcs.getItemCount(),
						numberOfScenarios;

					items.count().then(function(count){
						numberOfScenarios = count;
						specs.trayCopyButton.click();
						browser.waitForAngular();
						scenarioTitle.getText().then(function(scenarioTitle){
							specs.modalInputField.getAttribute("value").then(function(inputText){
								expect("COPY -- " + scenarioTitle).toEqual(inputText);
								specs.modalInputField.clear();
								specs.modalInputField.sendKeys(specs.testScenarionNameSecond);

								specs.modalSubmitButton.click();
								browser.waitForAngular();
								expect(browser.getLocationAbsUrl()).toContain("#/scenario/");
								browser.get(dashboardUrl);
								browser.waitForAngular();
								expect(items.count()).toEqual(numberOfScenarios + 1);
								itemCount.getText().then(function(firstCount){
									items.count().then(function(secondCount){
										expect(parseInt(firstCount,10)).toEqual(parseInt(secondCount,10));
									});
								});
							});
						});
					});
				});

				it("should search scenarios", function(){
					funcs.enterSearch('FIRST');
					expect(funcs.getItems().count()).toBe(1);
				});

				it("should have an active selection", function(){
					var first = funcs.getFirstItem();
					expect(funcs.hasClass(first, specs.activeSelectionClass)).toEqual(true);
				});
			});

			describe("Copy Scenario Functions", function(){
				it("should not allow the copy to have no name", function(){
					specs.trayCopyButton.click()
					specs.modalInputField.clear();
					expect(specs.modalSubmitButton.getAttribute("disabled")).toBeTruthy();
				});

				it("should should respect limits on name length", function(){
					specs.trayCopyButton.click();
					browser.waitForAngular();
					funcs.testMinAndMaxNameLength(specs.modalInputField, specs.modalSubmitButton);
				});

				it("should should restrict which characters can be used in a name", function(){
					specs.trayCopyButton.click();
					browser.waitForAngular();
					funcs.testInputRestrictions(specs.modalInputField, specs.modalSubmitButton);
				});
			});


			describe("Filter functions: ", function(){

				it("should filter by favorite", function(){
					var startItemCount = funcs.getItemCount();

					funcs.filterByFavorites();

					funcs.getItems().count().then(function(itemCount){
						funcs.getFavorites().count().then(function(favoriteCount){
							expect(itemCount).toBe(favoriteCount);
						});
					});

					funcs.filterByItem();

					startItemCount.getText().then(function(count){
						funcs.getItems().count().then(function(itemCount){
							expect(count).toBe(itemCount.toString());
						});
					});	
				});
			});

			describe("Edit functions: ", function(){
				var first,
					newName = "My Renamed Scenario - " + Date.now(),
					newDescription = "My new Description - " + Date.now();

				it("should rename a scenario", function(){
					var currentName;

					funcs.hoverAndClick(specs.renameButton);

					currentName = specs.inputField.getAttribute('value');
					specs.inputField.clear();
					specs.inputField.sendKeys(newName);
					specs.inlineSubmitButton.click();
					first = funcs.getFirstItemTitle();
					first.getText().then(function(name){
						expect(name).toEqual(newName);
					});
				});

				it("should only allow unique names", function(){
					var firstItemTitle = funcs.getFirstItemTitle(),
					lastItem = funcs.getLastItem();
					firstItemTitle.getText().then(function(title){
						lastItem.click();
						funcs.hoverAndClick(specs.renameButton);
						specs.inputField.clear();
						specs.inputField.sendKeys(title);
						expect(specs.inlineSubmitButton.getAttribute("disabled")).toBeTruthy();
						specs.inputField.sendKeys("x");
						expect(specs.inlineSubmitButton.getAttribute("disabled")).toBeFalsy();
					});
				});

				it("should edit a description", function(){

					funcs.hoverAndClick(specs.editDescriptionButton);

					specs.textAreaField.clear();
					specs.textAreaField.sendKeys(newDescription);
					specs.inlineEditSubmitButton.click();
					browser.waitForAngular();
					browser.get(dashboardUrl);

					specs.inlineEditField.getText().then(function(description){
						expect(newDescription).toEqual(description);
					});
				});
			})

			describe("Breadcrumbs: ", function(){
				it("should have the correct label", function(){
					expect(specs.breadcrumbField.getText()).toEqual("ALL PROJECTS" + projectInfo.project.title.toUpperCase());
				});
			});

			describe("Change base scenario: ", function(){

				it("should change the base scenario", function(){
					var scenarios, scenario;

					specs.createButton.click();
					browser.waitForAngular();
					specs.inputName.sendKeys("New " + specs.testScenarionNameSecond);
					specs.inputbaseScenario.click();
					browser.waitForAngular();
					scenarios = element.all(by.repeater("project in scenarioList")).first().element(by.css('a'));
					scenarios.click();
					scenario = element.all(by.repeater("scenario in getScenarios(project, searchText)")).first().element(by.css("span[data-ms-id='scenario-title']"));
					browser.waitForAngular();
					scenario.click();

					scenario.getText().then(function(scenarioText){
						specs.confirmBaseScenarioButton.click();
						specs.baseScenarioInputField.getAttribute("value").then(function(baseScenarioText){
							expect(scenarioText).toEqual(baseScenarioText);
							specs.submitButton.click();
							browser.waitForAngular();
							expect(browser.getLocationAbsUrl()).toContain("#/scenario/");
							browser.get(dashboardUrl);
							browser.waitForAngular();
							expect(specs.scenarioBaseScenarioElement.getText()).toEqual(scenarioText);
						});
					});
				});
			});

			describe("Scenario Elements: ", function(){
				// var scenarioElements = "element in selectedItem.scenarioElements",
				// 	scenarioEditScenarioElements = "div[data-ms-id='ScenarioEdit.analysisElements'] .dropdown-toggle",
				// 	allScenarioElements = element.all(by.repeater(scenarioElements)),
				// 	firstScenarioElementName = allScenarioElements.first().element(by.css(".element-name")),
				// 	firstScenarioElementTitle = allScenarioElements.first().element(by.css(".element-title")),
				// 	lastScenarioElementName =   allScenarioElements.last().element(by.css(".element-name")),
				// 	lastScenarioElementTitle =   allScenarioElements.last().element(by.css(".element-title")),
				// 	selectedScenarioElement = element(by.css(scenarioEditScenarioElements));

				it("should click through to scenario edit with the correct scenario element selected", function(){
					specs.firstScenarioElementTitle.getText().then(function(titleInTray){
						specs.firstScenarioElementName.click();
						browser.waitForAngular();
						expect(browser.getLocationAbsUrl()).toContain("#/scenario/" + projectId);
						specs.selectedScenarioElement.getText().then(function(titleInScenarioEdit){
							expect(titleInTray).toBe(titleInScenarioEdit);
						});
					});

					browser.get(dashboardUrl);

					specs.lastScenarioElementTitle.getText().then(function(titleInTray){
						specs.lastScenarioElementName.click();
						browser.waitForAngular();
						expect(browser.getLocationAbsUrl()).toContain("#/scenario/" + projectId);
						specs.selectedScenarioElement.getText().then(function(titleInScenarioEdit){
							expect(titleInTray).toBe(titleInScenarioEdit);
						});
					});
				});
			});
		});

		describe("Edit controls on master project's master scenario", function(){
			beforeEach(
				function(){
					browser.driver.manage().window().setSize(1280, 1024);
					browser.get(funcs.getProjectUrl());
				}
			);

			it('should not allow the scenario to be edited', function(){
				var masterProject;
				funcs.selectMasterProject();
				masterProject = funcs.getFirstItemTitle();
				masterProject.click();
				browser.waitForAngular();
				expect(specs.inputFieldHolder.isPresent()).toBe(false);
			});

			it("should disable the create button", function(){
				var masterProject;
				funcs.selectMasterProject();
				masterProject = funcs.getFirstItemTitle();
				masterProject.click();
				browser.waitForAngular();
				expect(specs.createButton.getAttribute("disabled")).toBe('true');
			});
		});
	});
}
