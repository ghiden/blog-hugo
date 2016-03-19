---
date: 2013-01-09T00:00:00Z
tags:
- javascript
- backbone
- requirejs
- jasmine
title: Backbone, RequireJS, Jasmine, and Testem
url: /2013/01/09/backbone-jasmine-requirejs-and-testem/
---

Lately I've been playing with [Backbone.js](http://backbonejs.org) a lot. I use [RequireJS]() to manage dependencies and optimizing the file size. For JS stuff, I was never a big fan of testing because I was too lazy. But, as you build bigger and bigger apps, you start to feel that you need to test them. As for testing javascript, popular ones are [Jasmine](http://pivotal.github.com/jasmine/), [QUnit](http://qunitjs.com/), and [Mocha](http://visionmedia.github.com/mocha/). For this blog post, I will use Jasmine and explain how to setup and get started.

Just running Jasmine specs from browser every time you change your code is quite tedious. Then, you need something that reloads page as you change code or spec files. [Testem](https://github.com/airportyh/testem) is a very good tool that does it for you. There is a nice introduction at [Tutsplus](http://net.tutsplus.com/tutorials/javascript-ajax/make-javascript-testing-fun-with-testem/).

I want to write a Todo app as always. And, I want to do it in BDD way.

First, let's create two directories: app and test.
'app' holds the application and 'test' of course contains test stuff.
Inside 'app', create a structure like this with required library files:

    app/
      js/
        lib/
          backbone-min.js
          jquery.min.js
          require.js
          underscore-min.js

Under 'test' directory, you have this with Jasmine files:

    test/
      lib/
        jasmine-html.js
        jasmine.css
        jasmine.js
      spec/
      index.html
      SpecRunner.js

Here is index.html

{{< highlight html >}}

<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Jasmine Spec Runner</title>
  <link rel="stylesheet" href="/test/lib/jasmine.css">
</head>
<body>
  <div id="sandbox" style="overflow:hidden; height:1px;"></div>
  <script src="/test/lib/jasmine.js"></script>
  <script src="/test/lib/jasmine-html.js"></script>
  <script src="/testem.js"></script>
  <script src="/app/js/lib/require.js" data-main="/test/SpecRunner"></script>
</body>
</html>

{{< / highlight >}}

We don't have testem.js but it'll come after we install testem.  
RequireJS picks up /test/SpecRunner as the first file to load as data-main specifies.  

SpecRunner.js has two parts: RequireJS configuration and starting Jasmine.
Here is the config part of SpecRunner.js:

{{< highlight javascript >}}

require.config({
  baseUrl: "/app/js",
  urlArgs: 'cb=' + Math.random(),
  paths: {
    jquery: 'lib/jquery.min',
    underscore: 'lib/underscore-min',
    backbone: 'lib/backbone-min',
    spec: '../../test/spec'
  },
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});

{{< / highlight >}}

'baseUrl' sets the application root for JavaScript files.  
'urlArgs' is attached as cache buster.  
'paths' is specifying actual location of files or directories relative to 'baseUrl'. In this case, we specify the locations of jquery, underscore, and backbone. And, we also set 'spec' directory.  
'shim' is where you specify none-AMD library for managing dependencies and global exports. As backbone depends on underscore and jquery, they are listed as deps.  

Here is the Jasmine part of SpecRunner.js:

{{< highlight javascript >}}

require(['jquery'], function($) {
  var jasmineEnv = jasmine.getEnv(),
      htmlReporter = new jasmine.HtmlReporter(),
      specs = [];
        
  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  $(function() {
    require(specs, function() {
      jasmineEnv.execute();
    });
  });
});

{{< / highlight >}}

Pretty much typical jasmine setup, except the last part loading spec files. The array 'specs' which holds the names of spec files are loaded by RequireJS. Currently it has no files to read in.  

Now, you need to install Testem. Suppose you have npm installed onto your machine. Install it globally is the easiest.

    $ npm install -g testem

Now, you need to configure testem. Usually you don't need to configure much but since I want to run it with RequireJS, I want to use my own test index.html. Here is testem.yml for configuring testem:

    test_page: test/index.html

It is just one line simply specifying the html file for Jasmine.  
Now, you can start testing with testem.

    $ testem

Go to the URL from your browser.
You probably see TEST'EM 'SCRIPTS! on the lower right corner on the page.  
As we have no specs yet, it doesn't show any Jasmine output yet. But right after you access the page, the shell prints out that what browser you use and shows a message: "No tests were run :(".

Let's write a test.
Todo model should have a title with default being empty string.
First, I will create a directory 'models' under 'test/spec' and create a file called todo_spec.js.

{{< highlight javascript >}}
define(['models/todo'], function(Todo) {
  describe("Todo Model", function() {
    it("should have a default empty string title", function() {
      var t = new Todo()
      expect(t.get('title')).toBe("");
    })
  });
});
{{< / highlight >}}

And, add this file name to SpecRunner.

{{< highlight javascript >}}
  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  specs.push("spec/model/todo_spec");

  $(function() {
    require(specs, function() {
      jasmineEnv.execute();
    });
  });
{{< / highlight >}}

As you don't have a Todo model yet, it gives an error from RequireJS. It cannot load the Todo model.
Let's add the model. Create 'models' directory under 'app/js/' and create todo.js.

{{< highlight javascript >}}

define(['backbone'], function(Backbone) {
  var todo = Backbone.Model.extend({});
  return todo;
});

{{< / highlight >}}

Now, you see Jasmine output both on console and the browser.
And adding a default title to the model should pass the test.

{{< highlight javascript >}}
define(['backbone'], function(Backbone) {
  var todo = Backbone.Model.extend({
    defaluts: {
      title: ""
    }
  });
  return todo;
});
{{< / highlight >}}

Without reloading, right after you save this file, testem picks it up and reload the test.  
From here, you can add more specs and Backbone models, collections, and views.

Thanks to the authors of these two articles, this post is heavily influenced by them:  
[Testing Backbone + RequireJS Applications with Jasmine](http://kilon.org/blog/2012/08/testing-backbone-requirejs-applications-with-jasmine/) by Uzi Kilon.  
[Setting Up a Jasmine Unit Testing Environment with Testem](http://www.joezimjs.com/javascript/setting-up-a-jasmine-unit-testing-environment-with-testem/) by Joe Zim.

Reposity of this sample code:
<https://github.com/ghiden/backbone-requirejs-jasmine-testem-setup/tree/blog1>


