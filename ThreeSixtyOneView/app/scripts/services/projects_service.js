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


		this.getProjectIDByTitle = function(_title_){
			var item = _.findWhere(this.data, {title:_title_});
			if (item) {
				return item.id;
			} else {
				console.error("The project named " + _title_ + " was NOT found!");
			}
		};

		this.getProjectTitleById = function(_id_){
			var item = _.findWhere(this.data, {id:_id_});
			if (item) {
				return item.title;
			} else {
				console.error("The project id " + _id_ + " was NOT found!");
			}
		};

		this.getProjectItemById = function(_id_){
			var item = _.findWhere(this.data, {id:_id_});
			if (item) {
				return item;
			} else {
				console.error("The project id " + _id_ + " was NOT found!");
			}
		};

		// this.setProjects = function(_projects_){
		// 	projects = _projects_;
		// };

		this.getProjects = function(){
			//return projects;
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

		$rootScope.$on(EVENTS.createProject, function($event, data){
			self.create(data);
		});
  }]);
