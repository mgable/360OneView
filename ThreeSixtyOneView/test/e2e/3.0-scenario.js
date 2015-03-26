"use strict";

var specs = require('./3.0-scenario_specs.js'),
	funcs = require('./3.0-scenario_functions.js'),
	_ = require('underscore'),
	projectInfo,
	scenarioUrl,
	projectId,
	scenarioId,
	analysisElementFileName = "My New Analysis Element File " + Date.now(),
	analysisElementFiledescription = "My New description",
	testName = {title: "Scenario", id: 3};

if(funcs.runTheseTests(testName)){

	describe("executing " + testName.title, function(){
		console.info("executing " + testName.title);
		it("should set up the tests", function(){
			projectInfo = funcs.readProjectInfo();
			projectId = projectInfo.project.id;
			scenarioId = projectInfo.scenario.id;
			scenarioUrl = funcs.getScenarioEditUrl(projectId, scenarioId);
			console.info(scenarioUrl);
		});
	});

	beforeEach(function(){
	    this.addMatchers(specs.customMatchers);
	});

	describe('Scenario Page: ', function() {
		beforeEach(
			function(){
				browser.driver.manage().window().setSize(1280, 1024);
				browser.get(scenarioUrl);
			}
		);

		describe("current working scenario", function(){
			xit("should read the correct scenario from the file system", function(){
				browser.getLocationAbsUrl().then(function(url){
					expect(url).toContain(projectInfo.scenario.url);
				});
			});
		});

		describe("initial state of navigation buttons", function(){
			xit("should have the edit button enabled", function(){
				expect(funcs.hasClass(specs.editButton, 'disabled')).toBe(false);
			});
			xit("should have the results button disabled", function(){
				expect(funcs.hasClass(specs.resultsButton, 'disabled')).toBe(true);
			});
			xit("should have the simulate button enabled", function(){
				expect(funcs.hasClass(specs.simulateButton, 'disabled')).toBe(false);
			});
		});

		describe("analysis element toolbar", function(){
			xit("should have analysis elements", function(){
				expect(specs.cubes.count()).toBeGreaterThan(0);
			});


			xit("should have 'marketing plan' selected", function(){
				specs.selectedAnalysisElement.getText().then(function(selected){
					expect(selected).toBe(specs.assumedData.defaultSelectedAnalysisElement);
				});
			});

			xit("should allow the user to select a new cube", function(){
				specs.cubes.each(function(element){
					specs.selectedAnalysisElement.click();
					element.click();
					specs.selectedAnalysisElement.getText().then(function(selected){
						expect(selected).toBeTruthy();
					});
				});
			});

			xit("should not allow the analysis element to be replaced or copied on the Marketing Plan", function(){
				specs.cubes.each(function(element){
					specs.selectedAnalysisElement.click();
					element.click();
					specs.selectedAnalysisElement.getText().then(function(text){
						if (text.toLowerCase() !== "marketing plan"){
							expect(funcs.hasClass(specs.copyAndReplaceCube, "ng-hide")).toBeFalsy();
						} else {
							expect(funcs.hasClass(specs.copyAndReplaceCube, "ng-hide")).toBeTruthy();
						}
					});
				});
			});

			xit("should have a default analysis element file", function(){
				specs.cubes.each(function(element){
					specs.selectedAnalysisElement.click();
					element.click();
					specs.selectedAnalysisElement.getText().then(function(text){
						if(text.toLowerCase() !== "marketing plan"){
							expect(funcs.hasClass(specs.copyAndReplaceCube, "ng-hide")).toBe(false);
							specs.replaceButton.click();
							expect(specs.analysisElementFileList.count()).toBeGreaterThan(0);
							specs.analysisElementFileList.getText().then(function(fileList){
								expect(fileList).toBeTruthy();
								specs.replaceCancelButton.click();
							});
						} else{
							expect(funcs.hasClass(specs.copyAndReplaceCube, "ng-hide")).toBe(true);
						}
					});
					
					browser.waitForAngular();
				});
			});

			it("should copy and replace the analysis element file", function(){
				var done = false;
				specs.cubes.each(function(element){
					if(!done){
						specs.selectedAnalysisElement.click();
						element.click();
						specs.selectedAnalysisElement.getText().then(function(text){
							if(text.toLowerCase() !== "marketing plan"){
								done = true;

								specs.copyButton.click();
								expect(specs.submitButton.getAttribute("disabled")).toBeTruthy();
								specs.copyAndReplaceNameField.clear();
								specs.copyAndReplaceNameField.sendKeys(analysisElementFileName);
								expect(specs.submitButton.getAttribute("disabled")).toBeTruthy();
								specs.copyAndReplacedescriptionField.sendKeys(analysisElementFiledescription);
								browser.waitForAngular();
								expect(specs.submitButton.getAttribute("disabled")).toBeFalsy();
								specs.submitButton.click();
								specs.copyAndReplaceCubeName.getText().then(function(fileName){
									expect(fileName).toEqual(analysisElementFileName);
								});
							}
						});
					}
				});
			});

			xit("should replace the analysis element file", function(){
				var file,
					done = false;

				specs.cubes.each(function(element){
					specs.selectedAnalysisElement.click();
					element.click();
					specs.selectedAnalysisElement.getText().then(function(text){
						if(!done && text.toLowerCase() !== "marketing plan"){
							done = true;
							specs.replaceButton.click();
							specs.analysisElementFileList.last().element(by.css('.list-box .item-name')).getText().then(function(fileName){
								file = fileName;
								specs.analysisElementFileList.last().click();
								specs.replaceSubmitButton.click();
								browser.waitForAngular();
								specs.copyAndReplaceCubeName.getText().then(function(fileName){
									expect(fileName).toEqual(file);
								});
								specs.replaceButton.click();
								specs.analysisElementFileList.first().element(by.css('.list-box .item-name')).getText().then(function(fileName){
									file = fileName;
									specs.analysisElementFileList.first().click();
									specs.replaceSubmitButton.click();
									browser.waitForAngular();
									specs.copyAndReplaceCubeName.getText().then(function(fileName){
										expect(fileName).toEqual(file);
									});
								})
							});
						};
					});
				});
			});

			xit("should not allow the analysis element to be replaced or copied on the Marketing Plan", function(){
				var done = false;
				specs.cubes.each(function(element){
					specs.selectedAnalysisElement.click();
					element.click();
					specs.selectedAnalysisElement.getText().then(function(text){
						if(!done && text.toLowerCase() === "marketing plan"){
							done = true;
							expect(funcs.hasClass(specs.copyAndReplaceCube, "ng-hide")).toBeTruthy();
						};
					});
				});
			});

			xit("should allow the analysis element to be replaced or copied for all others", function(){
				specs.cubes.each(function(element){
					specs.selectedAnalysisElement.click();
					element.click();
					specs.selectedAnalysisElement.getText().then(function(text){
						if(text.toLowerCase() !== "marketing plan"){
							expect(funcs.hasClass(specs.copyAndReplaceCube, "ng-hide")).toBeFalsy();
						}
					});
				});
			});
		});

		describe("scenario editor", function(){

			describe("open and close", function(){
				xit("should expand and collapse the editor", function(){
					var isHidden;
					funcs.hasClass(specs.pivotBuilderTab, "hidden").then(function(state){
						isHidden = state;
						specs.collapseHandle.click(); //close
						funcs.hasClass(specs.pivotBuilderTab, "hidden").then(function(state){
							expect(state).toEqual(!isHidden);
							specs.editorTabs.get(0).click(); //open
							funcs.hasClass(specs.pivotBuilderTab, "hidden").then(function(state){
								expect(state).toEqual(isHidden);
								specs.editorTabs.get(0).click(); //close
								funcs.hasClass(specs.pivotBuilderTab, "hidden").then(function(state){
									expect(state).toEqual(!isHidden);
								})
							})
						})
					})

				});
			})

			describe("tabs", function(){
				xit("should have three tabs", function(){
					expect(specs.editorTabs.count()).toBe(3);
				});

				xit("should toggle expand and collapse when tab is clicked", function(){
					funcs.hasClass(specs.pivotBuilderTab, "hidden").then(function(state){
						specs.editorTabs.get(0).click();
						expect(funcs.hasClass(specs.pivotBuilderTab, "hidden")).toBe(!state)
						specs.editorTabs.get(0).click();
						expect(funcs.hasClass(specs.pivotBuilderTab, "hidden")).toBe(state)
					});

					funcs.hasClass(specs.importTab, "hidden").then(function(state){
						specs.editorTabs.get(1).click();
						expect(funcs.hasClass(specs.importTab, "hidden")).toBe(!state)
						specs.editorTabs.get(1).click();
						expect(funcs.hasClass(specs.importTab, "hidden")).toBe(state)
					});

					funcs.hasClass(specs.exportTab, "hidden").then(function(state){
						specs.editorTabs.get(2).click();
						expect(funcs.hasClass(specs.exportTab, "hidden")).toBe(!state)
						specs.editorTabs.get(2).click();
						expect(funcs.hasClass(specs.exportTab, "hidden")).toBe(state)
					});
				});
			});

			describe ("views", function(){
				xit("should load the default view for each cube", function(){
					specs.cubes.each(function(element){
						specs.selectedAnalysisElement.click();
						element.click();
						specs.viewName.getText().then(function(name){

							specs.selectedAnalysisElement.getText().then(function(title){
								expect(name).toBeTruthy();
							});

						});
					});
				});

				xit("should save a view", function(){
					var currentViewName;
					specs.viewName.getText().then(function(name){
						currentViewName = name;
						specs.addColumnDimensionsButton.click();
						funcs.addDimension(function(item){
							var inDraftMode = false;
							item.click();
							browser.waitForAngular();
							if(!specs.draftRegEx.test(currentViewName)){
								specs.viewName.getText().then(function(name){
									expect(name).toEqual(specs.draftText + currentViewName)
								})
							} else {
								inDraftMode = true
								console.info("view is alreay in draft mode");
							}
							specs.saveButton.click();
							specs.viewName.getText().then(function(name){
								expect(name).toEqual(inDraftMode ? currentViewName.replace(specs.draftRegEx, "") : currentViewName );
							});
						});
					});
				});

				xit("should have at least one view in the recent views dropdown but no more than five", function(){
					specs.recentViewsDropDown.click();
					specs.recentViews.count().then(function(count){
						expect(count).toBeGreaterThan(0);
						expect(count).toBeLessThan(6);
					});
				});

				xit("should open the 'All Views' model", function(){
					expect(element(by.css('div.modal')).isPresent()).toBeFalsy();
					specs.recentViewsDropDown.click();
					specs.allViewsButton.click();
					expect(element(by.css('div.modal')).isPresent()).toBeTruthy();
					specs.recentViews.count().then(function(count){
						expect(count).toBeGreaterThan(0);
					});
				});

				xit("should change the view from the 'all views' modal", function(){
					var currentViewName, selectedIndex = null, newViewName;
					specs.viewName.getText().then(function(name){
						currentViewName = name;
						specs.recentViewsDropDown.click();
						specs.allViewsButton.click();
						specs.recentViewsModal.each(function(el, index){
							el.getText().then(function(text){
								if(text){
									console.info(text);
									el.element(by.css(".item-name")).getText().then(function(title){
										if (title !== currentViewName && selectedIndex === null){
											selectedIndex = index;
											newViewName = title;
											console.info(newViewName);
										}
									});
								}
							});
						}).then(function(){
							specs.recentViewsModal.get(selectedIndex).click();
							element(by.css('div.modal .ms-btn-submit')).click();
							browser.sleep(1000);
							specs.viewName.getText().then(function(name){
								expect(name).toEqual(newViewName)
							});
						})
					});
				});

				xit("should save a default view if the view is changed and not saved", function(){
					var currentViewName, newViewName;
					specs.viewName.getText().then(function(name){
						currentViewName = name;
						newViewName = specs.draftRegEx.test(currentViewName) ? currentViewName : specs.draftText + currentViewName
						specs.draggableDimensions.get(0).element(by.css(".action-icon")).click();
						browser.waitForAngular();
						specs.viewName.getText().then(function(name){
							expect(name).toEqual(newViewName);
							browser.get(scenarioUrl);
							specs.viewName.getText().then(function(name){
								expect(name).toEqual(newViewName);
							})
						});

					});
				});

				xit("should revert a draft view", function(){
					var currentViewName, newViewName;
					specs.viewName.getText().then(function(name){
						currentViewName = name;
						if (specs.draftRegEx.test(currentViewName)) {
							newViewName = currentViewName.replace(specs.draftText, "");
							specs.viewDropDown.click();
							specs.viewRevertButton.click();
							browser.waitForAngular();
							specs.viewName.getText().then(function(name){
								expect(name).toEqual(newViewName);
							})
						} else {
							console.info("view not in draft mode");
							funcs.addDimension(
								function(index){
									specs.dimensions.get(index).click();
									browser.waitForAngular();

									specs.viewName.getText().then(function(name){
										console.info("now we are in draft mode");
										expect(name).toEqual(specs.draftText + currentViewName)
									})
									
									specs.viewDropDown.click();
									specs.viewRevertButton.click();
									browser.waitForAngular();

									specs.viewName.getText().then(function(name){
										console.info("now we are NOT in draft mode");
										expect(name).toEqual(currentViewName)
									})
								}
							);
						}
					});
				});

				xit("should open the save as view inline field", function(){
					expect(funcs.hasClass(specs.saveAsBox, "ng-hide")).toBeTruthy();
					specs.viewDropDown.click();
					specs.viewSaveAsButton.click();
					expect(funcs.hasClass(specs.saveAsBox, "ng-hide")).toBeFalsy();
				});

				xit("should save as view with a new name", function(){
					specs.viewDropDown.click();
					specs.viewSaveAsButton.click();
					specs.saveAsNameField.clear();
					specs.saveAsNameField.sendKeys(specs.newViewName);
					specs.saveAsSubmitButton.click();
					browser.waitForAngular();
					specs.recentViewsDropDown.click();
					specs.recentViews.get(0).getText().then(function(view){
						expect(view).toEqual(specs.newViewName)
					});
				});

				xit("should rename a view", function(){
					var currentViewName, newViewName = "My New View " + Date.now();
					specs.viewName.getText().then(function(name){
						currentViewName = name;
						specs.viewDropDown.click();
						specs.viewRenameButton.click();
						specs.saveAsNameField.clear();
						specs.saveAsNameField.sendKeys(newViewName);
						specs.saveAsSubmitButton.click();
						specs.viewName.getText().then(function(name){
							expect(name).toEqual(newViewName);
							browser.get(scenarioUrl);
							specs.viewName.getText().then(function(name){
								expect(name).toEqual(newViewName);
							})
						})
					});
				});

				xit("should respect name limitations", function(){
					specs.viewDropDown.click();
					specs.viewSaveAsButton.click();

					funcs.testInputRestrictions(specs.saveAsNameField, specs.saveAsSubmitButton);
				});

				xit("should respect name length limitations", function(){
					specs.viewDropDown.click();
					specs.viewSaveAsButton.click();

					funcs.testMinAndMaxNameLength(specs.saveAsNameField, specs.saveAsSubmitButton);
				});
			});

			describe("dimensions", function(){
				xit("should toggle between filter and dimension view", function(){
					expect(funcs.hasClass(specs.toggleTable, "selected")).toBeTruthy();
					expect(funcs.hasClass(specs.toggleFilters, "selected")).toBeFalsy();
					expect(funcs.hasClass(specs.dimensionsArea, 'ng-hide')).toBeFalsy();
					expect(funcs.hasClass(specs.filterArea, 'ng-hide')).toBeTruthy();
					specs.toggleFilters.click();
					expect(funcs.hasClass(specs.toggleTable, "selected")).toBeFalsy();
					expect(funcs.hasClass(specs.toggleFilters, "selected")).toBeTruthy();
					expect(funcs.hasClass(specs.dimensionsArea, 'ng-hide')).toBeTruthy();
					expect(funcs.hasClass(specs.filterArea, 'ng-hide')).toBeFalsy();
					specs.toggleTable.click();
					expect(funcs.hasClass(specs.toggleTable, "selected")).toBeTruthy();
					expect(funcs.hasClass(specs.toggleFilters, "selected")).toBeFalsy();
					expect(funcs.hasClass(specs.dimensionsArea, 'ng-hide')).toBeFalsy();
					expect(funcs.hasClass(specs.filterArea, 'ng-hide')).toBeTruthy();
				});

				xit("should add a column", function(){
					var currentCount;
					specs.columnDimensions.count().then(function(count){
						currentCount = count;

						specs.addColumnDimensionsButton.click();
						funcs.addDimension(function(dimension){
							dimension.click();
							browser.waitForAngular();
							specs.columnDimensions.count().then(function(newCount){
								expect(newCount).toEqual(currentCount + 1);
							});
						});

					});
				});

				xit("should remove a column", function(){
					var currentCount;
					specs.columnDimensions.count().then(function(count){
						currentCount = count;
						specs.columnDimensions.get(count - 1).element(by.css(".action-icon")).click();
						specs.columnDimensions.count().then(function(count){
							expect(count).toEqual(currentCount - 1);
						});
					});
				});

				// I can't get this to work
				// xit("should drag", function(){
				// 	//browser.driver.actions().dragAndDrop(specs.columnDimensions.get(1), specs.copyAndReplaceCube).perform();
				// 	browser.actions()
				// 	.mouseMove(specs.columnDimensions.get(1).element(by.css('.drag-handle')), {x:400, y:400})
				// 	.mouseDown()
				// 	.mouseMove(specs.rowDimensions.get(0).getWebElement(), {x:400, y:400})
				// 	.mouseUp()
				// 	//.mouseMove(specs.rowDimensions.get(0).element(by.css('.drag-handle')), )
				// 	//.mouseUp().
				// 	///.dragAndDrop(specs.rowDimensions.get(0).getWebElement(), {x:400, y:400})
				// 	.perform();
				// 	browser.pause();
				// });

				xit("should add a row", function(){
					var currentCount;
					specs.rowDimensions.count().then(function(count){
						currentCount = count;

						specs.addRowDimensionsButton.click();
						funcs.addDimension(function(dimension){
							dimension.click();
							browser.waitForAngular();
							specs.rowDimensions.count().then(function(newCount){
								expect(newCount).toEqual(currentCount + 1);
							});
						});

					});
				});

				xit("should remove a row", function(){
					var currentCount;
					specs.rowDimensions.count().then(function(count){
						currentCount = count;
						specs.rowDimensions.get(count - 1).element(by.css(".action-icon")).click();
						specs.rowDimensions.count().then(function(count){
							expect(count).toEqual(currentCount - 1);
						});
					});
				});

				xit("should redefine a dimension", function(){
					specs.rowDimensions.count().then(function(count){
						if (count){
							var currentIndex = count - 1;
							specs.rowDimensions.get(currentIndex).getText().then(function(oldlabel){
								specs.rowDimensions.get(currentIndex).click();
								funcs.addDimension(function(dimension){
									dimension.getText().then(function(targetlabel){
										dimension.click();
										browser.waitForAngular();
										specs.rowDimensions.get(currentIndex).getText().then(function(newlabel){
											expect(newlabel).toEqual(targetlabel);
										})
									});
								});
							});
						};
					});
				});
			});

			describe("filters", function(){
				var filterCount;

				xit("should have filter dimensions", function(){
					specs.toggleFilters.click();

					specs.filters.count().then(function(count){
						filterCount = count;
						console.info("filterCount is " + filterCount);
						expect(count).toBeGreaterThan(0);
					});
				});

				xit("should open the add filters modal", function(){
					funcs.openFiltersModal();

					expect(element(by.css(specs.filterModal)).isPresent()).toBe(true);
				});

				describe("modal", function(){
					xit("should have all dimensions in the side menu", function(){
						funcs.openFiltersModal();

						specs.filterSideMenu.count().then(function(count){
							expect(count).toEqual(filterCount);
						});
					});

					xit("should highlight the first dimension in the side menu", function(){
						funcs.openFiltersModal();
						var activeSelection = specs.filterSideMenu.get(0);
						expect(funcs.hasClass(activeSelection, "active")).toBeTruthy();
					});

					xit("should change the dimension displayed when the side menu item is clicked", function(){
						var currentSelection, lastSelection;

						funcs.openFiltersModal();
						specs.filterSideMenu.each(function(menuItem, index){
							menuItem.click();
							expect(funcs.hasClass(menuItem, "active")).toBeTruthy();

							specs.filterlevelDropdown.getText().then(function(selection){
								lastSelection = index ? currentSelection : null;
								currentSelection = selection;
								if (lastSelection){
									expect(lastSelection).not.toBe(currentSelection);
								};
							});
						});
					});

					xit("should change the data when the member is changed", function(){
						funcs.openFiltersModal();
						specs.filterSideMenu.each(function(menuItem){
							menuItem.click();
							specs.filterlevelDropdown.click();

							specs.filterLevelList.count().then(function(count){
								var currentSelection, lastSelection;
								if(count > 1){
									specs.filterLevelList.each(function(item, index){
										item.click();
										element(by.css(".list-box")).getText().then(function(text){
											lastSelection = index ? currentSelection : null;
											currentSelection = text;
											if (lastSelection){
												expect(lastSelection).not.toBe(currentSelection);
											};
											specs.filterlevelDropdown.click();
										});
									});
								}
							});
						});
					});

					xit("should search the filter list", function(){
						var total;
						funcs.openFiltersModal();

						specs.filterSelectionList.count().then(function(count){
							total = count;
							expect(total).toBeGreaterThan(0);
							specs.filterSelectionList.get(0).element(by.binding("member.label")).getText().then(function(text){
								specs.filterSeachField.sendKeys(text);
								specs.filterSelectionList.count().then(function(count){
									expect(count).toEqual(1);
									specs.filterSeachField.clear();
									specs.filterSeachField.sendKeys(" ");
									specs.filterSelectionList.count().then(function(ncount){
										expect(ncount).toEqual(total);
									})
								});
							});
						});
					});

					xit("should toggle open and close the member", function(){
						funcs.openFiltersModal();
						specs.filterSelectionList.each(function(selected, index){

							var handle = selected.element(by.css(".expand-handle")),
								content = element.all(by.css(".list-category")).get(index);

							handle.isDisplayed().then(function(isPresent){
								selected.getText().then(function(name){
									console.info(name);
									if (isPresent){
										content.getText().then(function(text){
											expect(text).toBeFalsy();
										})
										expect(funcs.hasClass(content, "collapsed")).toBeTruthy();
										handle.click();
										expect(funcs.hasClass(content, "collapsed")).toBeFalsy();
										content.getText().then(function(text){
											expect(text).toBeTruthy();
										});
										handle.click();
										expect(funcs.hasClass(content, "collapsed")).toBeTruthy();
										content.getText().then(function(text){
											expect(text).toBeFalsy();
										})
									} else {
										console.info("has NO handle");
									}
								});
							});							
						})
					});

					xit("should display the correct selection icon", function(){
						var isSelected;
						funcs.openFiltersModal();
						specs.filterSelectionList.get(0).then(function(selected){
							var selectedItem = selected.element(by.css("label i"));

							funcs.hasClass(selectedItem, "fa-check-square").then(function(hasClass){
								console.info("the class is " + hasClass);
								isSelected = hasClass;

								if(!isSelected){
									funcs.hasClass(selectedItem, "fa-square-o").then(function(hasClass){
										expect(hasClass).toBeTruthy();
									})
								};

								selectedItem.click();

								funcs.hasClass(selectedItem, "fa-check-square").then(function(hasClass){
									console.info("the class is " + hasClass);
									expect(hasClass).not.toBe(isSelected);

									if(!hasClass){
										funcs.hasClass(selectedItem, "fa-square-o").then(function(hasClass){
											expect(hasClass).toBeTruthy();
										})
									};

									selectedItem.click();

									funcs.hasClass(selectedItem, "fa-check-square").then(function(hasClass){
										console.info("the class is " + hasClass);
										isSelected = hasClass;

										if(!isSelected){
											funcs.hasClass(selectedItem, "fa-square-o").then(function(hasClass){
												expect(hasClass).toBeTruthy();
											})
										};
									});
								});
							});
						});
					});

					xit("should show the correct selection count", function(){});
				});
			});
		});
	});
}