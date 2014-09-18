'use strict';

describe('Dialog Services:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.services'));

    var DiaglogService, dialogs, spy;

    beforeEach(inject(function(_DiaglogService_, _dialogs_) {
        DiaglogService = _DiaglogService_;
        dialogs = _dialogs_;
        spy = spyOn(dialogs, "create");
    }));

    describe("Dialog Service:", function() {
        it("should define an api", function() {
            expect(angular.isFunction(DiaglogService.create)).toBe(true);
            expect(angular.isFunction(DiaglogService.rename)).toBe(true);
        });

        it("should create a 'create project' dialog box", function() {
            DiaglogService.create('project')
            expect(spy).toHaveBeenCalledWith('views/modal/create_project.tpl.html', 'ProjectCreateCtrl', {}, {
                size: 'sm'
            });
        });

        it("should create a 'rename' dialog box", function() {
            var data = {
                item: "item",
                service: "service"
            }
            DiaglogService.rename("item", "service");
            expect(spy).toHaveBeenCalledWith('views/modal/rename_project.html', 'ProjectRenameCtrl', data);
        });

    });
});