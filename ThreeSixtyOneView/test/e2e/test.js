// spec.js
describe('Project Listing', function() {
	var hasClass = function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
	    });
	};

	beforeEach(
		function(){browser.get('http://127.0.0.1:9001/#/projects');}
	)

	xit('should have a title', function() {
		expect(browser.getTitle()).toEqual('360 One View');
	});

	xit ('should list projects', function(){
		expect(element.all(by.repeater('item in getData()')).count()).toBeGreaterThan(0);
	});

	xit("should search", function(){
		element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
		expect(element.all(by.repeater('item in getData()')).count()).toBe(1);
	});

	xit ("should toggle the filter menu dropdown", function(){
		var elem = element(by.css('.filterDropdown'));
		expect(hasClass(elem, 'hide')).toBe(true);
		element(by.css(".filtertoggle")).click();
		expect(hasClass(elem, 'hide')).toBe(false);
	});

	xit("should order by name", function(){
		var elem = element(by.css('[ng-bind="display"]')),
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

	xit('should present the total viewable items', function(){
		var itemCount = element(by.css('.display-actions h4.title span:first-child'));
		expect(itemCount.getText()).toContain(element.all(by.repeater('item in getData()')).count());
	});

	xit("should filter by favorite", function(){
		var filteredCount, unFilteredCount,
			itemCount = element(by.css('.display-actions h4.title span:first-child'));
		element.all(by.repeater('item in getData()')).count().then(function(count){
			unFilteredCount = count;
		});
		element(by.css(".filtertoggle")).click();
		element(by.css('.filterDropdown li:last-child')).click();

		element.all(by.repeater('item in getData()')).count().then(function(count){
			var filteredCount = count,
			favorites = element.all(by.css('.favorite')).count();
			expect(filteredCount).toBeLessThan(unFilteredCount);
			expect(itemCount.getText()).toContain(element.all(by.repeater('item in getData()')).count());
			expect(element.all(by.repeater('item in getData()')).count()).toEqual(favorites);
		});
	});

	describe("Favorite behaviors", function(){
		it("should favorite the master project", function(){
			expect(element.all(by.css(".master .favorite")).count()).toBe(1);
		});
	});
});