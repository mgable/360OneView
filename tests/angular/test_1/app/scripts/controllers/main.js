'use strict';

angular.module('test1App')
    .controller('MainCtrl', function($scope) {
        $scope.menuItems = [{
            'icon': 'glyphicon-search',
            'label': 'Dashboard',
            'url': '/dashboard'
        }, {
            'icon': 'glyphicon-glass',
            'label': 'Decision Book',
            'url': '/decisionbook'
        }, {
            'icon': 'glyphicon-cloud',
            'label': 'Projects',
            'url': '/decisionbook'
        }, {
            'icon': 'glyphicon-file',
            'label': 'Analysis',
            'url': '/decisionbook'
        }, {
            'icon': 'glyphicon-home',
            'label': 'Task',
            'url': '/decisionbook'
        }, {
            'icon': 'glyphicon-cog',
            'label': 'Messages',
            'url': '/decisionbook'
        }]
    })
    .controller('dashboardCtrl', function($scope) {
        $scope.menuItems = [{
            'icon': 'glyphicon-heart',
            'label': 'Foo',
            'url': '/'
        }, {
            'icon': 'glyphicon-refresh',
            'label': 'Bar',
            'url': '/'
        }, {
            'icon': 'glyphicon-play-circle',
            'label': 'FooBar',
            'url': '/'
        }, {
            'icon': 'glyphicon-upload',
            'label': 'FooBarBuzz',
            'url': '/'
        }, {
            'icon': 'glyphicon-lock',
            'label': 'Video',
            'url': '/'
        }, {
            'icon': 'glyphicon-flag',
            'label': 'Tweets',
            'url': '/'
        }]
    })
    .controller('decisionbookCtrl', function($scope) {
        $scope.menuItems = [{
            'icon': 'glyphicon-road',
            'label': 'Dashboard'
        }, {
            'icon': 'glyphicon-tag',
            'label': 'Decision Book'
        }, {
            'icon': 'glyphicon-camera',
            'label': 'Projects'
        }, {
            'icon': 'glyphicon-map-marker',
            'label': 'Analysis'
        }, {
            'icon': 'glyphicon-plus-sign',
            'label': 'Task'
        }, {
            'icon': 'glyphicon-remove-sign',
            'label': 'Messages'
        }]
    });