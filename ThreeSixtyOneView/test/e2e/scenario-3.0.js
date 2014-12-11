"use strict";

var scenarioUrl = '/#/scenario/:projectId/:scenarioId/edit'

	//TEMP data - remove in production
	var projectId = "a512b7fce6113c33a3efd81cfe876d48",
		scenarioId = "82";
	scenarioUrl = scenarioUrl.replace(/:projectId/, projectId).replace(/:scenarioId/, scenarioId);

describe('Project Dashboard: ', function() {
	var hasClass = function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
	    });
	},
	openDrawer = ".pbTitleText",
	closeDrawer = ".pbSliderCollapse span",
	drawer = ".pbSlider",
	openedClass = "pbOpened",
	columnAndRowsView = ".pbFunctionFlip div:nth-child(1)",
	filterView = ".pbFunctionFlip div:nth-child(2)",
	toggleViewsActiveClass = "pbFunctionFlipButtonActive",
	openDrawerButton = element(by.css(openDrawer)),
	closeDrawerButton = element(by.css(closeDrawer)),
	drawerWidget = element(by.css(drawer)),
	columnAndRowsViewButton = element(by.css(columnAndRowsView)),
	filterViewButton = element(by.css(filterView));


	beforeEach(
		function(){
			browser.get(scenarioUrl);
			browser.driver.manage().window().setSize(1280, 1024);
		}
	);

	xdescribe("basic drawer functions: ", function(){
		it("should expand when the tab is clicked", function(){
			expect(hasClass(drawerWidget, openedClass)).toBe(false);
			openDrawerButton.click();
			expect(hasClass(drawerWidget, openedClass)).toBe(true);
			closeDrawerButton.click();
			expect(hasClass(drawerWidget, openedClass)).toBe(false);
		});

		it("should toggle between rows-columns view  and filter view", function(){
			openDrawerButton.click();
			expect(hasClass(columnAndRowsViewButton, toggleViewsActiveClass)).toBe(true);
			expect(hasClass(filterViewButton, toggleViewsActiveClass)).toBe(false);
			filterViewButton.click();
			expect(hasClass(columnAndRowsViewButton, toggleViewsActiveClass)).toBe(false);
			expect(hasClass(filterViewButton, toggleViewsActiveClass)).toBe(true);
			columnAndRowsViewButton.click();
			expect(hasClass(columnAndRowsViewButton, toggleViewsActiveClass)).toBe(true);
			expect(hasClass(filterViewButton, toggleViewsActiveClass)).toBe(false);
		});
	});

	describe("columns and rows", function(){
		it("should have the correct row count", function(){
			var columns = element.all(by.repeater("item in pbData.viewData[pivotBuilderItem.name]"));
			expect(columns.count()).toBe(2);
		});
	});
});