"use strict";

var specs = require('./0.0-specs.js'),
	_ = require('underscore'),
	fs = require('fs'),
	projectFileName = "./test/e2e/project.json",
	projectsFileName = "./test/e2e/projects.json",
	cacheFileName = "./test/e2e/cache.json",
	http = require('http'),
	cache = {}, 
	prepTestArray = function(){
		if(typeof browser.params.tests === "number"){
			return browser.params.tests.toString(10);
		}
		return browser.params.tests;
	},
	testsArray = prepTestArray(browser.params.tests).split(/\b/),
	
	data = {
		runTheseTests: function(testObj){
			if (!browser.params.tests || _.find(testObj, function(id){
				  return _.contains(testsArray, id.toString(10));
			}) ){
				return true;
			}
			return false;
		},
		saveProjectInfo: function(obj){
			this.saveInfo(projectFileName, obj)
		},
		saveProjectsInfo:function(obj){
			this.saveInfo(projectsFileName, obj)
		},
		saveCache: function(){
			this.saveInfo(cacheFileName, cache);
		},
		saveInfo: function(fileName, obj){
			var data = JSON.stringify(obj);
			// console.info("writing to " + fileName);
			// console.info(data);
			fs.writeFileSync(fileName, data);
		},
		getCache: function(){
			return this.readInfo(cacheFileName);
		},
		getScenarioUrl: function (uuid) { 
			return specs.scenarios.replace(/:uuid/, uuid);
		},
		getScenarioStatusUrl: function(id){
			return specs.scenarioStatus.replace(/:id/, id);
		},
		getAnalysisElementUrl: function(id){
			return specs.analysisElements.replace(/:id/, id);
		},
		readProjectInfo: function(){
			return this.readInfo(projectFileName);
		},
		readProjectsInfo: function(){
			return this.readInfo(projectsFileName);
		},
		readInfo: function(filename){
			return JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
		},
		sortProjectsByDate: function(data){
			data.sort(function(a,b){
			    var first = new Date(a.auditInfo.lastUpdatedOn),
			        second = new Date(b.auditInfo.lastUpdatedOn);
				return second - first;
			});
			return data;
		},
		get: function(options, type){
			var defer = protractor.promise.defer(),
				callback = function(response) {
				  var str = '';
				  response.on('data', function (chunk) {
				    str += chunk;
				  });

				  response.on('end', function () {
				  	cache[type] = JSON.parse(str);
				    defer.fulfill(cache[type]);

				  });
				};

			if (cache[type]){
				defer.fulfill(cache[type]);
				console.info("getting from cache");
			} else {
				http.request(options, callback).end();
				console.info("getting from source");
			}

			return defer.promise;
		},
		deleteProjectInfo: function(){
			try{
				fs.unlinkSync(projectsFileName);
			}catch(e){console.info(projectsFileName + " does not exist");}
		},
		getRawData_scenarioStatus: function(id){
			var options = {
				host: specs.domain,
				port: specs.port,
				method: "GET",
				path: this.getScenarioStatusUrl(id)
			};

			return this.get(options, id);
		},
		getRawData_scenarios: function(uuid){
			var options = {
					host: specs.domain,
					port: specs.port,
					method: "GET",
					path: this.getScenarioUrl(uuid)
				};

			return this.get(options, uuid);
		},
		getRawData_ProjectsUrl: function(){
			return "http:// " + specs.domain + specs.projects;
		},
		getRawData_projects: function(bustCache){
			var options = {
					host: specs.domain,
					port: specs.port,
					method: "GET",
					path: specs.projects
				};

			return this.get(options, "projects");
				
		},
		getRawData_analysisElements: function(id){
			var options = {
					host: specs.domain,
					port: specs.port,
					method: "GET",
					path: this.getAnalysisElementUrl(id)
				};

			return this.get(options, "scenarioID_" + id);
		},
		testInputRestrictions: function(input, submit){
			_.each(specs.inputRestrictions, function(restrictedCharacter){
				input.clear();
				input.sendKeys(specs.minimumCharacters + restrictedCharacter);
				expect(submit.getAttribute('disabled')).toBeTruthy();
			});
		},
		hasClass: function (element, cls) {
			var className = cls.replace(/^\./, "");
		    return element.getAttribute('class').then(function (classes) {
		        return classes.split(' ').indexOf(className) !== -1;
		    });
		},
		getClass: function(element){
			return element.getAttribute('class').then(function(classes){
				return classes;
			})
		},
		testMinAndMaxNameLength: function(input, submit){
			input.clear();
			input.sendKeys("x");
			expect(submit.isEnabled()).toBe(false);

			input.clear();
			input.sendKeys(specs.minimumCharacters);
			expect(submit.isEnabled()).toBe(true);

			input.clear();
			input.sendKeys(specs.maximumCharacters);
			expect(submit.isEnabled()).toBe(true);

			input.sendKeys("z");
			expect(submit.isEnabled()).toBe(false);

			input.clear();
			input.sendKeys("this is just right");
			expect(submit.isEnabled()).toBe(true);
		},
		hoverAndClick: function(button){
			browser.actions().mouseMove(button).perform();
			button.click();
		},
		getProjectId: function(url){
			return url.match(/\w{32}/)[0];
		},
		getFormatedDate: function(date){
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			  d = new Date(date),
			  curr_month = d.getMonth(),
			  curr_day = d.getDate(),
			  curr_year = d.getFullYear();

			 return months[curr_month] + " " + curr_day + ", " + curr_year;
		}
	};

module.exports = data;