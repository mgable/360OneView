/* global $, xit */
/* jshint unused:false */
'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives'));


    var $timeout, link, element, scope, customMatchers = {
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
        },
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

    describe("Search:", function(){
        var scope, element, displayBy;
        beforeEach(inject(function($rootScope, $compile, $httpBackend, _$timeout_, SortAndFilterService){
            scope = $rootScope.$new();
            scope.SortAndFilterService = SortAndFilterService;
            $timeout = _$timeout_;
            element = angular.element('<search></search>');
            element = $compile(element)(scope);
            element.appendTo(document.body);
            scope.$digest();
            link = element.find('.toggle');
        }));

        it("should initialize correctly", function(){
            expect(scope.searchVisible).toBe(false);
        });

        it("should render the correct html", function(){
            expect(element[0]).toMatchHTML('<span class="ng-scope"><span class="toggle" ng-click="toggleSearchField()"><i class="fa fa-search " type="search"></i></span>&nbsp;<span ng-show="searchVisible" class="search-holder ng-hide"><input type="text" class="search-input ng-pristine ng-valid" ng-model="SortAndFilterService.searchText" ng-change="SortAndFilterService.filter()">&nbsp;<a ng-click="toggleSearchField()" class="close-button"><i class="fa fa-times"></i></a></span></span>');
        });

        it('should toggle correctly', function(){
            expect(scope.searchVisible).toBe(false);
            link.click();
            expect(scope.searchVisible).toBe(true);
        });

        it("should open and focus", function(){
            var inputField = element.find("input");
            link.click();
            $timeout.flush();
            expect(inputField).toHaveFocus();
        });

        it('should clear the search text when closed', function(){
            var spy = spyOn(scope.SortAndFilterService, "resetSearchText");
            link.click(); //open
            link.click(); //close
            expect(spy).toHaveBeenCalled();
        });

    });
});
