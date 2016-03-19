---
date: 2013-06-09T00:00:00Z
tags:
- javascript
title: Backbone, RequireJS, Jasmine, PhantomJS, Bower, and Grunt 4.1
url: /2013/06/09/backbone-requirejs-jasmine-phantomjs-and-grunt-41/
---

When I wrote [Backbone, RequireSS, Jasmine, PhhntomJS, and Grunt](http://hdnrnzk.me/2013/01/10/backbone-requirejs-jasmine-phantomjs-and-grunt), Grunt was still version 3. But with introduction of version 4 series, they changed a lot. So, I'm updating my post with the grunt version 4 series. And, since many people are using [Bower](http://bower.io/) these days, I'll use bower for managing JS packages.  

## Installing Grunt-cli and Bower

To start using the latest grunt, you have to install grunt-cli. We also need Bower, so let's install these two.

    npm install -g grunt-cli bower

## Setting up directories

    mkdir -p app/js/models test/spec/models test/lib

## Installing JS Packages with Bower

We need jquery, underscore, backbone, requirejs, and jasmine. We can write a bower.json file to specify all these but since I don't care too much about versions, let's just install via command line. But before doing that, I need to specify where to install packages. Create a file called .bowerrc and write the following:

{{< highlight javascript >}}
{
    "directory": "app/components"
}
{{< / highlight >}}

Now, we can install each libraries through bower.

    bower install jquery --save
    bower install underscore --save
    bower install backbone --save
    bower install requirejs --save
    bower install jasmine --save

After that, you should have a bower.json file with the following content:  

{{< highlight javascript >}}

{
  "name": "backbone-blog",
  "version": "0.0.0",
  "dependencies": {
    "backbone": "~1.0.0",
    "jasmine": "~1.3.1",
    "requirejs": "~2.1.6",
    "underscore": "~1.4.4",
    "jquery": "~2.0.2"
  },
  "ignore": [
    "**/.*",
    "node_modules",
    "components"
  ]
}

{{< / highlight >}}

## Setting up Jasmine

Grab run-jasmine.js. This script loads a page and parses the results from Jasmine.

    curl https://raw.github.com/ariya/phantomjs/master/examples/run-jasmine.js -o test/lib/run-jasmine.js

Here is index.html loading Jasmine and RequireJS files.

{{< highlight html >}}

<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Jasmine Spec Runner</title>
  <link rel="stylesheet" href="../app/components/jasmine/lib/jasmine-core/jasmine.css">
</head>
<body>
  <div id="sandbox" style="overflow:hidden; height:1px;"></div>
  <script src="../app/components/jasmine/lib/jasmine-core/jasmine.js"></script>
  <script src="../app/components/jasmine/lib/jasmine-core/jasmine-html.js"></script>
  <script src="../app/components/requirejs/require.js" data-main="SpecRunner"></script>
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
    jquery: '../components/jquery/jquery.min',
    underscore: '../components/underscore/underscore-min',
    backbone: '../components/backbone/backbone-min',
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
index.js lists the spec files.  

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

Now, add package.json to the root for installing grunt packages. It's a bit different from my previous entries. Now it has grunt-contrib-connect for setting up a static server and grunt-contrib-watch for watching file changes.

{{< highlight javascript >}}
{
  "name": "todo-phantomjs-grunt-exec",
  "version": "0.0.1",
  "private": true,
  "dependencies": { },
  "devDependencies": {
    "grunt": "0.4.1",
    "grunt-exec": "0.4.1",
    "grunt-contrib-connect": "0.3.0",
    "grunt-contrib-watch": "0.4.4"
  }
}
{{< / highlight >}}

Install these packages as usual.

    npm install

Let's create Gruntfile.js to configure our test setting. In the grunt version 3, it was called grunt.js but now it is renamed to Gruntfile.js.

{{< highlight javascript >}}

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      test: {
        port: 8000,
        middleware: function(connect) {
          return [
            mountFolder(connect, 'app')
          ];
        }
      }
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
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['connect:test', 'exec', 'watch']);

}
{{< / highlight >}}

To check everything is in place properly, let's run it.

    $ grunt

It should run the jasmine task but it fails and waits for file changes.  

## Writing the First Test

Let's write a test.
Todo model should have a title with default being empty string.  
test/spec/models/todo_spec.js

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

Add this file to index.js.

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
Let's add it: app/js/models/todo.js

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

The Gruntfile.js that I created is really primitive. You probably want to add more stuff such as minification, livereload, copy, clean, build, and so on. But I'm saving that for my next post probably.

Here is the sample code that I compiled for this blog post: <https://github.com/ghiden/backbone-requirejs-jasmine-phantomjs-bower-grunt-setup>
