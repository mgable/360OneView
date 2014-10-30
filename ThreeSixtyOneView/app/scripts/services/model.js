/* global _ */
/* jshint unused:false */
"use strict";

angular.module("ThreeSixtyOneView.services")
	.service("Model", ["$timeout", "$rootScope", "EVENTS", function($timeout, $rootScope, EVENTS) {
		var Model = function(model) {
			angular.extend(this, model);
		};

		Model.prototype = {
			$futureData: null,
			data: [],
			get: function() {
				return this.data.length ?  this.data : this.$futureData;
			},
			find: function(id) {
				this.unwrap(this.resource.get(id, this.config));
			},
			create: function (data){
				console.info ("The create method has not been overwritten");
			},
			unwrap: function(futureData) {
				var self = this, data;
				self.data = [];
				this.$futureData = futureData;
				this.$futureData.then(function(_data_) {
					data = Array.prototype.slice.call(_data_);
					$timeout(function() {
						_.extend(self.data, data);
					});
				});
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
			isValid: function(_data_){
				var data = $rootScope.$eval(_data_);
				// is zero length string
				if (angular.isString(data) && data.length === 0){
					return false;
				// is zero length array
				} else if (angular.isArray(data) && data.length  === 0){
					return false;
				// is empty object
				} else if(angular.isObject(data) && Object.keys(data).length  === 0) {
					return false;
				} else {
					return true;
				}
			},
			translateResponse: function (response, responseTranslator){
				var results, data;
				// if (!this.isValid(response)){
				// 	$rootScope.$broadcast(EVENTS.noDataReceived, {msg:"no data received"});
				// 	return false;
				// } else {
					try {
						data = JSON.parse(response);
					}
					catch(e){
						$rootScope.$broadcast(EVENTS.noDataReceived, {msg:"data will not parse to json"});
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
				//}
			},
			makeConfig: function(which, responseTranslator, requestTranslator){
				return {
					transformResponse: function(data){ return which.translateResponse(data, responseTranslator); },
					transformRequest: function(data){ return which.translateRequest(data, requestTranslator);}
				};
			},
			setConfig: function(_config_){
				this.config = _config_;
			}
		};

		return function(){
			return Model;
		};
	}]);