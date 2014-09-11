'use strict';

describe('Services:', function() {

    // load the directive's module
    beforeEach(module('ThreeSixtyOneView.services'));

    var DiaglogService, dialogs, spy;

    beforeEach(inject(function(_DiaglogService_, _dialogs_) {
        DiaglogService = _DiaglogService_;
        dialogs = _dialogs_;
        spy = spyOn(dialogs, "create");
    }));

    describe("Dialog Service:", function() {
        it("should have a create function", function() {
            expect(angular.isFunction(DiaglogService.create)).toBe(true);
        });

        it("should create a 'create project' dialog box", function() {
            
            DiaglogService.create('project')
            expect(spy).toHaveBeenCalledWith('views/modal/create_project.html', 'ProjectCreateCtrl', {}, {
                size: 'sm'
            });
        });

       
        it("should create a 'name' dialog box", function() {
             var data = {
                item: "item",
                service: "service",
                config: "config"
            };

            DiaglogService.name("item", {config: "config"}, "service")
            expect(spy).toHaveBeenCalledWith('views/modal/name.html', 'NameCtrl', data);
        });

        

        it("should create a 'rename' dialog box", function() {
            var data = {
                item: "item",
                service: "service"
            }
            DiaglogService.rename("item", "service");
            expect(spy).toHaveBeenCalledWith('views/modal/rename.html', 'RenameCtrl', data);
        });

    });
});