"use strict";

var specs = require('./3.0-scenario_specs.js'),
	funcs = require('./0.0-functions.js'),
	_ = require('underscore'),
	projectInfo = funcs.readProjectInfo();

xdescribe("results", function(){

	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
			browser.get(projectInfo.results.url);
		}
	);
	
	it("should have an enabled editor button", function(){
		expect(funcs.hasClass(specs.editButton, "disabled")).toBeFalsy();
	})

	it("should have an disabled simulate button", function(){
		expect(funcs.hasClass(specs.simulateButton, "disabled")).toBeTruthy();
	})
});