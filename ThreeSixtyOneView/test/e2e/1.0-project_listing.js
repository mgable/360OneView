"use strict";

var specs = require('./0.0-specs.js'),
	funcs = require('./0.1-project_functions.js');

xdescribe('Project Listing Page: ', function() {
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

		it("should put the selected item in the tray", function(){
			var counter = 0,
				maitemsToTest = 5,
				limit;
			specs.getItemCount().then(function(itemCount){
				itemCount.getText().then(function(totalNumberOfItems){
					limit = Math.min(maitemsToTest, totalNumberOfItems);
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

	describe("Favorites: ", function(){
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
			var firstFavoriteItem = specs.getFavorites().first(),
				isFavorite;
				
			specs.hasClass(firstFavoriteItem, specs.favoriteClass).then(function(favorite){
				isFavorite = favorite;
				if (! isFavorite){
					firstFavoriteItem.click();
				};
			});

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
		it ("should toggle the filter menu dropdown", function(){
			expect(specs.hasClass(specs.filterDropdown, 'hide')).toBe(true);
			specs.filterByButton.click();
			expect(specs.hasClass(specs.filterDropdown, 'hide')).toBe(false);
		});

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

		it("should update the tray when favorites are filtered", function(){
			var lastItem = specs.getFavorites().last();
			specs.hasClass(lastItem, specs.favoriteClass).then(function(isFavorite){
				if(!isFavorite){
					lastItem.click();
				}

				funcs.filterByFavorites();

				var firstTitle = specs.getFirstItemTitle(),
					slectedItemTitle = specs.getSelectedItemTitle()

				firstTitle.getText().then(function(title){
					slectedItemTitle.getText().then(function(secondTitle){
						expect(title).toEqual(secondTitle);
					});
				});

			});

		});
	});

	describe("Search: ", function(){
		it("should search", function(){
			funcs.enterSearch(specs.masterProject)
			expect(specs.getItems().count()).toBe(1);
		});
	});

	describe("Create project: ", function(){
		var firstItemTitle,
			testFileName = "My New Test Project- " + Date.now();

		it("should create a project", function(){
			specs.createButton.click();
			browser.waitForAngular();

			specs.modalInputField.sendKeys(testFileName);
			specs.modalSubmitButton.click();
			browser.waitForAngular();
			expect(browser.getLocationAbsUrl()).toContain("/#/dashboard/");

			browser.get(specs.projectUrl + specs.testQuery);
			browser.waitForAngular();
			firstItemTitle = specs.getFirstItemTitle();
			firstItemTitle.getText(function(title){
				expect(title).toBe(testFileName);
				
			});
		});

		it("should not allow a project to be created with no name", function(){
			specs.createButton.click();
			browser.waitForAngular();

			expect(specs.modalSubmitButton.getAttribute('disabled')).toBeTruthy();
		});

		it("should respect input limitations", function(){
			specs.createButton.click();
			browser.waitForAngular();

			funcs.testInputRestrictions(specs.modalInputField, specs.modalSubmitButton);
		});
	});

	describe("rename functions:", function(){
		var first,
			newName = "My Renamed Project - " + Date.now();

		it("should rename a project", function(){
			funcs.hoverAndClick(specs.renameButton);

			var currentName = specs.inputField.getAttribute('value');
			specs.inputField.clear();
			specs.inputField.sendKeys(newName);
			specs.inlineSubmitButton.click();
			browser.waitForAngular();
			first = specs.getFirstItemTitle();
			first.getText().then(function(name){
				expect(name).toEqual(newName);
			});
		});

		it("should not submit if the title has not been changed", function(){
			funcs.hoverAndClick(specs.renameButton);

			expect(specs.inlineSubmitButton.getAttribute('disabled')).toBeTruthy();
			specs.inputField.sendKeys(newName);
			expect(specs.inlineSubmitButton.getAttribute('disabled')).toBeFalsy();
		});

		it("should unhide the input field when action is clicked", function(){
			expect(specs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(true);

			funcs.hoverAndClick(specs.renameButton);

			expect(specs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(false);
		});

		it("should reset if the selectedItem is changed", function(){
			funcs.hoverAndClick(specs.renameButton);

			expect(specs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(false);
			first = specs.getFirstItem();
			first.click();
			expect(specs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(true);
		});

		it("should reset if the rename is cancelled", function(){
			funcs.hoverAndClick(specs.renameButton);

			expect(specs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(false);
			specs.inlineCancelButton.click();
			expect(specs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(true);
		});

		it("should reset the selectedItem if the rename is cancelled", function(){
			funcs.hoverAndClick(specs.renameButton);

			var currentName = specs.inputField.getAttribute('value');
			specs.inputField.clear();
			specs.inputField.sendKeys(newName);
			specs.inlineCancelButton.click();
			expect(specs.inputField.getAttribute('value')).toEqual(currentName);
		});

		it("should set form states", function(){
			funcs.hoverAndClick(specs.renameButton);
			expect(specs.hasClass(specs.inputField, "ng-pristine")).toBe(true);
			expect(specs.hasClass(specs.inputField, "ng-dirty")).toBe(false);

			specs.inputField.sendKeys("x");
			expect(specs.hasClass(specs.inputField, "ng-pristine")).toBe(false);
			expect(specs.hasClass(specs.inputField, "ng-dirty")).toBe(true);
			specs.inlineCancelButton.click();

			funcs.hoverAndClick(specs.renameButton);
			expect(specs.hasClass(specs.inputField, "ng-pristine")).toBe(true);
			expect(specs.hasClass(specs.inputField, "ng-dirty")).toBe(false);
		});

		it("should respect input limitations", function(){
			funcs.hoverAndClick(specs.renameButton);
			funcs.testInputRestrictions(specs.inputField, specs.inlineSubmitButton);
		});
	});	

	describe("edit description: ", function(){
		var first,
			newDescription = "This is my new description - " + Date.now();

		it("should edit a description", function(){
			funcs.hoverAndClick(specs.editDescriptionButton);

			specs.textAreaField.clear();
			specs.textAreaField.sendKeys(newDescription);

			specs.inlineEditSubmitButton.click();
			browser.waitForAngular();
			browser.get(specs.projectUrl);

			inlineEditField.getText().then(function(currentDescription){
				expect(newDescription).toBe(currentDescription);
			});
		});

		it("should not submit if the description has not been changed", function(){
			funcs.hoverAndClick(specs.editDescriptionButton);

			expect(specs.inlineEditSubmitButton.getAttribute('disabled')).toBeTruthy();
			specs.textAreaField.sendKeys(newDescription);
			expect(specs.inlineEditSubmitButton.getAttribute('disabled')).toBeFalsy();
		});

		it("should unhide the textarea when action is clicked", function(){
			expect(specs.hasClass(specs.textAreaHolder, "ng-hide")).toBe(true);

			funcs.hoverAndClick(specs.editDescriptionButton);

			expect(specs.hasClass(specs.textAreaHolder, "ng-hide")).toBe(false);
		});

		it("should reset if the selectedItem is changed", function(){
			funcs.hoverAndClick(specs.editDescriptionButton);

			expect(specs.hasClass(specs.textAreaHolder, "ng-hide")).toBe(false);
			first = specs.getFirstItem();
			first.click();
			expect(specs.hasClass(specs.textAreaHolder, "ng-hide")).toBe(true);
		});
	});

	describe("Page actions: ", function(){
		it("should prevent the master project from being edited", function(){
			funcs.selectMasterProject();
			expect(specs.renameButton.isPresent()).toBe(false);
		});

		it("should have one scenario for the master project", function(){
			var scenarios;

			funcs.selectMasterProject();
			scenarios = specs.getScenarios();

			expect(scenarios.count()).toBe(1);
		});

		it("should click through to the scenario edit page from the scenario listings in the tray", function(){
			var scenario;

			funcs.selectMasterProject();
			scenario = specs.getFirstScenario();

			scenario.click();
			browser.waitForAngular();

			expect(browser.getLocationAbsUrl()).toContain("/#/scenario");
		});
	});

	describe("Page attributes: ", function(){
		it('should have a title', function() {
			expect(browser.getTitle()).toEqual(specs.pageTitle);
		});

		it("should have a breadcrumb", function(){
			expect(specs.breadcrumbField.getText()).toBe(specs.projectsBreadcrumb);
		});
	});

});