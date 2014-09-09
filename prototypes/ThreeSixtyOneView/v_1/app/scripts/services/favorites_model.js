/* global angular, _ */
    'use strict';

    angular.module('ThreeSixtyOneView.services').service('FavoritesModel', ["$timeout", "$rootScope", "Resource", "CONFIG", "SERVER", function($timeout, $rootScope, Resource, CONFIG, SERVER){
        var resource = new Resource(SERVER.remote + CONFIG.application.api.favorites),
        // translator = CONFIG.application.models.ProjectsModel.translator, 
        data, futureData,
        config = {},
        unwrap = function(futureData) {
            var self = this;
            this.$futureData = futureData;
            this.$futureData.then(function(data) {
                $timeout(function() {
                    _.extend(self, data);
                });
            });

        };
        // // used for the rename functions
        // put = function(data){
        //     resource.put(data, config).then(function(response){
        //         var item = _.indexOf(self.data, _.findWhere(self.data, {id: response.data.id}));
        //         self.data.splice(item, 1, response.data)
        //         $timeout(function(){
        //              $rootScope.$broadcast("ProjectsModel:dataChange", {
        //                 data: self.data
        //             });
        //         })
        //     })
        // },
        // self = this;

        this.find = function(id) {
            unwrap.call(this, resource.get(id, config))
        };

        this.get = function() {
            return this.$futureData;
        };

        this.setAsFavorite = function(id) {
            resource.post({'uuid': id}, config).then(function(response){
                console.info(response)
            })
        };

        // this.create = function(data) {
        //     resource.create(data, config).then(function(response) {
        //         $timeout(function() {
        //             self.data.push(response.data);
        //             $rootScope.$broadcast("ProjectsModel:dataChange", {
        //                 data: self.data
        //             });
        //         });
        //     });
        // };

        // this.rename = function(data){
        //     var obj = (_.pick(data, 'name', 'description'));
        //     obj.uuid = data.id;
        //     put.call(this, obj);
        // }
    }]);
