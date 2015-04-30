"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	projectInfo = {},
	testName = {title: "Project Listing functional tests: ", id: 1},
	projectId;

if(funcs.runTheseTests(testName)){

	describe("Executing " + testName.title, function(){
		console.info("executing " + testName.title);
		it("should set up the tests", function(){
			console.info(testName.title + " Tests: ");
		});
	})

	describe('Project Listing Page: ', function() {
		beforeEach(
			function(){
				browser.driver.manage().window().setSize(1280, 1024);
				browser.get(funcs.getProjectUrl());
			}
		);

		describe("Display: ", function(){
			it("should have at least one project", function(){
				expect(funcs.getItems().count()).toBeGreaterThan(0);
			});

			it("should have an active selection", function(){
				var firstItem = funcs.getItems().first();
				expect(funcs.hasClass(firstItem, specs.activeSelectionClass)).toBeTruthy();
			});

			it("should have a selected item", function(){
				var itemTitle = funcs.getFirstItemTitle(),
					selectedItemTitle = funcs.getSelectedItemTitle();

				expect(itemTitle.getText()).toBe(selectedItemTitle.getText());
			});

			it("should show the project cout", function(){
				var itemCount = funcs.getItemCount();
				itemCount.getText().then(function(count){
					funcs.getItems().count().then(function(totalCount){
						expect(count).toEqual(totalCount.toString());
					});
				});
			});

			it("should change the active selection when a project is clicked", function(){
				var first = funcs.getItems().first(),
					last = funcs.getItems().last();

				expect(funcs.hasClass(first, specs.activeSelectionClass)).toBe(true);
				expect(funcs.hasClass(last, specs.activeSelectionClass)).toBe(false);

				last.click();
				expect(funcs.hasClass(first, specs.activeSelectionClass)).toBe(false);
				expect(funcs.hasClass(last, specs.activeSelectionClass)).toBe(true);

				first.click();
				expect(funcs.hasClass(first, specs.activeSelectionClass)).toBe(true);
				expect(funcs.hasClass(last, specs.activeSelectionClass)).toBe(false);
			});

			it("should put the selected item in the tray", function(){
				var counter = 0,
					maitemsToTest = 5,
					limit;
				funcs.getItemCount().then(function(itemCount){
					itemCount.getText().then(function(totalNumberOfItems){
						limit = Math.min(maitemsToTest, totalNumberOfItems);
						funcs.getItems().each(function(el) {
							if (counter++ < limit) {
								el.click();
								var itemTitle = el.element(by.binding('name')),
									selectedItemTitle = funcs.getSelectedItemTitle();
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

			it("should redirect to Project Dashboard when a project is clicked", function(){
				var itemTitle = funcs.getFirstItemTitle();
				itemTitle.getAttribute(specs.itemUUID).then(function(id){
					itemTitle.click();
					expect(browser.getLocationAbsUrl()).toContain(specs.dashboardRoot + id);
				});
			});

			it("should redirect to Scenario Edit page when a scenario name is clicked", function(){
				var scenario;

				funcs.selectMasterProject();
				scenario = funcs.getFirstScenario();

				scenario.click();
				browser.waitForAngular();

				expect(browser.getLocationAbsUrl()).toContain(specs.scenarioRoot);
			});
		});

		describe("Sort: ", function(){
			it("should highlight the inital sort field", function(){
				expect(funcs.hasClass(specs.column_1LabelField, specs.activeSelectionClass)).toBe(false);
				expect(funcs.hasClass(specs.column_2LabelField, specs.activeSelectionClass)).toBe(true);
			})

			it("should switch between ordering by name, modified last and created on", function(){
				var itemTitles,
					itemModifiedOn,
					itemCreatedOn;

				specs.column_1SortButton.click();
				itemTitles = funcs.getAllItemTitles();
				itemTitles.first().getText().then(function(firstTitle){
					itemTitles.last().getText().then(function(secondTitle){
						expect(firstTitle.toLowerCase()).toBeLessThan(secondTitle.toLowerCase());
					});
				})
				expect(funcs.hasClass(specs.column_1LabelField, specs.activeSelectionClass)).toBe(true);
				expect(funcs.hasClass(specs.column_2LabelField, specs.activeSelectionClass)).toBe(false);

				specs.column_2SortButton.click();
				itemModifiedOn = funcs.getAllItemModifiedOn();
				expect(itemModifiedOn.first().getText()).toBeGreaterThan(itemModifiedOn.last().getText());
				expect(funcs.hasClass(specs.column_1LabelField, specs.activeSelectionClass)).toBe(false);
				expect(funcs.hasClass(specs.column_2LabelField, specs.activeSelectionClass)).toBe(true);

				specs.column_2SortOptionsButton.click();
				specs.createdByButton.click();
				itemCreatedOn = funcs.getAllItemCreatedOn();
				expect(itemCreatedOn.first().getText()).toBeGreaterThan(itemCreatedOn.last().getText());
				expect(funcs.hasClass(specs.column_1LabelField, specs.activeSelectionClass)).toBe(false);
				expect(funcs.hasClass(specs.column_2LabelField, specs.activeSelectionClass)).toBe(true);

				specs.column_2SortOptionsButton.click();
				specs.modifiedOnButton.click();
				itemModifiedOn = funcs.getAllItemModifiedOn();
				expect(itemModifiedOn.first().getText()).toBeGreaterThan(itemModifiedOn.last().getText());
				expect(funcs.hasClass(specs.column_1LabelField, specs.activeSelectionClass)).toBe(false);
				expect(funcs.hasClass(specs.column_2LabelField, specs.activeSelectionClass)).toBe(true);
			});

			it("should order by name", function(){
				var itemTitles = funcs.getAllItemTitles();
				
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
				var itemModifiedOn = funcs.getAllItemModifiedOn();

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
				var itemCreatedOn = funcs.getAllItemCreatedOn();

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
			it("should toggle favorite", function(){
				var firstFavoriteItem = funcs.getFirstItem().element(by.css(specs.favoriteClassHolder)),
					isFavorite;
					
				funcs.hasClass(firstFavoriteItem, specs.favoriteClass).then(function(favorite){
					isFavorite = favorite;
					firstFavoriteItem.click();
					expect(funcs.hasClass(firstFavoriteItem, specs.favoriteClass)).not.toBe(isFavorite);
					firstFavoriteItem.click();
					expect(funcs.hasClass(firstFavoriteItem, specs.favoriteClass)).toBe(isFavorite);
				});
			});

			it("should save the favorite", function(){
				var firstFavoriteItem = funcs.getFirstItem().element(by.css(specs.favoriteClassHolder)),
					isFavorite;
					
				funcs.hasClass(firstFavoriteItem, specs.favoriteClass).then(function(favorite){
					isFavorite = favorite;
					firstFavoriteItem.click();
					expect(funcs.hasClass(firstFavoriteItem, specs.favoriteClass)).not.toBe(isFavorite);
					browser.get(funcs.getProjectUrl());
					firstFavoriteItem = funcs.getFirstItem().element(by.css(specs.favoriteClassHolder));
					expect(funcs.hasClass(firstFavoriteItem, specs.favoriteClass)).not.toBe(isFavorite);
				});
			});
		});

		describe("Filters: ", function(){
			xit("should toggle the filter menu dropdown", function(){
				expect(funcs.hasClass(specs.filterDropdown, 'hide')).toBe(true);
				specs.filterByButton.click();
				expect(funcs.hasClass(specs.filterDropdown, 'hide')).toBe(false);
			});

			it("should filter by favorite", function(){
				funcs.filterByFavorites();

				funcs.getItems().count().then(function(itemCount){
					funcs.getFavorites().count().then(function(favoriteCount){
						expect(itemCount).toBe(favoriteCount);
					});
				});
			});

			xit("should filter by project", function(){
				var startItemCount = funcs.getItemCount();

				funcs.filterByItem();

				startItemCount.getText().then(function(count){
					funcs.getItems().count().then(function(itemCount){
						expect(count).toBe(itemCount.toString());
					});
				});	
			});

			it("should update the selected item when favorites are filtered", function(){
				var lastItem = funcs.getFavorites().last(), numberOfFavorites;
				funcs.getFavorites().count().then(function(count){
					numberOfFavorites = count;

					funcs.hasClass(lastItem, specs.favoriteClass).then(function(isFavorite){
						if(!isFavorite){
							lastItem.click();
						}

						funcs.filterByFavorites();

						var firstTitle = funcs.getFirstItemTitle(),
							selectedItemTitle = (count > 1) ? funcs.getSelectedItemTitle() : funcs.getSelectedItemTitle(true);

						firstTitle.getText().then(function(title){
							selectedItemTitle.getText().then(function(secondTitle){
								expect(title.trim()).toEqual(secondTitle.trim());
							});
						});

					});
				});
			});

			it("should update the project count when filtering is applied", function(){
				funcs.filterByFavorites();

				funcs.getItemCount().getText().then(function(itemCount){
					funcs.getFavorites().count().then(function(favoriteCount){
						expect(itemCount).toBe(favoriteCount.toString());
					});
				});

				funcs.filterByItem();

				funcs.getItemCount().getText().then(function(count){
					funcs.getItems().count().then(function(itemCount){
						expect(count).toBe(itemCount.toString());
					});
				});	
			});
		});

		describe("Search: ", function(){
			it("should search for a project", function(){
				funcs.enterSearch(specs.masterProject);
				expect(funcs.getItems().count()).toEqual(1);
			});

			it("should update the project count", function(){
				funcs.enterSearch(specs.masterProject);
				funcs.getItems().count().then(function(itemCount){
					expect(itemCount).toEqual(1);
				});
			});

			it("should clear the search when the field is cleared", function(){
				var startItemCount = funcs.getItemCount();

				funcs.enterSearch(specs.masterProject);

				funcs.getItems().count().then(function(itemCount){
					expect(itemCount).toEqual(1);
				});

				funcs.clearSearch();

				funcs.getItems().count().then(function(itemCount){
					startItemCount.getText().then(function(text){
						expect(itemCount).toEqual(parseInt(text,10));
					});
				});
			});
		});

		describe("Create: ", function(){
			var firstItemTitle,
				testFileName = "My New Test Project- " + Date.now();

			it("should create a project", function(){
				funcs.getItemCount().getText().then(function(count){
					specs.createButton.click();
					browser.waitForAngular();

					specs.modalInputField.sendKeys(testFileName);
					specs.modalSubmitButton.click();
					browser.waitForAngular();

					browser.getLocationAbsUrl().then(function(url){
						projectId = funcs.getProjectId(url);
						expect(url).toContain(specs.dashboardRoot + projectId);
						projectInfo = {"project": {"url": url, "uuid": projectId, "name": testFileName}};
						funcs.saveProjectInfo(projectInfo);
					});

					browser.get(funcs.getProjectUrl());
					browser.waitForAngular();
					firstItemTitle = funcs.getFirstItemTitle();
					firstItemTitle.getText(function(title){
						expect(title).toBe(testFileName);
					});

					funcs.getItems().count().then(function(itemCount){
						expect(itemCount).toBe(+count + 1);
					});
				});
			});

			it("should update the project count", function(){
				// checked in above test
			});

			it("should prevent a project being created with with no name", function(){
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

		describe("Rename: ", function(){
			var first,
				newName = "My Renamed Project - " + Date.now();

			it("should rename a project", function(){
				funcs.hoverAndClick(specs.renameButton);

				var currentName = specs.inputField.getAttribute('value');
				specs.inputField.clear();
				specs.inputField.sendKeys(newName);
				specs.inlineSubmitButton.click();
				browser.waitForAngular();
				first = funcs.getFirstItemTitle();
				first.getText().then(function(name){
					expect(name).toEqual(newName);
					projectInfo.project.name = name;
					funcs.deleteProjectInfo();
					funcs.saveProjectInfo(projectInfo);
				});
			});

			it("should not submit if the name has not been mdoified", function(){
				funcs.hoverAndClick(specs.renameButton);

				expect(specs.inlineSubmitButton.getAttribute('disabled')).toBeTruthy();
				specs.inputField.sendKeys(newName);
				expect(specs.inlineSubmitButton.getAttribute('disabled')).toBeFalsy();
			});

			it("should activate the name field when action is clicked", function(){
				expect(funcs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(true);

				funcs.hoverAndClick(specs.renameButton);

				expect(funcs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(false);
			});

			it("should reset if the selected item is changed", function(){
				funcs.hoverAndClick(specs.renameButton);

				expect(funcs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(false);
				first = funcs.getFirstItem();
				first.click();
				expect(funcs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(true);
			});

			it("should reset if the rename is cancelled", function(){
				funcs.hoverAndClick(specs.renameButton);

				expect(funcs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(false);
				specs.inlineCancelButton.click();
				expect(funcs.hasClass(specs.inputFieldHolder, "ng-hide")).toBe(true);
			});

			it("should reset the selected item if the rename is cancelled", function(){
				funcs.hoverAndClick(specs.renameButton);

				var currentName = specs.inputField.getAttribute('value');
				specs.inputField.clear();
				specs.inputField.sendKeys(newName);
				specs.inlineCancelButton.click();
				expect(specs.inputField.getAttribute('value')).toEqual(currentName);
			});

			it("should set form states", function(){
				funcs.hoverAndClick(specs.renameButton);
				expect(funcs.hasClass(specs.inputField, "ng-pristine")).toBe(true);
				expect(funcs.hasClass(specs.inputField, "ng-dirty")).toBe(false);

				specs.inputField.sendKeys("x");
				expect(funcs.hasClass(specs.inputField, "ng-pristine")).toBe(false);
				expect(funcs.hasClass(specs.inputField, "ng-dirty")).toBe(true);
				specs.inlineCancelButton.click();

				funcs.hoverAndClick(specs.renameButton);
				expect(funcs.hasClass(specs.inputField, "ng-pristine")).toBe(true);
				expect(funcs.hasClass(specs.inputField, "ng-dirty")).toBe(false);
			});

			it("should respect input limitations", function(){
				funcs.hoverAndClick(specs.renameButton);
				funcs.testInputRestrictions(specs.inputField, specs.inlineSubmitButton);
			});
		});	

		describe("Edit: ", function(){
			var first,
				newDescription = "This is my new description - " + Date.now();

			it("should edit a description", function(){
				funcs.hoverAndClick(specs.editDescriptionButton);

				specs.textAreaField.clear();
				specs.textAreaField.sendKeys(newDescription);

				specs.inlineEditSubmitButton.click();
				browser.waitForAngular();
				browser.get(funcs.getProjectUrl());

				specs.inlineEditField.getText().then(function(currentDescription){
					expect(newDescription).toBe(currentDescription);
				});
			});

			it("should not submit if the description has not been modified", function(){
				funcs.hoverAndClick(specs.editDescriptionButton);

				expect(specs.inlineEditSubmitButton.getAttribute('disabled')).toBeTruthy();
				specs.textAreaField.sendKeys(newDescription);
				expect(specs.inlineEditSubmitButton.getAttribute('disabled')).toBeFalsy();
			});

			it("should activate the textarea when action is clicked", function(){
				expect(funcs.hasClass(specs.textAreaHolder, "ng-hide")).toBe(true);

				funcs.hoverAndClick(specs.editDescriptionButton);

				expect(funcs.hasClass(specs.textAreaHolder, "ng-hide")).toBe(false);
			});

			it("should reset if the selected item is changed", function(){
				funcs.hoverAndClick(specs.editDescriptionButton);

				expect(funcs.hasClass(specs.textAreaHolder, "ng-hide")).toBe(false);
				first = funcs.getFirstItem();
				first.click();
				expect(funcs.hasClass(specs.textAreaHolder, "ng-hide")).toBe(true);
			});
		});

		describe("Master Project: ", function(){
			var masterProject = funcs.getMasterProjectItem(),
				masterProjectFavorite = masterProject.element(by.css(specs.favoriteClassHolder));

			it("should have a single master project", function(){
				expect(funcs.getMasterProjectItem().isPresent()).toBeTruthy();
			});

			it("should prevent the master project from being edited", function(){
				funcs.selectMasterProject();
				expect(specs.renameButton.isPresent()).toBe(false);
			});

			it("should favorite the master project", function(){
				expect(funcs.hasClass(masterProjectFavorite, specs.favoriteClass)).toBeTruthy();
			});

			it("should not allow the Master project to be unfavorited", function(){
				expect(funcs.hasClass(masterProjectFavorite, specs.favoriteClass)).toBe(true);
				masterProjectFavorite.click();
				expect(funcs.hasClass(masterProjectFavorite, specs.favoriteClass)).toBe(true);
			});
		});

		describe("Page: ", function(){
			it('should have a title', function() {
				expect(browser.getTitle()).toEqual(specs.pageTitle);
			});

			it("should have a breadcrumb", function(){
				expect(specs.breadcrumbField.getText()).toBe(specs.projectsBreadcrumb);
			});
		});
	});

}
