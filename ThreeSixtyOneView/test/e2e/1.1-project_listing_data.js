"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	_ = require ("underscore"),
	projectInfo = {};

if(!browser.params.tests || browser.params.tests === 11){


	describe("executing listing tests", function(){
		console.info("executing listing DATA tests");
		it("should set up the tests", function(){
			console.info("Project Listing DATA Tests:");
		});

	})

	describe('Project Listing Page Data : ', function() {
		beforeEach(
			function(){
				browser.driver.manage().window().setSize(1280, 1024);
				browser.get(funcs.getProjectUrl());
			}
		);

		it("should have the correct number of projects", function(done){
			funcs.getRawData_projects().then(function(data){
				done();
				funcs.getItems().count().then(function(count){
					expect(count).toBe(data.length);
				});
			});
		});

		it("should have the correct projects", function(done){
			var index = 0;
			funcs.getRawData_projects().then(function(data){
				done();
				funcs.getAllItemTitles().getText().then(function(titles){
					_.each(titles, function(title, i, a){
						console.info(i + " " + title);
						//console.info(i + " " + data[i].name);
					})
				});
			});
		});

		// it("should have the correct number of projects", function(done){
		// 	funcs.getRawData_projects().then(function(data){
		// 		done();
		// 		funcs.getItems().count().then(function(count){
		// 			expect(count).toBe(data.length + 1);
		// 		});
		// 	});
		// });

		// it("should have the correct number of projects", function(done){
		// 	funcs.getRawData_projects().then(function(data){
		// 		done();
		// 		funcs.getItems().count().then(function(count){
		// 			expect(count).toBe(data.length + 1);
		// 		});
		// 	});
		// });

	});
}
