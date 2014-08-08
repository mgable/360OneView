'use strict';

describe('Services:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.services'));

    var DiaglogService, dialogs;

    beforeEach(inject(function(_DiaglogService_, _dialogs_) {
        DiaglogService = _DiaglogService_;
        dialogs = _dialogs_;
    }));

    describe("Dialog Service:", function() {
        it("should have a create function", function() {
            expect(angular.isFunction(DiaglogService.create)).toBe(true);
        });

        it("should create the correct dialog box", function() {
            var spy = spyOn(dialogs, "create");
            DiaglogService.create('project')
            expect(spy).toHaveBeenCalledWith('/views/modal/create_project.html', 'ProjectCreateCtrl', {}, {
                size: 'sm'
            });
        });
    });
});