'use strict';

angular
    .module('fileManagerApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.mspopover',
        '/views/directives/popoverTemplate.html'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/fileManager.html',
                controller: 'FileManagerCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .constant('SEARCHITEMS', [{
        'label': 'All'
    }, {
        'label': 'Master Set'
    }, {
        'label': 'Media Plans'
    }, {
        'label': 'Constraints',
        'subMenu': [{
            'label': 'Hard Constraints'
        }, {
            'label': 'Soft Constraints'
        }]
    }, {
        'label': 'Cost Assumptions'
    }, {
        'label': 'Environmental Factors',
        'subMenu': [{
            'label': 'Economic Variables'
        }, {
            'label': 'Marketing Factors'
        }, {
            'label': 'Competitive Spend'
        }, {
            'label': 'Brand Awardness'
        }, {
            'label': 'Pricing'
        }, {
            'label': 'Product Factors'
        }]
    }, {
        'label': 'Objectives'
    }, {
        'label': 'Scenarios'
    }, {
        'label': 'Playbook'
    }, {
        'label': 'Decision Books'
    }]).constant('FILTERBY', [{
        'label': 'Nothing',
        'filter': {}
    }, {
        'label': 'Created by me',
        'filter': {
            'createdBy': 'Ann Kross'
        }
    }, {
        'label': 'Imported documents',
        'filter': {
            'imported': true
        }
    }]).constant('DATERANGE', [{
        'label': 'All Time',
        'filter': '0'
    }, {
        'label': 'Last Week',
        'filter': 7
    }, {
        'label': 'Last Month',
        'filter': 31
    }, {
        'label': 'Last Quarter',
        'filter': 90
    }, {
        'label': 'Last Year',
        'filter': 365
    }])
    .run(function(FilesModel) {
        FilesModel.$find();
    });

angular.module('/views/directives/popoverTemplate.html', []).run(['$templateCache',
    function($templateCache) {
        $templateCache.put('/views/directives/popoverTemplate.html',
            "<div>" +
            "<div ng-hide='completed'>" +
            "<div class='text'>{{text}}</div>" +
            "<div style='white-space:nowrap;margin:5px 0 5px;' class='pull-right'><button class='btn btn-primary' ng-click='submit($event)'>Ok</button>&nbsp;<button ng-click='cancel($event)' class='btn btn-default'>Cancel</button></div>" +
            "</div>" +
            "<div ng-show='completed'>" +
            "<div class='text'>{{completedtext}}</div>" +
            "</div>" +
            "</div>"

        );
    }
]);