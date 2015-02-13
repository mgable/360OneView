"use strict";

var specs = require('./0.0-specs.js'),
	funcs = require('./0.1-project_functions.js');

	var dashboardUrl, projectId;
	// TEMP data - remove in production
	//var dashboardUrl, projectId = "9437e65645383388b03095a017c9480b"; dashboardUrl = funcs.getDashboardUrl(projectId);


describe('Project Dashboard', function() {
	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
		}
	);
	var testFileName = "My New Test Project- " + Date.now();

	it("should create a new project and go to the dashboard", function(){
		var firstItemTitle;

		browser.get(funcs.getProjectUrl());
		specs.createButton.click();
		browser.waitForAngular();

		specs.modalInputField.sendKeys(testFileName);

		specs.modalSubmitButton.click();
		browser.waitForAngular();
		expect(browser.getLocationAbsUrl()).toContain("#/dashboard/");

		browser.getLocationAbsUrl().then(function(url){
			projectId = url.match(/\w{32}/)[0];
			console.info(projectId);
		});

		browser.get(funcs.getProjectUrl());
		browser.waitForAngular();

		firstItemTitle = specs.getFirstItemTitle();
		firstItemTitle.getText(function(text){
			expect(text).toBe(testFileName);
		});
	});

	describe("Scenario List", function(){
		var testScenarionNameFirst = "My FIRST new test scenario title - " + Date.now(),
			testScenarionNameSecond = "My SECOND new test scenario title - " + Date.now(),
			testScenarionDescription = "My new test scenario description.",

			noScenarios = "a[data-ms-id='noScenariosAlert']", 
			name = "scenario.title",
			description = "//input[@data-ms-id='ScenarioCreate.inputDescription']",
			baseScenario = "//label[@data-ms-id='ScenarioCreate.inputBaseScenario']",
			submit = "//button[@data-ms-id='ScenarioCreate.submit']",
			cancel = "//button[@data-ms-id='ScenarioCreate.cancel']",

			confirmBaseScenario = "//button[@data-ms-id='ScenarioCreate.confirmBaseScenario']",
			cancelBaseScenario = "//button[@data-ms-id='ScenarioCreate.cancelBaseScenario']",
			baseScenarioInput = "scenario.referenceScenario.name",
			scenarioBaseScenario = "//p[@data-ms-id='ScenarioListing:baseScenario']",

			noScenariosAlert = element(by.css(noScenarios)),
			scenarioBaseScenarioElement = element(by.xpath(scenarioBaseScenario )),
			baseScenarioInputField = element(by.model(baseScenarioInput)),

			inputName = element(by.model(name)),
			inputDescription = element(by.xpath(description)),
			inputbaseScenario = element(by.xpath(baseScenario)),
			submitButton = element(by.xpath(submit)),
			cancelButton = element(by.xpath(cancel)),
			confirmBaseScenarioButton = element(by.xpath(confirmBaseScenario)),
			cancelBaseScenarioButton = element(by.xpath(cancelBaseScenario));

		beforeEach(function(){
			browser.get(funcs.getDashboardUrl(projectId));
		});


		describe("Create functions: ", function(){
			var baseScenario = "scenario.referenceScenario.name",
				baseScenarioInputField = element(by.model(baseScenario));

			it("should have no scenarios at time of creation", function(){
				var items = specs.getItems(),
					itemCount = specs.getItemCount();
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
				expect(noScenariosAlert.isPresent()).toBe(true);
			});

			it("should open the create new scenario dialog box and create a new scenario", function(){
				noScenariosAlert.click();
				browser.waitForAngular();
				inputName.sendKeys(testScenarionNameFirst);
				inputDescription.sendKeys(testScenarionDescription);
				submitButton.click();
				browser.waitForAngular();
				expect(browser.getLocationAbsUrl()).toContain("#/scenario/");
				browser.get(funcs.getDashboardUrl(projectId));
				browser.waitForAngular();

				var items = specs.getItems(),
					itemCount = specs.getItemCount(),
					title = specs.getFirstItemTitle();
				expect(items.count()).toBe(1);
				itemCount.getText().then(function(count){
					expect(parseInt(count)).toBe(1);
				});

				expect(noScenariosAlert.isPresent()).toBe(false);
				title.getText().then(function(text){
					expect(text).toBe(testScenarionNameFirst);
				})
			});

			it("should not allow a new scenario to be created without a name", function(){
				specs.createButton.click();
				browser.waitForAngular();
				expect(submitButton.isEnabled()).toBe(false);
			});

			it("should allow a new scenario to be created with a name but no description", function(){
				specs.createButton.click();
				browser.waitForAngular();
				expect(submitButton.isEnabled()).toBe(false);
				inputName.sendKeys("New " + testScenarionNameFirst);
				expect(submitButton.isEnabled()).toBe(true);
			});

			it("should not allow a duplicate scenario name", function(){
				specs.createButton.click();
				browser.waitForAngular();
				expect(submitButton.isEnabled()).toBe(false);
				inputName.sendKeys(testScenarionNameFirst);
				expect(submitButton.isEnabled()).toBe(false);
			});

			it("should restrict which characters can be used in a name", function(){
				specs.createButton.click();
				browser.waitForAngular();

				funcs.testInputRestrictions(inputName, submitButton);
			});

			it("should not allow names less than two characters or more than 256 characters", function(){
				specs.createButton.click();
				browser.waitForAngular();

				funcs.testMinAndMaxNameLength(inputName, submitButton);
			});

			it("should copy a scenario", function(){
				var scenarioTitle = specs.getFirstItemTitle(),
					scenario = specs.getFirstItem(),
					items = specs.getItems(),
					itemCount = specs.getItemCount(),
					numberOfScenarios;

				items.count().then(function(count){
					numberOfScenarios = count;
					specs.trayCopyButton.click();
					browser.waitForAngular();
					scenarioTitle.getText().then(function(scenarioTitle){
						specs.modalInputField.getAttribute("value").then(function(inputText){
							expect("COPY -- " + scenarioTitle).toEqual(inputText);
							specs.modalInputField.clear();
							specs.modalInputField.sendKeys(testScenarionNameSecond);

							specs.modalSubmitButton.click();
							browser.waitForAngular();
							expect(browser.getLocationAbsUrl()).toContain("#/scenario/");
							browser.get(funcs.getDashboardUrl(projectId));
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
				expect(specs.getItems().count()).toBe(1);
			});

			it("should have an active selection", function(){
				var first = specs.getFirstItem();
				expect(specs.hasClass(first, specs.activeSelectionClass)).toEqual(true);
			});

			it("should not allow the base reference scenario to be edited", function(){

				specs.createButton.click();
				browser.waitForAngular();

				baseScenarioInputField.getAttribute("readonly").then(function(attributeValue){
					expect(attributeValue).toEqual('true');
				});
			});

			it("should keep the same base scenario on confirm if a new scenario has not been selected", function(){
				specs.createButton.click();
				browser.waitForAngular();
				baseScenarioInputField.getAttribute("value").then(function(text){
					baseScenarioInputField.click();
					browser.waitForAngular();
					confirmBaseScenarioButton.click();
					baseScenarioInputField.getAttribute("value").then(function(newText){
						expect(text).toEqual(newText);
					});
				});
			});
		});

		describe("Filter functions: ", function(){

			it("should filter by favorite", function(){
				var startItemCount = specs.getItemCount();

				funcs.filterByFavorites();

				specs.getItems().count().then(function(itemCount){
					specs.getFavorites().count().then(function(favoriteCount){
						expect(itemCount).toBe(favoriteCount);
					});
				});

				funcs.filterByItem();

				startItemCount.getText().then(function(count){
					specs.getItems().count().then(function(itemCount){
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
				first = specs.getFirstItemTitle();
				first.getText().then(function(name){
					expect(name).toEqual(newName);
				});
			});

			it("should only allow unique names", function(){
				var firstItemTitle = specs.getFirstItemTitle(),
				lastItem = specs.getLastItem();
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
				browser.get(funcs.getDashboardUrl(projectId));

				specs.inlineEditField.getText().then(function(description){
					expect(newDescription).toEqual(description);
				});

			});
		})

		describe("Breadcrumbs: ", function(){
			it("should have the correct label", function(){
				expect(specs.breadcrumbField.getText()).toEqual("ALL PROJECTS" + testFileName.toUpperCase());
			});
		});

		describe("Change base scenario: ", function(){

			it("should change the base scenario", function(){
				var scenarios, scenario;

				specs.createButton.click();
				browser.waitForAngular();
				inputName.sendKeys("New " + testScenarionNameSecond);
				inputbaseScenario.click();
				browser.waitForAngular();
				scenarios = element.all(by.repeater("scenarios in scenarioList")).first().element(by.css('a'));
				scenarios.click();
				scenario = element.all(by.repeater("scenario in scenarios.data")).first().element(by.css('.scenario-title'));
				browser.waitForAngular();
				scenario.click();

				scenario.getText().then(function(scenarioText){
					confirmBaseScenarioButton.click();
					baseScenarioInputField.getAttribute("value").then(function(baseScenarioText){
						expect(scenarioText).toEqual(baseScenarioText);
						submitButton.click();
						browser.waitForAngular();
						expect(browser.getLocationAbsUrl()).toContain("#/scenario/");
						browser.get(funcs.getDashboardUrl(projectId));
						browser.waitForAngular();
						expect(scenarioBaseScenarioElement.getText()).toEqual(scenarioText);
					});
				});
			});
		});

		describe("Scenario Elements: ", function(){
			var scenarioElements = "element in selectedItem.scenarioElements",
				scenarioEditScenarioElements = "div[data-ms-id='ScenarioEdit.scenarioElements'] .dropdown-toggle",
				allScenarioElements = element.all(by.repeater(scenarioElements)),
				firstScenarioElementName = allScenarioElements.first().element(by.css(".element-name")),
				firstScenarioElementTitle = allScenarioElements.first().element(by.css(".element-title")),
				lastScenarioElementName =   allScenarioElements.last().element(by.css(".element-name")),
				lastScenarioElementTitle =   allScenarioElements.last().element(by.css(".element-title")),
				selectedScenarioElement = element(by.css(scenarioEditScenarioElements));

			it("should click through to scenario edit with the correct scenario element selected", function(){
				firstScenarioElementTitle.getText().then(function(titleInTray){
					firstScenarioElementName.click();
					browser.waitForAngular();
					expect(browser.getLocationAbsUrl()).toContain("#/scenario/" + projectId);
					selectedScenarioElement.getText().then(function(titleInScenarioEdit){
						expect(titleInTray).toBe(titleInScenarioEdit);
					});
				});

				browser.get(funcs.getDashboardUrl(projectId));

				lastScenarioElementTitle.getText().then(function(titleInTray){
					lastScenarioElementName.click();
					browser.waitForAngular();
					expect(browser.getLocationAbsUrl()).toContain("#/scenario/" + projectId);
					selectedScenarioElement.getText().then(function(titleInScenarioEdit){
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
			masterProject = specs.getFirstItemTitle();
			masterProject.click();
			browser.waitForAngular();
			expect(specs.inputFieldHolder.isPresent()).toBe(false);
		});

		it("should disable the create button", function(){
			var masterProject;
			funcs.selectMasterProject();
			masterProject = specs.getFirstItemTitle();
			masterProject.click();
			browser.waitForAngular();
			expect(specs.createButton.getAttribute("disabled")).toBe('true');
		});
	});
});