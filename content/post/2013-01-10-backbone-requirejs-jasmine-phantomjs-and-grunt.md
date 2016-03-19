---
date: 2013-01-10T00:00:00Z
tags:
- javascript
- backbone
- requirejs
title: Backbone, RequireJS, Jasmine, PhantomJS, and Grunt
url: /2013/01/10/backbone-requirejs-jasmine-phantomjs-and-grunt/
---

Following the [yesterday's post](http://hdnrnzk.me/2013/01/09/backbone-jasmine-requirejs-and-testem). This time, using [PhantomJS](http://phantomjs.org/) and [Grunt](http://gruntjs.com/).  
Testem does pick up PhantomJS and can run against it. But, maybe some people just want to use Grunt because they use Grunt for something else such as for making a build.  

## Setting up directories

First, let's create two directories: app and test.
'app' holds the application and 'test' of course contains test stuff.
Inside 'app' directory, create a structure like this with required library files:

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
        run-jasmine.js     // from PhantomJS example
      spec/
        index.js
      index.html
      SpecRunner.js

run-jasmine.js, you can grab it from here at PhantomJS repo.  
<https://github.com/ariya/phantomjs/blob/master/examples/run-jasmine.js>  
This script loads a page and parses the results from Jasmine.

Here is index.html loading Jasmine and RequireJS files.

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
  <script src="/app/js/lib/require.js" data-main="/test/SpecRunner"></script>
</body>
</html>

{{< / highlight >}}

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

require(['jquery', 'spec/index'], function($, index) {
  var jasmineEnv = jasmine.getEnv(),
      htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  $(function() {
    require(index.specs, function() {
      jasmineEnv.execute();
    });
  });
});

{{< / highlight >}}

Two dependencies, jQuery and spec/index.js.  
index.js lists the spec files. It doesn't have to be externalized. I included spec files in SpecRunner in the previous post, but for a change, I separated it into a different file.  

This is index.js just returning an array of spec files.

{{< highlight javascript >}}

define(function() {
  return {
    specs: [
      // list spec files here
    ]
  };
});

{{< / highlight >}}

## Setting up Grunt

Now, add package.json to the root for installing grunt packages.

{{< highlight javascript >}}

{
  "name": "todo-phantomjs-grunt-exec",
  "version": "0.0.1",
  "private": true,
  "dependencies": { },
  "devDependencies": {
    "grunt": "0.3.17",
    "grunt-exec": "0.2.1"
  }
}

{{< / highlight >}}

We install grunt and grunt-exec packages. [Grunt-exec](https://github.com/jharding/grunt-exec) is one of the simplest tasks. All it does is it executes shell commands. 

    $ npm install

Let's create grunt.js to configure our test setting.

{{< highlight javascript >}}

module.exports = function(grunt) {
  grunt.initConfig({
    server: {
      port: 8000,
      base: '.'
    },

    watch: {
      files: ['test/spec/**/*.js', 'app/js/**/*.js', 'test/SpecRunner.js'],
      tasks: 'exec'
    },

    exec: {
      jasmine: {
        command: 'phantomjs test/lib/run-jasmine.js http://localhost:8000/test',
        stdout: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', 'server exec watch');

}

{{< / highlight >}}

'server' section is obvious, it sets up static http server that comes with grunt, hosted at port 8000 and pointing to the root.  
'watch' section specifies what files to monitor, and 'tasks' specifies what action to follow. In our case, 'exec' command will follow.  
'exec' section specifies what command to issue. It runs phantomjs with run-jasmine.js and loading the test/index.html.
Next is loading 'grunt-exec' task and registering a default task which starts server, runs exec once, and starts watching files.

To check everything is in place properly, let's run it.

    $ grunt

It should run the jasmine task but it fails and waits for file changes.  

## Writing the first test

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

And, add this file name to index.js.

{{< highlight javascript >}}

define(function() {
  return {
    specs: [
      "spec/models/todo_spec"
    ]
  };
});

{{< / highlight >}}

As you don't have a Todo model yet, it still gives an error. It cannot load the Todo model yet.
Let's add it. Create 'models' directory under 'app/js/' and create todo.js.

{{< highlight javascript >}}

define(['backbone'], function(Backbone) {
  var todo = Backbone.Model.extend({});
  return todo;
});

{{< / highlight >}}

Now, you see a failing Jasmine output. And, adding a default title to the model should pass the test.

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

From here, you can add more specs and Backbone models, collections, and views.

Thanks to Uzi Kilon for writing this article, this post is heavily influenced by this:  
[Running Jasmine Tests With PhantomJS](http://kilon.org/blog/2013/01/running-jasmine-tests-with-phantomjs/).

Reposity of this sample code:
<https://github.com/ghiden/backbone-requirejs-jasmine-phantomjs-grunt-setup>

