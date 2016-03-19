---
date: 2013-01-14T00:00:00Z
tags:
- javascript
- backbone
title: Backbone 0.9.9's validation behavior
url: /2013/01/14/backbone-099s-validation-behavior/
---

Just as a follow-up to the Backbone.js testing articles, I was adding a few tests and surprised that it started to fail.  

First, I added some more default values, such as 'completed' field should start with false and timestamp needs to be 0 as its initial value.

{{< highlight javascript >}}
it("should have a default title, completed, and timestamp", function() {
  var t = new Todo()
  expect(t.get('title')).toEqual("");
  expect(t.get('completed')).toEqual(false);
  expect(t.get('timestamp')).toEqual(jasmine.any(Number));
});
{{< / highlight >}}

By adding a couple more defalut values passes the test of course.

{{< highlight javascript >}}
var todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false,
    timestamp: 0
  }
});
{{< / highlight >}}

Then I moved on to validation: title should not be empty when you save. I suppose it's quite a natural flow, isn't it? I create a Jasmine Spy object and set it as error callback for this todo instance. And, when I save, I check if the spy opbject has been called or not and the error message was received ok or not.

{{< highlight javascript >}}
describe('validation', function() {
  it('should not save with empty title', function() {
    var errorSpy = jasmine.createSpy('error_event'),
        t = new Todo();

    // think of this as a stub for returning 'url' for models
    t.collection = {url: '/collection'}

    t.on('error', errorSpy);

    t.save({title: ''});

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mostRecentCall.args[1]).toEqual('cannot have an empty title');
  });
});
{{< / highlight >}}

Of course it fails as we don't have any validation yet. So I added the following code to Todo model.  

{{< highlight javascript >}}
validate: function(attrs) {
  if(!attrs.title) {
    return 'cannot have an empty title';
  }
}
{{< / highlight >}}

Voila! Strange things happen.

    Expected undefined to equal ''.
    ...
    Expected undefined to equal false.
    ...
    Expected undefined to equal <jasmine.any(function Number() { [native code] })>.
    ...

I spent a couple hours testing and googling and then I found this issue with 0.9.9 release of Backbone.  
<https://github.com/documentcloud/backbone/issues/1961>

From 0.9.9, the behavior of validation changed. Model is validated when instantiated too. It does not allow any 'invalid' state to be instantiated. So the above code does not pass with 0.9.9.  

To get it passed, you need to go with either 0.9.2 or head. 

If you just use 0.9.2, it works as expected.  
If you want to go with the head version of Backbone, you have to change a bit.  Event is called 'invalid' not 'error', so when you set the callback, it needs to set it for 'invalid' event.

{{< highlight javascript >}}
describe('validation', function() {
  it('should not save with empty title', function() {
    ...
    // HEAD version
    t.on('invalid', errorSpy);
    ...
  });
});
{{< / highlight >}}

Now, you can keep on testing hopefully.  
<https://github.com/ghiden/backbone-requirejs-jasmine-testem-setup/tree/blog2>
