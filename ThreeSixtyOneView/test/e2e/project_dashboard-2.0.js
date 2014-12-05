"use strict";

var projectUrl = '/#/projects?e2e=true',
	dashboardUrl = '/#/dashboard/:id?e2e=true';

	//TEMP data - remove in production
	var projectId = "3626699b10323fa0a7fa9aa35876bd82";
	dashboardUrl = dashboardUrl.replace(/:id/, projectId);

describe('Project Dashboard', function() {
	var hasClass = function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
	    });
	}, menuId, nameField, column_1, createdBy, ascending, descending, ascendingButton, descendingButton, dropdown, nameButton, column_1Button, createdByButton, nameLabel, nameLabelField, dropdownButton, column_1Label, column_1LabelField, projectId, testFileName = "My New Test Project- " + Date.now();

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

	xit("should create a new project and go to the dashboard", function(){
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
			noScenariosAlert;

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

	describe("Scenario List", function(){
		var testScenarionNameFirst = "My FIRST new test scenario title - " + Date.now(),
			testScenarionNameSecond = "My SECOND new test scenario title - " + Date.now(),
			testScenarionDescription = "My new test scenario description.",
			noScenarios = "//a[@data-ms-id='noScenariosAlert']", 
			noScenariosAlert = element(by.xpath(noScenarios)),
			name = "//input[@data-ms-id='ScenarioCreate.inputName']",
			description = "//input[@data-ms-id='ScenarioCreate.inputDescription']",
			baseScenario = "//input[@data-ms-id='ScenarioCreate.inputbaseScenario']",
			submit = "//input[@data-ms-id='ScenarioCreate.submit']",
			cancel = "//button[@data-ms-id='ScenarioCreate.cancel']",
			create = "//span[@data-ms-id='createButton']",
			trayCopy = "//a[@data-ms-id='trayActions.copy']",
			modal = "//input[@data-ms-id='modalInput']",
			modalInput = element(by.xpath(modal)),
			trayCopyButton = element(by.xpath(trayCopy)),
			createButton = element(by.xpath(create)),
			inputName = element(by.xpath(name)),
			inputDescription = element(by.xpath(description)),
			inputbaseScenario = element(by.xpath(baseScenario )),
			submitButton = element(by.xpath(submit)),
			cancelButton = element(by.xpath(cancel));

		beforeEach(function(){
			browser.get(dashboardUrl);
		});

		xit("should have an active selection", function(){
			var first = element.all(by.repeater('item in getData()')).first();
			expect(hasClass(first, "active")).toBe(true);
		});

		xit("should have no scenarios at time of creation", function(){
			var data = element.all(by.repeater('item in getData()')),
				itemCount = element(by.xpath("//span[@data-ms-id='dataCount']"));
			expect(data.count()).toBe(0);
			expect(itemCount.getText()).toContain(data.count());
		});
		
		xit("should display the create scenario alert", function(){
			expect(noScenariosAlert.isPresent()).toBe(true);
		});

		xit("should open the create new scenario dialog box and create a new scenario", function(){
			noScenariosAlert.click();
			browser.waitForAngular();
			inputName.sendKeys(testScenarionNameFirst);
			inputDescription.sendKeys(testScenarionDescription);
			submitButton.click();
			browser.waitForAngular();
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
				expect(text).toBe(testScenarionNameFirst);
			})
		});

		xit("should not allow a new scenario to be created without a name", function(){
			createButton.click();
			browser.waitForAngular();
			expect(submitButton.isEnabled()).toBe(false);
		});

		xit("should allow a new scenario to be created with a name but no description", function(){
			createButton.click();
			browser.waitForAngular();
			expect(submitButton.isEnabled()).toBe(false);
			inputName.sendKeys("New " + testScenarionNameFirst);
			expect(submitButton.isEnabled()).toBe(true);
		});

		xit("should not allow a duplicate scenario name", function(){
			createButton.click();
			browser.waitForAngular();
			expect(submitButton.isEnabled()).toBe(false);
			inputName.sendKeys(testScenarionNameFirst);
			expect(submitButton.isEnabled()).toBe(false);
		});

		xit("should restrict which characters can be used in a name", function(){
			createButton.click();
			browser.waitForAngular();
			expect(submitButton.isEnabled()).toBe(false);
			inputName.sendKeys("<cat");
			expect(submitButton.isEnabled()).toBe(false);
			inputName.clear();
			inputName.sendKeys("dog*");
			expect(submitButton.isEnabled()).toBe(false);
			inputName.clear();
			inputName.sendKeys("fo?o");
			expect(submitButton.isEnabled()).toBe(false);
			inputName.clear();
			inputName.sendKeys("fo/ddddo");
			expect(submitButton.isEnabled()).toBe(false);
			inputName.clear();
			inputName.sendKeys("f:cccccc");
			expect(submitButton.isEnabled()).toBe(false);
			inputName.clear();
			inputName.sendKeys("fo:\/ddd*do");
			expect(submitButton.isEnabled()).toBe(false);
			inputName.clear();
			inputName.sendKeys("foodoo");
			expect(submitButton.isEnabled()).toBe(true);
		});

		xit("should not allow names less than two characters or more than 256 characters", function(){
			createButton.click();
			inputName.sendKeys("f");
			expect(submitButton.isEnabled()).toBe(false);
			inputName.clear();
			inputName.sendKeys("Bacon ipsum dolor amet spare ribs drumstick short loin capicola boudin kielbasa. Ham hock chuck jowl swine, pork beef ribs turducken shoulder short ribs landjaeger. Beef turkey jowl tongue filet mignon cow spare ribs kielbasa drumstick ham hock jerky capxx");
			expect(submitButton.isEnabled()).toBe(true);
			inputName.sendKeys("z");
			expect(submitButton.isEnabled()).toBe(false);
			inputName.clear();
			inputName.sendKeys("this is just right");
			expect(submitButton.isEnabled()).toBe(true);
		});

		xit("should copy a scenario", function(){
			var scenarioElement = element(by.repeater('item in getData()').row(0).column('title')),
				scenario = element.all(by.repeater('item in getData()').row(0)),
				data = element.all(by.repeater('item in getData()')),
				itemCount = element(by.xpath("//span[@data-ms-id='dataCount']")),
				submitButton = element(by.xpath("//button[@data-ms-id='submit']")),
				numberOfScenarios;

			data.count().then(function(count){
				numberOfScenarios = count;
				//scenario.click();
				trayCopyButton.click();
				browser.waitForAngular();
				scenarioElement.getText().then(function(scenarioTitle){
					modalInput.getAttribute("value").then(function(inputText){
						expect("COPY -- " + scenarioTitle).toEqual(inputText);
						modalInput.clear();
						modalInput.sendKeys(testScenarionNameSecond);
					});
				});
				submitButton.click();
				browser.waitForAngular();
				expect(browser.getLocationAbsUrl()).toContain("/#/scenario/");
				browser.get(dashboardUrl);
				browser.waitForAngular();
				expect(data.count()).toEqual(numberOfScenarios + 1);
				//expect(itemCount.getText()).toEqual(data.count());
				itemCount.getText().then(function(firstCount){
					data.count().then(function(secondCount){
						expect(parseInt(firstCount,10)).toEqual(parseInt(secondCount,10));
					});
				});
			});
		});

		xit("should search scenarios", function(){
			element(by.model('SortAndFilterService.searchText')).sendKeys('FIRST');
			expect(element.all(by.repeater('item in getData()')).count()).toBe(1);
		});

		xdescribe("Sort functions: ", function(){
			beforeEach(
				function(){
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

			it("should switch between ordering by name, modified last and created on", function(){
				var data;

				nameButton.click();
				data = element.all(by.repeater('item in getData()').column('title'));
				expect(data.first().getText()).toBeLessThan(data.last().getText());
				expect(hasClass(nameLabelField, 'active')).toBe(true);
				expect(hasClass(column_1LabelField, 'active')).toBe(false);

				column_1Button.click();
				data = element.all(by.repeater('item in getData()').column('modifiedOn'));
				expect(data.first().getText()).toBeGreaterThan(data.last().getText());
				expect(hasClass(nameLabelField, 'active')).toBe(false);
				expect(hasClass(column_1LabelField, 'active')).toBe(true);

				dropdownButton.click()
				createdByButton.click();

				data = element.all(by.repeater('item in getData()').column('createdOn'));
				expect(data.first().getText()).toBeGreaterThan(data.last().getText());
				expect(hasClass(nameLabelField, 'active')).toBe(false);
				expect(hasClass(column_1LabelField, 'active')).toBe(true);
			});

			it("should order by name", function(){
				var elem = element(by.xpath(nameField)),
					titles = element.all(by.repeater('item in getData()').column('title'));
				
				elem.click();
				
				titles.first().getText().then(function(firstText){
					titles.last().getText().then(function(lastText){
						expect(firstText.toLowerCase()).toBeLessThan(lastText.toLowerCase());
					});
				});

				elem.click();

				titles.first().getText().then(function(firstText){
					titles.last().getText().then(function(lastText){
						expect(lastText.toLowerCase()).toBeLessThan(firstText.toLowerCase());
					});
				});
			});

			it("should sort by last modified", function(){
				var dates = element.all(by.repeater('item in getData()').column('modifiedOn'));
				dates.first().getText().then(function(firstDate){
					dates.last().getText().then(function(lastDate){
						expect(firstDate).toBeGreaterThan(lastDate);
					});
				});

				dropdownButton.click();
				ascendingButton.click();

				dates.first().getText().then(function(firstDate){
					dates.last().getText().then(function(lastDate){
						expect(firstDate).toBeLessThan(lastDate);
					});
				});
			});

			it("should order by created date", function(){
				var dates = element.all(by.repeater('item in getData()').column('createdOn'));

				dropdownButton.click();
				createdByButton.click();

				dates.first().getText().then(function(firstDate){
					dates.last().getText().then(function(lastDate){
						expect(firstDate).toBeGreaterThan(lastDate);
					});
				});

				dropdownButton.click();
				ascendingButton.click();

				dates.first().getText().then(function(firstDate){
					dates.last().getText().then(function(lastDate){
						expect(firstDate).toBeLessThan(lastDate);
					});
				});
			});
		});

		xdescribe("Favorite behaviors", function(){

			it("should toggle favorite", function(){
				var firstElement = element.all(by.css(".favorites a")).first(),
					isFavorite;
					
				hasClass(firstElement, 'favorite').then(function(data){
					isFavorite = data;
					firstElement.click();
					expect(hasClass(firstElement, 'favorite')).not.toBe(isFavorite);
				});
			});

			it("should save the favorite", function(){
				var firstElement = element.all(by.css(".favorites a")).first(),
					isFavorite;
					
				hasClass(firstElement, 'favorite').then(function(data){
					isFavorite = data;
					firstElement.click();
					expect(hasClass(firstElement, 'favorite')).not.toBe(isFavorite);
					browser.get(dashboardUrl);
					firstElement = element.all(by.css(".favorites a")).first();
					expect(hasClass(firstElement, 'favorite')).not.toBe(isFavorite);
				});
			});
		});

		xdescribe("Breadcrumbs", function(){
			var breadcrumb = ".breadcrumbs span",
				breadcrumbField = element(by.css(breadcrumb));

			it("should have the correct label", function(){
				expect(breadcrumbField.getText()).toEqual("ALL PROJECTS > " + testFileName.toUpperCase());
			});
		});
	});
});