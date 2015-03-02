"use strict";

var specs = require('./3.0-scenario_specs.js'),
	funcs = require('./0.0-functions.js'),
	_ = require('underscore'),
	projectInfo,
	resultsUrl,
	projectId;

if(!browser.params.test || browser.params.test === 32){

	describe("executing results tests", function(){
		console.info("executing results tests");
		it("should set up the tests", function(){
			console.info("results page tests");
			projectInfo = funcs.readProjectInfo();
			resultsUrl = projectInfo.results.url;
			projectId = projectInfo.project.id;
		});
	});

	describe("results", function(){

		beforeEach(
			function(){
				browser.driver.manage().window().setSize(1280, 1024);
				browser.get(resultsUrl);
			}
		);
		
		it("should have an enabled editor button", function(){
			expect(funcs.hasClass(specs.editButton, "disabled")).toBeFalsy();
		})

		it("should have an disabled simulate button", function(){
			expect(funcs.hasClass(specs.simulateButton, "disabled")).toBeTruthy();
		})
	});
}