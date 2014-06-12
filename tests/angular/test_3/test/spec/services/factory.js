'use strict';

xdescribe('Services: FilterService', function() {

    // load the directive's module
    beforeEach(module('fileManagerApp'));

    it('should define and object and a string variable', inject(function(FilterService) {
        expect(FilterService.activeFilters).toBeDefined();
        expect(FilterService.filterBy).toBeDefined();
        expect(FilterService.searchText).toBe('');
    }));
});