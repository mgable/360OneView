'use strict';

angular.module('filemanagerApp')
    .controller('MainCtrl', function($scope) {

    }).controller('FileManagerNavigationCtrl', function($scope) {
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
    }).controller('FileBrowserCtrl', function($scope) {

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
            "icon": "M",
            "name": "Carls\' Econ Variables Scenario 1",
            "modifiedBy": "Carl Sagan",
            "lastModified": "30 days ago",
            "fileType": "Scenario",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt ligula vitae mi interdum suscipit. Sed lectus sapien, cursus et purus nec, cursus semper tellus. Sed id aliquet nulla, nec porttitor dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
            "scenarios": [{
                "icon": "S",
                "name": "Vern's AIB 2Q 2015",
                "lastModified": "2 days ago",
                "modifiedBy": "Al Green"
            }, {
                "icon": "M",
                "name": "Fred\'s AIB 2014",
                "lastModified": "1 days ago",
                "modifiedBy": "Wilma Flintstone"
            }, {
                "icon": "A",
                "name": "Just a test",
                "lastModified": "2 weeks ago",
                "modifiedBy": "Barney Rubble"
            }, {
                "icon": "C",
                "name": "Dino Hit Target test",
                "lastModified": "10 minutes ago",
                "modifiedBy": "Dino the Dino"
            }, {
                "icon": "M",
                "name": "Fred Allocat Q3 2013",
                "lastModified": "1 year ago",
                "modifiedBy": "Fred Flintstone"
            }, {
                "icon": "A",
                "name": "2014 Re-Allocate",
                "lastModified": "4 hours ago",
                "modifiedBy": "Betty Rubble"
            }]
        }, {
            "id": 2,
            "icon": "A",
            "name": "Zeke\'s Assumptions 2015",
            "modifiedBy": "Pete Moffett",
            "lastModified": "1 week ago",
            "fileType": "Econ Variable",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt ligula vitae mi interdum suscipit. Sed lectus sapien, cursus et purus nec, cursus semper tellus. Sed id aliquet nulla, nec porttitor dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
            "scenarios": [{
                "icon": "A",
                "name": "Zekes Simulate 2Q 2015",
                "lastModified": "1 day ago",
                "modifiedBy": "Ann Kross"
            }, {
                "icon": "M",
                "name": "Al 's AIB 2Q 2015",
                "lastModified": "30 days ago",
                "modifiedBy": "Fred Flintstone"
            }, {
                "icon": "S",
                "name": "Bob\'s Simulate 4Q 2014",
                "lastModified": "30 days ago",
                "modifiedBy": "Barney Rubble"
            }, {
                "icon": "H",
                "name": "Ann\'s Allocate 3Q",
                "lastModified": "30 days ago",
                "modifiedBy": "George Jetson"
            }, {
                "icon": "M",
                "name": "Dan\'s Digital Hit Target",
                "lastModified": "30 days ago",
                "modifiedBy": "Al Green"
            }, {
                "icon": "S",
                "name": "Brent\'s Simulate 2014",
                "lastModified": "30 days ago",
                "modifiedBy": "Freddy Mercury"
            }]
        }]

    });