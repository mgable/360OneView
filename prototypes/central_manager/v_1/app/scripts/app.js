'use strict';

angular
    .module('ThreeSixtyOneView', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',
        'pasvaz.bindonce',
        '/name.html',
        'dialogs.main',
        '/msDropdown.html'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/display_manager.tpl.html',
                controller: 'ManagerCtrl',
                viewName: "CentralManager"
            })
            .when('/scenarioEdit', {
                templateUrl: 'views/scenario_edit.tpl.html',
                controller: 'ScenarioEditCtrl'
            })
            .when('/projects', {
                templateUrl: 'views/display_manager.tpl.html',
                controller: 'ManagerCtrl',
                viewName: "ProjectManager"
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function() {
        String.prototype.bool = function() {
            return (/^true$/i).test(this);
        };
    })
    .run(function(FilesModel, ProjectsModel) {
        FilesModel.$find();
        ProjectsModel.$find();
    }).constant('CONFIG', {
        "application": {
            menus: {
                displayColumns: [{
                    label: "Last Modified"
                }, {
                    label: "Modified By",
                    filters: [{
                        label: "Modified by me",
                        filter: "modifiedBy"
                    }, {
                        label: "Modified by:",
                        filter: "modifiedBy"
                    }],
                    template: "/name.html",
                    enabledOn: "Modified by:"
                }, {
                    label: "Type"
                }, {
                    label: "Owner",
                    filters: [{
                        label: "Owned by me",
                        filter: "owner"
                    }, {
                        label: "Owned by:",
                        filter: "owner"
                    }],
                    template: "/name.html",
                    enabledOn: "Owned by:"
                }, {
                    label: "Defaults",
                    filters: [{
                        label: "Show only defaults",
                        filter: "defaults"
                    }]
                }]
            }
        },
        "session": {},
        "view": {
            "CentralManager": {
                "model": "FilesModel",
                "orderBy": 'Last Modified',
                "filter": 'CONFIG.view.CentralManager.menuItems.items[0]',
                "reverse": true,
                "menuItems": {
                    firstSelected: 0,
                    title: "Scenario Elements",
                    icon: "cog",
                    items: [{
                        label: "defaults",
                        filterType: "activeFilter",
                        filter: {
                            "defaults": true
                        }
                    }, {
                        label: "Economy",
                        filterType: "activeFilter",
                        filter: {
                            type: "Economy"
                        }
                    }, {
                        label: "Competition",
                        filterType: "activeFilter",
                        filter: {
                            type: "Competition"
                        }
                    }, {
                        label: "Labor Cost",
                        filterType: "activeFilter",
                        filter: {
                            type: "Labor Cost"
                        }
                    }, {
                        label: "Pricing",
                        filterType: "activeFilter",
                        filter: {
                            type: "Pricing"
                        }
                    }, {
                        label: "Cost Assumptions",
                        filterType: "activeFilter",
                        filter: {
                            type: "Cost Assumptions"
                        }
                    }]
                },
                "contextualMenu": {
                    actions: ['copy', 'sharing', 'rename', 'delete', 'add', 'details'],
                    views: {
                        "defaults": {
                            "type": "master",
                            "value": "100001"
                        },
                        "access": {
                            "type": "view only",
                            "value": "100001"
                        },
                        "otherwise": "101101"
                    }
                }
            },
            "ProjectManager": {
                "model": "ProjectsModel",
                "orderBy": 'Last Modified',
                "filter": 'CONFIG.view.ProjectManager.menuItems.items[0]',
                "reverse": true,
                "menuItems": {
                    firstSelected: 0,
                    icon: "suitcase",
                    title: "Projects",
                    items: [{
                        label: "All",
                        filterType: "activeFilter",
                        filter: {}
                    }, {
                        label: "Favorites",
                        filterType: "filterPipeline",
                        filter: "favorites"
                    }, {
                        label: "Created by me",
                        filterType: "activeFilter",
                        filter: {
                            owner: "Barney Rubble"
                        }
                    }, {
                        label: "I can edit",
                        filterType: "activeFilter",
                        filter: {
                            access: "Everyone can edit"
                        }
                    }]
                },
                "contextualMenu": {
                    actions: ['copy', 'favorites', 'sharing', 'rename', 'delete', 'add', 'details'],
                    views: {
                        "defaults": {
                            "type": "master",
                            "value": "1000001"
                        },
                        "access": {
                            "type": "view only",
                            "value": "1100001"
                        },
                        "otherwise": "1101101"
                    }
                }
            }
        },
        "user": {
            "name": "Fred Flintstone",
            "role": "default user",
            "favorites": []
        }
    });

/* template for drop down menu filter input field */
angular.module('/name.html', []).run(['$templateCache',
    function($templateCache) {
        $templateCache.put('/name.html',
            '<li class="ms-holder"><input type="text" class="ms-name-input" ng-model="name" placeholder="Enter Name" ng-disabled="enabledOn(selectedFilter)" ng-click="dontPassEvent($event)"/></li>' +
            '<li class="ms-holder"><button class="btn btn-primary ms-apply submit-button"  ' +
            'ng-disabled="name == \'\' || enabledOn(selectedFilter)" ng-click="submit(name)">apply</button></li>'
        );
    }
]);

/* template for drop down menus */
angular.module('/msDropdown.html', []).run(['$templateCache',
    function($templateCache) {
        $templateCache.put('/msDropdown.html',
            '<div class="ms-dropdown" id="{{id}}">' +
            '<h6 class="ms-label" ng-class=\"{active: DropdownService.getActive() === id}\"><span ng-click="select(selectedItem)" class="status">{{selectedItem.label}}</span>&nbsp<span ng-click="toggle(id)" class="glyphicon glyphicon-collapse-down"></span></h6>' +
            '<ul class="ms-select-list dropshadow hide">' +
            '<li class="ms-item" ng-repeat="item in items" ng-class="{disabled:item.label === selectedItem.label}" ng-click="selectSort(item)"><span class="glyphicon glyphicon-ok ms-ok"></span>{{item.label}}</li>' +
            '<ul ng-if="selectedItem.filters">' +
            '<li class="divider"></li>' +
            '<li class="ms-sublabel">FILTER</li>' +
            '<li ng-repeat="filter in selectedItem.filters" class="ms-item" ng-click="selectFilter(filter)" ng-class="{selected:selectedFilter === filter}"><span class="glyphicon glyphicon-ok ms-ok"></span>{{filter.label}}</li>' +
            '<li ng-if="selectedItem.template"><ng-include src="selectedItem.template"></ng-include></li>' +
            '</ul>' +
            '</ul>' +
            '</div>'
        );
    }
]);