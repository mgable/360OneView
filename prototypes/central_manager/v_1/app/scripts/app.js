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
        '/tpl.html'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/central_manager.tpl.html',
                controller: 'CentralManagerCtrl',
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function(FilesModel) {
        FilesModel.$find();
    }).constant('SEARCHITEMS', [{
        label: 'Default Scenarios Elements'
    }, {
        label: 'Non-Marketing Factors',
        subMenu: [{
            label: 'Economy'
        }, {
            label: 'Competition'
        }, {
            label: 'Labor Cost'
        }, {
            label: 'Pricing'
        }]
    }, {
        label: 'Cost Assumptions'
    }]).constant('DROPDOWNITEMS', [{
        label: "Last Modified"
    }, {
        label: "Modified By",
        filters: [{
            label: 'Modified by me',
            term: "modifiedBy"
        }, {
            label: 'Modified by:',
            term: "modifiedBy"
        }],
        template: '/name.html',
        enabledOn: 'Modified by:'
    }, {
        label: "Type"
    }, {
        label: "Owner",
        filters: [{
            label: 'Owned by me',
            term: 'owner'
        }, {
            label: 'Owned by:',
            term: 'owner'
        }],
        template: '/name.html',
        enabledOn: 'Owned by:'
    }, {
        label: "Defaults",
        filters: [{
            label: 'Show only defaults'
        }]
    }]);

angular.module('/name.html', []).run(['$templateCache',
    function($templateCache) {
        $templateCache.put('/name.html',
            '<li class="ms-holder"><input type="text" class="ms-name-input" ng-model="name" placeholder="Enter Name" ng-disabled="enabledOn(selectedFilter)" ng-click="dontPassEvent($event)"/></li>' +
            '<li class="ms-holder"><button class="btn btn-primary ms-apply submit-button"  ' +
            'ng-disabled="name == \'\' || enabledOn(selectedFilter)" ng-click="submit(name)">apply</button></li>'
        );
    }
]);

angular.module('/tpl.html', []).run(['$templateCache',
    function($templateCache) {
        $templateCache.put('/tpl.html',
            '<div class="ms-dropdown" id="{{id}}">' +
            '<h6 class="ms-label" ng-class=\"{active: DropdownService.getActive() === id}\"><span ng-click="selectSort(selectedItem)" class="status">{{selectedItem.label}}</span>&nbsp<span ng-click="toggle(id)" class="glyphicon glyphicon-collapse-down"></span></h6>' +
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