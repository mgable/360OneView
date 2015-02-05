/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

describe('Controllers: ', function() {
    var $controller,
        $rootScope,
        scope,
        ErrorService,
        ctrl,
        signature;

    beforeEach(module('ThreeSixtyOneView', 'ThreeSixtyOneView.services'));

    describe("Main CTRL: ", function(){
        beforeEach(inject(function(_ErrorService_, $rootScope, $controller) {
            scope = $rootScope.$new();
            ErrorService = _ErrorService_;
            signature = ['this', 'ErrorService', 'console', 'alert'];
            ctrl = $controller('MainCtrl', {
                $scope: scope
            });
        }));

        it("should exist", function(){
            expect(ctrl).toBeDefined();
        });

        it("should have a defined api", function(){
            var api = getAPI(scope);
            expect(api).areArraysEqual(signature);
        });

        it("should import Error Service", function(){
            expect(scope.ErrorService).toBe(ErrorService);
        });
    });
});