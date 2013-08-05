'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  	copy: {
  		test: {
  			files: [
  				{expand: true, cwd: 'test/fixtures/', src: 'dummy.txt', dest: '.tmp/'}
  			]
  		}
  	}
  })

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-copy')

  // Default task.
  grunt.registerTask('default', ['copy'])

};
