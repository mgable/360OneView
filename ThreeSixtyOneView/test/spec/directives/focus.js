/* global $, xit */
/* jshint unused:false */
'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives'));

    var $timeout, element, scope;

    beforeEach(function(){
        jasmine.addMatchers(customMatchers);
    });

    describe("Focus", function(){
        beforeEach(inject(function($rootScope, $compile, _$timeout_) {
            scope = $rootScope.$new();
            $timeout = _$timeout_;
            element = angular.element('<input type="text" focus></input>');
            element = $compile(element)(scope);
            element.appendTo(document.body);
            scope.$digest();
        }));

        it('should correctly set the focus', function() {
            $timeout.flush();
            expect(element).toHaveFocus();
        });

    });
});