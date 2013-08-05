/*
 * Subgrunt process runner.
 *
 * Copyright (c) 2013 Cesare Naldi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var path = require('path'),

		decorator = require('./grunt-decorator'),

		subgruntPath = grunt.option('subgrunt'),

		params = grunt.option('params'),

		subgrunt,
		callerTaskPackagePath,
		callerTaskPath;

	// check for falsy value here is safe in case of a future grunt api change
	if ( ! subgruntPath ) {
		return grunt.fail.fatal("Missing subgrunt option.")	
	}

	grunt.option('params', JSON.parse( grunt.option('params') ))

	// lookup for the shared task folder
	callerTaskPackagePath = grunt.file.findup('package.json', {
		cwd: path.dirname(subgruntPath),
		nocase: true
	});

	callerTaskPath = path.dirname(callerTaskPackagePath);

	if ( ! (grunt.file.isPathCwd(callerTaskPath) || grunt.file.isPathInCwd(callerTaskPath)) ) {
		console.log(callerTaskPath, process.cwd())
		return grunt.fail.fatal([
				'Unable to locate the shared task package.json manifest.',
				'This can be due to an invalid use of the extension, check the documentation.'
			].join(' '))
	}

	// extend grunt functionalities
	decorator.decorate(grunt, callerTaskPath)

	// load the shared Gruntfile module
	subgrunt = require(subgruntPath);

	// run the shared Gruntfile
	subgrunt(grunt);
};