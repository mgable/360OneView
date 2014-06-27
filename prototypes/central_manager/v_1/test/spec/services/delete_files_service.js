'use strict';

describe('Service: FileDeleteService', function() {

    // load the service's module
    beforeEach(module('centralManagerApp'));

    // instantiate service
    var FileDeleteService, FilesModel;
    beforeEach(inject(function(_FileDeleteService_, _FilesModel_) {
        FileDeleteService = _FileDeleteService_;
        FilesModel = _FilesModel_;
    }));

    it('should correctly set and get files', function() {
        FileDeleteService.setFilesToDelete(['1', '2', '3']);
        expect(FileDeleteService.getFilesToDelete()).toEqual(['1', '2', '3']);
    });

    it('should correctly return the deleted file count', function() {
        FileDeleteService.setFilesToDelete(['1', '2', '3']);
        expect(FileDeleteService.getFileCount()).toEqual(3);
    });

    it('should delete an array of file objects', function() {
        var spy = spyOn(FilesModel, '$delete');
        FileDeleteService.setFilesToDelete([{
            id: '123',
            name: "does not matter"
        }, {
            id: '234',
            name: "does not matter"
        }]);
        expect(FileDeleteService.getFileCount()).toEqual(2);
        expect(FileDeleteService.getReset()).toEqual(false);
        FileDeleteService.remove();
        expect(spy).toHaveBeenCalledWith(['123', '234']);
        expect(FileDeleteService.getFileCount()).toEqual(0);
        expect(FileDeleteService.getReset()).toEqual(true);
    });

});