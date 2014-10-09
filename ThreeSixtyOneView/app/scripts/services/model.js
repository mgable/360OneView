/* global _ */
/* jshint unused:false */
"use strict";

angular.module("ThreeSixtyOneView.services")
	.service("Model", ["$timeout", "dialogs", function($timeout, dialogs) {
		var Model = function(model) {
			this.model = model;
		};

		Model.prototype = {
			get: function (data){
				return this.model.get(data);
			},
			find: function (){
				return this.model.find();
			},
			create: function (data){
				return this.model.create(data);
			},
			translateObj: function(data, translator){
				var result = {}, t;
				_.each(translator, function(k,v,o){
					t = data[k];
					if (typeof t !== "undefined") {
						result[v] = t;
					} else if (_.isObject(k)){
						try{
							/* jshint ignore:start */
							result[v] = eval("data" + k.selector);
							/* jshint ignore:end */
						} catch(e){
							console.info (k.selector + " does not exist");
						}
					}
				});
				return result;
			},
			translateRequest: function(request, requestTranslator){
				if (request && requestTranslator) {
					return JSON.stringify(this.translateObj(request, requestTranslator));
				}
				return JSON.stringify(request);
			},
			translateResponse: function (response, responseTranslator){
				var results, data;
				
				try {
					data = JSON.parse(response);
				}
				catch(e){
					console.error ("no data received or data will not parse to json");
					dialogs.error("No data received!!!", "Either the server is down or the response is not JSON.");
					return;
				}

				if (_.isArray(data)){
					results = [];
					_.each(data, function(e,i,a){
						results.push(this.translateObj(e, responseTranslator));
					}, this);
				} else if (_.isObject(data)){
					return this.translateObj(data, responseTranslator);
				}

				return results;
			},
			makeConfig: function(which, responseTranslator, requestTranslator){
				return {
					transformResponse: function(data){ return {data: which.translateResponse(data, responseTranslator)}; },
					transformRequest: function(data){ return which.translateRequest(data, requestTranslator);}
				};
			}
		};

		return function(type){
			return new Model(type)
		};
	}]);