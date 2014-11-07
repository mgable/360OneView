// spec.js
"use strict";

var projectUrl = '/#/projects?e2e=true';

describe('Project Listing', function() {
	var hasClass = function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
	    });
	};

	beforeEach(
		function(){browser.get(projectUrl);}
	)

	describe("Sort functions: ", function(){
		xit("should order by name", function(){
			var nameField = "//a[@data-ms-id='name-field']",
				elem = element(by.xpath(nameField)),
				titles = element.all(by.repeater('item in getData()').column('title'));
			
			elem.click();
			
			titles.first().getText().then(function(firstText){
				titles.last().getText().then(function(lastText){
					expect(firstText.toLowerCase()).toBeLessThan(lastText.toLowerCase());
				});
			});

			elem.click();

			titles.first().getText().then(function(firstText){
				titles.last().getText().then(function(lastText){
					expect(lastText.toLowerCase()).toBeLessThan(firstText.toLowerCase());
				});
			});

		});

		it("should sort by last modified", function(){
			var lastModified = "//span[@data-ms-id='column_1']",
				ascending = "//li[@data-ms-id='ascending']",
				descending = "//li[@data-ms-id='descending']",
				ascendingButton = element(by.xpath(ascending)),
				descendingButton = element(by.xpath(descending)),
				dropdown = element(by.xpath(lastModified)),
				dates = element.all(by.repeater('item in getData()').column('modifiedOn'));

			dates.first().getText().then(function(firstDate){
				dates.last().getText().then(function(lastDate){
					expect(firstDate).toBeGreaterThan(lastDate);
				});
			});

			dropdown.click();
			ascendingButton.click();

			dates.first().getText().then(function(firstDate){
				dates.last().getText().then(function(lastDate){
					expect(firstDate).toBeLessThan(lastDate);
				});
			});

		});
	});

	xdescribe("Sorter", function(){
		it("should have at least one project", function(){
			expect(element.all(by.repeater('item in getData()')).count()).toBeGreaterThan(0);
		});

		it("should have a master project", function(){
			expect(element.all(by.css(".master")).count()).toBe(1);
		});

		it("should have an active selection", function(){
			var first = element.all(by.repeater('item in getData()')).first();
			expect(hasClass(first, "active")).toBe(true);
		});

		it("should show the number of projects", function(){
			var itemCount = element(by.css('.display-actions h4.title span:first-child'));
			expect(itemCount.getText()).toContain(element.all(by.repeater('item in getData()')).count());
		});

		it("should change the active selection on click", function(){
			var first = element.all(by.repeater('item in getData()')).first(),
			last = element.all(by.repeater('item in getData()')).last();
			expect(hasClass(first, "active")).toBe(true);
			expect(hasClass(last, "active")).toBe(false);
			last.click();
			expect(hasClass(first, "active")).toBe(false);
			expect(hasClass(last, "active")).toBe(true);
			first.click();
			expect(hasClass(first, "active")).toBe(true);
			expect(hasClass(last, "active")).toBe(false);
		});

		it("should redirect to Project Dashboard when a project is clicked", function(){
			var projectName = element.all(by.repeater('item in getData()')).first().element(by.css('.default.ng-binding'));
			projectName.click();
			expect(browser.getLocationAbsUrl()).toContain("/#/dashboard/");
		});
	});

	xdescribe("Favorite behaviors", function(){
		it("should favorite the master project", function(){
			expect(element.all(by.css(".master .favorite")).count()).toBe(1);
		});

		it("should toggle favorite", function(){
			var firstElement = element.all(by.css(".favorites a")).first(),
				isFavorite;
				
			hasClass(firstElement, 'favorite').then(function(data){
				isFavorite = data;
				firstElement.click();
				expect(hasClass(firstElement, 'favorite')).not.toBe(isFavorite);
			});
		});

		it("should save the favorite", function(){
			var firstElement = element.all(by.css(".favorites a")).first(),
				isFavorite;
				
			hasClass(firstElement, 'favorite').then(function(data){
				isFavorite = data;
				firstElement.click();
				expect(hasClass(firstElement, 'favorite')).not.toBe(isFavorite);
				browser.get(projectUrl);
				firstElement = element.all(by.css(".favorites a")).first();
				expect(hasClass(firstElement, 'favorite')).not.toBe(isFavorite);
			});
		});
	});

	xdescribe("Filters: ", function(){
		var filterMenu = ".app .ProjectManager .display-actions h4.title",
			filterFavorites = '.filterDropdown li:last-child',
			filterAll = '.filterDropdown li:first-child',
			countHolder = '.display-actions h4.title span:first-child';

		it("should filter by favorite", function(){
			var filteredCount, unFilteredCount,
				itemCount = element(by.css(countHolder));
			element.all(by.repeater('item in getData()')).count().then(function(count){
				unFilteredCount = count;
			});
			element(by.css(filterMenu)).click();
			element(by.css(filterFavorites)).click();

			element.all(by.repeater('item in getData()')).count().then(function(count){
				var filteredCount = count,
				favorites = element.all(by.css('.favorite')).count();
				expect(filteredCount).toBeLessThan(unFilteredCount);
				expect(itemCount.getText()).toContain(element.all(by.repeater('item in getData()')).count());
				expect(element.all(by.repeater('item in getData()')).count()).toEqual(favorites);
			});
		});
	});

	xdescribe("Search: ", function(){
		it("should search", function(){
			element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
			expect(element.all(by.repeater('item in getData()')).count()).toBe(1);
		});
	});

	xdescribe("Page actions: ", function(){
		it ("should toggle the filter menu dropdown", function(){
			var elem = element(by.css('.filterDropdown'));
			expect(hasClass(elem, 'hide')).toBe(true);
			element(by.css(".app .ProjectManager .display-actions h4.title")).click();
			expect(hasClass(elem, 'hide')).toBe(false);
		});
	});

	xdescribe("Page attributes: ", function(){
		it('should have a title', function() {
			expect(browser.getTitle()).toEqual('360 One View');
		});
	});

});