# gruntextension-subgrunt [![Build Status](https://secure.travis-ci.org/cesarenaldi/gruntextension-subgrunt.png?branch=master)](http://travis-ci.org/cesarenaldi/gruntextension-subgrunt)

Allow you to run a sub grunt build process using your custom Gruntfile configuration. Useful to define complex sub tasks using all the simplicity of grunt, keeping your tasks dependencies hidden in your tasks.

## Getting Started
Install the module with: `npm install gruntextension-subgrunt`

```javascript

module.exports = function(grunt) {

  var subgrunt = require('gruntextension-subgrunt'),
      path = require('path');

  grunt.registerMultiTask('youttaskname', 'Your awesome shared build process.', function () {
    subgrunt.run(grunt, path.join(__dirname, 'path/to/your/shared/Gruntfile.js'));
  })
};
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Cesare Naldi  
Licensed under the MIT license.
