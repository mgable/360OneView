describe("Filters:", function() {
    // load the directive's module
    beforeEach(module('fileManagerApp'));

    var filter;

    beforeEach(inject(function($filter) {
        filter = $filter;
    }));

    it('should capitalize', function() {
        expect(filter('capitalize')('cat in the hat')).toBe("Cat in the hat");
    });

    it('should unCamelCase', function() {
        expect(filter('unCamelCase')("catInTheHat")).toBe('cat In The Hat');
    });

    it('should escape single quotes', function() {
        expect(filter('escape')("The cat's tail")).toBe("The cat&apos;s tail");
    });
});