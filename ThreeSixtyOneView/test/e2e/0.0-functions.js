"use strict";

var specs = require('./0.0-specs.js'),
	_ = require('underscore'),
	fs = require('fs'),
	filename = "./test/e2e/project.json",
	//request = require('request'),
	http = require('http'),
	cache, 
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
		readProjectInfo: function(){
			return JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
		},
		deleteProjectInfo: function(){
			try{
				fs.unlinkSync(filename);
			}catch(e){console.info(filename + " does not exist");}
		},
		getRawData_ProjectsUrl: function(){
			return specs.domain + specs.projects;
		},
		getRawData_projects: function(bustCache){
			var defer = protractor.promise.defer(),
				options = {
					host: "ec2-54-205-7-240.compute-1.amazonaws.com",
					port: "8080",
					method: "GET",
					path: "/rubix/v1/project"
				},
				callback = function(response) {
				  var str = '';

				  //another chunk of data has been recieved, so append it to `str`
				  response.on('data', function (chunk) {
				    str += chunk;
				  });

				  //the whole response has been recieved, so we just print it out here
				  response.on('end', function () {
				  	cache = JSON.parse(str);
				    defer.fulfill(cache);
				  });
				};

			if (cache){
				defer.fulfill(cache);
				console.info("getting from cache");
			} else {
				http.request(options, callback).end();
				console.info("getting from source");
			}

			return defer.promise;
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