'use strict';

angular.module('filemanagerApp')
    .controller('MainCtrl', function($scope) {
        // $scope.toggleSelected = function(index) {
        //     console.info(index);
        //     if (index !== $scope.selectedIndex) {
        //         $scope.selectedIndex = index;
        //     } else {
        //         $scope.selectedIndex = -1;
        //     }
        // };

        // $scope.getClass = function(index) {
        //     if (index === $scope.selectedIndex) {
        //         return 'selected';
        //     } else {
        //         return '';
        //     }
        // }
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
                "label": "Proudct Factors"
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
        //$scope.selectedIndex = 0;

        $scope.hideScenarios = false;
        $scope.stop = function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            console.info(evt);
        }

        $scope.sortBy = function(which) {
            $scope.orderBy = which;
            $scope.reverse = !$scope.reverse;
        }

        $scope.toggleScenarioView = function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $scope.hideScenarios = $scope.hideScenarios === false ? true : false;
        }

        $scope.$on('update', function(evt, data) {
            $scope.data[data.position][data.position]['name'] = data.name;
        })

        $scope.data = [{
            0: {
                "icon": "M",
                "name": "Carls\' Econ Variables Scenario 1",
                "author": "Carl Sagan",
                "lastModified": "30 days ago",
                "fileType": "Scenario",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt ligula vitae mi interdum suscipit. Sed lectus sapien, cursus et purus nec, cursus semper tellus. Sed id aliquet nulla, nec porttitor dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
                "scenarios": [{
                    "icon": "M",
                    "name": "Al's AIB 2Q 2015",
                    "lastModified": "30 days ago",
                    "author": "Al Green"
                }, {
                    "icon": "M",
                    "name": "Al 's AIB 2Q 2015",
                    "lastModified": "30 days ago",
                    "author": "Al Green"
                }, {
                    "icon": "M",
                    "name": "Al\'s AIB 2Q 2015 ",
                    "lastModified": "30 days ago",
                    "author": "Al Green"
                }, {
                    "icon": "M",
                    "name": "Al's AIB 2Q 2015",
                    "lastModified": "30 days ago",
                    "author": "Al Green"
                }, {
                    "icon": "M",
                    "name": "Al 's AIB 2Q 2015",
                    "lastModified": "30 days ago",
                    "author": "Al Green"
                }, {
                    "icon": "M",
                    "name": "Al\'s AIB 2Q 2015 ",
                    "lastModified": "30 days ago",
                    "author": "Al Green"
                }]
            }
        }, {
            1: {
                "icon": "A",
                "name": "Zeke\'s' Assumptions 2015",
                "author": "Pete Moffett",
                "lastModified": "1 week ago",
                "fileType": "Econ Variable",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt ligula vitae mi interdum suscipit. Sed lectus sapien, cursus et purus nec, cursus semper tellus. Sed id aliquet nulla, nec porttitor dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
                "scenarios": [{
                    "icon": "A",
                    "name": "Al\'s Simulate 2Q 2015",
                    "lastModified": "1 day ago",
                    "author": "Ann Kross"
                }, {
                    "icon": "M",
                    "name": "Al 's AIB 2Q 2015",
                    "lastModified": "30 days ago",
                    "author": "Fred Flintstone"
                }, {
                    "icon": "S",
                    "name": "Bob\'s Simulate 4Q 2014",
                    "lastModified": "30 days ago",
                    "author": "Barney Rubble"
                }, {
                    "icon": "H",
                    "name": "Ann\'s Allocate 3Q",
                    "lastModified": "30 days ago",
                    "author": "George Jetson"
                }, {
                    "icon": "M",
                    "name": "Dan\'s Digital Hit Target",
                    "lastModified": "30 days ago",
                    "author": "Al Green"
                }, {
                    "icon": "S",
                    "name": "Brent\'s Simulate 2014",
                    "lastModified": "30 days ago",
                    "author": "Freddy Mercury"
                }]
            }
        }]

    });