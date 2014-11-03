// spec.js
describe('angularjs homepage', function() {
  it('should have a title', function() {
    browser.get('http://127.0.0.1:9001/#/projects');

    expect(browser.getTitle()).toEqual('360 One View');
  });
});