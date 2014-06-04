/* global angular, EventEmitter, _, Q */

(function() {
    'use strict';

    function Roster(futureRosterData) {
        this.$unwrap(futureRosterData);
    }

    Roster.$factory = [
        '$timeout',
        'bdResource',
        function($timeout, Resource) {
            _.extend(Roster, {
                $$resource: new Resource('http://127.0.0.1:3001/api/item'),
                $timeout: $timeout
            });

            return Roster;
        }
    ];

    angular.module('myApp').factory('bdRoster', Roster.$factory);

    Roster.$find = function(uid) {
        Roster.data = new Roster(this.$$resource.find(uid));
    };

    Roster.$get = function() {
        return Roster.data;
    }

    Roster.deleteFirst = function() {
        console.info("deleting first elements")
        Roster.data.data.splice(0, 1);
    }

    Roster.addMore = function() {
        console.info("adding more elements")
        Roster.data.data.unshift(additionaldata);
    }

    Roster.changeTitle = function() {
        console.info("changing title");
        Roster.data.data[0].title = "new title"
    }


    Roster.prototype.$unwrap = function(futureRosterData) {
        var self = this;

        this.$futureRosterData = futureRosterData;
        this.$futureRosterData.then(function(data) {
            Roster.$timeout(function() {
                _.extend(self, data);
            });
        });
    };



    var additionaldata = {
        "id": "d821ecaa-95db-4239-9c3c-xxxxxxx",
        "title": "2014 Q2 Mareting Plan",
        "description": "Pellentesque eleifend, turpis rutrum ornare lacinia, sem purus commodo arcu, eget condimentum lorem nisi quis eros. Proin bibendum, purus ut tempus cursus, enim urna sodales lacus, at volutpat erat mauris in massa. Phasellus commodo risus vitae risus volutpat tempus.",
        "createdBy": "Erik Lee",
        "createdDate": "2014-02-06T16:18:08.769Z",
        "fileType": "Decision Books",
        "search": "",
        "modifiedBy": "Dan Cox",
        "lastModified": "2014-05-14T16:18:08.769Z",
        "scenarios": [{
            "title": "Carl's Econ Variable Simulation 1",
            "lastModified": "2014-05-30T16:18:08.769Z",
            "modifiedBy": "Dan Cox",
            "fileType": "Cost Assumptions"
        }, {
            "title": "Al's AIB 2Q 2015 ",
            "lastModified": "2014-06-02T16:18:08.769Z",
            "modifiedBy": "Ann Kross",
            "fileType": "Decision Books"
        }, {
            "title": "Al's Simulate 2Q 2015",
            "lastModified": "2014-06-03T16:18:08.769Z",
            "modifiedBy": "Bob Belcher",
            "fileType": "Scenarios"
        }, {
            "title": "Ann's AIB Q1 2015 TV ONLY v3",
            "lastModified": "2014-06-04T16:18:08.769Z",
            "modifiedBy": "Barney Rubble",
            "fileType": "Objectives"
        }, {
            "title": "Ann's Allocate 3Q",
            "lastModified": "2014-05-31T16:18:08.769Z",
            "modifiedBy": "Carl Sagan",
            "fileType": "Brand Awardness"
        }, {
            "title": "Bob’s Simulate 4Q 2014",
            "lastModified": "2014-06-01T16:18:08.769Z",
            "modifiedBy": "Barney Rubble",
            "fileType": "Cost Assumptions"
        }, {
            "title": "Brent's Simulate 3Q",
            "lastModified": "2014-05-30T16:18:08.769Z",
            "modifiedBy": "Erik Lee",
            "fileType": "Scenarios"
        }, {
            "title": "Dan's Digital Hit Target",
            "lastModified": "2014-05-31T16:18:08.769Z",
            "modifiedBy": "Dan Cox",
            "fileType": "Cost Assumptions"
        }, {
            "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
            "lastModified": "2014-06-03T16:18:08.769Z",
            "modifiedBy": "Carl Sagan",
            "fileType": "Cost Assumptions"
        }, {
            "title": "Francis' Max Profit for Q4 2014",
            "lastModified": "2014-05-29T16:18:08.769Z",
            "modifiedBy": "Bob Belcher",
            "fileType": "Soft Constraints"
        }],
        "masterSet": false
    }

})();