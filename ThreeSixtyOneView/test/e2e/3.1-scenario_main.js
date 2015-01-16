"use strict";

var specs = require('./3.0-scenario_specs.js');

xdescribe('Scenario page: ', function() {
	beforeEach(
		function(){
			browser.driver.manage().window().setSize(1280, 1024);
			browser.get(specs.scenarioUrl + specs.testQuery);
		}
	);

	describe('Scenario page tabs:', function() {
		it('should switch between scenario page tabs', function() {
			expect(specs.hasClass(specs.pbSlider, specs.pivotBuilderTitleSelectedClass)).toBe(false);
		});
	});
});