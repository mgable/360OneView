"use strict";

var projectUrl = '/#/projects?e2e=true',
	dashboardUrl = '/#/dashboard/:id?e2e=true';

describe('Project Dashboard', function() {
	var hasClass = function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
	    });
	}, menuId, nameField, column_1, createdBy, ascending, descending, ascendingButton, descendingButton, dropdown, nameButton, column_1Button, createdByButton, nameLabel, nameLabelField, dropdownButton, column_1Label, column_1LabelField, projectId;

	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
			dropdown = "//span[@data-ms-id='toggle_column_1']",
			nameField = "//a[@data-ms-id='name-field']",
			nameLabel = "//div[@data-ms-id='name-label']",
			column_1 = "//span[@data-ms-id='select_column_1']",
			column_1Label = "//h6[@data-ms-id='label_column_1']",
			createdBy = "//li[@data-ms-id='Created Date']",
			ascending = "//li[@data-ms-id='ascending']",
			descending = "//li[@data-ms-id='descending']",
			ascendingButton = element(by.xpath(ascending)),
			descendingButton = element(by.xpath(descending)),
			dropdownButton = element(by.xpath(dropdown)),
			nameButton = element(by.xpath(nameField)),
			nameLabelField = element(by.xpath(nameLabel)),
			column_1Button = element(by.xpath(column_1)),
			createdByButton = element(by.xpath(createdBy)),
			column_1LabelField = element(by.xpath(column_1Label));
		}
	);

	it("should create a new project and go to the dashboard", function(){
		var create = "//span[@data-ms-id='createButton']",
			input = "//input[@data-ms-id='modalInput']",
			submit = "//button[@data-ms-id='submit']",
			cancel = "//button[@data-ms-id='cancel']",
			itemTitle = "//div[@data-ms-id='projectTitle']",
			createButton = element(by.xpath(create)),
			inputField,
			submitButton,
			cancelButton, 
			firstItemTitle,
			noScenariosAlert,
			testFileName = "My New Test Project- " + Date.now();

		browser.get(projectUrl);
		createButton.click();
		browser.waitForAngular();
		inputField = element(by.xpath(input));
		submitButton = element(by.xpath(submit));
		cancelButton = element(by.xpath(cancel));
		inputField.sendKeys(testFileName);

		submitButton.click();
		browser.waitForAngular();
		firstItemTitle = element.all(by.xpath(itemTitle));
		
		firstItemTitle.getText(function(text){
			expect(text).toBe(testFileName);
			expect(browser.getLocationAbsUrl()).toContain("/#/dashboard/");
		});

		browser.getLocationAbsUrl().then(function(url){
			projectId = url.match(/\w{32}/)[0];
			dashboardUrl = dashboardUrl.replace(/:id/, projectId);
			console.info(projectId, dashboardUrl);
		});
	});

	describe("Project Scenario List", function(){
		var testScenarionName = "My new test scenario title - " + Date.now(),
			testScenarionDescription = "My new test scenario description.",
			noScenarios = "//a[@data-ms-id='noScenariosAlert']", 
			noScenariosAlert = element(by.xpath(noScenarios)),
			name = "//input[@data-ms-id='ScenarioCreate.inputName']",
			description = "//input[@data-ms-id='ScenarioCreate.inputDescription']",
			baseScenario = "//input[@data-ms-id='ScenarioCreate.inputbaseScenario']",
			submit = "//input[@data-ms-id='ScenarioCreate.submit']",
			cancel = "//button[@data-ms-id='ScenarioCreate.cancel']",
			inputName = element(by.xpath(name)),
			inputDescription = element(by.xpath(description)),
			inputbaseScenario = element(by.xpath(baseScenario )),
			submitButton = element(by.xpath(submit)),
			cancelButton = element(by.xpath(cancel));

		beforeEach(function(){
			browser.get(dashboardUrl);
		});

		xit("should have no scenarios at time of creation", function(){
			var data = element.all(by.repeater('item in getData()')),
				itemCount = element(by.xpath("//span[@data-ms-id='dataCount']"));
			expect(data.count()).toBe(0);
			expect(itemCount.getText()).toContain(data.count());
		});

		xit ("should display the create scenario alert", function(){
			expect(noScenariosAlert.isPresent()).toBe(true)
		});

		it("should open the create new scenario dialog box and create a new scenario", function(){
			noScenariosAlert.click();
			browser.waitForAngular();
			inputName.sendKeys(testScenarionName);
			inputDescription.sendKeys(testScenarionDescription);
			//cancelButton.click();
			submitButton.click();
			browser.waitForAngular();
			// goes to scenario edit page
			expect(browser.getLocationAbsUrl()).toContain("/#/scenario/");
			browser.get(dashboardUrl);
			browser.waitForAngular();

			var data = element.all(by.repeater('item in getData()')),
				itemCount = element(by.xpath("//span[@data-ms-id='dataCount']")),
				title = element.all(by.repeater('item in getData()').column('title'));
			expect(data.count()).toBe(1);
			expect(itemCount.getText()).toContain(data.count());
			expect(noScenariosAlert.isPresent()).toBe(false);
			title.first().getText().then(function(text){
				expect(text).toBe(testScenarionName);
			})
		});

		xit("should create a new scenario", function(){
			expect(something).toBe(something);
		});
	});
});