'use strict';

angular
    .module('centralManagerApp', [
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
                templateUrl: 'views/central_manager.tpl.html',
                controller: 'CentralManagerCtrl'
            })
            .when('/scenarioEdit', {
                templateUrl: 'views/scenario_edit.tpl.html',
                controller: 'ScenarioEditCtrl'
            })
            .when('/projects', {
                templateUrl: 'views/projects.tpl.html',
                controller: 'ProjectManagerCtrl'
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
    }).constant('PROJECTS', {
        firstSelected: 'All Projects',
        title: 'Projects',
        items: [{
            label: 'All Projects',
            filter: {}
        }, {
            label: 'Favorite Projects',
            filter: {
                'favorites': true
            }
        }]
    }).constant('CENTRALMANAGER', {
        firstSelected: 'defaults',
        title: 'Scenario Elements',
        items: [{
            label: 'defaults',
            filter: {
                'defaults': true
            }
        }, {
            label: 'Economy',
            filter: {
                type: 'Economy'
            }
        }, {
            label: 'Competition',
            filter: {
                type: 'Competition'
            }
        }, {
            label: 'Labor Cost',
            filter: {
                type: 'Labor Cost'
            }
        }, {
            label: 'Pricing',
            filter: {
                type: 'Pricing'
            }
        }, {
            label: 'Cost Assumptions',
            filter: {
                type: 'Cost Assumptions'
            }
        }]
    }).constant('DROPDOWNITEMS', [{
        label: "Last Modified"
    }, {
        label: "Modified By",
        filters: [{
            label: 'Modified by me',
            filter: "modifiedBy"
        }, {
            label: 'Modified by:',
            filter: "modifiedBy"
        }],
        template: '/name.html',
        enabledOn: 'Modified by:'
    }, {
        label: "Type"
    }, {
        label: "Owner",
        filters: [{
            label: 'Owned by me',
            filter: 'owner'
        }, {
            label: 'Owned by:',
            filter: 'owner'
        }],
        template: '/name.html',
        enabledOn: 'Owned by:'
    }, {
        label: "Defaults",
        filters: [{
            label: 'Show only defaults',
            filter: 'defaults'
        }]
    }]).constant("USERDATA", {
        username: 'Fred Flintstone',
        favorites: []
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