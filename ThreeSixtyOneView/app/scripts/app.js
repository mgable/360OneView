'use strict';

angular.module('ThreeSixtyOneView.services', ['dialogs.main', 'ThreeSixtyOneView.filters']);
angular.module('ThreeSixtyOneView.directives', ['ThreeSixtyOneView.services']);
angular.module('ThreeSixtyOneView.filters', []);
angular.module('ThreeSixtyOneView.config',['ui.router']);

angular.module('ThreeSixtyOneView', [
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ui.bootstrap',
    'ui.utils',
    'dialogs.main',
    'ui.router',
    'ui.sortable',
    'ThreeSixtyOneView.directives',
    'ThreeSixtyOneView.services',
    'ThreeSixtyOneView.config',
    'wijspread',
    'sf.virtualScroll',
    'blndspt.ngPerformance'
]);