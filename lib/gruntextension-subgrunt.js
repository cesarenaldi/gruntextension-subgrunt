/*
 * gruntextension-subgrunt
 * https://github.com/cesarenaldi/gruntextension-subgrunt
 *
 * Copyright (c) 2013 Cesare Naldi
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Run the specified grunt file passing all the task parameters.
 * @param  {Object} grunt Grunt instance from the main build process
 * @param  {String} gruntfilePath Path to the sub Gruntfile
 * @param  {Function} done Callback, it will be called when the task sub process ends
 */
exports.run = function(grunt, gruntfilePath, done) {

	var path = require('path')
	,	task = grunt.task.current
	,	options = task.options()
	,	target = task.target
	,	args = task.args

	,	args = [
			'--subgrunt=' + gruntfilePath
		,	'--params=' + JSON.stringify({
				options: options
			,	filesSrc: task.filesSrc
			})
		]

	,	runner;

	runner = grunt.util.spawn({
		grunt: true
	,	args: [
			'--gruntfile', path.join(__dirname, 'runner.js')
		,	'--base', process.cwd()
		].concat(args)
	}, task.async());

	runner.stdout.pipe(process.stdout, { end: false })
	runner.stderr.pipe(process.stderr, { end: false })
};
