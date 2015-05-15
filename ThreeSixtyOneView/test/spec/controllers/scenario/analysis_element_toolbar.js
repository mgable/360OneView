/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

// beforeEach(module('ThreeSixtyOneView'));

describe("AnalysisElementCtrl: ", function(){
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        scope.scenarioElements = testData,
        ctrl = $controller('AnalysisElementCtrl', {
            $scope: scope
        });
    }));
});