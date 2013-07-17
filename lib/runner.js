/*
 * Subgrunt process runner.
 *
 * Copyright (c) 2013 Cesare Naldi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var path = require('path'),

		decorator = require('grunt-decorator'),

		// project directory
		context = process.cwd(),

		subgruntPath = grunt.option('subgrunt'),

		params = grunt.option('params'),

		subgrunt;

	// check for falsy value here is safe in case of a future grunt api change
	if ( ! subgruntPath ) {
		return grunt.fail.fatal("Missing subgrunt option.")	
	}

	grunt.option('params', JSON.parse( grunt.option('params') ))
	
	// load the shared Gruntfile module
	subgrunt = require(subgruntPath)

	// change the current working directory to the shared Gruntfile dir
	grunt.file.setBase(path.dirname(subgruntPath))

	// extend grunt functionalities
	decorator.decorate(grunt, subgruntPath)

	// run the shared Gruntfile
	subgrunt(grunt);
};