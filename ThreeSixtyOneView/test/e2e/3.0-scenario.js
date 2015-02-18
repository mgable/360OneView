"use strict";

var specs = require('./3.0-scenario_specs.js'),
	funcs = require('./0.1-project_functions.js'),
	_ = require('underscore'),
	scenario = funcs.readProjectInfo();

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

	describe("should have an analysis element dropdown menu", function(){
		xit("should have thirteen analysis elements", function(){
			expect(specs.analysisElements.count()).toBe(13);
		});

		xit("should have 'marketing plan' selected", function(){
			specs.selectedAnalysisElement.getText().then(function(selected){
				expect(selected).toBe("Marketing Plan");
			});
		});

		xit("should allow the user to select a new analysis element", function(){
			specs.selectedAnalysisElement.click();
			specs.analysisElements.last().click();
			specs.selectedAnalysisElement.getText().then(function(selected){
				expect(selected).toBe("Web Traffic");

				specs.selectedAnalysisElement.click();
				specs.analysisElements.get(2).click();
				specs.selectedAnalysisElement.getText().then(function(selected){
					expect(selected).toBe("Competitive Intent");
				});

			});
		});

		xit("should not allow the analysis element to be replaced or copied on the Marketing Plan", function(){
			expect(funcs.hasClass(specs.copyAndReplaceCube, "ng-hide")).toBeTruthy();
		});

		it("should allow the analysis element to be replaced or copied for all others", function(){
			specs.analysisElements.each(function(element){
			//for (var i = 0, limit = 13; i < limit; i++){
				specs.selectedAnalysisElement.click();
				element.click();
				//specs.analysisElements.get(i).click();
				specs.selectedAnalysisElement.getText().then(function(selected){
					console.info(selected);
				});
			//}
			});
		});
	});
});