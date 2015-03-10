"use strict";

var specs = require('./0.0-specs.js'),
	_ = require('underscore'),
	fs = require('fs'),
	filename = "./test/e2e/project.json",
	//request = require('request'),
	http = require('http'),
	cache = {}, 
	prepTestArray = function(){
		if(typeof browser.params.tests === "number"){
			console.info("making array");
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
			var data = JSON.stringify(obj);
			fs.writeFileSync(filename, data);
			console.info("writing");
			console.info(data);
		},
		getScenarioUrl: function (uuid) { return specs.scenarios.replace(/:uuid/, uuid)},
		readProjectInfo: function(){
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
				fs.unlinkSync(filename);
			}catch(e){console.info(filename + " does not exist");}
		},
		getRawData_scenarios: function(uuid){
			var options = {
					host: specs.domain,
					port: specs.port,
					method: "GET",
					path: this.getScenarioUrl(uuid)
				};

			return this.get(options, uuid)
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

			return this.get(options, "projects")
				
		},
		testInputRestrictions: function(input, submit){
			_.each(specs.inputRestrictions, function(restrictedCharacter){
				input.clear();
				input.sendKeys(specs.minimumCharacters + restrictedCharacter);
				expect(submit.getAttribute('disabled')).toBeTruthy();
			});
		},
		hasClass: function (element, cls) {
		    return element.getAttribute('class').then(function (classes) {
		        return classes.split(' ').indexOf(cls) !== -1;
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
			console.info("the url is");
			console.info(url);
			return url.match(/\w{32}/)[0];
		}
	};

module.exports = data;