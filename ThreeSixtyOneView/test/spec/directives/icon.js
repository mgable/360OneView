/* global $, xit */
/* jshint unused:false */
'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives'));

    var element, scope, customMatchers = {
        toMatchHTML : function(util, customEquilityTesters){
            return {
                compare: function (actual, expected){
                    var result = {};
                    result.pass = expected === actual.outerHTML;
                    if (result.pass){
                        result.message = 'Expected \'' + angular.mock.dump(actual) + '\' not to have matched';
                    } else {
                        result.message = 'Expected \'' + angular.mock.dump(actual) + '\' to have matched';
                    }
                    return result;
                }
            };
        }
    };

    beforeEach(function(){
        jasmine.addMatchers(customMatchers);
    });

    describe("Icon", function(){
        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            element = angular.element('<icon type="foo" cname="bar"></icon>');
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('should correctly make an icon', function() {
            expect(element[0]).toMatchHTML('<i class="fa fa-foo bar" type="foo" cname="bar"></i>');
        });

    });
});