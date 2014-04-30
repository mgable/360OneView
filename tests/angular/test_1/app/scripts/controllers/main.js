'use strict';

angular.module('test1App')
    .controller('homeCtrl', function($scope, Data) {
        Data.getMenu('home').then(function(results) {
            $scope.menuItems = results;
        });
    })
    .controller('dashboardCtrl', function($scope, Data) {
        Data.getMenu('dashboard').then(function(results) {
            $scope.menuItems = results;
        });
    })
    .controller('decisionbookCtrl', function($scope, Data) {
        Data.getMenu('decisionbook').then(function(results) {
            $scope.menuItems = results;
        });
    }).controller('MainCtrl', function($scope, dialogs) {
        // stuff
        // var dlg = $dialogs.error('This is my error message');
        var dlg = dialogs.create('/views/modals/login.html', 'customDialogCtrl', {});
        dlg.result.then(function(name) {
            $scope.name = name;
        }, function() {
            $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
    }).controller('customDialogCtrl', function($scope, $modalInstance, data) {
        $scope.user = {
            name: ''
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.save = function() {
            $modalInstance.close($scope.user.name);
        }; // end save

        $scope.hitEnter = function(evt) {
            if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.name, null) || angular.equals($scope.name, ''))) {
                $scope.save();
            }
        }; // end hitEnter
    }) // end whatsYourNameCtrl
.run(['$templateCache',
    function($templateCache) {
        $templateCache.put('/dialogs/custom.html', '<div class="modal-header"><h4 class="modal-title"><span class="glyphicon glyphicon-star"></span> User\'s Name</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="course">Name:</label><input type="text" class="form-control" name="username" id="username" ng-model="user.name" ng-keyup="hitEnter($event)" required><span class="help-block">Enter your full name, first &amp; last.</span></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div>');
    }
]).config(['dialogsProvider',
    function(dialogsProvider) {
        dialogsProvider.useBackdrop('static');
        dialogsProvider.useEscClose(false);
    }
])