"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	_ = require('underscore'),
	projectInfo,
	dashboardUrl,
	projectId,
	hasScenarios,
	testName = {title: "Project Dashboard functional tests", id: 2};

if(funcs.runTheseTests(testName)){

	describe("Executing " + testName.title, function(){
		console.info("executing " + testName.title);
		it("should set up the tests", function(){
			console.info(testName.title + " Tests: ");
			projectInfo = funcs.readProjectInfo();
			projectId = projectInfo.project.uuid,
			dashboardUrl = funcs.getDashboardUrl(projectId);
			hasScenarios = !!projectInfo.scenario;
			console.info(dashboardUrl);
		});
	});

	describe('Project Dashboard: ', function() {
		beforeEach(
			function(){
				browser.driver.manage().window().setSize(1280, 1024);
			}
		);

		describe("Scenario Listing: ", function(){
			beforeEach(
				function(){
					browser.get(dashboardUrl);
				}
			);

			describe("Inital state: ", function(){
				xit("should have no scenarios at time of creation", function(){
					if(! hasScenarios){
						var items = funcs.getItems(),
							itemCount = funcs.getItemCount();
						expect(items.count()).toEqual(0);
						itemCount.getText().then(function(count){
							expect(parseInt(count)).toEqual(0);
						});
					} else {
						console.error("The projects has scenarios. \"should have no scenarios at time of creation\" test skipped");
					}
				});

				xit("should not enabled the rename, create, copy or edit buttons", function(){
					if(! hasScenarios){
						expect(specs.trayCopyButton.isPresent()).toBeFalsy();
						expect(specs.renameButton.isPresent()).toBeFalsy();
						expect(specs.editDescriptionButton.isPresent()).toBeFalsy();
						expect(specs.createButton.getAttribute("disabled")).toBeFalsy();
					} else {
						console.error("The projects has scenarios. \"should not enabled the rename, copy or edit buttons\" test skipped");
					}
				});
				;
			
				xit("should display the create scenario alert", function(){
					if(! hasScenarios){
						expect(specs.noScenariosAlert.isPresent()).toBe(true);
					} else {
						console.error("The projects has scenarios. \"should display the create scenario alert\" test skipped");
					}
				});
			});

			describe("Create: ", function(){
				xit("should not allow a new scenario to be created without a name", function(){
					specs.createButton.click();
					browser.waitForAngular();
					expect(specs.submitButton.isEnabled()).toBe(false);
				});

				xit("should allow a new scenario to be created with a name but no description", function(){
					specs.createButton.click();
					browser.waitForAngular();
					expect(specs.submitButton.isEnabled()).toBe(false);
					specs.inputName.sendKeys("New " + specs.testScenarionNameFirst);
					expect(specs.submitButton.isEnabled()).toBe(true);
				});

				xit("should restrict which characters can be used in a name", function(){
					specs.createButton.click();
					browser.waitForAngular();

					funcs.testInputRestrictions(specs.inputName, specs.submitButton);
				});

				xit("should not allow names less than two characters or more than 256 characters", function(){
					specs.createButton.click();
					browser.waitForAngular();

					funcs.testMinAndMaxNameLength(specs.inputName, specs.submitButton);
				});

				xit("should not allow the base reference scenario to be edited", function(){
					specs.createButton.click();
					browser.waitForAngular();

					specs.baseScenarioInputField.getAttribute("readonly").then(function(attributeValue){
						expect(attributeValue).toEqual('true');
					});
				});

				xit("should keep the same base scenario on confirm if a new scenario has not been selected", function(){
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

				xit("should open the create new scenario dialog", function(){
					specs.createButton.click();
					browser.waitForAngular();
					expect(specs.scenarioCreateModal.isPresent()).toBe(true);
				});

				// scenario needs to exist for this to work
				xit("should create a new scenario", function(){
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
						expect(url).toContain(specs.scenarioRoot + projectId + "/" + scenarioId );
					});
					browser.get(dashboardUrl);
					browser.waitForAngular();
					
					var items = funcs.getItems(),
						itemCount = funcs.getItemCount(),
						title = funcs.getFirstItemTitle();

					expect(specs.noScenariosAlert.isPresent()).toBe(false);
					title.getText().then(function(text){
						expect(text).toBe(specs.testScenarionNameFirst);
					})
				});

				xit("should have a status of 'not calculated'", function(){
					browser.sleep(1000);
					var status = funcs.getFirstItem().element(by.css(specs.statusClass));
					expect(funcs.hasClass(status, "fa-not_calculated")).toBe(true);
				});

				xit("should not allow a duplicate scenario name", function(){
					specs.createButton.click();
					browser.waitForAngular();
					expect(specs.submitButton.isEnabled()).toBe(false);
					specs.inputName.sendKeys(specs.testScenarionNameFirst);
					expect(specs.submitButton.isEnabled()).toBe(false);
				});
			});

			describe("Search: ", function(){
				xit("should search scenarios", function(){
					funcs.enterSearch(specs.testScenarionNameFirst);
					expect(funcs.getItems().count()).toBe(1);
				});
			});

			describe("Copy: ", function(){
				xit("should copy a scenario", function(){
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
								expect(scenarioTitle).toEqual(inputText);
								specs.modalInputField.clear();
								specs.modalInputField.sendKeys(specs.testScenarionNameSecond);

								specs.modalSubmitButton.click();
								browser.waitForAngular();
								expect(browser.getLocationAbsUrl()).toContain(specs.scenarioRoot);
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

				xit("should not allow the copy to have no name", function(){
					specs.trayCopyButton.click()
					specs.modalInputField.clear();
					expect(specs.modalSubmitButton.getAttribute("disabled")).toBeTruthy();
				});

				xit("should should respect limits on name length", function(){
					specs.trayCopyButton.click();
					browser.waitForAngular();
					funcs.testMinAndMaxNameLength(specs.modalInputField, specs.modalSubmitButton);
				});

				xit("should should restrict which characters can be used in a name", function(){
					specs.trayCopyButton.click();
					browser.waitForAngular();
					funcs.testInputRestrictions(specs.modalInputField, specs.modalSubmitButton);
				});
			});

			describe("Filter: ", function(){

				xit("should filter by favorite", function(){
					funcs.filterByFavorites();

					funcs.getItems().count().then(function(itemCount){
						funcs.getFavorites().count().then(function(favoriteCount){
							expect(itemCount).toBe(favoriteCount);
						});
					});
				});

				xit("should filter by item", function(){
					var startItemCount = funcs.getItemCount();

					funcs.filterByFavorites();
					funcs.filterByItem();

					startItemCount.getText().then(function(count){
						funcs.getItems().count().then(function(itemCount){
							expect(count).toBe(itemCount.toString());
						});
					});	
				});
			});

			describe("Edit: ", function(){
				var first,
					newName = "My Renamed Scenario - " + Date.now(),
					newDescription = "My new Description - " + Date.now();

				xit("should rename a scenario", function(){
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

				xit("should respect input restrictions", function(){
					funcs.hoverAndClick(specs.renameButton);
					funcs.testInputRestrictions(specs.inputField, specs.inlineSubmitButton);
				});

				xit("should not allow names less than two characters or more than 256 characters", function(){
					funcs.hoverAndClick(specs.renameButton);
					funcs.testMinAndMaxNameLength(specs.inputField, specs.inlineSubmitButton);
				});

				xit("should only allow unique names", function(){
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

				xit("should edit a description", function(){

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
			});

			describe("Page: ", function(){
				xit("should have an active selection", function(){
					var first = funcs.getFirstItem();
					expect(funcs.hasClass(first, specs.activeSelectionClass)).toEqual(true);
				});
				
				xit("should have the correct breadcrumb label", function(){
					expect(specs.breadcrumbField.getText()).toEqual("ALL PROJECTS" + projectInfo.project.name.toUpperCase());
				});

				it("should change the base scenario", function(){
					var scenarios, scenario;

					specs.createButton.click();
					browser.waitForAngular();
					specs.inputName.sendKeys("New " + specs.testScenarionNameSecond);
					specs.inputbaseScenario.click();
					browser.waitForAngular();
					// scenarios = element.all(by.repeater("project in scenarioList")).first().element(by.css('a'));
					// scenarios.click();
					browser.waitForAngular();
					scenario = element.all(by.repeater("scenario in getScenarios(project, searchText)")).first().element(by.css("span[data-ms-id='scenario-title']"));
					browser.pause();
					scenario.click();

					scenario.getText().then(function(scenarioText){
						specs.confirmBaseScenarioButton.click();
						specs.baseScenarioInputField.getAttribute("value").then(function(baseScenarioText){
							expect(scenarioText).toEqual(baseScenarioText);
							specs.submitButton.click();
							browser.waitForAngular();
							expect(browser.getLocationAbsUrl()).toContain(specs.scenarioRoot);
							browser.get(dashboardUrl);
							browser.waitForAngular();
							expect(specs.scenarioBaseScenarioElement.getText()).toEqual(scenarioText);
						});
					});
				});

				xit("should click through to scenario edit with the correct scenario element selected", function(){
					specs.firstScenarioElementTitle.getText().then(function(titleInTray){
						specs.firstScenarioElementName.click();
						browser.waitForAngular();
						expect(browser.getLocationAbsUrl()).toContain(specs.scenarioRoot + projectId);
						specs.selectedScenarioElement.getText().then(function(titleInScenarioEdit){
							expect(titleInTray).toBe(titleInScenarioEdit);
						});
					});

					browser.get(dashboardUrl);

					specs.lastScenarioElementTitle.getText().then(function(titleInTray){
						specs.lastScenarioElementName.click();
						browser.waitForAngular();
						expect(browser.getLocationAbsUrl()).toContain(specs.scenarioRoot + projectId);
						specs.selectedScenarioElement.getText().then(function(titleInScenarioEdit){
							expect(titleInTray).toBe(titleInScenarioEdit);
						});
					});
				});
			});
		});

		describe("Plan of Record: ", function(){
			beforeEach(
				function(){
					browser.get(funcs.getProjectUrl());
				}
			);

			it('should not be editable', function(){
				var masterProject;
				funcs.selectMasterProject();
				masterProject = funcs.getFirstItemTitle();
				masterProject.click();
				browser.waitForAngular();
				expect(specs.inputFieldHolder.isPresent()).toBe(false);
			});

			xit("should disable the create button", function(){
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
