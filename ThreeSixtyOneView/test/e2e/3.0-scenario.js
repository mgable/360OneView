"use strict";

var specs = require('./3.0-scenario_specs.js'),
	funcs = require('./3.0-scenario_functions.js'),
	_ = require('underscore'),
	scenario = funcs.readProjectInfo();

var customMatchers = {
		arrayElementContains:  function(expected){

	        var self = this, regEx = new RegExp(expected), deferred = protractor.promise.defer(), result = false;

			_.each(self.actual, function(key){
				if (regEx.test(key)){
					result = true;
				}
			});

			if (result) {
	      		deferred.fulfill(true);
	    	} else {
	      		deferred.reject(self.actual + ' did not contain ' + expected);
	    	}
	        return deferred.promise;
	    }
	},
	analysisElementFileName = "My New Analysis Element File " + Date.now(),
	analysisElementFileDescription = "My New Description";


beforeEach(function(){
    this.addMatchers(customMatchers);
});

describe('Scenario Page: ', function() {
	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
			browser.get(scenario.url);
		}
	);

	xdescribe("Current working scenario", function(){
		it("should read the correct scenario from the file system", function(){
			browser.getLocationAbsUrl().then(function(url){
				expect(url).toEqual(scenario.url);
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

	describe("should have an analysis element toolbar", function(){
		it("should have thirteen analysis elements", function(){
			expect(specs.analysisElements.count()).toBe(specs.assumedData.cubes.length);
		});

		it("should have 'marketing plan' selected", function(){
			specs.selectedAnalysisElement.getText().then(function(selected){
				expect(selected).toBe(specs.assumedData.defaultSelectedAnalysisElement);
			});
		});

		it("should allow the user to select a new cube", function(){
			var index = 0;
			specs.analysisElements.each(function(element){
				specs.selectedAnalysisElement.click();
				element.click();
				specs.selectedAnalysisElement.getText().then(function(selected){
					expect(selected).toEqual(specs.assumedData.cubes[index++]);
				});
			});
		});

		it("should not allow the analysis element to be replaced or copied on the Marketing Plan", function(){
			expect(funcs.hasClass(specs.copyAndReplaceCube, "ng-hide")).toBeTruthy();
		});

		it("should allow the analysis element to be replaced or copied for all others", function(){
			var index = 0;
			specs.analysisElements.each(function(element){
				specs.selectedAnalysisElement.click();
				element.click();
				if (index > 0) {
					expect(funcs.hasClass(specs.copyAndReplaceCube, "ng-hide")).toBeFalsy();
				}
				index++;
			});
		});

		it("should have a default analysis element file", function(){
			var index = 0;
			specs.analysisElements.each(function(element){
				specs.selectedAnalysisElement.click();
				element.click();
				if (index > 0) {
					specs.replaceButton.click();
					expect(specs.analysisElementFileList.count()).toBeGreaterThan(0);
					specs.analysisElementFileList.getText().then(function(fileList){
						expect(fileList).arrayElementContains(specs.assumedData.preloadedAnalysisElement);
						specs.replaceCancelButton.click();
					});
					
				}
				browser.waitForAngular();
				index++;
			});
		});

		it("should copy and replace the analysis element file", function(){
			funcs.selectSecondCube();
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
		});

		it("should replace the analysis element file", function(){
			var file;
			specs.selectedAnalysisElement.click();
			specs.analysisElements.get(1).click();
			specs.replaceButton.click();
			specs.analysisElementFileList.last().element(by.css('.list-box .item-name')).getText().then(function(fileName){
				file = fileName;
				specs.analysisElementFileList.last().click();
				specs.replaceSubmitButton.click();
				browser.waitForAngular();
				specs.copyAndReplaceCubeName.getText().then(function(fileName){
					expect(fileName).toEqual(file);
				});

				specs.selectedAnalysisElement.click();
				specs.analysisElements.get(1).click();
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
			})
		});
	});
});