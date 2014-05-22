'use strict';

angular.module('filemanagerApp')
    .controller('MainCtrl', function($scope) {

    }).controller('FileManagerNavigationCtrl', function($scope, filterService, GroupFileDelete) {
        $scope.filterService = filterService;

        $scope.filesToDeleteCount = GroupFileDelete.getFileCount();
        $scope.filesToDelete = GroupFileDelete.getFilesToDelete();

        $scope.$watch(GroupFileDelete.getFileCount, function() {
            $scope.filesToDeleteCount = GroupFileDelete.getFileCount();
        });

        $scope.cb = function() {
            GroupFileDelete.reset();
        }

        $scope.$watch(GroupFileDelete.getFilesToDelete, function() {
            $scope.filesToDelete = GroupFileDelete.getFilesToDelete();
        });

        $scope.setFilter = function(filter, other) {
            if (other) {
                filterService.activeFilters.search = filter;
                filterService.activeFilters.fileType = (typeof other === "string") ? other : "";
            } else {
                filterService.activeFilters.fileType = filter === "All" ? "" : filter;
                filterService.activeFilters.search = "";
            }
        }

        $scope.setFilterCreated = function(filter) {
            filterService.activeFilters.createdBy = (filter === "All") ? "" : filter;
        }

        $scope.clearCreatedBy = function(x) {
            if (x === null) {
                delete filterService.activeFilters.createdBy;
            }
        };

        $scope.menuItems = [{
            "label": "All"
        }, {
            "label": "Master Set"
        }, {
            "label": "Media Plans"
        }, {
            "label": "Constraints",
            "subMenu": [{
                "label": "Hard Constraints"
            }, {
                "label": "Soft Constraints"
            }]
        }, {
            "label": "Cost Assumptions"
        }, {
            "label": "Environmental Factors",
            "subMenu": [{
                "label": "Economic Variables"
            }, {
                "label": "Marketing Factors"
            }, {
                "label": "Competitive Spend"
            }, {
                "label": "Brand Awardness"
            }, {
                "label": "Pricing"
            }, {
                "label": "Product Factors"
            }]
        }, {
            "label": "Objectives"
        }, {
            "label": "Scenarios"
        }, {
            "label": "Playbook"
        }, {
            "label": "Decision Books"
        }];
    }).controller('FileBrowserCtrl', function($scope, filterService) {
        $scope.filterService = filterService;

        $scope.modalOpen = false;
        $scope.hideScenarios = false;

        $scope.$on('$close', function() {
            $scope.modalOpen = false;
        })

        $scope.stop = function(evt) {
            $scope.dontPassEvent(evt);
            $scope.modalOpen = true;
        }

        $scope.sortBy = function(which) {
            $scope.orderBy = which;
        }

        $scope.dontPassEvent = function(evt) {
            evt.stopPropagation();
            //evt.preventDefault();
        }

        $scope.toggleScenarioView = function(evt) {
            $scope.dontPassEvent(evt)
            $scope.hideScenarios = $scope.hideScenarios === false ? true : false;
        }

        $scope.updateName = function(data, list) {
            for (var x = 0, limit = list.length; x < limit; x++) {
                for (var prop in list[x]) {
                    if (list[x].hasOwnProperty(prop)) {
                        if (prop === "id" && list[x][prop] === +data.id) {
                            list[x]['name'] = data.name;
                            return;
                        }
                    }
                }
            }
        }

        $scope.$on('update', function(evt, data) {
            $scope.updateName(data, $scope.data)
        })

        $scope.data = [{
            "id": 1,
            "title": "Hit Target - Master",
            "description": "Praesent cursus",
            "createdBy": "Carl Sagan",
            "createdDate": "2014-02-11T20:08:15.136Z",
            "fileType": "Cost Assumptions",
            "search": "",
            "modifiedBy": "Fred Flintstone",
            "lastModified": "2014-01-05T20:08:15.136Z",
            "scenarios": [{
                "title": "Carl's Econ Variable Simulation 1",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Media Plans"
            }, {
                "title": "Al's AIB 2Q 2015 ",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Objectives"
            }, {
                "title": "Al's Simulate 2Q 2015",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Barney Rubble",
                "fileType": "Soft Constraints"
            }, {
                "title": "Ann's AIB Q1 2015 TV ONLY v3",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Media Plans"
            }, {
                "title": "Ann's Allocate 3Q",
                "lastModified": "2014-05-13T20:08:15.136Z",
                "modifiedBy": "Carl Sagan",
                "fileType": "Playbook"
            }, {
                "title": "Bob’s Simulate 4Q 2014",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Soft Constraints"
            }, {
                "title": "Brent's Simulate 3Q",
                "lastModified": "2014-05-14T20:08:15.136Z",
                "modifiedBy": "Carl Sagan",
                "fileType": "Scenarios"
            }, {
                "title": "Dan's Digital Hit Target",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Scenarios"
            }, {
                "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Scenarios"
            }, {
                "title": "Francis' Max Profit for Q4 2014",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Barney Rubble",
                "fileType": "Cost Assumptions"
            }],
            "masterSet": false
        }, {
            "id": 2,
            "title": "Marketing Playbook",
            "description": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nam adipiscing nulla sit amet nunc vehicula pellentesque",
            "createdBy": "Dan Cox",
            "createdDate": "2014-05-08T20:08:15.136Z",
            "fileType": "Cost Assumptions",
            "search": "",
            "modifiedBy": "Carl Sagan",
            "lastModified": "2014-04-24T20:08:15.136Z",
            "scenarios": [{
                "title": "Carl's Econ Variable Simulation 1",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Scenarios"
            }, {
                "title": "Al's AIB 2Q 2015 ",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Playbook"
            }, {
                "title": "Al's Simulate 2Q 2015",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Product Factors"
            }, {
                "title": "Ann's AIB Q1 2015 TV ONLY v3",
                "lastModified": "2014-05-13T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Media Plans"
            }, {
                "title": "Ann's Allocate 3Q",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Media Plans"
            }, {
                "title": "Bob’s Simulate 4Q 2014",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Brand Awardness"
            }, {
                "title": "Brent's Simulate 3Q",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Carl Sagan",
                "fileType": "Soft Constraints"
            }, {
                "title": "Dan's Digital Hit Target",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Brand Awardness"
            }, {
                "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Soft Constraints"
            }, {
                "title": "Francis' Max Profit for Q4 2014",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Decision Books"
            }],
            "masterSet": false
        }, {
            "id": 3,
            "title": "Good Econ 2015",
            "description": "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
            "createdBy": "Barney Rubble",
            "createdDate": "2013-12-02T20:08:15.136Z",
            "fileType": "Playbook",
            "search": "",
            "modifiedBy": "Fred Flintstone",
            "lastModified": "2014-03-24T20:08:15.136Z",
            "scenarios": [{
                "title": "Carl's Econ Variable Simulation 1",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Decision Books"
            }, {
                "title": "Al's AIB 2Q 2015 ",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Media Plans"
            }, {
                "title": "Al's Simulate 2Q 2015",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Hard Constraints"
            }, {
                "title": "Ann's AIB Q1 2015 TV ONLY v3",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Competitive Spend"
            }, {
                "title": "Ann's Allocate 3Q",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Decision Books"
            }, {
                "title": "Bob’s Simulate 4Q 2014",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Cost Assumptions"
            }, {
                "title": "Brent's Simulate 3Q",
                "lastModified": "2014-05-13T20:08:15.136Z",
                "modifiedBy": "Carl Sagan",
                "fileType": "Objectives"
            }, {
                "title": "Dan's Digital Hit Target",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Objectives"
            }, {
                "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
                "lastModified": "2014-05-14T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Objectives"
            }, {
                "title": "Francis' Max Profit for Q4 2014",
                "lastModified": "2014-05-14T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Soft Constraints"
            }],
            "masterSet": false
        }, {
            "id": 4,
            "title": "Hit Target - with exceptions",
            "description": "Cras auctor tellus ut massa convallis, vitae blandit nisi feugiat. Fusce venenatis purus id tempor semper. Quisque posuere in ipsum vel ullamcorper. Morbi a congue magna. Ut vel eleifend tortor. Suspendisse volutpat diam risus, sed ultrices tellus congue nec.",
            "createdBy": "Erik Lee",
            "createdDate": "2014-02-01T20:08:15.136Z",
            "fileType": "Soft Constraints",
            "search": "Constraints",
            "modifiedBy": "Carl Sagan",
            "lastModified": "2014-04-24T20:08:15.136Z",
            "scenarios": [{
                "title": "Carl's Econ Variable Simulation 1",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Brand Awardness"
            }, {
                "title": "Al's AIB 2Q 2015 ",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Economic Variables"
            }, {
                "title": "Al's Simulate 2Q 2015",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Barney Rubble",
                "fileType": "Media Plans"
            }, {
                "title": "Ann's AIB Q1 2015 TV ONLY v3",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Barney Rubble",
                "fileType": "Cost Assumptions"
            }, {
                "title": "Ann's Allocate 3Q",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Objectives"
            }, {
                "title": "Bob’s Simulate 4Q 2014",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Cost Assumptions"
            }, {
                "title": "Brent's Simulate 3Q",
                "lastModified": "2014-05-13T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Hard Constraints"
            }, {
                "title": "Dan's Digital Hit Target",
                "lastModified": "2014-05-14T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Playbook"
            }, {
                "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Hard Constraints"
            }, {
                "title": "Francis' Max Profit for Q4 2014",
                "lastModified": "2014-05-14T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Hard Constraints"
            }],
            "masterSet": false
        }, {
            "id": 5,
            "title": "Carl's Econ Variable Simulation 1",
            "description": "Nam dapibus metus orci, eu porttitor felis facilisis at.",
            "createdBy": "Dan Cox",
            "createdDate": "2013-12-19T20:08:15.136Z",
            "fileType": "Soft Constraints",
            "search": "Constraints",
            "modifiedBy": "Dan Cox",
            "lastModified": "2014-03-21T20:08:15.136Z",
            "scenarios": [{
                "title": "Carl's Econ Variable Simulation 1",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Cost Assumptions"
            }, {
                "title": "Al's AIB 2Q 2015 ",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Playbook"
            }, {
                "title": "Al's Simulate 2Q 2015",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Carl Sagan",
                "fileType": "Media Plans"
            }, {
                "title": "Ann's AIB Q1 2015 TV ONLY v3",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Hard Constraints"
            }, {
                "title": "Ann's Allocate 3Q",
                "lastModified": "2014-05-13T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Cost Assumptions"
            }, {
                "title": "Bob’s Simulate 4Q 2014",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Scenarios"
            }, {
                "title": "Brent's Simulate 3Q",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Scenarios"
            }, {
                "title": "Dan's Digital Hit Target",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Hard Constraints"
            }, {
                "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Barney Rubble",
                "fileType": "Media Plans"
            }, {
                "title": "Francis' Max Profit for Q4 2014",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Media Plans"
            }],
            "masterSet": false
        }, {
            "id": 6,
            "title": "All assumptions 2015",
            "description": "Nunc sagittis erat non odio sollicitudin varius. Integer sem ante, tincidunt id sapien a, faucibus auctor nisi. Praesent quis mattis enim, sed porttitor neque.",
            "createdBy": "Carl Sagan",
            "createdDate": "2013-12-11T20:08:15.136Z",
            "fileType": "Media Plans",
            "search": "",
            "modifiedBy": "Ann Kross",
            "lastModified": "2014-03-27T20:08:15.136Z",
            "scenarios": [{
                "title": "Carl's Econ Variable Simulation 1",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Cost Assumptions"
            }, {
                "title": "Al's AIB 2Q 2015 ",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Scenarios"
            }, {
                "title": "Al's Simulate 2Q 2015",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Playbook"
            }, {
                "title": "Ann's AIB Q1 2015 TV ONLY v3",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Objectives"
            }, {
                "title": "Ann's Allocate 3Q",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Cost Assumptions"
            }, {
                "title": "Bob’s Simulate 4Q 2014",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Cost Assumptions"
            }, {
                "title": "Brent's Simulate 3Q",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Barney Rubble",
                "fileType": "Scenarios"
            }, {
                "title": "Dan's Digital Hit Target",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Scenarios"
            }, {
                "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
                "lastModified": "2014-05-14T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Media Plans"
            }, {
                "title": "Francis' Max Profit for Q4 2014",
                "lastModified": "2014-05-13T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Decision Books"
            }],
            "masterSet": false
        }, {
            "id": 7,
            "title": "2015 Q3 Marketing Plan",
            "description": "Duis vel turpis nisl. Suspendisse semper feugiat quam, ut commodo arcu pulvinar id. Donec quis turpis sed lacus blandit pretium in eu nunc.",
            "createdBy": "Al Green",
            "createdDate": "2014-02-10T20:08:15.136Z",
            "fileType": "Media Plans",
            "search": "",
            "modifiedBy": "Fred Flintstone",
            "lastModified": "2014-01-09T20:08:15.136Z",
            "scenarios": [{
                "title": "Carl's Econ Variable Simulation 1",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Barney Rubble",
                "fileType": "Decision Books"
            }, {
                "title": "Al's AIB 2Q 2015 ",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Barney Rubble",
                "fileType": "Scenarios"
            }, {
                "title": "Al's Simulate 2Q 2015",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Scenarios"
            }, {
                "title": "Ann's AIB Q1 2015 TV ONLY v3",
                "lastModified": "2014-05-14T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Playbook"
            }, {
                "title": "Ann's Allocate 3Q",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Media Plans"
            }, {
                "title": "Bob’s Simulate 4Q 2014",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Decision Books"
            }, {
                "title": "Brent's Simulate 3Q",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Objectives"
            }, {
                "title": "Dan's Digital Hit Target",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Hard Constraints"
            }, {
                "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Media Plans"
            }, {
                "title": "Francis' Max Profit for Q4 2014",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Scenarios"
            }],
            "masterSet": false
        }, {
            "id": 8,
            "title": "Fred's Stuff",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dignissim a nisi non blandit. Nam gravida elit vel leo scelerisque, a semper magna blandit. Phasellus et sapien metus. Maecenas sit amet nisl eros. Nam id vehicula eros. Morbi sapien neque, dictum eget lacus quis, congue posuere velit.",
            "createdBy": "Ann Kross",
            "createdDate": "2013-12-10T20:08:15.136Z",
            "fileType": "Pricing",
            "search": "Environmental Factors",
            "modifiedBy": "Carl Sagan",
            "lastModified": "2013-11-23T20:08:15.136Z",
            "scenarios": [{
                "title": "Carl's Econ Variable Simulation 1",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Hard Constraints"
            }, {
                "title": "Al's AIB 2Q 2015 ",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Media Plans"
            }, {
                "title": "Al's Simulate 2Q 2015",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Cost Assumptions"
            }, {
                "title": "Ann's AIB Q1 2015 TV ONLY v3",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Playbook"
            }, {
                "title": "Ann's Allocate 3Q",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Decision Books"
            }, {
                "title": "Bob’s Simulate 4Q 2014",
                "lastModified": "2014-05-14T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Media Plans"
            }, {
                "title": "Brent's Simulate 3Q",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Objectives"
            }, {
                "title": "Dan's Digital Hit Target",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Ann Kross",
                "fileType": "Media Plans"
            }, {
                "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Objectives"
            }, {
                "title": "Francis' Max Profit for Q4 2014",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Objectives"
            }],
            "masterSet": false
        }, {
            "id": 9,
            "title": "2014 Q2 Mareting Plan",
            "description": "Nullam lobortis placerat massa eu fermentum. Proin interdum ipsum eu urna malesuada tincidunt. Morbi velit enim, faucibus quis neque sed, aliquet vestibulum mi.",
            "createdBy": "Fred Flintstone",
            "createdDate": "2014-03-24T20:08:15.136Z",
            "fileType": "Pricing",
            "search": "Environmental Factors",
            "modifiedBy": "Bob Belcher",
            "lastModified": "2014-02-15T20:08:15.136Z",
            "scenarios": [{
                "title": "Carl's Econ Variable Simulation 1",
                "lastModified": "2014-05-14T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Cost Assumptions"
            }, {
                "title": "Al's AIB 2Q 2015 ",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Scenarios"
            }, {
                "title": "Al's Simulate 2Q 2015",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Objectives"
            }, {
                "title": "Ann's AIB Q1 2015 TV ONLY v3",
                "lastModified": "2014-05-14T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Playbook"
            }, {
                "title": "Ann's Allocate 3Q",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Objectives"
            }, {
                "title": "Bob’s Simulate 4Q 2014",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Playbook"
            }, {
                "title": "Brent's Simulate 3Q",
                "lastModified": "2014-05-19T20:08:15.136Z",
                "modifiedBy": "Barney Rubble",
                "fileType": "Playbook"
            }, {
                "title": "Dan's Digital Hit Target",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Carl Sagan",
                "fileType": "Objectives"
            }, {
                "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Playbook"
            }, {
                "title": "Francis' Max Profit for Q4 2014",
                "lastModified": "2014-05-17T20:08:15.136Z",
                "modifiedBy": "Al Green",
                "fileType": "Playbook"
            }],
            "masterSet": false
        }, {
            "id": 10,
            "title": "Bad Economic Variables 2015 March",
            "description": "Pellentesque eleifend, turpis rutrum ornare lacinia, sem purus commodo arcu, eget condimentum lorem nisi quis eros. Proin bibendum, purus ut tempus cursus, enim urna sodales lacus, at volutpat erat mauris in massa. Phasellus commodo risus vitae risus volutpat tempus.",
            "createdBy": "Al Green",
            "createdDate": "2014-05-05T20:08:15.136Z",
            "fileType": "Scenarios",
            "search": "",
            "modifiedBy": "Barney Rubble",
            "lastModified": "2013-12-18T20:08:15.136Z",
            "scenarios": [{
                "title": "Carl's Econ Variable Simulation 1",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Objectives"
            }, {
                "title": "Al's AIB 2Q 2015 ",
                "lastModified": "2014-05-15T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Objectives"
            }, {
                "title": "Al's Simulate 2Q 2015",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Brand Awardness"
            }, {
                "title": "Ann's AIB Q1 2015 TV ONLY v3",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Fred Flintstone",
                "fileType": "Hard Constraints"
            }, {
                "title": "Ann's Allocate 3Q",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Erik Lee",
                "fileType": "Scenarios"
            }, {
                "title": "Bob’s Simulate 4Q 2014",
                "lastModified": "2014-05-18T20:08:15.136Z",
                "modifiedBy": "Dan Cox",
                "fileType": "Soft Constraints"
            }, {
                "title": "Brent's Simulate 3Q",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Product Factors"
            }, {
                "title": "Dan's Digital Hit Target",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Carl Sagan",
                "fileType": "Scenarios"
            }, {
                "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
                "lastModified": "2014-05-20T20:08:15.136Z",
                "modifiedBy": "Barney Rubble",
                "fileType": "Decision Books"
            }, {
                "title": "Francis' Max Profit for Q4 2014",
                "lastModified": "2014-05-16T20:08:15.136Z",
                "modifiedBy": "Bob Belcher",
                "fileType": "Hard Constraints"
            }],
            "masterSet": false
        }]

    });