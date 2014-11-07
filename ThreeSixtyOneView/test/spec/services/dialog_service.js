'use strict';

xdescribe('Dialog Services:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.services'));

    var DialogService, dialogs, spy;

    beforeEach(inject(function(_DialogService_, _dialogs_) {
        DialogService = _DialogService_;
        dialogs = _dialogs_;
        spy = spyOn(dialogs, "create");
    }));

    describe("Dialog Service:", function() {
        it("should define an api", function() {
            expect(angular.isFunction(DialogService.create)).toBe(true);
            expect(angular.isFunction(DialogService.rename)).toBe(true);
        });

        it("should create a 'create project' dialog box", function() {
            DialogService.create('project');
            expect(spy).toHaveBeenCalledWith('views/modal/create_project.tpl.html', 'ProjectCreateCtrl', {}, {
                size: 'sm'
            });
        });

        it("should create a 'rename' dialog box", function() {
            var data = "item";
            DialogService.rename("item", "service");
            expect(spy).toHaveBeenCalledWith('views/modal/rename_project.tpl.html', 'ProjectRenameCtrl', data, {size: 'sm'});
        });

    });
});