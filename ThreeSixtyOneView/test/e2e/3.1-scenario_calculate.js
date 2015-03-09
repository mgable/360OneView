"use strict";

var specs = require('./3.1-scenario_calculate_specs.js'),
	funcs = require('./1.0-project_listing_functions.js'),
	_ = require('underscore'),
	projectInfo,
	scenarioUrl,
	projectId;

if(!browser.params.tests || browser.params.test === 31){

	xdescribe("executing calculate tests", function(){
		console.info("executing calculate tests");
		it("should set up the tests", function(){
			console.info("results page tests:");
			projectInfo = funcs.readProjectInfo();
			scenarioUrl = projectInfo.scenario.url;
			projectId = projectInfo.project.id;
		});
	})

	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
		}
	);

	xdescribe("calculations Page:", function(){
		var calculatingScenario, currentStatus = null;

		it("should find the scenario in the items list", function(){
			browser.get(projectInfo.project.url);
			var items = funcs.getItems();
			items.each(function(item){
				item.element(by.css(specs.titleClass)).getText().then(function(title){
					if (title.trim() === projectInfo.scenario.title.trim()){
						calculatingScenario = item;
					}
				})
			});
		});

		it("should calculate a scenario", function(){
			browser.get(projectInfo.scenario.url);
			specs.simulateButton.click();
			browser.waitForAngular();
			browser.getLocationAbsUrl().then(function(url){
				expect(url).toContain("/calculate");
				_.extend(projectInfo,  {"calculate": {"url": url}});
				funcs.saveProjectInfo();
			});
		});


		it("should set the calculation states correctly", function(){
			console.info("should set the calculation states correctly");
			browser.get(projectInfo.calculate.url);

			specs.states.each(function(state){
				state.getText().then(console.info)
				browser.wait(function(){
					var deferred = protractor.promise.defer();
					deferred.fulfill(funcs.hasClass(state, "completed"));
					return deferred.promise;
				});
				expect(funcs.hasClass(state, "completed")).toBe(true);
			});

			browser.getLocationAbsUrl().then(function(url){
				expect(url).toContain("/results");
				_.extend(projectInfo, {"results": {"url": url}});
				funcs.saveProjectInfo(projectInfo);
			});
		});	

		it("should set the scenarios status to 'in process'", function(){
			browser.get(projectInfo.project.url);
			var status = calculatingScenario.element(by.css(specs.statusClass));
			expect(funcs.hasClass(status, specs.inProgressClass)).toBe(true);
		});

		it("should click through to the calculate page when the scenario is 'in progress'", function(){
			browser.get(projectInfo.project.url);
			var calculatingScenarioButton = calculatingScenario.element(by.css(specs.titleClass));
			calculatingScenarioButton.click();
			browser.waitForAngular();
			setTimeout(function(){
				browser.getLocationAbsUrl().then(function(url){
					funcs.saveProjectInfo(projectInfo);
				});
			}, 2000);
		});

		it("should disabled the 'simulate' button when a scenario is 'in progress'", function(){
			browser.get(projectInfo.calculate.url);
			expect(funcs.hasClass(specs.simulateButton, 'disabled')).toBeTruthy();
		});

		it("should enabled the results button for a calculated scenario", function(){});

		it("should redirect to the results page when finished", function(){
			var status = specs.status;
			browser.get(projectInfo.calculate.url);
			browser.wait(function(){
				var deferred = protractor.promise.defer();
				browser.getLocationAbsUrl().then(function(url){
					var failed = false;
					status.getText().then(function(text){
						if (/Failed/.test(text)){
							failed = true;
						}
						
						deferred.fulfill(url !== projectInfo.calculate.url || failed);
					});
				});

				return deferred.promise;
			});
			
			browser.getLocationAbsUrl().then(function(url){
				if (url === projectInfo.calculate.url){
					status.getText().then(function(text){
						if (/Failed/.test(text)){
							console.info("calculation failed");
							currentStatus = "failed";
							browser.get(projectInfo.project.url);
							var status = calculatingScenario.element(by.css(specs.statusClass));
							expect(funcs.hasClass(status, specs.failedClass)).toBe(true);
						}
					})
				} else {
					expect(url).toContain("/calculate")
				}
			});
		});

		it("should display the action buttons on calculation failure", function(){
			if( currentStatus === "failed"){
				browser.get(projectInfo.calculate.url);
				expect(element(by.css('.btn-calculate')).isPresent()).toBeTruthy();
				expect(funcs.hasClass(specs.simulateButton, "disabled")).toBeTruthy();
				expect(funcs.hasClass(specs.editButton, "disabled")).toBeTruthy();
				expect(specs.failureMessage.isPresent()).toBeTruthy();
			} else {
				console.info("calulation success - skipping failure tests");
			}
		});

		// it("should wait forever", function(){
		// 	browser.get(projectInfo.calculate.url);
		// 	browser.wait(function(){
		// 		var deferred = protractor.promise.defer();
		// 		deferred.fulfill(false);
		// 		return deferred.promise;
		// 	})
		// });
	});
}