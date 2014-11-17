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
		beforeEach(function(){
			browser.get(dashboardUrl);
		});

		it("should have no scenarios at time of creation", function(){
			var data = element.all(by.repeater('item in getData()')),
				itemCount = element(by.css('.display-actions h4.title span:first-child'));
			expect(data.count()).toBe(0);
			expect(itemCount.getText()).toContain(data.count());
		});

		xit("should create a new scenario", function(){
			expect(something).toBe(something);
		});
	});
});