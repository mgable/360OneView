describe('Routes tests: ', function() {
    var location, route, rootscope;

    beforeEach(module('centralManagerApp'));

    beforeEach(inject(function($rootScope, $location, $route) {
        location = $location;
        rootScope = $rootScope;
        route = $route;
    }));

    describe('index route', function() {
        beforeEach(inject(function($httpBackend, SERVER, CENTRAL_MANAGER_REST_API) {
            $httpBackend.expectGET(SERVER + CENTRAL_MANAGER_REST_API).respond({
                "doesnot": "matter"
            });
            $httpBackend.expectGET('views/central_manager.tpl.html').respond({
                "doesnot": "matter"
            });
        }));
        it("should load index page", function() {
            location.path('/');
            rootScope.$digest();
            expect(route.current.controller).toBe('CentralManagerCtrl');
        });

        it("should load index page on unknown route", function() {
            location.path('/nowheresville');
            rootScope.$digest();
            expect(route.current.controller).toBe('CentralManagerCtrl');
        });
    });
});