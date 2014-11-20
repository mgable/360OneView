'use strict';

describe('Dialog Services:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.services'));

    var DialogService, dialogs;

    beforeEach(inject(function(_DialogService_, _dialogs_) {
        DialogService = _DialogService_;
        dialogs = _dialogs_;
        spyOn(dialogs, "create");
        spyOn(dialogs, "notify");
    }));

    describe("Dialog Service:", function() {
        it("should define an api", function() {
            expect(angular.isFunction(DialogService.create)).toBeDefined();
            expect(angular.isFunction(DialogService.trayCopy)).toBeDefined();
            expect(angular.isFunction(DialogService.notify)).toBeDefined();
            expect(angular.isFunction(DialogService.noop)).toBeDefined();
        });

        it("should create a 'create project' dialog box", function() {
            DialogService.create('project');
            expect(dialogs.create).toHaveBeenCalledWith('views/modal/simple_input.tpl.html', 'ProjectCreateCtrl', {}, {
                size: 'sm'
            });
        });

        it("should create a 'copy project' dialog box", function() {
            DialogService.trayCopy("foo");
            expect(dialogs.create).toHaveBeenCalledWith('views/modal/simple_input.tpl.html', 'ScenarioCopyCtrl', "foo", {
                size: 'sm'
            });
        });

        it("should create a 'notification' dialog box", function() {
            DialogService.notify("foo", "bar");
            expect(dialogs.notify).toHaveBeenCalledWith("foo", "bar");
        });

    });
});