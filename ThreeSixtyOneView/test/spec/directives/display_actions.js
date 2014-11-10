/* global $, xit */
/* jshint unused:false */
'use strict';

describe('Directives:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.directives','ThreeSixtyOneView.services', 'ThreeSixtyOneView.config'));

    beforeEach(module('my.templates'));

    var element, scope, button, state,  $provide;

    beforeEach(angular.mock.module(function (_$provide_) {
        $provide = _$provide_;
    }));

    describe("Display Actions:", function() {

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            state = {
                current : {
                    name: "ProjectManager"
                }
            };
            $provide.value("$state", state);
            scope.CONFIG = {};
            scope.CONFIG.displayActionsCreate = 'project';
            element = angular.element('<display-actions></display-actions>');
            element = $compile(element)(scope);
            scope.$digest();
            button = element.find(".button-holder span");
        }));

        it("should have an enabled create button", function() {
            expect(button).toBeDefined();
            expect(button.length).toBe(1);
        });

        it("should open the dialog box when the create button is clicked", function() {
            var spy = spyOn(scope, "create");
            button.click();
            expect(spy).toHaveBeenCalledWith(scope.CONFIG.displayActionsCreate);
        });
    });

});