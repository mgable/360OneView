"use strict";

var specs = require('./3.1-scenario_calculate_specs.js'),
	funcs = require('./3.0-scenario_functions.js'),
	_ = require('underscore'),
	projectInfo,
	dashboardUrl,
	scenarioUrl,
	calculateUrl,
	projectId,
	scenarioId,
	testName = {title: "Caclulate", id: 31};

if(funcs.runTheseTests(testName)){

	describe("executing " + testName.title, function(){
		console.info("executing " + testName.title);
		it("should set up the tests", function(){
			console.info(testName.title + " Tests: ");
			projectInfo = funcs.readProjectInfo();
			projectId = projectInfo.project.id;
			scenarioId = projectInfo.scenario.id;
			scenarioUrl = funcs.getScenarioUrl(projectId,scenarioId);
			dashboardUrl = funcs.getDashboardUrl(projectId);
			calculateUrl = funcs.getCalculateUrl(projectId,scenarioId);
		});
	})

	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
		}
	);

	describe("calculations Page:", function(){
		var calculatingScenario, currentStatus = null;

		it("should find the scenario in the items list", function(){
			browser.get(dashboardUrl);
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
			browser.get(scenarioUrl);
			specs.simulateButton.click();
			browser.waitForAngular();
			browser.getLocationAbsUrl().then(function(url){
				expect(url).toContain("/calculate");
				_.extend(projectInfo,  {"calculate": {"url": url}});
				funcs.saveProjectInfo(projectInfo);
			});
		});

		// xit("should set the calculation states correctly", function(){
		// 	console.info("should set the calculation states correctly");
		// 	browser.get(calculateUrl);

		// 	specs.states.each(function(state){
		// 		state.getText().then(console.info)
		// 		browser.wait(function(){
		// 			var deferred = protractor.promise.defer();
		// 			deferred.fulfill(funcs.hasClass(state, "completed"));
		// 			return deferred.promise;
		// 		});
		// 		expect(funcs.hasClass(state, "completed")).toBe(true);
		// 	});

		// 	browser.getLocationAbsUrl().then(function(url){
		// 		expect(url).toContain("/results");
		// 		_.extend(projectInfo, {"results": {"url": url}});
		// 		funcs.saveProjectInfo(projectInfo);
		// 	});
		// });	

		it("should set the scenarios status to 'in process'", function(){
			browser.get(dashboardUrl);
			var status = calculatingScenario.element(by.css(specs.statusClass));
			expect(funcs.hasClass(status, specs.inProgressClass)).toBe(true);
		});

		it("should click through to the calculate page when the scenario is 'in progress'", function(){
			browser.get(dashboardUrl);
			var calculatingScenarioButton = calculatingScenario.element(by.css(specs.titleClass));
			calculatingScenarioButton.click();
			browser.waitForAngular();
			setTimeout(function(){
				browser.getLocationAbsUrl().then(function(url){
					expect(url).toContain("/calculate")
				});
			}, 2000);
		});

		it("should disabled the 'simulate' button when a scenario is 'in progress'", function(){
			browser.get(calculateUrl);
			expect(funcs.hasClass(specs.simulateButton, 'disabled')).toBeTruthy();
		});

		it("should disbaled the 'editor' button when a scenario is 'in progress'", function(){
			browser.get(calculateUrl);
			expect(funcs.hasClass(specs.editButton, 'disabled')).toBeTruthy();
		});

		// xit("should enabled the results button for a calculated scenario", function(){});

		// xit("should redirect to the results page when finished", function(){
		// 	var status = specs.status;
		// 	browser.get(calculateUrl);
		// 	browser.wait(function(){
		// 		var deferred = protractor.promise.defer();
		// 		browser.getLocationAbsUrl().then(function(url){
		// 			var failed = false;
		// 			status.getText().then(function(text){
		// 				if (/Failed/.test(text)){
		// 					failed = true;
		// 				}
						
		// 				deferred.fulfill(url !== projectInfo.calculate.url || failed);
		// 			});
		// 		});

		// 		return deferred.promise;
		// 	});
			
		// 	browser.getLocationAbsUrl().then(function(url){
		// 		if (url === projectInfo.calculate.url){
		// 			status.getText().then(function(text){
		// 				if (/Failed/.test(text)){
		// 					console.info("calculation failed");
		// 					currentStatus = "failed";
		// 					browser.get(projectInfo.project.url);
		// 					var status = calculatingScenario.element(by.css(specs.statusClass));
		// 					expect(funcs.hasClass(status, specs.failedClass)).toBe(true);
		// 				}
		// 			})
		// 		} else {
		// 			expect(url).toContain("/calculate")
		// 		}
		// 	});
		// });

		// xit("should display the action buttons on calculation failure", function(){
		// 	if( currentStatus === "failed"){
		// 		browser.get(calculateUrl);
		// 		expect(element(by.css('.btn-calculate')).isPresent()).toBeTruthy();
		// 		expect(funcs.hasClass(specs.simulateButton, "disabled")).toBeTruthy();
		// 		expect(funcs.hasClass(specs.editButton, "disabled")).toBeTruthy();
		// 		expect(specs.failureMessage.isPresent()).toBeTruthy();
		// 	} else {
		// 		console.info("calulation success - skipping failure tests");
		// 	}
		// });
	});
}