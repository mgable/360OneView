'use strict';

angular.module('centralManagerApp')
    .factory("DropdownService", function() {
        var active; //ID of currently active 

        return {
            getActive: function() {
                return active;
            },
            setActive: function(which) {
                active = which;
            }
        }
    })