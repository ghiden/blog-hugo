---
date: 2013-01-20T00:00:00Z
tags:
- javascript
- angularjs
title: testing angularjs
url: /2013/01/20/testing-angularjs/
---

[AngularJS](http://angularjs.org/) is really nice. It shows a totally different approach from Backbone.  
Since I might be involved in a project using Angular, I did some experiment.

Going to the official page, and watching the two screencasts and just read top to bottom of the home page, I was very much interested in AngularJS. Then, I did the whole official tutorial which is very well organized and highly recommended.

Now what? I had to write something using Angular. But something bothered me while I was following the tutorial. It keeps using controllers defined in global namespaces. I'm sure it's intentional not to confuse beginners with nitty-gritty details. After asking Google, I found out that there are two ways to define controllers or so-called angular modules. One is using typical javascript scheme, using app namespace, and the other is using angular.module function.

## Using App namescape, not really

The [step 7](http://docs.angularjs.org/tutorial/step_07) of the official tutorial introduces "App Module" which combines all the necessary components into one app. Since it returns the app module, you can assign it to some variable and use it like the app name space. Technically it is different from just creating an Object and adding attributes like we typically do. As in this case, it is an angular app module. But it does look like the typcial js namespace scheme.

{{< highlight javascript >}}

// app.js
var todoapp = angular.module('todoapp', []);

// controllers.js
todoapp.controller('TodoController', function($scope) {
  $scope.todos = [
    {title: 'test 01', completed: false},
    {title: 'test 02', completed: false},
    {title: 'test 03', completed: false}
  ];
});

{{< / highlight >}}

To test TodoController, you write something like this.

{{< highlight javascript >}}

// controllersSpec.js

describe('TodoController', function(){
  var scope, todoController;

  beforeEach(module('todo'));
  beforeEach(inject(function($controller) {
    scope = {};
    todoController = $controller('TodoController', {$scope: scope});
  }))

  it('should validate the controller to be defined', function() {
    expect(todoController).toBeDefined();
  });

  it('should have todos', function() {
    expect(scope.todos.length).toBe(3);
  })
});

{{< / highlight >}}

## Using angular.module

This is to use 'angular.module' function which is according to the [official doc](http://docs.angularjs.org/api/angular.module), it "is a global place for creating and registering Angular modules."

To define a controller, you do something like this.

{{< highlight javascript >}}

angular.module('todo.controllers', []).controller('TodoController', function($scope) {
  $scope.todos = [
    {title: 'test 01', completed: false},
    {title: 'test 02', completed: false},
    {title: 'test 03', completed: false}
  ];
});

{{< / highlight >}}

Again, to test, you write something like this.

{{< highlight javascript >}}

// controllersSpec.js

describe('TodoController', function(){
  var scope, todoController;

  beforeEach(module('todoapp.controllers'));
  beforeEach(inject(function($controller) {
    scope = {};
    todoController = $controller('TodoController', {$scope: scope});
  }))

  it('should validate the controller to be defined', function() {
    expect(todoController).toBeDefined();
  });

  it('should have todos', function() {
    expect(scope.todos.length).toBe(3);
  })
});

{{< / highlight >}}

One good thing about this approach is that when you start writing your code, you don't have to have app.js that previously initialized 'var todoapp = ...'  
And, when you are ready to write your app.js, you write your app.js with necessary dependencies.

{{< highlight javascript >}}

// app.js
angular.module('todoapp', ['todoapp.controllers', 'todoapp.services']);

{{< / highlight >}}

I like the latter way of defining angular modules as it does not force you to have the app module.  

