# gruntextension-subgrunt [![Build Status](https://secure.travis-ci.org/cesarenaldi/gruntextension-subgrunt.png?branch=master)](http://travis-ci.org/cesarenaldi/gruntextension-subgrunt)

Allow you to run a sub grunt build process using your custom Gruntfile configuration. Useful to define complex sub tasks using all the simplicity of grunt and keeping your task dependencies hidden in your task package.

## Getting Started
Install the module with: `npm install git://github.com/cesarenaldi/gruntextension-subgrunt.git`

## Documentation
_(Coming soon)_

## Usage

### Package.json of the shared task

```javascript
{
  "name": "grunt-awesome",
  "description": "My awesome shared build process.",
  "version": "0.1.0",
  "licenses": [
    {
      "type": "MIT",
      "url": "https://github.com/cesarenaldi/grunt-letmerun/blob/master/LICENSE-MIT"
    }
  ],
  "main": "Gruntfile.js",
  "engines": {
    "node": ">= 0.8.0"
  },
  "scripts": {
    "test": "grunt test"
  },
  "devDependencies": {
    // dependencies used when testing the task
  },
  "peerDependencies": {
    "grunt": "~0.4.1"
  },
  "keywords": [
    "gruntplugin"
  ],
  "dependencies": { // dependencies used by the task when used
  	"grunt": "~0.4.1",
  	"grunt-contrib-jshint": "~0.6.0",
  	"grunt-mocha-test": "~0.5.0"
  }
}

```
### Shared Grunfile.js
You can can use other Grunt tasks as you normally do.
You can retrieve configuration from the entry point task using `grunt.option('param')`.
```javascript
'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({})

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task.
  grunt.registerTask('default', ['test'])
};
```

### The shared task entry point
Your task should load the extension and run it.
```javascript

module.exports = function(grunt) {

  var subgrunt = require('gruntextension-subgrunt'),
      path = require('path');

  grunt.registerMultiTask(
    'yourtaskname', 
    'Your awesome shared build process.',
    function () {
      subgrunt.run(grunt, path.join(__dirname, 'path/to/your/shared/Gruntfile.js'));
    }
  )
};
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Cesare Naldi  
Licensed under the MIT license.
