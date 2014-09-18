'use strict';

angular.module('ThreeSixtyOneView.services', ['dialogs.main', 'ThreeSixtyOneView.filters']);
angular.module('ThreeSixtyOneView.directives', ['ThreeSixtyOneView.services']);
angular.module('ThreeSixtyOneView.filters', []);
angular.module('ThreeSixtyOneView.config',[]);

angular.module('ThreeSixtyOneView', [
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    // 'pasvaz.bindonce',
    // 'LocalStorageModule',
    'ui.utils',
    'dialogs.main',
    'ThreeSixtyOneView.directives',
    'ThreeSixtyOneView.services',
    'ThreeSixtyOneView.config'
]);