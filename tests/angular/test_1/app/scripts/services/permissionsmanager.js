/* jshint newcap: false */

'use strict';

angular.module('test1App')
    .service('Permissionsmanager', function(Authenticate) {
        this.password = '';
        this.username = '';
        this.loggedIn = false;
        this.errorMsg = 'Username or password is incorrect.';

        this.login = function(username, password) {
            return Authenticate(username, password).then(this.processResults.bind(this));
        };

        this.processResults = function(results) {
            if (results.status === 'ok') {
                this.setUsername(results.username);
                this.setPassword(results.password);
                this.setLogin(true);
            } else {
                this.setLogin(false);
            }
            return this.getLogin();
        };

        this.logout = function() {
            this.loggedIn = false;
        };

        this.setLogin = function(login) {
            this.loggedIn = login;
        };

        this.getLogin = function() {
            return this.loggedIn;
        };

        this.setPassword = function(password) {
            this.password = password;
        };

        this.setUsername = function(username) {
            this.username = username;
        };

        this.getErrorMsg = function() {
            return this.errorMsg;
        };
    });