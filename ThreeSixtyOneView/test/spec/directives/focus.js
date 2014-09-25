/* global $, xit */
/* jshint unused:false */
'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives'));

    var $timeout, element, scope, customMatchers = {
        toHaveFocus : function(util, customEquilityTesters){
            return {
                compare: function (actual, expected){
                    var result = {};
                    result.pass = document.activeElement === actual[0];
                    if (result.pass){
                        result.message = 'Expected \'' + angular.mock.dump(actual) + '\' not to have focus';
                    } else {
                        result.message = 'Expected \'' + angular.mock.dump(actual) + '\' to have focus';
                    }
                    return result;
                }
            };
        }
    };

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