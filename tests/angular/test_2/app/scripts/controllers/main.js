'use strict';

angular.module('filemanagerApp')
    .controller('MainCtrl', function($scope) {

    }).controller('FileManagerNavigationCtrl', function($scope, filterService) {
        $scope.filterService = filterService;

        $scope.setFilter = function(filter, other) {
            if (other) {
                filterService.activeFilters.search = filter;
                filterService.activeFilters.fileType = (typeof other === "string") ? other : "";
            } else {
                filterService.activeFilters.fileType = filter === "All" ? "" : filter;
                filterService.activeFilters.search = "";
            }
            console.info(filterService.activeFilters);
        }


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
            evt.stopPropagation();
            evt.preventDefault();
            $scope.modalOpen = true;
        }

        $scope.sortBy = function(which) {
            $scope.orderBy = which;
        }

        $scope.toggleScenarioView = function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
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
            "title": "Al's Simulate 2Q 2015",
            "description": "Praesent cursus",
            "fileType": "Playbook",
            "search": "",
            "modifiedBy": "Barney Rubble",
            "lastModified": "2013-10-12T18:09:34.281Z",
            "masterSet": false
        }, {
            "id": 2,
            "title": "Dan's Digital Hit Target",
            "description": "Pellentesque eleifend, turpis rutrum ornare lacinia, sem purus commodo arcu, eget condimentum lorem nisi quis eros. Proin bibendum, purus ut tempus cursus, enim urna sodales lacus, at volutpat erat mauris in massa. Phasellus commodo risus vitae risus volutpat tempus.",
            "fileType": "Cost Assumptions",
            "search": "",
            "modifiedBy": "Barney Rubble",
            "lastModified": "2013-09-21T18:09:34.281Z",
            "masterSet": false
        }, {
            "id": 3,
            "title": "Bob’s Simulate 4Q 2014",
            "description": "Cras auctor tellus ut massa convallis, vitae blandit nisi feugiat. Fusce venenatis purus id tempor semper. Quisque posuere in ipsum vel ullamcorper. Morbi a congue magna. Ut vel eleifend tortor. Suspendisse volutpat diam risus, sed ultrices tellus congue nec.",
            "fileType": "Product Factors",
            "search": "Environmental Factors",
            "modifiedBy": "Carl Sagan",
            "lastModified": "2013-07-08T18:09:34.281Z",
            "masterSet": false
        }, {
            "id": 4,
            "title": "Erik's Cut Budget 2Q 2015 TV and Radio",
            "description": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nam adipiscing nulla sit amet nunc vehicula pellentesque",
            "fileType": "Decision Books",
            "search": "",
            "modifiedBy": "Al Green",
            "lastModified": "2013-06-22T18:09:34.281Z",
            "masterSet": false
        }, {
            "id": 5,
            "title": "Al's AIB 2Q 2015 ",
            "description": "Nullam lobortis placerat massa eu fermentum. Proin interdum ipsum eu urna malesuada tincidunt. Morbi velit enim, faucibus quis neque sed, aliquet vestibulum mi.",
            "fileType": "Media Plans",
            "search": "",
            "modifiedBy": "Fred Flintstone",
            "lastModified": "2013-06-03T18:09:34.281Z",
            "masterSet": false
        }, {
            "id": 6,
            "title": "Ann’s Allocate 3Q",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dignissim a nisi non blandit. Nam gravida elit vel leo scelerisque, a semper magna blandit. Phasellus et sapien metus. Maecenas sit amet nisl eros. Nam id vehicula eros. Morbi sapien neque, dictum eget lacus quis, congue posuere velit.",
            "fileType": "Scenarios",
            "search": "",
            "modifiedBy": "Fred Flintstone",
            "lastModified": "2014-04-12T18:09:34.281Z",
            "masterSet": false
        }, {
            "id": 7,
            "title": "Carl's Econ Variable Simulation 1",
            "description": "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
            "fileType": "Playbook",
            "search": "",
            "modifiedBy": "Barney Rubble",
            "lastModified": "2013-11-22T18:09:34.281Z",
            "masterSet": false
        }, {
            "id": 8,
            "title": "Francis' Max Profit for Q4 2014",
            "description": "Duis vel turpis nisl. Suspendisse semper feugiat quam, ut commodo arcu pulvinar id. Donec quis turpis sed lacus blandit pretium in eu nunc.",
            "fileType": "Scenarios",
            "search": "",
            "modifiedBy": "Bob Belcher",
            "lastModified": "2013-08-08T18:09:34.281Z",
            "masterSet": false
        }, {
            "id": 9,
            "title": "Brent's Simulate 3Q",
            "description": "Nunc sagittis erat non odio sollicitudin varius. Integer sem ante, tincidunt id sapien a, faucibus auctor nisi. Praesent quis mattis enim, sed porttitor neque.",
            "fileType": "Hard Constraints",
            "search": "Constraints",
            "modifiedBy": "Ann Kross",
            "lastModified": "2013-07-04T18:09:34.281Z",
            "masterSet": false
        }, {
            "id": 10,
            "title": "Ann’s AIB Q1 2015 TV ONLY v3",
            "description": "Nam dapibus metus orci, eu porttitor felis facilisis at.",
            "fileType": "Decision Books",
            "search": "",
            "modifiedBy": "Al Green",
            "lastModified": "2014-01-07T18:09:34.281Z",
            "masterSet": false
        }]

    });