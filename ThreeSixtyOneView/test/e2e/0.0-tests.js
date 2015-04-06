"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	projectInfo = {},
	testName = {title: "tests", id: "test"},
	projectId;

if(funcs.runTheseTests(testName)){

	describe("executing " + testName.title, function(){
		console.info("executing " + testName.title);
		it("should set up the tests", function(){
			console.info(testName.title + " Tests: ");
			expect(true).toBe(true);
			//expect(true).toBe(false);
		});

	});
};

