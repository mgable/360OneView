"use strict";

var specs = require('./3.0-scenario_specs.js'),
	funcs = require('./3.0-scenario_functions.js'),
	_ = require('underscore'),
	projectInfo,
	scenarioUrl,
	projectId,
	scenarioId,
	analysisElementFileName = "My New Analysis Element File " + Date.now(),
	analysisElementFileDescription = "My New Description",
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

		xdescribe("Current working scenario", function(){
			it("should read the correct scenario from the file system", function(){
				browser.getLocationAbsUrl().then(function(url){
					expect(url).toContain(projectInfo.scenario.url);
				});
			});
		});

		xdescribe("initial state of navigation buttons", function(){
			it("should have the edit button enabled", function(){
				expect(funcs.hasClass(specs.editButton, 'disabled')).toBe(false);
			});
			it("should have the results button disabled", function(){
				expect(funcs.hasClass(specs.resultsButton, 'disabled')).toBe(true);
			});
			it("should have the simulate button enabled", function(){
				expect(funcs.hasClass(specs.simulateButton, 'disabled')).toBe(false);
			});
		});

		xdescribe("analysis element toolbar", function(){
			it("should have analysis elements", function(){
				expect(specs.cubes.count()).toBeGreaterThan(0);
			});


			it("should have 'marketing plan' selected", function(){
				specs.selectedAnalysisElement.getText().then(function(selected){
					expect(selected).toBe(specs.assumedData.defaultSelectedAnalysisElement);
				});
			});

			it("should allow the user to select a new cube", function(){
				specs.cubes.each(function(element){
					specs.selectedAnalysisElement.click();
					element.click();
					specs.selectedAnalysisElement.getText().then(function(selected){
						expect(selected).toBeTruthy();
					});
				});
			});

			it("should not allow the analysis element to be replaced or copied on the Marketing Plan", function(){
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

			it("should have a default analysis element file", function(){
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
					specs.selectedAnalysisElement.click();
					element.click();
					specs.selectedAnalysisElement.getText().then(function(text){
						if(!done && text.toLowerCase() !== "marketing plan"){
							done = true;

							specs.copyButton.click();
							expect(specs.submitButton.getAttribute("disabled")).toBeTruthy();
							specs.copyAndReplaceNameField.clear();
							specs.copyAndReplaceNameField.sendKeys(analysisElementFileName);
							expect(specs.submitButton.getAttribute("disabled")).toBeTruthy();
							specs.copyAndReplaceDescriptionField.sendKeys(analysisElementFileDescription);
							browser.waitForAngular();
							expect(specs.submitButton.getAttribute("disabled")).toBeFalsy();
							specs.submitButton.click();
							specs.copyAndReplaceCubeName.getText().then(function(fileName){
								expect(fileName).toEqual(analysisElementFileName);
							});

						}
					});
				});
			});

			it("should replace the analysis element file", function(){
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

			it("should not allow the analysis element to be replaced or copied on the Marketing Plan", function(){
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

			it("should allow the analysis element to be replaced or copied for all others", function(){
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

		xdescribe("editor tabs", function(){
			it("should have three tabs", function(){
				expect(specs.editorTabs.count()).toBe(3);
			});

			it("should toggle expand and collapse when tab is clicked", function(){
				funcs.hasClass(specs.pivotBuilderTab, "hidden").then(function(state){
					specs.editorTabs.get(0).click();
					expect(funcs.hasClass(specs.pivotBuilderTab, "hidden")).toBe(!state)
					specs.editorTabs.get(0).click();
					expect(funcs.hasClass(specs.pivotBuilderTab, "hidden")).toBe(state)
				});
				
			});
		});

		describe("scenario editor", function(){

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

				it("should save a view", function(){});

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

				it("should change the view from the 'all views' modal", function(){
					var currentViewName, selectedIndex = null, newViewName
					specs.viewName.getText().then(function(name){
						currentViewName = name;
						specs.recentViewsDropDown.click();
						specs.allViewsButton.click();
						specs.recentViews.each(function(el, index){
							el.getText().then(function(text){
								if(text){
									el.element(by.css(".item-name")).getText().then(function(title){
										if (title !== currentViewName && selectedIndex === null){
											selectedIndex = index;
											newViewName = title;
										}
									});
								}
							});
						}).then(function(){
							specs.recentViews.get(selectedIndex).click();
							element(by.css('div.modal .ms-btn-submit')).click();
							browser.waitForAngular();
							specs.viewName.getText().then(function(name){
								expect(name).toEqual(newViewName)
							});
						})
					});
				});

				it("should rename a view", function(){});

				xit("should save a default view if the view is changed and not saved", function(){
					var currentViewName, newViewName;
					specs.viewName.getText().then(function(name){
						currentViewName = name;
						newViewName = /^Draft - /.test(currentViewName) ? currentViewName : "Draft - " + currentViewName
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
						if ( /^Draft - /.test(currentViewName)) {
							newViewName = currentViewName.replace("Draft - ", "");
							specs.viewDropDown.click();
							specs.viewRevertButton.click();
							browser.waitForAngular();
							specs.viewName.getText().then(function(name){
								expect(name).toEqual(newViewName);
							})
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

		});
	});
}