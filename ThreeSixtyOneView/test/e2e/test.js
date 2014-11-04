// spec.js
describe('angularjs homepage', function() {
	var hasClass = function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
	    });
	};

	beforeEach(
		function(){browser.get('http://127.0.0.1:9001/#/projects');}
	)

	it('should have a title', function() {
		expect(browser.getTitle()).toEqual('360 One View');
	});

	it ('should list projects', function(){
		expect(element.all(by.repeater('item in getData()')).count()).toBeGreaterThan(0);
	});

	it("should search", function(){
		element(by.model('SortAndFilterService.searchText')).sendKeys('master project');
		expect(element.all(by.repeater('item in getData()')).count()).toBe(1);
	});

	it ("should toggle the filter menu dropdown", function(){
		var elem = element(by.css('.filterDropdown'));
		expect(hasClass(elem, 'hide')).toBe(true);
		element(by.css(".filtertoggle")).click();
		expect(hasClass(elem, 'hide')).toBe(false);
	});

	it("should order by name", function(){
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
});