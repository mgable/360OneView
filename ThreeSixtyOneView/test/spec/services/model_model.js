/* global _, which, responseTranslator, requestTranslator  */
/* jshint unused:false */

'use strict';

describe('Service: Model Model', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView.services'));

  // instantiate service
  var ModelModel, $rootScope, $q, $timeout, dialogs, data, translator, result, customMatchers = {
        toMatch : function(util, customEquilityTesters){
            return {
                compare: function (actual, expected){
                    var result = {};
                    result.pass = true;
                    _.each(actual, function(v,k,o){
                      if(k in expected){
                        if(v.toString() !== expected[k].toString()){
                          result.pass = false;
                        }
                      } else {
                        result.pass = false;
                      }
                    });

                    if (result.pass){
                        result.message = 'Expected \'' + angular.mock.dump(actual) + '\' not equal';
                    } else {
                        result.message = 'Expected \'' + angular.mock.dump(actual) + '\' is equal';
                    }
                    return result;
                }
            };
        }
    };

  beforeEach(function(){
      jasmine.addMatchers(customMatchers);
  });

  beforeEach(inject(function (_$rootScope_, _ModelModel_, _dialogs_, _$q_, _$timeout_) {
    ModelModel = _ModelModel_;
    $q = _$q_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
    dialogs = _dialogs_;
    data ={"uuid": "12345", "name": "foo", "description": "foobarfixx", "unneeded": "foobar", "auditInfo": {"createdBy": {"name": "bar"}}};
    translator = {"id": "uuid", "title": "name", "description": "description", "createdBy": {"selector":"['auditInfo']['createdBy']['name']"},};
    result = {"id": "12345", "title": "foo", "description": "foobarfixx", "createdBy": "bar"};
  }));

  it('should de defined', function () {
    expect(ModelModel).toBeDefined();
  });

  it('should define a API', function(){
    expect(ModelModel.translateObj).toBeDefined();
    expect(ModelModel.translateRequest).toBeDefined();
    expect(ModelModel.translateResponse).toBeDefined();
    expect(ModelModel.makeConfig).toBeDefined();
    expect(ModelModel.unwrap).toBeDefined();
  });

  it('should translate objects correctly', function(){
    expect(ModelModel.translateObj(data, translator)).toEqual(result);
  });

  it('should translate requests', function(){
    expect(ModelModel.translateRequest(data, translator)).toEqual(JSON.stringify(result));
    expect(ModelModel.translateRequest(data)).toBe(data);
  });

  it('should translate response', function(){
    var spy = spyOn(dialogs, "error");
    ModelModel.translateResponse("foo-to-you", translator);
    expect(spy).toHaveBeenCalled();
    expect(ModelModel.translateResponse(JSON.stringify(data), translator)).toEqual(result);
  });

  it('should make the config object', function(){
    expect(ModelModel.makeConfig(ModelModel, translator, translator)).toMatch({
        transformResponse: function(data){ return {data: which.translateResponse(data, responseTranslator)}; },
        transformRequest: function(data){ return which.translateRequest(data, requestTranslator);}
      });
  });

  it('should unwrap future data', function(){
    var deferred = $q.defer();
    deferred.resolve(data);
    ModelModel.unwrap(deferred.promise);
    $timeout.flush();
    expect(ModelModel.data).toEqual(data);
  });
});