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
 * @param  {Object|Function} params optional Override automatic parameters|the Callback to  be called when the task sub-process ends
 * @param  {Function} done optional the Callback to  be called when the task sub-process ends
 */
exports.run = function(grunt, gruntfilePath /* [, params, done] */) {

	var path = require('path'),
		task = grunt.task.current,
		options = task.options(),
		target = task.target,

		args, runner, done, params;

	// arguments shifting
	switch(arguments.length) {
		case 4:
			done = arguments[3];
			params = arguments[2];
			break;
		case 3:
			if (typeof arguments[2] === 'function') {
				done = arguments[2];
				params = {};
			} else {
				params = arguments[2];
				done = task.async();	
			}
			break;
		case 2:
			params = {};
			done = task.async();
			break;
	}

	args = [
		'--gruntfile', path.join(path.relative(process.cwd(), __dirname), 'runner.js'),
		'--base', process.cwd(),
		'--subgrunt=' + gruntfilePath,
		'--params=' + JSON.stringify({
			options: options,
			filesSrc: task.filesSrc || [],
			args: task.args || []
		})
	];

	runner = grunt.util.spawn({
		grunt: true,
		args: args
	}, done);

	runner.stdout.pipe(process.stdout, { end: false })
	runner.stderr.pipe(process.stderr, { end: false })
};
