'use strict';

describe('Directive: mainNav', function() {

    // load the directive's module
    beforeEach(module('test1App'));
    beforeEach(module('views/mainnav.html'));


    var element,
        renderedDirective,
        scope,
        location,
        menufactorySpy,
        renderedHtml = '<divclass="container-fluid"menu-items="menuItems"><divclass="wrapper"><divclass="col-sm-2"id="sidebar-wrapper"><ulclass="navsidebar-nav"><liclass="sidebar-brand"><spanclass="pie"></span><aclass="logo">MarketShareLogo</a></li><!--ngRepeat:itemindata--><ling-repeat="itemindata"ng-class="isCurrentLocation(item.label)"class="ng-scope"><ang-href="#/dashboard"href="#/dashboard"><spanclass="iconglyphiconglyphicon-search"ng-class="item.icon"></span><spanclass="labelng-binding">Dashboard</span></a></li><!--endngRepeat:itemindata--></ul></div></div></div>'

    beforeEach(inject(function($rootScope, $compile, MenuFactory, $location) {
        element = angular.element('<mainnav menu-items="menuItems"></mainnav>');
        scope = $rootScope.$new();

        var menuItems = [{
            'icon': 'glyphicon-search',
            'label': 'Dashboard',
            'url': '/dashboard'
        }];

        location = $location;

        menufactorySpy = spyOn(MenuFactory, "get").andReturn(menuItems);

        renderedDirective = $compile(element)(scope);
        scope.$digest();
    }));

    it('should render the directive', function() {
        expect(renderedDirective[0].outerHTML.replace(/\s/g, '')).toBe(renderedHtml.replace(/\s/g, ''));
    });

    it('should highlight current location', function() {
        location.path('/dashboard');
        expect(scope.isCurrentLocation('Dash Board')).toBe('current');
        expect(scope.isCurrentLocation('xxx')).toBe('');
    });
});