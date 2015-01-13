"use strict";

var specs = require('./0.0-specs.js'),
	funcs = require('./0.1-project_functions.js');

	//TEMP data - remove in production
	var dashboardUrl,
		projectId = "f6fc3c24ba8334c3a459658d3a6ea58d";

		dashboardUrl = specs.getDashboardUrl(projectId);


describe('Project Dashboard', function() {
	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
		}
	);
	var testFileName = "My New Test Project- " + Date.now();

	xit("should create a new project and go to the dashboard", function(){
		var firstItemTitle;

		browser.get(specs.projectUrl + specs.testQuery);
		specs.createButton.click();
		browser.waitForAngular();

		specs.modalInputField.sendKeys(testFileName);

		specs.modalSubmitButton.click();
		browser.waitForAngular();
		expect(browser.getLocationAbsUrl()).toContain("/#/dashboard/");

		browser.getLocationAbsUrl().then(function(url){
			projectId = url.match(/\w{32}/)[0];
			dashboardUrl = specs.getDashboardUrl(projectId);
			console.info(projectId, dashboardUrl);
		});

		browser.get(specs.projectUrl + specs.testQuery);
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
			name = "//input[@data-ms-id='ScenarioCreate.inputName']",
			description = "//input[@data-ms-id='ScenarioCreate.inputDescription']",
			baseScenario = "//label[@data-ms-id='ScenarioCreate.inputBaseScenario']",
			submit = "//button[@data-ms-id='ScenarioCreate.submit']",
			cancel = "//button[@data-ms-id='ScenarioCreate.cancel']",
			trayCopy = "//button[@data-ms-id='trayActions.copy']",

			confirmBaseScenario = "//button[@data-ms-id='ScenarioCreate.confirmBaseScenario']",
			cancelBaseScenario = "//button[@data-ms-id='ScenarioCreate.cancelBaseScenario']",
			baseScenarioInput = "scenario.referenceScenario.name",
			scenarioBaseScenario = "//p[@data-ms-id='ScenarioListing:baseScenario']",

			noScenariosAlert = element(by.css(noScenarios)),
			scenarioBaseScenarioElement = element(by.xpath(scenarioBaseScenario )),
			baseScenarioInputField = element(by.model(baseScenarioInput)),

			trayCopyButton = element(by.xpath(trayCopy)),
			inputName = element(by.xpath(name)),
			inputDescription = element(by.xpath(description)),
			inputbaseScenario = element(by.xpath(baseScenario )),
			submitButton = element(by.xpath(submit)),
			cancelButton = element(by.xpath(cancel)),
			confirmBaseScenarioButton = element(by.xpath(confirmBaseScenario)),
			cancelBaseScenarioButton = element(by.xpath(cancelBaseScenario));

		beforeEach(function(){
			browser.get(specs.getDashboardUrl(projectId) + specs.testQuery);
		});


		xdescribe("Create functions: ", function(){
			var baseScenario = "scenario.referenceScenario.name",
				baseScenarioInputField = element(by.model(baseScenario));

			xit("should have no scenarios at time of creation", function(){
				var items = specs.getItems(),
					itemCount = specs.getItemCount();
				expect(items.count()).toEqual(0);
				itemCount.getText().then(function(count){
					expect(parseInt(count)).toEqual(0);
				});
			});

			xit("should enable the create button", function(){
				expect(specs.createButton.getAttribute("disabled")).toBeFalsy();
			});
		
			xit("should display the create scenario alert", function(){
				expect(noScenariosAlert.isPresent()).toBe(true);
			});

			it("should open the create new scenario dialog box and create a new scenario", function(){
				noScenariosAlert.click();
				browser.waitForAngular();
				inputName.sendKeys(testScenarionNameFirst);
				inputDescription.sendKeys(testScenarionDescription);
				submitButton.click();
				browser.waitForAngular();
				expect(browser.getLocationAbsUrl()).toContain("/#/scenario/");
				browser.get(specs.getDashboardUrl(projectId) + specs.testQuery);
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

			xit("should not allow a new scenario to be created without a name", function(){
				specs.createButton.click();
				browser.waitForAngular();
				expect(submitButton.isEnabled()).toBe(false);
			});

			xit("should allow a new scenario to be created with a name but no description", function(){
				specs.createButton.click();
				browser.waitForAngular();
				expect(submitButton.isEnabled()).toBe(false);
				inputName.sendKeys("New " + testScenarionNameFirst);
				expect(submitButton.isEnabled()).toBe(true);
			});

			xit("should not allow a duplicate scenario name", function(){
				specs.createButton.click();
				browser.waitForAngular();
				expect(submitButton.isEnabled()).toBe(false);
				inputName.sendKeys(testScenarionNameFirst);
				expect(submitButton.isEnabled()).toBe(false);
			});

			xit("should restrict which characters can be used in a name", function(){
				specs.createButton.click();
				browser.waitForAngular();

				funcs.testInputRestrictions(inputName, submitButton);
			});

			xit("should not allow names less than two characters or more than 256 characters", function(){
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
					trayCopyButton.click();
					browser.waitForAngular();
					scenarioTitle.getText().then(function(scenarioTitle){
						modalInput.getAttribute("value").then(function(inputText){
							expect("COPY -- " + scenarioTitle).toEqual(inputText);
							modalInput.clear();
							modalInput.sendKeys(testScenarionNameSecond);
						});
					});
					submitButton.click();
					browser.waitForAngular();
					expect(browser.getLocationAbsUrl()).toContain("/#/scenario/");
					browser.get(specs.getDashboardUrl(projectId) + specs.testQuery);
					browser.waitForAngular();
					expect(items.count()).toEqual(numberOfScenarios + 1);
					itemCount.getText().then(function(firstCount){
						items.count().then(function(secondCount){
							expect(parseInt(firstCount,10)).toEqual(parseInt(secondCount,10));
						});
					});
				});
			});

			xit("should search scenarios", function(){
				specs.searchInputField.sendKeys('FIRST');
				expect(specs.getItems().count()).toBe(1);
			});

			xit("should have an active selection", function(){
				var first = specs.getFirstItem();
				expect(specs.hasClass(first, specs.activeClass)).toEqual(true);
			});

			xit("should not allow the base reference scenario to be edited", function(){

				specs.createButton.click();
				browser.waitForAngular();

				baseScenarioInputField.getAttribute("readonly").then(function(attributeValue){
					expect(attributeValue).toEqual('true');
				});
			});

			xit("should keep the same base scenario on confirm if a new scenario has not been selected", function(){
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

		xdescribe("Filter functions: ", function(){

			it("should filter by favorite", function(){
				var startItemCount = specs.getItemCount();

				funcs.filterByFavorite();

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

		xdescribe("Edit functions: ", function(){
			var first,
				newName = "My Renamed Scenario - " + Date.now();

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

			xit("should only allow unique names", function(){});
		})


		xdescribe("Breadcrumbs: ", function(){
			it("should have the correct label", function(){
				expect(breadcrumbField.getText()).toEqual("ALL PROJECTS" + testFileName.toUpperCase());
			});
		});

		xdescribe("Change base scenario: ", function(){

			it("should change the base scenario", function(){
				var scenario;

				specs.createButton.click();
				browser.waitForAngular();
				inputName.sendKeys("New " + testScenarionNameSecond);
				inputbaseScenario.click();
				browser.waitForAngular();
				scenario = element.all(by.repeater("scenarios in scenarioList")).get(1);
				scenario.click();
				scenario.getText().then(function(scenarioText){
					confirmBaseScenarioButton.click();
					baseScenarioInputField.getAttribute("value").then(function(baseScenarioText){
						expect(scenarioText).toEqual(baseScenarioText);
						submitButton.click();
						browser.waitForAngular();
						expect(browser.getLocationAbsUrl()).toContain("/#/scenario/");
						browser.get(dashboardUrl);
						browser.waitForAngular();
						expect(scenarioBaseScenarioElement.getText()).toEqual(scenarioText);
					});
				});
			});
		});
	});

	describe("Edit controls on master project's master scenario", function(){
		beforeEach(
			function(){
				browser.driver.manage().window().setSize(1280, 1024);
				browser.get(specs.projectUrl + specs.testQuery);
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