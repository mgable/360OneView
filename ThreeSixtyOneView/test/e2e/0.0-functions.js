"use strict";

var specs = require('./0.0-specs.js'),
	_ = require('underscore'),
	fs = require('fs'),
	filename = "./test/e2e/project.json",

	data = {
		saveProjectInfo: function(obj){
			var data = JSON.stringify(obj);
			fs.writeFileSync(filename, data);
		},
		readProjectInfo: function(){
			return JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
		},
		deleteProjectInfo: function(){
			fs.unlinkSync(filename);
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
		}
	};

module.exports = data;