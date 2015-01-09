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
			get: function(params, additionalPath) {
				this.unwrap(this.resource.get(params, this.config, additionalPath));
				return this.$futureData;
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
			/*
			Translate a collection by passing in a reference object
			- any attributes not in the reference object will not be in the output object
			translateObj({“id”: ”uuid”}, {uuid: 12345, description: "foobar"} ) returns {id: 12345}
			translateObj({“id”: ”uuid”, "description": description}, {uuid: 12345, description: "foobar"} ) returns {id: 12345, description: "foobar"}
			translateObj({auditInfo: { createdBy: { name: “fred}}}, {“createdBy” : ”auditInfo.createdBy.name"}) returns {createdBy :” fred”}
			translateObj({createdBy: ”fred”}, {“auditInfo.createdBy.name” : ”createdBy"}) returns {auditInfo: { createdBy: { name: “fred}}}	
			*/
			translateObj: function(data, translator){
				var result = {}, self = this,
					t; // attribute value
				_.each(translator, function(k,v){
					// k is what you get
					// v is what you want
					if(v.indexOf(".") > -1 && data[k]){
						_.extend(result, self.makeObjs(v, data[k]));
					}else{
						t = data[k];
						if (typeof t !== "undefined") {
							result[v] = t;
						} else if (typeof k === "string" && k.indexOf(".") > -1){
							try{
								/* jshint ignore:start */
								result[v] = eval("data." + k);
								/* jshint ignore:end */
							} catch(e){
								console.info (k + " does not exist");
							}
						}
					}
				});
				return result;
			},
			/*
			Make an object from a string and assign it a value
			makeObjs("a.b.c", "foobar") returns {a: {b: {c: "foobar"}}}
			*/
			makeObjs: function(stingObj, _value_){
				var objectPattern = stingObj,
					value = _value_,
					newObj,
					list = [];

				objectPattern.replace(/(\w+)/g, function (objectName) {
				  list.push(objectName);
				});

				list.reverse();

				newObj = _.reduce(list, function (memo, v) {
				  var obj = {};
				  obj[v] = memo;
				  return obj;
				}, value);

				return newObj;
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