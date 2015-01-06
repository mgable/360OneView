"use strict";

var specs = require('./0.0-specs.js');

describe('Project Listing Page: ', function() {
	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
			browser.get(specs.projectUrl + specs.testQuery);
		}
	);

	describe("Sorter: ", function(){
		it("should have at least one project", function(){
			expect(specs.getItems().count()).toBeGreaterThan(0);
		});

		it("should have a single master project", function(){
			expect(specs.getMasterProjectItem().isPresent()).toBe(true);
		});

		it("should have an active selection", function(){
			var firstItem = specs.getItems().first();
			expect(specs.hasClass(firstItem, specs.activeSelectionClass)).toBe(true);
		});

		it("should show the number of projects", function(){
			var itemCount = specs.getItemCount();
			itemCount.getText().then(function(count){
				specs.getItems().count().then(function(totalCount){
					expect(count).toEqual(totalCount.toString());
				});
			});
		});

		it("should change the active selection on click", function(){
			var first = specs.getItems().first(),
				last = specs.getItems().last();

			expect(specs.hasClass(first, specs.activeSelectionClass)).toBe(true);
			expect(specs.hasClass(last, specs.activeSelectionClass)).toBe(false);

			last.click();
			expect(specs.hasClass(first, specs.activeSelectionClass)).toBe(false);
			expect(specs.hasClass(last, specs.activeSelectionClass)).toBe(true);

			first.click();
			expect(specs.hasClass(first, specs.activeSelectionClass)).toBe(true);
			expect(specs.hasClass(last, specs.activeSelectionClass)).toBe(false);
		});

		it("should redirect to Project Dashboard when a project is clicked", function(){
			var itemTitle = specs.getFirstItemTitle();
			itemTitle.getAttribute(specs.itemUUID).then(function(id){
				itemTitle.click();
				expect(browser.getLocationAbsUrl()).toContain(specs.getDashboardUrl(id));
			});
			
		});

		it("should have the active item in the tray", function(){
			var itemTitle = specs.getFirstItemTitle(),
				selectedItemTitle = specs.getSelectedItemTitle();

				expect(itemTitle.getText()).toBe(selectedItemTitle.getText());
		});

		it("should put the active item in the tray when clicked", function(){
			var counter = 0,
				maxItemsToTest = 5,
				limit;
			specs.getItemCount().then(function(itemCount){
				itemCount.getText().then(function(totalNumberOfItems){
					limit = Math.min(maxItemsToTest, totalNumberOfItems);
					specs.getItems().each(function(el) {
						if (counter++ < limit) {
							el.click();
							var itemTitle = el.element(by.binding('title')),
								selectedItemTitle = specs.getSelectedItemTitle();
							itemTitle.getText().then(function(title){
								if (title.toLowerCase() !== specs.masterProject) {
									selectedItemTitle.getText().then(function(selectedTitle){
										expect(title).toBe(selectedTitle);
									});
								};
							});
						};
					});
				});
			});
			
		});
	});

	describe("Sort: ", function(){
		it("should switch between ordering by name, modified last and created on", function(){
			var itemTitles,
				itemModifiedOn,
				itemCreatedOn;

			specs.column_1SortButton.click();
			itemTitles = specs.getAllItemTitles();
			expect(itemTitles.first().getText()).toBeLessThan(itemTitles.last().getText());
			expect(specs.hasClass(specs.column_1LabelField, specs.activeSelectionClass)).toBe(true);
			expect(specs.hasClass(specs.column_2LabelField, specs.activeSelectionClass)).toBe(false);

			specs.column_2SortButton.click();
			itemModifiedOn = specs.getAllItemModifiedOn();
			expect(itemModifiedOn.first().getText()).toBeGreaterThan(itemModifiedOn.last().getText());
			expect(specs.hasClass(specs.column_1LabelField, specs.activeSelectionClass)).toBe(false);
			expect(specs.hasClass(specs.column_2LabelField, specs.activeSelectionClass)).toBe(true);

			specs.column_2SortOptionsButton.click();
			specs.createdByButton.click();
			itemCreatedOn = specs.getAllItemCreatedOn();
			expect(itemCreatedOn.first().getText()).toBeGreaterThan(itemCreatedOn.last().getText());
			expect(specs.hasClass(specs.column_1LabelField, specs.activeSelectionClass)).toBe(false);
			expect(specs.hasClass(specs.column_2LabelField, specs.activeSelectionClass)).toBe(true);

			specs.column_2SortOptionsButton.click();
			specs.modifiedOnButton.click();
			itemModifiedOn = specs.getAllItemModifiedOn();
			expect(itemModifiedOn.first().getText()).toBeGreaterThan(itemModifiedOn.last().getText());
			expect(specs.hasClass(specs.column_1LabelField, specs.activeSelectionClass)).toBe(false);
			expect(specs.hasClass(specs.column_2LabelField, specs.activeSelectionClass)).toBe(true);
		});

		it("should order by name", function(){
			var itemTitles = specs.getAllItemTitles();
			
			specs.column_1SortButton.click();
			
			itemTitles.first().getText().then(function(firstText){
				itemTitles.last().getText().then(function(lastText){
					expect(firstText.toLowerCase()).toBeLessThan(lastText.toLowerCase());
				});
			});

			specs.column_1SortButton.click();

			itemTitles.first().getText().then(function(firstText){
				itemTitles.last().getText().then(function(lastText){
					expect(lastText.toLowerCase()).toBeLessThan(firstText.toLowerCase());
				});
			});
		});

		it("should order by last modified", function(){
			var itemModifiedOn = specs.getAllItemModifiedOn();
			itemModifiedOn.first().getText().then(function(firstDate){
				itemModifiedOn.last().getText().then(function(lastDate){
					expect(firstDate).toBeGreaterThan(lastDate);
				});
			});

			specs.column_2SortOptionsButton.click();
			specs.ascendingButton.click();
			itemModifiedOn.first().getText().then(function(firstDate){
				itemModifiedOn.last().getText().then(function(lastDate){
					expect(firstDate).toBeLessThan(lastDate);
				});
			});

			specs.column_2SortOptionsButton.click();
			specs.descendingButton.click();
			itemModifiedOn.first().getText().then(function(firstDate){
				itemModifiedOn.last().getText().then(function(lastDate){
					expect(firstDate).toBeGreaterThan(lastDate);
				});
			});
		});

		it("should order by created date", function(){
			var itemCreatedOn = specs.getAllItemCreatedOn();

			specs.column_2SortOptionsButton.click();
			specs.createdByButton.click();
			itemCreatedOn.first().getText().then(function(firstDate){
				itemCreatedOn.last().getText().then(function(lastDate){
					expect(firstDate).toBeGreaterThan(lastDate);
				});
			});

			specs.column_2SortOptionsButton.click();
			specs.ascendingButton.click();
			itemCreatedOn.first().getText().then(function(firstDate){
				itemCreatedOn.last().getText().then(function(lastDate){
					expect(firstDate).toBeLessThan(lastDate);
				});
			});
		});
	});

	describe("Favorite: ", function(){
		var masterProject = specs.getMasterProjectItem(),
			masterProjectFavorite = masterProject.element(by.css(specs.favoriteClassHolder));

		it("should favorite the master project", function(){
			expect(specs.hasClass(masterProjectFavorite, specs.favoriteClass)).toBe(true);
		});

		it("should not allow the Master project to be unfavorited", function(){
			expect(specs.hasClass(masterProjectFavorite, specs.favoriteClass)).toBe(true);
			masterProjectFavorite.click();
			expect(specs.hasClass(masterProjectFavorite, specs.favoriteClass)).toBe(true);
		});

		it("should toggle favorite", function(){
			var firstFavoriteItem = specs.getFavorites().first(),
				isFavorite;
				
			specs.hasClass(firstFavoriteItem, specs.favoriteClass).then(function(favorite){
				isFavorite = favorite;
				firstFavoriteItem.click();
				expect(specs.hasClass(firstFavoriteItem, specs.favoriteClass)).not.toBe(isFavorite);
			});
		});

		it("should save the favorite", function(){
			var firstFavoriteItem = specs.getFavorites().first(),
				isFavorite;
				
			specs.hasClass(firstFavoriteItem, specs.favoriteClass).then(function(favorite){
				isFavorite = favorite;
				firstFavoriteItem.click();
				expect(specs.hasClass(firstFavoriteItem, specs.favoriteClass)).not.toBe(isFavorite);
				browser.get(specs.projectUrl + specs.testQuery);
				firstFavoriteItem = specs.getFavorites().first();
				expect(specs.hasClass(firstFavoriteItem, specs.favoriteClass)).not.toBe(isFavorite);
			});
		});

		it("should update the tray when favorites are filtered", function(){
			specs.filterByButton.click();
			specs.filterByfavoritesButton.click();

			var itemTitle = specs.getFirstItemTitle(),
				selectedItemTitle = specs.getSelectedItemTitle();

			itemTitle.getText().then(function(title){
				selectedItemTitle.getText().then(function(selectedTitle){
					expect(title).toEqual(selectedTitle);
				});
			});

		});
	});

	describe("Filters: ", function(){
		it("should filter by favorite", function(){
			var startItemCount = specs.getItemCount();
			specs.filterByButton.click();
			specs.filterByfavoritesButton.click();

			specs.getItems().count().then(function(itemCount){
				specs.getFavorites().count().then(function(favoriteCount){
					expect(itemCount).toBe(favoriteCount);
				});
			});

			specs.filterByButton.click();
			specs.filterByItemButton.click();
			startItemCount.getText().then(function(count){
				specs.getItems().count().then(function(itemCount){
					expect(count).toBe(itemCount.toString());
				});
			});
			
		});
	});

	describe("Search: ", function(){
		it("should search", function(){
			specs.searchInputField.sendKeys(specs.masterProject);
			expect(specs.getItems().count()).toBe(1);
		});
	});

	describe("Page actions: ", function(){
		it ("should toggle the filter menu dropdown", function(){
			expect(specs.hasClass(specs.filterDropdown, 'hide')).toBe(true);
			specs.filterByButton.click();
			expect(specs.hasClass(specs.filterDropdown, 'hide')).toBe(false);
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

		xdescribe("desciption edit functions", function(){
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

			it("should edit a description", function(){
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

			it("should not submit if the description has not been changed", function(){
				browser.actions().mouseMove(editDescriptionButton).perform();
				editDescriptionButton.click();
				expect(inlineEditSubmitButton.getAttribute('disabled')).toBeTruthy();
				textAreaField.sendKeys(newDescription);
				expect(inlineEditSubmitButton.getAttribute('disabled')).toBeFalsy();
			});

			it("should unhide the textarea when action is clicked", function(){
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