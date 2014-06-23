describe('Routes test: ', function() {
    var location, route, rootscope;

    beforeEach(module('fileManagerApp'));

    beforeEach(inject(function($rootScope, $location, $route) {
        location = $location;
        rootScope = $rootScope;
        route = $route;
    }));

    describe('index route', function() {
        beforeEach(inject(function($httpBackend) {
            $httpBackend.expectGET('http://127.0.0.1:3001/api/items').respond({
                "doesnot": "matter"
            });
            $httpBackend.expectGET('views/fileManager.html').respond({
                "doesnot": "matter"
            });
        }));
        it("should load index page", function() {
            location.path('/');
            rootScope.$digest();
            expect(route.current.controller).toBe('FileManagerCtrl');
        });

        it("should load index page on unknown route", function() {
            location.path('/nowheresville');
            rootScope.$digest();
            expect(route.current.controller).toBe('FileManagerCtrl');
        });
    });
});