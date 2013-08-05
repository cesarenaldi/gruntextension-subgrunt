/*
 * Grunt decorator.
 *
 * Copyright (c) 2013 Cesare Naldi
 * Licensed under the MIT license.
 */

'use strict';

var meld = require('meld'),
	path = require('path');

function buildLoadNpmTasksAdvice(callerTaskPath) {
	return function(jp) {
		var depName = jp.args[0], 
			module, modulePath;

		module = this.file.findup(path.join('node_modules', depName), {
			cwd: callerTaskPath,
			nocase: true
		});

		if ( module === null ) {
			return this.fail.fatal('Local Npm module "' + module + '" not found. Is it installed?')
		}

		modulePath = path.join(module, 'tasks');

		this.loadTasks(modulePath)
	}
}

exports.decorate = function (grunt, callerTaskPath) {
	var remover;

	if (grunt.loadNpmTasks.remove) {
		return grunt;
	}

	remover = meld.around(grunt, 'loadNpmTasks', buildLoadNpmTasksAdvice(callerTaskPath));
	grunt.loadNpmTasks.remove = remover.remove;

	return grunt
};