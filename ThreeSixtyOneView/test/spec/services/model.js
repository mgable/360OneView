/* global xit, xdescribe */
'use strict';

describe('Service: Model', function () {

  // load the service's module
  beforeEach(module('ThreeSixtyOneView.services', 'ThreeSixtyOneView.config'));

  // instantiate service
  var Model, myModel, data, model, resource;
  beforeEach(inject(function (_Model_) {
    data = {"foo": "bar"};
    Model = _Model_;
    myModel = new Model();
    model = new myModel(data);
    myModel.prototype.data = [data];
  }));

  it('should exist', function () {
    expect(!!Model).toBe(true);
    expect(!!myModel).toBe(true);
  });

  it('should inhierit from the prototype', function(){
    expect(myModel.prototype.get).toBeDefined();
    expect(myModel.prototype.create).toBeDefined();
    expect(myModel.prototype.unwrap).toBeDefined();
    expect(myModel.prototype.translateObj).toBeDefined();
    expect(myModel.prototype.translateRequest).toBeDefined();
    expect(myModel.prototype.translateResponse).toBeDefined();
    expect(myModel.prototype.makeConfig).toBeDefined();
    expect(myModel.prototype.setConfig).toBeDefined();
    expect(myModel.prototype.$futureData).toBe(null);
    expect(myModel.prototype.data).toEqual([data]);
  });

  it ('should extend the service', function(){
    expect(model.foo).toEqual("bar");
  });

  it ('should get data', function(){
    // model.get().then(function(response){
    //   expect(response).toEqual(data);
    // });
  });

});
