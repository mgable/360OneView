// spec.js
"use strict";

var projectUrl = '/#/projects?e2e=true';

describe('Project Listing', function() {
	var hasClass = function (element, cls) {
		    return element.getAttribute('class').then(function (classes) {
		        return classes.split(' ').indexOf(cls) !== -1;
		    });
		}, 
		dropdown = "//span[@data-ms-id='toggle_column_1']",
		nameField = "//a[@data-ms-id='name-field']",
		nameLabel = "//div[@data-ms-id='name-label']",
		column_1 = "//span[@data-ms-id='select_column_1']",
		column_1Label = "//h6[@data-ms-id='label_column_1']",
		createdBy = "//li[@data-ms-id='Created Date']",
		ascending = "//li[@data-ms-id='ascending']",
		descending = "//li[@data-ms-id='descending']",
		breadcrumb = "ol.breadcrumb li",
		filterMenu = ".app .ProjectManager .display-actions .filter-holder .title",
		filterFavorites = '.filterDropdown li:last-child',
		filterAll = '.filterDropdown li:first-child',
		countHolder = '//span[@data-ms-id="dataCount"]',
		masterProject = '.master a.favorite',
		titleInTray = "form[data-ms-id='inlineRename'] span.title", 
		ascendingButton = element(by.xpath(ascending)),
		descendingButton = element(by.xpath(descending)),
		dropdownButton = element(by.xpath(dropdown)),
		nameButton = element(by.xpath(nameField)),
		nameLabelField = element(by.xpath(nameLabel)),
		column_1Button = element(by.xpath(column_1)),
		createdByButton = element(by.xpath(createdBy)),
		column_1LabelField = element(by.xpath(column_1Label)),
		breadcrumbField = element(by.css(breadcrumb));

	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
			browser.get(projectUrl);
		}
	);

	// describe("Sort: ", function(){
	// 	it("should switch between ordering by name, modified last and created on", function(){
	// 		var data;

	// 		nameButton.click();
	// 		data = element.all(by.repeater('item in getData()').column('title'));
	// 		expect(data.first().getText()).toBeLessThan(data.last().getText());
	// 		expect(hasClass(nameLabelField, 'active')).toBe(true);
	// 		expect(hasClass(column_1LabelField, 'active')).toBe(false);

	// 		column_1Button.click();
	// 		data = element.all(by.repeater('item in getData()').column('modifiedOn'));
	// 		expect(data.first().getText()).toBeGreaterThan(data.last().getText());
	// 		expect(hasClass(nameLabelField, 'active')).toBe(false);
	// 		expect(hasClass(column_1LabelField, 'active')).toBe(true);

	// 		dropdownButton.click()
	// 		createdByButton.click();
	// 		data = element.all(by.repeater('item in getData()').column('createdOn'));
	// 		expect(data.first().getText()).toBeGreaterThan(data.last().getText());
	// 		expect(hasClass(nameLabelField, 'active')).toBe(false);
	// 		expect(hasClass(column_1LabelField, 'active')).toBe(true);
	// 	});

	// 	it("should order by name", function(){
	// 		var elem = element(by.xpath(nameField)),
	// 			titles = element.all(by.repeater('item in getData()').column('title'));
			
	// 		elem.click();
			
	// 		titles.first().getText().then(function(firstText){
	// 			titles.last().getText().then(function(lastText){
	// 				expect(firstText.toLowerCase()).toBeLessThan(lastText.toLowerCase());
	// 			});
	// 		});

	// 		elem.click();

	// 		titles.first().getText().then(function(firstText){
	// 			titles.last().getText().then(function(lastText){
	// 				expect(lastText.toLowerCase()).toBeLessThan(firstText.toLowerCase());
	// 			});
	// 		});
	// 	});

	// 	it("should order by last modified", function(){
	// 		var dates = element.all(by.repeater('item in getData()').column('modifiedOn'));
	// 		dates.first().getText().then(function(firstDate){
	// 			dates.last().getText().then(function(lastDate){
	// 				expect(firstDate).toBeGreaterThan(lastDate);
	// 			});
	// 		});

	// 		dropdownButton.click();
	// 		ascendingButton.click();
	// 		dates.first().getText().then(function(firstDate){
	// 			dates.last().getText().then(function(lastDate){
	// 				expect(firstDate).toBeLessThan(lastDate);
	// 			});
	// 		});
	// 	});

	// 	it("should order by created date", function(){
	// 		var dates = element.all(by.repeater('item in getData()').column('createdOn'));

	// 		dropdownButton.click();
	// 		createdByButton.click();
	// 		dates.first().getText().then(function(firstDate){
	// 			dates.last().getText().then(function(lastDate){
	// 				expect(firstDate).toBeGreaterThan(lastDate);
	// 			});
	// 		});

	// 		dropdownButton.click();
	// 		ascendingButton.click();
	// 		dates.first().getText().then(function(firstDate){
	// 			dates.last().getText().then(function(lastDate){
	// 				expect(firstDate).toBeLessThan(lastDate);
	// 			});
	// 		});
	// 	});
	// });

	// describe("Sorter: ", function(){
	// 	it("should have at least one project", function(){
	// 		expect(element.all(by.repeater('item in getData()')).count()).toBeGreaterThan(0);
	// 	});

	// 	it("should have a single master project", function(){
	// 		expect(element.all(by.css(".master")).count()).toBe(1);
	// 	});

	// 	it("should have an active selection", function(){
	// 		var first = element.all(by.repeater('item in getData()')).first();
	// 		expect(hasClass(first, "active")).toBe(true);
	// 	});

	// 	it("should show the number of projects", function(){
	// 		var itemCount = element(by.xpath("//span[@data-ms-id='dataCount']"));
	// 		expect(itemCount.getText()).toContain(element.all(by.repeater('item in getData()')).count());
	// 	});

	// 	it("should change the active selection on click", function(){
	// 		var first = element.all(by.repeater('item in getData()')).first(),
	// 		last = element.all(by.repeater('item in getData()')).last();
	// 		expect(hasClass(first, "active")).toBe(true);
	// 		expect(hasClass(last, "active")).toBe(false);
	// 		last.click();
	// 		expect(hasClass(first, "active")).toBe(false);
	// 		expect(hasClass(last, "active")).toBe(true);
	// 		first.click();
	// 		expect(hasClass(first, "active")).toBe(true);
	// 		expect(hasClass(last, "active")).toBe(false);
	// 	});

	// 	it("should redirect to Project Dashboard when a project is clicked", function(){
	// 		var projectName = element.all(by.repeater('item in getData()')).first().element(by.css('.default.ng-binding'));
	// 		projectName.click();
	// 		expect(browser.getLocationAbsUrl()).toContain("/#/dashboard/");
	// 	});

	// 	it("should have the active item in the tray", function(){
	// 		var firstTitle = element.all(by.repeater('item in getData()').column('title')).first(),
	// 			titleInTray = element(by.css(titleInTray));

	// 			expect(firstTitle.getText()).toBe(titleInTray.getText());
	// 	});

	// 	it("should put the active item in the tray when clicked", function(){
	// 		var counter = 0;
	// 		element.all(by.repeater('item in getData()')).each(function(el) {
	// 			if (counter++ < 5) {
	// 				el.click();
	// 				var item = el.element(by.binding('title')),
	// 					itemInTray = element(by.css(titleInTray));
	// 				item.getText().then(function(title){
	// 					if (title.toLowerCase() !== "master project") {
	// 						itemInTray.getText().then(function(trayTitle){
	// 							expect(title).toBe(trayTitle);
	// 						});
	// 					};
	// 				});
	// 			}
	// 		});
	// 	});
	// });

	// describe("Favorite: ", function(){
	// 	it("should favorite the master project", function(){
	// 		expect(element.all(by.css(masterProject)).count()).toBe(1);
	// 	});

	// 	it("should not allow the Master project to be unfavorited", function(){
	// 		var masterProjectElement = element(by.css(masterProject));
	// 		expect(hasClass(masterProjectElement, 'favorite')).toBe(true);
	// 		masterProjectElement.click();
	// 		expect(hasClass(masterProjectElement, 'favorite')).toBe(true);
	// 	});

	// 	it("should toggle favorite", function(){
	// 		var firstElement = element.all(by.css(".favorites a")).first(),
	// 			isFavorite;
				
	// 		hasClass(firstElement, 'favorite').then(function(data){
	// 			isFavorite = data;
	// 			firstElement.click();
	// 			expect(hasClass(firstElement, 'favorite')).not.toBe(isFavorite);
	// 		});
	// 	});

	// 	it("should save the favorite", function(){
	// 		var firstElement = element.all(by.css(".favorites a")).first(),
	// 			isFavorite;
				
	// 		hasClass(firstElement, 'favorite').then(function(data){
	// 			isFavorite = data;
	// 			firstElement.click();
	// 			expect(hasClass(firstElement, 'favorite')).not.toBe(isFavorite);
	// 			browser.get(projectUrl);
	// 			firstElement = element.all(by.css(".favorites a")).first();
	// 			expect(hasClass(firstElement, 'favorite')).not.toBe(isFavorite);
	// 		});
	// 	});

	// 	it("should update the tray when favorites are filtered", function(){
	// 		element(by.css(filterMenu)).click();
	// 		element(by.css(filterFavorites)).click();

	// 		var firstTitle = element.all(by.repeater('item in getData()').column('title')).first(),
	// 			titleInTray = element(by.css(titleInTray));

	// 		firstTitle.getText().then(function(title){
	// 			titleInTray.getText().then(function(secondTitle){
	// 				console.info("titles");
	// 				console.info(title);
	// 				console.info(secondTitle);
	// 				expect(title).toEqual(secondTitle);
	// 			});
	// 		});

	// 	});
	// });

	// describe("Filters: ", function(){
	// 	it("should filter by favorite", function(){
	// 		var filteredCount, unFilteredCount,
	// 			itemCount = element(by.xpath(countHolder));
	// 		element.all(by.repeater('item in getData()')).count().then(function(count){
	// 			unFilteredCount = count;
	// 		});
	// 		element(by.css(filterMenu)).click();
	// 		element(by.css(filterFavorites)).click();

	// 		element.all(by.repeater('item in getData()')).count().then(function(count){
	// 			var filteredCount = count,
	// 			favorites = element.all(by.css('.favorite')).count();
	// 			//expect(filteredCount).toBeLessThan(unFilteredCount);
	// 			expect(itemCount.getText()).toContain(element.all(by.repeater('item in getData()')).count());
	// 			expect(element.all(by.repeater('item in getData()')).count()).toEqual(favorites);
	// 		});
	// 	});
	// });

	// describe("Search: ", function(){
	// 	it("should search", function(){
	// 		element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
	// 		expect(element.all(by.repeater('item in getData()')).count()).toBe(1);
	// 	});
	// });

	describe("Page actions: ", function(){
		xit ("should toggle the filter menu dropdown", function(){
			var elem = element(by.css('.filterDropdown'));
			expect(hasClass(elem, 'hide')).toBe(true);
			element(by.css(".app .ProjectManager .display-actions .filter-holder .title")).click();
			expect(hasClass(elem, 'hide')).toBe(false);
		});

		xit("should create a project", function(){
			var create = "//button[@data-ms-id='createButton']",
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
		});

		xdescribe("rename functions:", function(){
			var first,
				newName = "My Renamed Project - " + Date.now(),
				rootElement = "form[data-ms-id='inlineRename']",
				rename = rootElement + " span.noEdit",
				renameButton = element(by.css(rename)),
				input = rootElement + " input",
				inputField = element(by.css(input)),
				inputFieldParent = rootElement + " span.edit",
				inlineSubmit = rootElement + " button.submit",
				inlineCancel = rootElement + " button.cancel",
				inlineSubmitButton = element(by.css(inlineSubmit)),
				inlineCancelButton = element(by.css(inlineCancel)),
				inputFieldHolder = element(by.css(inputFieldParent));

			it("should rename a project", function(){
				browser.actions().mouseMove(renameButton).perform();
				renameButton.click();
				browser.waitForAngular();
				var currentName = inputField.getAttribute('value');
				inputField.clear();
				inputField.sendKeys(newName);
				inlineSubmitButton.click();
				browser.waitForAngular();
				first = element(by.repeater('item in getData()').row(0).column("title"));
				first.getText().then(function(name){
					expect(name).toEqual(newName);
				});
			});

			it("should not submit if the title has not been changed", function(){
				browser.actions().mouseMove(renameButton).perform();
				renameButton.click();
				expect(inlineSubmitButton.getAttribute('disabled')).toBeTruthy();
				inputField.sendKeys(newName);
				expect(inlineSubmitButton.getAttribute('disabled')).toBeFalsy();
			});

			it("should unhide the input field when action is clicked", function(){
				expect(hasClass(inputFieldHolder, "ng-hide")).toBe(true);
				browser.actions().mouseMove(renameButton).perform();
				renameButton.click();
				expect(hasClass(inputFieldHolder, "ng-hide")).toBe(false);
			});

			it("should reset if the selectedItem is changed", function(){
				browser.actions().mouseMove(renameButton).perform();
				renameButton.click();
				expect(hasClass(inputFieldHolder, "ng-hide")).toBe(false);
				first = element(by.repeater('item in getData()').row(0));
				first.click();
				expect(hasClass(inputFieldHolder, "ng-hide")).toBe(true);
			});

			it("should reset if the rename is cancelled", function(){
				browser.actions().mouseMove(renameButton).perform();
				renameButton.click();
				expect(hasClass(inputFieldHolder, "ng-hide")).toBe(false);
				inlineCancelButton.click();
				expect(hasClass(inputFieldHolder, "ng-hide")).toBe(true);
			});

			it("should reset the selectedItem if the rename is cancelled", function(){
				browser.actions().mouseMove(renameButton).perform();
				renameButton.click();
				var currentName = inputField.getAttribute('value');
				inputField.clear();
				inputField.sendKeys(newName);
				inlineCancelButton.click();
				expect(inputField.getAttribute('value')).toEqual(currentName);
			});

			it("should correct set form states", function(){
				browser.actions().mouseMove(renameButton).perform();
				renameButton.click();
				expect(hasClass(inputField, "ng-pristine")).toBe(true);
				expect(hasClass(inputField, "ng-dirty")).toBe(false);
				inputField.sendKeys("x");
				expect(hasClass(inputField, "ng-pristine")).toBe(false);
				expect(hasClass(inputField, "ng-dirty")).toBe(true);
				inlineCancelButton.click();
				browser.actions().mouseMove(renameButton).perform();
				renameButton.click();
				expect(hasClass(inputField, "ng-pristine")).toBe(true);
				expect(hasClass(inputField, "ng-dirty")).toBe(false);
			});

			it("should respect input limitations", function(){
				browser.actions().mouseMove(renameButton).perform();
				renameButton.click();
				inputField.clear();
				expect(inlineSubmitButton.getAttribute('disabled')).toBeTruthy();
				inputField.sendKeys("x");
				expect(inlineSubmitButton.getAttribute('disabled')).toBeTruthy();
				inputField.sendKeys("x");
				expect(inlineSubmitButton.getAttribute('disabled')).toBeFalsy();
				inputField.clear();
				inputField.sendKeys("xxxx\\");
				expect(inlineSubmitButton.getAttribute('disabled')).toBeTruthy();
				inputField.clear();
				inputField.sendKeys("xxxx*");
				expect(inlineSubmitButton.getAttribute('disabled')).toBeTruthy();
				inputField.clear();
				inputField.sendKeys("Bacon ipsum dolor amet spare ribs drumstick short loin capicola boudin kielbasa. Ham hock chuck jowl swine, pork beef ribs turducken shoulder short ribs landjaeger. Beef turkey jowl tongue filet mignon cow spare ribs kielbasa drumstick ham hock jerky capxx");
				expect(inlineSubmitButton.getAttribute('disabled')).toBeFalsy();
				inputField.sendKeys("z");
				expect(inlineSubmitButton.getAttribute('disabled')).toBeTruthy();
			});
		});	

		describe("desciption edit functions", function(){
			var first,
				newDescription = "This is my new description - " + Date.now(),
				rootElement = "form[data-ms-id='inlineDescription']",
				editDescription = rootElement + " span.action",
				textArea = rootElement + " textarea",
				inlineEdit = rootElement + " div.noEdit div",
				inlineEditCancel = rootElement + " .cancel",
				inlineEditSubmit = rootElement + " .submit",
				textAreaParent = rootElement + " .edit",
				textAreaField = element(by.css(textArea)),
				inlineEditField = element(by.css(inlineEdit)),
				editDescriptionButton = element(by.css(editDescription)),
				inlineEditCancelButton = element(by.css(inlineEditCancel)),
				textAreaHolder = element(by.css(textAreaParent)),
				inlineEditSubmitButton = element(by.css(inlineEditSubmit));

			xit("should edit a description", function(){
				browser.actions().mouseMove(editDescriptionButton).perform();
				editDescriptionButton.click();
				textAreaField.clear();
				textAreaField.sendKeys(newDescription);

				inlineEditSubmitButton.click();
				browser.waitForAngular();
				browser.get(projectUrl);

				inlineEditField.getText().then(function(currentDescription){
					expect(newDescription).toBe(currentDescription);
				});
			});

			xit("should not submit if the description has not been changed", function(){
				browser.actions().mouseMove(editDescriptionButton).perform();
				editDescriptionButton.click();
				expect(inlineEditSubmitButton.getAttribute('disabled')).toBeTruthy();
				textAreaField.sendKeys(newDescription);
				expect(inlineEditSubmitButton.getAttribute('disabled')).toBeFalsy();
			});

			xit("should unhide the textarea when action is clicked", function(){
				expect(hasClass(textAreaHolder, "ng-hide")).toBe(true);
				browser.actions().mouseMove(editDescriptionButton).perform();
				editDescriptionButton.click();
				expect(hasClass(textAreaHolder, "ng-hide")).toBe(false);
			});

			it("should reset if the selectedItem is changed", function(){
				browser.actions().mouseMove(editDescriptionButton).perform();
				editDescriptionButton.click();
				expect(hasClass(textAreaHolder, "ng-hide")).toBe(false);
				first = element(by.repeater('item in getData()').row(0));
				first.click();
				expect(hasClass(textAreaHolder, "ng-hide")).toBe(true);
			});
		});

		xit("should prevent the master project from being edited", function(){
			element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
			var masterProject = element(by.repeater('item in getData()').row(0));
			masterProject.click();
			expect(element(by.xpath("//h4[@data-ms-id='inlineRenameField']")).isPresent()).toBe(false);
		});

		xit("should have one scenario for the master project", function(){
			element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
			var masterProject = element(by.repeater('item in getData()').row(0));
			masterProject.click();
			var scenarios = element.all(by.repeater("scenario in selectedItem.scenarios"));

			expect(scenarios.count()).toBe(1);
		});

		xit("should click through to the scenario edit page from the scenario listings in the tray", function(){
			element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
			var masterProject = element(by.repeater('item in getData()').row(0));
			masterProject.click();
			var scenario = element(by.repeater("scenario in selectedItem.scenarios").row(0));
			scenario.click();
			expect(browser.getLocationAbsUrl()).toContain("/#/scenario");
		});
	});

	xdescribe("Page attributes: ", function(){
		it('should have a title', function() {
			expect(browser.getTitle()).toEqual('360 One View');
		});

		it("should have a breadcrumb", function(){
			expect(breadcrumbField.getText()).toBe("ALL PROJECTS");
		});
	});

});