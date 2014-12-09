/* global _ */

'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('ProjectsService',  ["$rootScope", "ProjectsModel", "Model", "EVENTS", function ($rootScope, ProjectsModel, Model, EVENTS) {
		var MyProjectModel, myprojects, self = this;

		MyProjectModel = new Model();
        angular.extend(this, MyProjectModel.prototype);
        myprojects = new MyProjectModel(ProjectsModel);
        angular.extend(this, myprojects);

        this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getProjectItemById = function(_id_){
			if (this.data.length === 0){
				return this.get().then(function(data){
					self.data = data;
					return self.getProjectItemById(_id_);
				});
				
			}
			var item = _.findWhere(this.data, {id:_id_});
			if (item) {
				return item;
			} else {
				console.info("The project id " + _id_ + " was NOT found!");
			}
		};

		this.getProjects = function(){
			return this.data;
		};

		this.rename = function(data){
            var obj = (_.pick(data, 'title', 'description', 'id'));
            if (typeof obj.description === "undefined"){
                obj.description = "";
            }
            this.put(obj);
        };

		$rootScope.$on(EVENTS.renameProject, function($event, data){
			self.rename(data);
		});

  }]);
