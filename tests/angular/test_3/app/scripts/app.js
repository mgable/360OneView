'use strict';

angular
    .module('fileManagerApp', [
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.mspopover'
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
    .constant('SERVER', 'http://127.0.0.1:3001')
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
        'label': 'Created by me',
        'filter': 'Ann Kross'
    }, {
        'label': 'Imported documents',
        'filter': 'imported'
    }])
    .run(function(FilesModel) {
        FilesModel.$find();
    });