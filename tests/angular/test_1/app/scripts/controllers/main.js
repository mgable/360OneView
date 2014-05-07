/* jshint unused:false */

'use strict';

angular.module('test1App')
    .controller('DashboardViewCtrl', function($scope, Pagemanager, StoogesFactory) {
        Pagemanager.view($scope, 'dashboard');
        $scope.stooges = StoogesFactory.get();
    })
    .controller('DecisionbookViewCtrl', function($scope, Pagemanager) {
        Pagemanager.view($scope, 'decisionbook');
    })
    .controller('MainCtrl', function($scope, $location, $rootScope) {
        // $scope.selectedMenuItem = '';
        console.info('main coontroller');
    })
    .controller('LogInViewCtrl', function($scope, $location, dialogs) {
        var dlg = dialogs.create('/views/modals/login.html', 'LogInDialogCtrl', {});
        dlg.result.then(function(user) {
            //save
            $location.path('/dashboard');
        }, function() {
            //dismiss
        });
    })
    .controller('LogInDialogCtrl', function($scope, $modalInstance, Permissionsmanager) {
        $scope.user = {};
        //     username: '',
        //     password: '',
        //     errorMsg: ''
        // };
        // $scope.cancel = function() {
        //     $modalInstance.dismiss('canceled');
        // }; // end cancel

        $scope.save = function() {
            Permissionsmanager.login($scope.user.username, $scope.user.password).then(function(result) {
                _something(result);
            });

        }; // end save

        $scope.hitEnter = function(evt) {
            if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.user.username, null) || angular.equals($scope.user.username, ''))) {
                $scope.save();
            }
        }; // end hitEnter

        var _something = function(result) {
            if (result) {
                $modalInstance.close($scope.user);
            } else {
                $scope.user.errorMsg = Permissionsmanager.getErrorMsg();
            }
        };
    });