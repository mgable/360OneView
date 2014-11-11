// spec.js
"use strict";

var projectUrl = '/#/projects?e2e=true';

describe('Project Listing', function() {
	var hasClass = function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
	    });
	};

	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
			browser.get(projectUrl);
		}
	)

	xdescribe("Sort functions: ", function(){
		var menuId = "//span[@data-ms-id='column_1']",
			nameField = "//a[@data-ms-id='name-field']";

		it("should switch between name, modifiedOn and Created Date", function(){
			//TODO: after hector fixes https://jira.marketshare.com/browse/MAR-5809
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
			var menuId = "//span[@data-ms-id='column_1']",
				ascending = "//li[@data-ms-id='ascending']",
				descending = "//li[@data-ms-id='descending']",
				ascendingButton = element(by.xpath(ascending)),
				descendingButton = element(by.xpath(descending)),
				dropdown = element(by.xpath(menuId)),
				dates = element.all(by.repeater('item in getData()').column('modifiedOn'));

			dates.first().getText().then(function(firstDate){
				dates.last().getText().then(function(lastDate){
					expect(firstDate).toBeGreaterThan(lastDate);
				});
			});

			dropdown.click();
			ascendingButton.click();

			dates.first().getText().then(function(firstDate){
				dates.last().getText().then(function(lastDate){
					expect(firstDate).toBeLessThan(lastDate);
				});
			});
		});

		it("should order by created date", function(){
			var menuId = "//span[@data-ms-id='column_1']",
				ascending = "//li[@data-ms-id='ascending']",
				descending = "//li[@data-ms-id='descending']",
				createdBy = "//li[@data-ms-id='Created Date']",
				modifiedOn = "//li[@data-ms-id='Last modified']",
				ascendingButton = element(by.xpath(ascending)),
				descendingButton = element(by.xpath(descending)),
				dropdown = element(by.xpath(menuId)),
				createdByButton = element(by.xpath(createdBy)),
				dates = element.all(by.repeater('item in getData()').column('createdOn'));

			dropdown.click();
			createdByButton.click();

			dates.first().getText().then(function(firstDate){
				dates.last().getText().then(function(lastDate){
					expect(firstDate).toBeGreaterThan(lastDate);
				});
			});

			dropdown.click();
			ascendingButton.click();

			dates.first().getText().then(function(firstDate){
				dates.last().getText().then(function(lastDate){
					expect(firstDate).toBeLessThan(lastDate);
				});
			});
		});
	});

	xdescribe("Sorter", function(){
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
			var itemCount = element(by.css('.display-actions h4.title span:first-child'));
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
	});

	xdescribe("Favorite behaviors", function(){
		it("should favorite the master project", function(){
			expect(element.all(by.css(".master .favorite")).count()).toBe(1);
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

	xdescribe("Filters: ", function(){
		var filterMenu = ".app .ProjectManager .display-actions h4.title",
			filterFavorites = '.filterDropdown li:last-child',
			filterAll = '.filterDropdown li:first-child',
			countHolder = '.display-actions h4.title span:first-child';

		it("should filter by favorite", function(){
			var filteredCount, unFilteredCount,
				itemCount = element(by.css(countHolder));
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

	xdescribe("Search: ", function(){
		it("should search", function(){
			element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
			expect(element.all(by.repeater('item in getData()')).count()).toBe(1);
		});
	});

	describe("Page actions: ", function(){
		xit ("should toggle the filter menu dropdown", function(){
			var elem = element(by.css('.filterDropdown'));
			expect(hasClass(elem, 'hide')).toBe(true);
			element(by.css(".app .ProjectManager .display-actions h4.title")).click();
			expect(hasClass(elem, 'hide')).toBe(false);
		});


		xit("should create a project", function(){

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


		xit("should rename a project", function(){
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

		xit("should edit a description", function(){
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

		it("should swtich between ordering by name, modified last and created on", function(){
			var name = "//a[@data-ms-id='name-field']",
				column_1 = "//span[@data-ms-id='label_column_1']",
				nameButton = element(by.xpath(name)),
				column_1Button = element(by.xpath(column_1)),
				data;

			nameButton.click();
			data = element.all(by.repeater('item in getData()').column('title'));

			expect(data.first().getText()).toBeLessThan(data.last().getText());
		});

	});

	xdescribe("Page attributes: ", function(){
		it('should have a title', function() {
			expect(browser.getTitle()).toEqual('360 One View');
		});
	});

});