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
		clean: ['.tmp'],
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
				tasks: ['jshint:lib', 'mochaTest:unit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['mochaTest:unit']
			},
		},
		mochaTest: {
			options: {
				reporter: 'spec'
			},
			unit: {
				src: [
					'test/{,**/}*-test.js'
				]
			},
			integration: {
				src:[
					'test/integration.js'
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
	grunt.loadNpmTasks('grunt-contrib-clean')


	grunt.registerMultiTask('testme', 'description', function() {
		var subgrunt = require('./lib/gruntextension-subgrunt');
		subgrunt.run(path.join(__dirname, 'test/fixtures/subGruntfile.js'), this.async())
	})

	// Default task.
	grunt.registerTask('test', ['clean', /*'jshint',*/ 'mochaTest:unit', 'testme', 'mochaTest:integration'])
	grunt.registerTask('default', ['test'])

};