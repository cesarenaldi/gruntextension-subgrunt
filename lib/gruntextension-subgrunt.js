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
 * @param  {String} gruntfilePath Path to the sub Gruntfile
 * @param  {Object|Function} params optional Override automatic parameters|the Callback to  be called when the task sub-process ends
 * @param  {Function} done optional the Callback to  be called when the task sub-process ends
 */
exports.run = function(gruntfilePath /* [, params, done] */) {

	var path = require('path'),
		grunt = require('grunt'),
		task = grunt.task.current,
		options = task.options(),
		target = task.target,

		args, runner, done, params;

	// arguments shifting
	switch(arguments.length) {
		case 3:
			done = arguments[2];
			params = arguments[1];
			break;
		case 2:
			if (typeof arguments[1] === 'function') {
				done = arguments[1];
				params = {};
			} else {
				params = arguments[1];
				done = task.async();	
			}
			break;
		case 1:
			params = {};
			done = task.async();
			break;
	}

	args = [
		'--gruntfile', path.join(path.relative(process.cwd(), __dirname), 'runner.js'),
		'--base', process.cwd(),
        '--target', target,
		'--subgrunt=' + gruntfilePath,
		'--params=' + JSON.stringify({
			options: options,
			filesSrc: task.filesSrc || [],
			args: task.args || []
		})
	];

	grunt.verbose.writeln(['Execution folder:', process.cwd()].join(' '))

	runner = grunt.util.spawn({
		grunt: true,
		args: args
	}, done);

	runner.stdout.pipe(process.stdout, { end: false })
	runner.stderr.pipe(process.stderr, { end: false })
};
