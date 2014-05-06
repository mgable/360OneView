"use strict";

describe('Directive: mainNav', function() {

    // load the directive's module
    beforeEach(module('test1App'));
    beforeEach(module('views/mainnav.html'));


    var element,
        renderedDirective,
        scope,
        renderedHtml = '<div class="container-fluid ng-isolate-scope" menu-items="menuItems">' +
            '<div class="wrapper">' +
            '<div class="col-sm-2" id="sidebar-wrapper">' +
            '<ul class="nav sidebar-nav">' +
            '<li class="sidebar-brand"><span class="pie"></span><a class="logo">MarketShare Logo</a></li>' +
            '<!-- ngRepeat: item in data --><li ng-repeat="item in data" ng-class="isCurrentLocation(item.label)" class="ng-scope"><a ng-href="#/dashboard" href="#/dashboard"><span class="icon glyphicon glyphicon-search" ng-class="item.icon"></span><span class="label ng-binding">Dashboard</span></a></li><!-- end ngRepeat: item in data --> ' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>';

    beforeEach(inject(function($rootScope, $compile) {
        element = angular.element('<mainnav menu-items="menuItems"></mainnav>');
        scope = $rootScope;
        scope.menuItems = [{
            "icon": "glyphicon-search",
            "label": "Dashboard",
            "url": "/dashboard"
        }];
        renderedDirective = $compile(element)(scope);
        scope.$digest();
    }));

    it('should make hidden element visible', (function() {
        expect(renderedDirective[0].outerHTML.replace(/\s/g, "")).toBe(renderedHtml.replace(/\s/g, ""));
    }));
});