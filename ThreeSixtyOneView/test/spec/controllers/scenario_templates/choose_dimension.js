'use strict';

describe('Controller: ChooseDimensionsCtrl', function () {

    // load the controller's module
    beforeEach(module('ThreeSixtyOneView'));

    var ctrl, $rootScope, $controller, EVENTS, scope, DimensionService, PivotMetaService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$rootScope_, _$controller_, _EVENTS_, _PivotMetaService_){
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        EVENTS = _EVENTS_;
        PivotMetaService = _PivotMetaService_;

        scope = $rootScope.$new();
    }));

    // Initialize services and a mock controller
    beforeEach(inject(function() {
        scope.getTimeGranularity = function() { return 'QUARTER'; };
        scope.dimensions = JSON.parse(scenarioMockData.dimensionTree);
        scope.getAddedDimensionMembers = function() {
            return JSON.parse(templateMockData.addedFilters);
        };
        scope.setTimeGranularity = function() {
            return jasmine.any(Array);
        };

        spyOn(scope, "$emit");

        ctrl = $controller('ChooseDimensionsCtrl', {
            $scope: scope
        });
    }));

    it('should be defined', function() {
        expect(ctrl).toBeDefined();
    });

    it('should have a defined api', function() {
        expect(getAPI(scope)).areArraysEqual(templateMockData.chooseDimensionsCtrlSignature);
    });

    it('should emit flipbookAllowAdvance event true when time granularity is selected', function() {
        var selectedTime = 'QUARTER',
            msg = true;
        scope.setTime(selectedTime);
        expect(scope.$emit).toHaveBeenCalledWith("flipbookAllowAdvance", msg);
    });

    it('should emit flipbookAllowAdvance event false when time granularity is not selected', function() {
        var selectedTime = false,
            msg = false;
        scope.setTime(selectedTime);
        expect(scope.$emit).toHaveBeenCalledWith("flipbookAllowAdvance", msg);
    });

});
