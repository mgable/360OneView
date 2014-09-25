/* global $, xit */
/* jshint unused:false */
'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives'));

    var $timeout, element, scope, item = {'label': 'foo'};

    describe("MS Link", function(){
        beforeEach(inject(function($rootScope, $compile, $controller, _$timeout_) {
            scope = $rootScope.$new();
            scope.item = item;
            $timeout = _$timeout_;
            element = angular.element('<ul ms-link-group firstSelected="{{item.label}}" radio="false" class="menu"><li><a ms-link="{{item.label}}">{{item.label}}</a></li></ul>');
            element = $compile(element)(scope);
            scope.$digest();
            $timeout.flush();
        }));

        it('should correctly make an link', function() {
            expect(element[0]).toBeDefined();
            expect(scope.radio).toEqual(false);
            expect(scope.selectedItem).toEqual(item.label);
        });

        it('should toggle correctly', function(){
            var link = element.find("a");
            link.click();
            expect(scope.selectedItem).toEqual("none");
            link.click();
            expect(scope.selectedItem).toEqual("foo");
            link.click();
            expect(scope.selectedItem).toEqual("none");
            scope.radio = true;
            link.click();
            expect(scope.selectedItem).toEqual("foo");
            link.click();
            expect(scope.selectedItem).toEqual("foo");
        });

    });
});