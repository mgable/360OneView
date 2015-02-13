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
                    var result = {}, difference =_.difference(array1, array2);

                    result.pass = true;

                    if (difference.length > 0){
                        result.pass = false;
                        result.exception = difference;
                    }

                    if (result.pass){
                        result.message = 'Expected arrays not to be equal';
                    } else {
                        result.message = 'Expected arrays to be equal - there is an additional element: ' + result.exception.toString();
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