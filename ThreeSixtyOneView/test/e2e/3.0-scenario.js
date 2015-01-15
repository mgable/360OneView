"use strict";

var scenarioUrl = '/#/scenario/:projectId/:scenarioId/edit';

	//TEMP data - remove in production
	var projectId = "2cd7647b770f3daba1fe74afe58d2309",
		scenarioId = "5";
	scenarioUrl = scenarioUrl.replace(/:projectId/, projectId).replace(/:scenarioId/, scenarioId);

describe('Scenario page: ', function() {
	beforeEach(
		function(){
			browser.get(scenarioUrl);
			browser.driver.manage().window().setSize(1280, 1024);
		}
	);

	describe('Scenario page tabs:', function() {
		it('should switch between scenario page tabs', function() {
			expect(hasClass(element(by.css('.pbTitle')), 'pbTitleSel')).toBe(false);
		});
	});




	var hasClass = function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
	    });
	},
	data = "pivotBuilderItem in pivotBuilderItems",
	openDrawer = ".pbTitleText",
	closeDrawer = ".pbSliderCollapse span",
	drawer = ".pbSlider",
	openedClass = "pbOpened",
	columnAndRowsView = ".pbFunctionFlip div:nth-child(1)",
	filterView = ".pbFunctionFlip div:nth-child(2)",
	toggleViewsActiveClass = "selected",
	openDrawerButton = element(by.css(openDrawer)),
	closeDrawerButton = element(by.css(closeDrawer)),
	drawerWidget = element(by.css(drawer)),
	columnAndRowsViewButton = element(by.css(columnAndRowsView)),
	filterViewButton = element(by.css(filterView));


	// beforeEach(
	// 	function(){
	// 		browser.get(scenarioUrl);
	// 		browser.driver.manage().window().setSize(1280, 1024);
	// 	}
	// );

	// xdescribe("basic drawer functions: ", function(){
	// 	it("should expand when the tab is clicked", function(){
	// 		expect(hasClass(drawerWidget, openedClass)).toBe(false);
	// 		openDrawerButton.click();
	// 		expect(hasClass(drawerWidget, openedClass)).toBe(true);
	// 		closeDrawerButton.click();
	// 		expect(hasClass(drawerWidget, openedClass)).toBe(false);
	// 	});

	// 	it("should toggle between rows-columns view  and filter view", function(){
	// 		openDrawerButton.click();
	// 		expect(hasClass(columnAndRowsViewButton, toggleViewsActiveClass)).toBe(true);
	// 		expect(hasClass(filterViewButton, toggleViewsActiveClass)).toBe(false);
	// 		filterViewButton.click();
	// 		expect(hasClass(columnAndRowsViewButton, toggleViewsActiveClass)).toBe(false);
	// 		expect(hasClass(filterViewButton, toggleViewsActiveClass)).toBe(true);
	// 		columnAndRowsViewButton.click();
	// 		expect(hasClass(columnAndRowsViewButton, toggleViewsActiveClass)).toBe(true);
	// 		expect(hasClass(filterViewButton, toggleViewsActiveClass)).toBe(false);
	// 	});
	// });

	// xdescribe("columns and rows", function(){
	// 	it("should have the correct row count", function(){
	// 		var columns = element.all(by.repeater(data));
	// 		expect(columns.count()).toBe(2);
	// 	});
	// });
});