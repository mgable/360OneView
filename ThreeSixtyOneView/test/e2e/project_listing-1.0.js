// spec.js
"use strict";

var projectUrl = '/#/projects?e2e=true';

describe('Project Listing', function() {
	var hasClass = function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
	    });
	}, menuId, nameField, column_1, createdBy, ascending, descending, ascendingButton, descendingButton, dropdown, nameButton, column_1Button, createdByButton, nameLabel, nameLabelField, dropdownButton, column_1Label, column_1LabelField, breadcrumb, breadcrumbField;

	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
			browser.get(projectUrl);
			dropdown = "//span[@data-ms-id='toggle_column_1']",
			nameField = "//a[@data-ms-id='name-field']",
			nameLabel = "//div[@data-ms-id='name-label']",
			column_1 = "//span[@data-ms-id='select_column_1']",
			column_1Label = "//h6[@data-ms-id='label_column_1']",
			createdBy = "//li[@data-ms-id='Created Date']",
			ascending = "//li[@data-ms-id='ascending']",
			descending = "//li[@data-ms-id='descending']",
			breadcrumb = ".breadcrumbs span span",
			ascendingButton = element(by.xpath(ascending)),
			descendingButton = element(by.xpath(descending)),
			dropdownButton = element(by.xpath(dropdown)),
			nameButton = element(by.xpath(nameField)),
			nameLabelField = element(by.xpath(nameLabel)),
			column_1Button = element(by.xpath(column_1)),
			createdByButton = element(by.xpath(createdBy)),
			column_1LabelField = element(by.xpath(column_1Label)),
			breadcrumbField = element(by.css(breadcrumb));
		}
	)

	describe("Sort functions: ", function(){
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

	describe("Sorter", function(){
		it("should have at least one project", function(){
			expect(element.all(by.repeater('item in getData()')).count()).toBeGreaterThan(0);
		});

		it("should have a master project", function(){
			expect(element.all(by.css(".master")).count()).toBe(1);
		});

		it("should have an active selection", function(){
			var first = element.all(by.repeater('item in getData()')).first();
			expect(hasClass(first, "active")).toBe(true);
		});

		it("should show the number of projects", function(){
			var itemCount = element(by.xpath("//span[@data-ms-id='dataCount']"));
			expect(itemCount.getText()).toContain(element.all(by.repeater('item in getData()')).count());
		});

		it("should change the active selection on click", function(){
			var first = element.all(by.repeater('item in getData()')).first(),
			last = element.all(by.repeater('item in getData()')).last();
			expect(hasClass(first, "active")).toBe(true);
			expect(hasClass(last, "active")).toBe(false);
			last.click();
			expect(hasClass(first, "active")).toBe(false);
			expect(hasClass(last, "active")).toBe(true);
			first.click();
			expect(hasClass(first, "active")).toBe(true);
			expect(hasClass(last, "active")).toBe(false);
		});

		it("should redirect to Project Dashboard when a project is clicked", function(){
			var projectName = element.all(by.repeater('item in getData()')).first().element(by.css('.default.ng-binding'));
			projectName.click();
			expect(browser.getLocationAbsUrl()).toContain("/#/dashboard/");
		});

		it("should have the active item in the tray", function(){
			var firstTitle = element.all(by.repeater('item in getData()').column('title')).first(),
				titleInTray = element(by.xpath("//h4[@data-ms-id='inlineRenameField']"));

				expect(firstTitle.getText()).toBe(titleInTray.getText());
		});

		it("should put the active item in the tray when clicked", function(){
			var counter = 0;
			element.all(by.repeater('item in getData()')).each(function(el) {
				if (counter++ < 5) {
					el.click();
					var item = el.element(by.binding('title')),
						itemInTray = element(by.xpath("//h4[@data-ms-id='inlineRenameField']"));
					item.getText().then(function(title){
						if (title.toLowerCase() !== "master project") {
							itemInTray.getText().then(function(trayTitle){
								expect(title).toBe(trayTitle);
							});
						};
					});
				}
			});
		});
	});

	describe("Favorite behaviors", function(){
		it("should favorite the master project", function(){
			expect(element.all(by.css(".master a.favorite")).count()).toBe(1);
		});

		it("should not allow the Master project to be unfavorited", function(){
			var masterProject = element(by.css(".master a.favorite"));
			expect(hasClass(masterProject, 'favorite')).toBe(true);
			masterProject.click();
			expect(hasClass(masterProject, 'favorite')).toBe(true);
		});

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
				browser.get(projectUrl);
				firstElement = element.all(by.css(".favorites a")).first();
				expect(hasClass(firstElement, 'favorite')).not.toBe(isFavorite);
			});
		});
	});

	describe("Filters: ", function(){
		var filterMenu = ".app .ProjectManager .display-actions .filter-holder .title",
			filterFavorites = '.filterDropdown li:last-child',
			filterAll = '.filterDropdown li:first-child',
			countHolder = '//span[@data-ms-id="dataCount"]';

		it("should filter by favorite", function(){
			var filteredCount, unFilteredCount,
				itemCount = element(by.xpath(countHolder));
			element.all(by.repeater('item in getData()')).count().then(function(count){
				unFilteredCount = count;
			});
			element(by.css(filterMenu)).click();
			element(by.css(filterFavorites)).click();

			element.all(by.repeater('item in getData()')).count().then(function(count){
				var filteredCount = count,
				favorites = element.all(by.css('.favorite')).count();
				expect(filteredCount).toBeLessThan(unFilteredCount);
				expect(itemCount.getText()).toContain(element.all(by.repeater('item in getData()')).count());
				expect(element.all(by.repeater('item in getData()')).count()).toEqual(favorites);
			});
		});
	});

	describe("Search: ", function(){
		it("should search", function(){
			element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
			expect(element.all(by.repeater('item in getData()')).count()).toBe(1);
		});
	});

	describe("Page actions: ", function(){
		it ("should toggle the filter menu dropdown", function(){
			var elem = element(by.css('.filterDropdown'));
			expect(hasClass(elem, 'hide')).toBe(true);
			element(by.css(".app .ProjectManager .display-actions .filter-holder .title")).click();
			expect(hasClass(elem, 'hide')).toBe(false);
		});


		it("should create a project", function(){
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
			//cancelButton.click();
			submitButton.click();
			browser.waitForAngular();
			firstItemTitle = element.all(by.xpath(itemTitle));
			firstItemTitle.getText(function(text){
				expect(text).toBe(testFileName);
				expect(browser.getLocationAbsUrl()).toContain("/#/dashboard/");
			});
		});

		it("should rename a project", function(){

			var first,
			newName = "My Renamed Project - " + Date.now(),
			rename = "//a[@data-ms-id='inlineRename']",
			renameButton = element(by.xpath(rename)), 
			input = "input.inputTarget",
			inputField = element(by.css(input)),
			inlineSubmit = "//button[@data-ms-id='inlineSubmit']",
			inlineCancel = "//button[@data-ms-id='inlineCancel']";

			browser.actions().mouseMove(renameButton).perform();
			renameButton.click();
			browser.waitForAngular();
			var inlineSubmitButton = element(by.xpath(inlineSubmit)),
				inlineCancelButton = element(by.xpath(inlineCancel)),
				currentName = inputField.getAttribute('value');
			inputField.clear();
			inputField.sendKeys(newName);
			inlineSubmitButton.click();
			browser.waitForAngular();
			first = element(by.repeater('item in getData()').row(0).column("title"));
			first.getText().then(function(name){
				expect(name).toEqual(newName);
			});
		});


		it("should edit a description", function(){
			var newDescription = "This is my new description - " + Date.now(),
				editDescription = "//a[@data-ms-id='inlineEdit']",
				textArea = "textarea.inputTarget",
				inlineEdit = "//div[@data-ms-id='inlineEditField']",
				inlineEditCancel = "//button[@data-ms-id='inlineEditCancel']",
				inlineEditSubmit = "//button[@data-ms-id='inlineEditSubmit']",
				textAreaField = element(by.css(textArea)),
				inlineEditField = element(by.xpath(inlineEdit)),
				editDescriptionButton = element(by.xpath(editDescription));

			browser.actions().mouseMove(editDescriptionButton).perform();
			editDescriptionButton.click();
			browser.waitForAngular();
			textAreaField.clear();
			textAreaField.sendKeys(newDescription);
			var inlineEditCancelButton = element(by.xpath(inlineEditCancel));
			var inlineEditSubmitButton = element(by.xpath(inlineEditSubmit));
			inlineEditSubmitButton.click();
			browser.waitForAngular();
			browser.get(projectUrl);

			inlineEditField.getText().then(function(currentDescription){
				expect(newDescription).toBe(currentDescription);
			});
		});

		it("should prevent the master project from being edited", function(){
			element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
			var masterProject = element(by.repeater('item in getData()').row(0));
			masterProject.click();
			expect(element(by.xpath("//h4[@data-ms-id='inlineRenameField']")).isPresent()).toBe(false);
		});

		it("should have one scenario for the master project", function(){
			element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
			var masterProject = element(by.repeater('item in getData()').row(0));
			masterProject.click();
			var scenarios = element.all(by.repeater("scenario in selectedItem.scenarios"));

			expect(scenarios.count()).toBe(1);
		});
	});

	describe("Page attributes: ", function(){
		it('should have a title', function() {
			expect(browser.getTitle()).toEqual('360 One View');
		});

		it("should have a breadcrumb", function(){
			expect(breadcrumbField.getText()).toBe("ALL PROJECTS");
		});
	});

});