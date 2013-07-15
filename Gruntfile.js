'use strict';

module.exports = function(grunt) {

	var chai = require('chai')
	,   sinonChai = require('sinon-chai')
	,	path = require('path');

	chai.use(sinonChai)

	// Project configuration.
	grunt.initConfig({
		nodeunit: {
			files: ['test/**/*_test.js'],
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib: {
				src: ['lib/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib', 'nodeunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'nodeunit']
			},
		},
		mochaTest: {
			options: {
				reporter: 'spec'
			},
			test: {
				src: [
					'test/{,**/}*-test.js'
				]
			}
		},
		testme: {
			options: {
				def1: 'def1',
				def2: 'def2' 
			},
			target: {
				options: {
					def1: 'overridden'
				}
			}
		}
	})

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-mocha-test')
	grunt.loadNpmTasks('grunt-contrib-jshint')
	grunt.loadNpmTasks('grunt-contrib-watch')


	grunt.registerMultiTask('testme', 'description', function() {
		var subgrunt = require('./lib/gruntextension-subgrunt')
		subgrunt.run(grunt, path.join(__dirname, 'test/fixtures/subGruntfile.js'), this.async())

	})

	// Default task.
	grunt.registerTask('test', ['mochaTest'])
	grunt.registerTask('default', ['test'])

};