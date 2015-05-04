/* jshint unused:false */
/* global xit, xdescribe */

'use strict';

beforeEach(module('ThreeSixtyOneView'));

var scope,
    ctrl,
    testData = [{"group": "bar"}, {"group": "foo"}],
    sortedTestData = { "bar" : [ { "group" : 'bar' } ], "foo" : [ { "group" : 'foo' } ] },
    signature = ['this', 'isHiddenElement', 'getGroupedScenarioElements', 'openScenarioElementFileModal', 'openScenarioElementCopyModal', 'copyAndReplaceAnalysisElementForCube', 'groupedScenarioElements', 'scenarioElements','isHiddenElement','getGroupedScenarioElements','openScenarioElementFileModal','openScenarioElementCopyModal','groupedScenarioElements','setFromDate','setToDate'];

describe("AnalysisElementCtrl: ", function(){
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        scope.scenarioElements = testData,
        ctrl = $controller('AnalysisElementCtrl', {
            $scope: scope
        });
    }));

    describe("the Controller: ", function(){
    	it("should exist", function(){
	        expect(ctrl).toBeDefined();
	    });

	    it("should have a defined api", function(){
	        var api = getAPI(scope);
	        expect(api).areArraysEqual(signature);
	    });
    });

    describe("the API: ", function(){
    	// $scope.isHiddenElement
     	it("should hide the 'Marketing Plan' group", function(){
     		expect(scope.isHiddenElement({'group': 'foo'})).toBe(false);
     		expect(scope.isHiddenElement({'group': 'Marketing Plan'})).toBe(true);
     	});
    })
});