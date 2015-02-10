 "use strict";

 var getAPI = function(scope){
        var api = [];
        _.each(_.keys(scope), function(key){
            if (!_.isNull(key)){
                var item = key.toString();
                if (/^[^$]/.test(item)){
                    api.push(item);
                }
            }
        });
        return api;
    },
    customMatchers = {
        areArraysEqual:  function(util, customEquilityTesters){
            return {
                compare:  function (array1, array2){
                    var result = {};

                    result.pass = true;

                    if (array1.length !== array2.length){
                        result.pass = false;
                    };

                    array1.sort();
                    array2.sort();
                    
                    for(var i = 0, limit = array1.length; i < limit; i++){
                        if (array1[i] !== array2[i]){
                            result.pass = false;
                            break;
                        };
                    };

                    if (result.pass){
                        result.message = 'Expected arrays not to be equal';
                    } else {
                        result.message = 'Expected arrays to be equal';
                    };

                    return result;
                }
            };
        },
        toHaveFocus : function(util, customEquilityTesters){
            return {
                compare: function (actual, expected){
                    var result = {};
                    result.pass = document.activeElement === actual[0];
                    if (result.pass){
                        result.message = 'Expected \'' + angular.mock.dump(actual) + '\' not to have focus';
                    } else {
                        result.message = 'Expected \'' + angular.mock.dump(actual) + '\' to have focus';
                    }
                    return result;
                }
            };
        }
    };

beforeEach(function(){
    jasmine.addMatchers(customMatchers);
});